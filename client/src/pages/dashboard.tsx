import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PowerEnhancementBanner from "@/components/power-enhancement-banner";
import ConversationalInterface from "@/components/conversational-interface";
import AccessibilityToolbar from "@/components/accessibility-toolbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SmartRefresh, useSmartRefresh } from "@/components/ui/smart-refresh";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRefreshInterval, isPlatformOwner } from "@/lib/update-strategy";
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
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [showConversationalInterface, setShowConversationalInterface] = useState(false);
  
  // Smart refresh for user stats (critical healthcare data)
  const userStatsRefresh = useSmartRefresh('/api/users/stats', true, 10);
  const activitiesRefresh = useSmartRefresh('/api/activities/recent', false, 30);
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

  // Fetch user statistics with tier-based updates (USER_EXPERIENCE tier)
  const { data: userStats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["/api/users/stats"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/users/stats"), // 30 minute auto-refresh
  });

  // Fetch recent activities with tier-based updates (USER_EXPERIENCE tier)
  const { data: activities, isLoading: activitiesLoading, refetch: refetchActivities } = useQuery({
    queryKey: ["/api/activities/recent"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/activities/recent"), // 60 minute auto-refresh
  });

  // Manual refresh handlers
  const handleStatsRefresh = async () => {
    await refetchStats();
    userStatsRefresh.markUpdated();
  };

  const handleActivitiesRefresh = async () => {
    await refetchActivities();
    activitiesRefresh.markUpdated();
  };

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Cpu className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-gray-400">Loading MedBuilder...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
      {/* Replit-style Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">MedBuilder</span>
            </div>
            
            {activeProject && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">/</span>
                <span className="text-green-400">{activeProject.name}</span>
                <Badge className="bg-green-900 text-green-300 text-xs">
                  {activeProject.status}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Welcome back,</span>
              <span className="text-white font-medium">
                {user?.firstName || user?.email || 'Developer'}
              </span>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/logout'}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Split Screen Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Side - AI Assistant & Controls */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col">
          {/* AI Assistant Panel */}
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-green-400" />
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <Badge className="bg-blue-900 text-blue-300 text-xs">
                  Claude Sonnet 4
                </Badge>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
              {/* Power Enhancement Banner */}
              <PowerEnhancementBanner />
              
              {/* Conversational Interface Toggle */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Build with AI</h3>
                <Button
                  onClick={() => setShowConversationalInterface(!showConversationalInterface)}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  {showConversationalInterface ? 'Simple Mode' : 'Chat Mode'}
                </Button>
              </div>

              {showConversationalInterface ? (
                <div className="h-96 border border-gray-600 rounded-lg overflow-hidden">
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
                  {/* AI Prompt Input */}
                  <div className="space-y-3">
                    <label className="text-sm text-gray-400">Describe your healthcare application</label>
                    <div className="relative">
                      <Textarea
                        placeholder="Create a HIPAA-compliant patient portal with secure messaging, appointment scheduling, and lab results viewing..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 min-h-[120px] resize-none focus:border-green-500 focus:ring-green-500"
                      />
                      <Button
                        onClick={handleGenerateApp}
                        disabled={!aiPrompt.trim() || isGenerating}
                        className="absolute bottom-3 right-3 bg-green-600 hover:bg-green-700"
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
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {statsLoading ? "..." : userStats?.totalProjects || 0}
                        </p>
                        <p className="text-xs text-gray-400">Projects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-900 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {statsLoading ? "..." : userStats?.deploymentsCount || 0}
                        </p>
                        <p className="text-xs text-gray-400">Deployments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revolutionary Technologies */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-green-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Revolutionary Technologies
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/quantum-ai">
                    <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-300 hover:bg-blue-900 bg-blue-900/20">
                      <Atom className="w-4 h-4 mr-2" />
                      Quantum-AI
                    </Button>
                  </Link>
                  <Link href="/dual-quantum-classical">
                    <Button variant="outline" size="sm" className="w-full border-cyan-600 text-cyan-300 hover:bg-cyan-900 bg-cyan-900/20">
                      <Zap className="w-4 h-4 mr-2" />
                      Dual Patents
                    </Button>
                  </Link>
                  <Link href="/tjc-compliance">
                    <Button variant="outline" size="sm" className="w-full border-green-600 text-green-300 hover:bg-green-900 bg-green-900/20">
                      <Shield className="w-4 h-4 mr-2" />
                      TJC Compliance
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-purple-600 text-purple-300 hover:bg-purple-900 bg-purple-900/20"
                    onClick={() => window.open('/api/bci/capabilities', '_blank')}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Brain Interface
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-orange-600 text-orange-300 hover:bg-orange-900 bg-orange-900/20"
                    onClick={() => window.open('/api/business/create-business-plan', '_blank')}
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Auto Business
                  </Button>
                  <Link href="/healthcare-testing">
                    <Button variant="outline" size="sm" className="w-full border-pink-600 text-pink-300 hover:bg-pink-900 bg-pink-900/20">
                      <TestTube className="w-4 h-4 mr-2" />
                      AI Testing
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Tools */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Healthcare Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/global-healthcare">
                    <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Globe className="w-4 h-4 mr-2" />
                      Global Healthcare
                    </Button>
                  </Link>
                  <Link href="/clinical-ai">
                    <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Brain className="w-4 h-4 mr-2" />
                      Clinical AI
                    </Button>
                  </Link>
                  <Link href="/hipaa-tools">
                    <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Shield className="w-4 h-4 mr-2" />
                      HIPAA Tools
                    </Button>
                  </Link>
                  <Link href="/super-agent">
                    <Button variant="outline" size="sm" className="w-full border-yellow-600 text-yellow-300 hover:bg-yellow-900 bg-yellow-900/20">
                      <Zap className="w-4 h-4 mr-2" />
                      Super Agent
                    </Button>
                  </Link>
                  <Link href="/cs-agent">
                    <Button variant="outline" size="sm" className="w-full border-cyan-600 text-cyan-300 hover:bg-cyan-900 bg-cyan-900/20">
                      <Brain className="w-4 h-4 mr-2" />
                      CS Agent 100x
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

              {/* Recent Projects */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Recent Projects</h3>
                <div className="space-y-2">
                  {projectsLoading ? (
                    <div className="text-gray-500 text-sm">Loading projects...</div>
                  ) : projects && projects.length > 0 ? (
                    projects.slice(0, 5).map((project) => (
                      <div 
                        key={project.id}
                        className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 cursor-pointer transition-colors"
                        onClick={() => setActiveProject(project)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-purple-900 rounded flex items-center justify-center">
                              <GitBranch className="w-3 h-3 text-purple-400" />
                            </div>
                            <span className="text-sm text-white">{project.name}</span>
                          </div>
                          <Badge className="bg-gray-700 text-gray-300 text-xs">
                            {project.type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No projects yet. Generate your first app!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Preview & Analytics */}
        <div className="w-1/2 flex flex-col">
          {/* Preview Panel Header */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-6 h-6 text-blue-400" />
                <h2 className="text-lg font-semibold">Preview & Analytics</h2>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Cloud className="w-4 h-4 mr-2" />
                  Deploy
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {activeProject ? (
              <div className="flex-1 p-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-900 rounded-lg flex items-center justify-center mx-auto">
                      <Eye className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{activeProject.name}</h3>
                      <p className="text-gray-400 text-sm">Application preview will appear here</p>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-6 space-y-6">
                {/* Activity Feed */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-300">Recent Activity</h3>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {activitiesLoading ? (
                        <div className="text-gray-500 text-sm">Loading activities...</div>
                      ) : activities && activities.length > 0 ? (
                        activities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
                            <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <Activity className="w-3 h-3 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white">{activity.description}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm">No recent activity</div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Healthcare Metrics */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-300">Healthcare Compliance</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-white">HIPAA Compliance</span>
                          </div>
                          <Badge className="bg-green-900 text-green-300 text-xs">100%</Badge>
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
