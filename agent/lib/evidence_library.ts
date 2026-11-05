/**
 * EduSafe Policy Twin: curated citations from official publisher pages.
 * Snapshot checked on 2026-11-04. No live web access or full ISO text is used.
 * These records are NOT jurisdiction-specific legal determinations.
 */

export const TOPICS = [
  "cnc_guard_safety",
  "machinery_risk_assessment",
  "ai_risk_governance",
  "human_oversight",
  "ai_in_education",
  "itu_architecture",
] as const;

export type EvidenceTopic = (typeof TOPICS)[number];
export type EvidenceKind = "international_standard_metadata" | "voluntary_framework" | "international_recommendation" | "telecom_architecture_standard";

export interface EvidenceSource {
  id: string;
  title: string;
  issuer: string;
  kind: EvidenceKind;
  url: string;
  section: string;
  publisherVerifiedSummary: string;
  topics: EvidenceTopic[];
  limits: string;
  verifiedOn: string;
}

export const EVIDENCE: EvidenceSource[] = [
  {
    id: "ISO-14120-2015",
    title: "ISO 14120:2015 — Safety of machinery — Guards — General requirements for the design and construction of fixed and movable guards",
    issuer: "International Organization for Standardization (ISO)",
    kind: "international_standard_metadata",
    url: "https://www.iso.org/standard/59545.html",
    section: "ISO publisher abstract (not licensed standard clauses)",
    publisherVerifiedSummary: "The official abstract identifies general requirements for design, construction, and selection of guards against mechanical hazards.",
    topics: ["cnc_guard_safety"],
    limits: "Only the public abstract was reviewed. Full standard clauses were not reviewed; its legal status in a specific UAE institution is not established.",
    verifiedOn: "2026-11-04",
  },
  {
    id: "ISO-12100-2010",
    title: "ISO 12100:2010 — Safety of machinery — General principles for design — Risk assessment and risk reduction",
    issuer: "International Organization for Standardization (ISO)",
    kind: "international_standard_metadata",
    url: "https://www.iso.org/standard/51528.html",
    section: "ISO publisher abstract (not licensed standard clauses)",
    publisherVerifiedSummary: "The official abstract describes a methodology for identifying machinery hazards, assessing risks, and reducing risks at the design stage.",
    topics: ["machinery_risk_assessment", "cnc_guard_safety"],
    limits: "Only the public abstract was reviewed. It addresses design safety, not a completed safety audit of any lab.",
    verifiedOn: "2026-11-04",
  },
  {
    id: "NIST-AI-100-1",
    title: "Artificial Intelligence Risk Management Framework (AI RMF 1.0)",
    issuer: "US National Institute of Standards and Technology (NIST)",
    kind: "voluntary_framework",
    url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/",
    section: "Section 5: AI RMF Core; Section 5.1 Govern",
    publisherVerifiedSummary: "The voluntary framework organizes AI risk management around Govern, Map, Measure, and Manage, emphasizing continuous documentation and review.",
    topics: ["ai_risk_governance", "human_oversight"],
    limits: "Voluntary US framework. It is not a UAE statute or proof of certification; NIST indicates that a revision is in progress.",
    verifiedOn: "2026-11-04",
  },
  {
    id: "UNESCO-AI-ETHICS-35-36",
    title: "Recommendation on the Ethics of Artificial Intelligence",
    issuer: "UNESCO",
    kind: "international_recommendation",
    url: "https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence",
    section: "Human oversight and determination, paragraphs 35–36",
    publisherVerifiedSummary: "The Recommendation emphasizes attribution of ethical/legal responsibility to people or organizations and ultimate human accountability for AI-assisted decisions.",
    topics: ["human_oversight", "ai_risk_governance"],
    limits: "International recommendation addressed primarily to Member States; not itself a direct CNC laboratory operating rule.",
    verifiedOn: "2026-11-04",
  },
  {
    id: "UNESCO-AI-ETHICS-104",
    title: "Recommendation on the Ethics of Artificial Intelligence",
    issuer: "UNESCO",
    kind: "international_recommendation",
    url: "https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence",
    section: "Policy Area 8: Education and Research, paragraph 104",
    publisherVerifiedSummary: "The Recommendation encourages research on responsible and ethical AI use in teaching and assessment of its impact on learners and teachers.",
    topics: ["ai_in_education", "human_oversight"],
    limits: "Policy recommendation, not evidence that a particular school, university, or UAE authority adopted it as law.",
    verifiedOn: "2026-11-04",
  },
  {
    id: "ITU-T-Y3172-2019",
    title: "ITU-T Y.3172 — Architectural framework for machine learning in future networks including IMT-2020",
    issuer: "International Telecommunication Union (ITU-T)",
    kind: "telecom_architecture_standard",
    url: "https://www.itu.int/rec/T-REC-Y.3172/en",
    section: "Recommendation Y.3172 (06/2019), title and scope",
    publisherVerifiedSummary: "The recommendation addresses an architectural framework for machine learning in future networks including IMT-2020.",
    topics: ["itu_architecture"],
    limits: "Telecommunications/ML architecture standard, NOT a CNC/robotics safety standard. Analogies must be labelled as design mappings, not compliance.",
    verifiedOn: "2026-11-04",
  },
];

export function lookupPolicyEvidence(topic: EvidenceTopic) {
  const matches = EVIDENCE.filter((source) => source.topics.includes(topic));
  return {
    topic,
    retrievalMode: "Curated local metadata snapshot; no live verification during tool execution",
    publisherPagesCheckedOn: "2026-11-04",
    records: matches,
    status: matches.length ? "publisher_source_metadata_available" : "no_verified_match",
    jurisdictionAssessment: "Unresolved: no UAE-specific legal applicability assessment has been completed.",
    cautions: [
      "A relevant source is not automatically a binding legal requirement.",
      "ISO abstracts do not replace access to full licensed standard clauses.",
      "Record-based source matching is an engineering mapping, not a legal opinion.",
    ],
  };
}
