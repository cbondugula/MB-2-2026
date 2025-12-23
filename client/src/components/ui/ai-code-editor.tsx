import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Sparkles, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Users,
  Bot,
  Code2,
  FileText,
  Bug,
  Lightbulb
} from "lucide-react";

interface AISuggestion {
  text: string;
  type: "completion" | "snippet" | "refactor";
  confidence: number;
  explanation?: string;
  isHealthcareSpecific?: boolean;
}

interface CodeAnalysis {
  score: number;
  findings: Array<{
    type: "error" | "warning" | "info" | "suggestion";
    message: string;
    line?: number;
    column?: number;
    severity: "high" | "medium" | "low";
    category: string;
    fix?: string;
  }>;
  recommendations: string[];
  complianceStatus?: {
    hipaa: number;
    accessibility: number;
    security: number;
  };
}

interface AICodeEditorProps {
  projectId: number;
  initialCode?: string;
  language?: string;
  fileName?: string;
  onCodeChange?: (code: string) => void;
}

export function AICodeEditor({ 
  projectId, 
  initialCode = "", 
  language = "typescript",
  fileName = "index.ts",
  onCodeChange 
}: AICodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });
  const [selectedText, setSelectedText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Real-time AI assistance
  const getSuggestions = useCallback(async () => {
    if (!code.trim() || isSuggestionsLoading) return;
    
    setIsSuggestionsLoading(true);
    try {
      const response = await apiRequest('/api/ai/code-completion', 'POST', {
        code,
        cursor: cursorPosition,
        filePath: fileName,
        language,
        context: { projectId, isHealthcare: true }
      });
      
      setSuggestions(response.suggestions || []);
    } catch (error) {
      console.error("AI suggestions error:", error);
    } finally {
      setIsSuggestionsLoading(false);
    }
  }, [code, cursorPosition, fileName, language, projectId, isSuggestionsLoading]);

  // Code analysis
  const analyzeCode = useCallback(async (analysisType: string = "security") => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await apiRequest('/api/ai/code-analysis', 'POST', {
        code,
        filePath: fileName,
        analysisType,
        projectId
      });
      
      setAnalysis(response);
    } catch (error) {
      console.error("Code analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, fileName, projectId, toast]);

  // Apply suggestion
  const applySuggestion = (suggestion: AISuggestion) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + suggestion.text + code.substring(end);
    
    setCode(newCode);
    onCodeChange?.(newCode);
    
    toast({
      title: "Suggestion Applied",
      description: suggestion.explanation || "AI suggestion has been applied to your code.",
    });
  };

  // Handle cursor position changes
  const handleCursorMove = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const pos = textarea.selectionStart;
    const lines = code.substring(0, pos).split('\n');
    setCursorPosition({
      line: lines.length - 1,
      column: lines[lines.length - 1].length
    });
  };

  // Handle text selection
  const handleTextSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setSelectedText(code.substring(start, end));
  };

  // Auto-suggest on typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code !== initialCode) {
        getSuggestions();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [code, getSuggestions, initialCode]);

  // Handle code changes
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-600 dark:text-red-400";
      case "medium": return "text-yellow-600 dark:text-yellow-400";
      case "low": return "text-blue-600 dark:text-blue-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return "text-[#76B900] dark:text-[#8CC63F]";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Main Editor */}
      <Card className="lg:col-span-2 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            AI-Powered Code Editor
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Smart
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full pb-6">
          <Textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onSelect={handleTextSelection}
            onMouseUp={handleCursorMove}
            onKeyUp={handleCursorMove}
            placeholder={`// Start typing your ${language} code here...
// AI will provide intelligent suggestions as you type

import { useState } from 'react';

function HealthcareComponent() {
  // Type here for AI assistance
}`}
            className="min-h-[500px] font-mono text-sm resize-none"
            style={{ 
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              lineHeight: '1.5'
            }}
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Button
                onClick={() => analyzeCode("security")}
                variant="outline"
                size="sm"
                disabled={isAnalyzing}
              >
                <Shield className="h-4 w-4 mr-1" />
                Security Check
              </Button>
              <Button
                onClick={() => analyzeCode("hipaa")}
                variant="outline"
                size="sm"
                disabled={isAnalyzing}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                HIPAA Compliance
              </Button>
              <Button
                onClick={() => analyzeCode("performance")}
                variant="outline"
                size="sm"
                disabled={isAnalyzing}
              >
                <Zap className="h-4 w-4 mr-1" />
                Performance
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Line {cursorPosition.line + 1}, Column {cursorPosition.column + 1}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Panel */}
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <Tabs defaultValue="suggestions" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="suggestions">
                <Lightbulb className="h-4 w-4 mr-1" />
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <Bug className="h-4 w-4 mr-1" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="collaboration">
                <Users className="h-4 w-4 mr-1" />
                Team
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="mt-4">
              <ScrollArea className="h-[400px]">
                {isSuggestionsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <Card key={index} className="p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <Badge 
                            variant={suggestion.isHealthcareSpecific ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {suggestion.type}
                            {suggestion.isHealthcareSpecific && (
                              <Sparkles className="h-3 w-3 ml-1" />
                            )}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {suggestion.confidence}% confidence
                          </div>
                        </div>
                        
                        <pre className="text-xs bg-muted p-2 rounded mb-2 overflow-x-auto">
                          <code>{suggestion.text}</code>
                        </pre>
                        
                        {suggestion.explanation && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {suggestion.explanation}
                          </p>
                        )}
                        
                        <Button
                          onClick={() => applySuggestion(suggestion)}
                          size="sm"
                          className="w-full"
                        >
                          Apply Suggestion
                        </Button>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    Start typing to get AI suggestions
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="analysis" className="mt-4">
              <ScrollArea className="h-[400px]">
                {isAnalyzing ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : analysis ? (
                  <div className="space-y-4">
                    {/* Compliance Scores */}
                    {analysis.complianceStatus && (
                      <Card className="p-3">
                        <h4 className="font-medium mb-2">Compliance Status</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">HIPAA:</span>
                            <span className={`text-sm font-medium ${getComplianceColor(analysis.complianceStatus.hipaa)}`}>
                              {analysis.complianceStatus.hipaa}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Security:</span>
                            <span className={`text-sm font-medium ${getComplianceColor(analysis.complianceStatus.security)}`}>
                              {analysis.complianceStatus.security}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Accessibility:</span>
                            <span className={`text-sm font-medium ${getComplianceColor(analysis.complianceStatus.accessibility)}`}>
                              {analysis.complianceStatus.accessibility}%
                            </span>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Findings */}
                    <div className="space-y-2">
                      {analysis.findings.map((finding, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex items-start gap-2">
                            {finding.type === "error" && <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />}
                            {finding.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                            {finding.type === "info" && <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />}
                            {finding.type === "suggestion" && <Lightbulb className="h-4 w-4 text-[#76B900] mt-0.5" />}
                            
                            <div className="flex-1">
                              <p className="text-sm font-medium">{finding.message}</p>
                              {finding.line && (
                                <p className="text-xs text-muted-foreground">
                                  Line {finding.line}
                                </p>
                              )}
                              {finding.fix && (
                                <p className="text-xs bg-muted p-2 rounded mt-1">
                                  Fix: {finding.fix}
                                </p>
                              )}
                            </div>
                            
                            <Badge 
                              variant="outline" 
                              className={getSeverityColor(finding.severity)}
                            >
                              {finding.severity}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Recommendations */}
                    {analysis.recommendations.length > 0 && (
                      <Card className="p-3">
                        <h4 className="font-medium mb-2">Recommendations</h4>
                        <ul className="text-sm space-y-1">
                          {analysis.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-[#76B900] mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    Click an analysis button to get insights
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="collaboration" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="text-center p-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Real-time collaboration features</p>
                  <p className="text-xs mt-1">See team members' cursors and edits in real-time</p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}