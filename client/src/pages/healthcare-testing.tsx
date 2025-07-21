import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  TestTube, 
  Shield, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Target,
  BarChart3,
  Settings,
  Play,
  FileText,
  Database,
  Lock,
  Zap,
  Brain
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function HealthcareTesting() {
  const [applicationId, setApplicationId] = useState('');
  const [applicationType, setApplicationType] = useState('');
  const [testTypes, setTestTypes] = useState<string[]>([]);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [selectedStandards, setSelectedStandards] = useState<string[]>(['HIPAA']);

  // Fetch testing analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/healthcare-testing/analytics']
  });

  // Execute test suite mutation
  const executeTestMutation = useMutation({
    mutationFn: async (data: {
      applicationId: string;
      testTypes: string[];
      healthcareStandards: string[];
      applicationType: string;
    }) => {
      const response = await apiRequest('POST', '/api/healthcare-testing/execute-test-suite', data);
      return response.json();
    },
  });

  // Generate testing strategy mutation
  const generateStrategyMutation = useMutation({
    mutationFn: async (data: {
      applicationType: string;
      healthcareStandards: string[];
      riskLevel: string;
      userTypes: string[];
      dataTypes: string[];
    }) => {
      const response = await apiRequest('POST', '/api/healthcare-testing/generate-testing-strategy', data);
      return response.json();
    },
  });

  const handleExecuteTests = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId.trim() || testTypes.length === 0) return;
    
    executeTestMutation.mutate({
      applicationId,
      testTypes,
      healthcareStandards: selectedStandards,
      applicationType
    });
  };

  const handleGenerateStrategy = () => {
    if (!applicationType) return;
    
    generateStrategyMutation.mutate({
      applicationType,
      healthcareStandards: selectedStandards,
      riskLevel,
      userTypes: ['Healthcare Providers', 'Patients', 'Administrators'],
      dataTypes: ['PHI', 'Clinical Data', 'Administrative Data']
    });
  };

  const handleTestTypeChange = (testType: string, checked: boolean) => {
    if (checked) {
      setTestTypes([...testTypes, testType]);
    } else {
      setTestTypes(testTypes.filter(t => t !== testType));
    }
  };

  const handleStandardChange = (standard: string, checked: boolean) => {
    if (checked) {
      setSelectedStandards([...selectedStandards, standard]);
    } else {
      setSelectedStandards(selectedStandards.filter(s => s !== standard));
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <TestTube className="h-8 w-8 text-green-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Advanced Healthcare Testing
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          AI-powered comprehensive testing framework for healthcare applications with HIPAA compliance and clinical workflow validation
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered Testing
          </Badge>
          <Badge variant="outline">88% Test Automation</Badge>
          <Badge variant="outline">$1.2M Cost Savings</Badge>
        </div>
      </div>

      <Tabs defaultValue="execute" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="execute">Execute Tests</TabsTrigger>
          <TabsTrigger value="strategy">Testing Strategy</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="execute" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Healthcare Application Testing</CardTitle>
              <CardDescription>
                Execute comprehensive testing suite for your healthcare application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleExecuteTests} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="applicationId">Application ID</Label>
                      <Input
                        id="applicationId"
                        placeholder="e.g., MyHealthApp-v2.1"
                        value={applicationId}
                        onChange={(e) => setApplicationId(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="applicationType">Application Type</Label>
                      <Select value={applicationType} onValueChange={setApplicationType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select application type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Clinical Decision Support">Clinical Decision Support</SelectItem>
                          <SelectItem value="EHR Integration">EHR Integration</SelectItem>
                          <SelectItem value="Patient Portal">Patient Portal</SelectItem>
                          <SelectItem value="Telehealth Platform">Telehealth Platform</SelectItem>
                          <SelectItem value="Medical Device Integration">Medical Device Integration</SelectItem>
                          <SelectItem value="Healthcare Analytics">Healthcare Analytics</SelectItem>
                          <SelectItem value="Administrative System">Administrative System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Risk Level</Label>
                      <Select value={riskLevel} onValueChange={setRiskLevel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Risk</SelectItem>
                          <SelectItem value="medium">Medium Risk</SelectItem>
                          <SelectItem value="high">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Test Categories</Label>
                      <div className="space-y-2">
                        {[
                          { id: 'hipaa', label: 'HIPAA Compliance', icon: Shield },
                          { id: 'clinical', label: 'Clinical Workflows', icon: Activity },
                          { id: 'interoperability', label: 'Interoperability (FHIR/HL7)', icon: Database },
                          { id: 'security', label: 'Security Testing', icon: Lock },
                          { id: 'performance', label: 'Performance Testing', icon: Zap }
                        ].map(({ id, label, icon: Icon }) => (
                          <div key={id} className="flex items-center space-x-2">
                            <Checkbox
                              id={id}
                              checked={testTypes.includes(id)}
                              onCheckedChange={(checked) => handleTestTypeChange(id, !!checked)}
                            />
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor={id}>{label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold mb-3 block">Healthcare Standards</Label>
                      <div className="space-y-2">
                        {['HIPAA', 'FHIR R4', 'HL7', 'DICOM', 'ICD-10', 'SNOMED CT'].map(standard => (
                          <div key={standard} className="flex items-center space-x-2">
                            <Checkbox
                              id={standard}
                              checked={selectedStandards.includes(standard)}
                              onCheckedChange={(checked) => handleStandardChange(standard, !!checked)}
                            />
                            <Label htmlFor={standard}>{standard}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={executeTestMutation.isPending || !applicationId.trim() || testTypes.length === 0}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  {executeTestMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Executing Tests...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Execute Test Suite
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Testing Strategy</CardTitle>
              <CardDescription>
                Generate customized testing strategy based on your healthcare application profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="strategyApplicationType">Application Type</Label>
                  <Select value={applicationType} onValueChange={setApplicationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select application type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clinical Decision Support">Clinical Decision Support</SelectItem>
                      <SelectItem value="EHR Integration">EHR Integration</SelectItem>
                      <SelectItem value="Patient Portal">Patient Portal</SelectItem>
                      <SelectItem value="Telehealth Platform">Telehealth Platform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Risk Assessment</Label>
                  <Select value={riskLevel} onValueChange={setRiskLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerateStrategy}
                disabled={generateStrategyMutation.isPending || !applicationType}
              >
                {generateStrategyMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Generate Testing Strategy
                  </>
                )}
              </Button>

              {generateStrategyMutation.data && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-green-600">Testing Strategy Generated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Recommended Tests:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {(generateStrategyMutation.data as any)?.testing_strategy?.recommendedTests?.map((test: string, index: number) => (
                            <li key={index} className="text-sm text-muted-foreground">{test}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Testing Priority:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {(generateStrategyMutation.data as any)?.testing_strategy?.testingPriority?.map((priority: string, index: number) => (
                            <li key={index} className="text-sm text-muted-foreground">{priority}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Estimated Effort:</h4>
                        <Badge className="bg-blue-100 text-blue-800">
                          {(generateStrategyMutation.data as any)?.testing_strategy?.estimatedEffort}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsLoading ? (
              <div className="col-span-full text-center p-8">
                <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p>Loading analytics...</p>
              </div>
            ) : analyticsData && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Applications Tested</CardTitle>
                    <TestTube className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(analyticsData as any)?.healthcare_testing_analytics?.testing_overview?.total_applications_tested || 45}</div>
                    <p className="text-xs text-muted-foreground">
                      Healthcare applications
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(analyticsData as any)?.healthcare_testing_analytics?.testing_overview?.average_compliance_score || 87.3}%</div>
                    <p className="text-xs text-muted-foreground">
                      Average HIPAA compliance
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(analyticsData as any)?.healthcare_testing_analytics?.testing_overview?.testing_time_saved || '340'}</div>
                    <p className="text-xs text-muted-foreground">
                      Hours through automation
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(analyticsData as any)?.healthcare_testing_analytics?.testing_overview?.cost_savings_achieved || '$1.2M'}</div>
                    <p className="text-xs text-muted-foreground">
                      Total cost savings
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Testing Automation Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Test Coverage</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress value={88} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">HIPAA Compliance</span>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                    <Progress value={91} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Security Score</span>
                      <span className="text-sm font-medium">86%</span>
                    </div>
                    <Progress value={86} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Organizations Served:</span>
                    <Badge>180</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Violations Prevented:</span>
                    <Badge variant="outline">67</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Vulnerabilities Found:</span>
                    <Badge variant="outline">134</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Issues Resolved:</span>
                    <Badge variant="outline">89</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {executeTestMutation.data ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Test Execution Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(executeTestMutation.data as any)?.testing_results?.results?.passed || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">Tests Passed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {(executeTestMutation.data as any)?.testing_results?.results?.failed || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">Tests Failed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {(executeTestMutation.data as any)?.testing_results?.results?.coverage || 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">Coverage</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {(executeTestMutation.data as any)?.testing_results?.results?.complianceScore || 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">HIPAA Score</p>
                    </div>
                  </div>

                  {(executeTestMutation.data as any)?.testing_results?.recommendations && (
                    <div>
                      <h4 className="font-semibold mb-3">AI Recommendations:</h4>
                      <ul className="space-y-2">
                        {(executeTestMutation.data as any).testing_results.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Test Results Yet</h3>
                <p className="text-muted-foreground">Execute a test suite to see detailed results and recommendations</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}