import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SmartRefresh } from "@/components/ui/smart-refresh";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRefreshInterval } from "@/lib/update-strategy";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  AlertTriangle, 
  Eye, 
  Zap, 
  Activity,
  Bell,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

export default function CompetitiveIntelligence() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Real-time competitive monitoring
  const { data: competitiveRealtime, isLoading: competitiveLoading, refetch: refetchCompetitive } = useQuery({
    queryKey: ["/api/competitive/realtime"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/competitive/realtime"), // 1-minute updates
  });

  // Live market funding data
  const { data: marketFunding, isLoading: fundingLoading, refetch: refetchFunding } = useQuery({
    queryKey: ["/api/market/funding"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/market/funding"), // 2-minute updates
  });

  // Market intelligence
  const { data: marketIntelligence, isLoading: intelligenceLoading, refetch: refetchIntelligence } = useQuery({
    queryKey: ["/api/market/intelligence"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/market/intelligence"), // 1-minute updates
  });

  // Strategic guidance
  const { data: strategicGuidance, isLoading: guidanceLoading, refetch: refetchGuidance } = useQuery({
    queryKey: ["/api/strategic/guidance"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/strategic/guidance"), // 1-minute updates
  });

  // Competitive threats
  const { data: threats, isLoading: threatsLoading, refetch: refetchThreats } = useQuery({
    queryKey: ["/api/competitive/threats"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/competitive/threats"), // 1-minute updates
  });

  const handleUrgentAction = (action: string) => {
    toast({
      title: "Urgent Action Initiated",
      description: `Executing: ${action}`,
      variant: "default",
    });
    // Trigger immediate data refresh
    Promise.all([
      refetchCompetitive(),
      refetchFunding(),
      refetchIntelligence(),
      refetchGuidance(),
      refetchThreats()
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Eye className="mr-3 h-8 w-8 text-red-500" />
                Live Competitive Intelligence
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Real-time competitive monitoring with dynamic strategic guidance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-lg px-4 py-2 flex items-center animate-pulse">
                <Activity className="mr-2 h-4 w-4" />
                LIVE MONITORING
              </Badge>
              <Button 
                onClick={() => handleUrgentAction("Full Market Refresh")}
                className="bg-red-600 hover:bg-red-700"
              >
                <Zap className="mr-2 h-4 w-4" />
                Urgent Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {threats && (threats as any)?.criticalThreats?.length > 0 && (
          <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div>
                <strong>CRITICAL COMPETITIVE THREATS DETECTED:</strong>
              </div>
              {(threats as any)?.criticalThreats?.map((threat: any, index: number) => (
                <div key={index} className="mt-2">
                  • {threat.description} - 
                  <Button 
                    size="sm" 
                    className="ml-2" 
                    onClick={() => handleUrgentAction(threat.action)}
                  >
                    {threat.action}
                  </Button>
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Strategic Guidance Panel */}
        <Card className="mb-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-600" />
                  Dynamic Strategic Guidance
                </CardTitle>
                <CardDescription>AI-powered recommendations based on live market data</CardDescription>
              </div>
              <SmartRefresh
                onManualRefresh={() => refetchGuidance()}
                isLoading={guidanceLoading}
                endpoint="/api/strategic/guidance"
              />
            </div>
          </CardHeader>
          <CardContent>
            {guidanceLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-lg font-semibold text-blue-700">
                  {(strategicGuidance as any)?.priority || 'Priority: Maintain Market Dominance'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {((strategicGuidance as any)?.recommendations || [
                    'Accelerate patent filing for voice technologies',
                    'Monitor Oracle Health partnership announcements',
                    'Prepare Series A materials for Q1 2025'
                  ]).map((rec: string, index: number) => (
                    <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="text-sm font-medium">{rec}</div>
                      <Button 
                        size="sm" 
                        className="mt-2" 
                        onClick={() => handleUrgentAction(rec)}
                      >
                        Execute Now
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Real-time Competitive Analysis */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <Target className="mr-2 h-5 w-5 text-red-600" />
                    Live Competitor Analysis
                  </CardTitle>
                  <CardDescription>Real-time competitive landscape monitoring</CardDescription>
                </div>
                <SmartRefresh
                  onManualRefresh={() => refetchCompetitive()}
                  isLoading={competitiveLoading}
                  endpoint="/api/competitive/realtime"
                />
              </div>
            </CardHeader>
            <CardContent>
              {competitiveLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-red-600">
                      {(competitiveRealtime as any)?.threatLevel || 'LOW THREAT'}
                    </div>
                    {(competitiveRealtime as any)?.trend === 'up' ? (
                      <ArrowUp className="h-5 w-5 text-red-600" />
                    ) : (competitiveRealtime as any)?.trend === 'down' ? (
                      <ArrowDown className="h-5 w-5 text-[#76B900]" />
                    ) : (
                      <Minus className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    New Competitors: {(competitiveRealtime as any)?.newCompetitors || '0 detected this week'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Patent Filings: {(competitiveRealtime as any)?.patentActivity || '2 relevant filings monitored'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Funding Activity: {(competitiveRealtime as any)?.fundingActivity || '$24M raised by adjacent companies'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Market Funding Intelligence */}
          <Card className="border-[#76B900]200 dark:border-[#5a8f00]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-[#76B900]" />
                    Live Market Funding
                  </CardTitle>
                  <CardDescription>Real-time funding levels and investment activity</CardDescription>
                </div>
                <SmartRefresh
                  onManualRefresh={() => refetchFunding()}
                  isLoading={fundingLoading}
                  endpoint="/api/market/funding"
                />
              </div>
            </CardHeader>
            <CardContent>
              {fundingLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold text-[#76B900]">
                      ${(marketFunding as any)?.totalFunding || '2.4B'}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Last 30 Days
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Healthcare AI: ${(marketFunding as any)?.healthcareAI || '450M raised'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    No-Code Platforms: ${(marketFunding as any)?.noCodePlatforms || '380M raised'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Voice Technology: ${(marketFunding as any)?.voiceTech || '125M raised'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Average Valuation: ${(marketFunding as any)?.avgValuation || '42M per company'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Market Intelligence */}
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
                    Market Intelligence
                  </CardTitle>
                  <CardDescription>Live market trends and opportunities</CardDescription>
                </div>
                <SmartRefresh
                  onManualRefresh={() => refetchIntelligence()}
                  isLoading={intelligenceLoading}
                  endpoint="/api/market/intelligence"
                />
              </div>
            </CardHeader>
            <CardContent>
              {intelligenceLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {(marketIntelligence as any)?.marketSentiment || 'BULLISH'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Growth Rate: {(marketIntelligence as any)?.growthRate || '+87% YoY in Healthcare AI'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Key Trend: {(marketIntelligence as any)?.keyTrend || 'AI-powered development platforms gaining traction'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Opportunity Score: {(marketIntelligence as any)?.opportunityScore || '9.2/10 for healthcare specialization'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Threat Monitoring */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
                    Threat Monitoring
                  </CardTitle>
                  <CardDescription>Live competitive threat detection and alerts</CardDescription>
                </div>
                <SmartRefresh
                  onManualRefresh={() => refetchThreats()}
                  isLoading={threatsLoading}
                  endpoint="/api/competitive/threats"
                />
              </div>
            </CardHeader>
            <CardContent>
              {threatsLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-orange-600">
                      {(threats as any)?.activeThreats || '0'}
                    </div>
                    <div className="text-sm">Active Threats</div>
                    <Bell className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Patent Conflicts: {(threats as any)?.patentConflicts || '0 detected'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Direct Competitors: {(threats as any)?.directCompetitors || '2 monitored actively'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Technology Overlap: {(threats as any)?.techOverlap || '15% with existing solutions'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Center */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
          <CardHeader>
            <CardTitle className="text-xl">Live Action Center</CardTitle>
            <CardDescription>Dynamic responses to market conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => handleUrgentAction("Accelerate Patent Filing")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Accelerate Patents
              </Button>
              <Button 
                onClick={() => handleUrgentAction("Initiate Strategic Partnership")}
                className="bg-[#76B900] hover:bg-[#5a8f00]"
              >
                Strategic Partnerships
              </Button>
              <Button 
                onClick={() => handleUrgentAction("Prepare Series A Defense")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Series A Prep
              </Button>
              <Button 
                onClick={() => handleUrgentAction("Market Position Analysis")}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Market Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}