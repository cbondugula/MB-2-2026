import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertProjectSchema, 
  insertProjectActivitySchema,
  insertHealthcareDomainSchema,
  insertHealthcareAgentSchema,
  insertHealthcareStandardSchema,
  insertHealthcareOrganizationSchema,
  insertMedicalPublicationSchema,
  insertHealthcareSimulationSchema,
} from "@shared/schema";
import { aiService } from "./ai-service";
import { HEALTHCARE_STACKS } from "@shared/healthcare-stacks";
import { healthcareDomainService } from "@shared/healthcare-domains";
import { advancedCapabilitiesService } from "./advanced-capabilities-service";
import { clinicalAIService } from "./clinical-ai-service";
import { standardsIntegrationService } from "./standards-integration-service";
import { PATENTABLE_INNOVATIONS, PatentDocumentationService } from "./patent-documentation";
import { healthcareMLService } from "./ml-service";
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
  app.get('/api/users/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Recent activities
  app.get('/api/activities/recent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activities = await storage.getUserRecentActivities(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
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

  // Ollama Local AI Routes
  app.get('/api/ai/ollama/status', isAuthenticated, async (req, res) => {
    try {
      const status = await aiService.getOllamaStatus();
      res.json(status);
    } catch (error) {
      console.error("Ollama status error:", error);
      res.status(500).json({ message: "Failed to get Ollama status" });
    }
  });

  app.post('/api/ai/ollama/generate', isAuthenticated, async (req, res) => {
    try {
      const { prompt, modelName, context } = req.body;
      const result = await aiService.generateWithOllama(prompt, modelName, context);
      res.json(result);
    } catch (error) {
      console.error("Ollama generation error:", error);
      res.status(500).json({ message: "Failed to generate with Ollama" });
    }
  });

  app.post('/api/ai/ollama/analyze', isAuthenticated, async (req, res) => {
    try {
      const { text, analysisType, modelName } = req.body;
      const result = await aiService.analyzeWithLocalModel(text, analysisType, modelName);
      res.json(result);
    } catch (error) {
      console.error("Ollama analysis error:", error);
      res.status(500).json({ message: "Failed to analyze with local model" });
    }
  });

  app.post('/api/ai/ollama/clinical-support', isAuthenticated, async (req, res) => {
    try {
      const { symptoms, patientHistory, labResults, useLocal } = req.body;
      const result = await aiService.generateClinicalDecisionSupport(
        symptoms, 
        patientHistory, 
        labResults, 
        useLocal
      );
      res.json(result);
    } catch (error) {
      console.error("Clinical decision support error:", error);
      res.status(500).json({ message: "Failed to generate clinical decision support" });
    }
  });

  app.post('/api/ai/generate-healthcare-agent', isAuthenticated, async (req, res) => {
    try {
      const { agentType, specialty, requirements, useLocal } = req.body;
      const result = await aiService.generateHealthcareAgent(agentType, specialty, requirements, useLocal);
      res.json(result);
    } catch (error) {
      console.error("Healthcare agent generation error:", error);
      res.status(500).json({ message: "Failed to generate healthcare agent" });
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

  // === COMPREHENSIVE DYNAMIC HEALTHCARE APIs ===

  // Healthcare Domains API
  app.get('/api/healthcare-domains', async (req, res) => {
    try {
      const { category, country, language, search } = req.query;
      let domains = healthcareDomainService.getAllDomains();
      
      if (category) {
        domains = domains.filter(d => d.category.toLowerCase() === (category as string).toLowerCase());
      }
      if (country) {
        domains = domains.filter(d => d.countries.includes(country as string));
      }
      if (language) {
        domains = domains.filter(d => d.languages.includes(language as string));
      }
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        domains = domains.filter(d => 
          d.name.toLowerCase().includes(searchTerm) || 
          d.description.toLowerCase().includes(searchTerm) ||
          d.subdomains.some(sub => sub.toLowerCase().includes(searchTerm))
        );
      }
      
      res.json(domains);
    } catch (error) {
      console.error("Error fetching healthcare domains:", error);
      res.status(500).json({ message: "Failed to fetch healthcare domains" });
    }
  });

  app.get('/api/healthcare-domains/categories', async (req, res) => {
    try {
      const domains = healthcareDomainService.getAllDomains();
      const categories = [...new Set(domains.map(d => d.category))];
      res.json(categories);
    } catch (error) {
      console.error("Error fetching domain categories:", error);
      res.status(500).json({ message: "Failed to fetch domain categories" });
    }
  });

  app.get('/api/healthcare-domains/:id', async (req, res) => {
    try {
      const domainId = req.params.id;
      const domains = healthcareDomainService.getAllDomains();
      const domain = domains.find(d => d.id === domainId);
      
      if (!domain) {
        return res.status(404).json({ message: "Healthcare domain not found" });
      }
      
      res.json(domain);
    } catch (error) {
      console.error("Error fetching healthcare domain:", error);
      res.status(500).json({ message: "Failed to fetch healthcare domain" });
    }
  });

  // Healthcare Organizations API
  app.get('/api/healthcare-organizations', async (req, res) => {
    try {
      const { type, category, country, search } = req.query;
      let organizations = await storage.getHealthcareOrganizations();
      
      if (type) {
        organizations = organizations.filter(org => org.type === type);
      }
      if (category) {
        organizations = organizations.filter(org => org.category === category);
      }
      if (country) {
        organizations = organizations.filter(org => org.country === country);
      }
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        organizations = organizations.filter(org => 
          org.name.toLowerCase().includes(searchTerm)
        );
      }
      
      res.json(organizations);
    } catch (error) {
      console.error("Error fetching healthcare organizations:", error);
      res.status(500).json({ message: "Failed to fetch healthcare organizations" });
    }
  });

  app.post('/api/healthcare-organizations', isAuthenticated, async (req: any, res) => {
    try {
      const orgData = insertHealthcareOrganizationSchema.parse(req.body);
      const organization = await storage.createHealthcareOrganization(orgData);
      res.status(201).json(organization);
    } catch (error) {
      console.error("Error creating healthcare organization:", error);
      res.status(500).json({ message: "Failed to create healthcare organization" });
    }
  });

  // Medical Publications API
  app.get('/api/medical-publications', async (req, res) => {
    try {
      const { specialty, type, journal, search, limit = 50 } = req.query;
      let publications = await storage.getMedicalPublications(parseInt(limit as string));
      
      if (specialty) {
        publications = publications.filter(pub => pub.medicalSpecialty === specialty);
      }
      if (type) {
        publications = publications.filter(pub => pub.publicationType === type);
      }
      if (journal) {
        publications = publications.filter(pub => pub.journal === journal);
      }
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        publications = publications.filter(pub => 
          pub.title.toLowerCase().includes(searchTerm) ||
          pub.abstract?.toLowerCase().includes(searchTerm)
        );
      }
      
      res.json(publications);
    } catch (error) {
      console.error("Error fetching medical publications:", error);
      res.status(500).json({ message: "Failed to fetch medical publications" });
    }
  });

  app.get('/api/medical-publications/pubmed/:pubmedId', async (req, res) => {
    try {
      const pubmedId = req.params.pubmedId;
      const publication = await storage.getMedicalPublicationByPubmedId(pubmedId);
      
      if (!publication) {
        return res.status(404).json({ message: "Publication not found" });
      }
      
      res.json(publication);
    } catch (error) {
      console.error("Error fetching publication:", error);
      res.status(500).json({ message: "Failed to fetch publication" });
    }
  });

  // Healthcare Standards API
  app.get('/api/healthcare-standards', async (req, res) => {
    try {
      const { category, organization, country, search } = req.query;
      let standards = await storage.getHealthcareStandards();
      
      if (category) {
        standards = standards.filter(std => std.category === category);
      }
      if (organization) {
        standards = standards.filter(std => std.organization === organization);
      }
      if (country) {
        standards = standards.filter(std => 
          std.supportedCountries?.includes(country as string)
        );
      }
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        standards = standards.filter(std => 
          std.name.toLowerCase().includes(searchTerm) ||
          std.acronym?.toLowerCase().includes(searchTerm)
        );
      }
      
      res.json(standards);
    } catch (error) {
      console.error("Error fetching healthcare standards:", error);
      res.status(500).json({ message: "Failed to fetch healthcare standards" });
    }
  });

  // AI Models API
  app.get('/api/ai/models', async (req, res) => {
    try {
      const models = await storage.getAIModels();
      res.json(models);
    } catch (error) {
      console.error('Error fetching AI models:', error);
      res.status(500).json({ message: 'Failed to fetch AI models' });
    }
  });

  // Healthcare Agents API  
  app.get('/api/healthcare-agents', async (req, res) => {
    try {
      const { type, specialty, search } = req.query;
      let agents = await storage.getHealthcareAgents();
      
      if (type) {
        agents = agents.filter(agent => agent.type === type);
      }
      if (specialty) {
        agents = agents.filter(agent => agent.specialty === specialty);
      }
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        agents = agents.filter(agent => 
          agent.name.toLowerCase().includes(searchTerm)
        );
      }
      
      res.json(agents);
    } catch (error) {
      console.error("Error fetching healthcare agents:", error);
      res.status(500).json({ message: "Failed to fetch healthcare agents" });
    }
  });

  app.post('/api/healthcare-agents', isAuthenticated, async (req: any, res) => {
    try {
      const agentData = insertHealthcareAgentSchema.parse(req.body);
      const agent = await storage.createHealthcareAgent(agentData);
      res.status(201).json(agent);
    } catch (error) {
      console.error("Error creating healthcare agent:", error);
      res.status(500).json({ message: "Failed to create healthcare agent" });
    }
  });

  // Healthcare Simulations API
  app.get('/api/healthcare-simulations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type, category, status } = req.query;
      let simulations = await storage.getUserHealthcareSimulations(userId);
      
      if (type) {
        simulations = simulations.filter(sim => sim.type === type);
      }
      if (category) {
        simulations = simulations.filter(sim => sim.category === category);
      }
      if (status) {
        simulations = simulations.filter(sim => sim.status === status);
      }
      
      res.json(simulations);
    } catch (error) {
      console.error("Error fetching healthcare simulations:", error);
      res.status(500).json({ message: "Failed to fetch healthcare simulations" });
    }
  });

  app.post('/api/healthcare-simulations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const simulationData = insertHealthcareSimulationSchema.parse({
        ...req.body,
        userId
      });
      
      // Run the simulation using advanced capabilities service
      const simulationResult = await advancedCapabilitiesService.createHealthcareSimulation(
        simulationData.type,
        simulationData.parameters
      );
      
      simulationData.results = simulationResult;
      simulationData.status = 'completed';
      
      const simulation = await storage.createHealthcareSimulation(simulationData);
      res.status(201).json(simulation);
    } catch (error) {
      console.error("Error creating healthcare simulation:", error);
      res.status(500).json({ message: "Failed to create healthcare simulation" });
    }
  });

  // Advanced Capabilities API
  app.post('/api/advanced-capabilities/enable', isAuthenticated, async (req: any, res) => {
    try {
      const capabilities = await advancedCapabilitiesService.enableAdvancedCapabilities(req.body);
      res.json(capabilities);
    } catch (error) {
      console.error("Error enabling advanced capabilities:", error);
      res.status(500).json({ message: "Failed to enable advanced capabilities" });
    }
  });

  // VR/AR/XR Simulation API
  app.post('/api/immersive/vr-simulation', isAuthenticated, async (req: any, res) => {
    try {
      const { type, parameters } = req.body;
      const capabilities = await advancedCapabilitiesService.enableAdvancedCapabilities({
        vrArXrEnabled: true,
        simulationTypes: [type],
        immersiveEducation: true,
        computerVision: false,
        medicalImaging: false,
        multimodalAnalysis: false,
        blockchain: false,
        web3Integration: false,
        decentralizedHealth: false,
        federatedLearning: false,
        distributedAI: false,
        privateComputation: false,
        iotSensors: false,
        medicalDevices: false,
        wearableIntegration: false,
        preventiveMedicine: false,
        precisionMedicine: false,
        personalizedMedicine: false,
        clinicalPractice: false,
        medicalEducation: true,
        drugDiscovery: false,
        biotechnology: false,
        digitalHealth: false,
        healthEconomics: false,
        healthFinance: false,
        healthLaw: false,
        humanResources: false,
        learningHealthSystems: false,
        continuousImprovement: false,
        realWorldEvidence: false,
        healthcareMedia: false,
        medicalJournals: false,
        pubmedIntegration: false,
        healthRegistries: false,
        healthInsurance: false,
        pharmaceuticalCompanies: false,
        medicalEquipment: false,
        medicalSocieties: false
      });
      
      const simulation = await capabilities.services.immersiveHealthcare.createVRSimulation(type, parameters);
      res.json(simulation);
    } catch (error) {
      console.error("Error creating VR simulation:", error);
      res.status(500).json({ message: "Failed to create VR simulation" });
    }
  });

  // Computer Vision Medical Analysis API
  app.post('/api/computer-vision/analyze-medical-image', isAuthenticated, async (req: any, res) => {
    try {
      const { imageData, modality } = req.body;
      const capabilities = await advancedCapabilitiesService.enableAdvancedCapabilities({
        vrArXrEnabled: false,
        simulationTypes: [],
        immersiveEducation: false,
        computerVision: true,
        medicalImaging: true,
        multimodalAnalysis: true,
        blockchain: false,
        web3Integration: false,
        decentralizedHealth: false,
        federatedLearning: false,
        distributedAI: false,
        privateComputation: false,
        iotSensors: false,
        medicalDevices: false,
        wearableIntegration: false,
        preventiveMedicine: false,
        precisionMedicine: false,
        personalizedMedicine: false,
        clinicalPractice: true,
        medicalEducation: false,
        drugDiscovery: false,
        biotechnology: false,
        digitalHealth: true,
        healthEconomics: false,
        healthFinance: false,
        healthLaw: false,
        humanResources: false,
        learningHealthSystems: false,
        continuousImprovement: false,
        realWorldEvidence: false,
        healthcareMedia: false,
        medicalJournals: false,
        pubmedIntegration: false,
        healthRegistries: false,
        healthInsurance: false,
        pharmaceuticalCompanies: false,
        medicalEquipment: false,
        medicalSocieties: false
      });
      
      const analysis = await capabilities.services.medicalVision.analyzeMedicalImage(
        Buffer.from(imageData, 'base64'),
        modality
      );
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing medical image:", error);
      res.status(500).json({ message: "Failed to analyze medical image" });
    }
  });

  // Blockchain Health Records API
  app.post('/api/blockchain/create-health-record', isAuthenticated, async (req: any, res) => {
    try {
      const { patientData } = req.body;
      const capabilities = await advancedCapabilitiesService.enableAdvancedCapabilities({
        vrArXrEnabled: false,
        simulationTypes: [],
        immersiveEducation: false,
        computerVision: false,
        medicalImaging: false,
        multimodalAnalysis: false,
        blockchain: true,
        web3Integration: true,
        decentralizedHealth: true,
        federatedLearning: false,
        distributedAI: false,
        privateComputation: false,
        iotSensors: false,
        medicalDevices: false,
        wearableIntegration: false,
        preventiveMedicine: false,
        precisionMedicine: false,
        personalizedMedicine: false,
        clinicalPractice: false,
        medicalEducation: false,
        drugDiscovery: false,
        biotechnology: false,
        digitalHealth: true,
        healthEconomics: false,
        healthFinance: false,
        healthLaw: false,
        humanResources: false,
        learningHealthSystems: false,
        continuousImprovement: false,
        realWorldEvidence: false,
        healthcareMedia: false,
        medicalJournals: false,
        pubmedIntegration: false,
        healthRegistries: false,
        healthInsurance: false,
        pharmaceuticalCompanies: false,
        medicalEquipment: false,
        medicalSocieties: false
      });
      
      const record = await capabilities.services.blockchainHealth.createHealthRecord(patientData);
      res.json(record);
    } catch (error) {
      console.error("Error creating blockchain health record:", error);
      res.status(500).json({ message: "Failed to create blockchain health record" });
    }
  });

  // IoT Medical Devices API
  app.post('/api/iot/connect-medical-device', isAuthenticated, async (req: any, res) => {
    try {
      const { deviceId, deviceType } = req.body;
      const capabilities = await advancedCapabilitiesService.enableAdvancedCapabilities({
        vrArXrEnabled: false,
        simulationTypes: [],
        immersiveEducation: false,
        computerVision: false,
        medicalImaging: false,
        multimodalAnalysis: false,
        blockchain: false,
        web3Integration: false,
        decentralizedHealth: false,
        federatedLearning: false,
        distributedAI: false,
        privateComputation: false,
        iotSensors: true,
        medicalDevices: true,
        wearableIntegration: true,
        preventiveMedicine: false,
        precisionMedicine: false,
        personalizedMedicine: false,
        clinicalPractice: false,
        medicalEducation: false,
        drugDiscovery: false,
        biotechnology: false,
        digitalHealth: true,
        healthEconomics: false,
        healthFinance: false,
        healthLaw: false,
        humanResources: false,
        learningHealthSystems: false,
        continuousImprovement: false,
        realWorldEvidence: false,
        healthcareMedia: false,
        medicalJournals: false,
        pubmedIntegration: false,
        healthRegistries: false,
        healthInsurance: false,
        pharmaceuticalCompanies: false,
        medicalEquipment: false,
        medicalSocieties: false
      });
      
      const connection = await capabilities.services.iotMedical.connectMedicalDevice(deviceId, deviceType);
      res.json(connection);
    } catch (error) {
      console.error("Error connecting medical device:", error);
      res.status(500).json({ message: "Failed to connect medical device" });
    }
  });

  // Healthcare stacks
  app.get('/api/healthcare-stacks', async (req, res) => {
    try {
      res.json(HEALTHCARE_STACKS);
    } catch (error) {
      console.error("Error fetching healthcare stacks:", error);
      res.status(500).json({ message: "Failed to fetch healthcare stacks" });
    }
  });

  // App Builder routes
  app.get('/api/tech-stacks', async (req, res) => {
    try {
      const stacks = await storage.getTechStacks();
      res.json(stacks);
    } catch (error) {
      console.error('Error fetching tech stacks:', error);
      res.status(500).json({ message: 'Failed to fetch tech stacks' });
    }
  });

  app.get('/api/build-capabilities', async (req, res) => {
    try {
      const capabilities = await storage.getBuildCapabilities();
      res.json(capabilities);
    } catch (error) {
      console.error('Error fetching build capabilities:', error);
      res.status(500).json({ message: 'Failed to fetch build capabilities' });
    }
  });

  app.get('/api/compliance-frameworks', async (req, res) => {
    try {
      const frameworks = await storage.getComplianceFrameworks();
      res.json(frameworks);
    } catch (error) {
      console.error('Error fetching compliance frameworks:', error);
      res.status(500).json({ message: 'Failed to fetch compliance frameworks' });
    }
  });

  app.get('/api/deployment-options', async (req, res) => {
    try {
      const options = await storage.getDeploymentOptions();
      res.json(options);
    } catch (error) {
      console.error('Error fetching deployment options:', error);
      res.status(500).json({ message: 'Failed to fetch deployment options' });
    }
  });

  app.post('/api/app-builder/build', async (req, res) => {
    try {
      const appConfig = req.body;
      const buildResult = await storage.buildHealthcareApp(appConfig);
      res.json(buildResult);
    } catch (error) {
      console.error('Error building app:', error);
      res.status(500).json({ message: 'Failed to build application' });
    }
  });

  app.get('/api/user-apps', async (req, res) => {
    try {
      const apps = await storage.getUserApps();
      res.json(apps);
    } catch (error) {
      console.error('Error fetching user apps:', error);
      res.status(500).json({ message: 'Failed to fetch user apps' });
    }
  });

  // AI Code Generator routes
  app.get('/api/ai/code-templates', async (req, res) => {
    try {
      const templates = await storage.getAICodeTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching code templates:', error);
      res.status(500).json({ message: 'Failed to fetch code templates' });
    }
  });

  app.get('/api/ai/models', async (req, res) => {
    try {
      const models = await storage.getAIModels();
      res.json(models);
    } catch (error) {
      console.error('Error fetching AI models:', error);
      res.status(500).json({ message: 'Failed to fetch AI models' });
    }
  });

  app.get('/api/ai/code-examples', async (req, res) => {
    try {
      const examples = await storage.getCodeExamples();
      res.json(examples);
    } catch (error) {
      console.error('Error fetching code examples:', error);
      res.status(500).json({ message: 'Failed to fetch code examples' });
    }
  });

  app.post('/api/ai/generate-code', async (req, res) => {
    try {
      const codeRequest = req.body;
      const generatedCode = await storage.generateCode(codeRequest);
      res.json(generatedCode);
    } catch (error) {
      console.error('Error generating code:', error);
      res.status(500).json({ message: 'Failed to generate code' });
    }
  });

  // PATENT-PROTECTED CLINICAL AI ENDPOINTS
  // Patent #001: Multi-Modal Clinical Decision Support AI
  app.post('/api/clinical-ai/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const { query, context } = req.body;
      
      // Validate clinical context
      const clinicalContextSchema = z.object({
        patientData: z.object({
          age: z.number().optional(),
          gender: z.string().optional(),
          conditions: z.array(z.string()).optional(),
          medications: z.array(z.string()).optional(),
          allergies: z.array(z.string()).optional()
        }).optional(),
        clinicalDomain: z.enum(['cardiology', 'oncology', 'radiology', 'pathology', 'neurology', 'psychiatry', 'emergency', 'primary-care']),
        riskLevel: z.enum(['low', 'moderate', 'high', 'critical']),
        standards: z.array(z.enum(['FHIR', 'HL7', 'SNOMED', 'ICD-10', 'LOINC', 'DICOM']))
      });

      const validatedContext = clinicalContextSchema.parse(context);
      const recommendations = await clinicalAIService.getConstellationRecommendations(query, validatedContext);
      
      res.json(recommendations);
    } catch (error) {
      console.error('Clinical AI recommendations error:', error);
      res.status(500).json({ message: 'Failed to generate clinical recommendations' });
    }
  });

  // Patent #002: Healthcare Standards Translation
  app.post('/api/standards/translate', isAuthenticated, async (req: any, res) => {
    try {
      const { sourceData, sourceStandard, targetStandard, targetCountry } = req.body;
      
      const translationResult = await standardsIntegrationService.translateBetweenStandards(
        sourceData, 
        sourceStandard, 
        targetStandard, 
        targetCountry
      );

      res.json(translationResult);
    } catch (error) {
      console.error('Standards translation error:', error);
      res.status(500).json({ message: 'Failed to translate between standards' });
    }
  });

  // Multi-country compliance verification
  app.post('/api/standards/compliance-check', isAuthenticated, async (req: any, res) => {
    try {
      const { data, standard, countries } = req.body;
      
      const complianceResults = await standardsIntegrationService.verifyMultiCountryCompliance(
        data, 
        standard, 
        countries
      );

      res.json(complianceResults);
    } catch (error) {
      console.error('Compliance check error:', error);
      res.status(500).json({ message: 'Failed to verify compliance' });
    }
  });

  // Patent #003: AI-Powered Healthcare Code Generation
  app.post('/api/clinical-ai/generate-code', isAuthenticated, async (req: any, res) => {
    try {
      const { requirements, framework, complianceLevel } = req.body;
      
      const codeResult = await clinicalAIService.generateClinicalCode(
        requirements,
        framework,
        complianceLevel
      );

      res.json(codeResult);
    } catch (error) {
      console.error('Clinical code generation error:', error);
      res.status(500).json({ message: 'Failed to generate clinical code' });
    }
  });

  // Standards-compliant code generation
  app.post('/api/standards/generate-integration', isAuthenticated, async (req: any, res) => {
    try {
      const { apiType, operation, framework, complianceLevel } = req.body;
      
      const codeResult = await standardsIntegrationService.generateStandardsCompliantCode(
        apiType,
        operation,
        framework,
        complianceLevel
      );

      res.json(codeResult);
    } catch (error) {
      console.error('Standards code generation error:', error);
      res.status(500).json({ message: 'Failed to generate standards-compliant code' });
    }
  });

  // PATENT PORTFOLIO INFORMATION ENDPOINTS
  app.get('/api/patents/innovations', isAuthenticated, async (req: any, res) => {
    try {
      res.json({
        innovations: PATENTABLE_INNOVATIONS,
        portfolioValue: PatentDocumentationService.calculatePortfolioValue(),
        filingTimeline: PatentDocumentationService.generateFilingTimeline()
      });
    } catch (error) {
      console.error('Patent information error:', error);
      res.status(500).json({ message: 'Failed to fetch patent information' });
    }
  });

  app.get('/api/patents/application/:id', isAuthenticated, async (req: any, res) => {
    try {
      const innovation = PATENTABLE_INNOVATIONS.find(p => p.id === req.params.id);
      if (!innovation) {
        return res.status(404).json({ message: 'Patent innovation not found' });
      }

      const application = PatentDocumentationService.generatePatentApplication(innovation);
      res.json({ application, innovation });
    } catch (error) {
      console.error('Patent application error:', error);
      res.status(500).json({ message: 'Failed to generate patent application' });
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

  // ===== COMPREHENSIVE MACHINE LEARNING API ENDPOINTS =====
  // Multi-Model Medical AI Validation (Patent 004)
  app.post('/api/ml/medical-validation', isAuthenticated, async (req, res) => {
    try {
      const { input, patientData, models } = req.body;
      const result = await healthcareMLService.validateMedicalPrediction(input, patientData, models);
      res.json(result);
    } catch (error) {
      console.error("Medical validation error:", error);
      res.status(500).json({ message: "Failed to validate medical prediction" });
    }
  });

  // Federated Learning for Healthcare (Patent 003)
  app.post('/api/ml/federated-training', isAuthenticated, async (req, res) => {
    try {
      const { hospitalData, globalModel } = req.body;
      const result = await healthcareMLService.federatedTraining(hospitalData, globalModel);
      res.json(result);
    } catch (error) {
      console.error("Federated training error:", error);
      res.status(500).json({ message: "Failed to perform federated training" });
    }
  });

  // Dynamic Workflow Optimization (Patent 005)
  app.post('/api/ml/optimize-workflow', isAuthenticated, async (req, res) => {
    try {
      const { workflowData, historicalData } = req.body;
      const result = await healthcareMLService.optimizeWorkflow(workflowData, historicalData);
      res.json(result);
    } catch (error) {
      console.error("Workflow optimization error:", error);
      res.status(500).json({ message: "Failed to optimize workflow" });
    }
  });

  // Real-time Medical Data Processing
  app.post('/api/ml/process-realtime', isAuthenticated, async (req, res) => {
    try {
      const { dataStream, alertThresholds } = req.body;
      const result = await healthcareMLService.processRealTimeData(dataStream, alertThresholds);
      res.json(result);
    } catch (error) {
      console.error("Real-time processing error:", error);
      res.status(500).json({ message: "Failed to process real-time data" });
    }
  });

  // ML Model Training Status & Analytics
  app.get('/api/ml/training-status', isAuthenticated, async (req, res) => {
    try {
      const status = {
        activeJobs: [
          {
            id: "clinical-bert-001",
            modelType: "Clinical Entity Recognition",
            dataset: "Electronic Health Records",
            status: "training",
            progress: 73,
            metrics: { accuracy: 0.87, precision: 0.84, recall: 0.89, f1Score: 0.86, loss: 0.23, epoch: 14 }
          },
          {
            id: "federated-rag-001", 
            modelType: "Federated Healthcare Knowledge",
            dataset: "Multi-Hospital Knowledge Base",
            status: "completed",
            progress: 100,
            metrics: { accuracy: 0.92, precision: 0.91, recall: 0.93, f1Score: 0.92, loss: 0.18, epoch: 25 }
          }
        ],
        availableModels: [
          { id: "clinical-bert", name: "ClinicalBERT", type: "nlp", domain: "clinical-notes", accuracy: 0.89 },
          { id: "bio-bert", name: "BioBERT", type: "nlp", domain: "biomedical-literature", accuracy: 0.92 },
          { id: "federated-rag", name: "Federated RAG", type: "knowledge-retrieval", domain: "multi-institutional", accuracy: 0.94 }
        ]
      };
      res.json(status);
    } catch (error) {
      console.error("Training status error:", error);
      res.status(500).json({ message: "Failed to fetch training status" });
    }
  });

  // Advanced ML Analytics Dashboard
  app.get('/api/ml/analytics', isAuthenticated, async (req, res) => {
    try {
      const analytics = {
        totalPredictions: 15847,
        avgAccuracy: 0.89,
        modelsDeployed: 12,
        federatedHospitals: 8,
        realTimeProcessing: { patientsMonitored: 234, alertsGenerated: 12, anomaliesDetected: 3 },
        performanceMetrics: { latency: "23ms", throughput: "1,247 predictions/hour", uptime: "99.8%" },
        complianceScore: { hipaa: 98, gdpr: 96, fda: 94, overall: 96 }
      };
      res.json(analytics);
    } catch (error) {
      console.error("ML analytics error:", error);
      res.status(500).json({ message: "Failed to fetch ML analytics" });
    }
  });

  return httpServer;
}
