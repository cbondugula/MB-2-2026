import { Link, useLocation } from "wouter";
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
  BookOpen,
  CreditCard
} from "lucide-react";

export default function LeftSidebar() {
  const [location] = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/app-builder", label: "Build App", icon: Rocket },
    { path: "/templates", label: "Templates", icon: FileCode },
    { path: "/components", label: "Components", icon: Puzzle },
    { path: "/code-editor", label: "Code Editor", icon: Code },
    { path: "/preview", label: "Preview", icon: Eye },
    { path: "/hipaa-tools", label: "Compliance", icon: Shield },
    { path: "/my-apps", label: "My Apps", icon: FolderOpen },
  ];

  const resourceItems = [
    { path: "/pricing", label: "Pricing", icon: CreditCard },
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
    <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-full">
      <nav className="flex-1 p-4 space-y-1">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            Build
          </h3>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-gray-800 text-emerald-400 shadow-sm"
                  : "text-gray-300 hover:bg-gray-900 hover:text-white"
              }`}
              data-testid={`nav-${item.path.replace('/', '') || 'dashboard'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-emerald-400' : 'text-gray-500'}`} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-800">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            Resources
          </h3>
          {resourceItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-gray-800 text-emerald-400"
                  : "text-gray-300 hover:bg-gray-900 hover:text-white"
              }`}
              data-testid={`nav-${item.path.replace('/', '')}`}
            >
              <item.icon className={`w-4 h-4 ${isActive(item.path) ? 'text-emerald-400' : 'text-gray-500'}`} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-emerald-900/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">HIPAA Ready</span>
          </div>
          <p className="text-xs text-gray-400">All apps built with compliance</p>
        </div>
      </div>
    </aside>
  );
}
