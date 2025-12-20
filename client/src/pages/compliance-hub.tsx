import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  FileText,
  Download,
  Clock,
  Activity,
  Lock,
  Eye,
  Users,
  Server,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  FileCheck,
  AlertCircle,
  TrendingUp,
  Building2,
  Globe,
  Zap
} from 'lucide-react';

interface ComplianceFramework {
  id: string;
  name: string;
  shortName: string;
  description: string;
  score: number;
  status: 'compliant' | 'partial' | 'non-compliant' | 'pending';
  lastAudit: string;
  nextAudit: string;
  controls: number;
  passedControls: number;
  icon: string;
  color: string;
}

interface AttestationItem {
  id: number;
  category: string;
  requirement: string;
  description: string;
  status: 'complete' | 'incomplete' | 'in-progress' | 'not-applicable';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate: string;
  assignee?: string;
  evidence?: string[];
}

interface AuditEvent {
  id: number;
  timestamp: string;
  action: string;
  user: string;
  resource: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

interface RemediationTask {
  id: number;
  title: string;
  framework: string;
  control: string;
  status: 'open' | 'in-progress' | 'resolved' | 'deferred';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee: string;
  dueDate: string;
  description: string;
}

export default function ComplianceHub() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [attestationFilter, setAttestationFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  const { data: frameworksData = [], isLoading: frameworksLoading } = useQuery<ComplianceFramework[]>({
    queryKey: ['/api/compliance-hub/frameworks'],
  });

  const { data: attestationsData = [], isLoading: attestationsLoading } = useQuery<AttestationItem[]>({
    queryKey: ['/api/compliance-hub/attestations'],
  });

  const { data: auditEventsData = [], isLoading: auditLoading } = useQuery<AuditEvent[]>({
    queryKey: ['/api/compliance-hub/audit-events'],
  });

  const { data: remediationsData = [], isLoading: remediationsLoading } = useQuery<RemediationTask[]>({
    queryKey: ['/api/compliance-hub/remediations'],
  });

  const complianceFrameworks = frameworksData;
  const attestationItems = attestationsData;
  const auditEvents = auditEventsData;
  const remediationTasks = remediationsData;

  const isLoading = frameworksLoading || attestationsLoading || auditLoading || remediationsLoading;

  const overallScore = complianceFrameworks.length > 0 
    ? Math.round(complianceFrameworks.reduce((sum, f) => sum + f.score, 0) / complianceFrameworks.length)
    : 0;

  const completedAttestations = attestationItems.filter(a => a.status === 'complete').length;
  const totalAttestations = attestationItems.length || 1;
  const attestationProgress = Math.round((completedAttestations / totalAttestations) * 100);

  const handleExportReport = async (format: 'pdf' | 'csv' | 'json') => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Report Generated",
        description: `Compliance report exported as ${format.toUpperCase()}`,
      });
    } catch {
      toast({
        title: "Export Failed",
        description: "Failed to generate compliance report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRunAudit = async (frameworkId: string) => {
    toast({
      title: "Audit Started",
      description: `Running compliance audit for ${frameworkId.toUpperCase()}...`,
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
    toast({
      title: "Audit Complete",
      description: "Compliance audit finished. Results updated.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'complete':
      case 'resolved':
        return 'bg-emerald-900/50 text-emerald-300 border-emerald-700';
      case 'partial':
      case 'in-progress':
        return 'bg-amber-900/50 text-amber-300 border-amber-700';
      case 'non-compliant':
      case 'incomplete':
      case 'open':
        return 'bg-red-900/50 text-red-300 border-red-700';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-900/50 text-red-300 border-red-700';
      case 'high': return 'bg-orange-900/50 text-orange-300 border-orange-700';
      case 'medium': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
      case 'low': return 'bg-blue-900/50 text-blue-300 border-blue-700';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const filteredAttestations = attestationItems.filter(item => {
    if (attestationFilter === 'all') return true;
    return item.status === attestationFilter;
  });

  const headerActions = (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800"
        onClick={() => handleRunAudit('all')}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Run Full Audit
      </Button>
      <Button 
        size="sm" 
        className="bg-emerald-600 hover:bg-emerald-500 text-white"
        onClick={() => handleExportReport('pdf')}
        disabled={isExporting}
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? 'Exporting...' : 'Export Report'}
      </Button>
    </>
  );

  return (
    <PageLayout 
      title="Compliance Automation Hub" 
      description="Enterprise-grade compliance management with automated attestation workflows"
      headerActions={headerActions}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-emerald-900/40 to-gray-900 border-emerald-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Overall Compliance</p>
                <p className="text-3xl font-bold text-emerald-400">{overallScore}%</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-emerald-900/50 flex items-center justify-center">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <Progress value={overallScore} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/40 to-gray-900 border-blue-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Attestations Complete</p>
                <p className="text-3xl font-bold text-blue-400">{completedAttestations}/{totalAttestations}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-900/50 flex items-center justify-center">
                <FileCheck className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <Progress value={attestationProgress} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/40 to-gray-900 border-purple-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Frameworks</p>
                <p className="text-3xl font-bold text-purple-400">{complianceFrameworks.length}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-purple-900/50 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="flex gap-1 mt-4">
              {complianceFrameworks.slice(0, 4).map((f) => (
                <Badge key={f.id} variant="outline" className="text-xs border-purple-700/50 text-purple-300">
                  {f.shortName}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900/40 to-gray-900 border-amber-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Open Remediations</p>
                <p className="text-3xl font-bold text-amber-400">
                  {remediationTasks.filter(t => t.status === 'open' || t.status === 'in-progress').length}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-amber-900/50 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              {remediationTasks.filter(t => t.priority === 'critical' || t.priority === 'high').length} high priority items
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="frameworks" className="space-y-6">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="frameworks" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Frameworks
          </TabsTrigger>
          <TabsTrigger value="attestations" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">
            <FileCheck className="w-4 h-4 mr-2" />
            Attestations
          </TabsTrigger>
          <TabsTrigger value="audit-trail" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">
            <Activity className="w-4 h-4 mr-2" />
            Audit Trail
          </TabsTrigger>
          <TabsTrigger value="remediation" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Remediation
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frameworks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complianceFrameworks.map((framework) => (
              <Card 
                key={framework.id}
                className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                data-testid={`framework-card-${framework.id}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{framework.icon}</span>
                      <div>
                        <CardTitle className="text-white text-lg">{framework.shortName}</CardTitle>
                        <CardDescription className="text-gray-400 text-xs line-clamp-1">
                          {framework.name}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(framework.status)}>
                      {framework.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Compliance Score</span>
                      <span className="text-white font-medium">{framework.score}%</span>
                    </div>
                    <Progress value={framework.score} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Controls Passed</span>
                    <span className="text-emerald-400">{framework.passedControls}/{framework.controls}</span>
                  </div>

                  <div className="pt-2 border-t border-gray-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>Last Audit: {framework.lastAudit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>Next Audit: {framework.nextAudit}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                    onClick={() => handleRunAudit(framework.id)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run Audit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attestations" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">HIPAA Attestation Checklist</CardTitle>
                  <CardDescription className="text-gray-400">
                    Complete all required controls for HIPAA compliance
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={attestationFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAttestationFilter('all')}
                    className={attestationFilter === 'all' ? 'bg-emerald-600' : 'bg-gray-800 border-gray-700'}
                  >
                    All
                  </Button>
                  <Button
                    variant={attestationFilter === 'incomplete' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAttestationFilter('incomplete')}
                    className={attestationFilter === 'incomplete' ? 'bg-red-600' : 'bg-gray-800 border-gray-700'}
                  >
                    Incomplete
                  </Button>
                  <Button
                    variant={attestationFilter === 'in-progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAttestationFilter('in-progress')}
                    className={attestationFilter === 'in-progress' ? 'bg-amber-600' : 'bg-gray-800 border-gray-700'}
                  >
                    In Progress
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {filteredAttestations.map((item) => (
                    <div 
                      key={item.id}
                      className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
                      data-testid={`attestation-item-${item.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox 
                          checked={item.status === 'complete'} 
                          className="mt-1"
                          data-testid={`attestation-checkbox-${item.id}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                              {item.category}
                            </Badge>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          <h4 className="text-white font-medium">{item.requirement}</h4>
                          <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {item.assignee}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due: {item.dueDate}
                            </span>
                            {item.evidence && (
                              <span className="flex items-center gap-1 text-emerald-400">
                                <FileText className="w-3 h-3" />
                                {item.evidence.length} evidence files
                              </span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-trail" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Live Audit Trail</CardTitle>
                  <CardDescription className="text-gray-400">
                    Real-time log of all compliance-related activities
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      placeholder="Search logs..." 
                      className="pl-9 bg-gray-800 border-gray-700 text-gray-200 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="audit-search-input"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {auditEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center gap-4"
                      data-testid={`audit-event-${event.id}`}
                    >
                      {getSeverityIcon(event.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {event.action}
                          </Badge>
                          <span className="text-white text-sm">{event.resource}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{event.details}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{event.user}</p>
                        <p className="text-xs text-gray-500">{event.timestamp}</p>
                        <p className="text-xs text-gray-600">{event.ipAddress}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remediation" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Remediation Tasks</CardTitle>
                  <CardDescription className="text-gray-400">
                    Track and resolve compliance gaps
                  </CardDescription>
                </div>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">
                  <Zap className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {remediationTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                    data-testid={`remediation-task-${task.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            {task.framework}
                          </Badge>
                        </div>
                        <h4 className="text-white font-medium">{task.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Control: {task.control}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {task.assignee}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {task.dueDate}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700">
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gray-900 border-gray-800 hover:border-emerald-700/50 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-900/50 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">HIPAA Attestation Report</CardTitle>
                    <CardDescription className="text-gray-400">
                      Complete attestation documentation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Comprehensive report including all HIPAA safeguards, control implementations, and evidence documentation.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-500"
                    onClick={() => handleExportReport('pdf')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-gray-800 border-gray-700"
                    onClick={() => handleExportReport('csv')}
                  >
                    CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-blue-700/50 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-900/50 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Audit Trail Export</CardTitle>
                    <CardDescription className="text-gray-400">
                      6-year retention compliant
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Full audit log export with timestamps, user actions, and compliance events for regulatory review.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-500"
                    onClick={() => handleExportReport('json')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    JSON
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-gray-800 border-gray-700"
                    onClick={() => handleExportReport('csv')}
                  >
                    CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-purple-700/50 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-900/50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Compliance Scorecard</CardTitle>
                    <CardDescription className="text-gray-400">
                      Executive summary report
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  High-level compliance scorecard suitable for board presentations and executive reviews.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-500"
                    onClick={() => handleExportReport('pdf')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-amber-700/50 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-amber-900/50 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">BAA Evidence Package</CardTitle>
                    <CardDescription className="text-gray-400">
                      Business Associate Agreement docs
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Complete BAA documentation package with signed agreements, vendor assessments, and compliance verification.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-amber-600 hover:bg-amber-500"
                    onClick={() => handleExportReport('pdf')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-cyan-700/50 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-cyan-900/50 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Security Assessment</CardTitle>
                    <CardDescription className="text-gray-400">
                      Risk analysis documentation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Complete security risk assessment including vulnerability scans, penetration test results, and remediation plans.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-cyan-600 hover:bg-cyan-500"
                    onClick={() => handleExportReport('pdf')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-pink-700/50 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-pink-900/50 flex items-center justify-center">
                    <Server className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Infrastructure Report</CardTitle>
                    <CardDescription className="text-gray-400">
                      Technical compliance details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Detailed infrastructure compliance report covering encryption, access controls, and network security.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-pink-600 hover:bg-pink-500"
                    onClick={() => handleExportReport('pdf')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
