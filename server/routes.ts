import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProjectSchema, insertProjectActivitySchema } from "@shared/schema";
import { aiService } from "./ai-service";
import { HEALTHCARE_STACKS } from "@shared/healthcare-stacks";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Project routes
  app.get('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if user owns the project
      if (project.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId,
      });
      
      const project = await storage.createProject(projectData);
      
      // Add activity log
      await storage.addProjectActivity({
        projectId: project.id,
        userId,
        action: "created",
        description: `Created project "${project.name}"`,
      });
      
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const updatedProject = await storage.updateProject(projectId, req.body);
      
      // Add activity log
      await storage.addProjectActivity({
        projectId,
        userId,
        action: "updated",
        description: `Updated project "${updatedProject.name}"`,
      });
      
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      await storage.deleteProject(projectId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Template routes
  app.get('/api/templates', async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get('/api/templates/:id', async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const template = await storage.getTemplate(templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.get('/api/templates/category/:category', async (req, res) => {
    try {
      const category = req.params.category;
      const templates = await storage.getTemplatesByCategory(category);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates by category:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Component routes
  app.get('/api/components', async (req, res) => {
    try {
      const components = await storage.getComponents();
      res.json(components);
    } catch (error) {
      console.error("Error fetching components:", error);
      res.status(500).json({ message: "Failed to fetch components" });
    }
  });

  app.get('/api/components/:id', async (req, res) => {
    try {
      const componentId = parseInt(req.params.id);
      const component = await storage.getComponent(componentId);
      
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      res.json(component);
    } catch (error) {
      console.error("Error fetching component:", error);
      res.status(500).json({ message: "Failed to fetch component" });
    }
  });

  app.get('/api/components/category/:category', async (req, res) => {
    try {
      const category = req.params.category;
      const components = await storage.getComponentsByCategory(category);
      res.json(components);
    } catch (error) {
      console.error("Error fetching components by category:", error);
      res.status(500).json({ message: "Failed to fetch components" });
    }
  });

  // API Integration routes
  app.get('/api/integrations', async (req, res) => {
    try {
      const integrations = await storage.getApiIntegrations();
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching API integrations:", error);
      res.status(500).json({ message: "Failed to fetch API integrations" });
    }
  });

  // Activity routes
  app.get('/api/projects/:id/activities', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const activities = await storage.getProjectActivities(projectId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // AI-powered code assistance routes
  app.post('/api/ai/code-completion', isAuthenticated, async (req: any, res) => {
    try {
      const { code, cursor, filePath, language, context, healthcareDomain } = req.body;
      const result = await aiService.getCodeCompletion({
        code,
        language,
        context: JSON.stringify({ ...context, isHealthcare: true }),
        healthcareDomain: healthcareDomain || "clinical",
        cursorPosition: cursor?.line || 0,
        cursor,
        filePath
      });
      
      // Log AI session
      await storage.createAiSession({
        userId: req.user.claims.sub,
        projectId: context?.projectId,
        type: "code_completion",
        context: { code, cursor, filePath },
        prompt: code.substring(Math.max(0, cursor.line - 5), cursor.line + 5),
        response: JSON.stringify(result),
        confidence: result.suggestions[0]?.confidence || 50,
      });
      
      res.json(result);
    } catch (error) {
      console.error("AI completion error:", error);
      res.status(500).json({ message: "AI completion failed" });
    }
  });

  app.post('/api/ai/code-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const { code, filePath, analysisType, projectId } = req.body;
      const fileHash = aiService.calculateCodeHash(code);
      
      // Check cache first
      const cached = await storage.getCodeAnalysis(projectId, fileHash, analysisType);
      if (cached && cached.lastAnalyzed && Date.now() - cached.lastAnalyzed.getTime() < 300000) { // 5 min cache
        return res.json(cached);
      }
      
      const result = await aiService.analyzeCode({
        type: analysisType || "code-review",
        code,
        context: `File: ${filePath}`,
        domain: "clinical",
        filePath,
        analysisType
      });
      
      // Cache results
      await storage.createCodeAnalysis({
        projectId,
        fileHash,
        filePath,
        analysisType,
        findings: result.findings,
        score: result.score,
      });
      
      res.json(result);
    } catch (error) {
      console.error("AI analysis error:", error);
      res.status(500).json({ message: "Code analysis failed" });
    }
  });

  app.post('/api/ai/architecture-review', isAuthenticated, async (req: any, res) => {
    try {
      const { projectStructure, requirements, complianceLevel, stack, domain } = req.body;
      const result = await aiService.reviewArchitecture(
        stack || "react-node",
        domain || "clinical",
        requirements || []
      );
      
      res.json(result);
    } catch (error) {
      console.error("Architecture review error:", error);
      res.status(500).json({ message: "Architecture review failed" });
    }
  });

  // Advanced AI endpoints with Med-Gemma integration
  app.post('/api/ai/analyze-code', isAuthenticated, async (req, res) => {
    try {
      const analysisRequest = req.body;
      const useMedGemma = req.body.useMedGemma !== false; // Default to Med-Gemma for medical analysis
      
      const result = useMedGemma 
        ? await aiService.analyzeMedicalCode(analysisRequest)
        : await aiService.analyzeCode(analysisRequest);
      
      res.json({ ...result, aiModel: useMedGemma ? "Med-Gemma" : "GPT-4o" });
    } catch (error) {
      console.error("AI code analysis error:", error);
      res.status(500).json({ message: "Failed to analyze code" });
    }
  });

  app.post('/api/ai/medical-analysis', isAuthenticated, async (req, res) => {
    try {
      const analysisRequest = req.body;
      const result = await aiService.analyzeMedicalCode(analysisRequest);
      res.json({ ...result, aiModel: "Med-Gemma" });
    } catch (error) {
      console.error("Med-Gemma analysis error:", error);
      res.status(500).json({ message: "Failed to analyze with Med-Gemma" });
    }
  });

  app.post('/api/ai/clinical-data', isAuthenticated, async (req, res) => {
    try {
      const { data, analysisType, clinicalContext } = req.body;
      const result = await aiService.analyzeClinicalData(data, analysisType, clinicalContext);
      res.json({ ...result, aiModel: "Med-Gemma" });
    } catch (error) {
      console.error("Clinical data analysis error:", error);
      res.status(500).json({ message: "Failed to analyze clinical data" });
    }
  });

  app.post('/api/ai/generate-medical-code', isAuthenticated, async (req, res) => {
    try {
      const { template, domain, requirements } = req.body;
      const result = await aiService.generateMedicalCode(template, domain, requirements);
      res.json({ ...result, aiModel: "Med-Gemma" });
    } catch (error) {
      console.error("Medical code generation error:", error);
      res.status(500).json({ message: "Failed to generate medical code" });
    }
  });

  // Healthcare BERT models integration
  app.post('/api/ai/bert-analysis', isAuthenticated, async (req, res) => {
    try {
      const { text, analysisType, model } = req.body;
      const result = await aiService.analyzeWithHealthcareBERT(text, analysisType, model);
      res.json(result);
    } catch (error) {
      console.error("Healthcare BERT analysis error:", error);
      res.status(500).json({ message: "Failed to analyze with healthcare BERT" });
    }
  });

  // Global Healthcare Application Generation
  app.post('/api/ai/generate-global-healthcare', isAuthenticated, async (req, res) => {
    try {
      const { countries, languages, requirements } = req.body;
      const result = await aiService.generateGlobalHealthcareApp(countries, languages, requirements);
      res.json({ ...result, aiModel: "Med-Gemma", countries: countries.length, languages: languages.length });
    } catch (error) {
      console.error("Global healthcare app generation error:", error);
      res.status(500).json({ message: "Failed to generate global healthcare application" });
    }
  });

  // Healthcare Standards Code Generation
  app.post('/api/ai/generate-standards-code', isAuthenticated, async (req, res) => {
    try {
      const { standards, configuration } = req.body;
      const result = await aiService.generateStandardsCode(standards, configuration);
      res.json({ ...result, aiModel: "Med-Gemma", standards: standards.length });
    } catch (error) {
      console.error("Healthcare standards generation error:", error);
      res.status(500).json({ message: "Failed to generate healthcare standards implementation" });
    }
  });

  // Advanced template routes
  app.get('/api/advanced-templates', async (req, res) => {
    try {
      const { category, complexity, complianceLevel } = req.query;
      const templates = await storage.getAdvancedTemplates({
        category: category as string,
        complexity: complexity as string,
        complianceLevel: complianceLevel as string,
      });
      res.json(templates);
    } catch (error) {
      console.error("Error fetching advanced templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Smart components routes
  app.get('/api/smart-components', async (req, res) => {
    try {
      const { category, framework, type } = req.query;
      const components = await storage.getSmartComponents({
        category: category as string,
        framework: framework as string,
        type: type as string,
      });
      res.json(components);
    } catch (error) {
      console.error("Error fetching smart components:", error);
      res.status(500).json({ message: "Failed to fetch components" });
    }
  });

  // Real-time collaboration routes
  app.get('/api/collaboration/:projectId/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const sessions = await storage.getCollaborationSessions(projectId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching collaboration sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket for real-time collaboration
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "development" ? "http://localhost:5000" : true,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-project', async (data) => {
      const { projectId, userId } = data;
      socket.join(`project-${projectId}`);
      
      // Update collaboration session
      await storage.upsertCollaborationSession({
        projectId,
        userId,
        sessionId: socket.id,
        status: "active",
      });
      
      // Notify other users
      socket.to(`project-${projectId}`).emit('user-joined', { userId, sessionId: socket.id });
    });

    socket.on('cursor-move', (data) => {
      const { projectId, cursorPosition, activeFile } = data;
      socket.to(`project-${projectId}`).emit('cursor-update', {
        sessionId: socket.id,
        cursorPosition,
        activeFile
      });
    });

    socket.on('code-change', (data) => {
      const { projectId, fileId, changes, version } = data;
      socket.to(`project-${projectId}`).emit('code-update', {
        sessionId: socket.id,
        fileId,
        changes,
        version
      });
    });

    socket.on('ai-suggestion', (data) => {
      const { projectId, suggestion, position } = data;
      socket.to(`project-${projectId}`).emit('ai-suggestion-shared', {
        sessionId: socket.id,
        suggestion,
        position
      });
    });

    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);
      // Update session status
      await storage.updateCollaborationSessionStatus(socket.id, "disconnected");
    });
  });

  return httpServer;
}
