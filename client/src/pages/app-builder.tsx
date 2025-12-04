import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import PageLayout from '@/components/PageLayout';
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
  Database,
  Shield,
  Monitor,
  Brain,
  Network,
  Zap,
  CheckCircle,
  Rocket,
  FileCode,
  Terminal,
  Play
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

  const { data: techStacks, isLoading: stacksLoading } = useQuery({
    queryKey: ['/api/tech-stacks'],
  });

  const { data: healthcareDomains, isLoading: domainsLoading } = useQuery({
    queryKey: ['/api/healthcare-domains'],
  });

  const { data: buildCapabilities, isLoading: capabilitiesLoading } = useQuery({
    queryKey: ['/api/build-capabilities'],
  });

  const { data: complianceFrameworks, isLoading: complianceLoading } = useQuery({
    queryKey: ['/api/compliance-frameworks'],
  });

  const { data: deploymentOptions, isLoading: deploymentLoading } = useQuery({
    queryKey: ['/api/deployment-options'],
  });

  const buildAppMutation = useMutation({
    mutationFn: async (appConfig: unknown) => {
      setIsBuilding(true);
      setBuildProgress(0);
      
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
    onSuccess: () => {
      toast({
        title: "App Built Successfully",
        description: `${appName} has been built and is ready for deployment.`,
      });
      setBuildProgress(0);
      setIsBuilding(false);
      queryClient.invalidateQueries({ queryKey: ['/api/user-apps'] });
    },
    onError: () => {
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

  const headerActions = (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800"
      >
        <Terminal className="w-4 h-4 mr-2" />
        View Console
      </Button>
      <Button 
        size="sm" 
        className="bg-emerald-600 hover:bg-emerald-500 text-white"
        onClick={handleBuildApp}
        disabled={isBuilding}
      >
        <Play className="w-4 h-4 mr-2" />
        Build App
      </Button>
    </>
  );

  return (
    <PageLayout 
      title="Healthcare App Builder" 
      description="Build production-ready healthcare applications with AI-powered code generation"
      headerActions={headerActions}
    >
      {isBuilding && (
        <Card className="bg-emerald-900/30 border-emerald-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Rocket className="h-5 w-5 text-emerald-400 animate-pulse" />
              <span>Building {appName}...</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Build Progress</span>
                <span>{Math.round(buildProgress)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${buildProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400">
                Generating code, setting up infrastructure, and configuring compliance...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="config" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">App Configuration</TabsTrigger>
          <TabsTrigger value="stacks" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">Tech Stacks</TabsTrigger>
          <TabsTrigger value="domains" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">Healthcare Domains</TabsTrigger>
          <TabsTrigger value="capabilities" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">Advanced Features</TabsTrigger>
          <TabsTrigger value="deployment" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
                <CardDescription className="text-gray-400">Define your healthcare application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">App Name</label>
                  <Input
                    placeholder="My Healthcare App"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Description</label>
                  <Input
                    placeholder="Describe your healthcare application..."
                    value={appDescription}
                    onChange={(e) => setAppDescription(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Deployment Target</label>
                  <Select value={deploymentTarget} onValueChange={setDeploymentTarget}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                      <SelectValue placeholder="Select deployment target" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="cloud" className="text-gray-100 focus:bg-gray-800">Cloud (AWS/Azure/GCP)</SelectItem>
                      <SelectItem value="on-premise" className="text-gray-100 focus:bg-gray-800">On-Premise</SelectItem>
                      <SelectItem value="hybrid" className="text-gray-100 focus:bg-gray-800">Hybrid Cloud</SelectItem>
                      <SelectItem value="edge" className="text-gray-100 focus:bg-gray-800">Edge Computing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Compliance Requirements</CardTitle>
                <CardDescription className="text-gray-400">Select required compliance frameworks</CardDescription>
              </CardHeader>
              <CardContent>
                {complianceLoading ? (
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full bg-gray-800" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {complianceFrameworks?.map((framework: { id: string; name: string; description: string; required: boolean; region: string }) => (
                      <div key={framework.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={framework.id}
                          checked={selectedCompliance.includes(framework.id)}
                          onCheckedChange={() => toggleSelection(framework.id, selectedCompliance, setSelectedCompliance)}
                          className="border-gray-600"
                        />
                        <div className="flex-1">
                          <label htmlFor={framework.id} className="text-sm font-medium cursor-pointer text-gray-200">
                            {framework.name}
                          </label>
                          <p className="text-xs text-gray-500">{framework.description}</p>
                        </div>
                        <Badge className={framework.required ? "bg-emerald-900/50 text-emerald-300 border-emerald-700" : "bg-gray-800 text-gray-300 border-gray-700"}>
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
                <Card key={i} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                    <Skeleton className="h-4 w-1/2 bg-gray-800" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full bg-gray-800" />
                  </CardContent>
                </Card>
              ))
            ) : (
              techStacks?.map((stack: { id: string; name: string; description: string; category: string; healthcareDomain: string; frontend: { name: string; features?: string[] }; backend: { framework: string } }) => (
                <Card 
                  key={stack.id}
                  className={`cursor-pointer transition-all bg-gray-900 border-gray-800 hover:bg-gray-800 ${
                    selectedStack === stack.id ? 'ring-2 ring-emerald-500 bg-emerald-900/20' : ''
                  }`}
                  onClick={() => setSelectedStack(stack.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{stack.name}</CardTitle>
                      {selectedStack === stack.id && (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                    <CardDescription className="text-gray-400">{stack.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-gray-700 text-gray-300">{stack.category}</Badge>
                      <Badge className="bg-gray-800 text-gray-300">{stack.healthcareDomain}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Monitor className="h-4 w-4" />
                        <span className="text-sm">Frontend: {stack.frontend.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Database className="h-4 w-4" />
                        <span className="text-sm">Backend: {stack.backend.framework}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {stack.frontend.features?.slice(0, 3).map((feature: string) => (
                        <Badge key={feature} variant="outline" className="text-xs border-gray-700 text-gray-400">
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
          <div className="text-sm text-gray-400 mb-4">
            Select healthcare domains for your application ({selectedDomains.length} selected)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainsLoading ? (
              [...Array(9)].map((_, i) => (
                <Card key={i} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                    <Skeleton className="h-4 w-1/2 bg-gray-800" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full bg-gray-800" />
                  </CardContent>
                </Card>
              ))
            ) : (
              healthcareDomains?.map((domain: { id: string; name: string; description: string; category: string; subdomains?: string[] }) => (
                <Card 
                  key={domain.id}
                  className={`cursor-pointer transition-all bg-gray-900 border-gray-800 hover:bg-gray-800 ${
                    selectedDomains.includes(domain.id) ? 'ring-2 ring-emerald-500 bg-emerald-900/20' : ''
                  }`}
                  onClick={() => toggleSelection(domain.id, selectedDomains, setSelectedDomains)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{domain.name}</CardTitle>
                      {selectedDomains.includes(domain.id) && (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                    <CardDescription className="text-gray-400">{domain.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge variant="outline" className="border-gray-700 text-gray-300">{domain.category}</Badge>
                    <div className="flex flex-wrap gap-1">
                      {domain.subdomains?.slice(0, 2).map((subdomain: string) => (
                        <Badge key={subdomain} className="text-xs bg-gray-800 text-gray-300">
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
          <div className="text-sm text-gray-400 mb-4">
            Enable advanced capabilities for your healthcare application ({selectedCapabilities.length} selected)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilitiesLoading ? (
              [...Array(9)].map((_, i) => (
                <Card key={i} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                    <Skeleton className="h-4 w-1/2 bg-gray-800" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full bg-gray-800" />
                  </CardContent>
                </Card>
              ))
            ) : (
              buildCapabilities?.map((capability: { id: string; name: string; description: string; icon: string; complexity: string; buildTime: string }) => (
                <Card 
                  key={capability.id}
                  className={`cursor-pointer transition-all bg-gray-900 border-gray-800 hover:bg-gray-800 ${
                    selectedCapabilities.includes(capability.id) ? 'ring-2 ring-purple-500 bg-purple-900/20' : ''
                  }`}
                  onClick={() => toggleSelection(capability.id, selectedCapabilities, setSelectedCapabilities)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {capability.icon === 'brain' && <Brain className="h-5 w-5 text-purple-400" />}
                        {capability.icon === 'network' && <Network className="h-5 w-5 text-purple-400" />}
                        {capability.icon === 'shield' && <Shield className="h-5 w-5 text-purple-400" />}
                        {capability.icon === 'zap' && <Zap className="h-5 w-5 text-purple-400" />}
                        <CardTitle className="text-lg text-white">{capability.name}</CardTitle>
                      </div>
                      {selectedCapabilities.includes(capability.id) && (
                        <CheckCircle className="h-5 w-5 text-purple-400" />
                      )}
                    </div>
                    <CardDescription className="text-gray-400">{capability.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge className={capability.complexity === 'high' ? 'bg-red-900/50 text-red-300 border-red-700' : capability.complexity === 'medium' ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700' : 'bg-gray-800 text-gray-300'}>
                      {capability.complexity} complexity
                    </Badge>
                    <div className="text-sm text-gray-500">
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
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Build Summary</CardTitle>
                <CardDescription className="text-gray-400">Review your application configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span className="text-sm font-medium">App Name:</span>
                    <span className="text-sm">{appName || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-sm font-medium">Tech Stack:</span>
                    <span className="text-sm">{selectedStack || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-sm font-medium">Healthcare Domains:</span>
                    <span className="text-sm">{selectedDomains.length} selected</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-sm font-medium">Advanced Features:</span>
                    <span className="text-sm">{selectedCapabilities.length} enabled</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-sm font-medium">Compliance:</span>
                    <span className="text-sm">{selectedCompliance.length} frameworks</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-sm font-medium">Deployment:</span>
                    <span className="text-sm">{deploymentTarget}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Deployment Options</CardTitle>
                <CardDescription className="text-gray-400">Choose how to deploy your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deploymentLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full bg-gray-800" />
                    ))}
                  </div>
                ) : (
                  deploymentOptions?.map((option: { id: string; name: string; description: string; recommended?: boolean; type: string; setupTime: string; cost: string; compliance: boolean }) => (
                    <div key={option.id} className="p-3 bg-gray-800 border border-gray-700 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">{option.name}</h4>
                        <Badge className={option.recommended ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700' : 'bg-gray-700 text-gray-300'}>
                          {option.recommended ? 'Recommended' : option.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{option.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
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

          <Card className="bg-emerald-900/30 border-emerald-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Rocket className="h-5 w-5 text-emerald-400" />
                <span>Ready to Build</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Generate production-ready healthcare application with AI-powered code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <FileCode className="h-8 w-8 mx-auto text-emerald-400" />
                  <h4 className="font-medium text-white">Full Source Code</h4>
                  <p className="text-sm text-gray-400">Complete application code with documentation</p>
                </div>
                <div className="space-y-1">
                  <Shield className="h-8 w-8 mx-auto text-emerald-400" />
                  <h4 className="font-medium text-white">HIPAA Compliant</h4>
                  <p className="text-sm text-gray-400">Built-in healthcare compliance features</p>
                </div>
                <div className="space-y-1">
                  <Code className="h-8 w-8 mx-auto text-emerald-400" />
                  <h4 className="font-medium text-white">AI-Powered</h4>
                  <p className="text-sm text-gray-400">Intelligent code generation and optimization</p>
                </div>
              </div>
              <Button 
                onClick={handleBuildApp}
                disabled={isBuilding || !appName || !selectedStack || selectedDomains.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Build Healthcare Application
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
