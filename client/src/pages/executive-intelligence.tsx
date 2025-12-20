import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, TrendingUp, DollarSign, Building2, Target, 
  Users, LineChart, PieChart, BarChart3, Rocket, 
  Shield, Award, Globe, Zap, CheckCircle2, ArrowUpRight,
  Calendar, Briefcase, Scale, Crown, Gem
} from 'lucide-react';

export default function ExecutiveIntelligence() {
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'base' | 'aggressive'>('base');

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['/api/executive/metrics'],
  });

  const { data: projections } = useQuery({
    queryKey: ['/api/executive/projections', selectedScenario],
  });

  const revenueProjections = {
    conservative: {
      year1: 2500000,
      year2: 8500000,
      year3: 22000000,
      year4: 45000000,
      year5: 85000000,
      cagr: 142,
      exitMultiple: 8,
      exitValuation: 680000000
    },
    base: {
      year1: 4200000,
      year2: 15000000,
      year3: 42000000,
      year4: 95000000,
      year5: 180000000,
      cagr: 158,
      exitMultiple: 12,
      exitValuation: 2160000000
    },
    aggressive: {
      year1: 7500000,
      year2: 28000000,
      year3: 85000000,
      year4: 200000000,
      year5: 420000000,
      cagr: 175,
      exitMultiple: 15,
      exitValuation: 6300000000
    }
  };

  const currentProjection = revenueProjections[selectedScenario];

  const marketMetrics = {
    tam: 156000000000,
    sam: 42000000000,
    som: 2100000000,
    marketGrowth: 23.4,
    competitorCount: 47,
    marketShare: {
      current: 0.02,
      projected: 4.8
    }
  };

  const enterpriseMetrics = {
    avgContractValue: 285000,
    enterpriseClients: 12,
    pipelineValue: 18500000,
    winRate: 34,
    salesCycle: 4.2,
    nrr: 128,
    ltv: 1140000,
    cac: 95000,
    ltvCacRatio: 12
  };

  const comparableTransactions = [
    { company: 'Veeva Systems', year: 2023, multiple: 14.2, sector: 'Healthcare SaaS', exitValue: 39000000000 },
    { company: 'Health Catalyst', year: 2023, multiple: 8.5, sector: 'Healthcare Analytics', exitValue: 1200000000 },
    { company: 'Phreesia', year: 2024, multiple: 11.3, sector: 'Patient Intake', exitValue: 1800000000 },
    { company: 'Olive AI', year: 2023, multiple: 6.8, sector: 'Healthcare RPA', exitValue: 850000000 },
    { company: 'Innovaccer', year: 2024, multiple: 15.2, sector: 'Healthcare Data', exitValue: 3200000000 }
  ];

  const formatCurrency = (value: number, compact = false) => {
    if (compact) {
      if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Executive Intelligence
                </h1>
                <p className="text-gray-400">Strategic financial metrics, valuation analysis, and exit potential</p>
              </div>
            </div>
          </div>
          <Badge className="bg-amber-900/50 text-amber-300 border-amber-700 px-4 py-2 text-sm">
            <Gem className="w-4 h-4 mr-2" />
            Investor Grade
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-900/40 to-gray-900 border-emerald-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Projected ARR (Y5)</p>
                  <p className="text-2xl font-bold text-emerald-400" data-testid="text-arr-projection">
                    {formatCurrency(currentProjection.year5, true)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-900/50 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <p className="text-xs text-emerald-500 mt-2">+{currentProjection.cagr}% CAGR</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900/40 to-gray-900 border-amber-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Exit Valuation</p>
                  <p className="text-2xl font-bold text-amber-400" data-testid="text-exit-valuation">
                    {formatCurrency(currentProjection.exitValuation, true)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-900/50 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <p className="text-xs text-amber-500 mt-2">{currentProjection.exitMultiple}x Revenue Multiple</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/40 to-gray-900 border-blue-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">LTV:CAC Ratio</p>
                  <p className="text-2xl font-bold text-blue-400" data-testid="text-ltv-cac">
                    {enterpriseMetrics.ltvCacRatio}:1
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <p className="text-xs text-blue-500 mt-2">Best-in-class unit economics</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/40 to-gray-900 border-purple-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Net Revenue Retention</p>
                  <p className="text-2xl font-bold text-purple-400" data-testid="text-nrr">
                    {enterpriseMetrics.nrr}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-xs text-purple-500 mt-2">Strong expansion revenue</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-800/50 rounded-lg p-1 border border-gray-700">
            {(['conservative', 'base', 'aggressive'] as const).map((scenario) => (
              <button
                key={scenario}
                onClick={() => setSelectedScenario(scenario)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedScenario === scenario
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                data-testid={`button-scenario-${scenario}`}
              >
                {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="revenue" className="data-[state=active]:bg-amber-600">
              <LineChart className="w-4 h-4 mr-2" />
              Revenue Model
            </TabsTrigger>
            <TabsTrigger value="valuation" className="data-[state=active]:bg-amber-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Valuation
            </TabsTrigger>
            <TabsTrigger value="exit" className="data-[state=active]:bg-amber-600">
              <Target className="w-4 h-4 mr-2" />
              Exit Analysis
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-amber-600">
              <Globe className="w-4 h-4 mr-2" />
              Market Opportunity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    5-Year Revenue Trajectory
                  </CardTitle>
                  <CardDescription>Annual Recurring Revenue projections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { year: 'Year 1', value: currentProjection.year1 },
                      { year: 'Year 2', value: currentProjection.year2 },
                      { year: 'Year 3', value: currentProjection.year3 },
                      { year: 'Year 4', value: currentProjection.year4 },
                      { year: 'Year 5', value: currentProjection.year5 }
                    ].map((item, idx) => (
                      <div key={item.year} className="flex items-center gap-4">
                        <span className="w-16 text-sm text-gray-400">{item.year}</span>
                        <div className="flex-1">
                          <Progress 
                            value={(item.value / currentProjection.year5) * 100} 
                            className="h-6"
                          />
                        </div>
                        <span className="w-24 text-right font-semibold text-emerald-400">
                          {formatCurrency(item.value, true)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-emerald-900/20 rounded-lg border border-emerald-700/50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Compound Annual Growth Rate</span>
                      <span className="text-2xl font-bold text-emerald-400">{currentProjection.cagr}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    Enterprise Sales Metrics
                  </CardTitle>
                  <CardDescription>Go-to-market performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">Avg Contract Value</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(enterpriseMetrics.avgContractValue)}</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">Enterprise Clients</p>
                      <p className="text-xl font-bold text-white">{enterpriseMetrics.enterpriseClients}</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">Pipeline Value</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(enterpriseMetrics.pipelineValue, true)}</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">Win Rate</p>
                      <p className="text-xl font-bold text-white">{enterpriseMetrics.winRate}%</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">Sales Cycle</p>
                      <p className="text-xl font-bold text-white">{enterpriseMetrics.salesCycle} months</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">Customer LTV</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(enterpriseMetrics.ltv, true)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="valuation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-amber-900/30 to-gray-900 border-amber-700/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    Valuation Scenarios
                  </CardTitle>
                  <CardDescription>Based on revenue multiples and comparable transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    {(['conservative', 'base', 'aggressive'] as const).map((scenario) => {
                      const proj = revenueProjections[scenario];
                      const isSelected = scenario === selectedScenario;
                      return (
                        <div 
                          key={scenario}
                          className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-900/30 border-amber-500' 
                              : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                          }`}
                          onClick={() => setSelectedScenario(scenario)}
                        >
                          <h3 className="text-lg font-semibold text-white capitalize mb-4">{scenario}</h3>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-400">Y5 Revenue</p>
                              <p className="text-lg font-bold text-emerald-400">{formatCurrency(proj.year5, true)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Exit Multiple</p>
                              <p className="text-lg font-bold text-blue-400">{proj.exitMultiple}x</p>
                            </div>
                            <div className="pt-3 border-t border-gray-700">
                              <p className="text-xs text-gray-400">Exit Valuation</p>
                              <p className="text-2xl font-bold text-amber-400">{formatCurrency(proj.exitValuation, true)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    Valuation Drivers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Healthcare Focus', value: 95, color: 'emerald' },
                      { label: 'AI/Voice Innovation', value: 92, color: 'blue' },
                      { label: 'Compliance Moat', value: 98, color: 'purple' },
                      { label: 'Enterprise Traction', value: 78, color: 'amber' },
                      { label: 'Market Timing', value: 88, color: 'cyan' }
                    ].map((driver) => (
                      <div key={driver.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{driver.label}</span>
                          <span className="text-white font-medium">{driver.value}%</span>
                        </div>
                        <Progress value={driver.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exit" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    Comparable Transactions
                  </CardTitle>
                  <CardDescription>Recent healthcare SaaS exits and valuations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {comparableTransactions.map((tx) => (
                      <div 
                        key={tx.company}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-white">{tx.company}</p>
                          <p className="text-sm text-gray-400">{tx.sector} • {tx.year}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-400">{formatCurrency(tx.exitValue, true)}</p>
                          <p className="text-sm text-blue-400">{tx.multiple}x revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-amber-400" />
                    Exit Pathways
                  </CardTitle>
                  <CardDescription>Strategic options for value realization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-emerald-900/30 to-gray-900 rounded-lg border border-emerald-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-semibold text-white">Strategic Acquisition</h4>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        Target acquirers: Epic, Cerner, Oracle Health, Microsoft, Google Health
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-700">
                          Highest Probability
                        </Badge>
                        <span className="text-emerald-400 font-bold">12-15x multiple</span>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-900/30 to-gray-900 rounded-lg border border-blue-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <LineChart className="w-5 h-5 text-blue-400" />
                        <h4 className="font-semibold text-white">IPO</h4>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        Public listing at $100M+ ARR with strong healthcare SaaS metrics
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-900/50 text-blue-300 border-blue-700">
                          18-24 Month Timeline
                        </Badge>
                        <span className="text-blue-400 font-bold">15-20x multiple</span>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-900/30 to-gray-900 rounded-lg border border-purple-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        <h4 className="font-semibold text-white">Private Equity</h4>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        Growth equity or buyout from healthcare-focused PE firms
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-900/50 text-purple-300 border-purple-700">
                          Secondary Option
                        </Badge>
                        <span className="text-purple-400 font-bold">8-12x multiple</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-cyan-900/30 to-gray-900 border-cyan-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Total Addressable Market
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-cyan-400 mb-2">{formatCurrency(marketMetrics.tam, true)}</p>
                  <p className="text-sm text-gray-400">Global Healthcare IT Market (2025)</p>
                  <div className="mt-4 p-3 bg-cyan-900/20 rounded-lg">
                    <p className="text-sm text-cyan-300">{formatPercent(marketMetrics.marketGrowth)} annual growth rate</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900 border-blue-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-400" />
                    Serviceable Addressable Market
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-blue-400 mb-2">{formatCurrency(marketMetrics.sam, true)}</p>
                  <p className="text-sm text-gray-400">Healthcare App Development Platforms</p>
                  <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-300">Voice + AI + Compliance segment</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-900/30 to-gray-900 border-emerald-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    Serviceable Obtainable Market
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-emerald-400 mb-2">{formatCurrency(marketMetrics.som, true)}</p>
                  <p className="text-sm text-gray-400">Realistic 5-Year Capture Target</p>
                  <div className="mt-4 p-3 bg-emerald-900/20 rounded-lg">
                    <p className="text-sm text-emerald-300">{formatPercent(marketMetrics.marketShare.projected)} market share</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Competitive Moat
                </CardTitle>
                <CardDescription>Defensible advantages in the healthcare development space</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Shield, title: 'HIPAA-First Architecture', desc: 'Built-in compliance from day one, not bolted on', color: 'emerald' },
                    { icon: Zap, title: 'Voice-Controlled Development', desc: 'Patent-pending voice commands for healthcare apps', color: 'amber' },
                    { icon: Award, title: 'Healthcare AI Models', desc: 'Fine-tuned LLMs trained on medical terminology', color: 'blue' },
                    { icon: Globe, title: 'Global Compliance', desc: 'GDPR, HIPAA, SOC2, FDA 21 CFR Part 11', color: 'purple' }
                  ].map((moat) => (
                    <div 
                      key={moat.title}
                      className={`p-4 bg-${moat.color}-900/20 rounded-lg border border-${moat.color}-700/50`}
                    >
                      <moat.icon className={`w-8 h-8 text-${moat.color}-400 mb-3`} />
                      <h4 className="font-semibold text-white mb-1">{moat.title}</h4>
                      <p className="text-sm text-gray-400">{moat.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 bg-gradient-to-r from-amber-900/30 via-orange-900/20 to-red-900/30 border-amber-700/50">
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Invest?</h2>
              <p className="text-gray-400 mb-6">
                MedBuilder represents a unique opportunity in the $156B healthcare IT market
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-500 text-white" data-testid="button-contact-investor-relations">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Investor Relations
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800" data-testid="button-download-deck">
                  <ArrowUpRight className="w-5 h-5 mr-2" />
                  Download Pitch Deck
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
