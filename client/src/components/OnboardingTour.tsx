import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, ArrowRight, ArrowLeft, CheckCircle, Sparkles, FileText, Shield, Rocket } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  tips: string[];
  action?: {
    label: string;
    href: string;
  };
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to MedBuilder!",
    description: "The most advanced AI-powered healthcare application development platform. Let's get you started in under 2 minutes.",
    icon: Sparkles,
    tips: [
      "Build HIPAA-compliant healthcare apps with AI",
      "Voice-controlled development capabilities",
      "Pre-built templates for common medical applications",
      "Production-ready with built-in security"
    ]
  },
  {
    id: "chat-to-code",
    title: "Chat-to-Code Interface",
    description: "Describe your healthcare app idea in plain English, and our AI will generate production-ready code instantly.",
    icon: Sparkles,
    tips: [
      'Try: "Create a patient portal with appointment booking"',
      'Or: "Build a telehealth platform with video consultations"',
      "AI generates complete React apps with backend APIs",
      "Real-time code preview as you chat"
    ],
    action: {
      label: "Try Chat-to-Code",
      href: "/"
    }
  },
  {
    id: "templates",
    title: "Healthcare App Templates",
    description: "Start faster with 14+ pre-built healthcare templates covering EHR, telehealth, lab management, and more.",
    icon: FileText,
    tips: [
      "All templates are HIPAA-compliant by default",
      "Customizable to match your exact requirements",
      "Includes popular healthcare integrations (FHIR, HL7)",
      "Mobile-responsive and production-ready"
    ],
    action: {
      label: "Browse Templates",
      href: "/templates"
    }
  },
  {
    id: "hipaa-compliance",
    title: "Built-in HIPAA Compliance",
    description: "Every app includes automatic HIPAA compliance checks, PHI encryption, and audit logging.",
    icon: Shield,
    tips: [
      "Automatic encryption for all patient data (PHI)",
      "Comprehensive audit trails for compliance",
      "Regular security scanning and vulnerability checks",
      "FDA and SOC2 compliance support"
    ],
    action: {
      label: "View HIPAA Tools",
      href: "/hipaa-tools"
    }
  },
  {
    id: "ready",
    title: "You're All Set!",
    description: "Start building your healthcare application now. Need help? Check our documentation or contact support.",
    icon: Rocket,
    tips: [
      "View example prompts for inspiration",
      "Explore advanced AI features for medical domains",
      "Access 50+ pre-built healthcare components",
      "Deploy to production with one click"
    ]
  }
];

interface OnboardingTourProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const step = onboardingSteps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete?.();
    localStorage.setItem('medbuilder_onboarding_completed', 'true');
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip?.();
    localStorage.setItem('medbuilder_onboarding_completed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="onboarding-overlay">
      <Card className="max-w-2xl w-full shadow-2xl border-2 border-blue-400">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-blue-500 text-white">
              Step {currentStep + 1} of {onboardingSteps.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              data-testid="button-skip-tour"
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Skip Tour
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                {step.title}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                {step.description}
              </CardDescription>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-2" />
        </CardHeader>

        <CardContent className="pt-6 pb-6">
          <div className="space-y-3 mb-6">
            {step.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#76B900] flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">{tip}</p>
              </div>
            ))}
          </div>

          {step.action && (
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Ready to try it out?
              </p>
              <Button
                className="w-full"
                data-testid={`button-action-${step.id}`}
                onClick={() => {
                  if (step.id === 'chat-to-code') {
                    localStorage.setItem('openChatInterface', 'true');
                  }
                  window.location.href = step.action!.href;
                }}
              >
                {step.action.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              data-testid="button-previous"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : index < currentStep
                      ? 'bg-[#76B900]'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              data-testid="button-next"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  Get Started
                  <Rocket className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
