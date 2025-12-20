import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Coins, Zap, Rocket, Building, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

const CREDIT_PACKAGES = [
  { 
    id: 1, 
    name: "Starter Pack", 
    credits: 10, 
    priceInCents: 500, 
    bonusCredits: 0, 
    isPopular: false,
    icon: Coins,
    description: "Perfect for trying out MedBuilder"
  },
  { 
    id: 2, 
    name: "Builder Pack", 
    credits: 50, 
    priceInCents: 2000, 
    bonusCredits: 5, 
    isPopular: true,
    icon: Zap,
    description: "Most popular for active builders"
  },
  { 
    id: 3, 
    name: "Pro Pack", 
    credits: 200, 
    priceInCents: 6000, 
    bonusCredits: 40, 
    isPopular: false,
    icon: Rocket,
    description: "For professional healthcare developers"
  },
  { 
    id: 4, 
    name: "Enterprise Pack", 
    credits: 1000, 
    priceInCents: 20000, 
    bonusCredits: 300, 
    isPopular: false,
    icon: Building,
    description: "For teams and organizations"
  },
];

function PaymentForm({ 
  clientSecret, 
  onSuccess 
}: { 
  clientSecret: string; 
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dashboard?payment=success",
      },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message || "Payment failed");
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <Button 
        type="submit" 
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          "Complete Purchase"
        )}
      </Button>
    </form>
  );
}

interface CreditPurchaseProps {
  sessionId?: string;
  onPurchaseComplete?: () => void;
  trigger?: React.ReactNode;
}

export function CreditPurchase({ sessionId, onPurchaseComplete, trigger }: CreditPurchaseProps) {
  const [selectedPackage, setSelectedPackage] = useState<typeof CREDIT_PACKAGES[0] | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const purchaseMutation = useMutation({
    mutationFn: async (packageId: number) => {
      const response = await apiRequest("POST", "/api/monetization/purchase-credits", {
        packageId,
        sessionId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
  });

  const handleSelectPackage = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setSelectedPackage(pkg);
    purchaseMutation.mutate(pkg.id);
  };

  const handlePaymentSuccess = () => {
    setIsOpen(false);
    setSelectedPackage(null);
    setClientSecret(null);
    queryClient.invalidateQueries({ queryKey: ["/api/monetization/usage-stats"] });
    onPurchaseComplete?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Coins className="w-4 h-4 mr-2" />
            Buy Credits
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Purchase Credits</DialogTitle>
        </DialogHeader>

        {!clientSecret ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {CREDIT_PACKAGES.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <Card 
                  key={pkg.id}
                  className={`bg-gray-800 border-2 cursor-pointer transition-all hover:border-emerald-500 ${
                    pkg.isPopular ? "border-emerald-500" : "border-gray-700"
                  } ${selectedPackage?.id === pkg.id ? "ring-2 ring-emerald-400" : ""}`}
                  onClick={() => handleSelectPackage(pkg)}
                  data-testid={`credit-package-${pkg.id}`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-2 right-4">
                      <Badge className="bg-emerald-600 text-white text-xs">Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{pkg.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-xs">
                          {pkg.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-2xl font-bold text-white">
                        ${(pkg.priceInCents / 100).toFixed(0)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        / {pkg.credits + pkg.bonusCredits} credits
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Check className="w-4 h-4 text-emerald-500" />
                        {pkg.credits} AI generations
                      </div>
                      {pkg.bonusCredits > 0 && (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Check className="w-4 h-4" />
                          +{pkg.bonusCredits} bonus credits
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gray-700 hover:bg-gray-600"
                      disabled={purchaseMutation.isPending}
                    >
                      {purchaseMutation.isPending && selectedPackage?.id === pkg.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="mt-4">
            <div className="mb-4 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{selectedPackage?.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(selectedPackage?.credits || 0) + (selectedPackage?.bonusCredits || 0)} credits
                  </p>
                </div>
                <p className="text-xl font-bold text-white">
                  ${((selectedPackage?.priceInCents || 0) / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: "night",
                  variables: {
                    colorPrimary: "#10b981",
                  },
                },
              }}
            >
              <PaymentForm 
                clientSecret={clientSecret} 
                onSuccess={handlePaymentSuccess} 
              />
            </Elements>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function CreditsDisplay({ 
  creditsRemaining, 
  isGuest = false,
  sessionId 
}: { 
  creditsRemaining: number; 
  isGuest?: boolean;
  sessionId?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full">
        <Coins className="w-4 h-4 text-yellow-500" />
        <span className="text-white font-medium">{creditsRemaining}</span>
        <span className="text-gray-400 text-sm">credits</span>
      </div>
      {creditsRemaining <= 1 && (
        <CreditPurchase 
          sessionId={sessionId}
          trigger={
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Buy More
            </Button>
          }
        />
      )}
    </div>
  );
}
