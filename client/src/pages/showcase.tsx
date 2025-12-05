import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Search,
  Star,
  Heart,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  ArrowLeft,
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  Users,
  Trophy,
  Flame,
  Crown
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "clinical", label: "Clinical Apps" },
  { id: "telehealth", label: "Telehealth" },
  { id: "research", label: "Research" },
  { id: "admin", label: "Administration" },
  { id: "patient", label: "Patient-Facing" },
];

export default function ShowcasePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const { data: showcasesData, isLoading } = useQuery({
    queryKey: ["/api/viral/showcase", { category: selectedCategory, sort: sortBy }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      params.append("sort", sortBy);
      const response = await fetch(`/api/viral/showcase?${params}`);
      if (!response.ok) throw new Error("Failed to fetch showcases");
      return response.json();
    },
  });

  const { data: featuredData } = useQuery<any[]>({
    queryKey: ["/api/viral/showcase/featured"],
  });

  const voteMutation = useMutation({
    mutationFn: async ({ showcaseId, voteType }: { showcaseId: number; voteType: string }) => {
      return apiRequest("POST", `/api/viral/showcase/${showcaseId}/vote`, { voteType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/viral/showcase"] });
      toast({ title: "Vote recorded!" });
    },
    onError: () => {
      toast({
        title: "Login required",
        description: "Please sign in to vote on showcases",
        variant: "destructive",
      });
    },
  });

  const showcases = showcasesData?.showcases || [];
  const featured = featuredData || [];

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
            <h1 className="text-3xl font-bold flex items-center gap-2 text-white" data-testid="text-page-title">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Community Showcase
            </h1>
            <p className="text-gray-300">
              Discover amazing healthcare applications built by the MedBuilder community
            </p>
          </div>
        </div>

        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 3).map((item: any) => (
                <Card
                  key={item.id}
                  className="bg-gradient-to-br from-yellow-900/20 to-gray-800/50 border-yellow-500/30 hover:border-yellow-500/50 transition-all"
                  data-testid={`card-featured-${item.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="bg-yellow-900/50 text-yellow-400 mb-2">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                        <CardTitle className="text-white">{item.title}</CardTitle>
                        <CardDescription className="text-gray-400">
                          by {item.authorName}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-400" />
                        {item.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {item.comments || 0}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" className="border-yellow-500/50 hover:bg-yellow-900/20">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Tabs value={sortBy} onValueChange={setSortBy} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="popular" className="data-[state=active]:bg-emerald-600">
                <Flame className="h-4 w-4 mr-2" />
                Popular
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-emerald-600">
                <Clock className="h-4 w-4 mr-2" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="views" className="data-[state=active]:bg-emerald-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={selectedCategory === cat.id
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white"}
                  data-testid={`btn-category-${cat.id}`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </Tabs>

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
        ) : showcases.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-200 mb-2">No showcases yet</h3>
            <p className="text-gray-400 mb-6">
              Be the first to share your healthcare application with the community!
            </p>
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="bg-emerald-600 hover:bg-emerald-700"
              data-testid="btn-submit-project"
            >
              <Award className="h-4 w-4 mr-2" />
              Submit Your Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcases.map((showcase: any) => (
              <Card
                key={showcase.id}
                className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-all group"
                data-testid={`card-showcase-${showcase.id}`}
              >
                {showcase.previewImage && (
                  <div className="aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
                    <img
                      src={showcase.previewImage}
                      alt={showcase.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white group-hover:text-emerald-400 transition-colors">
                        {showcase.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        by {showcase.authorName || "Anonymous"}
                      </CardDescription>
                    </div>
                    {showcase.category && (
                      <Badge variant="outline" className="border-gray-600 text-gray-400">
                        {showcase.category}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {showcase.description}
                  </p>
                  {showcase.techStack && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {(showcase.techStack as string[]).slice(0, 3).map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-gray-700 pt-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => voteMutation.mutate({ showcaseId: showcase.id, voteType: "up" })}
                      className="text-gray-400 hover:text-red-400"
                      data-testid={`btn-like-${showcase.id}`}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {showcase.likes || 0}
                    </Button>
                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                      <MessageCircle className="h-4 w-4" />
                      {showcase.comments || 0}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-700"
                    onClick={() => window.open(showcase.demoUrl || showcase.liveUrl, "_blank")}
                    data-testid={`btn-view-${showcase.id}`}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Demo
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-emerald-900/30 to-gray-800/50 border-emerald-500/30 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Share Your Creation</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Built something amazing with MedBuilder? Submit your project to the showcase and inspire others in the healthcare community!
            </p>
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="bg-emerald-600 hover:bg-emerald-700"
              data-testid="btn-submit-cta"
            >
              <Award className="h-5 w-5 mr-2" />
              Submit Your Project
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
