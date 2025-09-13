import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Code, 
  Puzzle, 
  FileCode, 
  Eye, 
  Shield, 
  Cloud,
  Folder,
  CheckCircle,
  Brain,
  Activity,
  Globe,
  Building,
  Rocket,
  Sparkles,
  Stethoscope,
  FileText
} from "lucide-react";

export default function LeftSidebar() {
  const [location] = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/healthcare-app-builder", label: "Healthcare Apps", icon: Stethoscope },
    { path: "/ai-workspace", label: "AI Workspace", icon: Brain },
    { path: "/langextract", label: "Medical Text Analysis", icon: FileText },
    { path: "/app-builder", label: "App Builder", icon: Rocket },
    { path: "/ai-code-generator", label: "AI Code Generator", icon: Sparkles },
    { path: "/bert-analysis", label: "BERT Analysis", icon: Activity },
    { path: "/standards-builder", label: "Standards Builder", icon: Building },
    { path: "/global-healthcare", label: "Global Healthcare", icon: Globe },
    { path: "/code-editor", label: "Code Editor", icon: Code },
    { path: "/components", label: "Components", icon: Puzzle },
    { path: "/templates", label: "Templates", icon: FileCode },
    { path: "/preview", label: "Preview", icon: Eye },
    { path: "/hipaa-tools", label: "HIPAA Tools", icon: Shield },
    { path: "/deploy", label: "Deploy", icon: Cloud },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Project Section */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Current Project</h3>
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Folder className="w-4 h-4 text-medical-blue-500" />
            <span className="font-medium text-slate-900">Telehealth Portal</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <Shield className="w-3 h-3 text-trust-green-500" />
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-medical-blue-50 text-medical-blue-600"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-trust-green-50 border border-trust-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-trust-green-500" />
            <span className="text-sm font-medium text-trust-green-700">Compliance Status</span>
          </div>
          <p className="text-xs text-trust-green-600">All components verified</p>
        </div>
      </div>
    </aside>
  );
}
