/**
 * EduSafe Policy Twin: deterministic, SIMULATED CNC laboratory incident.
 * No machinery or external systems are accessed. No legal conclusion is made.
 */

export const EVENT_TYPES = [
  "ai_suggests_guard_override",
  "student_requests_machine_start",
  "supervisor_pauses_session",
  "guard_is_inspected",
  "safety_briefing_completed",
] as const;

export type LabEvent = (typeof EVENT_TYPES)[number];
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface TimelineEntry {
  step: number;
  event: LabEvent;
  description: string;
  risk: RiskLevel;
  trainingSessionPaused: boolean;
  justification: string;
}

const descriptions: Record<LabEvent, string> = {
  ai_suggests_guard_override:
    "A teaching AI produces an unsafe suggestion to defeat a CNC protective guard (no procedure is reproduced).",
  student_requests_machine_start:
    "A student asks to start the machine despite the unresolved unsafe recommendation.",
  supervisor_pauses_session:
    "A qualified supervisor pauses the practical session pending review.",
  guard_is_inspected:
    "A qualified supervisor records an inspection of the protective guard in the simulation.",
  safety_briefing_completed:
    "The supervisor records completion of a corrective student safety briefing.",
};

export function simulateCncLab(events: readonly LabEvent[]) {
  if (events.length === 0 || events.length > 12) {
    throw new Error("Provide between 1 and 12 simulated events.");
  }

  let unsafeSuggestion = false;
  let startRequested = false;
  let paused = false;
  let guardInspected = false;
  let briefingCompleted = false;
  const timeline: TimelineEntry[] = [];

  for (const [index, event] of events.entries()) {
    switch (event) {
      case "ai_suggests_guard_override":
        unsafeSuggestion = true;
        break;
      case "student_requests_machine_start":
        startRequested = true;
        break;
      case "supervisor_pauses_session":
        paused = true;
        break;
      case "guard_is_inspected":
        guardInspected = true;
        break;
      case "safety_briefing_completed":
        briefingCompleted = true;
        break;
      default:
        throw new Error("Unsupported event type.");
    }

    let risk: RiskLevel = "LOW";
    let justification = "No unsafe AI recommendation has been recorded.";

    if (unsafeSuggestion && !paused) {
      risk = startRequested ? "CRITICAL" : "HIGH";
      justification = startRequested
        ? "Unsafe AI guidance and a pending start request remain unresolved."
        : "Unsafe AI guidance must be escalated before any practical work.";
    } else if (unsafeSuggestion && paused) {
      risk = guardInspected && briefingCompleted ? "LOW" : "MEDIUM";
      justification = guardInspected && briefingCompleted
        ? "Mitigations have been recorded; independent human clearance is still required."
        : "The session is paused, but corrective review is not yet complete.";
    }

    timeline.push({
      step: index + 1,
      event,
      description: descriptions[event],
      risk,
      trainingSessionPaused: paused,
      justification,
    });
  }

  const finalRisk = timeline[timeline.length - 1].risk;
  const requiresHumanApproval = unsafeSuggestion || startRequested;
  const actions = [
    "Keep this analysis explicitly labelled SIMULATED; never apply it to a live machine.",
    "Ask an authorized laboratory supervisor to review the incident and the AI output.",
    "Document source evidence before asserting any applicable policy or standard.",
  ];
  if (unsafeSuggestion && !paused) {
    actions.unshift("Pause practical activity and prevent machine start pending supervisor review.");
  }
  if (unsafeSuggestion && paused && (!guardInspected || !briefingCompleted)) {
    actions.unshift("Keep the session paused until inspection and corrective briefing are reviewed.");
  }

  return {
    label: "SIMULATED — educational CNC laboratory incident",
    scenarioId: "EDUSAFE-CNC-001",
    modelType: "Deterministic event replay; not a physical or persistent digital twin",
    assumptions: [
      "The events are fictional and contain no student personal information.",
      "No sensor readings, machine state, or real incident records have been observed.",
    ],
    timeline,
    latestRisk: finalRisk,
    incidentState: {
      unsafeSuggestionRecorded: unsafeSuggestion,
      machineStartRequested: startRequested,
      trainingSessionPaused: paused,
      protectiveGuardInspectionRecorded: guardInspected,
      correctiveBriefingRecorded: briefingCompleted,
      automaticMachineControlPerformed: false,
      approvedToResume: false,
    },
    safetyAssessment:
      "An unsafe AI recommendation about protective devices requires supervisory escalation and controlled educational review.",
    policyAssessment: "Evidence mapping has not yet been connected to this simulation tool.",
    sourceEvidence: [],
    evidenceGap: "No verified evidence is available in the current knowledge base.",
    recommendedActions: actions,
    requiresHumanApproval,
    auditSummary:
      `Replayed ${events.length} simulated events in order. Final risk: ${finalRisk}. ` +
      "No machinery was controlled and no compliance finding was made.",
  };
}
