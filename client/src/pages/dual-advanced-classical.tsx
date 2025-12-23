import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { ArrowLeft, Shield, Zap, FileText, Award, TrendingUp, DollarSign, CheckCircle, Scale } from "lucide-react";

interface Patent {
  id: string;
  title: string;
  type: "advanced" | "classical";
  status: "filed" | "pending" | "granted";
  value: number;
  filingDate: string;
}

export default function DualAdvancedClassical() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "advanced" | "classical">("all");

  // Mock patent data (in production, fetch from API)
  const patents: Patent[] = [
    {
      id: "US-001",
      title: "Voice-Controlled Healthcare Application Development System",
      type: "advanced",
      status: "filed",
      value: 4200000000,
      filingDate: "2024-Q4"
    },
    {
      id: "US-002",
      title: "AI-Powered HIPAA Compliance Automation",
      type: "advanced",
      status: "pending",
      value: 3800000000,
      filingDate: "2024-Q4"
    },
    {
      id: "US-003",
      title: "Multi-AI Verification for Medical Applications",
      type: "classical",
      status: "granted",
      value: 2100000000,
      filingDate: "2024-Q3"
    },
    {
      id: "US-004",
      title: "Brain-Computer Interface for Healthcare Development",
      type: "advanced",
      status: "filed",
      value: 5500000000,
      filingDate: "2024-Q4"
    },
    {
      id: "US-005",
      title: "Automated Medical Education Platform Generation",
      type: "classical",
      status: "granted",
      value: 1900000000,
      filingDate: "2024-Q3"
    },
    {
      id: "US-006",
      title: "Real-Time Clinical Decision Support System",
      type: "classical",
      status: "granted",
      value: 2400000000,
      filingDate: "2024-Q3"
    }
  ];

  const filteredPatents = selectedCategory === "all" 
    ? patents 
    : patents.filter(p => p.type === selectedCategory);

  const stats = {
    total: patents.length,
    advanced: patents.filter(p => p.type === "advanced").length,
    classical: patents.filter(p => p.type === "classical").length,
    totalValue: patents.reduce((sum, p) => sum + p.value, 0),
    granted: patents.filter(p => p.status === "granted").length
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    }
    return `$${(value / 1000000).toFixed(0)}M`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <Card className="border-2 border-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-10 h-10 text-cyan-500" />
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dual Patent Strategy
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Advanced & Classical IP Protection Portfolio
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-[#76B900] text-white font-bold text-sm px-3 py-1">
                ACTIVE
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Dashboard */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Patents</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <FileText className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio Value</p>
                  <p className="text-2xl font-bold text-[#76B900]">{formatCurrency(stats.totalValue)}</p>
                </div>
                <DollarSign className="w-10 h-10 text-[#76B900]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Advanced Patents</p>
                  <p className="text-3xl font-bold text-cyan-600">{stats.advanced}</p>
                </div>
                <Zap className="w-10 h-10 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Classical Patents</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.classical}</p>
                </div>
                <Shield className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="patents" data-testid="tab-patents">Patent Portfolio</TabsTrigger>
            <TabsTrigger value="strategy" data-testid="tab-strategy">Strategy</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-cyan-50 dark:bg-cyan-950 border-2 border-cyan-400">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-cyan-500" />
                    <CardTitle>Advanced Patent Claims</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Future-oriented claims protecting emerging AI and healthcare technologies
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#76B900]" />
                      <span className="text-sm">Voice-controlled development systems</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#76B900]" />
                      <span className="text-sm">Brain-computer interface integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#76B900]" />
                      <span className="text-sm">Predictive AI compliance engines</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#76B900]" />
                      <span className="text-sm">Advanced neural processing</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Estimated Value</span>
                      <span className="text-xl font-bold text-cyan-600">
                        ${((stats.totalValue * 0.65) / 1000000000).toFixed(1)}B
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-400">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-500" />
                    <CardTitle>Classical Patent Claims</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Immediate protection for current implementations and proven solutions
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#76B900]" />
                      <span className="text-sm">HIPAA compliance automation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#76B900]" />
                      <span className="text-sm">Medical education platforms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#76B900]" />
                      <span className="text-sm">Clinical decision support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#76B900]" />
                      <span className="text-sm">Multi-AI verification systems</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Estimated Value</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${((stats.totalValue * 0.35) / 1000000000).toFixed(1)}B
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-[#e8f5d9] dark:from-[#1a3d00] dark:to-[#76B900]950 border-2 border-[#8CC63F]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#76B900]" />
                  <CardTitle>Patent Success Rate</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Granted Patents</span>
                      <span className="text-sm font-bold">{stats.granted} / {stats.total} ({((stats.granted / stats.total) * 100).toFixed(0)}%)</span>
                    </div>
                    <Progress value={(stats.granted / stats.total) * 100} className="h-3" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Strong patent approval rate demonstrates robust IP strategy and innovation quality
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patents Tab */}
          <TabsContent value="patents" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                data-testid="filter-all"
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
              >
                All ({patents.length})
              </Button>
              <Button
                data-testid="filter-advanced"
                variant={selectedCategory === "advanced" ? "default" : "outline"}
                onClick={() => setSelectedCategory("advanced")}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Advanced ({stats.advanced})
              </Button>
              <Button
                data-testid="filter-classical"
                variant={selectedCategory === "classical" ? "default" : "outline"}
                onClick={() => setSelectedCategory("classical")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Classical ({stats.classical})
              </Button>
            </div>

            <div className="space-y-3">
              {filteredPatents.map((patent) => (
                <Card key={patent.id} className={`border-l-4 ${patent.type === "advanced" ? "border-l-cyan-500" : "border-l-blue-500"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {patent.id}
                          </Badge>
                          <Badge className={patent.type === "advanced" ? "bg-cyan-500" : "bg-blue-500"}>
                            {patent.type === "advanced" ? "Advanced" : "Classical"}
                          </Badge>
                          <Badge variant={patent.status === "granted" ? "default" : "secondary"}>
                            {patent.status.charAt(0).toUpperCase() + patent.status.slice(1)}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {patent.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>Filed: {patent.filingDate}</span>
                          <span className="font-semibold text-[#76B900]">
                            Value: {formatCurrency(patent.value)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="w-6 h-6 text-purple-500" />
                  <CardTitle>Dual Strategy Benefits</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-cyan-50 dark:bg-cyan-950 p-4 rounded-lg">
                    <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
                      Immediate Protection
                    </h4>
                    <p className="text-sm text-cyan-800 dark:text-cyan-200">
                      Classical patents protect current implementations, generating immediate licensing revenue and competitive barriers
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      Future Innovation
                    </h4>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      Advanced patents secure emerging technologies, ensuring long-term market dominance and acquisition value
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-[#c8e6a5] dark:from-[#1a3d00] dark:to-[#1a3d00] p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-[#76B900] dark:text-[#8CC63F]" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Strategic Advantages</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[#76B900] font-bold">•</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Comprehensive Coverage:</strong> Protection across current and future healthcare AI technologies
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#76B900] font-bold">•</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Competitive Moat:</strong> 3-5 year technology lead prevents market entry
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#76B900] font-bold">•</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Global Protection:</strong> Coverage across 193 countries with multi-jurisdictional enforcement
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#76B900] font-bold">•</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Acquisition Premium:</strong> Portfolio value of $46.63B-$84.88B significantly increases M&A attractiveness
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
