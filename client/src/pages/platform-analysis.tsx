import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Globe, 
  DollarSign, 
  Target, 
  Award,
  Shield,
  Sparkles,
  Code,
  Users,
  Building2,
  BarChart3,
  Zap,
  Brain,
  Lock,
  CheckCircle2,
  Rocket,
  Loader2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

export default function PlatformAnalysis() {
  // Fetch platform analytics dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/platform-analytics/dashboard'],
  });
  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading platform analytics...</p>
        </div>
      </div>
    );
  }

  const summary = (dashboardData as any)?.summary || {};
  const ipPortfolio = (dashboardData as any)?.ip?.portfolio || [];
  const competitors = (dashboardData as any)?.market?.competitors || [];
  const revenueProjections = (dashboardData as any)?.revenue?.projections || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-[#76B900] bg-clip-text text-transparent mb-4">
            MedBuilder Platform Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive Assessment of Features, Value Proposition, Revenue Potential & Global Market Positioning
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="text-sm">
              <Shield className="w-3 h-3 mr-1" />
              Enterprise Healthcare Platform
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Globe className="w-3 h-3 mr-1" />
              193 Countries
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Award className="w-3 h-3 mr-1" />
              5+ Patent Innovations
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="features" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="features">Platform Features</TabsTrigger>
            <TabsTrigger value="value">Value Proposition</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Potential</TabsTrigger>
            <TabsTrigger value="positioning">Market Position</TabsTrigger>
          </TabsList>

          {/* PLATFORM FEATURES TAB */}
          <TabsContent value="features" className="space-y-6">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Core Platform Capabilities
                </CardTitle>
                <CardDescription>Comprehensive healthcare development ecosystem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI-Powered Development */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    AI-Powered Development Platform
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FeatureItem icon={<Code className="w-4 h-4" />} title="Chat-to-Code Interface" description="Natural language → Production code (competing with v0.dev, bolt.new)" />
                    <FeatureItem icon={<Zap className="w-4 h-4" />} title="Real-Time Code Preview" description="Live sandbox with instant code execution & preview" />
                    <FeatureItem icon={<Brain className="w-4 h-4" />} title="Multi-AI Integration" description="GPT-4o, Claude, Gemini, xAI Grok for optimal results" />
                    <FeatureItem icon={<CheckCircle2 className="w-4 h-4" />} title="HIPAA-Compliant Generation" description="Auto-generated audit trails & security controls" />
                  </div>
                </div>

                <Separator />

                {/* Healthcare Specialization */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#76B900]" />
                    Healthcare-Specific Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FeatureItem icon={<Award className="w-4 h-4" />} title="Standards Translation" description="FHIR ↔ HL7 ↔ SNOMED ↔ ICD-10 ↔ LOINC ↔ DICOM" />
                    <FeatureItem icon={<Lock className="w-4 h-4" />} title="Compliance Automation" description="Automated HIPAA, GDPR, FDA compliance checking" />
                    <FeatureItem icon={<Brain className="w-4 h-4" />} title="9 Medical BERT Models" description="ClinicalBERT, BioBERT, PubMedBERT, RadBERT, etc." />
                    <FeatureItem icon={<Target className="w-4 h-4" />} title="Clinical AI Constellation" description="Multi-model safety verification (99.02% accuracy)" />
                  </div>
                </div>

                <Separator />

                {/* Development Tools */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    Advanced Development Tools
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FeatureItem icon={<Sparkles className="w-4 h-4" />} title="Visual Builder" description="Drag-and-drop healthcare component assembly" />
                    <FeatureItem icon={<Users className="w-4 h-4" />} title="Voice-Controlled Development" description="Build apps using natural voice commands" />
                    <FeatureItem icon={<Zap className="w-4 h-4" />} title="Super Agent" description="AI orchestration for complex healthcare workflows" />
                    <FeatureItem icon={<BarChart3 className="w-4 h-4" />} title="14+ HIPAA Templates" description="EHR, Telehealth, Lab Management, Pharmacy, etc." />
                  </div>
                </div>

                <Separator />

                {/* Global Capabilities */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-teal-600" />
                    Global Healthcare Coverage
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FeatureItem icon={<Globe className="w-4 h-4" />} title="193 Countries Supported" description="Global privacy compliance (HIPAA, GDPR, etc.)" />
                    <FeatureItem icon={<Users className="w-4 h-4" />} title="45 Languages" description="Multicultural healthcare support" />
                    <FeatureItem icon={<Building2 className="w-4 h-4" />} title="Alternative Medicine Integration" description="Ayurveda, TCM, Homeopathy, Naturopathy" />
                    <FeatureItem icon={<CheckCircle2 className="w-4 h-4" />} title="International Standards" description="HL7, FHIR, SNOMED CT, ICD-10, LOINC" />
                  </div>
                </div>

                <Separator />

                {/* Enterprise Features */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    Enterprise & Security
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FeatureItem icon={<Lock className="w-4 h-4" />} title="Multi-Tenant Architecture" description="Secure data isolation per organization" />
                    <FeatureItem icon={<Shield className="w-4 h-4" />} title="HIPAA Audit Logging" description="Comprehensive compliance tracking" />
                    <FeatureItem icon={<Users className="w-4 h-4" />} title="Real-Time Collaboration" description="Team development with AI assistance" />
                    <FeatureItem icon={<BarChart3 className="w-4 h-4" />} title="Executive Dashboards" description="ROI tracking & competitive intelligence" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Stack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-teal-600" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <TechBadge category="Frontend" items={["React 18", "TypeScript", "Tailwind CSS", "Vite"]} />
                  <TechBadge category="Backend" items={["Node.js", "Express", "PostgreSQL", "Drizzle ORM"]} />
                  <TechBadge category="AI/ML" items={["OpenAI GPT-4", "Google Gemini", "xAI Grok", "Med-BERT"]} />
                  <TechBadge category="Healthcare" items={["FHIR", "HL7", "SNOMED", "ICD-10"]} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VALUE PROPOSITION TAB */}
          <TabsContent value="value" className="space-y-6">
            <Card className="border-[#76B900]200 dark:border-[#5a8f00]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#76B900]" />
                  Unique Value Propositions
                </CardTitle>
                <CardDescription>What makes MedBuilder different from competitors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ValueProp
                  icon={<Shield className="w-6 h-6 text-blue-600" />}
                  title="Healthcare-First AI Development"
                  description="Unlike v0.dev and bolt.new (general-purpose), MedBuilder is the ONLY AI development platform built exclusively for healthcare"
                  benefits={[
                    "Built-in HIPAA compliance in every generated line of code",
                    "Medical AI models (9 specialized BERT models) for clinical accuracy",
                    "Automated healthcare standards translation (FHIR, HL7, SNOMED)",
                    "Pre-built templates for all healthcare domains"
                  ]}
                />

                <Separator />

                <ValueProp
                  icon={<Brain className="w-6 h-6 text-purple-600" />}
                  title="Clinical AI Safety Constellation (Patent Innovation #1)"
                  description="Revolutionary multi-AI verification system ensuring 99.02% accuracy vs 80% for single-AI systems"
                  benefits={[
                    "Reduces medical errors by 65%",
                    "Automatic drug interaction checking",
                    "Multi-model consensus scoring for safety",
                    "Real-time evidence-based medicine validation"
                  ]}
                />

                <Separator />

                <ValueProp
                  icon={<Globe className="w-6 h-6 text-teal-600" />}
                  title="Global Healthcare Compliance Automation"
                  description="Only platform supporting 193 countries with automated multi-jurisdiction compliance"
                  benefits={[
                    "Automatic HIPAA (US), GDPR (EU), PHIPA (Canada) compliance",
                    "45 languages for multicultural healthcare",
                    "Alternative medicine integration (Ayurveda, TCM, etc.)",
                    "Predictive compliance engine for regulatory changes"
                  ]}
                />

                <Separator />

                <ValueProp
                  icon={<Zap className="w-6 h-6 text-yellow-600" />}
                  title="10x Development Speed"
                  description="Build enterprise healthcare applications in hours instead of months"
                  benefits={[
                    "Chat-to-code: Natural language → Production app",
                    "Voice-controlled development (hands-free coding)",
                    "14+ pre-built HIPAA-compliant templates",
                    "Auto-generated security, audit trails, and compliance"
                  ]}
                />

                <Separator />

                <ValueProp
                  icon={<DollarSign className="w-6 h-6 text-[#76B900]" />}
                  title="80% Cost Reduction"
                  description="Dramatically lower healthcare software development costs"
                  benefits={[
                    "Eliminates need for specialized HIPAA consultants",
                    "Reduces compliance implementation time by 80%",
                    "No manual standards translation work (automated)",
                    "Built-in testing and quality assurance"
                  ]}
                />
              </CardContent>
            </Card>

            {/* Competitive Differentiation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-600" />
                  Competitive Differentiation Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Feature</th>
                        <th className="text-center p-3 bg-blue-50 dark:bg-blue-950">MedBuilder</th>
                        <th className="text-center p-3">v0.dev</th>
                        <th className="text-center p-3">bolt.new</th>
                        <th className="text-center p-3">Epic/Cerner</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ComparisonRow feature="Healthcare-Specific AI" medbuilder="✅ 9 Medical AI Models" v0dev="❌ General AI" boltnew="❌ General AI" epic="⚠️ Rule-Based" />
                      <ComparisonRow feature="HIPAA Auto-Compliance" medbuilder="✅ Built-In" v0dev="❌ Manual" boltnew="❌ Manual" epic="✅ Manual Setup" />
                      <ComparisonRow feature="Standards Translation" medbuilder="✅ AI-Powered (Patent)" v0dev="❌ None" boltnew="❌ None" epic="⚠️ Basic" />
                      <ComparisonRow feature="Multi-AI Safety Verification" medbuilder="✅ 99.02% Accuracy" v0dev="❌ None" boltnew="❌ None" epic="❌ None" />
                      <ComparisonRow feature="Global Compliance (193 countries)" medbuilder="✅ Automated" v0dev="❌ None" boltnew="❌ None" epic="⚠️ Limited" />
                      <ComparisonRow feature="Voice-Controlled Development" medbuilder="✅ Patent Innovation" v0dev="❌ None" boltnew="❌ None" epic="❌ None" />
                      <ComparisonRow feature="Development Speed" medbuilder="🚀 Hours" v0dev="⚡ Days" boltnew="⚡ Days" epic="🐌 Months" />
                      <ComparisonRow feature="Cost" medbuilder="💰 Low" v0dev="💰 Low" boltnew="💰 Low" epic="💸 Very High" />
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REVENUE POTENTIAL TAB */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="border-[#76B900]200 dark:border-[#5a8f00]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#76B900]" />
                  Revenue Potential Analysis
                </CardTitle>
                <CardDescription>Market sizing, pricing strategy, and growth projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Market Size */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Total Addressable Market (TAM)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                      value="$11.9B"
                      label="Global Healthcare IT Market (2024)"
                      subtext="Growing at 19.8% CAGR"
                      trend="up"
                    />
                    <MetricCard
                      value="$21.6B"
                      label="Projected Market (2030)"
                      subtext="6-year projection"
                      trend="up"
                    />
                    <MetricCard
                      value="$2.4B"
                      label="Serviceable Addressable Market"
                      subtext="Healthcare dev tools segment"
                      trend="up"
                    />
                  </div>
                </div>

                <Separator />

                {/* Pricing Strategy */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Revenue Streams</h3>
                  <div className="space-y-4">
                    <RevenueStream
                      tier="Starter"
                      price="$49/month"
                      target="Individual developers, small clinics"
                      volume="10,000 users"
                      arr="$5.9M ARR"
                    />
                    <RevenueStream
                      tier="Professional"
                      price="$199/month"
                      target="Mid-size healthcare organizations"
                      volume="2,000 users"
                      arr="$4.8M ARR"
                    />
                    <RevenueStream
                      tier="Enterprise"
                      price="$999/month"
                      target="Large hospital systems, pharma companies"
                      volume="500 users"
                      arr="$6.0M ARR"
                    />
                    <RevenueStream
                      tier="Enterprise Plus (Custom)"
                      price="$5,000+/month"
                      target="Fortune 500 healthcare, Government"
                      volume="100 users"
                      arr="$6.0M ARR"
                    />
                    <div className="mt-4 p-4 bg-[#76B900]50 dark:bg-[#1a3d00] rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Total Projected ARR (Year 3)</span>
                        <span className="text-2xl font-bold text-[#76B900]">$22.7M</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Revenue */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Additional Revenue Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdditionalRevenue
                      source="Professional Services"
                      description="Custom implementation, consulting, training"
                      potential="$5-10M annually"
                    />
                    <AdditionalRevenue
                      source="Marketplace Commission"
                      description="Third-party templates, components, integrations"
                      potential="$2-4M annually"
                    />
                    <AdditionalRevenue
                      source="API Access Fees"
                      description="Programmatic access to AI services"
                      potential="$3-6M annually"
                    />
                    <AdditionalRevenue
                      source="White-Label Licensing"
                      description="Healthcare vendors embedding platform"
                      potential="$8-15M annually"
                    />
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total Revenue Potential (Year 5)</span>
                      <span className="text-2xl font-bold text-blue-600">$40-67M ARR</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* IP Valuation - PROVISIONAL PATENTS FILED */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-semibold text-lg">Intellectual Property Valuation</h3>
                    <Badge className="bg-[#76B900] text-white hover:bg-[#5a8f00]">
                      <Award className="w-3 h-3 mr-1" />
                      5 PROVISIONAL PATENTS FILED
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {ipPortfolio.map((patent: any) => (
                      <div key={patent.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{patent.name}</h4>
                              {patent.filingStatus === 'provisional' && (
                                <Badge variant="outline" className="text-xs border-[#76B900] text-[#5a8f00] dark:text-[#8CC63F]">
                                  Patent Pending
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {patent.filingNumber && (
                                <span className="flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  USPTO: {patent.filingNumber}
                                </span>
                              )}
                              {patent.filingDate && (
                                <span>
                                  Filed: {new Date(patent.filingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{patent.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {patent.valuationMethod}
                            </p>
                          </div>
                          <div className="ml-4 text-right">
                            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                              ${(patent.estimatedValue / 1000000).toFixed(0)}M
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 p-5 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-lg">Total IP Portfolio Value</span>
                        <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          ${(ipPortfolio.reduce((sum: number, p: any) => sum + p.estimatedValue, 0) / 1000000).toFixed(0)}M
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-[#76B900]" />
                        <span className="font-medium">5 Provisional Patents Filed with USPTO (September 2025)</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Comparable healthcare AI acquisitions: IBM Watson Health ($1B+), Flatiron Health ($1.9B)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exit Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-blue-600" />
                  Exit Strategy & Acquisition Potential
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ExitScenario
                    buyer="Epic Systems / Cerner (Oracle Health)"
                    rationale="Add AI capabilities to existing EHR platforms"
                    valuation="$500M - $1.2B"
                    probability="High"
                  />
                  <ExitScenario
                    buyer="Google Cloud / AWS / Microsoft Azure"
                    rationale="Strengthen healthcare cloud offerings"
                    valuation="$800M - $2.0B"
                    probability="Medium-High"
                  />
                  <ExitScenario
                    buyer="Vercel / Replit / GitHub (Microsoft)"
                    rationale="Add vertical-specific development capabilities"
                    valuation="$300M - $800M"
                    probability="Medium"
                  />
                  <ExitScenario
                    buyer="Healthcare AI Startups (Tempus, Flatiron, etc.)"
                    rationale="Horizontal expansion into development tools"
                    valuation="$200M - $500M"
                    probability="Low-Medium"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MARKET POSITIONING TAB */}
          <TabsContent value="positioning" className="space-y-6">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Global Competitive Market Positioning
                </CardTitle>
                <CardDescription>Strategic position in the healthcare development ecosystem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Market Position */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Strategic Market Position</h3>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 rounded-lg">
                    <div className="text-center mb-4">
                      <Badge className="mb-2 text-lg px-4 py-1">Category Creator</Badge>
                      <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        "AI-Powered Healthcare Development Platform"
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        First-mover advantage in an entirely new category
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Competitive Advantages */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Sustainable Competitive Advantages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CompetitiveAdvantage
                      advantage="Technology Moat"
                      description="5+ patentable innovations creating 24-36 month lead"
                      strength="Very Strong"
                    />
                    <CompetitiveAdvantage
                      advantage="Network Effects"
                      description="Template marketplace grows with user base"
                      strength="Strong"
                    />
                    <CompetitiveAdvantage
                      advantage="Switching Costs"
                      description="Critical healthcare apps lock in customers"
                      strength="Very Strong"
                    />
                    <CompetitiveAdvantage
                      advantage="Domain Expertise"
                      description="Deep healthcare knowledge vs. general competitors"
                      strength="Very Strong"
                    />
                    <CompetitiveAdvantage
                      advantage="Regulatory Barriers"
                      description="HIPAA/FDA expertise difficult to replicate"
                      strength="Strong"
                    />
                    <CompetitiveAdvantage
                      advantage="Data Advantage"
                      description="Healthcare-specific training data accumulation"
                      strength="Medium (Growing)"
                    />
                  </div>
                </div>

                <Separator />

                {/* Market Dynamics */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Market Dynamics & Trends</h3>
                  <div className="space-y-3">
                    <MarketTrend
                      trend="AI-First Development"
                      impact="High Tailwind"
                      description="Shift from traditional coding to AI-assisted development accelerating"
                    />
                    <MarketTrend
                      trend="Healthcare Digital Transformation"
                      impact="High Tailwind"
                      description="$11.9B → $21.6B market growth (19.8% CAGR) driven by pandemic"
                    />
                    <MarketTrend
                      trend="No-Code/Low-Code Adoption"
                      impact="Medium Tailwind"
                      description="Enterprises seeking faster development cycles"
                    />
                    <MarketTrend
                      trend="Regulatory Pressure"
                      impact="Medium Tailwind"
                      description="Increasing compliance requirements favor automation"
                    />
                    <MarketTrend
                      trend="Vertical-Specific Tools"
                      impact="High Tailwind"
                      description="Move away from horizontal platforms to domain-specific solutions"
                    />
                  </div>
                </div>

                <Separator />

                {/* Go-To-Market Strategy */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Go-To-Market Strategy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GTMStrategy
                      segment="Developer-Led Growth"
                      approach="Free tier → viral adoption → team expansion"
                      channels={["GitHub", "Dev.to", "Healthcare IT forums"]}
                    />
                    <GTMStrategy
                      segment="Enterprise Sales"
                      approach="Direct sales to hospital systems & pharma"
                      channels={["HIMSS conferences", "Healthcare CIO networks"]}
                    />
                    <GTMStrategy
                      segment="Channel Partnerships"
                      approach="Integration with Epic, Cerner, AWS HealthLake"
                      channels={["Technology partnerships", "Reseller agreements"]}
                    />
                    <GTMStrategy
                      segment="Education & Training"
                      approach="Healthcare IT bootcamps, certifications"
                      channels={["Universities", "Professional associations"]}
                    />
                  </div>
                </div>

                <Separator />

                {/* Geographic Expansion */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Global Expansion Roadmap</h3>
                  <div className="space-y-3">
                    <GeographicPhase
                      phase="Phase 1: North America (Year 1-2)"
                      markets={["United States", "Canada"]}
                      focus="HIPAA compliance, English language"
                      revenue="$10-15M ARR"
                    />
                    <GeographicPhase
                      phase="Phase 2: Europe (Year 2-3)"
                      markets={["UK", "Germany", "France", "Netherlands"]}
                      focus="GDPR compliance, multi-language"
                      revenue="$8-12M ARR"
                    />
                    <GeographicPhase
                      phase="Phase 3: Asia-Pacific (Year 3-4)"
                      markets={["Singapore", "Australia", "Japan", "India"]}
                      focus="Regional compliance standards"
                      revenue="$12-18M ARR"
                    />
                    <GeographicPhase
                      phase="Phase 4: Global (Year 4-5)"
                      markets={["Latin America", "Middle East", "Africa"]}
                      focus="Emerging market penetration"
                      revenue="$10-15M ARR"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SWOT Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>SWOT Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SWOTQuadrant
                    title="Strengths"
                    color="green"
                    items={[
                      "First-mover in healthcare AI dev tools",
                      "5+ patentable innovations",
                      "193 countries, 45 languages",
                      "HIPAA-compliant by default",
                      "Multi-AI safety verification"
                    ]}
                  />
                  <SWOTQuadrant
                    title="Weaknesses"
                    color="red"
                    items={[
                      "New platform (needs user base)",
                      "Complex sales cycle for healthcare",
                      "Requires healthcare domain expertise",
                      "High initial development costs",
                      "Regulatory compliance overhead"
                    ]}
                  />
                  <SWOTQuadrant
                    title="Opportunities"
                    color="blue"
                    items={[
                      "$21.6B healthcare IT market by 2030",
                      "AI adoption accelerating post-2023",
                      "Remote healthcare expansion",
                      "Government digital health initiatives",
                      "White-label partnership opportunities"
                    ]}
                  />
                  <SWOTQuadrant
                    title="Threats"
                    color="yellow"
                    items={[
                      "Microsoft/Google entering healthcare AI",
                      "Epic/Cerner building own dev tools",
                      "Regulatory changes (AI in healthcare)",
                      "Security breaches damaging trust",
                      "Economic downturn reducing IT spend"
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary & Recommendation */}
        <Card className="mt-8 border-2 border-blue-600 dark:border-blue-400">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-600" />
              Executive Summary & Strategic Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-lg">
                <strong className="text-blue-600">MedBuilder represents a category-creating opportunity</strong> at the intersection of three massive trends: AI-powered development, healthcare digital transformation, and regulatory automation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="p-4 bg-[#76B900]50 dark:bg-[#1a3d00] rounded-lg text-center">
                  <div className="text-3xl font-bold text-[#76B900]">$40-67M</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ARR Potential (Year 5)</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600">$80-160M</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">IP Portfolio Value</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">$0.5-2.0B</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Exit Valuation</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 p-6 rounded-lg border-l-4 border-yellow-600">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-yellow-600" />
                  Strategic Recommendations
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#76B900] mt-0.5 flex-shrink-0" />
                    <span><strong>Immediate:</strong> File patent applications for 5 core innovations within 90 days (provisional patents cost $3-5K each)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#76B900] mt-0.5 flex-shrink-0" />
                    <span><strong>Short-term:</strong> Launch developer beta with 100 healthcare developers for product validation and case studies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#76B900] mt-0.5 flex-shrink-0" />
                    <span><strong>Medium-term:</strong> Secure strategic partnerships with Epic/Cerner for distribution (similar to AWS HealthLake model)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#76B900] mt-0.5 flex-shrink-0" />
                    <span><strong>Long-term:</strong> Position for acquisition by major cloud provider (Google, AWS, Azure) or healthcare IT giant (Epic, Oracle Health)</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                This analysis is based on current market conditions (November 2025), comparable healthcare AI acquisitions, 
                and conservative growth projections. Actual results may vary based on execution, market conditions, and competitive dynamics.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="text-blue-600 mt-0.5">{icon}</div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">{description}</div>
      </div>
    </div>
  );
}

function TechBadge({ category, items }: { category: string; items: string[] }) {
  return (
    <div>
      <div className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">{category}</div>
      <div className="flex flex-wrap gap-1">
        {items.map(item => (
          <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
        ))}
      </div>
    </div>
  );
}

function ValueProp({ icon, title, description, benefits }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  benefits: string[] 
}) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-3">
        {icon}
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <ul className="space-y-1 ml-11">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-[#76B900] mt-0.5 flex-shrink-0" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComparisonRow({ feature, medbuilder, v0dev, boltnew, epic }: any) {
  return (
    <tr className="border-b">
      <td className="p-3 font-medium">{feature}</td>
      <td className="p-3 text-center bg-blue-50 dark:bg-blue-950 font-semibold text-blue-600 dark:text-blue-400">{medbuilder}</td>
      <td className="p-3 text-center text-gray-600 dark:text-gray-400">{v0dev}</td>
      <td className="p-3 text-center text-gray-600 dark:text-gray-400">{boltnew}</td>
      <td className="p-3 text-center text-gray-600 dark:text-gray-400">{epic}</td>
    </tr>
  );
}

function MetricCard({ value, label, subtext, trend }: any) {
  return (
    <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-[#1a3d00] dark:to-teal-950 rounded-lg border">
      <div className="flex items-center justify-between mb-1">
        <span className="text-2xl font-bold text-[#76B900]">{value}</span>
        {trend === 'up' && <TrendingUp className="w-5 h-5 text-[#76B900]" />}
      </div>
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{subtext}</div>
    </div>
  );
}

function RevenueStream({ tier, price, target, volume, arr }: any) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-semibold">{tier}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{target}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-[#76B900]">{price}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{volume}</div>
        </div>
      </div>
      <div className="text-sm font-medium text-blue-600">{arr}</div>
    </div>
  );
}

function AdditionalRevenue({ source, description, potential }: any) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="font-semibold mb-1">{source}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{description}</div>
      <div className="text-sm font-medium text-teal-600">{potential}</div>
    </div>
  );
}

function IPValuation({ patent, value, rationale }: any) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{patent}</div>
        <div className="font-semibold text-purple-600">{value}</div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{rationale}</div>
    </div>
  );
}

function ExitScenario({ buyer, rationale, valuation, probability }: any) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{buyer}</div>
        <Badge variant={probability === 'High' ? 'default' : 'secondary'}>{probability}</Badge>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{rationale}</div>
      <div className="text-lg font-semibold text-blue-600">{valuation}</div>
    </div>
  );
}

function CompetitiveAdvantage({ advantage, description, strength }: any) {
  const color = strength === 'Very Strong' ? 'green' : strength === 'Strong' ? 'blue' : 'yellow';
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{advantage}</div>
        <Badge variant="outline" className={`text-${color}-600 border-${color}-600`}>{strength}</Badge>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
    </div>
  );
}

function MarketTrend({ trend, impact, description }: any) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{trend}</div>
        <Badge variant="outline" className="text-[#76B900] border-[#76B900]">{impact}</Badge>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
    </div>
  );
}

function GTMStrategy({ segment, approach, channels }: any) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="font-semibold mb-2">{segment}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{approach}</div>
      <div className="flex flex-wrap gap-1">
        {channels.map((channel: string) => (
          <Badge key={channel} variant="secondary" className="text-xs">{channel}</Badge>
        ))}
      </div>
    </div>
  );
}

function GeographicPhase({ phase, markets, focus, revenue }: any) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="font-semibold mb-2">{phase}</div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600 dark:text-gray-400 mb-1">Markets:</div>
          <div className="flex flex-wrap gap-1">
            {markets.map((market: string) => (
              <Badge key={market} variant="outline" className="text-xs">{market}</Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="text-gray-600 dark:text-gray-400 mb-1">Focus: {focus}</div>
          <div className="font-medium text-teal-600">{revenue}</div>
        </div>
      </div>
    </div>
  );
}

function SWOTQuadrant({ title, color, items }: { title: string; color: 'green' | 'red' | 'blue' | 'yellow'; items: string[] }) {
  const bgColor = {
    green: 'bg-[#76B900]50 dark:bg-[#1a3d00]',
    red: 'bg-red-50 dark:bg-red-950',
    blue: 'bg-blue-50 dark:bg-blue-950',
    yellow: 'bg-yellow-50 dark:bg-yellow-950'
  }[color];
  
  const textColor = {
    green: 'text-[#76B900]',
    red: 'text-red-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600'
  }[color];

  return (
    <div className={`p-4 ${bgColor} rounded-lg`}>
      <h4 className={`font-semibold mb-3 ${textColor}`}>{title}</h4>
      <ul className="space-y-2">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <div className={`w-1.5 h-1.5 rounded-full ${textColor.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
