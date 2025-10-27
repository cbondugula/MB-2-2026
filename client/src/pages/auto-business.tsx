import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Building, FileText, TrendingUp, DollarSign } from "lucide-react";

export default function AutoBusiness() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="border-2 border-orange-400">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="w-8 h-8 text-orange-500" />
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                  Automated Business Plan Generation
                </CardTitle>
              </div>
              <Badge className="bg-yellow-500 text-black font-bold">
                COMING SOON
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              AI-powered business plan creation for healthcare startups and medical technology ventures.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Comprehensive Plans</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Complete business plans with market analysis, financial projections, and go-to-market strategies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Market Intelligence</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Real-time healthcare market data and competitive analysis for strategic planning.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Key Features</h3>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Automated financial modeling and revenue projections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Regulatory compliance analysis for healthcare ventures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Investor-ready pitch decks and presentations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Risk assessment and mitigation strategies</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
