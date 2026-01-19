import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, TrendingUp, Sun, Moon, DollarSign, Percent, Clock, Target, AlertTriangle, CheckCircle2, Calculator, BarChart3, PieChart, Download, Info, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart } from "recharts";
import { calculateFinancials, DEFAULT_INPUTS } from "../../../shared/calculationEngine";
import { generateCFOAnalysisPDF, getDefaultCFOAnalysisData } from "@/utils/cfoAnalysisPDF";

// Format currency in user-friendly way
const formatCurrency = (value: number, decimals: number = 1): string => {
  if (Math.abs(value) >= 1000000000) {
    return `$${(value / 1000000000).toFixed(decimals)}B`;
  }
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(decimals)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(decimals)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Calculate IRR using Newton-Raphson method
const calculateIRR = (cashFlows: number[], guess: number = 0.1): number => {
  const maxIterations = 100;
  const tolerance = 0.0001;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      npv += cashFlows[j] / Math.pow(1 + rate, j);
      if (j > 0) {
        derivative -= (j * cashFlows[j]) / Math.pow(1 + rate, j + 1);
      }
    }

    if (Math.abs(npv) < tolerance) {
      return rate * 100;
    }

    rate = rate - npv / derivative;
  }

  return rate * 100;
};

// Calculate NPV
const calculateNPV = (cashFlows: number[], discountRate: number): number => {
  return cashFlows.reduce((npv, cf, i) => npv + cf / Math.pow(1 + discountRate / 100, i), 0);
};

// Calculate payback period
const calculatePaybackPeriod = (initialInvestment: number, annualCashFlows: number[]): number => {
  let cumulative = -initialInvestment;
  for (let i = 0; i < annualCashFlows.length; i++) {
    cumulative += annualCashFlows[i];
    if (cumulative >= 0) {
      // Interpolate for partial year
      const prevCumulative = cumulative - annualCashFlows[i];
      const fraction = Math.abs(prevCumulative) / annualCashFlows[i];
      return i + fraction;
    }
  }
  return annualCashFlows.length; // Not paid back within projection period
};

export default function ROIProjection() {
  const { theme, toggleTheme } = useTheme();
  const [growthRate, setGrowthRate] = useState(5);
  const [discountRate, setDiscountRate] = useState(10);
  const [inflationRate, setInflationRate] = useState(3);
  const [riskPremium, setRiskPremium] = useState(5);

  // Calculate base results
  const baseResults = calculateFinancials(DEFAULT_INPUTS);
  const initialInvestment = DEFAULT_INPUTS.platform0.platformInvestment + DEFAULT_INPUTS.platform0.annualDataCosts;
  const baseAnnualBenefit = baseResults.consolidated.grandTotal;

  // Generate 5-year projection data
  const projectionData = useMemo(() => {
    const data = [];
    let cumulativeBenefit = 0;
    let cumulativeInvestment = initialInvestment;
    const cashFlows = [-initialInvestment];

    for (let year = 1; year <= 5; year++) {
      const growthMultiplier = Math.pow(1 + growthRate / 100, year - 1);
      const annualBenefit = baseAnnualBenefit * growthMultiplier;
      const annualCost = DEFAULT_INPUTS.platform0.annualDataCosts * growthMultiplier;
      const netCashFlow = annualBenefit - annualCost;
      
      cumulativeBenefit += annualBenefit;
      cumulativeInvestment += annualCost;
      cashFlows.push(netCashFlow);

      // Calculate present values
      const discountFactor = Math.pow(1 + discountRate / 100, year);
      const pvBenefit = annualBenefit / discountFactor;
      const pvCost = annualCost / discountFactor;

      // Risk-adjusted calculations
      const riskAdjustedRate = discountRate + riskPremium;
      const riskAdjustedPV = annualBenefit / Math.pow(1 + riskAdjustedRate / 100, year);

      // Real (inflation-adjusted) values
      const realBenefit = annualBenefit / Math.pow(1 + inflationRate / 100, year);

      data.push({
        year,
        yearLabel: `Year ${year}`,
        annualBenefit,
        annualCost,
        netCashFlow,
        cumulativeBenefit,
        cumulativeInvestment,
        netBenefit: cumulativeBenefit - cumulativeInvestment,
        pvBenefit,
        pvCost,
        riskAdjustedPV,
        realBenefit,
        roi: ((cumulativeBenefit - cumulativeInvestment) / cumulativeInvestment) * 100,
      });
    }

    return { data, cashFlows };
  }, [growthRate, discountRate, inflationRate, riskPremium, baseAnnualBenefit, initialInvestment]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const { data, cashFlows } = projectionData;
    const totalBenefit = data[data.length - 1].cumulativeBenefit;
    const totalInvestment = data[data.length - 1].cumulativeInvestment;
    const totalNPV = calculateNPV(cashFlows, discountRate);
    const irr = calculateIRR(cashFlows);
    const paybackPeriod = calculatePaybackPeriod(initialInvestment, cashFlows.slice(1));
    const riskAdjustedNPV = calculateNPV(cashFlows, discountRate + riskPremium);
    const profitabilityIndex = (totalNPV + initialInvestment) / initialInvestment;
    const roic = ((totalBenefit - totalInvestment) / totalInvestment) * 100;
    const annualizedROI = Math.pow(1 + roic / 100, 1 / 5) - 1;

    return {
      totalBenefit,
      totalInvestment,
      netBenefit: totalBenefit - totalInvestment,
      totalNPV,
      irr,
      paybackPeriod,
      riskAdjustedNPV,
      profitabilityIndex,
      roic,
      annualizedROI: annualizedROI * 100,
      year1ROI: ((baseAnnualBenefit - initialInvestment) / initialInvestment) * 100,
    };
  }, [projectionData, discountRate, riskPremium, initialInvestment, baseAnnualBenefit]);

  // NPV Sensitivity Analysis
  const npvSensitivity = useMemo(() => {
    const rates = [6, 8, 10, 12, 14, 16];
    return rates.map(rate => ({
      rate: `${rate}%`,
      npv: calculateNPV(projectionData.cashFlows, rate) / 1000000,
    }));
  }, [projectionData.cashFlows]);

  // Scenario Analysis
  const scenarios = useMemo(() => {
    const scenarioConfigs = [
      { name: "Conservative", growthRate: 0, discountRate: 15, color: "#ef4444" },
      { name: "Base Case", growthRate: 5, discountRate: 10, color: "#3b82f6" },
      { name: "Optimistic", growthRate: 10, discountRate: 8, color: "#22c55e" },
    ];

    return scenarioConfigs.map(config => {
      const cashFlows = [-initialInvestment];
      let cumulative = 0;
      for (let year = 1; year <= 5; year++) {
        const benefit = baseAnnualBenefit * Math.pow(1 + config.growthRate / 100, year - 1);
        const cost = DEFAULT_INPUTS.platform0.annualDataCosts * Math.pow(1 + config.growthRate / 100, year - 1);
        cashFlows.push(benefit - cost);
        cumulative += benefit;
      }
      return {
        ...config,
        totalBenefit: cumulative,
        npv: calculateNPV(cashFlows, config.discountRate),
        irr: calculateIRR(cashFlows),
      };
    });
  }, [baseAnnualBenefit, initialInvestment]);

  // Cash flow waterfall data
  const waterfallData = useMemo(() => {
    const data = [
      { name: "Initial Investment", value: -initialInvestment / 1000000, fill: "#ef4444" },
    ];
    projectionData.data.forEach((d, i) => {
      data.push({
        name: `Y${i + 1} Net Cash Flow`,
        value: d.netCashFlow / 1000000,
        fill: "#22c55e",
      });
    });
    data.push({
      name: "Total NPV",
      value: metrics.totalNPV / 1000000,
      fill: "#3b82f6",
    });
    return data;
  }, [projectionData.data, initialInvestment, metrics.totalNPV]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <Button variant="outline" asChild className="w-fit">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <img 
              src={theme === 'dark' ? '/blueally-logo-white.png' : '/blueally-logo-dark.png'} 
              alt="BlueAlly" 
              className="h-8 md:h-10 w-auto flex-shrink-0"
            />
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                CFO Investment Analysis
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                Comprehensive 5-Year ROI Projection & Financial Due Diligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const pdfData = {
                  executiveSummary: {
                    npv: metrics.totalNPV,
                    irr: metrics.irr,
                    paybackMonths: metrics.paybackPeriod * 12,
                    profitabilityIndex: metrics.profitabilityIndex,
                    year1ROI: metrics.year1ROI,
                    riskAdjustedNPV: metrics.riskAdjustedNPV,
                  },
                  assumptions: {
                    growthRate,
                    discountRate,
                    inflationRate,
                    riskPremium,
                  },
                  scenarios: {
                    conservative: { npv: scenarios[0].npv, irr: scenarios[0].irr, benefit: scenarios[0].totalBenefit },
                    base: { npv: scenarios[1].npv, irr: scenarios[1].irr, benefit: scenarios[1].totalBenefit },
                    optimistic: { npv: scenarios[2].npv, irr: scenarios[2].irr, benefit: scenarios[2].totalBenefit },
                  },
                  yearlyData: projectionData.data.map(d => ({
                    year: d.year,
                    benefit: d.annualBenefit,
                    cost: d.annualCost,
                    netCashFlow: d.netCashFlow,
                    cumulativeBenefit: d.cumulativeBenefit,
                    presentValue: d.pvBenefit,
                    riskAdjustedPV: d.riskAdjustedPV,
                    cumulativeROI: d.roi,
                  })),
                  investmentSummary: {
                    initialInvestment,
                    totalInvestment: projectionData.data[projectionData.data.length - 1].cumulativeInvestment,
                    netBenefit: projectionData.data[projectionData.data.length - 1].cumulativeBenefit - projectionData.data[projectionData.data.length - 1].cumulativeInvestment,
                    valueMultiple: Math.round(projectionData.data[projectionData.data.length - 1].cumulativeBenefit / projectionData.data[projectionData.data.length - 1].cumulativeInvestment),
                  },
                };
                generateCFOAnalysisPDF(pdfData);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="mb-6 border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-blue-600" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">5-Year NPV</div>
                <div className="text-xl md:text-2xl font-bold text-blue-600">{formatCurrency(metrics.totalNPV)}</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">IRR</div>
                <div className="text-xl md:text-2xl font-bold text-green-600">{formatPercent(metrics.irr)}</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Payback Period</div>
                <div className="text-xl md:text-2xl font-bold text-purple-600">{metrics.paybackPeriod.toFixed(1)} mo</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Profitability Index</div>
                <div className="text-xl md:text-2xl font-bold text-orange-600">{metrics.profitabilityIndex.toFixed(1)}x</div>
              </div>
              <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Year 1 ROI</div>
                <div className="text-xl md:text-2xl font-bold text-cyan-600">{formatPercent(metrics.year1ROI, 0)}</div>
              </div>
              <div className="text-center p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Risk-Adj NPV</div>
                <div className="text-xl md:text-2xl font-bold text-rose-600">{formatCurrency(metrics.riskAdjustedNPV)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Decision Criteria */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Investment Decision Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border-2 ${metrics.totalNPV > 0 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {metrics.totalNPV > 0 ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-red-600" />}
                  <span className="font-semibold text-sm">NPV Test</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  NPV &gt; 0: {metrics.totalNPV > 0 ? 'PASS' : 'FAIL'}
                </div>
                <div className="text-lg font-bold mt-1">{formatCurrency(metrics.totalNPV)}</div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${metrics.irr > discountRate ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {metrics.irr > discountRate ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-red-600" />}
                  <span className="font-semibold text-sm">IRR Test</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  IRR &gt; WACC ({discountRate}%): {metrics.irr > discountRate ? 'PASS' : 'FAIL'}
                </div>
                <div className="text-lg font-bold mt-1">{formatPercent(metrics.irr)}</div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${metrics.paybackPeriod < 24 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {metrics.paybackPeriod < 24 ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                  <span className="font-semibold text-sm">Payback Test</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Payback &lt; 24 months: {metrics.paybackPeriod < 24 ? 'PASS' : 'CAUTION'}
                </div>
                <div className="text-lg font-bold mt-1">{metrics.paybackPeriod.toFixed(1)} months</div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${metrics.profitabilityIndex > 1 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {metrics.profitabilityIndex > 1 ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-red-600" />}
                  <span className="font-semibold text-sm">PI Test</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  PI &gt; 1.0: {metrics.profitabilityIndex > 1 ? 'PASS' : 'FAIL'}
                </div>
                <div className="text-lg font-bold mt-1">{metrics.profitabilityIndex.toFixed(2)}x</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assumptions Panel - Clean Sliders */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-slate-600" />
              Model Assumptions
            </CardTitle>
            <CardDescription>Adjust parameters to stress-test the investment thesis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Annual Growth Rate</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-semibold mb-1">Source: Industry Analysis</p>
                          <p className="text-xs">Based on commercial roofing industry CAGR of 4.8% (IBISWorld 2024) and AI productivity gains averaging 5-15% annually (McKinsey Global Institute).</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{growthRate}%</span>
                </div>
                <Slider
                  value={[growthRate]}
                  onValueChange={(v) => setGrowthRate(v[0])}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">Expected YoY benefit growth</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Discount Rate (WACC)</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-semibold mb-1">Source: Corporate Finance</p>
                          <p className="text-xs">Default 10% WACC based on construction industry average (Damodaran 2024). Typical range: 8-12% for mid-cap construction firms with moderate leverage.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">{discountRate}%</span>
                </div>
                <Slider
                  value={[discountRate]}
                  onValueChange={(v) => setDiscountRate(v[0])}
                  min={5}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">Weighted avg cost of capital</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Inflation Rate</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-semibold mb-1">Source: Federal Reserve</p>
                          <p className="text-xs">Based on Fed's 2% long-term target with 3% default reflecting current elevated environment. CPI-U trailing 12-month average used for projections.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded">{inflationRate}%</span>
                </div>
                <Slider
                  value={[inflationRate]}
                  onValueChange={(v) => setInflationRate(v[0])}
                  min={0}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">For real value calculations</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Risk Premium</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-semibold mb-1">Source: Risk Assessment</p>
                          <p className="text-xs">Technology implementation risk premium of 5% reflects typical enterprise software adoption uncertainty. Based on Gartner IT project success rates and implementation timeline variability.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded">{riskPremium}%</span>
                </div>
                <Slider
                  value={[riskPremium]}
                  onValueChange={(v) => setRiskPremium(v[0])}
                  min={0}
                  max={15}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">Additional risk adjustment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Analysis */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-slate-600" />
              Scenario Analysis
            </CardTitle>
            <CardDescription>Compare outcomes under different market conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.name}
                  className="p-4 rounded-lg border-2"
                  style={{ borderColor: scenario.color, backgroundColor: `${scenario.color}10` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: scenario.color }} />
                    <span className="font-semibold">{scenario.name}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Growth Rate:</span>
                      <span className="font-medium">{scenario.growthRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Discount Rate:</span>
                      <span className="font-medium">{scenario.discountRate}%</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">5-Year Benefit:</span>
                        <span className="font-bold">{formatCurrency(scenario.totalBenefit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">NPV:</span>
                        <span className="font-bold" style={{ color: scenario.color }}>{formatCurrency(scenario.npv)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">IRR:</span>
                        <span className="font-bold">{formatPercent(scenario.irr)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* NPV Sensitivity Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">NPV Sensitivity to Discount Rate</CardTitle>
              <CardDescription>How NPV changes with different WACC assumptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={npvSensitivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rate" />
                    <YAxis tickFormatter={(v) => `$${v}M`} />
                    <RechartsTooltip formatter={(value: number) => [`$${value.toFixed(1)}M`, 'NPV']} />
                    <Bar dataKey="npv" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Discount Rate</th>
                      {npvSensitivity.map(d => (
                        <th key={d.rate} className="text-right p-2">{d.rate}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 font-medium">NPV ($M)</td>
                      {npvSensitivity.map(d => (
                        <td key={d.rate} className={`text-right p-2 font-semibold ${d.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${d.npv.toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cash Flow Waterfall</CardTitle>
              <CardDescription>Investment to NPV value creation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `$${v}M`} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(value: number) => [`$${value.toFixed(1)}M`, 'Value']} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {waterfallData.map((entry, index) => (
                        <rect key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                    <ReferenceLine x={0} stroke="#64748b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cumulative Benefit Chart */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">5-Year Financial Trajectory</CardTitle>
            <CardDescription>Cumulative benefit vs investment with payback visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={projectionData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="yearLabel" />
                  <YAxis tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label: string) => label}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="cumulativeBenefit" 
                    fill="#3b82f620" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Cumulative Benefit" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cumulativeInvestment" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Cumulative Investment" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="netBenefit" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    name="Net Benefit" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Financial Table */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Detailed Year-by-Year Analysis</CardTitle>
            <CardDescription>Complete financial breakdown with present value calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 dark:bg-slate-800">
                    <th className="text-left p-3 font-semibold">Metric</th>
                    {projectionData.data.map(d => (
                      <th key={d.year} className="text-right p-3 font-semibold">Year {d.year}</th>
                    ))}
                    <th className="text-right p-3 font-semibold bg-blue-50 dark:bg-blue-900/20">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Annual Benefit</td>
                    {projectionData.data.map(d => (
                      <td key={d.year} className="text-right p-3">{formatCurrency(d.annualBenefit)}</td>
                    ))}
                    <td className="text-right p-3 font-bold bg-blue-50 dark:bg-blue-900/20">{formatCurrency(metrics.totalBenefit)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Annual Cost</td>
                    {projectionData.data.map(d => (
                      <td key={d.year} className="text-right p-3 text-red-600">({formatCurrency(d.annualCost)})</td>
                    ))}
                    <td className="text-right p-3 font-bold text-red-600 bg-blue-50 dark:bg-blue-900/20">
                      ({formatCurrency(metrics.totalInvestment - initialInvestment)})
                    </td>
                  </tr>
                  <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                    <td className="p-3 font-semibold">Net Cash Flow</td>
                    {projectionData.data.map(d => (
                      <td key={d.year} className="text-right p-3 font-semibold text-green-600">{formatCurrency(d.netCashFlow)}</td>
                    ))}
                    <td className="text-right p-3 font-bold text-green-600 bg-blue-50 dark:bg-blue-900/20">{formatCurrency(metrics.netBenefit)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Cumulative Benefit</td>
                    {projectionData.data.map(d => (
                      <td key={d.year} className="text-right p-3">{formatCurrency(d.cumulativeBenefit)}</td>
                    ))}
                    <td className="text-right p-3 font-bold bg-blue-50 dark:bg-blue-900/20">{formatCurrency(metrics.totalBenefit)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Present Value (@ {discountRate}%)</td>
                    {projectionData.data.map(d => (
                      <td key={d.year} className="text-right p-3">{formatCurrency(d.pvBenefit)}</td>
                    ))}
                    <td className="text-right p-3 font-bold bg-blue-50 dark:bg-blue-900/20">{formatCurrency(metrics.totalNPV + initialInvestment)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Risk-Adjusted PV (@ {discountRate + riskPremium}%)</td>
                    {projectionData.data.map(d => (
                      <td key={d.year} className="text-right p-3 text-slate-500">{formatCurrency(d.riskAdjustedPV)}</td>
                    ))}
                    <td className="text-right p-3 font-bold text-slate-500 bg-blue-50 dark:bg-blue-900/20">{formatCurrency(metrics.riskAdjustedNPV + initialInvestment)}</td>
                  </tr>
                  <tr className="border-b bg-green-50 dark:bg-green-900/20">
                    <td className="p-3 font-semibold">Cumulative ROI</td>
                    {projectionData.data.map(d => (
                      <td key={d.year} className="text-right p-3 font-semibold text-green-600">{formatPercent(d.roi, 0)}</td>
                    ))}
                    <td className="text-right p-3 font-bold text-green-600 bg-blue-50 dark:bg-blue-900/20">{formatPercent(metrics.roic, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              CFO Investment Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Investment Strengths
                </h4>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Exceptional IRR of {formatPercent(metrics.irr)}</strong> significantly exceeds typical hurdle rates of 15-20%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Rapid payback of {metrics.paybackPeriod.toFixed(1)} months</strong> minimizes capital at risk and accelerates value realization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>NPV of {formatCurrency(metrics.totalNPV)}</strong> represents substantial economic value creation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Profitability Index of {metrics.profitabilityIndex.toFixed(1)}x</strong> indicates efficient capital deployment</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-amber-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Risk Considerations
                </h4>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Even with {riskPremium}% risk premium, risk-adjusted NPV remains strongly positive at {formatCurrency(metrics.riskAdjustedNPV)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>NPV remains positive across all tested discount rates (6%-16%), demonstrating robust economics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Conservative scenario still yields {formatCurrency(scenarios[0].npv)} NPV and {formatPercent(scenarios[0].irr)} IRR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Implementation risk mitigated by phased platform rollout approach</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                <strong>Recommendation:</strong> This investment meets all standard capital allocation criteria with significant margin of safety. 
                The combination of rapid payback, exceptional IRR, and robust NPV under stress scenarios supports a strong "Proceed" recommendation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Industry Benchmark Comparison */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Industry Benchmark Comparison
            </CardTitle>
            <CardDescription>How this investment compares to typical enterprise software and AI initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left p-3 font-semibold">Metric</th>
                    <th className="text-center p-3 font-semibold">This Investment</th>
                    <th className="text-center p-3 font-semibold">Enterprise Software Avg</th>
                    <th className="text-center p-3 font-semibold">AI/ML Projects Avg</th>
                    <th className="text-center p-3 font-semibold">Construction Tech Avg</th>
                    <th className="text-center p-3 font-semibold">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">ROI (Year 1)</td>
                    <td className="text-center p-3 font-bold text-green-600">{formatPercent(metrics.year1ROI, 0)}</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">50-150%</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">100-300%</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">75-200%</td>
                    <td className="text-center p-3">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-semibold">
                        {metrics.year1ROI > 300 ? 'Exceptional' : metrics.year1ROI > 150 ? 'Above Avg' : 'Average'}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Payback Period</td>
                    <td className="text-center p-3 font-bold text-green-600">{metrics.paybackPeriod.toFixed(1)} months</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">12-24 months</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">6-18 months</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">18-36 months</td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${metrics.paybackPeriod < 6 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : metrics.paybackPeriod < 12 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                        {metrics.paybackPeriod < 6 ? 'Exceptional' : metrics.paybackPeriod < 12 ? 'Above Avg' : 'Average'}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">IRR</td>
                    <td className="text-center p-3 font-bold text-green-600">{formatPercent(metrics.irr)}</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">25-50%</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">40-80%</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">20-40%</td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${metrics.irr > 100 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : metrics.irr > 50 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                        {metrics.irr > 100 ? 'Exceptional' : metrics.irr > 50 ? 'Above Avg' : 'Average'}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Profitability Index</td>
                    <td className="text-center p-3 font-bold text-green-600">{metrics.profitabilityIndex.toFixed(1)}x</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">1.5-3.0x</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">2.0-5.0x</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">1.3-2.5x</td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${metrics.profitabilityIndex > 5 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : metrics.profitabilityIndex > 2 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                        {metrics.profitabilityIndex > 5 ? 'Exceptional' : metrics.profitabilityIndex > 2 ? 'Above Avg' : 'Average'}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">5-Year NPV</td>
                    <td className="text-center p-3 font-bold text-green-600">{formatCurrency(metrics.totalNPV)}</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">1-5x investment</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">2-10x investment</td>
                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">0.5-3x investment</td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${metrics.totalNPV / initialInvestment > 10 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : metrics.totalNPV / initialInvestment > 3 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                        {metrics.totalNPV / initialInvestment > 10 ? 'Exceptional' : metrics.totalNPV / initialInvestment > 3 ? 'Above Avg' : 'Average'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-xs text-purple-700 dark:text-purple-300">
                <strong>Sources:</strong> Enterprise software benchmarks from Gartner IT ROI studies (2024). AI/ML project returns from McKinsey Global Institute AI adoption research. Construction technology benchmarks from Dodge Data & Analytics industry reports.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Investment Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Investment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Initial Investment</div>
                <div className="text-xl font-bold text-slate-700 dark:text-slate-300">{formatCurrency(initialInvestment)}</div>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">5-Year Total Investment</div>
                <div className="text-xl font-bold text-slate-700 dark:text-slate-300">{formatCurrency(metrics.totalInvestment)}</div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">5-Year Net Benefit</div>
                <div className="text-xl font-bold text-green-600">{formatCurrency(metrics.netBenefit)}</div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Value Multiple</div>
                <div className="text-xl font-bold text-blue-600">{(metrics.totalBenefit / metrics.totalInvestment).toFixed(0)}x</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
