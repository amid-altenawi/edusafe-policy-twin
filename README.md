# EduSafe Policy Twin

**An auditable, human-supervised research prototype for AI safety in engineering education.**

> **SIMULATED RESEARCH DEMONSTRATION.** EduSafe does not operate CNC machines, verify a physical guard, observe sensors, certify compliance, or authorize the resumption of a laboratory session.

**Project lead:** AMED ALTENAWI — Mechatronics and Robotics researcher and PhD candidate.
**Project track:** Education · AI-assisted teaching · engineering laboratory safety.
**Prepared for:** AI for Good Lab Hackathon, UAE 2026 (independent participant project; no endorsement implied).

## The problem

AI assistants can produce confident but unsafe technical guidance. In practical engineering education, an unreviewed recommendation to bypass a protective guard could put students and staff at risk. Training institutions also need traceable incident decisions and a clear distinction between standards, voluntary guidance, and binding local rules.

## The proposed solution

EduSafe Policy Twin models **fictional, sequential laboratory incidents** using a deterministic state-transition engine and maps them to a **curated snapshot of official publisher references**. Its primary output is an auditable decision-support summary for an authorized human supervisor.

The current prototype demonstrates three *analytical perspectives* rather than three independent AI agents:

1. **Safety analyst:** identifies the safety hazard, escalation, and mitigations.
2. **Policy analyst:** maps relevant published reference metadata and highlights unverified applicability.
3. **Incident coordinator:** tracks the event timeline, changing risk classification, and required human approvals.

## Live local demo — Stage 3

Requirements: Node.js 24+ (including Node 26 on Windows). The existing Eve project, simulator, and evidence files must be present.

From the project folder, run:

```bash
node demo/server.mjs
```

Open **http://127.0.0.1:4173** in your browser.

The bilingual English/Arabic dashboard lets evaluators:

- Review the five-event CNC incident and **HIGH → CRITICAL → MEDIUM → MEDIUM → LOW** risk progression.
- Step through individual events, replay them, or switch to an unresolved two-event scenario.
- Explore the event rationale and dated reference records.
- See the persistent **human-approval gate** even when simulated risk is LOW.
- Export a JSON audit record for the events currently displayed.

The local HTTP API directly imports `agent/lib/simulate_cnc_lab.ts` and `agent/lib/evidence_library.ts`. This keeps the browser demonstration aligned with the existing tested source rather than using a separate hard-coded risk calculation. It uses only the local machine, listens on `127.0.0.1`, and requires no additional cloud account or API key.

### Scenario demonstrated

| Step | Simulated event ID | Risk after event | Interpretation |
| --- | --- | --- | --- |
| 1 | `ai_suggests_guard_override` | **HIGH** | Unsafe AI recommendation recorded. |
| 2 | `student_requests_machine_start` | **CRITICAL** | Machine-start request adds urgency while hazard remains unresolved. |
| 3 | `supervisor_pauses_session` | **MEDIUM** | Session is paused; corrective review is incomplete. |
| 4 | `guard_is_inspected` | **MEDIUM** | Inspection is recorded *in simulation*, not physically verified. |
| 5 | `safety_briefing_completed` | **LOW** | Mitigations recorded, but machine operation is **not authorized**. |

### What the prototype genuinely implements

- A deterministic, fictional CNC incident engine with chronological event state changes.
- Eve tools for incident replay, topic-based evidence lookup, and source-enriched incident reporting.
- A locally curated publisher-reference metadata set with issuer, URL, section, limitations, and snapshot date.
- Tests for safety-risk escalation, evidence metadata integrity, and browser demo API behavior.
- Human-oversight statements and an explicit no-machine-control constraint.

### What it does **not** implement

- A physical or continuously synchronized digital twin.
- Live sensor data, machine communications, machine control, or guard-state verification.
- Three autonomous software agents with independent reasoning and evaluations.
- Real-time legal research, complete licensed ISO standard clauses, or a verified UAE regulatory analysis.
- Regulatory certification, legal advice, or a decision authorizing a real machine to resume.
- Measured predictive accuracy or real-world safety effectiveness.

## Evidence integrity

EduSafe records **source metadata**, not proofs of legal applicability. The following official publisher pages were curated into the local knowledge snapshot dated **2026-11-04**:

| Reference | Issuer | What was consulted | Material limitation |
| --- | --- | --- | --- |
| [ISO 14120:2015](https://www.iso.org/standard/59545.html) | ISO | Public publisher abstract on machinery guards | Full clauses and local applicability not reviewed |
| [ISO 12100:2010](https://www.iso.org/standard/51528.html) | ISO | Public publisher abstract on machinery risk assessment | Does not constitute a laboratory safety audit |
| [AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) | NIST | §5 and §5.1, governance functions | Voluntary US risk-management framework |
| [Recommendation on the Ethics of AI](https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence) | UNESCO | ¶35–36, human oversight; ¶104, education | International recommendation; not a CNC operating law |

The repository also stores [ITU-T Y.3172](https://www.itu.int/rec/T-REC-Y.3172/en) as **telecommunications and machine-learning architecture metadata only**. It is *not* a CNC or robotics safety standard and is not used as one.

**Unverified:** the applicable UAE and institutional safety rules, the full ISO clause text, manufacturer instructions, real supervisor qualifications, actual machine condition, and audit-grade evidence of compliance. These require competent human review before any real-world use.

## Architecture

```text
Browser dashboard (demo/index.html)
         │  local HTTP JSON requests
         ▼
Local demo adapter (demo/server.mjs)
         ├── agent/lib/simulate_cnc_lab.ts
         └── agent/lib/evidence_library.ts

Eve agent (agent/agent.ts) ── existing Eve tools ── same simulator and evidence data
```

The browser demo is an independent local visualization of the same domain libraries. It is not an authenticated public web service and does not communicate with Eve sessions through the dashboard.

## Reproducibility

From the project root:

```bash
node --test
```

To run the Eve agent's conversational development interface:

```bash
npx eve dev
```

The tests validate the expected deterministic behavior and local API contracts; they are not field-safety validation.

## Research roadmap

1. Complete a clear judge-facing user journey and reproducible demonstration artifacts.
2. Expand scenario coverage and add adversarial/edge-case evaluations with explicit scoring.
3. Add human-validated UAE institutional and regulatory mappings, if available and applicable.
4. Explore authorized privacy-preserving educational data and expert-reviewed outcomes.
5. Investigate a genuine digital-twin architecture only after safe, authorized instrumentation becomes feasible.

## Safety and responsible use

All scenarios in this repository are **SIMULATED**. Never use the output to bypass guards, defeat interlocks, command machinery, or infer that a specific physical machine is safe. Decisions involving students, physical equipment, or legal duties must remain with the authorized human professionals and institution.

**Project lead:** AMED ALTENAWI · EduSafe Policy Twin · UAE 2026 research prototype.
