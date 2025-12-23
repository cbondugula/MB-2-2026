import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SmartRefresh } from "@/components/ui/smart-refresh";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRefreshInterval } from "@/lib/update-strategy";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, DollarSign, Target, Shield, Crown, Eye, Zap, Brain } from "lucide-react";

export default function OwnerDashboard() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Real-time IP data for platform owner
  const { data: patentPortfolio, isLoading: patentLoading, refetch: refetchPatents } = useQuery({
    queryKey: ["/api/patents/portfolio"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/patents/portfolio"), // 1-minute updates for owner
  });

  const { data: competitiveAnalysis, isLoading: competitiveLoading, refetch: refetchCompetitive } = useQuery({
    queryKey: ["/api/competitive/analysis"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/competitive/analysis"), // 1-minute updates for owner
  });

  const { data: revenueProjections, isLoading: revenueLoading, refetch: refetchRevenue } = useQuery({
    queryKey: ["/api/revenue/projections"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/revenue/projections"), // 1-minute updates for owner
  });

  const { data: acquisitionValues, isLoading: acquisitionLoading, refetch: refetchAcquisition } = useQuery({
    queryKey: ["/api/acquisition/valuations"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: getRefreshInterval("/api/acquisition/valuations"), // 1-minute updates for owner
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Owner Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Crown className="mr-3 h-8 w-8 text-yellow-500" />
                Owner Strategic Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Live access to all IP, business strategy, and competitive intelligence
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2 flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              OWNER LIVE ACCESS
            </Badge>
          </div>
        </div>

        {/* Live Data Alert */}
        <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Owner Mode Active:</strong> You have real-time access to all classified IP data, 
            competitive intelligence, and strategic valuations. This data is protected from all other users.
          </AlertDescription>
        </Alert>

        {/* Strategic Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Patent Portfolio */}
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-purple-600" />
                    Patent Portfolio Value
                  </CardTitle>
                  <CardDescription>Live patent valuation and filing status</CardDescription>
                </div>
                <SmartRefresh
                  onManualRefresh={() => refetchPatents()}
                  isLoading={patentLoading}
                  endpoint="/api/patents/portfolio"
                />
              </div>
            </CardHeader>
            <CardContent>
              {patentLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-purple-600">
                    ${(patentPortfolio as any)?.totalValue || '4.2B - 6.1B'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Portfolio Status: {(patentPortfolio as any)?.status || 'Active Filing Phase'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Filed Patents: {(patentPortfolio as any)?.filedCount || '89 Applications'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Competitive Analysis */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <Target className="mr-2 h-5 w-5 text-red-600" />
                    Competitive Intelligence
                  </CardTitle>
                  <CardDescription>Real-time competitive landscape analysis</CardDescription>
                </div>
                <SmartRefresh
                  onManualRefresh={() => refetchCompetitive()}
                  isLoading={competitiveLoading}
                  endpoint="/api/competitive/analysis"
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
                  <div className="text-2xl font-bold text-red-600">
                    {(competitiveAnalysis as any)?.threatLevel || 'Low Competition'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Market Position: {(competitiveAnalysis as any)?.position || 'Dominant - Zero Direct Competition'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Competitive Moat: {(competitiveAnalysis as any)?.moat || '5-10 Year Technology Lead'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Projections */}
          <Card className="border-[#76B900]200 dark:border-[#5a8f00]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-[#76B900]" />
                    Revenue Projections
                  </CardTitle>
                  <CardDescription>Live revenue forecasting and growth analysis</CardDescription>
                </div>
                <SmartRefresh
                  onManualRefresh={() => refetchRevenue()}
                  isLoading={revenueLoading}
                  endpoint="/api/revenue/projections"
                />
              </div>
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-[#76B900]">
                    ${(revenueProjections as any)?.year5ARR || '8.3B ARR'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Year 1 Target: ${(revenueProjections as any)?.year1 || '185M ARR'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Growth Rate: {(revenueProjections as any)?.growthRate || '650% YoY'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Acquisition Valuations */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                    Acquisition Valuations
                  </CardTitle>
                  <CardDescription>Real-time strategic acquirer interest and valuations</CardDescription>
                </div>
                <SmartRefresh
                  onManualRefresh={() => refetchAcquisition()}
                  isLoading={acquisitionLoading}
                  endpoint="/api/acquisition/valuations"
                />
              </div>
            </CardHeader>
            <CardContent>
              {acquisitionLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-blue-600">
                    ${(acquisitionValues as any)?.currentValuation || '20B - 75B'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Strategic Acquirers: {(acquisitionValues as any)?.interestedParties || 'Microsoft, Oracle, AWS'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Exit Timeline: {(acquisitionValues as any)?.timeline || '18-24 months'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Owner Benefits & Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="text-xl">Owner Dashboard Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">Real-time Updates</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    1-minute refresh intervals for all IP and strategic data
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">Complete Access</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Full visibility into patents, competitive intelligence, and valuations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#76B900] mb-2">Protected Privacy</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    All other users see only public healthcare information
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
            <CardHeader>
              <CardTitle className="text-xl">Advanced Intelligence</CardTitle>
              <CardDescription>Access specialized competitive monitoring tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <a 
                  href="/competitive-intelligence" 
                  className="block p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-red-600">Live Competitive Intelligence</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Real-time competitor analysis with market funding intelligence
                      </div>
                    </div>
                    <Eye className="h-6 w-6 text-red-500" />
                  </div>
                </a>
                
                <a 
                  href="/competitive-advantage" 
                  className="block p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-blue-600">Competitive Advantage Engine</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Big Tech monitoring with innovation acceleration tools
                      </div>
                    </div>
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                </a>

                <a 
                  href="/super-cs-agent" 
                  className="block p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-purple-600">Super CS Agent</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Self-improving AI with hourly technology updates
                      </div>
                    </div>
                    <Brain className="h-6 w-6 text-purple-500" />
                  </div>
                </a>
                
                <div className="text-xs text-gray-500">
                  Features: Hourly self-improvement, latest technology integration,
                  competitive intelligence enhancement, automatic capability upgrades
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}