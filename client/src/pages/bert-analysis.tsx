import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Brain, FileText, Search, Target, TrendingUp, Shield, Activity, Heart, Microscope, Stethoscope } from 'lucide-react';

interface BERTAnalysisResult {
  model: string;
  analysisType: string;
  medicalAccuracy: string;
  clinicalSafety: string;
  timestamp: string;
  medicalEntities?: Array<{
    text: string;
    label: string;
    confidence: number;
    startOffset: number;
    endOffset: number;
    medicalCode?: string;
  }>;
  classification?: {
    primaryLabel: string;
    confidence: number;
    alternativeLabels: Array<{
      label: string;
      confidence: number;
    }>;
  };
  clinicalInsights?: Array<{
    category: string;
    insight: string;
    confidence: number;
    actionable: boolean;
  }>;
  riskFactors?: Array<{
    factor: string;
    riskLevel: string;
    evidence: string;
  }>;
  recommendations?: Array<{
    type: string;
    recommendation: string;
    priority: string;
  }>;
}

export default function BERTAnalysis() {
  const [selectedModel, setSelectedModel] = useState("clinicalbert");
  const [analysisType, setAnalysisType] = useState("medical-ner");
  const [medicalText, setMedicalText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<BERTAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const healthcareBERTModels = [
    { value: "clinicalbert", label: "ClinicalBERT", description: "Clinical notes and medical records", icon: FileText },
    { value: "biobert", label: "BioBERT", description: "Biomedical literature and research", icon: Microscope },
    { value: "pubmedbert", label: "PubMedBERT", description: "Medical publications and papers", icon: Search },
    { value: "bluebert", label: "BlueBERT", description: "Clinical and biomedical text", icon: Brain },
    { value: "discharge-summary-bert", label: "Discharge Summary BERT", description: "Hospital discharge summaries", icon: FileText },
    { value: "radiology-bert", label: "RadBERT", description: "Radiology reports and imaging", icon: Target },
    { value: "pathology-bert", label: "PathBERT", description: "Pathology reports", icon: Microscope },
    { value: "cardiology-bert", label: "CardioBERT", description: "Cardiovascular medical text", icon: Heart },
    { value: "oncology-bert", label: "OncoBERT", description: "Cancer-related documentation", icon: Activity },
    { value: "mental-health-bert", label: "MentalBERT", description: "Psychiatric and mental health", icon: Brain }
  ];

  const analysisTypes = [
    { value: "medical-ner", label: "Medical NER", description: "Extract medical entities and concepts" },
    { value: "document-classification", label: "Document Classification", description: "Classify medical document types" },
    { value: "clinical-sentiment", label: "Clinical Sentiment", description: "Analyze patient sentiment and psychological state" },
    { value: "risk-assessment", label: "Risk Assessment", description: "Identify risk factors and warning signs" },
    { value: "clinical-quality", label: "Clinical Quality", description: "Assess documentation quality and compliance" },
    { value: "medical-coding", label: "Medical Coding", description: "Map to ICD-10, SNOMED CT, LOINC codes" },
    { value: "drug-interaction", label: "Drug Interactions", description: "Identify medication interactions and contraindications" },
    { value: "clinical-timeline", label: "Clinical Timeline", description: "Extract temporal relationships in clinical events" }
  ];

  const analyzeWithBERT = async () => {
    if (!medicalText.trim()) {
      toast({
        title: "No text to analyze",
        description: "Please enter medical text for analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/bert-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: medicalText,
          analysisType,
          model: selectedModel
        })
      });

      if (!response.ok) throw new Error('BERT analysis failed');

      const result = await response.json();
      setAnalysisResult(result);
      
      toast({
        title: "Healthcare BERT Analysis Complete",
        description: `Analyzed with ${result.model?.toUpperCase()} model`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze with healthcare BERT models",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSelectedModelInfo = () => {
    return healthcareBERTModels.find(model => model.value === selectedModel);
  };

  const getSampleText = (modelType: string) => {
    const samples = {
      "clinicalbert": `Patient presents with acute myocardial infarction. 
Admitted with chest pain, elevated troponin levels, and ECG changes. 
Started on dual antiplatelet therapy and beta-blockers. 
Patient has history of hypertension and diabetes mellitus type 2.`,
      "radiology-bert": `CT scan of the chest shows bilateral pulmonary embolism. 
Multiple filling defects in segmental and subsegmental pulmonary arteries. 
No evidence of right heart strain. Recommend anticoagulation therapy.`,
      "pathology-bert": `Histologic examination reveals invasive ductal carcinoma. 
Grade 2, estrogen receptor positive, progesterone receptor positive, 
HER2 negative. Lymph nodes show metastatic carcinoma in 2 of 15 nodes examined.`,
      "cardiology-bert": `Echocardiogram shows reduced left ventricular ejection fraction of 35%. 
Moderate mitral regurgitation and mild tricuspid regurgitation noted. 
Wall motion abnormalities in the anterior and lateral walls.`
    };
    
    return samples[modelType as keyof typeof samples] || samples["clinicalbert"];
  };

  const modelInfo = getSelectedModelInfo();
  const ModelIcon = modelInfo?.icon || Brain;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Healthcare BERT Analysis</h1>
          <p className="text-muted-foreground">
            Advanced medical natural language processing with specialized healthcare BERT models
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-blue-500" />
          <span className="text-sm font-medium">10+ Medical BERT Models</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ModelIcon className="h-5 w-5" />
                <span>Medical Text Analysis</span>
              </CardTitle>
              <CardDescription>
                {modelInfo?.description} using {modelInfo?.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Healthcare BERT Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select BERT model" />
                    </SelectTrigger>
                    <SelectContent>
                      {healthcareBERTModels.map(model => {
                        const Icon = model.icon;
                        return (
                          <SelectItem key={model.value} value={model.value}>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span>{model.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Analysis Type</label>
                  <Select value={analysisType} onValueChange={setAnalysisType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      {analysisTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Medical Text</label>
                <Textarea
                  value={medicalText}
                  onChange={(e) => setMedicalText(e.target.value)}
                  placeholder={getSampleText(selectedModel)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <Button 
                  onClick={analyzeWithBERT} 
                  disabled={isAnalyzing}
                  className="flex items-center space-x-2"
                >
                  <Brain className="h-4 w-4" />
                  <span>{isAnalyzing ? "Analyzing..." : "Analyze with BERT"}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setMedicalText(getSampleText(selectedModel))}
                >
                  Load Sample Text
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Info & Results */}
        <div className="space-y-4">
          {/* Model Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ModelIcon className="h-5 w-5" />
                <span>{modelInfo?.label}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {modelInfo?.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Medical Accuracy</span>
                  <Badge variant="secondary">High</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Clinical Safety</span>
                  <Badge variant="secondary">BERT-Enhanced</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">HIPAA Compliance</span>
                  <Badge variant="secondary">Compliant</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Analysis Types */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysisTypes.slice(0, 4).map(type => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setAnalysisType(type.value)}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {type.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>BERT Analysis Results</span>
              <Badge>{analysisResult.model?.toUpperCase()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="entities" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="entities">Entities</TabsTrigger>
                <TabsTrigger value="classification">Classification</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="entities" className="space-y-4">
                {analysisResult.medicalEntities && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Medical Entities Extracted</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {analysisResult.medicalEntities.map((entity, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{entity.text}</span>
                            <Badge variant="outline">{Math.round(entity.confidence * 100)}%</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entity.label}
                            {entity.medicalCode && (
                              <span className="ml-2 text-blue-600">({entity.medicalCode})</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="classification" className="space-y-4">
                {analysisResult.classification && (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Primary Classification</h4>
                        <Badge>{Math.round(analysisResult.classification.confidence * 100)}%</Badge>
                      </div>
                      <p className="text-lg">{analysisResult.classification.primaryLabel}</p>
                    </div>
                    
                    {analysisResult.classification.alternativeLabels && (
                      <div>
                        <h4 className="font-medium mb-2">Alternative Classifications</h4>
                        <div className="space-y-2">
                          {analysisResult.classification.alternativeLabels.map((alt, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <span>{alt.label}</span>
                              <Badge variant="outline">{Math.round(alt.confidence * 100)}%</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                {analysisResult.clinicalInsights && (
                  <div className="space-y-2">
                    {analysisResult.clinicalInsights.map((insight, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{insight.category}</Badge>
                          <div className="flex items-center space-x-2">
                            {insight.actionable && <Badge variant="outline">Actionable</Badge>}
                            <Badge variant="outline">{Math.round(insight.confidence * 100)}%</Badge>
                          </div>
                        </div>
                        <p className="text-sm">{insight.insight}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {analysisResult.riskFactors && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Risk Factors Identified</h4>
                    {analysisResult.riskFactors.map((risk, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{risk.factor}</span>
                          <Badge className={
                            risk.riskLevel === 'high' ? 'bg-red-500' :
                            risk.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }>
                            {risk.riskLevel} risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{risk.evidence}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                {analysisResult.recommendations && (
                  <div className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{rec.type}</Badge>
                          <Badge className={
                            rec.priority === 'high' ? 'bg-red-500' :
                            rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm">{rec.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}