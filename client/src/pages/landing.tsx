import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Code, Zap, Sparkles, Cpu, Terminal, Activity, Brain, Network, TrendingUp, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Landing() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const examplePrompts = [
    "Create a HIPAA-compliant patient registration form with real-time validation",
    "Build a telemedicine platform with video calling and secure messaging",
    "Generate an EHR integration dashboard with FHIR R4 support",
    "Design a clinical decision support system with AI recommendations",
    "Create a medical device data collection app with IoT sensors",
    "Build a pharmaceutical drug tracking system with blockchain"
  ];

  const handleGenerateApp = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    localStorage.setItem('pendingPrompt', prompt);
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
      {/* Replit-style Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-semibold text-white">MedBuilder</span>
                <Badge variant="secondary" className="ml-2 text-xs bg-green-900 text-green-300">
                  Healthcare AI
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setShowDemo(!showDemo)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                size="sm"
              >
                {showDemo ? 'Hide Demo' : 'View Demo'}
              </Button>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Replit-style centered prompt */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Build Healthcare Apps with
              <span className="text-green-400 block">AI-Powered Code</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Describe your healthcare application and get production-ready, HIPAA-compliant code instantly.
              From EHR systems to telemedicine platforms.
            </p>
          </div>

          {/* Central Prompt Input */}
          <div className="space-y-6">
            <div className="relative">
              <Textarea
                placeholder="Describe the healthcare application you want to build..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 bg-gray-800 border-gray-600 text-white placeholder-gray-400 text-lg resize-none focus:border-green-500 focus:ring-green-500 font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleGenerateApp();
                  }
                }}
              />
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <span className="text-xs text-gray-500">Ctrl+Enter to generate</span>
                <Button
                  onClick={handleGenerateApp}
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <Cpu className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate App
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Try these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors text-sm text-gray-300 hover:text-white"
                >
                  <div className="flex items-start space-x-2">
                    <Terminal className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>{example}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Access Features */}
          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardContent className="p-6 text-center">
                  <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">HIPAA Compliant</h3>
                  <p className="text-gray-400 text-sm">Built-in compliance checking and security scanning</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
                  <p className="text-gray-400 text-sm">Claude Sonnet 4 and Med-Gemma models for medical AI</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardContent className="p-6 text-center">
                  <Code className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Full Stack</h3>
                  <p className="text-gray-400 text-sm">Frontend, backend, database, and deployment included</p>
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

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-6 w-6 text-blue-400" />
                            <div>
                              <p className="text-xl font-bold text-white">15,847</p>
                              <p className="text-xs text-gray-400">ML Predictions</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-6 w-6 text-green-400" />
                            <div>
                              <p className="text-xl font-bold text-white">89%</p>
                              <p className="text-xs text-gray-400">Model Accuracy</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Network className="h-6 w-6 text-purple-400" />
                            <div>
                              <p className="text-xl font-bold text-white">8</p>
                              <p className="text-xs text-gray-400">Federated Hospitals</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-6 w-6 text-teal-400" />
                            <div>
                              <p className="text-xl font-bold text-white">96%</p>
                              <p className="text-xs text-gray-400">HIPAA Compliance</p>
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
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-3">Deployed Models</h4>
                          <div className="space-y-2">
                            {[
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
                            ))}
                          </div>
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