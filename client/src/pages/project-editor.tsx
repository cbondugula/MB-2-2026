import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Eye,
  FileCode,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import type { Project } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ProjectEditor() {
  const [, params] = useRoute("/editor/:projectId");
  const projectId = params?.projectId;
  const { toast } = useToast();
  const [editedCode, setEditedCode] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string>("");

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });

  const codeFiles = (project?.code as Record<string, string>) || {};
  const fileNames = Object.keys(codeFiles);

  // Set initial active file when project loads
  if (fileNames.length > 0 && !activeFile) {
    setActiveFile(fileNames[0]);
  }

  // Initialize edited code from project
  if (project && Object.keys(editedCode).length === 0 && fileNames.length > 0) {
    setEditedCode(codeFiles);
  }

  const saveProjectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PATCH', `/api/projects/${projectId}`, {
        code: editedCode
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId] });
      toast({
        title: "Saved",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save changes",
        variant: "destructive",
      });
    }
  });

  const handleCodeChange = (fileName: string, newCode: string) => {
    setEditedCode(prev => ({
      ...prev,
      [fileName]: newCode
    }));
  };

  const handleSave = () => {
    saveProjectMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#76B900] animate-spin mx-auto" />
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Project Not Found</h2>
              <p className="text-gray-400">
                The project you're trying to edit doesn't exist or you don't have permission.
              </p>
            </div>
            <Button asChild variant="outline" className="bg-gray-700 border-gray-600 text-gray-200">
              <Link href="/my-apps">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Apps
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasUnsavedChanges = JSON.stringify(editedCode) !== JSON.stringify(codeFiles);

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
                <Link href={`/apps/${projectId}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Preview
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-white">{project.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-[#1a3d00] text-[#8CC63F] text-xs">
                    {project.framework}
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-900 text-blue-300 text-xs">
                    {project.backend}
                  </Badge>
                  {hasUnsavedChanges && (
                    <Badge variant="secondary" className="bg-yellow-900 text-yellow-300 text-xs">
                      Unsaved Changes
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="bg-gray-700 border-gray-600 text-gray-200"
                data-testid="preview-button"
              >
                <Link href={`/apps/${projectId}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || saveProjectMutation.isPending}
                size="sm"
                className="bg-[#76B900] hover:bg-[#5a8f00] text-white disabled:opacity-50"
                data-testid="save-button"
              >
                {saveProjectMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <FileCode className="w-5 h-5" />
                Code Editor
              </CardTitle>
              {project.isHipaaCompliant && (
                <Badge variant="secondary" className="bg-[#1a3d00] text-[#8CC63F]">
                  HIPAA Compliant
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeFile} onValueChange={setActiveFile} className="w-full">
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
                      {editedCode[fileName] !== codeFiles[fileName] && (
                        <Badge variant="secondary" className="bg-yellow-900 text-yellow-300 text-xs">
                          Modified
                        </Badge>
                      )}
                    </div>
                    <Textarea
                      value={editedCode[fileName] || ''}
                      onChange={(e) => handleCodeChange(fileName, e.target.value)}
                      className="min-h-[600px] bg-gray-950 text-gray-300 font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none"
                      placeholder="// Start coding..."
                      data-testid={`editor-${fileName}`}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Project Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-white">{project.framework}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Backend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-white">{project.backend}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Database</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-white">{project.database || 'None'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
