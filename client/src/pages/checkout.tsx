import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, Shield, Zap, Crown } from "lucide-react";
import { Link, useLocation } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ selectedPlan }: { selectedPlan: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <PaymentElement 
          options={{
            layout: "tabs"
          }}
        />
      </div>
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
            Processing...
          </>
        ) : (
          `Subscribe to ${selectedPlan?.name || 'Plan'}`
        )}
      </Button>

      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
        <Shield className="w-4 h-4" />
        <span>Secured by Stripe • HIPAA Compliant • Cancel Anytime</span>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // Get plan from URL params or default to Professional
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planName = urlParams.get('plan') || 'Professional';
    const billing = urlParams.get('billing') || 'monthly';
    
    const plans = {
      'Starter': {
        name: 'Starter',
        monthly: 29,
        yearly: 290,
        icon: Zap,
        features: [
          "Up to 5 healthcare apps",
          "HIPAA compliance checking",
          "Basic AI code generation",
          "Standard templates",
          "Email support"
        ]
      },
      'Professional': {
        name: 'Professional',
        monthly: 79,
        yearly: 790,
        icon: Shield,
        features: [
          "Up to 25 healthcare apps",
          "Advanced HIPAA compliance",
          "GPT-4 AI code generation",
          "Premium templates",
          "Priority support",
          "Up to 5 team members",
          "EHR integrations (FHIR)"
        ]
      },
      'Enterprise': {
        name: 'Enterprise',
        monthly: 299,
        yearly: 2990,
        icon: Crown,
        features: [
          "Unlimited healthcare apps",
          "Enterprise HIPAA compliance",
          "Multi-model AI",
          "24/7 dedicated support",
          "Unlimited team members",
          "Complete EHR ecosystem"
        ]
      }
    };

    const plan = plans[planName as keyof typeof plans] || plans.Professional;
    const price = billing === 'yearly' ? plan.yearly : plan.monthly;
    
    setSelectedPlan({ ...plan, billing, price });

    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", { 
      planName,
      billing,
      amount: price * 100 // Convert to cents
    })
      .then(async (response) => {
        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error('Error creating payment intent:', err);
        setError('Unable to set up payment. Please try again later.');
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Payment Setup Issue</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col space-y-3">
            <Link href="/pricing">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" data-testid="button-back-pricing">
                Back to Pricing
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300"
              onClick={() => window.location.reload()}
              data-testid="button-retry"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400" data-testid="text-loading">Setting up your subscription...</p>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Invalid plan selected</p>
          <Link href="/pricing">
            <Button className="bg-green-600 hover:bg-green-700">
              Back to Pricing
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = selectedPlan.icon;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/pricing" className="flex items-center space-x-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Pricing</span>
          </Link>
          <div className="text-xl font-bold">Secure Checkout</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Plan Summary */}
          <div>
            <h1 className="text-3xl font-bold mb-8">Complete Your Subscription</h1>
            
            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">{selectedPlan.name} Plan</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-2xl font-bold text-green-400">
                        ${selectedPlan.price}
                      </span>
                      <span className="text-gray-400">
                        /{selectedPlan.billing === 'yearly' ? 'year' : 'month'}
                      </span>
                      {selectedPlan.billing === 'yearly' && (
                        <Badge className="bg-green-600 text-white ml-2">Save 17%</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <h4 className="font-semibold text-white mb-3">What's included:</h4>
                {selectedPlan.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Why Choose MedBuilder?</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>14-day free trial with full access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Cancel anytime, no hidden fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>HIPAA compliant infrastructure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Payment Information</CardTitle>
                <p className="text-gray-400 text-sm">
                  Your trial starts immediately. You won't be charged until your 14-day free trial ends.
                </p>
              </CardHeader>
              
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm selectedPlan={selectedPlan} />
                </Elements>
              </CardContent>
            </Card>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                By subscribing, you agree to our Terms of Service and Privacy Policy.
                Your subscription will automatically renew unless cancelled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}