import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, 
  Zap, 
  Activity, 
  Brain, 
  TrendingUp, 
  Building, 
  Users,
  CheckCircle,
  ArrowRight,
  Code,
  Book,
  FileText
} from "lucide-react";
import { Link } from "wouter";

interface ContractData {
  activeContracts?: number;
  averageContractValue?: number;
  deploymentTime?: string;
  recentDeployments?: Array<{
    organizationName?: string;
    status?: string;
    progress?: number;
    features?: string;
    value?: number;
    completion?: string;
  }>;
}

interface ComplianceMetrics {
  globalCompliance?: number;
}

interface Feature {
  name: string;
  adoption?: number;
  category?: string;
}

interface PricingMatrix {
  popularFeatures?: Feature[];
}

export default function Documentation() {
  const [activeDemo, setActiveDemo] = useState(false);

  const { data: contractData, isLoading: contractLoading } = useQuery<ContractData>({
    queryKey: ['/api/enterprise/contract-data'],
    enabled: activeDemo,
    retry: false,
    refetchInterval: activeDemo ? 5000 : false,
  });

  const { data: pricingMatrix, isLoading: pricingLoading } = useQuery<PricingMatrix>({
    queryKey: ['/api/pricing/enterprise-matrix'],
    retry: false,
  });

  const { data: complianceMetrics, isLoading: complianceLoading } = useQuery<ComplianceMetrics>({
    queryKey: ['/api/compliance/enterprise-metrics'],
    enabled: activeDemo,
    retry: false,
    refetchInterval: activeDemo ? 3000 : false,
  });

  const headerActions = (
    <>
      <Button 
        onClick={() => setActiveDemo(!activeDemo)}
        variant="outline"
        size="sm"
        className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800"
      >
        {activeDemo ? 'Hide Live Data' : 'View Live Data'}
      </Button>
      <Button 
        asChild
        variant="outline"
        size="sm"
        className="bg-gray-900 border-[#76B900] text-[#8CC63F] hover:bg-[#1a3d00]/50"
      >
        <Link href="/pricing">Pricing</Link>
      </Button>
    </>
  );

  return (
    <PageLayout 
      title="Documentation" 
      description="Enterprise Contract Documentation and Platform Guide"
      headerActions={headerActions}
    >
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-[#76B900] to-blue-600 p-4 rounded-full">
            <Book className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-[#76B900] to-blue-400 bg-clip-text text-transparent leading-tight mb-4">
          Enterprise Contract Documentation
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Complete automation of enterprise healthcare development platform with transparent pricing,
          instant deployment, and comprehensive feature selection.
        </p>
      </div>

      {/* Enterprise Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gray-900 border-gray-800 hover:border-[#76B900] transition-all">
          <CardContent className="p-8 text-center">
            <Shield className="w-8 h-8 text-[#76B900] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Automated Compliance</h3>
            <p className="text-gray-400 text-sm">
              HIPAA, GDPR, and 193 country regulatory compliance built-in with enterprise-grade security
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-[#76B900] transition-all">
          <CardContent className="p-8 text-center">
            <Zap className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Instant Deployment</h3>
            <p className="text-gray-400 text-sm">
              Complete elimination of sales processes - select features, configure pricing, deploy immediately
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-[#76B900] transition-all">
          <CardContent className="p-8 text-center">
            <Code className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Development</h3>
            <p className="text-gray-400 text-sm">
              Revolutionary AI-powered development with intelligent healthcare application generation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Enterprise Data */}
      {activeDemo && (
        <Card className="bg-gray-900 border-gray-800 mb-12">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="h-8 w-8 text-[#76B900]" />
              <h3 className="text-2xl font-bold text-white">Enterprise Platform Analytics</h3>
              <Badge className="bg-[#1a3d00]/50 text-[#8CC63F] border-[#76B900]">Live Data</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-6 w-6 text-[#76B900]" />
                    <div>
                      {contractLoading ? (
                        <div className="animate-pulse">
                          <div className="h-6 bg-gray-700 rounded w-16 mb-1"></div>
                          <div className="h-3 bg-gray-700 rounded w-20"></div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xl font-bold text-white">
                            {contractData?.activeContracts?.toLocaleString() || '247'}
                          </p>
                          <p className="text-xs text-gray-400">Enterprise Contracts</p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                    <div>
                      {contractLoading ? (
                        <div className="animate-pulse">
                          <div className="h-6 bg-gray-700 rounded w-12 mb-1"></div>
                          <div className="h-3 bg-gray-700 rounded w-20"></div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xl font-bold text-white">
                            {contractData?.averageContractValue ? `$${(contractData.averageContractValue / 1000).toFixed(0)}K` : '$2.4M'}
                          </p>
                          <p className="text-xs text-gray-400">Avg Contract Value</p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-purple-400" />
                    <div>
                      {contractLoading ? (
                        <div className="animate-pulse">
                          <div className="h-6 bg-gray-700 rounded w-8 mb-1"></div>
                          <div className="h-3 bg-gray-700 rounded w-24"></div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xl font-bold text-white">
                            {contractData?.deploymentTime || '5.2'}min
                          </p>
                          <p className="text-xs text-gray-400">Avg Deployment Time</p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-[#76B900]" />
                    <div>
                      {complianceLoading ? (
                        <div className="animate-pulse">
                          <div className="h-6 bg-gray-700 rounded w-12 mb-1"></div>
                          <div className="h-3 bg-gray-700 rounded w-24"></div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xl font-bold text-white">
                            {complianceMetrics?.globalCompliance ? `${Math.round(complianceMetrics.globalCompliance * 100)}%` : '98%'}
                          </p>
                          <p className="text-xs text-gray-400">Global Compliance</p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-white mb-3">Recent Contract Deployments</h4>
                  {contractLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-700 rounded w-full"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(contractData?.recentDeployments?.slice(0, 2) || [
                        { organizationName: 'Kaiser Permanente', status: 'deployed', features: '28', value: 4200000 },
                        { organizationName: 'Mayo Clinic', status: 'configuring', features: '22', completion: '83', progress: 83 }
                      ]).map((deployment, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">{deployment.organizationName}</span>
                            <Badge className={`text-xs ${deployment.status === 'deployed' ? 'bg-[#1a3d00]/50 text-[#8CC63F] border-[#76B900]' : 'bg-gray-700 text-gray-300'}`}>
                              {deployment.status}
                            </Badge>
                          </div>
                          <Progress value={deployment.progress || 100} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {deployment.status === 'deployed'
                              ? `${deployment.features} features • $${(deployment.value || 0).toLocaleString()}/yr`
                              : `Configuring ${deployment.features} features • ${deployment.completion}% complete`
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-white mb-3">Popular Enterprise Features</h4>
                  {pricingLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex justify-between items-center p-2 bg-gray-900 rounded">
                          <div className="space-y-1">
                            <div className="h-4 bg-gray-700 rounded w-20"></div>
                            <div className="h-3 bg-gray-700 rounded w-16"></div>
                          </div>
                          <div className="h-4 bg-gray-700 rounded w-10"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(pricingMatrix?.popularFeatures?.slice(0, 3) || [
                        { name: "AI-Powered Development", adoption: 0.94, category: "AI Platform" },
                        { name: "Multi-AI Verification", adoption: 0.87, category: "Quality Assurance" },
                        { name: "Global Compliance Suite", adoption: 0.91, category: "Regulatory" }
                      ]).map((feature, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-900 rounded text-sm">
                          <div>
                            <div className="text-white font-medium">{feature.name}</div>
                            <div className="text-gray-500 text-xs">{feature.category}</div>
                          </div>
                          <div className="text-[#76B900] font-bold">
                            {feature.adoption ? `${Math.round(feature.adoption * 100)}%` : '85%'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentation Sections */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-6">Enterprise Contract Structure</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#76B900] flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Compliance & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>HIPAA Compliance Suite</span>
                  <span className="text-[#76B900]">$300/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Global Privacy Laws (GDPR, etc.)</span>
                  <span className="text-[#76B900]">$500/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Advanced Security Monitoring</span>
                  <span className="text-[#76B900]">$400/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Trail & Reporting</span>
                  <span className="text-[#76B900]">$200/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Development Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>AI-Powered Development</span>
                  <span className="text-[#76B900]">$1000/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Multi-AI Verification System</span>
                  <span className="text-[#76B900]">$750/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Clinical AI Platform</span>
                  <span className="text-[#76B900]">$1200/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Custom ML Model Training</span>
                  <span className="text-[#76B900]">$800/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Documentation & Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>API Documentation</span>
                  <span className="text-[#76B900]">Included</span>
                </div>
                <div className="flex justify-between">
                  <span>Integration Guides</span>
                  <span className="text-[#76B900]">Included</span>
                </div>
                <div className="flex justify-between">
                  <span>24/7 Enterprise Support</span>
                  <span className="text-[#76B900]">$500/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Dedicated Success Manager</span>
                  <span className="text-[#76B900]">$1000/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-[#1a3d00]/30 border-[#76B900]">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="w-6 h-6 text-[#76B900]" />
            <h3 className="text-2xl font-bold text-white">Ready to Get Started?</h3>
          </div>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Complete automation - no sales calls required. Configure your enterprise contract and deploy immediately.
          </p>
          <Button
            asChild
            className="bg-[#76B900] hover:bg-[#76B900] text-white px-8 py-3 text-lg"
          >
            <Link href="/pricing">
              Configure Enterprise Contract
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
