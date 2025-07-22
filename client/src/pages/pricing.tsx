import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Code } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small healthcare practices getting started with AI development',
      price: billingPeriod === 'monthly' ? 29 : 24,
      features: [
        'Up to 5 AI-powered applications',
        'Basic HIPAA compliance tools',
        'Standard templates & workflows',
        'Email support',
        'Single user access'
      ],
      cta: 'Start Building'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Advanced AI development for growing healthcare organizations',
      price: billingPeriod === 'monthly' ? 99 : 82,
      popular: true,
      features: [
        'Up to 50 AI-powered applications',
        'Advanced HIPAA & GDPR compliance',
        'Premium templates & white labeling',
        'Priority support',
        'Team collaboration (5 users)',
        'Custom integrations',
        'Advanced analytics'
      ],
      cta: 'Go Professional'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete AI development platform for large healthcare enterprises',
      price: billingPeriod === 'monthly' ? 299 : 249,
      features: [
        'Unlimited AI-powered applications',
        'Enterprise-grade compliance suite',
        'Custom templates & white labeling',
        'Dedicated support manager',
        'Unlimited team members',
        'Custom AI model training',
        'Advanced security features',
        'API access & integrations'
      ],
      cta: 'Start Enterprise Trial'
    }
  ];

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
                <div className="text-xs text-gray-400">AI Healthcare Development</div>
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

      {/* Pricing Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Billing Toggle */}
          <div className="flex justify-center items-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingPeriod === 'annual' ? 'text-white' : 'text-gray-400'}`}>
              Annual
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-green-600 text-white px-4 py-1 text-sm font-medium">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`bg-slate-800 border-slate-700 h-full ${plan.popular ? 'ring-2 ring-green-500' : ''}`}>
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-slate-300 text-sm leading-relaxed px-4">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-slate-400 ml-1">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full py-3 text-sm font-medium ${
                        plan.popular 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                      }`}
                      onClick={() => {
                        if (plan.id === 'enterprise') {
                          window.location.href = '/api/login?enterprise=true';
                        } else {
                          window.location.href = '/api/login';
                        }
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Automated Enterprise Sales Process Section */}
      <div className="bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Automated Enterprise Sales Process
            </h2>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              No sales calls. No demos. No waiting. Our revolutionary AI completely automates enterprise onboarding - 
              from needs assessment to full deployment in under 5 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant AI Analysis</h3>
              <p className="text-slate-300">
                Advanced AI instantly analyzes your organization, automatically determines requirements, 
                and eliminates all manual sales qualification processes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Zero-Touch Setup</h3>
              <p className="text-slate-300">
                Complete enterprise platform configuration happens automatically - 
                compliance, integrations, teams, and custom AI models without human intervention.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Automated Deployment</h3>
              <p className="text-slate-300">
                Your complete enterprise environment deploys automatically - 
                no waiting, no sales teams, no manual processes. Just instant access.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Everything Automated & Included
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Unlimited healthcare applications</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Advanced AI model training & deployment</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Multi-region HIPAA compliance automation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">White-label platform customization</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">24/7 dedicated support & success manager</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Custom integrations & API access</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-white mb-2">Instant Enterprise Access</h4>
                  <p className="text-green-100 mb-4">
                    Complete automated deployment in 5 minutes
                  </p>
                  <Button 
                    className="w-full bg-white text-green-700 hover:bg-gray-100 font-semibold py-3"
                    onClick={() => window.location.href = '/api/login?enterprise=true'}
                  >
                    Deploy Enterprise Now
                  </Button>
                  <p className="text-green-100 text-sm mt-3">
                    No sales calls • No demos • No waiting • Fully automated
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}