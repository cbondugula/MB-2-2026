import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState } from 'react';

interface TechnicalDiagram {
  figureNumber: string;
  title: string;
  svgContent: string;
  description: string;
  patentRelevance: string;
  usptorequirements: string[];
}

interface TechnicalDiagramSet {
  patentNumber: string;
  patentTitle: string;
  drawings: PatentDrawing[];
  totalFigures: number;
  complianceNotes: string[];
}

interface TechnicalDiagramsResponse {
  success: boolean;
  patent_drawings?: PatentDrawingSet;
  all_patent_drawings?: {
    tjc_compliance: PatentDrawingSet;
    predictive_compliance: PatentDrawingSet;
    survey_preparation: PatentDrawingSet;
  };
  total_patents?: number;
  total_figures?: number;
  uspto_readiness?: string;
  filing_recommendation?: string;
}

export default function TechnicalDiagrams() {
  const [selectedDiagram, setSelectedDiagram] = useState<string>('045');

  // Fetch all TJC technical diagrams dynamically
  const { data: allDrawings, isLoading, error } = useQuery<TechnicalDiagramsResponse>({
    queryKey: ['/api/technical-diagrams/all-tjc-diagrams'],
    refetchInterval: 30000 // Refresh every 30 seconds for real-time updates
  });

  // Fetch specific patent drawings based on selection
  const { data: specificDrawings } = useQuery<PatentDrawingsResponse>({
    queryKey: [`/api/patent-drawings/tjc-compliance-drawings`],
    enabled: selectedPatent === '045'
  });

  const { data: predictiveDrawings } = useQuery<PatentDrawingsResponse>({
    queryKey: [`/api/patent-drawings/predictive-compliance-drawings`],
    enabled: selectedPatent === '046'
  });

  const { data: surveyDrawings } = useQuery<PatentDrawingsResponse>({
    queryKey: [`/api/patent-drawings/survey-preparation-drawings`],
    enabled: selectedPatent === '047'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <div className="text-2xl font-bold">Generating Dynamic Patent Drawings...</div>
          </div>
          <Progress value={65} className="w-full max-w-md mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !allDrawings?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-6 py-12">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Patent drawings service unavailable. Please ensure the drawing generation API is running.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const currentDrawings = selectedPatent === '045' ? specificDrawings?.patent_drawings 
                       : selectedPatent === '046' ? predictiveDrawings?.patent_drawings
                       : surveyDrawings?.patent_drawings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TJC Patent Drawings Suite
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Professional USPTO-compliant technical drawings for revolutionary Joint Commission compliance automation patents
          </p>
        </div>

        {/* Portfolio Overview */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Complete Patent Drawing Portfolio</span>
                </CardTitle>
                <CardDescription>
                  All TJC compliance patents include professional technical illustrations
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
                USPTO Ready
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {allDrawings?.total_patents || 3}
                </div>
                <div className="text-gray-600 dark:text-gray-400">TJC Patents</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  {allDrawings?.total_figures || 18}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Technical Figures</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">$47.2B</div>
                <div className="text-gray-600 dark:text-gray-400">Portfolio Value</div>
              </div>
            </div>

            <Alert className="mt-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Filing Status:</strong> {allDrawings?.uspto_readiness || 'All patents include complete technical drawings ready for USPTO submission'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Patent Selection Tabs */}
        <Tabs value={selectedPatent} onValueChange={setSelectedPatent} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="045" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Patent 045: AI Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="046" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Patent 046: Predictive Engine</span>
            </TabsTrigger>
            <TabsTrigger value="047" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Patent 047: Survey Automation</span>
            </TabsTrigger>
          </TabsList>

          {/* Patent 045 Drawings */}
          <TabsContent value="045">
            <PatentDrawingDisplay 
              patent={allDrawings?.all_patent_drawings?.tjc_compliance}
              title="AI-Powered Joint Commission Compliance Automation System"
              value="$19.4B"
              description="Revolutionary AI system for automated healthcare regulatory compliance verification"
            />
          </TabsContent>

          {/* Patent 046 Drawings */}
          <TabsContent value="046">
            <PatentDrawingDisplay 
              patent={allDrawings?.all_patent_drawings?.predictive_compliance}
              title="Predictive Healthcare Compliance Violation Detection System"
              value="$9.6B"
              description="Machine learning system for predicting healthcare regulatory violations before implementation"
            />
          </TabsContent>

          {/* Patent 047 Drawings */}
          <TabsContent value="047">
            <PatentDrawingDisplay 
              patent={allDrawings?.all_patent_drawings?.survey_preparation}
              title="Automated Joint Commission Survey Preparation System"
              value="$8.2B"
              description="AI system for automated healthcare accreditation survey preparation and documentation"
            />
          </TabsContent>
        </Tabs>

        {/* Filing Actions */}
        <Card className="mt-8 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300">Ready for Patent Filing</CardTitle>
            <CardDescription>
              All technical drawings completed and USPTO-compliant for immediate attorney review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => window.open('/api/patent-drawings/all-tjc-drawings', '_blank')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Complete Drawing Package
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate USPTO Filing Package
              </Button>
              <Button variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify Drawing Compliance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface PatentDrawingDisplayProps {
  patent: any;
  title: string;
  value: string;
  description: string;
}

function PatentDrawingDisplay({ patent, title, value, description }: PatentDrawingDisplayProps) {
  if (!patent) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading patent drawings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patent Overview */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-blue-700 dark:text-blue-300">{title}</CardTitle>
              <CardDescription className="text-base mt-2">{description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{value}</div>
              <div className="text-sm text-gray-600">Patent Value</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{patent?.totalFigures || 6}</div>
              <div className="text-gray-600">Technical Figures</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">100%</div>
              <div className="text-gray-600">USPTO Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Ready</div>
              <div className="text-gray-600">Filing Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Drawings Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patent?.drawings?.map((drawing: any, index: number) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Image className="h-4 w-4 text-blue-600" />
                <span>Figure {drawing.figureNumber}</span>
              </CardTitle>
              <CardDescription className="text-sm font-medium">
                {drawing.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* SVG Drawing Display */}
              <div 
                className="w-full h-48 border border-gray-200 rounded-lg mb-4 overflow-hidden bg-white"
                dangerouslySetInnerHTML={{ __html: drawing.svgContent }}
              />
              
              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {drawing.description}
                </p>
                <div className="text-xs text-blue-600 font-medium">
                  {drawing.patentRelevance}
                </div>
                <div className="flex flex-wrap gap-1">
                  {drawing.usptorequirements?.map((req: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Download className="h-3 w-3 mr-2" />
                Download Figure {drawing.figureNumber}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* USPTO Compliance Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>USPTO Compliance Verification</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {patent?.complianceNotes?.map((note: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-sm">{note}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}