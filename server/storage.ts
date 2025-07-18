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
}

export const storage = new DatabaseStorage();
