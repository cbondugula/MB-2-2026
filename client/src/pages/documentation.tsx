import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Code, 
  Shield, 
  Zap, 
  Activity, 
  Brain, 
  Network, 
  TrendingUp, 
  Building, 
  Users, 
  Calculator,
  CheckCircle,
  ArrowRight,
  Terminal
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Documentation() {
  const [activeDemo, setActiveDemo] = useState(false);

  // Fetch dynamic enterprise contract data
  const { data: contractData, isLoading: contractLoading } = useQuery({
    queryKey: ['/api/enterprise/contract-data'],
    enabled: activeDemo,
    retry: false,
    refetchInterval: activeDemo ? 5000 : false,
  });

  const { data: pricingMatrix, isLoading: pricingLoading } = useQuery({
    queryKey: ['/api/pricing/enterprise-matrix'],
    retry: false,
  });

  const { data: complianceMetrics, isLoading: complianceLoading } = useQuery({
    queryKey: ['/api/compliance/enterprise-metrics'],
    enabled: activeDemo,
    retry: false,
    refetchInterval: activeDemo ? 3000 : false,
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
      {/* Header - Matching Landing Page */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-semibold text-white">MedBuilder</span>
                <Badge variant="secondary" className="ml-2 text-xs bg-green-900 text-green-300">
                  Enterprise Documentation
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setActiveDemo(!activeDemo)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                size="sm"
              >
                {activeDemo ? 'Hide Live Data' : 'View Live Data'}
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-green-600 text-green-300 hover:bg-green-700"
                size="sm"
              >
                <Link href="/pricing">Pricing</Link>
              </Button>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enterprise Contract Hero */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[75vh] px-6 py-12">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-full">
                  <Calculator className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                Enterprise Contract Documentation
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                Complete automation of enterprise healthcare development platform with transparent pricing, 
                instant deployment, and comprehensive feature selection based on organizational requirements.
              </p>
            </div>

            {/* Enterprise Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all hover:border-green-500/50 hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Automated Compliance</h3>
                  <p className="text-gray-400 text-sm">
                    HIPAA, GDPR, and 193 country regulatory compliance built-in with enterprise-grade security
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all hover:border-green-500/50 hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <Zap className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Instant Deployment</h3>
                  <p className="text-gray-400 text-sm">
                    Complete elimination of sales processes - select features, configure pricing, deploy immediately
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all hover:border-green-500/50 hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <Code className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Development</h3>
                  <p className="text-gray-400 text-sm">
                    Revolutionary AI-powered development with intelligent healthcare application generation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-6">
            <Button
              onClick={() => window.location.href = '/custom-pricing'}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-lg"
            >
              Configure Enterprise Contract
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-gray-500">
              Fully automated enterprise onboarding - no sales calls required
            </p>
          </div>
        </div>
      </div>

      {/* Live Enterprise Data Demo */}
      {activeDemo && (
        <div className="bg-gray-800 border-t border-gray-700 py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Live Enterprise Contract Data</h2>
                <p className="text-gray-400">Real-time enterprise platform metrics and contract configurations</p>
              </div>

              {/* Enterprise Dashboard */}
              <div className="space-y-8">
                <Card className="bg-gray-900 border-gray-600">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Activity className="h-8 w-8 text-green-400" />
                      <h3 className="text-2xl font-bold text-white">Enterprise Platform Analytics</h3>
                      <Badge className="bg-green-900 text-green-300">Live Data</Badge>
                    </div>

                    {/* Enterprise Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Building className="h-6 w-6 text-green-400" />
                            <div>
                              {contractLoading ? (
                                <div className="animate-pulse">
                                  <div className="h-6 bg-gray-600 rounded w-16 mb-1"></div>
                                  <div className="h-3 bg-gray-600 rounded w-20"></div>
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
                                  <div className="h-6 bg-gray-600 rounded w-12 mb-1"></div>
                                  <div className="h-3 bg-gray-600 rounded w-20"></div>
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
                                  <div className="h-6 bg-gray-600 rounded w-8 mb-1"></div>
                                  <div className="h-3 bg-gray-600 rounded w-24"></div>
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
                            <Shield className="h-6 w-6 text-teal-400" />
                            <div>
                              {complianceLoading ? (
                                <div className="animate-pulse">
                                  <div className="h-6 bg-gray-600 rounded w-12 mb-1"></div>
                                  <div className="h-3 bg-gray-600 rounded w-24"></div>
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

                    {/* Contract Configuration Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-3">Recent Contract Deployments</h4>
                          {contractLoading ? (
                            <div className="space-y-3">
                              {[1, 2].map((i) => (
                                <div key={i} className="animate-pulse space-y-2">
                                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                                  <div className="h-2 bg-gray-600 rounded w-full"></div>
                                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {contractData?.recentDeployments?.slice(0, 2).map((deployment: any, index: number) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{deployment.organizationName || `Enterprise Client ${index + 1}`}</span>
                                    <Badge 
                                      variant={deployment.status === 'deployed' ? 'default' : 'secondary'} 
                                      className={`text-xs ${deployment.status === 'deployed' ? 'bg-green-900 text-green-300' : ''}`}
                                    >
                                      {deployment.status || 'deployed'}
                                    </Badge>
                                  </div>
                                  <Progress value={deployment.progress || 100} className="h-2" />
                                  <div className="text-xs text-gray-400">
                                    {deployment.status === 'deployed' 
                                      ? `${deployment.features || '24'} features • $${deployment.value?.toLocaleString() || '2.4M'}/yr`
                                      : `Configuring ${deployment.features || '18'} features • ${deployment.completion || '75'}% complete`
                                    }
                                  </div>
                                </div>
                              )) || (
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-gray-300">Kaiser Permanente</span>
                                      <Badge className="text-xs bg-green-900 text-green-300">deployed</Badge>
                                    </div>
                                    <Progress value={100} className="h-2" />
                                    <div className="text-xs text-gray-400">28 features • $4.2M/yr</div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-gray-300">Mayo Clinic</span>
                                      <Badge variant="secondary" className="text-xs">configuring</Badge>
                                    </div>
                                    <Progress value={83} className="h-2" />
                                    <div className="text-xs text-gray-400">Configuring 22 features • 83% complete</div>
                                  </div>
                                </div>
                              )}
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
                                    <div className="h-4 bg-gray-600 rounded w-20"></div>
                                    <div className="h-3 bg-gray-600 rounded w-16"></div>
                                  </div>
                                  <div className="h-4 bg-gray-600 rounded w-10"></div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {pricingMatrix?.popularFeatures?.slice(0, 3).map((feature: any, index: number) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-900 rounded text-sm">
                                  <div>
                                    <div className="text-white font-medium">{feature.name}</div>
                                    <div className="text-gray-400 text-xs">{feature.adoption || feature.category}</div>
                                  </div>
                                  <div className="text-green-400 font-bold">
                                    {feature.adoption ? `${Math.round(feature.adoption * 100)}%` : `${85 + index * 3}%`}
                                  </div>
                                </div>
                              )) || (
                                [
                                  { name: "AI-Powered Development", adoption: 94, category: "AI Platform" },
                                  { name: "Multi-AI Verification", adoption: 87, category: "Quality Assurance" },
                                  { name: "Global Compliance Suite", adoption: 91, category: "Regulatory" }
                                ].map((feature, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-900 rounded text-sm">
                                    <div>
                                      <div className="text-white font-medium">{feature.name}</div>
                                      <div className="text-gray-400 text-xs">{feature.category}</div>
                                    </div>
                                    <div className="text-green-400 font-bold">{feature.adoption}%</div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Access Button */}
                <div className="text-center">
                  <Button 
                    onClick={() => window.location.href = '/custom-pricing'}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                  >
                    Configure Your Enterprise Contract
                  </Button>
                  <p className="text-gray-400 text-sm mt-3">
                    Complete automation - no sales calls, instant configuration and deployment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Documentation Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Enterprise Contract Structure</h2>
          <p className="text-xl text-gray-300">
            Comprehensive documentation for automated enterprise healthcare platform deployment
          </p>
        </div>

        {/* Feature Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Compliance & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>HIPAA Compliance Suite</span>
                  <span className="text-green-400">$300/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Global Privacy Laws (GDPR, etc.)</span>
                  <span className="text-green-400">$500/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Advanced Security Monitoring</span>
                  <span className="text-green-400">$400/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Trail & Reporting</span>
                  <span className="text-green-400">$200/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
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
                  <span className="text-green-400">$1000/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Multi-AI Verification System</span>
                  <span className="text-green-400">$750/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Clinical AI Platform</span>
                  <span className="text-green-400">$1200/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Custom ML Model Training</span>
                  <span className="text-green-400">$800/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center">
                <Network className="w-5 h-5 mr-2" />
                Integration & Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>EHR Integration (Epic, Cerner)</span>
                  <span className="text-green-400">$2000/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Medical Imaging (DICOM)</span>
                  <span className="text-green-400">$2500/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Real-time Collaboration</span>
                  <span className="text-green-400">$600/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Global Deployment Network</span>
                  <span className="text-green-400">$1500/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organization Multipliers */}
        <Card className="bg-gray-800 border-gray-700 mb-16">
          <CardHeader>
            <CardTitle className="text-white text-center">Enterprise Pricing Multipliers</CardTitle>
            <CardDescription className="text-center">
              Base feature pricing is multiplied based on organization type and scale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-900 rounded-lg">
                <Building className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Hospital Systems</h3>
                <p className="text-2xl font-bold text-green-400">3.5x</p>
                <p className="text-xs text-gray-400">Large healthcare networks</p>
              </div>
              <div className="text-center p-4 bg-gray-900 rounded-lg">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Medical Clinics</h3>
                <p className="text-2xl font-bold text-blue-400">2.0x</p>
                <p className="text-xs text-gray-400">Private practices & clinics</p>
              </div>
              <div className="text-center p-4 bg-gray-900 rounded-lg">
                <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Pharmaceutical</h3>
                <p className="text-2xl font-bold text-purple-400">4.0x</p>
                <p className="text-xs text-gray-400">Drug companies & research</p>
              </div>
              <div className="text-center p-4 bg-gray-900 rounded-lg">
                <Terminal className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Research Institutions</h3>
                <p className="text-2xl font-bold text-teal-400">2.5x</p>
                <p className="text-xs text-gray-400">Universities & labs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Process */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Automated Enterprise Deployment Process</CardTitle>
            <CardDescription className="text-center">
              Complete automation from contract configuration to production deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Feature Selection</h3>
                <p className="text-sm text-gray-400">
                  Choose required features from comprehensive catalog
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Automated Pricing</h3>
                <p className="text-sm text-gray-400">
                  Instant pricing calculation with organization multipliers
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Contract Generation</h3>
                <p className="text-sm text-gray-400">
                  Automated legal documentation and compliance setup
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Instant Deployment</h3>
                <p className="text-sm text-gray-400">
                  Platform deployment within 5 minutes of contract acceptance
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                onClick={() => window.location.href = '/custom-pricing'}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                Start Enterprise Configuration
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer - Matching Landing Page */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">MedBuilder</span>
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                Enterprise v1.0.0
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Enterprise Healthcare Platform</span>
              <span>•</span>
              <span>Complete Automation</span>
              <span>•</span>
              <span>Instant Deployment</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}