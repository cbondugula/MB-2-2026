import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Brain, Waves, Activity, Zap } from "lucide-react";

export default function BCICapabilities() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="border-2 border-purple-400">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-500" />
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                  Brain-Computer Interface Capabilities
                </CardTitle>
              </div>
              <Badge className="bg-yellow-500 text-black font-bold">
                COMING SOON
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Revolutionary brain-computer interface technology for healthcare application development and neural-controlled systems.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Waves className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Neural Signal Processing</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Advanced algorithms for interpreting brain signals and converting them into actionable commands.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Activity className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-Time Monitoring</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Continuous monitoring of neural activity for healthcare applications and patient care.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Future Applications</h3>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Hands-free healthcare application development using neural commands</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Patient rehabilitation and assistive technology integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Neural-controlled medical devices and prosthetics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Cognitive load monitoring for healthcare professionals</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
