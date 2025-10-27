import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PowerEnhancementBanner from "@/components/power-enhancement-banner";
import ConversationalInterface from "@/components/conversational-interface";
import AccessibilityToolbar from "@/components/accessibility-toolbar";
import OnboardingTour from "@/components/OnboardingTour";
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

// TypeScript interfaces for API responses
interface Project {
  id: number | string;
  name: string;
  type?: string;
  status: string;
  description?: string;
  framework?: string;
  createdAt?: string;
}

interface UserStats {
  totalProjects?: number;
  deploymentsCount?: number;
  hasCompletedOnboarding?: boolean;
  lastActivity?: string;
}

interface Activity {
  id: number | string;
  type: string;
  description: string;
  timestamp: string;
  projectId?: number | string;
}

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showConversationalInterface, setShowConversationalInterface] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const hasCompletedOnboarding = localStorage.getItem('medbuilder_onboarding_completed');
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [isAuthenticated, isLoading]);
  
  // Smart refresh for user stats (critical healthcare data)
  const userStatsRefresh = useSmartRefresh('/api/users/stats', true, 10);
  const activitiesRefresh = useSmartRefresh('/api/activities/recent', false, 30);

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
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch user statistics with tier-based updates (USER_EXPERIENCE tier)
  const { data: userStats, isLoading: statsLoading, refetch: refetchStats } = useQuery<UserStats>({
    queryKey: ["/api/users/stats"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/users/stats"), // 30 minute auto-refresh
  });

  // Fetch recent activities with tier-based updates (USER_EXPERIENCE tier)
  const { data: activities, isLoading: activitiesLoading, refetch: refetchActivities } = useQuery<Activity[]>({
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
      {/* Onboarding Tour for new users */}
      {showOnboarding && (
        <OnboardingTour
          onComplete={() => setShowOnboarding(false)}
          onSkip={() => setShowOnboarding(false)}
        />
      )}
      
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
              className="bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800"
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
                  className="bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800"
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Revolutionary Technologies
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/advanced-ai">
                    <Button variant="outline" size="sm" className="w-full border-2 border-blue-400 bg-blue-950 text-white hover:bg-blue-900 hover:border-blue-300 font-semibold shadow-sm">
                      <Atom className="w-4 h-4 mr-2" />
                      Advanced-AI
                      <Badge className="ml-auto bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 font-bold">SOON</Badge>
                    </Button>
                  </Link>
                  <Link href="/dual-advanced-classical">
                    <Button variant="outline" size="sm" className="w-full border-2 border-cyan-400 bg-cyan-950 text-white hover:bg-cyan-900 hover:border-cyan-300 font-semibold shadow-sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Dual Patents
                      <Badge className="ml-auto bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 font-bold">SOON</Badge>
                    </Button>
                  </Link>
                  <Link href="/tjc-compliance">
                    <Button variant="outline" size="sm" className="w-full border-2 border-green-400 bg-green-950 text-white hover:bg-green-900 hover:border-green-300 font-semibold shadow-sm">
                      <Shield className="w-4 h-4 mr-2" />
                      TJC Compliance
                    </Button>
                  </Link>
                  <Link href="/bci-capabilities">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-2 border-purple-400 bg-purple-950 text-white hover:bg-purple-900 hover:border-purple-300 font-semibold shadow-sm"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Brain Interface
                      <Badge className="ml-auto bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 font-bold">SOON</Badge>
                    </Button>
                  </Link>
                  <Link href="/auto-business">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-2 border-orange-400 bg-orange-950 text-white hover:bg-orange-900 hover:border-orange-300 font-semibold shadow-sm"
                    >
                      <Building className="w-4 h-4 mr-2" />
                      Auto Business
                      <Badge className="ml-auto bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 font-bold">SOON</Badge>
                    </Button>
                  </Link>
                  <Link href="/healthcare-testing">
                    <Button variant="outline" size="sm" className="w-full border-2 border-pink-400 bg-pink-950 text-white hover:bg-pink-900 hover:border-pink-300 font-semibold shadow-sm">
                      <TestTube className="w-4 h-4 mr-2" />
                      AI Testing
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Tools */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Healthcare Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/global-healthcare">
                    <Button variant="outline" size="sm" className="w-full border-2 border-blue-400 bg-blue-950 text-white hover:bg-blue-900 hover:border-blue-300 font-semibold shadow-sm">
                      <Globe className="w-4 h-4 mr-2" />
                      Global Healthcare
                    </Button>
                  </Link>
                  <Link href="/clinical-ai">
                    <Button variant="outline" size="sm" className="w-full border-2 border-teal-400 bg-teal-950 text-white hover:bg-teal-900 hover:border-teal-300 font-semibold shadow-sm">
                      <Brain className="w-4 h-4 mr-2" />
                      Clinical AI
                    </Button>
                  </Link>
                  <Link href="/hipaa-tools">
                    <Button variant="outline" size="sm" className="w-full border-2 border-emerald-400 bg-emerald-950 text-white hover:bg-emerald-900 hover:border-emerald-300 font-semibold shadow-sm">
                      <Shield className="w-4 h-4 mr-2" />
                      HIPAA Tools
                    </Button>
                  </Link>
                  <Link href="/super-agent">
                    <Button variant="outline" size="sm" className="w-full border-2 border-yellow-400 bg-yellow-950 text-white hover:bg-yellow-900 hover:border-yellow-300 font-semibold shadow-sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Super Agent
                    </Button>
                  </Link>
                  <Link href="/cs-agent">
                    <Button variant="outline" size="sm" className="w-full border-2 border-cyan-400 bg-cyan-950 text-white hover:bg-cyan-900 hover:border-cyan-300 font-semibold shadow-sm">
                      <Brain className="w-4 h-4 mr-2" />
                      CS Agent 100x
                    </Button>
                  </Link>
                  <Link href="/visual-builder">
                    <Button variant="outline" size="sm" className="w-full border-2 border-purple-400 bg-purple-950 text-white hover:bg-purple-900 hover:border-purple-300 font-semibold shadow-sm">
                      <Eye className="w-4 h-4 mr-2" />
                      No-Code Builder
                    </Button>
                  </Link>
                  <Link href="/ml-python">
                    <Button variant="outline" size="sm" className="w-full border-2 border-orange-400 bg-orange-950 text-white hover:bg-orange-900 hover:border-orange-300 font-semibold shadow-sm">
                      <Code className="w-4 h-4 mr-2" />
                      Python ML
                    </Button>
                  </Link>
                  <Link href="/ml-dashboard">
                    <Button variant="outline" size="sm" className="w-full border-2 border-violet-400 bg-violet-950 text-white hover:bg-violet-900 hover:border-violet-300 font-semibold shadow-sm">
                      <Activity className="w-4 h-4 mr-2" />
                      ML Platform
                    </Button>
                  </Link>
                  <Link href="/healthcare-testing">
                    <Button variant="outline" size="sm" className="w-full border-2 border-green-400 bg-green-950 text-white hover:bg-green-900 hover:border-green-300 font-semibold shadow-sm">
                      <TestTube className="w-4 h-4 mr-2" />
                      Advanced Testing
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Projects</h3>
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
                <Button variant="outline" size="sm" className="bg-green-50 dark:bg-green-900 border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-800">
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-50 dark:bg-blue-900 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800">
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
