// Global Privacy Laws and Regulations Database
export interface PrivacyLaw {
  id: string;
  name: string;
  jurisdiction: string;
  region: string;
  effectiveDate: string;
  keyRequirements: string[];
  penalties: string;
  applicability: string[];
  dataSubjectRights: string[];
  internationalTransfers: string;
  breachNotification: string;
  dpoRequired: boolean;
  consentRequirements: string;
  retentionLimits: string;
  technicalSafeguards: string[];
  organizationalMeasures: string[];
  crossBorderRestrictions: string[];
  healthcareSpecific: string[];
  enforcementBody: string;
  website: string;
}

export const GLOBAL_PRIVACY_LAWS: PrivacyLaw[] = [
  {
    id: "hipaa-usa",
    name: "Health Insurance Portability and Accountability Act (HIPAA)",
    jurisdiction: "United States",
    region: "North America",
    effectiveDate: "1996-08-21",
    keyRequirements: [
      "Protected Health Information (PHI) safeguards",
      "Business Associate Agreements (BAAs)",
      "Administrative, physical, and technical safeguards",
      "Minimum necessary standard",
      "Patient rights and access controls"
    ],
    penalties: "Up to $1.5 million per incident, criminal charges possible",
    applicability: ["Healthcare providers", "Health plans", "Healthcare clearinghouses", "Business associates"],
    dataSubjectRights: ["Access to PHI", "Amendment rights", "Accounting of disclosures", "Restriction requests"],
    internationalTransfers: "Requires adequate safeguards and BAAs",
    breachNotification: "60 days to patients, HHS; immediate for media if >500 affected",
    dpoRequired: false,
    consentRequirements: "Written authorization for most uses/disclosures",
    retentionLimits: "Varies by state, typically 6-10 years",
    technicalSafeguards: ["Access controls", "Audit controls", "Integrity", "Person/entity authentication", "Transmission security"],
    organizationalMeasures: ["Security officer", "Workforce training", "Information access management", "Contingency plan"],
    crossBorderRestrictions: ["BAA required for international vendors", "Adequate country determinations"],
    healthcareSpecific: ["PHI protection", "Medical record access", "Provider communication standards", "Electronic health records security"],
    enforcementBody: "Department of Health and Human Services (HHS)",
    website: "https://www.hhs.gov/hipaa"
  },
  {
    id: "gdpr-eu",
    name: "General Data Protection Regulation (GDPR)",
    jurisdiction: "European Union",
    region: "Europe",
    effectiveDate: "2018-05-25",
    keyRequirements: [
      "Lawful basis for processing",
      "Data protection by design and default",
      "Data Protection Impact Assessments (DPIAs)",
      "Data breach notification",
      "Data subject rights implementation"
    ],
    penalties: "Up to €20 million or 4% of annual global turnover",
    applicability: ["All organizations processing EU resident data", "Healthcare providers", "Research institutions"],
    dataSubjectRights: ["Access", "Rectification", "Erasure", "Portability", "Objection", "Restriction", "Automated decision-making"],
    internationalTransfers: "Adequacy decisions, SCCs, BCRs, or derogations required",
    breachNotification: "72 hours to supervisory authority, immediate to data subjects if high risk",
    dpoRequired: true,
    consentRequirements: "Clear, specific, informed, and freely given consent",
    retentionLimits: "No longer than necessary for purposes",
    technicalSafeguards: ["Pseudonymization", "Encryption", "Access controls", "Regular testing"],
    organizationalMeasures: ["Privacy by design", "Staff training", "Data protection policies", "Vendor management"],
    crossBorderRestrictions: ["Adequacy decisions", "Standard Contractual Clauses", "Binding Corporate Rules"],
    healthcareSpecific: ["Special category health data protection", "Medical research provisions", "Public health exemptions"],
    enforcementBody: "European Data Protection Board (EDPB)",
    website: "https://gdpr.eu"
  },
  {
    id: "pipeda-canada",
    name: "Personal Information Protection and Electronic Documents Act (PIPEDA)",
    jurisdiction: "Canada",
    region: "North America",
    effectiveDate: "2001-01-01",
    keyRequirements: [
      "Accountability for personal information",
      "Identifying purposes for collection",
      "Consent for collection, use, and disclosure",
      "Limiting collection, use, retention, and disclosure",
      "Accuracy and safeguards requirements"
    ],
    penalties: "Up to CAD $100,000 per violation",
    applicability: ["Federal works, undertakings, and businesses", "Healthcare organizations", "Cross-provincial commerce"],
    dataSubjectRights: ["Access to personal information", "Correction rights", "Withdrawal of consent"],
    internationalTransfers: "Adequate protection required, contractual safeguards",
    breachNotification: "Immediate to Privacy Commissioner if real risk of significant harm",
    dpoRequired: false,
    consentRequirements: "Meaningful consent, clear and understandable",
    retentionLimits: "Only as long as necessary for identified purposes",
    technicalSafeguards: ["Appropriate security measures", "Safeguards against loss, theft, unauthorized access"],
    organizationalMeasures: ["Privacy policies", "Staff training", "Breach response procedures"],
    crossBorderRestrictions: ["Comparable level of protection required"],
    healthcareSpecific: ["Health information custodian requirements", "Medical record protection", "Research exemptions"],
    enforcementBody: "Office of the Privacy Commissioner of Canada",
    website: "https://www.priv.gc.ca"
  },
  {
    id: "dpdp-india",
    name: "Digital Personal Data Protection Act (DPDP)",
    jurisdiction: "India",
    region: "Asia",
    effectiveDate: "2023-08-11",
    keyRequirements: [
      "Lawful basis for processing",
      "Data protection notice",
      "Consent management",
      "Data localization requirements",
      "Breach notification obligations"
    ],
    penalties: "Up to ₹250 crores (approximately $30 million USD)",
    applicability: ["All entities processing personal data in India", "Healthcare providers", "Digital platforms"],
    dataSubjectRights: ["Access", "Correction", "Erasure", "Grievance redressal"],
    internationalTransfers: "Restricted countries list, adequacy determinations",
    breachNotification: "Immediate to Data Protection Board",
    dpoRequired: true,
    consentRequirements: "Free, specific, informed, unconditional, and unambiguous consent",
    retentionLimits: "Limited to purpose fulfillment",
    technicalSafeguards: ["Reasonable security practices", "Data breach prevention measures"],
    organizationalMeasures: ["Data protection policies", "Grievance officer appointment", "Audit requirements"],
    crossBorderRestrictions: ["Restricted countries", "Government approval for certain transfers"],
    healthcareSpecific: ["Health data as sensitive personal data", "Medical research provisions", "Telemedicine compliance"],
    enforcementBody: "Data Protection Board of India",
    website: "https://www.meity.gov.in"
  },
  {
    id: "lgpd-brazil",
    name: "Lei Geral de Proteção de Dados (LGPD)",
    jurisdiction: "Brazil",
    region: "South America",
    effectiveDate: "2020-09-18",
    keyRequirements: [
      "Legal basis for processing",
      "Data protection principles",
      "Data subject rights",
      "Data Protection Officer appointment",
      "Impact assessments"
    ],
    penalties: "Up to R$ 50 million per violation or 2% of revenue",
    applicability: ["All organizations processing personal data in Brazil", "Healthcare entities", "Research institutions"],
    dataSubjectRights: ["Access", "Correction", "Anonymization", "Blocking", "Elimination", "Portability"],
    internationalTransfers: "Adequate protection level, specific guarantees",
    breachNotification: "Reasonable timeframe to authority and data subjects",
    dpoRequired: true,
    consentRequirements: "Free, informed, and unambiguous consent",
    retentionLimits: "Necessary for purpose fulfillment",
    technicalSafeguards: ["Security measures", "Risk prevention", "Incident response"],
    organizationalMeasures: ["Privacy governance", "DPO appointment", "Impact assessments"],
    crossBorderRestrictions: ["Adequate protection level required"],
    healthcareSpecific: ["Health data as sensitive", "Medical research allowances", "Public health exemptions"],
    enforcementBody: "Autoridade Nacional de Proteção de Dados (ANPD)",
    website: "https://www.gov.br/anpd"
  },
  {
    id: "pdpa-singapore",
    name: "Personal Data Protection Act (PDPA)",
    jurisdiction: "Singapore",
    region: "Asia",
    effectiveDate: "2014-07-02",
    keyRequirements: [
      "Consent for collection, use, and disclosure",
      "Purpose limitation",
      "Notification obligations",
      "Access and correction provisions",
      "Data breach notification"
    ],
    penalties: "Up to SGD $1 million",
    applicability: ["All organizations in Singapore", "Healthcare providers", "Commercial entities"],
    dataSubjectRights: ["Access", "Correction", "Withdrawal of consent"],
    internationalTransfers: "Adequate protection standard",
    breachNotification: "Immediate to PDPC if significant harm likely",
    dpoRequired: true,
    consentRequirements: "Voluntary provision of consent",
    retentionLimits: "Cease retention when purposes are no longer served",
    technicalSafeguards: ["Reasonable security arrangements", "Protection against unauthorized access"],
    organizationalMeasures: ["DPO appointment", "Data governance framework", "Staff training"],
    crossBorderRestrictions: ["Adequate level of protection required"],
    healthcareSpecific: ["Healthcare data protection requirements", "Medical research provisions"],
    enforcementBody: "Personal Data Protection Commission (PDPC)",
    website: "https://www.pdpc.gov.sg"
  },
  {
    id: "popia-south-africa",
    name: "Protection of Personal Information Act (POPIA)",
    jurisdiction: "South Africa",
    region: "Africa",
    effectiveDate: "2021-07-01",
    keyRequirements: [
      "Lawfulness of processing",
      "Purpose specification",
      "Further processing limitation",
      "Information quality",
      "Openness and transparency"
    ],
    penalties: "Up to ZAR 10 million or 10 years imprisonment",
    applicability: ["All entities processing personal information", "Healthcare providers", "Research institutions"],
    dataSubjectRights: ["Access", "Correction", "Objection", "Deletion"],
    internationalTransfers: "Adequate level of protection required",
    breachNotification: "Immediate to Information Regulator",
    dpoRequired: true,
    consentRequirements: "Voluntary, specific, and informed consent",
    retentionLimits: "No longer than necessary",
    technicalSafeguards: ["Reasonable technical measures", "Integrity and confidentiality"],
    organizationalMeasures: ["Information officer appointment", "Privacy policies", "Impact assessments"],
    crossBorderRestrictions: ["Adequate protection level", "Binding instruments"],
    healthcareSpecific: ["Health information as special personal information", "Medical research exemptions"],
    enforcementBody: "Information Regulator South Africa",
    website: "https://www.justice.gov.za/inforeg"
  },
  {
    id: "ccpa-california",
    name: "California Consumer Privacy Act (CCPA/CPRA)",
    jurisdiction: "California, USA",
    region: "North America",
    effectiveDate: "2020-01-01",
    keyRequirements: [
      "Consumer right to know",
      "Consumer right to delete",
      "Consumer right to opt-out",
      "Non-discrimination provisions",
      "Privacy policy requirements"
    ],
    penalties: "Up to $7,500 per intentional violation",
    applicability: ["Businesses meeting revenue/data thresholds", "Healthcare entities", "Data brokers"],
    dataSubjectRights: ["Know", "Delete", "Opt-out", "Non-discrimination", "Correct"],
    internationalTransfers: "No specific restrictions",
    breachNotification: "Reasonable security standards required",
    dpoRequired: false,
    consentRequirements: "Opt-in for sensitive personal information",
    retentionLimits: "Reasonable retention periods",
    technicalSafeguards: ["Reasonable security procedures", "Encryption when appropriate"],
    organizationalMeasures: ["Privacy policies", "Consumer request procedures", "Employee training"],
    crossBorderRestrictions: ["Limited restrictions"],
    healthcareSpecific: ["Health information as sensitive", "Medical research considerations"],
    enforcementBody: "California Privacy Protection Agency (CPPA)",
    website: "https://cppa.ca.gov"
  },
  {
    id: "privacy-act-australia",
    name: "Privacy Act 1988 (Australia)",
    jurisdiction: "Australia",
    region: "Oceania",
    effectiveDate: "1988-12-16",
    keyRequirements: [
      "Australian Privacy Principles (APPs)",
      "Consent and notification",
      "Data quality and security",
      "Access and correction",
      "Cross-border disclosure restrictions"
    ],
    penalties: "Up to AUD $2.2 million for serious or repeated breaches",
    applicability: ["Federal agencies", "Private sector organizations with turnover >AUD $3M", "Healthcare providers"],
    dataSubjectRights: ["Access", "Correction", "Complaints"],
    internationalTransfers: "Reasonable steps to ensure adequate protection",
    breachNotification: "Immediate to OAIC if likely to result in serious harm",
    dpoRequired: false,
    consentRequirements: "Consent must be voluntary, current, specific, and informed",
    retentionLimits: "Destroy or de-identify when no longer needed",
    technicalSafeguards: ["Reasonable security measures", "Protection against misuse and loss"],
    organizationalMeasures: ["Privacy policies", "Staff training", "Complaint handling"],
    crossBorderRestrictions: ["Reasonable steps for adequate protection"],
    healthcareSpecific: ["Health information privacy requirements", "My Health Records Act", "Therapeutic Goods Administration"],
    enforcementBody: "Office of the Australian Information Commissioner (OAIC)",
    website: "https://www.oaic.gov.au"
  },
  {
    id: "lei-13709-brazil-health",
    name: "Brazilian Health Data Protection Regulations",
    jurisdiction: "Brazil",
    region: "South America",
    effectiveDate: "2020-09-18",
    keyRequirements: [
      "Health data as sensitive personal data",
      "Specific consent for health data processing",
      "Medical research exemptions",
      "Telemedicine compliance",
      "Electronic health record security"
    ],
    penalties: "Up to R$ 50 million per violation",
    applicability: ["Healthcare providers", "Health insurers", "Telemedicine platforms", "Health research institutions"],
    dataSubjectRights: ["Access to health records", "Correction", "Portability", "Deletion (with exceptions)"],
    internationalTransfers: "Strict requirements for health data transfers",
    breachNotification: "Immediate notification for health data breaches",
    dpoRequired: true,
    consentRequirements: "Explicit consent for health data processing",
    retentionLimits: "Based on medical and legal requirements",
    technicalSafeguards: ["End-to-end encryption", "Access logging", "Audit trails"],
    organizationalMeasures: ["Health data governance", "Medical ethics compliance", "Professional confidentiality"],
    crossBorderRestrictions: ["Enhanced protection for health data exports"],
    healthcareSpecific: ["Electronic health records", "Telemedicine platforms", "Medical research data", "Health insurance processing"],
    enforcementBody: "ANPD + Ministry of Health",
    website: "https://www.gov.br/saude"
  }
];

export const REGIONAL_COMPLIANCE_FRAMEWORKS = {
  "North America": ["HIPAA", "PIPEDA", "CCPA", "State privacy laws"],
  "Europe": ["GDPR", "ePrivacy Directive", "Medical Device Regulation", "National health laws"],
  "Asia Pacific": ["PDPA Singapore", "PDPA Thailand", "DPDP India", "Privacy Act Australia", "PIPL China"],
  "Latin America": ["LGPD Brazil", "Ley de Protección Argentina", "Mexican privacy laws"],
  "Africa": ["POPIA South Africa", "Kenya Data Protection Act", "Nigerian NDPR"],
  "Middle East": ["UAE Data Protection Law", "Qatar privacy regulations", "Saudi Arabia PDL"]
};

export const MULTICULTURAL_HEALTHCARE_CONSIDERATIONS = {
  "Cultural Competency": [
    "Language preferences and interpretation services",
    "Religious and spiritual considerations in healthcare",
    "Cultural attitudes toward medical treatments",
    "Family involvement in healthcare decisions",
    "Traditional and complementary medicine integration"
  ],
  "Communication Patterns": [
    "Direct vs. indirect communication styles",
    "Eye contact and physical touch preferences",
    "Authority and hierarchy in healthcare settings",
    "Gender-specific healthcare considerations",
    "Community-based decision making"
  ],
  "Traditional Medicine Systems": [
    "Traditional Chinese Medicine (TCM)",
    "Ayurveda (Indian traditional medicine)",
    "Unani medicine (Islamic traditional medicine)",
    "African traditional medicine",
    "Indigenous healing practices",
    "Homeopathy and naturopathy",
    "Acupuncture and acupressure",
    "Herbal medicine and phytotherapy"
  ],
  "Religious Healthcare Practices": [
    "Islamic healthcare principles (Halal medical treatments)",
    "Jewish healthcare laws (Halacha medical ethics)",
    "Christian healing traditions",
    "Hindu medical ethics and practices",
    "Buddhist mindfulness in healthcare",
    "Indigenous spiritual healing",
    "Prayer and meditation in treatment"
  ]
};

export function getApplicablePrivacyLaws(jurisdiction: string, dataTypes: string[]): PrivacyLaw[] {
  return GLOBAL_PRIVACY_LAWS.filter(law => 
    law.jurisdiction.toLowerCase().includes(jurisdiction.toLowerCase()) ||
    law.region.toLowerCase().includes(jurisdiction.toLowerCase()) ||
    (dataTypes.includes('health') && law.healthcareSpecific.length > 0)
  );
}

export function getPrivacyLawRequirements(lawIds: string[]): string[] {
  const requirements = new Set<string>();
  
  lawIds.forEach(lawId => {
    const law = GLOBAL_PRIVACY_LAWS.find(l => l.id === lawId);
    if (law) {
      law.keyRequirements.forEach(req => requirements.add(req));
      law.technicalSafeguards.forEach(safeguard => requirements.add(safeguard));
      law.organizationalMeasures.forEach(measure => requirements.add(measure));
    }
  });
  
  return Array.from(requirements);
}

export function validateCrossBorderTransfer(
  sourceCountry: string, 
  targetCountry: string, 
  dataTypes: string[]
): { allowed: boolean; requirements: string[]; risks: string[] } {
  const sourceLaws = getApplicablePrivacyLaws(sourceCountry, dataTypes);
  const requirements: string[] = [];
  const risks: string[] = [];
  
  sourceLaws.forEach(law => {
    requirements.push(...law.crossBorderRestrictions);
    if (dataTypes.includes('health') && law.healthcareSpecific.length > 0) {
      requirements.push("Enhanced health data protection measures required");
      risks.push("Health data subject to additional restrictions");
    }
  });
  
  return {
    allowed: requirements.length === 0 || requirements.every(req => !req.includes("prohibited")),
    requirements: [...new Set(requirements)],
    risks: [...new Set(risks)]
  };
}