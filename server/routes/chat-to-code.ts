import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import { chatToCodeService } from "../chat-to-code-service";
import { createAuditLogger } from "../audit-logger";

// Helper to get authenticated user ID
function getUserId(req: any): string {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

export function registerChatToCodeRoutes(app: Express) {
  
  // Create a new conversation (requires authentication)
  app.post("/api/chat/conversations", isAuthenticated, async (req, res) => {
    try {
      const { initialPrompt, title } = req.body;
      const userId = getUserId(req);
      const auditLogger = createAuditLogger(req, userId);
      
      const conversationId = await chatToCodeService.createConversation(
        userId,
        initialPrompt,
        title
      );
      
      // Log conversation creation (HIPAA compliance)
      await auditLogger.logCreate("chat_conversations", conversationId, {
        userId,
        title: title || initialPrompt.substring(0, 100),
      });
      
      // Add the initial message with ownership verification
      const initialMessageId = await chatToCodeService.addMessage(
        conversationId,
        "user",
        initialPrompt,
        userId
      );
      
      // Log initial message creation (HIPAA compliance)
      await auditLogger.logCreate("chat_messages", initialMessageId, { role: "user", conversationId });
      
      res.json({ conversationId });
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });
  
  // Send a message and get AI response (streaming - requires authentication)
  app.post("/api/chat/messages", isAuthenticated, async (req, res) => {
    try {
      const { conversationId, message } = req.body;
      const userId = getUserId(req);
      const auditLogger = createAuditLogger(req, userId);
      
      // Add user message to database with ownership verification
      try {
        const userMessageId = await chatToCodeService.addMessage(conversationId, "user", message, userId);
        // Log message creation (HIPAA compliance)
        await auditLogger.logCreate("chat_messages", userMessageId, { role: "user", conversationId });
      } catch (error: any) {
        if (error.message.includes("access denied") || error.message.includes("not found")) {
          return res.status(403).json({ error: "Access denied: You don't have permission to access this conversation" });
        }
        throw error;
      }
      
      // Get conversation history with ownership verification
      const history = await chatToCodeService.getConversationHistory(conversationId, userId);
      
      // Log conversation history READ (HIPAA compliance)
      await auditLogger.logRead("chat_conversations", conversationId, { purpose: "AI context", messageCount: history.length });
      
      // Set up Server-Sent Events for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      
      let fullResponse = "";
      let generatedCode: any = null;
      
      try {
        // Generate code with streaming
        const stream = await chatToCodeService.generateCode(
          userId,
          conversationId,
          message,
          history
        );
        
        // Manually consume the async generator to capture return value
        let done = false;
        let lastResult: any = null;
        
        while (!done) {
          const result = await stream.next();
          lastResult = result;
          done = result.done || false;
          
          if (!done && typeof result.value === 'string') {
            // This is a yielded chunk
            fullResponse += result.value;
            res.write(`data: ${JSON.stringify({ type: "chunk", content: result.value })}\n\n`);
          }
        }
        
        // After loop exits, lastResult contains the final returned value
        generatedCode = lastResult?.value;
        
        // Save assistant response to database with ownership verification
        const messageId = await chatToCodeService.addMessage(
          conversationId,
          "assistant",
          fullResponse,
          userId,
          { generatedCode }
        );
        
        // Log assistant message creation (HIPAA compliance)
        await auditLogger.logCreate("chat_messages", messageId, { role: "assistant", conversationId });
        
        // If code was generated, save the app
        if (generatedCode && Object.keys(generatedCode.code || {}).length > 0) {
          const appId = await chatToCodeService.saveGeneratedApp(
            userId,
            conversationId,
            generatedCode.explanation.substring(0, 100),
            generatedCode,
            message
          );
          
          // Log app generation (HIPAA compliance)
          await auditLogger.logCreate("generated_apps", appId, { 
            conversationId,
            framework: generatedCode.techStack?.framework 
          });
          
          res.write(`data: ${JSON.stringify({ 
            type: "complete", 
            messageId,
            appId,
            generatedCode
          })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ type: "complete", messageId })}\n\n`);
        }
        
      } catch (error) {
        console.error("Error generating response:", error);
        res.write(`data: ${JSON.stringify({ type: "error", error: "Failed to generate response" })}\n\n`);
      }
      
      res.end();
      
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });
  
  // Get conversation history (requires authentication)
  app.get("/api/chat/conversations/:conversationId", isAuthenticated, async (req, res) => {
    try {
      const { conversationId } = req.params;
      const userId = getUserId(req);
      const auditLogger = createAuditLogger(req, userId);
      
      const messages = await chatToCodeService.getConversationHistory(conversationId, userId);
      
      // Log conversation READ access (HIPAA compliance)
      await auditLogger.logRead("chat_conversations", conversationId, { messageCount: messages.length });
      
      res.json({ messages });
    } catch (error) {
      console.error("Error getting conversation:", error);
      res.status(500).json({ error: "Failed to get conversation" });
    }
  });
  
  // Get user's conversations (requires authentication)
  app.get("/api/chat/conversations", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const auditLogger = createAuditLogger(req, userId);
      
      const conversations = await chatToCodeService.getUserConversations(userId);
      
      // Log user conversations READ access (HIPAA compliance)
      await auditLogger.logRead("chat_conversations", undefined, { count: conversations.length });
      
      res.json({ conversations });
    } catch (error) {
      console.error("Error getting conversations:", error);
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });
  
  // Get user's generated apps (requires authentication)
  app.get("/api/chat/apps", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const auditLogger = createAuditLogger(req, userId);
      
      const apps = await chatToCodeService.getUserApps(userId);
      
      // Log user apps READ access (HIPAA compliance)
      await auditLogger.logRead("generated_apps", undefined, { count: apps.length });
      
      res.json({ apps });
    } catch (error) {
      console.error("Error getting apps:", error);
      res.status(500).json({ error: "Failed to get apps" });
    }
  });
  
  // Get a specific generated app with ownership verification (requires authentication)
  app.get("/api/chat/apps/:appId", isAuthenticated, async (req, res) => {
    try {
      const { appId } = req.params;
      const userId = getUserId(req);
      const auditLogger = createAuditLogger(req, userId);
      
      const app = await chatToCodeService.getAppById(appId, userId);
      
      // Log app READ access (HIPAA compliance)
      await auditLogger.logRead("generated_apps", appId, { framework: app.framework });
      
      res.json({ app });
    } catch (error) {
      console.error("Error getting app:", error);
      const message = (error as Error).message;
      if (message.includes("not found") || message.includes("access denied")) {
        return res.status(404).json({ error: message });
      }
      res.status(500).json({ error: "Failed to get app" });
    }
  });
}
