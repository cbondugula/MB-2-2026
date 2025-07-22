import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Pricing from "@/pages/pricing";
import CustomPricing from "@/pages/custom-pricing";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import CodeEditor from "@/pages/code-editor";
import Templates from "@/pages/templates";
import Components from "@/pages/components";
import Preview from "@/pages/preview";
import HIPAATools from "@/pages/hipaa-tools";
import AIWorkspace from "@/pages/ai-workspace";
import BERTAnalysis from "@/pages/bert-analysis";
import StandardsBuilder from "@/pages/standards-builder";
import GlobalHealthcare from "@/pages/global-healthcare";
import AppBuilder from "@/pages/app-builder";
import AICodeGenerator from "@/pages/ai-code-generator";
import ClinicalAI from "@/pages/clinical-ai";
import AdvancedHealthcare from "@/pages/advanced-healthcare";
import MLDashboard from "@/pages/ml-dashboard";
import ContractOnboarding from "@/pages/contract-onboarding";
import LegalDocuments from "@/pages/legal-documents";
import SuperAgent from "@/pages/super-agent";
import ScalabilityDashboard from "@/pages/scalability-dashboard";
import VisualBuilder from "@/pages/visual-builder";
import MLPythonIntegration from "@/pages/ml-python-integration";
import MultiAIVerification from "@/pages/multi-ai-verification";
import PatentVerificationDashboard from "@/pages/patent-verification-dashboard";
import PatentLinks from "@/pages/patent-links";
import PatentDrawings from "@/pages/patent-drawings";
import TJCCompliance from "@/pages/tjc-compliance";
import QuantumAI from "@/pages/quantum-ai";
import HealthcareTesting from "@/pages/healthcare-testing";
import DualQuantumClassical from "@/pages/dual-quantum-classical";
import HealthcareAppBuilder from "@/pages/healthcare-app-builder";
import HealthcareDemo from "@/pages/healthcare-demo";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/custom-pricing" component={CustomPricing} />
          <Route path="/contract-onboarding" component={ContractOnboarding} />
          <Route path="/legal-documents" component={LegalDocuments} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/ai-workspace" component={AIWorkspace} />
          <Route path="/bert-analysis" component={BERTAnalysis} />
          <Route path="/standards-builder" component={StandardsBuilder} />
          <Route path="/global-healthcare" component={GlobalHealthcare} />
          <Route path="/code-editor" component={CodeEditor} />
          <Route path="/templates" component={Templates} />
          <Route path="/components" component={Components} />
          <Route path="/app-builder" component={AppBuilder} />
          <Route path="/ai-code-generator" component={AICodeGenerator} />
          <Route path="/clinical-ai" component={ClinicalAI} />
          <Route path="/advanced-healthcare" component={AdvancedHealthcare} />
          <Route path="/ml-dashboard" component={MLDashboard} />
          <Route path="/preview" component={Preview} />
          <Route path="/hipaa-tools" component={HIPAATools} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/custom-pricing" component={CustomPricing} />
          <Route path="/contract-onboarding" component={ContractOnboarding} />
          <Route path="/legal-documents" component={LegalDocuments} />
          <Route path="/super-agent" component={SuperAgent} />
          <Route path="/scalability-dashboard" component={ScalabilityDashboard} />
          <Route path="/visual-builder" component={VisualBuilder} />
          <Route path="/ml-python" component={MLPythonIntegration} />
          <Route path="/multi-ai-verification" component={MultiAIVerification} />
          <Route path="/patent-verification" component={PatentVerificationDashboard} />
          <Route path="/patent-links" component={PatentLinks} />
          <Route path="/patent-drawings" component={PatentDrawings} />
          <Route path="/tjc-compliance" component={TJCCompliance} />
          <Route path="/quantum-ai" component={QuantumAI} />
          <Route path="/healthcare-testing" component={HealthcareTesting} />
          <Route path="/dual-quantum-classical" component={DualQuantumClassical} />
          <Route path="/healthcare-app-builder" component={HealthcareDemo} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
