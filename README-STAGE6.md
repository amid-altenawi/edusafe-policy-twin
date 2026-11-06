# EduSafe Policy Twin — Stage 6: Evidence-First Agent & Evaluation Lab

**Research owner:** AMED ALTENAWI
**Date:** 6 November 2026
**Version:** `6.1.0-research` (targeted review and evidence-validation update)

## Implementation status — be exact with judges

Stage 6 moves beyond a fixed five-event replay by accepting free-text **fictional** incidents in English or Arabic. A conservative local issue detector retrieves bounded metadata from the existing eight curated official publisher records, shows the real source URLs and applicability limitations, and refuses to authorize machine operation.

An **optional, actual model connector** can request a constrained classification from a user-configured OpenAI-compatible chat-completions provider. Its returned JSON is validated against grounded rule matches, allowed action codes and *retrieved source IDs with issue links*. Unsupported actions, unsupported issue claims, fabricated citations, omissions of urgent issues and weaker-than-required escalation are rejected. On 6 November 2026, the owner performed **one observed actual local Ollama qwen3:0.6b request** on the *pre-fix Stage 6 code*: the result was `MODEL_OUTPUT_VERIFIED`, `STOP_AND_ESCALATE` and `authorizedToOperate=false`. This is an end-to-end integration observation, **not an independent performance measurement**. Stage 6.1 separately fixes an observed lexical miss in the same input and tightens acceptance checks; re-run this request after applying the update before claiming live Stage 6.1 validation.

This is **not** a trained multi-agent system, official ITU Sandbox vector KB, independent expert study, live legal advisory tool, real industrial digital twin or hardware safety controller. The current source database comprises editorial metadata and paraphrases, not licensed machine-guarding clauses or verbatim official policy paragraphs.

## Windows installation — overlay on Stage 5

Archive is an overlay; it deliberately excludes Git internals, `node_modules`, secrets, and the unrelated existing `AGENTS.md` / `CLAUDE.md` files.

```bat
tar -tf "C:\Users\ASUS\Downloads\edusafe-stage6.zip"
tar -xf "C:\Users\ASUS\Downloads\edusafe-stage6.zip" -C "C:\Users\ASUS\edusafe-policy-twin"
node --test "C:\Users\ASUS\edusafe-policy-twin\tests\*.test.mjs"
node "C:\Users\ASUS\edusafe-policy-twin\evaluation\run_stage6_eval.mjs"
node "C:\Users\ASUS\edusafe-policy-twin\demo\server.mjs"
```

Keep the last Command Prompt window open and enter this URL into Chrome's **address bar, not Google search**:

`http://127.0.0.1:4173/evidence-lab.html`

If the Stage 5 server is still running, stop it with `Ctrl+C` in its window before restarting. The old Stage 5 Decision Room remains intact at `/decision-room.html`.

## Offline demonstration for judges (no API expenses)

1. Edit the fictional text to: “A fictional CNC tutor says bypass the protective guard. A student requests machine start.” Choose **Analyze evidence offline**.
2. Show the `STOP_AND_ESCALATE` rule-bound disposition, retrieved publisher IDs and links, *separate official source categories*, and the obligatory `PENDING_INDEPENDENT_REVIEW` human gate.
3. Replace input with: “A fictional gardener waters flowers beside a bench.” No relevant policy metadata should be returned and the system **abstains**.
4. Switch language to Arabic; test an Arabic classroom scenario.
5. Run `node evaluation/run_stage6_eval.mjs` and display its audit report. **Explain clearly:** 27/27 developer-authored cases matched their *developer-defined* issue specifications, and eight deliberately invalid model outputs were rejected. This is contract testing, not independent accuracy or physical risk measurement.

## Optional real-model experiment — local Ollama observation completed once

The following environment variables must be configured **locally**, never committed, never posted to chat, and never put in documents or screenshots:

| Variable | Meaning |
|---|---|
| `EDUSAFE_ENABLE_LIVE_AI=1` | Explicitly opt into sending synthetic incident text to the configured local or external model endpoint |
| `EDUSAFE_LLM_ENDPOINT` | Trusted HTTPS endpoint ending in `/chat/completions` (local `127.0.0.1` HTTP also allowed) |
| `EDUSAFE_LLM_MODEL` | Provider-specific model identifier |
| `EDUSAFE_LLM_API_KEY` | Private credential for provider; keep only in the local environment |

After securely setting these variables, restart `demo/server.mjs`. The UI will offer a live-model button and require a confirmation before transmitting the **fictional** case. For the local Ollama experiment: use `http://127.0.0.1:11434/v1/chat/completions`, model `qwen3:0.6b`, and a placeholder Ollama API key that Ollama ignores; a ChatGPT subscription is not an API subscription. The optional `getLiveAiStatus()` labels loopback endpoints as `OPT_IN_LOCAL_MODEL`.

The server only sends the fictional input and a minimal metadata subset; it does **not** upload the local project, files, or actual students. It imposes a 12-second model-call timeout and restricts output to enumerated action/issue codes and allowed citation IDs. Even an accepted model output cannot authorize CNC activity. A provider error or malformed response is surfaced as `MODEL_UNAVAILABLE_OR_INVALID`, not silently replaced by a claim of successful AI inference.

For the Eve agent, Stage 6 additionally provides `agent/tools/review_fictional_incident.ts` based on the published `defineTool` interface. The **actual local Eve v1.0.0-rc.3 build has not been validated here**; verify with your installed framework before claiming durable agent operation.

## Test results (development environment)

- **44/44** Node.js tests passed in the packaging environment, including four additional Stage 6.1 regression/guardrail tests and the existing local mock-provider transport test.
- **27/27** developer-authored fictional cases matched their expected issue-code sets. Case wording is tailored by the development team and cannot be considered an external benchmark.
- **8/8** intentionally invalid model JSON proposals were correctly rejected in synthetic evaluation, including citation-to-issue mismatches and new unsupported issue codes.
- **One observed prior-version local Ollama response** was provided by the owner; **zero actual LLM requests** were made by the automated evaluation. No real student records or machine connections are involved.

The exact metrics, per-case outcomes, and limitations are in `evaluation/stage6_eval_results.json`; regenerate with `evaluation/run_stage6_eval.mjs`. An independent evaluation plan is provided in `evaluation/expert_review_protocol.md`, but **no qualified human has yet labeled independent cases**.

## Research value and next gate

This architecture tests an important claim: an LLM may classify incident text, but **a deterministic evidence gate can prevent acceptance of unsupported source IDs or unauthorized actions**. Unlike free-form generation, it offers explicit abstention and provenance categories. The retrieval is still transparent rules + lexical overlap, **not semantic vector search**, so unfamiliar synonyms and ambiguous factual contexts can be missed.

To make a defensible externally validated scientific claim, freeze a new blind case set, obtain qualified reviewer labels, perform repeated genuinely configured live-model runs, and report precision/recall/abstention with error breakdowns. A single owner-observed run cannot establish accuracy or reliability. The companion Stage 6.1 ITU report includes this distinction explicitly.

### Source references

- [Eve official typed-tool guide](https://github.com/vercel/eve/blob/main/docs/tools/overview.mdx)
- [Stage 4 official-source provenance](policykb/verified_sources.json)
- [Stage 5 existing role and chronology audit](README-STAGE5.md)

**Safety boundary:** No automatic machine-start approval, physical sensor input, proof of compliance, legal advice or measurable reduction of actual injuries.
