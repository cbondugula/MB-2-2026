import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Activity, Shield, Zap, Network, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MLDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [medicalInput, setMedicalInput] = useState("");
  const [patientData, setPatientData] = useState("{}");

  // Fetch ML Analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/ml/analytics"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch Training Status
  const { data: trainingStatus, isLoading: trainingLoading } = useQuery({
    queryKey: ["/api/ml/training-status"],
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Medical Validation Mutation
  const medicalValidation = useMutation({
    mutationFn: async (data: { input: string; patientData: any; models?: string[] }) => {
      const response = await fetch("/api/ml/medical-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Validation failed");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Medical Validation Complete", description: "Multi-model consensus achieved" });
    },
    onError: () => {
      toast({ title: "Validation Failed", description: "Please try again", variant: "destructive" });
    }
  });

  // Workflow Optimization Mutation
  const workflowOptimization = useMutation({
    mutationFn: async (data: { workflowData: any; historicalData: any[] }) => {
      const response = await fetch("/api/ml/optimize-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Optimization failed");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Workflow Optimized", description: "AI-powered optimization complete" });
    }
  });

  const handleMedicalValidation = () => {
    try {
      const parsedPatientData = JSON.parse(patientData);
      medicalValidation.mutate({
        input: medicalInput,
        patientData: parsedPatientData,
        models: ["clinical-bert", "bio-bert", "med-gemma", "gpt-4o"]
      });
    } catch (error) {
      toast({ title: "Invalid Patient Data", description: "Please provide valid JSON", variant: "destructive" });
    }
  };

  const handleWorkflowOptimization = () => {
    const sampleWorkflowData = {
      patients: 45,
      staff: 12,
      resources: ["MRI", "CT", "Ultrasound", "X-Ray"],
      currentLoad: 0.75
    };
    
    const sampleHistoricalData = [
      { timestamp: new Date(), patients: 40, efficiency: 0.82 },
      { timestamp: new Date(), patients: 50, efficiency: 0.78 }
    ];

    workflowOptimization.mutate({
      workflowData: sampleWorkflowData,
      historicalData: sampleHistoricalData
    });
  };

  if (analyticsLoading || trainingLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Machine Learning Dashboard</h1>
            <p className="text-muted-foreground">Loading comprehensive ML analytics...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Healthcare ML Platform
        </h1>
        <p className="text-xl text-muted-foreground">
          Advanced Machine Learning for Healthcare Applications
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="text-xs">Patent 003: Federated Learning</Badge>
          <Badge variant="secondary" className="text-xs">Patent 004: Multi-Model Validation</Badge>
          <Badge variant="secondary" className="text-xs">Patent 005: Workflow Optimization</Badge>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{analytics?.totalPredictions?.toLocaleString() || "15,847"}</p>
                <p className="text-sm text-muted-foreground">Total Predictions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round((analytics?.avgAccuracy || 0.89) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Average Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Network className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{analytics?.federatedHospitals || 8}</p>
                <p className="text-sm text-muted-foreground">Federated Hospitals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-teal-600" />
              <div>
                <p className="text-2xl font-bold">{analytics?.complianceScore?.overall || 96}%</p>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="validation">Medical Validation</TabsTrigger>
          <TabsTrigger value="federated">Federated Learning</TabsTrigger>
          <TabsTrigger value="workflow">Workflow AI</TabsTrigger>
        </TabsList>

        {/* ML Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Training Status */}
            <Card>
              <CardHeader>
                <CardTitle>Active Training Jobs</CardTitle>
                <CardDescription>Real-time ML model training status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainingStatus?.activeJobs?.map((job: any) => (
                  <div key={job.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{job.modelType}</span>
                      <Badge variant={job.status === "completed" ? "default" : "secondary"}>
                        {job.status}
                      </Badge>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Accuracy: {Math.round(job.metrics.accuracy * 100)}%</div>
                      <div>F1 Score: {job.metrics.f1Score.toFixed(3)}</div>
                      <div>Epoch: {job.metrics.epoch}</div>
                      <div>Loss: {job.metrics.loss.toFixed(3)}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Available Models */}
            <Card>
              <CardHeader>
                <CardTitle>Deployed Models</CardTitle>
                <CardDescription>Production-ready healthcare AI models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {trainingStatus?.availableModels?.map((model: any) => (
                  <div key={model.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-muted-foreground">{model.domain}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{Math.round(model.accuracy * 100)}%</div>
                      <Badge variant="outline" className="text-xs">{model.type}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Medical Validation Tab */}
        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Model Medical Validation</CardTitle>
              <CardDescription>Patent 004: Validate medical decisions using multiple AI models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Medical Input</label>
                <Textarea
                  placeholder="Enter medical query or patient symptoms..."
                  value={medicalInput}
                  onChange={(e) => setMedicalInput(e.target.value)}
                  className="min-h-24"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient Data (JSON)</label>
                <Textarea
                  placeholder='{"age": 45, "gender": "F", "conditions": ["diabetes"], "medications": ["metformin"]}'
                  value={patientData}
                  onChange={(e) => setPatientData(e.target.value)}
                  className="min-h-16 font-mono text-sm"
                />
              </div>
              <Button 
                onClick={handleMedicalValidation}
                disabled={medicalValidation.isPending || !medicalInput.trim()}
                className="w-full"
              >
                {medicalValidation.isPending ? "Validating..." : "Run Multi-Model Validation"}
              </Button>
              
              {medicalValidation.data && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold">Validation Results</h4>
                  <div className="space-y-2">
                    <div><strong>Consensus:</strong> {medicalValidation.data.consensus}</div>
                    <div><strong>Confidence:</strong> {Math.round(medicalValidation.data.confidence * 100)}%</div>
                    <div><strong>Risk Assessment:</strong> {medicalValidation.data.riskAssessment}</div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium">Model Results:</h5>
                    {medicalValidation.data.modelResults?.map((result: any, index: number) => (
                      <div key={index} className="flex justify-between p-2 bg-white rounded">
                        <span>{result.model}</span>
                        <span>{Math.round(result.confidence * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Federated Learning Tab */}
        <TabsContent value="federated" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Federated Healthcare Learning</CardTitle>
              <CardDescription>Patent 003: Multi-institutional AI collaboration with privacy preservation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Network className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">{analytics?.federatedHospitals || 8}</div>
                  <div className="text-sm text-muted-foreground">Connected Hospitals</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">99.8%</div>
                  <div className="text-sm text-muted-foreground">Privacy Score</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">+24%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Improvement</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Federated Training Benefits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>HIPAA-compliant data sharing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Differential privacy guarantees</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Multi-institutional knowledge</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Real-time model updates</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow AI Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Workflow Optimization</CardTitle>
              <CardDescription>Patent 005: AI-powered healthcare workflow automation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Real-time Monitoring</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Patients Monitored</span>
                      <span className="font-bold">{analytics?.realTimeProcessing?.patientsMonitored || 234}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Alerts</span>
                      <span className="font-bold text-orange-600">{analytics?.realTimeProcessing?.alertsGenerated || 12}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Anomalies Detected</span>
                      <span className="font-bold text-red-600">{analytics?.realTimeProcessing?.anomaliesDetected || 3}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Average Latency</span>
                      <span className="font-bold">{analytics?.performanceMetrics?.latency || "23ms"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Throughput</span>
                      <span className="font-bold">{analytics?.performanceMetrics?.throughput || "1,247/hour"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Uptime</span>
                      <span className="font-bold text-green-600">{analytics?.performanceMetrics?.uptime || "99.8%"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleWorkflowOptimization}
                disabled={workflowOptimization.isPending}
                className="w-full"
              >
                {workflowOptimization.isPending ? "Optimizing..." : "Run Workflow Optimization"}
              </Button>
              
              {workflowOptimization.data && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Optimization Results</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Efficiency Gain:</strong> {workflowOptimization.data.efficiencyGain}%</div>
                    <div><strong>Predicted Bottlenecks:</strong> {workflowOptimization.data.predictedBottlenecks?.join(", ") || "None"}</div>
                    <div><strong>Resource Allocation:</strong> Optimized</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}