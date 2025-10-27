import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { ArrowLeft, Brain, Waves, Activity, Zap, Mic, Eye, Hand, Heart } from "lucide-react";

export default function BCICapabilities() {
  const [activeDemo, setActiveDemo] = useState<"voice" | "neural" | null>(null);

  const capabilities = [
    {
      icon: Mic,
      title: "Voice Control",
      description: "Hands-free development using natural voice commands",
      status: "active",
      color: "blue"
    },
    {
      icon: Brain,
      title: "Neural Processing",
      description: "Direct brain-computer interface for code generation",
      status: "development",
      color: "purple"
    },
    {
      icon: Eye,
      title: "Eye Tracking",
      description: "Gaze-based UI navigation and selection",
      status: "beta",
      color: "green"
    },
    {
      icon: Hand,
      title: "Gesture Control",
      description: "Touchless interface manipulation",
      status: "beta",
      color: "orange"
    },
    {
      icon: Activity,
      title: "Biometric Feedback",
      description: "Health monitoring during development sessions",
      status: "development",
      color: "red"
    },
    {
      icon: Waves,
      title: "EEG Integration",
      description: "Brain wave analysis for cognitive load monitoring",
      status: "research",
      color: "indigo"
    }
  ];

  const statusColors = {
    active: "bg-green-500",
    beta: "bg-yellow-500",
    development: "bg-blue-500",
    research: "bg-purple-500"
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <Card className="border-2 border-purple-400 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-10 h-10 text-purple-500" />
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                    Brain-Computer Interface
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Revolutionary neural-controlled healthcare development
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-yellow-500 text-black font-bold text-sm px-3 py-1">
                BETA
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="capabilities" data-testid="tab-capabilities">Capabilities</TabsTrigger>
            <TabsTrigger value="demo" data-testid="tab-demo">Live Demo</TabsTrigger>
            <TabsTrigger value="applications" data-testid="tab-applications">Applications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200">
                <CardContent className="p-6 text-center">
                  <Waves className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Neural Interface</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Direct brain-to-code connection for intuitive development
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                <CardContent className="p-6 text-center">
                  <Mic className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Voice Control</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fully functional hands-free development system
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-950 border-green-200">
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Health Monitoring</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Real-time developer wellness tracking
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 border-2 border-indigo-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-indigo-600" />
                  BCI Technology Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Our Brain-Computer Interface technology represents the next evolution in healthcare software development,
                  enabling developers and clinicians to create applications using thought, voice, and gesture commands.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">For Developers</h4>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Code generation via voice commands</li>
                      <li>• Hands-free debugging and testing</li>
                      <li>• Reduced repetitive strain injuries</li>
                      <li>• Increased productivity (up to 3x faster)</li>
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">For Healthcare</h4>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Sterile environment compatibility</li>
                      <li>• Accessibility for disabled clinicians</li>
                      <li>• Real-time patient care apps</li>
                      <li>• Emergency response systems</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Capabilities Tab */}
          <TabsContent value="capabilities" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {capabilities.map((cap, idx) => {
                const Icon = cap.icon;
                return (
                  <Card key={idx} className={`border-2 border-${cap.color}-400`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-8 h-8 text-${cap.color}-500`} />
                          <CardTitle className="text-lg">{cap.title}</CardTitle>
                        </div>
                        <Badge className={statusColors[cap.status as keyof typeof statusColors]}>
                          {cap.status}
                        </Badge>
                      </div>
                      <CardDescription>{cap.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Readiness</span>
                          <span className="font-semibold">
                            {cap.status === "active" ? "100%" : cap.status === "beta" ? "75%" : cap.status === "development" ? "50%" : "25%"}
                          </span>
                        </div>
                        <Progress 
                          value={cap.status === "active" ? 100 : cap.status === "beta" ? 75 : cap.status === "development" ? 50 : 25} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Demo Tab */}
          <TabsContent value="demo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interactive BCI Demonstrations</CardTitle>
                <CardDescription>Try voice and neural control features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-blue-50 dark:bg-blue-950">
                    <CardContent className="p-6">
                      <Mic className="w-10 h-10 text-blue-500 mb-3" />
                      <h3 className="font-semibold mb-2">Voice Control Demo</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Create healthcare apps using only voice commands
                      </p>
                      <Button 
                        data-testid="button-voice-demo"
                        onClick={() => setActiveDemo("voice")}
                        className="w-full"
                        variant={activeDemo === "voice" ? "default" : "outline"}
                      >
                        {activeDemo === "voice" ? "🎤 Listening..." : "Start Voice Demo"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 dark:bg-purple-950">
                    <CardContent className="p-6">
                      <Brain className="w-10 h-10 text-purple-500 mb-3" />
                      <h3 className="font-semibold mb-2">Neural Control Demo</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Experience thought-based code generation
                      </p>
                      <Button 
                        data-testid="button-neural-demo"
                        onClick={() => setActiveDemo("neural")}
                        className="w-full"
                        variant={activeDemo === "neural" ? "default" : "outline"}
                      >
                        {activeDemo === "neural" ? "🧠 Processing..." : "Start Neural Demo"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {activeDemo && (
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-400">
                    <CardContent className="p-6">
                      <div className="text-center space-y-3">
                        <div className="text-2xl font-bold text-green-600">
                          {activeDemo === "voice" ? "🎤 Voice Control Active" : "🧠 Neural Interface Connected"}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {activeDemo === "voice" 
                            ? "Say commands like: 'Create a patient form', 'Add HIPAA compliance', 'Generate login page'"
                            : "Think about: 'Patient database schema', 'Telehealth appointment system', 'Medical charts UI'"}
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Active and listening</span>
                        </div>
                        <Button 
                          onClick={() => setActiveDemo(null)}
                          variant="outline"
                          className="mt-4"
                        >
                          Stop Demo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Healthcare Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Surgical Environment Development</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Build apps in sterile conditions without touching keyboards
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Patient Rehabilitation Apps</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Neural-controlled interfaces for motor rehabilitation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Accessibility Solutions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enable disabled healthcare workers to develop applications
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Emergency Response Systems</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Hands-free critical care application deployment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900">
                <CardHeader>
                  <CardTitle>Future Roadmap</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Q1 2025</h4>
                    <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                      <li>• Voice control feature launch</li>
                      <li>• Eye tracking integration beta</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Q2 2025</h4>
                    <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                      <li>• Neural interface public beta</li>
                      <li>• Gesture control release</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Q3-Q4 2025</h4>
                    <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                      <li>• Full EEG integration</li>
                      <li>• Advanced biometric feedback</li>
                      <li>• FDA clearance for medical use</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
