import assert from "node:assert/strict";
import { test } from "node:test";
import { Script } from "node:vm";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import {
  analyzeEvidenceFirst, retrieveGroundedEvidence, validateEvidenceRequest,
  validateModelProposal, ACTION_CODES, getLiveAiStatus,
} from "../agent/lib/evidence_first.mjs";
import { createEduSafeServer } from "../demo/server.mjs";

const dangerous = "A fictional AI tutor recommends bypassing a protective guard. A student requests machine start.";

test("free-text review retrieves only classified metadata, not invented law excerpts", async () => {
  const result = await analyzeEvidenceFirst({ text: dangerous });
  assert.ok(result.evidence.length > 1);
  assert.ok(result.evidence.every((record) => record.summaryType === "CURATOR_PARAPHRASE_NOT_OFFICIAL_QUOTE"));
  assert.ok(result.evidence.every((record) => record.url.startsWith("https://") && record.verificationLimit));
  assert.equal(result.retrievalMode, "OFFLINE_METADATA_NOT_VECTOR_RETRIEVAL");
  assert.equal(result.adjudication.authorizedToOperate, false);
  assert.equal(result.deterministicRecommendation, "STOP_AND_ESCALATE");
});

test("unknown and benign guarded scenarios abstain instead of inventing citations", async () => {
  const unrelated = await analyzeEvidenceFirst({ text: "A fictional gardener waters flowers beside a small blue bench." });
  assert.deepEqual(unrelated.evidence, []);
  assert.equal(unrelated.deterministicRecommendation, "ABSTAIN");
  const benign = retrieveGroundedEvidence("A fictional teacher inspects a protective guard after lessons.");
  assert.ok(!benign.issueCodes.includes("UNSAFE_GUARD_ADVICE"));
});

test("Arabic incident cues are mapped to bounded sources", () => {
  const result = retrieveGroundedEvidence("في المختبر اقترح الذكاء الاصطناعي تجاوز حاجز الحماية وطلب طالب تشغيل الآلة.");
  assert.ok(result.issueCodes.includes("UNSAFE_GUARD_ADVICE"));
  assert.ok(result.issueCodes.includes("START_REQUEST"));
  assert.ok(result.records.every((record) => record.id));
});

test("reported live Ollama wording detects bypassing guard and the start request", () => {
  const text = "A fictional CNC tutoring AI suggests bypassing a protective guard. A student asks to start the machine before a supervisor reviews the advice.";
  const grounded = retrieveGroundedEvidence(text);
  assert.deepEqual(grounded.issueCodes, ["UNSAFE_GUARD_ADVICE", "START_REQUEST"]);
  assert.ok(grounded.records.some((record) => record.matchedIssueCodes.includes("UNSAFE_GUARD_ADVICE")));
  assert.ok(grounded.records.some((record) => record.matchedIssueCodes.includes("START_REQUEST")));
});

test("guard override variations are detected without making ordinary inspection unsafe", () => {
  for (const text of [
    "The fictional AI advised that the CNC operator bypassed a protective guard.",
    "A fictional AI tutor recommends disabling the safety interlock.",
    "A simulated assistant suggested the machine guard was removed.",
    "The lab assistant was told to override the safety interlock.",
  ]) {
    assert.ok(retrieveGroundedEvidence(text).issueCodes.includes("UNSAFE_GUARD_ADVICE"), text);
  }
  assert.ok(!retrieveGroundedEvidence("A fictional teacher inspected the protective guards after a lesson.").issueCodes.includes("UNSAFE_GUARD_ADVICE"));
});

test("model validator rejects unsupported authorization and fabricated citations", () => {
  const sources = retrieveGroundedEvidence(dangerous).records;
  const issues = ["UNSAFE_GUARD_ADVICE", "START_REQUEST"];
  assert.equal(validateModelProposal({ action_code: "APPROVE_RESTART", issue_codes: issues, source_ids: [sources[0].id] }, sources, issues).reason, "UNSUPPORTED_ACTION");
  assert.equal(validateModelProposal({ action_code: "STOP_AND_ESCALATE", issue_codes: issues, source_ids: ["FAKE-LEGAL-CLAUSE"] }, sources, issues).reason, "UNVERIFIED_CITATION");
  assert.equal(validateModelProposal({ action_code: "RECORD_AND_REVIEW", issue_codes: issues, source_ids: [sources[0].id] }, sources, issues).reason, "UNDER_ESCALATION");
});

test("model cannot insert ungrounded issues or support an issue with an unrelated retrieved source", () => {
  const records = retrieveGroundedEvidence(dangerous).records;
  const groundedIssues = ["UNSAFE_GUARD_ADVICE", "START_REQUEST"];
  const fabricatedFinding = validateModelProposal({
    action_code: "STOP_AND_ESCALATE",
    issue_codes: [...groundedIssues, "PERSONAL_DATA_SCOPE"],
    source_ids: ["NIST-AI-RMF-1"],
  }, records, groundedIssues);
  assert.equal(fabricatedFinding.reason, "ISSUE_NOT_GROUNDED");

  const guardOnlySource = records.find((record) => record.matchedIssueCodes.includes("UNSAFE_GUARD_ADVICE") && !record.matchedIssueCodes.includes("START_REQUEST"));
  assert.ok(guardOnlySource);
  const orphanCitation = validateModelProposal({
    action_code: "STOP_AND_ESCALATE",
    issue_codes: groundedIssues,
    source_ids: [guardOnlySource.id],
  }, records, groundedIssues);
  assert.equal(orphanCitation.reason, "ISSUE_WITHOUT_MATCHED_SOURCE");
});

test("live model status labels local endpoints as local rather than external", () => {
  const keys = ["EDUSAFE_ENABLE_LIVE_AI", "EDUSAFE_LLM_ENDPOINT", "EDUSAFE_LLM_MODEL", "EDUSAFE_LLM_API_KEY"];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    process.env.EDUSAFE_ENABLE_LIVE_AI = "1";
    process.env.EDUSAFE_LLM_ENDPOINT = "http://127.0.0.1:11434/v1/chat/completions";
    process.env.EDUSAFE_LLM_MODEL = "qwen3:0.6b";
    process.env.EDUSAFE_LLM_API_KEY = "dummy";
    assert.deepEqual(getLiveAiStatus(), { configured: true, providerMode: "OPT_IN_LOCAL_MODEL", personalDataAllowed: false });
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});

test("valid simulated model output can be accepted but still cannot authorize a machine", async () => {
  let calls = 0;
  const result = await analyzeEvidenceFirst({ text: dangerous, mode: "live" }, {
    liveConfigured: true,
    modelCall: async ({ evidence }) => {
      calls++;
      return { action_code: "STOP_AND_ESCALATE", issue_codes: ["UNSAFE_GUARD_ADVICE", "START_REQUEST"], source_ids: [evidence[0].id] };
    },
  });
  assert.equal(calls, 1);
  assert.equal(result.aiReview.status, "MODEL_OUTPUT_VERIFIED");
  assert.equal(result.adjudication.authorizedToOperate, false);
});

test("misleading live-model proposal is rejected even if output is JSON", async () => {
  const result = await analyzeEvidenceFirst({ text: dangerous, mode: "live" }, {
    liveConfigured: true,
    modelCall: async () => ({ action_code: "ABSTAIN", issue_codes: [], source_ids: [] }),
  });
  assert.equal(result.aiReview.status, "MODEL_OUTPUT_REJECTED");
  assert.equal(result.aiReview.reason, "UNDER_ESCALATION");
  assert.equal(result.adjudication.authorizedToOperate, false);
});

test("missing external model configuration gives a disclosed offline fallback", async () => {
  const result = await analyzeEvidenceFirst({ text: dangerous, mode: "live" }, {
    liveConfigured: false,
    modelCall: async () => { throw new Error("Should never reach provider"); },
  });
  assert.equal(result.aiReview.status, "UNAVAILABLE_NOT_CONFIGURED");
  assert.equal(result.adjudication.authorizedToOperate, false);
});

test("optional real-model transport is exercised against a LOCAL MOCK provider only", async () => {
  let requests = 0;
  const provider = createServer(async (request, response) => {
    requests++;
    assert.equal(request.method, "POST");
    assert.equal(request.headers.authorization, "Bearer DUMMY_TEST_KEY");
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    assert.ok(body.messages[0].content.includes("NO machine-start authority"));
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify({
      action_code: "STOP_AND_ESCALATE",
      issue_codes: ["UNSAFE_GUARD_ADVICE", "START_REQUEST"],
      source_ids: ["NIST-AI-RMF-1"],
    }) } }] }));
  });
  await new Promise((resolve) => provider.listen(0, "127.0.0.1", resolve));
  const keys = ["EDUSAFE_ENABLE_LIVE_AI", "EDUSAFE_LLM_ENDPOINT", "EDUSAFE_LLM_MODEL", "EDUSAFE_LLM_API_KEY"];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    process.env.EDUSAFE_ENABLE_LIVE_AI = "1";
    process.env.EDUSAFE_LLM_ENDPOINT = `http://127.0.0.1:${provider.address().port}/v1/chat/completions`;
    process.env.EDUSAFE_LLM_MODEL = "mock-model-do-not-claim-live";
    process.env.EDUSAFE_LLM_API_KEY = "DUMMY_TEST_KEY";
    const result = await analyzeEvidenceFirst({ text: dangerous, mode: "live" });
    assert.equal(result.aiReview.status, "MODEL_OUTPUT_VERIFIED");
    assert.equal(result.adjudication.authorizedToOperate, false);
    assert.equal(requests, 1);
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
    await new Promise((resolve) => provider.close(resolve));
  }
});

test("unsupported scenario never calls live model", async () => {
  let calls = 0;
  const result = await analyzeEvidenceFirst({ text: "A fictional gardener waters flowers on a gentle summer evening.", mode: "live" }, {
    liveConfigured: true,
    modelCall: async () => { calls++; return {}; },
  });
  assert.equal(calls, 0);
  assert.equal(result.aiReview.status, "ABSTAIN_NO_EVIDENCE");
});

test("realistic contact identifiers and oversize input are rejected before any model call", () => {
  assert.throws(() => validateEvidenceRequest({ text: "Teacher email name@example.org in a fictional laboratory." }), /fictional data only/);
  assert.throws(() => validateEvidenceRequest({ text: "Dial +963 981 626 874 for classroom details." }), /fictional data only/);
  assert.throws(() => validateEvidenceRequest({ text: "x".repeat(1501) }), /12–1500/);
  assert.throws(() => validateEvidenceRequest({ text: dangerous, mode: "automatic" }), /offline or live/);
  assert.deepEqual(ACTION_CODES, ["STOP_AND_ESCALATE", "RECORD_AND_REVIEW", "ABSTAIN"]);
});

test("Stage 6 UI scripts have valid syntax and no third-party assets", async () => {
  const html = await readFile(new URL("../demo/evidence-lab.html", import.meta.url), "utf8");
  assert.match(html, /EVIDENCE-FIRST LAB/);
  assert.doesNotMatch(html, /<script\s+src=|<link[^>]+href=["']https?:/i);
  const match = html.match(/<script>([\s\S]+?)<\/script>/);
  assert.ok(match);
  assert.doesNotThrow(() => new Script(match[1]));
});

test("Stage 6 API serves evidence, rejects invalid inputs, and never exposes the repo", async () => {
  const server = createEduSafeServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const ui = await fetch(base + "/evidence-lab.html");
    assert.equal(ui.status, 200);
    const status = await fetch(base + "/api/evidence-lab/status");
    assert.equal(status.status, 200);
    const modelStatus = await status.json();
    assert.equal(typeof modelStatus.configured, "boolean");
    const review = await fetch(base + "/api/evidence-lab", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: dangerous, mode: "offline" }) });
    assert.equal(review.status, 200);
    assert.equal((await review.json()).adjudication.authorizedToOperate, false);
    const invalid = await fetch(base + "/api/evidence-lab", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: "short" }) });
    assert.equal(invalid.status, 400);
    const source = await fetch(base + "/agent/lib/evidence_first.mjs");
    assert.equal(source.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
