// Comprehensive healthcare and life sciences domains and use cases

export interface HealthcareDomain {
  id: string;
  name: string;
  description: string;
  category: "clinical" | "research" | "pharma" | "medtech" | "admin" | "public-health";
  useCases: UseCase[];
  commonTechStacks: string[];
  regulatoryRequirements: string[];
  keyIntegrations: string[];
}

export interface UseCase {
  id: string;
  name: string;
  description: string;
  complexity: "simple" | "moderate" | "complex" | "enterprise";
  timeToMarket: string;
  platforms: ("web" | "mobile" | "desktop" | "api")[];
  complianceRequired: string[];
}

export const HEALTHCARE_DOMAINS: HealthcareDomain[] = [
  {
    id: "clinical-care",
    name: "Clinical Care & Patient Management",
    description: "Direct patient care applications and clinical workflows",
    category: "clinical",
    useCases: [
      {
        id: "ehr-system",
        name: "Electronic Health Records (EHR)",
        description: "Comprehensive patient data management system",
        complexity: "enterprise",
        timeToMarket: "6-12 months",
        platforms: ["web", "mobile"],
        complianceRequired: ["hipaa", "fda", "gdpr"]
      },
      {
        id: "clinical-decision-support",
        name: "Clinical Decision Support System",
        description: "AI-powered diagnostic and treatment recommendations",
        complexity: "complex",
        timeToMarket: "4-8 months",
        platforms: ["web", "api"],
        complianceRequired: ["hipaa", "fda"]
      },
      {
        id: "patient-portal",
        name: "Patient Portal",
        description: "Patient access to health records and communication",
        complexity: "moderate",
        timeToMarket: "2-4 months",
        platforms: ["web", "mobile"],
        complianceRequired: ["hipaa"]
      },
      {
        id: "nursing-documentation",
        name: "Nursing Documentation System",
        description: "Comprehensive nursing workflow and documentation",
        complexity: "complex",
        timeToMarket: "3-6 months",
        platforms: ["web", "mobile"],
        complianceRequired: ["hipaa"]
      }
    ],
    commonTechStacks: ["react-node-hipaa", "angular-node-clinical"],
    regulatoryRequirements: ["HIPAA", "FDA 510(k)", "GDPR", "State Medical Boards"],
    keyIntegrations: ["FHIR", "HL7", "Epic", "Cerner", "Allscripts"]
  },
  {
    id: "telehealth",
    name: "Telehealth & Remote Care",
    description: "Virtual care delivery and remote patient monitoring",
    category: "clinical",
    useCases: [
      {
        id: "video-consultation",
        name: "Video Consultation Platform",
        description: "HIPAA-compliant video calls between providers and patients",
        complexity: "complex",
        timeToMarket: "3-5 months",
        platforms: ["web", "mobile"],
        complianceRequired: ["hipaa", "gdpr"]
      },
      {
        id: "remote-monitoring",
        name: "Remote Patient Monitoring",
        description: "IoT device integration for continuous patient monitoring",
        complexity: "complex",
        timeToMarket: "4-7 months",
        platforms: ["web", "mobile", "api"],
        complianceRequired: ["hipaa", "fda"]
      },
      {
        id: "virtual-triage",
        name: "Virtual Triage System",
        description: "AI-powered symptom assessment and care routing",
        complexity: "complex",
        timeToMarket: "3-6 months",
        platforms: ["web", "mobile"],
        complianceRequired: ["hipaa", "fda"]
      }
    ],
    commonTechStacks: ["react-native-node-telehealth", "react-node-hipaa"],
    regulatoryRequirements: ["HIPAA", "State Telemedicine Laws", "DEA Requirements"],
    keyIntegrations: ["Twilio Video", "WebRTC", "FHIR", "IoT Devices"]
  },
  {
    id: "medical-research",
    name: "Medical Research & Clinical Trials",
    description: "Research data management and clinical trial platforms",
    category: "research",
    useCases: [
      {
        id: "clinical-trial-management",
        name: "Clinical Trial Management System",
        description: "End-to-end clinical trial data and participant management",
        complexity: "enterprise",
        timeToMarket: "8-15 months",
        platforms: ["web", "mobile"],
        complianceRequired: ["fda", "gcp", "hipaa"]
      },
      {
        id: "research-data-capture",
        name: "Research Data Capture",
        description: "REDCap-like electronic data capture for research",
        complexity: "complex",
        timeToMarket: "4-8 months",
        platforms: ["web", "mobile"],
        complianceRequired: ["hipaa", "gcp"]
      },
      {
        id: "biobank-management",
        name: "Biobank Management System",
        description: "Sample tracking and biospecimen management",
        complexity: "complex",
        timeToMarket: "5-9 months",
        platforms: ["web", "api"],
        complianceRequired: ["hipaa", "clia"]
      }
    ],
    commonTechStacks: ["react-python-research", "angular-python-pharma"],
    regulatoryRequirements: ["FDA GCP", "ICH Guidelines", "HIPAA", "IRB Approval"],
    keyIntegrations: ["REDCap", "CTMS", "FHIR", "LIMS", "Statistical Software"]
  },
  {
    id: "pharmaceutical",
    name: "Pharmaceutical & Drug Discovery",
    description: "Drug development, manufacturing, and pharmacovigilance",
    category: "pharma",
    useCases: [
      {
        id: "drug-discovery-platform",
        name: "Drug Discovery Platform",
        description: "AI-powered molecular design and screening",
        complexity: "enterprise",
        timeToMarket: "12-24 months",
        platforms: ["web", "api"],
        complianceRequired: ["fda", "gmp"]
      },
      {
        id: "pharmacovigilance",
        name: "Pharmacovigilance System",
        description: "Adverse event reporting and safety monitoring",
        complexity: "complex",
        timeToMarket: "6-10 months",
        platforms: ["web", "api"],
        complianceRequired: ["fda", "ema", "ich"]
      },
      {
        id: "regulatory-submission",
        name: "Regulatory Submission Platform",
        description: "FDA submission preparation and tracking",
        complexity: "complex",
        timeToMarket: "5-8 months",
        platforms: ["web"],
        complianceRequired: ["fda", "ectd"]
      }
    ],
    commonTechStacks: ["angular-python-pharma", "react-python-research"],
    regulatoryRequirements: ["FDA", "EMA", "ICH", "GMP", "GLP"],
    keyIntegrations: ["CDISC", "FDA Gateway", "ChEMBL", "PubChem"]
  },
  {
    id: "medical-devices",
    name: "Medical Devices & IoT",
    description: "Connected medical devices and IoT healthcare solutions",
    category: "medtech",
    useCases: [
      {
        id: "medical-device-software",
        name: "Medical Device Software",
        description: "Embedded software for medical devices",
        complexity: "enterprise",
        timeToMarket: "8-18 months",
        platforms: ["desktop", "api"],
        complianceRequired: ["fda", "iso13485", "iec62304"]
      },
      {
        id: "wearable-health-app",
        name: "Wearable Health Application",
        description: "Health tracking and analytics for wearable devices",
        complexity: "complex",
        timeToMarket: "4-7 months",
        platforms: ["mobile", "api"],
        complianceRequired: ["hipaa", "fda"]
      },
      {
        id: "hospital-iot-platform",
        name: "Hospital IoT Platform",
        description: "Connected medical equipment monitoring and management",
        complexity: "enterprise",
        timeToMarket: "6-12 months",
        platforms: ["web", "api"],
        complianceRequired: ["hipaa", "nist"]
      }
    ],
    commonTechStacks: ["flutter-python-clinical", "react-native-node-telehealth"],
    regulatoryRequirements: ["FDA 510(k)", "ISO 13485", "IEC 62304", "NIST Framework"],
    keyIntegrations: ["HL7", "DICOM", "Bluetooth LE", "IoT Protocols"]
  },
  {
    id: "genomics-bioinformatics",
    name: "Genomics & Bioinformatics",
    description: "Genetic analysis, sequencing, and personalized medicine",
    category: "research",
    useCases: [
      {
        id: "genomic-analysis-pipeline",
        name: "Genomic Analysis Pipeline",
        description: "High-throughput sequencing data processing and analysis",
        complexity: "enterprise",
        timeToMarket: "6-12 months",
        platforms: ["web", "api"],
        complianceRequired: ["hipaa", "gina"]
      },
      {
        id: "precision-medicine-platform",
        name: "Precision Medicine Platform",
        description: "Personalized treatment recommendations based on genomics",
        complexity: "enterprise",
        timeToMarket: "8-15 months",
        platforms: ["web", "api"],
        complianceRequired: ["hipaa", "fda", "clia"]
      },
      {
        id: "genetic-counseling-tool",
        name: "Genetic Counseling Tool",
        description: "Risk assessment and family history analysis",
        complexity: "complex",
        timeToMarket: "4-8 months",
        platforms: ["web", "mobile"],
        complianceRequired: ["hipaa", "gina"]
      }
    ],
    commonTechStacks: ["react-python-research", "angular-python-pharma"],
    regulatoryRequirements: ["HIPAA", "GINA", "FDA", "CLIA", "CAP"],
    keyIntegrations: ["FHIR Genomics", "ClinVar", "COSMIC", "TCGA", "gnomAD"]
  },
  {
    id: "laboratory-informatics",
    name: "Laboratory Informatics",
    description: "Lab management, diagnostics, and pathology systems",
    category: "clinical",
    useCases: [
      {
        id: "lims-system",
        name: "Laboratory Information Management System",
        description: "Complete lab workflow and sample management",
        complexity: "enterprise",
        timeToMarket: "6-12 months",
        platforms: ["web", "api"],
        complianceRequired: ["clia", "cap", "hipaa"]
      },
      {
        id: "digital-pathology",
        name: "Digital Pathology Platform",
        description: "AI-powered slide analysis and diagnosis support",
        complexity: "enterprise",
        timeToMarket: "8-15 months",
        platforms: ["web", "api"],
        complianceRequired: ["fda", "clia", "hipaa"]
      },
      {
        id: "point-of-care-testing",
        name: "Point-of-Care Testing System",
        description: "Rapid diagnostic testing and result management",
        complexity: "complex",
        timeToMarket: "4-7 months",
        platforms: ["mobile", "api"],
        complianceRequired: ["clia", "fda"]
      }
    ],
    commonTechStacks: ["angular-node-clinical", "react-python-research"],
    regulatoryRequirements: ["CLIA", "CAP", "FDA", "HIPAA", "ISO 15189"],
    keyIntegrations: ["HL7", "LOINC", "SNOMED CT", "LIS", "Instrument Interfaces"]
  },
  {
    id: "medical-imaging",
    name: "Medical Imaging & Radiology",
    description: "Medical imaging, DICOM processing, and radiology workflows",
    category: "clinical",
    useCases: [
      {
        id: "pacs-system",
        name: "Picture Archiving and Communication System",
        description: "Medical image storage, retrieval, and management",
        complexity: "enterprise",
        timeToMarket: "8-15 months",
        platforms: ["web", "desktop"],
        complianceRequired: ["hipaa", "fda", "dicom"]
      },
      {
        id: "ai-radiology-assistant",
        name: "AI Radiology Assistant",
        description: "AI-powered image analysis and diagnostic support",
        complexity: "enterprise",
        timeToMarket: "10-18 months",
        platforms: ["web", "api"],
        complianceRequired: ["fda", "hipaa", "acr"]
      },
      {
        id: "mobile-imaging-viewer",
        name: "Mobile Imaging Viewer",
        description: "Secure mobile access to medical images",
        complexity: "complex",
        timeToMarket: "3-6 months",
        platforms: ["mobile"],
        complianceRequired: ["hipaa", "dicom"]
      }
    ],
    commonTechStacks: ["react-node-hipaa", "angular-node-clinical"],
    regulatoryRequirements: ["HIPAA", "FDA", "DICOM", "ACR", "RSNA"],
    keyIntegrations: ["DICOM", "HL7", "PACS", "RIS", "EMR"]
  },
  {
    id: "public-health",
    name: "Public Health & Epidemiology",
    description: "Population health monitoring and disease surveillance",
    category: "public-health",
    useCases: [
      {
        id: "disease-surveillance",
        name: "Disease Surveillance System",
        description: "Real-time disease outbreak monitoring and reporting",
        complexity: "enterprise",
        timeToMarket: "6-12 months",
        platforms: ["web", "mobile", "api"],
        complianceRequired: ["hipaa", "cdc"]
      },
      {
        id: "contact-tracing-app",
        name: "Contact Tracing Application",
        description: "Digital contact tracing for infectious disease control",
        complexity: "complex",
        timeToMarket: "2-4 months",
        platforms: ["mobile"],
        complianceRequired: ["hipaa", "privacy"]
      },
      {
        id: "vaccination-management",
        name: "Vaccination Management System",
        description: "Immunization tracking and registry management",
        complexity: "complex",
        timeToMarket: "4-7 months",
        platforms: ["web", "mobile"],
        complianceRequired: ["hipaa", "cdc", "acip"]
      }
    ],
    commonTechStacks: ["react-python-research", "flutter-python-clinical"],
    regulatoryRequirements: ["CDC Guidelines", "HIPAA", "State Health Laws"],
    keyIntegrations: ["CDC Systems", "FHIR", "HL7", "IIS", "NEDSS"]
  },
  {
    id: "healthcare-administration",
    name: "Healthcare Administration & Revenue",
    description: "Healthcare business operations, billing, and administration",
    category: "admin",
    useCases: [
      {
        id: "revenue-cycle-management",
        name: "Revenue Cycle Management",
        description: "Complete billing, coding, and payment processing",
        complexity: "enterprise",
        timeToMarket: "8-15 months",
        platforms: ["web"],
        complianceRequired: ["hipaa", "hitech", "aca"]
      },
      {
        id: "practice-management",
        name: "Practice Management System",
        description: "Scheduling, patient flow, and practice operations",
        complexity: "complex",
        timeToMarket: "4-8 months",
        platforms: ["web", "mobile"],
        complianceRequired: ["hipaa"]
      },
      {
        id: "credentialing-platform",
        name: "Provider Credentialing Platform",
        description: "Healthcare provider licensing and credentialing management",
        complexity: "complex",
        timeToMarket: "5-9 months",
        platforms: ["web"],
        complianceRequired: ["npdb", "caqh"]
      }
    ],
    commonTechStacks: ["angular-node-clinical", "react-node-hipaa"],
    regulatoryRequirements: ["HIPAA", "HITECH", "ACA", "CMS", "OIG"],
    keyIntegrations: ["EDI", "X12", "FHIR", "Clearinghouses", "Payment Processors"]
  }
];

// Helper functions for domain-specific recommendations
export function getRecommendedStack(domainId: string, projectType: string): string[] {
  const domain = HEALTHCARE_DOMAINS.find(d => d.id === domainId);
  if (!domain) return [];
  
  return domain.commonTechStacks.filter(stack => {
    if (projectType === "mobile") {
      return stack.includes("native") || stack.includes("flutter");
    }
    if (projectType === "web") {
      return stack.includes("react") || stack.includes("angular");
    }
    return true;
  });
}

export function getComplianceRequirements(domainId: string, useCaseId: string): string[] {
  const domain = HEALTHCARE_DOMAINS.find(d => d.id === domainId);
  if (!domain) return [];
  
  const useCase = domain.useCases.find(uc => uc.id === useCaseId);
  return useCase ? useCase.complianceRequired : [];
}

export function getIntegrationOptions(domainId: string): string[] {
  const domain = HEALTHCARE_DOMAINS.find(d => d.id === domainId);
  return domain ? domain.keyIntegrations : [];
}