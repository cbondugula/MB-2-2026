import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AICodeEditor } from "@/components/ui/ai-code-editor";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Brain, 
  Rocket, 
  Shield, 
  Zap, 
  Users,
  FileCode,
  Database,
  Cloud,
  Settings,
  Activity,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Code2,
  GitBranch,
  Globe
} from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  isHipaaCompliant: boolean;
  code: any;
  createdAt: string;
}

interface AdvancedTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  complexity: string;
  complianceLevel: string;
  techStack: string[];
  estimatedTime: number;
  rating: number;
  downloadCount: number;
}

export default function AIWorkspace() {
  const { user, isAuthenticated } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AdvancedTemplate | null>(null);
  const [aiAssistantActive, setAiAssistantActive] = useState(true);
  const [activeFile, setActiveFile] = useState("index.tsx");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  // Fetch advanced templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/advanced-templates"],
    queryFn: () => apiRequest("/api/advanced-templates", "GET"),
  });

  // Fetch AI sessions for insights
  const { data: aiSessions = [] } = useQuery({
    queryKey: ["/api/ai/sessions"],
    queryFn: () => apiRequest("/api/ai/sessions", "GET"),
    enabled: isAuthenticated,
  });

  // Create new project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: { name: string; description: string; templateId?: number }) => {
      return apiRequest("/api/projects", "POST", projectData);
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setSelectedProject(newProject);
      toast({
        title: "Project Created",
        description: "Your new healthcare project is ready for development.",
      });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Unable to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Architecture review mutation
  const architectureReviewMutation = useMutation({
    mutationFn: async (data: { projectStructure: any; requirements: string[]; complianceLevel: string }) => {
      return apiRequest("/api/ai/architecture-review", "POST", data);
    },
    onSuccess: (review) => {
      toast({
        title: "Architecture Review Complete",
        description: `Overall score: ${review.overallScore}/100`,
      });
    },
  });

  const handleCreateProject = async (templateId?: number) => {
    const template = templates.find((t: AdvancedTemplate) => t.id === templateId);
    await createProjectMutation.mutateAsync({
      name: template ? `${template.name} Project` : "New Healthcare App",
      description: template ? template.description : "AI-powered healthcare application",
      templateId,
    });
  };

  const handleArchitectureReview = async () => {
    if (!selectedProject) return;
    
    await architectureReviewMutation.mutateAsync({
      projectStructure: selectedProject.code || {},
      requirements: ["HIPAA Compliance", "Scalability", "Security", "Performance"],
      complianceLevel: "hipaa",
    });
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "expert": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getComplianceColor = (level: string) => {
    switch (level) {
      case "basic": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "hipaa": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "fda": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "soc2": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">AI Workspace</h1>
        <p className="text-muted-foreground mb-6">
          Please log in to access the AI-powered development environment.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary" />
            AI Workspace
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Advanced
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Combine Replit's cloud development with Cursor-like AI intelligence for healthcare applications
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleArchitectureReview} variant="outline" disabled={!selectedProject}>
            <Brain className="h-4 w-4 mr-2" />
            AI Review
          </Button>
          <Button onClick={() => handleCreateProject()}>
            <Rocket className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* AI Insights Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">AI Suggestions</p>
                <p className="text-2xl font-bold">{aiSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">HIPAA Score</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Dev Speed</p>
                <p className="text-2xl font-bold">8.2x</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Quality Score</p>
                <p className="text-2xl font-bold">96%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedProject ? (
        /* AI Code Editor View */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                {selectedProject.name}
                {selectedProject.isHipaaCompliant && (
                  <Badge variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    HIPAA Compliant
                  </Badge>
                )}
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Select value={activeFile} onValueChange={setActiveFile}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index.tsx">index.tsx</SelectItem>
                    <SelectItem value="components/Patient.tsx">components/Patient.tsx</SelectItem>
                    <SelectItem value="utils/fhir.ts">utils/fhir.ts</SelectItem>
                    <SelectItem value="api/patients.ts">api/patients.ts</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <GitBranch className="h-4 w-4 mr-1" />
                  Branch
                </Button>
                
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-1" />
                  Deploy
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AICodeEditor
              projectId={selectedProject.id}
              fileName={activeFile}
              language="typescript"
              initialCode={`// ${activeFile} - Healthcare Application
import React, { useState } from 'react';
import { Patient, FHIRResource } from '@/types/healthcare';

// AI will provide intelligent suggestions as you type
export function PatientDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  
  // Type here for AI-powered healthcare code completion
  return (
    <div className="patient-dashboard">
      {/* Your healthcare UI components here */}
    </div>
  );
}`}
            />
          </CardContent>
        </Card>
      ) : (
        /* Project Selection and Templates */
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">
              <FileCode className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Rocket className="h-4 w-4 mr-2" />
              AI Templates
            </TabsTrigger>
            <TabsTrigger value="collaboration">
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-4"></div>
                      <div className="h-8 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))
              ) : projects.length > 0 ? (
                projects.map((project: Project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-semibold">{project.name}</h3>
                        {project.isHipaaCompliant && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            HIPAA
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          onClick={() => setSelectedProject(project)}
                          size="sm"
                        >
                          <Code2 className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full p-8 text-center">
                  <FileCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first AI-powered healthcare application
                  </p>
                  <Button onClick={() => handleCreateProject()}>
                    <Rocket className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templatesLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-4"></div>
                      <div className="h-8 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))
              ) : templates.length > 0 ? (
                templates.map((template: AdvancedTemplate) => (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-semibold">{template.name}</h3>
                        <div className="flex gap-1">
                          <Badge className={getComplexityColor(template.complexity)}>
                            {template.complexity}
                          </Badge>
                          <Badge className={getComplianceColor(template.complianceLevel)}>
                            {template.complianceLevel.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {template.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.techStack?.slice(0, 3).map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {template.techStack?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.techStack.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          ⭐ {template.rating} • {template.downloadCount} downloads
                        </div>
                        <Button
                          onClick={() => handleCreateProject(template.id)}
                          size="sm"
                          disabled={createProjectMutation.isPending}
                        >
                          <Sparkles className="h-4 w-4 mr-1" />
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full p-8 text-center">
                  <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Templates Loading</h3>
                  <p className="text-muted-foreground">
                    AI-powered healthcare templates will appear here
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="collaboration">
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Real-time Collaboration</h3>
                <p className="text-muted-foreground mb-4">
                  Invite team members to collaborate on healthcare projects with real-time editing and AI assistance
                </p>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Team Members
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}