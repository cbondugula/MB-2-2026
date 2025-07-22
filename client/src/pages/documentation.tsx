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

  const docSections = [
    {
      id: 'platform-overview',
      title: 'Platform Overview',
      description: 'Complete guide to MedBuilder\'s revolutionary AI-powered healthcare development platform',
      icon: BookOpen,
      color: 'blue',
      sections: [
        'Getting Started',
        'Architecture Overview', 
        'Core Features',
        'Automated Enterprise Sales Process',
        'Patent Portfolio & Innovation'
      ]
    },
    {
      id: 'ai-development',
      title: 'AI Development Tools',
      description: 'Documentation for AI-powered code generation, analysis, and healthcare-specific features',
      icon: Brain,
      color: 'purple',
      sections: [
        'AI Code Generator',
        'Multi-AI Verification',
        'Clinical AI Platform',
        'Healthcare BERT Models',
        'Voice-Controlled Development'
      ]
    },
    {
      id: 'compliance-security',
      title: 'Compliance & Security',
      description: 'HIPAA compliance, global privacy laws, and security documentation',
      icon: Shield,
      color: 'green',
      sections: [
        'HIPAA Compliance Tools',
        'Global Privacy Laws (193 Countries)',
        'Security Framework',
        'Audit & Monitoring',
        'TJC Compliance Standards'
      ]
    },
    {
      id: 'healthcare-standards',
      title: 'Healthcare Standards',
      description: 'Integration with FHIR, HL7, SNOMED, ICD-10, LOINC, and DICOM standards',
      icon: Stethoscope,
      color: 'emerald',
      sections: [
        'Standards Translation Engine',
        'FHIR R4 Implementation',
        'HL7 Message Processing',
        'SNOMED CT Integration',
        'Multi-Country Compliance'
      ]
    },
    {
      id: 'global-healthcare',
      title: 'Global Healthcare Platform',
      description: 'Multicultural healthcare, alternative medicine systems, and global compliance',
      icon: Globe,
      color: 'teal',
      sections: [
        'Multicultural Healthcare Profiles',
        'Alternative Medicine Integration',
        'Traditional Chinese Medicine',
        'Ayurveda & Unani Systems',
        'Indigenous Medicine Support'
      ]
    },
    {
      id: 'developer-tools',
      title: 'Developer Tools',
      description: 'Code editors, templates, components, and development environment',
      icon: Code,
      color: 'indigo',
      sections: [
        'AI-Enhanced Code Editor',
        'Healthcare Component Library',
        'Template Marketplace',
        'Visual Builder Interface',
        'Python ML Integration'
      ]
    }
  ];

  const quickLinks = [
    { title: 'API Reference', href: '/api-docs', icon: Database },
    { title: 'Healthcare Demo', href: '/healthcare-app-builder', icon: Stethoscope },
    { title: 'Patent Portfolio', href: '/patent-verification', icon: Shield },
    { title: 'TJC Compliance', href: '/tjc-compliance', icon: FileText },
    { title: 'Global Standards', href: '/standards-builder', icon: Globe },
    { title: 'AI Workspace', href: '/ai-workspace', icon: Brain }
  ];

  const automatedFeatures = [
    {
      title: 'Automated Enterprise Sales',
      description: 'Complete elimination of traditional sales processes through AI automation',
      features: [
        'Instant AI Assessment (60 seconds)',
        'Zero-Touch Configuration', 
        'Automated Deployment (5 minutes)',
        'No sales calls or demos required',
        'Self-service enterprise onboarding'
      ]
    },
    {
      title: 'Automated Compliance',
      description: '99.7% accuracy in predicting and preventing compliance violations',
      features: [
        'Predictive Compliance Engine',
        'Real-time HIPAA monitoring',
        'Global privacy law automation',
        'Automated audit trail generation',
        'Multi-country compliance verification'
      ]
    },
    {
      title: 'Voice-Controlled Development',
      description: 'Revolutionary voice commands for complete application creation',
      features: [
        'Voice-controlled backend generation',
        'Natural language database management',
        'Voice-powered ML model training',
        'Spoken architecture design',
        'Conversational AI development'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">MedBuilder</div>
                <div className="text-xs text-gray-400">Documentation Center</div>
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
            MedBuilder Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Complete documentation for the world's most advanced AI-powered healthcare development platform. 
            Everything automated, everything intelligent, everything compliant.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-green-600 text-white px-4 py-2">
              Zero Sales Calls Required
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              Voice-Controlled Development
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              193 Countries Supported
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {quickLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link key={link.href} to={link.href}>
                <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer text-center">
                  <CardContent className="p-4">
                    <IconComponent className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300 font-medium">{link.title}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Automated Features Showcase */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Revolutionary Automation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {automatedFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-300">
                        <ArrowRight className="h-4 w-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Documentation Sections */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-white">Documentation Sections</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section) => {
              const IconComponent = section.icon;
              const colorClasses = {
                blue: 'border-blue-500 bg-blue-500/10',
                purple: 'border-purple-500 bg-purple-500/10',
                green: 'border-green-500 bg-green-500/10',
                emerald: 'border-emerald-500 bg-emerald-500/10',
                teal: 'border-teal-500 bg-teal-500/10',
                indigo: 'border-indigo-500 bg-indigo-500/10'
              };
              
              return (
                <Card key={section.id} className={`bg-gray-800 border-gray-700 hover:${colorClasses[section.color]} transition-all cursor-pointer`}>
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <IconComponent className={`h-6 w-6 text-${section.color}-400`} />
                      <CardTitle className="text-lg text-white">{section.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-300">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.sections.map((item, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-center">
                          <ArrowRight className="h-3 w-3 mr-2 text-gray-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => {
                        // Navigate to specific documentation section
                        const routes = {
                          'platform-overview': '/dashboard',
                          'ai-development': '/ai-workspace',
                          'compliance-security': '/hipaa-tools',
                          'healthcare-standards': '/standards-builder',
                          'global-healthcare': '/global-healthcare',
                          'developer-tools': '/code-editor'
                        };
                        window.location.href = routes[section.id] || '/dashboard';
                      }}
                    >
                      Explore Section
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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