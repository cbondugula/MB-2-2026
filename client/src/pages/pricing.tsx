import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Code, ArrowRight, Building, Shield, Zap, Star, Globe, Cpu } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Pricing() {
  // Dynamic enterprise analytics integration
  const { data: enterpriseMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/enterprise/metrics'],
    retry: false,
  });

  const { data: patentPortfolio, isLoading: patentLoading } = useQuery({
    queryKey: ['/api/patents/valuation'],
    retry: false,
  });

  const automatedFeatures = [
    {
      icon: <Zap className="w-6 h-6" />,
      name: 'Voice-Controlled Development',
      price: 'Included',
      value: '$2,500/mo',
      description: 'Revolutionary voice commands for complete application creation'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      name: 'Global Compliance Automation',
      price: 'Included', 
      value: '$1,800/mo',
      description: 'Automated HIPAA, GDPR, and 193-country regulatory compliance'
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      name: 'Multi-AI Verification',
      price: 'Included',
      value: '$3,200/mo', 
      description: 'Advanced AI models for healthcare code verification and optimization'
    },
    {
      icon: <Building className="w-6 h-6" />,
      name: 'Enterprise Integration Hub',
      price: 'Included',
      value: '$4,500/mo',
      description: 'Epic, Cerner, AllScripts, and 50+ healthcare system integrations'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      name: 'Advanced AI Platform',
      price: 'Included',
      value: '$8,000/mo',
      description: 'Next-generation advanced AI hybrid processing architecture'
    },
    {
      icon: <Star className="w-6 h-6" />,
      name: 'Clinical AI Decision Support',
      price: 'Included', 
      value: '$6,500/mo',
      description: 'Healthcare-specific AI with medical NER and clinical classification'
    }
  ];

  const organizationMultipliers = [
    { type: 'Hospital Systems', multiplier: '3.5x', basePrice: 'Starting $15,000/mo' },
    { type: 'Pharmaceutical Companies', multiplier: '4.0x', basePrice: 'Starting $18,000/mo' },
    { type: 'Medical Device Companies', multiplier: '3.2x', basePrice: 'Starting $14,000/mo' },
    { type: 'Research Institutions', multiplier: '2.8x', basePrice: 'Starting $12,000/mo' },
    { type: 'Health Insurance', multiplier: '3.6x', basePrice: 'Starting $16,000/mo' },
    { type: 'Telehealth Providers', multiplier: '2.5x', basePrice: 'Starting $11,000/mo' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
      {/* Header - Matching Landing Page */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-semibold text-white">MedBuilder</span>
                <Badge variant="secondary" className="ml-2 text-xs bg-green-900 text-green-300">
                  Enterprise AI
                </Badge>
              </div>
            </Link>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => window.location.href = '/documentation'}
              >
                Documentation
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.location.href = '/api/login'}
              >
                Deploy Enterprise
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge className="bg-green-600 text-white px-4 py-2 text-sm font-medium mb-6">
              Patent Pending Technology
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-6">
              Complete Healthcare Platform
              <span className="block text-green-400">Deployed in 5 Minutes</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              World's first fully-automated enterprise healthcare development platform. 
              No sales calls, no demos, no waiting. Advanced AI completely automates your entire setup.
            </p>
          </div>

          {/* Value Proposition Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Zero Sales Process</h3>
                <p className="text-gray-400 text-sm">Complete automation eliminates all traditional enterprise sales</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Instant Compliance</h3>
                <p className="text-gray-400 text-sm">Automated HIPAA, GDPR and 193-country regulatory compliance</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Enterprise Ready</h3>
                <p className="text-gray-400 text-sm">Complete platform with unlimited users and integrations</p>
              </CardContent>
            </Card>
          </div>

          {/* Primary CTA */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Configure Your Enterprise Platform Now
            </h2>
            <p className="text-green-100 mb-6">
              Advanced AI automatically configures your complete healthcare development environment
            </p>
            <Button 
              className="bg-white text-green-700 hover:bg-gray-100 font-semibold px-8 py-4 text-lg w-full md:w-auto"
              onClick={() => window.location.href = '/custom-pricing'}
            >
              Configure Enterprise Contract
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-green-100 text-sm mt-4">
              • Complete automation • No sales teams • Instant deployment
            </p>
          </div>
        </div>
      </div>

      {/* Revolutionary Automated Features Section */}
      <div className="bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Everything Included & Automated
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Revolutionary enterprise features worth $26,500/month - completely automated and included in your platform.
              Advanced AI eliminates all manual configuration, sales processes, and human intervention.
            </p>
          </div>

          {/* Automated Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {automatedFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-900 border-gray-700 hover:border-green-500 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-green-100">
                      {feature.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-lg">{feature.price}</div>
                      <div className="text-gray-500 text-sm line-through">{feature.value}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.name}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enterprise Organization Pricing */}
          <div className="bg-gray-900 rounded-xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">
              Automated Enterprise Pricing by Organization Type
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizationMultipliers.map((org, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <h4 className="text-lg font-semibold text-white mb-2">{org.type}</h4>
                    <div className="text-2xl font-bold text-green-400 mb-2">{org.multiplier}</div>
                    <p className="text-gray-400 text-sm mb-4">{org.basePrice}</p>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => window.location.href = '/custom-pricing'}
                    >
                      Configure Platform
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Final Enterprise CTA */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Deploy Your Complete Enterprise Platform Now
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Revolutionary AI completely automates enterprise setup, compliance, integrations, and deployment. 
              No sales teams, no waiting, no manual processes. Complete platform ready in 5 minutes.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <Button 
                className="bg-white text-green-700 hover:bg-gray-100 font-bold px-8 py-4 text-lg flex-1"
                onClick={() => window.location.href = '/custom-pricing'}
              >
                Configure Enterprise Contract
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                className="border-green-300 text-green-100 hover:bg-green-700 px-6 py-4 text-lg"
                onClick={() => window.location.href = '/api/login?demo=true'}
              >
                View Live Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-green-100 text-sm">
              <span>• Zero sales process</span>
              <span>• Complete automation</span>
              <span>• Instant deployment</span>
              <span>• Global compliance</span>
              <span>• Unlimited scaling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Matching Landing Page */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">MedBuilder</span>
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                Enterprise v1.0.0
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Enterprise Healthcare Platform</span>
              <span>•</span>
              <span>Complete Automation</span>
              <span>•</span>
              <span>Instant Deployment</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}