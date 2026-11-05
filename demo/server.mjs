/**
 * EduSafe Policy Twin — local browser demo API.
 * The API delegates to the existing deterministic simulator and curated
 * evidence library. No machinery, sensors, accounts, or internet are used.
 *
 * Requires Node.js >=24 with built-in TypeScript type stripping.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

import { EVENT_TYPES, simulateCncLab } from "../agent/lib/simulate_cnc_lab.ts";
import { EVIDENCE } from "../agent/lib/evidence_library.ts";
import { POLICY_TOPICS, queryUaePolicyKnowledgeBase, assessUaePolicyGaps } from "../agent/lib/uae_policy_kb.ts";
import { evaluateDecisionRoom, validateDecisionInput } from "../agent/lib/decision_room.mjs";

const htmlPath = fileURLToPath(new URL("./index.html", import.meta.url));
const decisionRoomHtmlPath = fileURLToPath(new URL("./decision-room.html", import.meta.url));
const eventTypeSet = new Set(EVENT_TYPES);

export const DEFAULT_EVENTS = Object.freeze([
  "ai_suggests_guard_override",
  "student_requests_machine_start",
  "supervisor_pauses_session",
  "guard_is_inspected",
  "safety_briefing_completed",
]);

export const EARLY_ESCALATION_EVENTS = Object.freeze(DEFAULT_EVENTS.slice(0, 2));

const relevantTopics = new Set([
  "cnc_guard_safety",
  "machinery_risk_assessment",
  "ai_risk_governance",
  "human_oversight",
  "ai_in_education",
]);

const sources = EVIDENCE.filter((source) => source.topics.some((topic) => relevantTopics.has(topic)));

function sendJson(response, code, payload) {
  response.writeHead(code, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(JSON.stringify(payload));
}

function validEvents(events) {
  return Array.isArray(events) && events.length >= 1 && events.length <= 12 &&
    events.every((event) => typeof event === "string" && eventTypeSet.has(event));
}

function buildScenario(events) {
  const scenario = simulateCncLab(events);
  return {
    scenario,
    policyKnowledgeBase: queryUaePolicyKnowledgeBase(),
    policyGapAnalysis: assessUaePolicyGaps(scenario),
    evidence: sources,
    evidenceMode: "Curated metadata snapshot; not live legal or standards retrieval",
    reviewedOn: "2026-11-04",
    unverified: [
      "Full licensed ISO clauses and their applicability to a specific laboratory",
      "UAE and institution-specific binding legal or safety requirements",
      "Physical guard state, supervisory qualifications, and actual machine safety",
    ],
  };
}

async function parseJsonBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk.toString("utf8");
    if (body.length > 8192) throw new Error("Request body too large.");
  }
  try {
    return JSON.parse(body);
  } catch {
    throw new Error("Invalid JSON body.");
  }
}

export function createEduSafeServer() {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://localhost");
      if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html" || url.pathname === "/decision-room.html")) {
        const html = await readFile(url.pathname === "/decision-room.html" ? decisionRoomHtmlPath : htmlPath);
        response.writeHead(200, {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
          "content-security-policy": "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'",
        });
        response.end(html);
        return;
      }

      if (request.method === "GET" && url.pathname === "/api/scenario") {
        sendJson(response, 200, buildScenario(DEFAULT_EVENTS));
        return;
      }

      if (request.method === "GET" && url.pathname === "/api/policies") {
        const topic = url.searchParams.get("topic") || undefined;
        const text = url.searchParams.get("q") || "";
        if ((topic && !POLICY_TOPICS.includes(topic)) || text.length > 200) {
          sendJson(response, 400, { error: "Unsupported topic or query too long." });
          return;
        }
        sendJson(response, 200, queryUaePolicyKnowledgeBase({ topic, text }));
        return;
      }

      if (request.method === "GET" && url.pathname === "/api/decision-room") {
        sendJson(response, 200, evaluateDecisionRoom({ events: DEFAULT_EVENTS }));
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/decision-room") {
        const payload = await parseJsonBody(request);
        try {
          sendJson(response, 200, evaluateDecisionRoom(validateDecisionInput(payload)));
        } catch (error) {
          sendJson(response, 400, { error: error.message, supportedEvents: EVENT_TYPES });
        }
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/scenario") {
        const payload = await parseJsonBody(request);
        if (!validEvents(payload?.events)) {
          sendJson(response, 400, {
            error: "events must contain between 1 and 12 supported SIMULATED event types.",
            supportedEvents: EVENT_TYPES,
          });
          return;
        }
        sendJson(response, 200, buildScenario(payload.events));
        return;
      }

      sendJson(response, 404, { error: "Not found." });
    } catch (error) {
      const badRequest = error?.message === "Invalid JSON body." || error?.message === "Request body too large.";
      sendJson(response, badRequest ? 400 : 500, {
        error: badRequest ? error.message : "Unable to prepare the simulated incident.",
      });
    }
  });
}

// When imported by tests, do not start a listener.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.EDUSAFE_DEMO_PORT || 4173);
  const server = createEduSafeServer();
  server.listen(port, "127.0.0.1", () => {
    process.stdout.write(`EduSafe Policy Twin demo: http://127.0.0.1:${port}\n`);
    process.stdout.write("SIMULATED ONLY — no machine or live sources connected.\n");
  });
}
