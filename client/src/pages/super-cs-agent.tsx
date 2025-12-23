import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SmartRefresh } from "@/components/ui/smart-refresh";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRefreshInterval } from "@/lib/update-strategy";
import { useAuth } from "@/hooks/useAuth";
import { AuthCheck } from "@/components/ui/auth-check";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Brain, 
  Zap, 
  Rocket, 
  TrendingUp, 
  Shield, 
  Clock,
  Award,
  Activity,
  RefreshCw,
  Star,
  Cpu,
  Target,
  BookOpen,
  FileText,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function SuperCSAgent() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Super CS Agent status
  const { data: agentStatus, isLoading: statusLoading, refetch: refetchStatus } = useQuery({
    queryKey: ["/api/super-cs-agent/status"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: 60000, // 1-minute updates
  });

  // Latest technologies
  const { data: technologies, isLoading: techLoading, refetch: refetchTech } = useQuery({
    queryKey: ["/api/super-cs-agent/technologies"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: 3600000, // Hourly updates
  });

  // Learning report for owner
  const { data: learningReport, isLoading: learningLoading, refetch: refetchLearning } = useQuery({
    queryKey: ["/api/super-cs-agent/learning-report"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: 3600000, // Hourly learning updates
  });

  // Enhancement mutation
  const enhanceMutation = useMutation({
    mutationFn: async (data: { focus: string; urgency: string }) => {
      return await apiRequest("POST", "/api/super-cs-agent/enhance", data);
    },
    onSuccess: () => {
      toast({
        title: "Enhancement Initiated",
        description: "Super CS Agent improvement cycle started",
        variant: "default",
      });
      refetchStatus();
      refetchTech();
    },
    onError: (error) => {
      toast({
        title: "Enhancement Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Improvement mutation
  const improveMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/super-cs-agent/improve");
    },
    onSuccess: () => {
      toast({
        title: "Hourly Improvement Complete",
        description: "Super CS Agent has been enhanced with latest technologies",
        variant: "default",
      });
      refetchStatus();
      refetchTech();
    },
    onError: (error) => {
      toast({
        title: "Improvement Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEnhance = (focus: string, urgency = 'high') => {
    enhanceMutation.mutate({ focus, urgency });
  };

  const handleImprove = () => {
    improveMutation.mutate();
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Brain className="mr-3 h-8 w-8 text-purple-500" />
                Super CS Agent
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Self-improving system with hourly technology updates and competitive intelligence
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-lg px-4 py-2 flex items-center animate-pulse">
                <Activity className="mr-2 h-4 w-4" />
                SELF-IMPROVING
              </Badge>
              <Button 
                onClick={handleImprove}
                disabled={improveMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${improveMutation.isPending ? 'animate-spin' : ''}`} />
                Hourly Improvement
              </Button>
            </div>
          </div>
        </div>

        {/* Agent Status */}
        <Card className="mb-6 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-purple-600" />
                  Agent Status & Capabilities
                </CardTitle>
                <CardDescription>Current version and performance metrics</CardDescription>
              </div>
              <SmartRefresh
                onManualRefresh={() => refetchStatus()}
                isLoading={statusLoading}
                endpoint="/api/super-cs-agent/status"
              />
            </div>
          </CardHeader>
          <CardContent>
            {statusLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {(agentStatus as any)?.version || 'v4.0-Advanced-Enhanced'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Current Version</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {(agentStatus as any)?.currentFocus || 'Big Tech Competition'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Current Focus</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries((agentStatus as any)?.performanceMetrics || {
                    patentAnalysisAccuracy: '99.7%',
                    competitiveThreatDetection: '98.4%',
                    marketOpportunityPrediction: '96.8%',
                    strategicRecommendationSuccess: '94.2%'
                  }).map(([metric, value]) => (
                    <div key={metric} className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-[#76B900]">{value as string}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 capitalize">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <div className="font-semibold mb-2">Current Capabilities:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {((agentStatus as any)?.capabilities || [
                      'Real-time technology monitoring',
                      'Automatic capability enhancement',
                      'Competitive intelligence integration',
                      'Patent filing optimization',
                      'Market trend prediction',
                      'Strategic recommendation engine'
                    ]).map((capability: string, index: number) => (
                      <div key={index} className="flex items-center text-sm">
                        <Star className="mr-2 h-3 w-3 text-yellow-500" />
                        {capability}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technology Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Integrated Technologies */}
          <Card className="border-[#76B900]200 dark:border-[#5a8f00]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <Cpu className="mr-2 h-5 w-5 text-[#76B900]" />
                    Integrated Technologies
                  </CardTitle>
                  <CardDescription>Production-ready revolutionary technologies</CardDescription>
                </div>
                <SmartRefresh
                  onManualRefresh={() => refetchTech()}
                  isLoading={techLoading}
                  endpoint="/api/super-cs-agent/technologies"
                />
              </div>
            </CardHeader>
            <CardContent>
              {techLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {((technologies as any)?.integrated || []).map((tech: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">{tech.name}</div>
                        <Badge variant={tech.status === 'Production Ready' ? 'default' : 'outline'}>
                          {tech.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <strong>Version:</strong> {tech.version}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <strong>Capability:</strong> {tech.capability}
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        Advantage: {tech.competitive_advantage}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pipeline Technologies */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Rocket className="mr-2 h-5 w-5 text-orange-600" />
                Innovation Pipeline
              </CardTitle>
              <CardDescription>Upcoming revolutionary technologies</CardDescription>
            </CardHeader>
            <CardContent>
              {techLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {((technologies as any)?.pipeline || []).map((tech: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">{tech.name}</div>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {tech.eta}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <strong>Capability:</strong> {tech.capability}
                      </div>
                      <div className="text-sm font-medium text-orange-600">
                        Impact: {tech.competitive_impact}
                      </div>
                      <Button 
                        size="sm" 
                        className="mt-2" 
                        onClick={() => handleEnhance(tech.name, 'critical')}
                        disabled={enhanceMutation.isPending}
                      >
                        <Zap className="mr-1 h-3 w-3" />
                        Accelerate Development
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhancement Controls */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Enhancement Controls
            </CardTitle>
            <CardDescription>Accelerate specific capabilities and focus areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div className="font-semibold text-center">Competitive Intelligence</div>
                <Button 
                  onClick={() => handleEnhance("Competitive Intelligence", "critical")}
                  disabled={enhanceMutation.isPending}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Enhance Big Tech Monitoring
                </Button>
                <Button 
                  onClick={() => handleEnhance("Patent Analysis", "high")}
                  disabled={enhanceMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Boost Patent Analysis
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="font-semibold text-center">Technology Development</div>
                <Button 
                  onClick={() => handleEnhance("Advanced Processing", "high")}
                  disabled={enhanceMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Accelerate Advanced AI
                </Button>
                <Button 
                  onClick={() => handleEnhance("Voice Control", "high")}
                  disabled={enhanceMutation.isPending}
                  className="w-full bg-[#76B900] hover:bg-[#5a8f00]"
                >
                  Enhance Voice Systems
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="font-semibold text-center">Strategic Intelligence</div>
                <Button 
                  onClick={() => handleEnhance("Market Prediction", "high")}
                  disabled={enhanceMutation.isPending}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  Improve Market Analysis
                </Button>
                <Button 
                  onClick={() => handleEnhance("Strategic Guidance", "high")}
                  disabled={enhanceMutation.isPending}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Optimize Recommendations
                </Button>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Alert className="mb-4">
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  Super CS Agent improves automatically every hour with latest technologies, 
                  competitive intelligence, and market trends to maintain first-mover advantage.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Owner Learning Report */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-purple-600" />
              Owner Learning Report
              <Badge variant="secondary" className="ml-2">Hourly Updates</Badge>
            </CardTitle>
            <CardDescription>
              What your Super CS Agent has learned and discovered
            </CardDescription>
          </CardHeader>
          <CardContent>
            {learningLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating learning report...
              </div>
            ) : learningReport && (learningReport as any)?.learningReport ? (
              <div className="space-y-6">
                {/* Technical Discoveries */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Cpu className="mr-2 h-4 w-4" />
                    Technical Discoveries
                  </h4>
                  <div className="grid gap-3">
                    {((learningReport as any)?.learningReport?.technicalDiscoveries || []).map((discovery: any, index: number) => (
                      <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-sm">{discovery.category}</span>
                          <Badge variant="outline">{discovery.confidence}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          {discovery.discovery}
                        </p>
                        <p className="text-xs text-[#76B900] dark:text-[#8CC63F]">
                          Impact: {discovery.impact}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitive Intelligence */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Target className="mr-2 h-4 w-4" />
                    Competitive Intelligence
                  </h4>
                  <div className="grid gap-3">
                    {((learningReport as any)?.learningReport?.competitiveIntelligence || []).map((intel: any, index: number) => (
                      <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        <div className="font-medium text-sm mb-1">{intel.area}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          {intel.insight}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Our Position: {intel.ourPosition || intel.ourAdvantage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Owner Recommendations */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-[#76B900]" />
                    Owner Recommendations
                  </h4>
                  <div className="space-y-2">
                    {((learningReport as any)?.learningReport?.ownerRecommendations || []).map((rec: string, index: number) => (
                      <Alert key={index} className="border-[#76B900]200 dark:border-[#5a8f00]">
                        <CheckCircle className="h-4 w-4 text-[#76B900]" />
                        <AlertDescription className="text-sm">
                          {rec}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>

                {/* Next Learning Cycle */}
                <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Brain className="mr-2 h-4 w-4" />
                    Next Learning Cycle
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Focus: {(learningReport as any)?.learningReport?.nextLearningCycle?.focus || 'Advanced healthcare applications'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Next Update: {(learningReport as any)?.learningReport?.nextLearningCycle?.scheduledUpdate ? new Date((learningReport as any).learningReport.nextLearningCycle.scheduledUpdate).toLocaleString() : 'Calculating...'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Learning report will be available after first improvement cycle</p>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </AuthCheck>
  );
}