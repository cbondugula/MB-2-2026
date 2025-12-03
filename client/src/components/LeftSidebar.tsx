import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Code, 
  Puzzle, 
  FileCode, 
  Eye, 
  Shield, 
  Rocket,
  FolderOpen,
  FileText,
  BookOpen
} from "lucide-react";

export default function LeftSidebar() {
  const [location] = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home, description: "Overview & Quick Actions" },
    { path: "/app-builder", label: "Build App", icon: Rocket, description: "Create New Application" },
    { path: "/templates", label: "Templates", icon: FileCode, description: "Start from Template" },
    { path: "/components", label: "Components", icon: Puzzle, description: "Reusable Components" },
    { path: "/code-editor", label: "Code Editor", icon: Code, description: "Edit Your Code" },
    { path: "/preview", label: "Preview", icon: Eye, description: "Live Preview" },
    { path: "/hipaa-tools", label: "Compliance", icon: Shield, description: "HIPAA & Security" },
    { path: "/my-apps", label: "My Apps", icon: FolderOpen, description: "Your Projects" },
  ];

  const resourceItems = [
    { path: "/documentation", label: "Documentation", icon: BookOpen },
    { path: "/legal-documents", label: "Legal", icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/" || location === "/dashboard";
    }
    return location.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full">
      <nav className="flex-1 p-4 space-y-1">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-2">
            Build
          </h3>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-medical-blue-50 dark:bg-medical-blue-900/30 text-medical-blue-600 dark:text-medical-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              data-testid={`nav-${item.path.replace('/', '') || 'dashboard'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-medical-blue-500' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-2">
            Resources
          </h3>
          {resourceItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-medical-blue-50 dark:bg-medical-blue-900/30 text-medical-blue-600 dark:text-medical-blue-400"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              data-testid={`nav-${item.path.replace('/', '')}`}
            >
              <item.icon className={`w-4 h-4 ${isActive(item.path) ? 'text-medical-blue-500' : 'text-slate-400'}`} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="bg-gradient-to-r from-trust-green-50 to-trust-green-100 dark:from-trust-green-900/30 dark:to-trust-green-800/30 border border-trust-green-200 dark:border-trust-green-700 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Shield className="w-4 h-4 text-trust-green-600 dark:text-trust-green-400" />
            <span className="text-sm font-semibold text-trust-green-700 dark:text-trust-green-300">HIPAA Ready</span>
          </div>
          <p className="text-xs text-trust-green-600 dark:text-trust-green-400">All apps built with compliance</p>
        </div>
      </div>
    </aside>
  );
}
