import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TopNavigation from "@/components/TopNavigation";
import LeftSidebar from "@/components/LeftSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-medical-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading MedBuilder...</p>
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
      color: "bg-medical-blue-500",
      primary: true
    },
    {
      title: "Browse Templates",
      description: "Start from a pre-built HIPAA-compliant template",
      icon: FileCode,
      href: "/templates",
      color: "bg-trust-green-500"
    },
    {
      title: "My Apps",
      description: "View and manage your existing projects",
      icon: FolderOpen,
      href: "/my-apps",
      color: "bg-purple-500"
    },
    {
      title: "Components",
      description: "Explore reusable UI components",
      icon: Puzzle,
      href: "/components",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <TopNavigation />
      
      <div className="flex">
        <LeftSidebar />
        
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="welcome-heading">
                  Welcome back, {user?.firstName || 'Developer'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Build HIPAA-compliant healthcare applications with AI
                </p>
              </div>
              <Badge variant="outline" className="bg-trust-green-50 dark:bg-trust-green-900/30 border-trust-green-200 dark:border-trust-green-700 text-trust-green-700 dark:text-trust-green-300">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Compliant
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={action.href} href={action.href}>
                  <Card 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                      action.primary 
                        ? 'bg-gradient-to-br from-medical-blue-500 to-medical-blue-600 text-white border-0' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                    data-testid={`quick-action-${index}`}
                  >
                    <CardContent className="p-5">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        action.primary ? 'bg-white/20' : action.color
                      }`}>
                        <action.icon className={`w-5 h-5 ${action.primary ? 'text-white' : 'text-white'}`} />
                      </div>
                      <h3 className={`font-semibold mb-1 ${action.primary ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {action.title}
                      </h3>
                      <p className={`text-sm ${action.primary ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg">Recent Projects</CardTitle>
                    <CardDescription>Your healthcare applications</CardDescription>
                  </div>
                  <Link href="/my-apps">
                    <Button variant="ghost" size="sm" className="text-medical-blue-600" data-testid="view-all-projects">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {projectsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                  ) : projects && projects.length > 0 ? (
                    <div className="space-y-3">
                      {projects.slice(0, 4).map((project) => (
                        <div 
                          key={project.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          onClick={() => setLocation(`/editor/${project.id}`)}
                          data-testid={`project-${project.id}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-medical-blue-100 dark:bg-medical-blue-900/50 rounded-lg flex items-center justify-center">
                              <Code className="w-5 h-5 text-medical-blue-600 dark:text-medical-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{project.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{project.type || 'Healthcare App'}</p>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary"
                            className={project.status === 'active' || project.status === 'deployed'
                              ? 'bg-trust-green-100 text-trust-green-700 dark:bg-trust-green-900/50 dark:text-trust-green-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
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
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="font-medium text-slate-900 dark:text-white mb-1">No projects yet</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Get started by creating your first healthcare app
                      </p>
                      <Link href="/app-builder">
                        <Button className="bg-medical-blue-500 hover:bg-medical-blue-600" data-testid="create-first-project">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First App
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">Your Stats</CardTitle>
                  <CardDescription>Activity overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-medical-blue-100 dark:bg-medical-blue-900/50 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-medical-blue-600 dark:text-medical-blue-400" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-300">Total Projects</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="stat-projects">
                      {statsLoading ? "..." : userStats?.totalProjects || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-trust-green-100 dark:bg-trust-green-900/50 rounded-lg flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-trust-green-600 dark:text-trust-green-400" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-300">Deployments</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="stat-deployments">
                      {statsLoading ? "..." : userStats?.deploymentsCount || 0}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2 text-sm">
                      <Shield className="w-4 h-4 text-trust-green-500" />
                      <span className="text-trust-green-600 dark:text-trust-green-400 font-medium">
                        All apps HIPAA compliant
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-medical-blue-500 to-medical-blue-600 text-white border-0">
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
                      className="bg-white text-medical-blue-600 hover:bg-white/90"
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
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer" data-testid="tool-code-editor">
                  <CardContent className="p-5 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">Code Editor</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Write and edit code</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/preview">
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer" data-testid="tool-preview">
                  <CardContent className="p-5 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">Preview</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Test your application</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/hipaa-tools">
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer" data-testid="tool-hipaa">
                  <CardContent className="p-5 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-trust-green-100 dark:bg-trust-green-900/50 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-trust-green-600 dark:text-trust-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">HIPAA Tools</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Compliance scanning</p>
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
