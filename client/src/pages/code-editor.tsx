import { useState, useEffect } from "react";
import TopNavigation from "@/components/TopNavigation";
import LeftSidebar from "@/components/LeftSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Save, 
  FileText, 
  Shield, 
  Settings, 
  Eye,
  Code,
  Folder,
  Plus
} from "lucide-react";

export default function CodeEditor() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeFile, setActiveFile] = useState("App.tsx");

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

  const files = [
    { name: "App.tsx", type: "tsx", path: "src/App.tsx" },
    { name: "PatientForm.tsx", type: "tsx", path: "src/components/PatientForm.tsx" },
    { name: "AppointmentScheduler.tsx", type: "tsx", path: "src/components/AppointmentScheduler.tsx" },
    { name: "styles.css", type: "css", path: "src/styles.css" },
    { name: "api.ts", type: "ts", path: "src/lib/api.ts" },
  ];

  const sampleCode = `import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User, Calendar } from 'lucide-react';

export default function PatientPortal() {
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    medicalRecordNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // HIPAA-compliant data submission
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      
      if (response.ok) {
        console.log('Patient data submitted securely');
      }
    } catch (error) {
      console.error('Error submitting patient data:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-trust-green-500" />
            <CardTitle>Patient Registration</CardTitle>
          </div>
          <p className="text-sm text-slate-600">
            This form is HIPAA-compliant and encrypted end-to-end
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={patientData.firstName}
                  onChange={(e) => setPatientData({...patientData, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={patientData.lastName}
                  onChange={(e) => setPatientData({...patientData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={patientData.email}
                onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={patientData.phone}
                onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={patientData.dateOfBirth}
                onChange={(e) => setPatientData({...patientData, dateOfBirth: e.target.value})}
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-medical-blue-500 hover:bg-medical-blue-600">
              <User className="w-4 h-4 mr-2" />
              Register Patient
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-medical-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Code className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-slate-600">Loading Code Editor...</p>
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
          {/* Editor Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-medical-blue-500" />
                  <h1 className="text-xl font-bold text-slate-900">Code Editor</h1>
                </div>
                <Badge variant="secondary" className="bg-trust-green-100 text-trust-green-700">
                  <Shield className="w-3 h-3 mr-1" />
                  HIPAA Compliant
                </Badge>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" className="bg-medical-blue-500 hover:bg-medical-blue-600">
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* File Explorer */}
            <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Files</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-2">
                <div className="space-y-1">
                  {files.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => setActiveFile(file.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeFile === file.name
                          ? 'bg-medical-blue-50 text-medical-blue-700'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>{file.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Editor Area */}
            <div className="flex-1 flex flex-col">
              <Tabs defaultValue="editor" className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start bg-slate-100 border-b border-slate-200 rounded-none p-0">
                  <TabsTrigger value="editor" className="data-[state=active]:bg-white">
                    <Code className="w-4 h-4 mr-2" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="data-[state=active]:bg-white">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor" className="flex-1 m-0">
                  <div className="h-full bg-slate-900 text-slate-100 p-4 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Folder className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">src/components/</span>
                        <span className="text-sm text-slate-200">{activeFile}</span>
                      </div>
                      <Badge variant="outline" className="bg-trust-green-900 text-trust-green-200 border-trust-green-700">
                        <Shield className="w-3 h-3 mr-1" />
                        Secure
                      </Badge>
                    </div>
                    
                    <pre className="text-sm leading-relaxed">
                      <code className="text-slate-200">
                        {sampleCode}
                      </code>
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="flex-1 m-0">
                  <div className="h-full bg-white p-6">
                    <div className="max-w-2xl mx-auto">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-trust-green-500" />
                            <CardTitle>Patient Registration</CardTitle>
                          </div>
                          <p className="text-sm text-slate-600">
                            This form is HIPAA-compliant and encrypted end-to-end
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">First Name</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue-500" />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Last Name</label>
                                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue-500" />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
                              <input type="email" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue-500" />
                            </div>
                            <Button className="w-full bg-medical-blue-500 hover:bg-medical-blue-600">
                              Register Patient
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="flex-1 m-0">
                  <div className="h-full bg-white p-6">
                    <div className="max-w-2xl mx-auto space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-trust-green-500" />
                            <span>HIPAA Compliance Settings</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">Encryption at Rest</span>
                            <Badge variant="secondary" className="bg-trust-green-100 text-trust-green-700">
                              Enabled
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">Data Masking</span>
                            <Badge variant="secondary" className="bg-trust-green-100 text-trust-green-700">
                              Enabled
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">Audit Logging</span>
                            <Badge variant="secondary" className="bg-trust-green-100 text-trust-green-700">
                              Enabled
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">Access Control</span>
                            <Badge variant="secondary" className="bg-trust-green-100 text-trust-green-700">
                              Role-Based
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
