import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Languages, 
  Shield, 
  FileText, 
  Building,
  MapPin,
  Clock,
  Phone,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface CountryHealthcareSystem {
  countryCode: string;
  countryName: string;
  officialLanguages: string[];
  healthcareSystemType: 'universal' | 'insurance-based' | 'mixed' | 'private' | 'government-funded';
  primaryRegulator: string;
  healthDataPrivacyLaws: string[];
  medicalCodingSystems: string[];
  prescriptionRegulations: string[];
  telemedicineStatus: 'fully-legal' | 'restricted' | 'pilot-programs' | 'prohibited';
  digitalHealthInitiatives: string[];
  interoperabilityStandards: string[];
  medicalDeviceRegulations: string[];
  clinicalTrialRegulations: string[];
  aiMlHealthcareRegulations: string[];
  currency: string;
  timeZone: string[];
  emergencyNumber: string;
  healthMinistry: string;
  fhirAdoption: 'advanced' | 'developing' | 'pilot' | 'none';
  hl7Implementation: boolean;
  gdprCompliant: boolean;
}

export default function GlobalHealthcare() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const sampleHealthcareSystems: CountryHealthcareSystem[] = [
    {
      countryCode: 'US',
      countryName: 'United States',
      officialLanguages: ['en'],
      healthcareSystemType: 'mixed',
      primaryRegulator: 'FDA, CMS, ONC',
      healthDataPrivacyLaws: ['HIPAA', 'HITECH Act', '21st Century Cures Act'],
      medicalCodingSystems: ['ICD-10-CM', 'ICD-10-PCS', 'CPT', 'HCPCS', 'SNOMED CT'],
      prescriptionRegulations: ['DEA', 'FDA Drug Schedule', 'PDMP'],
      telemedicineStatus: 'fully-legal',
      digitalHealthInitiatives: ['MyHealthEData', 'TEFCA', 'HTI-1 Rule'],
      interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'CDA', 'SMART on FHIR', 'US Core'],
      medicalDeviceRegulations: ['FDA 510(k)', 'FDA PMA', 'FDA De Novo', 'ISO 13485'],
      clinicalTrialRegulations: ['FDA Good Clinical Practice', 'ICH Guidelines'],
      aiMlHealthcareRegulations: ['FDA AI/ML Guidance', 'Algorithm Change Protocol'],
      currency: 'USD',
      timeZone: ['EST', 'CST', 'MST', 'PST'],
      emergencyNumber: '911',
      healthMinistry: 'Department of Health and Human Services',
      fhirAdoption: 'advanced',
      hl7Implementation: true,
      gdprCompliant: false
    },
    {
      countryCode: 'GB',
      countryName: 'United Kingdom',
      officialLanguages: ['en'],
      healthcareSystemType: 'universal',
      primaryRegulator: 'NHS England, MHRA, ICO',
      healthDataPrivacyLaws: ['UK GDPR', 'Data Protection Act 2018', 'NHS Data Security'],
      medicalCodingSystems: ['ICD-10', 'SNOMED CT', 'dm+d', 'OPCS-4'],
      prescriptionRegulations: ['MHRA', 'POM-V', 'Controlled Drugs Regulations'],
      telemedicineStatus: 'fully-legal',
      digitalHealthInitiatives: ['NHS Digital', 'NHS App', 'Global Digital Exemplars'],
      interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'FHIR UK Core'],
      medicalDeviceRegulations: ['UKCA', 'CE Marking', 'MHRA MDR'],
      clinicalTrialRegulations: ['MHRA GCP', 'Clinical Trials Regulation'],
      aiMlHealthcareRegulations: ['NHS AI Ethics Framework', 'MHRA AI Guidance'],
      currency: 'GBP',
      timeZone: ['GMT', 'BST'],
      emergencyNumber: '999',
      healthMinistry: 'Department of Health and Social Care',
      fhirAdoption: 'advanced',
      hl7Implementation: true,
      gdprCompliant: true
    },
    {
      countryCode: 'DE',
      countryName: 'Germany',
      officialLanguages: ['de'],
      healthcareSystemType: 'insurance-based',
      primaryRegulator: 'BfArM, PEI, BMG',
      healthDataPrivacyLaws: ['GDPR', 'BDSG', 'Patientendaten-Schutz-Gesetz'],
      medicalCodingSystems: ['ICD-10-GM', 'OPS', 'SNOMED CT'],
      prescriptionRegulations: ['AMG', 'BtMG', 'E-Rezept'],
      telemedicineStatus: 'fully-legal',
      digitalHealthInitiatives: ['Digitale Gesundheitsanwendungen', 'E-Rezept', 'Telematikinfrastruktur'],
      interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'KBV FHIR'],
      medicalDeviceRegulations: ['MDR', 'CE Marking', 'MPG'],
      clinicalTrialRegulations: ['GCP-V', 'Clinical Trials Regulation'],
      aiMlHealthcareRegulations: ['EU AI Act', 'DiGA AI Guidelines'],
      currency: 'EUR',
      timeZone: ['CET', 'CEST'],
      emergencyNumber: '112',
      healthMinistry: 'Bundesministerium für Gesundheit',
      fhirAdoption: 'advanced',
      hl7Implementation: true,
      gdprCompliant: true
    },
    {
      countryCode: 'IN',
      countryName: 'India',
      officialLanguages: ['hi', 'en'],
      healthcareSystemType: 'mixed',
      primaryRegulator: 'CDSCO, MoHFW',
      healthDataPrivacyLaws: ['Digital Personal Data Protection Act', 'IT Rules 2021'],
      medicalCodingSystems: ['ICD-10', 'ACHI', 'AYUSH codes'],
      prescriptionRegulations: ['Drugs and Cosmetics Act', 'CDSCO'],
      telemedicineStatus: 'fully-legal',
      digitalHealthInitiatives: ['Ayushman Bharat Digital Mission', 'e-Sanjeevani', 'ABDM'],
      interoperabilityStandards: ['FHIR R4', 'HL7 v2', 'ABDM Standards'],
      medicalDeviceRegulations: ['Medical Device Rules 2017', 'IS 13485'],
      clinicalTrialRegulations: ['New Drugs and Clinical Trials Rules', 'ICH-GCP'],
      aiMlHealthcareRegulations: ['National Strategy for AI', 'MeitY AI Guidelines'],
      currency: 'INR',
      timeZone: ['IST'],
      emergencyNumber: '108',
      healthMinistry: 'Ministry of Health and Family Welfare',
      fhirAdoption: 'developing',
      hl7Implementation: true,
      gdprCompliant: false
    },
    {
      countryCode: 'CN',
      countryName: 'China',
      officialLanguages: ['zh'],
      healthcareSystemType: 'universal',
      primaryRegulator: 'NMPA, NHC',
      healthDataPrivacyLaws: ['Personal Information Protection Law', 'Data Security Law', 'Cybersecurity Law'],
      medicalCodingSystems: ['ICD-10', 'ICD-9-CM-3', 'Traditional Chinese Medicine codes'],
      prescriptionRegulations: ['Drug Administration Law', 'NMPA Regulations'],
      telemedicineStatus: 'fully-legal',
      digitalHealthInitiatives: ['National Health Information Platform', 'Internet+ Healthcare'],
      interoperabilityStandards: ['HL7 v2', 'FHIR R4', 'WS*'],
      medicalDeviceRegulations: ['Medical Device Regulations', 'NMPA'],
      clinicalTrialRegulations: ['Good Clinical Practice', 'Drug Registration Regulations'],
      aiMlHealthcareRegulations: ['AI Medical Device Guidelines', 'Algorithm Recommendation Management'],
      currency: 'CNY',
      timeZone: ['CST'],
      emergencyNumber: '120',
      healthMinistry: 'National Health Commission',
      fhirAdoption: 'developing',
      hl7Implementation: true,
      gdprCompliant: false
    }
  ];

  const supportedLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', speakers: 1500000000 },
    { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文', speakers: 918000000 },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speakers: 602000000 },
    { code: 'es', name: 'Spanish', nativeName: 'Español', speakers: 559000000 },
    { code: 'fr', name: 'French', nativeName: 'Français', speakers: 280000000 },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', speakers: 422000000 },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', speakers: 260000000 },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', speakers: 258000000 },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', speakers: 125000000 },
    { code: 'de', name: 'German', nativeName: 'Deutsch', speakers: 95000000 }
  ];

  const filteredCountries = sampleHealthcareSystems.filter(country =>
    country.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.countryCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCountry = (countryCode: string) => {
    setSelectedCountries(prev =>
      prev.includes(countryCode)
        ? prev.filter(code => code !== countryCode)
        : [...prev, countryCode]
    );
  };

  const toggleLanguage = (languageCode: string) => {
    setSelectedLanguages(prev =>
      prev.includes(languageCode)
        ? prev.filter(code => code !== languageCode)
        : [...prev, languageCode]
    );
  };

  const generateGlobalHealthcareApp = async () => {
    if (selectedCountries.length === 0 || selectedLanguages.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one country and one language",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-global-healthcare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countries: selectedCountries,
          languages: selectedLanguages,
          aiModel: "Med-Gemma"
        })
      });

      if (!response.ok) throw new Error('Global healthcare app generation failed');

      const result = await response.json();
      
      toast({
        title: "Global Healthcare App Generated",
        description: `Generated multilingual app for ${selectedCountries.length} countries in ${selectedLanguages.length} languages`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate global healthcare application",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getSystemTypeColor = (type: string) => {
    switch (type) {
      case 'universal': return 'bg-green-500';
      case 'insurance-based': return 'bg-blue-500';
      case 'mixed': return 'bg-yellow-500';
      case 'private': return 'bg-red-500';
      case 'government-funded': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTelemedicineColor = (status: string) => {
    switch (status) {
      case 'fully-legal': return 'text-green-600';
      case 'restricted': return 'text-yellow-600';
      case 'pilot-programs': return 'text-blue-600';
      case 'prohibited': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Global Healthcare Platform</h1>
          <p className="text-muted-foreground">
            Build multilingual healthcare applications supporting 193 countries and global healthcare guidelines
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8 text-blue-500" />
          <span className="text-sm font-medium">193 Countries • 10+ Languages</span>
        </div>
      </div>

      <Tabs defaultValue="countries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="countries">Healthcare Systems</TabsTrigger>
          <TabsTrigger value="languages">Language Support</TabsTrigger>
          <TabsTrigger value="regulations">Global Regulations</TabsTrigger>
          <TabsTrigger value="generator">App Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="countries" className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <span className="text-sm text-muted-foreground">
              {selectedCountries.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCountries.map(country => (
              <Card 
                key={country.countryCode}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedCountries.includes(country.countryCode)
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950'
                    : ''
                }`}
                onClick={() => toggleCountry(country.countryCode)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{country.countryCode === 'US' ? '🇺🇸' : 
                                                  country.countryCode === 'GB' ? '🇬🇧' :
                                                  country.countryCode === 'DE' ? '🇩🇪' :
                                                  country.countryCode === 'IN' ? '🇮🇳' :
                                                  country.countryCode === 'CN' ? '🇨🇳' : '🌍'}</span>
                      <CardTitle className="text-lg">{country.countryName}</CardTitle>
                    </div>
                    {selectedCountries.includes(country.countryCode) && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSystemTypeColor(country.healthcareSystemType)}>
                      {country.healthcareSystemType.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline">{country.countryCode}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <Languages className="h-3 w-3" />
                      <span>{country.officialLanguages.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{country.currency}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{country.emergencyNumber}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{country.timeZone[0]}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-1">Telemedicine Status:</p>
                    <span className={`text-xs ${getTelemedicineColor(country.telemedicineStatus)}`}>
                      {country.telemedicineStatus.replace('-', ' ')}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-1">FHIR Adoption:</p>
                    <Badge variant={country.fhirAdoption === 'advanced' ? 'default' : 'secondary'}>
                      {country.fhirAdoption}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-1">Compliance:</p>
                    <div className="flex flex-wrap gap-1">
                      {country.gdprCompliant && (
                        <Badge variant="outline" className="text-xs">GDPR</Badge>
                      )}
                      {country.hl7Implementation && (
                        <Badge variant="outline" className="text-xs">HL7</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {selectedLanguages.length} languages selected for multilingual support
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportedLanguages.map(language => (
              <Card 
                key={language.code}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedLanguages.includes(language.code)
                    ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950'
                    : ''
                }`}
                onClick={() => toggleLanguage(language.code)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{language.name}</CardTitle>
                      <CardDescription>{language.nativeName}</CardDescription>
                    </div>
                    {selectedLanguages.includes(language.code) && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Language Code:</span>
                      <Badge variant="outline">{language.code.toUpperCase()}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Speakers:</span>
                      <span className="text-xs">{(language.speakers / 1000000).toFixed(0)}M</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs">Medical terminology support</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs">Clinical NLP available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regulations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Privacy Regulations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">GDPR</h4>
                    <Badge>EU/EEA</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    General Data Protection Regulation for healthcare data protection
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">HIPAA</h4>
                    <Badge>US</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Health Insurance Portability and Accountability Act
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">LGPD</h4>
                    <Badge>Brazil</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lei Geral de Proteção de Dados Pessoais
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Medical Device Regulations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">MDR</h4>
                    <Badge>EU</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Medical Device Regulation for EU market
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">FDA 510(k)</h4>
                    <Badge>US</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    FDA medical device approval process
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">TGA</h4>
                    <Badge>Australia</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Therapeutic Goods Administration regulations
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Healthcare Application Generator</CardTitle>
              <CardDescription>
                Generate a multilingual healthcare application with country-specific compliance and regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCountries.length === 0 || selectedLanguages.length === 0 ? (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Select countries and languages from the previous tabs to generate your global healthcare application
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Selected Countries ({selectedCountries.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCountries.map(code => {
                          const country = sampleHealthcareSystems.find(c => c.countryCode === code);
                          return (
                            <Badge key={code} variant="outline">
                              {country?.countryName || code}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Selected Languages ({selectedLanguages.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLanguages.map(code => {
                          const language = supportedLanguages.find(l => l.code === code);
                          return (
                            <Badge key={code} variant="outline">
                              {language?.name || code}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-medium mb-2">Generated Application Will Include:</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Multilingual user interface and content</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Country-specific healthcare regulations compliance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Local medical coding systems integration</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Regional interoperability standards</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Cultural healthcare preferences</span>
                      </li>
                    </ul>
                  </div>

                  <Button 
                    onClick={generateGlobalHealthcareApp}
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {isGenerating ? "Generating Global Healthcare App..." : "Generate Global Healthcare Application"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}