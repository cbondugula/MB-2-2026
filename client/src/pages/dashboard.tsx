import TopNavigation from "@/components/TopNavigation";
import LeftSidebar from "@/components/LeftSidebar";
import QuickStats from "@/components/QuickStats";
import TemplatesSection from "@/components/TemplatesSection";
import ComponentsLibrary from "@/components/ComponentsLibrary";
import HIPAATools from "@/components/HIPAATools";
import APIIntegrationHub from "@/components/APIIntegrationHub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Code, Shield, Clock, Cloud } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
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

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/projects/1/activities"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-medical-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-slate-600">Loading...</p>
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
          {/* Main Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Healthcare App Builder</h1>
                <p className="text-slate-600 mt-1">Build HIPAA-compliant healthcare applications faster</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-100">
                  <Cloud className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button className="bg-trust-green-500 hover:bg-trust-green-600 text-white">
                  <Code className="w-4 h-4 mr-2" />
                  Run Preview
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <QuickStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TemplatesSection />
              </div>
              
              <div className="space-y-6">
                {/* Recent Activity */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-900">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-medical-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Code className="w-4 h-4 text-medical-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900">Updated patient form component</p>
                          <p className="text-xs text-slate-500">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-trust-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-trust-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900">HIPAA compliance check passed</p>
                          <p className="text-xs text-slate-500">4 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-healthcare-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Cloud className="w-4 h-4 text-healthcare-teal-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900">Deployed to staging environment</p>
                          <p className="text-xs text-slate-500">6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <HIPAATools />
              </div>
            </div>

            <ComponentsLibrary />
            <APIIntegrationHub />
          </div>
        </main>
      </div>
    </div>
  );
}
