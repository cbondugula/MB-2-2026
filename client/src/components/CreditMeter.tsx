import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Coins, Zap, TrendingUp, Gift, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CreditPurchase } from "./CreditPurchase";

interface CreditMeterProps {
  sessionId?: string;
  userId?: string;
  compact?: boolean;
}

export function CreditMeter({ sessionId, userId, compact = false }: CreditMeterProps) {
  const { data: sessionData } = useQuery<{
    creditsRemaining: number;
    projectsCreated: number;
    aiGenerationsUsed: number;
    expiresAt: string;
  }>({
    queryKey: ["/api/monetization/guest-session", sessionId],
    enabled: !!sessionId && !userId,
  });

  const { data: quotaData } = useQuery<{
    creditsBalance: number;
    aiCallsUsed: number;
    aiCallsLimit: number;
  }>({
    queryKey: ["/api/monetization/usage-stats"],
    enabled: !!userId,
  });

  const credits = userId ? (quotaData?.creditsBalance || 0) : (sessionData?.creditsRemaining || 0);
  const maxCredits = userId ? 100 : 3;
  const percentage = Math.min((credits / maxCredits) * 100, 100);
  const isLow = credits <= 1;
  const isEmpty = credits <= 0;

  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 ${isLow ? 'text-amber-400' : 'text-gray-300'} hover:bg-gray-800`}
            data-testid="credit-meter-compact"
          >
            <Coins className={`w-4 h-4 ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span className="font-medium">{credits}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 bg-gray-900 border-gray-700 p-4" align="end">
          <CreditMeterContent 
            credits={credits} 
            maxCredits={maxCredits} 
            percentage={percentage}
            isLow={isLow}
            isEmpty={isEmpty}
            sessionId={sessionId}
            userId={userId}
            aiGenerationsUsed={sessionData?.aiGenerationsUsed || quotaData?.aiCallsUsed || 0}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <CreditMeterContent 
        credits={credits} 
        maxCredits={maxCredits} 
        percentage={percentage}
        isLow={isLow}
        isEmpty={isEmpty}
        sessionId={sessionId}
        userId={userId}
        aiGenerationsUsed={sessionData?.aiGenerationsUsed || quotaData?.aiCallsUsed || 0}
      />
    </div>
  );
}

interface CreditMeterContentProps {
  credits: number;
  maxCredits: number;
  percentage: number;
  isLow: boolean;
  isEmpty: boolean;
  sessionId?: string;
  userId?: string;
  aiGenerationsUsed: number;
}

function CreditMeterContent({ 
  credits, 
  maxCredits, 
  percentage, 
  isLow, 
  isEmpty,
  sessionId,
  userId,
  aiGenerationsUsed
}: CreditMeterContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className={`w-5 h-5 ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`} />
          <span className="text-white font-medium">Credits</span>
        </div>
        <span className={`text-lg font-bold ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-white'}`}>
          {credits}
        </span>
      </div>

      <Progress 
        value={percentage} 
        className="h-2 bg-gray-700"
      />

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Zap className="w-4 h-4" />
          <span>{aiGenerationsUsed} generations</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>$1/generation</span>
        </div>
      </div>

      {isEmpty && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-400 text-sm font-medium">No credits remaining</p>
          <p className="text-red-300/70 text-xs mt-1">Purchase credits to continue building</p>
        </div>
      )}

      {isLow && !isEmpty && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          <p className="text-amber-400 text-sm font-medium">Running low on credits</p>
          <p className="text-amber-300/70 text-xs mt-1">Get more to keep building</p>
        </div>
      )}

      {!userId && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3" data-testid="signup-prompt">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-emerald-400" />
            <p className="text-emerald-400 text-sm font-medium">Sign up for 10 free credits</p>
          </div>
          <Button 
            size="sm" 
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
            data-testid="button-create-account"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      <CreditPurchase 
        sessionId={sessionId}
        trigger={
          <Button 
            variant="outline" 
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            data-testid="button-buy-credits"
          >
            <Coins className="w-4 h-4 mr-2" />
            Buy Credits
          </Button>
        }
      />
    </div>
  );
}
