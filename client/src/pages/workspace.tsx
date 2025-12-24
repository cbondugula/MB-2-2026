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
  Shield,
  Rocket,
  ExternalLink,
  Copy,
  CheckCircle2,
  Globe,
  Clock,
  History,
  Users,
  GitBranch,
  RotateCcw,
  ListChecks,
  PlayCircle,
  XCircle,
  User,
  Link2,
  Package,
  GitCommit,
  GitMerge,
  GitPullRequest,
  RefreshCw,
  Search,
  Download,
  Upload,
  AlertTriangle,
  Check,
  Github
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
        isActive ? 'bg-[#1a3d00]/50 text-[#8CC63F]' : 'text-gray-400'
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

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  codeChanges?: Array<{ filePath: string; content: string }>;
  applied?: boolean;
}

function AIAssistant({ 
  projectId, 
  activeFile,
  onCodeGenerated,
  onSave
}: { 
  projectId: string;
  activeFile?: string;
  onCodeGenerated: (files: Record<string, string>) => void;
  onSave: () => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const sendToAI = async (messageToSend: string, shouldApply: boolean = false) => {
    console.log('[AI] sendToAI called with:', messageToSend, 'apply:', shouldApply);
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', `/api/projects/${projectId}/ai-assist`, {
        prompt: messageToSend,
        currentFile: activeFile,
        action: shouldApply ? 'apply' : 'preview'
      });
      
      const data = await response.json();
      console.log('[AI] Got response:', data);
      
      if (data.success) {
        // If AI generated code changes, update the editor
        if (data.codeChanges && data.codeChanges.length > 0) {
          const newFiles: Record<string, string> = {};
          data.codeChanges.forEach((change: { filePath: string; content: string }) => {
            newFiles[change.filePath] = change.content;
          });
          onCodeGenerated(newFiles);
          
          if (data.applied) {
            toast({
              title: "Changes Applied & Saved",
              description: `Applied and saved ${data.codeChanges.length} file(s) to your project.`,
            });
            queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId] });
          } else {
            toast({
              title: "Preview Ready",
              description: `Previewing ${data.codeChanges.length} file change(s). Click 'Apply' to save.`,
            });
          }
        }
        
        if (shouldApply) {
          // Update the last message to mark as applied
          setMessages(prev => prev.map((msg, idx) => 
            idx === prev.length - 1 && msg.role === 'assistant'
              ? { ...msg, applied: true }
              : msg
          ));
        } else {
          // Add assistant response
          setMessages(prev => {
            console.log('[AI] Adding assistant message, prev length:', prev.length);
            return [...prev, { 
              role: 'assistant' as const, 
              content: data.response || "I've analyzed your request.",
              suggestions: data.suggestions,
              codeChanges: data.codeChanges,
              applied: data.applied
            }];
          });
        }
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant' as const, 
          content: data.message || data.response || "I've processed your request."
        }]);
      }
    } catch (error: any) {
      console.error('[AI] Error:', error);
      toast({
        title: "AI Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive"
      });
      setMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: "Sorry, I encountered an error. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = () => {
    const currentPrompt = prompt.trim();
    if (!currentPrompt) {
      console.log('[AI] Empty prompt, returning');
      return;
    }
    
    console.log('[AI] Sending message:', currentPrompt);
    
    // Clear input and add user message FIRST
    setPrompt("");
    setMessages(prev => {
      console.log('[AI] Adding user message, prev length:', prev.length);
      return [...prev, { role: 'user' as const, content: currentPrompt }];
    });
    setPendingPrompt(currentPrompt);
    
    // Send to AI after state update
    sendToAI(currentPrompt, false);
  };
  
  const handleApplyChanges = () => {
    if (!pendingPrompt) {
      toast({
        title: "Cannot Apply",
        description: "No pending changes to apply.",
        variant: "destructive"
      });
      return;
    }
    sendToAI(pendingPrompt, true);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      <div className="p-3 border-b border-gray-700 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#76B900]" />
        <span className="text-sm font-medium text-white">AI Assistant</span>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#76B900]/50" />
              <p>Ask me to help with your code!</p>
              <p className="text-xs mt-1">e.g., "Add a patient form component"</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded text-sm ${
                msg.role === 'user' 
                  ? 'bg-[#1a3d00]/30 text-[#8CC63F] ml-4' 
                  : 'bg-gray-800 text-gray-300 mr-4'
              }`}
            >
              {msg.content}
              {msg.codeChanges && msg.codeChanges.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-[#76B900]">
                      {msg.applied ? '✓ Applied' : `${msg.codeChanges.length} file(s) ready`}
                    </p>
                    {!msg.applied && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleApplyChanges}
                        className="h-6 text-xs bg-[#76B900] hover:bg-[#76B900] text-white"
                        disabled={isLoading}
                      >
                        Apply & Save
                      </Button>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {msg.codeChanges.map(c => c.filePath).join(', ')}
                  </div>
                </div>
              )}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Suggestions:</p>
                  <div className="flex flex-wrap gap-1">
                    {msg.suggestions.map((s, j) => (
                      <button
                        key={j}
                        onClick={() => setPrompt(s)}
                        className="text-xs px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
            className="bg-[#76B900] hover:bg-[#76B900]"
            data-testid="ai-send-button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DeploymentResult {
  id: string;
  deploymentUrl: string;
  subdomain: string;
  status: string;
  environment: string;
  region?: string;
  hipaaEnabled?: boolean;
  sslEnabled?: boolean;
  deployedAt?: string;
}

interface DeploymentRecord {
  id: string;
  url: string;
  status: string;
  environment: string;
  lastDeployment: string | null;
  region?: string;
  health?: string;
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
  const [showTerminal, setShowTerminal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showCollabPanel, setShowCollabPanel] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [deployTab, setDeployTab] = useState<'deploy' | 'history'>('deploy');
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<Array<{command: string; output: string; timestamp: string}>>([]);
  const [aiPlanMode, setAiPlanMode] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [showGitPanel, setShowGitPanel] = useState(false);
  const [showPackagesPanel, setShowPackagesPanel] = useState(false);
  const [packageSearch, setPackageSearch] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });

  const { data: deploymentHistory, refetch: refetchHistory } = useQuery<DeploymentRecord[]>({
    queryKey: ['/api/projects', projectId, 'deployments'],
    enabled: !!projectId && showDeployModal,
  });

  // Version history query
  const { data: versionHistory, refetch: refetchVersions } = useQuery<{versions: any[]}>({
    queryKey: ['/api/projects', projectId, 'versions'],
    enabled: !!projectId && showVersionHistory,
  });

  // Collaborators query
  const { data: collaborators } = useQuery<{collaborators: any[], count: number}>({
    queryKey: ['/api/projects', projectId, 'collaborators'],
    enabled: !!projectId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // AI Plans query
  const { data: aiPlans, refetch: refetchPlans } = useQuery<{plans: any[]}>({
    queryKey: ['/api/projects', projectId, 'ai-plans'],
    enabled: !!projectId && aiPlanMode,
  });

  // Git integration query
  const { data: gitData, refetch: refetchGit } = useQuery<{integration: any, branches: any[]}>({
    queryKey: ['/api/projects', projectId, 'git'],
    enabled: !!projectId && showGitPanel,
  });

  // Git branches query
  const { data: gitBranches, refetch: refetchBranches } = useQuery<{branches: any[]}>({
    queryKey: ['/api/projects', projectId, 'git', 'branches'],
    enabled: !!projectId && showGitPanel && !!gitData?.integration,
  });

  // Git sync history query
  const { data: syncHistory } = useQuery<{history: any[]}>({
    queryKey: ['/api/projects', projectId, 'git', 'sync-history'],
    enabled: !!projectId && showGitPanel && !!gitData?.integration,
  });

  // Packages query
  const { data: packagesData, refetch: refetchPackages } = useQuery<{packages: any[]}>({
    queryKey: ['/api/projects', projectId, 'packages'],
    enabled: !!projectId && showPackagesPanel,
  });

  const extractCodeFiles = (): Record<string, string> => {
    if (!project?.code) return {};
    const code = project.code as any;
    if (typeof code === 'object' && code.files && typeof code.files === 'object') {
      return code.files;
    }
    if (typeof code === 'object' && !code.files) {
      return code;
    }
    return {};
  };
  const codeFiles = extractCodeFiles();
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

  const deployMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/deploy`, {
        environment: 'production',
        enableHIPAA: true,
        enableSSL: true
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setDeploymentResult(data);
      refetchHistory();
      toast({
        title: "Deployed Successfully!",
        description: "Your app is now live and ready to share.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy project",
        variant: "destructive",
      });
    }
  });

  // Terminal command mutation
  const terminalMutation = useMutation({
    mutationFn: async (command: string) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/terminal`, { command });
      return await response.json();
    },
    onSuccess: (data) => {
      setTerminalOutput(prev => [...prev, {
        command: terminalInput,
        output: data.output,
        timestamp: data.timestamp
      }]);
      setTerminalInput("");
    },
    onError: (error: any) => {
      setTerminalOutput(prev => [...prev, {
        command: terminalInput,
        output: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    }
  });

  // Version restore mutation
  const restoreVersionMutation = useMutation({
    mutationFn: async (versionId: number) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/versions/${versionId}/restore`);
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId] });
      refetchVersions();
      toast({
        title: "Version Restored",
        description: `File ${data.restoredFile} has been restored.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Restore Failed",
        description: error.message || "Failed to restore version",
        variant: "destructive",
      });
    }
  });

  // AI Plan mutation
  const createPlanMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/ai-plan`, { prompt });
      return await response.json();
    },
    onSuccess: (data) => {
      setCurrentPlan(data.plan);
      refetchPlans();
      toast({
        title: "Plan Created",
        description: "Review the plan and approve to execute.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Plan Failed",
        description: error.message || "Failed to create AI plan",
        variant: "destructive",
      });
    }
  });

  // Execute AI Plan mutation
  const executePlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/ai-plans/${planId}/execute`);
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId] });
      setCurrentPlan(null);
      refetchPlans();
      toast({
        title: "Plan Executed",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Execution Failed",
        description: error.message || "Failed to execute plan",
        variant: "destructive",
      });
    }
  });

  // Generate invite link mutation
  const inviteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/collaboration/invite`);
      return await response.json();
    },
    onSuccess: (data) => {
      navigator.clipboard.writeText(window.location.origin + data.inviteLink);
      toast({
        title: "Invite Link Copied",
        description: "Share this link with collaborators.",
      });
    }
  });

  // Git connect mutation
  const connectGitMutation = useMutation({
    mutationFn: async (repoUrl: string) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/git`, { repoUrl });
      return await response.json();
    },
    onSuccess: () => {
      refetchGit();
      setRepoUrl("");
      toast({
        title: "Repository Connected",
        description: "Your Git repository has been connected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect repository",
        variant: "destructive",
      });
    }
  });

  // Git sync mutation
  const gitSyncMutation = useMutation({
    mutationFn: async (direction: 'push' | 'pull') => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/git/sync`, { direction });
      return await response.json();
    },
    onSuccess: (data) => {
      refetchGit();
      refetchBranches();
      toast({
        title: "Sync Complete",
        description: data.message || "Repository synced successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync repository",
        variant: "destructive",
      });
    }
  });

  // Package scan mutation
  const packageScanMutation = useMutation({
    mutationFn: async () => {
      const packageJson = project?.dependencies || {};
      const response = await apiRequest('POST', `/api/projects/${projectId}/packages/scan`, { packageJson });
      return await response.json();
    },
    onSuccess: () => {
      refetchPackages();
      toast({
        title: "Scan Complete",
        description: "Package vulnerabilities have been scanned.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scan Failed",
        description: error.message || "Failed to scan packages",
        variant: "destructive",
      });
    }
  });

  // Install package mutation
  const installPackageMutation = useMutation({
    mutationFn: async (packageName: string) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/packages/install`, { packageName });
      return await response.json();
    },
    onSuccess: (data) => {
      refetchPackages();
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId] });
      toast({
        title: "Package Installed",
        description: `${data.packageName} has been installed.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Installation Failed",
        description: error.message || "Failed to install package",
        variant: "destructive",
      });
    }
  });

  // Uninstall package mutation
  const uninstallPackageMutation = useMutation({
    mutationFn: async (packageName: string) => {
      const response = await apiRequest('DELETE', `/api/projects/${projectId}/packages/${encodeURIComponent(packageName)}`);
      return await response.json();
    },
    onSuccess: (data) => {
      refetchPackages();
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId] });
      toast({
        title: "Package Removed",
        description: `${data.packageName} has been uninstalled.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Uninstall Failed",
        description: error.message || "Failed to uninstall package",
        variant: "destructive",
      });
    }
  });

  const handleDeploy = async () => {
    if (hasUnsavedChanges) {
      await saveProjectMutation.mutateAsync();
    }
    setShowDeployModal(true);
    deployMutation.mutate();
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      terminalMutation.mutate(terminalInput.trim());
    }
  };

  const copyDeploymentUrl = () => {
    if (deploymentResult?.deploymentUrl) {
      navigator.clipboard.writeText(deploymentResult.deploymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Deployment URL copied to clipboard.",
      });
    }
  };

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
          <Loader2 className="w-12 h-12 text-[#76B900] animate-spin mx-auto" />
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
              <Badge className="bg-[#1a3d00]/50 text-[#8CC63F] text-xs">
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
          {/* Collaborators indicator */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCollabPanel(!showCollabPanel)}
            className={`text-gray-400 ${showCollabPanel ? 'bg-gray-800' : ''}`}
            title="Collaborators"
            data-testid="collab-button"
          >
            <Users className="w-4 h-4" />
            {collaborators && collaborators.count > 0 && (
              <span className="ml-1 text-xs bg-[#76B900] text-white px-1 rounded-full">{collaborators.count}</span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVersionHistory(!showVersionHistory)}
            className={`text-gray-400 ${showVersionHistory ? 'bg-gray-800' : ''}`}
            title="Version History"
            data-testid="history-button"
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGitPanel(!showGitPanel)}
            className={`text-gray-400 ${showGitPanel ? 'bg-orange-800 text-orange-300' : ''}`}
            title="Git Workflow"
            data-testid="git-button"
          >
            <Github className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPackagesPanel(!showPackagesPanel)}
            className={`text-gray-400 ${showPackagesPanel ? 'bg-purple-800 text-purple-300' : ''}`}
            title="Packages"
            data-testid="packages-button"
          >
            <Package className="w-4 h-4" />
          </Button>
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
            onClick={() => setShowTerminal(!showTerminal)}
            className={`text-gray-400 ${showTerminal ? 'bg-gray-800' : ''}`}
            title="Terminal"
            data-testid="terminal-button"
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
            variant="ghost"
            size="sm"
            onClick={() => setAiPlanMode(!aiPlanMode)}
            className={`text-gray-400 ${aiPlanMode ? 'bg-[#5a8f00] text-[#8CC63F]' : ''}`}
            title="Plan Mode"
            data-testid="plan-mode-button"
          >
            <ListChecks className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => saveProjectMutation.mutate()}
            disabled={!hasUnsavedChanges || saveProjectMutation.isPending}
            size="sm"
            className="bg-[#76B900] hover:bg-[#76B900] text-white disabled:opacity-50"
            data-testid="save-button"
          >
            {saveProjectMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={deployMutation.isPending}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="deploy-button"
          >
            {deployMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Rocket className="w-4 h-4 mr-2" />
            )}
            Deploy
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
                    className="h-7 px-2 bg-[#76B900]"
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

        <div className="flex-1 flex overflow-hidden">
          <div className={`${showAI ? 'w-2/3' : 'w-full'} flex flex-col overflow-hidden`}>
            {Object.keys(editedFiles).length > 0 ? (
              <SandpackProvider
                template="react-ts"
                files={sandpackFiles}
                theme="dark"
                options={{
                  activeFile: `/${activeFile}`,
                  visibleFiles: Object.keys(sandpackFiles),
                  recompileMode: "delayed",
                  recompileDelay: 1000,
                  initMode: "lazy",
                  autorun: true,
                  bundlerTimeOut: 60000,
                }}
                customSetup={{
                  dependencies: {
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0",
                  },
                }}
              >
                <SandpackLayout style={{ height: '100%', border: 'none' }}>
                  <div className="flex-1 flex">
                    <div className="w-1/2 border-r border-gray-800">
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
                    <div className="w-1/2 relative">
                      <SandpackPreview
                        showNavigator
                        showRefreshButton
                        style={{ height: '100%' }}
                      />
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
          
          {showAI && (
            <div className="w-1/3 border-l border-gray-800">
              <AIAssistant
                projectId={projectId || ''}
                activeFile={activeFile}
                onCodeGenerated={handleAICodeGenerated}
                onSave={() => saveProjectMutation.mutate()}
              />
            </div>
          )}
          
          {/* Collaboration Panel */}
          {showCollabPanel && (
            <div className="w-64 border-l border-gray-800 bg-gray-900 flex flex-col">
              <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#76B900]" />
                  Collaborators
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400"
                  onClick={() => setShowCollabPanel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 p-3 space-y-3">
                <Button
                  size="sm"
                  className="w-full bg-[#76B900] hover:bg-[#76B900]"
                  onClick={() => inviteMutation.mutate()}
                  disabled={inviteMutation.isPending}
                  data-testid="invite-collaborator-button"
                >
                  {inviteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Link2 className="w-4 h-4 mr-2" />
                  )}
                  Copy Invite Link
                </Button>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 uppercase">Active ({collaborators?.count || 0})</div>
                  {collaborators?.collaborators?.map((user: any, i: number) => (
                    <div key={user.id || i} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                      <div className="w-8 h-8 rounded-full bg-[#76B900] flex items-center justify-center text-white text-xs font-medium">
                        {user.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{user.username || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">{user.role || 'viewer'}</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-[#76B900]"></div>
                    </div>
                  ))}
                  {(!collaborators?.collaborators || collaborators.collaborators.length === 0) && (
                    <div className="text-sm text-gray-500 text-center py-4">
                      No collaborators yet. Share the invite link to add team members.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Version History Panel */}
          {showVersionHistory && (
            <div className="w-72 border-l border-gray-800 bg-gray-900 flex flex-col">
              <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-blue-400" />
                  Version History
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400"
                  onClick={() => setShowVersionHistory(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-2">
                  {versionHistory?.versions?.length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-8">
                      <History className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      No version history yet. Changes are saved automatically.
                    </div>
                  )}
                  {versionHistory?.versions?.map((version: any) => (
                    <div key={version.id} className="bg-gray-800 rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {new Date(version.createdAt).toLocaleString()}
                        </span>
                        <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
                          v{version.versionNumber}
                        </Badge>
                      </div>
                      <div className="text-sm text-white truncate">{version.filePath}</div>
                      {version.changeDescription && (
                        <div className="text-xs text-gray-500">{version.changeDescription}</div>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs text-blue-400 hover:text-blue-300"
                        onClick={() => restoreVersionMutation.mutate(version.id)}
                        disabled={restoreVersionMutation.isPending}
                        data-testid={`restore-version-${version.id}`}
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Restore this version
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          
          {/* Git Panel */}
          {showGitPanel && (
            <div className="w-80 border-l border-gray-800 bg-gray-900 flex flex-col">
              <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Github className="w-4 h-4 text-orange-400" />
                  Git Workflow
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400"
                  onClick={() => setShowGitPanel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-4">
                  {!gitData?.integration ? (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400 text-center py-4">
                        <Github className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                        <p>Connect a Git repository</p>
                      </div>
                      <div className="space-y-2">
                        <Input
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          placeholder="https://github.com/user/repo"
                          className="bg-gray-800 border-gray-700 text-white text-sm"
                          data-testid="git-repo-url-input"
                        />
                        <Button
                          size="sm"
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          onClick={() => connectGitMutation.mutate(repoUrl)}
                          disabled={!repoUrl || connectGitMutation.isPending}
                          data-testid="connect-git-button"
                        >
                          {connectGitMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Github className="w-4 h-4 mr-2" />
                          )}
                          Connect Repository
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Github className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-white font-medium truncate">
                            {gitData.integration.repoName || 'Connected'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <GitBranch className="w-3 h-3" />
                          {gitData.integration.currentBranch || 'main'}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-700 text-gray-300"
                          onClick={() => gitSyncMutation.mutate('pull')}
                          disabled={gitSyncMutation.isPending}
                          data-testid="git-pull-button"
                        >
                          {gitSyncMutation.isPending ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3 mr-1" />
                          )}
                          Pull
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-700 text-gray-300"
                          onClick={() => gitSyncMutation.mutate('push')}
                          disabled={gitSyncMutation.isPending}
                          data-testid="git-push-button"
                        >
                          {gitSyncMutation.isPending ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Upload className="w-3 h-3 mr-1" />
                          )}
                          Push
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 uppercase flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          Branches
                        </div>
                        {gitBranches?.branches?.map((branch: any) => (
                          <div
                            key={branch.id}
                            className={`p-2 rounded text-sm flex items-center justify-between ${
                              branch.name === gitData.integration.currentBranch
                                ? 'bg-orange-900/30 text-orange-300'
                                : 'bg-gray-800 text-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <GitBranch className="w-3 h-3" />
                              <span className="truncate">{branch.name}</span>
                            </div>
                            {branch.name === gitData.integration.currentBranch && (
                              <Badge className="bg-orange-600 text-white text-xs">current</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 uppercase flex items-center gap-1">
                          <GitCommit className="w-3 h-3" />
                          Recent Syncs
                        </div>
                        {syncHistory?.history?.slice(0, 5).map((sync: any) => (
                          <div key={sync.id} className="p-2 bg-gray-800 rounded text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className={`${sync.direction === 'push' ? 'text-[#8CC63F]' : 'text-blue-400'}`}>
                                {sync.direction === 'push' ? '↑ Push' : '↓ Pull'}
                              </span>
                              <span className="text-gray-500">
                                {new Date(sync.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-gray-400 truncate">{sync.branch}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
          
          {/* Packages Panel */}
          {showPackagesPanel && (
            <div className="w-80 border-l border-gray-800 bg-gray-900 flex flex-col">
              <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-400" />
                  Packages
                </h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400"
                    onClick={() => packageScanMutation.mutate()}
                    disabled={packageScanMutation.isPending}
                    title="Scan for vulnerabilities"
                  >
                    {packageScanMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400"
                    onClick={() => setShowPackagesPanel(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 border-b border-gray-800">
                <div className="flex gap-2">
                  <Input
                    value={packageSearch}
                    onChange={(e) => setPackageSearch(e.target.value)}
                    placeholder="Search packages..."
                    className="bg-gray-800 border-gray-700 text-white text-sm"
                    data-testid="package-search-input"
                  />
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      if (packageSearch.trim()) {
                        installPackageMutation.mutate(packageSearch.trim());
                        setPackageSearch("");
                      }
                    }}
                    disabled={!packageSearch.trim() || installPackageMutation.isPending}
                    data-testid="install-package-button"
                  >
                    {installPackageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-2">
                  {packagesData?.packages?.length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-8">
                      <Package className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      No packages tracked yet. Run a scan to detect packages.
                    </div>
                  )}
                  {packagesData?.packages?.map((pkg: any) => (
                    <div
                      key={pkg.id}
                      className={`p-3 rounded space-y-2 ${
                        pkg.hasVulnerability
                          ? 'bg-red-900/20 border border-red-800'
                          : 'bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white font-medium">{pkg.packageName}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                          onClick={() => uninstallPackageMutation.mutate(pkg.packageName)}
                          disabled={uninstallPackageMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="border-gray-700 text-gray-400">
                          v{pkg.currentVersion || 'unknown'}
                        </Badge>
                        {pkg.hasVulnerability && (
                          <Badge className={`${
                            pkg.vulnerabilitySeverity === 'critical' ? 'bg-red-600' :
                            pkg.vulnerabilitySeverity === 'high' ? 'bg-orange-600' :
                            'bg-yellow-600'
                          } text-white`}>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {pkg.vulnerabilitySeverity}
                          </Badge>
                        )}
                        {pkg.isOutdated && (
                          <Badge className="bg-blue-600 text-white">
                            Update available
                          </Badge>
                        )}
                      </div>
                      {pkg.latestVersion && pkg.currentVersion !== pkg.latestVersion && (
                        <div className="text-xs text-gray-500">
                          Latest: {pkg.latestVersion}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
        
        {/* Terminal Panel */}
        {showTerminal && (
          <div className="h-48 border-t border-gray-800 bg-gray-950 flex flex-col">
            <div className="p-2 border-b border-gray-800 flex items-center justify-between bg-gray-900">
              <h3 className="text-xs font-medium text-white flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#76B900]" />
                Terminal
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-gray-400"
                onClick={() => setShowTerminal(false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-2">
              <div className="font-mono text-xs space-y-1">
                {terminalOutput.map((entry, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="text-[#76B900]">$ {entry.command}</div>
                    <pre className="text-gray-400 whitespace-pre-wrap">{entry.output}</pre>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleTerminalSubmit} className="p-2 border-t border-gray-800 flex gap-2">
              <span className="text-[#76B900] font-mono text-sm">$</span>
              <Input
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Enter command..."
                className="flex-1 h-7 text-xs bg-transparent border-none focus-visible:ring-0 text-white font-mono"
                disabled={terminalMutation.isPending}
                data-testid="terminal-input"
              />
              <Button
                type="submit"
                size="sm"
                className="h-7 px-2"
                disabled={terminalMutation.isPending}
              >
                {terminalMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <PlayCircle className="w-3 h-3" />}
              </Button>
            </form>
          </div>
        )}
        
        {/* AI Plan Mode Panel */}
        {aiPlanMode && currentPlan && (
          <div className="fixed bottom-4 right-4 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
            <div className="p-3 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#76B900]" />
                AI Plan
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400"
                onClick={() => setCurrentPlan(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-sm text-white font-medium">{currentPlan.title}</div>
              <div className="space-y-2">
                {currentPlan.steps?.map((step: any, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      step.status === 'completed' ? 'bg-[#76B900] text-white' :
                      step.status === 'in_progress' ? 'bg-blue-600 text-white' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {step.status === 'completed' ? '✓' : i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-300">{step.description}</div>
                      {step.status === 'in_progress' && (
                        <div className="text-xs text-blue-400 mt-1">In progress...</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-[#76B900] hover:bg-[#76B900]"
                  onClick={() => executePlanMutation.mutate(currentPlan.id)}
                  disabled={executePlanMutation.isPending}
                  data-testid="execute-plan-button"
                >
                  {executePlanMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <PlayCircle className="w-4 h-4 mr-2" />
                  )}
                  Execute Plan
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700"
                  onClick={() => setCurrentPlan(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showDeployModal} onOpenChange={setShowDeployModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Rocket className="w-5 h-5 text-blue-400" />
              Deploy Your App
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {deployMutation.isPending 
                ? "Deploying your application..." 
                : deploymentResult 
                  ? "Your app is now live!" 
                  : "Deploy your application to get a shareable URL."}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={deployTab} onValueChange={(v) => setDeployTab(v as 'deploy' | 'history')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="deploy" className="data-[state=active]:bg-gray-700" data-testid="deploy-tab">
                <Rocket className="w-4 h-4 mr-2" />
                Deploy
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-gray-700" data-testid="history-tab">
                <History className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="deploy" className="space-y-4 py-4">
              {deployMutation.isPending && (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-300">Building and deploying...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                </div>
              )}
              
              {deploymentResult && !deployMutation.isPending && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#76B900]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Deployment Successful!</span>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Live URL</label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-950 rounded px-3 py-2 text-sm font-mono text-blue-300 truncate">
                          {deploymentResult.deploymentUrl}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyDeploymentUrl}
                          className="border-gray-700 bg-gray-800 hover:bg-gray-700"
                          data-testid="copy-url-button"
                        >
                          {copied ? (
                            <CheckCircle2 className="w-4 h-4 text-[#76B900]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <label className="text-xs text-gray-500">Status</label>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-2 h-2 rounded-full bg-[#76B900]"></span>
                          <span className="text-gray-300 capitalize">{deploymentResult.status}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Environment</label>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Globe className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-300 capitalize">{deploymentResult.environment}</span>
                        </div>
                      </div>
                    </div>
                    
                    {deploymentResult.hipaaEnabled && (
                      <div className="flex items-center gap-2 text-sm text-[#76B900] bg-[#76B900]/10 px-3 py-2 rounded">
                        <Shield className="w-4 h-4" />
                        <span>HIPAA Compliant Deployment</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.open(deploymentResult.deploymentUrl, '_blank')}
                      data-testid="open-deployment-button"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open App
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-700 bg-gray-800 hover:bg-gray-700"
                      onClick={() => setShowDeployModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
              
              {!deploymentResult && !deployMutation.isPending && !deployMutation.isError && (
                <div className="text-center py-6">
                  <Rocket className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">Ready to deploy?</p>
                  <p className="text-sm text-gray-500 mb-4">Your app will be published with HIPAA-compliant settings</p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => deployMutation.mutate()}
                    data-testid="start-deploy-button"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy Now
                  </Button>
                </div>
              )}
              
              {deployMutation.isError && (
                <div className="text-center py-4">
                  <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                  <p className="text-red-300">Deployment failed</p>
                  <p className="text-sm text-gray-500 mt-1">Please try again</p>
                  <Button
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => deployMutation.mutate()}
                    data-testid="retry-deploy-button"
                  >
                    Retry Deployment
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4 py-4">
              {!deploymentHistory || deploymentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No deployment history yet</p>
                  <p className="text-sm text-gray-500 mt-1">Deploy your app to see it here</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {deploymentHistory.map((deployment, index) => (
                      <div 
                        key={deployment.id} 
                        className="bg-gray-800 rounded-lg p-4 space-y-2"
                        data-testid={`deployment-history-${index}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              deployment.status === 'active' ? 'bg-[#76B900]' : 'bg-gray-500'
                            }`}></span>
                            <span className="text-sm font-medium text-gray-200 capitalize">
                              {deployment.status}
                            </span>
                          </div>
                          <Badge variant="outline" className="border-gray-700 text-gray-400">
                            {deployment.environment}
                          </Badge>
                        </div>
                        
                        <div className="font-mono text-sm text-blue-300 truncate">
                          {deployment.url}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {deployment.lastDeployment 
                              ? new Date(deployment.lastDeployment).toLocaleString()
                              : 'Unknown'}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                            onClick={() => window.open(deployment.url, '_blank')}
                            data-testid={`open-history-${index}`}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
