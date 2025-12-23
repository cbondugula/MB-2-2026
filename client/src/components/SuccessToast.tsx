import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertTriangle, Info, XCircle, Sparkles } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info" | "ai";

interface ShowToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

export function useSuccessToast() {
  const { toast } = useToast();

  const showToast = ({ title, description, type = "success", duration = 4000 }: ShowToastOptions) => {
    const icons = {
      success: <CheckCircle className="w-5 h-5 text-[#76B900]" />,
      error: <XCircle className="w-5 h-5 text-red-400" />,
      warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      info: <Info className="w-5 h-5 text-blue-400" />,
      ai: <Sparkles className="w-5 h-5 text-purple-400" />,
    };

    const variants = {
      success: "bg-[#76B900]950 border-[#5a8f00]",
      error: "bg-red-950 border-red-800",
      warning: "bg-amber-950 border-amber-800",
      info: "bg-blue-950 border-blue-800",
      ai: "bg-purple-950 border-purple-800",
    };

    toast({
      title: (
        <div className="flex items-center gap-2">
          {icons[type]}
          <span className="text-white font-medium">{title}</span>
        </div>
      ) as any,
      description: description ? (
        <span className="text-gray-300 text-sm">{description}</span>
      ) as any : undefined,
      duration,
      className: `${variants[type]} border rounded-lg`,
    });
  };

  return {
    showSuccess: (title: string, description?: string) => 
      showToast({ title, description, type: "success" }),
    showError: (title: string, description?: string) => 
      showToast({ title, description, type: "error" }),
    showWarning: (title: string, description?: string) => 
      showToast({ title, description, type: "warning" }),
    showInfo: (title: string, description?: string) => 
      showToast({ title, description, type: "info" }),
    showAI: (title: string, description?: string) => 
      showToast({ title, description, type: "ai" }),
    showToast,
  };
}

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4" data-testid="trust-badges">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a3d00]/30 border border-[#76B900]/50 rounded-full" data-testid="badge-hipaa">
        <CheckCircle className="w-4 h-4 text-[#76B900]" />
        <span className="text-[#8CC63F] text-sm font-medium">HIPAA Compliant</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/30 border border-blue-700/50 rounded-full" data-testid="badge-soc2">
        <CheckCircle className="w-4 h-4 text-blue-400" />
        <span className="text-blue-300 text-sm font-medium">SOC 2 Type II</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/30 border border-purple-700/50 rounded-full" data-testid="badge-fhir">
        <CheckCircle className="w-4 h-4 text-purple-400" />
        <span className="text-purple-300 text-sm font-medium">FHIR R4 Ready</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-900/30 border border-amber-700/50 rounded-full" data-testid="badge-encryption">
        <CheckCircle className="w-4 h-4 text-amber-400" />
        <span className="text-amber-300 text-sm font-medium">256-bit Encryption</span>
      </div>
    </div>
  );
}

export function MilestoneProgress({ 
  completed, 
  total,
  currentMilestone 
}: { 
  completed: number; 
  total: number;
  currentMilestone?: string;
}) {
  const percentage = Math.round((completed / total) * 100);
  
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4" data-testid="milestone-progress">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-medium">Your Progress</span>
        <span className="text-[#76B900] font-bold" data-testid="text-progress-percentage">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#76B900] to-[#76B900] transition-all duration-500"
          style={{ width: `${percentage}%` }}
          data-testid="progress-bar"
        />
      </div>
      {currentMilestone && (
        <p className="text-gray-400 text-sm mt-2" data-testid="text-next-milestone">
          Next: {currentMilestone}
        </p>
      )}
      <div className="flex items-center gap-2 mt-3">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < completed ? 'bg-[#76B900]' : 'bg-gray-600'
            }`}
            data-testid={`milestone-dot-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
