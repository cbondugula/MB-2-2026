import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, Sparkles, Cpu, Send, Calendar, Users, FileText, Clock, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChatToCodeDemo } from "@/components/ChatToCodeDemo";
import { apiRequest } from "@/lib/queryClient";

export default function Landing() {
  const [prompt, setPrompt] = useState('');
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
    onError: () => {
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

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setShowChat(true);
  };

  return (
    <div className="h-screen bg-gray-900 text-white font-mono flex flex-col overflow-hidden">
      {/* Minimal Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-green-500 rounded flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold">MedBuilder</span>
          <Badge className="bg-green-900/50 text-green-400 text-xs">AI</Badge>
        </div>
        <Button 
          asChild
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <Link href="/pricing">Pricing</Link>
        </Button>
      </header>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat Input */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col bg-gray-900">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-gray-800">
            <h2 className="text-sm font-medium text-gray-300">Describe your healthcare app</h2>
          </div>
          
          {/* Chat Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {/* Welcome Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-gray-800 rounded-lg p-4 text-sm text-gray-300">
                  <p className="mb-3">Hi! I can build healthcare apps for you. Just describe what you need:</p>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-green-500" />
                      Patient scheduling systems
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-green-500" />
                      Intake forms & questionnaires
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-green-500" />
                      Telehealth & video chat
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-green-500" />
                      Patient portals & dashboards
                    </li>
                  </ul>
                </div>
              </div>

              {/* Example Prompts */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 px-2">Try an example:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setPrompt("I need a patient appointment system where patients can book visits, see available times, and get reminders")}
                    className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                    data-testid="example-prompt-0"
                  >
                    "I need a patient appointment system..."
                  </button>
                  <button
                    onClick={() => setPrompt("Build me a patient intake form that collects medical history, insurance info, and consent signatures")}
                    className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                    data-testid="example-prompt-1"
                  >
                    "Build me a patient intake form..."
                  </button>
                  <button
                    onClick={() => setPrompt("Create a telehealth waiting room where patients check in and wait for their video appointment")}
                    className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                    data-testid="example-prompt-2"
                  >
                    "Create a telehealth waiting room..."
                  </button>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800">
            <div className="relative">
              <Textarea
                placeholder="Describe the healthcare app you want to build..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-24 bg-gray-800 border-gray-700 text-white placeholder-gray-500 resize-none pr-12 rounded-lg"
                data-testid="input-prompt"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleGenerate();
                  }
                }}
              />
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                size="icon"
                className="absolute bottom-3 right-3 bg-green-600 hover:bg-green-700 h-8 w-8"
                data-testid="button-generate"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Press Ctrl+Enter to generate</p>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-gray-950 flex flex-col">
          {/* Preview Header */}
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs text-gray-500">Preview</span>
          </div>

          {/* Preview Content - Sample Healthcare App */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-md mx-auto space-y-6">
              {/* Sample App Header */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Patient Scheduler</h3>
                <p className="text-sm text-gray-400">Book your appointment</p>
              </div>

              {/* Sample Form */}
              <div className="space-y-4 bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Select Service</label>
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm text-white">
                    General Checkup
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Choose Date</label>
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    December 23, 2024
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Available Times</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['9:00 AM', '10:30 AM', '2:00 PM'].map((time) => (
                      <button
                        key={time}
                        className="bg-gray-800 border border-gray-600 hover:border-green-500 rounded-lg p-2 text-xs text-gray-300 hover:text-white transition-colors"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 text-sm font-medium transition-colors">
                  Book Appointment
                </button>
              </div>

              {/* Sample Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700">
                  <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">247</p>
                  <p className="text-xs text-gray-500">Patients</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700">
                  <FileText className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">89</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700">
                  <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">12m</p>
                  <p className="text-xs text-gray-500">Avg Wait</p>
                </div>
              </div>

              {/* HIPAA Badge */}
              <div className="flex justify-center">
                <Badge className="bg-green-900/30 text-green-400 border border-green-800">
                  HIPAA Compliant
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat-to-Code Demo Modal */}
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
