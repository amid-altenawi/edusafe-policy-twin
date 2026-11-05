import test from "node:test";
import assert from "node:assert/strict";
import { simulateCncLab } from "../agent/lib/simulate_cnc_lab.ts";

test("five simulated events show escalation and mitigation without machine control", () => {
  const result = simulateCncLab([
    "ai_suggests_guard_override",
    "student_requests_machine_start",
    "supervisor_pauses_session",
    "guard_is_inspected",
    "safety_briefing_completed",
  ]);
  assert.deepEqual(result.timeline.map((event) => event.risk), [
    "HIGH", "CRITICAL", "MEDIUM", "MEDIUM", "LOW",
  ]);
  assert.equal(result.incidentState.automaticMachineControlPerformed, false);
  assert.equal(result.incidentState.approvedToResume, false);
  assert.equal(result.requiresHumanApproval, true);
  assert.equal(result.sourceEvidence.length, 0);
});

test("does not invent a verified source", () => {
  const result = simulateCncLab(["ai_suggests_guard_override"]);
  assert.equal(result.evidenceGap,
    "No verified evidence is available in the current knowledge base.");
});
