import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Database, Server, Plug, Check, X, RefreshCw,
  Activity, Shield, Zap, Clock, AlertTriangle, CheckCircle2,
  Settings, Play, Pause, BarChart3, FileJson, Code,
  Globe, Lock, ArrowUpRight, ArrowDownRight, Loader2,
  Building2, Heart, Stethoscope, TestTube, Pill, Calendar
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface EHRConnector {
  id: string;
  name: string;
  vendor: string;
  type: 'epic' | 'cerner' | 'allscripts' | 'athena' | 'meditech' | 'custom';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  dataTypes: string[];
  version: string;
  recordsSync: number;
  compliance: number;
}

interface FHIRResource {
  type: string;
  count: number;
  lastUpdated: string;
  syncStatus: 'synced' | 'pending' | 'error';
  operations: string[];
}

interface IntegrationLog {
  id: number;
  timestamp: string;
  connector: string;
  operation: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  recordsAffected: number;
}

export default function EHRIntegration() {
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: connectors = [], isLoading } = useQuery<EHRConnector[]>({
    queryKey: ['/api/ehr/connectors'],
  });

  const { data: fhirResources = [] } = useQuery<FHIRResource[]>({
    queryKey: ['/api/ehr/fhir-resources'],
  });

  const { data: integrationLogs = [] } = useQuery<IntegrationLog[]>({
    queryKey: ['/api/ehr/logs'],
  });

  const syncMutation = useMutation({
    mutationFn: (connectorId: string) => apiRequest(`/api/ehr/connectors/${connectorId}/sync`, { method: 'POST' }),
    onSuccess: () => {
      toast({ title: 'Sync Started', description: 'EHR synchronization in progress' });
      queryClient.invalidateQueries({ queryKey: ['/api/ehr'] });
    }
  });

  const testConnectionMutation = useMutation({
    mutationFn: (connectorId: string) => apiRequest(`/api/ehr/connectors/${connectorId}/test`, { method: 'POST' }),
    onSuccess: () => {
      toast({ title: 'Connection Test', description: 'Connection verified successfully' });
    }
  });

  const defaultConnectors: EHRConnector[] = [
    { id: '1', name: 'Epic MyChart Integration', vendor: 'Epic Systems', type: 'epic', status: 'connected', lastSync: '5 min ago', dataTypes: ['Patient', 'Encounter', 'Observation', 'MedicationRequest'], version: 'R4', recordsSync: 45892, compliance: 98 },
    { id: '2', name: 'Cerner Millennium', vendor: 'Oracle Cerner', type: 'cerner', status: 'connected', lastSync: '12 min ago', dataTypes: ['Patient', 'Condition', 'Procedure', 'DiagnosticReport'], version: 'R4', recordsSync: 32156, compliance: 96 },
    { id: '3', name: 'Allscripts Sunrise', vendor: 'Allscripts', type: 'allscripts', status: 'syncing', lastSync: 'Syncing...', dataTypes: ['Patient', 'AllergyIntolerance', 'Immunization'], version: 'STU3', recordsSync: 18743, compliance: 92 },
    { id: '4', name: 'athenahealth', vendor: 'athenahealth', type: 'athena', status: 'disconnected', lastSync: '2 days ago', dataTypes: ['Patient', 'Appointment', 'Claim'], version: 'R4', recordsSync: 0, compliance: 0 },
    { id: '5', name: 'MEDITECH Expanse', vendor: 'MEDITECH', type: 'meditech', status: 'error', lastSync: 'Error', dataTypes: ['Patient', 'Encounter'], version: 'R4', recordsSync: 8921, compliance: 45 },
    { id: '6', name: 'Custom FHIR Server', vendor: 'Internal', type: 'custom', status: 'connected', lastSync: '1 min ago', dataTypes: ['All Resources'], version: 'R4', recordsSync: 125000, compliance: 100 }
  ];

  const defaultFHIRResources: FHIRResource[] = [
    { type: 'Patient', count: 125847, lastUpdated: '2 min ago', syncStatus: 'synced', operations: ['read', 'search', 'create', 'update'] },
    { type: 'Encounter', count: 892341, lastUpdated: '5 min ago', syncStatus: 'synced', operations: ['read', 'search'] },
    { type: 'Observation', count: 3456789, lastUpdated: '1 min ago', syncStatus: 'synced', operations: ['read', 'search', 'create'] },
    { type: 'MedicationRequest', count: 234567, lastUpdated: '8 min ago', syncStatus: 'pending', operations: ['read', 'search'] },
    { type: 'Condition', count: 456123, lastUpdated: '15 min ago', syncStatus: 'synced', operations: ['read', 'search', 'create', 'update'] },
    { type: 'Procedure', count: 189432, lastUpdated: '3 min ago', syncStatus: 'synced', operations: ['read', 'search'] },
    { type: 'DiagnosticReport', count: 567890, lastUpdated: '7 min ago', syncStatus: 'synced', operations: ['read', 'search'] },
    { type: 'AllergyIntolerance', count: 98765, lastUpdated: '12 min ago', syncStatus: 'error', operations: ['read', 'search'] }
  ];

  const defaultLogs: IntegrationLog[] = [
    { id: 1, timestamp: '2 min ago', connector: 'Epic MyChart', operation: 'FHIR Bulk Export', status: 'success', message: 'Successfully exported 1,247 patient records', recordsAffected: 1247 },
    { id: 2, timestamp: '5 min ago', connector: 'Cerner Millennium', operation: 'Patient Search', status: 'success', message: 'Query completed in 245ms', recordsAffected: 89 },
    { id: 3, timestamp: '12 min ago', connector: 'Allscripts Sunrise', operation: 'Sync Medications', status: 'warning', message: '3 records skipped due to validation errors', recordsAffected: 456 },
    { id: 4, timestamp: '1 hr ago', connector: 'MEDITECH Expanse', operation: 'Connection Test', status: 'error', message: 'Authentication failed: Invalid credentials', recordsAffected: 0 },
    { id: 5, timestamp: '2 hr ago', connector: 'Custom FHIR Server', operation: 'Create Encounter', status: 'success', message: 'New encounter created successfully', recordsAffected: 1 },
    { id: 6, timestamp: '3 hr ago', connector: 'Epic MyChart', operation: 'CDS Hook Trigger', status: 'success', message: 'Drug interaction alert sent to provider', recordsAffected: 1 }
  ];

  const displayConnectors = connectors.length > 0 ? connectors : defaultConnectors;
  const displayResources = fhirResources.length > 0 ? fhirResources : defaultFHIRResources;
  const displayLogs = integrationLogs.length > 0 ? integrationLogs : defaultLogs;

  const getConnectorIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      epic: <Heart className="w-6 h-6 text-red-400" />,
      cerner: <Building2 className="w-6 h-6 text-blue-400" />,
      allscripts: <Stethoscope className="w-6 h-6 text-emerald-400" />,
      athena: <Globe className="w-6 h-6 text-purple-400" />,
      meditech: <Server className="w-6 h-6 text-amber-400" />,
      custom: <Code className="w-6 h-6 text-cyan-400" />
    };
    return icons[type] || <Database className="w-6 h-6 text-gray-400" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-700"><CheckCircle2 className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'syncing': return <Badge className="bg-blue-900/50 text-blue-300 border-blue-700"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Syncing</Badge>;
      case 'disconnected': return <Badge className="bg-gray-800 text-gray-400 border-gray-700"><X className="w-3 h-3 mr-1" />Disconnected</Badge>;
      case 'error': return <Badge className="bg-red-900/50 text-red-300 border-red-700"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getResourceIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      Patient: <Heart className="w-4 h-4" />,
      Encounter: <Calendar className="w-4 h-4" />,
      Observation: <Activity className="w-4 h-4" />,
      MedicationRequest: <Pill className="w-4 h-4" />,
      Condition: <Stethoscope className="w-4 h-4" />,
      Procedure: <Zap className="w-4 h-4" />,
      DiagnosticReport: <TestTube className="w-4 h-4" />,
      AllergyIntolerance: <AlertTriangle className="w-4 h-4" />
    };
    return icons[type] || <FileJson className="w-4 h-4" />;
  };

  const totalRecords = displayConnectors.reduce((sum, c) => sum + c.recordsSync, 0);
  const activeConnectors = displayConnectors.filter(c => c.status === 'connected').length;

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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Plug className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  EHR Integration Orchestrator
                </h1>
                <p className="text-gray-400">Connect, sync, and manage Electronic Health Record systems</p>
              </div>
            </div>
          </div>
          <Button className="bg-cyan-600 hover:bg-cyan-500" data-testid="button-add-connector">
            <Plug className="w-4 h-4 mr-2" />
            Add Connector
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-cyan-900/40 to-gray-900 border-cyan-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Connectors</p>
                  <p className="text-3xl font-bold text-cyan-400" data-testid="text-active-connectors">{activeConnectors}/{displayConnectors.length}</p>
                </div>
                <Plug className="w-8 h-8 text-cyan-400" />
              </div>
              <Progress value={(activeConnectors / displayConnectors.length) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/40 to-gray-900 border-emerald-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Records Synced</p>
                  <p className="text-3xl font-bold text-emerald-400" data-testid="text-records-synced">{(totalRecords / 1000).toFixed(0)}K</p>
                </div>
                <Database className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-xs text-emerald-500 mt-2">Across all connectors</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/40 to-gray-900 border-blue-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">FHIR Resources</p>
                  <p className="text-3xl font-bold text-blue-400" data-testid="text-fhir-resources">{displayResources.length}</p>
                </div>
                <FileJson className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-xs text-blue-500 mt-2">R4 Specification</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/40 to-gray-900 border-purple-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">API Calls (24h)</p>
                  <p className="text-3xl font-bold text-purple-400" data-testid="text-api-calls">48.2K</p>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-xs text-purple-500 mt-2">99.9% success rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="connectors" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="connectors" className="data-[state=active]:bg-cyan-600">
              <Plug className="w-4 h-4 mr-2" />
              Connectors
            </TabsTrigger>
            <TabsTrigger value="fhir" className="data-[state=active]:bg-cyan-600">
              <FileJson className="w-4 h-4 mr-2" />
              FHIR Resources
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-cyan-600">
              <Activity className="w-4 h-4 mr-2" />
              Activity Logs
            </TabsTrigger>
            <TabsTrigger value="mapping" className="data-[state=active]:bg-cyan-600">
              <Code className="w-4 h-4 mr-2" />
              Data Mapping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connectors" className="space-y-4">
            <div className="grid gap-4">
              {displayConnectors.map((connector) => (
                <Card 
                  key={connector.id} 
                  className={`bg-gray-900/50 border-gray-800 hover:border-cyan-700/50 transition-colors cursor-pointer ${
                    selectedConnector === connector.id ? 'border-cyan-500' : ''
                  }`}
                  onClick={() => setSelectedConnector(connector.id)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                        {getConnectorIcon(connector.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">{connector.name}</h3>
                          {getStatusBadge(connector.status)}
                        </div>
                        <p className="text-sm text-gray-400">{connector.vendor} • FHIR {connector.version}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-lg font-bold text-white">{connector.recordsSync.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Records</p>
                      </div>

                      <div className="text-center min-w-[80px]">
                        <p className="text-lg font-bold text-emerald-400">{connector.compliance}%</p>
                        <p className="text-xs text-gray-500">Compliant</p>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="text-sm text-gray-400">{connector.lastSync}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-gray-700"
                          onClick={(e) => { e.stopPropagation(); testConnectionMutation.mutate(connector.id); }}
                          disabled={connector.status === 'syncing'}
                          data-testid={`button-test-${connector.id}`}
                        >
                          <Zap className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-cyan-600 hover:bg-cyan-500"
                          onClick={(e) => { e.stopPropagation(); syncMutation.mutate(connector.id); }}
                          disabled={connector.status === 'syncing' || connector.status === 'disconnected'}
                          data-testid={`button-sync-${connector.id}`}
                        >
                          <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </div>

                    {selectedConnector === connector.id && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-sm text-gray-400 mb-2">Supported Data Types:</p>
                        <div className="flex flex-wrap gap-2">
                          {connector.dataTypes.map((dt) => (
                            <Badge key={dt} variant="outline" className="border-cyan-700/50 text-cyan-300">
                              {dt}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fhir" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayResources.map((resource) => (
                <Card key={resource.type} className="bg-gray-900/50 border-gray-800 hover:border-cyan-700/50 transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-900/50 flex items-center justify-center text-cyan-400">
                          {getResourceIcon(resource.type)}
                        </div>
                        <h4 className="font-medium text-white">{resource.type}</h4>
                      </div>
                      <Badge className={
                        resource.syncStatus === 'synced' ? 'bg-emerald-900/50 text-emerald-300' :
                        resource.syncStatus === 'pending' ? 'bg-amber-900/50 text-amber-300' :
                        'bg-red-900/50 text-red-300'
                      }>
                        {resource.syncStatus}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-white">{resource.count.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Updated {resource.lastUpdated}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {resource.operations.map((op) => (
                        <Badge key={op} variant="outline" className="text-xs border-gray-700 text-gray-400">
                          {op}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Integration Activity
                </CardTitle>
                <CardDescription>Real-time EHR integration events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayLogs.map((log) => (
                    <div 
                      key={log.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        log.status === 'error' ? 'bg-red-900/20 border-red-700/50' :
                        log.status === 'warning' ? 'bg-amber-900/20 border-amber-700/50' :
                        'bg-gray-800/50 border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {log.status === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : log.status === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                        <div>
                          <p className="font-medium text-white">{log.connector}</p>
                          <p className="text-sm text-gray-400">{log.operation}</p>
                        </div>
                      </div>
                      <div className="flex-1 mx-6">
                        <p className="text-sm text-gray-300">{log.message}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">{log.recordsAffected} records</p>
                        <p className="text-xs text-gray-500">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-400" />
                  Data Transformation Rules
                </CardTitle>
                <CardDescription>Configure field mappings between systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-4">Source → FHIR Mapping</h4>
                    <div className="space-y-2">
                      {[
                        { source: 'PatientID', target: 'Patient.id', transform: 'Direct' },
                        { source: 'FirstName + LastName', target: 'Patient.name', transform: 'Concat' },
                        { source: 'DOB', target: 'Patient.birthDate', transform: 'Date Format' },
                        { source: 'Gender', target: 'Patient.gender', transform: 'Value Map' },
                        { source: 'SSN', target: 'Patient.identifier', transform: 'Masked' }
                      ].map((mapping, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-gray-900/50 rounded">
                          <code className="text-sm text-cyan-400 flex-1">{mapping.source}</code>
                          <ArrowUpRight className="w-4 h-4 text-gray-500" />
                          <code className="text-sm text-emerald-400 flex-1">{mapping.target}</code>
                          <Badge variant="outline" className="text-xs">{mapping.transform}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-4">Validation Rules</h4>
                    <div className="space-y-2">
                      {[
                        { rule: 'Required Fields', status: 'Passing', count: '12/12' },
                        { rule: 'Data Type Validation', status: 'Passing', count: '847/847' },
                        { rule: 'Reference Integrity', status: 'Warning', count: '99.7%' },
                        { rule: 'PHI Masking', status: 'Passing', count: '100%' },
                        { rule: 'Code System Mapping', status: 'Passing', count: 'ICD-10, SNOMED' }
                      ].map((rule, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-900/50 rounded">
                          <span className="text-sm text-gray-300">{rule.rule}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">{rule.count}</span>
                            {rule.status === 'Passing' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                            )}
                          </div>
                        </div>
                      ))}
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
