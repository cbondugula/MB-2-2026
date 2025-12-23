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
  UserCheck,
  Puzzle
} from "lucide-react";

interface ComponentData {
  id: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  isVerified?: boolean;
  isHipaaCompliant?: boolean;
}

interface CategoryData {
  name: string;
  components?: ComponentData[];
}

interface ComponentsApiResponse {
  categories?: CategoryData[];
}

export default function Components() {
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

  const { data: componentsData, isLoading: componentsLoading } = useQuery<ComponentsApiResponse>({
    queryKey: ["/api/components/healthcare"],
    enabled: isAuthenticated,
    refetchInterval: 60000,
  });

  const categories = [
    { value: "all", label: "All Categories" },
    ...(componentsData?.categories?.map((cat: CategoryData) => ({ value: cat.name, label: cat.name })) || [])
  ];
  
  const components: ComponentData[] = componentsData?.categories?.reduce((acc: ComponentData[], category: CategoryData) => {
    return acc.concat(category.components?.map((comp: ComponentData) => ({
      ...comp,
      category: category.name
    })) || []);
  }, []) || [];

  const filteredComponents = components.filter((component: ComponentData) => {
    const matchesSearch = searchTerm === "" || 
      component.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  return (
    <PageLayout 
      title="Healthcare Components" 
      description="Build faster with our library of HIPAA-compliant healthcare UI components"
      isLoading={isLoading || componentsLoading}
    >
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search components..."
            className="pl-10 bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-[#76B900]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-components"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-900 border-gray-800 text-gray-100">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-800">
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value} className="text-gray-100 focus:bg-gray-800">
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map((component: ComponentData) => (
          <Card key={component.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors" data-testid={`component-card-${component.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <UserCheck className="w-5 h-5 text-[#76B900]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{component.name}</CardTitle>
                    <Badge className="mt-1 bg-gray-800 text-gray-300 border-gray-700">{component.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {component.isVerified && (
                    <Badge className="text-xs bg-[#1a3d00]/50 text-[#8CC63F] border-[#76B900]">
                      Verified
                    </Badge>
                  )}
                  {component.isHipaaCompliant && (
                    <Shield className="w-4 h-4 text-[#76B900]" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {component.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                {component.tags?.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-700 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800"
                  onClick={() => {
                    toast({
                      title: "Preview Component",
                      description: `Previewing ${component.name} component.`,
                    });
                  }}
                >
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-[#76B900] hover:bg-[#76B900] text-white"
                  onClick={() => {
                    toast({
                      title: "Component Added",
                      description: `${component.name} added to your project.`,
                    });
                  }}
                >
                  Add to Project
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-16">
          <Puzzle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No components found</h3>
          <p className="text-gray-400">
            Try adjusting your search criteria or browse all categories.
          </p>
        </div>
      )}
    </PageLayout>
  );
}
