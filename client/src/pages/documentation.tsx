import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Code, 
  Shield, 
  Zap, 
  Globe, 
  Brain, 
  Database, 
  Bot,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Settings,
  Users,
  Stethoscope,
  Calculator,
  CheckCircle,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Documentation() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedCompliance, setSelectedCompliance] = useState<string[]>([]);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [organizationType, setOrganizationType] = useState('');
  const [userCount, setUserCount] = useState(1);
  
  const pricingFeatures = [
    { id: 'ai-code-gen', name: 'AI Code Generation', price: 500, description: 'Advanced AI-powered code generation' },
    { id: 'voice-control', name: 'Voice-Controlled Development', price: 1000, description: 'Revolutionary voice commands for development' },
    { id: 'multi-ai', name: 'Multi-AI Verification', price: 750, description: 'Multiple AI models for code verification' },
    { id: 'clinical-ai', name: 'Clinical AI Platform', price: 1200, description: 'Healthcare-specific AI assistance' },
    { id: 'quantum-ai', name: 'Quantum-AI Integration', price: 2000, description: 'Quantum-enhanced AI capabilities' },
    { id: 'ml-training', name: 'Custom ML Training', price: 800, description: 'Train custom ML models' },
    { id: 'api-access', name: 'Advanced API Access', price: 400, description: 'Full API access and integrations' }
  ];

  const complianceOptions = [
    { id: 'hipaa', name: 'HIPAA Compliance', price: 300, description: 'Full HIPAA compliance tools' },
    { id: 'gdpr', name: 'GDPR Compliance', price: 250, description: 'European data protection' },
    { id: 'sox', name: 'SOX Compliance', price: 400, description: 'Sarbanes-Oxley compliance' },
    { id: 'tjc', name: 'TJC Standards', price: 350, description: 'Joint Commission compliance' },
    { id: 'fda', name: 'FDA Validation', price: 600, description: 'FDA regulatory compliance' },
    { id: 'global', name: 'Global Privacy Laws', price: 500, description: '193 countries compliance' }
  ];

  const integrationOptions = [
    { id: 'ehr', name: 'EHR Systems', price: 2000, description: 'Epic, Cerner, AllScripts integration' },
    { id: 'lab', name: 'Laboratory Systems', price: 1500, description: 'Lab information management' },
    { id: 'imaging', name: 'Medical Imaging', price: 2500, description: 'DICOM and imaging systems' },
    { id: 'billing', name: 'Billing Systems', price: 1200, description: 'Healthcare billing integration' },
    { id: 'pharmacy', name: 'Pharmacy Systems', price: 1800, description: 'Pharmacy management integration' }
  ];

  const organizationTypes = [
    { value: 'hospital', label: 'Hospital System', multiplier: 3.5 },
    { value: 'clinic', label: 'Medical Clinic', multiplier: 2.0 },
    { value: 'pharma', label: 'Pharmaceutical Company', multiplier: 4.0 },
    { value: 'research', label: 'Research Institution', multiplier: 2.5 },
    { value: 'insurance', label: 'Health Insurance', multiplier: 3.0 }
  ];

  const calculatePrice = () => {
    let basePrice = 299; // Enterprise base price
    
    // Add feature costs
    const featureCosts = selectedFeatures.reduce((total, featureId) => {
      const feature = pricingFeatures.find(f => f.id === featureId);
      return total + (feature?.price || 0);
    }, 0);

    // Add compliance costs
    const complianceCosts = selectedCompliance.reduce((total, complianceId) => {
      const compliance = complianceOptions.find(c => c.id === complianceId);
      return total + (compliance?.price || 0);
    }, 0);

    // Add integration costs
    const integrationCosts = selectedIntegrations.reduce((total, integrationId) => {
      const integration = integrationOptions.find(i => i.id === integrationId);
      return total + (integration?.price || 0);
    }, 0);

    // Organization multiplier
    const orgType = organizationTypes.find(t => t.value === organizationType);
    const multiplier = orgType?.multiplier || 1;

    // User scaling
    const userScaling = userCount > 10 ? Math.floor(userCount / 10) * 50 : 0;

    const totalMonthly = (basePrice + featureCosts + complianceCosts + integrationCosts + userScaling) * multiplier;
    const totalAnnual = totalMonthly * 10; // 20% discount for annual

    return { monthly: Math.round(totalMonthly), annual: Math.round(totalAnnual) };
  };

  const pricing = calculatePrice();

  // Pricing-focused content only

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">MedBuilder</div>
                <div className="text-xs text-gray-400">Pricing Plans</div>
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
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Pricing Plans & Enterprise Solutions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Tiered pricing where enterprises select multiple functionalities and get charged based on their specific requirements. 
            Complete automated enterprise onboarding with transparent, module-based pricing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-green-600 text-white px-4 py-2">
              Pay-Per-Feature Model
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              Custom Enterprise Pricing
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              Automated Billing & Setup
            </Badge>
          </div>
        </div>
      </div>

      {/* Pricing Overview Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Interactive Configurator
              </CardTitle>
              <CardDescription>
                Real-time pricing based on selected features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center"><ArrowRight className="h-4 w-4 text-green-500 mr-2" />Select only needed features</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 text-green-500 mr-2" />Organization-specific multipliers</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 text-green-500 mr-2" />Instant price calculation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                Transparent Pricing
              </CardTitle>
              <CardDescription>
                No hidden costs, pay for what you use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center"><ArrowRight className="h-4 w-4 text-blue-500 mr-2" />Detailed cost breakdown</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 text-blue-500 mr-2" />Module-based pricing</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 text-blue-500 mr-2" />Scale as you grow</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-6 w-6" />
                Automated Setup
              </CardTitle>
              <CardDescription>
                Deploy enterprise environment instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center"><ArrowRight className="h-4 w-4 text-purple-500 mr-2" />Zero-touch configuration</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 text-purple-500 mr-2" />5-minute deployment</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 text-purple-500 mr-2" />No sales calls needed</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise Tiered Pricing Documentation */}
        <div className="mt-16 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Calculator className="h-8 w-8" />
              Enterprise Tiered Pricing
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Select multiple functionalities and get charged based on your specific requirements. 
              Customize your enterprise healthcare development platform with only the features you need.
            </p>
          </div>

          <Tabs defaultValue="configurator" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="configurator">Price Configurator</TabsTrigger>
              <TabsTrigger value="features">Available Features</TabsTrigger>
              <TabsTrigger value="pricing-tiers">Pricing Tiers</TabsTrigger>
            </TabsList>

            <TabsContent value="configurator" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Organization Type */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Organization Type</CardTitle>
                      <CardDescription>Select your organization type for pricing multiplier</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>

                  {/* Feature Selection */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Platform Features</CardTitle>
                      <CardDescription>Select the features your organization needs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pricingFeatures.map(feature => (
                          <div key={feature.id} className="flex items-start space-x-3">
                            <Checkbox 
                              checked={selectedFeatures.includes(feature.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedFeatures([...selectedFeatures, feature.id]);
                                } else {
                                  setSelectedFeatures(selectedFeatures.filter(f => f !== feature.id));
                                }
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white">{feature.name}</h4>
                                <span className="text-green-400 font-bold">${feature.price}/mo</span>
                              </div>
                              <p className="text-sm text-gray-400">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Compliance Selection */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Compliance Requirements</CardTitle>
                      <CardDescription>Add compliance modules for regulatory requirements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {complianceOptions.map(compliance => (
                          <div key={compliance.id} className="flex items-start space-x-3">
                            <Checkbox 
                              checked={selectedCompliance.includes(compliance.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCompliance([...selectedCompliance, compliance.id]);
                                } else {
                                  setSelectedCompliance(selectedCompliance.filter(c => c !== compliance.id));
                                }
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white">{compliance.name}</h4>
                                <span className="text-blue-400 font-bold">${compliance.price}/mo</span>
                              </div>
                              <p className="text-sm text-gray-400">{compliance.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Integration Selection */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">System Integrations</CardTitle>
                      <CardDescription>Connect with existing healthcare systems</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {integrationOptions.map(integration => (
                          <div key={integration.id} className="flex items-start space-x-3">
                            <Checkbox 
                              checked={selectedIntegrations.includes(integration.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedIntegrations([...selectedIntegrations, integration.id]);
                                } else {
                                  setSelectedIntegrations(selectedIntegrations.filter(i => i !== integration.id));
                                }
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white">{integration.name}</h4>
                                <span className="text-purple-400 font-bold">${integration.price}/mo</span>
                              </div>
                              <p className="text-sm text-gray-400">{integration.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Price Calculator */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500 sticky top-4">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Custom Pricing
                      </CardTitle>
                      <CardDescription>Based on your selected configuration</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">
                          ${pricing.monthly.toLocaleString()}/mo
                        </div>
                        <div className="text-lg text-gray-300">
                          ${pricing.annual.toLocaleString()}/year (Save 20%)
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-700" />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Base Enterprise</span>
                          <span className="text-white">$299</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Selected Features</span>
                          <span className="text-green-400">+${selectedFeatures.length * 500}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Compliance Modules</span>
                          <span className="text-blue-400">+${selectedCompliance.length * 300}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">System Integrations</span>
                          <span className="text-purple-400">+${selectedIntegrations.length * 1500}</span>
                        </div>
                        {organizationType && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Organization Multiplier</span>
                            <span className="text-orange-400">
                              {organizationTypes.find(t => t.value === organizationType)?.multiplier}x
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => window.location.href = '/custom-pricing'}
                      >
                        Get Custom Quote
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-white mb-2">Why Tiered Pricing?</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Pay only for features you use</li>
                        <li>• Scale pricing with your organization</li>
                        <li>• Add modules as you grow</li>
                        <li>• Transparent, no hidden costs</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pricingFeatures.map(feature => (
                  <Card key={feature.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-green-400 flex items-center justify-between">
                        {feature.name}
                        <Badge className="bg-green-600">${feature.price}/mo</Badge>
                      </CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Enterprise-ready</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pricing-tiers" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Starter Package</CardTitle>
                    <CardDescription>Essential features for small organizations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400 mb-4">$299-$999/mo</div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Base platform access</li>
                      <li>• 1-2 feature modules</li>
                      <li>• Basic compliance (HIPAA)</li>
                      <li>• Standard integrations</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-blue-500 border-2">
                  <CardHeader>
                    <CardTitle className="text-white">Professional Package</CardTitle>
                    <CardDescription>Comprehensive features for medium organizations</CardDescription>
                    <Badge className="bg-blue-600 w-fit">Most Popular</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400 mb-4">$1,500-$5,000/mo</div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Full platform access</li>
                      <li>• 3-5 feature modules</li>
                      <li>• Multiple compliance modules</li>
                      <li>• Advanced integrations</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Enterprise Package</CardTitle>
                    <CardDescription>Complete solution for large enterprises</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-400 mb-4">$10,000+/mo</div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Unlimited platform access</li>
                      <li>• All feature modules</li>
                      <li>• Global compliance suite</li>
                      <li>• Custom integrations</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}