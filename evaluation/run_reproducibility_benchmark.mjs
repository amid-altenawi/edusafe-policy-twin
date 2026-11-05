/**
 * Internal deterministic invariants benchmark, NOT external ML accuracy study.
 * Deliberately generates every permutation of the five distinct fictional events.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { DEFAULT_INCIDENT, evaluateDecisionRoom, verifyAuditChain } from "../agent/lib/decision_room.mjs";

const stats = {
  description: "Exhaustive permutations of five fictional incident events (5!); internal software-invariant test only",
  version: "5.0.0-research",
  date: "2026-11-05",
  totalSequences: 0,
  flaggedInvalidOrder: 0,
  baselineReportedLowButOrderInvalid: 0,
  scenariosWithoutAutomaticAuthorization: 0,
  completeValidAuditChains: 0,
  citedIdsUnrecognized: 0,
  manualValidationNeeded: [
    "This is not a statistical evaluation of injuries or physical risks.",
    "No human-labeled independent benchmark or adversarial LLM evaluation is claimed.",
    "The same rules define event order and its synthetic evaluation; expert adjudication is required.",
  ],
};

function explore(prefix, remaining) {
  if (!remaining.length) {
    const result = evaluateDecisionRoom({ events: prefix });
    stats.totalSequences++;
    if (!result.temporalValidation.validOrder) {
      stats.flaggedInvalidOrder++;
      if (result.simulatedIncident.latestRisk === "LOW") stats.baselineReportedLowButOrderInvalid++;
    }
    if (!result.adjudication.approvedToOperate) stats.scenariosWithoutAutomaticAuthorization++;
    if (verifyAuditChain(result.auditChain)) stats.completeValidAuditChains++;
    if (!result.provenance.validCitationsOnly) stats.citedIdsUnrecognized++;
    return;
  }
  for (let i = 0; i < remaining.length; i++) {
    explore([...prefix, remaining[i]], [...remaining.slice(0, i), ...remaining.slice(i+1)]);
  }
}
explore([], DEFAULT_INCIDENT);
if (stats.totalSequences !== 120 || stats.scenariosWithoutAutomaticAuthorization !== 120 ||
    stats.completeValidAuditChains !== 120 || stats.citedIdsUnrecognized !== 0) {
  throw new Error("Deterministic benchmark invariant failed.");
}

const out = resolve(dirname(fileURLToPath(import.meta.url)), "benchmark_results.json");
writeFileSync(out, JSON.stringify(stats, null, 2) + "\n", "utf8");
process.stdout.write(JSON.stringify(stats, null, 2) + "\n");
