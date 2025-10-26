import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Code, Sparkles, FileCode, User, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  generatedCode?: any;
}

export function ChatToCode() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
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
                      ? { ...msg, generatedCode: data.generatedCode }
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
      sendMessage();
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
                    
                    {message.generatedCode && (
                      <Card className="bg-gray-900 border-green-500/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2 text-green-400">
                            <FileCode className="w-4 h-4" />
                            Generated Code
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
                          <div className="bg-gray-950 rounded-lg p-3 max-h-60 overflow-auto">
                            <pre className="text-xs text-gray-300">
                              {JSON.stringify(message.generatedCode.code, null, 2)}
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
            onClick={sendMessage}
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
