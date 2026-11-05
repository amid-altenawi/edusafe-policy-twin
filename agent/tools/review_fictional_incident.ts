import { defineTool } from "eve/tools";
import { z } from "zod";
import { analyzeEvidenceFirst } from "../lib/evidence_first.mjs";

/**
 * Eve-native bounded review. The LLM can only suggest enumerated outputs; its
 * source IDs and action codes are checked locally, and no machine is operated.
 */
export default defineTool({
  description: "Review a fictional engineering-education incident with source-grounded, limited policy metadata. Optionally request live AI classification only if a provider was explicitly configured; never authorize equipment.",
  inputSchema: z.object({
    text: z.string().min(12).max(1500).describe("Fictional incident description without names, contacts or other real personal information"),
    mode: z.enum(["offline", "live"]).default("offline"),
  }),
  async execute({ text, mode }) {
    return analyzeEvidenceFirst({ text, mode });
  },
});
