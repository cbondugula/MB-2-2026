import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Search, 
  Calendar, 
  Eye, 
  Trash2, 
  FolderCode,
  Sparkles,
  Play
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface App {
  id: string;
  name: string;
  description?: string;
  status: string;
  framework: string;
  isHipaaCompliant?: boolean;
  createdAt: string;
  viewCount?: number;
}

export default function MyApps() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/chat/apps'],
  });

  const apps: App[] = data?.apps || [];

  const filteredApps = apps.filter((app: App) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "bg-[#76B900]/20 text-[#76B900] border-[#76B900]/50";
      case "preview":
        return "bg-blue-900/50 text-blue-300 border-blue-700";
      case "draft":
        return "bg-gray-700 text-gray-300 border-gray-600";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  if (error) {
    return (
      <PageLayout title="My Apps" description="View and manage your healthcare applications">
        <Card className="bg-gray-900 border-gray-800 max-w-md mx-auto">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <Code className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Apps</h2>
              <p className="text-gray-400">
                We couldn't load your apps. Please try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  const headerActions = (
    <Button
      asChild
      size="sm"
      className="bg-[#76B900] hover:bg-[#8CC63F] text-white"
      data-testid="create-new-app-button"
    >
      <Link href="/app-builder">
        <Sparkles className="w-4 h-4 mr-2" />
        Create New App
      </Link>
    </Button>
  );

  return (
    <PageLayout 
      title="My Apps" 
      description={`${filteredApps.length} apps`}
      isLoading={isLoading}
      headerActions={headerActions}
    >
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search apps by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-[#76B900]"
            data-testid="search-apps-input"
          />
        </div>
        
        <div className="flex gap-2">
          {["all", "deployed", "preview", "draft"].map((status) => (
            <Button
              key={status}
              variant="outline"
              size="sm"
              className={`${
                statusFilter === status
                  ? "bg-[#76B900] text-white border-[#76B900]"
                  : "bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800"
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Apps Grid */}
      {filteredApps.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderCode className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchQuery || statusFilter !== "all" ? "No apps found" : "No apps yet"}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first healthcare app with AI"}
            </p>
            <Button
              asChild
              className="bg-[#76B900] hover:bg-[#8CC63F] text-white"
            >
              <Link href="/app-builder">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your First App
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app: App) => (
            <Card 
              key={app.id} 
              className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all"
              data-testid={`app-card-${app.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-white mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4 text-[#76B900]" />
                      {app.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm line-clamp-2">
                      {app.description || "No description"}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className={getStatusColor(app.status)}>
                    {app.status}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                    {app.framework}
                  </Badge>
                  {app.isHipaaCompliant && (
                    <Badge variant="outline" className="bg-[#76B900]/20 text-[#76B900] border-[#76B900]/50">
                      HIPAA
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  {app.viewCount !== undefined && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {app.viewCount} views
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-[#76B900] hover:bg-[#8CC63F] text-white"
                    data-testid={`view-app-${app.id}`}
                  >
                    <Link href={`/apps/${app.id}`}>
                      <Eye className="w-3 h-3 mr-1.5" />
                      View
                    </Link>
                  </Button>
                  
                  {app.status !== "deployed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                    >
                      <Play className="w-3 h-3 mr-1.5" />
                      Deploy
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-500 hover:text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
