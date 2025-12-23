import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Shield, FileText, CreditCard, Signature, CheckCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

// Stepper Component
interface StepperProps {
  currentStep: number;
  steps: Array<{
    number: number;
    title: string;
    icon: React.ComponentType<any>;
  }>;
}

function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : isCompleted 
                    ? 'bg-[#76B900] text-white' 
                    : 'bg-gray-700 text-gray-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="ml-2">
                <div className={`text-sm font-medium ${
                  isActive ? 'text-blue-400' : isCompleted ? 'text-[#8CC63F]' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`mx-4 h-0.5 w-8 ${
                  isCompleted ? 'bg-[#76B900]' : 'bg-gray-700'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface OrganizationData {
  name: string;
  type: string;
  size: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  contactPerson: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  estimatedUsers: number;
  complianceNeeds: string[];
  integrationNeeds: string[];
  requirements: any;
}

export default function ContractOnboarding() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Get selected plan from localStorage (from pricing page)
  const selectedPlan = localStorage.getItem('selectedPlan') || 'starter';
  const selectedBilling = localStorage.getItem('selectedBilling') || 'monthly';
  
  // Get custom pricing data if available
  const customPricingFactors = localStorage.getItem('customPricingFactors') 
    ? JSON.parse(localStorage.getItem('customPricingFactors')!) 
    : null;
  const customPricingResult = localStorage.getItem('customPricingResult') 
    ? JSON.parse(localStorage.getItem('customPricingResult')!) 
    : null;
  const [formData, setFormData] = useState<OrganizationData>({
    name: "",
    type: "",
    size: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    email: "",
    website: "",
    taxId: "",
    contactPerson: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
    estimatedUsers: 0,
    complianceNeeds: [],
    integrationNeeds: [],
    requirements: {}
  });

  const [contractPreview, setContractPreview] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'ach' | 'credit_card'>('credit_card');

  // Organization creation mutation
  const createOrganizationMutation = useMutation({
    mutationFn: async (data: OrganizationData) => {
      // If not authenticated, redirect to login first
      if (!isAuthenticated) {
        // Store the organization data for after login
        localStorage.setItem('pendingOrganization', JSON.stringify(data));
        window.location.href = '/api/login';
        return null;
      }
      return await apiRequest("POST", "/api/organizations", data);
    },
    onSuccess: async (organization) => {
      if (!organization) return; // Login redirect case
      
      toast({
        title: "Organization Created",
        description: "Your organization has been registered successfully.",
      });
      
      // Generate contract automatically using selected plan
      const contractResponse = await apiRequest("POST", "/api/contracts/generate", {
        organizationId: organization.id,
        planId: selectedPlan,
        billingPeriod: selectedBilling,
        customPricing: customPricingResult || organization.requirements,
        customFactors: customPricingFactors
      });
      
      setContractPreview(contractResponse);
      setCurrentStep(3);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Contract signature mutation
  const signContractMutation = useMutation({
    mutationFn: async (signatureData: any) => {
      return await apiRequest("POST", "/api/contracts/sign", signatureData);
    },
    onSuccess: () => {
      setCurrentStep(5);
      toast({
        title: "Contract Signed",
        description: "Your contract has been signed and sent to our team for final execution. You'll be redirected to view your legal documents.",
      });
      // Navigate to legal documents page after success
      setTimeout(() => {
        setLocation('/legal-documents');
      }, 3000);
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrganizationMutation.mutate(formData);
    setCurrentStep(2);
  };

  const handleContractApproval = () => {
    setCurrentStep(4);
  };

  const handlePaymentAndSignature = async (signatureData: string) => {
    await signContractMutation.mutateAsync({
      contractId: contractPreview.id,
      signatureData,
      paymentMethod,
    });
  };

  // Fetch dynamic organization types from API
  const { data: organizationTypes = [] } = useQuery({
    queryKey: ['/api/organizations/types'],
  });

  // Fetch dynamic organization sizes from API
  const { data: organizationSizes = [] } = useQuery({
    queryKey: ['/api/organizations/sizes'],
  });

  // Fetch dynamic compliance options from API
  const { data: complianceOptions = [] } = useQuery({
    queryKey: ['/api/compliance/options'],
  });

  // Fetch dynamic integration options from API
  const { data: integrationOptions = [] } = useQuery({
    queryKey: ['/api/integrations/options'],
  });

  const steps = [
    { number: 1, title: "Organization Details", icon: Building },
    { number: 2, title: "Processing", icon: FileText },
    { number: 3, title: "Contract Review", icon: FileText },
    { number: 4, title: "Payment & Signature", icon: CreditCard },
    { number: 5, title: "Complete", icon: CheckCircle }
  ];

  // Allow access for both authenticated and unauthenticated users
  // The authentication flow will happen during the contract process

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Complete Contract Automation
          </h1>
          <p className="text-xl text-gray-400">
            Streamlined onboarding from organization details to fully executed contract
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-12">
          <Stepper currentStep={currentStep} steps={steps} />
        </div>

        {/* Step 1: Organization Form */}
        {currentStep === 1 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Building className="w-6 h-6 mr-2 text-blue-500" />
                Organization Information
              </CardTitle>
              <CardDescription>
                Tell us about your healthcare organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white">Organization Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type" className="text-white">Organization Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder={organizationTypes.length > 0 ? "Select type" : "Loading..."} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {organizationTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-white hover:bg-gray-600">{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="size" className="text-white">Organization Size *</Label>
                    <Select value={formData.size} onValueChange={(value) => setFormData({...formData, size: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder={organizationSizes.length > 0 ? "Select size" : "Loading..."} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {organizationSizes.map((size) => (
                          <SelectItem key={size} value={size} className="text-white hover:bg-gray-600">{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="estimatedUsers" className="text-white">Expected Users *</Label>
                    <Input
                      id="estimatedUsers"
                      type="number"
                      value={formData.estimatedUsers}
                      onChange={(e) => setFormData({...formData, estimatedUsers: parseInt(e.target.value)})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Address Information</h3>
                  <div>
                    <Label htmlFor="address" className="text-white">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-white">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-white">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-white">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPerson" className="text-white">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactTitle" className="text-white">Title *</Label>
                      <Input
                        id="contactTitle"
                        value={formData.contactTitle}
                        onChange={(e) => setFormData({...formData, contactTitle: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail" className="text-white">Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone" className="text-white">Phone *</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Compliance Requirements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Compliance Requirements</h3>
                  {complianceOptions.length === 0 ? (
                    <div className="text-gray-400">Loading compliance options...</div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {complianceOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={option}
                            checked={formData.complianceNeeds.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  complianceNeeds: [...formData.complianceNeeds, option]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  complianceNeeds: formData.complianceNeeds.filter(item => item !== option)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={option} className="text-white text-sm cursor-pointer">{option}</Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Integration Requirements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Integration Requirements</h3>
                  {integrationOptions.length === 0 ? (
                    <div className="text-gray-400">Loading integration options...</div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {integrationOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={option}
                            checked={formData.integrationNeeds.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  integrationNeeds: [...formData.integrationNeeds, option]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  integrationNeeds: formData.integrationNeeds.filter(item => item !== option)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={option} className="text-white text-sm cursor-pointer">{option}</Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={createOrganizationMutation.isPending}
                  className="w-full bg-[#76B900] hover:bg-[#5a8f00]"
                >
                  {createOrganizationMutation.isPending 
                    ? "Processing..." 
                    : isAuthenticated 
                      ? "Generate Contract" 
                      : "Continue with Login & Generate Contract"
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Processing */}
        {currentStep === 2 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-[#76B900] border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Generating Your Contract</h3>
              <p className="text-gray-400">
                Our AI is analyzing your requirements and creating a custom contract...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Contract Review */}
        {currentStep === 3 && contractPreview && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-6 h-6 mr-2 text-[#76B900]" />
                Review Your Custom Contract
              </CardTitle>
              <CardDescription>
                Please review the auto-generated contract terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contract Summary */}
              <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-4">Contract Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Organization:</span>
                    <span className="text-white ml-2">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Plan:</span>
                    <span className="text-white ml-2">Custom Enterprise</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Monthly Price:</span>
                    <span className="text-white ml-2">${contractPreview.monthlyPrice}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Annual Price:</span>
                    <span className="text-white ml-2">${contractPreview.annualPrice}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Setup Fee:</span>
                    <span className="text-white ml-2">${contractPreview.setupFee}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Contract Term:</span>
                    <span className="text-white ml-2">12 months</span>
                  </div>
                </div>
              </div>

              {/* Contract Terms Preview */}
              <div className="bg-gray-700 p-6 rounded-lg max-h-96 overflow-y-auto">
                <h4 className="text-lg font-semibold text-white mb-4">Contract Terms</h4>
                <div className="text-sm text-gray-300 whitespace-pre-line">
                  {contractPreview.contractTerms}
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Edit
                </Button>
                <Button
                  onClick={handleContractApproval}
                  className="flex-1 bg-[#76B900] hover:bg-[#5a8f00]"
                >
                  Approve Contract
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Payment & Signature */}
        {currentStep === 4 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-[#76B900]" />
                Payment & Digital Signature
              </CardTitle>
              <CardDescription>
                Choose payment method and sign the contract
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <Label className="text-white mb-4 block">Payment Method</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all ${
                      paymentMethod === 'credit_card' 
                        ? 'border-[#76B900] bg-[#1a3d00]/20' 
                        : 'border-gray-600 bg-gray-700'
                    }`}
                    onClick={() => setPaymentMethod('credit_card')}
                  >
                    <CardContent className="p-4 text-center">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 text-[#76B900]" />
                      <h4 className="text-white font-semibold">Credit Card</h4>
                      <p className="text-gray-400 text-sm">Instant processing</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all ${
                      paymentMethod === 'ach' 
                        ? 'border-[#76B900] bg-[#1a3d00]/20' 
                        : 'border-gray-600 bg-gray-700'
                    }`}
                    onClick={() => setPaymentMethod('ach')}
                  >
                    <CardContent className="p-4 text-center">
                      <Building className="w-8 h-8 mx-auto mb-2 text-[#76B900]" />
                      <h4 className="text-white font-semibold">ACH Transfer</h4>
                      <p className="text-gray-400 text-sm">Bank transfer (3-5 days)</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Digital Signature */}
              <div>
                <Label className="text-white mb-4 block">Digital Signature</Label>
                <div className="bg-gray-700 p-6 rounded-lg border-2 border-dashed border-gray-600">
                  <div className="text-center">
                    <Signature className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-white font-semibold mb-2">Sign Contract</h4>
                    <p className="text-gray-400 mb-4">
                      Click below to sign the contract digitally
                    </p>
                    <Button
                      onClick={() => handlePaymentAndSignature("digital_signature_placeholder")}
                      disabled={signContractMutation.isPending}
                      className="bg-[#76B900] hover:bg-[#5a8f00]"
                    >
                      {signContractMutation.isPending ? "Processing..." : "Sign Contract"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Complete */}
        {currentStep === 5 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#76B900]" />
              <h3 className="text-2xl font-semibold text-white mb-4">Contract Completed!</h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Your contract has been successfully signed and submitted. Our account representative 
                will review and countersign within 24 hours. You'll receive email confirmation once 
                the contract is fully executed.
              </p>
              <div className="space-y-4">
                <p className="text-[#8CC63F] font-semibold">
                  Expected completion: Within 24 hours
                </p>
                <div className="space-x-4">
                  <Button
                    onClick={() => setLocation('/legal-documents')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View Legal Documents
                  </Button>
                  <Button
                    onClick={() => setLocation('/dashboard')}
                    className="bg-[#76B900] hover:bg-[#5a8f00]"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}