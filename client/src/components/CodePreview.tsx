import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Code, FileCode, Copy, CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface CodePreviewProps {
  code: Record<string, string>;
  framework?: string;
  className?: string;
  projectId?: string | number;
}

export function CodePreview({ code, framework = "react", className = "", projectId }: CodePreviewProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  
  const hasCode = Object.keys(code).length > 0;
  const fileNames = Object.keys(code);
  
  // Set initial active tab
  if (!activeTab && fileNames.length > 0) {
    const mainFile = fileNames.find(f => f.includes('App.')) || fileNames[0];
    setTimeout(() => setActiveTab(mainFile), 0);
  }
  
  const copyToClipboard = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const getFileExtension = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext || 'txt';
  };

  const getLanguageClass = (fileName: string) => {
    const ext = getFileExtension(fileName);
    const langMap: Record<string, string> = {
      tsx: 'TypeScript React',
      ts: 'TypeScript',
      jsx: 'JavaScript React',
      js: 'JavaScript',
      css: 'CSS',
      html: 'HTML',
      json: 'JSON',
    };
    return langMap[ext] || ext.toUpperCase();
  };
  
  if (!hasCode) {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardContent className="py-12 text-center">
          <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No code files to preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#8CC63F]" />
              Source Code
            </CardTitle>
            <Badge variant="outline" className="bg-[#1a3d00] text-[#8CC63F] border-[#5a8f00] text-xs">
              {framework}
            </Badge>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
              {fileNames.length} file{fileNames.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          {projectId && (
            <Button
              asChild
              size="sm"
              className="bg-[#76B900] hover:bg-[#8CC63F] text-white"
            >
              <Link href={`/workspace/${projectId}`}>
                <Play className="w-4 h-4 mr-2" />
                Open Workspace
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-900 border-b border-gray-700 w-full justify-start rounded-none h-auto flex-wrap">
            {fileNames.map((fileName) => (
              <TabsTrigger
                key={fileName}
                value={fileName}
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-[#8CC63F] text-gray-400 rounded-none border-b-2 border-transparent data-[state=active]:border-[#76B900] px-4 py-2"
              >
                {fileName}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {fileNames.map((fileName) => (
            <TabsContent key={fileName} value={fileName} className="mt-0">
              <div className="relative">
                <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                    {getLanguageClass(fileName)}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(code[fileName], fileName)}
                    className="h-7 px-2 text-gray-400 hover:text-white"
                  >
                    {copiedFile === fileName ? (
                      <CheckCircle className="w-4 h-4 text-[#76B900]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <ScrollArea className="h-[400px] w-full rounded-b-lg bg-gray-950 border border-gray-700">
                  <pre className="p-4 text-sm font-mono text-gray-300 whitespace-pre-wrap">
                    <code>{code[fileName]}</code>
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              <span className="text-[#76B900] font-medium">Tip:</span> Click "Open Workspace" to edit code and see a live preview
            </div>
            {projectId && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
              >
                <Link href={`/workspace/${projectId}`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Full Editor
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
