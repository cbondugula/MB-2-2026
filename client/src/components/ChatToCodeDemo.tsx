import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import { 
  Send, 
  Loader2, 
  Code, 
  FileCode, 
  CheckCircle, 
  Sparkles,
  Copy,
  Download,
  Play,
  X,
  Zap,
  Shield,
  Heart
} from "lucide-react";

interface GeneratedCode {
  code: Record<string, string>;
  dependencies: Record<string, string>;
  techStack: {
    framework: string;
    language: string;
    styling: string;
    database?: string;
  };
  explanation: string;
  nextSteps: string[];
}

interface ChatToCodeDemoProps {
  initialPrompt?: string;
  sessionId?: string;
  onClose?: () => void;
  onComplete?: (code: GeneratedCode) => void;
}

export function ChatToCodeDemo({ initialPrompt, sessionId, onClose, onComplete }: ChatToCodeDemoProps) {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [phase, setPhase] = useState<"input" | "generating" | "complete">("input");
  const streamRef = useRef<EventSource | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialPrompt && phase === "input") {
      handleGenerate();
    }
  }, [initialPrompt]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setPhase("generating");
    setStreamingText("");
    setGeneratedCode(null);

    try {
      const response = await fetch("/api/chat/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to start generation");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response stream");
      }

      let buffer = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === "chunk") {
                setStreamingText(prev => prev + data.content);
              } else if (data.type === "complete") {
                setGeneratedCode(data.generatedCode);
                setPhase("complete");
                if (data.generatedCode?.code) {
                  const files = Object.keys(data.generatedCode.code);
                  if (files.length > 0) {
                    setSelectedFile(files[0]);
                  }
                }
                onComplete?.(data.generatedCode);
              } else if (data.type === "error") {
                console.error("Generation error:", data.error);
              }
            } catch (e) {
              console.warn("Parse error:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating:", error);
      setPhase("input");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    if (generatedCode && selectedFile) {
      navigator.clipboard.writeText(generatedCode.code[selectedFile]);
    }
  };

  const demoPrompts = [
    "Create a patient appointment scheduler with calendar view",
    "Build a secure patient intake form with HIPAA compliance",
    "Design a telehealth waiting room with video integration"
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="chat-to-code-demo">
      <Card className="w-full max-w-6xl h-[85vh] bg-gray-900 border-gray-700 flex flex-col">
        <CardHeader className="border-b border-gray-700 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">MedBuilder AI</CardTitle>
                <p className="text-gray-400 text-sm">Describe your healthcare app - we'll build it</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Compliant
              </Badge>
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-demo">
                  <X className="w-5 h-5 text-gray-400" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 flex overflow-hidden">
          {phase === "input" && (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-2xl space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">What healthcare app do you need?</h2>
                  <p className="text-gray-400">Describe your idea and watch it come to life</p>
                </div>
                
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: Build a patient portal where patients can view their medical records, schedule appointments, and message their doctor securely..."
                    className="w-full h-32 bg-gray-800 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-green-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        handleGenerate();
                      }
                    }}
                    data-testid="input-demo-prompt"
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700"
                    data-testid="button-generate"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate App
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-500 text-sm text-center">Or try one of these:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {demoPrompts.map((p, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => setPrompt(p)}
                        data-testid={`button-demo-prompt-${i}`}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {phase === "generating" && (
            <div className="flex-1 flex flex-col p-6">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                <span className="text-white font-medium">Building your healthcare app...</span>
              </div>
              
              <div className="flex-1 bg-gray-950 rounded-lg p-4 overflow-hidden">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-800">
                  <Code className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 text-sm">AI Response</span>
                </div>
                <ScrollArea className="h-[calc(100%-40px)]">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                    {streamingText}
                    <span className="animate-pulse text-green-400">▌</span>
                  </pre>
                </ScrollArea>
              </div>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>HIPAA compliance checks</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Healthcare best practices</span>
                </div>
              </div>
            </div>
          )}

          {phase === "complete" && generatedCode && (
            <div className="flex-1 flex overflow-hidden">
              <div className="w-56 border-r border-gray-700 bg-gray-950 p-3 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center gap-2 mb-3 text-gray-400 text-xs uppercase tracking-wider">
                  <FileCode className="w-4 h-4" />
                  <span>Generated Files</span>
                </div>
                <div className="space-y-1">
                  {Object.keys(generatedCode.code).map((file) => (
                    <button
                      key={file}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-3 py-2 rounded text-sm truncate transition-colors ${
                        selectedFile === file
                          ? "bg-green-600/20 text-green-400 border border-green-600/30"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                      data-testid={`button-file-${file.replace(/[^a-zA-Z0-9]/g, '-')}`}
                    >
                      {file.split('/').pop()}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Tech Stack</div>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="bg-blue-900/50 text-blue-300 text-xs">
                      {generatedCode.techStack.framework}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 text-xs">
                      {generatedCode.techStack.language}
                    </Badge>
                    <Badge variant="secondary" className="bg-cyan-900/50 text-cyan-300 text-xs">
                      {generatedCode.techStack.styling}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col overflow-hidden">
                <Tabs defaultValue="code" className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-950">
                    <TabsList className="bg-gray-800">
                      <TabsTrigger value="code" className="data-[state=active]:bg-gray-700">
                        <Code className="w-4 h-4 mr-2" />
                        Code
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="data-[state=active]:bg-gray-700">
                        <Play className="w-4 h-4 mr-2" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={copyCode} data-testid="button-copy-code">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled
                        title="Sign up to download"
                        data-testid="button-download-code"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        className="bg-green-600 hover:bg-green-700" 
                        size="sm" 
                        onClick={() => window.location.href = '/pricing'}
                        data-testid="button-deploy-app"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Deploy Now
                      </Button>
                    </div>
                  </div>
                  
                  <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
                    <ScrollArea className="h-full">
                      <pre className="p-4 text-sm text-gray-300 font-mono leading-relaxed">
                        <code>{selectedFile ? generatedCode.code[selectedFile] : "Select a file to view"}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
                    <SandpackProvider
                      template="react"
                      theme="dark"
                      files={{
                        "/App.js": generatedCode.code["App.tsx"] || generatedCode.code["App.js"] || Object.values(generatedCode.code)[0] || "export default function App() { return <div>Loading...</div> }",
                        "/styles.css": generatedCode.code["styles.css"] || generatedCode.code["index.css"] || `
                          * { margin: 0; padding: 0; box-sizing: border-box; }
                          body { font-family: system-ui, sans-serif; background: #1a1a2e; color: white; min-height: 100vh; }
                          .container { max-width: 400px; margin: 2rem auto; padding: 1.5rem; }
                          .card { background: #16213e; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; }
                          .input { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid #334; background: #0f0f23; color: white; margin-bottom: 0.75rem; }
                          .btn { width: 100%; padding: 0.75rem; border-radius: 8px; border: none; background: #22c55e; color: white; font-weight: 600; cursor: pointer; }
                          .btn:hover { background: #16a34a; }
                          h1, h2, h3 { margin-bottom: 1rem; }
                          .badge { display: inline-block; padding: 0.25rem 0.75rem; background: #22c55e33; color: #22c55e; border-radius: 999px; font-size: 0.75rem; }
                        `
                      }}
                      options={{
                        externalResources: ["https://cdn.tailwindcss.com"]
                      }}
                    >
                      <SandpackPreview 
                        showNavigator={false}
                        showOpenInCodeSandbox={false}
                        style={{ height: "100%", border: "none" }}
                      />
                    </SandpackProvider>
                  </TabsContent>
                </Tabs>
                
                <div className="p-4 border-t border-gray-700 bg-gray-950">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">{generatedCode.explanation}</p>
                      {generatedCode.nextSteps.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {generatedCode.nextSteps.map((step, i) => (
                            <Badge key={i} variant="outline" className="border-gray-600 text-gray-400">
                              {step}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
