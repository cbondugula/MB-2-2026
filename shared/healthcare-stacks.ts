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

// Focused healthcare technology stacks - React/Angular + Node.js/Python
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
    id: "angular-node-clinical",
    name: "Angular + Node.js Clinical Stack",
    description: "Enterprise Angular frontend with Node.js backend for clinical applications",
    category: "fullstack",
    healthcareDomain: "clinical",
    frontend: {
      name: "angular",
      version: "^17.0.0",
      features: ["enterprise-ui", "forms", "accessibility", "pwa"],
      buildConfig: {
        target: "web",
        outputPath: "dist",
        optimization: true
      },
      dependencies: {
        "@angular/core": "^17.0.0",
        "@angular/common": "^17.0.0",
        "@angular/forms": "^17.0.0",
        "@angular/router": "^17.0.0",
        "@angular/material": "^17.0.0",
        "rxjs": "^7.8.0"
      },
      devDependencies: {
        "@angular/cli": "^17.0.0",
        "typescript": "^5.2.0"
      },
      scripts: {
        "dev": "ng serve",
        "build": "ng build",
        "test": "ng test"
      },
      responsive: true,
      pwa: true
    },
    backend: {
      language: "typescript",
      framework: "express",
      version: "^4.18.0",
      features: ["auth", "validation", "audit-logging", "api-versioning"],
      dependencies: {
        "express": "^4.18.0",
        "express-validator": "^7.0.0",
        "bcryptjs": "^2.4.3",
        "jsonwebtoken": "^9.0.0",
        "helmet": "^7.0.0",
        "cors": "^2.8.5"
      },
      environment: {
        "NODE_ENV": "production",
        "JWT_SECRET": "secure-key",
        "SESSION_SECRET": "session-key"
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
      features: ["encryption", "backup", "replication", "audit"],
      connection: {
        ssl: true,
        connectionLimit: 25
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
          config: { instanceType: "t3.large", encryption: true }
        },
        {
          name: "RDS",
          type: "database",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { encryption: true, multiAZ: true }
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
          name: "Role-Based Access",
          description: "Granular access control for clinical data",
          implementation: "Angular guards with JWT validation",
          required: true
        }
      ]
    },
    integrations: [
      {
        name: "Epic MyChart",
        type: "ehr",
        provider: "epic",
        authentication: "oauth2",
        features: ["patient-data", "appointments", "messaging"],
        sampleCode: {
          "typescript": `
import { HttpClient } from '@angular/common/http';
const headers = { Authorization: 'Bearer ' + token };
this.http.get('/api/epic/patients', { headers }).subscribe(data => console.log(data));
          `
        }
      }
    ]
  },
  {
    id: "react-python-research",
    name: "React + Python Research Stack",
    description: "Modern React frontend with Python ML backend for life sciences research",
    category: "fullstack",
    healthcareDomain: "research",
    frontend: {
      name: "react",
      version: "^18.2.0",
      features: ["data-visualization", "real-time", "responsive", "charts"],
      buildConfig: {
        target: "web",
        bundle: true,
        optimization: true
      },
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "@tanstack/react-query": "^5.0.0",
        "recharts": "^2.8.0",
        "plotly.js": "^2.26.0",
        "socket.io-client": "^4.7.0"
      },
      devDependencies: {
        "vite": "^5.0.0",
        "@types/react": "^18.2.0"
      },
      scripts: {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
      },
      responsive: true,
      pwa: false
    },
    backend: {
      language: "python",
      framework: "fastapi",
      version: "^0.104.0",
      features: ["ml-models", "data-analysis", "real-time", "batch-processing"],
      dependencies: {
        "fastapi": "^0.104.0",
        "uvicorn": "^0.24.0",
        "pandas": "^2.1.0",
        "numpy": "^1.24.0",
        "scikit-learn": "^1.3.0",
        "tensorflow": "^2.14.0",
        "sqlalchemy": "^2.0.0"
      },
      environment: {
        "PYTHONPATH": "/app",
        "MODEL_PATH": "/models",
        "DATA_PATH": "/data"
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
      features: ["time-series", "json-support", "full-text-search", "analytics"],
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
          config: { scaling: "auto", memory: "4Gi", cpu: "2" }
        },
        {
          name: "BigQuery",
          type: "database",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { encryption: true, dataLake: true }
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
          name: "Data Anonymization",
          description: "Automatic PHI removal for research datasets",
          implementation: "Python libraries for data masking",
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
        features: ["research-data", "clinical-trials", "genomics"],
        sampleCode: {
          "python": `
from fhir.resources.patient import Patient
import requests

headers = {'Authorization': f'Bearer {token}'}
response = requests.get('https://api.fhir.org/Patient', headers=headers)
patients = [Patient.parse_obj(p) for p in response.json()['entry']]
          `
        }
      }
    ]
  },
  {
    id: "angular-python-pharma",
    name: "Angular + Python Pharma Stack", 
    description: "Enterprise Angular with Python analytics for pharmaceutical applications",
    category: "fullstack",
    healthcareDomain: "pharma",
    frontend: {
      name: "angular",
      version: "^17.0.0",
      features: ["data-tables", "charts", "forms", "reports"],
      buildConfig: {
        target: "web",
        optimization: true,
        budgets: true
      },
      dependencies: {
        "@angular/core": "^17.0.0",
        "@angular/material": "^17.0.0",
        "@angular/cdk": "^17.0.0",
        "ag-grid-angular": "^31.0.0",
        "chart.js": "^4.4.0",
        "ng2-charts": "^5.0.0"
      },
      devDependencies: {
        "@angular/cli": "^17.0.0",
        "typescript": "^5.2.0"
      },
      scripts: {
        "dev": "ng serve",
        "build": "ng build --configuration production",
        "test": "ng test"
      },
      responsive: true,
      pwa: true
    },
    backend: {
      language: "python",
      framework: "django",
      version: "^4.2.0",
      features: ["admin-panel", "orm", "auth", "rest-api"],
      dependencies: {
        "django": "^4.2.0",
        "djangorestframework": "^3.14.0",
        "django-cors-headers": "^4.3.0",
        "pandas": "^2.1.0",
        "numpy": "^1.24.0"
      },
      environment: {
        "DJANGO_ENV": "production",
        "SECRET_KEY": "django-secret",
        "DATABASE_URL": "postgresql://..."
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
      features: ["partitioning", "indexing", "reporting", "analytics"],
      connection: {
        ssl: true,
        connectionLimit: 30
      },
      migrations: true,
      backup: true,
      encryption: true
    },
    cloud: {
      provider: "azure",
      services: [
        {
          name: "App Service",
          type: "compute",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { tier: "Standard", scaling: "auto" }
        },
        {
          name: "Azure Database",
          type: "database", 
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { encryption: true, geo_redundancy: true }
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
      soc2: true,
      features: [
        {
          name: "Clinical Trial Management",
          description: "FDA-compliant trial data management",
          implementation: "Django admin with audit trails",
          required: true
        }
      ]
    },
    integrations: [
      {
        name: "Clinical Data Interchange Standards Consortium (CDISC)",
        type: "ehr",
        provider: "cdisc",
        authentication: "api-key",
        features: ["clinical-trials", "regulatory-reporting"],
        sampleCode: {
          "python": `
import pandas as pd
from django.db import models

class ClinicalTrial(models.Model):
    trial_id = models.CharField(max_length=50)
    data = models.JSONField()
    
    def export_cdisc_format(self):
        return pd.DataFrame(self.data)
          `
        }
      }
    ]
  },
  {
    id: "react-native-node-telehealth",
    name: "React Native + Node.js Telehealth Stack",
    description: "Cross-platform mobile app with Node.js backend for telehealth applications",
    category: "mobile",
    healthcareDomain: "telehealth",
    frontend: {
      name: "react-native",
      version: "^0.73.0",
      features: ["cross-platform", "video-calls", "push-notifications", "biometric-auth"],
      buildConfig: {
        target: "mobile",
        platforms: ["ios", "android"],
        minSdkVersion: 24,
        targetSdkVersion: 34
      },
      dependencies: {
        "react-native": "^0.73.0",
        "react-navigation": "^6.0.0",
        "@react-native-async-storage/async-storage": "^1.19.0",
        "react-native-webrtc": "^1.106.0",
        "react-native-push-notification": "^8.1.0",
        "react-native-biometrics": "^3.0.0",
        "@react-native-camera-roll/camera-roll": "^5.7.0"
      },
      devDependencies: {
        "@react-native/metro-config": "^0.73.0",
        "react-native-flipper": "^0.212.0"
      },
      scripts: {
        "android": "react-native run-android",
        "ios": "react-native run-ios",
        "start": "react-native start",
        "build:android": "cd android && ./gradlew assembleRelease",
        "build:ios": "xcodebuild -workspace ios/App.xcworkspace -scheme App archive"
      },
      responsive: true,
      pwa: false
    },
    backend: {
      language: "typescript",
      framework: "express",
      version: "^4.18.0",
      features: ["websockets", "video-streaming", "push-notifications", "scheduling"],
      dependencies: {
        "express": "^4.18.0",
        "socket.io": "^4.7.0",
        "node-cron": "^3.0.0",
        "twilio": "^4.19.0",
        "firebase-admin": "^11.11.0",
        "jsonwebtoken": "^9.0.0"
      },
      environment: {
        "NODE_ENV": "production",
        "TWILIO_ACCOUNT_SID": "twilio-sid",
        "FIREBASE_PROJECT_ID": "firebase-project"
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
      features: ["real-time", "encryption", "scheduling", "messaging"],
      connection: {
        ssl: true,
        connectionLimit: 40
      },
      migrations: true,
      backup: true,
      encryption: true
    },
    cloud: {
      provider: "aws",
      services: [
        {
          name: "ECS",
          type: "compute",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { scaling: "auto", cpu: "1 vCPU", memory: "2GB" }
        },
        {
          name: "RDS",
          type: "database",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { encryption: true, backups: true }
        },
        {
          name: "S3",
          type: "storage",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { encryption: true, versioning: true }
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
          name: "End-to-End Encryption",
          description: "Video calls and messaging with E2E encryption",
          implementation: "WebRTC with DTLS-SRTP encryption",
          required: true
        },
        {
          name: "Biometric Authentication",
          description: "Secure patient login with fingerprint/face ID",
          implementation: "React Native Biometrics with secure keystore",
          required: true
        }
      ]
    },
    integrations: [
      {
        name: "Twilio Video",
        type: "ehr",
        provider: "twilio",
        authentication: "api-key",
        features: ["video-calls", "recording", "screen-sharing"],
        sampleCode: {
          "typescript": `
import { TwilioVideo } from 'react-native-twilio-video-webrtc';

const VideoCall = ({ accessToken, roomName }) => {
  return (
    <TwilioVideo
      token={accessToken}
      roomName={roomName}
      onRoomDidConnect={() => console.log('Connected')}
      onRoomDidDisconnect={() => console.log('Disconnected')}
    />
  );
};
          `
        }
      }
    ]
  },
  {
    id: "flutter-python-clinical",
    name: "Flutter + Python Clinical Stack",
    description: "Cross-platform Flutter app with Python backend for clinical data collection",
    category: "mobile", 
    healthcareDomain: "clinical",
    frontend: {
      name: "flutter",
      version: "^3.16.0",
      features: ["cross-platform", "offline-sync", "forms", "barcode-scanner"],
      buildConfig: {
        target: "mobile",
        platforms: ["ios", "android"],
        minSdkVersion: 21,
        targetSdkVersion: 34
      },
      dependencies: {
        "flutter": "^3.16.0",
        "http": "^1.1.0",
        "sqflite": "^2.3.0",
        "barcode_scan2": "^4.2.0",
        "local_auth": "^2.1.6",
        "path_provider": "^2.1.1"
      },
      devDependencies: {
        "flutter_test": "sdk: flutter",
        "flutter_lints": "^3.0.0"
      },
      scripts: {
        "build:android": "flutter build apk --release",
        "build:ios": "flutter build ios --release",
        "run": "flutter run",
        "test": "flutter test"
      },
      responsive: true,
      pwa: false
    },
    backend: {
      language: "python",
      framework: "fastapi",
      version: "^0.104.0",
      features: ["data-validation", "sync-apis", "file-processing", "ml-integration"],
      dependencies: {
        "fastapi": "^0.104.0",
        "uvicorn": "^0.24.0",
        "sqlalchemy": "^2.0.0",
        "pydantic": "^2.5.0",
        "pandas": "^2.1.0",
        "celery": "^5.3.0"
      },
      environment: {
        "PYTHONPATH": "/app",
        "CELERY_BROKER_URL": "redis://redis:6379",
        "DATABASE_URL": "postgresql://..."
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
      features: ["json-support", "full-text-search", "sync-tracking", "audit"],
      connection: {
        ssl: true,
        connectionLimit: 35
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
          config: { scaling: "auto", memory: "2Gi", cpu: "1" }
        },
        {
          name: "Cloud SQL",
          type: "database",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { encryption: true, point_in_time_recovery: true }
        },
        {
          name: "Cloud Storage",
          type: "storage",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { encryption: true, lifecycle_management: true }
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
          name: "Offline Data Security",
          description: "Secure local storage for offline clinical data",
          implementation: "SQLite with SQLCipher encryption",
          required: true
        },
        {
          name: "Data Synchronization",
          description: "Secure sync between mobile and server",
          implementation: "Conflict resolution with audit trails",
          required: true
        }
      ]
    },
    integrations: [
      {
        name: "HL7 FHIR",
        type: "fhir",
        provider: "hl7",
        authentication: "oauth2",
        features: ["patient-data", "observations", "encounters"],
        sampleCode: {
          "dart": `
import 'package:http/http.dart' as http;
import 'dart:convert';

class FHIRClient {
  final String baseUrl;
  final String token;
  
  FHIRClient(this.baseUrl, this.token);
  
  Future<Map<String, dynamic>> getPatient(String id) async {
    final response = await http.get(
      Uri.parse('$baseUrl/Patient/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );
    return json.decode(response.body);
  }
}
          `
        }
      }
    ]
  },
  {
    id: "react-native-python-research",
    name: "React Native + Python Research Stack",
    description: "Mobile research app with Python ML backend for clinical studies",
    category: "mobile",
    healthcareDomain: "research",
    frontend: {
      name: "react-native",
      version: "^0.73.0", 
      features: ["surveys", "data-collection", "analytics", "offline-mode"],
      buildConfig: {
        target: "mobile",
        platforms: ["ios", "android"],
        minSdkVersion: 24,
        targetSdkVersion: 34
      },
      dependencies: {
        "react-native": "^0.73.0",
        "@react-navigation/native": "^6.1.0",
        "react-native-chart-kit": "^6.12.0",
        "react-native-sqlite-storage": "^6.0.0",
        "react-native-sensors": "^7.3.0",
        "react-native-device-info": "^10.11.0"
      },
      devDependencies: {
        "@react-native/metro-config": "^0.73.0",
        "jest": "^29.7.0"
      },
      scripts: {
        "android": "react-native run-android",
        "ios": "react-native run-ios", 
        "start": "react-native start",
        "test": "jest"
      },
      responsive: true,
      pwa: false
    },
    backend: {
      language: "python",
      framework: "django",
      version: "^4.2.0",
      features: ["rest-api", "admin-panel", "data-analysis", "reporting"],
      dependencies: {
        "django": "^4.2.0",
        "djangorestframework": "^3.14.0",
        "pandas": "^2.1.0",
        "numpy": "^1.24.0",
        "scipy": "^1.11.0",
        "matplotlib": "^3.8.0"
      },
      environment: {
        "DJANGO_ENV": "production",
        "SECRET_KEY": "django-secret",
        "DATABASE_URL": "postgresql://..."
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
      features: ["time-series", "analytics", "reporting", "data-export"],
      connection: {
        ssl: true,
        connectionLimit: 45
      },
      migrations: true,
      backup: true,
      encryption: true
    },
    cloud: {
      provider: "azure",
      services: [
        {
          name: "Container Instances",
          type: "compute",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { scaling: "manual", cpu: "2 cores", memory: "4GB" }
        },
        {
          name: "Database for PostgreSQL",
          type: "database",
          healthcareOptimized: true,
          hipaaCompliant: true,
          config: { encryption: true, geo_redundancy: true }
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
      soc2: true,
      features: [
        {
          name: "Research Data Management",
          description: "Compliant handling of clinical research data",
          implementation: "Django models with validation and audit",
          required: true
        },
        {
          name: "Participant Consent",
          description: "Digital consent forms with e-signatures",
          implementation: "React Native forms with cryptographic signatures",
          required: true
        }
      ]
    },
    integrations: [
      {
        name: "REDCap API",
        type: "ehr",
        provider: "vanderbilt",
        authentication: "api-key",
        features: ["data-export", "surveys", "participant-management"],
        sampleCode: {
          "python": `
import requests

class REDCapClient:
    def __init__(self, api_url, api_token):
        self.api_url = api_url
        self.api_token = api_token
    
    def export_records(self, fields=None):
        data = {
            'token': self.api_token,
            'content': 'record',
            'format': 'json',
            'type': 'flat',
            'fields': fields or []
        }
        response = requests.post(self.api_url, data=data)
        return response.json()
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