import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  RefreshCw,
  ExternalLink,
  Shield,
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
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
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
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Preview Refreshed",
        description: "The preview has been updated with your latest changes.",
      });
    }, 1000);
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile': return 'w-[375px]';
      case 'tablet': return 'w-[768px]';
      default: return 'w-full max-w-4xl';
    }
  };

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  const headerActions = (
    <>
      <div className="flex items-center space-x-1 bg-gray-900 rounded-lg p-1 border border-gray-800">
        <Button
          variant={viewMode === 'desktop' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('desktop')}
          className={viewMode === 'desktop' ? 'bg-[#76B900] text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'tablet' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('tablet')}
          className={viewMode === 'tablet' ? 'bg-[#76B900] text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}
        >
          <Tablet className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'mobile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('mobile')}
          className={viewMode === 'mobile' ? 'bg-[#76B900] text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
      <Button variant="outline" size="sm" className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800">
        <ExternalLink className="w-4 h-4 mr-2" />
        Open in New Tab
      </Button>
    </>
  );

  return (
    <PageLayout 
      title="Live Preview" 
      description="Test your healthcare application in different device views"
      isLoading={isLoading}
      headerActions={headerActions}
    >
      <div className="flex justify-center">
        <div className={`${getViewportClass()} transition-all duration-300`}>
          <Card className="bg-gray-900 border-gray-800 overflow-hidden">
            <CardHeader className="bg-gray-800 border-b border-gray-700 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-[#76B900]"></div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4 text-[#76B900]" />
                    <span>https://your-app.medbuilder.io</span>
                  </div>
                </div>
                <Badge className="bg-[#1a3d00]/50 text-[#8CC63F] border-[#76B900]">
                  HIPAA Compliant
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-gray-950">
              {/* Sample Preview App */}
              <div className="bg-[#76B900] text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold">HealthCare Portal</h1>
                      <p className="text-xs text-[#c8e6a5]">HIPAA Compliant</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#1a3d00]/50 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-[#76B900]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Next Appointment</p>
                          <p className="text-lg font-semibold text-white">Today 2:30 PM</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#1a3d00]/50 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-[#76B900]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Health Score</p>
                          <p className="text-lg font-semibold text-white">85/100</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#1a3d00]/50 rounded-full flex items-center justify-center">
                        <Video className="w-4 h-4 text-[#76B900]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">Telemedicine consultation completed</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#1a3d00]/50 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-[#76B900]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">New message from Dr. Smith</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#1a3d00]/50 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-[#76B900]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">Prescription refill reminder</p>
                        <p className="text-xs text-gray-500">6 hours ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
