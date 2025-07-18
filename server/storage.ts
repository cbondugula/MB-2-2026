import {
  users,
  projects,
  templates,
  components,
  apiIntegrations,
  projectActivities,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Template,
  type Component,
  type ApiIntegration,
  type ProjectActivity,
  type InsertProjectActivity,
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
}

export const storage = new DatabaseStorage();
