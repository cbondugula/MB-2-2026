import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Brain, 
  Code, 
  Zap, 
  Download,
  Copy,
  Play,
  Settings,
  FileCode,
  GitBranch,
  Terminal,
  Cpu,
  Network,
  Database,
  Shield,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Wand2,
  Bot,
  MessageSquare,
  Lightbulb,
  Target,
  Workflow
} from 'lucide-react';

export default function AICodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('typescript');
  const [selectedFramework, setSelectedFramework] = useState('react');
  const [selectedModel, setSelectedModel] = useState('med-gemma-7b');
  const [complexity, setComplexity] = useState('medium');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  // Dynamic data fetching
  const { data: codeTemplates, isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/ai/code-templates'],
    enabled: true,
  });

  const { data: aiModels, isLoading: modelsLoading } = useQuery({
    queryKey: ['/api/ai/models'],
    enabled: true,
  });

  const { data: codeExamples, isLoading: examplesLoading } = useQuery({
    queryKey: ['/api/ai/code-examples'],
    enabled: true,
  });

  // AI Code Generation
  const generateCodeMutation = useMutation({
    mutationFn: async (codeRequest: any) => {
      setIsGenerating(true);
      setGenerationProgress(0);
      
      // Simulate AI generation progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 300);

      const result = await apiRequest('/api/ai/generate-code', 'POST', codeRequest);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      return result;
    },
    onSuccess: (result) => {
      setGeneratedCode(result.code);
      toast({
        title: "Code Generated Successfully",
        description: `Generated ${result.linesOfCode} lines of ${selectedLanguage} code.`,
      });
      setGenerationProgress(0);
      setIsGenerating(false);
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
      setGenerationProgress(0);
      setIsGenerating(false);
    },
  });

  const handleGenerateCode = () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please provide a description of what you want to build.",
        variant: "destructive"
      });
      return;
    }

    const codeRequest = {
      prompt,
      language: selectedLanguage,
      framework: selectedFramework,
      complexity,
      features: {
        authentication: true,
        database: true,
        apiIntegration: true,
        testing: true,
        documentation: true
      }
    };

    generateCodeMutation.mutate(codeRequest);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Code Copied",
      description: "Generated code has been copied to clipboard.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Code Generator</h1>
          <p className="text-muted-foreground">
            Generate production-ready healthcare code with advanced AI models
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-purple-500" />
          <span className="text-sm font-medium">Powered by Healthcare AI</span>
        </div>
      </div>

      {isGenerating && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-purple-500 animate-pulse" />
              <span>Generating Code...</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generation Progress</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Analyzing requirements, generating code structure, and optimizing for healthcare compliance...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator">Code Generator</TabsTrigger>
          <TabsTrigger value="templates">Smart Templates</TabsTrigger>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Requirements</CardTitle>
                <CardDescription>Describe what you want to build</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Create a patient registration form with HIPAA compliance, data validation, and real-time updates..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="csharp">C#</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                        <SelectItem value="rust">Rust</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Framework</label>
                    <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="angular">Angular</SelectItem>
                        <SelectItem value="vue">Vue.js</SelectItem>
                        <SelectItem value="nextjs">Next.js</SelectItem>
                        <SelectItem value="express">Express.js</SelectItem>
                        <SelectItem value="fastapi">FastAPI</SelectItem>
                        <SelectItem value="django">Django</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">AI Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {!modelsLoading && aiModels && aiModels.map((model: any) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center space-x-2">
                            <span>{model.name}</span>
                            {model.isOpenSource && (
                              <Badge variant="outline" className="text-xs">Open Source</Badge>
                            )}
                            {model.specialization === 'Medical Content Generation' && (
                              <Badge variant="default" className="text-xs">Recommended</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedModel && aiModels && (
                    <p className="text-xs text-muted-foreground">
                      {aiModels.find((m: any) => m.id === selectedModel)?.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Complexity Level</label>
                  <Select value={complexity} onValueChange={setComplexity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple - Basic functionality</SelectItem>
                      <SelectItem value="medium">Medium - Standard features</SelectItem>
                      <SelectItem value="complex">Complex - Advanced features</SelectItem>
                      <SelectItem value="enterprise">Enterprise - Full production ready</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleGenerateCode}
                  disabled={generateCodeMutation.isPending || isGenerating}
                >
                  {generateCodeMutation.isPending || isGenerating ? (
                    <>
                      <Cpu className="h-5 w-5 mr-2 animate-spin" />
                      Generating Code...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Code</CardTitle>
                <CardDescription>AI-generated healthcare-compliant code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedCode ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{selectedLanguage}</Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{generatedCode}</code>
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Generated code will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templatesLoading ? (
              [...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              codeTemplates?.map((template: any) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Wand2 className="h-5 w-5 text-blue-500" />
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge variant="secondary">{template.language}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FileCode className="h-4 w-4" />
                        <span className="text-sm">{template.linesOfCode} lines</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm">HIPAA Compliant</span>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="assistant" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>AI Coding Assistant</span>
                </CardTitle>
                <CardDescription>Get intelligent code suggestions and help</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Bot className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">AI Assistant</p>
                        <p className="text-sm text-muted-foreground">
                          I can help you with healthcare code, HIPAA compliance, medical algorithms, and best practices. What would you like to build?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Input placeholder="Ask about healthcare coding, FHIR integration, or compliance..." />
                  <Button>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Smart Suggestions</span>
                </CardTitle>
                <CardDescription>AI-powered code improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Security Enhancement</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add input sanitization to prevent SQL injection attacks
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Performance Optimization</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Consider using React.memo for patient list component
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">HIPAA Compliance</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add audit logging for patient data access
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {examplesLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              codeExamples?.map((example: any) => (
                <Card key={example.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <CardDescription>{example.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{example.language}</Badge>
                      <Badge variant="secondary">{example.useCase}</Badge>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 max-h-32 overflow-y-auto">
                      <pre className="text-green-400 text-xs">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Run
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}