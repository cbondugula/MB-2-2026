import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Code, 
  Play, 
  Download, 
  Share2, 
  Settings, 
  FileCode,
  Calendar,
  Loader2,
  ExternalLink,
  Copy,
  CheckCircle,
  Eye
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import type { Project } from "@shared/schema";
import { CodePreview } from "@/components/CodePreview";

export default function AppPreview() {
  const [, params] = useRoute("/apps/:appId");
  const appId = params?.appId;
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects', appId],
    enabled: !!appId,
  });

  const app = project;
  
  // Extract code files - handle both wrapped and unwrapped formats
  const extractCodeFiles = (): Record<string, string> => {
    if (!app?.code) return {};
    const code = app.code as any;
    // If code has a 'files' property, extract it
    if (typeof code === 'object' && code.files && typeof code.files === 'object') {
      return code.files;
    }
    // Otherwise treat code directly as files object
    if (typeof code === 'object' && !code.files) {
      return code;
    }
    return {};
  };
  const codeFiles = extractCodeFiles();

  const copyToClipboard = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#76B900] animate-spin mx-auto" />
          <p className="text-gray-400">Loading your app...</p>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <Code className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">App Not Found</h2>
              <p className="text-gray-400">
                The app you're looking for doesn't exist or you don't have permission to view it.
              </p>
            </div>
            <Button asChild variant="outline" className="bg-gray-700 border-gray-600 text-gray-200">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fileNames = Object.keys(codeFiles);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-white">{app.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-[#1a3d00] text-[#8CC63F] text-xs">
                    {app.framework}
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-900 text-blue-300 text-xs">
                    {app.projectType}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-700 border-gray-600 text-gray-200"
                data-testid="download-app-button"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-700 border-gray-600 text-gray-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                className="bg-[#76B900] hover:bg-[#5a8f00] text-white"
                data-testid="deploy-app-button"
              >
                <Play className="w-4 h-4 mr-2" />
                Deploy
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Live Preview Section */}
        <div className="mb-6">
          <CodePreview code={codeFiles} framework={app.framework} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - App Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* App Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">App Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Description</p>
                  <p className="text-sm text-gray-200">{app.description || "No description"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Created</p>
                  <p className="text-sm text-gray-200 flex items-center">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {app.techStack && typeof app.techStack === 'object' && (
                      <>
                        <Badge variant="outline" className="border-[#5a8f00] text-[#8CC63F] text-xs">
                          {(app.techStack as any).frontend || app.framework}
                        </Badge>
                        <Badge variant="outline" className="border-blue-700 text-blue-400 text-xs">
                          {(app.techStack as any).backend || app.backend}
                        </Badge>
                        <Badge variant="outline" className="border-purple-700 text-purple-400 text-xs">
                          {(app.techStack as any).database || app.database}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Files</p>
                  <p className="text-2xl font-bold text-white">{fileNames.length}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">HIPAA Compliant</p>
                  <Badge variant="secondary" className="bg-[#1a3d00] text-[#8CC63F] text-xs">
                    {app.isHipaaCompliant ? "✓ Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Model Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Generation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">AI Model</p>
                  <p className="text-sm text-gray-200">GPT-4</p>
                </div>
                
                {app.settings && typeof app.settings === 'object' && (app.settings as any).complianceScore !== undefined && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">HIPAA Compliance Score</p>
                    <p className="text-2xl font-bold text-[#8CC63F]">{(app.settings as any).complianceScore}%</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Code Viewer */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <FileCode className="w-5 h-5" />
                    Source Code
                  </CardTitle>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 text-gray-200"
                  >
                    <Link href={`/apps/${appId}/code`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Full Screen
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={fileNames[0]} className="w-full">
                  <div className="bg-gray-900 rounded-t-lg border border-gray-700 p-2">
                    <ScrollArea className="w-full">
                      <TabsList className="bg-transparent gap-1">
                        {fileNames.map((fileName) => (
                          <TabsTrigger
                            key={fileName}
                            value={fileName}
                            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs px-3 py-1.5"
                          >
                            {fileName}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </ScrollArea>
                  </div>
                  
                  {fileNames.map((fileName) => (
                    <TabsContent key={fileName} value={fileName} className="mt-0">
                      <div className="bg-gray-950 rounded-b-lg border border-t-0 border-gray-700">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
                          <span className="text-xs text-gray-400 font-mono">{fileName}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => copyToClipboard(codeFiles[fileName], fileName)}
                          >
                            {copiedFile === fileName ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1.5 text-[#8CC63F]" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1.5" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <ScrollArea className="h-[600px]">
                          <pre className="p-4 text-xs text-gray-300 font-mono">
                            {codeFiles[fileName]}
                          </pre>
                        </ScrollArea>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
