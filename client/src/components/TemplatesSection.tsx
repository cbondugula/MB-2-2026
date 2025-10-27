import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";

interface Template {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  isHipaaCompliant?: boolean;
}

export default function TemplatesSection() {
  const { isAuthenticated } = useAuth();

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">HIPAA-Compliant Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4">
                <div className="w-full h-32 bg-slate-200 rounded-lg mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-slate-200 rounded w-full animate-pulse"></div>
                  <div className="flex space-x-2">
                    <div className="h-5 bg-slate-200 rounded w-12 animate-pulse"></div>
                    <div className="h-5 bg-slate-200 rounded w-12 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default templates if no data from API
  const defaultTemplates = [
    {
      id: 1,
      name: "EHR Integration",
      description: "Connect with major EHR systems securely",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "FHIR"],
      isHipaaCompliant: true,
    },
    {
      id: 2,
      name: "Telemedicine Platform",
      description: "Video consultations with secure messaging",
      imageUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "WebRTC"],
      isHipaaCompliant: true,
    },
    {
      id: 3,
      name: "Patient Portal",
      description: "Self-service portal for patient management",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "Mobile"],
      isHipaaCompliant: true,
    },
    {
      id: 4,
      name: "Lab Results Management",
      description: "Secure lab data processing and reporting",
      imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      tags: ["HIPAA", "HL7"],
      isHipaaCompliant: true,
    },
  ];

  const displayTemplates: Template[] = templates || defaultTemplates;

  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-slate-900">HIPAA-Compliant Templates</CardTitle>
          <Link href="/templates">
            <a className="text-medical-blue-500 hover:text-medical-blue-600 text-sm font-medium">
              View All
            </a>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayTemplates.slice(0, 4).map((template: Template) => (
            <div 
              key={template.id} 
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <img 
                src={template.imageUrl} 
                alt={template.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-slate-900 mb-2">{template.name}</h3>
              <p className="text-sm text-slate-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {template.tags?.map((tag: string) => (
                    <Badge 
                      key={tag}
                      variant="secondary" 
                      className={
                        tag === "HIPAA" 
                          ? "bg-trust-green-100 text-trust-green-600" 
                          : "bg-medical-blue-100 text-medical-blue-600"
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="text-medical-blue-500 hover:text-medical-blue-600">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
