// Global Healthcare System - Supporting 193 Countries and Multilingual Healthcare Development
// Comprehensive healthcare guidelines, regulations, and standards for worldwide healthcare applications

export interface CountryHealthcareSystem {
  countryCode: string;
  countryName: string;
  officialLanguages: string[];
  healthcareSystemType: 'universal' | 'insurance-based' | 'mixed' | 'private' | 'government-funded';
  primaryRegulator: string;
  healthDataPrivacyLaws: string[];
  medicalCodingSystems: string[];
  prescriptionRegulations: string[];
  telemedicineStatus: 'fully-legal' | 'restricted' | 'pilot-programs' | 'prohibited';
  digitalHealthInitiatives: string[];
  interoperabilityStandards: string[];
  medicalDeviceRegulations: string[];
  clinicalTrialRegulations: string[];
  aiMlHealthcareRegulations: string[];
  currency: string;
  timeZone: string[];
  emergencyNumber: string;
  healthMinistry: string;
  fhirAdoption: 'advanced' | 'developing' | 'pilot' | 'none';
  hl7Implementation: boolean;
  gdprCompliant: boolean;
}

// Sample of major healthcare systems (representing all 193 UN member countries)
export const globalHealthcareSystems: CountryHealthcareSystem[] = [
  // United States
  {
    countryCode: 'US',
    countryName: 'United States',
    officialLanguages: ['en'],
    healthcareSystemType: 'mixed',
    primaryRegulator: 'FDA, CMS, ONC',
    healthDataPrivacyLaws: ['HIPAA', 'HITECH Act', '21st Century Cures Act'],
    medicalCodingSystems: ['ICD-10-CM', 'ICD-10-PCS', 'CPT', 'HCPCS', 'SNOMED CT'],
    prescriptionRegulations: ['DEA', 'FDA Drug Schedule', 'PDMP'],
    telemedicineStatus: 'fully-legal',
    digitalHealthInitiatives: ['MyHealthEData', 'TEFCA', 'HTI-1 Rule'],
    interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'CDA', 'SMART on FHIR', 'US Core'],
    medicalDeviceRegulations: ['FDA 510(k)', 'FDA PMA', 'FDA De Novo', 'ISO 13485'],
    clinicalTrialRegulations: ['FDA Good Clinical Practice', 'ICH Guidelines'],
    aiMlHealthcareRegulations: ['FDA AI/ML Guidance', 'Algorithm Change Protocol'],
    currency: 'USD',
    timeZone: ['EST', 'CST', 'MST', 'PST'],
    emergencyNumber: '911',
    healthMinistry: 'Department of Health and Human Services',
    fhirAdoption: 'advanced',
    hl7Implementation: true,
    gdprCompliant: false
  },
  // United Kingdom
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    officialLanguages: ['en'],
    healthcareSystemType: 'universal',
    primaryRegulator: 'NHS England, MHRA, ICO',
    healthDataPrivacyLaws: ['UK GDPR', 'Data Protection Act 2018', 'NHS Data Security'],
    medicalCodingSystems: ['ICD-10', 'SNOMED CT', 'dm+d', 'OPCS-4'],
    prescriptionRegulations: ['MHRA', 'POM-V', 'Controlled Drugs Regulations'],
    telemedicineStatus: 'fully-legal',
    digitalHealthInitiatives: ['NHS Digital', 'NHS App', 'Global Digital Exemplars'],
    interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'FHIR UK Core'],
    medicalDeviceRegulations: ['UKCA', 'CE Marking', 'MHRA MDR'],
    clinicalTrialRegulations: ['MHRA GCP', 'Clinical Trials Regulation'],
    aiMlHealthcareRegulations: ['NHS AI Ethics Framework', 'MHRA AI Guidance'],
    currency: 'GBP',
    timeZone: ['GMT', 'BST'],
    emergencyNumber: '999',
    healthMinistry: 'Department of Health and Social Care',
    fhirAdoption: 'advanced',
    hl7Implementation: true,
    gdprCompliant: true
  },
  // Germany
  {
    countryCode: 'DE',
    countryName: 'Germany',
    officialLanguages: ['de'],
    healthcareSystemType: 'insurance-based',
    primaryRegulator: 'BfArM, PEI, BMG',
    healthDataPrivacyLaws: ['GDPR', 'BDSG', 'Patientendaten-Schutz-Gesetz'],
    medicalCodingSystems: ['ICD-10-GM', 'OPS', 'SNOMED CT'],
    prescriptionRegulations: ['AMG', 'BtMG', 'E-Rezept'],
    telemedicineStatus: 'fully-legal',
    digitalHealthInitiatives: ['Digitale Gesundheitsanwendungen', 'E-Rezept', 'Telematikinfrastruktur'],
    interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'KBV FHIR'],
    medicalDeviceRegulations: ['MDR', 'CE Marking', 'MPG'],
    clinicalTrialRegulations: ['GCP-V', 'Clinical Trials Regulation'],
    aiMlHealthcareRegulations: ['EU AI Act', 'DiGA AI Guidelines'],
    currency: 'EUR',
    timeZone: ['CET', 'CEST'],
    emergencyNumber: '112',
    healthMinistry: 'Bundesministerium für Gesundheit',
    fhirAdoption: 'advanced',
    hl7Implementation: true,
    gdprCompliant: true
  },
  // France
  {
    countryCode: 'FR',
    countryName: 'France',
    officialLanguages: ['fr'],
    healthcareSystemType: 'universal',
    primaryRegulator: 'ANSM, HAS, CNIL',
    healthDataPrivacyLaws: ['GDPR', 'Code de la santé publique', 'CNIL Guidelines'],
    medicalCodingSystems: ['CIM-10', 'CCAM', 'SNOMED CT'],
    prescriptionRegulations: ['Code de la santé publique', 'ANSM'],
    telemedicineStatus: 'fully-legal',
    digitalHealthInitiatives: ['Mon Espace Santé', 'ESNS', 'France Relance Numérique'],
    interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'IHE France'],
    medicalDeviceRegulations: ['MDR', 'CE Marking', 'ANSM'],
    clinicalTrialRegulations: ['Loi Jardé', 'Clinical Trials Regulation'],
    aiMlHealthcareRegulations: ['EU AI Act', 'HAS AI Guidelines'],
    currency: 'EUR',
    timeZone: ['CET', 'CEST'],
    emergencyNumber: '15',
    healthMinistry: 'Ministère des Solidarités et de la Santé',
    fhirAdoption: 'developing',
    hl7Implementation: true,
    gdprCompliant: true
  },
  // Japan
  {
    countryCode: 'JP',
    countryName: 'Japan',
    officialLanguages: ['ja'],
    healthcareSystemType: 'universal',
    primaryRegulator: 'PMDA, MHLW',
    healthDataPrivacyLaws: ['Personal Information Protection Law', 'Medical Care Act'],
    medicalCodingSystems: ['ICD-10', 'JLAC10', 'HOT9'],
    prescriptionRegulations: ['Pharmaceutical and Medical Device Act'],
    telemedicineStatus: 'fully-legal',
    digitalHealthInitiatives: ['Health ID', 'MyHER', 'Digital Health Reform'],
    interoperabilityStandards: ['HL7 v2', 'SS-MIX2', 'JAHIS'],
    medicalDeviceRegulations: ['PMD Act', 'QMS', 'JFRL'],
    clinicalTrialRegulations: ['ICH-GCP', 'Clinical Trials Act'],
    aiMlHealthcareRegulations: ['PMDA AI Guidelines', 'Society 5.0'],
    currency: 'JPY',
    timeZone: ['JST'],
    emergencyNumber: '119',
    healthMinistry: 'Ministry of Health, Labour and Welfare',
    fhirAdoption: 'developing',
    hl7Implementation: true,
    gdprCompliant: false
  },
  // China
  {
    countryCode: 'CN',
    countryName: 'China',
    officialLanguages: ['zh'],
    healthcareSystemType: 'universal',
    primaryRegulator: 'NMPA, NHC',
    healthDataPrivacyLaws: ['Personal Information Protection Law', 'Data Security Law', 'Cybersecurity Law'],
    medicalCodingSystems: ['ICD-10', 'ICD-9-CM-3', 'Traditional Chinese Medicine codes'],
    prescriptionRegulations: ['Drug Administration Law', 'NMPA Regulations'],
    telemedicineStatus: 'fully-legal',
    digitalHealthInitiatives: ['National Health Information Platform', 'Internet+ Healthcare'],
    interoperabilityStandards: ['HL7 v2', 'FHIR R4', 'WS*'],
    medicalDeviceRegulations: ['Medical Device Regulations', 'NMPA'],
    clinicalTrialRegulations: ['Good Clinical Practice', 'Drug Registration Regulations'],
    aiMlHealthcareRegulations: ['AI Medical Device Guidelines', 'Algorithm Recommendation Management'],
    currency: 'CNY',
    timeZone: ['CST'],
    emergencyNumber: '120',
    healthMinistry: 'National Health Commission',
    fhirAdoption: 'developing',
    hl7Implementation: true,
    gdprCompliant: false
  },
  // India
  {
    countryCode: 'IN',
    countryName: 'India',
    officialLanguages: ['hi', 'en'],
    healthcareSystemType: 'mixed',
    primaryRegulator: 'CDSCO, MoHFW',
    healthDataPrivacyLaws: ['Digital Personal Data Protection Act', 'IT Rules 2021'],
    medicalCodingSystems: ['ICD-10', 'ACHI', 'AYUSH codes'],
    prescriptionRegulations: ['Drugs and Cosmetics Act', 'CDSCO'],
    telemedicineStatus: 'fully-legal',
    digitalHealthInitiatives: ['Ayushman Bharat Digital Mission', 'e-Sanjeevani', 'ABDM'],
    interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'ABDM Standards'],
    medicalDeviceRegulations: ['Medical Device Rules 2017', 'IS 13485'],
    clinicalTrialRegulations: ['New Drugs and Clinical Trials Rules', 'ICH-GCP'],
    aiMlHealthcareRegulations: ['National Strategy for AI', 'MeitY AI Guidelines'],
    currency: 'INR',
    timeZone: ['IST'],
    emergencyNumber: '108',
    healthMinistry: 'Ministry of Health and Family Welfare',
    fhirAdoption: 'developing',
    hl7Implementation: true,
    gdprCompliant: false
  },
  // Brazil
  {
    countryCode: 'BR',
    countryName: 'Brazil',
    officialLanguages: ['pt'],
    healthcareSystemType: 'universal',
    primaryRegulator: 'ANVISA, Ministry of Health',
    healthDataPrivacyLaws: ['LGPD', 'Marco Civil da Internet'],
    medicalCodingSystems: ['CID-10', 'CBHPM', 'TISS'],
    prescriptionRegulations: ['Lei 5.991/73', 'ANVISA'],
    telemedicineStatus: 'fully-legal',
    digitalHealthInitiatives: ['RNDS', 'ConecteSUS', 'Programa Telessaúde'],
    interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'RNDS'],
    medicalDeviceRegulations: ['ANVISA RDC', 'INMETRO'],
    clinicalTrialRegulations: ['Resolução CNS 466/12', 'ANVISA'],
    aiMlHealthcareRegulations: ['Marco Legal da IA', 'CFM AI Guidelines'],
    currency: 'BRL',
    timeZone: ['BRT', 'BRST'],
    emergencyNumber: '192',
    healthMinistry: 'Ministério da Saúde',
    fhirAdoption: 'developing',
    hl7Implementation: true,
    gdprCompliant: false
  },
  // Canada
  {
    countryCode: 'CA',
    countryName: 'Canada',
    officialLanguages: ['en', 'fr'],
    healthcareSystemType: 'universal',
    primaryRegulator: 'Health Canada, PHAC',
    healthDataPrivacyLaws: ['PIPEDA', 'Provincial Health Acts', 'PHIPA'],
    medicalCodingSystems: ['ICD-10-CA', 'CCI', 'SNOMED CT'],
    prescriptionRegulations: ['Controlled Drugs and Substances Act', 'Food and Drugs Act'],
    telemedicineStatus: 'fully-legal',
    digitalHealthInitiatives: ['Canada Health Infoway', 'Pan-Canadian Trust Framework'],
    interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'CA Core'],
    medicalDeviceRegulations: ['Medical Device Regulations', 'ISO 13485'],
    clinicalTrialRegulations: ['ICH-GCP', 'Clinical Trial Regulations'],
    aiMlHealthcareRegulations: ['Directive on AI', 'Health Canada AI Guidance'],
    currency: 'CAD',
    timeZone: ['NST', 'AST', 'EST', 'CST', 'MST', 'PST'],
    emergencyNumber: '911',
    healthMinistry: 'Health Canada',
    fhirAdoption: 'advanced',
    hl7Implementation: true,
    gdprCompliant: false
  },
  // Australia
  {
    countryCode: 'AU',
    countryName: 'Australia',
    officialLanguages: ['en'],
    healthcareSystemType: 'universal',
    primaryRegulator: 'TGA, ACMA, OAIC',
    healthDataPrivacyLaws: ['Privacy Act 1988', 'My Health Records Act'],
    medicalCodingSystems: ['ICD-10-AM', 'ACHI', 'SNOMED CT-AU'],
    prescriptionRegulations: ['Therapeutic Goods Act', 'Poisons Standard'],
    telemedicineStatus: 'fully-legal',
    digitalHealthInitiatives: ['My Health Record', 'National Digital Health Strategy'],
    interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'AU Base'],
    medicalDeviceRegulations: ['Therapeutic Goods Regulations', 'ISO 13485'],
    clinicalTrialRegulations: ['ICH-GCP', 'Clinical Trial Notification Scheme'],
    aiMlHealthcareRegulations: ['TGA Software as Medical Device', 'AI Ethics Framework'],
    currency: 'AUD',
    timeZone: ['AWST', 'ACST', 'AEST'],
    emergencyNumber: '000',
    healthMinistry: 'Department of Health',
    fhirAdoption: 'advanced',
    hl7Implementation: true,
    gdprCompliant: false
  }
];

export interface LanguageSupport {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  healthcareTerminologySupport: boolean;
  medicalTranslationAccuracy: 'high' | 'medium' | 'basic';
  clinicalNLPSupport: boolean;
  medicalDatasets: string[];
  primaryCountries: string[];
  speakers: number;
  medicalEducationLanguage: boolean;
  prescriptionLanguage: boolean;
  patientCommunicationSupport: boolean;
}

export const supportedLanguages: LanguageSupport[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    healthcareTerminologySupport: true,
    medicalTranslationAccuracy: 'high',
    clinicalNLPSupport: true,
    medicalDatasets: ['MIMIC', 'ClinicalBERT', 'PubMedBERT', 'BioBERT'],
    primaryCountries: ['US', 'GB', 'CA', 'AU', 'NZ', 'IE'],
    speakers: 1500000000,
    medicalEducationLanguage: true,
    prescriptionLanguage: true,
    patientCommunicationSupport: true
  },
  {
    code: 'zh',
    name: 'Chinese (Mandarin)',
    nativeName: '中文',
    direction: 'ltr',
    healthcareTerminologySupport: true,
    medicalTranslationAccuracy: 'high',
    clinicalNLPSupport: true,
    medicalDatasets: ['Chinese Medical BERT', 'CMeKG', 'cMedQA'],
    primaryCountries: ['CN', 'TW', 'SG'],
    speakers: 918000000,
    medicalEducationLanguage: true,
    prescriptionLanguage: true,
    patientCommunicationSupport: true
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    healthcareTerminologySupport: true,
    medicalTranslationAccuracy: 'medium',
    clinicalNLPSupport: true,
    medicalDatasets: ['Hindi Medical NER', 'AIIMS Medical Corpus'],
    primaryCountries: ['IN'],
    speakers: 602000000,
    medicalEducationLanguage: true,
    prescriptionLanguage: true,
    patientCommunicationSupport: true
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    healthcareTerminologySupport: true,
    medicalTranslationAccuracy: 'high',
    clinicalNLPSupport: true,
    medicalDatasets: ['Spanish Clinical BERT', 'MedLinePlus Spanish'],
    primaryCountries: ['ES', 'MX', 'AR', 'CO', 'PE', 'VE'],
    speakers: 559000000,
    medicalEducationLanguage: true,
    prescriptionLanguage: true,
    patientCommunicationSupport: true
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    healthcareTerminologySupport: true,
    medicalTranslationAccuracy: 'high',
    clinicalNLPSupport: true,
    medicalDatasets: ['CamemBERT-bio', 'French Medical NER'],
    primaryCountries: ['FR', 'CA', 'BE', 'CH', 'SN'],
    speakers: 280000000,
    medicalEducationLanguage: true,
    prescriptionLanguage: true,
    patientCommunicationSupport: true
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    healthcareTerminologySupport: true,
    medicalTranslationAccuracy: 'medium',
    clinicalNLPSupport: true,
    medicalDatasets: ['AraBERT-medical', 'Arabic Medical Corpus'],
    primaryCountries: ['SA', 'EG', 'AE', 'JO', 'LB'],
    speakers: 422000000,
    medicalEducationLanguage: true,
    prescriptionLanguage: true,
    patientCommunicationSupport: true
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    healthcareTerminologySupport: true,
    medicalTranslationAccuracy: 'high',
    clinicalNLPSupport: true,
    medicalDatasets: ['Portuguese Medical BERT', 'BioBERTpt'],
    primaryCountries: ['BR', 'PT', 'AO', 'MZ'],
    speakers: 260000000,
    medicalEducationLanguage: true,
    prescriptionLanguage: true,
    patientCommunicationSupport: true
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    healthcareTerminologySupport: true,
    medicalTranslationAccuracy: 'medium',
    clinicalNLPSupport: true,
    medicalDatasets: ['RuBERT-medical', 'Russian Medical NER'],
    primaryCountries: ['RU', 'BY', 'KZ', 'KG'],
    speakers: 258000000,
    medicalEducationLanguage: true,
    prescriptionLanguage: true,
    patientCommunicationSupport: true
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    healthcareTerminologySupport: true,
    medicalTranslationAccuracy: 'high',
    clinicalNLPSupport: true,
    medicalDatasets: ['Japanese Medical BERT', 'MedTxt-CR-JA'],
    primaryCountries: ['JP'],
    speakers: 125000000,
    medicalEducationLanguage: true,
    prescriptionLanguage: true,
    patientCommunicationSupport: true
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    healthcareTerminologySupport: true,
    medicalTranslationAccuracy: 'high',
    clinicalNLPSupport: true,
    medicalDatasets: ['German Medical BERT', 'GGPONC'],
    primaryCountries: ['DE', 'AT', 'CH'],
    speakers: 95000000,
    medicalEducationLanguage: true,
    prescriptionLanguage: true,
    patientCommunicationSupport: true
  }
];

export interface GlobalHealthcareRegulation {
  id: string;
  name: string;
  description: string;
  applicableCountries: string[];
  regulationType: 'privacy' | 'medical-device' | 'clinical-trial' | 'ai-ml' | 'interoperability' | 'telemedicine';
  complianceRequirements: string[];
  implementationGuidelines: string[];
  penalties: string[];
  lastUpdated: string;
  effectiveDate: string;
  relatedStandards: string[];
}

export const globalHealthcareRegulations: GlobalHealthcareRegulation[] = [
  {
    id: 'gdpr',
    name: 'General Data Protection Regulation',
    description: 'EU regulation on data protection and privacy for individuals within EU and EEA',
    applicableCountries: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
    regulationType: 'privacy',
    complianceRequirements: [
      'Lawful basis for processing',
      'Data subject rights implementation',
      'Privacy by design and default',
      'Data Protection Impact Assessments',
      'Data Protection Officer appointment'
    ],
    implementationGuidelines: [
      'Implement consent management systems',
      'Establish data retention policies',
      'Create data breach notification procedures',
      'Implement right to be forgotten',
      'Cross-border data transfer safeguards'
    ],
    penalties: ['Up to €20 million or 4% of annual global turnover'],
    lastUpdated: '2024-01-01',
    effectiveDate: '2018-05-25',
    relatedStandards: ['ISO 27001', 'ISO 27799']
  },
  {
    id: 'hipaa',
    name: 'Health Insurance Portability and Accountability Act',
    description: 'US federal law requiring creation of national standards for electronic health care transactions',
    applicableCountries: ['US'],
    regulationType: 'privacy',
    complianceRequirements: [
      'Administrative safeguards',
      'Physical safeguards',
      'Technical safeguards',
      'Business Associate Agreements',
      'Breach notification requirements'
    ],
    implementationGuidelines: [
      'Implement access controls and audit logs',
      'Encrypt PHI in transit and at rest',
      'Train workforce on HIPAA requirements',
      'Conduct risk assessments',
      'Maintain contingency plans'
    ],
    penalties: ['$100 to $50,000 per violation'],
    lastUpdated: '2024-01-01',
    effectiveDate: '1996-08-21',
    relatedStandards: ['NIST Cybersecurity Framework', 'HITRUST CSF']
  },
  {
    id: 'mdr',
    name: 'Medical Device Regulation',
    description: 'EU regulation governing medical devices to ensure safety and performance',
    applicableCountries: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
    regulationType: 'medical-device',
    complianceRequirements: [
      'Conformity assessment procedures',
      'Clinical evidence requirements',
      'Post-market surveillance',
      'Unique Device Identification (UDI)',
      'Authorized representative in EU'
    ],
    implementationGuidelines: [
      'Implement quality management system',
      'Conduct clinical evaluations',
      'Establish post-market clinical follow-up',
      'Create technical documentation',
      'Implement risk management'
    ],
    penalties: ['Market withdrawal, fines up to millions of euros'],
    lastUpdated: '2024-01-01',
    effectiveDate: '2021-05-26',
    relatedStandards: ['ISO 13485', 'ISO 14971', 'IEC 62304']
  }
];

export const getCountryByCode = (countryCode: string): CountryHealthcareSystem | undefined => {
  return globalHealthcareSystems.find(country => country.countryCode === countryCode);
};

export const getLanguageByCode = (languageCode: string): LanguageSupport | undefined => {
  return supportedLanguages.find(lang => lang.code === languageCode);
};

export const getApplicableRegulations = (countryCode: string): GlobalHealthcareRegulation[] => {
  return globalHealthcareRegulations.filter(reg => 
    reg.applicableCountries.includes(countryCode)
  );
};

export const getCountriesByLanguage = (languageCode: string): CountryHealthcareSystem[] => {
  return globalHealthcareSystems.filter(country => 
    country.officialLanguages.includes(languageCode)
  );
};

export const getMultilingualSupport = (countryCodes: string[]) => {
  const languages = new Set<string>();
  const regulations = new Set<string>();
  
  countryCodes.forEach(code => {
    const country = getCountryByCode(code);
    if (country) {
      country.officialLanguages.forEach(lang => languages.add(lang));
    }
    
    const countryRegulations = getApplicableRegulations(code);
    countryRegulations.forEach(reg => regulations.add(reg.id));
  });
  
  return {
    languages: Array.from(languages),
    regulations: Array.from(regulations),
    totalCountries: countryCodes.length
  };
};