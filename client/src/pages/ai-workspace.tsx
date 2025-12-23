import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Brain, Code, Shield, Zap, FileCode, Users, BarChart3, Lightbulb, ArrowLeft } from 'lucide-react';
import { useLocation, Link } from 'wouter';

interface AIAnalysisResult {
  score: number;
  issues: Array<{
    severity: string;
    category: string;
    description: string;
    solution: string;
    healthcareSpecific: boolean;
  }>;
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    implementation: string;
    priority: string;
  }>;
  compliance: Array<{
    requirement: string;
    status: string;
    details: string;
  }>;
  summary: string;
  confidence: number;
}

interface CodeSuggestion {
  text: string;
  description: string;
  type: string;
  confidence: number;
  healthcareSpecific: boolean;
}

export default function AIWorkspace() {
  const [, setLocation] = useLocation();
  const [selectedDomain, setSelectedDomain] = useState("clinical");
  const [codeInput, setCodeInput] = useState("");
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const healthcareDomains = [
    { value: "clinical", label: "Clinical Care & EHR" },
    { value: "research", label: "Medical Research" },
    { value: "pharma", label: "Pharmaceutical" },
    { value: "telehealth", label: "Telehealth" },
    { value: "medtech", label: "Medical Devices" },
    { value: "admin", label: "Healthcare Admin" }
  ];

  const analyzeCode = async () => {
    if (!codeInput.trim()) {
      toast({
        title: "No code to analyze",
        description: "Please enter some code first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: "code-review",
          code: codeInput,
          domain: selectedDomain,
          context: "AI Workspace analysis"
        })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      setAnalysis(result);
      
      toast({
        title: "Code Analysis Complete",
        description: `Analysis score: ${result.score}/100`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCodeCompletion = async () => {
    if (!codeInput.trim()) return;

    try {
      const response = await fetch('/api/ai/code-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeInput,
          language: "typescript",
          context: "AI Workspace",
          healthcareDomain: selectedDomain,
          cursor: { line: codeInput.split('\n').length }
        })
      });

      if (!response.ok) throw new Error('Code completion failed');

      const result = await response.json();
      setSuggestions(result.suggestions || []);
    } catch (error) {
      console.error('Code completion error:', error);
    }
  };

  const generateHealthcareCode = async (template: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-medical-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          domain: selectedDomain,
          requirements: {
            compliance: ["HIPAA", "FDA", "GDPR"],
            features: ["authentication", "audit-logging", "encryption", "clinical-safety"],
            aiModels: ["Med-Gemma", "ClinicalBERT"]
          }
        })
      });

      if (!response.ok) throw new Error('Code generation failed');

      const result = await response.json();
      if (result.code) {
        setCodeInput(result.code);
        toast({
          title: "Medical Code Generated",
          description: `Generated ${template} with Med-Gemma for ${selectedDomain} domain`
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate medical code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeMedicalText = async (text: string, analysisType: string = "medical-ner") => {
    try {
      const response = await fetch('/api/ai/bert-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          analysisType,
          model: "clinicalbert"
        })
      });

      if (!response.ok) throw new Error('BERT analysis failed');

      const result = await response.json();
      toast({
        title: "Healthcare BERT Analysis Complete",
        description: `Analyzed medical text with ${result.model}`
      });
      
      return result;
    } catch (error) {
      toast({
        title: "BERT Analysis Failed",
        description: "Failed to analyze with healthcare BERT models",
        variant: "destructive"
      });
    }
  };

  // Real-time code completion
  useEffect(() => {
    const timer = setTimeout(() => {
      if (codeInput.trim()) {
        getCodeCompletion();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [codeInput, selectedDomain]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-[#76B900]';
      default: return 'bg-gray-500';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-[#76B900]';
      case 'non-compliant': return 'bg-red-500';
      case 'partially-compliant': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation('/')}
            className="bg-gray-900 border-gray-800 text-gray-200 hover:bg-gray-800 hover:text-white"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">AI Development Workspace</h1>
            <p className="text-muted-foreground">
              Highest-level AI assistance for healthcare and life sciences development
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-blue-500" />
          <span className="text-sm font-medium">GPT-4o Powered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Input Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Healthcare Code Editor</span>
              </CardTitle>
              <CardDescription>
                Write your healthcare application code with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select healthcare domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {healthcareDomains.map(domain => (
                      <SelectItem key={domain.value} value={domain.value}>
                        {domain.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={analyzeCode} 
                  disabled={isAnalyzing}
                  className="flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>{isAnalyzing ? "Analyzing..." : "Analyze Code"}</span>
                </Button>
              </div>

              <Textarea
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder={`// Enter your ${selectedDomain} healthcare code here
// AI will provide real-time suggestions and HIPAA compliance checks

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  medicalRecordNumber: string;
}`}
                className="min-h-[400px] font-mono text-sm"
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateHealthcareCode("patient-model")}
                  disabled={isGenerating}
                >
                  <FileCode className="h-4 w-4 mr-2" />
                  Patient Model
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateHealthcareCode("hipaa-auth")}
                  disabled={isGenerating}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  HIPAA Auth
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateHealthcareCode("fhir-integration")}
                  disabled={isGenerating}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  FHIR Integration
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/bert-analysis'}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Healthcare BERT
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>AI Code Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => setCodeInput(codeInput + "\n" + suggestion.text)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{suggestion.description}</span>
                        <div className="flex items-center space-x-2">
                          {suggestion.healthcareSpecific && (
                            <Badge variant="secondary">Healthcare</Badge>
                          )}
                          <Badge variant="outline">{Math.round(suggestion.confidence * 100)}%</Badge>
                        </div>
                      </div>
                      <code className="text-sm text-gray-600 block mt-1">
                        {suggestion.text.substring(0, 100)}...
                      </code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analysis Results */}
        <div className="space-y-4">
          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>AI Analysis Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Code Quality Score</span>
                        <span className="font-bold">{analysis.score}/100</span>
                      </div>
                      <Progress value={analysis.score} className="w-full" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>AI Confidence</span>
                        <span className="font-bold">{Math.round(analysis.confidence * 100)}%</span>
                      </div>
                      <Progress value={analysis.confidence * 100} className="w-full" />
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{analysis.summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 border rounded">
                        <div className="text-lg font-bold text-red-500">
                          {analysis.issues.filter(i => i.severity === 'critical' || i.severity === 'high').length}
                        </div>
                        <div className="text-xs text-gray-600">Critical/High Issues</div>
                      </div>
                      <div className="text-center p-2 border rounded">
                        <div className="text-lg font-bold text-blue-500">
                          {analysis.recommendations.length}
                        </div>
                        <div className="text-xs text-gray-600">Recommendations</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="issues" className="space-y-2">
                    {analysis.issues.map((issue, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          {issue.healthcareSpecific && (
                            <Badge variant="outline">Healthcare Specific</Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{issue.description}</p>
                        <p className="text-xs text-gray-600">{issue.solution}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="compliance" className="space-y-2">
                    {analysis.compliance.map((comp, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{comp.requirement}</span>
                          <Badge className={getComplianceColor(comp.status)}>
                            {comp.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{comp.details}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>AI Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => generateHealthcareCode("architecture-review")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Architecture Review
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => generateHealthcareCode("security-audit")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Security Audit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => generateHealthcareCode("compliance-check")}
              >
                <FileCode className="h-4 w-4 mr-2" />
                Compliance Check
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}