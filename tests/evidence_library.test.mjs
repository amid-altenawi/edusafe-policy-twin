import test from "node:test";
import assert from "node:assert/strict";
import { EVIDENCE, lookupPolicyEvidence } from "../agent/lib/evidence_library.ts";

test("all curated sources have a publisher, URL, section and limitations", () => {
  assert.equal(EVIDENCE.length, 6);
  for (const row of EVIDENCE) {
    assert.ok(row.title && row.issuer && row.section && row.limits);
    assert.ok(row.url.startsWith("https://"));
    assert.ok(row.verifiedOn === "2026-11-04");
  }
});

test("machinery guard sources are distinct from ITU network architecture", () => {
  const guards = lookupPolicyEvidence("cnc_guard_safety").records;
  assert.ok(guards.some((row) => row.id === "ISO-14120-2015"));
  assert.ok(!guards.some((row) => row.id.startsWith("ITU-T-")));
  const architecture = lookupPolicyEvidence("itu_architecture").records;
  assert.equal(architecture.length, 1);
  assert.ok(architecture[0].limits.includes("NOT a CNC/robotics safety standard"));
});
