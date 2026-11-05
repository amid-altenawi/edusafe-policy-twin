/**
 * EduSafe Policy Twin Stage 4: dated, curated, publisher-grounded metadata.
 * These are concise paraphrases of official PUBLIC pages, not replicated statutes.
 * Applicability and binding effect must be checked by a qualified human.
 */

export const POLICY_TOPICS = [
  "student_data_privacy",
  "ai_oversight",
  "ai_governance",
  "laboratory_safety",
  "education_ai",
  "ai_security",
  "risk_management",
  "itu_alignment",
] as const;

export type PolicyTopic = (typeof POLICY_TOPICS)[number];
export type PolicyCategory =
  | "uae_federal_law"
  | "uae_national_strategy"
  | "uae_policy_principles"
  | "international_recommendation"
  | "voluntary_risk_framework"
  | "international_technical_standard"
  | "itu_readiness_framework";

export interface PolicyRecord {
  id: string;
  title: string;
  issuer: string;
  category: PolicyCategory;
  country: "UAE" | "International";
  url: string;
  verifiedSection: string;
  verifiedSummary: string;
  topics: PolicyTopic[];
  applicationNote: string;
  verificationLimit: string;
  checkedOn: "2026-11-05";
}

export const UAE_POLICY_KB: PolicyRecord[] = [
  {
    id: "UAE-PDPL-45-2021",
    title: "Federal Decree-Law No. 45 of 2021 Concerning the Protection of Personal Data",
    issuer: "UAE Government / UAE Legislation",
    category: "uae_federal_law",
    country: "UAE",
    url: "https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws",
    verifiedSection: "Personal Data Protection Law — official UAE Government overview",
    verifiedSummary:
      "The official overview describes rules for personal-data processing, confidentiality, individual rights and cross-border transfers, with statutory exceptions and scope conditions.",
    topics: ["student_data_privacy", "ai_governance"],
    applicationNote:
      "Potentially relevant IF real, identifiable student or staff data are processed and the applicable legal scope is met. Current demo uses fictional events and no personal data.",
    verificationLimit:
      "Overview only; no claim that every UAE institution or all education records are governed identically. Check full law, implementing rules and institutional context.",
    checkedOn: "2026-11-05",
  },
  {
    id: "UAE-AI-CHARTER-2024",
    title: "UAE Charter for the Development and Use of Artificial Intelligence",
    issuer: "UAE Government / Artificial Intelligence Office",
    category: "uae_policy_principles",
    country: "UAE",
    url: "https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/policies/Ai/The-UAE-Charter-for-the-Development-and-Use-of-Artificial-Intelligence",
    verifiedSection: "Policy Objectives — human judgement and AI oversight",
    verifiedSummary:
      "The UAE Charter recognizes the value of human judgment, oversight, governance and accountability in AI development and use.",
    topics: ["ai_oversight", "ai_governance", "education_ai"],
    applicationNote:
      "Supports a proposed human-in-the-loop review gate. It is a policy principle, not a directly evidenced CNC machine-start rule.",
    verificationLimit:
      "Do not present the Charter alone as a penal law or a certified laboratory SOP.",
    checkedOn: "2026-11-05",
  },
  {
    id: "UAE-AI-STRATEGY-2031",
    title: "UAE National Strategy for Artificial Intelligence 2031",
    issuer: "UAE Cabinet",
    category: "uae_national_strategy",
    country: "UAE",
    url: "https://uaecabinet.ae/en/news/uae-cabinet-adopts-national-artificial-intelligence-strategy-2031",
    verifiedSection: "21 April 2019 Cabinet announcement — strategic objectives",
    verifiedSummary:
      "The UAE Cabinet approved an AI strategy addressing education, skills, research, data infrastructure, governance and AI adoption in priority sectors.",
    topics: ["education_ai", "ai_governance", "itu_alignment"],
    applicationNote:
      "National policy context for education-focused AI innovation; does not by itself establish local classroom or machine-guard requirements.",
    verificationLimit: "Strategic aims are not statutory CNC safety obligations.",
    checkedOn: "2026-11-05",
  },
  {
    id: "UAE-AI-CYBER-POLICY",
    title: "National Cyber Security Policy for Artificial Intelligence",
    issuer: "UAE Government",
    category: "uae_policy_principles",
    country: "UAE",
    url: "https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/policies/cyber-activities/The-National-Cyber-Security-Policy-for-Artificial-Intelligence",
    verifiedSection: "Official policy overview — governance and human oversight",
    verifiedSummary:
      "The official overview addresses AI/ML security governance, tailored safeguards, human oversight in critical decisions and resilience testing.",
    topics: ["ai_security", "ai_oversight", "risk_management"],
    applicationNote:
      "Candidate source for securing AI-generated educational recommendations and reviewing critical scenarios.",
    verificationLimit:
      "Full policy controls, sector coverage, and whether this prototype is in scope require further review; no certified compliance claim.",
    checkedOn: "2026-11-05",
  },
  {
    id: "UNESCO-AI-ETHICS-2021",
    title: "UNESCO Recommendation on the Ethics of Artificial Intelligence",
    issuer: "UNESCO",
    category: "international_recommendation",
    country: "International",
    url: "https://www.unesco.org/en/artificial-intelligence/recommendation-ethics",
    verifiedSection: "Core principles — safety, transparency, responsibility, human oversight",
    verifiedSummary:
      "UNESCO identifies safety, accountability, traceability, privacy and ultimate human oversight as central AI ethics principles.",
    topics: ["ai_oversight", "education_ai", "risk_management", "ai_governance"],
    applicationNote:
      "International ethics comparator for simulated safety incidents and education governance recommendations.",
    verificationLimit:
      "A UNESCO recommendation is not automatically binding on a particular university or CNC laboratory.",
    checkedOn: "2026-11-05",
  },
  {
    id: "NIST-AI-RMF-1",
    title: "NIST Artificial Intelligence Risk Management Framework 1.0",
    issuer: "US National Institute of Standards and Technology",
    category: "voluntary_risk_framework",
    country: "International",
    url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/",
    verifiedSection: "AI RMF Core — Govern, Map, Measure and Manage; MAP 3.5",
    verifiedSummary:
      "The voluntary framework structures risk practice into Govern, Map, Measure and Manage, including documenting human oversight processes.",
    topics: ["risk_management", "ai_oversight", "ai_governance"],
    applicationNote:
      "Design reference for structured incident logging, risk reasoning and supervised mitigation.",
    verificationLimit:
      "Voluntary US framework, not UAE law. NIST states updates are under development.",
    checkedOn: "2026-11-05",
  },
  {
    id: "ITU-T-Y3172-2019",
    title: "ITU-T Y.3172 Architectural framework for machine learning in future networks including IMT-2020",
    issuer: "International Telecommunication Union",
    category: "international_technical_standard",
    country: "International",
    url: "https://www.itu.int/ITU-T/recommendations/rec.aspx?id=13894",
    verifiedSection: "Recommendation scope and architectural abstract (06/2019)",
    verifiedSummary:
      "Y.3172 specifies machine-learning pipeline, management and orchestration components for future telecommunications networks.",
    topics: ["itu_alignment", "ai_governance"],
    applicationNote:
      "Contest-requested ARCHITECTURE ANALOGY: data collection, evidence indexing, scenario processing, human review and output traceability.",
    verificationLimit:
      "Telecom/ML architecture; not a CNC machine safety standard and no claim of formal Y.3172 conformity.",
    checkedOn: "2026-11-05",
  },
  {
    id: "ITU-AI-READINESS-2",
    title: "AI Ready Analysis Towards a Standardized Readiness Framework Report 2.0",
    issuer: "International Telecommunication Union",
    category: "itu_readiness_framework",
    country: "International",
    url: "https://www.itu.int/hub/publication/t-ai4g-ai4good-2025-6/",
    verifiedSection: "Framework analysis — 13 readiness dimensions and policy gaps",
    verifiedSummary:
      "ITU AI Readiness Report 2.0 discusses 13 readiness dimensions and the identification of implementation, standards and policy gaps.",
    topics: ["itu_alignment", "ai_governance", "education_ai"],
    applicationNote:
      "Reference for mapping readiness limitations in data availability, oversight, technical assurance and skills.",
    verificationLimit:
      "Mapping dimensions is qualitative and does not constitute a national AI readiness measurement or official rating.",
    checkedOn: "2026-11-05",
  },
];

export interface PolicyQuery {
  topic?: PolicyTopic;
  text?: string;
  limit?: number;
}

function tokenize(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9]+/g)?.filter((term) => term.length >= 3) ?? [];
}

export function queryUaePolicyKnowledgeBase({ topic, text = "", limit = 8 }: PolicyQuery = {}) {
  const terms = [...new Set(tokenize(text))];
  const boundedLimit = Math.min(Math.max(Number.isFinite(limit) ? Math.floor(limit) : 8, 1), 8);
  const matches = UAE_POLICY_KB.map((record) => {
    const subjectMatch = topic ? record.topics.includes(topic) : true;
    const haystack = `${record.id} ${record.title} ${record.verifiedSummary} ${record.topics.join(" ")}`.toLowerCase();
    const termScore = terms.filter((term) => haystack.includes(term)).length;
    return { record, subjectMatch, termScore };
  }).filter(({ subjectMatch, termScore }) => subjectMatch && (terms.length === 0 || termScore > 0))
    .sort((a, b) => b.termScore - a.termScore || a.record.id.localeCompare(b.record.id))
    .slice(0, boundedLimit)
    .map(({ record, termScore }) => ({ ...record, termScore }));

  return {
    query: { topic: topic ?? null, text, limit: boundedLimit },
    mode: "offline curated publisher metadata with literal keyword search; NOT vector retrieval",
    checkedOn: "2026-11-05",
    totalRecords: UAE_POLICY_KB.length,
    matches,
    evidenceStatus: matches.length ? "publisher_metadata_matches_found" : "no_verified_match",
    warnings: [
      "The official reference must be checked again for real-world deployment and legal applicability.",
      "A strategy, policy principle, recommendation or voluntary standard is not automatically binding law.",
      "No machine-safety assessment or permission to operate machinery is conferred.",
    ],
  };
}

export function assessUaePolicyGaps(simulation: {
  latestRisk: string;
  incidentState: { unsafeSuggestionRecorded: boolean; machineStartRequested: boolean; trainingSessionPaused: boolean; approvedToResume: boolean };
}) {
  const riskCritical = simulation.latestRisk === "CRITICAL" || simulation.latestRisk === "HIGH";
  return {
    assessmentType: "Illustrative policy and implementation gap candidates; NOT a legal finding",
    gaps: [
      {
        id: "GAP-01",
        kind: "institutional_implementation_gap",
        observation: "No institution-specific documented procedure for responding to an AI suggestion to defeat a laboratory guard has been supplied.",
        proposedControl: "Publish an instructor-approved stop, escalate, inspect and restart-authorization procedure with role ownership.",
        evidenceIds: ["UAE-AI-CHARTER-2024", "NIST-AI-RMF-1", "UNESCO-AI-ETHICS-2021"],
        status: "proposal_requires_institutional_review",
      },
      {
        id: "GAP-02",
        kind: "standards_applicability_gap",
        observation: "Public ISO abstracts are not enough to establish exact protective-guard clauses or UAE adoption for the fictional laboratory.",
        proposedControl: "Have a qualified safety officer check full licensed ISO 14120 / ISO 12100 text and applicable local rules.",
        evidenceIds: ["ISO-14120-2015", "ISO-12100-2010"],
        status: "requires_full_standard_and_local_rule_review",
      },
      {
        id: "GAP-03",
        kind: "data_governance_gap",
        observation: "The prototype uses synthetic records; a real educational deployment would require reviewing personal-data handling, role permissions and retention.",
        proposedControl: "Perform an institutional data inventory and a conditional UAE data protection applicability review before collecting student information.",
        evidenceIds: ["UAE-PDPL-45-2021", "UAE-AI-CYBER-POLICY"],
        status: "conditional_only_no_personal_data_in_demo",
      },
    ],
    immediateHumanReview: riskCritical || !simulation.incidentState.trainingSessionPaused,
    approvedToOperate: false,
    reasoningSummary: riskCritical
      ? "Unresolved unsafe simulated recommendation and/or machine-start request; prompt human escalation remains necessary."
      : "Simulation shows mitigations recorded, but restart permission and formal compliance remain unverified.",
    evidenceClaimScope: "Bibliographic source alignment and proposals only; no citation establishes a binding CNC operating rule here.",
  };
}
