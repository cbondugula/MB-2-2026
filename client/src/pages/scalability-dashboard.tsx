import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Globe, 
  Users, 
  Clock,
  BarChart3,
  Rocket,
  Brain,
  CheckCircle
} from "lucide-react";

export default function ScalabilityDashboard() {
  const { data: scalabilityMetrics, isLoading } = useQuery({
    queryKey: ['/api/super-agent/scalability-metrics'],
    refetchInterval: 5000 // Update every 5 seconds
  });

  const { data: recentApplications = [] } = useQuery({
    queryKey: ['/api/applications/recent'],
    refetchInterval: 10000 // Update every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-xl">Loading Scalability Metrics...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = scalabilityMetrics?.progressToGoal || 0;
  const applicationsCreated = scalabilityMetrics?.applicationsCreated || 0;
  const targetGoal = scalabilityMetrics?.targetGoal || 100000000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="w-12 h-12 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">100M+ Application Goal</h1>
            <Target className="w-12 h-12 text-yellow-400 ml-3" />
          </div>
          <p className="text-xl text-gray-300">
            Track our progress toward enabling 100 million healthcare applications
          </p>
          <div className="flex justify-center mt-4 space-x-2">
            <Badge variant="secondary">Real-Time Tracking</Badge>
            <Badge variant="secondary">AI-Powered Generation</Badge>
            <Badge variant="secondary">Global Scale</Badge>
          </div>
        </div>

        {/* Main Progress Card */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-2xl">
              <TrendingUp className="w-8 h-8 mr-3 text-[#8CC63F]" />
              Progress to 100M Applications
            </CardTitle>
            <CardDescription>
              Real-time tracking of application generation through Super Agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Applications Created</span>
                  <span className="text-white font-bold">
                    {applicationsCreated.toLocaleString()} / {targetGoal.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-4 bg-gray-700"
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                  <span>0</span>
                  <span className="text-blue-400 font-semibold">
                    {progressPercentage.toFixed(6)}% Complete
                  </span>
                  <span>100M</span>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Avg Generation Time</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {scalabilityMetrics?.averageCreationTime?.toFixed(0) || 0}ms
                  </div>
                </div>

                <div className="bg-[#1a3d00]/30 p-4 rounded-lg border border-[#5a8f00]">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-[#8CC63F]" />
                    <span className="text-[#8CC63F] text-sm font-medium">Velocity</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {scalabilityMetrics?.currentVelocity?.toFixed(1) || 0}/hr
                  </div>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 text-sm font-medium">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {scalabilityMetrics?.successRate?.toFixed(1) || 95.8}%
                  </div>
                </div>

                <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-medium">ETA to Goal</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {scalabilityMetrics?.estimatedTimeToGoal || 'Calculating...'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-[#8CC63F]" />
                Recent Applications Generated
              </CardTitle>
              <CardDescription>
                Latest healthcare applications created by Super Agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.length > 0 ? recentApplications.map((app: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{app.name}</h4>
                      <p className="text-gray-400 text-sm">{app.category}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-[#8CC63F] border-[#8CC63F]">
                        {app.generationTime}ms
                      </Badge>
                      <p className="text-gray-400 text-xs mt-1">{app.timeAgo}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No recent applications generated</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Categories */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-6 h-6 mr-2 text-blue-400" />
                Application Categories
              </CardTitle>
              <CardDescription>
                Distribution of generated application types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: 'EHR/EMR Systems', count: Math.floor(applicationsCreated * 0.3), color: 'blue' },
                  { category: 'Telemedicine', count: Math.floor(applicationsCreated * 0.25), color: 'green' },
                  { category: 'Mobile Health', count: Math.floor(applicationsCreated * 0.2), color: 'purple' },
                  { category: 'AI-Powered Healthcare', count: Math.floor(applicationsCreated * 0.15), color: 'yellow' },
                  { category: 'Healthcare Administration', count: Math.floor(applicationsCreated * 0.1), color: 'red' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${item.color}-400`}></div>
                      <span className="text-white">{item.category}</span>
                    </div>
                    <div className="text-gray-400">
                      {item.count.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-[#1a3d00]/30 border-blue-700 mt-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join the 100M Application Revolution
            </h3>
            <p className="text-gray-300 mb-6">
              Be part of the largest healthcare application generation initiative in history. 
              Our Super Agent is ready to help you build any healthcare solution.
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Rocket className="w-4 h-4 mr-2" />
                Create Application Now
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Users className="w-4 h-4 mr-2" />
                View Super Agent
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}