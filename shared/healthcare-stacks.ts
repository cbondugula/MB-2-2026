// Healthcare-specific technology stacks and configurations

export interface TechStack {
  id: string;
  name: string;
  description: string;
  category: "web" | "mobile" | "desktop" | "api" | "fullstack";
  healthcareDomain: "clinical" | "research" | "pharma" | "medtech" | "telehealth" | "admin";
  frontend?: FrameworkConfig;
  backend: BackendConfig;
  database: DatabaseConfig;
  cloud: CloudConfig;
  compliance: ComplianceConfig;
  integrations: IntegrationConfig[];
}

export interface FrameworkConfig {
  name: string;
  version: string;
  features: string[];
  buildConfig: Record<string, any>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  responsive: boolean;
  pwa: boolean;
}

export interface BackendConfig {
  language: string;
  framework: string;
  version: string;
  features: string[];
  dependencies: Record<string, string>;
  environment: Record<string, string>;
  security: SecurityConfig;
}

export interface DatabaseConfig {
  type: "postgresql" | "mysql" | "mongodb" | "firebase" | "supabase" | "dynamodb";
  version?: string;
  features: string[];
  connection: Record<string, any>;
  migrations: boolean;
  backup: boolean;
  encryption: boolean;
}

export interface CloudConfig {
  provider: "aws" | "gcp" | "azure" | "vercel" | "netlify" | "digital-ocean";
  services: CloudService[];
  deployment: DeploymentConfig;
  monitoring: MonitoringConfig;
}

export interface CloudService {
  name: string;
  type: "compute" | "storage" | "database" | "ai-ml" | "security" | "networking";
  healthcareOptimized: boolean;
  hipaaCompliant: boolean;
  config: Record<string, any>;
}

export interface DeploymentConfig {
  type: "container" | "serverless" | "static" | "vm";
  cicd: boolean;
  staging: boolean;
  production: boolean;
  rollback: boolean;
}

export interface MonitoringConfig {
  logging: boolean;
  metrics: boolean;
  alerting: boolean;
  healthChecks: boolean;
  auditTrail: boolean;
}

export interface ComplianceConfig {
  hipaa: boolean;
  fda: boolean;
  gdpr: boolean;
  soc2: boolean;
  features: ComplianceFeature[];
}

export interface ComplianceFeature {
  name: string;
  description: string;
  implementation: string;
  required: boolean;
}

export interface IntegrationConfig {
  name: string;
  type: "fhir" | "hl7" | "ehr" | "lab" | "pharmacy" | "imaging" | "ai-ml";
  provider: string;
  endpoint?: string;
  authentication: string;
  features: string[];
  sampleCode: Record<string, string>; // language -> code
}

// Predefined healthcare technology stacks
export const HEALTHCARE_STACKS: TechStack[] = [
  {
    id: "react-node-hipaa",
    name: "React + Node.js HIPAA Stack",
    description: "Full-stack React application with Node.js backend, optimized for HIPAA compliance",
    category: "fullstack",
    healthcareDomain: "clinical",
    frontend: {
      name: "react",
      version: "^18.0.0",
      features: ["responsive", "pwa", "accessibility", "encryption"],
      buildConfig: {
        target: "web",
        bundle: true,
        minify: true,
        sourcemap: false
      },
      dependencies: {
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "@tanstack/react-query": "^5.0.0",
        "crypto-js": "^4.1.1"
      },
      devDependencies: {
        "vite": "^5.0.0",
        "@types/react": "^18.0.0"
      },
      scripts: {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
      },
      responsive: true,
      pwa: true
    },
    backend: {
      language: "typescript",
      framework: "express",
      version: "^4.18.0",
      features: ["auth", "encryption", "audit-logging", "rate-limiting"],
      dependencies: {
        "express": "^4.18.0",
        "bcrypt": "^5.1.0",
        "jsonwebtoken": "^9.0.0",
        "helmet": "^7.0.0"
      },
      environment: {
        "NODE_ENV": "production",
        "HTTPS_ONLY": "true",
        "SESSION_SECURE": "true"
      },
      security: {
        https: true,
        cors: true,
        helmet: true,
        rateLimit: true,
        encryption: "AES-256"
      }
    },
    database: {
      type: "postgresql",
      version: "15",
      features: ["encryption", "backup", "audit", "clustering"],
      connection: {
        ssl: true,
        connectionLimit: 20
      },
      migrations: true,
      backup: true,
      encryption: true
    },
    cloud: {
      provider: "aws",
      services: [
        {
          name: "EC2",
          type: "compute",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { instanceType: "t3.medium", encryption: true }
        },
        {
          name: "RDS",
          type: "database",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { encryption: true, backups: true }
        }
      ],
      deployment: {
        type: "container",
        cicd: true,
        staging: true,
        production: true,
        rollback: true
      },
      monitoring: {
        logging: true,
        metrics: true,
        alerting: true,
        healthChecks: true,
        auditTrail: true
      }
    },
    compliance: {
      hipaa: true,
      fda: false,
      gdpr: true,
      soc2: true,
      features: [
        {
          name: "Data Encryption",
          description: "End-to-end encryption for PHI",
          implementation: "AES-256 encryption",
          required: true
        },
        {
          name: "Audit Logging",
          description: "Complete audit trail for all data access",
          implementation: "Structured logging with retention",
          required: true
        }
      ]
    },
    integrations: [
      {
        name: "FHIR R4",
        type: "fhir",
        provider: "hl7",
        authentication: "oauth2",
        features: ["patient-data", "observations", "encounters"],
        sampleCode: {
          "typescript": `
import { Client } from 'fhir-kit-client';
const client = new Client({ baseUrl: 'https://api.example.com/fhir' });
const patient = await client.read({ resourceType: 'Patient', id: '123' });
          `
        }
      }
    ]
  },
  {
    id: "flutter-python-research",
    name: "Flutter + Python Research Stack",
    description: "Cross-platform mobile app with Python ML backend for research applications",
    category: "mobile",
    healthcareDomain: "research",
    frontend: {
      name: "flutter",
      version: "^3.16.0",
      features: ["cross-platform", "offline-support", "biometric-auth"],
      buildConfig: {
        target: "mobile",
        platforms: ["ios", "android"],
        minSdkVersion: 21
      },
      dependencies: {
        "flutter": "^3.16.0",
        "http": "^1.1.0",
        "local_auth": "^2.1.6"
      },
      devDependencies: {},
      scripts: {
        "build:android": "flutter build apk",
        "build:ios": "flutter build ios"
      },
      responsive: true,
      pwa: false
    },
    backend: {
      language: "python",
      framework: "fastapi",
      version: "^0.104.0",
      features: ["ml-models", "data-processing", "api-gateway"],
      dependencies: {
        "fastapi": "^0.104.0",
        "uvicorn": "^0.24.0",
        "pandas": "^2.1.0",
        "scikit-learn": "^1.3.0"
      },
      environment: {
        "PYTHONPATH": "/app",
        "MODEL_PATH": "/models"
      },
      security: {
        https: true,
        cors: true,
        helmet: false,
        rateLimit: true,
        encryption: "AES-256"
      }
    },
    database: {
      type: "postgresql",
      version: "15",
      features: ["json-support", "time-series", "analytics"],
      connection: {
        ssl: true,
        connectionLimit: 50
      },
      migrations: true,
      backup: true,
      encryption: true
    },
    cloud: {
      provider: "gcp",
      services: [
        {
          name: "Cloud Run",
          type: "compute",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { scaling: "auto", memory: "2Gi" }
        },
        {
          name: "Cloud SQL",
          type: "database",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { encryption: true, backups: true }
        }
      ],
      deployment: {
        type: "container",
        cicd: true,
        staging: true,
        production: true,
        rollback: true
      },
      monitoring: {
        logging: true,
        metrics: true,
        alerting: true,
        healthChecks: true,
        auditTrail: true
      }
    },
    compliance: {
      hipaa: true,
      fda: true,
      gdpr: true,
      soc2: false,
      features: [
        {
          name: "Data Validation",
          description: "Clinical data validation and integrity checks",
          implementation: "Pydantic models with validation",
          required: true
        }
      ]
    },
    integrations: [
      {
        name: "REDCap",
        type: "ehr",
        provider: "vanderbilt",
        authentication: "api-key",
        features: ["data-export", "surveys", "reports"],
        sampleCode: {
          "python": `
import redcap
project = redcap.Project('https://redcap.example.com/api/', 'API_KEY')
data = project.export_records()
          `
        }
      }
    ]
  }
];

export interface SecurityConfig {
  https: boolean;
  cors: boolean;
  helmet: boolean;
  rateLimit: boolean;
  encryption: string;
}