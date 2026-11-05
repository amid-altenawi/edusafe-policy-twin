import { defineTool } from "eve/tools";
import { z } from "zod";
import { EVENT_TYPES } from "../lib/simulate_cnc_lab";
import { evaluateDecisionRoom } from "../lib/decision_room.mjs";

export default defineTool({
  description:
    "Evaluate a fictional CNC teaching incident in EduSafe Stage 5's rule-driven " +
    "Decision Room. Produces four distinct role-scoped assessments (lab safety, AI governance, " +
    "conditional data protection, ITU standards), temporal anomaly detection, simulated " +
    "counterfactual interventions and an SHA-256 audit integrity chain. " +
    "Explicitly disclose: reviewers are deterministic rules, not autonomous hosted LLM agents. " +
    "Never claim legal compliance, machine-operation approval or measured accident probability.",
  inputSchema: z.object({
    events: z.array(z.enum(EVENT_TYPES)).min(1).max(12),
    personalData: z.boolean().optional(),
    externalAdvice: z.enum(["none", "claims_restart_authorized"]).optional(),
  }),
  execute(input) {
    return evaluateDecisionRoom(input);
  },
});
