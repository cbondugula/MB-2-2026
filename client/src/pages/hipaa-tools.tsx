import { useState, useEffect } from "react";
import TopNavigation from "@/components/TopNavigation";
import LeftSidebar from "@/components/LeftSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  ScanLine, 
  FileText, 
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  Lock,
  Key,
  Database,
  Activity,
  Users,
  Clock,
  Settings
} from "lucide-react";

export default function HIPAATools() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [complianceScore, setComplianceScore] = useState(92);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleSecurityScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          toast({
            title: "Security Scan Complete",
            description: "Your application passed all HIPAA compliance checks.",
            variant: "default",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const complianceItems = [
    { name: "Data Encryption", status: "passed", icon: Lock },
    { name: "Access Control", status: "passed", icon: Key },
    { name: "Audit Logging", status: "passed", icon: Activity },
    { name: "Data Backup", status: "passed", icon: Database },
    { name: "User Authentication", status: "passed", icon: Users },
    { name: "Session Management", status: "warning", icon: Clock },
    { name: "Data Masking", status: "passed", icon: Eye },
    { name: "Network Security", status: "passed", icon: Shield },
  ];

  const auditLogs = [
    { id: 1, action: "Data Access", user: "Dr. Smith", timestamp: "2025-01-18 10:30 AM", resource: "Patient Record #12345" },
    { id: 2, action: "Data Modification", user: "Nurse Johnson", timestamp: "2025-01-18 09:15 AM", resource: "Appointment Schedule" },
    { id: 3, action: "Login Attempt", user: "Admin User", timestamp: "2025-01-18 08:45 AM", resource: "System Dashboard" },
    { id: 4, action: "Data Export", user: "Dr. Wilson", timestamp: "2025-01-18 08:30 AM", resource: "Lab Results" },
    { id: 5, action: "Configuration Change", user: "IT Admin", timestamp: "2025-01-18 07:20 AM", resource: "Security Settings" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-medical-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-slate-600">Loading HIPAA Tools...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <TopNavigation />
      
      <div className="flex h-screen">
        <LeftSidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-medical-blue-500" />
                  <h1 className="text-xl font-bold text-slate-900">HIPAA Compliance Tools</h1>
                </div>
                <Badge variant="secondary" className="bg-trust-green-100 text-trust-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Compliant
                </Badge>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-trust-green-500" />
                    <span>Compliance Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-trust-green-600 mb-2">{complianceScore}%</div>
                    <Progress value={complianceScore} className="w-full h-2 mb-2" />
                    <p className="text-sm text-slate-600">Excellent compliance rating</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-medical-blue-500" />
                    <span>Security Checks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-medical-blue-600 mb-2">7/8</div>
                    <p className="text-sm text-slate-600 mb-2">Checks passed</p>
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                      1 Warning
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-healthcare-teal-500" />
                    <span>Audit Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-healthcare-teal-600 mb-2">247</div>
                    <p className="text-sm text-slate-600 mb-2">Events logged today</p>
                    <Badge variant="outline" className="bg-trust-green-50 text-trust-green-600 border-trust-green-200">
                      All Secure
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tools Tabs */}
            <Tabs defaultValue="security-scan" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="security-scan">Security Scan</TabsTrigger>
                <TabsTrigger value="compliance">Compliance Check</TabsTrigger>
                <TabsTrigger value="audit-trail">Audit Trail</TabsTrigger>
                <TabsTrigger value="baa-generator">BAA Generator</TabsTrigger>
              </TabsList>

              {/* Security Scan Tab */}
              <TabsContent value="security-scan" className="space-y-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ScanLine className="w-5 h-5 text-medical-blue-500" />
                      <span>Security Vulnerability Scan</span>
                    </CardTitle>
                    <p className="text-slate-600">
                      Scan your application for potential security vulnerabilities and HIPAA compliance issues.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isScanning && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Scanning in progress...</span>
                          <span className="text-sm font-semibold text-medical-blue-600">{scanProgress}%</span>
                        </div>
                        <Progress value={scanProgress} className="w-full h-2" />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">Last Scan Results</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">High Risk Issues</span>
                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">0</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Medium Risk Issues</span>
                            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">1</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Low Risk Issues</span>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">2</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">Scan Coverage</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">API Endpoints</span>
                            <CheckCircle className="w-4 h-4 text-trust-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Database Queries</span>
                            <CheckCircle className="w-4 h-4 text-trust-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Authentication</span>
                            <CheckCircle className="w-4 h-4 text-trust-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleSecurityScan}
                      disabled={isScanning}
                      className="w-full bg-medical-blue-500 hover:bg-medical-blue-600"
                    >
                      {isScanning ? (
                        <>
                          <ScanLine className="w-4 h-4 mr-2 animate-pulse" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <ScanLine className="w-4 h-4 mr-2" />
                          Start Security Scan
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Compliance Check Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ClipboardCheck className="w-5 h-5 text-trust-green-500" />
                      <span>HIPAA Compliance Checklist</span>
                    </CardTitle>
                    <p className="text-slate-600">
                      Review your application's compliance with HIPAA requirements.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {complianceItems.map((item) => (
                        <div key={item.name} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.status === 'passed' ? 'bg-trust-green-100' : 'bg-orange-100'
                          }`}>
                            <item.icon className={`w-4 h-4 ${
                              item.status === 'passed' ? 'text-trust-green-500' : 'text-orange-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-900">{item.name}</span>
                              {item.status === 'passed' ? (
                                <CheckCircle className="w-4 h-4 text-trust-green-500" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                              )}
                            </div>
                            <p className="text-sm text-slate-600">
                              {item.status === 'passed' ? 'Compliant' : 'Needs attention'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Audit Trail Tab */}
              <TabsContent value="audit-trail" className="space-y-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-healthcare-teal-500" />
                      <span>Audit Trail</span>
                    </CardTitle>
                    <p className="text-slate-600">
                      Monitor all data access and modifications for compliance tracking.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                          <div className="w-10 h-10 bg-healthcare-teal-100 rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-healthcare-teal-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-900">{log.action}</span>
                              <span className="text-sm text-slate-500">{log.timestamp}</span>
                            </div>
                            <p className="text-sm text-slate-600">
                              User: {log.user} • Resource: {log.resource}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-center">
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Audit Log
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* BAA Generator Tab */}
              <TabsContent value="baa-generator" className="space-y-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-medical-blue-500" />
                      <span>Business Associate Agreement Generator</span>
                    </CardTitle>
                    <p className="text-slate-600">
                      Generate compliant Business Associate Agreements for your healthcare partners.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-3">Standard BAA Template</h4>
                        <p className="text-sm text-slate-600 mb-4">
                          Pre-configured template compliant with HIPAA requirements for standard business associate relationships.
                        </p>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download Template
                        </Button>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-3">Custom BAA Generator</h4>
                        <p className="text-sm text-slate-600 mb-4">
                          Create a customized Business Associate Agreement based on your specific requirements.
                        </p>
                        <Button variant="outline" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          Create Custom BAA
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-trust-green-50 border border-trust-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-trust-green-500" />
                        <span className="font-semibold text-trust-green-700">BAA Compliance Features</span>
                      </div>
                      <ul className="text-sm text-trust-green-600 space-y-1">
                        <li>• Automated compliance clause generation</li>
                        <li>• Regular template updates for regulatory changes</li>
                        <li>• Legal review and validation</li>
                        <li>• Electronic signature integration</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
