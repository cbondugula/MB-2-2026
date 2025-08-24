import { useState, useEffect } from "react";
import TopNavigation from "@/components/TopNavigation";
import LeftSidebar from "@/components/LeftSidebar";
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
  Calendar, 
  Activity,
  Video,
  MessageSquare,
  FileText,
  BarChart3,
  Clock,
  Phone,
  CreditCard,
  Users,
  Settings,
  Bell,
  Lock
} from "lucide-react";

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

  // Fetch dynamic healthcare components from API
  const { data: componentsData, isLoading: componentsLoading } = useQuery({
    queryKey: ["/api/components/healthcare"],
    enabled: isAuthenticated,
    refetchInterval: 60000, // Refresh every minute for component updates
  });

  // Use dynamic categories and components
  const categories = [
    { value: "all", label: "All Categories" },
    ...(componentsData?.categories?.map(cat => ({ value: cat.name, label: cat.name })) || [])
  ];
  
  // Flatten components from all categories
  const components = componentsData?.categories?.reduce((acc, category) => {
    return acc.concat(category.components?.map(comp => ({
      ...comp,
      category: category.name,
      icon: UserCheck // Default icon, can be mapped from component data
    })) || []);
  }, []) || [];

  if (componentsLoading) {
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

  const filteredComponents = components.filter(component => {
    const matchesSearch = searchTerm === "" || 
      component.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Healthcare Components</h1>
              <p className="text-slate-600">Build faster with our library of HIPAA-compliant healthcare UI components</p>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search components..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComponents.map((component) => (
                <Card key={component.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <UserCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{component.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">{component.category}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {component.isVerified && (
                          <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
                            Verified
                          </Badge>
                        )}
                        {component.isHipaaCompliant && (
                          <Shield className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {component.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {component.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
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
                        className="flex-1"
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
                <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No components found</h3>
                <p className="text-slate-600">
                  Try adjusting your search criteria or browse all categories.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}