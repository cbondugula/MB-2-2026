import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Brain, 
  Code, 
  Lightbulb,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Eye
} from "lucide-react";

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'code' | 'suggestion' | 'success' | 'error';
  metadata?: {
    projectId?: string;
    generatedCode?: string;
    suggestions?: string[];
    previewUrl?: string;
  };
}

interface ConversationalInterfaceProps {
  onProjectCreated?: (projectId: string) => void;
  onCodeGenerated?: (code: string) => void;
  initialPrompt?: string;
  mode?: 'full' | 'compact' | 'inline';
}

export default function ConversationalInterface({ 
  onProjectCreated, 
  onCodeGenerated, 
  initialPrompt = "",
  mode = 'full' 
}: ConversationalInterfaceProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI development assistant. I can help you build any healthcare application using natural language. Just describe what you want to create!",
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState(initialPrompt);
  const [isListening, setIsListening] = useState(false);
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Voice recognition setup
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or type your message.",
          variant: "destructive"
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [toast]);

  // Fetch conversation context
  const { data: conversationContext } = useQuery({
    queryKey: ['/api/conversation/context', currentProject],
    enabled: !!currentProject,
    retry: false,
  });

  // AI Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("POST", "/api/ai/chat", {
        message,
        conversationHistory: messages.slice(-10), // Last 10 messages for context
        projectId: currentProject,
        mode: 'development_assistant'
      });
    },
    onSuccess: (response: any) => {
      const assistantMessage: ConversationMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.message || response.content || "I'm ready to help you build your application!",
        timestamp: new Date(),
        type: (response.type as any) || 'text',
        metadata: response.metadata
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle different response types
      if (response.type === 'project_created' && response.metadata?.projectId) {
        setCurrentProject(response.metadata.projectId);
        onProjectCreated?.(response.metadata.projectId);
        toast({
          title: "Project Created!",
          description: "Your new project is ready. What would you like to add next?",
        });
      }

      if (response.type === 'code_generated' && response.metadata?.generatedCode) {
        onCodeGenerated?.(response.metadata.generatedCode);
      }

      scrollToBottom();
    },
    onError: (error) => {
      toast({
        title: "AI Assistant Error",
        description: "I'm having trouble right now. Please try again.",
        variant: "destructive"
      });
    }
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input.trim();
    setInput('');
    
    scrollToBottom();
    
    // Send to AI
    chatMutation.mutate(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceRecognition = () => {
    if (!recognition) {
      toast({
        title: "Voice Not Supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const quickSuggestions = [
    "Create a patient appointment scheduling app",
    "Build a HIPAA-compliant messaging system",
    "Generate a medication tracking dashboard",
    "Design a telemedicine consultation platform",
    "Create an EHR integration system",
    "Build a clinical decision support tool"
  ];

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'code': return <Code className="w-4 h-4" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  if (mode === 'compact') {
    return (
      <Card className="w-full h-64">
        <CardContent className="p-3 h-full flex flex-col">
          <ScrollArea className="flex-1 mb-2">
            <div className="space-y-2">
              {messages.slice(-3).map((message) => (
                <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2 rounded-lg text-xs ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <div ref={scrollRef} />
          </ScrollArea>
          <div className="flex gap-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 min-h-[32px] text-xs resize-none"
              rows={1}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || chatMutation.isPending}
              size="sm"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`flex flex-col h-full ${mode === 'inline' ? 'max-h-96' : 'h-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Development Assistant</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {chatMutation.isPending ? "Thinking..." : "Ready to help you build"}
            </p>
          </div>
        </div>
        {currentProject && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Project Active
          </Badge>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                <div className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white ml-auto' 
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && getMessageIcon(message.type)}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.metadata?.suggestions && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.metadata.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6"
                              onClick={() => setInput(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                      {message.metadata?.previewUrl && (
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Preview App
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-3">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8 order-3">
                  <AvatarFallback className="bg-gray-500 text-white text-xs">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {chatMutation.isPending && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  <span className="text-sm">Generating your application...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {quickSuggestions.slice(0, 3).map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="text-xs h-6"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the healthcare app you want to build..."
              className="pr-12 min-h-[44px] resize-none"
              rows={1}
            />
            <Button
              onClick={toggleVoiceRecognition}
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              disabled={!recognition}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-red-500" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || chatMutation.isPending}
            className="h-11"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {isListening && (
          <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
            <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />
            Listening... speak now
          </p>
        )}
      </div>
    </div>
  );
}