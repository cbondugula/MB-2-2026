import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { 
  FolderOpen, 
  Shield, 
  Puzzle, 
  Clock,
  Loader2
} from "lucide-react";

export default function QuickStats() {
  const { isAuthenticated } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                  <div className="h-6 bg-slate-200 rounded w-12 animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const defaultStats = {
    activeProjects: 3,
    compliantApps: 100,
    componentsUsed: 24,
    timeSaved: 85,
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-medical-blue-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Active Projects</p>
              <p className="text-2xl font-bold text-slate-900">{displayStats.activeProjects}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-trust-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-trust-green-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600">HIPAA Compliant</p>
              <p className="text-2xl font-bold text-slate-900">{displayStats.compliantApps}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-healthcare-teal-100 rounded-lg flex items-center justify-center">
              <Puzzle className="w-6 h-6 text-healthcare-teal-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Components Used</p>
              <p className="text-2xl font-bold text-slate-900">{displayStats.componentsUsed}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Time Saved</p>
              <p className="text-2xl font-bold text-slate-900">{displayStats.timeSaved}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
