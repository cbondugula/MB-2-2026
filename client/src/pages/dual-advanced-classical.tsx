import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Shield, Zap, FileText, Award } from "lucide-react";

export default function DualAdvancedClassical() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="border-2 border-cyan-400">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-cyan-500" />
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                  Dual Patent Strategy: Advanced & Classical
                </CardTitle>
              </div>
              <Badge className="bg-yellow-500 text-black font-bold">
                COMING SOON
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Comprehensive intellectual property protection combining both advanced (future-focused) and classical (immediate implementation) patent claims.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Advanced Patent Claims</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Future-oriented claims covering AI-powered healthcare innovations and emerging technologies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Classical Patent Claims</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Immediate protection for current implementations and proven healthcare solutions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Patent Portfolio Value</h3>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>22 comprehensive healthcare AI patents covering voice control, automation, and compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>Dual strategy ensures both immediate and long-term IP protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>Global coverage across 193 countries with multi-jurisdictional protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>Estimated portfolio value: $46.63B - $84.88B based on market analysis</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
