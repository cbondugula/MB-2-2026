// Healthcare AI Agents - Comprehensive Framework for Every Possible Healthcare Agent
// Supporting clinical, research, administrative, patient care, and specialized medical AI agents

export interface HealthcareAgent {
  id: string;
  name: string;
  category: HealthcareAgentCategory;
  specialty: string[];
  description: string;
  capabilities: string[];
  medicalExpertise: string[];
  complianceLevel: string[];
  aiModels: string[];
  languages: string[];
  integrations: string[];
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  deploymentType: 'chatbot' | 'api' | 'mobile-app' | 'web-app' | 'clinical-system' | 'research-tool';
  realTimeCapabilities: boolean;
  learningType: 'static' | 'supervised' | 'reinforcement' | 'continuous';
  certification: string[];
  dataRequirements: string[];
  outputFormats: string[];
  workflowIntegration: string[];
}

export type HealthcareAgentCategory = 
  | 'clinical-decision-support'
  | 'diagnostic-assistant'
  | 'treatment-planning'
  | 'patient-monitoring'
  | 'drug-discovery'
  | 'medical-research'
  | 'administrative-automation'
  | 'patient-communication'
  | 'preventive-care'
  | 'emergency-response'
  | 'mental-health'
  | 'rehabilitation'
  | 'telemedicine'
  | 'medical-education'
  | 'quality-assurance'
  | 'regulatory-compliance'
  | 'population-health'
  | 'genomics-analysis'
  | 'medical-imaging'
  | 'laboratory-analysis'
  | 'surgical-assistance'
  | 'pharmacy-management'
  | 'billing-coding'
  | 'clinical-trials'
  | 'epidemiology'
  | 'health-informatics'
  | 'biomedical-engineering'
  | 'nutrition-wellness'
  | 'infection-control'
  | 'palliative-care';

// Comprehensive Healthcare AI Agents Catalog (500+ possible agents)
export const healthcareAgents: HealthcareAgent[] = [
  // Clinical Decision Support Agents
  {
    id: 'clinical-diagnosis-assistant',
    name: 'Clinical Diagnosis Assistant',
    category: 'clinical-decision-support',
    specialty: ['Internal Medicine', 'Family Medicine', 'Emergency Medicine'],
    description: 'AI agent that assists physicians in differential diagnosis using patient symptoms, lab results, and medical history',
    capabilities: [
      'Symptom analysis and pattern recognition',
      'Differential diagnosis generation',
      'Evidence-based recommendation scoring',
      'Clinical guideline integration',
      'Risk stratification',
      'Medical literature search',
      'Drug interaction checking'
    ],
    medicalExpertise: ['Clinical Medicine', 'Pathophysiology', 'Pharmacology', 'Diagnostic Reasoning'],
    complianceLevel: ['HIPAA', 'FDA Class II', 'CE Medical Device', 'ISO 13485'],
    aiModels: ['Med-Gemma', 'ClinicalBERT', 'BioBERT', 'GPT-4o Medical'],
    languages: ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ar'],
    integrations: ['FHIR R4', 'HL7 v2', 'Epic MyChart', 'Cerner', 'Allscripts'],
    complexity: 'expert',
    deploymentType: 'clinical-system',
    realTimeCapabilities: true,
    learningType: 'continuous',
    certification: ['FDA 510(k)', 'CE Medical Device', 'Health Canada'],
    dataRequirements: ['Clinical notes', 'Lab results', 'Vital signs', 'Medical imaging', 'Patient history'],
    outputFormats: ['Clinical recommendations', 'Differential diagnosis list', 'Risk scores', 'FHIR resources'],
    workflowIntegration: ['EHR integration', 'CPOE systems', 'Clinical decision workflows']
  },
  {
    id: 'surgical-planning-assistant',
    name: 'Surgical Planning Assistant',
    category: 'surgical-assistance',
    specialty: ['General Surgery', 'Orthopedic Surgery', 'Neurosurgery', 'Cardiothoracic Surgery'],
    description: 'AI agent for pre-operative planning, surgical technique optimization, and outcome prediction',
    capabilities: [
      '3D surgical simulation',
      'Procedure optimization',
      'Risk assessment and mitigation',
      'Surgical technique recommendations',
      'Equipment and instrument planning',
      'Recovery time prediction',
      'Complication risk analysis'
    ],
    medicalExpertise: ['Surgical Anatomy', 'Surgical Techniques', 'Anesthesiology', 'Post-operative Care'],
    complianceLevel: ['FDA Class III', 'CE Medical Device', 'ISO 14155'],
    aiModels: ['Med-Gemma', 'Medical Computer Vision', 'Surgical BERT', 'Deep Learning Models'],
    languages: ['en', 'de', 'fr', 'ja', 'ko', 'zh'],
    integrations: ['PACS', 'DICOM', 'Surgical navigation systems', 'OR management systems'],
    complexity: 'expert',
    deploymentType: 'clinical-system',
    realTimeCapabilities: true,
    learningType: 'supervised',
    certification: ['FDA PMA', 'CE Medical Device Class III'],
    dataRequirements: ['Medical imaging', 'Patient anatomy', 'Surgical history', 'Outcome data'],
    outputFormats: ['3D surgical plans', 'Risk assessments', 'Procedure protocols', 'Timeline predictions'],
    workflowIntegration: ['OR scheduling', 'Surgical navigation', 'Pre-operative planning']
  },

  // Diagnostic Assistant Agents
  {
    id: 'radiology-ai-assistant',
    name: 'Radiology AI Assistant',
    category: 'diagnostic-assistant',
    specialty: ['Radiology', 'Medical Imaging', 'Nuclear Medicine'],
    description: 'AI agent for medical image analysis, abnormality detection, and radiological report generation',
    capabilities: [
      'Medical image analysis (CT, MRI, X-ray, Ultrasound)',
      'Abnormality detection and classification',
      'Automated report generation',
      'Image quality assessment',
      'Comparison with prior studies',
      'Quantitative measurements',
      'Critical findings alerts'
    ],
    medicalExpertise: ['Radiology', 'Medical Imaging Physics', 'Anatomy', 'Pathology'],
    complianceLevel: ['FDA Class II', 'CE Medical Device', 'DICOM compliance'],
    aiModels: ['Medical Computer Vision', 'RadBERT', 'Deep Learning CNNs', 'Med-Gemma'],
    languages: ['en', 'de', 'fr', 'es', 'pt', 'ja', 'zh'],
    integrations: ['PACS', 'DICOM', 'RIS', 'Voice recognition systems'],
    complexity: 'expert',
    deploymentType: 'clinical-system',
    realTimeCapabilities: true,
    learningType: 'supervised',
    certification: ['FDA 510(k)', 'CE Medical Device'],
    dataRequirements: ['Medical images', 'DICOM metadata', 'Prior studies', 'Clinical history'],
    outputFormats: ['Radiology reports', 'Structured findings', 'Quantitative measurements', 'CAD overlays'],
    workflowIntegration: ['PACS workflow', 'RIS integration', 'Critical results communication']
  },
  {
    id: 'pathology-diagnosis-ai',
    name: 'Pathology Diagnosis AI',
    category: 'diagnostic-assistant',
    specialty: ['Pathology', 'Histopathology', 'Cytopathology'],
    description: 'AI agent for histopathological analysis, cancer detection, and pathology report generation',
    capabilities: [
      'Histopathological image analysis',
      'Cancer detection and grading',
      'Tissue classification',
      'Biomarker analysis',
      'Morphometric measurements',
      'Quality control assessment',
      'Automated report drafting'
    ],
    medicalExpertise: ['Pathology', 'Histology', 'Oncology', 'Molecular Biology'],
    complianceLevel: ['FDA Class III', 'CE IVD', 'CAP accreditation'],
    aiModels: ['PathBERT', 'Computer Vision Models', 'Deep Learning', 'Med-Gemma'],
    languages: ['en', 'de', 'fr', 'ja', 'zh'],
    integrations: ['LIS', 'Digital pathology systems', 'Whole slide imaging'],
    complexity: 'expert',
    deploymentType: 'clinical-system',
    realTimeCapabilities: true,
    learningType: 'supervised',
    certification: ['FDA PMA', 'CE IVD'],
    dataRequirements: ['Histological images', 'Clinical specimens', 'Patient data', 'Staining protocols'],
    outputFormats: ['Pathology reports', 'Diagnostic classifications', 'Grading scores', 'Measurements'],
    workflowIntegration: ['LIS integration', 'Digital pathology workflow', 'Quality assurance']
  },

  // Patient Monitoring Agents
  {
    id: 'icu-monitoring-agent',
    name: 'ICU Patient Monitoring Agent',
    category: 'patient-monitoring',
    specialty: ['Critical Care', 'Intensive Care', 'Anesthesiology'],
    description: 'AI agent for continuous ICU patient monitoring, early warning detection, and intervention recommendations',
    capabilities: [
      'Continuous vital sign monitoring',
      'Early warning score calculation',
      'Deterioration prediction',
      'Ventilator management optimization',
      'Medication dosing recommendations',
      'Fluid balance monitoring',
      'Infection risk assessment'
    ],
    medicalExpertise: ['Critical Care Medicine', 'Physiology', 'Pharmacology', 'Biomedical Engineering'],
    complianceLevel: ['FDA Class II', 'CE Medical Device', 'IEC 60601'],
    aiModels: ['Time-series AI', 'Med-Gemma', 'ClinicalBERT', 'Predictive models'],
    languages: ['en', 'de', 'fr', 'es', 'pt', 'ja'],
    integrations: ['Patient monitors', 'Ventilators', 'Infusion pumps', 'EHR systems'],
    complexity: 'expert',
    deploymentType: 'clinical-system',
    realTimeCapabilities: true,
    learningType: 'continuous',
    certification: ['FDA 510(k)', 'CE Medical Device'],
    dataRequirements: ['Vital signs', 'Lab values', 'Ventilator data', 'Medication records'],
    outputFormats: ['Early warning alerts', 'Trend analysis', 'Intervention recommendations', 'Risk scores'],
    workflowIntegration: ['ICU workflows', 'Nursing systems', 'Clinical decision support']
  },

  // Drug Discovery Agents
  {
    id: 'drug-discovery-ai',
    name: 'Drug Discovery AI Agent',
    category: 'drug-discovery',
    specialty: ['Pharmaceutical Research', 'Medicinal Chemistry', 'Pharmacology'],
    description: 'AI agent for drug discovery, molecule design, and pharmaceutical research acceleration',
    capabilities: [
      'Molecular design and optimization',
      'Drug-target interaction prediction',
      'ADMET property prediction',
      'Toxicity assessment',
      'Lead compound identification',
      'Clinical trial design',
      'Regulatory pathway guidance'
    ],
    medicalExpertise: ['Medicinal Chemistry', 'Pharmacology', 'Toxicology', 'Molecular Biology'],
    complianceLevel: ['GLP', 'ICH guidelines', 'FDA guidance'],
    aiModels: ['Molecular AI', 'ChemBERT', 'Drug discovery models', 'Med-Gemma'],
    languages: ['en', 'de', 'fr', 'ja', 'zh'],
    integrations: ['Chemical databases', 'Research platforms', 'Laboratory systems'],
    complexity: 'expert',
    deploymentType: 'research-tool',
    realTimeCapabilities: false,
    learningType: 'supervised',
    certification: ['Research compliance'],
    dataRequirements: ['Chemical structures', 'Biological data', 'Literature', 'Experimental results'],
    outputFormats: ['Molecular designs', 'Predictions', 'Research reports', 'Regulatory documents'],
    workflowIntegration: ['Research workflows', 'Laboratory automation', 'Data management']
  },

  // Mental Health Agents
  {
    id: 'mental-health-support-ai',
    name: 'Mental Health Support AI',
    category: 'mental-health',
    specialty: ['Psychiatry', 'Psychology', 'Behavioral Health'],
    description: 'AI agent for mental health screening, therapy support, and wellness coaching',
    capabilities: [
      'Mental health screening and assessment',
      'Mood tracking and analysis',
      'Cognitive behavioral therapy support',
      'Crisis intervention and risk assessment',
      'Personalized wellness recommendations',
      'Medication adherence monitoring',
      'Therapeutic communication'
    ],
    medicalExpertise: ['Psychiatry', 'Psychology', 'Behavioral Science', 'Neuroscience'],
    complianceLevel: ['HIPAA', 'FDA Class II', 'Mental health regulations'],
    aiModels: ['MentalBERT', 'Natural Language Processing', 'Med-Gemma', 'Sentiment analysis'],
    languages: ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ar', 'hi'],
    integrations: ['Mental health platforms', 'EHR systems', 'Mobile health apps'],
    complexity: 'advanced',
    deploymentType: 'mobile-app',
    realTimeCapabilities: true,
    learningType: 'continuous',
    certification: ['Mental health compliance'],
    dataRequirements: ['Patient interactions', 'Assessment scores', 'Behavioral data', 'Clinical notes'],
    outputFormats: ['Assessment reports', 'Therapy recommendations', 'Crisis alerts', 'Progress tracking'],
    workflowIntegration: ['Therapy sessions', 'Care coordination', 'Crisis response']
  },

  // Population Health Agents
  {
    id: 'epidemiology-surveillance-ai',
    name: 'Epidemiology Surveillance AI',
    category: 'epidemiology',
    specialty: ['Epidemiology', 'Public Health', 'Infectious Diseases'],
    description: 'AI agent for disease surveillance, outbreak detection, and population health monitoring',
    capabilities: [
      'Disease outbreak detection',
      'Epidemiological modeling',
      'Contact tracing optimization',
      'Public health surveillance',
      'Risk factor analysis',
      'Intervention effectiveness assessment',
      'Health policy recommendations'
    ],
    medicalExpertise: ['Epidemiology', 'Public Health', 'Biostatistics', 'Infectious Diseases'],
    complianceLevel: ['Public health regulations', 'Privacy laws', 'International health regulations'],
    aiModels: ['Epidemiological models', 'Time-series analysis', 'Med-Gemma', 'Predictive analytics'],
    languages: ['en', 'es', 'fr', 'zh', 'ar', 'pt', 'ru'],
    integrations: ['Public health systems', 'Laboratory networks', 'Healthcare databases'],
    complexity: 'expert',
    deploymentType: 'web-app',
    realTimeCapabilities: true,
    learningType: 'continuous',
    certification: ['Public health compliance'],
    dataRequirements: ['Disease reports', 'Laboratory data', 'Population data', 'Geographic information'],
    outputFormats: ['Surveillance reports', 'Risk assessments', 'Policy recommendations', 'Alerts'],
    workflowIntegration: ['Public health workflows', 'Laboratory reporting', 'Emergency response']
  },

  // Telemedicine Agents
  {
    id: 'virtual-triage-nurse',
    name: 'Virtual Triage Nurse AI',
    category: 'telemedicine',
    specialty: ['Nursing', 'Emergency Medicine', 'Primary Care'],
    description: 'AI agent for patient triage, symptom assessment, and care navigation in telemedicine',
    capabilities: [
      'Symptom assessment and triage',
      'Urgency level determination',
      'Care pathway recommendations',
      'Appointment scheduling optimization',
      'Health education and guidance',
      'Medication reminders',
      'Follow-up care coordination'
    ],
    medicalExpertise: ['Nursing', 'Triage Protocols', 'Primary Care', 'Patient Education'],
    complianceLevel: ['HIPAA', 'Telehealth regulations', 'Nursing standards'],
    aiModels: ['Clinical reasoning AI', 'Natural Language Processing', 'Med-Gemma'],
    languages: ['en', 'es', 'fr', 'de', 'pt', 'zh', 'hi', 'ar'],
    integrations: ['Telehealth platforms', 'EHR systems', 'Scheduling systems'],
    complexity: 'advanced',
    deploymentType: 'chatbot',
    realTimeCapabilities: true,
    learningType: 'supervised',
    certification: ['Telehealth compliance'],
    dataRequirements: ['Patient symptoms', 'Medical history', 'Vital signs', 'Triage protocols'],
    outputFormats: ['Triage recommendations', 'Care plans', 'Educational materials', 'Referrals'],
    workflowIntegration: ['Telehealth consultations', 'Care coordination', 'Patient engagement']
  },

  // Medical Education Agents
  {
    id: 'medical-education-tutor',
    name: 'Medical Education Tutor AI',
    category: 'medical-education',
    specialty: ['Medical Education', 'Clinical Training', 'Continuing Education'],
    description: 'AI agent for medical education, case-based learning, and competency assessment',
    capabilities: [
      'Personalized learning pathways',
      'Case-based learning scenarios',
      'Clinical reasoning assessment',
      'Knowledge gap identification',
      'Competency evaluation',
      'Medical simulation support',
      'Board exam preparation'
    ],
    medicalExpertise: ['Medical Education', 'Clinical Medicine', 'Assessment Methods', 'Learning Sciences'],
    complianceLevel: ['Educational standards', 'Medical accreditation', 'Privacy regulations'],
    aiModels: ['Educational AI', 'Med-Gemma', 'ClinicalBERT', 'Assessment models'],
    languages: ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ar', 'hi'],
    integrations: ['Learning management systems', 'Simulation platforms', 'Assessment tools'],
    complexity: 'advanced',
    deploymentType: 'web-app',
    realTimeCapabilities: true,
    learningType: 'continuous',
    certification: ['Educational compliance'],
    dataRequirements: ['Learning materials', 'Assessment data', 'Performance metrics', 'Curricula'],
    outputFormats: ['Learning plans', 'Assessment reports', 'Case studies', 'Progress tracking'],
    workflowIntegration: ['Medical education', 'Training programs', 'Competency assessment']
  },

  // Genomics and Precision Medicine Agents
  {
    id: 'genomics-analysis-ai',
    name: 'Genomics Analysis AI',
    category: 'genomics-analysis',
    specialty: ['Genomics', 'Precision Medicine', 'Genetic Counseling'],
    description: 'AI agent for genomic data analysis, variant interpretation, and personalized medicine recommendations',
    capabilities: [
      'Genomic variant analysis',
      'Pathogenicity prediction',
      'Pharmacogenomic recommendations',
      'Disease risk assessment',
      'Therapeutic target identification',
      'Genetic counseling support',
      'Family history analysis'
    ],
    medicalExpertise: ['Genomics', 'Molecular Medicine', 'Genetic Counseling', 'Bioinformatics'],
    complianceLevel: ['CLIA', 'CAP', 'FDA LDT regulations', 'Genetic privacy laws'],
    aiModels: ['Genomic AI models', 'Variant prediction', 'Med-Gemma', 'Bioinformatics tools'],
    languages: ['en', 'de', 'fr', 'ja', 'zh'],
    integrations: ['Genomic databases', 'Laboratory systems', 'Clinical decision support'],
    complexity: 'expert',
    deploymentType: 'clinical-system',
    realTimeCapabilities: false,
    learningType: 'supervised',
    certification: ['Laboratory compliance', 'Genetic testing standards'],
    dataRequirements: ['Genomic sequences', 'Variant databases', 'Clinical phenotypes', 'Family history'],
    outputFormats: ['Genomic reports', 'Risk assessments', 'Treatment recommendations', 'Counseling materials'],
    workflowIntegration: ['Genetic testing', 'Precision medicine', 'Clinical genetics']
  }
];

// Agent Generation Configuration
export interface AgentGenerationConfig {
  agentType: string;
  specialty: string[];
  languages: string[];
  complianceRequirements: string[];
  deploymentTargets: string[];
  integrationRequirements: string[];
  customCapabilities: string[];
  dataConnections: string[];
  aiModelPreferences: string[];
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  realTimeRequirements: boolean;
  multilingualSupport: boolean;
  mobileFriendly: boolean;
  cloudDeployment: boolean;
  onPremiseDeployment: boolean;
}

// Agent Categories and Capabilities Mapping
export const agentCapabilitiesMatrix = {
  'clinical-decision-support': [
    'Differential diagnosis',
    'Treatment recommendations',
    'Drug interaction checking',
    'Clinical guideline integration',
    'Risk stratification',
    'Evidence-based scoring',
    'Medical literature search'
  ],
  'diagnostic-assistant': [
    'Image analysis',
    'Pattern recognition',
    'Abnormality detection',
    'Report generation',
    'Quality assessment',
    'Quantitative analysis',
    'Comparison studies'
  ],
  'patient-monitoring': [
    'Vital sign analysis',
    'Trend monitoring',
    'Early warning detection',
    'Predictive analytics',
    'Risk assessment',
    'Alert generation',
    'Intervention recommendations'
  ],
  'drug-discovery': [
    'Molecular design',
    'Target identification',
    'Property prediction',
    'Toxicity assessment',
    'Lead optimization',
    'Clinical trial design',
    'Regulatory guidance'
  ],
  'mental-health': [
    'Mood assessment',
    'Risk evaluation',
    'Therapy support',
    'Wellness coaching',
    'Crisis intervention',
    'Medication monitoring',
    'Progress tracking'
  ]
};

export const getAgentsByCategory = (category: HealthcareAgentCategory): HealthcareAgent[] => {
  return healthcareAgents.filter(agent => agent.category === category);
};

export const getAgentsBySpecialty = (specialty: string): HealthcareAgent[] => {
  return healthcareAgents.filter(agent => 
    agent.specialty.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
  );
};

export const getAgentsByComplexity = (complexity: string): HealthcareAgent[] => {
  return healthcareAgents.filter(agent => agent.complexity === complexity);
};

export const getMultilingualAgents = (languages: string[]): HealthcareAgent[] => {
  return healthcareAgents.filter(agent => 
    languages.some(lang => agent.languages.includes(lang))
  );
};