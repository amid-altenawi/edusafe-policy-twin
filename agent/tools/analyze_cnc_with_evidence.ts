import { defineTool } from "eve/tools";
import { z } from "zod";
import { EVENT_TYPES, simulateCncLab } from "../lib/simulate_cnc_lab";
import { lookupPolicyEvidence } from "../lib/evidence_library";

export default defineTool({
  description:
    "Produce a SIMULATED CNC laboratory incident report with actual curated " +
    "publisher source records for machine guarding, machinery risk assessment, " +
    "AI governance, and human oversight. Source mapping is advisory, not proof of UAE law or ISO compliance.",
  inputSchema: z.object({
    events: z.array(z.enum(EVENT_TYPES)).min(1).max(12),
  }),
  execute({ events }) {
    const simulation = simulateCncLab(events);
    const sources = [
      ...lookupPolicyEvidence("cnc_guard_safety").records,
      ...lookupPolicyEvidence("machinery_risk_assessment").records,
      ...lookupPolicyEvidence("ai_risk_governance").records,
      ...lookupPolicyEvidence("human_oversight").records,
    ];
    const uniqueSources = Array.from(new Map(sources.map((source) => [source.id, source])).values());
    return {
      ...simulation,
      sourceEvidence: uniqueSources,
      evidenceGap:
        "Official publisher metadata has been retrieved and embedded as a dated snapshot. " +
        "Full ISO clauses and UAE-specific legal requirements have NOT been verified.",
      evidenceMappingStatus: "Relevant source topics matched; applicability requires qualified human review",
      verifiedSourceCount: uniqueSources.length,
      limitations: [
        "This is a fictional event replay, not a physical or persistent digital twin.",
        "No live source verification was performed when the tool ran.",
        "No binding UAE institutional policy was asserted.",
        "No machinery was accessed or controlled.",
      ],
    };
  },
});
