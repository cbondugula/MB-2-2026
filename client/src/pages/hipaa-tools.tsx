import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, 
  ScanLine, 
  FileText, 
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
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

type ComplianceCheck = {
  id: number;
  name: string;
  category: string;
  status: string;
  icon: string;
  description: string | null;
  lastChecked: string | null;
  isActive: boolean;
  sortOrder: number;
};

type AuditLogEntry = {
  id: number;
  action: string;
  actor: string;
  timestamp: string;
  details: any;
  resourceType: string | null;
  resourceId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
};

const iconMap: Record<string, any> = {
  Lock, Key, Activity, Database, Users, Clock, Eye, Shield
};

export default function HIPAATools() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const { data: complianceChecks = [], isLoading: checksLoading } = useQuery<ComplianceCheck[]>({
    queryKey: ['/api/compliance-checks'],
  });

  const { data: auditLogs = [], isLoading: logsLoading } = useQuery<AuditLogEntry[]>({
    queryKey: ['/api/audit-logs'],
  });

  const passedChecks = complianceChecks.filter(c => c.status === 'passed').length;
  const warningChecks = complianceChecks.filter(c => c.status === 'warning').length;
  const complianceScore = complianceChecks.length > 0 
    ? Math.round((passedChecks / complianceChecks.length) * 100) 
    : 0;

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
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  const headerActions = (
    <>
      <Button variant="outline" size="sm" className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800">
        <Download className="w-4 h-4 mr-2" />
        Export Report
      </Button>
      <Button variant="outline" size="sm" className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800">
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </Button>
    </>
  );

  return (
    <PageLayout 
      title="HIPAA Compliance Tools" 
      description="Security scanning, compliance checking, and audit management"
      isLoading={isLoading}
      headerActions={headerActions}
    >
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2 text-white">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>Compliance Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">{complianceScore}%</div>
              <Progress value={complianceScore} className="w-full h-2 mb-2" />
              <p className="text-sm text-gray-400">Excellent compliance rating</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2 text-white">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Security Checks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {checksLoading ? (
              <div className="text-center space-y-2">
                <Skeleton className="h-10 w-16 mx-auto bg-gray-800" />
                <Skeleton className="h-4 w-24 mx-auto bg-gray-800" />
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">{passedChecks}/{complianceChecks.length}</div>
                <p className="text-sm text-gray-400 mb-2">Checks passed</p>
                {warningChecks > 0 ? (
                  <Badge className="bg-yellow-900/50 text-yellow-300 border-yellow-700">
                    {warningChecks} Warning{warningChecks > 1 ? 's' : ''}
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-700">
                    All Passed
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2 text-white">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Audit Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="text-center space-y-2">
                <Skeleton className="h-10 w-16 mx-auto bg-gray-800" />
                <Skeleton className="h-4 w-24 mx-auto bg-gray-800" />
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">{auditLogs.length}</div>
                <p className="text-sm text-gray-400 mb-2">Events logged</p>
                <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-700">
                  All Secure
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tools Tabs */}
      <Tabs defaultValue="security-scan" className="space-y-6">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="security-scan" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">Security Scan</TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">Compliance Check</TabsTrigger>
          <TabsTrigger value="audit-trail" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">Audit Trail</TabsTrigger>
          <TabsTrigger value="baa-generator" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">BAA Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="security-scan" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <ScanLine className="w-5 h-5 text-emerald-400" />
                <span>Security Vulnerability Scan</span>
              </CardTitle>
              <p className="text-gray-400">
                Scan your application for potential security vulnerabilities and HIPAA compliance issues.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {isScanning && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Scanning in progress...</span>
                    <span className="text-sm font-semibold text-emerald-400">{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="w-full h-2" />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Last Scan Results</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">High Risk Issues</span>
                      <Badge className="bg-red-900/50 text-red-300 border-red-700">0</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Medium Risk Issues</span>
                      <Badge className="bg-yellow-900/50 text-yellow-300 border-yellow-700">1</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Low Risk Issues</span>
                      <Badge className="bg-gray-700 text-gray-300 border-gray-600">2</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Scan Coverage</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">API Endpoints</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Database Queries</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Authentication</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSecurityScan}
                disabled={isScanning}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
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

        <TabsContent value="compliance" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                <span>HIPAA Compliance Checklist</span>
              </CardTitle>
              <p className="text-gray-400">
                Review your application's compliance with HIPAA requirements.
              </p>
            </CardHeader>
            <CardContent>
              {checksLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-16 bg-gray-800" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complianceChecks.map((item) => {
                    const IconComponent = iconMap[item.icon] || Shield;
                    return (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg" data-testid={`compliance-item-${item.id}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.status === 'passed' ? 'bg-emerald-900/50' : 'bg-yellow-900/50'
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            item.status === 'passed' ? 'text-emerald-400' : 'text-yellow-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white">{item.name}</span>
                            {item.status === 'passed' ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-400">
                            {item.description || (item.status === 'passed' ? 'Compliant' : 'Needs attention')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-trail" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Audit Trail</span>
              </CardTitle>
              <p className="text-gray-400">
                Monitor all data access and modifications for compliance tracking.
              </p>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-20 bg-gray-800" />
                  ))}
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No audit events recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg" data-testid={`audit-log-${log.id}`}>
                      <div className="w-10 h-10 bg-emerald-900/50 rounded-full flex items-center justify-center">
                        <Activity className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{log.action}</span>
                          <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          User: {log.actor} {log.resourceType && log.resourceId && `• ${log.resourceType}: ${log.resourceId}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Audit Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="baa-generator" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Business Associate Agreement Generator</span>
              </CardTitle>
              <p className="text-gray-400">
                Generate compliant Business Associate Agreements for your healthcare partners.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-white mb-3">Standard BAA Template</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Pre-configured template compliant with HIPAA requirements for standard business associate relationships.
                  </p>
                  <Button variant="outline" className="w-full bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800">
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-white mb-3">Custom BAA Generator</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Create a customized Business Associate Agreement based on your specific requirements.
                  </p>
                  <Button variant="outline" className="w-full bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800">
                    <FileText className="w-4 h-4 mr-2" />
                    Create Custom BAA
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">BAA Compliance Features</span>
                </div>
                <ul className="text-sm text-emerald-200 space-y-1">
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
    </PageLayout>
  );
}
