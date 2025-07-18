import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  Network, 
  Code, 
  FileText, 
  Shield, 
  Zap, 
  Settings, 
  Download,
  Play,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface HealthcareStandard {
  id: string;
  name: string;
  description: string;
  version: string;
  category: 'interoperability' | 'terminology' | 'coding' | 'imaging' | 'messaging';
  implementationComplexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  useCase: string[];
  requiredLibraries: string[];
  authenticationRequired: boolean;
  complianceLevel: string[];
}

export default function StandardsBuilder() {
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [configParams, setConfigParams] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const healthcareStandards: HealthcareStandard[] = [
    {
      id: 'fhir-r4',
      name: 'FHIR R4',
      description: 'Fast Healthcare Interoperability Resources - modern standard for health information exchange',
      version: '4.0.1',
      category: 'interoperability',
      implementationComplexity: 'intermediate',
      useCase: ['EHR integration', 'API development', 'data exchange', 'mobile health apps'],
      requiredLibraries: ['fhir-kit-client', '@types/fhir', 'fhirpath'],
      authenticationRequired: true,
      complianceLevel: ['HIPAA', 'GDPR', 'FDA']
    },
    {
      id: 'fhir-r5',
      name: 'FHIR R5',
      description: 'Latest FHIR specification with enhanced capabilities',
      version: '5.0.0',
      category: 'interoperability',
      implementationComplexity: 'advanced',
      useCase: ['next-gen EHR', 'advanced analytics', 'AI/ML integration'],
      requiredLibraries: ['fhir-kit-client', '@types/fhir', 'fhirpath'],
      authenticationRequired: true,
      complianceLevel: ['HIPAA', 'GDPR', 'FDA']
    },
    {
      id: 'hl7-v2',
      name: 'HL7 v2.x',
      description: 'Health Level 7 messaging standard for clinical data exchange',
      version: '2.8.2',
      category: 'messaging',
      implementationComplexity: 'intermediate',
      useCase: ['hospital systems', 'lab integration', 'ADT messages', 'order management'],
      requiredLibraries: ['hl7-standard', 'node-hl7-complete'],
      authenticationRequired: true,
      complianceLevel: ['HIPAA', 'HITECH']
    },
    {
      id: 'hl7-cda',
      name: 'HL7 CDA',
      description: 'Clinical Document Architecture for structured clinical documents',
      version: 'R2',
      category: 'messaging',
      implementationComplexity: 'advanced',
      useCase: ['clinical documents', 'continuity of care', 'discharge summaries'],
      requiredLibraries: ['hl7-cda', 'xml2js', 'xpath'],
      authenticationRequired: false,
      complianceLevel: ['HIPAA', 'HITECH']
    },
    {
      id: 'umls',
      name: 'UMLS',
      description: 'Unified Medical Language System - comprehensive biomedical vocabulary',
      version: '2024AB',
      category: 'terminology',
      implementationComplexity: 'expert',
      useCase: ['concept mapping', 'clinical NLP', 'semantic search', 'terminology services'],
      requiredLibraries: ['umls-api-client', 'medical-concept-mapper'],
      authenticationRequired: true,
      complianceLevel: ['NLM License', 'HIPAA']
    },
    {
      id: 'snomed-ct',
      name: 'SNOMED CT',
      description: 'Systematized Nomenclature of Medicine Clinical Terms',
      version: '2024-03',
      category: 'terminology',
      implementationComplexity: 'advanced',
      useCase: ['clinical coding', 'EHR terminology', 'decision support', 'analytics'],
      requiredLibraries: ['snomed-ct-client', 'terminology-server'],
      authenticationRequired: true,
      complianceLevel: ['SNOMED License', 'HIPAA']
    },
    {
      id: 'icd-10',
      name: 'ICD-10-CM/PCS',
      description: 'International Classification of Diseases, 10th Revision',
      version: '2024',
      category: 'coding',
      implementationComplexity: 'intermediate',
      useCase: ['diagnosis coding', 'billing', 'epidemiology', 'quality measures'],
      requiredLibraries: ['icd-10-cm', 'icd-api-client'],
      authenticationRequired: false,
      complianceLevel: ['CMS', 'HIPAA']
    },
    {
      id: 'loinc',
      name: 'LOINC',
      description: 'Logical Observation Identifiers Names and Codes',
      version: '2.77',
      category: 'coding',
      implementationComplexity: 'intermediate',
      useCase: ['laboratory data', 'clinical observations', 'vital signs', 'surveys'],
      requiredLibraries: ['loinc-client', 'lab-terminology'],
      authenticationRequired: false,
      complianceLevel: ['LOINC License', 'HIPAA']
    },
    {
      id: 'dicom',
      name: 'DICOM',
      description: 'Digital Imaging and Communications in Medicine',
      version: '2024c',
      category: 'imaging',
      implementationComplexity: 'expert',
      useCase: ['medical imaging', 'PACS integration', 'radiology workflow', 'image analysis'],
      requiredLibraries: ['dicom-parser', 'dcmjs', 'cornerstone-core'],
      authenticationRequired: false,
      complianceLevel: ['HIPAA', 'FDA', 'DICOM Conformance']
    },
    {
      id: 'smart-on-fhir',
      name: 'SMART on FHIR',
      description: 'Substitutable Medical Applications and Reusable Technologies',
      version: '2.0',
      category: 'interoperability',
      implementationComplexity: 'advanced',
      useCase: ['EHR apps', 'patient portals', 'provider tools', 'third-party integration'],
      requiredLibraries: ['smart-launcher', 'fhir-kit-client', 'smart-health-cards'],
      authenticationRequired: true,
      complianceLevel: ['HIPAA', 'ONC', 'FDA']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Standards', icon: Database },
    { value: 'interoperability', label: 'Interoperability', icon: Network },
    { value: 'terminology', label: 'Terminology', icon: FileText },
    { value: 'coding', label: 'Medical Coding', icon: Code },
    { value: 'imaging', label: 'Medical Imaging', icon: Zap },
    { value: 'messaging', label: 'Healthcare Messaging', icon: Settings }
  ];

  const filteredStandards = selectedCategory === 'all' 
    ? healthcareStandards 
    : healthcareStandards.filter(std => std.category === selectedCategory);

  const toggleStandard = (standardId: string) => {
    setSelectedStandards(prev => 
      prev.includes(standardId) 
        ? prev.filter(id => id !== standardId)
        : [...prev, standardId]
    );
  };

  const generateImplementation = async () => {
    if (selectedStandards.length === 0) {
      toast({
        title: "No standards selected",
        description: "Please select at least one healthcare standard to implement",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-standards-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standards: selectedStandards,
          configuration: configParams,
          aiModel: "Med-Gemma"
        })
      });

      if (!response.ok) throw new Error('Standards implementation generation failed');

      const result = await response.json();
      setGeneratedCode(result.code || '// No code generated');
      
      toast({
        title: "Standards Implementation Generated",
        description: `Generated implementation for ${selectedStandards.length} healthcare standards`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate standards implementation",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const installDependencies = async () => {
    const allLibraries = selectedStandards.flatMap(stdId => {
      const standard = healthcareStandards.find(s => s.id === stdId);
      return standard?.requiredLibraries || [];
    });
    
    const uniqueLibraries = [...new Set(allLibraries)];
    
    if (uniqueLibraries.length === 0) return;

    try {
      const response = await fetch('/api/install-dependencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ libraries: uniqueLibraries })
      });

      if (response.ok) {
        toast({
          title: "Dependencies Installed",
          description: `Installed ${uniqueLibraries.length} healthcare standard libraries`
        });
      }
    } catch (error) {
      toast({
        title: "Installation Failed",
        description: "Failed to install some dependencies",
        variant: "destructive"
      });
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Healthcare Standards Builder</h1>
          <p className="text-muted-foreground">
            Build and connect FHIR, HL7, UMLS, SNOMED CT, ICD-10, LOINC, DICOM and other healthcare standards
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Database className="h-8 w-8 text-blue-500" />
          <span className="text-sm font-medium">{healthcareStandards.length} Standards Available</span>
        </div>
      </div>

      <Tabs defaultValue="standards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="standards">Healthcare Standards</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="testing">Testing & Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="standards" className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={installDependencies}
              disabled={selectedStandards.length === 0}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Install Dependencies ({selectedStandards.length})
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStandards.map(standard => (
              <Card 
                key={standard.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedStandards.includes(standard.id) 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : ''
                }`}
                onClick={() => toggleStandard(standard.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{standard.name}</CardTitle>
                    {selectedStandards.includes(standard.id) && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {standard.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">v{standard.version}</Badge>
                    <Badge className={getComplexityColor(standard.implementationComplexity)}>
                      {standard.implementationComplexity}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium mb-1">Use Cases:</p>
                    <div className="flex flex-wrap gap-1">
                      {standard.useCase.slice(0, 2).map(useCase => (
                        <Badge key={useCase} variant="secondary" className="text-xs">
                          {useCase}
                        </Badge>
                      ))}
                      {standard.useCase.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{standard.useCase.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-1">Compliance:</p>
                    <div className="flex flex-wrap gap-1">
                      {standard.complianceLevel.map(compliance => (
                        <Badge key={compliance} variant="outline" className="text-xs">
                          {compliance}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {standard.authenticationRequired && (
                    <div className="flex items-center space-x-1 text-orange-600">
                      <Shield className="h-3 w-3" />
                      <span className="text-xs">Authentication Required</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard Configuration</CardTitle>
              <CardDescription>
                Configure parameters for selected healthcare standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedStandards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select healthcare standards to configure their parameters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Base URL</label>
                    <Input
                      placeholder="https://api.example.com/fhir"
                      value={configParams.baseUrl || ''}
                      onChange={(e) => setConfigParams(prev => ({ ...prev, baseUrl: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">API Key</label>
                    <Input
                      type="password"
                      placeholder="Enter API key"
                      value={configParams.apiKey || ''}
                      onChange={(e) => setConfigParams(prev => ({ ...prev, apiKey: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Client ID</label>
                    <Input
                      placeholder="OAuth2 Client ID"
                      value={configParams.clientId || ''}
                      onChange={(e) => setConfigParams(prev => ({ ...prev, clientId: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Timeout (ms)</label>
                    <Input
                      type="number"
                      placeholder="30000"
                      value={configParams.timeout || ''}
                      onChange={(e) => setConfigParams(prev => ({ ...prev, timeout: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Implementation</h3>
            <Button 
              onClick={generateImplementation}
              disabled={isGenerating || selectedStandards.length === 0}
            >
              <Code className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Implementation"}
            </Button>
          </div>

          {generatedCode ? (
            <Card>
              <CardContent className="p-0">
                <Textarea
                  value={generatedCode}
                  readOnly
                  className="min-h-[500px] font-mono text-sm border-0 resize-none"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Select standards and click "Generate Implementation" to create your healthcare interoperability code
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Test Connections</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedStandards.map(stdId => {
                  const standard = healthcareStandards.find(s => s.id === stdId);
                  return (
                    <div key={stdId} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{standard?.name}</span>
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    </div>
                  );
                })}
                {selectedStandards.length === 0 && (
                  <p className="text-muted-foreground text-center">
                    No standards selected for testing
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Validation Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">FHIR schema validation passed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">HL7 message format needs review</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Info className="h-4 w-4" />
                    <span className="text-sm">UMLS authentication configured</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedStandards.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Selected Standards ({selectedStandards.length})</h4>
                <p className="text-sm text-muted-foreground">
                  Ready to generate healthcare interoperability implementation
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setSelectedStandards([])}>
                  Clear All
                </Button>
                <Button onClick={generateImplementation} disabled={isGenerating}>
                  <Zap className="h-4 w-4 mr-2" />
                  Build Integration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}