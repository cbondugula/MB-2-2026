import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TopNavigation from "@/components/TopNavigation";
import LeftSidebar from "@/components/LeftSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Code, 
  Shield, 
  Rocket,
  FolderOpen,
  ArrowRight,
  CheckCircle,
  Clock,
  Loader2,
  Sparkles,
  Calendar,
  FileText,
  Activity,
  Pill,
  Users,
  Stethoscope,
  Lock,
  Network,
  HelpCircle,
  Lightbulb,
  BarChart3
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

const quickStarts = [
  { icon: Calendar, label: 'Scheduler', prompt: 'Build a patient appointment scheduling system with calendar view and reminders' },
  { icon: Users, label: 'Portal', prompt: 'Create a patient portal with login, medical records view, and appointment booking' },
  { icon: Activity, label: 'Telehealth', prompt: 'Build a telehealth app with video consultations and waiting room' },
  { icon: FileText, label: 'Intake', prompt: 'Create digital patient intake forms with medical history and insurance info' },
  { icon: Pill, label: 'Pharmacy', prompt: 'Build a pharmacy management system with prescription tracking' },
  { icon: Stethoscope, label: 'Lab Results', prompt: 'Create a lab results portal where patients can view their test results' },
];

const aiSuggestions = [
  "Build a patient appointment scheduling system",
  "Create a telehealth video consultation app",
  "Design a medication reminder app",
  "Build an electronic health records viewer",
  "Create a clinical trial management system",
  "Design a patient intake form system",
  "Build a lab results notification portal",
  "Create a healthcare staff scheduling app",
  "Design a prescription management system",
  "Build a remote patient monitoring dashboard",
];

const hipaaChecklist = [
  { id: 'encryption', label: 'Data Encryption', description: 'All data encrypted at rest and in transit', checked: true },
  { id: 'access', label: 'Access Controls', description: 'Role-based authentication enabled', checked: true },
  { id: 'audit', label: 'Audit Logging', description: 'All PHI access is logged', checked: true },
  { id: 'backup', label: 'Backup & Recovery', description: 'Automated backup configured', checked: true },
];

const enterpriseTools = [
  { icon: Lock, label: 'PHI Governance', href: '/phi-governance', description: 'Monitor and protect patient data' },
  { icon: Network, label: 'EHR Integration', href: '/ehr-integration', description: 'Connect to Epic, Cerner, Allscripts' },
  { icon: Shield, label: 'Compliance Hub', href: '/compliance-hub', description: 'HIPAA automation & audits' },
  { icon: BarChart3, label: 'Executive Intel', href: '/executive-intelligence', description: 'Analytics & insights' },
];

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, navigate] = useLocation();
  const [prompt, setPrompt] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const filteredSuggestions = useMemo(() => {
    if (!prompt.trim() || prompt.length < 3) return [];
    const lower = prompt.toLowerCase();
    return aiSuggestions.filter(s => s.toLowerCase().includes(lower)).slice(0, 4);
  }, [prompt]);

  const buildMutation = useMutation({
    mutationFn: async (description: string) => {
      setIsBuilding(true);
      setBuildProgress(0);
      setShowSuggestions(false);
      
      const interval = setInterval(() => {
        setBuildProgress(p => Math.min(p + Math.random() * 20, 95));
      }, 400);

      try {
        const result = await apiRequest('/api/app-builder/build', 'POST', {
          name: description.slice(0, 30),
          description,
          type: 'custom',
          hipaaCompliant: true,
        });
        clearInterval(interval);
        setBuildProgress(100);
        return result;
      } catch (e) {
        clearInterval(interval);
        throw e;
      }
    },
    onSuccess: (data: any) => {
      toast({ title: 'App Created!', description: 'Opening your workspace...' });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsBuilding(false);
      if (data?.projectId) {
        navigate(`/workspace/${data.projectId}`);
      }
    },
    onError: () => {
      toast({ title: 'Build Failed', description: 'Please try again.', variant: 'destructive' });
      setIsBuilding(false);
      setBuildProgress(0);
    },
  });

  const handleBuild = () => {
    if (!prompt.trim()) {
      toast({ title: 'Enter a description', description: 'Tell us what you want to build.', variant: 'destructive' });
      return;
    }
    buildMutation.mutate(prompt);
  };

  const handleQuickStart = (template: typeof quickStarts[0]) => {
    setPrompt(template.prompt);
    buildMutation.mutate(template.prompt);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    setShowSuggestions(false);
  };

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

  return (
    <div className="min-h-screen bg-gray-950">
      <TopNavigation />
      
      <div className="flex">
        <LeftSidebar />
        
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white" data-testid="welcome-heading">
                  Welcome back, {user?.firstName || 'Developer'}
                </h1>
                <p className="text-gray-400 mt-1">
                  Build HIPAA-compliant healthcare apps with AI
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-emerald-900/50 border border-emerald-700 text-emerald-300 cursor-help">
                    <Shield className="w-3 h-3 mr-1" />
                    HIPAA Compliant
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-700 text-white max-w-xs">
                  <p>All apps built with MedBuilder include encryption, access controls, and audit logging</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {isBuilding ? (
              <Card className="bg-gradient-to-br from-emerald-900/40 to-gray-900 border-emerald-700">
                <CardContent className="py-12 text-center">
                  <Rocket className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-2xl font-bold text-white mb-2">Building your app...</h2>
                  <p className="text-gray-400 mb-6">Setting up HIPAA compliance, generating code, configuring database</p>
                  <div className="w-full max-w-md mx-auto bg-gray-800 rounded-full h-3">
                    <div 
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${buildProgress}%` }}
                    />
                  </div>
                  <p className="text-emerald-400 mt-2">{Math.round(buildProgress)}%</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        <span className="text-gray-300 font-medium">What do you want to build?</span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-700 text-white max-w-xs">
                          <p>Describe your healthcare app in plain English. AI will generate the code with HIPAA compliance built-in.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <Textarea
                        placeholder="Describe your healthcare app... e.g., 'A patient scheduling system with appointment reminders'"
                        value={prompt}
                        onChange={(e) => {
                          setPrompt(e.target.value);
                          setShowSuggestions(e.target.value.length >= 3);
                        }}
                        onFocus={() => prompt.length >= 3 && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="bg-gray-800 border-gray-700 text-white min-h-[100px] text-lg placeholder:text-gray-500"
                        data-testid="input-prompt"
                      />
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                          {filteredSuggestions.map((suggestion, i) => (
                            <button
                              key={i}
                              className="w-full text-left px-4 py-3 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                              onMouseDown={() => handleSuggestionClick(suggestion)}
                            >
                              <Lightbulb className="w-4 h-4 text-emerald-400" />
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button 
                        size="lg"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-8"
                        onClick={handleBuild}
                        disabled={!prompt.trim()}
                        data-testid="button-build"
                      >
                        <Rocket className="w-5 h-5 mr-2" />
                        Build App
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-3">Quick start:</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {quickStarts.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Tooltip key={item.label}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleQuickStart(item)}
                              className="p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-emerald-600 hover:bg-gray-800 transition-all text-center group"
                              data-testid={`button-template-${item.label.toLowerCase()}`}
                            >
                              <Icon className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 mx-auto mb-1" />
                              <span className="text-white text-xs font-medium block">{item.label}</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                            <p>{item.prompt}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg text-white">Recent Projects</CardTitle>
                      <CardDescription className="text-gray-400">Continue where you left off</CardDescription>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {projects.slice(0, 4).map((project) => (
                          <div 
                            key={project.id}
                            className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer border border-gray-800 hover:border-gray-700"
                            onClick={() => navigate(`/workspace/${project.id}`)}
                            data-testid={`project-${project.id}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                                <Code className="w-4 h-4 text-emerald-400" />
                              </div>
                              <Badge 
                                className={project.status === 'active' || project.status === 'deployed'
                                  ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700 text-xs'
                                  : 'bg-gray-700 text-gray-300 border border-gray-600 text-xs'
                                }
                              >
                                {project.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                {project.status}
                              </Badge>
                            </div>
                            <p className="font-medium text-white truncate">{project.name}</p>
                            <p className="text-sm text-gray-400 truncate">{project.type || 'Healthcare App'}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FolderOpen className="w-6 h-6 text-gray-500" />
                        </div>
                        <h3 className="font-medium text-white mb-1">No projects yet</h3>
                        <p className="text-sm text-gray-400">
                          Describe what you want to build above
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-3">Enterprise Tools:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {enterpriseTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link key={tool.href} href={tool.href}>
                          <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-emerald-600 hover:bg-gray-800 transition-all cursor-pointer group">
                            <Icon className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 mb-2" />
                            <p className="text-white text-sm font-medium">{tool.label}</p>
                            <p className="text-gray-500 text-xs truncate">{tool.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Card className="bg-gray-900 border-gray-800 h-fit">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    HIPAA Checklist
                  </CardTitle>
                  <CardDescription className="text-gray-400">Your compliance status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hipaaChecklist.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.checked ? 'bg-emerald-900/50' : 'bg-gray-800'}`}>
                        <CheckCircle className={`w-3 h-3 ${item.checked ? 'text-emerald-400' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{item.label}</p>
                        <p className="text-gray-500 text-xs">{item.description}</p>
                      </div>
                    </div>
                  ))}
                  <Link href="/compliance-hub">
                    <Button variant="outline" size="sm" className="w-full mt-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                      View Full Report
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
