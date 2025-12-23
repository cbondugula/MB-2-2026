import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Code, 
  Heart, 
  Brain, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Lightbulb,
  Rocket,
  Users,
  Building,
  Stethoscope,
  Globe,
  Shield,
  Clock
} from "lucide-react";

interface OnboardingProps {
  onComplete: (projectData: any) => void;
  onSkip?: () => void;
}

interface UserProfile {
  role: string;
  experience: string;
  industry: string;
  goals: string[];
  preferences: {
    interface: 'visual' | 'voice' | 'mixed';
    complexity: 'simple' | 'standard' | 'advanced';
    guidance: 'full' | 'minimal' | 'none';
  };
}

const industries = [
  { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'bg-red-500' },
  { id: 'fintech', name: 'Financial Services', icon: Building, color: 'bg-[#76B900]' },
  { id: 'education', name: 'Education', icon: Brain, color: 'bg-blue-500' },
  { id: 'ecommerce', name: 'E-commerce', icon: Globe, color: 'bg-purple-500' },
  { id: 'legal', name: 'Legal Tech', icon: Shield, color: 'bg-yellow-500' },
  { id: 'other', name: 'Other', icon: Rocket, color: 'bg-gray-500' }
];

const roles = [
  { id: 'healthcare_professional', name: 'Healthcare Professional', description: 'Doctor, Nurse, or Medical Staff' },
  { id: 'business_owner', name: 'Business Owner', description: 'Running a clinic or healthcare business' },
  { id: 'developer', name: 'Developer', description: 'Software engineer or programmer' },
  { id: 'product_manager', name: 'Product Manager', description: 'Managing product development' },
  { id: 'student', name: 'Student', description: 'Learning development or healthcare' },
  { id: 'entrepreneur', name: 'Entrepreneur', description: 'Building a new healthcare solution' }
];

const experienceLevels = [
  { id: 'beginner', name: 'Beginner', description: 'New to app development' },
  { id: 'intermediate', name: 'Some Experience', description: 'Built a few apps before' },
  { id: 'advanced', name: 'Experienced', description: 'Professional developer' }
];

const commonGoals = [
  'Build a patient management system',
  'Create a telemedicine platform',
  'Develop a medical scheduling app',
  'Design a health tracking tool',
  'Build an EHR integration',
  'Create a pharmacy management system',
  'Develop a clinical research platform',
  'Build a medical education app'
];

export default function UserFriendlyOnboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({
    goals: [],
    preferences: {
      interface: 'mixed',
      complexity: 'standard',
      guidance: 'full'
    }
  });
  const [projectIdea, setProjectIdea] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/projects/onboard", {
        userProfile,
        projectIdea,
        preferences: userProfile.preferences
      });
    },
    onSuccess: (response: any) => {
      setIsCreating(false);
      toast({
        title: "Welcome to MedBuilder!",
        description: "Your personalized workspace is ready. Let's start building!",
      });
      onComplete(response);
    },
    onError: () => {
      setIsCreating(false);
      toast({
        title: "Setup Error",
        description: "Let's try that again. I'm here to help!",
        variant: "destructive"
      });
    }
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsCreating(true);
    createProjectMutation.mutate({});
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const toggleGoal = (goal: string) => {
    setUserProfile(prev => ({
      ...prev,
      goals: prev.goals?.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...(prev.goals || []), goal]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to MedBuilder!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                The world's most advanced AI-powered healthcare development platform. 
                Let's get you set up in just 2 minutes!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    userProfile.role === role.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                  }`}
                  onClick={() => updateProfile({ role: role.id })}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {role.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#76B900] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Experience Level</h2>
              <p className="text-gray-600 dark:text-gray-400">
                This helps me customize the perfect experience for you
              </p>
            </div>

            <div className="space-y-3">
              {experienceLevels.map((level) => (
                <Card 
                  key={level.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    userProfile.experience === level.id ? 'ring-2 ring-[#76B900] bg-[#76B900]50 dark:bg-[#1a3d00]' : ''
                  }`}
                  onClick={() => updateProfile({ experience: level.id })}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{level.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {level.description}
                      </p>
                    </div>
                    {userProfile.experience === level.id && (
                      <CheckCircle className="w-5 h-5 text-[#76B900]" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">What Industry?</h2>
              <p className="text-gray-600 dark:text-gray-400">
                I'll customize features and compliance for your industry
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {industries.map((industry) => {
                const IconComponent = industry.icon;
                return (
                  <Card 
                    key={industry.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      userProfile.industry === industry.id ? 'ring-2 ring-purple-500 bg-purple-100 dark:bg-purple-900 border border-purple-200 dark:border-purple-700' : ''
                    }`}
                    onClick={() => updateProfile({ industry: industry.id })}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 ${industry.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-medium text-sm">{industry.name}</h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">What Do You Want to Build?</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select all that interest you (you can build multiple apps!)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commonGoals.map((goal) => (
                <Card 
                  key={goal}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    userProfile.goals?.includes(goal) ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-950' : ''
                  }`}
                  onClick={() => toggleGoal(goal)}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <span className="text-sm font-medium">{goal}</span>
                    {userProfile.goals?.includes(goal) && (
                      <CheckCircle className="w-4 h-4 text-orange-500" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            <div>
              <label className="block text-sm font-medium mb-2">
                Or describe your own idea:
              </label>
              <Input
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                placeholder="e.g., An app to track patient medications and send reminders..."
                className="w-full"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-[#76B900] rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Perfect! Let's Set Your Preferences</h2>
              <p className="text-gray-600 dark:text-gray-400">
                I'll customize the interface just for you
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">How do you prefer to work?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'visual', name: 'Visual Drag & Drop', icon: Code },
                    { id: 'voice', name: 'Voice Commands', icon: Sparkles },
                    { id: 'mixed', name: 'Both Combined', icon: Zap }
                  ].map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <Card 
                        key={option.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          userProfile.preferences?.interface === option.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                        }`}
                        onClick={() => updateProfile({ 
                          preferences: { ...userProfile.preferences!, interface: option.id as any } 
                        })}
                      >
                        <CardContent className="p-3 text-center">
                          <IconComponent className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">{option.name}</span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Complexity Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'simple', name: 'Keep It Simple', description: 'Hide advanced features' },
                    { id: 'standard', name: 'Standard', description: 'Balanced interface' },
                    { id: 'advanced', name: 'Show Everything', description: 'All features visible' }
                  ].map((option) => (
                    <Card 
                      key={option.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        userProfile.preferences?.complexity === option.id ? 'ring-2 ring-[#76B900] bg-[#76B900]50 dark:bg-[#1a3d00]' : ''
                      }`}
                      onClick={() => updateProfile({ 
                        preferences: { ...userProfile.preferences!, complexity: option.id as any } 
                      })}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{option.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {option.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Step {currentStep} of {totalSteps}
            </Badge>
            {onSkip && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onSkip}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip Setup
              </Button>
            )}
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent className="p-6">
          {renderStep()}

          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button 
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !userProfile.role) ||
                (currentStep === 2 && !userProfile.experience) ||
                (currentStep === 3 && !userProfile.industry) ||
                (currentStep === 4 && !userProfile.goals?.length && !projectIdea) ||
                isCreating
              }
              className="flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Creating...
                </>
              ) : currentStep === totalSteps ? (
                <>
                  <Rocket className="w-4 h-4" />
                  Start Building!
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}