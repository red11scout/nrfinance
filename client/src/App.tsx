import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import ScenarioBuilder from "./pages/ScenarioBuilder";
import SensitivityAnalysis from "./pages/SensitivityAnalysis";
import ROIProjection from "./pages/ROIProjection";
import ScenarioComparison from "./pages/ScenarioComparison";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/scenario-builder"} component={ScenarioBuilder} />
      <Route path={"/scenario-builder/:id"} component={ScenarioBuilder} />
      <Route path={"/sensitivity-analysis"} component={SensitivityAnalysis} />
      <Route path={"/roi-projection"} component={ROIProjection} />
      <Route path={"/scenario-comparison"} component={ScenarioComparison} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
