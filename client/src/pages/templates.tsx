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
  FileText, 
  Video, 
  Calendar, 
  Activity,
  Database,
  Stethoscope,
  Heart,
  Plus
} from "lucide-react";

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

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/templates"],
    enabled: isAuthenticated,
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "EHR", label: "EHR Integration" },
    { value: "Telemedicine", label: "Telemedicine" },
    { value: "Patient Portal", label: "Patient Portal" },
    { value: "Lab Management", label: "Lab Management" },
    { value: "Appointment", label: "Appointment" },
    { value: "Billing", label: "Billing" },
  ];

  const defaultTemplates = [
    {
      id: 1,
      name: "EHR Integration",
      description: "Connect with major EHR systems securely",
      category: "EHR",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "FHIR", "HL7"],
      icon: Database,
      isHipaaCompliant: true,
    },
    {
      id: 2,
      name: "Telemedicine Platform",
      description: "Video consultations with secure messaging",
      category: "Telemedicine",
      imageUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "WebRTC", "Secure"],
      icon: Video,
      isHipaaCompliant: true,
    },
    {
      id: 3,
      name: "Patient Portal",
      description: "Self-service portal for patient management",
      category: "Patient Portal",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "Mobile", "Dashboard"],
      icon: FileText,
      isHipaaCompliant: true,
    },
    {
      id: 4,
      name: "Lab Results Management",
      description: "Secure lab data processing and reporting",
      category: "Lab Management",
      imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "HL7", "Analytics"],
      icon: Activity,
      isHipaaCompliant: true,
    },
    {
      id: 5,
      name: "Appointment Scheduling",
      description: "Smart scheduling with availability management",
      category: "Appointment",
      imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "Calendar", "Notifications"],
      icon: Calendar,
      isHipaaCompliant: true,
    },
    {
      id: 6,
      name: "Remote Patient Monitoring",
      description: "IoT device integration for continuous monitoring",
      category: "Monitoring",
      imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "IoT", "Real-time"],
      icon: Heart,
      isHipaaCompliant: true,
    },
    {
      id: 7,
      name: "Clinical Decision Support",
      description: "AI-powered clinical recommendations",
      category: "AI",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "AI", "Clinical"],
      icon: Stethoscope,
      isHipaaCompliant: true,
    },
    {
      id: 8,
      name: "Pharmacy Management",
      description: "Prescription management and dispensing",
      category: "Pharmacy",
      imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "Pharmacy", "Inventory"],
      icon: Plus,
      isHipaaCompliant: true,
    },
  ];

  const displayTemplates = templates || defaultTemplates;

  const filteredTemplates = displayTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-medical-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-slate-600">Loading Templates...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <TopNavigation />
      
      <div className="flex h-screen">
        <LeftSidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">HIPAA-Compliant Templates</h1>
                <p className="text-slate-600 mt-1">Pre-built templates for healthcare applications</p>
              </div>
              <Badge variant="secondary" className="bg-trust-green-100 text-trust-green-700">
                <Shield className="w-3 h-3 mr-1" />
                All Verified
              </Badge>
            </div>
          </header>

          {/* Filters */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Select category" />
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
          </div>

          {/* Templates Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-trust-green-100 text-trust-green-700">
                          <Shield className="w-3 h-3 mr-1" />
                          HIPAA
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <template.icon className="w-5 h-5 text-medical-blue-500" />
                      <CardTitle className="text-lg font-semibold text-slate-900">
                        {template.name}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-medical-blue-500 text-medical-blue-500 hover:bg-medical-blue-50"
                      >
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-medical-blue-500 hover:bg-medical-blue-600"
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates found</h3>
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
