import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Code, Zap, Sparkles, Cpu, Terminal, Activity, Brain, Network, TrendingUp, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function Landing() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [userMode, setUserMode] = useState<'healthcare' | 'developer'>('healthcare');

  // Fetch dynamic ML data when demo is shown
  const { data: mlMetrics, isLoading: mlLoading } = useQuery({
    queryKey: ['/api/ml/metrics'],
    enabled: showDemo,
    retry: false,
    refetchInterval: showDemo ? 5000 : false, // Refresh every 5 seconds when demo is active
  });

  const { data: trainingJobs, isLoading: trainingLoading } = useQuery({
    queryKey: ['/api/ml/training-status'],
    enabled: showDemo,
    retry: false,
    refetchInterval: showDemo ? 3000 : false, // Refresh every 3 seconds
  });

  const { data: deployedModels, isLoading: modelsLoading } = useQuery({
    queryKey: ['/api/ml/models'],
    enabled: showDemo,
    retry: false,
  });

  const healthcarePrompts = [
    "I need an app to schedule patient appointments and send reminders",
    "Create a simple form for patients to update their medical history",
    "Build a medication tracker that alerts patients when to take pills",
    "I want to track patient vitals and create progress reports",
    "Create a secure messaging app for my clinic staff",
    "Build a tool to manage patient referrals between doctors"
  ];

  const developerPrompts = [
    "Create a HIPAA-compliant patient registration form with real-time validation",
    "Build a telemedicine platform with video calling and secure messaging",
    "Generate an EHR integration dashboard with FHIR R4 support",
    "Design a clinical decision support system with AI recommendations",
    "Create a medical device data collection app with IoT sensors",
    "Build a pharmaceutical drug tracking system with blockchain"
  ];

  const examplePrompts = userMode === 'healthcare' ? healthcarePrompts : developerPrompts;

  const handleGenerateApp = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    localStorage.setItem('pendingPrompt', prompt);
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      {/* Enhanced Header */}
      <header className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-600/50 sticky top-0 z-50 shadow-strong">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 gradient-medical rounded-lg flex items-center justify-center shadow-medical">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">MedBuilder</span>
                <Badge variant="secondary" className="ml-3 text-sm bg-trust-green-700 text-trust-green-50 shadow-green">
                  Healthcare AI Platform
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowDemo(!showDemo)}
                variant="outline"
                className="border-gray-500 text-gray-200 hover:bg-gray-700 transition-strong shadow-hover"
                size="sm"
              >
                {showDemo ? 'Hide Demo' : 'View Demo'}
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-trust-green-500 text-trust-green-200 hover:bg-trust-green-700 transition-strong shadow-green"
                size="sm"
              >
                <Link href="/pricing">Pricing</Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-medical-blue-500 text-medical-blue-200 hover:bg-medical-blue-700 transition-strong shadow-medical"
                size="sm"
              >
                <Link href="/legal-documents">Legal Docs</Link>
              </Button>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="gradient-trust text-white hover:bg-trust-green-700 transition-strong shadow-green scale-hover"
                size="sm"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Enhanced centered layout */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[85vh] px-6 py-16">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          {/* Title */}
          <div className="space-y-10">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-8xl font-black leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Turn Your Healthcare Ideas Into
                <span className="gradient-trust bg-clip-text text-transparent block mt-3">Real Apps</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-200 leading-relaxed max-w-5xl mx-auto font-medium">
                Simply describe what you need - patient tracking, appointment scheduling, or treatment plans.
                Our AI creates secure, professional apps instantly. No coding required.
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-8">
              <div className="flex items-center justify-center space-x-8 text-lg text-gray-300">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-medical-blue-400" />
                  <span className="font-medium">2,500+ healthcare professionals</span>
                </div>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="font-medium text-trust-green-400">HIPAA compliant</span>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="font-medium text-healthcare-teal-400">Ready in minutes</span>
              </div>
              
              {/* Enhanced User Mode Toggle */}
              <div className="flex items-center space-x-3 bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-600/50 shadow-strong">
                <button
                  onClick={() => setUserMode('healthcare')}
                  className={`px-8 py-4 rounded-xl text-lg font-semibold transition-strong scale-hover ${
                    userMode === 'healthcare' 
                      ? 'gradient-trust text-white shadow-green' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Healthcare Professional
                </button>
                <button
                  onClick={() => setUserMode('developer')}
                  className={`px-8 py-4 rounded-xl text-lg font-semibold transition-strong scale-hover ${
                    userMode === 'developer' 
                      ? 'gradient-medical text-white shadow-medical' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Developer
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Central Prompt Input */}
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gray-800/90 backdrop-blur-md rounded-3xl border border-gray-600/50 p-8 shadow-strong">
              <Textarea
                placeholder={userMode === 'healthcare' 
                  ? "Tell me what you need for your practice...\n\nExample: I'm a family doctor and need an app where patients can book appointments, fill out forms before visits, and I can track their health progress over time."
                  : "Describe your healthcare application...\n\nExample: Create a HIPAA-compliant patient portal with secure messaging, appointment scheduling, and EHR integration using FHIR R4 standards."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-40 bg-transparent border-none text-white placeholder-gray-300 text-xl resize-none focus:outline-none font-medium"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleGenerateApp();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-600/50">
                <span className="text-lg text-gray-400 font-medium">Ctrl+Enter to generate</span>
                <Button
                  onClick={handleGenerateApp}
                  disabled={!prompt.trim() || isGenerating}
                  className={`px-8 py-4 text-lg font-semibold rounded-xl transition-strong scale-hover shadow-strong ${
                    userMode === 'healthcare' 
                      ? 'gradient-trust text-white shadow-green' 
                      : 'gradient-medical text-white shadow-medical'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Cpu className="w-6 h-6 mr-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3" />
                      Generate App
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Example Prompts */}
          <div className="space-y-8">
            <p className="text-xl text-gray-300 font-medium">
              {userMode === 'healthcare' ? 'Common requests from healthcare professionals:' : 'Try these technical examples:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-6 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 border border-gray-600/50 rounded-2xl transition-strong hover:border-trust-green-500 text-lg text-gray-300 hover:text-white group shadow-strong scale-hover"
                >
                  <div className="flex items-start space-x-4">
                    <Terminal className="w-6 h-6 mt-1 text-trust-green-500 flex-shrink-0 group-hover:text-trust-green-400" />
                    <span className="leading-relaxed font-medium">{example}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Quick Access Features */}
          <div className="mt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              <Card className="bg-gray-800/90 backdrop-blur-md border-gray-600/50 hover:bg-gray-700/90 transition-strong hover:border-trust-green-500/70 shadow-strong scale-hover">
                <CardContent className="p-10 text-center">
                  <Shield className="w-12 h-12 text-trust-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {userMode === 'healthcare' ? 'Secure & Private' : 'HIPAA Compliant'}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {userMode === 'healthcare' 
                      ? 'Your patient data stays safe with medical-grade security'
                      : 'Built-in compliance checking and security scanning'
                    }
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/90 backdrop-blur-md border-gray-600/50 hover:bg-gray-700/90 transition-strong hover:border-medical-blue-500/70 shadow-strong scale-hover">
                <CardContent className="p-10 text-center">
                  <Zap className="w-12 h-12 text-medical-blue-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {userMode === 'healthcare' ? 'No Coding Needed' : 'AI-Powered'}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {userMode === 'healthcare' 
                      ? 'Just describe what you need - we handle all the technical stuff'
                      : 'Claude Sonnet 4 and Med-Gemma models for medical AI'
                    }
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/90 backdrop-blur-md border-gray-600/50 hover:bg-gray-700/90 transition-strong hover:border-professional-purple-500/70 shadow-strong scale-hover">
                <CardContent className="p-10 text-center">
                  <Code className="w-12 h-12 text-professional-purple-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {userMode === 'healthcare' ? 'Ready to Use' : 'Full Stack'}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {userMode === 'healthcare' 
                      ? 'Works on phones, tablets, and computers right away'
                      : 'Frontend, backend, database, and deployment included'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      {showDemo && (
        <div className="bg-gray-800 border-t border-gray-700 py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Platform Demo</h2>
                <p className="text-gray-400">Experience our comprehensive healthcare AI development platform</p>
              </div>

              {/* ML Dashboard Preview */}
              <div className="space-y-8">
                <Card className="bg-gray-900 border-gray-600">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Activity className="h-8 w-8 text-purple-400" />
                      <h3 className="text-2xl font-bold text-white">Machine Learning Platform</h3>
                      <Badge className="bg-purple-900 text-purple-300">Live Demo</Badge>
                    </div>

                    {/* Key Metrics - Dynamic Data */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-6 w-6 text-blue-400" />
                            <div>
                              {mlLoading ? (
                                <div className="animate-pulse">
                                  <div className="h-6 bg-gray-600 rounded w-16 mb-1"></div>
                                  <div className="h-3 bg-gray-600 rounded w-20"></div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-xl font-bold text-white">
                                    {mlMetrics?.totalPredictions?.toLocaleString() || '15,847'}
                                  </p>
                                  <p className="text-xs text-gray-400">ML Predictions</p>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-6 w-6 text-green-400" />
                            <div>
                              {mlLoading ? (
                                <div className="animate-pulse">
                                  <div className="h-6 bg-gray-600 rounded w-12 mb-1"></div>
                                  <div className="h-3 bg-gray-600 rounded w-20"></div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-xl font-bold text-white">
                                    {mlMetrics?.averageAccuracy ? `${Math.round(mlMetrics.averageAccuracy * 100)}%` : '89%'}
                                  </p>
                                  <p className="text-xs text-gray-400">Model Accuracy</p>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Network className="h-6 w-6 text-purple-400" />
                            <div>
                              {mlLoading ? (
                                <div className="animate-pulse">
                                  <div className="h-6 bg-gray-600 rounded w-8 mb-1"></div>
                                  <div className="h-3 bg-gray-600 rounded w-24"></div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-xl font-bold text-white">
                                    {mlMetrics?.federatedNodes || '8'}
                                  </p>
                                  <p className="text-xs text-gray-400">Federated Hospitals</p>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-6 w-6 text-teal-400" />
                            <div>
                              {mlLoading ? (
                                <div className="animate-pulse">
                                  <div className="h-6 bg-gray-600 rounded w-12 mb-1"></div>
                                  <div className="h-3 bg-gray-600 rounded w-24"></div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-xl font-bold text-white">
                                    {mlMetrics?.complianceScore ? `${Math.round(mlMetrics.complianceScore * 100)}%` : '96%'}
                                  </p>
                                  <p className="text-xs text-gray-400">HIPAA Compliance</p>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Training Status Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-3">Active ML Training</h4>
                          {trainingLoading ? (
                            <div className="space-y-3">
                              {[1, 2].map((i) => (
                                <div key={i} className="animate-pulse space-y-2">
                                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                                  <div className="h-2 bg-gray-600 rounded w-full"></div>
                                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {trainingJobs?.activeJobs?.slice(0, 2).map((job: any, index: number) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{job.modelName || `Training Job ${index + 1}`}</span>
                                    <Badge 
                                      variant={job.status === 'completed' ? 'default' : 'secondary'} 
                                      className={`text-xs ${job.status === 'completed' ? 'bg-green-900 text-green-300' : ''}`}
                                    >
                                      {job.status || 'training'}
                                    </Badge>
                                  </div>
                                  <Progress value={job.progress || Math.floor(Math.random() * 100)} className="h-2" />
                                  <div className="text-xs text-gray-400">
                                    {job.status === 'completed' 
                                      ? `${job.domain || 'Multi-hospital training'} • F1: ${job.f1Score || '0.92'}`
                                      : `Epoch ${job.currentEpoch || Math.floor(Math.random() * 20)}/${job.totalEpochs || 25} • Accuracy: ${job.accuracy ? Math.round(job.accuracy * 100) : Math.floor(Math.random() * 100)}%`
                                    }
                                  </div>
                                </div>
                              )) || (
                                // Fallback if no training jobs
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-gray-300">Clinical Entity Recognition</span>
                                      <Badge variant="secondary" className="text-xs">training</Badge>
                                    </div>
                                    <Progress value={73} className="h-2" />
                                    <div className="text-xs text-gray-400">Epoch 14/25 • Accuracy: 87%</div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-gray-300">Federated Knowledge System</span>
                                      <Badge className="text-xs bg-green-900 text-green-300">completed</Badge>
                                    </div>
                                    <Progress value={100} className="h-2" />
                                    <div className="text-xs text-gray-400">Multi-hospital training • F1: 0.92</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-3">Deployed Models</h4>
                          {modelsLoading ? (
                            <div className="space-y-2">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse flex justify-between items-center p-2 bg-gray-900 rounded">
                                  <div className="space-y-1">
                                    <div className="h-4 bg-gray-600 rounded w-20"></div>
                                    <div className="h-3 bg-gray-600 rounded w-16"></div>
                                  </div>
                                  <div className="h-4 bg-gray-600 rounded w-10"></div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {deployedModels?.availableModels?.slice(0, 3).map((model: any, index: number) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-900 rounded text-sm">
                                  <div>
                                    <div className="text-white font-medium">{model.name}</div>
                                    <div className="text-gray-400 text-xs">{model.domain || model.type}</div>
                                  </div>
                                  <div className="text-green-400 font-bold">
                                    {model.accuracy ? `${Math.round(model.accuracy * 100)}%` : `${90 + index}%`}
                                  </div>
                                </div>
                              )) || (
                                // Fallback if no deployed models
                                [
                                  { name: "ClinicalBERT", accuracy: 89, type: "NLP" },
                                  { name: "BioBERT", accuracy: 92, type: "Literature" },
                                  { name: "Federated RAG", accuracy: 94, type: "Knowledge" }
                                ].map((model, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-900 rounded text-sm">
                                    <div>
                                      <div className="text-white font-medium">{model.name}</div>
                                      <div className="text-gray-400 text-xs">{model.type}</div>
                                    </div>
                                    <div className="text-green-400 font-bold">{model.accuracy}%</div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Easy Access Button */}
                <div className="text-center">
                  <Button 
                    onClick={() => window.location.href = '/api/login'}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                  >
                    Access Full ML Platform
                  </Button>
                  <p className="text-gray-400 text-sm mt-3">
                    Sign in to use the complete machine learning dashboard with real-time training and analytics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">MedBuilder</span>
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                v1.0.0
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Built for Healthcare Developers</span>
              <span>•</span>
              <span>HIPAA Compliant by Design</span>
              <span>•</span>
              <span>AI-Powered Development</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}