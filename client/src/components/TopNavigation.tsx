import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Search, Plus, User, Settings, LogOut, FileText, HelpCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function TopNavigation() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleNewProject = () => {
    setLocation('/app-builder');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <a className="flex items-center space-x-3 hover:opacity-90 transition-opacity" data-testid="logo-link">
            <div className="w-9 h-9 bg-gradient-to-br from-medical-blue-500 to-medical-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">MedBuilder</span>
          </a>
        </Link>
        <Badge variant="secondary" className="bg-trust-green-100 dark:bg-trust-green-900/50 text-trust-green-700 dark:text-trust-green-300 border-trust-green-200 dark:border-trust-green-700">
          HIPAA Compliant
        </Badge>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            type="text" 
            placeholder="Search templates, components..." 
            className="pl-10 pr-4 py-2 w-72 border-slate-200 dark:border-slate-600 dark:bg-slate-800 focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent"
            data-testid="search-input"
          />
        </div>
        
        <Button 
          onClick={handleNewProject}
          className="bg-medical-blue-500 hover:bg-medical-blue-600 text-white shadow-sm"
          data-testid="new-project-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="user-menu-button">
              <Avatar className="h-9 w-9 border-2 border-slate-200 dark:border-slate-600">
                <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                <AvatarFallback className="bg-medical-blue-100 text-medical-blue-600">
                  {user?.firstName?.[0] || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user?.firstName && (
                  <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                )}
                {user?.email && (
                  <p className="text-xs text-slate-500">{user.email}</p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <Link href="/my-apps">
              <DropdownMenuItem data-testid="menu-my-apps">
                <FileText className="w-4 h-4 mr-2" />
                My Apps
              </DropdownMenuItem>
            </Link>
            <Link href="/documentation">
              <DropdownMenuItem data-testid="menu-documentation">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Docs
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem data-testid="menu-settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => window.location.href = '/api/logout'}
              className="text-red-600 focus:text-red-600"
              data-testid="menu-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
