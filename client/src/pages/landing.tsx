import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Code, Sparkles, Send, Calendar, Users, FileText, Shield, Zap, CheckCircle, ArrowRight, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChatToCodeDemo } from "@/components/ChatToCodeDemo";
import { apiRequest } from "@/lib/queryClient";

export default function Landing() {
  const [prompt, setPrompt] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  
  // Interactive preview state
  const [selectedService, setSelectedService] = useState('General Checkup');
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const [isBooked, setIsBooked] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [patientCount, setPatientCount] = useState(247);

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

  const handleExampleClick = (example: string, index: number) => {
    setSelectedExample(index);
    setPrompt(example);
    setTimeout(() => setShowChat(true), 300);
  };

  const handleBookAppointment = () => {
    setIsBooked(true);
    setPatientCount(prev => prev + 1);
    setTimeout(() => setIsBooked(false), 3000);
  };

  const services = ['General Checkup', 'Vaccination', 'Lab Work', 'Consultation'];
  const times = ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'];

  const examples = [
    {
      title: "Patient Scheduler",
      prompt: "Create a patient appointment booking system with available time slots, doctor selection, and appointment reminders",
      icon: Calendar,
      color: "text-blue-400"
    },
    {
      title: "Intake Forms",
      prompt: "Build a secure patient intake form that collects medical history, insurance information, and consent signatures",
      icon: FileText,
      color: "text-[#76B900]"
    },
    {
      title: "Telehealth Room",
      prompt: "Create a telehealth virtual waiting room where patients check in and wait for their video consultation",
      icon: Users,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="h-screen bg-[#0a0a0f] text-white font-sans flex flex-col overflow-hidden">
      {/* Minimal Header */}
      <header className="bg-[#0a0a0f]/80 backdrop-blur-md border-b border-gray-800/50 px-6 py-3 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#76B900] to-[#5A8F00] rounded-lg flex items-center justify-center shadow-lg shadow-[#76B900]/20">
            <Code className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">MedBuilder</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/20 text-xs">
            3 Free Builds
          </Badge>
          <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button 
            size="sm" 
            asChild
            className="bg-[#76B900] hover:bg-[#8CC63F] text-white"
            data-testid="button-login"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-1/2 border-r border-gray-800/50 flex flex-col bg-[#0a0a0f]">
          {/* Hero Section */}
          <div className="px-8 py-8 border-b border-gray-800/30">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#76B900]/10 to-[#5A8F00]/10 border border-[#76B900]/20 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#76B900] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#76B900]"></span>
                </span>
                <span className="text-xs text-[#76B900] font-medium">AI-Powered Healthcare Apps</span>
              </div>
              <h1 className="text-3xl font-bold leading-tight">
                Build HIPAA-Compliant Apps
                <span className="block text-[#76B900]">In Seconds</span>
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                Describe your healthcare app idea. Our AI generates production-ready code with built-in compliance.
              </p>
            </div>
          </div>

          {/* Example Cards */}
          <div className="px-6 py-4 flex-1 overflow-auto">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Quick Start Templates</p>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example.prompt, index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${
                    selectedExample === index 
                      ? 'bg-[#76B900]/10 border-[#76B900]/30' 
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                  }`}
                  data-testid={`example-prompt-${index}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center ${example.color} group-hover:scale-110 transition-transform`}>
                      <example.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white text-sm">{example.title}</span>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#76B900] group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{example.prompt}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800/50">
            <div className="relative">
              <Textarea
                placeholder="Or describe your own healthcare app..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-20 bg-gray-900/50 border-gray-800 text-white placeholder-gray-500 resize-none pr-14 rounded-xl focus:border-[#76B900]/50 focus:ring-1 focus:ring-[#76B900]/20"
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
                className="absolute bottom-3 right-3 bg-[#76B900] hover:bg-[#8CC63F] h-9 w-9 rounded-lg shadow-lg shadow-[#76B900]/20 disabled:opacity-50 disabled:shadow-none"
                data-testid="button-generate"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-xs text-gray-600">Ctrl+Enter to generate</span>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Shield className="w-3 h-3" />
                <span>HIPAA Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Interactive Preview */}
        <div className="w-1/2 bg-[#0d0d12] flex flex-col">
          {/* Preview Header */}
          <div className="px-4 py-3 border-b border-gray-800/50 flex items-center justify-between bg-[#0a0a0f]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-[#76B900]/80"></div>
              </div>
              <span className="text-xs text-gray-500 font-medium">Interactive Demo</span>
            </div>
            <Badge className="bg-[#76B900]/10 text-[#76B900] border-0 text-xs">
              <span className="relative flex h-1.5 w-1.5 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#76B900] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#76B900]"></span>
              </span>
              Live
            </Badge>
          </div>

          {/* Preview Content */}
          <div className="flex-1 p-8 overflow-auto flex items-center justify-center">
            <div className="w-full max-w-sm">
              {/* Device Frame */}
              <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl shadow-black/50 border border-gray-800">
                <div className="bg-[#12121a] rounded-2xl overflow-hidden">
                  {/* App Header */}
                  <div className="px-5 py-4 border-b border-gray-800/50 bg-gradient-to-r from-[#76B900]/10 to-[#5A8F00]/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#76B900] to-[#5A8F00] rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-white text-sm">HealthSchedule</span>
                      </div>
                      <Badge className="bg-[#76B900]/20 text-[#76B900] border-0 text-[10px]">HIPAA</Badge>
                    </div>
                  </div>

                  {/* Success Message */}
                  {isBooked && (
                    <div className="mx-5 mt-4 p-3 bg-[#76B900]/20 border border-[#76B900]/30 rounded-xl flex items-center gap-2 animate-pulse">
                      <Check className="w-4 h-4 text-[#76B900]" />
                      <span className="text-sm text-[#76B900] font-medium">Appointment Booked!</span>
                    </div>
                  )}

                  {/* App Content */}
                  <div className="p-5 space-y-4">
                    {/* Service Dropdown */}
                    <div className="relative">
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Select Service</label>
                      <button
                        onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                        className="mt-2 w-full bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 rounded-xl p-3 text-sm text-white flex items-center justify-between transition-colors"
                        data-testid="button-service-dropdown"
                      >
                        <span>{selectedService}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showServiceDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                          {services.map((service) => (
                            <button
                              key={service}
                              onClick={() => {
                                setSelectedService(service);
                                setShowServiceDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-700 transition-colors ${
                                selectedService === service ? 'text-[#76B900] bg-gray-700/50' : 'text-white'
                              }`}
                            >
                              {service}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Choose Date</label>
                      <div className="mt-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 text-sm text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>December 23, 2024</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Available Times</label>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {times.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`rounded-xl p-2 text-xs font-medium transition-all ${
                              selectedTime === time 
                                ? 'bg-[#76B900] text-white shadow-lg shadow-[#76B900]/20 scale-105' 
                                : 'bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:border-[#76B900]/50 hover:text-white'
                            }`}
                            data-testid={`button-time-${time.replace(/[: ]/g, '-')}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleBookAppointment}
                      disabled={isBooked}
                      className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-all shadow-lg ${
                        isBooked 
                          ? 'bg-[#5A8F00] text-white shadow-[#76B900]/10' 
                          : 'bg-gradient-to-r from-[#76B900] to-[#5A8F00] hover:from-[#8CC63F] hover:to-[#76B900] text-white shadow-[#76B900]/20 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                      data-testid="button-book-appointment"
                    >
                      {isBooked ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" /> Confirmed!
                        </span>
                      ) : (
                        'Book Appointment'
                      )}
                    </button>
                  </div>

                  {/* App Stats */}
                  <div className="px-5 py-4 border-t border-gray-800/50 bg-gray-900/30">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{patientCount}</div>
                        <div className="text-[10px] text-gray-500">Patients</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">89</div>
                        <div className="text-[10px] text-gray-500">Today</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">12m</div>
                        <div className="text-[10px] text-gray-500">Avg Wait</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5 text-[#76B900]" />
                  <span>HIPAA</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Zap className="w-3.5 h-3.5 text-blue-500" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
                  <span>Secure</span>
                </div>
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
          onClose={() => {
            setShowChat(false);
            setSelectedExample(null);
          }}
          onComplete={(code) => console.log("Generated:", code)}
        />
      )}
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
