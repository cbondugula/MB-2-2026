import { useState, useEffect } from "react";
import TopNavigation from "@/components/TopNavigation";
import LeftSidebar from "@/components/LeftSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
// Note: Textarea import removed as it's not available in current setup
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Stethoscope, 
  Shield, 
  Database, 
  Globe, 
  Brain, 
  Mic,
  Zap,
  FileText,
  Activity,
  Heart,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  Play,
  Code,
  Eye,
  Download,
  Sparkles
} from "lucide-react";

export default function HealthcareAppBuilder() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [selectedStack, setSelectedStack] = useState("react-node");
  const [selectedCompliance, setSelectedCompliance] = useState("hipaa");
  const [buildingApp, setBuildingApp] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to build healthcare applications.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch available healthcare templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/templates/healthcare-builder"],
    enabled: isAuthenticated,
  });

  // Fetch healthcare stacks
  const { data: stacks, isLoading: stacksLoading } = useQuery({
    queryKey: ["/api/healthcare/stacks"],
    enabled: isAuthenticated,
  });

  // Build healthcare app mutation
  const buildAppMutation = useMutation({
    mutationFn: async (appData: any) => {
      setBuildingApp(true);
      setBuildProgress(10);
      
      // Step 1: Initialize project
      const initResponse = await apiRequest("POST", "/api/healthcare/apps/initialize", {
        name: appData.appName,
        description: appData.appDescription,
        template: appData.selectedTemplate,
        stack: appData.selectedStack,
        compliance: appData.selectedCompliance,
        userId: user?.id
      }) as any;
      setBuildProgress(30);

      // Step 2: Generate HIPAA-compliant architecture
      const architectureResponse = await apiRequest("POST", "/api/healthcare/apps/architecture", {
        projectId: initResponse.projectId,
        complianceLevel: appData.selectedCompliance
      }) as any;
      setBuildProgress(50);

      // Step 3: Create database schema with medical data types
      const schemaResponse = await apiRequest("POST", "/api/healthcare/apps/schema", {
        projectId: initResponse.projectId,
        template: appData.selectedTemplate
      }) as any;
      setBuildProgress(70);

      // Step 4: Generate frontend components with medical UI patterns
      const frontendResponse = await apiRequest("POST", "/api/healthcare/apps/frontend", {
        projectId: initResponse.projectId,
        stack: appData.selectedStack
      }) as any;
      setBuildProgress(85);

      // Step 5: Implement AI-powered features
      const aiResponse = await apiRequest("POST", "/api/healthcare/apps/ai-features", {
        projectId: initResponse.projectId,
        features: ["clinical-decision-support", "medical-ner", "compliance-monitoring"]
      }) as any;
      setBuildProgress(100);

      return {
        projectId: initResponse.projectId,
        architecture: architectureResponse,
        schema: schemaResponse,
        frontend: frontendResponse,
        aiFeatures: aiResponse
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Healthcare App Built Successfully!",
        description: `Your ${appName} application is ready with HIPAA compliance and AI features.`,
      });
      setBuildingApp(false);
      setBuildProgress(0);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error: any) => {
      toast({
        title: "Build Failed",
        description: error.message || "Failed to build healthcare application",
        variant: "destructive",
      });
      setBuildingApp(false);
      setBuildProgress(0);
    },
  });

  const handleBuildApp = () => {
    if (!appName || !selectedTemplate) {
      toast({
        title: "Missing Information",
        description: "Please provide app name and select a template.",
        variant: "destructive",
      });
      return;
    }

    buildAppMutation.mutate({
      appName,
      appDescription,
      selectedTemplate,
      selectedStack,
      selectedCompliance
    });
  };

  if (templatesLoading || stacksLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <LeftSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  const availableTemplates = templates || [
    {
      id: "ehr-system",
      name: "Electronic Health Records",
      description: "Complete EHR system with patient management, medical records, and clinical workflows",
      icon: FileText,
      category: "Clinical Management"
    },
    {
      id: "telemedicine",
      name: "Telemedicine Platform",
      description: "Video consultations, appointment scheduling, and remote patient monitoring",
      icon: Heart,
      category: "Remote Care"
    },
    {
      id: "clinical-decision",
      name: "Clinical Decision Support",
      description: "AI-powered diagnostic assistance and treatment recommendations",
      icon: Brain,
      category: "AI Healthcare"
    },
    {
      id: "patient-portal",
      name: "Patient Portal",
      description: "Self-service portal for appointments, results, and communication",
      icon: Users,
      category: "Patient Engagement"
    }
  ];

  const availableStacks = stacks || [
    { id: "react-node", name: "React + Node.js", description: "Modern web application" },
    { id: "flutter-firebase", name: "Flutter + Firebase", description: "Cross-platform mobile app" },
    { id: "vue-python", name: "Vue.js + Python", description: "ML-powered healthcare app" },
    { id: "angular-dotnet", name: "Angular + .NET", description: "Enterprise healthcare system" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Healthcare App Builder</h1>
                  <p className="text-slate-600">Create HIPAA-compliant healthcare applications with AI-powered features</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-[#76B900]" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mic className="w-4 h-4 text-blue-500" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4 text-teal-500" />
                  <span>Multi-Cultural</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configuration Panel */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span>App Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Application Name</label>
                          <Input
                            placeholder="e.g., MediCare Portal"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Compliance Level</label>
                          <Select value={selectedCompliance} onValueChange={setSelectedCompliance}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select compliance" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hipaa">HIPAA (US Healthcare)</SelectItem>
                              <SelectItem value="gdpr">GDPR (EU Privacy)</SelectItem>
                              <SelectItem value="pipeda">PIPEDA (Canada)</SelectItem>
                              <SelectItem value="global">Global Compliance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Input
                          placeholder="Describe your healthcare application..."
                          value={appDescription}
                          onChange={(e) => setAppDescription(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Template Selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Choose Template</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableTemplates.map((template) => {
                          const IconComponent = template.icon;
                          return (
                            <div
                              key={template.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                selectedTemplate === template.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedTemplate(template.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                  <IconComponent className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-slate-900">{template.name}</h4>
                                  <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                                  <Badge variant="outline" className="mt-2 text-xs">
                                    {template.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Technology Stack */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Technology Stack</h3>
                      <Select value={selectedStack} onValueChange={setSelectedStack}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select technology stack" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStacks.map((stack) => (
                            <SelectItem key={stack.id} value={stack.id}>
                              {stack.name} - {stack.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Build Button */}
                    <div className="pt-4">
                      <Button
                        onClick={handleBuildApp}
                        disabled={buildingApp || !appName || !selectedTemplate}
                        className="w-full"
                        size="lg"
                      >
                        {buildingApp ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            <span>Building App... {buildProgress}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4" />
                            <span>Build Healthcare App</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Features Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>AI Features</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Brain className="w-4 h-4 text-purple-500" />
                        <span>Clinical Decision Support</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Activity className="w-4 h-4 text-[#76B900]" />
                        <span>Medical NER & Classification</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span>Compliance Monitoring</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mic className="w-4 h-4 text-orange-500" />
                        <span>Voice Commands</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <BarChart3 className="w-4 h-4 text-teal-500" />
                        <span>Healthcare Analytics</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="w-5 h-5" />
                      <span>Generated Code</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Frontend Components</span>
                        <Badge variant="outline">Auto-generated</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>API Endpoints</span>
                        <Badge variant="outline">HIPAA Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Database Schema</span>
                        <Badge variant="outline">Medical Data Types</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Authentication</span>
                        <Badge variant="outline">Multi-factor</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {buildingApp && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Play className="w-5 h-5" />
                        <span>Build Progress</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${buildProgress}%` }}
                          />
                        </div>
                        <div className="text-sm text-center">
                          {buildProgress < 30 && "Initializing project..."}
                          {buildProgress >= 30 && buildProgress < 50 && "Generating architecture..."}
                          {buildProgress >= 50 && buildProgress < 70 && "Creating database schema..."}
                          {buildProgress >= 70 && buildProgress < 85 && "Building frontend..."}
                          {buildProgress >= 85 && buildProgress < 100 && "Adding AI features..."}
                          {buildProgress === 100 && "App ready!"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}