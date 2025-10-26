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

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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

// Executive Metrics tables
export const executiveMetrics = pgTable("executive_metrics", {
  id: varchar("id").primaryKey().notNull(),
  platformUsers: integer("platform_users").notNull(),
  activeProjects: integer("active_projects").notNull(),
  revenueGrowth: integer("revenue_growth").notNull(),
  marketPenetration: integer("market_penetration").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const executiveROI = pgTable("executive_roi", {
  id: varchar("id").primaryKey().notNull(),
  developmentCostReduction: integer("development_cost_reduction").notNull(),
  timeToMarketImprovement: integer("time_to_market_improvement").notNull(),
  complianceCostSavings: integer("compliance_cost_savings").notNull(),
  totalROI: integer("total_roi").notNull(),
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
  year1Customers: integer("year1_customers").notNull(),
  year1Arpu: integer("year1_arpu").notNull(),
  year1Arr: integer("year1_arr").notNull(),
  year3Customers: integer("year3_customers").notNull(),
  year3Arpu: integer("year3_arpu").notNull(),
  year3Arr: integer("year3_arr").notNull(),
  year5Customers: integer("year5_customers").notNull(),
  year5Arpu: integer("year5_arpu").notNull(),
  year5Arr: integer("year5_arr").notNull(),
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
