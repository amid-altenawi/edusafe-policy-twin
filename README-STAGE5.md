# EduSafe Policy Twin — Stage 5: Decision Room

**Research version:** `5.0.0-research`
**Owner:** AMED ALTENAWI
**Domain:** Engineering education / AI governance / policy-grounded CNC incident review
**Prepared:** 5 November 2026

## What is actually new

Stage 5 introduces a *deterministic, inspectable policy decision laboratory* rather than a trained multi-agent AI system. The simulator is fictional and cannot control CNC hardware.

1. **Temporal integrity layer:** detects out-of-order inspections or briefings, repeated unsafe recommendations and start requests without the recorded context. This review conservatively escalates inconsistent logs even where the older simulator returns `LOW`.
2. **Four mandate-separated role reviews:** laboratory safety, AI governance, conditional student-data protection, and ITU/standards liaison. Each review states observed facts, a bounded verdict, a proposal, and known provenance limitations. These are rule-driven reviewers, **not** independent hosted LLM agents or government bodies.
3. **Counterfactual intervention comparisons:** compare `no_pause`, `pause_after_start_request`, and `pause_before_start_request` under exactly the documented event-state rules. Show qualitative severity and the number of CRITICAL-rated events. **Not** an incident probability, causal effect, exposure time or real-world injury model.
4. **Demonstrative SHA-256 audit chain:** each event digest depends on the previous one; tampering can be detected when a trusted root hash is retained. This is not a digitally signed, immutable or third-party notarized event log.
5. **Policy-overreach probe:** explicitly inject the false claim that an AI agent has machine-restart authority and show the conservative human-adjudication rejection.
6. **Bilingual Decision Room UI:** separate local page with scenario presets, role reviews, synthetic metrics, provenance links, and downloadable JSON audit record.
7. **Internal reproducibility benchmark:** enumerate all `5! = 120` event orderings, check core safety invariants, and expose the previous risk-state limitations. Automated checks are **not** third-party scientific validation.

## Add to your existing Windows project

The Stage 5 ZIP contains **only new and changed files**; it intentionally does not contain `node_modules`, `.git`, credentials, or unrelated local files. It should be extracted on top of your existing project at:

`C:\Users\ASUS\edusafe-policy-twin`

Before extracting, inspect its contents:

```bat
tar -tf "C:\Users\ASUS\Downloads\edusafe-stage5.zip"
```

Then extract **directly into the existing project** (no second manual copy is needed):

```bat
tar -xf "C:\Users\ASUS\Downloads\edusafe-stage5.zip" -C "C:\Users\ASUS\edusafe-policy-twin"
```

Use Node.js 24+ (your Node 26 is suitable):

```bat
node --test "C:\Users\ASUS\edusafe-policy-twin\tests\*.test.mjs"
node "C:\Users\ASUS\edusafe-policy-twin\evaluation\run_reproducibility_benchmark.mjs"
node "C:\Users\ASUS\edusafe-policy-twin\demo\server.mjs"
```

In Chrome enter the address **in the browser's address bar, not in Google search**:

`http://127.0.0.1:4173/decision-room.html`

Existing Stage 4 dashboard remains at `http://127.0.0.1:4173/`.

**If the old server is still running**, press `Ctrl+C` in the Command Prompt window where it runs and start it again. Never launch two instances on port 4173.

## Repeatable judge demonstration (90 seconds)

1. Start in the **Decision Room**, select **Five-event mitigation**, then evaluate. Explain that the legacy risk path is `HIGH → CRITICAL → MEDIUM → MEDIUM → LOW`; human machine approval is still **PENDING**.
2. Select **Early supervisor intervention**. The `CRITICAL` simulated state disappears, but this is a structural what-if comparison, not a measured injury reduction.
3. Select **Invalid chronology / evidence trap**. The old risk model still reports `LOW`, but the new integrity layer rejects the order and raises conservative review risk to `CRITICAL`.
4. Select **Inject false AI restart-authority claim**. The policy reviewer rejects that claim even though the other recorded mitigations may look complete.
5. Check **Scenario contains identifiable student data**. The privacy reviewer changes from **not applicable** to **scope check required**, with a conditional official UAE privacy reference. This demonstrates abstention rather than universal legal claims.
6. Export the JSON audit record and point to the event-linked SHA-256 digests and clearly labeled source limitations.

## Evidence and evaluation, without exaggerated claims

Internal local test results at Stage 5 assembly:

- **28/28 Node.js tests passed**, including the existing 15 Stage 4 tests.
- **120/120** exhaustive five-event permutations left the `approvedToOperate` field false and produced internally valid audit chains.
- **115/120** permutations were flagged for ordering problems. Under the older state machine, all 115 nonetheless ended in `LOW`. These deliberately permuted fictional sequences are a **software-invariant stress test**, not an external safety benchmark.
- **0** unknown source IDs among the bounded, source-linked role reviews.

Raw reproducibility outputs: `evaluation/benchmark_results.json`; rerun the generator to regenerate results. Missing evidence: independent expert labels, a representative incident dataset, live policy full text, objective model-performance validation, hardware sensors, and real institution-specific UAE rules.

## Scope and research roadmap

**Implemented now:** deterministic role reviews; chronology integrity guard; explanatory event-state and counterfactual paths; offline curated source metadata; JSON output and demonstrative hash chain; Eve tool; local bilingual UI.

**Not implemented / do not claim:** four autonomous LLMs, consensus voting of legally empowered institutions, vector/distributed KB deployed on the ITU Sandbox, real-world safety interlock, certified ISO conformity, causal risk reduction, independent government approval, and automatic machine restart.

**Next highest-impact upgrades before final submission:**

1. Expand the UAE knowledge base into **section-addressable, permitted policy excerpts** with exact citations and a retrieval benchmark; prioritize quality/provenance over record count.
2. Use the organizers' sanctioned **ITU Sandbox infrastructure** to build actual independent role-agent runs with bounded tools and document-level references, retaining fallback abstentions.
3. Obtain at least one qualified engineer/educator to label fictional cases and publish an **independent evaluation matrix** (coverage, false legal claims, abstention accuracy, temporal error detection). Do not fabricate endorsements.
4. Update the official <=5-page template report to distinguish the Stage 5 demonstrated results from the remaining research roadmap; prepare a <=7-minute video.

## References and constraints

- [Official hackathon: submission and evaluation rules](https://aiforgood.itu.int/event/ai-for-good-sandbox-hackathon-united-arab-emirates/)
- [ITU-T Y.3172 — an ML architectural standard for future telecom networks](https://www.itu.int/ITU-T/recommendations/rec.aspx?id=13894)
- [ITU AI Ready 2.0 report](https://www.itu.int/hub/publication/t-ai4g-ai4good-2025-6/)
- Stage 4 local sources: `policykb/verified_sources.json`, `policykb/README.md`.

This research demonstration is not a physical or persistent digital twin of a real CNC machine. It is a **policy and incident-state twin**. Its system-generated advice must not be used to operate machinery or assert legal compliance.
