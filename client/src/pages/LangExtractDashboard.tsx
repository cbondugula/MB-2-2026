import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Brain, Download, FileText, Loader2, Play, Save, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ExtractionResult {
  extractions: any[];
  sourceGrounding: any[];
  visualizationHtml: string;
  confidence: number;
  modelUsed: string;
  processingTime: number;
}

interface SavedExtraction {
  id: number;
  name: string;
  description: string;
  extractionType: string;
  confidence: number;
  createdAt: string;
  results: any[];
}

interface Template {
  name: string;
  description: string;
  example_count: number;
}

interface ServiceHealth {
  status: string;
  capabilities?: string[];
  available_templates?: number;
  supported_formats?: string[];
}

const EXTRACTION_TYPES = [
  { value: 'medication', label: 'Medications & Prescriptions', icon: '💊' },
  { value: 'diagnosis', label: 'Diagnoses & Conditions', icon: '🩺' },
  { value: 'lab_result', label: 'Laboratory Results', icon: '🧪' },
  { value: 'symptom', label: 'Symptoms & Signs', icon: '📋' },
  { value: 'procedure', label: 'Medical Procedures', icon: '⚕️' },
  { value: 'comprehensive_medical', label: 'Comprehensive Medical', icon: '📄' },
];

const SAMPLE_TEXTS = {
  medication: "Patient prescribed metformin 1000mg twice daily for Type 2 diabetes management. Also started on lisinopril 10mg once daily for hypertension control.",
  diagnosis: "Patient diagnosed with acute myocardial infarction (STEMI) and secondary diagnosis of Type 2 diabetes mellitus with poor glycemic control (HbA1c 9.2%).",
  lab_result: "Complete Blood Count: WBC 12,500/μL (elevated), Hemoglobin 8.2 g/dL (low), Platelets 450,000/μL (high). Chemistry: Glucose 245 mg/dL (elevated), Creatinine 1.8 mg/dL (elevated).",
  symptom: "Patient reports severe crushing chest pain 8/10 severity for past 2 hours, radiating to left arm and jaw, associated with diaphoresis and nausea.",
};

export default function LangExtractDashboard() {
  const [extractionText, setExtractionText] = useState('');
  const [extractionType, setExtractionType] = useState('medication');
  const [customInstructions, setCustomInstructions] = useState('');
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available templates
  const { data: templates, isLoading: templatesLoading } = useQuery<Record<string, Template>>({
    queryKey: ['/api/langextract/templates'],
  });

  // Fetch user's saved extractions
  const { data: savedExtractions, isLoading: extractionsLoading } = useQuery<SavedExtraction[]>({
    queryKey: ['/api/langextract/extractions'],
  });

  // Fetch service health
  const { data: serviceHealth } = useQuery<ServiceHealth>({
    queryKey: ['/api/langextract/health'],
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Extract text mutation
  const extractMutation = useMutation({
    mutationFn: async (data: { text: string; extractionType: string; instructions?: string }) => {
      return apiRequest('POST', '/api/langextract/extract', data);
    },
    onSuccess: (result) => {
      setExtractionResult(result);
      toast({
        title: "Extraction Complete", 
        description: `Found ${result.extractions?.length || 0} extractions with ${result.confidence}% confidence`,
      });
    },
    onError: (error) => {
      toast({
        title: "Extraction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Save extraction mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/langextract/save', data);
    },
    onSuccess: () => {
      toast({
        title: "Extraction Saved",
        description: "Your extraction has been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/langextract/extractions'] });
      setSaveName('');
      setSaveDescription('');
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleExtract = async () => {
    if (!extractionText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to extract from",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);
    try {
      await extractMutation.mutateAsync({
        text: extractionText,
        extractionType,
        instructions: customInstructions || undefined,
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave = async () => {
    if (!extractionResult || !saveName.trim()) {
      toast({
        title: "Save Error",
        description: "Please provide a name for this extraction",
        variant: "destructive",
      });
      return;
    }

    await saveMutation.mutateAsync({
      name: saveName,
      description: saveDescription,
      text: extractionText,
      extractionType,
      instructions: customInstructions,
      result: extractionResult,
    });
  };

  const loadSampleText = (type: string) => {
    const sample = SAMPLE_TEXTS[type as keyof typeof SAMPLE_TEXTS];
    if (sample) {
      setExtractionText(sample);
      setExtractionType(type);
    }
  };

  const confidence = extractionResult?.confidence || 0;
  const confidenceColor = confidence >= 80 ? 'bg-green-500' : confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="langextract-dashboard">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2" data-testid="page-title">
          <Brain className="h-8 w-8 text-blue-600" />
          LangExtract Medical Text Processing
        </h1>
        <p className="text-gray-600" data-testid="page-description">
          Extract structured medical information from clinical text using advanced AI
        </p>
      </div>

      {/* Service Status */}
      {serviceHealth && (
        <Card data-testid="service-status">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${serviceHealth.status === 'operational' ? 'bg-green-500' : 'bg-red-500'}`} />
              Service Status: {serviceHealth.status}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div data-testid="capability-count">
                <span className="font-medium">{serviceHealth.capabilities?.length || 0}</span>
                <div className="text-gray-600">Capabilities</div>
              </div>
              <div data-testid="template-count">
                <span className="font-medium">{serviceHealth.available_templates || 0}</span>
                <div className="text-gray-600">Templates</div>
              </div>
              <div data-testid="format-count">
                <span className="font-medium">{serviceHealth.supported_formats?.length || 0}</span>
                <div className="text-gray-600">Formats</div>
              </div>
              <div data-testid="integration-status">
                <span className="font-medium">Active</span>
                <div className="text-gray-600">Integration</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="extract" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="extract" data-testid="tab-extract">Extract Text</TabsTrigger>
          <TabsTrigger value="saved" data-testid="tab-saved">Saved Extractions</TabsTrigger>
          <TabsTrigger value="templates" data-testid="tab-templates">Templates</TabsTrigger>
        </TabsList>

        {/* Extract Text Tab */}
        <TabsContent value="extract" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card data-testid="input-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Text Input & Configuration
                </CardTitle>
                <CardDescription>
                  Paste medical text and configure extraction settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="extraction-type">Extraction Type</Label>
                  <Select value={extractionType} onValueChange={setExtractionType}>
                    <SelectTrigger data-testid="select-extraction-type">
                      <SelectValue placeholder="Select extraction type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXTRACTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value} data-testid={`extraction-type-${type.value}`}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="text-input">Medical Text</Label>
                  <Textarea
                    id="text-input"
                    data-testid="text-input"
                    placeholder="Paste clinical notes, lab reports, or other medical text here..."
                    value={extractionText}
                    onChange={(e) => setExtractionText(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(SAMPLE_TEXTS).map(([type]) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => loadSampleText(type)}
                        data-testid={`sample-${type}`}
                      >
                        Sample {type}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="custom-instructions">Custom Instructions (Optional)</Label>
                  <Textarea
                    id="custom-instructions"
                    data-testid="custom-instructions"
                    placeholder="Provide specific extraction instructions..."
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleExtract}
                  disabled={isExtracting || !extractionText.trim()}
                  className="w-full"
                  data-testid="button-extract"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Extract Medical Information
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card data-testid="results-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Extraction Results
                </CardTitle>
                <CardDescription>
                  Structured medical information extracted from your text
                </CardDescription>
              </CardHeader>
              <CardContent>
                {extractionResult ? (
                  <div className="space-y-4">
                    {/* Confidence Score */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid="confidence-score">
                      <span className="font-medium">Confidence Score</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${confidenceColor}`} />
                        <span className="font-bold">{confidence}%</span>
                      </div>
                    </div>

                    {/* Processing Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm" data-testid="processing-info">
                      <div>
                        <span className="font-medium">Model Used:</span>
                        <div className="text-gray-600">{extractionResult.modelUsed}</div>
                      </div>
                      <div>
                        <span className="font-medium">Processing Time:</span>
                        <div className="text-gray-600">{extractionResult.processingTime}ms</div>
                      </div>
                    </div>

                    {/* Extractions */}
                    <div data-testid="extractions-list">
                      <h4 className="font-medium mb-2">Extracted Information</h4>
                      {extractionResult.extractions && extractionResult.extractions.length > 0 ? (
                        <div className="space-y-2">
                          {extractionResult.extractions.map((extraction, index) => (
                            <div key={index} className="p-3 border rounded-lg" data-testid={`extraction-${index}`}>
                              <div className="font-medium text-sm">{extraction.extraction_class}</div>
                              <div className="text-gray-700">{extraction.extraction_text}</div>
                              {extraction.attributes && Object.keys(extraction.attributes).length > 0 && (
                                <div className="mt-2">
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(extraction.attributes).map(([key, value]) => (
                                      <Badge key={key} variant="secondary" className="text-xs">
                                        {key}: {String(value)}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center py-4">
                          No extractions found
                        </div>
                      )}
                    </div>

                    {/* Visualization */}
                    {extractionResult.visualizationHtml && (
                      <div data-testid="visualization">
                        <h4 className="font-medium mb-2">Visualization</h4>
                        <div
                          className="border rounded-lg p-3 bg-white overflow-auto"
                          dangerouslySetInnerHTML={{ __html: extractionResult.visualizationHtml }}
                        />
                      </div>
                    )}

                    {/* Save Section */}
                    <div className="border-t pt-4 space-y-3" data-testid="save-section">
                      <h4 className="font-medium">Save Extraction</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <Input
                          placeholder="Extraction name..."
                          value={saveName}
                          onChange={(e) => setSaveName(e.target.value)}
                          data-testid="input-save-name"
                        />
                        <Input
                          placeholder="Description (optional)..."
                          value={saveDescription}
                          onChange={(e) => setSaveDescription(e.target.value)}
                          data-testid="input-save-description"
                        />
                        <Button
                          onClick={handleSave}
                          disabled={!saveName.trim() || saveMutation.isPending}
                          variant="outline"
                          data-testid="button-save"
                        >
                          {saveMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Extraction
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500" data-testid="no-results">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Extract medical text to see results here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Saved Extractions Tab */}
        <TabsContent value="saved">
          <Card data-testid="saved-extractions">
            <CardHeader>
              <CardTitle>Your Saved Extractions</CardTitle>
              <CardDescription>
                Previously saved medical text extractions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {extractionsLoading ? (
                <div className="flex justify-center py-8" data-testid="loading-extractions">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : savedExtractions && savedExtractions.length > 0 ? (
                <div className="space-y-4" data-testid="extractions-grid">
                  {savedExtractions.map((extraction: SavedExtraction) => (
                    <div key={extraction.id} className="border rounded-lg p-4" data-testid={`saved-extraction-${extraction.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{extraction.name}</h3>
                        <Badge variant="outline">{extraction.extractionType}</Badge>
                      </div>
                      {extraction.description && (
                        <p className="text-sm text-gray-600 mb-2">{extraction.description}</p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Confidence: {extraction.confidence}%</span>
                        <span>{new Date(extraction.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500" data-testid="no-saved-extractions">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No saved extractions yet</p>
                  <p className="text-sm">Extract some medical text to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card data-testid="templates-section">
            <CardHeader>
              <CardTitle>Available Templates</CardTitle>
              <CardDescription>
                Pre-configured templates for different types of medical text extraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <div className="flex justify-center py-8" data-testid="loading-templates">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : templates && Object.keys(templates).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="templates-grid">
                  {Object.entries(templates).map(([key, template]: [string, Template]) => (
                    <Card key={key} className="border-2 hover:border-blue-200 transition-colors cursor-pointer" data-testid={`template-${key}`}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          {EXTRACTION_TYPES.find(t => t.value === key)?.icon || '📄'}
                          {template.name}
                        </CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center text-sm">
                          <span>{template.example_count} examples</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setExtractionType(key);
                              loadSampleText(key);
                            }}
                          >
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500" data-testid="no-templates">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No templates available</p>
                  <p className="text-sm">Check service connectivity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}