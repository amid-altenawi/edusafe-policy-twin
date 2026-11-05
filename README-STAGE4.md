# EduSafe Policy Twin — Stage 4

**AI for Good Sandbox Hackathon UAE 2026 · Education · 5 November 2026**

**Project owner:** AMED ALTENAWI (عميد بشار التيناوي)

## 1. What this delivery adds

- UAE-focused offline policy **metadata** knowledge base with eight official publisher source records. Each record has a classification, link, checked date, source scope and legal limitations.
- Searchable read-only policy API: `GET /api/policies?topic=ai_oversight&q=human`.
- Two Eve tools: `query_uae_policy_kb` and `analyze_uae_policy_gaps`.
- Three source-linked **candidate** institutional gaps (not legal findings): escalation/authorization SOP, verification of machine guarding standards, and conditional student-data governance.
- Extended Arabic/English dashboard that displays sources and proposed gaps; audit JSON includes both.
- Editable technical report in `.docx` and a matching `.pdf` for review. **This is a draft, not the official organizer template.**
- Six new Node tests. In the merged Stage 1–4 workspace, **15/15 tests pass**.

## 2. Install into the existing Windows project

The ZIP is an **overlay**, not a complete project. Use your existing repository:

`C:\Users\ASUS\edusafe-policy-twin`

**Important:** If the local demo is still running, press **Ctrl+C** in its Command Prompt first. The archive replaces `demo/index.html` and `demo/server.mjs`; copy those two files to a temporary backup if you have added personal edits since Stage 3.

In Windows File Explorer, open `edusafe-stage4.zip`, select **Extract all**, and choose `C:\Users\ASUS\edusafe-policy-twin` as the destination. Confirm folder merging and replacement of Stage 3 demo files. Do not extract into an accidental nested `edusafe-stage4` folder. Check that this path exists afterward:

`C:\Users\ASUS\edusafe-policy-twin\policykb\verified_sources.json`

**One CMD command at a time:**

Test the project:

```cmd
node --test "C:\Users\ASUS\edusafe-policy-twin\tests\*.test.mjs"
```

If tests pass, start the demo:

```cmd
node "C:\Users\ASUS\edusafe-policy-twin\demo\server.mjs"
```

Open **exactly** `http://127.0.0.1:4173/` in Chrome's address bar (not the Google search field). The terminal running the server must remain open while using the dashboard. The UI is local, simulated and has no external resources or hardware access.

## 3. Demonstration script

1. Select **Five-event intervention** and press **Run all**. The timeline progresses `HIGH → CRITICAL → MEDIUM → MEDIUM → LOW` (qualitative severity only).
2. Locate the new **UAE Policy Knowledge Base** and **Policy Gap Candidates** sections. Show the source publisher links, class distinctions, verification limits, and human-approval warning.
3. Select **No supervisor intervention**. Risk remains `CRITICAL` after the second event. Explain that the human escalation gate cannot be bypassed.
4. Export the audit JSON; note that it includes the event trace, source metadata and proposals.
5. Optionally show `http://127.0.0.1:4173/api/policies?topic=student_data_privacy` as a direct structured response.

## 4. Knowledge-base and legal integrity

This is **not** a full legal database, trained policy AI, external ITU Sandbox integration, vector search, or declaration of national compliance.

The UAE Personal Data Protection Law, where applicable, must be assessed separately; this simulation uses synthetic events and no identifiable student data. UAE strategy and AI charter are not machine operation laws. UNESCO and NIST are guidance, while ITU-T Y.3172 concerns **ML in future telecommunications networks** and is mapped only as a conceptual architectural analogy. Public ISO abstracts from Stage 2 are **not** the full licensed standards and do not prove local adoption. No action from this demo authorizes a real CNC restart.

Read `policykb/README.md` for the source classification and review backlog. Rebuild the standalone JSON after editing the TS records using `node policykb\export_kb.mjs`.

## 5. Technical submission preparation

The `submission` directory contains the report draft. It presents the Education use case, architecture, ITU conceptual mapping, knowledge-base sources, the 15-test result, three gap candidates and honest limitations.

**Before submitting:**

- Download the organizer's **official DOCX submission template** from the event page and transfer this report's content into its required fields. Compare all requirements; the supplied report is **not** that template.
- Obtain explicit team consent before sharing personal information, or use only synthetic incident data.
- Because the current GitHub repository is **private**, arrange judge access through the organizer's specified method; do not change public visibility without reviewing the repository.
- Confirm registered-team identity, report page limit (the generated draft is **3 pages** as rendered), repository URL, access arrangements and any separate submission form requirements.
- If time permits, record an optional short demo video; emphasize simulation, verifiable source metadata, and the human approval gate.
- Do not upload the report as proof of legally verified laboratory safety.

## 6. Stage 5 target

Move from metadata-only lookup to verified paragraph-level retrieval from permitted public and licensed source texts; log traceable evidence IDs, introduce separate policy and review roles, test citation fidelity and use an institutionally validated use case. A live system and regulatory conformance must be independently audited.
