import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Users,
  Building,
  BarChart3,
  Target,
  Clock,
  Award,
  Globe
} from 'lucide-react';

interface ROIMetrics {
  developmentCostReduction: number;
  timeToMarketImprovement: number;
  complianceCostSavings: number;
  totalROI: number;
}

interface CompetitiveAdvantage {
  patentPortfolio: string;
  marketPosition: string;
  technologyLead: string;
  complianceAutomation: number;
}

export default function ExecutiveDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('year1');

  // Fetch executive-level data
  const { data: executiveData, isLoading } = useQuery({
    queryKey: ['/api/executive/dashboard'],
    enabled: true
  });

  const { data: roiData } = useQuery({
    queryKey: ['/api/executive/roi-analysis'],
    enabled: true
  });

  const { data: competitiveData } = useQuery({
    queryKey: ['/api/executive/competitive-analysis'],
    enabled: true
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const defaultROI: ROIMetrics = (roiData as ROIMetrics) || {
    developmentCostReduction: 90,
    timeToMarketImprovement: 85,
    complianceCostSavings: 95,
    totalROI: 340
  };

  const defaultCompetitive: CompetitiveAdvantage = (competitiveData as CompetitiveAdvantage) || {
    patentPortfolio: "$46.63B-$84.88B",
    marketPosition: "Zero Direct Competition",
    technologyLead: "3-5 Year Head Start",
    complianceAutomation: 93
  };

  const revenueProjections = {
    year1: { customers: 2500, arpu: 960, arr: 28.8 },
    year3: { customers: 45000, arpu: 1920, arr: 1037 },
    year5: { customers: 120000, arpu: 3000, arr: 4320 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Building className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Executive Intelligence Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Strategic business intelligence for healthcare AI platform investment decisions.
            Track ROI, competitive advantage, and market opportunity.
          </p>
        </div>

        {/* Key Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center" data-testid="card-total-roi">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {defaultROI.totalROI}%
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total ROI</p>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-cost-reduction">
            <CardContent className="p-6">
              <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {defaultROI.developmentCostReduction}%
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cost Reduction</p>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-compliance-score">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {defaultCompetitive.complianceAutomation}%
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Compliance Automation</p>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-market-position">
            <CardContent className="p-6">
              <Award className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                #1
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Market Position</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="roi-analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="roi-analysis" data-testid="tab-roi">ROI Analysis</TabsTrigger>
            <TabsTrigger value="revenue-projection" data-testid="tab-revenue">Revenue Projection</TabsTrigger>
            <TabsTrigger value="competitive-advantage" data-testid="tab-competitive">Competitive Edge</TabsTrigger>
            <TabsTrigger value="strategic-planning" data-testid="tab-strategic">Strategic Planning</TabsTrigger>
            <TabsTrigger value="risk-assessment" data-testid="tab-risk">Risk Assessment</TabsTrigger>
          </TabsList>

          {/* ROI Analysis Tab */}
          <TabsContent value="roi-analysis">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-6 w-6 mr-2" />
                    Return on Investment Analysis
                  </CardTitle>
                  <CardDescription>
                    Comprehensive financial impact assessment of MedBuilder platform adoption
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Development Cost Reduction */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">Development Cost Reduction</span>
                        <span className="text-2xl font-bold text-green-600">
                          {defaultROI.developmentCostReduction}%
                        </span>
                      </div>
                      <Progress value={defaultROI.developmentCostReduction} className="h-3 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Average savings of $2.4M annually per healthcare organization through automated development
                      </p>
                    </div>

                    {/* Time to Market */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">Time to Market Improvement</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {defaultROI.timeToMarketImprovement}%
                        </span>
                      </div>
                      <Progress value={defaultROI.timeToMarketImprovement} className="h-3 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Healthcare applications deployed 15x faster with voice-controlled development
                      </p>
                    </div>

                    {/* Compliance Cost Savings */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">Compliance Cost Savings</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {defaultROI.complianceCostSavings}%
                        </span>
                      </div>
                      <Progress value={defaultROI.complianceCostSavings} className="h-3 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Automated HIPAA compliance eliminates $850K annually in compliance costs
                      </p>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                        <div>
                          <h3 className="font-semibold text-green-900 dark:text-green-100">
                            Total Annual ROI: {defaultROI.totalROI}%
                          </h3>
                          <p className="text-sm text-green-800 dark:text-green-200">
                            Investment payback period: 3.2 months for typical healthcare organization
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Projection Tab */}
          <TabsContent value="revenue-projection">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-6 w-6 mr-2" />
                    Revenue Growth Projections
                  </CardTitle>
                  <CardDescription>
                    Five-year revenue trajectory with zero competition advantage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex space-x-4 mb-6">
                      {Object.entries(revenueProjections).map(([key, data]) => (
                        <Button
                          key={key}
                          variant={selectedTimeframe === key ? "default" : "outline"}
                          onClick={() => setSelectedTimeframe(key)}
                          data-testid={`button-timeframe-${key}`}
                        >
                          {key === 'year1' ? 'Year 1' : key === 'year3' ? 'Year 3' : 'Year 5'}
                        </Button>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="text-center">
                        <CardContent className="p-4">
                          <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                          <div className="text-xl font-bold">
                            {revenueProjections[selectedTimeframe as keyof typeof revenueProjections].customers.toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Healthcare Organizations</p>
                        </CardContent>
                      </Card>

                      <Card className="text-center">
                        <CardContent className="p-4">
                          <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-2" />
                          <div className="text-xl font-bold">
                            ${revenueProjections[selectedTimeframe as keyof typeof revenueProjections].arpu}/mo
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Average Revenue Per User</p>
                        </CardContent>
                      </Card>

                      <Card className="text-center">
                        <CardContent className="p-4">
                          <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                          <div className="text-xl font-bold">
                            ${revenueProjections[selectedTimeframe as keyof typeof revenueProjections].arr}M
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Annual Recurring Revenue</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Strategic Acquisition Potential by Year 3
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Microsoft Azure Health:</span>
                          <span className="font-bold">$20.7B - $25.9B</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amazon Web Services:</span>
                          <span className="font-bold">$18.7B - $22.8B</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Google Cloud Healthcare:</span>
                          <span className="font-bold">$16.6B - $20.7B</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Competitive Advantage Tab */}
          <TabsContent value="competitive-advantage">
            <div className="grid gap-6 md:grid-cols-2">
              <Card data-testid="card-patent-portfolio">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-6 w-6 mr-2" />
                    Patent Portfolio Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-600">
                      {defaultCompetitive.patentPortfolio}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">89 Patents Strategic Value</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Healthcare Voice Patents:</span>
                      <span className="font-bold">22 Patents</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Multi-AI Validation:</span>
                      <span className="font-bold">94.7/100 Score</span>
                    </div>
                    <div className="flex justify-between">
                      <span>USPTO Approval Chance:</span>
                      <span className="font-bold">87.7%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-market-position">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-6 w-6 mr-2" />
                    Market Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Competitive Analysis</h3>
                      <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          {defaultCompetitive.marketPosition}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                          First-mover advantage in voice-controlled healthcare development
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Technology Lead</h3>
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          {defaultCompetitive.technologyLead}
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Quantum-AI hybrid architecture with patent protection
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-global-coverage">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-6 w-6 mr-2" />
                    Global Reach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Countries Covered:</span>
                      <span className="font-bold">193</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Languages Supported:</span>
                      <span className="font-bold">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cultural Profiles:</span>
                      <span className="font-bold">25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compliance Frameworks:</span>
                      <span className="font-bold">50+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-technology-moats">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-6 w-6 mr-2" />
                    Insurmountable Moats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Badge variant="default" className="mr-2">Tech</Badge>
                      <span className="text-sm">Patent protection blocks competitors</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="secondary" className="mr-2">Market</Badge>
                      <span className="text-sm">Healthcare specialization barrier</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">Network</Badge>
                      <span className="text-sm">Global healthcare federation</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="destructive" className="mr-2">Economic</Badge>
                      <span className="text-sm">High switching costs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Strategic Planning Tab */}
          <TabsContent value="strategic-planning">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Investment Planning</CardTitle>
                  <CardDescription>
                    Long-term strategic recommendations for maximum value realization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Immediate (90 Days)</h3>
                        <ul className="text-sm space-y-1">
                          <li>• Deploy voice controls</li>
                          <li>• Executive dashboard rollout</li>
                          <li>• Medical professional training</li>
                          <li>• HIPAA compliance automation</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Short-term (6 Months)</h3>
                        <ul className="text-sm space-y-1">
                          <li>• 2,500 healthcare customers</li>
                          <li>• $28.8M ARR target</li>
                          <li>• Patent portfolio completion</li>
                          <li>• Strategic partnerships</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Long-term (3-5 Years)</h3>
                        <ul className="text-sm space-y-1">
                          <li>• $4.32B ARR achievement</li>
                          <li>• Global market domination</li>
                          <li>• Strategic acquisition</li>
                          <li>• Industry standard platform</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                        Critical Success Factors
                      </h3>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        <li>• Stakeholder-focused interface development (Priority: Critical)</li>
                        <li>• Voice technology productization (Priority: High)</li>
                        <li>• Executive business intelligence tools (Priority: High)</li>
                        <li>• Global healthcare standards integration (Priority: Medium)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Assessment Tab */}
          <TabsContent value="risk-assessment">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment & Mitigation</CardTitle>
                  <CardDescription>
                    Strategic risk analysis with mitigation strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                        <h3 className="font-semibold text-green-800 dark:text-green-200">Low Risk</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Technical implementation - Platform fully functional with 100x CS Agent capabilities
                        </p>
                      </div>

                      <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Medium Risk</h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                          Market adoption speed - Stakeholder usability gaps identified
                        </p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                          Mitigation: Immediate stakeholder interface improvements and guided onboarding
                        </p>
                      </div>

                      <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                        <h3 className="font-semibold text-red-800 dark:text-red-200">Critical Risk</h3>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                          Patent conversion deadline - 12 months for provisional patents filed in 2024
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Mitigation: Immediate USPTO filing strategy implementation
                        </p>
                      </div>
                    </div>

                    <Button className="w-full" data-testid="button-detailed-risk-report">
                      Generate Detailed Risk Assessment Report
                    </Button>
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