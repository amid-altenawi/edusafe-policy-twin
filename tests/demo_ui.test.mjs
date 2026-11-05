import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createEduSafeServer, DEFAULT_EVENTS } from "../demo/server.mjs";

let server;
let base;

before(async () => {
  server = createEduSafeServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("browser UI is served without external assets", async () => {
  const response = await fetch(base);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /EduSafe Policy Twin/);
  assert.match(html, /SIMULATED/);
  assert.doesNotMatch(html, /<script\s+src=["']https?:/i);
});

test("API uses existing simulator and returns five-risk escalation timeline", async () => {
  const response = await fetch(`${base}/api/scenario`);
  assert.equal(response.status, 200);
  const { scenario, evidence, evidenceMode, unverified } = await response.json();
  assert.deepEqual(scenario.timeline.map((entry) => entry.event), DEFAULT_EVENTS);
  assert.deepEqual(scenario.timeline.map((entry) => entry.risk), ["HIGH", "CRITICAL", "MEDIUM", "MEDIUM", "LOW"]);
  assert.equal(scenario.incidentState.automaticMachineControlPerformed, false);
  assert.equal(scenario.incidentState.approvedToResume, false);
  assert.ok(evidence.length >= 4);
  assert.match(evidenceMode, /not live/);
  assert.ok(unverified.some((item) => item.includes("UAE")));
});

test("early interruption absence preserves critical risk", async () => {
  const response = await fetch(`${base}/api/scenario`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ events: DEFAULT_EVENTS.slice(0, 2) }),
  });
  assert.equal(response.status, 200);
  const { scenario } = await response.json();
  assert.equal(scenario.latestRisk, "CRITICAL");
  assert.equal(scenario.incidentState.trainingSessionPaused, false);
  assert.equal(scenario.incidentState.approvedToResume, false);
});

test("rejects unsupported events without invoking machinery", async () => {
  const response = await fetch(`${base}/api/scenario`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ events: ["turn_on_real_machine"] }),
  });
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.match(body.error, /SIMULATED/);
});

test("does not expose local project files over HTTP", async () => {
  const response = await fetch(`${base}/agent/lib/simulate_cnc_lab.ts`);
  assert.equal(response.status, 404);
});
