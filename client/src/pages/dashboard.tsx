import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TopNavigation from "@/components/TopNavigation";
import LeftSidebar from "@/components/LeftSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { 
  Code, 
  Shield, 
  Sparkles, 
  Rocket,
  FolderOpen,
  FileCode,
  Puzzle,
  Eye,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Plus,
  Loader2
} from "lucide-react";

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

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Session Expired",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/users/stats"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading MedBuilder...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const quickActions = [
    {
      title: "Build New App",
      description: "Create a healthcare application with AI assistance",
      icon: Rocket,
      href: "/app-builder",
      primary: true
    },
    {
      title: "Browse Templates",
      description: "Start from a pre-built HIPAA-compliant template",
      icon: FileCode,
      href: "/templates"
    },
    {
      title: "My Apps",
      description: "View and manage your existing projects",
      icon: FolderOpen,
      href: "/my-apps"
    },
    {
      title: "Components",
      description: "Explore reusable UI components",
      icon: Puzzle,
      href: "/components"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <TopNavigation />
      
      <div className="flex">
        <LeftSidebar />
        
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-8">
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
                  <h1 className="text-2xl font-bold text-white" data-testid="welcome-heading">
                    Welcome back, {user?.firstName || 'Developer'}
                  </h1>
                  <p className="text-gray-400 mt-1">
                    Build HIPAA-compliant healthcare applications with AI
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-900/50 border border-emerald-700 text-emerald-300">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Compliant
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={action.href} href={action.href}>
                  <Card 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 ${
                      action.primary 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 border border-gray-800'
                    }`}
                    data-testid={`quick-action-${index}`}
                  >
                    <CardContent className="p-5">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        action.primary ? 'bg-white/20' : 'bg-gray-800'
                      }`}>
                        <action.icon className={`w-5 h-5 ${action.primary ? 'text-white' : 'text-emerald-400'}`} />
                      </div>
                      <h3 className={`font-semibold mb-1 ${action.primary ? 'text-white' : 'text-white'}`}>
                        {action.title}
                      </h3>
                      <p className={`text-sm ${action.primary ? 'text-white/80' : 'text-gray-400'}`}>
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg text-white">Recent Projects</CardTitle>
                    <CardDescription className="text-gray-400">Your healthcare applications</CardDescription>
                  </div>
                  <Link href="/my-apps">
                    <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-gray-800" data-testid="view-all-projects">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {projectsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                    </div>
                  ) : projects && projects.length > 0 ? (
                    <div className="space-y-3">
                      {projects.slice(0, 4).map((project) => (
                        <div 
                          key={project.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
                          onClick={() => setLocation(`/editor/${project.id}`)}
                          data-testid={`project-${project.id}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                              <Code className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{project.name}</p>
                              <p className="text-sm text-gray-400">{project.type || 'Healthcare App'}</p>
                            </div>
                          </div>
                          <Badge 
                            className={project.status === 'active' || project.status === 'deployed'
                              ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700'
                              : 'bg-gray-800 text-gray-300 border border-gray-700'
                            }
                          >
                            {project.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                            {project.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="font-medium text-white mb-1">No projects yet</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Get started by creating your first healthcare app
                      </p>
                      <Link href="/app-builder">
                        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" data-testid="create-first-project">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First App
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Your Stats</CardTitle>
                  <CardDescription className="text-gray-400">Activity overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-gray-300">Total Projects</span>
                    </div>
                    <span className="text-2xl font-bold text-white" data-testid="stat-projects">
                      {statsLoading ? "..." : userStats?.totalProjects || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-gray-300">Deployments</span>
                    </div>
                    <span className="text-2xl font-bold text-white" data-testid="stat-deployments">
                      {statsLoading ? "..." : userStats?.deploymentsCount || 0}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center space-x-2 text-sm">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">
                        All apps HIPAA compliant
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Build with AI</h3>
                      <p className="text-white/80">Describe your healthcare app and let AI generate the code</p>
                    </div>
                  </div>
                  <Link href="/app-builder">
                    <Button 
                      variant="secondary" 
                      className="bg-white text-emerald-600 hover:bg-gray-100"
                      data-testid="start-building-cta"
                    >
                      Start Building
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/code-editor">
                <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer" data-testid="tool-code-editor">
                  <CardContent className="p-5 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Code Editor</h4>
                      <p className="text-sm text-gray-400">Write and edit code</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/preview">
                <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer" data-testid="tool-preview">
                  <CardContent className="p-5 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Preview</h4>
                      <p className="text-sm text-gray-400">Test your application</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/hipaa-tools">
                <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer" data-testid="tool-hipaa">
                  <CardContent className="p-5 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">HIPAA Tools</h4>
                      <p className="text-sm text-gray-400">Compliance scanning</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
