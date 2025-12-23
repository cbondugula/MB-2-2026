import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
  bigint,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (supports both Replit Auth and email/password)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  passwordHash: varchar("password_hash"),
  authProvider: varchar("auth_provider").default("local"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// HIPAA Audit Logs table (compliance requirement)
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull(), // Who performed the action
    action: varchar("action").notNull(), // CREATE, READ, UPDATE, DELETE
    tableName: varchar("table_name").notNull(), // Which table was accessed
    recordId: varchar("record_id"), // Which specific record (if applicable)
    oldValues: jsonb("old_values"), // Previous state (for UPDATE/DELETE)
    newValues: jsonb("new_values"), // New state (for CREATE/UPDATE)
    ipAddress: varchar("ip_address"), // Source IP
    userAgent: varchar("user_agent"), // Browser/client info
    metadata: jsonb("metadata"), // Additional context
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (table) => [
    index("idx_audit_logs_user_id").on(table.userId),
    index("idx_audit_logs_table_name").on(table.tableName),
    index("idx_audit_logs_timestamp").on(table.timestamp),
  ],
);

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  userId: varchar("user_id").notNull(),
  templateId: integer("template_id"),
  framework: varchar("framework").notNull(), // react, angular, vue, nextjs, nuxt, svelte, etc.
  backend: varchar("backend").notNull(), // nodejs, python, java, go, rust, php, etc.
  database: varchar("database"), // postgresql, mysql, mongodb, firebase, supabase, etc.
  cloudProvider: varchar("cloud_provider"), // aws, gcp, azure, vercel, netlify, etc.
  projectType: varchar("project_type").notNull(), // web, mobile, desktop, api, fullstack
  techStack: jsonb("tech_stack"), // detailed tech stack configuration
  buildConfig: jsonb("build_config"), // build and deployment configuration
  environmentVars: jsonb("environment_vars"), // environment variables
  dependencies: jsonb("dependencies"), // project dependencies
  isHipaaCompliant: boolean("is_hipaa_compliant").default(false),
  isResponsive: boolean("is_responsive").default(true),
  code: jsonb("code"), // Store project files and structure
  settings: jsonb("settings"), // Project configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Templates table
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // "EHR", "Telemedicine", "Patient Portal", "Lab Management", etc.
  healthcareDomain: varchar("healthcare_domain").notNull(), // "clinical", "research", "pharma", "medtech", "telehealth"
  framework: varchar("framework").notNull(), // react, angular, vue, flutter, react-native, etc.
  backend: varchar("backend").notNull(), // nodejs, python, java, go, etc.
  projectType: varchar("project_type").notNull(), // web, mobile, desktop, api
  complianceLevel: varchar("compliance_level").notNull(), // hipaa, fda, gdpr, soc2
  imageUrl: varchar("image_url"),
  code: jsonb("code").notNull(), // Template files and structure
  buildConfig: jsonb("build_config"), // Framework-specific build configuration
  dependencies: jsonb("dependencies"), // Tech stack dependencies
  isHipaaCompliant: boolean("is_hipaa_compliant").default(true),
  tags: jsonb("tags"), // Array of tags like ["FHIR", "HL7", "Mobile", "AI", "Blockchain"]
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Components table
export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // "Forms", "Charts", "Communication", "Data Visualization", etc.
  healthcareUseCase: varchar("healthcare_use_case"), // "patient-data", "clinical-notes", "lab-results", etc.
  frameworks: jsonb("frameworks"), // ["react", "angular", "vue", "flutter"] - supported frameworks
  icon: varchar("icon"), // Font Awesome icon class
  code: jsonb("code").notNull(), // Multi-framework component implementations
  apiIntegrations: jsonb("api_integrations"), // FHIR, HL7, Epic integrations
  complianceFeatures: jsonb("compliance_features"), // HIPAA, audit trail features
  isVerified: boolean("is_verified").default(false),
  isHipaaCompliant: boolean("is_hipaa_compliant").default(true),
  isResponsive: boolean("is_responsive").default(true),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API Integrations table
export const apiIntegrations = pgTable("api_integrations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // "FHIR", "HL7", "Epic", "Cerner", "AWS HealthLake", etc.
  category: varchar("category").notNull(), // "ehr", "lab", "pharmacy", "imaging", "ai-ml", "cloud"
  provider: varchar("provider"), // "epic", "cerner", "aws", "google", "microsoft", etc.
  endpoint: varchar("endpoint"),
  authentication: varchar("authentication"), // "oauth2", "api-key", "cert-based", etc.
  supportedBackends: jsonb("supported_backends"), // ["nodejs", "python", "java", "go"]
  supportedClouds: jsonb("supported_clouds"), // ["aws", "gcp", "azure"]
  documentation: text("documentation"),
  configTemplate: jsonb("config_template"),
  sdkExamples: jsonb("sdk_examples"), // Code examples for different languages
  complianceNotes: text("compliance_notes"), // HIPAA, security considerations
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Global Privacy Compliance table
export const privacyCompliance = pgTable("privacy_compliance", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  applicableLaws: jsonb("applicable_laws").notNull(), // Array of privacy law IDs
  complianceStatus: varchar("compliance_status").notNull(), // "compliant", "partial", "non-compliant"
  assessmentDate: timestamp("assessment_date").defaultNow(),
  requirements: jsonb("requirements"), // Specific requirements for each law
  implementationNotes: text("implementation_notes"),
  auditTrail: jsonb("audit_trail"), // Compliance verification history
  riskAssessment: jsonb("risk_assessment"), // Risk analysis for each jurisdiction
  crossBorderTransfers: jsonb("cross_border_transfers"), // International transfer documentation
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Multicultural Healthcare table
export const multiculturalSupport = pgTable("multicultural_support", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  targetCultures: jsonb("target_cultures").notNull(), // Array of cultural groups
  supportedLanguages: jsonb("supported_languages").notNull(), // Array of languages
  culturalConsiderations: jsonb("cultural_considerations"), // Specific cultural requirements
  communicationPatterns: jsonb("communication_patterns"), // Cultural communication preferences
  religiousConsiderations: jsonb("religious_considerations"), // Religious accommodations
  accessibilityFeatures: jsonb("accessibility_features"), // Cultural accessibility needs
  translationStatus: varchar("translation_status"), // "complete", "partial", "pending"
  culturalValidation: jsonb("cultural_validation"), // Community validation feedback
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Alternative Medicine Integration table
export const alternativeMedicine = pgTable("alternative_medicine", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  supportedSystems: jsonb("supported_systems").notNull(), // Array of alternative medicine systems
  integrationLevel: varchar("integration_level").notNull(), // "basic", "moderate", "comprehensive"
  safetyProtocols: jsonb("safety_protocols"), // Safety measures and drug interaction checks
  practitionerNetwork: jsonb("practitioner_network"), // Network of certified practitioners
  evidenceBase: jsonb("evidence_base"), // Research and evidence documentation
  regulatoryCompliance: jsonb("regulatory_compliance"), // Compliance with alt medicine regulations
  patientEducation: jsonb("patient_education"), // Educational materials for patients
  qualityAssurance: jsonb("quality_assurance"), // Quality control measures
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Healthcare Domains table - Dynamic healthcare domain management
export const healthcareDomains = pgTable("healthcare_domains", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  description: text("description"),
  subdomains: jsonb("subdomains"), // Array of subdomain strings
  standards: jsonb("standards"), // Array of applicable standards
  regulations: jsonb("regulations"), // Array of regulations
  stakeholders: jsonb("stakeholders"), // Array of stakeholders
  technologies: jsonb("technologies"), // Array of relevant technologies
  dataTypes: jsonb("data_types"), // Array of data types
  integrations: jsonb("integrations"), // Array of possible integrations
  globalCoverage: boolean("global_coverage").default(true),
  languages: jsonb("languages"), // Array of supported languages
  countries: jsonb("countries"), // Array of supported countries
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Healthcare Agents table - Dynamic AI agent configurations
export const healthcareAgents = pgTable("healthcare_agents", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // "clinical", "research", "administrative", etc.
  specialty: varchar("specialty"), // Medical specialty if applicable
  capabilities: jsonb("capabilities"), // Array of agent capabilities
  models: jsonb("models"), // AI models used (GPT-4, Claude, Gemini, etc.)
  healthcareDomains: jsonb("healthcare_domains"), // Array of applicable domains
  compliance: jsonb("compliance"), // HIPAA, FDA, etc. compliance features
  integrations: jsonb("integrations"), // EHR, lab systems, etc.
  configuration: jsonb("configuration"), // Agent-specific configuration
  isPublic: boolean("is_public").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Healthcare Standards table - Dynamic standards management
export const healthcareStandards = pgTable("healthcare_standards", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  acronym: varchar("acronym"),
  category: varchar("category").notNull(), // "data", "messaging", "security", etc.
  description: text("description"),
  version: varchar("version"),
  organization: varchar("organization"), // HL7, FHIR, etc.
  implementationGuide: text("implementation_guide"),
  supportedCountries: jsonb("supported_countries"),
  complianceRequirements: jsonb("compliance_requirements"),
  technicalSpecs: jsonb("technical_specs"),
  apiEndpoints: jsonb("api_endpoints"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Global Healthcare Organizations table
export const healthcareOrganizations = pgTable("healthcare_organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // "hospital", "pharmaceutical", "insurance", etc.
  category: varchar("category"), // "provider", "payer", "vendor", etc.
  country: varchar("country"),
  region: varchar("region"),
  website: varchar("website"),
  apiAccess: jsonb("api_access"), // Available APIs
  contactInfo: jsonb("contact_info"),
  services: jsonb("services"), // Services offered
  standards: jsonb("standards"), // Standards supported
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical Publications table - Dynamic medical literature
export const medicalPublications = pgTable("medical_publications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authors: jsonb("authors"), // Array of author objects
  journal: varchar("journal"),
  pubmedId: varchar("pubmed_id"),
  doi: varchar("doi"),
  abstract: text("abstract"),
  keywords: jsonb("keywords"), // Array of keywords
  medicalSpecialty: varchar("medical_specialty"),
  publicationType: varchar("publication_type"), // "research", "review", "case-study", etc.
  publicationDate: timestamp("publication_date"),
  impactFactor: jsonb("impact_factor"),
  citations: integer("citations").default(0),
  fullTextUrl: varchar("full_text_url"),
  isOpenAccess: boolean("is_open_access").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Healthcare Simulations table
export const healthcareSimulations = pgTable("healthcare_simulations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // "clinical-trial", "disease-progression", etc.
  category: varchar("category"), // "education", "research", "planning", etc.
  description: text("description"),
  parameters: jsonb("parameters"), // Simulation parameters
  results: jsonb("results"), // Simulation results
  userId: varchar("user_id").notNull(),
  isPublic: boolean("is_public").default(false),
  status: varchar("status").default("draft"), // "draft", "running", "completed"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project Activity Log
export const projectActivities = pgTable("project_activities", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  action: varchar("action").notNull(), // "created", "updated", "deployed", etc.
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Assistant Sessions
export const aiSessions = pgTable("ai_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  projectId: integer("project_id"),
  type: varchar("type").notNull(), // "code_completion", "compliance_check", "architecture_review"
  context: jsonb("context"), // Current file, cursor position, selected code
  prompt: text("prompt"),
  response: text("response"),
  confidence: integer("confidence"), // AI confidence score 1-100
  applied: boolean("applied").default(false), // Whether suggestion was accepted
  createdAt: timestamp("created_at").defaultNow(),
});

// Code Analysis Cache
export const codeAnalysis = pgTable("code_analysis", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  fileHash: varchar("file_hash").notNull(), // SHA256 of file content
  filePath: varchar("file_path").notNull(),
  analysisType: varchar("analysis_type").notNull(), // "security", "hipaa", "performance", "quality"
  findings: jsonb("findings"), // Array of issues/suggestions
  score: integer("score"), // Overall score 1-100
  lastAnalyzed: timestamp("last_analyzed").defaultNow(),
});

// Real-time Collaboration
export const collaborationSessions = pgTable("collaboration_sessions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id").notNull(),
  cursorPosition: jsonb("cursor_position"),
  activeFile: varchar("active_file"),
  status: varchar("status").default("active"), // "active", "idle", "disconnected"
  lastActivity: timestamp("last_activity").defaultNow(),
});

// Advanced Templates with AI
export const advancedTemplates = pgTable("advanced_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  subCategory: varchar("sub_category"),
  complexity: varchar("complexity").notNull(), // "beginner", "intermediate", "advanced", "expert"
  estimatedTime: integer("estimated_time"), // in minutes
  techStack: jsonb("tech_stack"), // Array of technologies
  aiPrompts: jsonb("ai_prompts"), // AI prompts for customization
  complianceLevel: varchar("compliance_level").notNull(), // "basic", "hipaa", "fda", "soc2"
  deploymentTargets: jsonb("deployment_targets"), // "cloud", "on-premise", "hybrid"
  code: jsonb("code").notNull(),
  metadata: jsonb("metadata"),
  downloadCount: integer("download_count").default(0),
  rating: integer("rating").default(0), // 1-5 stars
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Version History for file changes
export const fileVersions = pgTable("file_versions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  filePath: varchar("file_path").notNull(),
  content: text("content").notNull(),
  version: integer("version").notNull(),
  userId: varchar("user_id").notNull(),
  changeType: varchar("change_type").notNull(), // "create", "update", "delete"
  changeSummary: text("change_summary"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_file_versions_project").on(table.projectId),
  index("idx_file_versions_path").on(table.filePath),
]);

// AI Plan Mode - Shows step-by-step actions before executing
export const aiPlans = pgTable("ai_plans", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  prompt: text("prompt").notNull(),
  status: varchar("status").notNull().default("pending"), // "pending", "approved", "executing", "completed", "cancelled"
  steps: jsonb("steps").notNull(), // Array of { id, action, description, status, filePath?, code? }
  currentStep: integer("current_step").default(0),
  executionLog: jsonb("execution_log"), // Array of execution results
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  completedAt: timestamp("completed_at"),
});

// Console/Terminal command history
export const terminalSessions = pgTable("terminal_sessions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  command: text("command").notNull(),
  output: text("output"),
  exitCode: integer("exit_code"),
  executedAt: timestamp("executed_at").defaultNow(),
});

// Project Environments (dev, staging, production)
export const projectEnvironments = pgTable("project_environments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: varchar("name").notNull(), // "development", "staging", "production"
  displayName: varchar("display_name").notNull(),
  url: varchar("url"), // Deployed URL if applicable
  status: varchar("status").notNull().default("inactive"), // "inactive", "deploying", "active", "failed"
  isHipaaCompliant: boolean("is_hipaa_compliant").default(false),
  region: varchar("region"), // AWS/GCP region
  autoScaling: boolean("auto_scaling").default(false),
  healthCheckUrl: varchar("health_check_url"),
  lastHealthCheck: timestamp("last_health_check"),
  healthStatus: varchar("health_status"), // "healthy", "degraded", "unhealthy"
  configuration: jsonb("configuration"), // Environment-specific config
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_project_environments_project").on(table.projectId),
  index("idx_project_environments_name").on(table.name),
]);

// Project Secrets (scoped by environment)
export const projectSecrets = pgTable("project_secrets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  environmentId: integer("environment_id"), // null = all environments
  key: varchar("key").notNull(),
  encryptedValue: text("encrypted_value").notNull(), // Encrypted secret value
  description: text("description"),
  isRequired: boolean("is_required").default(false),
  lastRotated: timestamp("last_rotated"),
  expiresAt: timestamp("expires_at"),
  createdBy: varchar("created_by").notNull(),
  updatedBy: varchar("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_project_secrets_project").on(table.projectId),
  index("idx_project_secrets_env").on(table.environmentId),
]);

// HIPAA Deployments - HIPAA-compliant deployment records with full audit trail
export const hipaaDeployments = pgTable("hipaa_deployments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  environmentId: integer("environment_id").notNull(),
  userId: varchar("user_id").notNull(),
  version: varchar("version").notNull(),
  commitHash: varchar("commit_hash"),
  status: varchar("status").notNull().default("pending"), // "pending", "building", "deploying", "active", "failed", "rolled_back"
  deploymentUrl: varchar("deployment_url"),
  buildLogs: text("build_logs"),
  deployLogs: text("deploy_logs"),
  errorMessage: text("error_message"),
  isHipaaCompliant: boolean("is_hipaa_compliant").default(false),
  hipaaAuditId: varchar("hipaa_audit_id"), // Reference to compliance audit
  sslEnabled: boolean("ssl_enabled").default(true),
  wafEnabled: boolean("waf_enabled").default(false),
  encryptionAtRest: boolean("encryption_at_rest").default(true),
  backupEnabled: boolean("backup_enabled").default(false),
  rollbackTarget: integer("rollback_target"), // Previous deployment ID if rolled back
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  metadata: jsonb("metadata"), // Build config, resource usage, etc.
}, (table) => [
  index("idx_hipaa_deployments_project").on(table.projectId),
  index("idx_hipaa_deployments_env").on(table.environmentId),
  index("idx_hipaa_deployments_status").on(table.status),
]);

// Compliance Audit Events - BAA evidence and audit trail
export const complianceAuditEvents = pgTable("compliance_audit_events", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  eventType: varchar("event_type").notNull(), // "deployment", "secret_access", "phi_access", "config_change", "user_access", "export"
  eventCategory: varchar("event_category").notNull(), // "security", "access", "configuration", "deployment", "data"
  severity: varchar("severity").notNull().default("info"), // "info", "warning", "critical"
  description: text("description").notNull(),
  resourceType: varchar("resource_type"), // "secret", "environment", "deployment", "user", "file"
  resourceId: varchar("resource_id"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  location: varchar("location"), // Geo location if available
  previousState: jsonb("previous_state"),
  newState: jsonb("new_state"),
  isPhiRelated: boolean("is_phi_related").default(false),
  baaReference: varchar("baa_reference"), // BAA document reference
  retentionPeriod: integer("retention_period").default(2190), // 6 years in days for HIPAA
  exportedAt: timestamp("exported_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_compliance_audit_project").on(table.projectId),
  index("idx_compliance_audit_type").on(table.eventType),
  index("idx_compliance_audit_category").on(table.eventCategory),
  index("idx_compliance_audit_timestamp").on(table.createdAt),
]);

// GitHub/Git Integration
export const gitIntegrations = pgTable("git_integrations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  provider: varchar("provider").notNull().default("github"), // "github", "gitlab", "bitbucket"
  repoOwner: varchar("repo_owner"),
  repoName: varchar("repo_name"),
  repoUrl: varchar("repo_url"),
  defaultBranch: varchar("default_branch").default("main"),
  currentBranch: varchar("current_branch").default("main"),
  lastSyncedCommit: varchar("last_synced_commit"),
  syncDirection: varchar("sync_direction").default("bidirectional"), // "push", "pull", "bidirectional"
  autoSync: boolean("auto_sync").default(false),
  protectedBranches: jsonb("protected_branches"), // Array of protected branch names
  webhookSecret: varchar("webhook_secret"),
  accessToken: text("access_token"), // Encrypted GitHub token
  status: varchar("status").notNull().default("disconnected"), // "disconnected", "connected", "syncing", "error"
  lastError: text("last_error"),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_git_integrations_project").on(table.projectId),
]);

// Git Branches - Track all branches for a project
export const gitBranches = pgTable("git_branches", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  integrationId: integer("integration_id").notNull(),
  name: varchar("name").notNull(),
  sha: varchar("sha"),
  isDefault: boolean("is_default").default(false),
  isProtected: boolean("is_protected").default(false),
  lastCommitMessage: text("last_commit_message"),
  lastCommitAuthor: varchar("last_commit_author"),
  lastCommitAt: timestamp("last_commit_at"),
  aheadBy: integer("ahead_by").default(0),
  behindBy: integer("behind_by").default(0),
  hasConflicts: boolean("has_conflicts").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_git_branches_project").on(table.projectId),
  index("idx_git_branches_integration").on(table.integrationId),
]);

// Git Sync History - Log all sync operations
export const gitSyncHistory = pgTable("git_sync_history", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  integrationId: integer("integration_id").notNull(),
  direction: varchar("direction").notNull(), // "push", "pull"
  status: varchar("status").notNull(), // "pending", "in_progress", "success", "failed", "conflict"
  branch: varchar("branch").notNull(),
  startCommit: varchar("start_commit"),
  endCommit: varchar("end_commit"),
  filesChanged: integer("files_changed").default(0),
  insertions: integer("insertions").default(0),
  deletions: integer("deletions").default(0),
  conflictFiles: jsonb("conflict_files"), // Array of conflicting file paths
  errorMessage: text("error_message"),
  triggeredBy: varchar("triggered_by").notNull(), // "manual", "auto", "webhook"
  userId: varchar("user_id").notNull(),
  duration: integer("duration"), // Duration in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("idx_git_sync_project").on(table.projectId),
  index("idx_git_sync_integration").on(table.integrationId),
  index("idx_git_sync_status").on(table.status),
]);

// PR Previews - Preview environments for pull requests
export const prPreviews = pgTable("pr_previews", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  integrationId: integer("integration_id").notNull(),
  prNumber: integer("pr_number").notNull(),
  prTitle: varchar("pr_title"),
  prUrl: varchar("pr_url"),
  headBranch: varchar("head_branch").notNull(),
  baseBranch: varchar("base_branch").notNull(),
  headSha: varchar("head_sha"),
  status: varchar("status").notNull().default("pending"), // "pending", "building", "running", "stopped", "failed"
  previewUrl: varchar("preview_url"),
  buildLogs: text("build_logs"),
  errorMessage: text("error_message"),
  environmentId: integer("environment_id"), // Link to project environment
  deploymentId: integer("deployment_id"), // Link to HIPAA deployment
  autoDeployOnUpdate: boolean("auto_deploy_on_update").default(true),
  isHipaaCompliant: boolean("is_hipaa_compliant").default(false),
  expiresAt: timestamp("expires_at"),
  authorUsername: varchar("author_username"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_pr_previews_project").on(table.projectId),
  index("idx_pr_previews_integration").on(table.integrationId),
  index("idx_pr_previews_pr_number").on(table.prNumber),
]);

// Healthcare Blueprints - Ready-made FHIR/telehealth/eRx flows
export const healthcareBlueprints = pgTable("healthcare_blueprints", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // "fhir", "telehealth", "erx", "labs", "patient-intake", "scheduling"
  subcategory: varchar("subcategory"),
  complianceLevel: varchar("compliance_level").notNull(), // "hipaa", "fda", "gdpr", "soc2"
  fhirResources: jsonb("fhir_resources"), // Array of FHIR resource types used
  apiEndpoints: jsonb("api_endpoints"), // Pre-configured API endpoints
  dataModels: jsonb("data_models"), // Data schema definitions
  uiComponents: jsonb("ui_components"), // Component configurations
  workflows: jsonb("workflows"), // Step-by-step workflow definitions
  integrations: jsonb("integrations"), // Epic, Cerner, etc. integrations
  validationRules: jsonb("validation_rules"), // Data validation rules
  complianceChecks: jsonb("compliance_checks"), // Built-in compliance checks
  code: jsonb("code").notNull(), // Blueprint implementation code
  documentation: text("documentation"),
  version: varchar("version").default("1.0.0"),
  isVerified: boolean("is_verified").default(false),
  downloadCount: integer("download_count").default(0),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_healthcare_blueprints_category").on(table.category),
]);

// PHI Scan Results - Compliance scanner results
export const phiScanResults = pgTable("phi_scan_results", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  scanType: varchar("scan_type").notNull(), // "static", "dynamic", "egress"
  status: varchar("status").notNull().default("pending"), // "pending", "running", "completed", "failed"
  totalFiles: integer("total_files").default(0),
  filesScanned: integer("files_scanned").default(0),
  issuesFound: integer("issues_found").default(0),
  criticalIssues: integer("critical_issues").default(0),
  warningIssues: integer("warning_issues").default(0),
  infoIssues: integer("info_issues").default(0),
  findings: jsonb("findings"), // Array of { file, line, type, severity, description, suggestion }
  phiPatterns: jsonb("phi_patterns"), // Detected PHI patterns (SSN, MRN, etc.)
  egressRisks: jsonb("egress_risks"), // Outbound data risks
  modelSafetyScore: integer("model_safety_score"), // AI model safety grade 0-100
  recommendations: jsonb("recommendations"), // Remediation suggestions
  scanDuration: integer("scan_duration"), // Duration in seconds
  triggeredBy: varchar("triggered_by").notNull(), // "manual", "commit", "deploy", "scheduled"
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("idx_phi_scan_project").on(table.projectId),
  index("idx_phi_scan_status").on(table.status),
]);

// Package/Dependency Health
export const packageHealth = pgTable("package_health", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  packageManager: varchar("package_manager").notNull(), // "npm", "pip", "maven", etc.
  packageName: varchar("package_name").notNull(),
  currentVersion: varchar("current_version"),
  latestVersion: varchar("latest_version"),
  wantedVersion: varchar("wanted_version"),
  hasVulnerability: boolean("has_vulnerability").default(false),
  vulnerabilitySeverity: varchar("vulnerability_severity"), // "low", "moderate", "high", "critical"
  vulnerabilityCount: integer("vulnerability_count").default(0),
  vulnerabilityDetails: jsonb("vulnerability_details"),
  isOutdated: boolean("is_outdated").default(false),
  isDeprecated: boolean("is_deprecated").default(false),
  license: varchar("license"),
  isLicenseCompliant: boolean("is_license_compliant").default(true),
  lastCheckedAt: timestamp("last_checked_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_package_health_project").on(table.projectId),
  index("idx_package_health_vuln").on(table.hasVulnerability),
]);

// Smart Components with AI Context
export const smartComponents = pgTable("smart_components", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  subCategory: varchar("sub_category"),
  type: varchar("type").notNull(), // "ui", "logic", "integration", "utility"
  framework: varchar("framework").notNull(), // "react", "vue", "angular", "vanilla"
  dependencies: jsonb("dependencies"),
  props: jsonb("props"), // Component props schema
  events: jsonb("events"), // Available events
  styling: jsonb("styling"), // Tailwind classes, CSS variables
  accessibility: jsonb("accessibility"), // ARIA labels, keyboard navigation
  code: jsonb("code").notNull(),
  examples: jsonb("examples"), // Usage examples
  aiContext: jsonb("ai_context"), // Context for AI assistance
  complianceFlags: jsonb("compliance_flags"), // HIPAA, accessibility flags
  performanceMetrics: jsonb("performance_metrics"),
  isVerified: boolean("is_verified").default(false),
  downloadCount: integer("download_count").default(0),
  rating: integer("rating").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  activities: many(projectActivities),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [projects.templateId],
    references: [templates.id],
  }),
  activities: many(projectActivities),
  privacyCompliance: many(privacyCompliance),
  multiculturalSupport: many(multiculturalSupport),
  alternativeMedicine: many(alternativeMedicine),
}));

export const templatesRelations = relations(templates, ({ many }) => ({
  projects: many(projects),
}));

export const projectActivitiesRelations = relations(projectActivities, ({ one }) => ({
  project: one(projects, {
    fields: [projectActivities.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectActivities.userId],
    references: [users.id],
  }),
}));

export const aiSessionsRelations = relations(aiSessions, ({ one }) => ({
  user: one(users, {
    fields: [aiSessions.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [aiSessions.projectId],
    references: [projects.id],
  }),
}));

export const codeAnalysisRelations = relations(codeAnalysis, ({ one }) => ({
  project: one(projects, {
    fields: [codeAnalysis.projectId],
    references: [projects.id],
  }),
}));

export const collaborationSessionsRelations = relations(collaborationSessions, ({ one }) => ({
  project: one(projects, {
    fields: [collaborationSessions.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [collaborationSessions.userId],
    references: [users.id],
  }),
}));

export const privacyComplianceRelations = relations(privacyCompliance, ({ one }) => ({
  project: one(projects, {
    fields: [privacyCompliance.projectId],
    references: [projects.id],
  }),
}));

export const multiculturalSupportRelations = relations(multiculturalSupport, ({ one }) => ({
  project: one(projects, {
    fields: [multiculturalSupport.projectId],
    references: [projects.id],
  }),
}));

export const alternativeMedicineRelations = relations(alternativeMedicine, ({ one }) => ({
  project: one(projects, {
    fields: [alternativeMedicine.projectId],
    references: [projects.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertProjectSchema = createInsertSchema(projects);
export const insertTemplateSchema = createInsertSchema(templates);
export const insertComponentSchema = createInsertSchema(components);
export const insertApiIntegrationSchema = createInsertSchema(apiIntegrations);
export const insertProjectActivitySchema = createInsertSchema(projectActivities);
export const insertAiSessionSchema = createInsertSchema(aiSessions);
export const insertCodeAnalysisSchema = createInsertSchema(codeAnalysis);
export const insertCollaborationSessionSchema = createInsertSchema(collaborationSessions);
export const insertFileVersionSchema = createInsertSchema(fileVersions).omit({ id: true, createdAt: true });
export const insertAiPlanSchema = createInsertSchema(aiPlans).omit({ id: true, createdAt: true });
export const insertTerminalSessionSchema = createInsertSchema(terminalSessions).omit({ id: true, executedAt: true });
export const insertProjectEnvironmentSchema = createInsertSchema(projectEnvironments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProjectSecretSchema = createInsertSchema(projectSecrets).omit({ id: true, createdAt: true, updatedAt: true });
export const insertHipaaDeploymentSchema = createInsertSchema(hipaaDeployments).omit({ id: true, startedAt: true });
export const insertComplianceAuditEventSchema = createInsertSchema(complianceAuditEvents).omit({ id: true, createdAt: true });
export const insertGitIntegrationSchema = createInsertSchema(gitIntegrations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGitBranchSchema = createInsertSchema(gitBranches).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGitSyncHistorySchema = createInsertSchema(gitSyncHistory).omit({ id: true, createdAt: true, completedAt: true });
export const insertPrPreviewSchema = createInsertSchema(prPreviews).omit({ id: true, createdAt: true, updatedAt: true });
export const insertHealthcareBlueprintSchema = createInsertSchema(healthcareBlueprints).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPhiScanResultSchema = createInsertSchema(phiScanResults).omit({ id: true, createdAt: true });
export const insertPackageHealthSchema = createInsertSchema(packageHealth).omit({ id: true, createdAt: true });
export const insertAdvancedTemplateSchema = createInsertSchema(advancedTemplates);
export const insertSmartComponentSchema = createInsertSchema(smartComponents);
export const insertHealthcareDomainSchema = createInsertSchema(healthcareDomains);
export const insertHealthcareAgentSchema = createInsertSchema(healthcareAgents);
export const insertHealthcareStandardSchema = createInsertSchema(healthcareStandards);
export const insertHealthcareOrganizationSchema = createInsertSchema(healthcareOrganizations);
export const insertMedicalPublicationSchema = createInsertSchema(medicalPublications);
export const insertHealthcareSimulationSchema = createInsertSchema(healthcareSimulations);
export const insertPrivacyComplianceSchema = createInsertSchema(privacyCompliance);
export const insertMulticulturalSupportSchema = createInsertSchema(multiculturalSupport);
export const insertAlternativeMedicineSchema = createInsertSchema(alternativeMedicine);

// Auth signup schema (for email/password registration)
export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;

// Initial Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Memory and conversation tables for healthcare AI agents
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  agentId: varchar("agent_id").notNull(),
  title: varchar("title"),
  summary: text("summary"),
  medicalContext: jsonb("medical_context"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const memoryEntries = pgTable("memory_entries", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  agentId: varchar("agent_id").notNull(),
  conversationId: varchar("conversation_id").references(() => conversations.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(), // 'short-term', 'long-term', 'persistent'
  category: varchar("category").notNull(), // 'medical-history', 'preferences', 'context', etc.
  content: text("content").notNull(),
  importance: integer("importance").default(5), // 0-10 scale
  tags: jsonb("tags").default(sql`'[]'`),
  embedding: jsonb("embedding"), // Vector embedding for semantic search
  encrypted: boolean("encrypted").default(false),
  metadata: jsonb("metadata").default(sql`'{}'`),
  createdAt: timestamp("created_at").defaultNow(),
  lastAccessed: timestamp("last_accessed").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  key: varchar("key").notNull(),
  value: jsonb("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("user_preferences_user_key_idx").on(table.userId, table.key),
]);

// Relations for memory system
export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  memoryEntries: many(memoryEntries),
}));

export const memoryEntriesRelations = relations(memoryEntries, ({ one }) => ({
  user: one(users, {
    fields: [memoryEntries.userId],
    references: [users.id],
  }),
  conversation: one(conversations, {
    fields: [memoryEntries.conversationId],
    references: [conversations.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

// LangExtract Integration Tables
export const langExtractExtractions = pgTable("langextract_extractions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  name: varchar("name").notNull(),
  description: text("description"),
  sourceText: text("source_text").notNull(),
  extractionType: varchar("extraction_type").notNull(), // medical, clinical, legal, etc.
  instructions: text("instructions").notNull(),
  examples: jsonb("examples"), // few-shot examples
  results: jsonb("results"), // extraction results with grounding
  confidence: integer("confidence"), // 0-100
  modelUsed: varchar("model_used"), // gemini, gpt-4, etc.
  visualizationHtml: text("visualization_html"), // generated HTML
  tags: jsonb("tags"),
  isPublic: boolean("is_public").default(false),
  status: varchar("status").default("completed"), // pending, processing, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const langExtractTemplates = pgTable("langextract_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(), // medical, clinical, research, etc.
  description: text("description"),
  extractionType: varchar("extraction_type").notNull(),
  instructions: text("instructions").notNull(),
  examples: jsonb("examples").notNull(), // pre-built examples
  schema: jsonb("schema"), // extraction schema definition
  tags: jsonb("tags"),
  isVerified: boolean("is_verified").default(false),
  useCount: integer("use_count").default(0),
  rating: integer("rating").default(0), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// LangExtract Relations
export const langExtractExtractionsRelations = relations(langExtractExtractions, ({ one }) => ({
  user: one(users, {
    fields: [langExtractExtractions.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [langExtractExtractions.projectId],
    references: [projects.id],
  }),
}));

// LangExtract Insert Schemas
export const insertLangExtractExtractionSchema = createInsertSchema(langExtractExtractions);
export const insertLangExtractTemplateSchema = createInsertSchema(langExtractTemplates);

export type Conversation = typeof conversations.$inferSelect;
export type MemoryEntry = typeof memoryEntries.$inferSelect;
export type UserPreference = typeof userPreferences.$inferSelect;

// Complete Type Definitions
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type Component = typeof components.$inferSelect;
export type InsertApiIntegration = z.infer<typeof insertApiIntegrationSchema>;
export type ApiIntegration = typeof apiIntegrations.$inferSelect;
export type InsertProjectActivity = z.infer<typeof insertProjectActivitySchema>;
export type ProjectActivity = typeof projectActivities.$inferSelect;
export type InsertAiSession = z.infer<typeof insertAiSessionSchema>;
export type AiSession = typeof aiSessions.$inferSelect;
export type InsertCodeAnalysis = z.infer<typeof insertCodeAnalysisSchema>;
export type CodeAnalysis = typeof codeAnalysis.$inferSelect;
export type InsertCollaborationSession = z.infer<typeof insertCollaborationSessionSchema>;
export type CollaborationSession = typeof collaborationSessions.$inferSelect;
export type InsertFileVersion = z.infer<typeof insertFileVersionSchema>;
export type FileVersion = typeof fileVersions.$inferSelect;
export type InsertAiPlan = z.infer<typeof insertAiPlanSchema>;
export type AiPlan = typeof aiPlans.$inferSelect;
export type InsertTerminalSession = z.infer<typeof insertTerminalSessionSchema>;
export type TerminalSession = typeof terminalSessions.$inferSelect;
export type InsertProjectEnvironment = z.infer<typeof insertProjectEnvironmentSchema>;
export type ProjectEnvironment = typeof projectEnvironments.$inferSelect;
export type InsertProjectSecret = z.infer<typeof insertProjectSecretSchema>;
export type ProjectSecret = typeof projectSecrets.$inferSelect;
export type InsertHipaaDeployment = z.infer<typeof insertHipaaDeploymentSchema>;
export type HipaaDeployment = typeof hipaaDeployments.$inferSelect;
export type InsertComplianceAuditEvent = z.infer<typeof insertComplianceAuditEventSchema>;
export type ComplianceAuditEvent = typeof complianceAuditEvents.$inferSelect;
export type InsertGitIntegration = z.infer<typeof insertGitIntegrationSchema>;
export type GitIntegration = typeof gitIntegrations.$inferSelect;
export type InsertGitBranch = z.infer<typeof insertGitBranchSchema>;
export type GitBranch = typeof gitBranches.$inferSelect;
export type InsertGitSyncHistory = z.infer<typeof insertGitSyncHistorySchema>;
export type GitSyncHistory = typeof gitSyncHistory.$inferSelect;
export type InsertPrPreview = z.infer<typeof insertPrPreviewSchema>;
export type PrPreview = typeof prPreviews.$inferSelect;
export type InsertHealthcareBlueprint = z.infer<typeof insertHealthcareBlueprintSchema>;
export type HealthcareBlueprint = typeof healthcareBlueprints.$inferSelect;
export type InsertPhiScanResult = z.infer<typeof insertPhiScanResultSchema>;
export type PhiScanResult = typeof phiScanResults.$inferSelect;
export type InsertPackageHealth = z.infer<typeof insertPackageHealthSchema>;
export type PackageHealth = typeof packageHealth.$inferSelect;
export type InsertAdvancedTemplate = z.infer<typeof insertAdvancedTemplateSchema>;
export type AdvancedTemplate = typeof advancedTemplates.$inferSelect;
export type InsertSmartComponent = z.infer<typeof insertSmartComponentSchema>;
export type SmartComponent = typeof smartComponents.$inferSelect;
export type HealthcareDomain = typeof healthcareDomains.$inferSelect;
export type HealthcareAgent = typeof healthcareAgents.$inferSelect;
export type HealthcareStandard = typeof healthcareStandards.$inferSelect;
export type HealthcareOrganization = typeof healthcareOrganizations.$inferSelect;
export type MedicalPublication = typeof medicalPublications.$inferSelect;
export type HealthcareSimulation = typeof healthcareSimulations.$inferSelect;
export type PrivacyCompliance = typeof privacyCompliance.$inferSelect;
export type MulticulturalSupport = typeof multiculturalSupport.$inferSelect;
export type AlternativeMedicine = typeof alternativeMedicine.$inferSelect;
export type LangExtractExtraction = typeof langExtractExtractions.$inferSelect;
export type LangExtractTemplate = typeof langExtractTemplates.$inferSelect;
export type InsertLangExtractExtraction = z.infer<typeof insertLangExtractExtractionSchema>;
export type InsertLangExtractTemplate = z.infer<typeof insertLangExtractTemplateSchema>;

// Contract automation tables
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // hospital, clinic, practice, etc
  size: varchar("size").notNull(), // small, medium, large, enterprise
  address: text("address").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  zipCode: varchar("zip_code").notNull(),
  country: varchar("country").notNull(),
  phone: varchar("phone").notNull(),
  email: varchar("email").notNull(),
  website: varchar("website"),
  taxId: varchar("tax_id"),
  contactPerson: varchar("contact_person").notNull(),
  contactTitle: varchar("contact_title").notNull(),
  contactEmail: varchar("contact_email").notNull(),
  contactPhone: varchar("contact_phone").notNull(),
  requirements: jsonb("requirements").notNull(), // compliance, integrations, features
  estimatedUsers: integer("estimated_users").notNull(),
  complianceNeeds: text("compliance_needs").array(),
  integrationNeeds: text("integration_needs").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().notNull(),
  organizationId: varchar("organization_id").references(() => organizations.id),
  userId: varchar("user_id").references(() => users.id),
  planId: varchar("plan_id").notNull(),
  customPricing: jsonb("custom_pricing").notNull(),
  contractTerms: text("contract_terms").notNull(),
  monthlyPrice: integer("monthly_price").notNull(),
  annualPrice: integer("annual_price").notNull(),
  setupFee: integer("setup_fee").default(0),
  discountPercent: integer("discount_percent").default(0),
  billingPeriod: varchar("billing_period").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: varchar("status").default("pending"), // pending, client_signed, fully_executed, cancelled
  clientSignature: text("client_signature"),
  clientSignedAt: timestamp("client_signed_at"),
  repSignature: text("rep_signature"),
  repSignedAt: timestamp("rep_signed_at"),
  repSignedBy: varchar("rep_signed_by"),
  paymentStatus: varchar("payment_status").default("pending"), // pending, processed, failed
  paymentMethod: varchar("payment_method"), // ach, credit_card
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contractSignatures = pgTable("contract_signatures", {
  id: varchar("id").primaryKey().notNull(),
  contractId: varchar("contract_id").references(() => contracts.id),
  signerType: varchar("signer_type").notNull(), // client, representative
  signerName: varchar("signer_name").notNull(),
  signerEmail: varchar("signer_email").notNull(),
  signatureData: text("signature_data").notNull(), // base64 signature image
  ipAddress: varchar("ip_address"),
  signedAt: timestamp("signed_at").defaultNow(),
});

// Tech Stacks table - for dynamic tech stack management
export const techStacks = pgTable("tech_stacks", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  healthcareDomain: varchar("healthcare_domain"),
  frontend: jsonb("frontend").notNull(),
  backend: jsonb("backend").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Models table - for dynamic AI model catalog
export const aiModels = pgTable("ai_models", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  provider: varchar("provider").notNull(),
  capabilities: text("capabilities").array(),
  accuracy: integer("accuracy"),
  speed: varchar("speed"),
  contextWindow: varchar("context_window"),
  specialization: varchar("specialization"),
  isOpenSource: boolean("is_open_source").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Code Examples table - for dynamic code examples library
export const codeExamples = pgTable("code_examples", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  language: varchar("language").notNull(),
  useCase: varchar("use_case"),
  code: text("code").notNull(),
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Git Repositories table
export const gitRepositories = pgTable("git_repositories", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  owner: varchar("owner").notNull(),
  isPrivate: boolean("is_private").default(false),
  branch: varchar("branch").default("main"),
  lastCommitMessage: text("last_commit_message"),
  lastCommitAuthor: varchar("last_commit_author"),
  lastCommitTimestamp: timestamp("last_commit_timestamp"),
  lastCommitHash: varchar("last_commit_hash"),
  collaborators: integer("collaborators").default(0),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  size: varchar("size"),
  language: varchar("language"),
  topics: text("topics").array(),
  commits: integer("commits").default(0),
  branches: integer("branches").default(1),
  releases: integer("releases").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Deployments table
export const deployments = pgTable("deployments", {
  id: varchar("id").primaryKey().notNull(),
  projectId: integer("project_id").references(() => projects.id),
  name: varchar("name").notNull(),
  url: varchar("url").notNull(),
  status: varchar("status").notNull(),
  environment: varchar("environment").notNull(),
  region: varchar("region"),
  lastDeployment: timestamp("last_deployment"),
  version: varchar("version"),
  health: varchar("health"),
  traffic: varchar("traffic"),
  uptime: varchar("uptime"),
  ssl: boolean("ssl").default(false),
  customDomain: boolean("custom_domain").default(false),
  buildTime: varchar("build_time"),
  memoryUsage: varchar("memory_usage"),
  cpuUsage: varchar("cpu_usage"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Code Reviews table
export const codeReviews = pgTable("code_reviews", {
  id: varchar("id").primaryKey().notNull(),
  projectId: integer("project_id").references(() => projects.id),
  title: varchar("title").notNull(),
  author: varchar("author").notNull(),
  reviewers: text("reviewers").array(),
  status: varchar("status").notNull(),
  linesAdded: integer("lines_added").default(0),
  linesRemoved: integer("lines_removed").default(0),
  files: integer("files").default(0),
  comments: integer("comments").default(0),
  aiInsights: text("ai_insights").array(),
  checks: jsonb("checks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Preview Environments table
export const previewEnvironments = pgTable("preview_environments", {
  id: varchar("id").primaryKey().notNull(),
  projectId: integer("project_id").references(() => projects.id),
  name: varchar("name").notNull(),
  url: varchar("url").notNull(),
  status: varchar("status").notNull(),
  pullRequest: varchar("pull_request"),
  features: text("features").array(),
  testResults: jsonb("test_results"),
  performance: jsonb("performance"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Build History table
export const buildHistory = pgTable("build_history", {
  id: varchar("id").primaryKey().notNull(),
  projectId: integer("project_id").references(() => projects.id),
  commit: varchar("commit").notNull(),
  branch: varchar("branch").notNull(),
  status: varchar("status").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: varchar("duration"),
  logs: text("logs").array(),
  tests: jsonb("tests"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Environment Variables table
export const environmentVariables = pgTable("environment_variables", {
  id: varchar("id").primaryKey().notNull(),
  projectId: integer("project_id").references(() => projects.id),
  key: varchar("key").notNull(),
  value: text("value").notNull(),
  environment: varchar("environment").notNull(),
  encrypted: boolean("encrypted").default(false),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project Collaborators table
export const projectCollaborators = pgTable("project_collaborators", {
  id: varchar("id").primaryKey().notNull(),
  projectId: integer("project_id").references(() => projects.id),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  role: varchar("role").notNull(),
  permissions: text("permissions").array(),
  avatar: varchar("avatar"),
  lastActive: timestamp("last_active"),
  contributions: integer("contributions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pricing Plans table
export const pricingPlans = pgTable("pricing_plans", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  color: varchar("color"),
  popular: boolean("popular").default(false),
  monthlyPrice: integer("monthly_price").notNull(),
  annualPrice: integer("annual_price").notNull(),
  features: text("features").array(),
  limitations: text("limitations").array(),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Build Capabilities table
export const buildCapabilities = pgTable("build_capabilities", {
  id: varchar("id").primaryKey().notNull(),
  category: varchar("category").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  features: text("features").array(),
  techRequirements: jsonb("tech_requirements"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Executive Metrics tables (fields nullable to allow removal of fictitious data)
export const executiveMetrics = pgTable("executive_metrics", {
  id: varchar("id").primaryKey().notNull(),
  platformUsers: integer("platform_users"),
  activeProjects: integer("active_projects"),
  revenueGrowth: integer("revenue_growth"),
  marketPenetration: integer("market_penetration"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const executiveROI = pgTable("executive_roi", {
  id: varchar("id").primaryKey().notNull(),
  developmentCostReduction: integer("development_cost_reduction"),
  timeToMarketImprovement: integer("time_to_market_improvement"),
  complianceCostSavings: integer("compliance_cost_savings"),
  totalROI: integer("total_roi"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const executiveCompetitive = pgTable("executive_competitive", {
  id: varchar("id").primaryKey().notNull(),
  patentPortfolioMin: text("patent_portfolio_min").notNull(),
  patentPortfolioMax: text("patent_portfolio_max").notNull(),
  marketPosition: text("market_position").notNull(),
  technologyLead: text("technology_lead").notNull(),
  complianceAutomation: integer("compliance_automation").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const executiveRevenue = pgTable("executive_revenue", {
  id: varchar("id").primaryKey().notNull(),
  year1Customers: integer("year1_customers"),
  year1Arpu: integer("year1_arpu"),
  year1Arr: integer("year1_arr"),
  year3Customers: integer("year3_customers"),
  year3Arpu: integer("year3_arpu"),
  year3Arr: integer("year3_arr"),
  year5Customers: integer("year5_customers"),
  year5Arpu: integer("year5_arpu"),
  year5Arr: integer("year5_arr"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Contract automation Zod schemas
export const insertOrganizationSchema = createInsertSchema(organizations);
export const insertContractSchema = createInsertSchema(contracts);
export const insertContractSignatureSchema = createInsertSchema(contractSignatures);
export const insertTechStackSchema = createInsertSchema(techStacks);
export const insertAiModelSchema = createInsertSchema(aiModels);
export const insertCodeExampleSchema = createInsertSchema(codeExamples);
export const insertGitRepositorySchema = createInsertSchema(gitRepositories);
export const insertDeploymentSchema = createInsertSchema(deployments);
export const insertCodeReviewSchema = createInsertSchema(codeReviews);
export const insertPreviewEnvironmentSchema = createInsertSchema(previewEnvironments);
export const insertBuildHistorySchema = createInsertSchema(buildHistory);
export const insertEnvironmentVariableSchema = createInsertSchema(environmentVariables);
export const insertProjectCollaboratorSchema = createInsertSchema(projectCollaborators);
export const insertPricingPlanSchema = createInsertSchema(pricingPlans);
export const insertBuildCapabilitySchema = createInsertSchema(buildCapabilities);
export const insertExecutiveMetricsSchema = createInsertSchema(executiveMetrics);
export const insertExecutiveROISchema = createInsertSchema(executiveROI);
export const insertExecutiveCompetitiveSchema = createInsertSchema(executiveCompetitive);
export const insertExecutiveRevenueSchema = createInsertSchema(executiveRevenue);

export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;
export type InsertContractSignature = z.infer<typeof insertContractSignatureSchema>;
export type ContractSignature = typeof contractSignatures.$inferSelect;
export type InsertTechStack = z.infer<typeof insertTechStackSchema>;
export type TechStack = typeof techStacks.$inferSelect;
export type InsertAiModel = z.infer<typeof insertAiModelSchema>;
export type AiModel = typeof aiModels.$inferSelect;
export type InsertCodeExample = z.infer<typeof insertCodeExampleSchema>;
export type CodeExample = typeof codeExamples.$inferSelect;
export type InsertGitRepository = z.infer<typeof insertGitRepositorySchema>;
export type GitRepository = typeof gitRepositories.$inferSelect;
export type InsertDeployment = z.infer<typeof insertDeploymentSchema>;
export type Deployment = typeof deployments.$inferSelect;
export type InsertCodeReview = z.infer<typeof insertCodeReviewSchema>;
export type CodeReview = typeof codeReviews.$inferSelect;
export type InsertPreviewEnvironment = z.infer<typeof insertPreviewEnvironmentSchema>;
export type PreviewEnvironment = typeof previewEnvironments.$inferSelect;
export type InsertBuildHistory = z.infer<typeof insertBuildHistorySchema>;
export type BuildHistory = typeof buildHistory.$inferSelect;
export type InsertEnvironmentVariable = z.infer<typeof insertEnvironmentVariableSchema>;
export type EnvironmentVariable = typeof environmentVariables.$inferSelect;
export type InsertProjectCollaborator = z.infer<typeof insertProjectCollaboratorSchema>;
export type ProjectCollaborator = typeof projectCollaborators.$inferSelect;
export type InsertPricingPlan = z.infer<typeof insertPricingPlanSchema>;
export type PricingPlan = typeof pricingPlans.$inferSelect;
export type InsertBuildCapability = z.infer<typeof insertBuildCapabilitySchema>;
export type BuildCapability = typeof buildCapabilities.$inferSelect;
export type InsertExecutiveMetrics = z.infer<typeof insertExecutiveMetricsSchema>;
export type ExecutiveMetrics = typeof executiveMetrics.$inferSelect;
export type InsertExecutiveROI = z.infer<typeof insertExecutiveROISchema>;
export type ExecutiveROI = typeof executiveROI.$inferSelect;
export type InsertExecutiveCompetitive = z.infer<typeof insertExecutiveCompetitiveSchema>;
export type ExecutiveCompetitive = typeof executiveCompetitive.$inferSelect;
export type InsertExecutiveRevenue = z.infer<typeof insertExecutiveRevenueSchema>;
export type ExecutiveRevenue = typeof executiveRevenue.$inferSelect;

// ============================================================================
// CHAT-TO-CODE SYSTEM TABLES
// Competing with v0.dev, bolt.new, lovable.dev
// ============================================================================

// Chat Conversations - Individual chat sessions with AI
export const chatConversations = pgTable("chat_conversations", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(), // Removed FK constraint to allow guest users
  title: varchar("title").notNull(), // Auto-generated or user-provided
  initialPrompt: text("initial_prompt"), // First message that started the conversation
  status: varchar("status").notNull().default("active"), // active, completed, archived
  generatedAppId: varchar("generated_app_id"), // Link to app if conversation resulted in app creation (no FK to avoid circular ref)
  conversationType: varchar("conversation_type").default("chat"), // chat, voice, quick-action
  context: jsonb("context"), // Store conversation context, user preferences, healthcare specialty, etc.
  metadata: jsonb("metadata"), // Additional metadata (device info, location, etc.)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
}, (table) => [
  index("chat_conversations_user_id_idx").on(table.userId),
  index("chat_conversations_created_at_idx").on(table.createdAt),
]);

// Chat Messages - Individual messages in conversations
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().notNull(),
  conversationId: varchar("conversation_id").notNull().references(() => chatConversations.id, { onDelete: "cascade" }),
  sequence: integer("sequence").notNull(), // Message ordering within conversation
  role: varchar("role").notNull(), // user, assistant, system
  content: text("content").notNull(),
  messageType: varchar("message_type").default("text"), // text, code, image, file, action
  attachments: jsonb("attachments"), // Array of file uploads, screenshots, etc.
  codeBlocks: jsonb("code_blocks"), // Extracted code blocks with language info
  suggestions: jsonb("suggestions"), // AI suggestions or quick actions
  feedback: jsonb("feedback"), // User feedback on message (thumbs up/down, rating)
  isStreaming: boolean("is_streaming").default(false), // For real-time streaming responses
  metadata: jsonb("metadata"), // Token count, model used, processing time, etc.
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("chat_messages_conversation_id_idx").on(table.conversationId),
  index("chat_messages_created_at_idx").on(table.createdAt),
  index("chat_messages_sequence_idx").on(table.conversationId, table.sequence),
]);

// Generated Apps - Apps created via chat interface (different from projects table)
export const generatedApps = pgTable("generated_apps", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(), // No FK constraint to support guest users
  conversationId: varchar("conversation_id"), // Link to conversation (no FK to avoid circular ref)
  projectId: integer("project_id").references(() => projects.id), // Link to project if user saves as project
  name: varchar("name").notNull(),
  description: text("description"),
  appType: varchar("app_type").notNull(), // ehr, telemedicine, patient-portal, clinical-ai, etc.
  framework: varchar("framework").notNull(), // react, vue, angular, etc.
  techStack: jsonb("tech_stack").notNull(), // Complete tech stack with versions
  code: jsonb("code").notNull(), // File structure: { "src/App.tsx": "...", "package.json": "..." }
  dependencies: jsonb("dependencies").notNull(), // NPM/pip packages
  buildConfig: jsonb("build_config"), // Vite/Webpack configuration
  previewUrl: varchar("preview_url"), // Temporary preview URL
  shareableLink: varchar("shareable_link"), // Public shareable link
  isPublic: boolean("is_public").default(false),
  isHipaaCompliant: boolean("is_hipaa_compliant").default(true),
  complianceChecks: jsonb("compliance_checks"), // Automated compliance scan results
  aiModelUsed: varchar("ai_model_used"), // gpt-4o, claude-3.5-sonnet, etc.
  generationMetadata: jsonb("generation_metadata"), // Prompts used, iterations, tokens
  status: varchar("status").default("draft"), // draft, preview, deployed, archived
  lastReviewedBy: varchar("last_reviewed_by"), // Audit trail for HIPAA compliance
  lastReviewedAt: timestamp("last_reviewed_at"), // When was it last reviewed
  viewCount: integer("view_count").default(0),
  forkCount: integer("fork_count").default(0),
  starCount: integer("star_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastDeployedAt: timestamp("last_deployed_at"),
}, (table) => [
  index("generated_apps_user_id_idx").on(table.userId),
  index("generated_apps_created_at_idx").on(table.createdAt),
  index("generated_apps_status_idx").on(table.status),
]);

// App Versions - Version history and iterations of generated apps
export const appVersions = pgTable("app_versions", {
  id: varchar("id").primaryKey().notNull(),
  appId: varchar("app_id").notNull().references(() => generatedApps.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(), // Auto-incrementing version (v1, v2, v3)
  conversationMessageId: varchar("conversation_message_id").references(() => chatMessages.id), // Which message created this version
  changeDescription: text("change_description"), // What changed in this version
  code: jsonb("code").notNull(), // Complete code snapshot for this version
  dependencies: jsonb("dependencies"), // Dependencies at this version
  diff: jsonb("diff"), // Code diff from previous version
  isRollbackPoint: boolean("is_rollback_point").default(true), // Can user rollback to this version
  deployedUrl: varchar("deployed_url"), // If this version was deployed
  status: varchar("status").default("active"), // active, archived, deprecated
  metadata: jsonb("metadata"), // Generation stats, AI feedback, etc.
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("app_versions_app_id_idx").on(table.appId),
  index("app_versions_created_at_idx").on(table.createdAt),
]);

// App Deployments - Deployed apps with shareable URLs (separate from project deployments)
export const appDeployments = pgTable("app_deployments", {
  id: varchar("id").primaryKey().notNull(),
  appId: varchar("app_id").notNull().references(() => generatedApps.id, { onDelete: "cascade" }),
  versionId: varchar("version_id").references(() => appVersions.id),
  deploymentUrl: varchar("deployment_url").notNull().unique(), // https://[app-name].medbuilder.app
  customDomain: varchar("custom_domain"), // Custom domain if user adds one
  subdomain: varchar("subdomain").notNull().unique(), // Unique subdomain
  status: varchar("status").notNull().default("deploying"), // deploying, active, failed, inactive
  deploymentTarget: jsonb("deployment_target"), // Target metadata (region, provider, config)
  environment: varchar("environment").default("production"), // production, preview, staging
  region: varchar("region"), // us-east-1, eu-west-1, etc.
  buildLogs: jsonb("build_logs"), // Build process logs
  healthCheck: jsonb("health_check"), // Last health check status
  ssl: boolean("ssl").default(true),
  bandwidth: varchar("bandwidth"), // Bandwidth usage
  visitors: integer("visitors").default(0),
  deploymentConfig: jsonb("deployment_config"), // Environment vars, build settings, etc.
  deployedBy: varchar("deployed_by"), // User who deployed
  deployedAt: timestamp("deployed_at").defaultNow(),
  lastHealthCheck: timestamp("last_health_check"),
  expiresAt: timestamp("expires_at"), // For temporary deployments
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("app_deployments_app_id_idx").on(table.appId),
  index("app_deployments_version_id_idx").on(table.versionId),
  index("app_deployments_status_idx").on(table.status),
]);

// User Settings - Comprehensive user settings for chat-to-code system
export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  userMode: varchar("user_mode").default("simple"), // simple, developer, expert
  preferredLanguage: varchar("preferred_language").default("en"),
  healthcareSpecialty: varchar("healthcare_specialty"), // cardiology, pediatrics, etc.
  defaultFramework: varchar("default_framework").default("react"),
  defaultTechStack: jsonb("default_tech_stack"), // User's preferred tech stack
  enableVoiceControl: boolean("enable_voice_control").default(false),
  enableAIAssist: boolean("enable_ai_assist").default(true),
  preferredAIModel: varchar("preferred_ai_model").default("gpt-4o"),
  codeEditorTheme: varchar("code_editor_theme").default("vs-dark"),
  notificationSettings: jsonb("notification_settings"),
  privacySettings: jsonb("privacy_settings"),
  accessibilitySettings: jsonb("accessibility_settings"),
  experimentalFeatures: jsonb("experimental_features"), // Beta features user has enabled
  onboardingCompleted: boolean("onboarding_completed").default(false),
  onboardingSteps: jsonb("onboarding_steps"), // Track which onboarding steps completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Template Usage Analytics - Track which templates are most popular
export const templateUsageAnalytics = pgTable("template_usage_analytics", {
  id: varchar("id").primaryKey().notNull(),
  templateId: integer("template_id").references(() => templates.id),
  userId: varchar("user_id").references(() => users.id),
  generatedAppId: varchar("generated_app_id").references(() => generatedApps.id),
  usageType: varchar("usage_type").notNull(), // browsed, previewed, customized, deployed
  userRole: varchar("user_role"), // medical-professional, developer, admin
  healthcareSpecialty: varchar("healthcare_specialty"),
  timeToCustomize: integer("time_to_customize"), // Seconds from view to first edit
  timeToDeploy: integer("time_to_deploy"), // Seconds from start to deployment
  successfulDeployment: boolean("successful_deployment"),
  userFeedback: jsonb("user_feedback"), // Rating, comments, issues
  modifications: jsonb("modifications"), // What changes user made to template
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform Metrics - Dynamic platform analysis and strategic metrics
export const platformMetrics = pgTable("platform_metrics", {
  id: serial("id").primaryKey(),
  metricType: varchar("metric_type").notNull(), // revenue, market_size, customers, ip_value
  metricCategory: varchar("metric_category").notNull(), // financial, operational, strategic
  year: integer("year"), // For projections (2025, 2026, etc.)
  quarter: integer("quarter"), // Q1, Q2, Q3, Q4
  value: jsonb("value").notNull(), // Flexible metric value (number, object, array)
  unit: varchar("unit"), // dollars, percentage, count, etc.
  source: varchar("source"), // database, calculation, projection, external
  confidence: varchar("confidence"), // high, medium, low
  metadata: jsonb("metadata"), // Additional context
  calculationMethod: text("calculation_method"), // How metric is derived
  assumptions: jsonb("assumptions"), // Underlying assumptions for projections
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Revenue Projections - Detailed revenue modeling
export const revenueProjections = pgTable("revenue_projections", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  quarter: integer("quarter"),
  tier: varchar("tier").notNull(), // starter, professional, enterprise, enterprise_plus
  customerCount: integer("customer_count"),
  pricePerMonth: bigint("price_per_month", { mode: "number" }), // in cents
  monthlyRecurringRevenue: bigint("monthly_recurring_revenue", { mode: "number" }), // in cents
  annualRecurringRevenue: bigint("annual_recurring_revenue", { mode: "number" }), // in cents
  churnRate: integer("churn_rate"), // percentage * 100
  expansionRevenue: bigint("expansion_revenue", { mode: "number" }), // in cents
  additionalRevenue: jsonb("additional_revenue"), // professional services, marketplace, etc.
  assumptions: jsonb("assumptions"),
  scenario: varchar("scenario").default("realistic"), // conservative, realistic, optimistic
  confidence: varchar("confidence").default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Competitive Analysis - Dynamic competitive positioning
export const competitiveAnalysis = pgTable("competitive_analysis", {
  id: serial("id").primaryKey(),
  competitorName: varchar("competitor_name").notNull(),
  competitorType: varchar("competitor_type").notNull(), // direct, indirect, emerging
  category: varchar("category"), // ai_coding, healthcare_it, ehr, cloud
  strengths: jsonb("strengths"), // Array of strength descriptions
  weaknesses: jsonb("weaknesses"), // Array of weakness descriptions
  pricing: jsonb("pricing"), // Pricing tiers and models
  marketShare: integer("market_share"), // percentage * 100
  customerBase: integer("customer_base"),
  funding: bigint("funding", { mode: "number" }), // Total funding in cents
  valuation: bigint("valuation", { mode: "number" }), // in cents
  differentiators: jsonb("differentiators"), // How we differentiate
  threats: jsonb("threats"), // Competitive threats
  opportunities: jsonb("opportunities"), // Partnership or acquisition opportunities
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// IP Portfolio - Patent and innovation tracking
export const ipPortfolio = pgTable("ip_portfolio", {
  id: serial("id").primaryKey(),
  innovationName: varchar("innovation_name").notNull(),
  innovationType: varchar("innovation_type").notNull(), // patent, trade_secret, copyright
  category: varchar("category"), // ai_safety, compliance, translation, voice_control
  description: text("description"),
  filingStatus: varchar("filing_status").notNull(), // conceptual, provisional, non_provisional, granted
  filingNumber: varchar("filing_number"), // USPTO filing number
  filingDate: timestamp("filing_date"),
  grantDate: timestamp("grant_date"),
  estimatedValue: bigint("estimated_value", { mode: "number" }), // in cents
  valuationMethod: text("valuation_method"),
  implementationStatus: varchar("implementation_status"), // planned, in_progress, completed, production
  implementationProof: jsonb("implementation_proof"), // Links to code, demos, etc.
  relatedServices: jsonb("related_services"), // Which backend services implement this
  competitiveAdvantage: text("competitive_advantage"),
  marketImpact: text("market_impact"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Compliance Checks - HIPAA security check items
export const complianceChecks = pgTable("compliance_checks", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // security, privacy, access, audit
  iconName: varchar("icon_name").default("Shield"),
  checkType: varchar("check_type").notNull(), // automatic, manual, hybrid
  severity: varchar("severity").default("high"), // critical, high, medium, low
  defaultStatus: varchar("default_status").default("pending"), // passed, warning, failed, pending
  remediationSteps: jsonb("remediation_steps"), // Steps to fix if failed
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Example Prompts - Database-driven landing page prompts
export const examplePrompts = pgTable("example_prompts", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  category: varchar("category").notNull(), // healthcare, developer, clinical, research
  userMode: varchar("user_mode").notNull(), // healthcare, developer
  description: text("description"),
  complexity: varchar("complexity").default("medium"), // simple, medium, complex
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform Features - Feature benefit cards
export const platformFeatures = pgTable("platform_features", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  iconName: varchar("icon_name").default("Shield"),
  category: varchar("category"), // compliance, ai, development, security
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quick Actions - Dashboard quick action buttons
export const quickActions = pgTable("quick_actions", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  iconName: varchar("icon_name").default("Rocket"),
  href: varchar("href").notNull(),
  isPrimary: boolean("is_primary").default(false),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// VIRAL GROWTH FEATURES (Reaching Millions)
// ============================================

// Public Template Gallery - Templates can be shared publicly
export const publicTemplates = pgTable("public_templates", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  visibility: varchar("visibility").default("public"), // public, unlisted, private
  shareSlug: varchar("share_slug").unique(),
  ogImage: varchar("og_image"),
  ogTitle: varchar("og_title"),
  ogDescription: text("og_description"),
  forkCount: integer("fork_count").default(0),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  featuredAt: timestamp("featured_at"),
  authorId: varchar("author_id"),
  authorName: varchar("author_name"),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shared Links - Shareable URLs for projects and apps
export const sharedLinks = pgTable("shared_links", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id"),
  templateId: integer("template_id"),
  userId: varchar("user_id").notNull(),
  slug: varchar("slug").unique().notNull(),
  title: varchar("title"),
  description: text("description"),
  ogImage: varchar("og_image"),
  ogMeta: jsonb("og_meta"),
  accessType: varchar("access_type").default("view"), // view, fork, edit
  password: varchar("password"),
  expiresAt: timestamp("expires_at"),
  maxViews: integer("max_views"),
  viewCount: integer("view_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community Showcase - User-created app gallery
export const showcases = pgTable("showcases", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  shortDescription: varchar("short_description"),
  thumbnailUrl: varchar("thumbnail_url"),
  demoUrl: varchar("demo_url"),
  sourceUrl: varchar("source_url"),
  category: varchar("category"), // telehealth, ehr, patient-portal, research, etc.
  tags: jsonb("tags"),
  techStack: jsonb("tech_stack"),
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  forks: integer("forks").default(0),
  isFeatured: boolean("is_featured").default(false),
  featuredAt: timestamp("featured_at"),
  status: varchar("status").default("pending"), // pending, approved, rejected, featured
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Showcase Votes - Upvotes for community showcases
export const showcaseVotes = pgTable("showcase_votes", {
  id: serial("id").primaryKey(),
  showcaseId: integer("showcase_id").notNull(),
  userId: varchar("user_id").notNull(),
  voteType: varchar("vote_type").default("up"), // up, down
  createdAt: timestamp("created_at").defaultNow(),
});

// Anonymous/Guest Sessions - For frictionless signup
export const guestSessions = pgTable("guest_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull().unique(),
  fingerprint: varchar("fingerprint"),
  ipAddress: varchar("ip_address"),
  creditsRemaining: integer("credits_remaining").default(3), // 3 free generations
  projectsCreated: integer("projects_created").default(0),
  aiGenerationsUsed: integer("ai_generations_used").default(0),
  convertedToUserId: varchar("converted_to_user_id"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Usage Credits - Per-generation pricing
export const usageCredits = pgTable("usage_credits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  guestSessionId: varchar("guest_session_id"),
  creditType: varchar("credit_type").notNull(), // ai_generation, project_creation, deployment, export
  creditsUsed: integer("credits_used").default(1),
  creditCost: integer("credit_cost").default(0), // in cents
  description: text("description"),
  metadata: jsonb("metadata"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Credit Packages - Purchasable credit bundles
export const creditPackages = pgTable("credit_packages", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  credits: integer("credits").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  bonusCredits: integer("bonus_credits").default(0),
  isPopular: boolean("is_popular").default(false),
  isActive: boolean("is_active").default(true),
  stripePriceId: varchar("stripe_price_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Usage Quotas - Free tier limits
export const usageQuotas = pgTable("usage_quotas", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  tier: varchar("tier").default("free"), // free, starter, professional, enterprise
  aiCallsUsed: integer("ai_calls_used").default(0),
  aiCallsLimit: integer("ai_calls_limit").default(50),
  projectsUsed: integer("projects_used").default(0),
  projectsLimit: integer("projects_limit").default(3),
  templatesUsed: integer("templates_used").default(0),
  templatesLimit: integer("templates_limit").default(5),
  storageUsedMb: integer("storage_used_mb").default(0),
  storageLimitMb: integer("storage_limit_mb").default(100),
  collaboratorsLimit: integer("collaborators_limit").default(1),
  deploymentsUsed: integer("deployments_used").default(0),
  deploymentsLimit: integer("deployments_limit").default(1),
  creditsBalance: integer("credits_balance").default(0), // Purchased credits
  resetsAt: timestamp("resets_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wearable Integrations - Apple HealthKit, Google Fit, etc.
export const wearableIntegrations = pgTable("wearable_integrations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  provider: varchar("provider").notNull(), // apple_health, google_fit, fitbit, garmin, samsung_health
  status: varchar("status").default("disconnected"), // connected, disconnected, error
  scopes: jsonb("scopes"), // ["heart_rate", "steps", "sleep", "blood_pressure"]
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  lastSyncAt: timestamp("last_sync_at"),
  syncFrequency: varchar("sync_frequency").default("hourly"), // realtime, hourly, daily
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wearable Data - Synced health data from wearables
export const wearableData = pgTable("wearable_data", {
  id: serial("id").primaryKey(),
  integrationId: integer("integration_id").notNull(),
  dataType: varchar("data_type").notNull(), // heart_rate, steps, sleep, blood_pressure, blood_glucose, spo2
  value: jsonb("value").notNull(),
  unit: varchar("unit"),
  recordedAt: timestamp("recorded_at").notNull(),
  sourceDevice: varchar("source_device"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Telehealth Sessions - Video call integration
export const telehealthSessions = pgTable("telehealth_sessions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  hostId: varchar("host_id").notNull(),
  provider: varchar("provider").default("jitsi"), // jitsi, zoom, doxy, agora, twilio
  roomId: varchar("room_id").notNull(),
  roomUrl: varchar("room_url"),
  title: varchar("title"),
  description: text("description"),
  scheduledAt: timestamp("scheduled_at"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  duration: integer("duration"), // in minutes
  status: varchar("status").default("scheduled"), // scheduled, waiting, active, ended, cancelled
  participants: jsonb("participants"),
  maxParticipants: integer("max_participants").default(10),
  isRecorded: boolean("is_recorded").default(false),
  recordingUrl: varchar("recording_url"),
  settings: jsonb("settings"),
  hipaaCompliant: boolean("hipaa_compliant").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// EHR Integrations - Epic, Cerner, Allscripts connectors
export const ehrIntegrations = pgTable("ehr_integrations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  vendor: varchar("vendor").notNull(), // epic, cerner, allscripts, meditech, athena
  clientId: varchar("client_id"),
  clientSecret: text("client_secret"),
  fhirEndpoint: varchar("fhir_endpoint"),
  authEndpoint: varchar("auth_endpoint"),
  tokenEndpoint: varchar("token_endpoint"),
  scopes: jsonb("scopes"),
  status: varchar("status").default("pending"), // pending, connected, error, revoked
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  lastSyncAt: timestamp("last_sync_at"),
  settings: jsonb("settings"),
  sandboxMode: boolean("sandbox_mode").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// EHR Sync Logs - Track EHR data synchronization
export const ehrSyncLogs = pgTable("ehr_sync_logs", {
  id: serial("id").primaryKey(),
  integrationId: integer("integration_id").notNull(),
  resourceType: varchar("resource_type").notNull(), // Patient, Observation, Encounter, etc.
  action: varchar("action").notNull(), // read, create, update, delete
  resourceId: varchar("resource_id"),
  status: varchar("status").default("success"), // success, error, pending
  requestData: jsonb("request_data"),
  responseData: jsonb("response_data"),
  errorMessage: text("error_message"),
  duration: integer("duration"), // in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Voice Commands - Voice-controlled development
export const voiceCommands = pgTable("voice_commands", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  transcript: text("transcript").notNull(),
  confidence: integer("confidence"), // 0-100
  intent: varchar("intent"), // create_component, add_field, run_test, deploy, etc.
  action: varchar("action"), // The parsed action to execute
  parameters: jsonb("parameters"), // Extracted parameters from voice command
  result: jsonb("result"),
  status: varchar("status").default("pending"), // pending, processing, completed, error
  errorMessage: text("error_message"),
  audioUrl: varchar("audio_url"),
  duration: integer("duration"), // in milliseconds
  language: varchar("language").default("en-US"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Voice Models - Custom voice model configurations
export const voiceModels = pgTable("voice_models", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  provider: varchar("provider").default("whisper"), // whisper, google, azure, deepgram
  modelId: varchar("model_id"),
  language: varchar("language").default("en-US"),
  vocabulary: jsonb("vocabulary"), // Custom medical terms
  intents: jsonb("intents"), // Supported voice commands
  settings: jsonb("settings"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Translations - Multi-language support (i18n)
export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id"),
  locale: varchar("locale").notNull(), // en-US, es-ES, zh-CN, etc.
  namespace: varchar("namespace").default("common"), // common, errors, forms, etc.
  key: varchar("key").notNull(),
  value: text("value").notNull(),
  context: text("context"),
  status: varchar("status").default("draft"), // draft, review, approved
  translatedBy: varchar("translated_by"), // user or 'ai'
  approvedBy: varchar("approved_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Locales - Supported languages
export const locales = pgTable("locales", {
  id: serial("id").primaryKey(),
  code: varchar("code").notNull().unique(), // en-US, es-ES, etc.
  name: varchar("name").notNull(), // English (US), Spanish (Spain)
  nativeName: varchar("native_name").notNull(), // English, Español
  direction: varchar("direction").default("ltr"), // ltr, rtl
  isActive: boolean("is_active").default(true),
  isDefault: boolean("is_default").default(false),
  completionPercent: integer("completion_percent").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Offline Manifests - Service worker offline support
export const offlineManifests = pgTable("offline_manifests", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  version: varchar("version").notNull(),
  assets: jsonb("assets"), // List of files to cache
  routes: jsonb("routes"), // Routes available offline
  size: integer("size"), // Total size in bytes
  strategy: varchar("strategy").default("network-first"), // cache-first, network-first, stale-while-revalidate
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sync Queue - Offline data sync queue
export const syncQueue = pgTable("sync_queue", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  projectId: integer("project_id"),
  action: varchar("action").notNull(), // create, update, delete
  resourceType: varchar("resource_type").notNull(),
  resourceId: varchar("resource_id"),
  data: jsonb("data"),
  status: varchar("status").default("pending"), // pending, syncing, synced, error
  retryCount: integer("retry_count").default(0),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  syncedAt: timestamp("synced_at"),
});

// Template Marketplace - Buy/sell templates
export const marketplaceTemplates = pgTable("marketplace_templates", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  sellerId: varchar("seller_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  longDescription: text("long_description"),
  price: integer("price").default(0), // in cents, 0 = free
  currency: varchar("currency").default("USD"),
  category: varchar("category"),
  tags: jsonb("tags"),
  screenshots: jsonb("screenshots"),
  demoUrl: varchar("demo_url"),
  version: varchar("version").default("1.0.0"),
  downloads: integer("downloads").default(0),
  rating: integer("rating").default(0), // 0-500 (divide by 100 for 0-5 stars)
  reviewCount: integer("review_count").default(0),
  status: varchar("status").default("pending"), // pending, approved, rejected, suspended
  featuredAt: timestamp("featured_at"),
  payoutAccount: varchar("payout_account"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Marketplace Purchases - Track template purchases
export const marketplacePurchases = pgTable("marketplace_purchases", {
  id: serial("id").primaryKey(),
  marketplaceTemplateId: integer("marketplace_template_id").notNull(),
  buyerId: varchar("buyer_id").notNull(),
  sellerId: varchar("seller_id").notNull(),
  price: integer("price").notNull(),
  currency: varchar("currency").default("USD"),
  status: varchar("status").default("completed"), // pending, completed, refunded
  stripePaymentId: varchar("stripe_payment_id"),
  downloadedAt: timestamp("downloaded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Marketplace Reviews - Template reviews
export const marketplaceReviews = pgTable("marketplace_reviews", {
  id: serial("id").primaryKey(),
  marketplaceTemplateId: integer("marketplace_template_id").notNull(),
  userId: varchar("user_id").notNull(),
  rating: integer("rating").notNull(), // 1-5
  title: varchar("title"),
  content: text("content"),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  helpfulCount: integer("helpful_count").default(0),
  status: varchar("status").default("published"), // published, hidden, flagged
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Badges - Achievement system
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  code: varchar("code").notNull().unique(),
  name: varchar("name").notNull(),
  description: text("description"),
  iconUrl: varchar("icon_url"),
  iconName: varchar("icon_name"),
  category: varchar("category"), // skill, achievement, certification, contribution
  tier: varchar("tier").default("bronze"), // bronze, silver, gold, platinum
  criteria: jsonb("criteria"), // Requirements to earn badge
  points: integer("points").default(10),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Badges - Badges earned by users
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  metadata: jsonb("metadata"),
});

// User Points - Gamification points
export const userPoints = pgTable("user_points", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  levelName: varchar("level_name").default("Beginner"),
  streakDays: integer("streak_days").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityAt: timestamp("last_activity_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Courses - MedBuilder Academy
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: varchar("slug").notNull().unique(),
  title: varchar("title").notNull(),
  description: text("description"),
  shortDescription: varchar("short_description"),
  thumbnailUrl: varchar("thumbnail_url"),
  instructorId: varchar("instructor_id"),
  instructorName: varchar("instructor_name"),
  category: varchar("category"), // hipaa, development, telehealth, fhir, etc.
  difficulty: varchar("difficulty").default("beginner"), // beginner, intermediate, advanced
  duration: integer("duration"), // total minutes
  lessonCount: integer("lesson_count").default(0),
  enrollmentCount: integer("enrollment_count").default(0),
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  price: integer("price").default(0), // in cents, 0 = free
  isFree: boolean("is_free").default(true),
  isFeatured: boolean("is_featured").default(false),
  isPublished: boolean("is_published").default(false),
  prerequisites: jsonb("prerequisites"),
  skills: jsonb("skills"), // Skills learned
  certification: jsonb("certification"), // Certificate details if any
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lessons - Course lessons
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  slug: varchar("slug").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"),
  videoUrl: varchar("video_url"),
  duration: integer("duration"), // in minutes
  sortOrder: integer("sort_order").default(0),
  lessonType: varchar("lesson_type").default("video"), // video, text, quiz, project, code
  resources: jsonb("resources"), // downloadable files, links
  codeExample: jsonb("code_example"),
  quiz: jsonb("quiz"), // Quiz questions
  isPreview: boolean("is_preview").default(false),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enrollments - Course enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  status: varchar("status").default("active"), // active, completed, paused
  progress: integer("progress").default(0), // 0-100
  completedLessons: jsonb("completed_lessons"),
  lastLessonId: integer("last_lesson_id"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  certificateUrl: varchar("certificate_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Teams - Team/Enterprise management (for viral growth)
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique(),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  website: varchar("website"),
  industry: varchar("industry"), // hospital, clinic, research, pharma, etc.
  size: varchar("size"), // 1-10, 11-50, 51-200, 201-500, 500+
  ownerId: varchar("owner_id").notNull(),
  tier: varchar("tier").default("team"), // team, business, enterprise
  seats: integer("seats").default(5),
  usedSeats: integer("used_seats").default(1),
  settings: jsonb("settings"),
  features: jsonb("features"), // enabled features
  billingEmail: varchar("billing_email"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team Members - Team members
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: varchar("role").default("member"), // owner, admin, member, viewer
  permissions: jsonb("permissions"),
  invitedBy: varchar("invited_by"),
  invitedAt: timestamp("invited_at"),
  joinedAt: timestamp("joined_at"),
  status: varchar("status").default("pending"), // pending, active, suspended
  createdAt: timestamp("created_at").defaultNow(),
});

// Team Invites - Pending invites
export const teamInvites = pgTable("team_invites", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  email: varchar("email").notNull(),
  role: varchar("role").default("member"),
  invitedBy: varchar("invited_by").notNull(),
  token: varchar("token").unique(),
  expiresAt: timestamp("expires_at"),
  status: varchar("status").default("pending"), // pending, accepted, expired, revoked
  createdAt: timestamp("created_at").defaultNow(),
});

// White Label Branding - Custom branding for teams
export const whiteLabelBranding = pgTable("white_label_branding", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull().unique(),
  logoUrl: varchar("logo_url"),
  logoLightUrl: varchar("logo_light_url"),
  faviconUrl: varchar("favicon_url"),
  appName: varchar("app_name"),
  customDomain: varchar("custom_domain"),
  primaryColor: varchar("primary_color"),
  secondaryColor: varchar("secondary_color"),
  accentColor: varchar("accent_color"),
  fontFamily: varchar("font_family"),
  customCss: text("custom_css"),
  headerHtml: text("header_html"),
  footerHtml: text("footer_html"),
  emailFromName: varchar("email_from_name"),
  emailFromAddress: varchar("email_from_address"),
  supportEmail: varchar("support_email"),
  privacyUrl: varchar("privacy_url"),
  termsUrl: varchar("terms_url"),
  isActive: boolean("is_active").default(false),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Compliance Recommendations - AI Compliance Coach
export const complianceRecommendations = pgTable("compliance_recommendations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  rule: varchar("rule").notNull(), // hipaa-encryption, audit-logging, access-control, etc.
  category: varchar("category").notNull(), // security, privacy, access, audit
  severity: varchar("severity").default("medium"), // critical, high, medium, low
  title: varchar("title").notNull(),
  description: text("description"),
  currentState: text("current_state"),
  recommendation: text("recommendation"),
  codeExample: text("code_example"),
  affectedFiles: jsonb("affected_files"),
  status: varchar("status").default("open"), // open, in_progress, resolved, dismissed
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by"),
  aiGenerated: boolean("ai_generated").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Compliance Events - Track compliance actions
export const complianceEvents = pgTable("compliance_events", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  eventType: varchar("event_type").notNull(), // scan, fix, dismiss, escalate
  recommendationId: integer("recommendation_id"),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit Log Insert Schema and Types (HIPAA compliance)
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, timestamp: true });
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// Chat-to-Code Insert Schemas
export const insertChatConversationSchema = createInsertSchema(chatConversations);
export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const insertGeneratedAppSchema = createInsertSchema(generatedApps);
export const insertAppVersionSchema = createInsertSchema(appVersions);
export const insertAppDeploymentSchema = createInsertSchema(appDeployments);
export const insertUserSettingsSchema = createInsertSchema(userSettings);
export const insertTemplateUsageAnalyticsSchema = createInsertSchema(templateUsageAnalytics);

// Platform Analytics Insert Schemas
export const insertPlatformMetricsSchema = createInsertSchema(platformMetrics).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRevenueProjectionsSchema = createInsertSchema(revenueProjections).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCompetitiveAnalysisSchema = createInsertSchema(competitiveAnalysis).omit({ id: true, createdAt: true });
export const insertIpPortfolioSchema = createInsertSchema(ipPortfolio).omit({ id: true, createdAt: true, updatedAt: true });

// Chat-to-Code Types
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertGeneratedApp = z.infer<typeof insertGeneratedAppSchema>;
export type GeneratedApp = typeof generatedApps.$inferSelect;
export type InsertAppVersion = z.infer<typeof insertAppVersionSchema>;
export type AppVersion = typeof appVersions.$inferSelect;
export type InsertAppDeployment = z.infer<typeof insertAppDeploymentSchema>;
export type AppDeployment = typeof appDeployments.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertTemplateUsageAnalytics = z.infer<typeof insertTemplateUsageAnalyticsSchema>;
export type TemplateUsageAnalytics = typeof templateUsageAnalytics.$inferSelect;

// Platform Analytics Types
export type InsertPlatformMetrics = z.infer<typeof insertPlatformMetricsSchema>;
export type PlatformMetrics = typeof platformMetrics.$inferSelect;
export type InsertRevenueProjections = z.infer<typeof insertRevenueProjectionsSchema>;
export type RevenueProjections = typeof revenueProjections.$inferSelect;
export type InsertCompetitiveAnalysis = z.infer<typeof insertCompetitiveAnalysisSchema>;
export type CompetitiveAnalysis = typeof competitiveAnalysis.$inferSelect;
export type InsertIpPortfolio = z.infer<typeof insertIpPortfolioSchema>;
export type IpPortfolio = typeof ipPortfolio.$inferSelect;

// Dynamic Data Insert Schemas
export const insertComplianceCheckSchema = createInsertSchema(complianceChecks).omit({ id: true, createdAt: true });
export const insertExamplePromptSchema = createInsertSchema(examplePrompts).omit({ id: true, createdAt: true });
export const insertPlatformFeatureSchema = createInsertSchema(platformFeatures).omit({ id: true, createdAt: true });
export const insertQuickActionSchema = createInsertSchema(quickActions).omit({ id: true, createdAt: true });

// Dynamic Data Types
export type InsertComplianceCheck = z.infer<typeof insertComplianceCheckSchema>;
export type ComplianceCheck = typeof complianceChecks.$inferSelect;
export type InsertExamplePrompt = z.infer<typeof insertExamplePromptSchema>;
export type ExamplePrompt = typeof examplePrompts.$inferSelect;
export type InsertPlatformFeature = z.infer<typeof insertPlatformFeatureSchema>;
export type PlatformFeature = typeof platformFeatures.$inferSelect;
export type InsertQuickAction = z.infer<typeof insertQuickActionSchema>;
export type QuickAction = typeof quickActions.$inferSelect;

// ============================================
// VIRAL GROWTH FEATURES - Insert Schemas & Types
// ============================================

// Public Templates
export const insertPublicTemplateSchema = createInsertSchema(publicTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPublicTemplate = z.infer<typeof insertPublicTemplateSchema>;
export type PublicTemplate = typeof publicTemplates.$inferSelect;

// Shared Links
export const insertSharedLinkSchema = createInsertSchema(sharedLinks).omit({ id: true, createdAt: true });
export type InsertSharedLink = z.infer<typeof insertSharedLinkSchema>;
export type SharedLink = typeof sharedLinks.$inferSelect;

// Showcases
export const insertShowcaseSchema = createInsertSchema(showcases).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertShowcase = z.infer<typeof insertShowcaseSchema>;
export type Showcase = typeof showcases.$inferSelect;

// Showcase Votes
export const insertShowcaseVoteSchema = createInsertSchema(showcaseVotes).omit({ id: true, createdAt: true });
export type InsertShowcaseVote = z.infer<typeof insertShowcaseVoteSchema>;
export type ShowcaseVote = typeof showcaseVotes.$inferSelect;

// Guest Sessions
export const insertGuestSessionSchema = createInsertSchema(guestSessions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGuestSession = z.infer<typeof insertGuestSessionSchema>;
export type GuestSession = typeof guestSessions.$inferSelect;

// Usage Credits
export const insertUsageCreditSchema = createInsertSchema(usageCredits).omit({ id: true, createdAt: true });
export type InsertUsageCredit = z.infer<typeof insertUsageCreditSchema>;
export type UsageCredit = typeof usageCredits.$inferSelect;

// Credit Packages
export const insertCreditPackageSchema = createInsertSchema(creditPackages).omit({ id: true, createdAt: true });
export type InsertCreditPackage = z.infer<typeof insertCreditPackageSchema>;
export type CreditPackage = typeof creditPackages.$inferSelect;

// Usage Quotas
export const insertUsageQuotaSchema = createInsertSchema(usageQuotas).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUsageQuota = z.infer<typeof insertUsageQuotaSchema>;
export type UsageQuota = typeof usageQuotas.$inferSelect;

// Wearable Integrations
export const insertWearableIntegrationSchema = createInsertSchema(wearableIntegrations).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWearableIntegration = z.infer<typeof insertWearableIntegrationSchema>;
export type WearableIntegration = typeof wearableIntegrations.$inferSelect;

// Wearable Data
export const insertWearableDataSchema = createInsertSchema(wearableData).omit({ id: true, createdAt: true });
export type InsertWearableData = z.infer<typeof insertWearableDataSchema>;
export type WearableData = typeof wearableData.$inferSelect;

// Telehealth Sessions
export const insertTelehealthSessionSchema = createInsertSchema(telehealthSessions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTelehealthSession = z.infer<typeof insertTelehealthSessionSchema>;
export type TelehealthSession = typeof telehealthSessions.$inferSelect;

// EHR Integrations
export const insertEhrIntegrationSchema = createInsertSchema(ehrIntegrations).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEhrIntegration = z.infer<typeof insertEhrIntegrationSchema>;
export type EhrIntegration = typeof ehrIntegrations.$inferSelect;

// EHR Sync Logs
export const insertEhrSyncLogSchema = createInsertSchema(ehrSyncLogs).omit({ id: true, createdAt: true });
export type InsertEhrSyncLog = z.infer<typeof insertEhrSyncLogSchema>;
export type EhrSyncLog = typeof ehrSyncLogs.$inferSelect;

// Voice Commands
export const insertVoiceCommandSchema = createInsertSchema(voiceCommands).omit({ id: true, createdAt: true });
export type InsertVoiceCommand = z.infer<typeof insertVoiceCommandSchema>;
export type VoiceCommand = typeof voiceCommands.$inferSelect;

// Voice Models
export const insertVoiceModelSchema = createInsertSchema(voiceModels).omit({ id: true, createdAt: true });
export type InsertVoiceModel = z.infer<typeof insertVoiceModelSchema>;
export type VoiceModel = typeof voiceModels.$inferSelect;

// Translations
export const insertTranslationSchema = createInsertSchema(translations).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;

// Locales
export const insertLocaleSchema = createInsertSchema(locales).omit({ id: true, createdAt: true });
export type InsertLocale = z.infer<typeof insertLocaleSchema>;
export type Locale = typeof locales.$inferSelect;

// Offline Manifests
export const insertOfflineManifestSchema = createInsertSchema(offlineManifests).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOfflineManifest = z.infer<typeof insertOfflineManifestSchema>;
export type OfflineManifest = typeof offlineManifests.$inferSelect;

// Sync Queue
export const insertSyncQueueSchema = createInsertSchema(syncQueue).omit({ id: true, createdAt: true });
export type InsertSyncQueue = z.infer<typeof insertSyncQueueSchema>;
export type SyncQueueItem = typeof syncQueue.$inferSelect;

// Marketplace Templates
export const insertMarketplaceTemplateSchema = createInsertSchema(marketplaceTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMarketplaceTemplate = z.infer<typeof insertMarketplaceTemplateSchema>;
export type MarketplaceTemplate = typeof marketplaceTemplates.$inferSelect;

// Marketplace Purchases
export const insertMarketplacePurchaseSchema = createInsertSchema(marketplacePurchases).omit({ id: true, createdAt: true });
export type InsertMarketplacePurchase = z.infer<typeof insertMarketplacePurchaseSchema>;
export type MarketplacePurchase = typeof marketplacePurchases.$inferSelect;

// Marketplace Reviews
export const insertMarketplaceReviewSchema = createInsertSchema(marketplaceReviews).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMarketplaceReview = z.infer<typeof insertMarketplaceReviewSchema>;
export type MarketplaceReview = typeof marketplaceReviews.$inferSelect;

// Badges
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true });
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

// User Badges
export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true });
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;

// User Points
export const insertUserPointsSchema = createInsertSchema(userPoints).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserPoints = z.infer<typeof insertUserPointsSchema>;
export type UserPoints = typeof userPoints.$inferSelect;

// Courses
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// Lessons
export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

// Enrollments
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

// Teams
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

// Team Members
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true, createdAt: true });
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

// Team Invites
export const insertTeamInviteSchema = createInsertSchema(teamInvites).omit({ id: true, createdAt: true });
export type InsertTeamInvite = z.infer<typeof insertTeamInviteSchema>;
export type TeamInvite = typeof teamInvites.$inferSelect;

// White Label Branding
export const insertWhiteLabelBrandingSchema = createInsertSchema(whiteLabelBranding).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWhiteLabelBranding = z.infer<typeof insertWhiteLabelBrandingSchema>;
export type WhiteLabelBranding = typeof whiteLabelBranding.$inferSelect;

// Compliance Recommendations
export const insertComplianceRecommendationSchema = createInsertSchema(complianceRecommendations).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertComplianceRecommendation = z.infer<typeof insertComplianceRecommendationSchema>;
export type ComplianceRecommendation = typeof complianceRecommendations.$inferSelect;

// Compliance Events
export const insertComplianceEventSchema = createInsertSchema(complianceEvents).omit({ id: true, createdAt: true });
export type InsertComplianceEvent = z.infer<typeof insertComplianceEventSchema>;
export type ComplianceEvent = typeof complianceEvents.$inferSelect;

// Demo Appointments (for live preview demonstrations)
export const demoAppointments = pgTable("demo_appointments", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull(),
  patientName: varchar("patient_name").notNull(),
  service: varchar("service").notNull(),
  date: varchar("date").notNull(),
  time: varchar("time").notNull(),
  status: varchar("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [index("idx_demo_appointments_session").on(table.sessionId)]);

export const insertDemoAppointmentSchema = createInsertSchema(demoAppointments).omit({ id: true, createdAt: true });
export type InsertDemoAppointment = z.infer<typeof insertDemoAppointmentSchema>;
export type DemoAppointment = typeof demoAppointments.$inferSelect;
