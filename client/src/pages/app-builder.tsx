import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Sparkles,
  Rocket,
  Calendar,
  FileText,
  Activity,
  Pill,
  Users,
  Stethoscope
} from 'lucide-react';

const quickStarts = [
  { icon: Calendar, label: 'Patient Scheduler', prompt: 'Build a patient appointment scheduling system with calendar view and reminders' },
  { icon: Users, label: 'Patient Portal', prompt: 'Create a patient portal with login, medical records view, and appointment booking' },
  { icon: Activity, label: 'Telehealth', prompt: 'Build a telehealth app with video consultations and waiting room' },
  { icon: FileText, label: 'Intake Forms', prompt: 'Create digital patient intake forms with medical history and insurance info' },
  { icon: Pill, label: 'Pharmacy', prompt: 'Build a pharmacy management system with prescription tracking' },
  { icon: Stethoscope, label: 'Lab Results', prompt: 'Create a lab results portal where patients can view their test results' },
];

export default function AppBuilder() {
  const [prompt, setPrompt] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const buildMutation = useMutation({
    mutationFn: async (description: string) => {
      setIsBuilding(true);
      setBuildProgress(0);
      
      const interval = setInterval(() => {
        setBuildProgress(p => Math.min(p + Math.random() * 20, 95));
      }, 400);

      try {
        const result = await apiRequest('POST', '/api/app-builder/build', {
          name: description.slice(0, 30),
          description,
          type: 'custom',
          hipaaCompliant: true,
        });
        clearInterval(interval);
        setBuildProgress(100);
        return result;
      } catch (e) {
        clearInterval(interval);
        throw e;
      }
    },
    onSuccess: (data: any) => {
      toast({ title: 'App Created!', description: 'Opening your workspace...' });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsBuilding(false);
      if (data?.projectId) {
        navigate(`/workspace/${data.projectId}`);
      }
    },
    onError: () => {
      toast({ title: 'Build Failed', description: 'Please try again.', variant: 'destructive' });
      setIsBuilding(false);
      setBuildProgress(0);
    },
  });

  const handleBuild = () => {
    if (!prompt.trim()) {
      toast({ title: 'Enter a description', description: 'Tell us what you want to build.', variant: 'destructive' });
      return;
    }
    buildMutation.mutate(prompt);
  };

  const handleQuickStart = (template: typeof quickStarts[0]) => {
    setPrompt(template.prompt);
    buildMutation.mutate(template.prompt);
  };

  return (
    <PageLayout title="Build App" description="Describe your healthcare app and we'll build it">
      <div className="max-w-3xl mx-auto space-y-8">
        {isBuilding ? (
          <Card className="bg-gradient-to-br from-[#1a3d00]/40 to-gray-900 border-[#76B900]">
            <CardContent className="py-12 text-center">
              <Rocket className="w-12 h-12 text-[#76B900] mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-white mb-2">Building your app...</h2>
              <p className="text-gray-400 mb-6">Setting up HIPAA compliance, generating code, configuring database</p>
              <div className="w-full max-w-md mx-auto bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-[#76B900] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${buildProgress}%` }}
                />
              </div>
              <p className="text-[#76B900] mt-2">{Math.round(buildProgress)}%</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#76B900]" />
                  <span className="text-gray-300 font-medium">What do you want to build?</span>
                </div>
                <Textarea
                  placeholder="Describe your healthcare app... e.g., 'A patient scheduling system with appointment reminders and doctor availability'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white min-h-[120px] text-lg placeholder:text-gray-500"
                  data-testid="input-prompt"
                />
                <div className="flex justify-end mt-4">
                  <Button 
                    size="lg"
                    className="bg-[#76B900] hover:bg-[#76B900] text-white px-8"
                    onClick={handleBuild}
                    disabled={!prompt.trim()}
                    data-testid="button-build"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Build App
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-4">Or start with a template:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quickStarts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleQuickStart(item)}
                      className="p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-[#76B900] hover:bg-gray-800 transition-all text-left group"
                      data-testid={`button-template-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <Icon className="w-6 h-6 text-gray-500 group-hover:text-[#76B900] mb-2" />
                      <span className="text-white font-medium block">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
