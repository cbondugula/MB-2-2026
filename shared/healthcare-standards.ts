// Healthcare Standards and Interoperability Definitions
// Supporting FHIR, HL7, UMLS, SNOMED CT, ICD-10, LOINC, DICOM, and more

export interface HealthcareStandard {
  id: string;
  name: string;
  description: string;
  version: string;
  category: 'interoperability' | 'terminology' | 'coding' | 'imaging' | 'messaging';
  implementationComplexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  useCase: string[];
  requiredLibraries: string[];
  authenticationRequired: boolean;
  complianceLevel: string[];
}

export const healthcareStandards: HealthcareStandard[] = [
  // FHIR (Fast Healthcare Interoperability Resources)
  {
    id: 'fhir-r4',
    name: 'FHIR R4',
    description: 'Fast Healthcare Interoperability Resources - modern standard for health information exchange',
    version: '4.0.1',
    category: 'interoperability',
    implementationComplexity: 'intermediate',
    useCase: ['EHR integration', 'API development', 'data exchange', 'mobile health apps'],
    requiredLibraries: ['fhir-kit-client', '@types/fhir', 'fhirpath'],
    authenticationRequired: true,
    complianceLevel: ['HIPAA', 'GDPR', 'FDA']
  },
  {
    id: 'fhir-r5',
    name: 'FHIR R5',
    description: 'Latest FHIR specification with enhanced capabilities',
    version: '5.0.0',
    category: 'interoperability',
    implementationComplexity: 'advanced',
    useCase: ['next-gen EHR', 'advanced analytics', 'AI/ML integration'],
    requiredLibraries: ['fhir-kit-client', '@types/fhir', 'fhirpath'],
    authenticationRequired: true,
    complianceLevel: ['HIPAA', 'GDPR', 'FDA']
  },

  // HL7 Standards
  {
    id: 'hl7-v2',
    name: 'HL7 v2.x',
    description: 'Health Level 7 messaging standard for clinical data exchange',
    version: '2.8.2',
    category: 'messaging',
    implementationComplexity: 'intermediate',
    useCase: ['hospital systems', 'lab integration', 'ADT messages', 'order management'],
    requiredLibraries: ['hl7-standard', 'node-hl7-complete'],
    authenticationRequired: true,
    complianceLevel: ['HIPAA', 'HITECH']
  },
  {
    id: 'hl7-v3',
    name: 'HL7 v3',
    description: 'Reference Information Model (RIM) based messaging',
    version: '3.0',
    category: 'messaging',
    implementationComplexity: 'expert',
    useCase: ['clinical document architecture', 'CDA documents', 'structured documents'],
    requiredLibraries: ['hl7-v3-toolkit', 'cda-generator'],
    authenticationRequired: true,
    complianceLevel: ['HIPAA', 'HITECH', 'FDA']
  },
  {
    id: 'hl7-cda',
    name: 'HL7 CDA',
    description: 'Clinical Document Architecture for structured clinical documents',
    version: 'R2',
    category: 'messaging',
    implementationComplexity: 'advanced',
    useCase: ['clinical documents', 'continuity of care', 'discharge summaries'],
    requiredLibraries: ['hl7-cda', 'xml2js', 'xpath'],
    authenticationRequired: false,
    complianceLevel: ['HIPAA', 'HITECH']
  },

  // Terminology Standards
  {
    id: 'umls',
    name: 'UMLS (Unified Medical Language System)',
    description: 'Comprehensive biomedical vocabulary database',
    version: '2024AB',
    category: 'terminology',
    implementationComplexity: 'expert',
    useCase: ['concept mapping', 'clinical NLP', 'semantic search', 'terminology services'],
    requiredLibraries: ['umls-api-client', 'medical-concept-mapper'],
    authenticationRequired: true,
    complianceLevel: ['NLM License', 'HIPAA']
  },
  {
    id: 'snomed-ct',
    name: 'SNOMED CT',
    description: 'Systematized Nomenclature of Medicine Clinical Terms',
    version: '2024-03',
    category: 'terminology',
    implementationComplexity: 'advanced',
    useCase: ['clinical coding', 'EHR terminology', 'decision support', 'analytics'],
    requiredLibraries: ['snomed-ct-client', 'terminology-server'],
    authenticationRequired: true,
    complianceLevel: ['SNOMED License', 'HIPAA']
  },
  {
    id: 'icd-10',
    name: 'ICD-10-CM/PCS',
    description: 'International Classification of Diseases, 10th Revision',
    version: '2024',
    category: 'coding',
    implementationComplexity: 'intermediate',
    useCase: ['diagnosis coding', 'billing', 'epidemiology', 'quality measures'],
    requiredLibraries: ['icd-10-cm', 'icd-api-client'],
    authenticationRequired: false,
    complianceLevel: ['CMS', 'HIPAA']
  },
  {
    id: 'icd-11',
    name: 'ICD-11',
    description: 'World Health Organization ICD-11 classification',
    version: '2024-01',
    category: 'coding',
    implementationComplexity: 'intermediate',
    useCase: ['international coding', 'mortality statistics', 'morbidity tracking'],
    requiredLibraries: ['icd-11-api', 'who-fic-client'],
    authenticationRequired: true,
    complianceLevel: ['WHO License', 'HIPAA']
  },
  {
    id: 'loinc',
    name: 'LOINC',
    description: 'Logical Observation Identifiers Names and Codes',
    version: '2.77',
    category: 'coding',
    implementationComplexity: 'intermediate',
    useCase: ['laboratory data', 'clinical observations', 'vital signs', 'surveys'],
    requiredLibraries: ['loinc-client', 'lab-terminology'],
    authenticationRequired: false,
    complianceLevel: ['LOINC License', 'HIPAA']
  },

  // Medical Device and Imaging Standards
  {
    id: 'dicom',
    name: 'DICOM',
    description: 'Digital Imaging and Communications in Medicine',
    version: '2024c',
    category: 'imaging',
    implementationComplexity: 'expert',
    useCase: ['medical imaging', 'PACS integration', 'radiology workflow', 'image analysis'],
    requiredLibraries: ['dicom-parser', 'dcmjs', 'cornerstone-core'],
    authenticationRequired: false,
    complianceLevel: ['HIPAA', 'FDA', 'DICOM Conformance']
  },
  {
    id: 'ieee-11073',
    name: 'IEEE 11073',
    description: 'Point-of-care medical device communication standard',
    version: '20601-2024',
    category: 'interoperability',
    implementationComplexity: 'expert',
    useCase: ['medical device integration', 'IoT health devices', 'remote monitoring'],
    requiredLibraries: ['ieee-11073-client', 'medical-device-sdk'],
    authenticationRequired: true,
    complianceLevel: ['FDA', 'ISO 13485', 'HIPAA']
  },

  // Quality and Safety Standards
  {
    id: 'cqm',
    name: 'Clinical Quality Measures (CQM)',
    description: 'Electronic Clinical Quality Measures for value-based care',
    version: '2024',
    category: 'coding',
    implementationComplexity: 'advanced',
    useCase: ['quality reporting', 'MIPS', 'value-based care', 'population health'],
    requiredLibraries: ['cqm-engine', 'measure-authoring-tool'],
    authenticationRequired: false,
    complianceLevel: ['CMS', 'HIPAA', 'MACRA']
  },
  {
    id: 'cds-hooks',
    name: 'CDS Hooks',
    description: 'Clinical Decision Support Hooks specification',
    version: '2.0',
    category: 'interoperability',
    implementationComplexity: 'advanced',
    useCase: ['clinical decision support', 'EHR integration', 'real-time guidance'],
    requiredLibraries: ['cds-hooks-client', 'decision-support-sdk'],
    authenticationRequired: true,
    complianceLevel: ['HIPAA', 'FDA']
  },

  // Emerging Standards
  {
    id: 'smart-on-fhir',
    name: 'SMART on FHIR',
    description: 'Substitutable Medical Applications and Reusable Technologies',
    version: '2.0',
    category: 'interoperability',
    implementationComplexity: 'advanced',
    useCase: ['EHR apps', 'patient portals', 'provider tools', 'third-party integration'],
    requiredLibraries: ['smart-launcher', 'fhir-kit-client', 'smart-health-cards'],
    authenticationRequired: true,
    complianceLevel: ['HIPAA', 'ONC', 'FDA']
  },
  {
    id: 'us-core',
    name: 'US Core Implementation Guide',
    description: 'US-specific FHIR implementation guide',
    version: '6.1.0',
    category: 'interoperability',
    implementationComplexity: 'advanced',
    useCase: ['US EHR certification', 'interoperability', 'patient access'],
    requiredLibraries: ['us-core-validator', 'fhir-kit-client'],
    authenticationRequired: true,
    complianceLevel: ['ONC', 'HIPAA', '21st Century Cures']
  }
];

export interface StandardImplementation {
  standardId: string;
  name: string;
  description: string;
  codeTemplate: string;
  dependencies: string[];
  authConfig: {
    type: 'oauth2' | 'apikey' | 'basic' | 'certificate' | 'none';
    scopes?: string[];
    endpoints?: {
      authorization?: string;
      token?: string;
      userinfo?: string;
    };
  };
  configuration: {
    baseUrl?: string;
    version?: string;
    timeout?: number;
    retryAttempts?: number;
  };
  examples: Array<{
    name: string;
    description: string;
    code: string;
    useCase: string;
  }>;
}

export const standardImplementations: StandardImplementation[] = [
  {
    standardId: 'fhir-r4',
    name: 'FHIR R4 Client Implementation',
    description: 'Complete FHIR R4 client with SMART on FHIR authentication',
    codeTemplate: `
import { Client } from 'fhir-kit-client';
import { Bundle, Patient, Observation } from 'fhir/r4';

export class FHIRClient {
  private client: Client;
  
  constructor(baseUrl: string, accessToken?: string) {
    this.client = new Client({
      baseUrl,
      requestOptions: {
        headers: accessToken ? {
          'Authorization': \`Bearer \${accessToken}\`
        } : {}
      }
    });
  }
  
  // Patient Operations
  async getPatient(id: string): Promise<Patient> {
    return await this.client.read({ resourceType: 'Patient', id });
  }
  
  async searchPatients(params: any): Promise<Bundle> {
    return await this.client.search({ resourceType: 'Patient', searchParams: params });
  }
  
  async createPatient(patient: Patient): Promise<Patient> {
    return await this.client.create({ resourceType: 'Patient', body: patient });
  }
  
  // Observation Operations
  async getObservations(patientId: string): Promise<Bundle> {
    return await this.client.search({
      resourceType: 'Observation',
      searchParams: { subject: \`Patient/\${patientId}\` }
    });
  }
  
  // Bulk Data Operations
  async initiateExport(params: any): Promise<any> {
    return await this.client.request({
      url: '$export',
      method: 'GET',
      headers: { 'Prefer': 'respond-async' },
      options: { searchParams: params }
    });
  }
}
`,
    dependencies: ['fhir-kit-client', '@types/fhir', 'fhirpath'],
    authConfig: {
      type: 'oauth2',
      scopes: ['patient/*.read', 'user/*.read', 'launch'],
      endpoints: {
        authorization: '/auth/authorize',
        token: '/auth/token'
      }
    },
    configuration: {
      baseUrl: 'https://hapi.fhir.org/baseR4',
      version: '4.0.1',
      timeout: 30000,
      retryAttempts: 3
    },
    examples: [
      {
        name: 'Patient Search',
        description: 'Search for patients by name and date of birth',
        code: `
const fhir = new FHIRClient('https://hapi.fhir.org/baseR4');
const patients = await fhir.searchPatients({
  name: 'Smith',
  birthdate: '1980-01-01'
});
`,
        useCase: 'Patient lookup and verification'
      },
      {
        name: 'Vital Signs Retrieval',
        description: 'Get latest vital signs for a patient',
        code: `
const vitals = await fhir.getObservations('patient-123');
const latestBP = vitals.entry?.find(entry => 
  entry.resource?.code?.coding?.[0]?.code === '85354-9'
);
`,
        useCase: 'Clinical dashboard and monitoring'
      }
    ]
  },
  {
    standardId: 'hl7-v2',
    name: 'HL7 v2 Message Processing',
    description: 'Parse and generate HL7 v2 messages for hospital integration',
    codeTemplate: `
import HL7 from 'hl7-standard';

export class HL7Processor {
  // Parse HL7 v2 message
  static parseMessage(message: string): any {
    const parser = new HL7.Parser();
    return parser.parse(message);
  }
  
  // Create ADT^A01 (Patient Admission) message
  static createAdmissionMessage(patientData: any): string {
    const msg = new HL7.Message();
    
    // MSH Segment
    msg.addSegment('MSH', {
      'MSH.1': '|',
      'MSH.2': '^~\\\\&',
      'MSH.3': 'SENDING_APP',
      'MSH.4': 'SENDING_FACILITY',
      'MSH.5': 'RECEIVING_APP',
      'MSH.6': 'RECEIVING_FACILITY',
      'MSH.7': new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14),
      'MSH.9': 'ADT^A01',
      'MSH.10': \`MSG\${Date.now()}\`,
      'MSH.11': 'P',
      'MSH.12': '2.8.2'
    });
    
    // EVN Segment
    msg.addSegment('EVN', {
      'EVN.1': 'A01',
      'EVN.2': new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
    });
    
    // PID Segment
    msg.addSegment('PID', {
      'PID.1': '1',
      'PID.3': patientData.patientId,
      'PID.5': \`\${patientData.lastName}^\${patientData.firstName}^\${patientData.middleName || ''}\`,
      'PID.7': patientData.dateOfBirth,
      'PID.8': patientData.gender,
      'PID.11': \`\${patientData.address.street}^^\${patientData.address.city}^\${patientData.address.state}^\${patientData.address.zip}\`
    });
    
    return msg.toString();
  }
  
  // Process Lab Results (ORU^R01)
  static createLabResultMessage(labData: any): string {
    const msg = new HL7.Message();
    
    // Add MSH, PID, OBR, OBX segments for lab results
    // Implementation details...
    
    return msg.toString();
  }
}
`,
    dependencies: ['hl7-standard', 'node-hl7-complete', 'moment'],
    authConfig: {
      type: 'basic',
      scopes: []
    },
    configuration: {
      timeout: 15000,
      retryAttempts: 2
    },
    examples: [
      {
        name: 'Parse ADT Message',
        description: 'Parse incoming patient admission message',
        code: `
const message = 'MSH|^~\\\\&|EPIC|UCDMC|...';
const parsed = HL7Processor.parseMessage(message);
console.log('Patient ID:', parsed.PID[3]);
`,
        useCase: 'Hospital system integration'
      }
    ]
  },
  {
    standardId: 'umls',
    name: 'UMLS Terminology Services',
    description: 'Access UMLS Metathesaurus for concept mapping and terminology',
    codeTemplate: `
import axios from 'axios';

export class UMLSClient {
  private apiKey: string;
  private baseUrl = 'https://uts-ws.nlm.nih.gov/rest';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  // Get concept information
  async getConcept(cui: string): Promise<any> {
    const response = await axios.get(
      \`\${this.baseUrl}/content/current/CUI/\${cui}\`,
      {
        params: { apiKey: this.apiKey }
      }
    );
    return response.data;
  }
  
  // Search for concepts
  async searchConcepts(query: string, searchType = 'exact'): Promise<any> {
    const response = await axios.get(
      \`\${this.baseUrl}/search/current\`,
      {
        params: {
          string: query,
          searchType,
          apiKey: this.apiKey
        }
      }
    );
    return response.data;
  }
  
  // Get concept definitions
  async getDefinitions(cui: string): Promise<any> {
    const response = await axios.get(
      \`\${this.baseUrl}/content/current/CUI/\${cui}/definitions\`,
      {
        params: { apiKey: this.apiKey }
      }
    );
    return response.data;
  }
  
  // Map between terminologies
  async mapConcept(cui: string, targetVocabulary: string): Promise<any> {
    const response = await axios.get(
      \`\${this.baseUrl}/content/current/CUI/\${cui}/atoms\`,
      {
        params: {
          sabs: targetVocabulary,
          apiKey: this.apiKey
        }
      }
    );
    return response.data;
  }
}
`,
    dependencies: ['axios', '@types/node'],
    authConfig: {
      type: 'apikey'
    },
    configuration: {
      baseUrl: 'https://uts-ws.nlm.nih.gov/rest',
      timeout: 30000,
      retryAttempts: 3
    },
    examples: [
      {
        name: 'Concept Search',
        description: 'Search for medical concepts',
        code: `
const umls = new UMLSClient(process.env.UMLS_API_KEY);
const results = await umls.searchConcepts('diabetes mellitus');
console.log('Found concepts:', results.result.results.length);
`,
        useCase: 'Clinical terminology lookup'
      }
    ]
  }
];

export const getStandardsByCategory = (category: string) => {
  return healthcareStandards.filter(standard => standard.category === category);
};

export const getImplementationByStandard = (standardId: string) => {
  return standardImplementations.find(impl => impl.standardId === standardId);
};

export const getRequiredPackages = (standardIds: string[]) => {
  const packages = new Set<string>();
  standardIds.forEach(id => {
    const implementation = getImplementationByStandard(id);
    if (implementation) {
      implementation.dependencies.forEach(dep => packages.add(dep));
    }
  });
  return Array.from(packages);
};