import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  MousePointer, 
  Smartphone, 
  Monitor, 
  Tablet,
  Palette,
  Layout,
  Database,
  Settings,
  Play,
  Eye,
  Code,
  Wand2,
  Zap,
  Brain,
  Layers,
  GitBranch,
  CloudUpload,
  Shield,
  Globe,
  Users,
  Activity
} from "lucide-react";

interface Component {
  id: string;
  type: string;
  properties: any;
  children: Component[];
  position: { x: number; y: number };
}

interface Application {
  id: string;
  name: string;
  description: string;
  components: Component[];
  pages: any[];
  database: any;
  integrations: string[];
  compliance: string[];
}

export default function VisualBuilder() {
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [currentApp, setCurrentApp] = useState<Application | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available healthcare components
  const { data: availableComponents = [], isLoading: componentsLoading } = useQuery({
    queryKey: ['/api/visual-builder/components']
  });

  // Fetch healthcare templates for visual building
  const { data: visualTemplates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/visual-builder/templates']
  });

  // Auto-generate application from natural language
  const generateAppMutation = useMutation({
    mutationFn: async (description: string) => {
      return apiRequest('POST', '/api/visual-builder/generate-app', { description });
    },
    onSuccess: (data: any) => {
      setCurrentApp(data.application);
      toast({
        title: "Application Generated",
        description: "Your healthcare app has been created from your description!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate application. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Deploy application
  const deployMutation = useMutation({
    mutationFn: async (appData: Application) => {
      return apiRequest('POST', '/api/visual-builder/deploy', { application: appData });
    },
    onSuccess: (data) => {
      toast({
        title: "Deployed Successfully",
        description: `Your app is live at: ${data.url}`,
      });
    }
  });

  const handleComponentDrop = useCallback((e: React.DragEvent, area: 'canvas' | 'properties') => {
    e.preventDefault();
    if (!draggedComponent || !currentApp) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newComponent: Component = {
      id: `comp_${Date.now()}`,
      type: draggedComponent,
      properties: getDefaultProperties(draggedComponent),
      children: [],
      position: { x, y }
    };

    setCurrentApp(prev => prev ? {
      ...prev,
      components: [...prev.components, newComponent]
    } : null);

    setDraggedComponent(null);
  }, [draggedComponent, currentApp]);

  const getDefaultProperties = (componentType: string): any => {
    const defaults = {
      'patient-form': { title: 'Patient Information', fields: ['name', 'dob', 'insurance'] },
      'appointment-scheduler': { timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM'], duration: 30 },
      'medical-chart': { chartType: 'line', dataSource: 'vitals', realTime: true },
      'prescription-pad': { drugDatabase: 'rxnorm', dosageCalculator: true },
      'lab-results': { autoRefresh: true, criticalAlerts: true },
      'telehealth-video': { hdQuality: true, recording: false, hipaaCompliant: true }
    };
    return (defaults as any)[componentType] || {};
  };

  if (componentsLoading || templatesLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-xl">Loading Visual Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Wand2 className="w-8 h-8 mr-3 text-purple-400" />
              Visual Healthcare Builder
            </h1>
            <Badge variant="outline" className="text-green-400 border-green-400">
              No Code Required
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              AI-Powered
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Device Preview Toggle */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              {[
                { id: 'mobile', icon: Smartphone },
                { id: 'tablet', icon: Tablet },
                { id: 'desktop', icon: Monitor }
              ].map(({ id, icon: Icon }) => (
                <Button
                  key={id}
                  variant={selectedDevice === id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedDevice(id as any)}
                  className="text-white"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
            
            <Button 
              onClick={() => currentApp && deployMutation.mutate(currentApp)}
              className="bg-green-600 hover:bg-green-700"
              disabled={!currentApp || deployMutation.isPending}
            >
              <CloudUpload className="w-4 h-4 mr-2" />
              Deploy Live
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Component Palette */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          <Tabs defaultValue="components" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="ai-generate">AI Generate</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Healthcare Components</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'patient-form', name: 'Patient Form', icon: Users },
                    { id: 'appointment-scheduler', name: 'Scheduler', icon: Activity },
                    { id: 'medical-chart', name: 'Medical Chart', icon: Layers },
                    { id: 'prescription-pad', name: 'Prescription', icon: Shield },
                    { id: 'lab-results', name: 'Lab Results', icon: Database },
                    { id: 'telehealth-video', name: 'Video Call', icon: Globe }
                  ].map(({ id, name, icon: Icon }) => (
                    <div
                      key={id}
                      draggable
                      onDragStart={() => setDraggedComponent(id)}
                      className="bg-gray-700 p-3 rounded-lg cursor-grab hover:bg-gray-600 transition-colors"
                    >
                      <Icon className="w-6 h-6 text-blue-400 mb-2" />
                      <p className="text-white text-sm font-medium">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Quick Start Templates</h3>
                {visualTemplates.map((template: any) => (
                  <div
                    key={template.id}
                    className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600"
                    onClick={() => setCurrentApp(template.application)}
                  >
                    <h4 className="text-white font-medium">{template.name}</h4>
                    <p className="text-gray-400 text-sm">{template.description}</p>
                    <div className="flex mt-2 space-x-1">
                      {template.features?.slice(0, 3).map((feature: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="ai-generate" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-white font-semibold">AI App Generator</h3>
                <p className="text-gray-400 text-sm">
                  Describe your healthcare app in plain English, and our AI will build it for you.
                </p>
                
                <Textarea
                  placeholder="I need a telemedicine app for dermatology consultations with photo sharing, appointment booking, and HIPAA-compliant messaging..."
                  className="bg-gray-700 border-gray-600 text-white min-h-24"
                  onChange={(e) => {
                    // Store the description for generation
                  }}
                />
                
                <Button
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                    if (textarea?.value) {
                      generateAppMutation.mutate(textarea.value);
                    }
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={generateAppMutation.isPending}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {generateAppMutation.isPending ? 'Generating...' : 'Generate App with AI'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div
            className="flex-1 bg-gray-900 relative overflow-auto"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleComponentDrop(e, 'canvas')}
          >
            {currentApp ? (
              <div className={`
                mx-auto bg-white rounded-lg shadow-2xl relative
                ${selectedDevice === 'mobile' ? 'w-80 h-screen' : ''}
                ${selectedDevice === 'tablet' ? 'w-[768px] h-[1024px]' : ''}
                ${selectedDevice === 'desktop' ? 'w-full max-w-6xl h-full min-h-[800px]' : ''}
              `}>
                {/* App Preview */}
                <div className="p-6 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{currentApp.name}</h2>
                    <div className="flex space-x-2">
                      <Badge className="bg-green-100 text-green-800">HIPAA Compliant</Badge>
                      <Badge className="bg-blue-100 text-blue-800">Real-time</Badge>
                    </div>
                  </div>
                  
                  {/* Render Components */}
                  <div className="relative h-full">
                    {currentApp.components.map((component) => (
                      <div
                        key={component.id}
                        className={`absolute border-2 border-dashed border-blue-400 rounded-lg p-4 cursor-pointer
                          ${selectedComponent === component.id ? 'bg-blue-50' : 'bg-gray-50'}
                        `}
                        style={{
                          left: component.position?.x || 0,
                          top: component.position?.y || 0,
                          minWidth: '200px',
                          minHeight: '100px'
                        }}
                        onClick={() => setSelectedComponent(component.id)}
                      >
                        <div className="text-sm font-medium text-gray-600 mb-2">
                          {component.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-xs text-gray-500">
                          Click to configure properties
                        </div>
                      </div>
                    ))}
                    
                    {currentApp.components.length === 0 && (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <MousePointer className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-xl font-medium">Drag components here to start building</p>
                          <p className="text-sm">Or use AI to generate your app automatically</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <Layout className="w-20 h-20 mx-auto mb-6 text-gray-600" />
                  <h2 className="text-2xl font-bold mb-4">Start Building Your Healthcare App</h2>
                  <p className="text-gray-400 mb-6">Choose a template or describe your app idea to get started</p>
                  <div className="space-x-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Eye className="w-4 h-4 mr-2" />
                      Browse Templates
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300">
                      <Wand2 className="w-4 h-4 mr-2" />
                      AI Generate
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedComponent && currentApp && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
            <h3 className="text-white font-semibold mb-4">Properties</h3>
            <div className="space-y-4">
              {/* Component-specific properties would be rendered here */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Component Type</label>
                <Input 
                  value={currentApp.components.find(c => c.id === selectedComponent)?.type || ''}
                  disabled
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Title</label>
                <Input 
                  placeholder="Enter title"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">HIPAA Compliance</label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select compliance level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic HIPAA</SelectItem>
                    <SelectItem value="advanced">Advanced + HITECH</SelectItem>
                    <SelectItem value="maximum">Maximum Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}