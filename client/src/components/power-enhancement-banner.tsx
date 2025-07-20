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
    <Card className="bg-gradient-to-r from-yellow-900/30 via-orange-900/30 to-red-900/30 border-yellow-600/50 mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-xl font-bold text-white">🚀 MedBuilder Power Enhancements LIVE</h3>
              <Badge className="ml-3 bg-green-900 text-green-300 text-xs">
                NEW
              </Badge>
            </div>
            
            <p className="text-gray-300 mb-4">
              Super-Agent AI orchestration, Patent 005 workflow automation, and advanced capabilities are now active. 
              Experience the most powerful healthcare development platform ever built.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-white">Multi-Modal AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-green-400" />
                <span className="text-sm text-white">Voice Commands</span>
              </div>
              <div className="flex items-center space-x-2">
                <Workflow className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-white">Predictive Workflows</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-white">Global Compliance</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/super-agent">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                  <Zap className="w-4 h-4 mr-2" />
                  Try Super Agent
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/scalability-dashboard">
                <Button variant="outline" className="border-yellow-600 text-yellow-300 hover:bg-yellow-900">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  100M+ Goal Tracker
                </Button>
              </Link>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Code className="w-4 h-4" />
                <span>Patent 005 Implementation</span>
              </div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}