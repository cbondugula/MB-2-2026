import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import CodeEditor from "@/pages/code-editor";
import Templates from "@/pages/templates";
import Components from "@/pages/components";
import Preview from "@/pages/preview";
import HIPAATools from "@/pages/hipaa-tools";
import AIWorkspace from "@/pages/ai-workspace";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/ai-workspace" component={AIWorkspace} />
          <Route path="/code-editor" component={CodeEditor} />
          <Route path="/templates" component={Templates} />
          <Route path="/components" component={Components} />
          <Route path="/preview" component={Preview} />
          <Route path="/hipaa-tools" component={HIPAATools} />
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
