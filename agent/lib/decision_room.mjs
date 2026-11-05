/**
 * Stage 5 / Decision Room: auditable, deterministic policy-role simulation.
 * These are independent RULE-BASED REVIEWERS, not trained or hosted LLM agents.
 * All events are fictional. NO live machine controls or legal findings.
 */
import { createHash } from "node:crypto";
import { EVENT_TYPES, simulateCncLab } from "./simulate_cnc_lab.ts";
import { UAE_POLICY_KB } from "./uae_policy_kb.ts";

const SUPPORTED = new Set(EVENT_TYPES);
const RISK_SCORE = Object.freeze({ LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 });
const LOOKUP = new Map(UAE_POLICY_KB.map((record) => [record.id, record]));
export const DECISION_ROOM_VERSION = "5.0.0-research";

export const DEFAULT_INCIDENT = Object.freeze([
  "ai_suggests_guard_override",
  "student_requests_machine_start",
  "supervisor_pauses_session",
  "guard_is_inspected",
  "safety_briefing_completed",
]);

export const ROLE_IDS = Object.freeze([
  "laboratory_safety", "ai_governance", "data_protection", "standards_liaison",
]);

export function validateDecisionInput(input) {
  const events = input?.events;
  if (!Array.isArray(events) || events.length < 1 || events.length > 12 ||
      events.some((event) => typeof event !== "string" || !SUPPORTED.has(event))) {
    throw new TypeError("Provide 1–12 supported SIMULATED events.");
  }
  if (input.personalData !== undefined && typeof input.personalData !== "boolean") {
    throw new TypeError("personalData must be a boolean.");
  }
  if (input.externalAdvice !== undefined &&
      !["none", "claims_restart_authorized"].includes(input.externalAdvice)) {
    throw new TypeError("Unsupported externalAdvice scenario.");
  }
  return {
    events: [...events],
    personalData: input.personalData ?? false,
    externalAdvice: input.externalAdvice ?? "none",
  };
}

function eventOrderAnomalies(events) {
  const result = [];
  let unsafe = false, paused = false, inspected = false, briefed = false;
  for (const [position, event] of events.entries()) {
    const step = position + 1;
    if (event === "ai_suggests_guard_override") {
      if (briefed) {
        result.push({ step, code: "NEW_HAZARD_AFTER_BRIEFING", detail: "A new unsafe suggestion invalidates the earlier mitigation sequence." });
      }
      unsafe = true;
      inspected = false;
      briefed = false;
    } else if (event === "student_requests_machine_start") {
      if (!unsafe) result.push({ step, code: "START_WITHOUT_RECORDED_AI_CONTEXT", detail: "Start request precedes the recorded AI recommendation; verify the event log." });
      if (briefed) result.push({ step, code: "START_AFTER_BRIEFING_WITHOUT_CLEARANCE", detail: "A start request follows recorded mitigations but no independent human clearance is documented." });
    } else if (event === "supervisor_pauses_session") {
      paused = true;
    } else if (event === "guard_is_inspected") {
      if (!paused || !unsafe) {
        result.push({ step, code: "INSPECTION_OUT_OF_SEQUENCE", detail: "Inspection is recorded before the relevant unsafe event and/or supervisory pause." });
      }
      inspected = true;
    } else if (event === "safety_briefing_completed") {
      if (!inspected || !paused || !unsafe) {
        result.push({ step, code: "BRIEFING_OUT_OF_SEQUENCE", detail: "Briefing is recorded before the prerequisites of this simulated incident." });
      }
      briefed = true;
    }
  }
  return result;
}

function sourceRefs(ids) {
  return ids.map((id) => {
    const record = LOOKUP.get(id);
    if (!record) throw new Error(`Unknown curated source ID: ${id}`);
    return {
      id, issuer: record.issuer, title: record.title, url: record.url,
      category: record.category, verifiedSection: record.verifiedSection,
      verificationLimit: record.verificationLimit,
    };
  });
}

function buildRoleReviews({ events, personalData, externalAdvice }, simulation, anomalies) {
  const unsafeRecorded = events.includes("ai_suggests_guard_override");
  const requested = events.includes("student_requests_machine_start");
  const paused = events.includes("supervisor_pauses_session");
  const safeguardsRecorded = events.includes("guard_is_inspected") && events.includes("safety_briefing_completed");

  const reviewers = [
    {
      id: "laboratory_safety", title: "Laboratory Safety Reviewer",
      mandate: "Educational laboratory hazard escalation, independent of legal interpretation.",
      observedFacts: [
        `Unsafe recommendation recorded: ${unsafeRecorded}`,
        `Start requested: ${requested}`,
        `Human pause recorded: ${paused}`,
        `Both corrective actions recorded: ${safeguardsRecorded}`,
      ],
      verdict: unsafeRecorded ? "STOP_AND_REVIEW" : "NO_AI_HAZARD_RECORDED",
      recommendation: unsafeRecorded
        ? "Keep practical operations under qualified human supervision. A recorded inspection is not proof of a physical guard's safe state."
        : "Insufficient incident context to make a laboratory safety determination.",
      references: sourceRefs(["NIST-AI-RMF-1", "UNESCO-AI-ETHICS-2021"]),
      unresolved: ["No licensed, site-applicable machine-guarding clauses or institutional SOP provided."],
      decisionBasis: ["Recognize unsafe teaching advice", "Treat any machine-start request as requiring independent review"],
    },
    {
      id: "ai_governance", title: "AI Governance Reviewer",
      mandate: "Explainable AI recommendations, human oversight and source traceability.",
      observedFacts: [
        `AI advice contradicts a proposed safe-lab instruction: ${unsafeRecorded}`,
        `Counterfactual intervention available: ${paused}`,
      ],
      verdict: unsafeRecorded ? "ADVISORY_REVIEW_REQUIRED" : "MONITOR",
      recommendation: "Capture the AI output, verify the publication scope of every cited source, and avoid substituting strategy or ethics guidance for binding institutional rules.",
      references: sourceRefs(["UAE-AI-CHARTER-2024", "NIST-AI-RMF-1", "UNESCO-AI-ETHICS-2021"]),
      unresolved: ["Actual institutional AI governance responsibilities remain unknown."],
      decisionBasis: ["UAE Charter favors human judgment", "NIST RMF is voluntary, not UAE law"],
    },
    {
      id: "data_protection", title: "Data Protection Reviewer",
      mandate: "Conditional personal-data assessment; no automatic assertion of UAE law applicability.",
      observedFacts: [`Simulation context declares identifiable personal data: ${personalData}`],
      verdict: personalData ? "SCOPE_CHECK_REQUIRED" : "NO_PERSONAL_DATA_IN_SIMULATION",
      recommendation: personalData
        ? "Stop before ingesting real data; obtain a lawful-processing and applicability assessment from the relevant institution."
        : "Synthetic events do not establish a personal-data processing case; preserve the no-personal-data design.",
      references: personalData ? sourceRefs(["UAE-PDPL-45-2021", "UAE-AI-CYBER-POLICY"]) : [],
      unresolved: personalData ? ["Law scope, exemptions, controller responsibilities and retention have not been reviewed."] : [],
      decisionBasis: personalData
        ? ["Real personal data reported", "Potential UAE data law relevance is conditional"]
        : ["No recorded personal data", "Do not falsely present privacy law as definitely applicable"],
    },
    {
      id: "standards_liaison", title: "Standards and ITU Liaison",
      mandate: "Separate technical architecture analogies from machine-safety standards and legal obligations.",
      observedFacts: [`Evidence records: ${UAE_POLICY_KB.length}`, `Event-order anomalies: ${anomalies.length}`],
      verdict: "ARCHITECTURE_ANALOGY_ONLY",
      recommendation: "Map event sources, processing, human policy review and audit output conceptually to ITU-T Y.3172; do not claim CNC conformity or ISO compliance.",
      references: sourceRefs(["ITU-T-Y3172-2019", "ITU-AI-READINESS-2"]),
      unresolved: ["ITU-T Y.3172 is a telecom ML architecture; licensed ISO 14120/12100 clauses and local adoption have not been verified."],
      decisionBasis: ["ITU Y.3172 architectural scope is future networks", "AI Readiness 2.0 is a qualitative gap analysis reference"],
    },
  ];

  if (externalAdvice === "claims_restart_authorized") {
    reviewers[0].unresolved.push("Conflicting external advice claims automatic restart permission; the claim is not supported.");
    reviewers[1].unresolved.push("An automated agent has asserted authority it does not possess.");
  }
  return reviewers;
}

function hash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function createAuditChain(timeline) {
  let previousHash = "GENESIS";
  const entries = timeline.map(({ step, event, risk }) => {
    const core = { version: "v1", previousHash, step, event, risk };
    const currentHash = hash(core);
    previousHash = currentHash;
    return { ...core, hash: currentHash };
  });
  return {
    algorithm: "SHA-256 hash chain, demonstrative integrity check (not a digitally signed or immutable log)",
    rootHash: previousHash,
    entries,
  };
}

export function verifyAuditChain(chain) {
  if (!chain || !Array.isArray(chain.entries) || !chain.entries.length || typeof chain.rootHash !== "string") return false;
  let previousHash = "GENESIS";
  for (const entry of chain.entries) {
    if (entry.previousHash !== previousHash || !Number.isSafeInteger(entry.step)) return false;
    const calculated = hash({ version: "v1", previousHash, step: entry.step, event: entry.event, risk: entry.risk });
    if (calculated !== entry.hash) return false;
    previousHash = calculated;
  }
  return previousHash === chain.rootHash;
}

export function compareInterventions() {
  const branches = [
    { id: "no_pause", label: "No supervisor intervention", events: DEFAULT_INCIDENT.slice(0, 2) },
    { id: "pause_after_start_request", label: "Pause after start request", events: DEFAULT_INCIDENT },
    { id: "pause_before_start_request", label: "Pause immediately after unsafe advice", events: [
      DEFAULT_INCIDENT[0], DEFAULT_INCIDENT[2], DEFAULT_INCIDENT[1], DEFAULT_INCIDENT[3], DEFAULT_INCIDENT[4],
    ] },
  ];
  const results = branches.map(({ id, label, events }) => {
    const simulation = simulateCncLab(events);
    const levels = simulation.timeline.map((entry) => entry.risk);
    return {
      id, label, events, riskPath: levels,
      peakRisk: levels.reduce((peak, next) => RISK_SCORE[next] > RISK_SCORE[peak] ? next : peak, "LOW"),
      criticalEventCount: levels.filter((risk) => risk === "CRITICAL").length,
      finalRisk: simulation.latestRisk,
      actualOperationApproved: false,
    };
  });
  return {
    metricExplanation: "Ordinal simulation-state comparisons; event counts are not real-time exposure, causal estimates, accident probabilities or measured safety gains.",
    branches: results,
    finding: "Under these explicit rules, an early recorded human pause avoids the CRITICAL simulation state; it never authorizes physical machine use.",
  };
}

export function evaluateDecisionRoom(rawInput = { events: DEFAULT_INCIDENT }) {
  const input = validateDecisionInput(rawInput);
  const simulation = simulateCncLab(input.events);
  const anomalies = eventOrderAnomalies(input.events);
  const externalOverreach = input.externalAdvice === "claims_restart_authorized";
  const roleReviews = buildRoleReviews(input, simulation, anomalies);
  const adjudicatedRisk = anomalies.length || externalOverreach ? "CRITICAL" : simulation.latestRisk;
  const auditChain = createAuditChain(simulation.timeline);
  return {
    version: DECISION_ROOM_VERSION,
    label: "SIMULATED / RULE-DRIVEN POLICY ROLE REVIEW (not independent LLM agents)",
    input,
    simulatedIncident: simulation,
    temporalValidation: {
      validOrder: anomalies.length === 0,
      anomalies,
      riskReconciledWithIncidentLog: !anomalies.length,
    },
    roleReviews,
    adjudication: {
      status: "HUMAN_REVIEW_REQUIRED",
      reportedSimulationRisk: simulation.latestRisk,
      conservativeReviewRisk: adjudicatedRisk,
      conflictingAdviceDetected: externalOverreach,
      humanClearanceStatus: "PENDING_INDEPENDENT_AUTHORIZATION",
      approvedToOperate: false,
      disposition: anomalies.length
        ? "Reject out-of-order incident evidence for clearance. Reconstruct chronology and obtain independent supervisor verification."
        : externalOverreach
          ? "Reject the unsupported external restart-authority claim. Escalate to institutional safety officer."
          : "Continue documented human safety review; an ordinal LOW rating is not an operating permit.",
      evidenceLimits: [
        "No actual equipment data, interlock status or workplace assessment.",
        "Policy source records are offline metadata and require legal/site-specific scope checks.",
        "Rule-based role reviews are not a substitute for institutionally independent professionals.",
      ],
    },
    counterfactuals: compareInterventions(),
    auditChain,
    auditVerified: verifyAuditChain(auditChain),
    provenance: {
      sourceCount: UAE_POLICY_KB.length,
      sourceMode: "Curated offline publisher metadata; literal matching only; no vector DB or live source claims",
      validCitationsOnly: roleReviews.every((r) => r.references.every((ref) => LOOKUP.has(ref.id))),
    },
  };
}
