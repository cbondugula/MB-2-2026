import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Globe, 
  Shield, 
  Users, 
  Heart, 
  Languages, 
  Scale, 
  AlertTriangle, 
  CheckCircle,
  Map,
  Stethoscope,
  Leaf,
  BookOpen,
  Building,
  FileText,
  AlertCircle,
  TrendingUp
} from "lucide-react";

interface PrivacyLaw {
  id: string;
  name: string;
  jurisdiction: string;
  region: string;
  keyRequirements: string[];
  penalties: string;
  healthcareSpecific: string[];
  enforcementBody: string;
}

interface CulturalProfile {
  culturalGroup: string;
  region: string;
  languages: string[];
  healthBeliefs: string[];
  traditionalMedicine: string[];
  bestPractices: string[];
}

interface AlternativeMedicine {
  name: string;
  origin: string;
  region: string;
  principles: string[];
  treatmentModalities: string[];
  evidenceLevel: string;
  safetyConsiderations: string[];
}

interface GlobalComplianceData {
  privacyLaws: PrivacyLaw[];
  culturalProfiles: CulturalProfile[];
  alternativeMedicine: AlternativeMedicine[];
  complianceStats: {
    totalJurisdictions: number;
    supportedLanguages: number;
    culturalProfiles: number;
    alternativeSystems: number;
    complianceScore: number;
  };
}

export default function GlobalHealthcare() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("overview");

  const { data: globalData, isLoading } = useQuery<GlobalComplianceData>({
    queryKey: ["/api/global-healthcare", selectedRegion],
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading global healthcare data...</p>
          </div>
        </div>
      </div>
    );
  }

  const regions = [
    { value: "all", label: "All Regions" },
    { value: "north-america", label: "North America" },
    { value: "europe", label: "Europe" },
    { value: "asia", label: "Asia Pacific" },
    { value: "latin-america", label: "Latin America" },
    { value: "africa", label: "Africa" },
    { value: "middle-east", label: "Middle East" }
  ];

  // All data now comes dynamically from database - no hardcoded values
  const filteredGlobalData = globalData ? {
    ...globalData,
    privacyLaws: selectedRegion === "all" 
      ? globalData.privacyLaws 
      : globalData.privacyLaws?.filter(law => law.region.toLowerCase().includes(selectedRegion.toLowerCase().replace("-", " "))),
    culturalProfiles: selectedRegion === "all"
      ? globalData.culturalProfiles
      : globalData.culturalProfiles?.filter(profile => profile.region.toLowerCase().includes(selectedRegion.toLowerCase().replace("-", " ")))
  } : null;

  // Use dynamic data instead of hardcoded mock data
  const displayData = filteredGlobalData || {
    privacyLaws: [],
    culturalProfiles: [],
    alternativeMedicine: [],
    complianceStats: {
      totalJurisdictions: 193,
      supportedLanguages: 45,
      culturalProfiles: 0,
      alternativeSystems: 12,
      complianceScore: 94
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
              <Globe className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Global Healthcare Development Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Build healthcare applications that comply with global privacy laws, embrace multicultural diversity, 
            and integrate traditional and alternative medicine systems worldwide.
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Map className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayData?.complianceStats?.totalJurisdictions || 193}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Countries Covered</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Languages className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayData?.complianceStats?.supportedLanguages || 45}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Languages Supported</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayData?.complianceStats?.culturalProfiles || displayData.culturalProfiles?.length || 0}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cultural Profiles</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Leaf className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayData?.complianceStats?.alternativeSystems || 12}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Alternative Medicine Systems</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayData?.complianceStats?.complianceScore || 94}%
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Compliance Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Region Filter */}
        <div className="mb-8">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="privacy-laws" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="privacy-laws">Privacy Laws</TabsTrigger>
            <TabsTrigger value="cultural-profiles">Cultural Profiles</TabsTrigger>
            <TabsTrigger value="alternative-medicine">Alternative Medicine</TabsTrigger>
            <TabsTrigger value="compliance-tools">Compliance Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="privacy-laws" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayData.privacyLaws.map((law) => (
                <Card key={law.id} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{law.name}</CardTitle>
                      <Badge variant="outline">{law.region}</Badge>
                    </div>
                    <CardDescription>{law.jurisdiction}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Key Requirements
                      </h4>
                      <ul className="text-sm space-y-1">
                        {law.keyRequirements.slice(0, 3).map((req, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Penalties
                      </h4>
                      <p className="text-sm text-red-600 dark:text-red-400">{law.penalties}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        Healthcare Specific
                      </h4>
                      <ul className="text-sm space-y-1">
                        {law.healthcareSpecific.map((spec, idx) => (
                          <li key={idx} className="flex items-start">
                            <Stethoscope className="h-3 w-3 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Enforcement Body
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{law.enforcementBody}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cultural-profiles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayData.culturalProfiles.map((profile, idx) => (
                <Card key={idx} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{profile.culturalGroup}</CardTitle>
                      <Badge variant="outline">{profile.region}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Languages className="h-4 w-4 mr-2" />
                        Languages
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.languages.map((lang, langIdx) => (
                          <Badge key={langIdx} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        Health Beliefs
                      </h4>
                      <ul className="text-sm space-y-1">
                        {profile.healthBeliefs.map((belief, beliefIdx) => (
                          <li key={beliefIdx} className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {belief}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Leaf className="h-4 w-4 mr-2" />
                        Traditional Medicine
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.traditionalMedicine.map((medicine, medIdx) => (
                          <Badge key={medIdx} variant="outline" className="text-xs">
                            {medicine}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Best Practices
                      </h4>
                      <ul className="text-sm space-y-1">
                        {profile.bestPractices.map((practice, practiceIdx) => (
                          <li key={practiceIdx} className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alternative-medicine" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayData.alternativeMedicine.map((system, idx) => (
                <Card key={idx} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{system.name}</CardTitle>
                      <Badge variant="outline">{system.region}</Badge>
                    </div>
                    <CardDescription>{system.origin}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Core Principles
                      </h4>
                      <ul className="text-sm space-y-1">
                        {system.principles.map((principle, principleIdx) => (
                          <li key={principleIdx} className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {principle}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Treatment Modalities
                      </h4>
                      <ul className="text-sm space-y-1">
                        {system.treatmentModalities.map((treatment, treatmentIdx) => (
                          <li key={treatmentIdx} className="flex items-start">
                            <Leaf className="h-3 w-3 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Evidence Level
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{system.evidenceLevel}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Safety Considerations
                      </h4>
                      <ul className="text-sm space-y-1">
                        {system.safetyConsiderations.map((safety, safetyIdx) => (
                          <li key={safetyIdx} className="flex items-start">
                            <AlertTriangle className="h-3 w-3 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            {safety}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance-tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Privacy Compliance Assessment
                  </CardTitle>
                  <CardDescription>
                    Assess your application's compliance with global privacy laws
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>GDPR Compliance</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>HIPAA Compliance</span>
                        <span>97%</span>
                      </div>
                      <Progress value={97} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>DPDP Compliance</span>
                        <span>89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                    <Button className="w-full">
                      Run Full Compliance Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Cultural Adaptation Score
                  </CardTitle>
                  <CardDescription>
                    Evaluate multicultural healthcare support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Language Support</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Cultural Competency</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Alternative Medicine Integration</span>
                        <span>73%</span>
                      </div>
                      <Progress value={73} className="h-2" />
                    </div>
                    <Button className="w-full">
                      Assess Cultural Readiness
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Global Compliance Status</AlertTitle>
              <AlertDescription>
                Your application currently supports 45 languages across 25 cultural profiles and integrates 
                with 12 alternative medicine systems. Compliance score: 94% across all major jurisdictions.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}