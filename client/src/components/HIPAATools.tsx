import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ScanLine, 
  FileText, 
  ClipboardCheck 
} from "lucide-react";

export default function HIPAATools() {
  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-lg text-slate-900">HIPAA Compliance Tools</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <Link href="/hipaa-tools">
          <Button 
            variant="outline"
            className="w-full bg-trust-green-50 border-trust-green-200 hover:bg-trust-green-100 text-left justify-start h-auto p-4"
          >
            <div className="flex items-center space-x-3">
              <ScanLine className="w-5 h-5 text-trust-green-500" />
              <div>
                <p className="font-medium text-slate-900">Security Scan</p>
                <p className="text-sm text-slate-600">Check for vulnerabilities</p>
              </div>
            </div>
          </Button>
        </Link>
        
        <Link href="/hipaa-tools">
          <Button 
            variant="outline"
            className="w-full bg-medical-blue-50 border-medical-blue-200 hover:bg-medical-blue-100 text-left justify-start h-auto p-4"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-medical-blue-500" />
              <div>
                <p className="font-medium text-slate-900">BAA Generator</p>
                <p className="text-sm text-slate-600">Create Business Associate Agreement</p>
              </div>
            </div>
          </Button>
        </Link>
        
        <Link href="/hipaa-tools">
          <Button 
            variant="outline"
            className="w-full bg-orange-50 border-orange-200 hover:bg-orange-100 text-left justify-start h-auto p-4"
          >
            <div className="flex items-center space-x-3">
              <ClipboardCheck className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium text-slate-900">Audit Trail</p>
                <p className="text-sm text-slate-600">View compliance logs</p>
              </div>
            </div>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
