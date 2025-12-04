import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Pricing from "@/pages/pricing";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import CodeEditor from "@/pages/code-editor";
import Templates from "@/pages/templates";
import Components from "@/pages/components";
import Preview from "@/pages/preview";
import HIPAATools from "@/pages/hipaa-tools";
import AppBuilder from "@/pages/app-builder";
import ContractOnboarding from "@/pages/contract-onboarding";
import LegalDocuments from "@/pages/legal-documents";
import Documentation from "@/pages/documentation";
import AppPreview from "@/pages/app-preview";
import ProjectEditor from "@/pages/project-editor";
import MyApps from "@/pages/my-apps";
import Checkout from "@/pages/checkout";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/templates" component={Templates} />
          <Route path="/contract-onboarding" component={ContractOnboarding} />
          <Route path="/legal-documents" component={LegalDocuments} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/apps/:appId" component={AppPreview} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/app-builder" component={AppBuilder} />
          <Route path="/code-editor" component={CodeEditor} />
          <Route path="/templates" component={Templates} />
          <Route path="/components" component={Components} />
          <Route path="/preview" component={Preview} />
          <Route path="/hipaa-tools" component={HIPAATools} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/contract-onboarding" component={ContractOnboarding} />
          <Route path="/legal-documents" component={LegalDocuments} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/apps/:appId" component={AppPreview} />
          <Route path="/editor/:projectId" component={ProjectEditor} />
          <Route path="/my-apps" component={MyApps} />
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
