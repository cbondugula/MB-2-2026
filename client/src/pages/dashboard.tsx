import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopNavigation from "@/components/TopNavigation";
import LeftSidebar from "@/components/LeftSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Code, 
  Rocket,
  FolderOpen,
  ArrowRight,
  Loader2,
  Sparkles,
  Calendar,
  FileText,
  Activity,
  Pill,
  Users,
  Stethoscope,
  Lightbulb
} from "lucide-react";

interface Project {
  id: number | string;
  name: string;
  type?: string;
  status: string;
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
    return aiSuggestions.filter(s => s.toLowerCase().includes(lower)).slice(0, 3);
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
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center pt-4">
              <h1 className="text-3xl font-bold text-white mb-2" data-testid="welcome-heading">
                What do you want to build?
              </h1>
              <p className="text-gray-400">
                Describe your healthcare app and we'll create it for you
              </p>
            </div>

            {isBuilding ? (
              <Card className="bg-gradient-to-br from-emerald-900/40 to-gray-900 border-emerald-700">
                <CardContent className="py-16 text-center">
                  <Rocket className="w-16 h-16 text-emerald-400 mx-auto mb-6 animate-bounce" />
                  <h2 className="text-2xl font-bold text-white mb-2">Building your app...</h2>
                  <p className="text-gray-400 mb-8">Setting up HIPAA compliance, generating code, configuring database</p>
                  <div className="w-full max-w-md mx-auto bg-gray-800 rounded-full h-3">
                    <div 
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${buildProgress}%` }}
                    />
                  </div>
                  <p className="text-emerald-400 mt-3 text-lg font-medium">{Math.round(buildProgress)}%</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="relative">
                  <Textarea
                    placeholder="e.g., A patient scheduling system with appointment reminders and doctor availability..."
                    value={prompt}
                    onChange={(e) => {
                      setPrompt(e.target.value);
                      setShowSuggestions(e.target.value.length >= 3);
                    }}
                    onFocus={() => prompt.length >= 3 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="bg-gray-900 border-gray-700 text-white min-h-[140px] text-lg placeholder:text-gray-500 rounded-xl p-5"
                    data-testid="input-prompt"
                  />
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-10 overflow-hidden">
                      {filteredSuggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          className="w-full text-left px-5 py-4 hover:bg-gray-800 text-gray-300 hover:text-white flex items-center gap-3 border-b border-gray-800 last:border-0"
                          onMouseDown={() => handleSuggestionClick(suggestion)}
                        >
                          <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-center mt-4">
                    <Button 
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-6 text-lg rounded-xl"
                      onClick={handleBuild}
                      disabled={!prompt.trim()}
                      data-testid="button-build"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Build My App
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-gray-500 text-sm text-center mb-4">Or start with a template:</p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {quickStarts.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => handleQuickStart(item)}
                          className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-emerald-600 hover:bg-gray-800 transition-all text-center group"
                          data-testid={`button-template-${item.label.toLowerCase()}`}
                        >
                          <Icon className="w-6 h-6 text-gray-500 group-hover:text-emerald-400 mx-auto mb-2" />
                          <span className="text-white text-sm font-medium block">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {projects && projects.length > 0 && !isBuilding && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-lg text-white">Your Projects</CardTitle>
                  <Link href="/my-apps">
                    <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-gray-800" data-testid="view-all-projects">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {projects.slice(0, 3).map((project) => (
                      <div 
                        key={project.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
                        onClick={() => navigate(`/workspace/${project.id}`)}
                        data-testid={`project-${project.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                            <Code className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{project.name}</p>
                            <p className="text-sm text-gray-400">{project.type || 'Healthcare App'}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {(!projects || projects.length === 0) && !isBuilding && (
              <div className="text-center pt-8">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500">No projects yet. Describe what you want to build above!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
