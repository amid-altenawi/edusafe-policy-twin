# EduSafe Policy Twin - Stage 2: Curated official evidence

This add-on preserves the tested Stage 1 simulator and adds two Eve tools:

- `lookup_policy_evidence`: search 6 source records by topic.
- `analyze_cnc_with_evidence`: replay the lab incident and attach relevant official publisher records.

It is an **offline, dated, curated metadata snapshot**. It does not claim to have
fetched full ISO texts or verified UAE legal applicability.

## Installation (Windows 11)

1. In the currently open Eve UI, type `/exit` and press Enter.
2. Extract the ZIP into `C:\Users\ASUS\edusafe-policy-twin\`, merging the
   existing `agent` and `tests` folders. Do not remove any Stage 1 files.
3. At the Windows Command Prompt, run **one command at a time**:

   ```cmd
   node --test tests\evidence_library.test.mjs
   npx eve dev
   ```

4. In Eve (where the line starts with `>` and the footer shows `gpt-6-luna`),
   ask **on one line**:

   `Run analyze_cnc_with_evidence using these ordered events: ai_suggests_guard_override, student_requests_machine_start, supervisor_pauses_session, guard_is_inspected, safety_briefing_completed. Explain risks and cite the returned ISO, NIST and UNESCO source URLs in Arabic; clearly say what has not been verified.`

Expected: a 5-step risk timeline, source records with verified publisher URLs,
ISO abstract/full-text limitation, and a clear note that no UAE law was verified.

Note: This package does not include any actual policy documents or ISO PDFs.
Sources and summaries may need re-checking as standards are revised.
