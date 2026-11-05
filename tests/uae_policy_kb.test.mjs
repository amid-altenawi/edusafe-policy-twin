import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { UAE_POLICY_KB, queryUaePolicyKnowledgeBase, assessUaePolicyGaps } from "../agent/lib/uae_policy_kb.ts";
import { simulateCncLab } from "../agent/lib/simulate_cnc_lab.ts";
import { createEduSafeServer } from "../demo/server.mjs";

test("KB records have distinct official source URLs, verified sections and jurisdiction limitations", () => {
  assert.equal(UAE_POLICY_KB.length, 8);
  assert.equal(new Set(UAE_POLICY_KB.map((source) => source.id)).size, 8);
  for (const source of UAE_POLICY_KB) {
    assert.equal(new URL(source.url).protocol, "https:");
    assert.ok(source.verifiedSection.length > 15);
    assert.ok(source.applicationNote.length > 30);
    assert.ok(source.verificationLimit.length > 25);
    assert.equal(source.checkedOn, "2026-11-05");
  }
});

test("binding federal law remains distinguishable from policies and voluntary guidance", () => {
  const laws = UAE_POLICY_KB.filter((source) => source.category === "uae_federal_law");
  assert.deepEqual(laws.map((source) => source.id), ["UAE-PDPL-45-2021"]);
  assert.match(laws[0].applicationNote, /IF real/);
  const nist = UAE_POLICY_KB.find((source) => source.id === "NIST-AI-RMF-1");
  assert.equal(nist.category, "voluntary_risk_framework");
});

test("topic and keyword retrieval return only dated matching records, without fabricated citation", () => {
  const oversight = queryUaePolicyKnowledgeBase({ topic: "ai_oversight" });
  assert.ok(oversight.matches.length > 1);
  assert.ok(oversight.matches.every((source) => source.topics.includes("ai_oversight")));
  const data = queryUaePolicyKnowledgeBase({ topic: "student_data_privacy", text: "personal data" });
  assert.deepEqual(data.matches.map((source) => source.id), ["UAE-PDPL-45-2021"]);
  const missing = queryUaePolicyKnowledgeBase({ text: "unobtanium" });
  assert.equal(missing.matches.length, 0);
  assert.equal(missing.evidenceStatus, "no_verified_match");
  assert.match(oversight.mode, /NOT vector/);
});

test("policy gap assessment forbids machine authorization in both full and interrupted incidents", () => {
  for (const sequence of [
    ["ai_suggests_guard_override", "student_requests_machine_start"],
    ["ai_suggests_guard_override", "student_requests_machine_start", "supervisor_pauses_session", "guard_is_inspected", "safety_briefing_completed"],
  ]) {
    const assessment = assessUaePolicyGaps(simulateCncLab(sequence));
    assert.equal(assessment.approvedToOperate, false);
    assert.equal(assessment.gaps.length, 3);
    assert.ok(assessment.gaps.every((gap) => gap.evidenceIds.length >= 2));
    assert.match(assessment.assessmentType, /NOT a legal finding/);
  }
});

let server, base;
before(async () => {
  server = createEduSafeServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("demo exposes policy records with explicit law classification and policy gaps", async () => {
  const response = await fetch(`${base}/api/scenario`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.policyKnowledgeBase.totalRecords, 8);
  assert.equal(body.policyGapAnalysis.approvedToOperate, false);
  assert.ok(body.policyGapAnalysis.gaps.some((gap) => gap.id === "GAP-03"));
});

test("policy query API restricts topics and never exposes arbitrary local files", async () => {
  const ok = await fetch(`${base}/api/policies?topic=student_data_privacy&q=personal%20data`);
  assert.equal(ok.status, 200);
  assert.deepEqual((await ok.json()).matches.map((record) => record.id), ["UAE-PDPL-45-2021"]);
  const bad = await fetch(`${base}/api/policies?topic=../../etc/passwd`);
  assert.equal(bad.status, 400);
  const hidden = await fetch(`${base}/agent/lib/uae_policy_kb.ts`);
  assert.equal(hidden.status, 404);
});
