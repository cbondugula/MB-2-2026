import { Badge } from "@/components/ui/badge";
import { HeartPulse, ExternalLink } from "lucide-react";

interface BuiltWithMedBuilderProps {
  variant?: "badge" | "banner" | "footer" | "minimal";
  showLink?: boolean;
  className?: string;
}

export function BuiltWithMedBuilder({ 
  variant = "badge", 
  showLink = true,
  className = "" 
}: BuiltWithMedBuilderProps) {
  const handleClick = () => {
    if (showLink) {
      window.open("https://medbuilder.replit.app?ref=built-with", "_blank");
    }
  };

  if (variant === "minimal") {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#76B900] transition-colors ${className}`}
        data-testid="built-with-medbuilder-minimal"
      >
        <HeartPulse className="w-3 h-3" />
        <span>MedBuilder</span>
      </button>
    );
  }

  if (variant === "banner") {
    return (
      <div 
        className={`fixed bottom-4 right-4 z-50 ${className}`}
        data-testid="built-with-medbuilder-banner"
      >
        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-full shadow-lg hover:border-[#76B900] hover:bg-gray-800 transition-all group"
        >
          <div className="w-6 h-6 bg-[#76B900] rounded-md flex items-center justify-center">
            <HeartPulse className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-gray-300 group-hover:text-white">
            Built with <span className="font-semibold text-[#76B900]">MedBuilder</span>
          </span>
          {showLink && <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-[#76B900]" />}
        </button>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div 
        className={`flex items-center justify-center gap-2 py-4 border-t border-gray-800 ${className}`}
        data-testid="built-with-medbuilder-footer"
      >
        <button
          onClick={handleClick}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <HeartPulse className="w-4 h-4 text-[#76B900]" />
          <span className="text-sm">
            Powered by <span className="font-semibold text-[#76B900]">MedBuilder</span> - AI Healthcare Development
          </span>
        </button>
      </div>
    );
  }

  return (
    <Badge 
      className={`bg-gray-900 border border-gray-700 hover:border-[#76B900] cursor-pointer transition-colors ${className}`}
      onClick={handleClick}
      data-testid="built-with-medbuilder-badge"
    >
      <HeartPulse className="w-3 h-3 mr-1 text-[#76B900]" />
      <span className="text-gray-300">Built with</span>
      <span className="ml-1 text-[#76B900] font-semibold">MedBuilder</span>
    </Badge>
  );
}

export function ShareProjectButton({ 
  projectId, 
  projectName 
}: { 
  projectId: number; 
  projectName: string; 
}) {
  const shareUrl = `https://medbuilder.replit.app/showcase/${projectId}`;
  const shareText = `Check out ${projectName} - built with MedBuilder, the AI-powered healthcare development platform!`;

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      copy: shareUrl,
    };

    if (platform === "copy") {
      await navigator.clipboard.writeText(shareUrl);
      return;
    }

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="flex items-center gap-2" data-testid="share-project-buttons">
      <button
        onClick={() => handleShare("twitter")}
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
        data-testid="share-twitter"
      >
        Share on X
      </button>
      <button
        onClick={() => handleShare("linkedin")}
        className="px-3 py-1.5 bg-blue-800 hover:bg-blue-900 text-white text-sm rounded-md transition-colors"
        data-testid="share-linkedin"
      >
        LinkedIn
      </button>
      <button
        onClick={() => handleShare("copy")}
        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
        data-testid="share-copy"
      >
        Copy Link
      </button>
    </div>
  );
}
