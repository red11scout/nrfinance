import React, { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Zap,
  BarChart3,
  PieChart,
  Calculator,
  Sparkles,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Target,
  Users,
  Bot,
  Database,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Download,
  MessageSquare,
  Lightbulb,
  Globe,
  Brain,
  FileSearch,
  ClipboardList,
  BookOpen,
  Info,
  Sun,
  Moon,
  Menu
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { PlatformDetail } from "@/components/PlatformDetail";
import { AIExplainer } from "@/components/AIExplainer";
import { 
  CalculationBreakdown, 
  PLATFORM_0_REVENUE_CALCULATION,
  PLATFORM_1_REVENUE_CALCULATION,
  PLATFORM_2_REVENUE_CALCULATION,
  PLATFORM_3_COST_CALCULATION,
  PLATFORM_4_CALCULATION,
  CONSOLIDATED_CALCULATION
} from "@/components/CalculationBreakdown";
import { generatePDF, generateExcel } from "@/utils/exportUtils";
import { generateExecutiveSummaryPDF, getDefaultExecutiveSummaryData } from "@/utils/executiveSummaryPDF";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  PLATFORM_0, 
  PLATFORM_1, 
  PLATFORM_2, 
  PLATFORM_3, 
  PLATFORM_4,
  CONSOLIDATED_TOTALS,
  COMPANY_BASELINE 
} from "../../../shared/documentData";

// ============================================================================
// CONSTANTS & HELPERS
// ============================================================================

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const formatPercent = (value: number) => {
  return `${(value * 100).toFixed(0)}%`;
};

// Standardized color palette: Blue for primary/positive, Red for negative/alerts
const PLATFORM_COLORS = {
  p0: { primary: "bg-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", text: "text-blue-600 dark:text-blue-400", hex: "#2563eb" },
  p1: { primary: "bg-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", text: "text-blue-500 dark:text-blue-400", hex: "#3b82f6" },
  p2: { primary: "bg-blue-700", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300", hex: "#1d4ed8" },
  p3: { primary: "bg-slate-600", bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-200 dark:border-slate-700", text: "text-slate-600 dark:text-slate-400", hex: "#475569" },
  p4: { primary: "bg-slate-500", bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-200 dark:border-slate-700", text: "text-slate-500 dark:text-slate-400", hex: "#64748b" },
};

const PLATFORM_ICONS = {
  p0: Globe,
  p1: Brain,
  p2: FileSearch,
  p3: ClipboardList,
  p4: BookOpen,
};

// ============================================================================
// CHART DATA
// ============================================================================

const platformChartData = [
  { name: "P0: Market\nExpansion", value: 35.0, fill: PLATFORM_COLORS.p0.hex },
  { name: "P1: Sales\nIntelligence", value: 24.2, fill: PLATFORM_COLORS.p1.hex },
  { name: "P2: Estimation\nSuite", value: 23.2, fill: PLATFORM_COLORS.p2.hex },
  { name: "P3: Project\nManagement", value: 21.6, fill: PLATFORM_COLORS.p3.hex },
  { name: "P4: Knowledge\nManagement", value: 7.9, fill: PLATFORM_COLORS.p4.hex },
];

// Standardized blue/slate palette for benefit types
const benefitTypeData = [
  { name: "Revenue Growth", value: 74.8, fill: "#2563eb" },
  { name: "Cost Reduction", value: 28.5, fill: "#3b82f6" },
  { name: "Risk Mitigation", value: 4.4, fill: "#64748b" },
  { name: "Cash Flow", value: 2.7, fill: "#94a3b8" },
];

// Convert Platform 0 financial breakdown to array format with formulas
const platform0FinancialBreakdown = [
  { 
    useCase: "Revenue Growth", 
    revenueGrowth: PLATFORM_0.financialBreakdown.revenueGrowth, 
    total: PLATFORM_0.financialBreakdown.revenueGrowth,
    formula: "New Leads × Conversion Rate × Win Rate × Avg Project Value × Margin",
    calculation: "10,000 leads × 12% × 33% × $250K × 35%"
  },
  { 
    useCase: "Cost Savings", 
    laborSavings: PLATFORM_0.financialBreakdown.costSavings, 
    total: PLATFORM_0.financialBreakdown.costSavings,
    formula: "SDR Hours Saved × Hourly Rate × Number of SDRs",
    calculation: "40% time saved × $65/hr × 2,080 hrs × 25 SDRs"
  },
  { 
    useCase: "Maintenance Plan Revenue", 
    revenueGrowth: PLATFORM_0.financialBreakdown.maintenancePlanRevenue, 
    total: PLATFORM_0.financialBreakdown.maintenancePlanRevenue,
    formula: "Projects × Attach Rate Improvement × Annual Plan Value",
    calculation: "2,100 projects × (25% - 10%) × $4,762/plan"
  },
  { 
    useCase: "Cash Flow Improvement", 
    cashFlow: PLATFORM_0.financialBreakdown.cashFlowImpact, 
    total: PLATFORM_0.financialBreakdown.cashFlowImpact,
    formula: "Sales Cycle Reduction × Avg Project Value × Working Capital Rate",
    calculation: "14 days saved × $250K × 0.8% daily cost"
  },
  { 
    useCase: "Risk Reduction", 
    riskMitigation: PLATFORM_0.financialBreakdown.riskReduction, 
    total: PLATFORM_0.financialBreakdown.riskReduction,
    formula: "Bad Leads Avoided × Qualification Cost Saved",
    calculation: "1,000 bad leads × $500 qualification cost"
  },
];

const roiTimelineData = [
  { month: "M1", investment: 1.6, benefit: 0, cumulative: -1.6 },
  { month: "M2", investment: 0.2, benefit: 4.7, cumulative: 2.9 },
  { month: "M3", investment: 0.2, benefit: 9.3, cumulative: 11.8 },
  { month: "M4", investment: 0.2, benefit: 9.3, cumulative: 20.7 },
  { month: "M6", investment: 0.2, benefit: 18.6, cumulative: 38.9 },
  { month: "M12", investment: 0.2, benefit: 55.9, cumulative: 94.4 },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Dashboard() {
  const [calculationResults, setCalculationResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(true);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiContext, setAiContext] = useState<{ type: string; context: string }>({ type: "total", context: "" });
  const { theme, toggleTheme } = useTheme();
  
  const { data: defaultInputs } = trpc.calculation.getDefaults.useQuery();
  const calculateMutation = trpc.calculation.calculate.useMutation();

  const runCalculation = useCallback(async () => {
    if (!defaultInputs) return;
    setIsCalculating(true);
    try {
      const result = await calculateMutation.mutateAsync(defaultInputs);
      setCalculationResults(result);
    } catch (error) {
      console.error("Calculation error:", error);
    } finally {
      setIsCalculating(false);
    }
  }, [defaultInputs]);

  useEffect(() => {
    if (defaultInputs) {
      runCalculation();
    }
  }, [defaultInputs]);

  const openAiExplainer = (type: string, context: string) => {
    setAiContext({ type, context });
    setAiDialogOpen(true);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    if (!calculationResults) return;
    
    const exportData = {
      consolidated: calculationResults.consolidated,
      platforms: [
        { name: PLATFORM_0.name, benefit: PLATFORM_0.annualBenefit, percentOfTotal: PLATFORM_0.percentOfTotal },
        { name: PLATFORM_1.name, benefit: PLATFORM_1.annualBenefit, percentOfTotal: PLATFORM_1.percentOfTotal },
        { name: PLATFORM_2.name, benefit: PLATFORM_2.annualBenefit, percentOfTotal: PLATFORM_2.percentOfTotal },
        { name: PLATFORM_3.name, benefit: PLATFORM_3.annualBenefit, percentOfTotal: PLATFORM_3.percentOfTotal },
        { name: PLATFORM_4.name, benefit: PLATFORM_4.annualBenefit, percentOfTotal: PLATFORM_4.percentOfTotal },
      ],
      companyBaseline: {
        annualRevenue: COMPANY_BASELINE.annualRevenue,
        grossMargin: COMPANY_BASELINE.grossMargin,
        annualProjects: COMPANY_BASELINE.annualProjects,
        avgProjectValue: COMPANY_BASELINE.avgProjectValue,
        winRate: COMPANY_BASELINE.winRate,
      },
    };

    if (format === 'pdf') {
      generatePDF(exportData);
    } else {
      generateExcel(exportData);
    }
  };

  // Loading state
  if (isCalculating || !calculationResults) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-pulse" />
            <Loader2 className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Calculating Financial Impact</h2>
            <p className="text-muted-foreground">Analyzing all five platforms...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800">
        <div className="container py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img 
                src={theme === 'dark' ? '/blueally-logo-white.png' : '/blueally-logo-dark.png'} 
                alt="BlueAlly" 
                className="h-8 md:h-10 w-auto flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">Nations Roof Financial Analyzer</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">AI Transformation Initiative - 5-Platform Analysis</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/scenario-builder">
                <Button variant="outline" size="sm">
                  <Calculator className="h-4 w-4 mr-2" />
                  Scenario Builder
                </Button>
              </Link>
              <Link href="/sensitivity-analysis">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Sensitivity
                </Button>
              </Link>
              <Link href="/roi-projection">
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  ROI
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link href="/scenario-builder">
                      <Button variant="outline" className="w-full justify-start">
                        <Calculator className="h-4 w-4 mr-2" />
                        Scenario Builder
                      </Button>
                    </Link>
                    <Link href="/sensitivity-analysis">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Sensitivity Analysis
                      </Button>
                    </Link>
                    <Link href="/roi-projection">
                      <Button variant="outline" className="w-full justify-start">
                        <Zap className="h-4 w-4 mr-2" />
                        ROI Projection
                      </Button>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              Total Annual Financial Benefit
            </Badge>
            
            <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-4">
              $111.9M
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Five integrated AI platforms delivering end-to-end automation across the commercial roofing value chain—from autonomous lead generation through project delivery.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => openAiExplainer("total", "Explain the total $111.9M annual benefit and how it breaks down across the five platforms.")}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Explain This
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                    <Download className="h-5 w-5 mr-2" />
                    Export Report
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => generateExecutiveSummaryPDF(getDefaultExecutiveSummaryData())}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Executive Summary (Board)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Full Report PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/Nations_Roof_AI_Financial_Model.xlsx" download>
                      <FileText className="h-4 w-4 mr-2" />
                      CFO Financial Model (Excel)
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="relative mt-8 md:mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold">5</div>
                <div className="text-xs md:text-sm text-blue-200">AI Platforms</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold">30+</div>
                <div className="text-xs md:text-sm text-blue-200">AI Agents</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold">&lt;4mo</div>
                <div className="text-xs md:text-sm text-blue-200">Payback Period</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold">2,100%+</div>
                <div className="text-xs md:text-sm text-blue-200">Year 1 ROI</div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Cards */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {formatCurrency(calculationResults.consolidated.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(calculationResults.consolidated.totalRevenue / calculationResults.consolidated.grandTotal)} of total
              </p>
              <div className="mt-4 flex items-center text-xs text-success">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>New projects & improved win rates</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => openAiExplainer("revenue", "Explain how the $74.8M in revenue growth is calculated across all platforms.")}
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                Explain
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cost Reduction</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(calculationResults.consolidated.totalCostReduction)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(calculationResults.consolidated.totalCostReduction / calculationResults.consolidated.grandTotal)} of total
              </p>
              <div className="mt-4 flex items-center text-xs text-primary">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span>Automation & efficiency gains</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => openAiExplainer("cost", "Explain how the $28.5M in cost reduction is achieved through automation.")}
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                Explain
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Risk Mitigation</CardTitle>
              <Shield className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {formatCurrency(calculationResults.consolidated.totalRiskMitigation)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(calculationResults.consolidated.totalRiskMitigation / calculationResults.consolidated.grandTotal)} of total
              </p>
              <div className="mt-4 flex items-center text-xs text-warning">
                <Shield className="h-4 w-4 mr-1" />
                <span>Error reduction & compliance</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => openAiExplainer("risk", "Explain how $4.4M in risk mitigation is achieved.")}
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                Explain
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-purple-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cash Flow Impact</CardTitle>
              <Zap className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {formatCurrency(calculationResults.consolidated.totalCashFlow)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(calculationResults.consolidated.totalCashFlow / calculationResults.consolidated.grandTotal)} of total
              </p>
              <div className="mt-4 flex items-center text-xs text-purple-600">
                <Zap className="h-4 w-4 mr-1" />
                <span>Faster cycles & working capital</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => openAiExplainer("cashflow", "Explain how $2.7M in cash flow improvement is generated.")}
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                Explain
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Company Baseline Context */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Nations Roof Company Baseline
              </CardTitle>
              <CardDescription>
                Current operational metrics forming the foundation for all calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Annual Revenue</div>
                  <div className="text-2xl font-bold">{formatCurrency(COMPANY_BASELINE.annualRevenue)}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Annual Projects</div>
                  <div className="text-2xl font-bold">{COMPANY_BASELINE.annualProjects.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Avg Project Value</div>
                  <div className="text-2xl font-bold">{formatCurrency(COMPANY_BASELINE.avgProjectValue)}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Gross Margin</div>
                  <div className="text-2xl font-bold">{formatPercent(COMPANY_BASELINE.grossMargin)}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Current Win Rate</div>
                  <div className="text-2xl font-bold">{(COMPANY_BASELINE.winRate * 100).toFixed(0)}%</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Target Win Rate</div>
                  <div className="text-2xl font-bold text-success">33%</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Annual Bids</div>
                  <div className="text-2xl font-bold">{COMPANY_BASELINE.annualBids.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Leads/Year</div>
                  <div className="text-2xl font-bold">{COMPANY_BASELINE.currentLeadsPerYear.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Charts Section */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Platform Breakdown
              </CardTitle>
              <CardDescription>Annual financial benefit by platform (in millions)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tickFormatter={(v) => `$${v}M`} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value}M`, "Benefit"]}
                      contentStyle={{ borderRadius: "8px" }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {platformChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Benefit Type Distribution
              </CardTitle>
              <CardDescription>How the $111.9M breaks down by benefit category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={benefitTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value}M`}
                      labelLine={false}
                    >
                      {benefitTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value}M`, ""]} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ROI Timeline */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                ROI Timeline - First Year
              </CardTitle>
              <CardDescription>
                Cumulative benefit realization showing payback in less than 4 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={roiTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `$${v}M`} />
                    <Tooltip formatter={(value: number) => [`$${value}M`, ""]} />
                    <Area 
                      type="monotone" 
                      dataKey="cumulative" 
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.3}
                      name="Cumulative Benefit"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="benefit" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.2}
                      name="Monthly Benefit"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Platform Deep Dives */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Platform Deep Dives</h2>
              <p className="text-muted-foreground">
                Complete analysis of each AI platform with KPIs, friction points, agents, and financial impact
              </p>
            </div>
          </div>

          <Tabs defaultValue="p0" className="space-y-6">
            {/* Swipeable tabs on mobile */}
            <div className="md:hidden mb-4">
              <p className="text-xs text-muted-foreground text-center mb-2">← Swipe to navigate platforms →</p>
            </div>
            <TabsList className="flex md:grid md:grid-cols-5 h-auto p-1 bg-muted/50 overflow-x-auto swipe-container">
              {[
                { id: "p0", name: "P0: Market Expansion", value: "$35.0M", icon: Globe },
                { id: "p1", name: "P1: Sales Intelligence", value: "$24.2M", icon: Brain },
                { id: "p2", name: "P2: Estimation Suite", value: "$23.2M", icon: FileSearch },
                { id: "p3", name: "P3: Project Mgmt", value: "$21.6M", icon: ClipboardList },
                { id: "p4", name: "P4: Knowledge Mgmt", value: "$7.9M", icon: BookOpen },
              ].map((platform) => {
                const Icon = platform.icon;
                const colors = PLATFORM_COLORS[platform.id as keyof typeof PLATFORM_COLORS];
                return (
                  <TabsTrigger 
                    key={platform.id} 
                    value={platform.id}
                    className="flex flex-col items-center gap-1 py-3 px-4 min-w-[100px] md:min-w-0 swipe-item data-[state=active]:bg-white data-[state=active]:shadow-sm touch-feedback"
                  >
                    <Icon className={`h-5 w-5 ${colors.text}`} />
                    <span className="text-xs font-medium hidden md:block">{platform.name}</span>
                    <span className={`text-sm font-bold ${colors.text}`}>{platform.value}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Platform 0 */}
            <TabsContent value="p0">
              <Card>
                <CardHeader className={`${PLATFORM_COLORS.p0.bg} border-b ${PLATFORM_COLORS.p0.border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${PLATFORM_COLORS.p0.primary}`}>
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{PLATFORM_0.name}</CardTitle>
                      <CardDescription>{PLATFORM_0.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <PlatformDetail
                    platformNumber={0}
                    name={PLATFORM_0.name}
                    subtitle={PLATFORM_0.subtitle}
                    annualBenefit={PLATFORM_0.annualBenefit}
                    percentOfTotal={PLATFORM_0.percentOfTotal}
                    frictionPoints={PLATFORM_0.frictionPoints}
                    kpis={PLATFORM_0.kpis}
                    agents={PLATFORM_0.agents}
                    financialBreakdown={platform0FinancialBreakdown}
                    keyMetrics={PLATFORM_0.keyMetrics}
                    dataSources={PLATFORM_0.dataSources}
                    colorScheme={PLATFORM_COLORS.p0}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Platform 1 */}
            <TabsContent value="p1">
              <Card>
                <CardHeader className={`${PLATFORM_COLORS.p1.bg} border-b ${PLATFORM_COLORS.p1.border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${PLATFORM_COLORS.p1.primary}`}>
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{PLATFORM_1.name}</CardTitle>
                      <CardDescription>{PLATFORM_1.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <PlatformDetail
                    platformNumber={1}
                    name={PLATFORM_1.name}
                    subtitle={PLATFORM_1.subtitle}
                    annualBenefit={PLATFORM_1.annualBenefit}
                    percentOfTotal={PLATFORM_1.percentOfTotal}
                    frictionPoints={PLATFORM_1.frictionPoints}
                    useCases={PLATFORM_1.useCases}
                    kpis={PLATFORM_1.kpis}
                    agents={PLATFORM_1.agents}
                    financialBreakdown={PLATFORM_1.financialBreakdown}
                    winRateAttribution={PLATFORM_1.winRateAttribution}
                    colorScheme={PLATFORM_COLORS.p1}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Platform 2 */}
            <TabsContent value="p2">
              <Card>
                <CardHeader className={`${PLATFORM_COLORS.p2.bg} border-b ${PLATFORM_COLORS.p2.border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${PLATFORM_COLORS.p2.primary}`}>
                      <FileSearch className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{PLATFORM_2.name}</CardTitle>
                      <CardDescription>{PLATFORM_2.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <PlatformDetail
                    platformNumber={2}
                    name={PLATFORM_2.name}
                    subtitle={PLATFORM_2.subtitle}
                    annualBenefit={PLATFORM_2.annualBenefit}
                    percentOfTotal={PLATFORM_2.percentOfTotal}
                    frictionPoints={PLATFORM_2.frictionPoints}
                    useCases={PLATFORM_2.useCases}
                    kpis={PLATFORM_2.kpis}
                    agents={PLATFORM_2.agents}
                    financialBreakdown={PLATFORM_2.financialBreakdown}
                    colorScheme={PLATFORM_COLORS.p2}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Platform 3 */}
            <TabsContent value="p3">
              <Card>
                <CardHeader className={`${PLATFORM_COLORS.p3.bg} border-b ${PLATFORM_COLORS.p3.border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${PLATFORM_COLORS.p3.primary}`}>
                      <ClipboardList className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{PLATFORM_3.name}</CardTitle>
                      <CardDescription>{PLATFORM_3.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <PlatformDetail
                    platformNumber={3}
                    name={PLATFORM_3.name}
                    subtitle={PLATFORM_3.subtitle}
                    annualBenefit={PLATFORM_3.annualBenefit}
                    percentOfTotal={PLATFORM_3.percentOfTotal}
                    frictionPoints={PLATFORM_3.frictionPoints}
                    useCases={PLATFORM_3.useCases}
                    kpis={PLATFORM_3.kpis}
                    agents={PLATFORM_3.agents}
                    financialBreakdown={PLATFORM_3.financialBreakdown}
                    colorScheme={PLATFORM_COLORS.p3}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Platform 4 */}
            <TabsContent value="p4">
              <Card>
                <CardHeader className={`${PLATFORM_COLORS.p4.bg} border-b ${PLATFORM_COLORS.p4.border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${PLATFORM_COLORS.p4.primary}`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{PLATFORM_4.name}</CardTitle>
                      <CardDescription>{PLATFORM_4.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <PlatformDetail
                    platformNumber={4}
                    name={PLATFORM_4.name}
                    subtitle={PLATFORM_4.subtitle}
                    annualBenefit={PLATFORM_4.annualBenefit}
                    percentOfTotal={PLATFORM_4.percentOfTotal}
                    frictionPoints={PLATFORM_4.frictionPoints}
                    useCases={PLATFORM_4.useCases}
                    kpis={PLATFORM_4.kpis}
                    agents={PLATFORM_4.agents}
                    financialBreakdown={PLATFORM_4.financialBreakdown}
                    foundationResponsibilities={PLATFORM_4.foundationResponsibilities}
                    colorScheme={PLATFORM_COLORS.p4}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Detailed Calculation Breakdowns */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Detailed Calculation Breakdowns</h2>
              <p className="text-muted-foreground">
                Step-by-step formulas showing exactly how each financial benefit was calculated
              </p>
            </div>
          </div>

          <Tabs defaultValue="consolidated" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50">
              <TabsTrigger value="consolidated" className="flex-1 min-w-[120px]">
                <Calculator className="h-4 w-4 mr-2" />
                Consolidated
              </TabsTrigger>
              <TabsTrigger value="p0-calc" className="flex-1 min-w-[120px]">
                <Globe className="h-4 w-4 mr-2" />
                P0 Revenue
              </TabsTrigger>
              <TabsTrigger value="p1-calc" className="flex-1 min-w-[120px]">
                <Brain className="h-4 w-4 mr-2" />
                P1 Revenue
              </TabsTrigger>
              <TabsTrigger value="p2-calc" className="flex-1 min-w-[120px]">
                <FileSearch className="h-4 w-4 mr-2" />
                P2 Revenue
              </TabsTrigger>
              <TabsTrigger value="p3-calc" className="flex-1 min-w-[120px]">
                <ClipboardList className="h-4 w-4 mr-2" />
                P3 Costs
              </TabsTrigger>
              <TabsTrigger value="p4-calc" className="flex-1 min-w-[120px]">
                <BookOpen className="h-4 w-4 mr-2" />
                P4 Total
              </TabsTrigger>
            </TabsList>

            <TabsContent value="consolidated">
              <CalculationBreakdown
                title="Consolidated Financial Benefit"
                subtitle="How the $111.9M total is calculated across all five platforms"
                totalBenefit="$111.9M"
                steps={CONSOLIDATED_CALCULATION}
              />
            </TabsContent>

            <TabsContent value="p0-calc">
              <CalculationBreakdown
                title="Platform 0: Revenue Growth Calculation"
                subtitle="Market Expansion - How the $30.0M revenue growth is derived"
                totalBenefit="$30.0M"
                steps={PLATFORM_0_REVENUE_CALCULATION}
              />
            </TabsContent>

            <TabsContent value="p1-calc">
              <CalculationBreakdown
                title="Platform 1: Revenue Growth Calculation"
                subtitle="Sales Intelligence - How the $23.3M revenue growth is derived"
                totalBenefit="$23.3M"
                steps={PLATFORM_1_REVENUE_CALCULATION}
              />
            </TabsContent>

            <TabsContent value="p2-calc">
              <CalculationBreakdown
                title="Platform 2: Revenue Growth Calculation"
                subtitle="Estimation Suite - How the $14.7M revenue growth is derived"
                totalBenefit="$14.7M"
                steps={PLATFORM_2_REVENUE_CALCULATION}
              />
            </TabsContent>

            <TabsContent value="p3-calc">
              <CalculationBreakdown
                title="Platform 3: Cost Reduction Calculation"
                subtitle="Project Management - How the $17.6M cost reduction is derived"
                totalBenefit="$17.6M"
                steps={PLATFORM_3_COST_CALCULATION}
              />
            </TabsContent>

            <TabsContent value="p4-calc">
              <CalculationBreakdown
                title="Platform 4: Total Benefit Calculation"
                subtitle="Knowledge Management - How the $7.9M total benefit is derived"
                totalBenefit="$7.9M"
                steps={PLATFORM_4_CALCULATION}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Investment Summary */}
        <section>
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Investment Summary
              </CardTitle>
              <CardDescription className="text-slate-300">
                Platform 0 investment details (primary investment vehicle)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                <div className="p-4 bg-white/10 rounded-xl">
                  <div className="text-sm text-slate-300">Platform Investment</div>
                  <div className="text-2xl font-bold">{formatCurrency(PLATFORM_0.investment.platformInvestment)}</div>
                </div>
                <div className="p-4 bg-white/10 rounded-xl">
                  <div className="text-sm text-slate-300">Annual Data Costs</div>
                  <div className="text-2xl font-bold">{formatCurrency(PLATFORM_0.investment.annualDataCosts)}</div>
                </div>
                <div className="p-4 bg-white/10 rounded-xl">
                  <div className="text-sm text-slate-300">Total First Year</div>
                  <div className="text-2xl font-bold">{formatCurrency(PLATFORM_0.investment.totalFirstYear)}</div>
                </div>
                <div className="p-4 bg-white/10 rounded-xl">
                  <div className="text-sm text-slate-300">Payback Period</div>
                  <div className="text-2xl font-bold text-success">{PLATFORM_0.investment.paybackPeriod}</div>
                </div>
                <div className="p-4 bg-white/10 rounded-xl">
                  <div className="text-sm text-slate-300">Year 1 ROI</div>
                  <div className="text-2xl font-bold text-success">{PLATFORM_0.investment.year1ROI}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore different scenarios, run sensitivity analysis, or dive into detailed ROI projections 
            to understand the full impact of this AI transformation initiative.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/scenario-builder">
              <Button size="lg">
                <Calculator className="h-5 w-5 mr-2" />
                Build Custom Scenario
              </Button>
            </Link>
            <Link href="/sensitivity-analysis">
              <Button size="lg" variant="outline">
                <BarChart3 className="h-5 w-5 mr-2" />
                Sensitivity Analysis
              </Button>
            </Link>
            <Link href="/roi-projection">
              <Button size="lg" variant="outline">
                <Zap className="h-5 w-5 mr-2" />
                5-Year ROI Projection
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* AI Explainer Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Financial Explainer
            </DialogTitle>
            <DialogDescription>
              Clear, step-by-step explanation of the financial calculations
            </DialogDescription>
          </DialogHeader>
          <AIExplainer 
            initialContext={aiContext.context}
            calculationResults={calculationResults}
          />
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Nations Roof AI Transformation Financial Analyzer</p>
          <p className="mt-1">All calculations based on source document analysis • Powered by HyperFormula</p>
        </div>
      </footer>
    </div>
  );
}
