import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calculator, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Settings,
  Zap,
  Shield,
  Database
} from "lucide-react";
import { Link } from "wouter";

export default function Documentation() {
  const [step, setStep] = useState(1);
  const [organizationType, setOrganizationType] = useState('');
  const [userCount, setUserCount] = useState(50);
  const [dataVolume, setDataVolume] = useState('');
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [selectedCompliance, setSelectedCompliance] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');
  const [support, setSupport] = useState('');

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
    const basePrice = 1000; // Base monthly price
    
    // Organization type multiplier
    const orgType = organizationTypes.find(t => t.value === organizationType);
    const orgMultiplier = orgType?.multiplier || 1;
    const orgCost = basePrice * (orgMultiplier - 1);
    
    // User scaling
    const userCost = Math.max(0, (userCount - 50) * 15); // $15 per user over 50
    
    // Data volume cost
    const dataVolumeCost = dataVolumeOptions.find(d => d.value === dataVolume)?.cost || 0;
    
    // Integration costs
    const integrationCosts = selectedIntegrations.reduce((total, integration) => {
      const option = integrationOptions.find(o => o.value === integration);
      return total + (option?.cost || 0);
    }, 0);
    
    // Compliance costs
    const complianceCosts = selectedCompliance.reduce((total, compliance) => {
      const option = complianceOptions.find(o => o.value === compliance);
      return total + (option?.cost || 0);
    }, 0);
    
    // Feature costs
    const featureCosts = selectedFeatures.reduce((total, feature) => {
      const option = featureOptions.find(o => o.value === feature);
      return total + (option?.cost || 0);
    }, 0);
    
    // Timeline multiplier
    const timelineObj = timelineOptions.find(t => t.value === timeline);
    const timelineMultiplier = timelineObj?.multiplier || 1;
    
    // Support costs
    const supportCost = supportOptions.find(s => s.value === support)?.cost || 0;
    
    const subtotal = (basePrice + orgCost + userCost + dataVolumeCost + integrationCosts + complianceCosts + featureCosts) * timelineMultiplier + supportCost;
    const monthly = Math.round(subtotal * orgMultiplier);
    const annual = Math.round(monthly * 10); // 20% discount for annual
    
    return { monthly, annual, subtotal: Math.round(subtotal) };
  };

  const pricing = calculateCustomPrice();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">MedBuilder</div>
                <div className="text-xs text-gray-400">Enterprise Pricing Plans</div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white"
                onClick={() => window.location.href = '/api/login'}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-full">
              <DollarSign className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Enterprise Tiered Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Select multiple functionalities and get charged based on your specific requirements. 
            Custom pricing where enterprises choose only what they need and pay accordingly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-green-600 text-white px-4 py-2">
              Pay-Per-Feature Selection
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              Organization Multipliers
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              Automated Deployment
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-3 space-y-8">
            {/* Step 1: Organization & Users */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Step 1: Organization Details
                </CardTitle>
                <CardDescription>Tell us about your organization and user requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block">Organization Type</Label>
                    <Select value={organizationType} onValueChange={setOrganizationType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label} ({type.multiplier}x multiplier)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Number of Users</Label>
                    <Input 
                      type="number" 
                      value={userCount} 
                      onChange={(e) => setUserCount(parseInt(e.target.value) || 50)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="50"
                    />
                    <p className="text-xs text-gray-400 mt-1">$15/month per user over 50</p>
                  </div>
                </div>
                <div>
                  <Label className="text-white mb-2 block">Data Volume</Label>
                  <Select value={dataVolume} onValueChange={setDataVolume}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataVolumeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} {option.cost > 0 && `(+$${option.cost}/mo)`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: System Integrations */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Step 2: System Integrations
                </CardTitle>
                <CardDescription>Select the healthcare systems you need to integrate with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {integrationOptions.map(integration => (
                    <div key={integration.value} className="flex items-start space-x-3">
                      <Checkbox 
                        checked={selectedIntegrations.includes(integration.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIntegrations([...selectedIntegrations, integration.value]);
                          } else {
                            setSelectedIntegrations(selectedIntegrations.filter(i => i !== integration.value));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white text-sm">{integration.label}</h4>
                          <span className="text-green-400 font-bold text-sm">${integration.cost}/mo</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Compliance Requirements */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Step 3: Compliance Requirements
                </CardTitle>
                <CardDescription>Choose the compliance standards your organization needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {complianceOptions.map(compliance => (
                    <div key={compliance.value} className="flex items-start space-x-3">
                      <Checkbox 
                        checked={selectedCompliance.includes(compliance.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCompliance([...selectedCompliance, compliance.value]);
                          } else {
                            setSelectedCompliance(selectedCompliance.filter(c => c !== compliance.value));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white text-sm">{compliance.label}</h4>
                          <span className="text-blue-400 font-bold text-sm">${compliance.cost}/mo</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Platform Features */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Step 4: Platform Features
                </CardTitle>
                <CardDescription>Select the advanced features your organization requires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {featureOptions.map(feature => (
                    <div key={feature.value} className="flex items-start space-x-3">
                      <Checkbox 
                        checked={selectedFeatures.includes(feature.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFeatures([...selectedFeatures, feature.value]);
                          } else {
                            setSelectedFeatures(selectedFeatures.filter(f => f !== feature.value));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white text-sm">{feature.label}</h4>
                          <span className="text-purple-400 font-bold text-sm">${feature.cost}/mo</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 5: Timeline & Support */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Step 5: Timeline & Support</CardTitle>
                <CardDescription>Choose your implementation timeline and support level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block">Implementation Timeline</Label>
                    <Select value={timeline} onValueChange={setTimeline}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {timelineOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} ({option.multiplier}x multiplier)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Support Level</Label>
                    <Select value={support} onValueChange={setSupport}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select support level" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} {option.cost > 0 && `(+$${option.cost}/mo)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Calculator - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Custom Pricing
                </CardTitle>
                <CardDescription>Based on your selections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    ${pricing.monthly.toLocaleString()}/mo
                  </div>
                  <div className="text-lg text-gray-300">
                    ${pricing.annual.toLocaleString()}/year
                  </div>
                  <div className="text-sm text-gray-400">
                    (Save 20% annually)
                  </div>
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Base Platform</span>
                    <span className="text-white">$1,000</span>
                  </div>
                  {organizationType && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Organization Type</span>
                      <span className="text-orange-400">
                        {organizationTypes.find(t => t.value === organizationType)?.multiplier}x
                      </span>
                    </div>
                  )}
                  {userCount > 50 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Extra Users ({userCount - 50})</span>
                      <span className="text-yellow-400">+${(userCount - 50) * 15}</span>
                    </div>
                  )}
                  {selectedIntegrations.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Integrations ({selectedIntegrations.length})</span>
                      <span className="text-green-400">
                        +${selectedIntegrations.reduce((total, integration) => {
                          const option = integrationOptions.find(o => o.value === integration);
                          return total + (option?.cost || 0);
                        }, 0)}
                      </span>
                    </div>
                  )}
                  {selectedCompliance.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Compliance ({selectedCompliance.length})</span>
                      <span className="text-blue-400">
                        +${selectedCompliance.reduce((total, compliance) => {
                          const option = complianceOptions.find(o => o.value === compliance);
                          return total + (option?.cost || 0);
                        }, 0)}
                      </span>
                    </div>
                  )}
                  {selectedFeatures.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Features ({selectedFeatures.length})</span>
                      <span className="text-purple-400">
                        +${selectedFeatures.reduce((total, feature) => {
                          const option = featureOptions.find(o => o.value === feature);
                          return total + (option?.cost || 0);
                        }, 0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.location.href = '/custom-pricing'}
                >
                  Deploy Enterprise Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <div className="text-xs text-gray-400 text-center">
                  Complete automated setup in under 5 minutes
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing Tiers Summary */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Pricing Tier Examples</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Starter Configuration</CardTitle>
                <CardDescription>Small clinic with basic needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400 mb-4">$2,000-$5,000/mo</div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Medical Clinic (2.0x multiplier)</li>
                  <li>• Basic integrations (1-2 systems)</li>
                  <li>• HIPAA compliance</li>
                  <li>• Standard features</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-blue-500 border-2">
              <CardHeader>
                <CardTitle className="text-white">Professional Configuration</CardTitle>
                <CardDescription>Mid-size hospital system</CardDescription>
                <Badge className="bg-blue-600 w-fit">Most Popular</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400 mb-4">$8,000-$15,000/mo</div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Hospital System (3.5x multiplier)</li>
                  <li>• Multiple integrations (EHR, Lab, Imaging)</li>
                  <li>• Full compliance suite</li>
                  <li>• Advanced AI features</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Enterprise Configuration</CardTitle>
                <CardDescription>Large pharmaceutical company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400 mb-4">$25,000+/mo</div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Pharmaceutical (4.0x multiplier)</li>
                  <li>• All integrations + custom APIs</li>
                  <li>• FDA validation + global compliance</li>
                  <li>• Full feature suite + premium support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}