import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  Stethoscope
} from "lucide-react";
import { Link } from "wouter";

export default function Documentation() {
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

        {/* Enterprise Documentation */}
        <div className="mt-16 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Enterprise Documentation
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Complete automated enterprise onboarding eliminates traditional sales processes. 
              Deploy your enterprise healthcare development environment in under 5 minutes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Automated Process</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Instant AI Analysis</h4>
                    <p className="text-sm text-gray-300">Advanced AI analyzes your organization and requirements automatically</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Zero-Touch Setup</h4>
                    <p className="text-sm text-gray-300">Complete platform configuration without human intervention</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Automated Deployment</h4>
                    <p className="text-sm text-gray-300">Enterprise environment ready in under 5 minutes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Enterprise Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-300">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2" />
                  Unlimited healthcare applications
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2" />
                  Advanced AI model training & deployment
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2" />
                  Multi-region HIPAA compliance automation
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2" />
                  White-label platform customization
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2" />
                  24/7 automated support & monitoring
                </li>
              </ul>
              
              <Button 
                className="w-full mt-6 bg-green-600 hover:bg-green-700"
                onClick={() => window.location.href = '/api/login?enterprise=true'}
              >
                Deploy Enterprise Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}