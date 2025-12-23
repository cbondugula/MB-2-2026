import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Zap, 
  Brain, 
  Workflow, 
  Globe, 
  Shield, 
  Sparkles,
  X,
  ArrowRight,
  Mic,
  Code
} from "lucide-react";

export default function PowerEnhancementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 border-2 border-teal-400 mb-6 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-3 flex-wrap gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300 flex-shrink-0" />
              <h3 className="text-xl font-bold text-white drop-shadow-md">🚀 MedBuilder Power Enhancements LIVE</h3>
              <Badge className="bg-[#76B900] text-white text-xs font-bold px-2 py-1 shadow-md">
                NEW
              </Badge>
            </div>
            
            <p className="text-white mb-4 leading-relaxed drop-shadow">
              Super-Agent AI orchestration, Patent 005 workflow automation, and advanced capabilities are now active. 
              Experience the most powerful healthcare development platform ever built.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-sm text-white font-semibold">Multi-Modal AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-sm text-white font-semibold">Voice Commands</span>
              </div>
              <div className="flex items-center space-x-2">
                <Workflow className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-sm text-white font-semibold">Predictive Workflows</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-sm text-white font-semibold">Global Compliance</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/super-agent">
                <Button className="bg-white hover:bg-gray-100 text-teal-700 font-bold shadow-lg border-2 border-white">
                  <Zap className="w-4 h-4 mr-2" />
                  Try Super Agent
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/scalability-dashboard">
                <Button className="bg-white/20 border-2 border-white text-white hover:bg-white/30 font-bold shadow-md backdrop-blur-md">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  HIPAA Goal Tracker
                </Button>
              </Link>
              
              <Link href="/visual-builder">
                <Button className="bg-white/20 border-2 border-white text-white hover:bg-white/30 font-bold shadow-md backdrop-blur-md">
                  <Zap className="w-4 h-4 mr-2" />
                  No-Code Builder
                </Button>
              </Link>
              
              <div className="flex items-center space-x-2 text-sm text-white ml-auto">
                <Code className="w-4 h-4" />
                <span className="font-semibold">Patent 005 Implementation</span>
              </div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsVisible(false)}
            className="text-gray-300 hover:text-white hover:bg-white/10 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}