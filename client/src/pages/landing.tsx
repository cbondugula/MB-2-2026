import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Code, Zap, Users, Lock, FileCheck } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-medical-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-medical-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">MedBuilder</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="bg-trust-green-100 text-trust-green-600 px-2 py-1 rounded-full text-xs font-medium">
                    HIPAA Compliant
                  </span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-medical-blue-500 hover:bg-medical-blue-600 text-white px-6 py-2"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Build Healthcare Apps
            <span className="text-medical-blue-500 block">10x Faster</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            The only development platform designed specifically for healthcare and life sciences. 
            Create HIPAA-compliant applications with pre-built templates, verified components, 
            and integrated compliance tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-medical-blue-500 hover:bg-medical-blue-600 text-white px-8 py-3 text-lg"
            >
              Start Building Now
            </Button>
            <Button 
              variant="outline" 
              className="border-medical-blue-500 text-medical-blue-500 hover:bg-medical-blue-50 px-8 py-3 text-lg"
            >
              View Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for Healthcare Development
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From EHR integrations to telemedicine platforms, we provide the tools and templates 
              to build compliant healthcare applications without starting from scratch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-medical-blue-500" />
                </div>
                <CardTitle className="text-slate-900">HIPAA Compliance Built-In</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  Every template and component is pre-verified for HIPAA compliance. 
                  Built-in security scanning and audit trails ensure your app meets healthcare standards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-trust-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-trust-green-500" />
                </div>
                <CardTitle className="text-slate-900">Healthcare-Specific Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  Ready-to-use templates for EHR integration, telemedicine, patient portals, 
                  lab management, and more. Skip months of development time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-healthcare-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-healthcare-teal-500" />
                </div>
                <CardTitle className="text-slate-900">API Integration Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  Pre-configured integrations for FHIR, HL7, Epic, and other healthcare APIs. 
                  Connect to existing systems with just a few clicks.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle className="text-slate-900">Verified Component Library</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  Drag-and-drop components for patient forms, appointment scheduling, 
                  medical charts, and secure messaging. All medically reviewed and tested.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-orange-500" />
                </div>
                <CardTitle className="text-slate-900">Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  AES-256 encryption, SOC 2 compliance, and automated security scanning. 
                  Deploy with confidence knowing your app meets healthcare security standards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-red-500" />
                </div>
                <CardTitle className="text-slate-900">Automated Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  Generate Business Associate Agreements, audit trails, and compliance reports automatically. 
                  Focus on building, not paperwork.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-medical-blue-500">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Healthcare App?
          </h2>
          <p className="text-xl text-medical-blue-100 mb-8 max-w-2xl mx-auto">
            Join healthcare innovators who are building the future of medical technology 
            with our HIPAA-compliant development platform.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-white text-medical-blue-500 hover:bg-slate-100 px-8 py-3 text-lg font-semibold"
          >
            Start Building Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-medical-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">MedBuilder</span>
            </div>
            <p className="text-slate-400 mb-4">
              The healthcare development platform that puts compliance first.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <span>HIPAA Compliant</span>
              <span>•</span>
              <span>SOC 2 Certified</span>
              <span>•</span>
              <span>HITRUST Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
