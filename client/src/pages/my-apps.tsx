import { useQuery } from "@tanstack/react-query";
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
  Loader2, 
  FolderCode,
  Sparkles,
  ArrowLeft,
  Filter,
  Play,
  GitBranch
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function MyApps() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/chat/apps'],
  });

  const apps = data?.apps || [];

  // Filter apps based on search and status
  const filteredApps = apps.filter((app: any) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "bg-green-900 text-green-300 border-green-700";
      case "preview":
        return "bg-blue-900 text-blue-300 border-blue-700";
      case "draft":
        return "bg-gray-700 text-gray-300 border-gray-600";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  const getFrameworkIcon = (framework: string) => {
    // You could expand this with more icons
    return <Code className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto" />
          <p className="text-gray-400">Loading your apps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 max-w-md">
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
            <Button asChild variant="outline" className="bg-gray-700 border-gray-600 text-gray-200">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FolderCode className="w-5 h-5" />
                  My Apps
                </h1>
                <p className="text-sm text-gray-400">{filteredApps.length} apps</p>
              </div>
            </div>
            
            <Button
              asChild
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid="create-new-app-button"
            >
              <Link href="/">
                <Sparkles className="w-4 h-4 mr-2" />
                Create New App
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search apps by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              data-testid="search-apps-input"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`${
                statusFilter === "all"
                  ? "bg-green-600 text-white border-green-500"
                  : "bg-gray-800 text-gray-300 border-gray-700"
              }`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${
                statusFilter === "deployed"
                  ? "bg-green-600 text-white border-green-500"
                  : "bg-gray-800 text-gray-300 border-gray-700"
              }`}
              onClick={() => setStatusFilter("deployed")}
            >
              Deployed
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${
                statusFilter === "preview"
                  ? "bg-green-600 text-white border-green-500"
                  : "bg-gray-800 text-gray-300 border-gray-700"
              }`}
              onClick={() => setStatusFilter("preview")}
            >
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${
                statusFilter === "draft"
                  ? "bg-green-600 text-white border-green-500"
                  : "bg-gray-800 text-gray-300 border-gray-700"
              }`}
              onClick={() => setStatusFilter("draft")}
            >
              Draft
            </Button>
          </div>
        </div>

        {/* Apps Grid */}
        {filteredApps.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderCode className="w-8 h-8 text-gray-400" />
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
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Link href="/">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Your First App
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app: any) => (
              <Card 
                key={app.id} 
                className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all group"
                data-testid={`app-card-${app.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white mb-2 flex items-center gap-2">
                        {getFrameworkIcon(app.framework)}
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
                    <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
                      {app.framework}
                    </Badge>
                    {app.isHipaaCompliant && (
                      <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-700">
                        HIPAA
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-400">
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
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
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
                        className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                      >
                        <Play className="w-3 h-3 mr-1.5" />
                        Deploy
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
