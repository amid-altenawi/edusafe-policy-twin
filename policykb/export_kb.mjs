/**
 * Rebuild the portable policy record index from the single TypeScript source.
 * Run with Node 24+ from the project root:
 * node policykb/export_kb.mjs
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { UAE_POLICY_KB, POLICY_TOPICS } from "../agent/lib/uae_policy_kb.ts";

const output = fileURLToPath(new URL("./verified_sources.json", import.meta.url));
const portableIndex = {
  kbVersion: "4.0-draft",
  project: "EduSafe Policy Twin",
  reviewedOn: "2026-11-05",
  repositoryType: "curated_offline_metadata",
  retrievalType: "topic_filter_and_literal_keyword_search",
  recordsAreNotFullText: true,
  legalApplicabilityVerified: false,
  machineOperationApproval: false,
  topics: POLICY_TOPICS,
  count: UAE_POLICY_KB.length,
  sources: UAE_POLICY_KB,
};

await writeFile(output, `${JSON.stringify(portableIndex, null, 2)}\n`, "utf8");
process.stdout.write(`Exported ${portableIndex.count} records to ${output}\n`);
