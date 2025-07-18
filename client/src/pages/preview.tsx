import { useState, useEffect } from "react";
import TopNavigation from "@/components/TopNavigation";
import LeftSidebar from "@/components/LeftSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, 
  Shield, 
  Monitor, 
  Smartphone,
  Tablet,
  Maximize2,
  RefreshCw,
  Settings,
  User,
  Calendar,
  Activity,
  Video,
  MessageSquare,
  Clock
} from "lucide-react";

export default function Preview() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [viewMode, setViewMode] = useState("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case "mobile":
        return "w-[375px] h-[667px]";
      case "tablet":
        return "w-[768px] h-[1024px]";
      default:
        return "w-full h-full";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-medical-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Eye className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-slate-600">Loading Preview...</p>
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
          {/* Preview Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-medical-blue-500" />
                  <h1 className="text-xl font-bold text-slate-900">Live Preview</h1>
                </div>
                <Badge variant="secondary" className="bg-trust-green-100 text-trust-green-700">
                  <Shield className="w-3 h-3 mr-1" />
                  HIPAA Compliant
                </Badge>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Viewport Controls */}
                <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "desktop" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("desktop")}
                    className="px-2 py-1"
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "tablet" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("tablet")}
                    className="px-2 py-1"
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "mobile" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("mobile")}
                    className="px-2 py-1"
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </header>

          {/* Preview Container */}
          <div className="flex-1 p-6 overflow-auto bg-slate-100">
            <div className="flex justify-center">
              <div className={`${getViewportClass()} bg-white rounded-lg shadow-lg overflow-hidden`}>
                <div className="h-full overflow-y-auto">
                  {/* Sample Healthcare App Preview */}
                  <div className="bg-medical-blue-500 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <h1 className="text-lg font-semibold">HealthCare Portal</h1>
                          <p className="text-xs text-medical-blue-100">HIPAA Compliant</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                        <User className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-4 space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-medical-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-medical-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Next Appointment</p>
                              <p className="text-lg font-semibold text-slate-900">Today 2:30 PM</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-trust-green-100 rounded-lg flex items-center justify-center">
                              <Activity className="w-5 h-5 text-trust-green-500" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Health Score</p>
                              <p className="text-lg font-semibold text-slate-900">85/100</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card className="border-slate-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-medical-blue-100 rounded-full flex items-center justify-center">
                            <Video className="w-4 h-4 text-medical-blue-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900">Telemedicine consultation completed</p>
                            <p className="text-xs text-slate-500">2 hours ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-trust-green-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-trust-green-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900">New message from Dr. Smith</p>
                            <p className="text-xs text-slate-500">4 hours ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-healthcare-teal-100 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-healthcare-teal-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900">Prescription refill reminder</p>
                            <p className="text-xs text-slate-500">6 hours ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Patient Form Preview */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-trust-green-500" />
                          <CardTitle>Patient Information</CardTitle>
                        </div>
                        <p className="text-sm text-slate-600">
                          This form is HIPAA-compliant and encrypted end-to-end
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              placeholder="John"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@email.com"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            className="mt-1"
                          />
                        </div>
                        
                        <Button className="w-full bg-medical-blue-500 hover:bg-medical-blue-600">
                          <User className="w-4 h-4 mr-2" />
                          Update Information
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
