import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Shield, Star, ArrowRight, Users, Building, Crown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Healthcare Professional',
      description: 'Perfect for individual doctors, nurses, and healthcare professionals',
      icon: Users,
      color: 'text-blue-500',
      popular: false,
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        'Up to 5 healthcare apps per month',
        'HIPAA-compliant templates',
        'Basic AI assistance',
        'Mobile-responsive design',
        'Email support',
        'Patient data encryption',
        'Basic analytics',
        '30-day money-back guarantee'
      ],
      limitations: [
        'No API integrations',
        'Limited customization',
        'Standard security'
      ]
    },
    {
      id: 'professional',
      name: 'Clinical Practice',
      description: 'Ideal for small to medium practices and healthcare teams',
      icon: Building,
      color: 'text-green-500',
      popular: true,
      monthlyPrice: 129,
      annualPrice: 99,
      features: [
        'Unlimited healthcare apps',
        'Advanced AI code generation',
        'FHIR R4 & HL7 integrations',
        'Multi-user collaboration',
        'Priority support',
        'Advanced security features',
        'Custom branding',
        'API access',
        'Real-time monitoring',
        'Backup & recovery',
        'Compliance reporting',
        'Advanced analytics'
      ],
      limitations: [
        'Up to 50 team members'
      ]
    },
    {
      id: 'enterprise',
      name: 'Healthcare System',
      description: 'For hospitals, health systems, and large healthcare organizations',
      icon: Crown,
      color: 'text-purple-500',
      popular: false,
      monthlyPrice: 499,
      annualPrice: 399,
      features: [
        'Everything in Clinical Practice',
        'Unlimited team members',
        'Dedicated account manager',
        'Custom integrations',
        'On-premise deployment option',
        'Advanced compliance tools',
        'Multi-tenant architecture',
        'SSO & LDAP integration',
        'Custom AI model training',
        'White-label solutions',
        '24/7 phone support',
        'SLA guarantees',
        'Custom contracts',
        'Global regulatory compliance'
      ],
      limitations: []
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/api/login';
      return;
    }

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingPeriod,
        }),
      });

      if (response.ok) {
        const { checkoutUrl } = await response.json();
        window.location.href = checkoutUrl;
      } else {
        console.error('Failed to create subscription');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">MedBuilder</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-400 hover:text-white">
              Home
            </Link>
            {isAuthenticated ? (
              <Button asChild variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/api/login">Log In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choose Your
            <span className="text-green-400 block">Healthcare Plan</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Start building secure, HIPAA-compliant healthcare applications today.
            All plans include 30-day money-back guarantee.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                billingPeriod === 'annual' ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm ${billingPeriod === 'annual' ? 'text-white' : 'text-gray-500'}`}>
              Annual
            </span>
            {billingPeriod === 'annual' && (
              <Badge className="bg-green-600 text-white">Save 20%</Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
            
            return (
              <Card
                key={plan.id}
                className={`relative bg-gray-800 border-gray-700 ${
                  plan.popular
                    ? 'border-green-500 shadow-green-500/20 shadow-lg scale-105'
                    : 'hover:border-gray-600'
                } transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${plan.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                      ${price}
                      <span className="text-lg text-gray-400 font-normal">
                        /{billingPeriod === 'monthly' ? 'month' : 'month'}
                      </span>
                    </div>
                    {billingPeriod === 'annual' && (
                      <p className="text-sm text-gray-500">
                        Billed annually (${price * 12})
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    } text-white`}
                  >
                    {plan.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-white mb-2">HIPAA Compliant</h3>
              <p className="text-sm text-gray-400">
                Built with healthcare compliance in mind
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-semibold text-white mb-2">Trusted by 2,500+</h3>
              <p className="text-sm text-gray-400">
                Healthcare professionals worldwide
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="font-semibold text-white mb-2">30-Day Guarantee</h3>
              <p className="text-sm text-gray-400">
                Risk-free trial for all plans
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-400 mb-6">
              Large healthcare systems and organizations can get custom pricing and features
              tailored to their specific needs.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Contact Sales Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}