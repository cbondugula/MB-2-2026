import { Router, type Request, type Response } from "express";
import { storage } from "../storage";
import { viralGrowthStorage } from "../storage-viral-growth";
import { isAuthenticated } from "../replitAuth";
import { z } from "zod";
import { nanoid } from "nanoid";
import {
  insertPublicTemplateSchema,
  insertSharedLinkSchema,
  insertShowcaseSchema,
  insertShowcaseVoteSchema,
  insertUsageQuotaSchema,
  insertWearableIntegrationSchema,
  insertTelehealthSessionSchema,
  insertEhrIntegrationSchema,
  insertVoiceCommandSchema,
  insertMarketplaceTemplateSchema,
  insertMarketplacePurchaseSchema,
  insertBadgeSchema,
  insertUserBadgeSchema,
  insertCourseSchema,
  insertLessonSchema,
  insertEnrollmentSchema,
  insertTeamSchema,
  insertTeamMemberSchema,
  insertTeamInviteSchema,
  insertWhiteLabelBrandingSchema,
  insertComplianceRecommendationSchema,
} from "@shared/schema";

const viralGrowthRouter = Router();

// ============================================
// PUBLIC TEMPLATE GALLERY (No Auth Required)
// ============================================

// Get all public templates (no auth - for viral growth)
viralGrowthRouter.get("/templates/public", async (req: Request, res: Response) => {
  try {
    const { category, search, sort = "popular" } = req.query;
    const publicTemplates = await viralGrowthStorage.getPublicTemplates({
      category: category as string,
      search: search as string,
      sort: sort as string,
    });
    res.json({ templates: publicTemplates, total: publicTemplates.length });
  } catch (error: any) {
    console.error("Error fetching public templates:", error);
    res.status(500).json({ error: "Failed to fetch public templates" });
  }
});

// Get single public template by slug (no auth)
viralGrowthRouter.get("/templates/public/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const template = await viralGrowthStorage.getPublicTemplateBySlug(slug);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    // Increment view count
    await viralGrowthStorage.incrementPublicTemplateViews(template.id);
    res.json(template);
  } catch (error: any) {
    console.error("Error fetching public template:", error);
    res.status(500).json({ error: "Failed to fetch template" });
  }
});

// Fork a template (requires auth)
viralGrowthRouter.post("/templates/:id/fork", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const templateId = parseInt(req.params.id);
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Check usage quota
    const quota = await viralGrowthStorage.getUsageQuota(userId);
    if (quota && quota.projectsUsed >= quota.projectsLimit) {
      return res.status(403).json({ 
        error: "Project limit reached", 
        limit: quota.projectsLimit,
        used: quota.projectsUsed,
        upgrade: true 
      });
    }
    
    const forkedProject = await viralGrowthStorage.forkTemplate(templateId, userId);
    
    // Increment fork count
    await viralGrowthStorage.incrementPublicTemplateForks(templateId);
    
    // Update usage quota
    await viralGrowthStorage.incrementProjectsUsed(userId);
    
    res.json(forkedProject);
  } catch (error: any) {
    console.error("Error forking template:", error);
    res.status(500).json({ error: "Failed to fork template" });
  }
});

// Make a template public (requires auth + ownership)
viralGrowthRouter.post("/templates/:id/publish", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const templateId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { title, description, tags, ogImage } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const slug = nanoid(10);
    const publicTemplate = await viralGrowthStorage.createPublicTemplate({
      templateId,
      visibility: "public",
      shareSlug: slug,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      authorId: userId,
      authorName: req.user?.firstName || "Anonymous",
      tags,
    });
    
    res.json(publicTemplate);
  } catch (error: any) {
    console.error("Error publishing template:", error);
    res.status(500).json({ error: "Failed to publish template" });
  }
});

// ============================================
// SHAREABLE LINKS
// ============================================

// Create a shareable link
viralGrowthRouter.post("/share", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { projectId, templateId, title, description, accessType, expiresIn, password } = req.body;
    
    const slug = nanoid(12);
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;
    
    const sharedLink = await viralGrowthStorage.createSharedLink({
      projectId,
      templateId,
      userId,
      slug,
      title,
      description,
      accessType: accessType || "view",
      password,
      expiresAt,
      ogMeta: {
        title: title || "Shared from MedBuilder",
        description: description || "HIPAA-compliant healthcare application",
        image: "/og-share.png",
      },
    });
    
    res.json({
      ...sharedLink,
      url: `${req.protocol}://${req.get("host")}/share/${slug}`,
    });
  } catch (error: any) {
    console.error("Error creating shared link:", error);
    res.status(500).json({ error: "Failed to create shared link" });
  }
});

// Access shared content (no auth for viewing)
viralGrowthRouter.get("/share/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { password } = req.query;
    
    const sharedLink = await viralGrowthStorage.getSharedLinkBySlug(slug);
    if (!sharedLink) {
      return res.status(404).json({ error: "Link not found" });
    }
    
    // Check if expired
    if (sharedLink.expiresAt && new Date(sharedLink.expiresAt) < new Date()) {
      return res.status(410).json({ error: "Link has expired" });
    }
    
    // Check view limit
    if (sharedLink.maxViews && sharedLink.viewCount >= sharedLink.maxViews) {
      return res.status(410).json({ error: "View limit reached" });
    }
    
    // Check password if set
    if (sharedLink.password && sharedLink.password !== password) {
      return res.status(401).json({ error: "Password required", requiresPassword: true });
    }
    
    // Increment view count
    await viralGrowthStorage.incrementSharedLinkViews(sharedLink.id);
    
    // Get the actual content
    let content;
    if (sharedLink.projectId) {
      content = await storage.getProject(sharedLink.projectId);
    } else if (sharedLink.templateId) {
      content = await storage.getTemplate(sharedLink.templateId);
    }
    
    res.json({
      ...sharedLink,
      content,
      canFork: sharedLink.accessType === "fork" || sharedLink.accessType === "edit",
    });
  } catch (error: any) {
    console.error("Error accessing shared link:", error);
    res.status(500).json({ error: "Failed to access shared content" });
  }
});

// ============================================
// COMMUNITY SHOWCASE
// ============================================

// Get all showcases (public)
viralGrowthRouter.get("/showcase", async (req: Request, res: Response) => {
  try {
    const { category, sort = "popular", page = "1", limit = "20" } = req.query;
    const showcases = await viralGrowthStorage.getShowcases({
      category: category as string,
      sort: sort as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    res.json(showcases);
  } catch (error: any) {
    console.error("Error fetching showcases:", error);
    res.status(500).json({ error: "Failed to fetch showcases" });
  }
});

// Get featured showcases
viralGrowthRouter.get("/showcase/featured", async (req: Request, res: Response) => {
  try {
    const featured = await viralGrowthStorage.getFeaturedShowcases();
    res.json(featured);
  } catch (error: any) {
    console.error("Error fetching featured showcases:", error);
    res.status(500).json({ error: "Failed to fetch featured showcases" });
  }
});

// Submit to showcase
viralGrowthRouter.post("/showcase", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const data = insertShowcaseSchema.parse({
      ...req.body,
      userId,
      status: "pending",
    });
    
    const showcase = await viralGrowthStorage.createShowcase(data);
    res.json(showcase);
  } catch (error: any) {
    console.error("Error creating showcase:", error);
    res.status(500).json({ error: "Failed to submit to showcase" });
  }
});

// Vote on showcase
viralGrowthRouter.post("/showcase/:id/vote", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const showcaseId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { voteType = "up" } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Check if already voted
    const existingVote = await viralGrowthStorage.getShowcaseVote(showcaseId, userId);
    if (existingVote) {
      // Update vote
      await viralGrowthStorage.updateShowcaseVote(existingVote.id, voteType);
    } else {
      // Create new vote
      await viralGrowthStorage.createShowcaseVote({ showcaseId, userId, voteType });
    }
    
    // Update showcase like count
    await viralGrowthStorage.updateShowcaseLikes(showcaseId);
    
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error voting on showcase:", error);
    res.status(500).json({ error: "Failed to vote" });
  }
});

// ============================================
// USAGE QUOTAS & FREE TIER
// ============================================

// Get current user's usage
viralGrowthRouter.get("/usage", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    let quota = await viralGrowthStorage.getUsageQuota(userId);
    
    // Create quota if not exists
    if (!quota) {
      quota = await viralGrowthStorage.createUsageQuota({
        userId,
        tier: "free",
        aiCallsUsed: 0,
        aiCallsLimit: 50,
        projectsUsed: 0,
        projectsLimit: 3,
        templatesUsed: 0,
        templatesLimit: 5,
        storageUsedMb: 0,
        storageLimitMb: 100,
        collaboratorsLimit: 1,
        deploymentsUsed: 0,
        deploymentsLimit: 1,
      });
    }
    
    res.json(quota);
  } catch (error: any) {
    console.error("Error fetching usage:", error);
    res.status(500).json({ error: "Failed to fetch usage" });
  }
});

// Check if action is allowed
viralGrowthRouter.post("/usage/check", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { action } = req.body; // 'ai_call', 'create_project', 'deploy', etc.
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const quota = await viralGrowthStorage.getUsageQuota(userId);
    if (!quota) {
      return res.json({ allowed: true });
    }
    
    let allowed = true;
    let message = "";
    let upgradeRequired = false;
    
    switch (action) {
      case "ai_call":
        allowed = quota.aiCallsUsed < quota.aiCallsLimit;
        message = allowed ? "" : `AI call limit reached (${quota.aiCallsLimit}/month)`;
        break;
      case "create_project":
        allowed = quota.projectsUsed < quota.projectsLimit;
        message = allowed ? "" : `Project limit reached (${quota.projectsLimit})`;
        break;
      case "deploy":
        allowed = quota.deploymentsUsed < quota.deploymentsLimit;
        message = allowed ? "" : `Deployment limit reached (${quota.deploymentsLimit})`;
        break;
    }
    
    if (!allowed) {
      upgradeRequired = true;
    }
    
    res.json({ allowed, message, upgradeRequired, quota });
  } catch (error: any) {
    console.error("Error checking usage:", error);
    res.status(500).json({ error: "Failed to check usage" });
  }
});

// ============================================
// WEARABLE INTEGRATIONS
// ============================================

// Get wearable providers
viralGrowthRouter.get("/wearables/providers", async (req: Request, res: Response) => {
  res.json({
    providers: [
      { id: "apple_health", name: "Apple Health", icon: "apple", status: "available" },
      { id: "google_fit", name: "Google Fit", icon: "google", status: "available" },
      { id: "fitbit", name: "Fitbit", icon: "fitbit", status: "available" },
      { id: "garmin", name: "Garmin", icon: "garmin", status: "coming_soon" },
      { id: "samsung_health", name: "Samsung Health", icon: "samsung", status: "coming_soon" },
    ],
  });
});

// Connect wearable provider
viralGrowthRouter.post("/wearables/:provider/connect", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { provider } = req.params;
    const { projectId, scopes } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const integration = await viralGrowthStorage.createWearableIntegration({
      projectId,
      userId,
      provider,
      scopes,
      status: "pending",
      syncFrequency: "hourly",
    });
    
    // Generate OAuth URL based on provider
    const oauthUrl = `/api/wearables/${provider}/oauth?integration=${integration.id}`;
    
    res.json({ integration, oauthUrl });
  } catch (error: any) {
    console.error("Error connecting wearable:", error);
    res.status(500).json({ error: "Failed to connect wearable" });
  }
});

// Get wearable data
viralGrowthRouter.get("/wearables/:provider/data", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { provider } = req.params;
    const { projectId, dataType, startDate, endDate } = req.query;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const data = await viralGrowthStorage.getWearableData({
      userId,
      provider,
      projectId: projectId ? parseInt(projectId as string) : undefined,
      dataType: dataType as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });
    
    res.json(data);
  } catch (error: any) {
    console.error("Error fetching wearable data:", error);
    res.status(500).json({ error: "Failed to fetch wearable data" });
  }
});

// ============================================
// TELEHEALTH VIDEO
// ============================================

// Create telehealth session
viralGrowthRouter.post("/telehealth/session", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { projectId, title, description, scheduledAt, provider = "jitsi" } = req.body;
    const roomId = nanoid(12);
    
    let roomUrl = "";
    switch (provider) {
      case "jitsi":
        roomUrl = `https://meet.jit.si/medbuilder-${roomId}`;
        break;
      case "doxy":
        roomUrl = `https://doxy.me/medbuilder-${roomId}`;
        break;
      default:
        roomUrl = `https://meet.jit.si/medbuilder-${roomId}`;
    }
    
    const session = await viralGrowthStorage.createTelehealthSession({
      projectId,
      hostId: userId,
      provider,
      roomId,
      roomUrl,
      title,
      description,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: "scheduled",
      hipaaCompliant: true,
    });
    
    res.json(session);
  } catch (error: any) {
    console.error("Error creating telehealth session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
});

// Get telehealth session
viralGrowthRouter.get("/telehealth/session/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const sessionId = parseInt(req.params.id);
    const session = await viralGrowthStorage.getTelehealthSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.json(session);
  } catch (error: any) {
    console.error("Error fetching telehealth session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

// Start/end telehealth session
viralGrowthRouter.post("/telehealth/session/:id/:action", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const sessionId = parseInt(req.params.id);
    const { action } = req.params;
    const userId = req.user?.id;
    
    const session = await viralGrowthStorage.getTelehealthSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    if (session.hostId !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    let updates: any = {};
    if (action === "start") {
      updates = { status: "active", startedAt: new Date() };
    } else if (action === "end") {
      const duration = session.startedAt 
        ? Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000)
        : 0;
      updates = { status: "ended", endedAt: new Date(), duration };
    }
    
    const updated = await viralGrowthStorage.updateTelehealthSession(sessionId, updates);
    res.json(updated);
  } catch (error: any) {
    console.error("Error updating telehealth session:", error);
    res.status(500).json({ error: "Failed to update session" });
  }
});

// ============================================
// EHR INTEGRATIONS
// ============================================

// Get available EHR vendors
viralGrowthRouter.get("/ehr/vendors", async (req: Request, res: Response) => {
  res.json({
    vendors: [
      { id: "epic", name: "Epic", fhirVersion: "R4", status: "available", logo: "/logos/epic.png" },
      { id: "cerner", name: "Cerner (Oracle Health)", fhirVersion: "R4", status: "available", logo: "/logos/cerner.png" },
      { id: "allscripts", name: "Allscripts", fhirVersion: "DSTU2", status: "available", logo: "/logos/allscripts.png" },
      { id: "meditech", name: "MEDITECH", fhirVersion: "R4", status: "coming_soon", logo: "/logos/meditech.png" },
      { id: "athena", name: "athenahealth", fhirVersion: "R4", status: "coming_soon", logo: "/logos/athena.png" },
    ],
  });
});

// Connect EHR
viralGrowthRouter.post("/ehr/:vendor/connect", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { vendor } = req.params;
    const { projectId, clientId, fhirEndpoint, scopes, sandboxMode = true } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const integration = await viralGrowthStorage.createEhrIntegration({
      projectId,
      userId,
      vendor,
      clientId,
      fhirEndpoint,
      scopes,
      sandboxMode,
      status: "pending",
    });
    
    res.json(integration);
  } catch (error: any) {
    console.error("Error connecting EHR:", error);
    res.status(500).json({ error: "Failed to connect EHR" });
  }
});

// Get EHR integration status
viralGrowthRouter.get("/ehr/:projectId/status", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const integrations = await viralGrowthStorage.getEhrIntegrations(projectId);
    res.json(integrations);
  } catch (error: any) {
    console.error("Error fetching EHR status:", error);
    res.status(500).json({ error: "Failed to fetch EHR status" });
  }
});

// ============================================
// VOICE-CONTROLLED DEVELOPMENT
// ============================================

// Process voice command
viralGrowthRouter.post("/voice/command", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { projectId, transcript, language = "en-US" } = req.body;
    
    // Parse voice command intent
    const intent = parseVoiceIntent(transcript);
    
    const command = await viralGrowthStorage.createVoiceCommand({
      projectId,
      userId,
      transcript,
      language,
      intent: intent.intent,
      action: intent.action,
      parameters: intent.parameters,
      status: "processing",
    });
    
    // Execute the command (simplified - in production would use AI)
    const result = await executeVoiceCommand(intent, projectId);
    
    await viralGrowthStorage.updateVoiceCommand(command.id, {
      status: "completed",
      result,
    });
    
    res.json({ command, result });
  } catch (error: any) {
    console.error("Error processing voice command:", error);
    res.status(500).json({ error: "Failed to process voice command" });
  }
});

// Get voice command history
viralGrowthRouter.get("/voice/history/:projectId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const commands = await viralGrowthStorage.getVoiceCommands(projectId, userId);
    res.json(commands);
  } catch (error: any) {
    console.error("Error fetching voice history:", error);
    res.status(500).json({ error: "Failed to fetch voice history" });
  }
});

// Voice intent parser (simplified)
function parseVoiceIntent(transcript: string): { intent: string; action: string; parameters: any } {
  const lower = transcript.toLowerCase();
  
  if (lower.includes("create") && lower.includes("component")) {
    const componentMatch = lower.match(/create (?:a |an )?(.+?) component/);
    return {
      intent: "create_component",
      action: "create",
      parameters: { componentType: componentMatch?.[1] || "form" },
    };
  }
  
  if (lower.includes("add") && lower.includes("field")) {
    const fieldMatch = lower.match(/add (?:a |an )?(.+?) field/);
    return {
      intent: "add_field",
      action: "modify",
      parameters: { fieldType: fieldMatch?.[1] || "text" },
    };
  }
  
  if (lower.includes("run") && lower.includes("test")) {
    return { intent: "run_tests", action: "execute", parameters: {} };
  }
  
  if (lower.includes("deploy") || lower.includes("publish")) {
    return { intent: "deploy", action: "execute", parameters: {} };
  }
  
  if (lower.includes("save")) {
    return { intent: "save", action: "execute", parameters: {} };
  }
  
  return { intent: "unknown", action: "none", parameters: { rawTranscript: transcript } };
}

// Execute voice command (simplified)
async function executeVoiceCommand(intent: any, projectId: number): Promise<any> {
  switch (intent.intent) {
    case "create_component":
      return { success: true, message: `Created ${intent.parameters.componentType} component` };
    case "add_field":
      return { success: true, message: `Added ${intent.parameters.fieldType} field` };
    case "run_tests":
      return { success: true, message: "Tests started" };
    case "deploy":
      return { success: true, message: "Deployment initiated" };
    case "save":
      return { success: true, message: "Project saved" };
    default:
      return { success: false, message: "Command not recognized", suggestions: [
        "Try: Create a form component",
        "Try: Add a text field",
        "Try: Run tests",
        "Try: Deploy application",
      ]};
  }
}

// ============================================
// TEMPLATE MARKETPLACE
// ============================================

// Get marketplace templates
viralGrowthRouter.get("/marketplace/templates", async (req: Request, res: Response) => {
  try {
    const { category, sort = "popular", minPrice, maxPrice, page = "1", limit = "20" } = req.query;
    const templates = await viralGrowthStorage.getMarketplaceTemplates({
      category: category as string,
      sort: sort as string,
      minPrice: minPrice ? parseInt(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    res.json(templates);
  } catch (error: any) {
    console.error("Error fetching marketplace templates:", error);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

// List template on marketplace
viralGrowthRouter.post("/marketplace/templates", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const data = insertMarketplaceTemplateSchema.parse({
      ...req.body,
      sellerId: userId,
      status: "pending",
    });
    
    const listing = await viralGrowthStorage.createMarketplaceListing(data);
    res.json(listing);
  } catch (error: any) {
    console.error("Error creating marketplace listing:", error);
    res.status(500).json({ error: "Failed to create listing" });
  }
});

// Purchase template
viralGrowthRouter.post("/marketplace/purchase", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { marketplaceTemplateId } = req.body;
    
    const template = await viralGrowthStorage.getMarketplaceTemplate(marketplaceTemplateId);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    // For free templates, just record the purchase
    if (template.price === 0) {
      const purchase = await viralGrowthStorage.createMarketplacePurchase({
        marketplaceTemplateId,
        buyerId: userId,
        sellerId: template.sellerId,
        price: 0,
        status: "completed",
      });
      
      // Increment download count
      await viralGrowthStorage.incrementMarketplaceDownloads(marketplaceTemplateId);
      
      return res.json({ purchase, downloadUrl: `/api/marketplace/download/${purchase.id}` });
    }
    
    // For paid templates, create Stripe checkout session
    // (Implementation would integrate with Stripe)
    res.json({ 
      requiresPayment: true, 
      price: template.price,
      checkoutUrl: `/checkout/marketplace/${marketplaceTemplateId}`,
    });
  } catch (error: any) {
    console.error("Error purchasing template:", error);
    res.status(500).json({ error: "Failed to purchase template" });
  }
});

// ============================================
// BADGES & GAMIFICATION
// ============================================

// Get all badges
viralGrowthRouter.get("/badges", async (req: Request, res: Response) => {
  try {
    const badges = await viralGrowthStorage.getBadges();
    res.json(badges);
  } catch (error: any) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ error: "Failed to fetch badges" });
  }
});

// Get user's badges
viralGrowthRouter.get("/badges/user", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const userBadges = await viralGrowthStorage.getUserBadges(userId);
    const points = await viralGrowthStorage.getUserPoints(userId);
    
    res.json({ badges: userBadges, points });
  } catch (error: any) {
    console.error("Error fetching user badges:", error);
    res.status(500).json({ error: "Failed to fetch user badges" });
  }
});

// Get leaderboard
viralGrowthRouter.get("/badges/leaderboard", async (req: Request, res: Response) => {
  try {
    const { timeframe = "all", limit = "20" } = req.query;
    const leaderboard = await viralGrowthStorage.getLeaderboard(
      timeframe as string,
      parseInt(limit as string)
    );
    res.json(leaderboard);
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// ============================================
// MEDBUILDER ACADEMY
// ============================================

// Get all courses
viralGrowthRouter.get("/academy/courses", async (req: Request, res: Response) => {
  try {
    const { category, difficulty, isFree } = req.query;
    const courses = await viralGrowthStorage.getCourses({
      category: category as string,
      difficulty: difficulty as string,
      isFree: isFree === "true",
    });
    res.json(courses);
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Get course details
viralGrowthRouter.get("/academy/courses/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const course = await viralGrowthStorage.getCourseBySlug(slug);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    const lessons = await viralGrowthStorage.getCourseLessons(course.id);
    res.json({ ...course, lessons });
  } catch (error: any) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// Enroll in course
viralGrowthRouter.post("/academy/courses/:id/enroll", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Check if already enrolled
    const existing = await viralGrowthStorage.getEnrollment(userId, courseId);
    if (existing) {
      return res.json(existing);
    }
    
    const enrollment = await viralGrowthStorage.createEnrollment({
      userId,
      courseId,
      status: "active",
      progress: 0,
      completedLessons: [],
    });
    
    // Update course enrollment count
    await viralGrowthStorage.incrementCourseEnrollments(courseId);
    
    res.json(enrollment);
  } catch (error: any) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ error: "Failed to enroll" });
  }
});

// Update lesson progress
viralGrowthRouter.post("/academy/lessons/:id/complete", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const lessonId = parseInt(req.params.id);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const lesson = await viralGrowthStorage.getLesson(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    
    const enrollment = await viralGrowthStorage.getEnrollment(userId, lesson.courseId);
    if (!enrollment) {
      return res.status(400).json({ error: "Not enrolled in this course" });
    }
    
    // Update completed lessons
    const completedLessons = [...(enrollment.completedLessons as number[] || [])];
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }
    
    // Calculate progress
    const totalLessons = await viralGrowthStorage.getCourseLessonCount(lesson.courseId);
    const progress = Math.round((completedLessons.length / totalLessons) * 100);
    
    const updated = await viralGrowthStorage.updateEnrollment(enrollment.id, {
      completedLessons,
      progress,
      lastLessonId: lessonId,
      completedAt: progress === 100 ? new Date() : null,
      status: progress === 100 ? "completed" : "active",
    });
    
    // Award badge if completed
    if (progress === 100) {
      await viralGrowthStorage.awardBadge(userId, "course_complete");
    }
    
    res.json(updated);
  } catch (error: any) {
    console.error("Error completing lesson:", error);
    res.status(500).json({ error: "Failed to complete lesson" });
  }
});

// ============================================
// TEAMS & ENTERPRISE
// ============================================

// Create team
viralGrowthRouter.post("/teams", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { name, description, industry, size } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + nanoid(6);
    
    const team = await viralGrowthStorage.createTeam({
      name,
      slug,
      description,
      industry,
      size,
      ownerId: userId,
      tier: "team",
      seats: 5,
      usedSeats: 1,
    });
    
    // Add owner as member
    await viralGrowthStorage.createTeamMember({
      teamId: team.id,
      userId,
      role: "owner",
      status: "active",
      joinedAt: new Date(),
    });
    
    res.json(team);
  } catch (error: any) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Failed to create team" });
  }
});

// Get user's teams
viralGrowthRouter.get("/teams", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const teams = await viralGrowthStorage.getUserTeams(userId);
    res.json(teams);
  } catch (error: any) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

// Invite member
viralGrowthRouter.post("/teams/:id/invite", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const teamId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { email, role = "member" } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Check if user is admin/owner
    const member = await viralGrowthStorage.getTeamMember(teamId, userId);
    if (!member || !["owner", "admin"].includes(member.role || "")) {
      return res.status(403).json({ error: "Not authorized to invite members" });
    }
    
    // Check seat limit
    const team = await viralGrowthStorage.getTeam(teamId);
    if (team && team.usedSeats >= team.seats) {
      return res.status(400).json({ error: "Seat limit reached", upgrade: true });
    }
    
    const token = nanoid(32);
    const invite = await viralGrowthStorage.createTeamInvite({
      teamId,
      email,
      role,
      invitedBy: userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: "pending",
    });
    
    res.json({
      invite,
      inviteUrl: `${req.protocol}://${req.get("host")}/invite/${token}`,
    });
  } catch (error: any) {
    console.error("Error inviting member:", error);
    res.status(500).json({ error: "Failed to invite member" });
  }
});

// Accept invite
viralGrowthRouter.post("/teams/invite/:token/accept", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const invite = await viralGrowthStorage.getTeamInviteByToken(token);
    if (!invite) {
      return res.status(404).json({ error: "Invite not found" });
    }
    
    if (invite.status !== "pending") {
      return res.status(400).json({ error: "Invite already used" });
    }
    
    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      return res.status(400).json({ error: "Invite expired" });
    }
    
    // Add member
    const member = await viralGrowthStorage.createTeamMember({
      teamId: invite.teamId,
      userId,
      role: invite.role,
      invitedBy: invite.invitedBy,
      invitedAt: invite.createdAt,
      joinedAt: new Date(),
      status: "active",
    });
    
    // Update invite status
    await viralGrowthStorage.updateTeamInvite(invite.id, { status: "accepted" });
    
    // Update seat count
    await viralGrowthStorage.incrementTeamSeats(invite.teamId);
    
    res.json(member);
  } catch (error: any) {
    console.error("Error accepting invite:", error);
    res.status(500).json({ error: "Failed to accept invite" });
  }
});

// ============================================
// WHITE-LABEL BRANDING
// ============================================

// Get team branding
viralGrowthRouter.get("/teams/:id/branding", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const teamId = parseInt(req.params.id);
    const branding = await viralGrowthStorage.getWhiteLabelBranding(teamId);
    res.json(branding || {});
  } catch (error: any) {
    console.error("Error fetching branding:", error);
    res.status(500).json({ error: "Failed to fetch branding" });
  }
});

// Update team branding
viralGrowthRouter.put("/teams/:id/branding", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const teamId = parseInt(req.params.id);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Check if owner/admin
    const member = await viralGrowthStorage.getTeamMember(teamId, userId);
    if (!member || !["owner", "admin"].includes(member.role || "")) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    // Check if team is on enterprise tier
    const team = await viralGrowthStorage.getTeam(teamId);
    if (team?.tier !== "enterprise") {
      return res.status(403).json({ error: "White-label requires Enterprise tier", upgrade: true });
    }
    
    const branding = await viralGrowthStorage.upsertWhiteLabelBranding({
      teamId,
      ...req.body,
    });
    
    res.json(branding);
  } catch (error: any) {
    console.error("Error updating branding:", error);
    res.status(500).json({ error: "Failed to update branding" });
  }
});

// ============================================
// AI COMPLIANCE COACH
// ============================================

// Get compliance recommendations
viralGrowthRouter.get("/compliance/recommendations/:projectId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const recommendations = await viralGrowthStorage.getComplianceRecommendations(projectId);
    res.json(recommendations);
  } catch (error: any) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// Run compliance scan
viralGrowthRouter.post("/compliance/scan/:projectId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Get project
    const project = await storage.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    // Run compliance checks
    const recommendations = await runComplianceScan(project, userId);
    
    // Save recommendations
    for (const rec of recommendations) {
      await viralGrowthStorage.createComplianceRecommendation({
        projectId,
        userId,
        ...rec,
      });
    }
    
    // Log compliance event
    await viralGrowthStorage.createComplianceEvent({
      projectId,
      userId,
      eventType: "scan",
      details: { recommendationCount: recommendations.length },
    });
    
    res.json({ recommendations, scanTime: new Date() });
  } catch (error: any) {
    console.error("Error running compliance scan:", error);
    res.status(500).json({ error: "Failed to run compliance scan" });
  }
});

// Resolve recommendation
viralGrowthRouter.post("/compliance/recommendations/:id/resolve", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const recommendationId = parseInt(req.params.id);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const updated = await viralGrowthStorage.resolveComplianceRecommendation(recommendationId, userId);
    res.json(updated);
  } catch (error: any) {
    console.error("Error resolving recommendation:", error);
    res.status(500).json({ error: "Failed to resolve recommendation" });
  }
});

// Compliance scan helper
async function runComplianceScan(project: any, userId: string): Promise<any[]> {
  const recommendations = [];
  const code = project.code || {};
  
  // Check for PHI exposure
  const phiPatterns = [
    { pattern: /patient\s*id/gi, rule: "phi-id-exposure", title: "Patient ID Exposure Risk" },
    { pattern: /ssn|social\s*security/gi, rule: "ssn-exposure", title: "SSN Exposure Risk" },
    { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, rule: "ssn-format", title: "SSN Format Detected" },
    { pattern: /date\s*of\s*birth|dob/gi, rule: "dob-exposure", title: "Date of Birth Exposure" },
  ];
  
  for (const [filePath, content] of Object.entries(code)) {
    if (typeof content !== "string") continue;
    
    for (const { pattern, rule, title } of phiPatterns) {
      if (pattern.test(content)) {
        recommendations.push({
          rule,
          category: "privacy",
          severity: "high",
          title,
          description: `Potential PHI exposure detected in ${filePath}`,
          currentState: `File contains patterns matching ${rule}`,
          recommendation: "Ensure PHI is encrypted at rest and in transit. Use tokenization where possible.",
          affectedFiles: [filePath],
        });
      }
    }
  }
  
  // Check for encryption
  if (!JSON.stringify(code).includes("encrypt") && !JSON.stringify(code).includes("crypto")) {
    recommendations.push({
      rule: "encryption-missing",
      category: "security",
      severity: "critical",
      title: "Encryption Not Detected",
      description: "No encryption implementation found in the codebase",
      currentState: "Project does not appear to use encryption",
      recommendation: "Implement AES-256 encryption for PHI data at rest and TLS 1.3 for data in transit.",
      affectedFiles: [],
    });
  }
  
  // Check for audit logging
  if (!JSON.stringify(code).includes("audit") && !JSON.stringify(code).includes("log")) {
    recommendations.push({
      rule: "audit-logging-missing",
      category: "audit",
      severity: "high",
      title: "Audit Logging Not Detected",
      description: "No audit logging implementation found",
      currentState: "Project does not appear to have audit logging",
      recommendation: "Implement comprehensive audit logging for all PHI access per HIPAA requirements.",
      affectedFiles: [],
    });
  }
  
  // Check for access control
  if (!JSON.stringify(code).includes("isAuthenticated") && !JSON.stringify(code).includes("auth")) {
    recommendations.push({
      rule: "access-control-missing",
      category: "access",
      severity: "critical",
      title: "Access Control Not Detected",
      description: "No authentication/authorization found",
      currentState: "Project does not appear to have access controls",
      recommendation: "Implement role-based access control (RBAC) with minimum necessary access principle.",
      affectedFiles: [],
    });
  }
  
  return recommendations;
}

// ============================================
// MULTI-LANGUAGE (i18n)
// ============================================

// Get supported locales
viralGrowthRouter.get("/locales", async (req: Request, res: Response) => {
  try {
    const locales = await viralGrowthStorage.getLocales();
    res.json(locales);
  } catch (error: any) {
    console.error("Error fetching locales:", error);
    res.status(500).json({ error: "Failed to fetch locales" });
  }
});

// Get translations for a locale
viralGrowthRouter.get("/translations/:locale", async (req: Request, res: Response) => {
  try {
    const { locale } = req.params;
    const { namespace = "common" } = req.query;
    const translations = await viralGrowthStorage.getTranslations(locale, namespace as string);
    
    // Convert to key-value object
    const result: Record<string, string> = {};
    for (const t of translations) {
      result[t.key] = t.value;
    }
    
    res.json(result);
  } catch (error: any) {
    console.error("Error fetching translations:", error);
    res.status(500).json({ error: "Failed to fetch translations" });
  }
});

export { viralGrowthRouter };
