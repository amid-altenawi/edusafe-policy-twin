import { defineTool } from "eve/tools";
import { z } from "zod";
import { POLICY_TOPICS, queryUaePolicyKnowledgeBase } from "../lib/uae_policy_kb";

export default defineTool({
  description:
    "Search eight dated authoritative UAE and international policy/strategy/standards metadata records " +
    "for the simulated EduSafe CNC education scenario. Distinguish federal law from nonbinding " +
    "national strategy, ethics guidance and telecom architecture. Return publisher links and verification limits. " +
    "Offline curated exact-keyword retrieval only; no vector store or legal compliance conclusions.",
  inputSchema: z.object({
    topic: z.enum(POLICY_TOPICS).optional(),
    text: z.string().max(200).optional(),
    limit: z.number().int().min(1).max(8).optional(),
  }),
  execute(input) {
    return queryUaePolicyKnowledgeBase(input);
  },
});
