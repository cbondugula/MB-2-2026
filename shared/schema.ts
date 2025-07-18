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

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
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
