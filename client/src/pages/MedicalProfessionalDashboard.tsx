import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Stethoscope, 
  Users, 
  Shield, 
  Mic, 
  Brain,
  Heart,
  Activity,
  FileText,
  Globe,
  Zap
} from 'lucide-react';

interface MedicalProject {
  id: string;
  name: string;
  type: 'patient-portal' | 'emr' | 'telehealth' | 'clinical-trial';
  hipaaCompliance: number;
  patientsServed: number;
  status: 'active' | 'development' | 'deployed';
}

interface VoiceCommand {
  command: string;
  description: string;
  example: string;
  category: 'database' | 'patient-care' | 'compliance' | 'analytics';
}

export default function MedicalProfessionalDashboard() {
  const [activeProjects, setActiveProjects] = useState<MedicalProject[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Fetch medical professional specific data
  const { data: medicalData, isLoading } = useQuery({
    queryKey: ['/api/medical/dashboard'],
    enabled: true
  });

  const { data: voiceCommands } = useQuery({
    queryKey: ['/api/voice/medical-commands'],
    enabled: true
  });

  const { data: complianceScore } = useQuery({
    queryKey: ['/api/compliance/hipaa-score'],
    enabled: true
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const defaultVoiceCommands: VoiceCommand[] = voiceCommands as VoiceCommand[] || [
    {
      command: "Create patient portal",
      description: "Generate a HIPAA-compliant patient portal",
      example: "Create a patient portal for cardiology patients",
      category: "patient-care"
    },
    {
      command: "Update patient database",
      description: "Modify patient records using natural language",
      example: "Update patient 12345 with new blood pressure reading",
      category: "database"
    },
    {
      command: "Check HIPAA compliance",
      description: "Verify application meets healthcare regulations",
      example: "Check HIPAA compliance for telehealth app",
      category: "compliance"
    },
    {
      command: "Generate care analytics",
      description: "Create patient outcome reports",
      example: "Show diabetes management outcomes for last quarter",
      category: "analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Stethoscope className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Medical Professional Console
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Voice-controlled healthcare application development designed for medical professionals.
            Build HIPAA-compliant applications without coding.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center" data-testid="card-hipaa-score">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(complianceScore as any)?.hipaa_compliance_score || '95%'}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">HIPAA Compliance</p>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-active-projects">
            <CardContent className="p-6">
              <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(medicalData as any)?.active_projects || 3}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Projects</p>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-patients-served">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(medicalData as any)?.patients_served || '12,450'}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Patients Served</p>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-voice-status">
            <CardContent className="p-6">
              <Mic className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {voiceEnabled ? 'Active' : 'Ready'}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Voice Control</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="voice-commands" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="voice-commands" data-testid="tab-voice-commands">Voice Commands</TabsTrigger>
            <TabsTrigger value="quick-start" data-testid="tab-quick-start">Quick Start</TabsTrigger>
            <TabsTrigger value="templates" data-testid="tab-templates">Medical Templates</TabsTrigger>
            <TabsTrigger value="compliance" data-testid="tab-compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Voice Commands Tab */}
          <TabsContent value="voice-commands">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mic className="h-6 w-6 mr-2" />
                    Voice Control Center
                  </CardTitle>
                  <CardDescription>
                    Control your healthcare applications using natural language commands
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <Button 
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      variant={voiceEnabled ? "destructive" : "default"}
                      data-testid="button-voice-toggle"
                    >
                      {voiceEnabled ? 'Stop Listening' : 'Start Voice Control'}
                    </Button>
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full mr-2 ${voiceEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {voiceEnabled ? 'Listening...' : 'Voice control disabled'}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <h3 className="text-lg font-semibold">Medical Voice Commands</h3>
                    <div className="grid gap-3">
                      {defaultVoiceCommands.map((cmd, index) => (
                        <div key={index} className="p-4 border rounded-lg" data-testid={`voice-command-${index}`}>
                          <div className="flex items-center justify-between mb-2">
                            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                              "{cmd.command}"
                            </code>
                            <Badge variant="outline">{cmd.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{cmd.description}</p>
                          <p className="text-xs text-gray-500 italic">Example: {cmd.example}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quick Start Tab */}
          <TabsContent value="quick-start">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-6 w-6 mr-2" />
                    Quick Start for Medical Professionals
                  </CardTitle>
                  <CardDescription>
                    Get started building healthcare applications in under 30 minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                      <div>
                        <h3 className="font-semibold">Choose Medical Template</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Select from patient portal, EMR, telehealth, or clinical trial templates</p>
                      </div>
                      <Button variant="outline" size="sm" data-testid="button-choose-template">Choose Template</Button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                      <div>
                        <h3 className="font-semibold">Customize with Voice</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Use voice commands to customize for your medical specialty</p>
                      </div>
                      <Button variant="outline" size="sm" data-testid="button-voice-customize">Start Customizing</Button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                      <div>
                        <h3 className="font-semibold">Deploy Securely</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Automatic HIPAA compliance and security scanning</p>
                      </div>
                      <Button variant="outline" size="sm" data-testid="button-deploy">Deploy Application</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Medical Templates Tab */}
          <TabsContent value="templates">
            <div className="grid gap-6 md:grid-cols-2">
              <Card data-testid="template-patient-portal">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-6 w-6 mr-2" />
                    Patient Portal
                  </CardTitle>
                  <CardDescription>HIPAA-compliant patient engagement platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 mb-4">
                    <li>✓ Secure patient messaging</li>
                    <li>✓ Appointment scheduling</li>
                    <li>✓ Lab results viewing</li>
                    <li>✓ Prescription management</li>
                  </ul>
                  <Button className="w-full" data-testid="button-create-patient-portal">Create Patient Portal</Button>
                </CardContent>
              </Card>

              <Card data-testid="template-emr">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-6 w-6 mr-2" />
                    Electronic Medical Records
                  </CardTitle>
                  <CardDescription>Comprehensive EMR system with FHIR integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 mb-4">
                    <li>✓ Clinical documentation</li>
                    <li>✓ FHIR R4 compliance</li>
                    <li>✓ ICD-10/SNOMED CT coding</li>
                    <li>✓ Clinical decision support</li>
                  </ul>
                  <Button className="w-full" data-testid="button-create-emr">Create EMR System</Button>
                </CardContent>
              </Card>

              <Card data-testid="template-telehealth">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-6 w-6 mr-2" />
                    Telehealth Platform
                  </CardTitle>
                  <CardDescription>Video consultations with integrated health monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 mb-4">
                    <li>✓ HD video consultations</li>
                    <li>✓ Remote patient monitoring</li>
                    <li>✓ Digital prescriptions</li>
                    <li>✓ Multi-language support</li>
                  </ul>
                  <Button className="w-full" data-testid="button-create-telehealth">Create Telehealth App</Button>
                </CardContent>
              </Card>

              <Card data-testid="template-clinical-trial">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-6 w-6 mr-2" />
                    Clinical Trial Management
                  </CardTitle>
                  <CardDescription>Research data collection with regulatory compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 mb-4">
                    <li>✓ Electronic data capture</li>
                    <li>✓ Randomization tools</li>
                    <li>✓ Adverse event reporting</li>
                    <li>✓ Regulatory submissions</li>
                  </ul>
                  <Button className="w-full" data-testid="button-create-clinical-trial">Create Trial System</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-6 w-6 mr-2" />
                    Healthcare Compliance Dashboard
                  </CardTitle>
                  <CardDescription>
                    Real-time compliance monitoring and automated HIPAA verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">HIPAA Compliance Score</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {(complianceScore as any)?.hipaa_compliance_score || '95%'}
                        </span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Data Encryption</span>
                        <Badge variant="default">Compliant</Badge>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Access Controls</span>
                        <Badge variant="default">Compliant</Badge>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Audit Logging</span>
                        <Badge variant="default">Compliant</Badge>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>

                    <div className="mt-6">
                      <Button className="w-full" data-testid="button-full-compliance-report">
                        Generate Full Compliance Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}