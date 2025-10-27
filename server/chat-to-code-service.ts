// Chat-to-Code Service - Real-time AI code generation for healthcare apps
import OpenAI from "openai";
import { db } from "./db";
import { 
  chatConversations, 
  chatMessages, 
  generatedApps, 
  appVersions, 
  appDeployments,
  userSettings,
  type ChatMessage as ChatMessageSchema
} from "../shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { encrypt, decrypt } from "./encryption";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  sequence: number;
}

export interface GeneratedCodeResponse {
  code: Record<string, string>; // file path -> code content
  dependencies: Record<string, string>; // package -> version
  techStack: {
    framework: string;
    language: string;
    styling: string;
    database?: string;
  };
  explanation: string;
  nextSteps: string[];
}

export class ChatToCodeService {
  
  // Create a new conversation
  async createConversation(userId: string, initialPrompt: string, title?: string): Promise<string> {
    const conversationId = nanoid();
    
    // Encrypt PHI in initial prompt before storing (HIPAA compliance)
    const encryptedInitialPrompt = encrypt(initialPrompt) || initialPrompt;
    
    await db.insert(chatConversations).values({
      id: conversationId,
      userId,
      title: title || this.generateTitle(initialPrompt),
      initialPrompt: encryptedInitialPrompt,
      status: "active",
      conversationType: "chat",
      context: {},
      metadata: {},
    });
    
    return conversationId;
  }
  
  // Add a message to conversation with ownership verification
  async addMessage(
    conversationId: string, 
    role: "user" | "assistant" | "system",
    content: string,
    userId?: string,
    metadata?: any
  ): Promise<string> {
    // Verify conversation ownership if userId provided
    if (userId) {
      const conversation = await db
        .select()
        .from(chatConversations)
        .where(and(
          eq(chatConversations.id, conversationId),
          eq(chatConversations.userId, userId)
        ))
        .limit(1);
      
      if (conversation.length === 0) {
        throw new Error("Conversation not found or access denied");
      }
    }
    
    const messageId = nanoid();
    
    // Get the next sequence number
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(desc(chatMessages.sequence));
    
    const nextSequence = messages.length > 0 ? messages[0].sequence + 1 : 1;
    
    // Encrypt PHI content before storing (HIPAA compliance)
    const encryptedContent = encrypt(content) || content;
    
    await db.insert(chatMessages).values({
      id: messageId,
      conversationId,
      role,
      content: encryptedContent,
      sequence: nextSequence,
      messageType: "text",
      metadata: metadata || {},
    });
    
    // Update conversation's last message timestamp
    await db
      .update(chatConversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(chatConversations.id, conversationId));
    
    return messageId;
  }
  
  // Get conversation history with ownership verification
  async getConversationHistory(conversationId: string, userId?: string): Promise<ChatMessage[]> {
    // First verify conversation ownership if userId provided
    if (userId) {
      const conversation = await db
        .select()
        .from(chatConversations)
        .where(and(
          eq(chatConversations.id, conversationId),
          eq(chatConversations.userId, userId)
        ))
        .limit(1);
      
      if (conversation.length === 0) {
        throw new Error("Conversation not found or access denied");
      }
    }
    
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.sequence);
    
    // Decrypt PHI content when retrieving (HIPAA compliance)
    return messages.map(msg => ({
      id: msg.id,
      role: msg.role as "user" | "assistant" | "system",
      content: decrypt(msg.content) || msg.content,
      sequence: msg.sequence,
    }));
  }
  
  // Generate code using OpenAI streaming
  async generateCode(
    userId: string,
    conversationId: string,
    userPrompt: string,
    conversationHistory: ChatMessage[]
  ): Promise<AsyncGenerator<string, GeneratedCodeResponse>> {
    const stream = this.streamCodeGeneration(userId, userPrompt, conversationHistory);
    return stream;
  }
  
  private async *streamCodeGeneration(
    userId: string,
    userPrompt: string,
    conversationHistory: ChatMessage[]
  ): AsyncGenerator<string, GeneratedCodeResponse> {
    const systemPrompt = await this.buildSystemPrompt(userId);
    
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg: ChatMessage) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content
      })),
      { role: "user", content: userPrompt }
    ];
    
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      stream: true,
      temperature: 0.3,
      max_tokens: 4000,
    });
    
    let fullResponse = "";
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullResponse += content;
        yield content;
      }
    }
    
    // Parse the complete response
    return this.parseCodeResponse(fullResponse);
  }
  
  // Build system prompt for code generation
  private async buildSystemPrompt(userId: string): Promise<string> {
    // Get user settings if available
    const settings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);
    
    const userMode = settings[0]?.userMode || "simple";
    const preferredFramework = settings[0]?.defaultFramework || "react";
    const healthcareSpecialty = settings[0]?.healthcareSpecialty || "general";
    
    return `You are MedBuilder AI, an expert healthcare application development assistant.

CRITICAL RULES:
1. Generate COMPLETE, production-ready code - not examples or templates
2. All code must be HIPAA-compliant by default
3. Use modern React 18 with TypeScript and functional components
4. Include proper error handling and loading states
5. Generate file structure as JSON: { "path/to/file.tsx": "...code..." }
6. Include all necessary imports and dependencies
7. Use shadcn/ui components and Tailwind CSS for styling
8. Focus on healthcare-specific features (patient data, appointments, records, etc.)

USER CONTEXT:
- User Mode: ${userMode}
- Preferred Framework: ${preferredFramework}
- Healthcare Specialty: ${healthcareSpecialty}

OUTPUT FORMAT:
Provide your response in this exact JSON structure:
{
  "code": {
    "src/App.tsx": "import ...",
    "src/components/Dashboard.tsx": "...",
    "package.json": "..."
  },
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "techStack": {
    "framework": "react",
    "language": "typescript",
    "styling": "tailwindcss",
    "database": "postgresql"
  },
  "explanation": "Brief explanation of what was built",
  "nextSteps": ["Step 1", "Step 2"]
}

Generate complete, working healthcare applications that can be deployed immediately.`;
  }
  
  // Parse the AI response to extract code, dependencies, etc.
  private parseCodeResponse(response: string): GeneratedCodeResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                        response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return {
          code: parsed.code || {},
          dependencies: parsed.dependencies || {},
          techStack: parsed.techStack || {
            framework: "react",
            language: "typescript",
            styling: "tailwindcss"
          },
          explanation: parsed.explanation || "Healthcare application generated successfully",
          nextSteps: parsed.nextSteps || ["Test the application", "Deploy to production"]
        };
      }
      
      // Fallback: extract code blocks manually
      const codeBlocks = this.extractCodeBlocks(response);
      
      return {
        code: codeBlocks,
        dependencies: this.extractDependencies(response),
        techStack: {
          framework: "react",
          language: "typescript",
          styling: "tailwindcss"
        },
        explanation: "Code generated based on your requirements",
        nextSteps: ["Review the code", "Test the application"]
      };
      
    } catch (error) {
      console.error("Error parsing code response:", error);
      return {
        code: {},
        dependencies: {},
        techStack: {
          framework: "react",
          language: "typescript",
          styling: "tailwindcss"
        },
        explanation: "Error generating code. Please try again.",
        nextSteps: []
      };
    }
  }
  
  // Extract code blocks from markdown
  private extractCodeBlocks(text: string): Record<string, string> {
    const codeBlocks: Record<string, string> = {};
    const regex = /```(?:typescript|tsx|jsx|javascript|json)?\s*([\s\S]*?)```/g;
    let match;
    let index = 1;
    
    while ((match = regex.exec(text)) !== null) {
      const code = match[1].trim();
      const fileName = this.guessFileName(code, index);
      codeBlocks[fileName] = code;
      index++;
    }
    
    return codeBlocks;
  }
  
  // Guess file name based on code content
  private guessFileName(code: string, index: number): string {
    if (code.includes("package.json") || code.includes('"name":')) {
      return "package.json";
    }
    if (code.includes("export default function App")) {
      return "src/App.tsx";
    }
    if (code.includes("interface") || code.includes("type")) {
      return `src/types/index${index}.ts`;
    }
    return `src/component${index}.tsx`;
  }
  
  // Extract dependencies from response
  private extractDependencies(text: string): Record<string, string> {
    const deps: Record<string, string> = {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "typescript": "^5.0.0"
    };
    
    // Look for common imports and add them
    if (text.includes("@/components/ui/")) {
      deps["@radix-ui/react-slot"] = "^1.0.0";
      deps["class-variance-authority"] = "^0.7.0";
      deps["clsx"] = "^2.0.0";
      deps["tailwind-merge"] = "^2.0.0";
    }
    
    if (text.includes("lucide-react")) {
      deps["lucide-react"] = "^0.300.0";
    }
    
    if (text.includes("@tanstack/react-query")) {
      deps["@tanstack/react-query"] = "^5.0.0";
    }
    
    return deps;
  }
  
  // Save generated app to database
  async saveGeneratedApp(
    userId: string,
    conversationId: string,
    name: string,
    generatedCode: GeneratedCodeResponse,
    prompt: string
  ): Promise<string> {
    const appId = nanoid();
    
    await db.insert(generatedApps).values({
      id: appId,
      userId,
      conversationId,
      name,
      description: generatedCode.explanation,
      appType: "healthcare-app",
      framework: generatedCode.techStack.framework,
      techStack: generatedCode.techStack,
      code: generatedCode.code,
      dependencies: generatedCode.dependencies,
      buildConfig: {
        vite: true,
        typescript: true
      },
      isHipaaCompliant: true,
      aiModelUsed: "gpt-4o",
      generationMetadata: {
        prompt,
        timestamp: new Date().toISOString(),
        nextSteps: generatedCode.nextSteps
      },
      status: "draft",
    });
    
    // Link the conversation to this app
    await db
      .update(chatConversations)
      .set({ generatedAppId: appId })
      .where(eq(chatConversations.id, conversationId));
    
    // Create initial version
    await this.createAppVersion(appId, generatedCode, "Initial generation");
    
    return appId;
  }
  
  // Create a new version of an app
  async createAppVersion(
    appId: string,
    generatedCode: GeneratedCodeResponse,
    changeDescription: string
  ): Promise<string> {
    const versionId = nanoid();
    
    // Get current version count
    const versions = await db
      .select()
      .from(appVersions)
      .where(eq(appVersions.appId, appId));
    
    const versionNumber = versions.length + 1;
    
    await db.insert(appVersions).values({
      id: versionId,
      appId,
      versionNumber,
      changeDescription,
      code: generatedCode.code,
      dependencies: generatedCode.dependencies,
      isRollbackPoint: true,
      status: "active",
      metadata: {
        techStack: generatedCode.techStack,
        explanation: generatedCode.explanation
      },
    });
    
    return versionId;
  }
  
  // Generate a title for the conversation based on initial prompt
  private generateTitle(prompt: string): string {
    const words = prompt.split(" ").slice(0, 6).join(" ");
    return words.length > 50 ? words.substring(0, 50) + "..." : words;
  }
  
  // Get user's conversations
  async getUserConversations(userId: string, limit: number = 20) {
    return await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.userId, userId))
      .orderBy(desc(chatConversations.lastMessageAt))
      .limit(limit);
  }
  
  // Get generated apps
  async getUserApps(userId: string, limit: number = 20) {
    return await db
      .select()
      .from(generatedApps)
      .where(eq(generatedApps.userId, userId))
      .orderBy(desc(generatedApps.createdAt))
      .limit(limit);
  }
  
  // Get a specific app with ownership verification
  async getAppById(appId: string, userId: string) {
    const apps = await db
      .select()
      .from(generatedApps)
      .where(eq(generatedApps.id, appId))
      .limit(1);
    
    if (apps.length === 0) {
      throw new Error("App not found");
    }
    
    const app = apps[0];
    
    // Allow access if:
    // 1. User owns the app
    // 2. App was created by a guest user (starts with 'guest_')
    // 3. App is marked as public
    const isOwner = app.userId === userId;
    const isGuestApp = app.userId?.startsWith('guest_');
    const isPublic = app.isPublic;
    
    if (!isOwner && !isGuestApp && !isPublic) {
      throw new Error("Access denied");
    }
    
    return app;
  }
}

export const chatToCodeService = new ChatToCodeService();
