import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview,
  SandpackConsole,
  useSandpack
} from "@codesandbox/sandpack-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Eye,
  FileCode,
  Folder,
  FolderOpen,
  File,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Terminal,
  MessageSquare,
  Send,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  ChevronDown,
  X,
  Shield
} from "lucide-react";
import type { Project } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

function buildFileTree(files: Record<string, string>): FileNode[] {
  const root: FileNode[] = [];
  
  Object.keys(files).forEach(filePath => {
    const parts = filePath.split('/');
    let currentLevel = root;
    
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const existingNode = currentLevel.find(n => n.name === part);
      
      if (existingNode) {
        if (!isFile && existingNode.children) {
          currentLevel = existingNode.children;
        }
      } else {
        const newNode: FileNode = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : []
        };
        currentLevel.push(newNode);
        if (!isFile && newNode.children) {
          currentLevel = newNode.children;
        }
      }
    });
  });
  
  return root;
}

function FileTreeNode({ 
  node, 
  activeFile, 
  onSelectFile, 
  onDeleteFile,
  level = 0 
}: { 
  node: FileNode; 
  activeFile: string;
  onSelectFile: (path: string) => void;
  onDeleteFile: (path: string) => void;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(level < 2);
  const isActive = node.path === activeFile;
  
  if (node.type === 'folder') {
    return (
      <div>
        <div
          className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-700/50 rounded text-sm ${
            isActive ? 'bg-gray-700 text-white' : 'text-gray-400'
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
          {isOpen ? (
            <FolderOpen className="w-4 h-4 text-yellow-500" />
          ) : (
            <Folder className="w-4 h-4 text-yellow-500" />
          )}
          <span className="truncate">{node.name}</span>
        </div>
        {isOpen && node.children?.map((child) => (
          <FileTreeNode
            key={child.path}
            node={child}
            activeFile={activeFile}
            onSelectFile={onSelectFile}
            onDeleteFile={onDeleteFile}
            level={level + 1}
          />
        ))}
      </div>
    );
  }
  
  const getFileIcon = (name: string) => {
    if (name.endsWith('.tsx') || name.endsWith('.ts')) return '🔷';
    if (name.endsWith('.jsx') || name.endsWith('.js')) return '🟨';
    if (name.endsWith('.css')) return '🎨';
    if (name.endsWith('.json')) return '📋';
    if (name.endsWith('.html')) return '🌐';
    if (name.endsWith('.md')) return '📝';
    return '📄';
  };
  
  return (
    <div
      className={`group flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-gray-700/50 rounded text-sm ${
        isActive ? 'bg-emerald-900/50 text-emerald-300' : 'text-gray-400'
      }`}
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      onClick={() => onSelectFile(node.path)}
      data-testid={`file-${node.path}`}
    >
      <div className="flex items-center gap-2 truncate">
        <span>{getFileIcon(node.name)}</span>
        <span className="truncate">{node.name}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteFile(node.path);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-900/50 rounded"
      >
        <Trash2 className="w-3 h-3 text-red-400" />
      </button>
    </div>
  );
}

function AIAssistant({ 
  projectId, 
  onCodeGenerated 
}: { 
  projectId: string;
  onCodeGenerated: (files: Record<string, string>) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;
    
    const userMessage = prompt;
    setPrompt("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/ai/code-assist', {
        projectId,
        prompt: userMessage,
        type: 'code_generation'
      });
      
      const data = await response.json();
      
      if (data.code) {
        onCodeGenerated(data.code);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message || "I've updated the code based on your request. Check the editor to see the changes."
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message || "I've processed your request."
        }]);
      }
    } catch (error: any) {
      toast({
        title: "AI Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive"
      });
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I encountered an error. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      <div className="p-3 border-b border-gray-700 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-medium text-white">AI Assistant</span>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-emerald-500/50" />
              <p>Ask me to help with your code!</p>
              <p className="text-xs mt-1">e.g., "Add a patient form component"</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded text-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-900/30 text-emerald-200 ml-4' 
                  : 'bg-gray-800 text-gray-300 mr-4'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-gray-700">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to help..."
            className="bg-gray-800 border-gray-700 text-white text-sm"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            disabled={isLoading}
            data-testid="ai-prompt-input"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={isLoading || !prompt.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
            data-testid="ai-send-button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Workspace() {
  const [, params] = useRoute("/workspace/:projectId");
  const projectId = params?.projectId;
  const { toast } = useToast();
  
  const [activeFile, setActiveFile] = useState<string>("");
  const [editedFiles, setEditedFiles] = useState<Record<string, string>>({});
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAI, setShowAI] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showNewFileInput, setShowNewFileInput] = useState(false);

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });

  const codeFiles = (project?.code as Record<string, string>) || {};
  const fileNames = Object.keys(codeFiles);
  const fileTree = buildFileTree(editedFiles);

  useEffect(() => {
    if (project && Object.keys(editedFiles).length === 0 && fileNames.length > 0) {
      setEditedFiles(codeFiles);
      if (!activeFile) {
        const mainFile = fileNames.find(f => f.includes('App.') || f.includes('index.')) || fileNames[0];
        setActiveFile(mainFile);
      }
    }
  }, [project, codeFiles, fileNames, activeFile, editedFiles]);

  const saveProjectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PATCH', `/api/projects/${projectId}`, {
        code: editedFiles
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

  const handleFileChange = useCallback((path: string, content: string) => {
    setEditedFiles(prev => ({
      ...prev,
      [path]: content
    }));
  }, []);

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    const path = newFileName.startsWith('/') ? newFileName.slice(1) : newFileName;
    if (editedFiles[path]) {
      toast({
        title: "File exists",
        description: "A file with this name already exists.",
        variant: "destructive"
      });
      return;
    }
    setEditedFiles(prev => ({
      ...prev,
      [path]: `// ${path}\n`
    }));
    setActiveFile(path);
    setNewFileName("");
    setShowNewFileInput(false);
  };

  const handleDeleteFile = (path: string) => {
    const newFiles = { ...editedFiles };
    delete newFiles[path];
    setEditedFiles(newFiles);
    if (activeFile === path) {
      const remaining = Object.keys(newFiles);
      setActiveFile(remaining[0] || "");
    }
  };

  const handleAICodeGenerated = (newCode: Record<string, string>) => {
    setEditedFiles(prev => ({
      ...prev,
      ...newCode
    }));
    const firstNewFile = Object.keys(newCode)[0];
    if (firstNewFile) {
      setActiveFile(firstNewFile);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
          <p className="text-gray-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-4">
            The project you're trying to access doesn't exist or you don't have permission.
          </p>
          <Button asChild variant="outline" className="bg-gray-800 border-gray-700 text-gray-200">
            <Link href="/my-apps">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Apps
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const hasUnsavedChanges = JSON.stringify(editedFiles) !== JSON.stringify(codeFiles);

  const sandpackFiles: Record<string, string> = {};
  Object.entries(editedFiles).forEach(([path, content]) => {
    sandpackFiles[`/${path}`] = content;
  });

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            data-testid="back-button"
          >
            <Link href="/my-apps">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-white">{project.name}</h1>
            {project.isHipaaCompliant && (
              <Badge className="bg-emerald-900/50 text-emerald-300 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA
              </Badge>
            )}
            {hasUnsavedChanges && (
              <Badge className="bg-yellow-900/50 text-yellow-300 text-xs">Unsaved</Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-gray-400"
          >
            {showSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConsole(!showConsole)}
            className={`text-gray-400 ${showConsole ? 'bg-gray-800' : ''}`}
          >
            <Terminal className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAI(!showAI)}
            className={`text-gray-400 ${showAI ? 'bg-gray-800' : ''}`}
          >
            <Sparkles className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => saveProjectMutation.mutate()}
            disabled={!hasUnsavedChanges || saveProjectMutation.isPending}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
            data-testid="save-button"
          >
            {saveProjectMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
            <div className="p-2 border-b border-gray-800 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400 uppercase">Files</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewFileInput(true)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                data-testid="add-file-button"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {showNewFileInput && (
              <div className="p-2 border-b border-gray-800">
                <div className="flex gap-1">
                  <Input
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="filename.tsx"
                    className="h-7 text-xs bg-gray-800 border-gray-700"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFile();
                      if (e.key === 'Escape') {
                        setShowNewFileInput(false);
                        setNewFileName("");
                      }
                    }}
                    autoFocus
                    data-testid="new-file-input"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddFile}
                    className="h-7 px-2 bg-emerald-600"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
            
            <ScrollArea className="flex-1">
              <div className="py-1">
                {fileTree.map((node) => (
                  <FileTreeNode
                    key={node.path}
                    node={node}
                    activeFile={activeFile}
                    onSelectFile={setActiveFile}
                    onDeleteFile={handleDeleteFile}
                  />
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-2 border-t border-gray-800 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="bg-blue-900/50 text-blue-300 text-xs">
                  {project.framework}
                </Badge>
                <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 text-xs">
                  {project.backend}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {Object.keys(editedFiles).length > 0 ? (
            <SandpackProvider
              template="react-ts"
              files={sandpackFiles}
              theme="dark"
              options={{
                activeFile: `/${activeFile}`,
                visibleFiles: Object.keys(sandpackFiles),
                recompileMode: "delayed",
                recompileDelay: 500,
              }}
            >
              <SandpackLayout style={{ height: '100%', border: 'none' }}>
                <div className="flex-1 flex">
                  <div className={`${showAI ? 'w-1/2' : 'w-2/3'} border-r border-gray-800`}>
                    <SandpackCodeEditor
                      showTabs
                      showLineNumbers
                      showInlineErrors
                      wrapContent
                      closableTabs
                      style={{ height: showConsole ? 'calc(100% - 200px)' : '100%' }}
                    />
                    {showConsole && (
                      <div className="h-[200px] border-t border-gray-800">
                        <SandpackConsole />
                      </div>
                    )}
                  </div>
                  <div className={`${showAI ? 'w-1/2' : 'w-1/3'} flex`}>
                    <div className={showAI ? 'w-1/2' : 'w-full'}>
                      <SandpackPreview
                        showNavigator
                        showRefreshButton
                        style={{ height: '100%' }}
                      />
                    </div>
                    {showAI && (
                      <div className="w-1/2">
                        <AIAssistant
                          projectId={projectId || ''}
                          onCodeGenerated={handleAICodeGenerated}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </SandpackLayout>
            </SandpackProvider>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center space-y-4">
                <FileCode className="w-16 h-16 text-gray-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-gray-300">No files yet</h3>
                  <p className="text-gray-500 text-sm">
                    Click the + button to add your first file
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
