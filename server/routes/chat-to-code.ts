import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import { chatToCodeService } from "../chat-to-code-service";

export function registerChatToCodeRoutes(app: Express) {
  
  // Create a new conversation
  app.post("/api/chat/conversations", isAuthenticated, async (req, res) => {
    try {
      const { initialPrompt, title } = req.body;
      const userId = (req.user as any)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const conversationId = await chatToCodeService.createConversation(
        userId,
        initialPrompt,
        title
      );
      
      // Add the initial message
      await chatToCodeService.addMessage(
        conversationId,
        "user",
        initialPrompt
      );
      
      res.json({ conversationId });
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });
  
  // Send a message and get AI response (streaming)
  app.post("/api/chat/messages", isAuthenticated, async (req, res) => {
    try {
      const { conversationId, message } = req.body;
      const userId = (req.user as any)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Add user message to database
      await chatToCodeService.addMessage(conversationId, "user", message);
      
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
        
        // Save assistant response to database
        const messageId = await chatToCodeService.addMessage(
          conversationId,
          "assistant",
          fullResponse,
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
  
  // Get conversation history
  app.get("/api/chat/conversations/:conversationId", isAuthenticated, async (req, res) => {
    try {
      const { conversationId } = req.params;
      const userId = (req.user as any)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const messages = await chatToCodeService.getConversationHistory(conversationId, userId);
      res.json({ messages });
    } catch (error) {
      console.error("Error getting conversation:", error);
      res.status(500).json({ error: "Failed to get conversation" });
    }
  });
  
  // Get user's conversations
  app.get("/api/chat/conversations", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const conversations = await chatToCodeService.getUserConversations(userId);
      res.json({ conversations });
    } catch (error) {
      console.error("Error getting conversations:", error);
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });
  
  // Get user's generated apps
  app.get("/api/chat/apps", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const apps = await chatToCodeService.getUserApps(userId);
      res.json({ apps });
    } catch (error) {
      console.error("Error getting apps:", error);
      res.status(500).json({ error: "Failed to get apps" });
    }
  });
  
  // Get a specific generated app with ownership verification
  app.get("/api/chat/apps/:appId", isAuthenticated, async (req, res) => {
    try {
      const { appId } = req.params;
      const userId = (req.user as any)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
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
