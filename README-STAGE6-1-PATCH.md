# EduSafe Policy Twin - Stage 6.1 Validation Update

**Research owner:** AMED ALTENAWI
**Prepared:** 6 November 2026
**Scope:** Safe overlay for the existing Stage 6 Git repository. It is not a new repository or a replacement for Stages 1-5.

## What changed

1. Free-text guard screening now recognizes common inflections such as `bypassing`, `bypassed`, `disabling`, `removed` and `overriding` as well as base verbs. The exact wording of the owner-observed Ollama case is now a regression test.
2. The model-output verifier rejects issue codes that have not been independently identified by the lexical evidence layer. Every proposed issue must also have at least one cited retrieved record linked to that issue. Verification remains metadata-based, not an expert assessment of truth.
3. The status endpoint now distinguishes `OPT_IN_LOCAL_MODEL` from `OPT_IN_EXTERNAL_MODEL`. The browser consent text accurately states that the model endpoint may be local or external.
4. Four new automated tests and three new developer-authored test fixtures were added. Local verification passed **44/44 tests**, **27/27 developer-authored fixtures**, and **8/8 constructed adversarial rejection cases**. These are internal contract checks, not generalization accuracy.
5. A three-page technical report derived from the existing ITU official-template-based document describes the architecture, standards mapping, evidence limitations, and one real local-model observation on the **prior** Stage 6 build. Do not claim that the *patched* Stage 6.1 build has been tested against Ollama until you rerun the live call below.

## Apply to the Windows project

The archive contains only the files listed under `Files in overlay`. It does not include `.git`, `node_modules`, credentials, or `AGENTS.md` / `CLAUDE.md`.

1. In the CMD window running `demo/server.mjs`, press `Ctrl+C` once. Keep Ollama running.
2. Download `edusafe-stage6-1-update.zip` to `C:\Users\ASUS\Downloads`.
3. Before extracting, check for work you may have changed after Stage 6:

```cmd
git -C "C:\Users\ASUS\edusafe-policy-twin" status --short
```

If the status lists changed or untracked versions of any file in `Files in overlay`, stop and review the differences before extraction. The previously seen `?? AGENTS.md` and `?? CLAUDE.md` are unrelated and will not be touched.

4. In a *new* CMD window, run:

```cmd
tar -tf "C:\Users\ASUS\Downloads\edusafe-stage6-1-update.zip"
tar -xf "C:\Users\ASUS\Downloads\edusafe-stage6-1-update.zip" -C "C:\Users\ASUS\edusafe-policy-twin"
node --test "C:\Users\ASUS\edusafe-policy-twin\tests\*.test.mjs"
node "C:\Users\ASUS\edusafe-policy-twin\evaluation\run_stage6_eval.mjs"
git -C "C:\Users\ASUS\edusafe-policy-twin" diff --check
git -C "C:\Users\ASUS\edusafe-policy-twin" status --short
```

Expected results: 44 tests pass; 27 of 27 synthetic issue sets match; 8 of 8 constructed invalid proposals are rejected. If the actual output differs, **do not commit**; send the console text for diagnosis.

## Repeat the one real local-model scenario

Set these variables in the *same CMD window* that starts the server. The local Ollama key is a placeholder, not a cloud credential.

```cmd
set "EDUSAFE_ENABLE_LIVE_AI=1"
set "EDUSAFE_LLM_ENDPOINT=http://127.0.0.1:11434/v1/chat/completions"
set "EDUSAFE_LLM_MODEL=qwen3:0.6b"
set "EDUSAFE_LLM_API_KEY=ollama"
node "C:\Users\ASUS\edusafe-policy-twin\demo\server.mjs"
```

In a second CMD window:

```cmd
curl http://127.0.0.1:4173/api/evidence-lab/status
```

Expected: `"configured":true` and `"providerMode":"OPT_IN_LOCAL_MODEL"`. Open `http://127.0.0.1:4173/evidence-lab.html`, keep the fictional example, click the optional live model button, and export JSON. The **deterministic** issue list should now include both `UNSAFE_GUARD_ADVICE` and `START_REQUEST`. The language model may produce different outputs, fail or time out; do not invent a pass if that happens. The `authorizedToOperate` field must remain `false`.

## Commit only after successful verification

Run these exact commands. They deliberately exclude unrelated untracked files.

```cmd
git -C "C:\Users\ASUS\edusafe-policy-twin" add README-STAGE6.md README-STAGE6-1-PATCH.md agent/lib/evidence_first.mjs demo/evidence-lab.html evaluation/run_stage6_eval.mjs evaluation/stage6_eval_results.json tests/evidence_first.test.mjs submission/EduSafe_ITU_Official_Template_Stage6_1.docx submission/EduSafe_ITU_Official_Template_Stage6_1.pdf
git -C "C:\Users\ASUS\edusafe-policy-twin" diff --cached --check
git -C "C:\Users\ASUS\edusafe-policy-twin" commit -m "Harden Stage 6 evidence validation and update ITU report"
git -C "C:\Users\ASUS\edusafe-policy-twin" push origin main
git -C "C:\Users\ASUS\edusafe-policy-twin" status --short
```

The older `AGENTS.md` and `CLAUDE.md` files are not part of this change and should remain untouched unless the owner chooses otherwise.

## Submission checklist

- Technical report: three pages, below the ITU five-page maximum. Inspect the final PDF on your own machine and confirm author, project, date and link before submission.
- Public repository: verify the new commit appears on GitHub; merely preparing a zip does not publish code.
- Knowledge base: `policykb/verified_sources.json` and the accompanying retrieval source files; publisher metadata and editorial summaries, not a hosted vector database or certified legal extract.
- Optional video: at most seven minutes. A recorded demo becomes required if the project is shortlisted.
- Initial registration receipt **is not a final submission confirmation**. Confirm the upload instructions with the organizers; no submission was sent as part of this update.

Official requirements and deadlines: https://aiforgood.itu.int/event/ai-for-good-sandbox-hackathon-united-arab-emirates/

## Remaining scientific limitations

- No independent expert labels; precision and recall have not been measured on a blind set.
- Small local models may return inaccurate or malformed JSON; the conservative gate will reject unsupported proposals, but it is not a safety certification.
- Lexical rules may miss paraphrases, misread negation or over-identify a policy issue.
- NIST, UNESCO and UAE source summaries cannot substitute for licensed machine-guarding standards or site-specific procedures.
- No machine connection, injury predictions, official ITU Sandbox access, or external cloud model use is asserted.

## Files in overlay

- `README-STAGE6.md`
- `README-STAGE6-1-PATCH.md`
- `agent/lib/evidence_first.mjs`
- `demo/evidence-lab.html`
- `evaluation/run_stage6_eval.mjs`
- `evaluation/stage6_eval_results.json`
- `tests/evidence_first.test.mjs`
- `submission/EduSafe_ITU_Official_Template_Stage6_1.docx`
- `submission/EduSafe_ITU_Official_Template_Stage6_1.pdf`
