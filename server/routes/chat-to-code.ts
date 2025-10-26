import type { Express } from "express";
import rateLimit from "express-rate-limit";
import { isAuthenticated } from "../replitAuth";
import { chatToCodeService } from "../chat-to-code-service";
import { nanoid } from "nanoid";

// Rate limiter for anonymous users (10 messages per hour)
const anonymousRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour for anonymous users
  message: { error: "Too many requests. Please sign in for unlimited access." },
  skip: (req) => {
    // Skip rate limiting for authenticated users
    return !!(req.user?.claims?.sub);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper to get user ID (authenticated or guest)
function getUserId(req: any): string {
  const authenticatedUserId = req.user?.claims?.sub;
  if (authenticatedUserId) {
    return authenticatedUserId;
  }
  
  // Generate guest ID for anonymous users
  if (!req.session.guestId) {
    req.session.guestId = `guest_${nanoid()}`;
  }
  return req.session.guestId;
}

export function registerChatToCodeRoutes(app: Express) {
  
  // Create a new conversation (public with rate limiting)
  app.post("/api/chat/conversations", anonymousRateLimiter, async (req, res) => {
    try {
      const { initialPrompt, title } = req.body;
      const userId = getUserId(req);
      
      const conversationId = await chatToCodeService.createConversation(
        userId,
        initialPrompt,
        title
      );
      
      // Add the initial message with ownership verification
      await chatToCodeService.addMessage(
        conversationId,
        "user",
        initialPrompt,
        userId
      );
      
      res.json({ conversationId });
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });
  
  // Send a message and get AI response (streaming - public with rate limiting)
  app.post("/api/chat/messages", anonymousRateLimiter, async (req, res) => {
    try {
      const { conversationId, message } = req.body;
      const userId = getUserId(req);
      
      // Add user message to database with ownership verification
      try {
        await chatToCodeService.addMessage(conversationId, "user", message, userId);
      } catch (error: any) {
        if (error.message.includes("access denied") || error.message.includes("not found")) {
          return res.status(403).json({ error: "Access denied: You don't have permission to access this conversation" });
        }
        throw error;
      }
      
      // Get conversation history with ownership verification
      const history = await chatToCodeService.getConversationHistory(conversationId, userId);
      
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
        
        // If code was generated, save the app
        if (generatedCode && Object.keys(generatedCode.code || {}).length > 0) {
          const appId = await chatToCodeService.saveGeneratedApp(
            userId,
            conversationId,
            generatedCode.explanation.substring(0, 100),
            generatedCode,
            message
          );
          
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
  
  // Get conversation history (public)
  app.get("/api/chat/conversations/:conversationId", async (req, res) => {
    try {
      const { conversationId } = req.params;
      const userId = getUserId(req);
      
      const messages = await chatToCodeService.getConversationHistory(conversationId, userId);
      res.json({ messages });
    } catch (error) {
      console.error("Error getting conversation:", error);
      res.status(500).json({ error: "Failed to get conversation" });
    }
  });
  
  // Get user's conversations (public)
  app.get("/api/chat/conversations", async (req, res) => {
    try {
      const userId = getUserId(req);
      
      const conversations = await chatToCodeService.getUserConversations(userId);
      res.json({ conversations });
    } catch (error) {
      console.error("Error getting conversations:", error);
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });
  
  // Get user's generated apps (public)
  app.get("/api/chat/apps", async (req, res) => {
    try {
      const userId = getUserId(req);
      
      const apps = await chatToCodeService.getUserApps(userId);
      res.json({ apps });
    } catch (error) {
      console.error("Error getting apps:", error);
      res.status(500).json({ error: "Failed to get apps" });
    }
  });
  
  // Get a specific generated app with ownership verification (public)
  app.get("/api/chat/apps/:appId", async (req, res) => {
    try {
      const { appId } = req.params;
      const userId = getUserId(req);
      
      const app = await chatToCodeService.getAppById(appId, userId);
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
