import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Globe, 
  Languages, 
  Shield, 
  FileText, 
  Building,
  MapPin,
  Clock,
  Phone,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Info,
  Search,
  Filter,
  Download,
  Play,
  Zap,
  Brain,
  Eye,
  Activity,
  Database,
  Network,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';

export default function GlobalHealthcare() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Dynamic data fetching with real-time updates
  const { data: healthcareDomains, isLoading: domainsLoading } = useQuery({
    queryKey: ['/api/healthcare-domains', { search: searchTerm, category: selectedCategory }],
    enabled: true,
  });

  const { data: domainCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/healthcare-domains/categories'],
    enabled: true,
  });

  const { data: healthcareOrganizations, isLoading: organizationsLoading } = useQuery({
    queryKey: ['/api/healthcare-organizations'],
    enabled: true,
  });

  const { data: medicalPublications, isLoading: publicationsLoading } = useQuery({
    queryKey: ['/api/medical-publications', { limit: 10 }],
    enabled: true,
  });

  const { data: healthcareStandards, isLoading: standardsLoading } = useQuery({
    queryKey: ['/api/healthcare-standards'],
    enabled: true,
  });

  const { data: healthcareAgents, isLoading: agentsLoading } = useQuery({
    queryKey: ['/api/healthcare-agents'],
    enabled: true,
  });

  // Advanced capabilities mutations
  const enableCapabilitiesMutation = useMutation({
    mutationFn: async (capabilities: any) => {
      return apiRequest('/api/advanced-capabilities/enable', 'POST', capabilities);
    },
    onSuccess: () => {
      toast({
        title: "Advanced Capabilities Enabled",
        description: "Healthcare AI capabilities have been successfully activated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/healthcare-domains'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to enable advanced capabilities.",
        variant: "destructive",
      });
    },
  });

  const createSimulationMutation = useMutation({
    mutationFn: async (simulationData: any) => {
      return apiRequest('/api/healthcare-simulations', 'POST', simulationData);
    },
    onSuccess: () => {
      toast({
        title: "Simulation Created",
        description: "Healthcare simulation has been successfully created and executed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/healthcare-simulations'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create healthcare simulation.",
        variant: "destructive",
      });
    },
  });

  // Advanced capabilities handlers
  const handleEnableAdvancedCapabilities = (capabilityType: string) => {
    const capabilities = {
      vrArXrEnabled: capabilityType === 'immersive',
      simulationTypes: ['clinical_trial', 'patient_simulation', 'drug_interaction'],
      immersiveEducation: capabilityType === 'immersive',
      computerVision: capabilityType === 'computer_vision',
      medicalImaging: capabilityType === 'computer_vision',
      multimodalAnalysis: capabilityType === 'computer_vision',
      blockchain: capabilityType === 'blockchain',
      web3Integration: capabilityType === 'blockchain',
      decentralizedHealth: capabilityType === 'blockchain',
      federatedLearning: capabilityType === 'federated_learning',
      distributedAI: capabilityType === 'federated_learning',
      privateComputation: capabilityType === 'federated_learning',
      iotSensors: capabilityType === 'iot',
      medicalDevices: capabilityType === 'iot',
      wearableIntegration: capabilityType === 'iot',
      preventiveMedicine: capabilityType === 'precision',
      precisionMedicine: capabilityType === 'precision',
      personalizedMedicine: capabilityType === 'precision',
      clinicalPractice: true,
      medicalEducation: true,
      drugDiscovery: capabilityType === 'drug_discovery',
      biotechnology: capabilityType === 'drug_discovery',
      digitalHealth: true,
      healthEconomics: capabilityType === 'economics',
      healthFinance: capabilityType === 'economics',
      healthLaw: capabilityType === 'law',
      humanResources: capabilityType === 'hr',
      learningHealthSystems: true,
      continuousImprovement: true,
      realWorldEvidence: true,
      healthcareMedia: capabilityType === 'media',
      medicalJournals: capabilityType === 'media',
      pubmedIntegration: capabilityType === 'media',
      healthRegistries: capabilityType === 'registries',
      healthInsurance: capabilityType === 'insurance',
      pharmaceuticalCompanies: capabilityType === 'pharma',
      medicalEquipment: capabilityType === 'equipment',
      medicalSocieties: capabilityType === 'societies'
    };

    enableCapabilitiesMutation.mutate(capabilities);
  };

  const handleCreateSimulation = (simulationType: string) => {
    const simulationData = {
      type: simulationType,
      category: 'global_healthcare',
      name: `Global Healthcare ${simulationType} Simulation`,
      description: `Advanced simulation for ${simulationType} healthcare scenarios`,
      parameters: {
        countries: selectedCountries,
        languages: selectedLanguages,
        complianceStandards: ['FHIR', 'HL7', 'HIPAA', 'GDPR'],
        simulationType: simulationType
      },
      status: 'running'
    };

    createSimulationMutation.mutate(simulationData);
  };

  const filteredDomains = healthcareDomains?.filter((domain: any) => {
    if (selectedCategory && domain.category !== selectedCategory) return false;
    if (searchTerm && !domain.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !domain.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Global Healthcare Platform</h1>
          <p className="text-muted-foreground">
            Build comprehensive healthcare applications with AI intelligence, global compliance, and advanced capabilities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8 text-blue-500" />
          <span className="text-sm font-medium">193 Countries • 10+ Languages • AI-Powered</span>
        </div>
      </div>

      <Tabs defaultValue="domains" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="domains">Healthcare Domains</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="standards">Standards</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="capabilities">Advanced Capabilities</TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <Input
              placeholder="Search healthcare domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
              icon={<Search className="h-4 w-4" />}
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categoriesLoading ? (
                  <SelectItem value="loading">Loading...</SelectItem>
                ) : (
                  domainCategories?.map((category: string) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {domainsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDomains.map((domain: any) => (
                <Card key={domain.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{domain.name}</CardTitle>
                      <Badge variant="outline">{domain.category}</Badge>
                    </div>
                    <CardDescription>{domain.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {domain.subdomains?.slice(0, 3).map((subdomain: string) => (
                        <Badge key={subdomain} variant="secondary" className="text-xs">
                          {subdomain}
                        </Badge>
                      ))}
                      {domain.subdomains?.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{domain.subdomains.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="h-4 w-4" />
                      <span>{domain.countries?.length || 0} countries</span>
                      <Languages className="h-4 w-4" />
                      <span>{domain.languages?.length || 0} languages</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleCreateSimulation(domain.name)}
                      disabled={createSimulationMutation.isPending}
                    >
                      {createSimulationMutation.isPending ? (
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Create Simulation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizationsLoading ? (
              [...Array(6)].map((_, i) => (
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
              healthcareOrganizations?.map((org: any) => (
                <Card key={org.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      <Badge>{org.type}</Badge>
                    </div>
                    <CardDescription>{org.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{org.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span className="text-sm">{org.description}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="publications" className="space-y-4">
          <div className="space-y-4">
            {publicationsLoading ? (
              [...Array(5)].map((_, i) => (
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
              medicalPublications?.map((publication: any) => (
                <Card key={publication.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{publication.title}</CardTitle>
                      <Badge variant="outline">{publication.publicationType}</Badge>
                    </div>
                    <CardDescription>
                      {publication.journal} • {publication.medicalSpecialty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{publication.abstract}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>PubMed ID: {publication.pubmedId}</span>
                      <span>DOI: {publication.doi}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="standards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standardsLoading ? (
              [...Array(4)].map((_, i) => (
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
              healthcareStandards?.map((standard: any) => (
                <Card key={standard.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{standard.name}</CardTitle>
                      <Badge>{standard.acronym}</Badge>
                    </div>
                    <CardDescription>{standard.organization}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">{standard.description}</p>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Category: {standard.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {standard.supportedCountries?.slice(0, 5).map((country: string) => (
                        <Badge key={country} variant="secondary" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentsLoading ? (
              [...Array(6)].map((_, i) => (
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
              healthcareAgents?.map((agent: any) => (
                <Card key={agent.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <Badge>{agent.type}</Badge>
                    </div>
                    <CardDescription>{agent.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">{agent.description}</p>
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4" />
                      <span className="text-sm">AI Model: {agent.aiModel}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities?.slice(0, 3).map((capability: string) => (
                        <Badge key={capability} variant="secondary" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <span>VR/AR/XR & Computer Vision</span>
                </CardTitle>
                <CardDescription>
                  Immersive healthcare education and medical image analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-1">
                  <li>• VR surgical training simulations</li>
                  <li>• AR anatomy visualization</li>
                  <li>• Medical image analysis (X-ray, MRI, CT)</li>
                  <li>• DICOM processing and visualization</li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleEnableAdvancedCapabilities('immersive')}
                  disabled={enableCapabilitiesMutation.isPending}
                >
                  {enableCapabilitiesMutation.isPending ? (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Enable VR/AR/Computer Vision
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-green-500" />
                  <span>Blockchain & Web3</span>
                </CardTitle>
                <CardDescription>
                  Decentralized health records and secure data sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-1">
                  <li>• Secure patient data on blockchain</li>
                  <li>• Decentralized identity management</li>
                  <li>• Smart contracts for healthcare</li>
                  <li>• Interoperable health records</li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleEnableAdvancedCapabilities('blockchain')}
                  disabled={enableCapabilitiesMutation.isPending}
                >
                  {enableCapabilitiesMutation.isPending ? (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Enable Blockchain & Web3
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="h-5 w-5 text-purple-500" />
                  <span>Federated Learning & AI</span>
                </CardTitle>
                <CardDescription>
                  Distributed AI training while preserving patient privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-1">
                  <li>• Privacy-preserving AI training</li>
                  <li>• Multi-hospital collaboration</li>
                  <li>• Differential privacy protocols</li>
                  <li>• Secure multi-party computation</li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleEnableAdvancedCapabilities('federated_learning')}
                  disabled={enableCapabilitiesMutation.isPending}
                >
                  {enableCapabilitiesMutation.isPending ? (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Enable Federated Learning
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  <span>IoT & Medical Devices</span>
                </CardTitle>
                <CardDescription>
                  Connected medical devices and real-time monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-1">
                  <li>• Wearable device integration</li>
                  <li>• Real-time vital monitoring</li>
                  <li>• Medical device connectivity</li>
                  <li>• Remote patient monitoring</li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleEnableAdvancedCapabilities('iot')}
                  disabled={enableCapabilitiesMutation.isPending}
                >
                  {enableCapabilitiesMutation.isPending ? (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Enable IoT & Devices
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <span>Health Economics & Finance</span>
                </CardTitle>
                <CardDescription>
                  Healthcare economic modeling and financial analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-1">
                  <li>• Cost-effectiveness analysis</li>
                  <li>• Budget impact modeling</li>
                  <li>• Healthcare ROI calculation</li>
                  <li>• Financial sustainability planning</li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleEnableAdvancedCapabilities('economics')}
                  disabled={enableCapabilitiesMutation.isPending}
                >
                  {enableCapabilitiesMutation.isPending ? (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Enable Health Economics
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-teal-500" />
                  <span>Healthcare Media & Publications</span>
                </CardTitle>
                <CardDescription>
                  Medical journals, PubMed integration, and healthcare media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-1">
                  <li>• PubMed database integration</li>
                  <li>• Medical journal publishing</li>
                  <li>• Healthcare media management</li>
                  <li>• Research literature analysis</li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleEnableAdvancedCapabilities('media')}
                  disabled={enableCapabilitiesMutation.isPending}
                >
                  {enableCapabilitiesMutation.isPending ? (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Enable Healthcare Media
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Global Healthcare Application Generator</span>
              </CardTitle>
              <CardDescription>
                Create comprehensive healthcare applications with AI intelligence and global compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Domains</h4>
                  <p className="text-sm text-muted-foreground">
                    {filteredDomains.length} healthcare domains available
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Global Coverage</h4>
                  <p className="text-sm text-muted-foreground">
                    193 countries • 10+ languages supported
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">AI Models</h4>
                  <p className="text-sm text-muted-foreground">
                    GPT-4o • Med-Gemma • Healthcare BERT
                  </p>
                </div>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => handleCreateSimulation('global_healthcare_platform')}
                disabled={createSimulationMutation.isPending}
              >
                {createSimulationMutation.isPending ? (
                  <Activity className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Globe className="h-5 w-5 mr-2" />
                )}
                Generate Global Healthcare Platform
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}