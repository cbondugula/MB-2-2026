import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Search, 
  Star, 
  GitFork, 
  Eye,
  Heart,
  Share2,
  ArrowLeft,
  Filter,
  TrendingUp,
  Clock,
  Sparkles,
  Shield,
  Activity,
  Building2,
  Stethoscope,
  Pill,
  FileText
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Templates", icon: Sparkles },
  { id: "clinical", label: "Clinical", icon: Stethoscope },
  { id: "telehealth", label: "Telehealth", icon: Activity },
  { id: "pharma", label: "Pharmaceutical", icon: Pill },
  { id: "research", label: "Research", icon: FileText },
  { id: "admin", label: "Admin/EHR", icon: Building2 },
];

export default function GalleryPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const { data: templatesData, isLoading } = useQuery({
    queryKey: ["/api/viral/templates/public", { category: selectedCategory, search: searchQuery, sort: sortBy }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      params.append("sort", sortBy);
      const response = await fetch(`/api/viral/templates/public?${params}`);
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });

  const forkMutation = useMutation({
    mutationFn: async (templateId: number) => {
      return apiRequest("POST", `/api/viral/templates/${templateId}/fork`);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Template forked!",
        description: "Your new project is ready. Redirecting to workspace...",
      });
      navigate(`/workspace/${data.id}`);
    },
    onError: (error: any) => {
      if (error.message?.includes("limit")) {
        toast({
          title: "Project limit reached",
          description: "Upgrade your plan to create more projects.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fork failed",
          description: error.message || "Failed to fork template",
          variant: "destructive",
        });
      }
    },
  });

  const templates = templatesData?.templates || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
            data-testid="btn-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white" data-testid="text-page-title">Template Gallery</h1>
            <p className="text-gray-300">
              Discover and fork HIPAA-compliant healthcare templates from the community
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                data-testid="input-search"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === "popular" ? "default" : "outline"}
              onClick={() => setSortBy("popular")}
              className={sortBy === "popular" ? "bg-emerald-600 hover:bg-emerald-700" : "border-gray-700"}
              data-testid="btn-sort-popular"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Popular
            </Button>
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              onClick={() => setSortBy("recent")}
              className={sortBy === "recent" ? "bg-emerald-600 hover:bg-emerald-700" : "border-gray-700"}
              data-testid="btn-sort-recent"
            >
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </Button>
            <Button
              variant={sortBy === "views" ? "default" : "outline"}
              onClick={() => setSortBy("views")}
              className={sortBy === "views" ? "bg-emerald-600 hover:bg-emerald-700" : "border-gray-700"}
              data-testid="btn-sort-views"
            >
              <Eye className="h-4 w-4 mr-2" />
              Most Viewed
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id 
                ? "bg-emerald-600 hover:bg-emerald-700" 
                : "border-gray-700 hover:bg-gray-800"}
              data-testid={`btn-category-${cat.id}`}
            >
              <cat.icon className="h-4 w-4 mr-2" />
              {cat.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-200 mb-2">No templates found</h3>
            <p className="text-gray-400">
              Try adjusting your search or check back later for new templates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template: any) => (
              <Card 
                key={template.id} 
                className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-all duration-300 group"
                data-testid={`card-template-${template.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white group-hover:text-emerald-400 transition-colors">
                        {template.ogTitle || "Untitled Template"}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        by {template.authorName || "Anonymous"}
                      </CardDescription>
                    </div>
                    {template.isHipaaCompliant && (
                      <Badge className="bg-emerald-900/50 text-emerald-400 border-emerald-500/50">
                        <Shield className="h-3 w-3 mr-1" />
                        HIPAA
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                    {template.ogDescription || "No description available"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(template.tags as string[] || []).slice(0, 3).map((tag: string) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="border-gray-600 text-gray-400 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-gray-700 pt-4">
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {template.viewCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      {template.forkCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {template.starCount || 0}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => forkMutation.mutate(template.templateId)}
                    disabled={forkMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    data-testid={`btn-fork-${template.id}`}
                  >
                    <GitFork className="h-4 w-4 mr-1" />
                    Fork
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <Shield className="h-5 w-5 text-emerald-500" />
            <span>All templates are reviewed for HIPAA compliance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
