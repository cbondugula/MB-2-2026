import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Building, FileText, TrendingUp, DollarSign, Users, Target, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type HealthcareSegment = "hospital" | "telehealth" | "pharma" | "medtech" | "biotech" | "insurance";

export default function AutoBusiness() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessPlan, setBusinessPlan] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    companyName: "",
    segment: "" as HealthcareSegment | "",
    description: "",
    targetMarket: ""
  });

  const segments = {
    hospital: "Hospital Systems",
    telehealth: "Telehealth Services",
    pharma: "Pharmaceutical",
    medtech: "Medical Technology",
    biotech: "Biotechnology",
    insurance: "Health Insurance"
  };

  const handleGenerate = async () => {
    if (!formData.companyName || !formData.segment || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI business plan generation
    setTimeout(() => {
      const mockPlan = {
        companyName: formData.companyName,
        segment: segments[formData.segment as HealthcareSegment],
        executiveSummary: `${formData.companyName} is a ${segments[formData.segment as HealthcareSegment].toLowerCase()} company focused on ${formData.description}. Our innovative approach addresses key market needs in the healthcare sector.`,
        marketSize: "$12.4B",
        targetRevenue: {
          year1: "$2.8M",
          year3: "$28.5M",
          year5: "$142M"
        },
        customers: {
          target: formData.targetMarket || "Healthcare providers and patients",
          count: "500K+ potential customers"
        },
        competition: [
          { name: "Market Leader A", strength: "Established brand", weakness: "Legacy technology" },
          { name: "Startup B", strength: "Modern tech", weakness: "Limited market reach" }
        ],
        advantages: [
          "AI-powered automation reducing costs by 60%",
          "HIPAA-compliant infrastructure built-in",
          "Faster time-to-market than competitors",
          "Patent-protected technology"
        ],
        fundingNeeded: "$3.5M",
        useOfFunds: {
          productDevelopment: "45%",
          marketing: "25%",
          hiring: "20%",
          operations: "10%"
        }
      };

      setBusinessPlan(mockPlan);
      setIsGenerating(false);
      
      toast({
        title: "Business Plan Generated!",
        description: "Your AI-powered business plan is ready"
      });
    }, 3000);
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
        <Card className="border-2 border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="w-10 h-10 text-orange-500" />
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                    AI Business Plan Generator
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Create investor-ready business plans in minutes
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-green-500 text-white font-bold text-sm px-3 py-1">
                ACTIVE
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Tell us about your healthcare venture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Company Name *</label>
                <Input
                  data-testid="input-company-name"
                  placeholder="e.g., HealthTech Solutions"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Healthcare Segment *</label>
                <Select value={formData.segment} onValueChange={(value) => setFormData({...formData, segment: value as HealthcareSegment})}>
                  <SelectTrigger data-testid="select-segment">
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(segments).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Product/Service Description *</label>
                <Textarea
                  data-testid="input-description"
                  placeholder="Describe your healthcare solution..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Target Market</label>
                <Input
                  data-testid="input-target-market"
                  placeholder="e.g., Mid-sized hospitals in urban areas"
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({...formData, targetMarket: e.target.value})}
                />
              </div>

              <Button
                data-testid="button-generate-plan"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Business Plan...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Generate Business Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Features & Benefits */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Executive Summary</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Compelling overview for investors and stakeholders
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Market Analysis</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Industry trends and competitive landscape assessment
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Financial Projections</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      5-year revenue forecasts and funding requirements
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Go-to-Market Strategy</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Customer acquisition and growth tactics
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Competitive Analysis</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Key competitors and differentiation strategy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">🚀 Built for Healthcare</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Our AI understands healthcare regulations, market dynamics, and investor expectations specific to medical ventures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generated Business Plan */}
        {businessPlan && (
          <Card className="border-2 border-green-400">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Generated Business Plan</CardTitle>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Executive Summary */}
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Executive Summary
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{businessPlan.executiveSummary}</p>
              </div>

              {/* Market Opportunity */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-blue-50 dark:bg-blue-950">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      Market Size
                    </h4>
                    <p className="text-3xl font-bold text-blue-600">{businessPlan.marketSize}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Total Addressable Market (TAM)
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 dark:bg-green-950">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      Target Customers
                    </h4>
                    <p className="text-lg font-semibold text-green-600">{businessPlan.customers.count}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {businessPlan.customers.target}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Projections */}
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Revenue Projections
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Year 1</p>
                      <p className="text-2xl font-bold text-green-600">{businessPlan.targetRevenue.year1}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Year 3</p>
                      <p className="text-2xl font-bold text-green-600">{businessPlan.targetRevenue.year3}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Year 5</p>
                      <p className="text-2xl font-bold text-green-600">{businessPlan.targetRevenue.year5}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Competitive Advantages */}
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Competitive Advantages
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {businessPlan.advantages.map((advantage: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 bg-purple-50 dark:bg-purple-950 p-3 rounded-lg">
                      <span className="text-purple-600 font-bold">✓</span>
                      <span className="text-sm">{advantage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Funding */}
              <Card className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    Funding Requirements
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-3xl font-bold text-orange-600 mb-2">{businessPlan.fundingNeeded}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Seed Round Target</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Product Development</span>
                        <span className="font-semibold">{businessPlan.useOfFunds.productDevelopment}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Marketing & Sales</span>
                        <span className="font-semibold">{businessPlan.useOfFunds.marketing}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Team Hiring</span>
                        <span className="font-semibold">{businessPlan.useOfFunds.hiring}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Operations</span>
                        <span className="font-semibold">{businessPlan.useOfFunds.operations}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
