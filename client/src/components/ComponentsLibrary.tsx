import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { 
  UserCheck, 
  Calendar, 
  Activity, 
  Video,
  Loader2
} from "lucide-react";

export default function ComponentsLibrary() {
  const { isAuthenticated } = useAuth();

  const { data: components, isLoading } = useQuery({
    queryKey: ["/api/components"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Healthcare Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-full animate-pulse"></div>
                    <div className="h-5 bg-slate-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default components if no data from API
  const defaultComponents = [
    {
      id: 1,
      name: "Patient Form",
      description: "HIPAA-compliant patient intake",
      icon: UserCheck,
      isVerified: true,
    },
    {
      id: 2,
      name: "Appointment Scheduler",
      description: "Smart scheduling with availability",
      icon: Calendar,
      isVerified: true,
    },
    {
      id: 3,
      name: "Vital Signs Chart",
      description: "Interactive health data visualization",
      icon: Activity,
      isVerified: true,
    },
    {
      id: 4,
      name: "Video Consultation",
      description: "Secure video calling with recording",
      icon: Video,
      isVerified: true,
    },
  ];

  const displayComponents = components || defaultComponents;

  return (
    <div className="mt-8">
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-slate-900">Healthcare Components</CardTitle>
            <Link href="/components">
              <a className="text-medical-blue-500 hover:text-medical-blue-600 text-sm font-medium">
                Browse Library
              </a>
            </Link>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayComponents.slice(0, 4).map((component) => (
              <div 
                key={component.id} 
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <component.icon className="w-6 h-6 text-medical-blue-500" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{component.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{component.description}</p>
                <Badge 
                  variant="secondary" 
                  className="bg-trust-green-100 text-trust-[#76B900]"
                >
                  Verified
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
