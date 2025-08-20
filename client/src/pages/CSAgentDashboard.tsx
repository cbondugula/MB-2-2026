import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Activity, Zap, Brain, Shield, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CSAgentStatus {
  service: string;
  status: string;
  power_level: string;
  capabilities: Record<string, boolean>;
  version: string;
}

interface PlatformAnalysis {
  platform_status: 'healthy' | 'issues_detected' | 'critical';
  agents_count: number;
  agent_categories: string[];
  compliance_features: {
    features_detected: string[];
    coverage: string;
    recommendations: string[];
  };
  recommendations: string[];
  performance_metrics: {
    response_time: string;
    availability: string;
    throughput: string;
  };
}

interface MonitoringData {
  monitoring_active: boolean;
  metrics: {
    requests_processed: number;
    uptime: string;
    active_sessions: number;
    system_health: string;
    ai_models_status: string;
    compliance_status: string;
  };
  alerts: any[];
  performance_score: string;
}

export default function CSAgentDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Fetch CS Agent status
  const { data: agentStatus, isLoading: statusLoading } = useQuery<CSAgentStatus>({
    queryKey: ['/cs-agent'],
  });

  // Fetch platform analysis
  const { data: platformAnalysis, isLoading: analysisLoading, refetch: refetchAnalysis } = useQuery<PlatformAnalysis>({
    queryKey: ['/cs-agent/analyze'],
  });

  // Fetch monitoring data
  const { data: monitoringData, refetch: refetchMonitoring } = useQuery<MonitoringData>({
    queryKey: ['/cs-agent/monitor'],
  });

  // Fetch healthcare analysis
  const { data: healthcareAnalysis, refetch: refetchHealthcare } = useQuery({
    queryKey: ['/cs-agent/healthcare-analysis'],
  });

  // Fetch patent analysis
  const { data: patentAnalysis, refetch: refetchPatents } = useQuery({
    queryKey: ['/cs-agent/patent-analysis'],
  });

  // Optimize platform mutation
  const optimizeMutation = useMutation({
    mutationFn: () => apiRequest('GET', '/cs-agent/optimize'),
    onSuccess: (data) => {
      toast({
        title: "Platform Optimized",
        description: "100x processing power activated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/cs-agent/monitor'] });
      setIsOptimizing(false);
    },
    onError: () => {
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize platform performance",
        variant: "destructive",
      });
      setIsOptimizing(false);
    },
  });

  const handleOptimize = () => {
    setIsOptimizing(true);
    optimizeMutation.mutate();
  };

  // Auto-refresh monitoring data
  useEffect(() => {
    const interval = setInterval(() => {
      refetchMonitoring();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refetchMonitoring]);

  if (statusLoading || analysisLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6" data-testid="cs-agent-dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CS Agent Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            100x Computer Agent for Healthcare AI Platforms
          </p>
          {agentStatus && (
            <div className="flex items-center justify-center space-x-4">
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                {agentStatus.status}
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                <Zap className="w-4 h-4 mr-1" />
                {agentStatus.power_level}
              </Badge>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                v{agentStatus.version}
              </Badge>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => refetchAnalysis()}
            variant="outline"
            data-testid="button-analyze-platform"
          >
            <Activity className="w-4 h-4 mr-2" />
            Analyze Platform
          </Button>
          <Button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            data-testid="button-optimize-performance"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {isOptimizing ? "Optimizing..." : "Optimize Performance"}
          </Button>
          <Button 
            onClick={() => refetchMonitoring()}
            variant="outline"
            data-testid="button-refresh-monitoring"
          >
            <Shield className="w-4 h-4 mr-2" />
            Refresh Monitoring
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
            <TabsTrigger value="healthcare">Healthcare Analysis</TabsTrigger>
            <TabsTrigger value="patents">Patent Portfolio</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {platformAnalysis && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Platform Status */}
                <Card data-testid="card-platform-status">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {platformAnalysis.platform_status === 'healthy' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                      )}
                      Platform Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge 
                        variant={platformAnalysis.platform_status === 'healthy' ? 'default' : 'destructive'}
                        data-testid="status-badge"
                      >
                        {platformAnalysis.platform_status}
                      </Badge>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Agents: {platformAnalysis.agents_count}</div>
                        <div>Categories: {platformAnalysis.agent_categories.join(', ')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card data-testid="card-performance-metrics">
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Response Time</span>
                        <Badge variant="outline">{platformAnalysis.performance_metrics.response_time}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Availability</span>
                        <Badge variant="outline">{platformAnalysis.performance_metrics.availability}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Throughput</span>
                        <Badge variant="outline">{platformAnalysis.performance_metrics.throughput}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Coverage */}
                <Card data-testid="card-compliance-coverage">
                  <CardHeader>
                    <CardTitle>Compliance Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge 
                        variant={platformAnalysis.compliance_features.coverage === 'comprehensive' ? 'default' : 'secondary'}
                      >
                        {platformAnalysis.compliance_features.coverage}
                      </Badge>
                      <div className="text-sm space-y-1">
                        <div>Features Detected:</div>
                        <div className="flex flex-wrap gap-1">
                          {platformAnalysis.compliance_features.features_detected.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recommendations */}
            {platformAnalysis?.recommendations && (
              <Card data-testid="card-recommendations">
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>Platform optimization suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {platformAnalysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Real-time Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            {monitoringData && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card data-testid="card-system-metrics">
                  <CardHeader>
                    <CardTitle>System Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Uptime</span>
                        <Badge variant="outline">{monitoringData.metrics.uptime}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Requests Processed</span>
                        <Badge variant="outline">{monitoringData.metrics.requests_processed}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Active Sessions</span>
                        <Badge variant="outline">{monitoringData.metrics.active_sessions}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-health-status">
                  <CardHeader>
                    <CardTitle>Health Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>System Health</span>
                        <Badge variant="default">{monitoringData.metrics.system_health}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>AI Models</span>
                        <Badge variant="default">{monitoringData.metrics.ai_models_status}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Compliance</span>
                        <Badge variant="default">{monitoringData.metrics.compliance_status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-performance-score">
                  <CardHeader>
                    <CardTitle>Performance Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-3xl font-bold text-green-600">
                        {monitoringData.performance_score}
                      </div>
                      <Progress value={100} className="w-full" />
                      <div className="text-sm text-gray-600">
                        100x Power Activated
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Healthcare Analysis Tab */}
          <TabsContent value="healthcare" className="space-y-6">
            {healthcareAnalysis && (
              <Card data-testid="card-healthcare-analysis">
                <CardHeader>
                  <CardTitle>Healthcare Platform Analysis</CardTitle>
                  <CardDescription>Specialized healthcare AI insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Platform Metrics</h4>
                      {healthcareAnalysis.healthcare_specific && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">HIPAA Compliance Score</span>
                            <Badge variant="default">{healthcareAnalysis.healthcare_specific.hipaa_compliance_score}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Patient Data Security</span>
                            <Badge variant="default">{healthcareAnalysis.healthcare_specific.patient_data_security}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Clinical AI Accuracy</span>
                            <Badge variant="default">{healthcareAnalysis.healthcare_specific.clinical_ai_accuracy}</Badge>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Compliance Status</h4>
                      {healthcareAnalysis.compliance_features?.recommendations && (
                        <div className="space-y-2">
                          {healthcareAnalysis.compliance_features.recommendations.map((rec: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Patent Portfolio Tab */}
          <TabsContent value="patents" className="space-y-6">
            {patentAnalysis && (
              <Card data-testid="card-patent-analysis">
                <CardHeader>
                  <CardTitle>Patent Portfolio Analysis</CardTitle>
                  <CardDescription>AI-powered patent portfolio insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Portfolio Status</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Patents</span>
                          <Badge variant="outline">{patentAnalysis.portfolio_status}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversion Probability</span>
                          <Badge variant="default">{patentAnalysis.conversion_probability}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Strategic Value</span>
                          <Badge variant="default">{patentAnalysis.strategic_value}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">AI Confidence</span>
                          <Badge variant="default">{patentAnalysis.ai_assessment_confidence}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Key Recommendations</h4>
                      <div className="space-y-2">
                        {patentAnalysis.recommendations?.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <TrendingUp className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Capabilities Tab */}
          <TabsContent value="capabilities" className="space-y-6">
            {agentStatus?.capabilities && (
              <Card data-testid="card-capabilities">
                <CardHeader>
                  <CardTitle>CS Agent Capabilities</CardTitle>
                  <CardDescription>100x Computer Agent feature set</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(agentStatus.capabilities).map(([capability, enabled]) => (
                      <div key={capability} className="flex items-center space-x-2">
                        {enabled ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        )}
                        <span className="text-sm capitalize">
                          {capability.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}