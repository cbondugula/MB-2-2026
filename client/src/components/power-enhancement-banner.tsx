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
    <Card className="bg-gradient-to-r from-yellow-950 via-orange-950 to-red-950 border-2 border-yellow-500 mb-6 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-3 flex-wrap gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <h3 className="text-xl font-bold text-white">🚀 MedBuilder Power Enhancements LIVE</h3>
              <Badge className="bg-green-600 text-white text-xs font-semibold px-2 py-1">
                NEW
              </Badge>
            </div>
            
            <p className="text-gray-100 mb-4 leading-relaxed">
              Super-Agent AI orchestration, Patent 005 workflow automation, and advanced capabilities are now active. 
              Experience the most powerful healthcare development platform ever built.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-white font-medium">Multi-Modal AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm text-white font-medium">Voice Commands</span>
              </div>
              <div className="flex items-center space-x-2">
                <Workflow className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-sm text-white font-medium">Predictive Workflows</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span className="text-sm text-white font-medium">Global Compliance</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/super-agent">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-md">
                  <Zap className="w-4 h-4 mr-2" />
                  Try Super Agent
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/scalability-dashboard">
                <Button variant="outline" className="border-2 border-yellow-400 bg-yellow-950 text-white hover:bg-yellow-900 hover:border-yellow-300 font-semibold">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  HIPAA Goal Tracker
                </Button>
              </Link>
              
              <Link href="/visual-builder">
                <Button variant="outline" className="border-2 border-purple-400 bg-purple-950 text-white hover:bg-purple-900 hover:border-purple-300 font-semibold">
                  <Zap className="w-4 h-4 mr-2" />
                  No-Code Builder
                </Button>
              </Link>
              
              <div className="flex items-center space-x-2 text-sm text-gray-200 ml-auto">
                <Code className="w-4 h-4" />
                <span className="font-medium">Patent 005 Implementation</span>
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