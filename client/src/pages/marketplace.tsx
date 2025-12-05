import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Search,
  Star,
  Download,
  DollarSign,
  ArrowLeft,
  Filter,
  TrendingUp,
  ShoppingCart,
  Package,
  Shield,
  CheckCircle,
  Sparkles,
  BadgeCheck,
  Store
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "templates", label: "Templates" },
  { id: "components", label: "Components" },
  { id: "integrations", label: "Integrations" },
  { id: "themes", label: "Themes" },
];

const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular" },
  { id: "recent", label: "Recently Added" },
  { id: "rating", label: "Highest Rated" },
  { id: "price_low", label: "Price: Low to High" },
  { id: "price_high", label: "Price: High to Low" },
];

export default function MarketplacePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const { data: templatesData, isLoading } = useQuery({
    queryKey: ["/api/viral/marketplace/templates", { 
      category: selectedCategory, 
      search: searchQuery, 
      sort: sortBy,
      minPrice: showFreeOnly ? 0 : priceRange[0],
      maxPrice: showFreeOnly ? 0 : priceRange[1],
    }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      params.append("sort", sortBy);
      if (showFreeOnly) {
        params.append("maxPrice", "0");
      } else {
        params.append("minPrice", priceRange[0].toString());
        params.append("maxPrice", priceRange[1].toString());
      }
      const response = await fetch(`/api/viral/marketplace/templates?${params}`);
      if (!response.ok) throw new Error("Failed to fetch marketplace templates");
      return response.json();
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (marketplaceTemplateId: number) => {
      return apiRequest("POST", `/api/viral/marketplace/purchase`, { marketplaceTemplateId });
    },
    onSuccess: (data: any) => {
      if (data.requiresPayment) {
        toast({
          title: "Redirecting to checkout",
          description: `Price: $${(data.price / 100).toFixed(2)}`,
        });
        navigate(data.checkoutUrl);
      } else {
        toast({
          title: "Template acquired!",
          description: "You can now use this template in your projects.",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/viral/marketplace/templates"] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Purchase failed",
        description: error.message || "Failed to purchase template",
        variant: "destructive",
      });
    },
  });

  const templates = templatesData?.templates || [];

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${(price / 100).toFixed(2)}`;
  };

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
              <Store className="h-8 w-8 text-purple-500" />
              Template Marketplace
            </h1>
            <p className="text-gray-300">
              Premium healthcare templates and components from verified creators
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 p-4">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Category</label>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? "default" : "ghost"}
                        size="sm"
                        className={`w-full justify-start ${
                          selectedCategory === cat.id 
                            ? "bg-purple-600 hover:bg-purple-700" 
                            : "text-gray-400 hover:text-white"
                        }`}
                        onClick={() => setSelectedCategory(cat.id)}
                        data-testid={`filter-category-${cat.id}`}
                      >
                        {cat.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <label className="text-sm text-gray-400 mb-2 block">Price Range</label>
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="freeOnly"
                      checked={showFreeOnly}
                      onChange={(e) => setShowFreeOnly(e.target.checked)}
                      className="rounded border-gray-600"
                    />
                    <label htmlFor="freeOnly" className="text-sm text-gray-300">
                      Free only
                    </label>
                  </div>
                  {!showFreeOnly && (
                    <>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={500}
                        step={10}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}+</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-sm"
                    data-testid="select-sort"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-gray-800/50 border-purple-500/30 p-4">
              <BadgeCheck className="h-8 w-8 text-purple-400 mb-2" />
              <h4 className="font-semibold text-white mb-2">Become a Creator</h4>
              <p className="text-sm text-gray-400 mb-3">
                Sell your templates and earn 80% of each sale
              </p>
              <Button size="sm" variant="outline" className="w-full border-purple-500/50 hover:bg-purple-900/20">
                Learn More
              </Button>
            </Card>
          </aside>

          <div className="flex-1">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search marketplace..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  data-testid="input-search"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-gray-800/50 border-gray-700">
                    <Skeleton className="h-40 w-full bg-gray-700 rounded-t-lg" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 bg-gray-700" />
                      <Skeleton className="h-4 w-1/2 bg-gray-700" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-20">
                <Package className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-200 mb-2">No templates found</h3>
                <p className="text-gray-400">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {templates.map((template: any) => (
                  <Card
                    key={template.id}
                    className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all group overflow-hidden"
                    data-testid={`card-marketplace-${template.id}`}
                  >
                    {template.previewImage && (
                      <div className="aspect-video bg-gray-900 overflow-hidden">
                        <img
                          src={template.previewImage}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                            {template.name}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            by {template.sellerName || "MedBuilder"}
                          </CardDescription>
                        </div>
                        <Badge className={template.price === 0 
                          ? "bg-green-900/50 text-green-400" 
                          : "bg-purple-900/50 text-purple-400"
                        }>
                          {formatPrice(template.price || 0)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {template.rating?.toFixed(1) || "5.0"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {template.downloads || 0}
                        </span>
                        {template.isHipaaCompliant && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Shield className="h-4 w-4" />
                            HIPAA
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-gray-700 pt-4">
                      <Button
                        className={`w-full ${
                          template.price === 0 
                            ? "bg-emerald-600 hover:bg-emerald-700" 
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                        onClick={() => purchaseMutation.mutate(template.id)}
                        disabled={purchaseMutation.isPending}
                        data-testid={`btn-purchase-${template.id}`}
                      >
                        {template.price === 0 ? (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Get Free
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Purchase
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
