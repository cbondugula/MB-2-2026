import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Stethoscope, 
  Video, 
  FileText, 
  FlaskConical, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  Clock,
  Users
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface UseCaseOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  estimatedTime: string;
  complexity: "beginner" | "intermediate" | "advanced";
  features: string[];
}

const USE_CASES: UseCaseOption[] = [
  {
    id: "patient-portal",
    title: "Patient Portal",
    description: "Build a secure patient-facing app with appointments, records access, and messaging",
    icon: Users,
    estimatedTime: "5 min",
    complexity: "beginner",
    features: ["HIPAA compliant", "Patient scheduling", "Secure messaging", "Document upload"]
  },
  {
    id: "telehealth",
    title: "Telehealth Platform",
    description: "Create a video consultation system with waiting rooms and documentation",
    icon: Video,
    estimatedTime: "10 min",
    complexity: "intermediate",
    features: ["Video calls", "Virtual waiting room", "E-prescribing", "Visit notes"]
  },
  {
    id: "clinical-workflow",
    title: "Clinical Workflow",
    description: "Design clinical decision support and documentation workflows",
    icon: Stethoscope,
    estimatedTime: "8 min",
    complexity: "intermediate",
    features: ["Decision support", "Clinical notes", "Order entry", "FHIR integration"]
  },
  {
    id: "research-platform",
    title: "Research Platform",
    description: "Build a clinical research data collection and analysis platform",
    icon: FlaskConical,
    estimatedTime: "15 min",
    complexity: "advanced",
    features: ["IRB compliant", "Data collection", "Consent management", "Analytics"]
  },
  {
    id: "compliance-tool",
    title: "Compliance Dashboard",
    description: "Create a HIPAA compliance monitoring and audit tool",
    icon: Shield,
    estimatedTime: "7 min",
    complexity: "beginner",
    features: ["Audit logging", "Risk assessment", "BAA tracking", "Training modules"]
  },
  {
    id: "ehr-integration",
    title: "EHR Integration",
    description: "Build an app that connects with Epic, Cerner, or other EHR systems",
    icon: FileText,
    estimatedTime: "12 min",
    complexity: "advanced",
    features: ["Epic FHIR", "Cerner integration", "HL7 support", "Data sync"]
  }
];

interface OnboardingLaunchpadProps {
  onSelectUseCase?: (useCase: UseCaseOption) => void;
  creditsRemaining?: number;
}

export function OnboardingLaunchpad({ onSelectUseCase, creditsRemaining = 3 }: OnboardingLaunchpadProps) {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseOption | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleSelectUseCase = (useCase: UseCaseOption) => {
    setSelectedUseCase(useCase);
    setStep(2);
  };

  const handleContinue = () => {
    if (step === 2) {
      setStep(3);
    } else if (step === 3 && onSelectUseCase && selectedUseCase) {
      onSelectUseCase(selectedUseCase);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "beginner": return "bg-green-600";
      case "intermediate": return "bg-yellow-600";
      case "advanced": return "bg-orange-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Welcome to MedBuilder</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Build HIPAA-compliant healthcare apps in minutes, not months
        </p>
        
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-emerald-600' : 'bg-gray-700'}`}>
              {step > 1 ? <CheckCircle className="w-5 h-5 text-white" /> : <span className="text-white font-bold">1</span>}
            </div>
            <span className={step >= 1 ? 'text-white' : 'text-gray-500'}>Choose Use Case</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-700" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-700'}`}>
              {step > 2 ? <CheckCircle className="w-5 h-5 text-white" /> : <span className={step >= 2 ? 'text-white' : 'text-gray-400'} >2</span>}
            </div>
            <span className={step >= 2 ? 'text-white' : 'text-gray-500'}>Configure</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-700" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-emerald-600' : 'bg-gray-700'}`}>
              <span className={step >= 3 ? 'text-white' : 'text-gray-400'}>3</span>
            </div>
            <span className={step >= 3 ? 'text-white' : 'text-gray-500'}>Preview & Build</span>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {USE_CASES.map((useCase) => {
            const Icon = useCase.icon;
            return (
              <Card 
                key={useCase.id}
                className="bg-gray-800 border-gray-700 hover:border-emerald-500 transition-all cursor-pointer group"
                onClick={() => handleSelectUseCase(useCase)}
                data-testid={`usecase-${useCase.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-600/30 transition-colors">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <Badge className={`${getComplexityColor(useCase.complexity)} text-white text-xs`}>
                      {useCase.complexity}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg mt-3">{useCase.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {useCase.estimatedTime}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {useCase.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs text-gray-300 border-gray-600">
                        {feature}
                      </Badge>
                    ))}
                    {useCase.features.length > 3 && (
                      <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                        +{useCase.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {step === 2 && selectedUseCase && (
        <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <selectedUseCase.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-white">{selectedUseCase.title}</CardTitle>
                <CardDescription className="text-gray-400">Configure your app settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-white font-medium">HIPAA Compliance</p>
                    <p className="text-gray-400 text-sm">Automatic PHI safeguards enabled</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">FHIR R4 Ready</p>
                    <p className="text-gray-400 text-sm">Interoperability standards included</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Role-Based Access</p>
                    <p className="text-gray-400 text-sm">Clinician, admin, patient roles</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="border-gray-600 text-gray-300">
                Back
              </Button>
              <Button onClick={handleContinue} className="bg-emerald-600 hover:bg-emerald-700">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && selectedUseCase && (
        <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Ready to Build!
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your {selectedUseCase.title} is configured and ready
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-lg p-6 text-center">
              <p className="text-white font-medium mb-2">You have {creditsRemaining} free credits</p>
              <p className="text-gray-400 text-sm">Each AI generation uses 1 credit</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-medium">What happens next:</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  AI generates your complete application code
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Live preview opens in the workspace
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Customize and iterate with AI assistance
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Deploy with one click when ready
                </li>
              </ul>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="border-gray-600 text-gray-300">
                Back
              </Button>
              <Button 
                asChild
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href={`/templates?usecase=${selectedUseCase.id}`}>
                  Start Building
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Or{" "}
          <Link href="/templates" className="text-emerald-400 hover:underline">
            browse all templates
          </Link>
          {" "}to start from scratch
        </p>
      </div>
    </div>
  );
}
