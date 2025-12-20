import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Code, Sparkles, Cpu, Shield, Zap, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChatToCodeDemo } from "@/components/ChatToCodeDemo";
import { CreditMeter } from "@/components/CreditMeter";
import { TrustBadges } from "@/components/SuccessToast";
import { apiRequest } from "@/lib/queryClient";

export default function Landing() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);

  const createGuestSession = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/monetization/guest-session", {});
      return response.json();
    },
    onSuccess: (data) => {
      setGuestSessionId(data.sessionId);
      localStorage.setItem('medbuilder_guest_session', data.sessionId);
    },
    onError: (error) => {
      console.warn("Guest session creation failed, using fallback:", error);
      const fallbackSession = `guest_${Date.now()}`;
      setGuestSessionId(fallbackSession);
    },
    retry: 2,
  });

  useEffect(() => {
    const existingSession = localStorage.getItem('medbuilder_guest_session');
    if (existingSession) {
      setGuestSessionId(existingSession);
    } else {
      createGuestSession.mutate();
    }
  }, []);

  const handleGenerateApp = () => {
    if (!prompt.trim()) return;
    setShowChat(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex flex-col">
      {/* Minimal Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">MedBuilder</span>
            </div>
            
            <div className="flex items-center space-x-3">
              {guestSessionId && (
                <CreditMeter sessionId={guestSessionId} compact />
              )}
              <Button 
                asChild
                variant="outline"
                className="bg-green-700/20 border-green-500 text-green-200 hover:bg-green-600 hover:text-white"
                size="sm"
              >
                <Link href="/pricing">Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Chat Input Front and Center */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-4xl w-full mx-auto space-y-8">
          
          {/* Hero Text - Compact */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Build Healthcare Apps with AI
            </h1>
            <p className="text-lg text-gray-400">
              Describe what you need. Get a working app in seconds.
            </p>
          </div>

          {/* Central Chat Input - Highlighted */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl blur-sm opacity-30"></div>
            <div className="relative bg-gray-800 rounded-2xl border border-gray-600 p-6 shadow-2xl">
              <Textarea
                placeholder="Tell me what you need for your practice...

Example: I'm a family doctor and need an app where patients can book appointments, fill out forms before visits, and I can track their health progress over time."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 bg-transparent border-none text-white placeholder-gray-400 text-lg resize-none focus:outline-none focus:ring-0"
                data-testid="input-prompt"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleGenerateApp();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                <span className="text-sm text-gray-500">Ctrl+Enter to generate</span>
                <Button
                  onClick={handleGenerateApp}
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg rounded-xl"
                  data-testid="button-generate-app"
                >
                  {isGenerating ? (
                    <>
                      <Cpu className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate App
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Badges - Compact */}
          <div className="flex justify-center">
            <TrustBadges />
          </div>

          {/* Quick Example Prompts */}
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-500">Try these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setPrompt("Create a patient appointment scheduler with reminders")}
                className="p-4 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm text-gray-300 hover:text-white transition-all hover:border-green-500 text-left"
                data-testid="example-prompt-0"
              >
                Patient appointment scheduler with reminders
              </button>
              <button
                onClick={() => setPrompt("Build a secure patient intake form with HIPAA compliance")}
                className="p-4 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm text-gray-300 hover:text-white transition-all hover:border-green-500 text-left"
                data-testid="example-prompt-1"
              >
                Secure patient intake form
              </button>
              <button
                onClick={() => setPrompt("Create a telehealth waiting room with video chat")}
                className="p-4 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm text-gray-300 hover:text-white transition-all hover:border-green-500 text-left"
                data-testid="example-prompt-2"
              >
                Telehealth waiting room
              </button>
            </div>
          </div>

          {/* Features - Minimal */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-800">
            <div className="text-center">
              <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">HIPAA Compliant</p>
            </div>
            <div className="text-center">
              <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Ready in Seconds</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No Coding Required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="bg-gray-800/50 border-t border-gray-700 py-4">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                <Code className="w-3 h-3 text-white" />
              </div>
              <span>MedBuilder</span>
            </div>
            <span>Built for Healthcare</span>
          </div>
        </div>
      </footer>

      {/* Chat-to-Code Demo */}
      {showChat && (
        <ChatToCodeDemo 
          initialPrompt={prompt}
          sessionId={guestSessionId || undefined}
          onClose={() => setShowChat(false)}
          onComplete={(code) => console.log("Generated:", code)}
        />
      )}
    </div>
  );
}
