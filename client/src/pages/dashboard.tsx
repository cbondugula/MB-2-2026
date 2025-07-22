import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PowerEnhancementBanner from "@/components/power-enhancement-banner";
import ConversationalInterface from "@/components/conversational-interface";
import AccessibilityToolbar from "@/components/accessibility-toolbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import { 
  Code, 
  Shield, 
  Clock, 
  Cloud, 
  Sparkles, 
  Terminal, 
  Play, 
  Eye, 
  Settings, 
  Zap,
  Activity,
  Users,
  TrendingUp,
  GitBranch,
  Cpu,
  Globe,
  Brain,
  FileText,
  Atom,
  Building,
  Bot,
  TestTube
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [showConversationalInterface, setShowConversationalInterface] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch user projects dynamically
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch user statistics dynamically
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/users/stats"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch recent activities dynamically
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities/recent"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Handle pending prompt from localStorage (from landing page)
  useEffect(() => {
    const pendingPrompt = localStorage.getItem('pendingPrompt');
    if (pendingPrompt && isAuthenticated) {
      setAiPrompt(pendingPrompt);
      setShowConversationalInterface(true);
      localStorage.removeItem('pendingPrompt');
    }
  }, [isAuthenticated]);

  // Check if user needs onboarding
  useEffect(() => {
    if (isAuthenticated && userStats && !userStats.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [isAuthenticated, userStats]);

  const handleGenerateApp = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      // This would normally call the AI service
      toast({
        title: "Generating Application",
        description: "Your healthcare app is being created with AI assistance...",
      });
      // Simulate AI generation
      setTimeout(() => {
        setIsGenerating(false);
        setActiveProject({
          id: Date.now(),
          name: "Generated Healthcare App",
          type: "healthcare-platform",
          status: "ready"
        });
      }, 3000);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-16 h-16 gradient-medical rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medical">
            <Cpu className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-200 text-xl font-medium">Loading MedBuilder...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      {/* Enhanced Header */}
      <header className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-600/50 sticky top-0 z-50 shadow-strong">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-medical rounded-xl flex items-center justify-center shadow-medical">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">MedBuilder</span>
            </div>
            
            {activeProject && (
              <div className="flex items-center space-x-3 text-lg">
                <span className="text-gray-300">/</span>
                <span className="text-trust-green-400 font-medium">{activeProject.name}</span>
                <Badge className="bg-trust-green-900 text-trust-green-300 text-sm shadow-green">
                  {activeProject.status}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-lg text-gray-300">
              <span>Welcome back,</span>
              <span className="text-white font-semibold">
                {user?.firstName || user?.email || 'Developer'}
              </span>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/logout'}
              variant="outline"
              size="sm"
              className="border-gray-500 text-gray-200 hover:bg-gray-700 transition-strong shadow-hover px-4 py-2"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Split Screen Layout */}
      <div className="flex h-[calc(100vh-81px)]">
        {/* Left Side - AI Assistant & Controls */}
        <div className="w-1/2 border-r border-gray-600/50 flex flex-col">
          {/* Enhanced AI Assistant Panel */}
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-800/90 border-b border-gray-600/50 px-8 py-6 shadow-strong">
              <div className="flex items-center space-x-4">
                <Sparkles className="w-8 h-8 text-trust-green-400" />
                <h2 className="text-2xl font-bold">AI Assistant</h2>
                <Badge className="bg-medical-blue-900 text-medical-blue-300 text-sm px-3 py-1 shadow-medical">
                  Claude Sonnet 4
                </Badge>
              </div>
            </div>

            <div className="flex-1 p-8 space-y-8">
              {/* Power Enhancement Banner */}
              <PowerEnhancementBanner />
              
              {/* Enhanced Conversational Interface Toggle */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Build with AI</h3>
                <Button
                  onClick={() => setShowConversationalInterface(!showConversationalInterface)}
                  variant="outline"
                  size="sm"
                  className="border-gray-500 text-gray-200 hover:bg-gray-700 transition-strong shadow-hover px-4 py-2"
                >
                  {showConversationalInterface ? 'Simple Mode' : 'Chat Mode'}
                </Button>
              </div>

              {showConversationalInterface ? (
                <div className="h-96 border border-gray-600/50 rounded-2xl overflow-hidden shadow-strong backdrop-blur-sm">
                  <ConversationalInterface
                    mode="compact"
                    initialPrompt={aiPrompt}
                    onProjectCreated={(projectId) => {
                      setActiveProject({ id: projectId, name: 'New Project', status: 'active' });
                      toast({
                        title: "Project Created!",
                        description: "Your project is ready. Continue building!",
                      });
                    }}
                    onCodeGenerated={(code) => {
                      toast({
                        title: "Code Generated!",
                        description: "Your application code has been generated.",
                      });
                    }}
                  />
                </div>
              ) : (
                <>
                  {/* Enhanced AI Prompt Input */}
                  <div className="space-y-4">
                    <label className="text-lg text-gray-300 font-medium">Describe your healthcare application</label>
                    <div className="relative">
                      <Textarea
                        placeholder="Create a HIPAA-compliant patient portal with secure messaging, appointment scheduling, and lab results viewing..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="bg-gray-800/90 border-gray-600/50 text-white placeholder-gray-400 min-h-[140px] resize-none focus:border-trust-green-500 focus:ring-trust-green-500 text-lg p-4 rounded-2xl shadow-strong backdrop-blur-sm"
                      />
                      <Button
                        onClick={handleGenerateApp}
                        disabled={!aiPrompt.trim() || isGenerating}
                        className="absolute bottom-4 right-4 gradient-trust hover:bg-trust-green-700 px-6 py-3 shadow-green transition-strong scale-hover"
                        size="sm"
                      >
                        {isGenerating ? (
                          <>
                            <Cpu className="w-5 h-5 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-gray-800/90 border-gray-600/50 hover:bg-gray-700/90 transition-strong shadow-strong scale-hover backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-medical-blue-900 rounded-2xl flex items-center justify-center shadow-medical">
                        <Code className="w-7 h-7 text-medical-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {statsLoading ? "..." : userStats?.totalProjects || 0}
                        </p>
                        <p className="text-sm text-gray-400 font-medium">Projects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/90 border-gray-600/50 hover:bg-gray-700/90 transition-strong shadow-strong scale-hover backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-trust-green-900 rounded-2xl flex items-center justify-center shadow-green">
                        <TrendingUp className="w-7 h-7 text-trust-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {statsLoading ? "..." : userStats?.deploymentsCount || 0}
                        </p>
                        <p className="text-sm text-gray-400 font-medium">Deployments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Revolutionary Technologies */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-trust-green-300 flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  Revolutionary Technologies
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/quantum-ai">
                    <Button variant="outline" size="sm" className="w-full border-medical-blue-600 text-medical-blue-300 hover:bg-medical-blue-900 bg-medical-blue-900/30 transition-strong scale-hover shadow-medical py-3">
                      <Atom className="w-5 h-5 mr-2" />
                      Quantum-AI
                    </Button>
                  </Link>
                  <Link href="/dual-quantum-classical">
                    <Button variant="outline" size="sm" className="w-full border-healthcare-teal-600 text-healthcare-teal-300 hover:bg-healthcare-teal-900 bg-healthcare-teal-900/30 transition-strong scale-hover shadow-teal py-3">
                      <Zap className="w-5 h-5 mr-2" />
                      Dual Patents
                    </Button>
                  </Link>
                  <Link href="/tjc-compliance">
                    <Button variant="outline" size="sm" className="w-full border-trust-green-600 text-trust-green-300 hover:bg-trust-green-900 bg-trust-green-900/30 transition-strong scale-hover shadow-green py-3">
                      <Shield className="w-5 h-5 mr-2" />
                      TJC Compliance
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-purple-600 text-purple-300 hover:bg-purple-900 bg-purple-900/30 transition-strong scale-hover shadow-hover py-3"
                    onClick={() => window.open('/api/bci/capabilities', '_blank')}
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Brain Interface
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-orange-600 text-orange-300 hover:bg-orange-900 bg-orange-900/30 transition-strong scale-hover shadow-hover py-3"
                    onClick={() => window.open('/api/business/create-business-plan', '_blank')}
                  >
                    <Building className="w-5 h-5 mr-2" />
                    Auto Business
                  </Button>
                  <Link href="/healthcare-testing">
                    <Button variant="outline" size="sm" className="w-full border-pink-600 text-pink-300 hover:bg-pink-900 bg-pink-900/30 transition-strong scale-hover shadow-hover py-3">
                      <TestTube className="w-5 h-5 mr-2" />
                      AI Testing
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Enhanced Healthcare Tools */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-200">Healthcare Tools</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/global-healthcare">
                    <Button variant="outline" size="sm" className="w-full border-gray-500 text-gray-200 hover:bg-gray-700/80 transition-strong scale-hover shadow-hover py-3">
                      <Globe className="w-5 h-5 mr-2" />
                      Global Healthcare
                    </Button>
                  </Link>
                  <Link href="/clinical-ai">
                    <Button variant="outline" size="sm" className="w-full border-gray-500 text-gray-200 hover:bg-gray-700/80 transition-strong scale-hover shadow-hover py-3">
                      <Brain className="w-5 h-5 mr-2" />
                      Clinical AI
                    </Button>
                  </Link>
                  <Link href="/hipaa-tools">
                    <Button variant="outline" size="sm" className="w-full border-gray-500 text-gray-200 hover:bg-gray-700/80 transition-strong scale-hover shadow-hover py-3">
                      <Shield className="w-5 h-5 mr-2" />
                      HIPAA Tools
                    </Button>
                  </Link>
                  <Link href="/super-agent">
                    <Button variant="outline" size="sm" className="w-full border-yellow-600 text-yellow-300 hover:bg-yellow-900 bg-yellow-900/30 transition-strong scale-hover shadow-hover py-3">
                      <Zap className="w-5 h-5 mr-2" />
                      Super Agent
                    </Button>
                  </Link>
                  <Link href="/visual-builder">
                    <Button variant="outline" size="sm" className="w-full border-purple-600 text-purple-300 hover:bg-purple-900 bg-purple-900/20">
                      <Eye className="w-4 h-4 mr-2" />
                      No-Code Builder
                    </Button>
                  </Link>
                  <Link href="/ml-python">
                    <Button variant="outline" size="sm" className="w-full border-orange-600 text-orange-300 hover:bg-orange-900 bg-orange-900/20">
                      <Code className="w-4 h-4 mr-2" />
                      Python ML
                    </Button>
                  </Link>
                  <Link href="/ml-dashboard">
                    <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Activity className="w-4 h-4 mr-2" />
                      ML Platform
                    </Button>
                  </Link>
                  <Link href="/healthcare-testing">
                    <Button variant="outline" size="sm" className="w-full border-green-600 text-green-300 hover:bg-green-900 bg-green-900/20">
                      <TestTube className="w-4 h-4 mr-2" />
                      Advanced Testing
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Enhanced Recent Projects */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-200">Recent Projects</h3>
                <div className="space-y-3">
                  {projectsLoading ? (
                    <div className="text-gray-400 text-lg">Loading projects...</div>
                  ) : projects && projects.length > 0 ? (
                    projects.slice(0, 5).map((project) => (
                      <div 
                        key={project.id}
                        className="p-4 bg-gray-800/90 border border-gray-600/50 rounded-2xl hover:bg-gray-700/90 cursor-pointer transition-strong scale-hover shadow-strong backdrop-blur-sm"
                        onClick={() => setActiveProject(project)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-900 rounded-xl flex items-center justify-center shadow-hover">
                              <GitBranch className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="text-lg text-white font-medium">{project.name}</span>
                          </div>
                          <Badge className="bg-gray-700/80 text-gray-200 text-sm px-3 py-1">
                            {project.type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-lg">No projects yet. Generate your first app!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Right Side - Preview & Analytics */}
        <div className="w-1/2 flex flex-col">
          {/* Enhanced Preview Panel Header */}
          <div className="bg-gray-800/90 border-b border-gray-600/50 px-8 py-6 shadow-strong">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Eye className="w-8 h-8 text-medical-blue-400" />
                <h2 className="text-2xl font-bold">Preview & Analytics</h2>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="border-gray-500 text-gray-200 hover:bg-gray-700 transition-strong shadow-hover px-4 py-2">
                  <Play className="w-5 h-5 mr-2" />
                  Run
                </Button>
                <Button variant="outline" size="sm" className="border-gray-500 text-gray-200 hover:bg-gray-700 transition-strong shadow-hover px-4 py-2">
                  <Cloud className="w-5 h-5 mr-2" />
                  Deploy
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {activeProject ? (
              <div className="flex-1 p-8">
                <div className="bg-gray-800/90 border border-gray-600/50 rounded-2xl h-full flex items-center justify-center shadow-strong backdrop-blur-sm">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 gradient-trust rounded-2xl flex items-center justify-center mx-auto shadow-green">
                      <Eye className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{activeProject.name}</h3>
                      <p className="text-gray-300 text-lg">Application preview will appear here</p>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <Button className="gradient-trust hover:bg-trust-green-700 px-6 py-3 text-lg shadow-green transition-strong scale-hover">
                        <Play className="w-5 h-5 mr-2" />
                        Start Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-8 space-y-8">
                {/* Enhanced Activity Feed */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-200">Recent Activity</h3>
                  <ScrollArea className="h-72">
                    <div className="space-y-4">
                      {activitiesLoading ? (
                        <div className="text-gray-400 text-lg">Loading activities...</div>
                      ) : activities && activities.length > 0 ? (
                        activities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-800/90 rounded-2xl border border-gray-600/50 hover:bg-gray-700/90 transition-strong shadow-strong backdrop-blur-sm">
                            <div className="w-10 h-10 bg-medical-blue-900 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-medical">
                              <Activity className="w-5 h-5 text-medical-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-lg text-white font-medium">{activity.description}</p>
                              <p className="text-sm text-gray-400 mt-1">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-lg">No recent activity</div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Enhanced Healthcare Metrics */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-200">Healthcare Compliance</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="bg-gray-800/90 border-gray-600/50 hover:bg-gray-700/90 transition-strong shadow-strong backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Shield className="w-6 h-6 text-trust-green-400" />
                            <span className="text-lg text-white font-medium">HIPAA Compliance</span>
                          </div>
                          <Badge className="bg-trust-green-900 text-trust-green-300 text-sm px-3 py-1 shadow-green">100%</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-white">FHIR Integration</span>
                          </div>
                          <Badge className="bg-blue-900 text-blue-300 text-xs">Ready</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />
    </div>
  );
}
