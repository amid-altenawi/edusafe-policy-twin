import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import {
  DEFAULT_INCIDENT, compareInterventions, createAuditChain, evaluateDecisionRoom,
  verifyAuditChain, ROLE_IDS,
} from "../agent/lib/decision_room.mjs";
import { UAE_POLICY_KB } from "../agent/lib/uae_policy_kb.ts";
import { createEduSafeServer } from "../demo/server.mjs";

const index = new Map(UAE_POLICY_KB.map((record) => [record.id, record]));

test("four role-scoped reviewers have mandates and publisher-grounded source limitations", () => {
  const output = evaluateDecisionRoom({ events: DEFAULT_INCIDENT });
  assert.deepEqual(output.roleReviews.map((role) => role.id), ROLE_IDS);
  assert.equal(output.provenance.validCitationsOnly, true);
  for (const role of output.roleReviews) {
    assert.ok(role.mandate.length > 20);
    assert.ok(role.decisionBasis.length >= 2);
    for (const citation of role.references) {
      const source = index.get(citation.id);
      assert.ok(source);
      assert.equal(citation.url, source.url);
      assert.equal(citation.category, source.category);
      assert.equal(citation.verificationLimit, source.verificationLimit);
    }
  }
  assert.match(output.label, /RULE-DRIVEN/);
});

test("no personal-data scenario must not assert conditional PDPL as applicable", () => {
  const synthetic = evaluateDecisionRoom({ events: DEFAULT_INCIDENT, personalData: false });
  const privacy = synthetic.roleReviews.find((role) => role.id === "data_protection");
  assert.equal(privacy.verdict, "NO_PERSONAL_DATA_IN_SIMULATION");
  assert.deepEqual(privacy.references, []);
  const hypothetical = evaluateDecisionRoom({ events: DEFAULT_INCIDENT, personalData: true });
  const hypotheticalPrivacy = hypothetical.roleReviews.find((role) => role.id === "data_protection");
  assert.equal(hypotheticalPrivacy.verdict, "SCOPE_CHECK_REQUIRED");
  assert.ok(hypotheticalPrivacy.references.some((source) => source.id === "UAE-PDPL-45-2021"));
  assert.equal(hypothetical.adjudication.approvedToOperate, false);
});

test("counterfactual human intervention prevents CRITICAL ordinal state only if pause occurs early", () => {
  const { branches } = compareInterventions();
  assert.deepEqual(branches.map((branch) => branch.id), [
    "no_pause", "pause_after_start_request", "pause_before_start_request",
  ]);
  assert.deepEqual(branches[0].riskPath, ["HIGH", "CRITICAL"]);
  assert.deepEqual(branches[1].riskPath, ["HIGH", "CRITICAL", "MEDIUM", "MEDIUM", "LOW"]);
  assert.deepEqual(branches[2].riskPath, ["HIGH", "MEDIUM", "MEDIUM", "MEDIUM", "LOW"]);
  assert.equal(branches[2].criticalEventCount, 0);
  assert.equal(branches[1].criticalEventCount, 1);
  assert.ok(branches.every((branch) => branch.actualOperationApproved === false));
});

test("new review layer detects deceptive out-of-order evidence despite legacy LOW risk", () => {
  const eventTrap = [
    "supervisor_pauses_session", "guard_is_inspected", "safety_briefing_completed",
    "ai_suggests_guard_override", "student_requests_machine_start",
  ];
  const r = evaluateDecisionRoom({ events: eventTrap });
  assert.equal(r.simulatedIncident.latestRisk, "LOW");
  assert.equal(r.temporalValidation.validOrder, false);
  assert.ok(r.temporalValidation.anomalies.some((issue) => issue.code === "INSPECTION_OUT_OF_SEQUENCE"));
  assert.equal(r.adjudication.conservativeReviewRisk, "CRITICAL");
  assert.equal(r.adjudication.approvedToOperate, false);
});

test("new unsafe event after briefing reopens review even if old state looks LOW", () => {
  const r = evaluateDecisionRoom({ events: [...DEFAULT_INCIDENT, "ai_suggests_guard_override"] });
  assert.equal(r.simulatedIncident.latestRisk, "LOW");
  assert.ok(r.temporalValidation.anomalies.some((issue) => issue.code === "NEW_HAZARD_AFTER_BRIEFING"));
  assert.equal(r.adjudication.conservativeReviewRisk, "CRITICAL");
});

test("a fabricated AI restart claim is detected, rejected and never treated as a mandate", () => {
  const r = evaluateDecisionRoom({ events: DEFAULT_INCIDENT, externalAdvice: "claims_restart_authorized" });
  assert.equal(r.adjudication.conflictingAdviceDetected, true);
  assert.equal(r.adjudication.conservativeReviewRisk, "CRITICAL");
  assert.equal(r.adjudication.approvedToOperate, false);
});

test("hash-linked audit chain detects changed events, risks and root digest", () => {
  const r = evaluateDecisionRoom({ events: DEFAULT_INCIDENT });
  assert.equal(r.auditVerified, true);
  assert.equal(r.auditChain.entries.length, 5);
  assert.match(r.auditChain.rootHash, /^[a-f0-9]{64}$/);
  const tampered = structuredClone(r.auditChain);
  tampered.entries[1].event = "guard_is_inspected";
  assert.equal(verifyAuditChain(tampered), false);
  const badRoot = structuredClone(r.auditChain);
  badRoot.rootHash = "a".repeat(64);
  assert.equal(verifyAuditChain(badRoot), false);
  assert.equal(verifyAuditChain(createAuditChain(r.simulatedIncident.timeline)), true);
});

test("exhaustive 5! event-order permutations never grant machine approval", () => {
  let count = 0, invalid = 0;
  const visit = (prefix, remaining) => {
    if (!remaining.length) {
      const x = evaluateDecisionRoom({ events: prefix });
      assert.equal(x.adjudication.approvedToOperate, false);
      assert.equal(x.simulatedIncident.incidentState.approvedToResume, false);
      assert.equal(x.auditVerified, true);
      if (!x.temporalValidation.validOrder) invalid++;
      count++;
      return;
    }
    for (let i=0;i<remaining.length;i++) visit([...prefix,remaining[i]], [...remaining.slice(0,i),...remaining.slice(i+1)]);
  };
  visit([], [...DEFAULT_INCIDENT]);
  assert.equal(count, 120);
  assert.ok(invalid >= 100, `Expected most permutations invalid; found ${invalid}`);
});

test("unsupported events and malformed context fail closed", () => {
  for (const input of [
    { events: ["start_real_machine"] },
    { events: [] },
    { events: DEFAULT_INCIDENT, externalAdvice: "permit_start" },
    { events: DEFAULT_INCIDENT, personalData: "no" },
  ]) assert.throws(() => evaluateDecisionRoom(input), TypeError);
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

test("decision room is local and served without third-party scripts", async () => {
  const response = await fetch(`${base}/decision-room.html`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Decision Room/);
  assert.match(html, /human adjudication/i);
  assert.doesNotMatch(html, /<script[^>]+src=["']https?:/i);
});

test("decision room API returns full review, conservative risk and chain", async () => {
  const response = await fetch(`${base}/api/decision-room`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.roleReviews.length, 4);
  assert.equal(data.adjudication.approvedToOperate, false);
  assert.equal(data.auditVerified, true);
});

test("POST decision room can inject a policy-overreach scenario with proper 400 validation", async () => {
  const response = await fetch(`${base}/api/decision-room`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ events: DEFAULT_INCIDENT, externalAdvice: "claims_restart_authorized" }),
  });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.adjudication.conflictingAdviceDetected, true);
  const bad = await fetch(`${base}/api/decision-room`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ events: ["../../secret"] }),
  });
  assert.equal(bad.status, 400);
  assert.equal((await bad.json()).supportedEvents.length, 5);
});

test("no local source code is exposed through the new HTTP endpoint", async () => {
  assert.equal((await fetch(`${base}/agent/lib/decision_room.mjs`)).status, 404);
});
