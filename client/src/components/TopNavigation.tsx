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
    <nav className="bg-gray-950/95 backdrop-blur-md border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          data-testid="logo-link"
        >
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">MedBuilder</span>
        </Link>
        <Badge className="bg-emerald-900/50 text-emerald-300 border border-emerald-700">
          HIPAA Compliant
        </Badge>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input 
            type="text" 
            placeholder="Search templates, components..." 
            className="pl-10 pr-4 py-2 w-72 bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            data-testid="search-input"
          />
        </div>
        
        <Button 
          onClick={handleNewProject}
          className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
          data-testid="new-project-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-800" data-testid="user-menu-button">
              <Avatar className="h-9 w-9 border-2 border-gray-700">
                <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                <AvatarFallback className="bg-emerald-900 text-emerald-300">
                  {user?.firstName?.[0] || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user?.firstName && (
                  <p className="font-medium text-sm text-white">{user.firstName} {user.lastName}</p>
                )}
                {user?.email && (
                  <p className="text-xs text-gray-400">{user.email}</p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem 
              className="text-gray-200 focus:bg-gray-800 focus:text-white cursor-pointer"
              onClick={() => setLocation('/my-apps')}
              data-testid="menu-my-apps"
            >
              <FileText className="w-4 h-4 mr-2" />
              My Apps
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-gray-200 focus:bg-gray-800 focus:text-white cursor-pointer"
              onClick={() => setLocation('/documentation')}
              data-testid="menu-documentation"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & Docs
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-200 focus:bg-gray-800 focus:text-white cursor-pointer" data-testid="menu-settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem 
              onClick={() => window.location.href = '/api/logout'}
              className="text-red-400 focus:bg-gray-800 focus:text-red-300 cursor-pointer"
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
