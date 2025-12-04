import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Shield, 
  FileText, 
  Database,
  Plus
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

export default function Templates() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  return (
    <PageLayout 
      title="Healthcare Templates" 
      description="Choose from our collection of HIPAA-compliant healthcare application templates"
      isLoading={isLoading || templatesLoading}
    >
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            className="pl-10 bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-templates"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-900 border-gray-800 text-gray-100">
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
        {filteredTemplates.map((template: HealthcareTemplate) => (
          <Card key={template.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors" data-testid={`template-card-${template.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <Database className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                    <Badge className="mt-1 bg-gray-800 text-gray-300 border-gray-700">{template.category}</Badge>
                  </div>
                </div>
                {template.isHipaaCompliant && (
                  <Shield className="w-5 h-5 text-emerald-400" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags?.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-700 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" 
                data-testid={`button-use-template-${template.id}`}
                onClick={() => {
                  toast({
                    title: "Template Selected",
                    description: `Using ${template.name} template for your new project.`,
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
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
    </PageLayout>
  );
}
