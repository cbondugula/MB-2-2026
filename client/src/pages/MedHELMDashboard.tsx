import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain,
  BookOpen,
  Heart,
  FileText,
  Users,
  Search,
  Stethoscope,
  GraduationCap,
  Activity,
  Shield
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function MedHELMDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [clinicalCase, setClinicalCase] = useState({
    symptoms: [],
    medicalHistory: [],
    medications: [],
    vitalSigns: {}
  });
  const [knowledgeQuery, setKnowledgeQuery] = useState('');
  const [nlpText, setNlpText] = useState('');
  const [nlpTask, setNlpTask] = useState('entity_extraction');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch MedHELM service health
  const { data: healthStatus } = useQuery({
    queryKey: ['/api/medhelm/health'],
    enabled: true
  });

  // Demo clinical case query
  const { data: demoCase } = useQuery({
    queryKey: ['/api/medhelm/demo/clinical-case'],
    enabled: true
  });

  // Demo knowledge query
  const { data: demoKnowledge } = useQuery({
    queryKey: ['/api/medhelm/demo/knowledge-query'],
    enabled: true
  });

  // Clinical decision support mutation
  const clinicalDecisionMutation = useMutation({
    mutationFn: (patientData: any) => apiRequest('POST', '/api/medhelm/clinical-decision', { patientData }),
    onSuccess: () => {
      toast({
        title: "Clinical Decision Generated",
        description: "MedHELM has provided clinical recommendations",
      });
    },
    onError: () => {
      toast({
        title: "Clinical Decision Failed",
        description: "Failed to generate clinical recommendations",
        variant: "destructive"
      });
    }
  });

  // Medical knowledge retrieval mutation
  const knowledgeMutation = useMutation({
    mutationFn: (query: any) => apiRequest('POST', '/api/medhelm/knowledge', { query }),
    onSuccess: () => {
      toast({
        title: "Medical Knowledge Retrieved",
        description: "MedHELM has provided medical information",
      });
    }
  });

  // Medical NLP processing mutation
  const nlpMutation = useMutation({
    mutationFn: (task: any) => apiRequest('POST', '/api/medhelm/nlp', { task }),
    onSuccess: () => {
      toast({
        title: "Medical Text Processed",
        description: "MedHELM has completed NLP analysis",
      });
    }
  });

  const handleClinicalDecision = () => {
    if (demoCase?.sampleCase) {
      clinicalDecisionMutation.mutate(demoCase.sampleCase);
    }
  };

  const handleKnowledgeQuery = () => {
    if (knowledgeQuery) {
      knowledgeMutation.mutate({
        condition: knowledgeQuery,
        specialty: 'General Medicine',
        evidenceLevel: 'systematic_review'
      });
    }
  };

  const handleNLPProcessing = () => {
    if (nlpText) {
      nlpMutation.mutate({
        text: nlpText,
        taskType: nlpTask,
        specialty: 'General Medicine'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5d9] to-teal-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-[#76B900] mr-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Stanford MedHELM Integration
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Medical Holistic Evaluation of Language Models - Advanced healthcare AI for clinical decision support, 
            medical knowledge retrieval, and patient care optimization.
          </p>
        </div>

        {/* Service Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center" data-testid="card-service-status">
            <CardContent className="p-6">
              <Activity className="h-8 w-8 text-[#76B900] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(healthStatus as any)?.status === 'operational' ? 'Active' : 'Checking'}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Service Status</p>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-capabilities">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(healthStatus as any)?.capabilities?.length || 5}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI Capabilities</p>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-model-version">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                v1.0
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">MedHELM Version</p>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-institution">
            <CardContent className="p-6">
              <GraduationCap className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                Stanford
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Institution</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Functionality Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="clinical-decision" data-testid="tab-clinical">Clinical Decision</TabsTrigger>
            <TabsTrigger value="knowledge" data-testid="tab-knowledge">Medical Knowledge</TabsTrigger>
            <TabsTrigger value="nlp" data-testid="tab-nlp">Medical NLP</TabsTrigger>
            <TabsTrigger value="education" data-testid="tab-education">Medical Education</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card data-testid="card-medhelm-overview">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-6 w-6 mr-2" />
                    MedHELM Framework Overview
                  </CardTitle>
                  <CardDescription>
                    Stanford's comprehensive evaluation framework for healthcare AI models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Key Features</h3>
                      <ul className="text-sm space-y-1">
                        <li>✓ 121 medical tasks across 5 categories</li>
                        <li>✓ Real electronic health record (EHR) data</li>
                        <li>✓ Clinician-validated taxonomy</li>
                        <li>✓ Continuous model evaluation</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Task Categories</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Badge variant="outline">Clinical Notes</Badge>
                        <Badge variant="outline">Patient Communication</Badge>
                        <Badge variant="outline">Medical Research</Badge>
                        <Badge variant="outline">Clinical Decision Support</Badge>
                        <Badge variant="outline">Administration</Badge>
                        <Badge variant="outline">Workflow Optimization</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-integration-status">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="h-6 w-6 mr-2" />
                    Integration Status
                  </CardTitle>
                  <CardDescription>
                    Current MedHELM integration capabilities in our platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Clinical Decision Support</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medical Knowledge Retrieval</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medical NLP Processing</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Patient Care Optimization</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medical Education Support</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Clinical Decision Support Tab */}
          <TabsContent value="clinical-decision">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-6 w-6 mr-2" />
                  Clinical Decision Support
                </CardTitle>
                <CardDescription>
                  Use MedHELM for evidence-based clinical recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {demoCase && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Demo Clinical Case</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Symptoms:</strong> {demoCase.sampleCase.symptoms.join(', ')}
                        </div>
                        <div>
                          <strong>Medical History:</strong> {demoCase.sampleCase.medicalHistory.join(', ')}
                        </div>
                        <div>
                          <strong>Medications:</strong> {demoCase.sampleCase.currentMedications.join(', ')}
                        </div>
                        <div>
                          <strong>Vital Signs:</strong> BP {demoCase.sampleCase.vitalSigns.bp_systolic}/{demoCase.sampleCase.vitalSigns.bp_diastolic}, HR {demoCase.sampleCase.vitalSigns.heart_rate}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleClinicalDecision}
                    disabled={clinicalDecisionMutation.isPending}
                    className="w-full"
                    data-testid="button-clinical-decision"
                  >
                    {clinicalDecisionMutation.isPending ? 'Analyzing...' : 'Get Clinical Decision Support'}
                  </Button>

                  {clinicalDecisionMutation.data && (
                    <div className="bg-[#76B900]50 dark:bg-[#1a3d00]/20 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">MedHELM Clinical Recommendations</h3>
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(clinicalDecisionMutation.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Knowledge Tab */}
          <TabsContent value="knowledge">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-6 w-6 mr-2" />
                  Medical Knowledge Retrieval
                </CardTitle>
                <CardDescription>
                  Access Stanford's medical knowledge base through MedHELM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Input
                      placeholder="Enter medical condition or topic (e.g., Type 2 Diabetes)"
                      value={knowledgeQuery}
                      onChange={(e) => setKnowledgeQuery(e.target.value)}
                      data-testid="input-knowledge-query"
                    />
                  </div>

                  <Button 
                    onClick={handleKnowledgeQuery}
                    disabled={knowledgeMutation.isPending || !knowledgeQuery}
                    className="w-full"
                    data-testid="button-knowledge-search"
                  >
                    {knowledgeMutation.isPending ? 'Retrieving...' : 'Get Medical Knowledge'}
                  </Button>

                  {demoKnowledge && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Sample Query: {demoKnowledge.sampleQuery.condition}</h3>
                      <p className="text-sm">Specialty: {demoKnowledge.sampleQuery.specialty}</p>
                      <p className="text-sm">Evidence Level: {demoKnowledge.sampleQuery.evidenceLevel}</p>
                    </div>
                  )}

                  {knowledgeMutation.data && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Medical Knowledge Response</h3>
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(knowledgeMutation.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical NLP Tab */}
          <TabsContent value="nlp">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  Medical Natural Language Processing
                </CardTitle>
                <CardDescription>
                  Process medical text using MedHELM's specialized NLP capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Select value={nlpTask} onValueChange={setNlpTask}>
                      <SelectTrigger data-testid="select-nlp-task">
                        <SelectValue placeholder="Select NLP task" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entity_extraction">Medical Entity Extraction</SelectItem>
                        <SelectItem value="symptom_analysis">Symptom Analysis</SelectItem>
                        <SelectItem value="medication_review">Medication Review</SelectItem>
                        <SelectItem value="clinical_note_summarization">Clinical Note Summarization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Textarea
                      placeholder="Enter medical text to process (clinical notes, symptoms, medications, etc.)"
                      value={nlpText}
                      onChange={(e) => setNlpText(e.target.value)}
                      rows={6}
                      data-testid="textarea-nlp-input"
                    />
                  </div>

                  <Button 
                    onClick={handleNLPProcessing}
                    disabled={nlpMutation.isPending || !nlpText}
                    className="w-full"
                    data-testid="button-nlp-process"
                  >
                    {nlpMutation.isPending ? 'Processing...' : 'Process Medical Text'}
                  </Button>

                  {nlpMutation.data && (
                    <div className="bg-[#e8f5d9] dark:bg-[#1a3d00]/20 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">NLP Processing Results</h3>
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(nlpMutation.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Education Tab */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-6 w-6 mr-2" />
                  Medical Education Support
                </CardTitle>
                <CardDescription>
                  Generate educational content for healthcare professionals using MedHELM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">For Medical Students</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Foundational medical knowledge and clinical correlations
                      </p>
                      <Button variant="outline" className="w-full" data-testid="button-education-student">
                        Generate Student Content
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">For Residents</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Advanced clinical training and decision-making
                      </p>
                      <Button variant="outline" className="w-full" data-testid="button-education-resident">
                        Generate Resident Content
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">For Attending Physicians</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Latest research and evidence-based updates
                      </p>
                      <Button variant="outline" className="w-full" data-testid="button-education-attending">
                        Generate Attending Content
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">For Specialists</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Specialty-specific advanced topics
                      </p>
                      <Button variant="outline" className="w-full" data-testid="button-education-specialist">
                        Generate Specialist Content
                      </Button>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}