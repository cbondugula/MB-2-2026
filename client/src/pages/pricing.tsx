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
      cta: 'Contact Sales'
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
                          window.location.href = 'mailto:sales@medbuilder.com';
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
    </div>
  );
}