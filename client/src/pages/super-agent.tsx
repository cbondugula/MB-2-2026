import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Mic, 
  MicOff, 
  Brain, 
  Zap, 
  Shield, 
  Workflow, 
  Code, 
  Stethoscope,
  TrendingUp,
  Globe,
  Sparkles,
  Activity,
  CheckCircle,
  Lightbulb
} from "lucide-react";

interface SuperAgentRequest {
  type: 'code-generation' | 'clinical-analysis' | 'compliance-check' | 'workflow-optimization' | 'voice-command';
  input: string;
  context?: {
    organizationType?: string;
    complianceNeeds?: string[];
    integrationNeeds?: string[];
    country?: string;
    language?: string;
  };
  capabilities?: string[];
}

interface SuperAgentResponse {
  success: boolean;
  result: any;
  confidence: number;
  executionTime: number;
  capabilities_used: string[];
  next_actions?: string[];
  compliance_status?: {
    hipaa: boolean;
    gdpr: boolean;
    other: string[];
  };
}

export default function SuperAgent() {
  const [requestType, setRequestType] = useState<SuperAgentRequest['type']>('code-generation');
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [organizationType, setOrganizationType] = useState('');
  const [country, setCountry] = useState('United States');
  const [response, setResponse] = useState<SuperAgentResponse | null>(null);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Fetch dynamic data for form fields
  const { data: organizationTypes = [] } = useQuery({
    queryKey: ['/api/organizations/types']
  });

  const { data: complianceOptions = [] } = useQuery({
    queryKey: ['/api/compliance/options']
  });

  const { data: integrationOptions = [] } = useQuery({
    queryKey: ['/api/integrations/options']
  });

  const superAgentMutation = useMutation({
    mutationFn: async (request: SuperAgentRequest) => {
      const response = await apiRequest('POST', '/api/super-agent/orchestrate', request);
      return response.json();
    },
    onSuccess: (data: SuperAgentResponse) => {
      setResponse(data);
      toast({
        title: "Super Agent Complete",
        description: `Analysis completed in ${data.executionTime}ms with ${(data.confidence * 100).toFixed(1)}% confidence`,
      });
    },
    onError: (error) => {
      toast({
        title: "Super Agent Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVoiceRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          // Convert audio to text and process
          processVoiceInput(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);
        toast({
          title: "Recording Started",
          description: "Speak your healthcare development request...",
        });
      } catch (error) {
        toast({
          title: "Recording Error",
          description: "Could not access microphone",
          variant: "destructive",
        });
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Processing your voice command...",
      });
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    // Process voice input through super agent
    setRequestType('voice-command');
    setInput("Voice command processing...");
    
    const request: SuperAgentRequest = {
      type: 'voice-command',
      input: audioBlob.toString(),
      context: {
        organizationType,
        country,
        complianceNeeds: complianceOptions.slice(0, 3),
        integrationNeeds: integrationOptions.slice(0, 3)
      }
    };
    
    superAgentMutation.mutate(request);
  };

  const handleSubmit = () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide input for the super agent",
        variant: "destructive",
      });
      return;
    }

    const request: SuperAgentRequest = {
      type: requestType,
      input,
      context: {
        organizationType,
        country,
        complianceNeeds: complianceOptions.slice(0, 5),
        integrationNeeds: integrationOptions.slice(0, 5)
      }
    };

    superAgentMutation.mutate(request);
  };

  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'code-generation': return <Code className="w-5 h-5" />;
      case 'clinical-analysis': return <Stethoscope className="w-5 h-5" />;
      case 'compliance-check': return <Shield className="w-5 h-5" />;
      case 'workflow-optimization': return <Workflow className="w-5 h-5" />;
      case 'voice-command': return <Mic className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">MedBuilder Super Agent</h1>
            <Sparkles className="w-8 h-8 text-yellow-400 ml-3" />
          </div>
          <p className="text-xl text-gray-300">
            AI-Powered Healthcare Development with Multi-Modal Intelligence
          </p>
          <div className="flex justify-center mt-4 space-x-2">
            <Badge variant="secondary">Multi-Modal AI</Badge>
            <Badge variant="secondary">Real-Time Analysis</Badge>
            <Badge variant="secondary">Global Compliance</Badge>
            <Badge variant="secondary">Voice Commands</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                Super Agent Input
              </CardTitle>
              <CardDescription>
                Describe your healthcare development needs using natural language or voice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Request Type Selection */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Request Type</label>
                <Select value={requestType} onValueChange={(value: any) => setRequestType(value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="code-generation" className="text-white hover:bg-gray-600">
                      <div className="flex items-center">
                        <Code className="w-4 h-4 mr-2" />
                        Code Generation
                      </div>
                    </SelectItem>
                    <SelectItem value="clinical-analysis" className="text-white hover:bg-gray-600">
                      <div className="flex items-center">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Clinical Analysis
                      </div>
                    </SelectItem>
                    <SelectItem value="compliance-check" className="text-white hover:bg-gray-600">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Compliance Check
                      </div>
                    </SelectItem>
                    <SelectItem value="workflow-optimization" className="text-white hover:bg-gray-600">
                      <div className="flex items-center">
                        <Workflow className="w-4 h-4 mr-2" />
                        Workflow Optimization
                      </div>
                    </SelectItem>
                    <SelectItem value="voice-command" className="text-white hover:bg-gray-600">
                      <div className="flex items-center">
                        <Mic className="w-4 h-4 mr-2" />
                        Voice Command
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Context Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Organization Type</label>
                  <Select value={organizationType} onValueChange={setOrganizationType}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {organizationTypes.map((type: string) => (
                        <SelectItem key={type} value={type} className="text-white hover:bg-gray-600">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Country</label>
                  <Input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="United States"
                  />
                </div>
              </div>

              {/* Input Methods */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Input</label>
                <div className="space-y-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white min-h-32"
                    placeholder={`Example: "Create a HIPAA-compliant patient portal with real-time chat, appointment scheduling, and medical record access for a multi-specialty clinic"`}
                  />
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handleVoiceRecording}
                      variant={isRecording ? "destructive" : "secondary"}
                      className="flex items-center"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-4 h-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Voice Input
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleSubmit}
                      disabled={superAgentMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {superAgentMutation.isPending ? (
                        <>
                          <Activity className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {getRequestIcon(requestType)}
                          <span className="ml-2">Execute Super Agent</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
                Super Agent Results
              </CardTitle>
              <CardDescription>
                AI analysis results with confidence scores and next actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-6">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    {response.confidence !== undefined && (
                      <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
                        <div className="text-green-400 text-sm font-medium">Confidence</div>
                        <div className="text-2xl font-bold text-white">
                          {(response.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    )}
                    {response.orchestrationPlan?.confidence && (
                      <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
                        <div className="text-green-400 text-sm font-medium">AI Confidence</div>
                        <div className="text-2xl font-bold text-white">
                          {response.orchestrationPlan.confidence}%
                        </div>
                      </div>
                    )}
                    {response.executionTime && (
                      <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
                        <div className="text-blue-400 text-sm font-medium">Execution Time</div>
                        <div className="text-2xl font-bold text-white">
                          {response.executionTime}ms
                        </div>
                      </div>
                    )}
                    {response.success !== undefined && (
                      <div className={`p-4 rounded-lg border ${response.success ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'}`}>
                        <div className={`text-sm font-medium ${response.success ? 'text-green-400' : 'text-red-400'}`}>Status</div>
                        <div className="text-2xl font-bold text-white">
                          {response.success ? 'Success' : 'Failed'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Capabilities Used */}
                  {response.capabilities_used && response.capabilities_used.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">AI Capabilities Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {response.capabilities_used.map((capability, index) => (
                          <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Active Agents (from orchestrateAI response) */}
                  {response.activeAgents && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">Active AI Agents</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(response.activeAgents).map(([name, agent]: [string, any]) => (
                          <div key={name} className="bg-blue-900/20 p-3 rounded-lg border border-blue-700">
                            <div className="text-blue-300 font-medium text-sm mb-1">{name}</div>
                            <div className="text-gray-400 text-xs mb-1">{agent.capability}</div>
                            <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                              {agent.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compliance Status */}
                  {response.compliance_status && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">Compliance Status</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-green-400" />
                          <span className="text-white">HIPAA: </span>
                          <Badge variant={response.compliance_status.hipaa ? "default" : "destructive"} className="ml-2">
                            {response.compliance_status.hipaa ? "Compliant" : "Issues"}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-green-400" />
                          <span className="text-white">GDPR: </span>
                          <Badge variant={response.compliance_status.gdpr ? "default" : "destructive"} className="ml-2">
                            {response.compliance_status.gdpr ? "Compliant" : "Issues"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results Display - Only show raw JSON if we don't have structured data */}
                  {!response.activeAgents && !response.nextSteps && !response.recommendations && response.result && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">Analysis Results</h3>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                        <pre className="text-gray-300 text-sm overflow-auto max-h-64">
                          {JSON.stringify(response.result, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Next Actions */}
                  {response.next_actions && response.next_actions.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">Recommended Next Actions</h3>
                      <ul className="space-y-2">
                        {response.next_actions.map((action, index) => (
                          <li key={index} className="flex items-center text-gray-300">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Next Steps (from orchestrateAI) */}
                  {response.nextSteps && response.nextSteps.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">Next Steps</h3>
                      <ul className="space-y-2">
                        {response.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Recommendations (from orchestrateAI) */}
                  {response.recommendations && response.recommendations.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">AI Recommendations</h3>
                      <ul className="space-y-2">
                        {response.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <Lightbulb className="w-5 h-5 mr-2 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* GENERATED CODE - Display when code generation is requested */}
                  {response.generatedCode && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold flex items-center">
                          <Code className="w-5 h-5 mr-2 text-green-400" />
                          Generated Code
                        </h3>
                        <div className="flex gap-2">
                          {response.language && (
                            <Badge className="bg-blue-600">{response.language}</Badge>
                          )}
                          {response.framework && (
                            <Badge variant="outline" className="text-blue-400 border-blue-400">{response.framework}</Badge>
                          )}
                        </div>
                      </div>
                      
                      {response.complianceRequirements && (
                        <div className="mb-3 flex items-center text-green-400 text-sm">
                          <Shield className="w-4 h-4 mr-2" />
                          <span>{response.complianceRequirements} Compliant Code</span>
                        </div>
                      )}
                      
                      <div className="bg-gray-900 p-4 rounded-lg border border-green-700 shadow-lg">
                        <pre className="text-green-300 text-sm overflow-auto max-h-96 font-mono">
                          {response.generatedCode}
                        </pre>
                      </div>
                      
                      {response.complianceNotes && response.complianceNotes.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-white text-sm font-medium mb-2">Code Features:</h4>
                          <div className="flex flex-wrap gap-2">
                            {response.complianceNotes.map((note, index) => (
                              <Badge key={index} variant="outline" className="text-green-400 border-green-400 text-xs">
                                {note}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Submit a request to see AI analysis results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Capabilities Overview */}
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Super Agent Capabilities - Built for 100M+ Applications</CardTitle>
            <CardDescription>
              Advanced AI capabilities for massive-scale healthcare development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Code className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Code Generation</h3>
                <p className="text-gray-400 text-sm">Production-ready healthcare apps</p>
                <p className="text-blue-400 text-xs mt-1">60+ Templates Available</p>
              </div>
              <div className="text-center">
                <Stethoscope className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Clinical Analysis</h3>
                <p className="text-gray-400 text-sm">Multi-modal medical AI</p>
                <p className="text-green-400 text-xs mt-1">9 Medical AI Models</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Compliance Check</h3>
                <p className="text-gray-400 text-sm">Global regulatory compliance</p>
                <p className="text-yellow-400 text-xs mt-1">193 Countries Covered</p>
              </div>
              <div className="text-center">
                <Workflow className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Workflow Optimization</h3>
                <p className="text-gray-400 text-sm">Predictive resource allocation</p>
                <p className="text-purple-400 text-xs mt-1">Enterprise AI Technology</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-green-900/30 p-6 rounded-lg border border-blue-700">
                <h4 className="text-white text-xl font-bold mb-2">🎯 100 Million Application Goal</h4>
                <p className="text-gray-300 mb-4">
                  Our Super Agent is engineered to enable the creation of 100 million healthcare applications. 
                  Every request you make contributes to solving global healthcare challenges at unprecedented scale.
                </p>
                <div className="flex justify-center space-x-4">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    Scalable Architecture
                  </Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Auto-Deployment
                  </Badge>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    Global Reach
                  </Badge>
                  <Badge variant="outline" className="text-purple-400 border-purple-400">
                    AI-Optimized
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}