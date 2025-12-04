import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Code, ArrowLeft, Building, Shield, Zap, Crown, Users, Globe, Cpu, HeartPulse } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import PageLayout from "@/components/PageLayout";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [, setLocation] = useLocation();

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individual developers and small projects',
      icon: Zap,
      monthly: 29,
      yearly: 290,
      popular: false,
      features: [
        "Up to 5 healthcare apps",
        "HIPAA compliance checking",
        "Basic AI code generation",
        "Standard templates library",
        "Email support",
        "Basic analytics dashboard",
        "Community access"
      ],
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      description: 'For growing teams building production healthcare apps',
      icon: Shield,
      monthly: 79,
      yearly: 790,
      popular: true,
      features: [
        "Up to 25 healthcare apps",
        "Advanced HIPAA compliance automation",
        "GPT-4 powered AI code generation",
        "Premium templates & components",
        "Priority email & chat support",
        "Up to 5 team members",
        "EHR integrations (HL7 FHIR)",
        "Advanced analytics & reporting",
        "Custom branding"
      ],
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      description: 'For organizations requiring unlimited scale and support',
      icon: Crown,
      monthly: 299,
      yearly: 2990,
      popular: false,
      features: [
        "Unlimited healthcare apps",
        "Enterprise HIPAA & GDPR compliance",
        "Multi-model AI (GPT-4, Claude, Gemini)",
        "All templates & components",
        "24/7 dedicated support",
        "Unlimited team members",
        "Complete EHR ecosystem integration",
        "Epic, Cerner, AllScripts connectors",
        "Custom AI model training",
        "SOC 2 Type II compliance",
        "SLA guarantees",
        "Dedicated account manager"
      ],
      cta: 'Contact Sales'
    }
  ];

  const handleSelectPlan = (planName: string) => {
    if (planName === 'Enterprise') {
      setLocation('/custom-pricing');
    } else {
      setLocation(`/checkout?plan=${planName}&billing=${billingPeriod}`);
    }
  };

  return (
    <PageLayout
      title="Pricing"
      description="Choose the right plan for your healthcare development needs"
      showBackButton={true}
    >
      <div className="max-w-7xl mx-auto">
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              data-testid="billing-monthly"
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              data-testid="billing-yearly"
            >
              Yearly
              <Badge className="ml-2 bg-emerald-900 text-emerald-300 text-xs">Save 17%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billingPeriod === 'yearly' ? plan.yearly : plan.monthly;
            const period = billingPeriod === 'yearly' ? '/year' : '/month';

            return (
              <Card 
                key={plan.name}
                className={`bg-gray-900 border-2 transition-all hover:border-emerald-500 ${
                  plan.popular ? 'border-emerald-500 relative' : 'border-gray-800'
                }`}
                data-testid={`plan-card-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">${price}</span>
                    <span className="text-gray-400 ml-1">{period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Button
                    className={`w-full py-3 ${
                      plan.popular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                    }`}
                    onClick={() => handleSelectPlan(plan.name)}
                    data-testid={`select-plan-${plan.name.toLowerCase()}`}
                  >
                    {plan.cta}
                  </Button>

                  <div className="pt-4 space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Why Choose MedBuilder?
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">HIPAA Compliant</h3>
              <p className="text-gray-400 text-sm">
                Built-in compliance automation for healthcare regulations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-gray-400 text-sm">
                Advanced AI models for intelligent code generation
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Global Standards</h3>
              <p className="text-gray-400 text-sm">
                HL7 FHIR, DICOM, ICD-10 support out of the box
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Team Collaboration</h3>
              <p className="text-gray-400 text-sm">
                Real-time collaboration for healthcare development teams
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            For large healthcare organizations, hospitals, and enterprise deployments, 
            we offer custom pricing and dedicated support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold px-8"
              onClick={() => setLocation('/custom-pricing')}
              data-testid="button-custom-pricing"
            >
              Configure Enterprise Contract
            </Button>
            <Button 
              variant="outline"
              className="border-emerald-300 text-emerald-100 hover:bg-emerald-700"
              onClick={() => setLocation('/documentation')}
              data-testid="button-view-docs"
            >
              View Documentation
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                  and we'll prorate any differences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Yes! All plans come with a 14-day free trial with full access to all features. 
                  No credit card required to start.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  We accept all major credit cards (Visa, MasterCard, American Express) and 
                  bank transfers for Enterprise plans.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Absolutely. We're HIPAA compliant, SOC 2 Type II certified, and use 
                  enterprise-grade encryption for all data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
