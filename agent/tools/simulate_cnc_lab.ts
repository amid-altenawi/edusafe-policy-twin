import { defineTool } from "eve/tools";
import { z } from "zod";
import { EVENT_TYPES, simulateCncLab } from "../lib/simulate_cnc_lab";

export default defineTool({
  description:
    "Replay an ordered list of SIMULATED events in a CNC educational safety incident. " +
    "Return a deterministic timeline, risk changes, human-review requirements, " +
    "and explicit evidence gaps. Never controls a real machine. " +
    "Use this for the EduSafe demonstration, not for legal compliance decisions.",
  inputSchema: z.object({
    events: z.array(z.enum(EVENT_TYPES)).min(1).max(12).describe(
      "Ordered simulated events; start with ai_suggests_guard_override, " +
      "then optionally include student_requests_machine_start, " +
      "supervisor_pauses_session, guard_is_inspected, safety_briefing_completed.",
    ),
  }),
  execute({ events }) {
    return simulateCncLab(events);
  },
});
