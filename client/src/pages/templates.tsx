import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Search, 
  Shield, 
  FileText, 
  Database,
  Loader2,
  Rocket,
  Calendar,
  Users,
  Activity,
  Pill,
  Stethoscope,
  Eye
} from "lucide-react";

interface HealthcareTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  healthcareDomain?: string;
  framework?: string;
  backend?: string;
  projectType?: string;
  complianceLevel?: string;
  imageUrl?: string;
  isHipaaCompliant: boolean;
  tags?: string[];
}

interface TemplatesApiResponse {
  templates: HealthcareTemplate[];
  categories: string[];
}

const categoryIcons: Record<string, any> = {
  'Patient Portal': Users,
  'Telehealth': Activity,
  'Scheduling': Calendar,
  'EHR': FileText,
  'Pharmacy': Pill,
  'Lab Management': Stethoscope,
  'Research': Database,
  'default': Database,
};

const previewImages: Record<string, string> = {
  'Patient Portal': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
  'Telehealth': 'https://images.unsplash.com/photo-1588534331122-77ee8581e96f?w=600&h=400&fit=crop',
  'Scheduling': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
  'EHR': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
  'Pharmacy': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&h=400&fit=crop',
  'Lab Management': 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
};

export default function Templates() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<HealthcareTemplate | null>(null);
  const [clinicName, setClinicName] = useState("");
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);

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

  const { data: templatesData, isLoading: templatesLoading } = useQuery<TemplatesApiResponse>({
    queryKey: ["/api/templates/healthcare"],
    enabled: isAuthenticated,
    refetchInterval: 60000,
  });

  const createProjectMutation = useMutation({
    mutationFn: async ({ templateId, clinicName }: { templateId: number; clinicName: string }) => {
      setIsBuilding(true);
      setBuildProgress(0);

      const interval = setInterval(() => {
        setBuildProgress(p => Math.min(p + Math.random() * 15, 95));
      }, 300);

      try {
        const response = await apiRequest('/api/app-builder/build', 'POST', {
          templateId,
          clinicName,
          name: clinicName,
          hipaaCompliant: true,
        });
        clearInterval(interval);
        setBuildProgress(100);
        return await response.json();
      } catch (e) {
        clearInterval(interval);
        throw e;
      }
    },
    onSuccess: (data: any) => {
      toast({
        title: "App Created!",
        description: "Opening your workspace with fully working code...",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setShowCustomizeModal(false);
      setIsBuilding(false);
      if (data?.projectId) {
        setLocation(`/workspace/${data.projectId}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project from template",
        variant: "destructive",
      });
      setIsBuilding(false);
      setBuildProgress(0);
    }
  });

  const handleSelectTemplate = (template: HealthcareTemplate) => {
    setSelectedTemplate(template);
    setClinicName("");
    setShowCustomizeModal(true);
  };

  const handleCreateProject = () => {
    if (!selectedTemplate) return;
    if (!clinicName.trim()) {
      toast({
        title: "Enter a name",
        description: "Please provide a name for your clinic or practice",
        variant: "destructive",
      });
      return;
    }
    createProjectMutation.mutate({ templateId: selectedTemplate.id, clinicName });
  };

  const categories = templatesData?.categories?.map((cat: string) => ({ value: cat, label: cat })) || [
    { value: "all", label: "All Categories" }
  ];
  
  const templates = templatesData?.templates || [];

  const filteredTemplates = templates.filter((template: HealthcareTemplate) => {
    const matchesSearch = searchTerm === "" || 
      template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  const getIcon = (category: string) => {
    return categoryIcons[category] || categoryIcons['default'];
  };

  const getPreview = (template: HealthcareTemplate) => {
    return template.imageUrl || previewImages[template.category] || previewImages['default'];
  };

  return (
    <PageLayout 
      title="Healthcare Templates" 
      description="Choose a template, customize it, and get working code instantly"
      isLoading={isLoading || templatesLoading}
    >
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            className="pl-10 bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-[#76B900]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-templates"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-900 border-gray-800 text-gray-100" data-testid="select-category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-800">
            <SelectItem value="all" className="text-gray-100 focus:bg-gray-800">All Categories</SelectItem>
            {categories.map((category: { value: string; label: string }) => (
              <SelectItem key={category.value} value={category.value} className="text-gray-100 focus:bg-gray-800">
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template: HealthcareTemplate) => {
          const Icon = getIcon(template.category);
          return (
            <Card 
              key={template.id} 
              className="bg-gray-900 border-gray-800 hover:border-[#76B900] transition-all cursor-pointer group overflow-hidden" 
              data-testid={`template-card-${template.id}`}
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={getPreview(template)} 
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <Badge className="bg-[#76B900] text-white">{template.category}</Badge>
                  {template.isHipaaCompliant && (
                    <Badge className="bg-blue-600 text-white flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      HIPAA
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <Icon className="w-5 h-5 text-[#76B900]" />
                  </div>
                  <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {template.tags?.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-700 text-gray-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    size="sm"
                    className="bg-[#76B900] hover:bg-[#76B900] text-white opacity-0 group-hover:opacity-100 transition-opacity" 
                    data-testid={`button-use-template-${template.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template);
                    }}
                  >
                    <Rocket className="w-4 h-4 mr-1" />
                    Use
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No templates found</h3>
          <p className="text-gray-400">
            Try adjusting your search criteria or browse all categories.
          </p>
        </div>
      )}

      <Dialog open={showCustomizeModal} onOpenChange={setShowCustomizeModal}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-lg">
          {isBuilding ? (
            <div className="py-8 text-center">
              <Rocket className="w-16 h-16 text-[#76B900] mx-auto mb-6 animate-bounce" />
              <h2 className="text-xl font-bold text-white mb-2">Building Your App...</h2>
              <p className="text-gray-400 mb-6">Generating HIPAA-compliant code, configuring database, setting up security</p>
              <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
                <div 
                  className="bg-[#76B900] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${buildProgress}%` }}
                />
              </div>
              <p className="text-[#76B900] font-medium">{Math.round(buildProgress)}%</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-white text-xl flex items-center gap-3">
                  {selectedTemplate && (() => {
                    const Icon = getIcon(selectedTemplate.category);
                    return <Icon className="w-6 h-6 text-[#76B900]" />;
                  })()}
                  {selectedTemplate?.name}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {selectedTemplate?.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {selectedTemplate && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={getPreview(selectedTemplate)} 
                      alt={selectedTemplate.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What's the name of your clinic or practice?
                  </label>
                  <Input
                    placeholder="e.g., Sunrise Medical Center"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-clinic-name"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Your app will be personalized with this name
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {selectedTemplate?.tags?.map((tag, i) => (
                    <Badge key={i} className="bg-gray-800 text-gray-300 border border-gray-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => setShowCustomizeModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-[#76B900] hover:bg-[#76B900] text-white"
                  onClick={handleCreateProject}
                  disabled={!clinicName.trim()}
                  data-testid="button-create-project"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Create My App
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
