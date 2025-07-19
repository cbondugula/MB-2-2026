import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Calculator, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";

interface PricingFactors {
  organizationType: string;
  userCount: number;
  dataVolume: string;
  integrations: string[];
  compliance: string[];
  features: string[];
  timeline: string;
  support: string;
}

export default function CustomPricing() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [factors, setFactors] = useState<PricingFactors>({
    organizationType: '',
    userCount: 0,
    dataVolume: '',
    integrations: [],
    compliance: [],
    features: [],
    timeline: '',
    support: ''
  });
  const [calculatedPrice, setCalculatedPrice] = useState<{
    monthly: number;
    annual: number;
    setup: number;
    breakdown: any[];
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const organizationTypes = [
    { value: 'hospital', label: 'Hospital System', multiplier: 3.5 },
    { value: 'clinic', label: 'Medical Clinic', multiplier: 2.0 },
    { value: 'pharma', label: 'Pharmaceutical Company', multiplier: 4.0 },
    { value: 'research', label: 'Research Institution', multiplier: 2.5 },
    { value: 'insurance', label: 'Health Insurance', multiplier: 3.0 },
    { value: 'medtech', label: 'Medical Technology', multiplier: 2.8 },
    { value: 'telehealth', label: 'Telehealth Provider', multiplier: 2.2 },
    { value: 'government', label: 'Government Health Agency', multiplier: 3.2 }
  ];

  const dataVolumeOptions = [
    { value: 'small', label: 'Small (< 10K records)', cost: 0 },
    { value: 'medium', label: 'Medium (10K - 100K records)', cost: 500 },
    { value: 'large', label: 'Large (100K - 1M records)', cost: 1500 },
    { value: 'enterprise', label: 'Enterprise (> 1M records)', cost: 3000 }
  ];

  const integrationOptions = [
    { value: 'ehr', label: 'EHR Systems (Epic, Cerner)', cost: 2000 },
    { value: 'lab', label: 'Laboratory Systems', cost: 1500 },
    { value: 'imaging', label: 'Medical Imaging (DICOM)', cost: 2500 },
    { value: 'billing', label: 'Billing Systems', cost: 1200 },
    { value: 'pharmacy', label: 'Pharmacy Systems', cost: 1800 },
    { value: 'api', label: 'Custom APIs', cost: 800 },
    { value: 'hl7', label: 'HL7/FHIR Integration', cost: 2200 },
    { value: 'cloud', label: 'Cloud Services (AWS, Azure)', cost: 1000 }
  ];

  const complianceOptions = [
    { value: 'hipaa', label: 'HIPAA Compliance', cost: 1000 },
    { value: 'gdpr', label: 'GDPR Compliance', cost: 800 },
    { value: 'fda', label: 'FDA Validation', cost: 3000 },
    { value: 'sox', label: 'SOX Compliance', cost: 1500 },
    { value: 'hitech', label: 'HITECH Compliance', cost: 1200 },
    { value: 'iso27001', label: 'ISO 27001', cost: 2000 },
    { value: 'soc2', label: 'SOC 2 Type II', cost: 1800 }
  ];

  const featureOptions = [
    { value: 'ai_clinical', label: 'AI Clinical Decision Support', cost: 2500 },
    { value: 'ml_analytics', label: 'ML Analytics & Insights', cost: 2000 },
    { value: 'nlp', label: 'Natural Language Processing', cost: 1800 },
    { value: 'blockchain', label: 'Blockchain Integration', cost: 3000 },
    { value: 'iot', label: 'IoT Device Integration', cost: 2200 },
    { value: 'mobile', label: 'Mobile Applications', cost: 1500 },
    { value: 'portal', label: 'Patient Portal', cost: 1200 },
    { value: 'analytics', label: 'Advanced Analytics Dashboard', cost: 1600 },
    { value: 'automation', label: 'Workflow Automation', cost: 1400 },
    { value: 'reporting', label: 'Custom Reporting Suite', cost: 1000 }
  ];

  const timelineOptions = [
    { value: 'rush', label: 'Rush (< 3 months)', multiplier: 1.5 },
    { value: 'standard', label: 'Standard (3-6 months)', multiplier: 1.0 },
    { value: 'extended', label: 'Extended (6+ months)', multiplier: 0.8 }
  ];

  const supportOptions = [
    { value: 'basic', label: 'Basic Support', cost: 0 },
    { value: 'premium', label: 'Premium Support (24/7)', cost: 2000 },
    { value: 'enterprise', label: 'Enterprise Support + Dedicated Manager', cost: 5000 }
  ];

  const calculateCustomPrice = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const basePrice = 1000; // Base monthly price
      const breakdown = [];
      
      // Organization type multiplier
      const orgType = organizationTypes.find(t => t.value === factors.organizationType);
      const orgMultiplier = orgType?.multiplier || 1;
      const orgCost = basePrice * (orgMultiplier - 1);
      breakdown.push({ item: `${orgType?.label} Premium`, cost: orgCost });
      
      // User scaling
      const userCost = Math.max(0, (factors.userCount - 50) * 15); // $15 per user over 50
      if (userCost > 0) {
        breakdown.push({ item: `Additional Users (${factors.userCount - 50})`, cost: userCost });
      }
      
      // Data volume
      const dataVol = dataVolumeOptions.find(d => d.value === factors.dataVolume);
      if (dataVol && dataVol.cost > 0) {
        breakdown.push({ item: `Data Volume - ${dataVol.label}`, cost: dataVol.cost });
      }
      
      // Integrations
      let integrationCost = 0;
      factors.integrations.forEach(intId => {
        const integration = integrationOptions.find(i => i.value === intId);
        if (integration) {
          integrationCost += integration.cost;
          breakdown.push({ item: `Integration - ${integration.label}`, cost: integration.cost });
        }
      });
      
      // Compliance
      let complianceCost = 0;
      factors.compliance.forEach(compId => {
        const compliance = complianceOptions.find(c => c.value === compId);
        if (compliance) {
          complianceCost += compliance.cost;
          breakdown.push({ item: `Compliance - ${compliance.label}`, cost: compliance.cost });
        }
      });
      
      // Features
      let featureCost = 0;
      factors.features.forEach(featId => {
        const feature = featureOptions.find(f => f.value === featId);
        if (feature) {
          featureCost += feature.cost;
          breakdown.push({ item: `Feature - ${feature.label}`, cost: feature.cost });
        }
      });
      
      // Timeline multiplier
      const timeline = timelineOptions.find(t => t.value === factors.timeline);
      const timelineMultiplier = timeline?.multiplier || 1;
      
      // Support costs
      const support = supportOptions.find(s => s.value === factors.support);
      const supportCost = support?.cost || 0;
      if (supportCost > 0) {
        breakdown.push({ item: `Support - ${support?.label}`, cost: supportCost });
      }
      
      // Calculate totals
      const subtotal = (basePrice * orgMultiplier) + userCost + (dataVol?.cost || 0) + 
                     integrationCost + complianceCost + featureCost + supportCost;
      
      const monthlyPrice = Math.round(subtotal * timelineMultiplier);
      const annualPrice = Math.round(monthlyPrice * 12 * 0.85); // 15% annual discount
      const setupFee = Math.round(monthlyPrice * 2.5); // Setup fee is 2.5x monthly
      
      if (timelineMultiplier !== 1) {
        breakdown.push({ 
          item: `Timeline Adjustment - ${timeline?.label}`, 
          cost: Math.round(subtotal * (timelineMultiplier - 1))
        });
      }
      
      setCalculatedPrice({
        monthly: monthlyPrice,
        annual: annualPrice,
        setup: setupFee,
        breakdown
      });
      
      setIsCalculating(false);
      setStep(4);
    }, 2000);
  };

  const updateFactors = (key: keyof PricingFactors, value: any) => {
    setFactors(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'integrations' | 'compliance' | 'features', value: string) => {
    setFactors(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/pricing">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Pricing
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-semibold">Custom Solution Pricing</h1>
            </div>
            <Badge variant="secondary" className="bg-green-900 text-green-300">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Calculator
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
                  </div>
                  {stepNum < 4 && <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-green-600' : 'bg-gray-700'
                  }`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Organization</span>
              <span>Requirements</span>
              <span>Features</span>
              <span>Pricing</span>
            </div>
          </div>

          {/* Step 1: Organization Details */}
          {step === 1 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-400" />
                  Tell us about your organization
                </CardTitle>
                <CardDescription>
                  This helps us understand your specific needs and compliance requirements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white">Organization Type</Label>
                  <Select value={factors.organizationType} onValueChange={(value) => updateFactors('organizationType', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select your organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-white">Number of Users</Label>
                  <Input
                    type="number"
                    value={factors.userCount}
                    onChange={(e) => updateFactors('userCount', parseInt(e.target.value) || 0)}
                    placeholder="How many people will use the system?"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Data Volume</Label>
                  <Select value={factors.dataVolume} onValueChange={(value) => updateFactors('dataVolume', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Expected data volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataVolumeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!factors.organizationType || !factors.userCount || !factors.dataVolume}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Continue to Requirements
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Technical Requirements */}
          {step === 2 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Technical Requirements</CardTitle>
                <CardDescription>
                  Select the integrations and compliance standards you need.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white mb-3 block">Required Integrations</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {integrationOptions.map(integration => (
                      <div key={integration.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={integration.value}
                          checked={factors.integrations.includes(integration.value)}
                          onCheckedChange={() => toggleArrayItem('integrations', integration.value)}
                        />
                        <Label htmlFor={integration.value} className="text-sm text-gray-300">
                          {integration.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-3 block">Compliance Requirements</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {complianceOptions.map(compliance => (
                      <div key={compliance.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={compliance.value}
                          checked={factors.compliance.includes(compliance.value)}
                          onCheckedChange={() => toggleArrayItem('compliance', compliance.value)}
                        />
                        <Label htmlFor={compliance.value} className="text-sm text-gray-300">
                          {compliance.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1 bg-green-600 hover:bg-green-700">
                    Continue to Features
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Features & Timeline */}
          {step === 3 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Features & Timeline</CardTitle>
                <CardDescription>
                  Choose the features you need and your preferred timeline.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white mb-3 block">Advanced Features</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {featureOptions.map(feature => (
                      <div key={feature.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature.value}
                          checked={factors.features.includes(feature.value)}
                          onCheckedChange={() => toggleArrayItem('features', feature.value)}
                        />
                        <Label htmlFor={feature.value} className="text-sm text-gray-300">
                          {feature.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-white">Project Timeline</Label>
                  <Select value={factors.timeline} onValueChange={(value) => updateFactors('timeline', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="When do you need this completed?" />
                    </SelectTrigger>
                    <SelectContent>
                      {timelineOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Support Level</Label>
                  <Select value={factors.support} onValueChange={(value) => updateFactors('support', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select support level" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={calculateCustomPrice}
                    disabled={!factors.timeline || !factors.support}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Pricing
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Pricing Results */}
          {step === 4 && (
            <div className="space-y-6">
              {isCalculating ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="py-16 text-center">
                    <Calculator className="w-12 h-12 text-green-400 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-xl font-semibold text-white mb-2">Calculating Your Custom Pricing</h3>
                    <p className="text-gray-400">Analyzing your requirements and generating a tailored quote...</p>
                  </CardContent>
                </Card>
              ) : calculatedPrice && (
                <>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                        Your Custom Pricing
                      </CardTitle>
                      <CardDescription>
                        Based on your specific requirements, here's your tailored pricing plan.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gray-700 rounded-lg">
                          <div className="text-3xl font-bold text-green-400">
                            ${calculatedPrice.monthly.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">per month</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700 rounded-lg">
                          <div className="text-3xl font-bold text-blue-400">
                            ${calculatedPrice.annual.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">per year (save 15%)</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700 rounded-lg">
                          <div className="text-3xl font-bold text-purple-400">
                            ${calculatedPrice.setup.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">setup fee</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Pricing Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {calculatedPrice.breakdown.map((item, index) => (
                          <div key={index} className="flex justify-between py-2 border-b border-gray-700 last:border-0">
                            <span className="text-gray-300">{item.item}</span>
                            <span className="text-white font-medium">
                              ${item.cost.toLocaleString()}/mo
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Recalculate
                    </Button>
                    <Button 
                      onClick={() => {
                        // Store the custom pricing details for contract generation
                        localStorage.setItem('selectedPlan', 'custom');
                        localStorage.setItem('selectedBilling', 'monthly');
                        localStorage.setItem('customPricingFactors', JSON.stringify(factors));
                        localStorage.setItem('customPricingResult', JSON.stringify(calculatedPrice));
                        // Navigate to contract onboarding
                        setLocation('/contract-onboarding');
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Get Started with This Plan
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}