import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Shield, Users } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  // Fetch dynamic pricing plans from API
  const { data: pricingData, isLoading: plansLoading } = useQuery({
    queryKey: ['/api/pricing/tiers'],
    refetchInterval: 30000, // Refresh every 30 seconds for dynamic pricing
  });

  // Use dynamic data instead of static plans
  const plans = (pricingData as any)?.tiers || [];

  const getPrice = (plan: any) => billingPeriod === 'annual' ? plan.price * 0.8 : plan.price;

  if (plansLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-blue-50 via-white to-trust-green-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-medical-blue-500 border-t-transparent rounded-full shadow-medical" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue-50 via-white to-trust-green-50">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-300/50 shadow-strong">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="text-3xl font-black text-medical-blue-600 hover:text-medical-blue-700 transition-strong">
              MedBuilder
            </Link>
            <div className="flex items-center space-x-6">
              {!isAuthenticated ? (
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  className="gradient-medical text-white px-6 py-3 text-lg font-semibold shadow-medical scale-hover transition-strong"
                >
                  Sign In
                </Button>
              ) : (
                <Link to="/dashboard">
                  <Button 
                    variant="outline" 
                    className="border-medical-blue-500 text-medical-blue-600 hover:bg-medical-blue-50 px-6 py-3 text-lg font-semibold shadow-medical transition-strong"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Pricing Header */}
      <div className="bg-gradient-to-r from-white via-medical-blue-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Choose Your Healthcare AI 
            <span className="text-medical-blue-600 block">Development Plan</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-12 font-medium max-w-4xl mx-auto leading-relaxed">
            Build HIPAA-compliant healthcare applications with AI-powered tools and comprehensive compliance features
          </p>
          
          {/* Billing Toggle */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingPeriod === 'annual' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual
            </span>
            {billingPeriod === 'annual' && (
              <Badge variant="secondary" className="ml-2">20% Off</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan: any) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${getPrice(plan)}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features?.map((feature: any, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => {
                    if (plan.id === 'enterprise') {
                      setLocation('/contact-sales');
                    } else {
                      toast({
                        title: "Plan Selected",
                        description: `${plan.name} plan selected. Redirecting to checkout...`,
                      });
                      setTimeout(() => setLocation('/checkout'), 1000);
                    }
                  }}
                >
                  {plan.cta || 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      {(pricingData as any)?.features && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Complete Healthcare Development Platform
              </h2>
              <p className="text-gray-600">
                Everything you need to build modern healthcare applications
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Zap className="w-6 h-6 text-blue-500 mr-2" />
                  AI Development
                </h3>
                <ul className="space-y-2">
                  {(pricingData as any).features.aiDevelopment?.map((feature: any, index: number) => (
                    <li key={index} className="text-gray-600">• {feature}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="w-6 h-6 text-green-500 mr-2" />
                  Compliance
                </h3>
                <ul className="space-y-2">
                  {(pricingData as any).features.compliance?.map((feature: any, index: number) => (
                    <li key={index} className="text-gray-600">• {feature}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="w-6 h-6 text-purple-500 mr-2" />
                  Collaboration
                </h3>
                <ul className="space-y-2">
                  {(pricingData as any).features.collaboration?.map((feature: any, index: number) => (
                    <li key={index} className="text-gray-600">• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}