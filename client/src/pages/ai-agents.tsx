import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Bot, 
  Brain, 
  Download, 
  Monitor, 
  Cloud, 
  Shield, 
  Cpu, 
  HardDrive,
  Wifi,
  WifiOff,
  Play,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Stethoscope,
  Activity,
  Heart,
  Eye,
  Database,
  Globe
} from 'lucide-react';

interface HealthcareAgent {
  id: string;
  name: string;
  category: string;
  specialty: string[];
  description: string;
  capabilities: string[];
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  deploymentType: string;
  languages: string[];
  complianceLevel: string[];
}

interface OllamaModel {
  name: string;
  healthcareSpecialty: string[];
  modelSize: string;
  requiredRAM: string;
  downloadSize: string;
  compliance: string[];
  languages: string[];
}

export default function AIAgents() {
  const [selectedAgentType, setSelectedAgentType] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [useLocalModels, setUseLocalModels] = useState(true);
  const [customRequirements, setCustomRequirements] = useState('');
  const [isGeneratingAgent, setIsGeneratingAgent] = useState(false);
  const [selectedModel, setSelectedModel] = useState('medalpaca');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Ollama status
  const { data: ollamaStatus, isLoading: ollamaLoading } = useQuery({
    queryKey: ['/api/ai/ollama/status'],
    retry: false,
  });

  const agentCategories = [
    {
      id: 'clinical-decision-support',
      name: 'Clinical Decision Support',
      icon: Stethoscope,
      description: 'AI agents for diagnostic assistance and treatment recommendations',
      examples: ['Diagnosis Assistant', 'Treatment Planner', 'Drug Interaction Checker']
    },
    {
      id: 'patient-monitoring',
      name: 'Patient Monitoring',
      icon: Activity,
      description: 'Real-time patient monitoring and early warning systems',
      examples: ['ICU Monitor', 'Vital Signs Analyzer', 'Risk Assessment']
    },
    {
      id: 'medical-imaging',
      name: 'Medical Imaging',
      icon: Eye,
      description: 'AI for radiology, pathology, and medical image analysis',
      examples: ['Radiology Assistant', 'Pathology Analyzer', 'DICOM Processor']
    },
    {
      id: 'mental-health',
      name: 'Mental Health',
      icon: Brain,
      description: 'Mental health screening, therapy support, and wellness coaching',
      examples: ['Therapy Assistant', 'Crisis Support', 'Wellness Coach']
    },
    {
      id: 'drug-discovery',
      name: 'Drug Discovery',
      icon: Database,
      description: 'Pharmaceutical research and drug development acceleration',
      examples: ['Molecule Designer', 'Clinical Trial Optimizer', 'Toxicity Predictor']
    },
    {
      id: 'telemedicine',
      name: 'Telemedicine',
      icon: Globe,
      description: 'Virtual care, triage, and remote patient management',
      examples: ['Virtual Triage', 'Remote Monitoring', 'Telehealth Assistant']
    }
  ];

  const medicalSpecialties = [
    'Internal Medicine', 'Family Medicine', 'Emergency Medicine', 'Cardiology',
    'Oncology', 'Neurology', 'Psychiatry', 'Radiology', 'Pathology',
    'Surgery', 'Pediatrics', 'Obstetrics & Gynecology', 'Dermatology',
    'Orthopedics', 'Anesthesiology', 'Critical Care', 'Pharmacy',
    'Laboratory Medicine', 'Infectious Diseases', 'Endocrinology'
  ];

  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'it', name: 'Italian' }
  ];

  // Generate healthcare agent mutation
  const generateAgentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/ai/generate-healthcare-agent', data);
    },
    onSuccess: () => {
      toast({
        title: "Healthcare Agent Generated",
        description: "Your AI agent has been successfully created and deployed"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate healthcare agent",
        variant: "destructive"
      });
    }
  });

  const generateHealthcareAgent = async () => {
    if (!selectedAgentType || selectedSpecialties.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select an agent type and at least one medical specialty",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAgent(true);
    try {
      const requirements = {
        languages: selectedLanguages,
        customRequirements,
        model: selectedModel,
        privacy: useLocalModels ? 'local-first' : 'cloud',
        compliance: ['HIPAA', 'GDPR', 'FDA']
      };

      await generateAgentMutation.mutateAsync({
        agentType: selectedAgentType,
        specialty: selectedSpecialties,
        requirements,
        useLocal: useLocalModels
      });
    } catch (error) {
      console.error('Agent generation error:', error);
    } finally {
      setIsGeneratingAgent(false);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const toggleLanguage = (languageCode: string) => {
    setSelectedLanguages(prev =>
      prev.includes(languageCode)
        ? prev.filter(l => l !== languageCode)
        : [...prev, languageCode]
    );
  };

  const getDeploymentIcon = (isLocal: boolean) => {
    return isLocal ? <Monitor className="h-4 w-4 text-[#76B900]" /> : <Cloud className="h-4 w-4 text-blue-500" />;
  };

  const getConnectionStatus = () => {
    if (ollamaLoading) return <Activity className="h-4 w-4 animate-spin" />;
    return ollamaStatus?.available ? 
      <Wifi className="h-4 w-4 text-[#76B900]" /> : 
      <WifiOff className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Healthcare AI Agents</h1>
          <p className="text-muted-foreground">
            Generate any healthcare AI agent with local Ollama or cloud deployment
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getConnectionStatus()}
            <span className="text-sm">
              {ollamaStatus?.available ? 'Local AI Available' : 'Cloud Only'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-blue-500" />
            <span className="text-sm font-medium">500+ Agent Types</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Agent Generator</TabsTrigger>
          <TabsTrigger value="local-models">Local Models</TabsTrigger>
          <TabsTrigger value="gallery">Agent Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Configuration */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Configuration</CardTitle>
                  <CardDescription>
                    Configure your healthcare AI agent specifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="agent-type">Agent Category</Label>
                    <Select value={selectedAgentType} onValueChange={setSelectedAgentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent category" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Medical Specialties ({selectedSpecialties.length} selected)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                      {medicalSpecialties.map(specialty => (
                        <div
                          key={specialty}
                          className={`p-2 border rounded cursor-pointer text-sm transition-colors ${
                            selectedSpecialties.includes(specialty)
                              ? 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => toggleSpecialty(specialty)}
                        >
                          {specialty}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Languages ({selectedLanguages.length} selected)</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {supportedLanguages.map(language => (
                        <div
                          key={language.code}
                          className={`p-2 border rounded cursor-pointer text-sm transition-colors ${
                            selectedLanguages.includes(language.code)
                              ? 'bg-[#76B900]100 dark:bg-[#1a3d00] border-[#76B900]200 dark:border-[#5a8f00] text-[#1a3d00] dark:text-[#76B900]100'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => toggleLanguage(language.code)}
                        >
                          {language.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="custom-requirements">Custom Requirements</Label>
                    <Textarea
                      id="custom-requirements"
                      placeholder="Describe any specific requirements for your healthcare agent..."
                      value={customRequirements}
                      onChange={(e) => setCustomRequirements(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deployment Configuration */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Configuration</CardTitle>
                  <CardDescription>
                    Choose deployment options and AI model preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Local AI Models (Ollama)</Label>
                      <p className="text-sm text-muted-foreground">
                        Use local models for enhanced privacy and compliance
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getDeploymentIcon(useLocalModels)}
                      <Switch
                        checked={useLocalModels}
                        onCheckedChange={setUseLocalModels}
                        disabled={!ollamaStatus?.available}
                      />
                    </div>
                  </div>

                  {useLocalModels && ollamaStatus?.available && (
                    <div>
                      <Label htmlFor="model-selection">Preferred Local Model</Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select local model" />
                        </SelectTrigger>
                        <SelectContent>
                          {ollamaStatus?.healthcareModels?.map((model: OllamaModel) => (
                            <SelectItem key={model.name} value={model.name}>
                              <div className="flex items-center space-x-2">
                                <span>{model.name}</span>
                                <Badge variant="outline">{model.modelSize}</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="p-4 bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <h4 className="font-medium mb-2">Deployment Benefits</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-[#76B900]" />
                        <span>{useLocalModels ? 'Maximum privacy (local processing)' : 'Cloud scalability'}</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-[#76B900]" />
                        <span>{useLocalModels ? 'HIPAA compliant by design' : 'Latest AI capabilities'}</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-[#76B900]" />
                        <span>{useLocalModels ? 'No data leaves your environment' : 'Automatic scaling'}</span>
                      </li>
                    </ul>
                  </div>

                  <Button 
                    onClick={generateHealthcareAgent}
                    disabled={isGeneratingAgent || !selectedAgentType || selectedSpecialties.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    {isGeneratingAgent ? "Generating Healthcare Agent..." : "Generate Healthcare Agent"}
                  </Button>
                </CardContent>
              </Card>

              {selectedAgentType && (
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {agentCategories.find(c => c.id === selectedAgentType) && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          {React.createElement(
                            agentCategories.find(c => c.id === selectedAgentType)!.icon,
                            { className: "h-5 w-5 text-blue-500" }
                          )}
                          <h4 className="font-medium">
                            {agentCategories.find(c => c.id === selectedAgentType)!.name}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {agentCategories.find(c => c.id === selectedAgentType)!.description}
                        </p>
                        <div>
                          <p className="text-sm font-medium mb-2">Example Agents:</p>
                          <div className="flex flex-wrap gap-2">
                            {agentCategories.find(c => c.id === selectedAgentType)!.examples.map(example => (
                              <Badge key={example} variant="outline">{example}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="local-models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Ollama Local AI Models</span>
                {getConnectionStatus()}
              </CardTitle>
              <CardDescription>
                Healthcare-optimized AI models for local deployment with enhanced privacy
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ollamaLoading ? (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 mx-auto mb-4 animate-spin" />
                  <p>Checking Ollama status...</p>
                </div>
              ) : ollamaStatus?.available ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ollamaStatus.healthcareModels?.map((model: OllamaModel) => (
                      <Card key={model.name} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{model.name}</CardTitle>
                            <Badge>{model.modelSize}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center space-x-1">
                              <HardDrive className="h-3 w-3" />
                              <span>{model.requiredRAM}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Download className="h-3 w-3" />
                              <span>{model.downloadSize}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium mb-1">Specialties:</p>
                            <div className="flex flex-wrap gap-1">
                              {model.specialty?.slice(0, 2).map((spec: string) => (
                                <Badge key={spec} variant="outline" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                              {model.specialty?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{model.specialty.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium mb-1">Compliance:</p>
                            <div className="flex flex-wrap gap-1">
                              {model.compliance?.map((comp: string) => (
                                <Badge key={comp} variant="secondary" className="text-xs">
                                  {comp}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-3 w-3 mr-1" />
                            Install Model
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-[#76B900]100 dark:bg-[#1a3d00] border border-[#76B900]200 dark:border-[#5a8f00] rounded-lg">
                    <h4 className="font-medium text-[#1a3d00] dark:text-[#76B900]100 mb-2">
                      Ollama Connected Successfully
                    </h4>
                    <p className="text-sm text-[#5a8f00] dark:text-[#76B900]200">
                      Local AI models are available for maximum privacy and HIPAA compliance. 
                      All processing happens on your local infrastructure.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <WifiOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Ollama Not Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Install and start Ollama to use local AI models for enhanced privacy
                  </p>
                  <div className="bg-warning-yellow-50 dark:bg-warning-yellow-50 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg text-left">
                    <h4 className="font-medium mb-2">Setup Instructions:</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Install Ollama from https://ollama.ai</li>
                      <li>Start Ollama service: <code className="bg-gray-100 px-1 rounded">ollama serve</code></li>
                      <li>Pull a healthcare model: <code className="bg-gray-100 px-1 rounded">ollama pull medalpaca</code></li>
                      <li>Refresh this page to connect</li>
                    </ol>
                  </div>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    <Activity className="h-4 w-4 mr-2" />
                    Check Connection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentCategories.map(category => (
              <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <category.icon className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Example Agents:</p>
                    <div className="space-y-1">
                      {category.examples.map(example => (
                        <div key={example} className="flex items-center space-x-2 text-sm">
                          <Bot className="h-3 w-3 text-gray-400" />
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => setSelectedAgentType(category.id)}
                  >
                    Generate Agent
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}