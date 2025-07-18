import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Eye, 
  Microscope, 
  Activity, 
  Smartphone, 
  Globe, 
  Shield, 
  Zap, 
  Database,
  Network,
  Cpu,
  Lock,
  Wifi,
  Monitor,
  Headphones,
  Camera,
  Heart,
  TrendingUp,
  Award,
  Sparkles,
  Atom,
  Dna,
  Stethoscope,
  Building2
} from "lucide-react";

interface AdvancedCapability {
  id: string;
  name: string;
  category: 'ai-ml' | 'immersive' | 'blockchain' | 'iot' | 'precision-medicine' | 'research';
  description: string;
  benefits: string[];
  technologies: string[];
  icon: any;
  enabled: boolean;
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  estimatedImpact: string;
  useCase: string;
}

const ADVANCED_CAPABILITIES: AdvancedCapability[] = [
  {
    id: 'clinical-ai',
    name: 'Clinical AI Constellation',
    category: 'ai-ml',
    description: 'Multi-modal AI system with specialized medical models for clinical decision support',
    benefits: [
      '99.02% clinical accuracy',
      'Real-time safety verification',
      'Evidence-based recommendations',
      'Multi-specialty coverage'
    ],
    technologies: ['GPT-4', 'Claude', 'Medical-BERT', 'Custom LLMs'],
    icon: Brain,
    enabled: true,
    complexity: 'expert',
    estimatedImpact: 'Reduces medical errors by 65%',
    useCase: 'Clinical decision support, diagnosis assistance, treatment planning'
  },
  {
    id: 'vr-medical-training',
    name: 'VR/AR Medical Training',
    category: 'immersive',
    description: 'Immersive virtual reality environments for medical education and surgical training',
    benefits: [
      'Risk-free surgical practice',
      'Immersive anatomy learning',
      'Patient scenario simulation',
      'Remote medical education'
    ],
    technologies: ['WebXR', 'Unity', 'Three.js', 'A-Frame'],
    icon: Headphones,
    enabled: false,
    complexity: 'advanced',
    estimatedImpact: 'Improves training effectiveness by 40%',
    useCase: 'Medical education, surgical training, patient education'
  },
  {
    id: 'computer-vision',
    name: 'Medical Computer Vision',
    category: 'ai-ml',
    description: 'AI-powered analysis of medical images including X-rays, MRIs, CT scans, and pathology slides',
    benefits: [
      'Automated diagnosis assistance',
      'Abnormality detection',
      'Image enhancement',
      'Quantitative analysis'
    ],
    technologies: ['TensorFlow', 'PyTorch', 'OpenCV', 'DICOM.js'],
    icon: Eye,
    enabled: false,
    complexity: 'expert',
    estimatedImpact: 'Increases diagnostic accuracy by 25%',
    useCase: 'Radiology, pathology, dermatology, ophthalmology'
  },
  {
    id: 'blockchain-health',
    name: 'Blockchain Health Records',
    category: 'blockchain',
    description: 'Decentralized, secure, and interoperable health record management using blockchain',
    benefits: [
      'Tamper-proof records',
      'Patient-controlled data',
      'Interoperability',
      'Audit trail transparency'
    ],
    technologies: ['Ethereum', 'Hyperledger', 'IPFS', 'Smart Contracts'],
    icon: Lock,
    enabled: false,
    complexity: 'advanced',
    estimatedImpact: 'Improves data security by 80%',
    useCase: 'Electronic health records, medical research, insurance claims'
  },
  {
    id: 'iot-monitoring',
    name: 'IoT Medical Monitoring',
    category: 'iot',
    description: 'Connected medical devices and wearables for continuous patient monitoring',
    benefits: [
      'Real-time vital monitoring',
      'Early warning systems',
      'Remote patient care',
      'Predictive analytics'
    ],
    technologies: ['MQTT', 'LoRaWAN', 'BLE', 'Edge Computing'],
    icon: Wifi,
    enabled: false,
    complexity: 'intermediate',
    estimatedImpact: 'Reduces hospital readmissions by 30%',
    useCase: 'Remote monitoring, chronic disease management, elderly care'
  },
  {
    id: 'precision-medicine',
    name: 'Precision Medicine AI',
    category: 'precision-medicine',
    description: 'Personalized treatment recommendations based on genomics, lifestyle, and medical history',
    benefits: [
      'Personalized treatments',
      'Drug interaction analysis',
      'Genetic risk assessment',
      'Therapy optimization'
    ],
    technologies: ['Genomics APIs', 'ML Pipelines', 'GWAS', 'Pharmacogenomics'],
    icon: Dna,
    enabled: false,
    complexity: 'expert',
    estimatedImpact: 'Improves treatment success by 50%',
    useCase: 'Oncology, rare diseases, pharmacogenomics, preventive care'
  },
  {
    id: 'federated-learning',
    name: 'Federated Learning Network',
    category: 'ai-ml',
    description: 'Collaborative AI training across healthcare institutions while preserving privacy',
    benefits: [
      'Privacy-preserving AI',
      'Collaborative research',
      'Improved model accuracy',
      'Decentralized learning'
    ],
    technologies: ['TensorFlow Federated', 'PySyft', 'Differential Privacy'],
    icon: Network,
    enabled: false,
    complexity: 'expert',
    estimatedImpact: 'Accelerates medical AI development by 60%',
    useCase: 'Multi-institutional research, rare disease studies, drug discovery'
  },
  {
    id: 'digital-therapeutics',
    name: 'Digital Therapeutics Platform',
    category: 'precision-medicine',
    description: 'Evidence-based digital interventions for treating and managing medical conditions',
    benefits: [
      'Evidence-based interventions',
      'Behavioral health support',
      'Adherence tracking',
      'Outcome measurement'
    ],
    technologies: ['React Native', 'ML Models', 'Behavioral Analytics'],
    icon: Smartphone,
    enabled: false,
    complexity: 'intermediate',
    estimatedImpact: 'Improves patient outcomes by 35%',
    useCase: 'Mental health, diabetes management, rehabilitation, addiction treatment'
  }
];

const CAPABILITY_CATEGORIES = [
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: Brain, color: 'text-blue-600' },
  { id: 'immersive', name: 'VR/AR/XR', icon: Headphones, color: 'text-purple-600' },
  { id: 'blockchain', name: 'Blockchain & Web3', icon: Lock, color: 'text-green-600' },
  { id: 'iot', name: 'IoT & Sensors', icon: Wifi, color: 'text-orange-600' },
  { id: 'precision-medicine', name: 'Precision Medicine', icon: Dna, color: 'text-red-600' },
  { id: 'research', name: 'Research & Analytics', icon: TrendingUp, color: 'text-indigo-600' }
];

export default function AdvancedHealthcare() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('ai-ml');
  const [enabledCapabilities, setEnabledCapabilities] = useState<Set<string>>(new Set(['clinical-ai']));

  const enableCapabilityMutation = useMutation({
    mutationFn: async (capabilityId: string) => {
      const response = await fetch('/api/advanced-capabilities/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capabilityId })
      });
      if (!response.ok) throw new Error('Failed to enable capability');
      return response.json();
    },
    onSuccess: (data, capabilityId) => {
      setEnabledCapabilities(prev => new Set([...prev, capabilityId]));
      toast({
        title: "Capability Enabled",
        description: "Advanced healthcare capability has been activated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const filteredCapabilities = ADVANCED_CAPABILITIES.filter(
    cap => selectedCategory === 'all' || cap.category === selectedCategory
  );

  const enabledCount = enabledCapabilities.size;
  const totalCount = ADVANCED_CAPABILITIES.length;
  const completionPercentage = Math.round((enabledCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Advanced Healthcare Platform
            </h1>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Award className="h-3 w-3 mr-1" />
              Next-Gen Technology
            </Badge>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Cutting-edge healthcare technologies including AI constellation, VR/AR training, blockchain records, 
            IoT monitoring, precision medicine, and federated learning networks
          </p>
          
          {/* Platform Progress */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Platform Capabilities</span>
              <span className="text-sm text-gray-600">{enabledCount}/{totalCount}</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {completionPercentage}% of advanced capabilities enabled
            </p>
          </div>
        </div>

        {/* Platform Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">AI Constellation</h3>
              <p className="text-sm text-gray-600">8 specialized medical AI models</p>
              <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">Active</Badge>
            </CardContent>
          </Card>
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <Headphones className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">VR/AR Training</h3>
              <p className="text-sm text-gray-600">Immersive medical education</p>
              <Badge variant="outline">Available</Badge>
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <Lock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Blockchain Records</h3>
              <p className="text-sm text-gray-600">Secure decentralized health data</p>
              <Badge variant="outline">Available</Badge>
            </CardContent>
          </Card>
          <Card className="border-orange-200 dark:border-orange-800">
            <CardContent className="p-4 text-center">
              <Dna className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold">Precision Medicine</h3>
              <p className="text-sm text-gray-600">Personalized treatment AI</p>
              <Badge variant="outline">Available</Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="capabilities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="capabilities">Advanced Capabilities</TabsTrigger>
            <TabsTrigger value="technology">Technology Stack</TabsTrigger>
            <TabsTrigger value="roadmap">Development Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="capabilities" className="space-y-6">
            {/* Category Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Technology Categories</CardTitle>
                <CardDescription>
                  Select a category to explore advanced healthcare capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                    className="h-20 flex-col gap-2"
                  >
                    <Globe className="h-6 w-6" />
                    <span className="text-xs">All</span>
                  </Button>
                  {CAPABILITY_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.id)}
                      className="h-20 flex-col gap-2"
                    >
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                      <span className="text-xs text-center">{category.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Capabilities Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCapabilities.map((capability) => (
                <Card 
                  key={capability.id} 
                  className={`transition-all duration-200 ${
                    enabledCapabilities.has(capability.id) 
                      ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' 
                      : 'hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          enabledCapabilities.has(capability.id) 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <capability.icon className={`h-6 w-6 ${
                            enabledCapabilities.has(capability.id) 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{capability.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`${
                                capability.complexity === 'expert' ? 'border-red-300 text-red-700' :
                                capability.complexity === 'advanced' ? 'border-orange-300 text-orange-700' :
                                capability.complexity === 'intermediate' ? 'border-blue-300 text-blue-700' :
                                'border-green-300 text-green-700'
                              }`}
                            >
                              {capability.complexity}
                            </Badge>
                            {enabledCapabilities.has(capability.id) && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={enabledCapabilities.has(capability.id)}
                        onCheckedChange={(checked) => {
                          if (checked && !enabledCapabilities.has(capability.id)) {
                            enableCapabilityMutation.mutate(capability.id);
                          } else if (!checked) {
                            setEnabledCapabilities(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(capability.id);
                              return newSet;
                            });
                          }
                        }}
                        disabled={enableCapabilityMutation.isPending}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {capability.description}
                    </p>

                    <div>
                      <Label className="text-sm font-medium">Key Benefits</Label>
                      <ul className="mt-1 space-y-1">
                        {capability.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Technologies</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {capability.technologies.map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Impact: {capability.estimatedImpact}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Use Case: {capability.useCase}
                      </p>
                    </div>

                    {!enabledCapabilities.has(capability.id) && (
                      <Button 
                        onClick={() => enableCapabilityMutation.mutate(capability.id)}
                        disabled={enableCapabilityMutation.isPending}
                        className="w-full"
                        size="sm"
                      >
                        {enableCapabilityMutation.isPending ? (
                          <>
                            <Zap className="h-4 w-4 mr-2 animate-spin" />
                            Enabling...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Enable Capability
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technology" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    AI & Machine Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">GPT-4 & Claude</span>
                      <Badge variant="secondary">Production</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medical BERT Models</span>
                      <Badge variant="secondary">Production</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">TensorFlow/PyTorch</span>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Federated Learning</span>
                      <Badge variant="outline">Available</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-600" />
                    Healthcare Standards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">FHIR R4</span>
                      <Badge variant="secondary">Integrated</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">HL7 v2.8</span>
                      <Badge variant="secondary">Integrated</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">SNOMED CT</span>
                      <Badge variant="secondary">Integrated</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">DICOM</span>
                      <Badge variant="outline">Available</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    Security & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">HIPAA Compliance</span>
                      <Badge variant="secondary">Certified</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">SOC 2 Type II</span>
                      <Badge variant="secondary">Certified</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Blockchain Security</span>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Zero-Trust Architecture</span>
                      <Badge variant="outline">Available</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="space-y-8">
              {/* Q3 2025 */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  Q3 2025 - Foundation & Core AI
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <Card className="border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Clinical AI Constellation
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Multi-modal AI system with safety verification
                      </p>
                      <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">Completed</Badge>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Standards Integration
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        FHIR, HL7, SNOMED translation engine
                      </p>
                      <Badge variant="outline">In Progress</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Q4 2025 */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  Q4 2025 - Advanced Technologies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Computer Vision
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Medical imaging AI analysis
                      </p>
                      <Badge variant="outline">Planned</Badge>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Headphones className="h-4 w-4" />
                        VR/AR Training
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Immersive medical education
                      </p>
                      <Badge variant="outline">Planned</Badge>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Blockchain Health
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Decentralized health records
                      </p>
                      <Badge variant="outline">Planned</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Q1 2026 */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  Q1 2026 - Precision & IoT
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Dna className="h-4 w-4" />
                        Precision Medicine
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Genomics-based treatment AI
                      </p>
                      <Badge variant="outline">Future</Badge>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        IoT Monitoring
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Connected medical devices
                      </p>
                      <Badge variant="outline">Future</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}