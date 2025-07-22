import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Code,
  Building,
  Users,
  Shield
} from "lucide-react";
import { Link } from "wouter";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
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
                <div className="text-xs text-gray-400">Documentation</div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white border-gray-600 hover:border-gray-500"
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
              <Calculator className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Enterprise Pricing Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Comprehensive pricing plans for healthcare organizations. 
            Select features and get automated pricing based on your requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-green-600 text-white px-4 py-2">
              No Sales Calls
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              Instant Deployment
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              Global Compliance
            </Badge>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="pricing-plans" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-8">
            <TabsTrigger value="pricing-plans" className="data-[state=active]:bg-green-600">Pricing Plans</TabsTrigger>
            <TabsTrigger value="enterprise" className="data-[state=active]:bg-green-600">Enterprise</TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-green-600">Features</TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-green-600">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing-plans" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
              <p className="text-xl text-gray-300">
                Transparent pricing for healthcare development platforms
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <Card className="bg-slate-800 border-slate-700 relative">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-white text-2xl">Starter</CardTitle>
                  <CardDescription className="text-gray-400">
                    Perfect for small practices
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">$299</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      'Up to 5 applications',
                      'Basic HIPAA compliance',
                      'Standard templates',
                      'Email support',
                      'Single user access'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 mt-6">
                    Start Building
                  </Button>
                </CardContent>
              </Card>

              {/* Professional Plan */}
              <Card className="bg-slate-800 border-green-500 border-2 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-white text-2xl">Professional</CardTitle>
                  <CardDescription className="text-gray-400">
                    For growing organizations
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">$999</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      'Up to 25 applications',
                      'Advanced compliance suite',
                      'Premium templates',
                      'Priority support',
                      'Team collaboration (10 users)',
                      'Custom integrations',
                      'Advanced analytics'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 mt-6">
                    Go Professional
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="bg-slate-800 border-slate-700 relative">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-white text-2xl">Enterprise</CardTitle>
                  <CardDescription className="text-gray-400">
                    For large healthcare systems
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">Custom</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      'Unlimited applications',
                      'Enterprise compliance',
                      'Custom development',
                      'Dedicated support',
                      'Unlimited users',
                      'Custom AI training',
                      'Advanced security',
                      'SLA guarantees'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 mt-6"
                    onClick={() => window.location.href = '/custom-pricing'}
                  >
                    Get Custom Quote
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="enterprise" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Enterprise Features</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Building className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Multi-Organization Support</h4>
                      <p className="text-gray-400 text-sm">Manage multiple healthcare facilities from a single platform</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Users className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Advanced User Management</h4>
                      <p className="text-gray-400 text-sm">Role-based access control with unlimited users</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Shield className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Enterprise Security</h4>
                      <p className="text-gray-400 text-sm">Advanced security features and compliance monitoring</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Pricing Factors</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Organization Type</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Hospital Systems: 3.5x multiplier</li>
                      <li>• Medical Clinics: 2.0x multiplier</li>
                      <li>• Pharmaceutical: 4.0x multiplier</li>
                      <li>• Research Institutions: 2.5x multiplier</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Feature Selection</h4>
                    <p className="text-sm text-gray-400">
                      Choose only the features you need. Pay per feature with transparent pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'AI Code Generation', price: '$500/mo', description: 'Advanced AI-powered healthcare code generation' },
                { name: 'Voice Development', price: '$1000/mo', description: 'Revolutionary voice-controlled development' },
                { name: 'Multi-AI Verification', price: '$750/mo', description: 'Multiple AI models for code verification' },
                { name: 'Clinical AI Platform', price: '$1200/mo', description: 'Healthcare-specific AI assistance' },
                { name: 'HIPAA Compliance', price: '$300/mo', description: 'Automated HIPAA compliance tools' },
                { name: 'Global Compliance', price: '$500/mo', description: '193 countries regulatory compliance' },
                { name: 'EHR Integration', price: '$2000/mo', description: 'Epic, Cerner, AllScripts integration' },
                { name: 'Medical Imaging', price: '$2500/mo', description: 'DICOM and imaging systems integration' },
                { name: 'Custom ML Training', price: '$800/mo', description: 'Train custom healthcare ML models' }
              ].map((feature, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-green-400 text-lg">{feature.name}</CardTitle>
                    <Badge className="bg-green-600 w-fit">{feature.price}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Custom Pricing Calculator</h3>
              <p className="text-gray-400 mb-8">
                Get an instant quote based on your specific requirements
              </p>
              <Card className="bg-gray-800 border-gray-700 max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="text-white">Enterprise Calculator</CardTitle>
                  <CardDescription>Configure your platform requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      Custom Quote
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Based on your organization's specific needs
                    </p>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => window.location.href = '/custom-pricing'}
                    >
                      Configure & Deploy
                      <ArrowRight className="h-4 w-4 ml-2" />
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