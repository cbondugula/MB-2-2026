import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
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
import { Shield, User } from 'lucide-react';

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
        headers: { 'Content-Type': 'application/json' },
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
            <Shield className="w-5 h-5 text-[#76B900]" />
            <CardTitle>Patient Registration</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}`;

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  const headerActions = (
    <>
      <Button variant="outline" size="sm" className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800">
        <Save className="w-4 h-4 mr-2" />
        Save
      </Button>
      <Button variant="outline" size="sm" className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800">
        <Eye className="w-4 h-4 mr-2" />
        Preview
      </Button>
      <Button size="sm" className="bg-[#76B900] hover:bg-[#76B900] text-white">
        <Play className="w-4 h-4 mr-2" />
        Run
      </Button>
    </>
  );

  return (
    <PageLayout 
      title="Code Editor" 
      description="Write and edit HIPAA-compliant healthcare code"
      isLoading={isLoading}
      headerActions={headerActions}
    >
      <div className="flex h-[calc(100vh-220px)] rounded-lg overflow-hidden border border-gray-800">
        {/* File Explorer */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Files</h3>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
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
                      ? 'bg-gray-800 text-[#76B900]'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  data-testid={`file-${file.name}`}
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
        <div className="flex-1 flex flex-col bg-gray-950">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start bg-gray-900 border-b border-gray-800 rounded-none p-0">
              <TabsTrigger value="editor" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">
                <Code className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 m-0">
              <div className="h-full bg-gray-950 text-gray-100 p-4 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Folder className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">src/components/</span>
                    <span className="text-sm text-gray-200">{activeFile}</span>
                  </div>
                  <Badge className="bg-[#1a3d00]/50 text-[#8CC63F] border-[#76B900]">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure
                  </Badge>
                </div>
                
                <pre className="text-sm leading-relaxed font-mono">
                  <code className="text-gray-200">
                    {sampleCode}
                  </code>
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 m-0">
              <div className="h-full bg-gray-900 p-6">
                <div className="max-w-2xl mx-auto">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-[#76B900]" />
                        <CardTitle className="text-white">Patient Registration</CardTitle>
                      </div>
                      <p className="text-sm text-gray-400">
                        This form is HIPAA-compliant and encrypted end-to-end
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-300 mb-1 block">First Name</label>
                            <input className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#76B900]" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-300 mb-1 block">Last Name</label>
                            <input className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#76B900]" />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-1 block">Email</label>
                          <input type="email" className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#76B900]" />
                        </div>
                        <Button className="w-full bg-[#76B900] hover:bg-[#76B900] text-white">
                          Register Patient
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1 m-0">
              <div className="h-full bg-gray-900 p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Shield className="w-5 h-5 text-[#76B900]" />
                        <span>HIPAA Compliance Settings</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Encryption at Rest</span>
                        <Badge className="bg-[#1a3d00]/50 text-[#8CC63F] border-[#76B900]">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Data Masking</span>
                        <Badge className="bg-[#1a3d00]/50 text-[#8CC63F] border-[#76B900]">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Audit Logging</span>
                        <Badge className="bg-[#1a3d00]/50 text-[#8CC63F] border-[#76B900]">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Access Control</span>
                        <Badge className="bg-[#1a3d00]/50 text-[#8CC63F] border-[#76B900]">Role-Based</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
