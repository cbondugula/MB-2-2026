import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Shield, 
  Bot, 
  Users, 
  Download, 
  Eye, 
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowLeft
} from "lucide-react";

interface LegalDocument {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
  generatedAt: string;
  status: 'current' | 'updating' | 'outdated';
}

export default function LegalDocuments() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId] = useState<string>('org_demo_123');

  const documentTypes = [
    {
      type: 'terms-of-service',
      title: 'Terms of Service',
      description: 'Comprehensive terms governing platform usage and service delivery',
      icon: <FileText className="w-5 h-5 text-emerald-400" />
    },
    {
      type: 'privacy-policy',
      title: 'Privacy Policy',
      description: 'Data protection and privacy compliance across global jurisdictions',
      icon: <Shield className="w-5 h-5 text-emerald-400" />
    },
    {
      type: 'ai-usage-policy',
      title: 'AI Usage Policy',
      description: 'AI system limitations, ethics, and clinical usage guidelines',
      icon: <Bot className="w-5 h-5 text-emerald-400" />
    },
    {
      type: 'business-associate-agreement',
      title: 'Business Associate Agreement',
      description: 'HIPAA-compliant BAA for protected health information handling',
      icon: <Users className="w-5 h-5 text-emerald-400" />
    }
  ];

  useEffect(() => {
    loadLegalDocuments();
  }, []);

  const loadLegalDocuments = async () => {
    setIsLoading(true);
    try {
      const loadedDocuments: LegalDocument[] = [];
      
      for (const docType of documentTypes) {
        try {
          const response = await apiRequest('GET', `/api/legal/${organizationId}/${docType.type}`);
          const result = await response.json();
          
          loadedDocuments.push({
            type: docType.type,
            title: docType.title,
            description: docType.description,
            icon: docType.icon,
            content: result.document,
            generatedAt: result.generatedAt,
            status: 'current'
          });
        } catch (error) {
          console.error(`Failed to load ${docType.type}:`, error);
          loadedDocuments.push({
            type: docType.type,
            title: docType.title,
            description: docType.description,
            icon: docType.icon,
            content: 'Document generation failed. Please contact support.',
            generatedAt: new Date().toISOString(),
            status: 'outdated'
          });
        }
      }
      
      setDocuments(loadedDocuments);
      if (loadedDocuments.length > 0) {
        setSelectedDocument(loadedDocuments[0]);
      }
    } catch (error) {
      console.error('Error loading legal documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDocument = async (documentType: string) => {
    try {
      const response = await apiRequest('GET', `/api/legal/${organizationId}/${documentType}`);
      const result = await response.json();
      
      setDocuments(prev => prev.map(doc => 
        doc.type === documentType 
          ? { ...doc, content: result.document, generatedAt: result.generatedAt, status: 'current' }
          : doc
      ));

      if (selectedDocument?.type === documentType) {
        setSelectedDocument(prev => prev ? { 
          ...prev, 
          content: result.document, 
          generatedAt: result.generatedAt,
          status: 'current'
        } : null);
      }
    } catch (error) {
      console.error(`Failed to refresh ${documentType}:`, error);
    }
  };

  const downloadDocument = (document: LegalDocument) => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'updating':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'outdated':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatGeneratedTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            <span className="ml-3 text-lg text-gray-400">Generating legal documents...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Legal Documents</h1>
          <p className="text-xl text-gray-400 mb-4">
            Dynamically generated legal documents tailored to your organization
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">AI-Generated</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="h-fit bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Legal Documents
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Select a document to view its content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.type}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedDocument?.type === doc.type
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                    data-testid={`document-${doc.type}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {doc.icon}
                        <h3 className="font-medium text-sm text-white">{doc.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            refreshDocument(doc.type);
                          }}
                          className="p-1 h-auto text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{doc.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                        {formatGeneratedTime(doc.generatedAt)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadDocument(doc);
                        }}
                        className="p-1 h-auto text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedDocument ? (
              <Card className="h-fit bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedDocument.icon}
                      <div>
                        <CardTitle className="text-white">{selectedDocument.title}</CardTitle>
                        <CardDescription className="text-gray-400">{selectedDocument.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refreshDocument(selectedDocument.type)}
                        className="flex items-center gap-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => downloadDocument(selectedDocument)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <Separator className="bg-gray-800" />
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Generated: {formatGeneratedTime(selectedDocument.generatedAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedDocument.status)}
                      Status: {selectedDocument.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] w-full border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                    <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-gray-300">
                      {selectedDocument.content}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-64 flex items-center justify-center bg-gray-900 border-gray-800">
                <div className="text-center text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a document to view its content</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <Card className="mt-8 border-orange-500/30 bg-orange-500/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-300 mb-2">Legal Disclaimer</h3>
                <p className="text-sm text-orange-200/80 leading-relaxed">
                  These documents are dynamically generated based on your organization's specific requirements and 
                  compliance needs. While comprehensive, they should be reviewed by qualified legal counsel before 
                  execution. MedBuilder provides these documents as a service convenience and does not provide legal advice. 
                  Your use of these documents is subject to your own legal review and approval process.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
