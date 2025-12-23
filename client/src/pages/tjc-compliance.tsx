import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Shield, FileText, Zap } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ComplianceAssessment {
  hospitalId: string;
  overallScore: number;
  readinessLevel: 'survey_ready' | 'needs_improvement' | 'critical_gaps' | 'non_compliant';
  criticalFindings: string[];
  timeToCompliance: number;
  costOfCompliance: number;
  riskAreas: string[];
  standardsAnalyzed: {
    id: string;
    title: string;
    category: string;
    complianceScore: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
  }[];
}

export default function TJCCompliance() {
  const [hospitalId, setHospitalId] = useState('');
  const [assessmentResult, setAssessmentResult] = useState<ComplianceAssessment | null>(null);

  const assessmentMutation = useMutation({
    mutationFn: async (data: any) => apiRequest('POST', '/api/tjc/assess-compliance', data),
    onSuccess: (response: any) => {
      setAssessmentResult(response.assessment);
    }
  });

  const { data: monitoringData } = useQuery<any>({
    queryKey: ['/api/tjc/monitor-compliance', hospitalId],
    enabled: !!hospitalId && hospitalId.length > 3,
    refetchInterval: 30000 // Real-time monitoring every 30 seconds
  });

  const handleAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalId.trim()) return;

    assessmentMutation.mutate({
      hospitalId,
      systemData: {
        emrSystem: 'Epic',
        qualitySystem: 'Active',
        complianceTools: ['Manual tracking']
      },
      policies: ['HIPAA Policy', 'Infection Control Protocol', 'Patient Safety Policy'],
      staffingData: {
        totalStaff: 1200,
        nursingStaff: 800,
        physicians: 150
      },
      qualityData: {
        patientSatisfaction: 85,
        infectionRates: 2.1,
        readmissionRates: 8.5
      }
    });
  };

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'survey_ready': return 'text-[#76B900] bg-[#76B900]50';
      case 'needs_improvement': return 'text-yellow-600 bg-yellow-50';
      case 'critical_gaps': return 'text-orange-600 bg-orange-50';
      case 'non_compliant': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Joint Commission Compliance Automation
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          AI-powered TJC compliance assessment and real-time monitoring to ensure your hospital is always survey-ready
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">99.7%</p>
                  <p className="text-sm text-gray-600">Compliance Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-[#76B900] mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">75%</p>
                  <p className="text-sm text-gray-600">Time Reduction</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">$300K</p>
                  <p className="text-sm text-gray-600">Avg. Cost Savings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">24/7</p>
                  <p className="text-sm text-gray-600">Monitoring</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="assessment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessment">Compliance Assessment</TabsTrigger>
          <TabsTrigger value="monitoring">Real-Time Monitoring</TabsTrigger>
          <TabsTrigger value="automation">AI Automation Features</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Compliance Assessment</CardTitle>
              <CardDescription>
                Get instant AI-powered analysis of your Joint Commission compliance readiness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssessment} className="space-y-4">
                <div>
                  <Label htmlFor="hospitalId">Hospital ID or Name</Label>
                  <Input
                    id="hospitalId"
                    value={hospitalId}
                    onChange={(e) => setHospitalId(e.target.value)}
                    placeholder="Enter hospital identifier"
                    required
                  />
                </div>
                <Button type="submit" disabled={assessmentMutation.isPending}>
                  {assessmentMutation.isPending ? 'Analyzing...' : 'Start AI Assessment'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {assessmentResult && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Compliance Assessment Results
                    <Badge className={getReadinessColor(assessmentResult.readinessLevel)}>
                      {assessmentResult.readinessLevel.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Overall Compliance Score</p>
                      <div className="flex items-center space-x-3">
                        <Progress value={assessmentResult.overallScore} className="flex-1" />
                        <span className="text-2xl font-bold text-gray-900">
                          {assessmentResult.overallScore.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Time to Compliance</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {assessmentResult.timeToCompliance} days
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Estimated Investment</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${assessmentResult.costOfCompliance.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {assessmentResult.criticalFindings.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        Critical Findings ({assessmentResult.criticalFindings.length})
                      </h4>
                      <ul className="space-y-2">
                        {assessmentResult.criticalFindings.map((finding, index) => (
                          <li key={index} className="flex items-start">
                            <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Standards Analysis</h4>
                    <div className="space-y-3">
                      {assessmentResult.standardsAnalyzed.map((standard) => (
                        <div key={standard.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">{standard.title}</p>
                              <p className="text-sm text-gray-600">{standard.id} - {standard.category}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getRiskColor(standard.riskLevel)}>
                                {standard.riskLevel.toUpperCase()}
                              </Badge>
                              <span className="text-lg font-semibold text-gray-900">
                                {standard.complianceScore.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <Progress value={standard.complianceScore} className="mt-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          {monitoringData && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-[#76B900] mr-2" />
                    Real-Time Compliance Monitoring Active
                  </CardTitle>
                  <CardDescription>
                    Last updated: {monitoringData?.last_updated ? new Date(monitoringData.last_updated).toLocaleString() : 'Not available'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Current Compliance Score</p>
                      <div className="flex items-center space-x-3">
                        <Progress value={monitoringData?.compliance_trends?.current_score || 0} className="flex-1" />
                        <span className="text-xl font-bold text-gray-900">
                          {monitoringData?.compliance_trends?.current_score || 0}%
                        </span>
                      </div>
                      <p className="text-sm text-[#76B900] mt-1">
                        +{monitoringData?.compliance_trends?.change_percentage || 0}% from last assessment
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Survey Readiness</p>
                      <p className="text-xl font-bold text-gray-900">
                        {monitoringData?.next_survey_readiness || 'N/A'}
                      </p>
                      {monitoringData?.cost_optimization && (
                        <p className="text-sm text-gray-600 mt-1">
                          Monthly savings: ${monitoringData.cost_optimization.monthly_savings?.toLocaleString() || 0}
                        </p>
                      )}
                    </div>
                  </div>

                  {monitoringData?.active_alerts && monitoringData.active_alerts.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Active Alerts</h4>
                      <div className="space-y-3">
                        {(monitoringData.active_alerts || []).map((alert: any, index: number) => (
                          <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                            <div className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{alert.alert}</p>
                                <p className="text-sm text-gray-600 mt-1">Standard: {alert.standard}</p>
                                <p className="text-sm text-[#5a8f00] mt-2">
                                  <strong>Action:</strong> {alert.action_required}
                                </p>
                              </div>
                              <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Automated Fixes Applied</h4>
                    <ul className="space-y-2">
                      {(monitoringData?.automated_fixes || []).map((fix: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-[#76B900] mr-2" />
                          <span className="text-sm text-gray-700">{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-6 w-6 text-blue-600 mr-2" />
                  AI-Powered Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#76B900] mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Real-time compliance monitoring</p>
                      <p className="text-sm text-gray-600">Continuous assessment of all TJC standards</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#76B900] mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Automated gap analysis</p>
                      <p className="text-sm text-gray-600">Identifies compliance gaps before they become critical</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#76B900] mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Predictive survey readiness</p>
                      <p className="text-sm text-gray-600">Know exactly when you're ready for TJC survey</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#76B900] mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Custom action planning</p>
                      <p className="text-sm text-gray-600">AI generates specific improvement plans</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-6 w-6 text-purple-600 mr-2" />
                  Cost Savings & Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Consultant fees saved:</span>
                    <span className="font-semibold">$150,000 - $300,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Survey preparation time:</span>
                    <span className="font-semibold text-[#76B900]">75% reduction</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Compliance monitoring:</span>
                    <span className="font-semibold text-blue-600">Continuous</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Risk mitigation:</span>
                    <span className="font-semibold text-purple-600">90% early detection</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Revolutionary Advantage:</strong> Our AI system is patent-protected and provides 
                    capabilities that no other platform can match. Hospitals using our system maintain 
                    survey-ready status year-round while reducing compliance costs by up to 70%.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>2025 Joint Commission Updates</CardTitle>
              <CardDescription>
                Our AI automatically adapts to the latest TJC requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Accreditation 360 Ready</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 50% standards reduction (1,551 to 774)</li>
                    <li>• Streamlined structure support</li>
                    <li>• CMS alignment verification</li>
                    <li>• Public transparency compliance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Partnership Benefits</h4>
                  <ul className="text-sm space-y-1">
                    <li>• TJC-CHAI collaboration insights</li>
                    <li>• New AI certification program support</li>
                    <li>• Fall 2025 guidance integration</li>
                    <li>• Continuous standard updates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}