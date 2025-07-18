import {
  users,
  projects,
  templates,
  components,
  apiIntegrations,
  projectActivities,
  aiSessions,
  codeAnalysis,
  collaborationSessions,
  advancedTemplates,
  smartComponents,
  healthcareDomains,
  healthcareAgents,
  healthcareStandards,
  healthcareOrganizations,
  medicalPublications,
  healthcareSimulations,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Template,
  type Component,
  type ApiIntegration,
  type ProjectActivity,
  type InsertProjectActivity,
  type AiSession,
  type InsertAiSession,
  type CodeAnalysis,
  type InsertCodeAnalysis,
  type CollaborationSession,
  type InsertCollaborationSession,
  type AdvancedTemplate,
  type SmartComponent,
  type HealthcareDomain,
  type HealthcareAgent,
  type HealthcareStandard,
  type HealthcareOrganization,
  type MedicalPublication,
  type HealthcareSimulation,
  insertHealthcareDomainSchema,
  insertHealthcareAgentSchema,
  insertHealthcareStandardSchema,
  insertHealthcareOrganizationSchema,
  insertMedicalPublicationSchema,
  insertHealthcareSimulationSchema,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getUserProjects(userId: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Template operations
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  
  // Component operations
  getComponents(): Promise<Component[]>;
  getComponent(id: number): Promise<Component | undefined>;
  getComponentsByCategory(category: string): Promise<Component[]>;
  
  // API Integration operations
  getApiIntegrations(): Promise<ApiIntegration[]>;
  getApiIntegration(id: number): Promise<ApiIntegration | undefined>;
  
  // Activity operations
  getProjectActivities(projectId: number): Promise<ProjectActivity[]>;
  addProjectActivity(activity: InsertProjectActivity): Promise<ProjectActivity>;
  
  // Stats operations
  getUserStats(userId: string): Promise<{
    activeProjects: number;
    compliantApps: number;
    componentsUsed: number;
    timeSaved: number;
  }>;
  
  // AI Assistant operations
  createAiSession(session: InsertAiSession): Promise<AiSession>;
  getAiSessions(userId: string, projectId?: number): Promise<AiSession[]>;
  
  // Code Analysis operations
  createCodeAnalysis(analysis: InsertCodeAnalysis): Promise<CodeAnalysis>;
  getCodeAnalysis(projectId: number, fileHash: string, analysisType: string): Promise<CodeAnalysis | undefined>;
  getProjectCodeAnalysis(projectId: number): Promise<CodeAnalysis[]>;
  
  // Collaboration operations
  upsertCollaborationSession(session: InsertCollaborationSession): Promise<CollaborationSession>;
  getCollaborationSessions(projectId: number): Promise<CollaborationSession[]>;
  updateCollaborationSessionStatus(sessionId: string, status: string): Promise<void>;
  
  // Advanced Template operations
  getAdvancedTemplates(filters: {
    category?: string;
    complexity?: string;
    complianceLevel?: string;
  }): Promise<AdvancedTemplate[]>;
  
  // Smart Component operations
  getSmartComponents(filters: {
    category?: string;
    framework?: string;
    type?: string;
  }): Promise<SmartComponent[]>;
  
  // Healthcare Domain operations
  getHealthcareDomains(): Promise<HealthcareDomain[]>;
  getHealthcareDomain(id: number): Promise<HealthcareDomain | undefined>;
  createHealthcareDomain(domain: typeof insertHealthcareDomainSchema._type): Promise<HealthcareDomain>;
  
  // Healthcare Agent operations
  getHealthcareAgents(): Promise<HealthcareAgent[]>;
  getHealthcareAgent(id: number): Promise<HealthcareAgent | undefined>;
  createHealthcareAgent(agent: typeof insertHealthcareAgentSchema._type): Promise<HealthcareAgent>;
  
  // Healthcare Standard operations
  getHealthcareStandards(): Promise<HealthcareStandard[]>;
  getHealthcareStandard(id: number): Promise<HealthcareStandard | undefined>;
  createHealthcareStandard(standard: typeof insertHealthcareStandardSchema._type): Promise<HealthcareStandard>;
  
  // Healthcare Organization operations
  getHealthcareOrganizations(): Promise<HealthcareOrganization[]>;
  getHealthcareOrganization(id: number): Promise<HealthcareOrganization | undefined>;
  createHealthcareOrganization(org: typeof insertHealthcareOrganizationSchema._type): Promise<HealthcareOrganization>;
  
  // Medical Publication operations
  getMedicalPublications(limit?: number): Promise<MedicalPublication[]>;
  getMedicalPublication(id: number): Promise<MedicalPublication | undefined>;
  getMedicalPublicationByPubmedId(pubmedId: string): Promise<MedicalPublication | undefined>;
  createMedicalPublication(publication: typeof insertMedicalPublicationSchema._type): Promise<MedicalPublication>;
  
  // Healthcare Simulation operations
  getUserHealthcareSimulations(userId: string): Promise<HealthcareSimulation[]>;
  getHealthcareSimulation(id: number): Promise<HealthcareSimulation | undefined>;
  createHealthcareSimulation(simulation: typeof insertHealthcareSimulationSchema._type): Promise<HealthcareSimulation>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getTemplates(): Promise<Template[]> {
    return await db.select().from(templates).orderBy(desc(templates.createdAt));
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.category, category));
  }

  async getComponents(): Promise<Component[]> {
    return await db.select().from(components).orderBy(desc(components.createdAt));
  }

  async getComponent(id: number): Promise<Component | undefined> {
    const [component] = await db.select().from(components).where(eq(components.id, id));
    return component;
  }

  async getComponentsByCategory(category: string): Promise<Component[]> {
    return await db.select().from(components).where(eq(components.category, category));
  }

  async getApiIntegrations(): Promise<ApiIntegration[]> {
    return await db.select().from(apiIntegrations).where(eq(apiIntegrations.isActive, true));
  }

  async getApiIntegration(id: number): Promise<ApiIntegration | undefined> {
    const [integration] = await db.select().from(apiIntegrations).where(eq(apiIntegrations.id, id));
    return integration;
  }

  async getProjectActivities(projectId: number): Promise<ProjectActivity[]> {
    return await db.select().from(projectActivities)
      .where(eq(projectActivities.projectId, projectId))
      .orderBy(desc(projectActivities.createdAt));
  }

  async addProjectActivity(activity: InsertProjectActivity): Promise<ProjectActivity> {
    const [newActivity] = await db.insert(projectActivities).values(activity).returning();
    return newActivity;
  }

  async getUserStats(userId: string): Promise<{
    activeProjects: number;
    compliantApps: number;
    componentsUsed: number;
    timeSaved: number;
  }> {
    const userProjects = await db.select().from(projects).where(eq(projects.userId, userId));
    const activeProjects = userProjects.length;
    const compliantApps = userProjects.filter(p => p.isHipaaCompliant).length;
    const compliancePercentage = activeProjects > 0 ? Math.round((compliantApps / activeProjects) * 100) : 100;
    
    return {
      activeProjects,
      compliantApps: compliancePercentage,
      componentsUsed: 24, // This could be calculated from project data
      timeSaved: 85, // This could be calculated based on template usage
    };
  }

  // AI Assistant operations
  async createAiSession(session: InsertAiSession): Promise<AiSession> {
    const [result] = await db.insert(aiSessions).values(session).returning();
    return result;
  }

  async getAiSessions(userId: string, projectId?: number): Promise<AiSession[]> {
    const conditions = [eq(aiSessions.userId, userId)];
    if (projectId) {
      conditions.push(eq(aiSessions.projectId, projectId));
    }
    
    return await db
      .select()
      .from(aiSessions)
      .where(and(...conditions))
      .orderBy(desc(aiSessions.createdAt));
  }

  // Code Analysis operations
  async createCodeAnalysis(analysis: InsertCodeAnalysis): Promise<CodeAnalysis> {
    const [result] = await db.insert(codeAnalysis).values(analysis).returning();
    return result;
  }

  async getCodeAnalysis(projectId: number, fileHash: string, analysisType: string): Promise<CodeAnalysis | undefined> {
    const [result] = await db
      .select()
      .from(codeAnalysis)
      .where(
        and(
          eq(codeAnalysis.projectId, projectId),
          eq(codeAnalysis.fileHash, fileHash),
          eq(codeAnalysis.analysisType, analysisType)
        )
      );
    return result;
  }

  async getProjectCodeAnalysis(projectId: number): Promise<CodeAnalysis[]> {
    return await db
      .select()
      .from(codeAnalysis)
      .where(eq(codeAnalysis.projectId, projectId))
      .orderBy(desc(codeAnalysis.lastAnalyzed));
  }

  // Collaboration operations
  async upsertCollaborationSession(session: InsertCollaborationSession): Promise<CollaborationSession> {
    const [result] = await db
      .insert(collaborationSessions)
      .values(session)
      .onConflictDoUpdate({
        target: [collaborationSessions.sessionId],
        set: {
          ...session,
          lastActivity: new Date(),
        },
      })
      .returning();
    return result;
  }

  async getCollaborationSessions(projectId: number): Promise<CollaborationSession[]> {
    return await db
      .select()
      .from(collaborationSessions)
      .where(
        and(
          eq(collaborationSessions.projectId, projectId),
          eq(collaborationSessions.status, "active")
        )
      )
      .orderBy(desc(collaborationSessions.lastActivity));
  }

  async updateCollaborationSessionStatus(sessionId: string, status: string): Promise<void> {
    await db
      .update(collaborationSessions)
      .set({ status, lastActivity: new Date() })
      .where(eq(collaborationSessions.sessionId, sessionId));
  }

  // Advanced Template operations
  async getAdvancedTemplates(filters: {
    category?: string;
    complexity?: string;
    complianceLevel?: string;
  }): Promise<AdvancedTemplate[]> {
    const conditions = [eq(advancedTemplates.isActive, true)];
    
    if (filters.category) {
      conditions.push(eq(advancedTemplates.category, filters.category));
    }
    if (filters.complexity) {
      conditions.push(eq(advancedTemplates.complexity, filters.complexity));
    }
    if (filters.complianceLevel) {
      conditions.push(eq(advancedTemplates.complianceLevel, filters.complianceLevel));
    }

    return await db
      .select()
      .from(advancedTemplates)
      .where(and(...conditions))
      .orderBy(desc(advancedTemplates.downloadCount), desc(advancedTemplates.rating));
  }

  // Smart Component operations
  async getSmartComponents(filters: {
    category?: string;
    framework?: string;
    type?: string;
  }): Promise<SmartComponent[]> {
    const conditions = [eq(smartComponents.isVerified, true)];
    
    if (filters.category) {
      conditions.push(eq(smartComponents.category, filters.category));
    }
    if (filters.framework) {
      conditions.push(eq(smartComponents.framework, filters.framework));
    }
    if (filters.type) {
      conditions.push(eq(smartComponents.type, filters.type));
    }

    return await db
      .select()
      .from(smartComponents)
      .where(and(...conditions))
      .orderBy(desc(smartComponents.downloadCount), desc(smartComponents.rating));
  }

  // Healthcare Domain operations
  async getHealthcareDomains(): Promise<HealthcareDomain[]> {
    return await db.select().from(healthcareDomains).orderBy(healthcareDomains.name);
  }

  async getHealthcareDomain(id: number): Promise<HealthcareDomain | undefined> {
    const [domain] = await db.select().from(healthcareDomains).where(eq(healthcareDomains.id, id));
    return domain;
  }

  async createHealthcareDomain(domainData: typeof insertHealthcareDomainSchema._type): Promise<HealthcareDomain> {
    const [domain] = await db.insert(healthcareDomains).values(domainData).returning();
    return domain;
  }

  // Healthcare Agent operations
  async getHealthcareAgents(): Promise<HealthcareAgent[]> {
    return await db.select().from(healthcareAgents).orderBy(healthcareAgents.name);
  }

  async getHealthcareAgent(id: number): Promise<HealthcareAgent | undefined> {
    const [agent] = await db.select().from(healthcareAgents).where(eq(healthcareAgents.id, id));
    return agent;
  }

  async createHealthcareAgent(agentData: typeof insertHealthcareAgentSchema._type): Promise<HealthcareAgent> {
    const [agent] = await db.insert(healthcareAgents).values(agentData).returning();
    return agent;
  }

  // Healthcare Standard operations
  async getHealthcareStandards(): Promise<HealthcareStandard[]> {
    return await db.select().from(healthcareStandards).orderBy(healthcareStandards.name);
  }

  async getHealthcareStandard(id: number): Promise<HealthcareStandard | undefined> {
    const [standard] = await db.select().from(healthcareStandards).where(eq(healthcareStandards.id, id));
    return standard;
  }

  async createHealthcareStandard(standardData: typeof insertHealthcareStandardSchema._type): Promise<HealthcareStandard> {
    const [standard] = await db.insert(healthcareStandards).values(standardData).returning();
    return standard;
  }

  // Healthcare Organization operations
  async getHealthcareOrganizations(): Promise<HealthcareOrganization[]> {
    return await db.select().from(healthcareOrganizations).orderBy(healthcareOrganizations.name);
  }

  async getHealthcareOrganization(id: number): Promise<HealthcareOrganization | undefined> {
    const [org] = await db.select().from(healthcareOrganizations).where(eq(healthcareOrganizations.id, id));
    return org;
  }

  async createHealthcareOrganization(orgData: typeof insertHealthcareOrganizationSchema._type): Promise<HealthcareOrganization> {
    const [org] = await db.insert(healthcareOrganizations).values(orgData).returning();
    return org;
  }

  // Medical Publication operations
  async getMedicalPublications(limit: number = 50): Promise<MedicalPublication[]> {
    return await db.select().from(medicalPublications)
      .orderBy(desc(medicalPublications.publicationDate))
      .limit(limit);
  }

  async getMedicalPublication(id: number): Promise<MedicalPublication | undefined> {
    const [pub] = await db.select().from(medicalPublications).where(eq(medicalPublications.id, id));
    return pub;
  }

  async getMedicalPublicationByPubmedId(pubmedId: string): Promise<MedicalPublication | undefined> {
    const [pub] = await db.select().from(medicalPublications).where(eq(medicalPublications.pubmedId, pubmedId));
    return pub;
  }

  async createMedicalPublication(pubData: typeof insertMedicalPublicationSchema._type): Promise<MedicalPublication> {
    const [pub] = await db.insert(medicalPublications).values(pubData).returning();
    return pub;
  }

  // Healthcare Simulation operations
  async getUserHealthcareSimulations(userId: string): Promise<HealthcareSimulation[]> {
    return await db.select().from(healthcareSimulations)
      .where(eq(healthcareSimulations.userId, userId))
      .orderBy(desc(healthcareSimulations.createdAt));
  }

  async getHealthcareSimulation(id: number): Promise<HealthcareSimulation | undefined> {
    const [sim] = await db.select().from(healthcareSimulations).where(eq(healthcareSimulations.id, id));
    return sim;
  }

  async createHealthcareSimulation(simData: typeof insertHealthcareSimulationSchema._type): Promise<HealthcareSimulation> {
    const [sim] = await db.insert(healthcareSimulations).values(simData).returning();
    return sim;
  }
}

export const storage = new DatabaseStorage();
