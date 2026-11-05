# EduSafe Stage 4 — UAE and international AI policy knowledge base

This directory contains a portable JSON **metadata index** for the hackathon's policy/standards knowledge-base requirement. Each entry includes a publisher, exact public URL, date checked, official-page section, high-level paraphrase, source classification, relevant topics, applicability caveat and verification limit. It contains **eight official-publisher records**, not the full texts of laws or standards.

## Important source distinctions

- `uae_federal_law`: binding legal instrument **where its own legal scope applies**; this toy demonstration has no identifiable student data.
- `uae_policy_principles` / `uae_national_strategy`: official policy principles or strategy; **not** a machine guarding law.
- `international_recommendation` / `voluntary_risk_framework`: useful evidence for design; **not automatically legally binding**.
- `international_technical_standard`: ITU-T Y.3172 addresses **telecommunications ML architecture**, not CNC machine guarding. Any stage-to-stage comparison is purely conceptual.
- `itu_readiness_framework`: a multidimensional readiness lens; **not an official score** for an institution.

## Sources indexed

| Source ID | Publisher | Role |
|---|---|---|
| `UAE-PDPL-45-2021` | UAE Government | Conditional personal-data governance applicability |
| `UAE-AI-CHARTER-2024` | UAE Government | Human judgment and accountability |
| `UAE-AI-STRATEGY-2031` | UAE Cabinet | AI-in-education strategic alignment |
| `UAE-AI-CYBER-POLICY` | UAE Government | AI security governance context |
| `UNESCO-AI-ETHICS-2021` | UNESCO | Human oversight and responsible use |
| `NIST-AI-RMF-1` | NIST | Voluntary risk review structure |
| `ITU-T-Y3172-2019` | ITU | Architectural analogy only |
| `ITU-AI-READINESS-2` | ITU | Readiness/gap framework context |

Other original Stage 2 evidence (`agent/lib/evidence_library.ts`) covers **public abstracts** for ISO 14120 and ISO 12100 and separate NIST/UNESCO sections; the licensed ISO texts have **not** been analyzed. The gap proposals cite both Stage 2 and Stage 4 source IDs. Do not interpret them as proof of a violation or an institution's legal obligations.

## Query interface

The TypeScript source of truth is `agent/lib/uae_policy_kb.ts`. Rebuild the portable metadata JSON after changing it:

```cmd
node policykb\export_kb.mjs
```

The local demo exposes a read-only endpoint:

`GET http://127.0.0.1:4173/api/policies?topic=ai_oversight&q=human`

Only the predefined topics are accepted; free-text searches use literal English tokens. There is **no embedding model, live search, vector database, remote ITU Sandbox deployment or legal compliance engine**.

## Next evidence validation

1. Obtain authorized full text of binding UAE/sectoral/institutional rules and licensed ISO standards, retaining license and provenance information.
2. Add paragraph-level identifiers and independent review of any quotation or interpretation.
3. Map each proposed control to an actual education institution's documented hazard and AI governance procedures.
4. Get qualified local safety and legal review before any real machine use or student-data collection.
