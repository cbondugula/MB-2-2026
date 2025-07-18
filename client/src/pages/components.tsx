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

  const { data: components, isLoading: componentsLoading } = useQuery({
    queryKey: ["/api/components"],
    enabled: isAuthenticated,
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Forms", label: "Forms" },
    { value: "Charts", label: "Charts & Analytics" },
    { value: "Communication", label: "Communication" },
    { value: "Scheduling", label: "Scheduling" },
    { value: "Monitoring", label: "Monitoring" },
    { value: "Navigation", label: "Navigation" },
    { value: "Security", label: "Security" },
  ];

  const defaultComponents = [
    {
      id: 1,
      name: "Patient Form",
      description: "HIPAA-compliant patient intake form with validation",
      category: "Forms",
      icon: UserCheck,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Form", "Validation", "HIPAA"],
    },
    {
      id: 2,
      name: "Appointment Scheduler",
      description: "Smart scheduling with availability management",
      category: "Scheduling",
      icon: Calendar,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Calendar", "Booking", "Notifications"],
    },
    {
      id: 3,
      name: "Vital Signs Chart",
      description: "Interactive health data visualization",
      category: "Charts",
      icon: Activity,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Charts", "Health", "Analytics"],
    },
    {
      id: 4,
      name: "Video Consultation",
      description: "Secure video calling with recording",
      category: "Communication",
      icon: Video,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Video", "WebRTC", "Recording"],
    },
    {
      id: 5,
      name: "Secure Messaging",
      description: "Encrypted messaging between patients and providers",
      category: "Communication",
      icon: MessageSquare,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Messages", "Encryption", "Chat"],
    },
    {
      id: 6,
      name: "Medical Records Viewer",
      description: "Secure display of patient medical records",
      category: "Navigation",
      icon: FileText,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Records", "Display", "Security"],
    },
    {
      id: 7,
      name: "Health Analytics Dashboard",
      description: "Comprehensive health metrics dashboard",
      category: "Charts",
      icon: BarChart3,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Analytics", "Dashboard", "Metrics"],
    },
    {
      id: 8,
      name: "Prescription Timer",
      description: "Medication reminder and tracking component",
      category: "Monitoring",
      icon: Clock,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Medication", "Reminders", "Tracking"],
    },
    {
      id: 9,
      name: "Emergency Contact",
      description: "Quick access to emergency contacts and services",
      category: "Communication",
      icon: Phone,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Emergency", "Contact", "Quick Access"],
    },
    {
      id: 10,
      name: "Payment Processing",
      description: "HIPAA-compliant payment processing widget",
      category: "Forms",
      icon: CreditCard,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Payment", "Billing", "PCI DSS"],
    },
    {
      id: 11,
      name: "Provider Directory",
      description: "Searchable directory of healthcare providers",
      category: "Navigation",
      icon: Users,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Directory", "Search", "Providers"],
    },
    {
      id: 12,
      name: "Access Control Panel",
      description: "Role-based access control management",
      category: "Security",
      icon: Lock,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Access", "Security", "Roles"],
    },
    {
      id: 13,
      name: "Notification Center",
      description: "Healthcare-specific notification system",
      category: "Communication",
      icon: Bell,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Notifications", "Alerts", "System"],
    },
    {
      id: 14,
      name: "Settings Panel",
      description: "HIPAA-compliant settings and preferences",
      category: "Navigation",
      icon: Settings,
      isVerified: true,
      isHipaaCompliant: true,
      tags: ["Settings", "Preferences", "Configuration"],
    },
  ];

  const displayComponents = components || defaultComponents;

  const filteredComponents = displayComponents.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-medical-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-slate-600">Loading Components...</p>
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
                <h1 className="text-2xl font-bold text-slate-900">Healthcare Components</h1>
                <p className="text-slate-600 mt-1">Pre-built, verified components for healthcare applications</p>
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
                  placeholder="Search components..."
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

          {/* Components Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredComponents.map((component) => (
                <Card key={component.id} className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center">
                        <component.icon className="w-6 h-6 text-medical-blue-500" />
                      </div>
                      <Badge variant="secondary" className="bg-trust-green-100 text-trust-green-700">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {component.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {component.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {component.tags.map((tag) => (
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
