import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Code, Sparkles, FileCode, User, Bot, CheckCircle, ExternalLink, Eye, FolderCode } from "lucide-react";
import { Link } from "wouter";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  generatedCode?: any;
  appId?: string; // App ID when code is saved
}

interface ChatToCodeProps {
  initialPrompt?: string;
}

export function ChatToCode({ initialPrompt }: ChatToCodeProps = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [hasAutoSent, setHasAutoSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-send initial prompt when component mounts
  useEffect(() => {
    if (initialPrompt && !hasAutoSent && !isStreaming && messages.length === 0) {
      setHasAutoSent(true);
      // Send the initial prompt directly
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, hasAutoSent, isStreaming, messages.length]);

  const createConversation = async (initialPrompt: string): Promise<string> => {
    const response = await fetch("/api/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initialPrompt }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to create conversation");
    }
    
    const data = await response.json();
    return data.conversationId;
  };

  const handleSendMessage = async (messageText?: string) => {
    const userMessage = (messageText || input).trim();
    if (!userMessage || isStreaming) return;

    setInput("");
    
    // Add user message to UI
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMsgId,
      role: "user",
      content: userMessage,
    }]);

    setIsStreaming(true);

    try {
      // Create conversation if needed
      let convId = conversationId;
      if (!convId) {
        convId = await createConversation(userMessage);
        setConversationId(convId);
      }

      // Start streaming response
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convId,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 429) {
          const errorData = await response.json().catch(() => ({ error: "Too many requests" }));
          throw new Error(errorData.error || "You've reached the free demo limit. Please sign in for unlimited access!");
        }
        
        // Handle other errors
        const errorData = await response.json().catch(() => ({ error: "Failed to send message" }));
        throw new Error(errorData.error || "Failed to send message");
      }

      // Read SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let assistantMessage = "";
      const assistantMsgId = (Date.now() + 1).toString();
      
      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        role: "assistant",
        content: "",
      }]);

      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === "chunk") {
                assistantMessage += data.content;
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMsgId 
                    ? { ...msg, content: assistantMessage }
                    : msg
                ));
              } else if (data.type === "complete") {
                if (data.generatedCode) {
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMsgId 
                      ? { ...msg, generatedCode: data.generatedCode, appId: data.appId }
                      : msg
                  ));
                }
              } else if (data.type === "error") {
                console.error("Stream error:", data.error);
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      // Show the error message from the Error object
      const errorMessage = error?.message || "Sorry, I encountered an error. Please try again.";
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: errorMessage,
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const examplePrompts = [
    "Create a patient appointment scheduler",
    "Build a medication tracker app",
    "Generate a telemedicine consultation platform",
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-100">
                Start Building Your Healthcare App
              </h3>
              <p className="text-gray-400 max-w-md">
                Describe your app in plain English and watch as I generate production-ready code in real-time.
              </p>
            </div>
            <div className="flex flex-col space-y-2 w-full max-w-md">
              <p className="text-sm text-gray-500 mb-2">Try these examples:</p>
              {examplePrompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 text-left justify-start"
                  onClick={() => setInput(prompt)}
                  data-testid={`example-prompt-${i}`}
                >
                  <Code className="w-4 h-4 mr-2 text-green-400" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user" 
                      ? "bg-blue-600" 
                      : "bg-gradient-to-br from-green-500 to-blue-500"
                  }`}>
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Card className={`${
                      message.role === "user"
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-gray-800 text-gray-100 border-gray-700"
                    }`}>
                      <CardContent className="p-4">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </CardContent>
                    </Card>
                    
                    {message.appId && (
                      <Card className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div>
                                <h4 className="text-sm font-semibold text-green-400 mb-1">
                                  ✨ App Created Successfully!
                                </h4>
                                <p className="text-xs text-gray-300">
                                  Your healthcare app has been generated and saved. You can now preview it, edit the code, or deploy it.
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => window.open(`/apps/${message.appId}`, '_blank')}
                                  data-testid={`view-app-${message.appId}`}
                                >
                                  <Eye className="w-3 h-3 mr-1.5" />
                                  View App
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                  onClick={() => window.open(`/apps/${message.appId}/code`, '_blank')}
                                >
                                  <Code className="w-3 h-3 mr-1.5" />
                                  View Code
                                </Button>
                                <Button
                                  asChild
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-600 text-blue-300 hover:bg-blue-900/30"
                                >
                                  <Link href="/my-apps">
                                    <FolderCode className="w-3 h-3 mr-1.5" />
                                    My Apps
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {message.generatedCode && (
                      <Card className="bg-gray-900 border-gray-700/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2 text-gray-300">
                            <FileCode className="w-4 h-4" />
                            Generated Code Preview
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary" className="bg-green-900 text-green-300">
                              {message.generatedCode.techStack?.framework || "react"}
                            </Badge>
                            <Badge variant="secondary" className="bg-blue-900 text-blue-300">
                              {Object.keys(message.generatedCode.code || {}).length} files
                            </Badge>
                          </div>
                          <div className="bg-gray-950 rounded-lg p-3 max-h-40 overflow-auto">
                            <pre className="text-xs text-gray-300">
                              {JSON.stringify(message.generatedCode.code, null, 2).substring(0, 500)}...
                            </pre>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            {message.generatedCode.explanation}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <span>Generating code...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4">
        {/* Sign-up Banner */}
        {messages.length > 0 && (
          <div className="mb-3 bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-400" />
                <p className="text-sm text-gray-300">
                  Sign in to save your apps and access them anytime
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white border-green-500"
                onClick={() => window.location.href = '/api/login'}
              >
                Sign In
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your healthcare app... (Press Enter to send)"
            className="flex-1 min-h-[60px] bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 resize-none"
            disabled={isStreaming}
            data-testid="chat-input"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isStreaming}
            className="bg-green-600 hover:bg-green-700 text-white self-end"
            size="lg"
            data-testid="send-button"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
