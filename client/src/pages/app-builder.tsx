import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Code, 
  Layers, 
  Zap, 
  Download,
  Play,
  Settings,
  Database,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Cloud,
  Cpu,
  Brain,
  Network,
  Lock,
  CheckCircle,
  AlertTriangle,
  Rocket,
  Package,
  GitBranch,
  Terminal,
  FileCode,
  Eye,
  Workflow
} from 'lucide-react';

export default function AppBuilder() {
  const [selectedStack, setSelectedStack] = useState<string>('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [selectedCompliance, setSelectedCompliance] = useState<string[]>([]);
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [deploymentTarget, setDeploymentTarget] = useState('cloud');
  const [buildProgress, setBuildProgress] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const { toast } = useToast();

  // Dynamic data fetching
  const { data: techStacks, isLoading: stacksLoading } = useQuery({
    queryKey: ['/api/tech-stacks'],
    enabled: true,
  });

  const { data: healthcareDomains, isLoading: domainsLoading } = useQuery({
    queryKey: ['/api/healthcare-domains'],
    enabled: true,
  });

  const { data: buildCapabilities, isLoading: capabilitiesLoading } = useQuery({
    queryKey: ['/api/build-capabilities'],
    enabled: true,
  });

  const { data: complianceFrameworks, isLoading: complianceLoading } = useQuery({
    queryKey: ['/api/compliance-frameworks'],
    enabled: true,
  });

  const { data: deploymentOptions, isLoading: deploymentLoading } = useQuery({
    queryKey: ['/api/deployment-options'],
    enabled: true,
  });

  // Build app mutation
  const buildAppMutation = useMutation({
    mutationFn: async (appConfig: any) => {
      setIsBuilding(true);
      setBuildProgress(0);
      
      // Simulate build progress
      const progressInterval = setInterval(() => {
        setBuildProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const result = await apiRequest('/api/app-builder/build', 'POST', appConfig);
      
      clearInterval(progressInterval);
      setBuildProgress(100);
      
      return result;
    },
    onSuccess: (result) => {
      toast({
        title: "App Built Successfully",
        description: `${appName} has been built and is ready for deployment.`,
      });
      setBuildProgress(0);
      setIsBuilding(false);
      queryClient.invalidateQueries({ queryKey: ['/api/user-apps'] });
    },
    onError: (error) => {
      toast({
        title: "Build Failed",
        description: "Failed to build the application. Please try again.",
        variant: "destructive",
      });
      setBuildProgress(0);
      setIsBuilding(false);
    },
  });

  const handleBuildApp = () => {
    if (!appName || !selectedStack || selectedDomains.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide app name, select tech stack, and choose at least one healthcare domain.",
        variant: "destructive"
      });
      return;
    }

    const appConfig = {
      name: appName,
      description: appDescription,
      techStack: selectedStack,
      healthcareDomains: selectedDomains,
      capabilities: selectedCapabilities,
      compliance: selectedCompliance,
      deploymentTarget,
      features: {
        authentication: true,
        encryption: true,
        auditLogging: true,
        realTimeUpdates: selectedCapabilities.includes('realtime'),
        aiIntegration: selectedCapabilities.includes('ai'),
        blockchainIntegration: selectedCapabilities.includes('blockchain'),
        iotIntegration: selectedCapabilities.includes('iot')
      }
    };

    buildAppMutation.mutate(appConfig);
  };

  const toggleSelection = (item: string, selectedItems: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    setSelected(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Healthcare App Builder</h1>
          <p className="text-muted-foreground">
            Build production-ready healthcare applications with AI-powered code generation and global compliance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Code className="h-8 w-8 text-blue-500" />
          <span className="text-sm font-medium">No-Code/Low-Code Builder</span>
        </div>
      </div>

      {isBuilding && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-blue-500 animate-pulse" />
              <span>Building {appName}...</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Build Progress</span>
                <span>{Math.round(buildProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${buildProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Generating code, setting up infrastructure, and configuring compliance...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="config">App Configuration</TabsTrigger>
          <TabsTrigger value="stacks">Tech Stacks</TabsTrigger>
          <TabsTrigger value="domains">Healthcare Domains</TabsTrigger>
          <TabsTrigger value="capabilities">Advanced Features</TabsTrigger>
          <TabsTrigger value="deployment">Deploy & Launch</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Define your healthcare application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">App Name</label>
                  <Input
                    placeholder="My Healthcare App"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="Describe your healthcare application..."
                    value={appDescription}
                    onChange={(e) => setAppDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deployment Target</label>
                  <Select value={deploymentTarget} onValueChange={setDeploymentTarget}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select deployment target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloud">Cloud (AWS/Azure/GCP)</SelectItem>
                      <SelectItem value="on-premise">On-Premise</SelectItem>
                      <SelectItem value="hybrid">Hybrid Cloud</SelectItem>
                      <SelectItem value="edge">Edge Computing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Requirements</CardTitle>
                <CardDescription>Select required compliance frameworks</CardDescription>
              </CardHeader>
              <CardContent>
                {complianceLoading ? (
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {complianceFrameworks?.map((framework: any) => (
                      <div key={framework.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={framework.id}
                          checked={selectedCompliance.includes(framework.id)}
                          onCheckedChange={() => toggleSelection(framework.id, selectedCompliance, setSelectedCompliance)}
                        />
                        <div className="flex-1">
                          <label htmlFor={framework.id} className="text-sm font-medium cursor-pointer">
                            {framework.name}
                          </label>
                          <p className="text-xs text-muted-foreground">{framework.description}</p>
                        </div>
                        <Badge variant={framework.required ? "default" : "secondary"}>
                          {framework.region}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stacks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stacksLoading ? (
              [...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              techStacks?.map((stack: any) => (
                <Card 
                  key={stack.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedStack === stack.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                  }`}
                  onClick={() => setSelectedStack(stack.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{stack.name}</CardTitle>
                      {selectedStack === stack.id && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <CardDescription>{stack.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{stack.category}</Badge>
                      <Badge variant="secondary">{stack.healthcareDomain}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <span className="text-sm">Frontend: {stack.frontend.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4" />
                        <span className="text-sm">Backend: {stack.backend.framework}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {stack.frontend.features?.slice(0, 3).map((feature: string) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Select healthcare domains for your application ({selectedDomains.length} selected)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainsLoading ? (
              [...Array(9)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              healthcareDomains?.map((domain: any) => (
                <Card 
                  key={domain.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedDomains.includes(domain.id) ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950' : ''
                  }`}
                  onClick={() => toggleSelection(domain.id, selectedDomains, setSelectedDomains)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{domain.name}</CardTitle>
                      {selectedDomains.includes(domain.id) && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <CardDescription>{domain.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge variant="outline">{domain.category}</Badge>
                    <div className="flex flex-wrap gap-1">
                      {domain.subdomains?.slice(0, 2).map((subdomain: string) => (
                        <Badge key={subdomain} variant="secondary" className="text-xs">
                          {subdomain}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Enable advanced capabilities for your healthcare application ({selectedCapabilities.length} selected)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilitiesLoading ? (
              [...Array(9)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              buildCapabilities?.map((capability: any) => (
                <Card 
                  key={capability.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCapabilities.includes(capability.id) ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' : ''
                  }`}
                  onClick={() => toggleSelection(capability.id, selectedCapabilities, setSelectedCapabilities)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {capability.icon === 'brain' && <Brain className="h-5 w-5" />}
                        {capability.icon === 'network' && <Network className="h-5 w-5" />}
                        {capability.icon === 'shield' && <Shield className="h-5 w-5" />}
                        {capability.icon === 'zap' && <Zap className="h-5 w-5" />}
                        <CardTitle className="text-lg">{capability.name}</CardTitle>
                      </div>
                      {selectedCapabilities.includes(capability.id) && (
                        <CheckCircle className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                    <CardDescription>{capability.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge variant={capability.complexity === 'high' ? 'destructive' : capability.complexity === 'medium' ? 'default' : 'secondary'}>
                      {capability.complexity} complexity
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Build time: +{capability.buildTime}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Build Summary</CardTitle>
                <CardDescription>Review your application configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">App Name:</span>
                    <span className="text-sm">{appName || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Tech Stack:</span>
                    <span className="text-sm">{selectedStack || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Healthcare Domains:</span>
                    <span className="text-sm">{selectedDomains.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Advanced Features:</span>
                    <span className="text-sm">{selectedCapabilities.length} enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Compliance:</span>
                    <span className="text-sm">{selectedCompliance.length} frameworks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Deployment:</span>
                    <span className="text-sm">{deploymentTarget}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment Options</CardTitle>
                <CardDescription>Choose how to deploy your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deploymentLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  deploymentOptions?.map((option: any) => (
                    <div key={option.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{option.name}</h4>
                        <Badge variant={option.recommended ? 'default' : 'secondary'}>
                          {option.recommended ? 'Recommended' : option.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Setup: {option.setupTime}</span>
                        <span>Cost: {option.cost}</span>
                        <span>Compliance: {option.compliance ? 'Yes' : 'Limited'}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="h-5 w-5 text-green-500" />
                <span>Ready to Build</span>
              </CardTitle>
              <CardDescription>
                Generate production-ready healthcare application with AI-powered code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <FileCode className="h-8 w-8 mx-auto text-blue-500" />
                  <h4 className="font-medium">Full Source Code</h4>
                  <p className="text-sm text-muted-foreground">Complete application code with documentation</p>
                </div>
                <div className="space-y-1">
                  <Shield className="h-8 w-8 mx-auto text-green-500" />
                  <h4 className="font-medium">Security & Compliance</h4>
                  <p className="text-sm text-muted-foreground">Built-in security and compliance features</p>
                </div>
                <div className="space-y-1">
                  <Cloud className="h-8 w-8 mx-auto text-purple-500" />
                  <h4 className="font-medium">Cloud Ready</h4>
                  <p className="text-sm text-muted-foreground">Deployment scripts and infrastructure</p>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleBuildApp}
                disabled={buildAppMutation.isPending || isBuilding}
              >
                {buildAppMutation.isPending || isBuilding ? (
                  <>
                    <Cpu className="h-5 w-5 mr-2 animate-spin" />
                    Building Application...
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5 mr-2" />
                    Build Healthcare Application
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}