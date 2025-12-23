import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, Shield, Lock, Eye, EyeOff, Database, 
  Users, AlertTriangle, CheckCircle2, XCircle, Search,
  FileText, Activity, Globe, Server, Key, Fingerprint,
  UserCheck, UserX, Clock, MapPin, RefreshCw, Download,
  Zap, BarChart3, Filter, ArrowUpRight, Settings
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DataFlow {
  id: string;
  source: string;
  destination: string;
  dataType: string;
  phiElements: string[];
  encryption: 'aes-256' | 'tls-1.3' | 'none';
  status: 'active' | 'paused' | 'blocked';
  lastTransfer: string;
  volume: string;
}

interface AccessLog {
  id: number;
  user: string;
  action: string;
  resource: string;
  phiAccessed: boolean;
  timestamp: string;
  ipAddress: string;
  location: string;
  status: 'allowed' | 'denied' | 'flagged';
}

interface AccessPolicy {
  id: string;
  name: string;
  description: string;
  roles: string[];
  phiCategories: string[];
  enabled: boolean;
  conditions: string[];
}

export default function PHIGovernance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataType, setSelectedDataType] = useState<string>('all');
  const { toast } = useToast();

  const { data: governanceData, isLoading } = useQuery({
    queryKey: ['/api/phi-governance/overview'],
  });

  const { data: dataFlows = [] } = useQuery<DataFlow[]>({
    queryKey: ['/api/phi-governance/data-flows'],
  });

  const { data: accessLogs = [] } = useQuery<AccessLog[]>({
    queryKey: ['/api/phi-governance/access-logs'],
  });

  const { data: policies = [] } = useQuery<AccessPolicy[]>({
    queryKey: ['/api/phi-governance/policies'],
  });

  const scanMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/phi-governance/scan'),
    onSuccess: () => {
      toast({ title: 'PHI Scan Complete', description: 'All data flows analyzed successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/phi-governance'] });
    }
  });

  const togglePolicyMutation = useMutation({
    mutationFn: (policyId: string) => apiRequest('POST', `/api/phi-governance/policies/${policyId}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/phi-governance/policies'] });
    }
  });

  const overview = governanceData || {
    totalPHIElements: 47,
    protectedFlows: 23,
    accessEvents24h: 1847,
    anomaliesDetected: 3,
    encryptionCoverage: 98.7,
    consentCompliance: 94.2,
    dataMinimization: 87.5,
    retentionCompliance: 96.8
  };

  const defaultDataFlows: DataFlow[] = [
    { id: '1', source: 'Patient Portal', destination: 'EHR Database', dataType: 'Demographics', phiElements: ['Name', 'DOB', 'SSN', 'Address'], encryption: 'aes-256', status: 'active', lastTransfer: '2 min ago', volume: '2.4 GB/day' },
    { id: '2', source: 'Lab System', destination: 'Provider Dashboard', dataType: 'Lab Results', phiElements: ['MRN', 'Lab Values', 'Diagnosis'], encryption: 'tls-1.3', status: 'active', lastTransfer: '5 min ago', volume: '890 MB/day' },
    { id: '3', source: 'Telehealth', destination: 'Cloud Archive', dataType: 'Visit Notes', phiElements: ['Patient ID', 'Clinical Notes', 'Prescriptions'], encryption: 'aes-256', status: 'active', lastTransfer: '12 min ago', volume: '1.2 GB/day' },
    { id: '4', source: 'Billing System', destination: 'Clearinghouse', dataType: 'Claims', phiElements: ['Insurance ID', 'Diagnosis Codes', 'CPT'], encryption: 'tls-1.3', status: 'active', lastTransfer: '1 hr ago', volume: '450 MB/day' },
    { id: '5', source: 'Mobile App', destination: 'Analytics', dataType: 'Usage Data', phiElements: ['Device ID'], encryption: 'tls-1.3', status: 'paused', lastTransfer: '3 days ago', volume: '120 MB/day' },
    { id: '6', source: 'External Lab', destination: 'Results DB', dataType: 'External Results', phiElements: ['Name', 'DOB', 'Lab Values'], encryption: 'aes-256', status: 'blocked', lastTransfer: 'Blocked', volume: '0 MB' }
  ];

  const defaultAccessLogs: AccessLog[] = [
    { id: 1, user: 'dr.smith@hospital.org', action: 'VIEW', resource: 'Patient Record #45821', phiAccessed: true, timestamp: '2 min ago', ipAddress: '192.168.1.45', location: 'Boston, MA', status: 'allowed' },
    { id: 2, user: 'nurse.jones@hospital.org', action: 'EXPORT', resource: 'Lab Results Batch', phiAccessed: true, timestamp: '15 min ago', ipAddress: '192.168.1.67', location: 'Boston, MA', status: 'flagged' },
    { id: 3, user: 'admin@medbuilder.io', action: 'MODIFY', resource: 'Access Policy', phiAccessed: false, timestamp: '1 hr ago', ipAddress: '10.0.0.12', location: 'San Francisco, CA', status: 'allowed' },
    { id: 4, user: 'unknown@external.com', action: 'VIEW', resource: 'Patient Database', phiAccessed: true, timestamp: '2 hr ago', ipAddress: '203.45.67.89', location: 'Unknown', status: 'denied' },
    { id: 5, user: 'dr.chen@hospital.org', action: 'UPDATE', resource: 'Medication List', phiAccessed: true, timestamp: '3 hr ago', ipAddress: '192.168.1.102', location: 'Boston, MA', status: 'allowed' },
    { id: 6, user: 'tech.support@medbuilder.io', action: 'ACCESS', resource: 'System Logs', phiAccessed: false, timestamp: '4 hr ago', ipAddress: '10.0.0.15', location: 'San Francisco, CA', status: 'allowed' }
  ];

  const defaultPolicies: AccessPolicy[] = [
    { id: '1', name: 'Minimum Necessary', description: 'Limit PHI access to minimum required for job function', roles: ['All Staff'], phiCategories: ['All'], enabled: true, conditions: ['Role-based filtering', 'Purpose validation'] },
    { id: '2', name: 'Provider Full Access', description: 'Full PHI access for treating providers', roles: ['Physician', 'NP', 'PA'], phiCategories: ['Demographics', 'Clinical', 'Labs', 'Notes'], enabled: true, conditions: ['Active treatment relationship', 'Valid credentials'] },
    { id: '3', name: 'Billing Limited Access', description: 'Limited PHI for billing operations', roles: ['Billing Staff'], phiCategories: ['Demographics', 'Insurance', 'Codes'], enabled: true, conditions: ['Business need', 'Audit logging'] },
    { id: '4', name: 'Research De-identified', description: 'De-identified data only for research', roles: ['Researcher'], phiCategories: ['De-identified only'], enabled: true, conditions: ['IRB approval', 'Data use agreement'] },
    { id: '5', name: 'Emergency Override', description: 'Break-glass access for emergencies', roles: ['Emergency Staff'], phiCategories: ['All'], enabled: true, conditions: ['Emergency declared', 'Post-access review'] },
    { id: '6', name: 'External Partner', description: 'Restricted access for business associates', roles: ['External'], phiCategories: ['Limited'], enabled: false, conditions: ['BAA signed', 'VPN required', 'Time-limited'] }
  ];

  const displayFlows = dataFlows.length > 0 ? dataFlows : defaultDataFlows;
  const displayLogs = accessLogs.length > 0 ? accessLogs : defaultAccessLogs;
  const displayPolicies = policies.length > 0 ? policies : defaultPolicies;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'allowed': return 'bg-[#1a3d00]/50 text-[#8CC63F] border-[#76B900]';
      case 'paused':
      case 'flagged': return 'bg-amber-900/50 text-amber-300 border-amber-700';
      case 'blocked':
      case 'denied': return 'bg-red-900/50 text-red-300 border-red-700';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const getEncryptionIcon = (encryption: string) => {
    switch (encryption) {
      case 'aes-256': return <Lock className="w-4 h-4 text-[#76B900]" />;
      case 'tls-1.3': return <Shield className="w-4 h-4 text-blue-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  PHI Governance Dashboard
                </h1>
                <p className="text-gray-400">Protected Health Information flow monitoring & access control</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => scanMutation.mutate()}
            disabled={scanMutation.isPending}
            className="bg-purple-600 hover:bg-purple-500"
            data-testid="button-scan-phi"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${scanMutation.isPending ? 'animate-spin' : ''}`} />
            {scanMutation.isPending ? 'Scanning...' : 'Scan PHI Flows'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/40 to-gray-900 border-purple-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">PHI Elements Tracked</p>
                  <p className="text-3xl font-bold text-purple-400" data-testid="text-phi-elements">{overview.totalPHIElements}</p>
                </div>
                <Database className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-xs text-purple-500 mt-2">Across {overview.protectedFlows} data flows</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a3d00]/40 to-gray-900 border-[#76B900]/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Encryption Coverage</p>
                  <p className="text-3xl font-bold text-[#76B900]" data-testid="text-encryption">{overview.encryptionCoverage}%</p>
                </div>
                <Lock className="w-8 h-8 text-[#76B900]" />
              </div>
              <Progress value={overview.encryptionCoverage} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/40 to-gray-900 border-blue-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Access Events (24h)</p>
                  <p className="text-3xl font-bold text-blue-400" data-testid="text-access-events">{overview.accessEvents24h.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-xs text-blue-500 mt-2">{overview.anomaliesDetected} anomalies flagged</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900/40 to-gray-900 border-amber-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Consent Compliance</p>
                  <p className="text-3xl font-bold text-amber-400" data-testid="text-consent">{overview.consentCompliance}%</p>
                </div>
                <UserCheck className="w-8 h-8 text-amber-400" />
              </div>
              <Progress value={overview.consentCompliance} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="flows" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="flows" className="data-[state=active]:bg-purple-600">
              <Activity className="w-4 h-4 mr-2" />
              Data Flows
            </TabsTrigger>
            <TabsTrigger value="access" className="data-[state=active]:bg-purple-600">
              <Eye className="w-4 h-4 mr-2" />
              Access Logs
            </TabsTrigger>
            <TabsTrigger value="policies" className="data-[state=active]:bg-purple-600">
              <Shield className="w-4 h-4 mr-2" />
              Access Policies
            </TabsTrigger>
            <TabsTrigger value="discovery" className="data-[state=active]:bg-purple-600">
              <Search className="w-4 h-4 mr-2" />
              PHI Discovery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flows" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search data flows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700"
                  data-testid="input-search-flows"
                />
              </div>
              <Button variant="outline" className="border-gray-700" data-testid="button-filter-flows">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid gap-4">
              {displayFlows.map((flow) => (
                <Card key={flow.id} className="bg-gray-900/50 border-gray-800 hover:border-purple-700/50 transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <Server className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-white">{flow.source}</p>
                          <p className="text-xs text-gray-500">Source</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <div className="h-px w-12 bg-gray-700" />
                          {getEncryptionIcon(flow.encryption)}
                          <Badge variant="outline" className="text-xs">
                            {flow.encryption.toUpperCase()}
                          </Badge>
                          <div className="h-px w-12 bg-gray-700" />
                          <ArrowUpRight className="w-4 h-4 text-purple-400" />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 min-w-[200px]">
                        <Database className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-white">{flow.destination}</p>
                          <p className="text-xs text-gray-500">Destination</p>
                        </div>
                      </div>

                      <div className="min-w-[120px]">
                        <p className="text-sm text-gray-400">PHI Elements</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {flow.phiElements.slice(0, 2).map((el) => (
                            <Badge key={el} variant="outline" className="text-xs border-purple-700/50 text-purple-300">
                              {el}
                            </Badge>
                          ))}
                          {flow.phiElements.length > 2 && (
                            <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                              +{flow.phiElements.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="min-w-[100px] text-right">
                        <Badge className={getStatusColor(flow.status)}>
                          {flow.status.charAt(0).toUpperCase() + flow.status.slice(1)}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{flow.lastTransfer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="access" className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Real-time Access Monitoring
                </CardTitle>
                <CardDescription>All PHI access events with anomaly detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayLogs.map((log) => (
                    <div 
                      key={log.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        log.status === 'denied' ? 'bg-red-900/20 border-red-700/50' :
                        log.status === 'flagged' ? 'bg-amber-900/20 border-amber-700/50' :
                        'bg-gray-800/50 border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {log.status === 'allowed' ? (
                          <CheckCircle2 className="w-5 h-5 text-[#76B900]" />
                        ) : log.status === 'flagged' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <div>
                          <p className="font-medium text-white">{log.user}</p>
                          <p className="text-sm text-gray-400">
                            {log.action} - {log.resource}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        {log.phiAccessed && (
                          <Badge className="bg-purple-900/50 text-purple-300 border-purple-700">
                            PHI Accessed
                          </Badge>
                        )}
                        <div className="text-right">
                          <p className="text-sm text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {log.location}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {log.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <div className="grid gap-4">
              {displayPolicies.map((policy) => (
                <Card key={policy.id} className="bg-gray-900/50 border-gray-800">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">{policy.name}</h3>
                          <Badge className={policy.enabled ? 'bg-[#1a3d00]/50 text-[#8CC63F]' : 'bg-gray-800 text-gray-400'}>
                            {policy.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{policy.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-400">{policy.roles.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <Database className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-400">{policy.phiCategories.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={policy.enabled}
                          onCheckedChange={() => togglePolicyMutation.mutate(policy.id)}
                          data-testid={`switch-policy-${policy.id}`}
                        />
                        <Button variant="ghost" size="sm" className="text-gray-400" data-testid={`button-edit-policy-${policy.id}`}>
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discovery" className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-cyan-400" />
                  Automated PHI Discovery
                </CardTitle>
                <CardDescription>ML-powered detection of PHI in your codebase and data stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-3">Detection Patterns</h4>
                    <div className="space-y-2">
                      {['SSN Pattern', 'MRN Format', 'DOB Detection', 'Address Match', 'Phone Numbers', 'Email PHI'].map((pattern) => (
                        <div key={pattern} className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{pattern}</span>
                          <CheckCircle2 className="w-4 h-4 text-[#76B900]" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-3">Scan Locations</h4>
                    <div className="space-y-2">
                      {['Database Tables', 'API Responses', 'Log Files', 'File Storage', 'Code Comments', 'Environment Vars'].map((loc) => (
                        <div key={loc} className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{loc}</span>
                          <Badge variant="outline" className="text-xs">Monitored</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-3">Recent Findings</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-amber-900/20 rounded border border-amber-700/50">
                        <p className="text-sm text-amber-300">Unmasked SSN in logs</p>
                        <p className="text-xs text-gray-500">server/audit.log:247</p>
                      </div>
                      <div className="p-2 bg-[#1a3d00]/20 rounded border border-[#76B900]/50">
                        <p className="text-sm text-[#8CC63F]">PHI properly encrypted</p>
                        <p className="text-xs text-gray-500">All patient tables</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
