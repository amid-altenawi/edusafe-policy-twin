import { defineTool } from "eve/tools";
import { z } from "zod";
import { EVENT_TYPES, simulateCncLab } from "../lib/simulate_cnc_lab";
import { assessUaePolicyGaps, queryUaePolicyKnowledgeBase } from "../lib/uae_policy_kb";

export default defineTool({
  description:
    "For a fictional CNC lab incident, produce an explainable risk timeline plus " +
    "three policy/implementation gap CANDIDATES with cited official source metadata, " +
    "missing institutional facts and explicit human sign-off requirements. " +
    "Do not claim violations of UAE law or give instructions to operate machinery.",
  inputSchema: z.object({ events: z.array(z.enum(EVENT_TYPES)).min(1).max(12) }),
  execute({ events }) {
    const simulation = simulateCncLab(events);
    const policy = queryUaePolicyKnowledgeBase();
    const gapAssessment = assessUaePolicyGaps(simulation);
    return {
      ...simulation,
      policyKnowledgeBase: policy,
      gapAssessment,
      safetyGate: "NO MACHINE OPERATION APPROVED; consult the qualified lab supervisor.",
      evidenceGap:
        "Institution-specific UAE rules and full applicable machine guarding standards are missing. " +
        "These are source-guided recommendations, not binding findings.",
      reasoningTrace: {
        observedSimulatedEvents: events,
        riskState: simulation.latestRisk,
        evaluatedRules: [
          "Unsafe AI guard-override advice is recorded before any mitigation.",
          "Machine start request prior to supervisory pause escalates the risk.",
          "Recorded inspection plus briefing lowers simulated severity but cannot authorize restart.",
          "Separate human, legal and institutional checks are required before any real action.",
        ],
        scope: "Decision summary; excludes hidden model chain-of-thought and personal data.",
      },
    };
  },
});
