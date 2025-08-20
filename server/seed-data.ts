import { db } from "./db";
import { 
  users, 
  projects, 
  templates, 
  components,
  healthcareDomains,
  healthcareAgents,
  healthcareStandards,
  healthcareSimulations
} from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Force fresh seeding by clearing existing data
    console.log('🗑️ Clearing existing data...');
    
    // Clear tables in correct order due to foreign key constraints
    await db.delete(healthcareSimulations);
    await db.delete(projects); 
    await db.delete(templates);
    await db.delete(components);
    await db.delete(healthcareDomains);
    await db.delete(healthcareAgents);
    await db.delete(healthcareStandards);
    
    console.log('✅ Existing data cleared, starting fresh seed...');

    // Seed sample user for development (use upsert to handle existing)
    const [sampleUser] = await db.insert(users).values({
      id: 'dev-user-123',
      email: 'dev@medbuilder.ai',
      firstName: 'MedBuilder',
      lastName: 'Developer',
      profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev'
    }).onConflictDoNothing().returning();

    // Seed healthcare domains
    const domains = [
      {
        name: 'Clinical Care',
        category: 'Primary Care',
        description: 'Electronic Health Records, Clinical Decision Support, Patient Management',
        subdomains: ['EHR', 'Clinical Decision Support', 'Patient Portal', 'Telehealth'],
        standards: ['FHIR', 'HL7', 'DICOM', 'ICD-10'],
        regulations: ['HIPAA', 'HITECH', 'FDA 21 CFR Part 11'],
        stakeholders: ['Physicians', 'Nurses', 'Patients', 'IT Staff'],
        technologies: ['React', 'Node.js', 'PostgreSQL', 'AI/ML'],
        dataTypes: ['Patient Records', 'Clinical Notes', 'Lab Results', 'Imaging'],
        integrations: ['Epic', 'Cerner', 'AllScripts', 'AWS HealthLake'],
        globalCoverage: true,
        languages: ['English', 'Spanish', 'French', 'German', 'Chinese'],
        countries: ['US', 'Canada', 'EU', 'Australia', 'Japan'],
        isActive: true
      },
      {
        name: 'Medical Research',
        category: 'Research & Development',
        description: 'Clinical Trials, Research Data Management, Publication Systems',
        subdomains: ['Clinical Trials', 'Research Database', 'Publication Portal', 'Collaboration Tools'],
        standards: ['CDISC', 'REDCap', 'FAIR', 'GCP'],
        regulations: ['FDA CFR', 'ICH-GCP', 'GDPR', 'HIPAA'],
        stakeholders: ['Researchers', 'Clinical Trial Coordinators', 'Regulatory Affairs', 'Data Scientists'],
        technologies: ['Python', 'R', 'TensorFlow', 'Jupyter', 'PostgreSQL'],
        dataTypes: ['Trial Data', 'Biomarkers', 'Genomic Data', 'Publications'],
        integrations: ['ClinicalTrials.gov', 'PubMed', 'NIH databases', 'Academic Networks'],
        globalCoverage: true,
        languages: ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'],
        countries: ['US', 'EU', 'Canada', 'Australia', 'Japan', 'Singapore'],
        isActive: true
      }
    ];

    await db.insert(healthcareDomains).values(domains);

    // Seed healthcare agents
    const agents = [
      {
        name: 'Clinical Decision Support AI',
        type: 'clinical',
        specialty: 'General Medicine',
        capabilities: ['Diagnosis Support', 'Treatment Recommendations', 'Drug Interaction Checks', 'Risk Assessment'],
        models: ['GPT-4', 'Claude-3', 'Med-Gemma', 'BioBERT'],
        healthcareDomains: ['Clinical Care', 'Emergency Medicine'],
        compliance: ['HIPAA', 'FDA AI/ML Guidance', 'Clinical Decision Support Standards'],
        integrations: ['Epic', 'Cerner', 'FHIR APIs', 'Clinical Databases'],
        configuration: {
          accuracy_threshold: 0.95,
          confidence_level: 'high',
          human_oversight: true,
          audit_logging: true
        },
        isPublic: true,
        isActive: true
      },
      {
        name: 'Research Data Analyzer',
        type: 'research',
        specialty: 'Data Science',
        capabilities: ['Statistical Analysis', 'Clinical Trial Data Processing', 'Biomarker Discovery', 'Publication Assistance'],
        models: ['GPT-4', 'Claude-3', 'Specialized ML Models'],
        healthcareDomains: ['Medical Research', 'Pharmaceutical Development'],
        compliance: ['GCP', 'FDA Validation', 'Data Privacy Regulations'],
        integrations: ['REDCap', 'R/Python Libraries', 'Statistical Software', 'Publication Databases'],
        configuration: {
          statistical_significance: 0.05,
          validation_method: 'cross-validation',
          reporting_standard: 'CONSORT'
        },
        isPublic: true,
        isActive: true
      }
    ];

    await db.insert(healthcareAgents).values(agents);

    // Seed healthcare standards
    const standards = [
      {
        name: 'Fast Healthcare Interoperability Resources',
        acronym: 'FHIR',
        category: 'data',
        description: 'Standard for health information exchange',
        version: 'R4',
        organization: 'HL7 International',
        implementationGuide: 'Complete FHIR implementation with REST APIs, resource definitions, and security protocols',
        supportedCountries: ['US', 'Canada', 'EU', 'Australia', 'Japan', 'Singapore'],
        complianceRequirements: ['OAuth 2.0', 'SMART on FHIR', 'Patient consent management'],
        technicalSpecs: {
          api_version: 'R4',
          transport: 'HTTPS',
          format: 'JSON/XML',
          authentication: 'OAuth 2.0'
        },
        apiEndpoints: ['/Patient', '/Observation', '/Condition', '/MedicationRequest'],
        isActive: true
      },
      {
        name: 'Health Level Seven',
        acronym: 'HL7',
        category: 'messaging',
        description: 'Standards for clinical and administrative data exchange',
        version: 'v2.8',
        organization: 'HL7 International',
        implementationGuide: 'Message-based communication between healthcare systems',
        supportedCountries: ['US', 'Canada', 'EU', 'Australia'],
        complianceRequirements: ['Message validation', 'Error handling', 'Acknowledgment protocols'],
        technicalSpecs: {
          message_format: 'HL7v2',
          encoding: 'UTF-8',
          transport: 'TCP/IP, HTTP'
        },
        apiEndpoints: ['/ADT', '/ORM', '/ORU', '/SIU'],
        isActive: true
      }
    ];

    await db.insert(healthcareStandards).values(standards);

    // Seed sample templates
    const templateData = [
      {
        name: 'HIPAA-Compliant Patient Portal',
        description: 'Full-featured patient portal with secure messaging, appointment scheduling, and medical records access',
        category: 'Patient Portal',
        healthcareDomain: 'clinical',
        framework: 'react',
        backend: 'nodejs',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
        code: {
          components: ['PatientDashboard', 'SecureMessaging', 'AppointmentScheduler', 'MedicalRecords'],
          security: ['TwoFactorAuth', 'EncryptedStorage', 'AuditLogging'],
          integrations: ['FHIR', 'Epic', 'Cerner']
        },
        buildConfig: {
          webpack_config: 'healthcare-optimized',
          security_headers: true,
          ssl_required: true
        },
        dependencies: ['@healthcare/fhir-client', 'crypto-js', 'audit-logger'],
        isHipaaCompliant: true,
        tags: ['FHIR', 'Patient Portal', 'Secure Messaging', 'HIPAA']
      },
      {
        name: 'Clinical Research Platform',
        description: 'Comprehensive clinical trial management system with patient recruitment, data collection, and regulatory reporting',
        category: 'Research Platform',
        healthcareDomain: 'research',
        framework: 'react',
        backend: 'python',
        projectType: 'web',
        complianceLevel: 'fda',
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
        code: {
          modules: ['TrialManagement', 'PatientRecruitment', 'DataCollection', 'RegulatoryReporting'],
          compliance: ['21CFRPart11', 'GCP', 'DataIntegrity'],
          analytics: ['StatisticalAnalysis', 'AdverseEventReporting', 'TrialMetrics']
        },
        buildConfig: {
          python_version: '3.9',
          frameworks: ['Django', 'pandas', 'numpy'],
          database: 'postgresql'
        },
        dependencies: ['django-compliance', 'clinical-data-models', 'fda-submission-tools'],
        isHipaaCompliant: true,
        tags: ['Clinical Trials', 'FDA Compliance', 'Research Data', 'GCP']
      }
    ];

    await db.insert(templates).values(templateData);

    // Seed sample components
    const componentData = [
      {
        name: 'HIPAA Consent Form',
        description: 'Fully compliant consent form component with digital signatures and audit trail',
        category: 'Forms',
        healthcareUseCase: 'patient-consent',
        frameworks: ['react', 'vue', 'angular'],
        icon: 'file-text',
        code: {
          react: 'ConsentFormComponent.tsx',
          vue: 'ConsentForm.vue',
          angular: 'consent-form.component.ts',
          styles: 'consent-form.scss'
        },
        apiIntegrations: ['DocuSign', 'Adobe Sign', 'FHIR Consent Resource'],
        complianceFeatures: ['Digital Signatures', 'Audit Trail', 'Version Control', 'Patient Rights'],
        isVerified: true,
        isHipaaCompliant: true,
        isResponsive: true,
        tags: ['HIPAA', 'Consent', 'Digital Signature', 'Compliance']
      },
      {
        name: 'Lab Results Viewer',
        description: 'Interactive lab results display with trend analysis and reference ranges',
        category: 'Data Visualization',
        healthcareUseCase: 'lab-results',
        frameworks: ['react', 'vue', 'angular'],
        icon: 'bar-chart',
        code: {
          react: 'LabResultsViewer.tsx',
          vue: 'LabResults.vue',
          angular: 'lab-results.component.ts',
          charts: 'trend-charts.js'
        },
        apiIntegrations: ['FHIR Observation', 'HL7 ORU messages', 'Lab Information Systems'],
        complianceFeatures: ['Data Encryption', 'Access Control', 'Audit Logging'],
        isVerified: true,
        isHipaaCompliant: true,
        isResponsive: true,
        tags: ['Lab Results', 'Data Visualization', 'FHIR', 'Trends']
      }
    ];

    await db.insert(components).values(componentData);

    // Seed sample project
    const [sampleProject] = await db.insert(projects).values({
      name: 'MedBuilder Demo Portal',
      description: 'Sample patient portal built with MedBuilder',
      userId: sampleUser.id,
      templateId: 1,
      framework: 'react',
      backend: 'nodejs',
      database: 'postgresql',
      cloudProvider: 'aws',
      projectType: 'web',
      techStack: {
        frontend: ['React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js', 'Express', 'Drizzle ORM'],
        database: ['PostgreSQL'],
        cloud: ['AWS'],
        security: ['HIPAA Compliance', 'OAuth 2.0', 'TLS 1.3']
      },
      buildConfig: {
        build_command: 'npm run build',
        start_command: 'npm start',
        node_version: '18.x'
      },
      environmentVars: {
        NODE_ENV: 'production',
        DATABASE_URL: 'encrypted',
        HIPAA_COMPLIANCE: 'enabled'
      },
      isHipaaCompliant: true,
      isResponsive: true,
      code: {
        structure: 'Modern React application with TypeScript',
        components: 12,
        pages: 8,
        apis: 15
      },
      settings: {
        compliance_level: 'hipaa',
        security_enabled: true,
        analytics_enabled: false
      }
    }).returning();

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created: ${domains.length} domains, ${agents.length} agents, ${standards.length} standards`);
    console.log(`🏗️ Created: ${templateData.length} templates, ${componentData.length} components`);
    console.log(`👤 Created: 1 user, 1 sample project`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}