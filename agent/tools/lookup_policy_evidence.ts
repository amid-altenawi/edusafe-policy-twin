import { defineTool } from "eve/tools";
import { z } from "zod";
import { TOPICS, lookupPolicyEvidence } from "../lib/evidence_library";

export default defineTool({
  description:
    "Search the EduSafe curated local evidence library by technical/policy topic. " +
    "Returns exact official publisher URLs, sections, summaries, and scope limits. " +
    "Use before claiming any source support. No live web fetch, legal advice, or compliance certification.",
  inputSchema: z.object({
    topic: z.enum(TOPICS),
  }),
  execute({ topic }) {
    return lookupPolicyEvidence(topic);
  },
});
