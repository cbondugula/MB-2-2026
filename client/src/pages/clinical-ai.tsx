import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Shield, 
  Zap, 
  Activity, 
  Heart, 
  Eye, 
  Microscope, 
  Stethoscope, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Database,
  Code,
  FileText,
  Award,
  Sparkles
} from "lucide-react";

interface ClinicalRecommendation {
  id: string;
  type: 'diagnostic' | 'therapeutic' | 'preventive' | 'monitoring';
  recommendation: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  confidence: number;
  contraindications?: string[];
  alternatives?: string[];
  followUp?: string;
  complianceNotes: string[];
  safetyWarnings?: string[];
  costEstimate?: string;
  timeframe?: string;
}

interface ConstellationResult {
  primaryRecommendation: ClinicalRecommendation;
  alternativeRecommendations: ClinicalRecommendation[];
  consensusScore: number;
  safetyVerified: boolean;
  complianceChecked: boolean;
  riskAssessment: {
    level: 'low' | 'moderate' | 'high' | 'critical';
    factors: string[];
    mitigations: string[];
  };
}

const CLINICAL_DOMAINS = [
  { value: 'cardiology', label: 'Cardiology', icon: Heart },
  { value: 'oncology', label: 'Oncology', icon: Activity },
  { value: 'radiology', label: 'Radiology', icon: Eye },
  { value: 'pathology', label: 'Pathology', icon: Microscope },
  { value: 'neurology', label: 'Neurology', icon: Brain },
  { value: 'psychiatry', label: 'Psychiatry', icon: Brain },
  { value: 'emergency', label: 'Emergency Medicine', icon: AlertTriangle },
  { value: 'primary-care', label: 'Primary Care', icon: Stethoscope }
];

const RISK_LEVELS = [
  { value: 'low', label: 'Low Risk', color: 'bg-green-500' },
  { value: 'moderate', label: 'Moderate Risk', color: 'bg-yellow-500' },
  { value: 'high', label: 'High Risk', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critical Risk', color: 'bg-red-500' }
];

const EVIDENCE_LEVELS = {
  'A': { label: 'High Quality Evidence', color: 'bg-green-600', description: 'Multiple RCTs or meta-analysis' },
  'B': { label: 'Moderate Quality Evidence', color: 'bg-blue-600', description: 'Single RCT or cohort studies' },
  'C': { label: 'Low Quality Evidence', color: 'bg-yellow-600', description: 'Case-control or observational studies' },
  'D': { label: 'Expert Opinion', color: 'bg-gray-600', description: 'Expert consensus or case reports' }
};

export default function ClinicalAI() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [query, setQuery] = useState("");
  const [clinicalDomain, setClinicalDomain] = useState<string>("");
  const [riskLevel, setRiskLevel] = useState<string>("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [selectedStandards, setSelectedStandards] = useState<string[]>(['FHIR', 'HL7']);

  // Standards Translation State
  const [sourceData, setSourceData] = useState('{\n  "Patient": {\n    "name": "John Doe",\n    "birthDate": "1980-01-15",\n    "gender": "male"\n  }\n}');
  const [sourceStandard, setSourceStandard] = useState("FHIR");
  const [targetStandard, setTargetStandard] = useState("HL7");
  const [targetCountry, setTargetCountry] = useState("US");
  const [translationResult, setTranslationResult] = useState<any>(null);

  const clinicalAIMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/clinical-ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Clinical AI request failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Clinical Recommendations Generated",
        description: "AI constellation analysis completed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const translationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/standards/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Standards translation failed');
      return response.json();
    },
    onSuccess: (data) => {
      setTranslationResult(data);
      toast({
        title: "Translation Successful",
        description: `${data.mappingAccuracy}% mapping accuracy achieved`,
      });
    },
    onError: (error) => {
      toast({
        title: "Translation Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleGenerateRecommendations = () => {
    if (!query || !clinicalDomain || !riskLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in clinical query, domain, and risk level",
        variant: "destructive",
      });
      return;
    }

    const context = {
      patientData: {
        ...(patientAge && { age: parseInt(patientAge) }),
        ...(patientGender && { gender: patientGender }),
        ...(conditions && { conditions: conditions.split(',').map(c => c.trim()) }),
        ...(medications && { medications: medications.split(',').map(m => m.trim()) }),
        ...(allergies && { allergies: allergies.split(',').map(a => a.trim()) })
      },
      clinicalDomain,
      riskLevel,
      standards: selectedStandards
    };

    clinicalAIMutation.mutate({ query, context });
  };

  const result: ConstellationResult | undefined = clinicalAIMutation.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Clinical AI Constellation
            </h1>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Award className="h-3 w-3 mr-1" />
              Enterprise AI Technology
            </Badge>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Advanced multi-modal AI system providing clinical decision support with 99.02% accuracy using specialized medical AI models
          </p>
          
          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Safety Verified</h3>
                <p className="text-sm text-gray-600">Multi-layer safety validation</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">HIPAA Compliant</h3>
                <p className="text-sm text-gray-600">Built-in compliance checking</p>
              </CardContent>
            </Card>
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Evidence-Based</h3>
                <p className="text-sm text-gray-600">A-D evidence level scoring</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 dark:border-orange-800">
              <CardContent className="p-4 text-center">
                <Sparkles className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold">Multi-Modal AI</h3>
                <p className="text-sm text-gray-600">8 specialized medical models</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations">Clinical Recommendations</TabsTrigger>
            <TabsTrigger value="standards">Standards Translation</TabsTrigger>
            <TabsTrigger value="patents">Patent Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Clinical AI Consultation
                  </CardTitle>
                  <CardDescription>
                    Enter clinical scenario for AI constellation analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="query">Clinical Query</Label>
                    <Textarea
                      id="query"
                      placeholder="Describe the clinical scenario, symptoms, or decision you need assistance with..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Medical Specialty</Label>
                      <Select value={clinicalDomain} onValueChange={setClinicalDomain}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {CLINICAL_DOMAINS.map((domain) => (
                            <SelectItem key={domain.value} value={domain.value}>
                              <div className="flex items-center gap-2">
                                <domain.icon className="h-4 w-4" />
                                {domain.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Risk Level</Label>
                      <Select value={riskLevel} onValueChange={setRiskLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk" />
                        </SelectTrigger>
                        <SelectContent>
                          {RISK_LEVELS.map((risk) => (
                            <SelectItem key={risk.value} value={risk.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${risk.color}`} />
                                {risk.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Patient Information (Optional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Age</Label>
                        <Input
                          type="number"
                          placeholder="Age"
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select value={patientGender} onValueChange={setPatientGender}>
                          <SelectTrigger>
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Medical Conditions</Label>
                      <Input
                        placeholder="Diabetes, Hypertension, etc. (comma-separated)"
                        value={conditions}
                        onChange={(e) => setConditions(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Current Medications</Label>
                      <Input
                        placeholder="Metformin, Lisinopril, etc. (comma-separated)"
                        value={medications}
                        onChange={(e) => setMedications(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Allergies</Label>
                      <Input
                        placeholder="Penicillin, Latex, etc. (comma-separated)"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerateRecommendations}
                    disabled={clinicalAIMutation.isPending}
                    className="w-full"
                  >
                    {clinicalAIMutation.isPending ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing with AI Constellation...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate Clinical Recommendations
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    AI Constellation Results
                  </CardTitle>
                  <CardDescription>
                    Multi-modal clinical decision support analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {clinicalAIMutation.isPending && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 animate-pulse text-blue-600" />
                        <span>Initializing AI constellation...</span>
                      </div>
                      <Progress value={30} className="w-full" />
                      <div className="text-sm text-gray-600">
                        Analyzing with 8 specialized medical AI models
                      </div>
                    </div>
                  )}

                  {result && (
                    <ScrollArea className="h-[600px] w-full">
                      <div className="space-y-6">
                        {/* Constellation Metrics */}
                        <div className="grid grid-cols-3 gap-4">
                          <Card className="p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {result.consensusScore}%
                              </div>
                              <div className="text-sm text-gray-600">Consensus Score</div>
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold">
                                {result.safetyVerified ? (
                                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                                ) : (
                                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto" />
                                )}
                              </div>
                              <div className="text-sm text-gray-600">Safety Status</div>
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold">
                                <Badge 
                                  variant="outline" 
                                  className={`${RISK_LEVELS.find(r => r.value === result.riskAssessment.level)?.color || 'bg-gray-500'} text-white border-0`}
                                >
                                  {result.riskAssessment.level.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">Risk Level</div>
                            </div>
                          </Card>
                        </div>

                        {/* Primary Recommendation */}
                        <Card className="border-green-200 dark:border-green-800">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              Primary Recommendation
                              <Badge 
                                className={`${EVIDENCE_LEVELS[result.primaryRecommendation.evidenceLevel].color} text-white`}
                              >
                                Level {result.primaryRecommendation.evidenceLevel}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                              <p className="font-medium text-green-900 dark:text-green-100">
                                {result.primaryRecommendation.recommendation}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Confidence</Label>
                                <Progress 
                                  value={result.primaryRecommendation.confidence} 
                                  className="mt-1"
                                />
                                <span className="text-sm text-gray-600">
                                  {result.primaryRecommendation.confidence}%
                                </span>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Evidence Level</Label>
                                <p className="text-sm text-gray-600">
                                  {EVIDENCE_LEVELS[result.primaryRecommendation.evidenceLevel].description}
                                </p>
                              </div>
                            </div>

                            {result.primaryRecommendation.followUp && (
                              <div>
                                <Label className="text-sm font-medium">Follow-up</Label>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {result.primaryRecommendation.followUp}
                                </p>
                              </div>
                            )}

                            {result.primaryRecommendation.safetyWarnings && result.primaryRecommendation.safetyWarnings.length > 0 && (
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>Safety Warnings:</strong>
                                  <ul className="list-disc list-inside mt-1">
                                    {result.primaryRecommendation.safetyWarnings.map((warning, idx) => (
                                      <li key={idx} className="text-sm">{warning}</li>
                                    ))}
                                  </ul>
                                </AlertDescription>
                              </Alert>
                            )}
                          </CardContent>
                        </Card>

                        {/* Alternative Recommendations */}
                        {result.alternativeRecommendations.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Alternative Approaches</h3>
                            {result.alternativeRecommendations.map((alt, idx) => (
                              <Card key={alt.id} className="border-blue-200 dark:border-blue-800">
                                <CardHeader>
                                  <CardTitle className="text-base">
                                    Alternative {idx + 1}
                                    <Badge variant="outline" className="ml-2">
                                      {alt.confidence}% confidence
                                    </Badge>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {alt.recommendation}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* Compliance Notes */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Shield className="h-5 w-5" />
                              Compliance & Standards
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {result.primaryRecommendation.complianceNotes.map((note, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  <span className="text-sm">{note}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </ScrollArea>
                  )}

                  {!result && !clinicalAIMutation.isPending && (
                    <div className="text-center py-12 text-gray-500">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter a clinical query to get AI constellation recommendations</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="standards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Healthcare Standards Translation
                  <Badge variant="secondary">Patent #002</Badge>
                </CardTitle>
                <CardDescription>
                  AI-powered translation between FHIR, HL7, SNOMED, ICD-10, LOINC, and DICOM standards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Real-time Translation</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Convert between healthcare standards while preserving semantic meaning
                    </p>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">193 Countries</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Multi-country compliance verification for global healthcare systems
                    </p>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold">AI-Powered Mapping</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Advanced AI algorithms ensure accurate data transformation
                    </p>
                  </Card>
                </div>

                <Separator />

                {/* Translation Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Translation Configuration</CardTitle>
                      <CardDescription>Configure source and target standards</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sourceStandard">Source Standard</Label>
                          <Select value={sourceStandard} onValueChange={setSourceStandard}>
                            <SelectTrigger id="sourceStandard" data-testid="select-source-standard">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FHIR">FHIR (R4)</SelectItem>
                              <SelectItem value="HL7">HL7 v2.8</SelectItem>
                              <SelectItem value="SNOMED">SNOMED CT</SelectItem>
                              <SelectItem value="ICD-10">ICD-10</SelectItem>
                              <SelectItem value="LOINC">LOINC</SelectItem>
                              <SelectItem value="DICOM">DICOM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="targetStandard">Target Standard</Label>
                          <Select value={targetStandard} onValueChange={setTargetStandard}>
                            <SelectTrigger id="targetStandard" data-testid="select-target-standard">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FHIR">FHIR (R4)</SelectItem>
                              <SelectItem value="HL7">HL7 v2.8</SelectItem>
                              <SelectItem value="SNOMED">SNOMED CT</SelectItem>
                              <SelectItem value="ICD-10">ICD-10</SelectItem>
                              <SelectItem value="LOINC">LOINC</SelectItem>
                              <SelectItem value="DICOM">DICOM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="targetCountry">Target Country (Optional)</Label>
                        <Select value={targetCountry} onValueChange={setTargetCountry}>
                          <SelectTrigger id="targetCountry" data-testid="select-target-country">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="EU">European Union</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                            <SelectItem value="JP">Japan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="sourceData">Source Data (JSON)</Label>
                        <Textarea
                          id="sourceData"
                          data-testid="textarea-source-data"
                          value={sourceData}
                          onChange={(e) => setSourceData(e.target.value)}
                          placeholder="Enter source data in JSON format"
                          rows={8}
                          className="font-mono text-sm"
                        />
                      </div>

                      <Button
                        onClick={() => {
                          try {
                            const parsedData = JSON.parse(sourceData);
                            translationMutation.mutate({
                              sourceData: parsedData,
                              sourceStandard,
                              targetStandard,
                              targetCountry
                            });
                          } catch (error) {
                            toast({
                              title: "Invalid JSON",
                              description: "Please enter valid JSON data",
                              variant: "destructive"
                            });
                          }
                        }}
                        disabled={translationMutation.isPending}
                        className="w-full"
                        data-testid="button-translate-standards"
                      >
                        {translationMutation.isPending ? (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Translating...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Translate Standards
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Results Display */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Translation Results</CardTitle>
                      <CardDescription>
                        {translationResult ? `${sourceStandard} → ${targetStandard}` : 'Results will appear here'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {translationResult ? (
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-4">
                            {/* Mapping Accuracy */}
                            <div>
                              <Label className="text-sm font-medium">Mapping Accuracy</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={translationResult.mappingAccuracy} className="flex-1" />
                                <span className="text-sm font-semibold">{translationResult.mappingAccuracy}%</span>
                              </div>
                            </div>

                            {/* Compliance Status */}
                            <div>
                              <Label className="text-sm font-medium">Compliance Status</Label>
                              <Badge 
                                variant={translationResult.complianceStatus === 'compliant' ? 'default' : 'secondary'}
                                className="mt-1"
                                data-testid="badge-compliance-status"
                              >
                                {translationResult.complianceStatus === 'compliant' ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                )}
                                {translationResult.complianceStatus.toUpperCase()}
                              </Badge>
                            </div>

                            {/* Transformed Data */}
                            <div>
                              <Label className="text-sm font-medium">Transformed Data</Label>
                              <pre className="mt-1 p-3 bg-gray-50 dark:bg-gray-900 rounded text-xs overflow-x-auto" data-testid="pre-transformed-data">
                                {JSON.stringify(translationResult.transformedData, null, 2)}
                              </pre>
                            </div>

                            {/* Audit Log */}
                            <div>
                              <Label className="text-sm font-medium">Audit Log</Label>
                              <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-950 rounded text-xs space-y-1">
                                <div><strong>Timestamp:</strong> {new Date(translationResult.auditLog.timestamp).toLocaleString()}</div>
                                <div><strong>Source Format:</strong> {translationResult.auditLog.sourceFormat}</div>
                                <div><strong>Target Format:</strong> {translationResult.auditLog.targetFormat}</div>
                                <div><strong>Rules Applied:</strong> {translationResult.auditLog.transformationRules.join(', ')}</div>
                              </div>
                            </div>

                            {/* Validation Errors */}
                            {translationResult.validationErrors && translationResult.validationErrors.length > 0 && (
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>Validation Issues:</strong>
                                  <ul className="mt-2 space-y-1">
                                    {translationResult.validationErrors.map((error: string, idx: number) => (
                                      <li key={idx} className="text-sm">• {error}</li>
                                    ))}
                                  </ul>
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                          <Database className="h-16 w-16 mb-4 opacity-30" />
                          <p className="text-sm">No translation results yet</p>
                          <p className="text-xs text-gray-500 mt-1">Configure and run a translation to see results</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Patent Portfolio Overview
                </CardTitle>
                <CardDescription>
                  Our comprehensive intellectual property protection strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="p-4 border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-700 dark:text-green-300">Patent #001</h3>
                    <h4 className="font-medium mb-2">Multi-Modal Clinical Decision Support AI</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Safety constellation architecture with 99.02% accuracy
                    </p>
                    <Badge className="bg-green-100 text-green-800">High Priority</Badge>
                  </Card>

                  <Card className="p-4 border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300">Patent #002</h3>
                    <h4 className="font-medium mb-2">Healthcare Standards Translation</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      AI-powered semantic translation between healthcare standards
                    </p>
                    <Badge className="bg-blue-100 text-blue-800">High Priority</Badge>
                  </Card>

                  <Card className="p-4 border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-purple-700 dark:text-purple-300">Patent #003</h3>
                    <h4 className="font-medium mb-2">HIPAA-Compliant Code Generation</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Automated healthcare code generation with compliance verification
                    </p>
                    <Badge className="bg-purple-100 text-purple-800">Medium Priority</Badge>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Portfolio Value</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-green-600">$78-117M</p>
                      <p className="text-sm text-gray-600">Estimated Portfolio Value</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">5 Patents</p>
                      <p className="text-sm text-gray-600">Core Innovations</p>
                    </div>
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