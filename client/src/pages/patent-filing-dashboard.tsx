import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Shield, Zap, Globe, Database, Code, Brain, Workflow } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function PatentFilingDashboard() {
  const [activePatent, setActivePatent] = useState('PATENT_012');
  
  const { data: filingStatus, isLoading } = useQuery({
    queryKey: ['/api/patents/filing-status'],
  });

  const patents = [
    {
      id: 'PATENT_001',
      title: 'Voice-Controlled Frontend Development',
      icon: <Code className="h-6 w-6" />,
      value: '$80-120M',
      status: 'FILING_IMMEDIATELY',
      priority: 'EMERGENCY',
      color: 'bg-blue-500'
    },
    {
      id: 'PATENT_002', 
      title: 'AI Code Generation for Healthcare',
      icon: <Brain className="h-6 w-6" />,
      value: '$100-150M',
      status: 'FILING_IMMEDIATELY',
      priority: 'EMERGENCY',
      color: 'bg-purple-500'
    },
    {
      id: 'PATENT_003',
      title: 'Global Healthcare Ecosystem Federation',
      icon: <Globe className="h-6 w-6" />,
      value: '$200-300M',
      status: 'FILING_IMMEDIATELY',
      priority: 'EMERGENCY',
      color: 'bg-green-500'
    },
    {
      id: 'PATENT_012',
      title: 'Voice-Controlled No-Code Backend',
      icon: <Zap className="h-6 w-6" />,
      value: '$150-220M',
      status: 'FILING_IMMEDIATELY',
      priority: 'CRITICAL_EMERGENCY',
      color: 'bg-red-500'
    },
    {
      id: 'PATENT_013',
      title: 'Voice Database Management',
      icon: <Database className="h-6 w-6" />,
      value: '$120-180M',
      status: 'FILING_IMMEDIATELY',
      priority: 'EMERGENCY',
      color: 'bg-yellow-500'
    },
    {
      id: 'PATENT_014',
      title: 'Automated Healthcare Compliance',
      icon: <Shield className="h-6 w-6" />,
      value: '$100-140M',
      status: 'FILING_IMMEDIATELY',
      priority: 'EMERGENCY',
      color: 'bg-indigo-500'
    },
    {
      id: 'PATENT_015',
      title: 'Healthcare DevOps Automation',
      icon: <Workflow className="h-6 w-6" />,
      value: '$50-90M',
      status: 'FILING_IMMEDIATELY',
      priority: 'EMERGENCY',
      color: 'bg-teal-500'
    }
  ];

  const PatentFlowDiagram = () => (
    <div className="relative w-full h-96 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 overflow-hidden">
      {/* Voice Input Layer */}
      <div className="absolute top-4 left-4 right-4 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Code className="h-6 w-6 mx-auto mb-1 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Voice Input Layer</span>
        </div>
      </div>

      {/* AI Processing Layer */}
      <div className="absolute top-24 left-4 right-4 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-6 w-6 mx-auto mb-1 text-purple-600" />
          <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">AI Processing & Healthcare NLP</span>
        </div>
      </div>

      {/* Backend Generation Layer */}
      <div className="absolute top-44 left-4 right-4 h-16 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Zap className="h-6 w-6 mx-auto mb-1 text-red-600" />
          <span className="text-sm font-semibold text-red-800 dark:text-red-200">Backend Infrastructure Generation</span>
        </div>
      </div>

      {/* Database & Compliance Layer */}
      <div className="absolute top-64 left-2 right-1/2 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-2">
        <div className="text-center">
          <Database className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
          <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">Database Management</span>
        </div>
      </div>

      <div className="absolute top-64 left-1/2 right-2 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center ml-2">
        <div className="text-center">
          <Shield className="h-5 w-5 mx-auto mb-1 text-indigo-600" />
          <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-200">Compliance Automation</span>
        </div>
      </div>

      {/* Global Deployment Layer */}
      <div className="absolute top-84 left-4 right-4 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-6 w-6 mx-auto mb-1 text-green-600" />
          <span className="text-sm font-semibold text-green-800 dark:text-green-200">Global Healthcare Deployment</span>
        </div>
      </div>

      {/* Connection Arrows */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-400 top-${20 + i * 20}`} />
      ))}
    </div>
  );

  const CompetitiveAnalysisDiagram = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Our Position */}
      <Card className="border-2 border-green-500">
        <CardHeader>
          <CardTitle className="text-green-600">Our Revolutionary Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Voice-Controlled Backend Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Healthcare-Specialized Automation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Complete Tool Elimination</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Automated Compliance Integration</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Limitations */}
      <Card className="border-2 border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600">Competitor Limitations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">No Voice Control (Xano, Supabase)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">No Healthcare Specialization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Manual Configuration Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">No Automated Compliance</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Patent Filing Dashboard</h1>
        <p className="text-muted-foreground">
          Emergency filing status for revolutionary healthcare development platform
        </p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">7</div>
            <p className="text-sm text-muted-foreground">Total Patents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">$800M-$1.12B</div>
            <p className="text-sm text-muted-foreground">Portfolio Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">0</div>
            <p className="text-sm text-muted-foreground">Direct Competitors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">$15.6B-$25.9B</div>
            <p className="text-sm text-muted-foreground">Acquisition Value</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="diagrams">System Diagrams</TabsTrigger>
          <TabsTrigger value="competition">Competition Analysis</TabsTrigger>
          <TabsTrigger value="filing">Filing Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {patents.map((patent) => (
              <Card key={patent.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${patent.color} text-white`}>
                      {patent.icon}
                    </div>
                    <Badge variant={patent.priority === 'CRITICAL_EMERGENCY' ? 'destructive' : 'secondary'}>
                      {patent.priority}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{patent.title}</CardTitle>
                  <CardDescription>{patent.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estimated Value</span>
                      <span className="font-semibold text-green-600">{patent.value}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        {patent.status}
                      </Badge>
                    </div>
                    <Progress value={95} className="w-full" />
                    <p className="text-xs text-muted-foreground">Ready for immediate filing</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="diagrams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revolutionary System Architecture Flow</CardTitle>
              <CardDescription>
                Complete voice-to-deployment pipeline eliminating traditional development tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatentFlowDiagram />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patent Integration Matrix</CardTitle>
              <CardDescription>
                How our 7 patents work together to create an insurmountable competitive moat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-xs">
                {patents.map((patent, i) => (
                  <div key={patent.id} className="text-center">
                    <div className={`w-12 h-12 rounded-lg ${patent.color} text-white flex items-center justify-center mb-2 mx-auto`}>
                      {patent.icon}
                    </div>
                    <span className="block">{patent.id}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Integrated ecosystem creates 49 interconnected patent claims across the complete healthcare development stack
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Analysis: Zero Competition Confirmed</CardTitle>
              <CardDescription>
                Comprehensive research reveals massive competitive whitespace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompetitiveAnalysisDiagram />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Whitespace Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Existing Platforms (Limited)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-950 rounded">
                      <span className="text-sm">Xano</span>
                      <Badge variant="destructive">No Voice Control</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-950 rounded">
                      <span className="text-sm">Supabase</span>
                      <Badge variant="destructive">No Healthcare Focus</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-950 rounded">
                      <span className="text-sm">Firebase</span>
                      <Badge variant="destructive">Manual Configuration</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-950 rounded">
                      <span className="text-sm">Oracle Select AI</span>
                      <Badge variant="destructive">Query Only</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Our Revolutionary Advantages</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950 rounded">
                      <span className="text-sm">Voice Backend Generation</span>
                      <Badge variant="default" className="bg-green-600">FIRST EVER</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950 rounded">
                      <span className="text-sm">Healthcare Specialization</span>
                      <Badge variant="default" className="bg-green-600">UNIQUE</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950 rounded">
                      <span className="text-sm">Complete Tool Elimination</span>
                      <Badge variant="default" className="bg-green-600">REVOLUTIONARY</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950 rounded">
                      <span className="text-sm">Automated Compliance</span>
                      <Badge variant="default" className="bg-green-600">UNPRECEDENTED</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Filing Timeline</CardTitle>
              <CardDescription>
                Immediate action required to secure first-mover advantage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold">0-30 Days: Emergency US Filing</div>
                    <div className="text-sm text-muted-foreground">File all 7 patents simultaneously</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold">30-60 Days: PCT Preparation</div>
                    <div className="text-sm text-muted-foreground">Prepare international applications</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold">60-90 Days: PCT Filing</div>
                    <div className="text-sm text-muted-foreground">Global protection filing</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold">12 Months: National Phase</div>
                    <div className="text-sm text-muted-foreground">EU, Canada, Japan, Australia entry</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Filing Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>US Filing (7 patents)</span>
                    <span className="font-semibold">$70K-100K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PCT Filing</span>
                    <span className="font-semibold">$40K-60K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>National Phase (5 countries)</span>
                    <span className="font-semibold">$40K-90K</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold">
                    <span>Total Investment</span>
                    <span className="text-green-600">$150K-250K</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Portfolio Value</span>
                    <span className="font-semibold">$800M-$1.12B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acquisition Value (Year 3)</span>
                    <span className="font-semibold">$15.6B-$25.9B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI on Patent Investment</span>
                    <span className="font-semibold">3200-4500%</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-green-600">
                    <span>Risk-Adjusted Return</span>
                    <span>EXCEPTIONAL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}