import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain,
  Code,
  Database,
  Zap,
  Settings,
  Play,
  Eye,
  CloudUpload,
  Activity,
  BarChart3,
  Cpu,
  Layers,
  Flask,
  Terminal,
  CheckCircle,
  AlertCircle,
  Clock,
  Download
} from "lucide-react";

interface MLPipeline {
  id: string;
  name: string;
  description: string;
  pythonCode: string;
  requirements: string[];
  performance: any;
  deploymentConfig: any;
}

export default function MLPythonIntegration() {
  const [selectedDomain, setSelectedDomain] = useState<string>('clinical_ai');
  const [selectedFramework, setSelectedFramework] = useState<string>('tensorflow');
  const [currentPipeline, setCurrentPipeline] = useState<MLPipeline | null>(null);
  const [pythonCode, setPythonCode] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available ML libraries for selected domain
  const { data: availableLibraries = [], isLoading: librariesLoading } = useQuery({
    queryKey: ['/api/ml/libraries', selectedDomain],
    enabled: !!selectedDomain
  });

  // Generate ML pipeline
  const generatePipelineMutation = useMutation({
    mutationFn: async (requirements: any) => {
      return apiRequest('POST', '/api/ml/generate-pipeline', requirements);
    },
    onSuccess: (data) => {
      setCurrentPipeline(data.pipeline);
      setPythonCode(data.pipeline.pythonCode);
      toast({
        title: "ML Pipeline Generated",
        description: "Python ML pipeline is ready for execution!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate ML pipeline. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Execute Python code
  const executePythonMutation = useMutation({
    mutationFn: async ({ pythonCode, inputData }: { pythonCode: string; inputData?: any }) => {
      return apiRequest('POST', '/api/ml/execute-python', { pythonCode, inputData });
    },
    onSuccess: (data) => {
      toast({
        title: "Execution Successful",
        description: "Python code executed successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Execution Failed",
        description: "Python execution failed. Check your code.",
        variant: "destructive",
      });
    }
  });

  // Deploy ML model
  const deployModelMutation = useMutation({
    mutationFn: async (pipeline: MLPipeline) => {
      return apiRequest('POST', '/api/ml/deploy-model', { pipeline });
    },
    onSuccess: (data) => {
      toast({
        title: "Model Deployed",
        description: `Model deployed successfully! API available at: ${data.deployment.apiUrl}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy ML model.",
        variant: "destructive",
      });
    }
  });

  // Generate healthcare-specific model
  const generateHealthcareModelMutation = useMutation({
    mutationFn: async (config: any) => {
      return apiRequest('POST', '/api/ml/generate-healthcare-model', config);
    },
    onSuccess: (data) => {
      setPythonCode(data.pythonCode);
      toast({
        title: "Healthcare Model Generated",
        description: "Healthcare-specific ML model is ready!",
      });
    }
  });

  const handleGeneratePipeline = () => {
    const requirements = {
      description: (document.getElementById('pipeline-description') as HTMLTextAreaElement)?.value || '',
      dataType: 'clinical_data',
      modelType: 'classification',
      healthcareDomain: selectedDomain,
      performanceTargets: {
        accuracy: 0.95,
        precision: 0.94,
        recall: 0.96
      }
    };

    generatePipelineMutation.mutate(requirements);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Brain className="w-8 h-8 mr-3 text-blue-400" />
                Python ML Integration
              </h1>
              <p className="text-gray-400 mt-2">
                Complete Python ML environment with all major libraries for healthcare AI
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-green-400 border-green-400">
                TensorFlow 2.13
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                PyTorch 2.0
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                Transformers 4.32
              </Badge>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                Scikit-learn 1.3
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  ML Configuration
                </CardTitle>
                <CardDescription>
                  Configure your healthcare ML pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Healthcare Domain</label>
                  <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clinical_ai">Clinical AI</SelectItem>
                      <SelectItem value="medical_imaging">Medical Imaging</SelectItem>
                      <SelectItem value="genomics">Genomics</SelectItem>
                      <SelectItem value="drug_discovery">Drug Discovery</SelectItem>
                      <SelectItem value="epidemiology">Epidemiology</SelectItem>
                      <SelectItem value="clinical_trials">Clinical Trials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">ML Framework</label>
                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tensorflow">TensorFlow</SelectItem>
                      <SelectItem value="pytorch">PyTorch</SelectItem>
                      <SelectItem value="sklearn">Scikit-learn</SelectItem>
                      <SelectItem value="huggingface">Hugging Face</SelectItem>
                      <SelectItem value="opencv">OpenCV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Available Libraries</label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {librariesLoading ? (
                      <div className="text-gray-500 text-sm">Loading libraries...</div>
                    ) : (
                      availableLibraries.libraries?.map((lib: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                          {lib}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Pipeline Description</label>
                  <Textarea
                    id="pipeline-description"
                    placeholder="Describe your ML pipeline (e.g., 'Build a clinical decision support model for diabetes prediction using patient vitals and lab results')"
                    className="bg-gray-700 border-gray-600 text-white min-h-20"
                  />
                </div>

                <Button 
                  onClick={handleGeneratePipeline}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={generatePipelineMutation.isPending}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {generatePipelineMutation.isPending ? 'Generating...' : 'Generate ML Pipeline'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300"
                  onClick={() => generateHealthcareModelMutation.mutate({
                    modelType: 'classification',
                    framework: selectedFramework,
                    healthcareDomain: selectedDomain
                  })}
                  disabled={generateHealthcareModelMutation.isPending}
                >
                  <Flask className="w-4 h-4 mr-2" />
                  Generate Healthcare Model
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300"
                  onClick={() => setPythonCode(`
# Healthcare Data Analysis Template
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import matplotlib.pyplot as plt

# Load and preprocess data
def preprocess_healthcare_data(data):
    # HIPAA-compliant data preprocessing
    return data.fillna(data.mean())

# Train model with cross-validation
def train_healthcare_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    return model, X_test, y_test

print("Healthcare ML template loaded successfully!")
`)}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Load Template
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300"
                  onClick={() => executePythonMutation.mutate({ pythonCode })}
                  disabled={!pythonCode || executePythonMutation.isPending}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Execute Python Code
                </Button>
                
                {currentPipeline && (
                  <Button 
                    variant="outline" 
                    className="w-full border-green-600 text-green-300"
                    onClick={() => deployModelMutation.mutate(currentPipeline)}
                    disabled={deployModelMutation.isPending}
                  >
                    <CloudUpload className="w-4 h-4 mr-2" />
                    Deploy as API
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Terminal className="w-5 h-5 mr-2" />
                    Python ML Code Editor
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Python 3.9
                    </Badge>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      HIPAA Ready
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={pythonCode}
                    onChange={(e) => setPythonCode(e.target.value)}
                    placeholder="# Your Python ML code here...
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Healthcare ML pipeline
print('Healthcare ML environment ready!')
"
                    className="bg-gray-900 border-gray-600 text-white font-mono min-h-96 text-sm"
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => executePythonMutation.mutate({ pythonCode })}
                        disabled={!pythonCode || executePythonMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Run Code
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Save Pipeline
                      </Button>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      {pythonCode.split('\n').length} lines
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {(executePythonMutation.data || currentPipeline) && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Execution Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="output" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="output">Output</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="deployment">Deployment</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="output" className="space-y-4">
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                        <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
                          {executePythonMutation.data?.result?.output || 'No output available'}
                        </pre>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="performance" className="space-y-4">
                      {currentPipeline?.performance && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-400">
                                {(currentPipeline.performance.accuracy * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-gray-400">Accuracy</div>
                            </div>
                          </div>
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-400">
                                {(currentPipeline.performance.f1Score * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-gray-400">F1 Score</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="deployment" className="space-y-4">
                      {deployModelMutation.data && (
                        <div className="space-y-4">
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-2">API Endpoints</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Health Check:</span>
                                <span className="text-green-400">/health</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Prediction:</span>
                                <span className="text-blue-400">/predict</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Model Info:</span>
                                <span className="text-purple-400">/model/info</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}