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
import AIWorkspace from "@/pages/ai-workspace";
import BERTAnalysis from "@/pages/bert-analysis";
import StandardsBuilder from "@/pages/standards-builder";
import GlobalHealthcare from "@/pages/global-healthcare";
import AppBuilder from "@/pages/app-builder";
import AICodeGenerator from "@/pages/ai-code-generator";
import ClinicalAI from "@/pages/clinical-ai";
import AdvancedHealthcare from "@/pages/advanced-healthcare";
import MLDashboard from "@/pages/ml-dashboard";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/pricing" component={Pricing} />
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
