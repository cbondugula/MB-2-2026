import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { 
  Database, 
  ArrowLeftRight, 
  Cloud,
  Loader2
} from "lucide-react";

export default function APIIntegrationHub() {
  const { isAuthenticated } = useAuth();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ["/api/integrations"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="mt-8 mb-8">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Healthcare API Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-full animate-pulse"></div>
                    <div className="h-8 bg-slate-200 rounded w-full animate-pulse mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default integrations if no data from API
  const defaultIntegrations = [
    {
      id: 1,
      name: "FHIR API",
      description: "Fast Healthcare Interoperability Resources standard",
      type: "FHIR",
      icon: Database,
      isActive: true,
    },
    {
      id: 2,
      name: "HL7 Interface",
      description: "Health Level Seven messaging standards",
      type: "HL7",
      icon: ArrowLeftRight,
      isActive: true,
    },
    {
      id: 3,
      name: "Epic API",
      description: "Integration with Epic EHR systems",
      type: "Epic",
      icon: Cloud,
      isActive: true,
    },
  ];

  const displayIntegrations = integrations || defaultIntegrations;

  return (
    <div className="mt-8 mb-8">
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg text-slate-900">Healthcare API Integrations</CardTitle>
          <p className="text-slate-600 mt-1">Pre-configured integrations for common healthcare APIs</p>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayIntegrations.slice(0, 3).map((integration) => (
              <div key={integration.id} className="border border-slate-200 rounded-lg p-6 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  integration.type === "FHIR" ? "bg-medical-blue-100" :
                  integration.type === "HL7" ? "bg-trust-green-100" :
                  "bg-healthcare-teal-100"
                }`}>
                  <integration.icon className={`text-xl ${
                    integration.type === "FHIR" ? "text-medical-blue-500" :
                    integration.type === "HL7" ? "text-trust-[#76B900]" :
                    "text-healthcare-teal-500"
                  }`} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{integration.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{integration.description}</p>
                <Button 
                  className={`w-full transition-colors ${
                    integration.type === "FHIR" ? "bg-medical-blue-500 hover:bg-medical-blue-600" :
                    integration.type === "HL7" ? "bg-trust-[#76B900] hover:bg-trust-[#76B900]" :
                    "bg-healthcare-teal-500 hover:bg-healthcare-teal-600"
                  }`}
                >
                  Configure
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
