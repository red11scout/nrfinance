import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Info, RotateCcw, Dices, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, AreaChart, Area } from "recharts";
import { calculateFinancials, DEFAULT_INPUTS } from "../../../shared/calculationEngine";

// Format number to user-friendly format with thousands separators
const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  } else if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })}K`;
  }
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

const formatPercent = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Box-Muller transform for normal distribution
const normalRandom = (mean: number, stdDev: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
};

// Monte Carlo simulation function
const runMonteCarloSimulation = (iterations: number = 10000) => {
  const results: number[] = [];
  
  // Variable distributions (mean, stdDev as % of mean)
  const distributions = {
    leadVolume: { mean: 1.0, stdDev: 0.15 },      // 15% standard deviation
    winRate: { mean: 11, stdDev: 2 },              // Win rate improvement points
    conversionRate: { mean: 12, stdDev: 2 },       // Conversion rate %
    projectValue: { mean: 250, stdDev: 30 },       // Project value in K
    implementation: { mean: 90, stdDev: 10 },      // Implementation success %
  };

  for (let i = 0; i < iterations; i++) {
    // Sample from distributions with bounds
    const leadMult = Math.max(0.5, Math.min(1.5, normalRandom(distributions.leadVolume.mean, distributions.leadVolume.stdDev)));
    const winRate = Math.max(5, Math.min(17, normalRandom(distributions.winRate.mean, distributions.winRate.stdDev)));
    const convRate = Math.max(5, Math.min(20, normalRandom(distributions.conversionRate.mean, distributions.conversionRate.stdDev)));
    const projValue = Math.max(150, Math.min(400, normalRandom(distributions.projectValue.mean, distributions.projectValue.stdDev)));
    const impl = Math.max(60, Math.min(100, normalRandom(distributions.implementation.mean, distributions.implementation.stdDev)));

    // Calculate total benefit
    const p0 = 35000000 * leadMult * (convRate / 12) * (impl / 100);
    const p1 = 24200000 * (winRate / 11) * (impl / 100);
    const p2 = 23200000 * (projValue / 250) * (impl / 100);
    const p3 = 21600000 * (impl / 100);
    const p4 = 7900000 * (impl / 100);
    
    results.push(p0 + p1 + p2 + p3 + p4);
  }

  return results.sort((a, b) => a - b);
};

// Calculate statistics from Monte Carlo results
const calculateStats = (results: number[]) => {
  const n = results.length;
  const mean = results.reduce((a, b) => a + b, 0) / n;
  const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  // Percentiles
  const p5 = results[Math.floor(n * 0.05)];
  const p10 = results[Math.floor(n * 0.10)];
  const p25 = results[Math.floor(n * 0.25)];
  const p50 = results[Math.floor(n * 0.50)]; // median
  const p75 = results[Math.floor(n * 0.75)];
  const p90 = results[Math.floor(n * 0.90)];
  const p95 = results[Math.floor(n * 0.95)];
  
  const min = results[0];
  const max = results[n - 1];

  return { mean, stdDev, p5, p10, p25, p50, p75, p90, p95, min, max };
};

// Create histogram data
const createHistogramData = (results: number[], bins: number = 30) => {
  const min = Math.min(...results);
  const max = Math.max(...results);
  const binWidth = (max - min) / bins;
  
  const histogram: { bin: number; count: number; range: string }[] = [];
  
  for (let i = 0; i < bins; i++) {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    const count = results.filter(v => v >= binStart && v < binEnd).length;
    histogram.push({
      bin: (binStart + binEnd) / 2 / 1000000,
      count,
      range: `$${(binStart / 1000000).toFixed(0)}M - $${(binEnd / 1000000).toFixed(0)}M`
    });
  }
  
  return histogram;
};

export default function SensitivityAnalysis() {
  
  // Sensitivity variables with sliders
  const [leadVolumeMultiplier, setLeadVolumeMultiplier] = useState(100);
  const [winRateImprovement, setWinRateImprovement] = useState(11);
  const [conversionRate, setConversionRate] = useState(12);
  const [avgProjectValue, setAvgProjectValue] = useState(250);
  const [costPerLead, setCostPerLead] = useState(120);
  const [implementationSuccess, setImplementationSuccess] = useState(100);

  // Monte Carlo state
  const [monteCarloResults, setMonteCarloResults] = useState<number[] | null>(null);
  const [isRunningMonteCarlo, setIsRunningMonteCarlo] = useState(false);
  const [simulationCount, setSimulationCount] = useState(10000);

  // Reset to defaults
  const resetToDefaults = () => {
    setLeadVolumeMultiplier(100);
    setWinRateImprovement(11);
    setConversionRate(12);
    setAvgProjectValue(250);
    setCostPerLead(120);
    setImplementationSuccess(100);
  };

  // Run Monte Carlo simulation
  const runSimulation = useCallback(() => {
    setIsRunningMonteCarlo(true);
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const results = runMonteCarloSimulation(simulationCount);
      setMonteCarloResults(results);
      setIsRunningMonteCarlo(false);
    }, 100);
  }, [simulationCount]);

  // Calculate baseline
  const baselineResults = useMemo(() => calculateFinancials(DEFAULT_INPUTS), []);
  const baselineTotal = baselineResults.consolidated.grandTotal;

  // Calculate adjusted total based on sensitivity variables
  const calculateAdjustedTotal = useMemo(() => {
    const leadEffect = (leadVolumeMultiplier / 100);
    const conversionEffect = (conversionRate / 12);
    const cplEffect = (120 / costPerLead);
    const winRateEffect = (winRateImprovement / 11);
    const projectValueEffect = (avgProjectValue / 250);
    const implEffect = (implementationSuccess / 100);

    const p0 = 35000000 * leadEffect * conversionEffect * cplEffect * implEffect;
    const p1 = 24200000 * winRateEffect * implEffect;
    const p2 = 23200000 * projectValueEffect * implEffect;
    const p3 = 21600000 * implEffect;
    const p4 = 7900000 * implEffect;

    return {
      platform0: p0,
      platform1: p1,
      platform2: p2,
      platform3: p3,
      platform4: p4,
      total: p0 + p1 + p2 + p3 + p4
    };
  }, [leadVolumeMultiplier, winRateImprovement, conversionRate, avgProjectValue, costPerLead, implementationSuccess]);

  // Monte Carlo statistics
  const monteCarloStats = useMemo(() => {
    if (!monteCarloResults) return null;
    return calculateStats(monteCarloResults);
  }, [monteCarloResults]);

  // Histogram data
  const histogramData = useMemo(() => {
    if (!monteCarloResults) return [];
    return createHistogramData(monteCarloResults, 40);
  }, [monteCarloResults]);

  // Generate sensitivity data for charts
  const leadVolumeSensitivity = useMemo(() => {
    const data = [];
    for (let mult = 50; mult <= 150; mult += 10) {
      const p0 = 35000000 * (mult / 100) * (implementationSuccess / 100);
      const total = p0 + 24200000 + 23200000 + 21600000 + 7900000;
      data.push({
        multiplier: mult,
        label: `${mult}%`,
        total: total / 1000000,
        isBaseline: mult === 100,
        isCurrent: mult === leadVolumeMultiplier
      });
    }
    return data;
  }, [implementationSuccess, leadVolumeMultiplier]);

  const winRateSensitivity = useMemo(() => {
    const data = [];
    for (let wr = 5; wr <= 17; wr += 2) {
      const p1 = 24200000 * (wr / 11) * (implementationSuccess / 100);
      const total = 35000000 + p1 + 23200000 + 21600000 + 7900000;
      data.push({
        improvement: wr,
        label: `+${wr}`,
        total: total / 1000000,
        isBaseline: wr === 11,
        isCurrent: wr === winRateImprovement
      });
    }
    return data;
  }, [implementationSuccess, winRateImprovement]);

  // Tornado chart data
  const tornadoData = useMemo(() => {
    const variables = [
      { name: "Lead Volume", base: 35000000, lowMult: 0.8, highMult: 1.2 },
      { name: "Win Rate", base: 24200000, lowMult: 0.8, highMult: 1.2 },
      { name: "Project Value", base: 23200000, lowMult: 0.8, highMult: 1.2 },
      { name: "Implementation", base: baselineTotal, lowMult: 0.8, highMult: 1.0 },
      { name: "Conversion Rate", base: 35000000, lowMult: 0.8, highMult: 1.2 },
    ];

    return variables.map(v => {
      let lowImpact, highImpact;
      
      if (v.name === "Implementation") {
        lowImpact = (v.base * v.lowMult - v.base) / 1000000;
        highImpact = 0;
      } else {
        lowImpact = (v.base * v.lowMult - v.base) / 1000000;
        highImpact = (v.base * v.highMult - v.base) / 1000000;
      }

      return {
        name: v.name,
        low: lowImpact,
        high: highImpact,
        range: Math.abs(highImpact - lowImpact)
      };
    }).sort((a, b) => b.range - a.range);
  }, [baselineTotal]);

  // Scenario comparison
  const scenarios = useMemo(() => {
    const calcScenario = (leadMult: number, winRate: number, conv: number, impl: number) => {
      const p0 = 35000000 * leadMult * (conv / 12) * (impl / 100);
      const p1 = 24200000 * (winRate / 11) * (impl / 100);
      const p2 = 23200000 * (impl / 100);
      const p3 = 21600000 * (impl / 100);
      const p4 = 7900000 * (impl / 100);
      return p0 + p1 + p2 + p3 + p4;
    };

    return [
      { name: "Conservative", total: calcScenario(0.7, 7, 8, 80), color: "red" },
      { name: "Likely", total: calcScenario(1.0, 11, 12, 100), color: "blue" },
      { name: "Optimistic", total: calcScenario(1.3, 15, 15, 100), color: "green" }
    ];
  }, []);

  const changeFromBaseline = ((calculateAdjustedTotal.total - baselineTotal) / baselineTotal) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <Button variant="outline" asChild className="w-fit">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <img 
              src="/blueally-logo-dark.png" 
              alt="BlueAlly" 
              className="h-8 md:h-10 w-auto flex-shrink-0"
            />
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Sensitivity Analysis</h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">Adjust variables to see real-time impact on financial outcomes</p>
            </div>
          </div>
          <Button variant="outline" onClick={resetToDefaults} className="w-fit">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Results Summary */}
        <Card className="mb-6 border-l-4 border-l-blue-600">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Baseline</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-slate-700 dark:text-slate-300">{formatCurrency(baselineTotal)}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Adjusted</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600">{formatCurrency(calculateAdjustedTotal.total)}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Change</p>
                <p className={`text-lg md:text-xl lg:text-2xl font-bold flex items-center gap-1 ${changeFromBaseline >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {changeFromBaseline >= 0 ? <TrendingUp className="h-4 w-4 md:h-5 md:w-5" /> : <TrendingDown className="h-4 w-4 md:h-5 md:w-5" />}
                  {formatPercent(changeFromBaseline)}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Impact</p>
                <p className={`text-lg md:text-xl lg:text-2xl font-bold ${changeFromBaseline >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(calculateAdjustedTotal.total - baselineTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variable Controls */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-blue-600" />
              Adjust Variables
            </CardTitle>
            <CardDescription>Move sliders to see real-time impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Lead Volume */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Lead Volume</Label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">{leadVolumeMultiplier}%</span>
                </div>
                <Slider
                  value={[leadVolumeMultiplier]}
                  onValueChange={(v) => setLeadVolumeMultiplier(v[0])}
                  min={50}
                  max={150}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">Platform 0: Market Expansion</p>
              </div>

              {/* Win Rate */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Win Rate Improvement</Label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">+{winRateImprovement} pts</span>
                </div>
                <Slider
                  value={[winRateImprovement]}
                  onValueChange={(v) => setWinRateImprovement(v[0])}
                  min={5}
                  max={17}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">Platform 1: Sales Intelligence</p>
              </div>

              {/* Conversion Rate */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Lead-to-Meeting</Label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">{conversionRate}%</span>
                </div>
                <Slider
                  value={[conversionRate]}
                  onValueChange={(v) => setConversionRate(v[0])}
                  min={5}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">Platform 0: Conversion Rate</p>
              </div>

              {/* Project Value */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Avg Project Value</Label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">${avgProjectValue}K</span>
                </div>
                <Slider
                  value={[avgProjectValue]}
                  onValueChange={(v) => setAvgProjectValue(v[0])}
                  min={150}
                  max={400}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">Platform 2: Estimation Suite</p>
              </div>

              {/* Cost Per Lead */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Target Cost Per Lead</Label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">${costPerLead}</span>
                </div>
                <Slider
                  value={[costPerLead]}
                  onValueChange={(v) => setCostPerLead(v[0])}
                  min={80}
                  max={200}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">Lower = better (from $350)</p>
              </div>

              {/* Implementation */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Implementation Success</Label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">{implementationSuccess}%</span>
                </div>
                <Slider
                  value={[implementationSuccess]}
                  onValueChange={(v) => setImplementationSuccess(v[0])}
                  min={60}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">Affects all platforms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monte Carlo Simulation */}
        <Card className="mb-6 border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Dices className="h-5 w-5 text-purple-600" />
                  Monte Carlo Simulation
                </CardTitle>
                <CardDescription>Probabilistic analysis with {simulationCount.toLocaleString()} scenarios</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={simulationCount}
                  onChange={(e) => setSimulationCount(Number(e.target.value))}
                  className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700"
                >
                  <option value={1000}>1,000 scenarios</option>
                  <option value={5000}>5,000 scenarios</option>
                  <option value={10000}>10,000 scenarios</option>
                  <option value={25000}>25,000 scenarios</option>
                  <option value={50000}>50,000 scenarios</option>
                </select>
                <Button 
                  onClick={runSimulation} 
                  disabled={isRunningMonteCarlo}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isRunningMonteCarlo ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Dices className="h-4 w-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {monteCarloStats ? (
              <div className="space-y-6">
                {/* Key Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Expected Value</p>
                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{formatCurrency(monteCarloStats.mean)}</p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Std Deviation</p>
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{formatCurrency(monteCarloStats.stdDev)}</p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">5th Percentile</p>
                    <p className="text-lg font-bold text-red-700 dark:text-red-300">{formatCurrency(monteCarloStats.p5)}</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Median (50th)</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{formatCurrency(monteCarloStats.p50)}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">95th Percentile</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">{formatCurrency(monteCarloStats.p95)}</p>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Range</p>
                    <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{formatCurrency(monteCarloStats.max - monteCarloStats.min)}</p>
                  </div>
                </div>

                {/* Confidence Intervals */}
                <div className="p-4 bg-gradient-to-r from-red-50 via-blue-50 to-green-50 dark:from-red-950/20 dark:via-blue-950/20 dark:to-green-950/20 rounded-lg">
                  <h4 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Confidence Intervals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">90% Confidence</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {formatCurrency(monteCarloStats.p5)} — {formatCurrency(monteCarloStats.p95)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">80% Confidence</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {formatCurrency(monteCarloStats.p10)} — {formatCurrency(monteCarloStats.p90)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">50% Confidence (IQR)</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {formatCurrency(monteCarloStats.p25)} — {formatCurrency(monteCarloStats.p75)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Probability Distribution Chart */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Probability Distribution</h4>
                  <div className="h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={histogramData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="bin" 
                          tickFormatter={(v) => `$${v.toFixed(0)}M`}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v) => v.toLocaleString()}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [value.toLocaleString() + ' scenarios', 'Frequency']}
                          labelFormatter={(label) => `Benefit: $${Number(label).toFixed(0)}M`}
                        />
                        <ReferenceLine x={monteCarloStats.mean / 1000000} stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
                        <ReferenceLine x={111.9} stroke="#2563eb" strokeWidth={2} label={{ value: 'Baseline', position: 'top', fontSize: 10 }} />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#8b5cf6" 
                          fillOpacity={1}
                          fill="url(#colorCount)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
                    Purple dashed line = Expected value ({formatCurrency(monteCarloStats.mean)}) | Blue line = Baseline ($111.9M)
                  </p>
                </div>

                {/* Risk Assessment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Downside Risk</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Probability of achieving less than baseline ($111.9M)
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {((monteCarloResults?.filter(v => v < 111900000).length || 0) / simulationCount * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Upside Potential</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Probability of exceeding $120M annual benefit
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {((monteCarloResults?.filter(v => v > 120000000).length || 0) / simulationCount * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Dices className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Run Monte Carlo Simulation</p>
                <p className="text-sm">Click "Run Simulation" to generate probabilistic outcomes based on variable distributions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scenario Comparison */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Scenario Comparison</CardTitle>
            <CardDescription>Conservative, likely, and optimistic projections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((scenario, idx) => (
                <div 
                  key={scenario.name}
                  className={`p-4 rounded-lg border-2 ${
                    idx === 0 ? 'border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800' :
                    idx === 1 ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800' :
                    'border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {idx === 0 && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    {idx === 1 && <TrendingUp className="h-4 w-4 text-blue-600" />}
                    {idx === 2 && <TrendingUp className="h-4 w-4 text-green-600" />}
                    <h3 className={`font-semibold text-sm ${
                      idx === 0 ? 'text-red-700 dark:text-red-400' :
                      idx === 1 ? 'text-blue-700 dark:text-blue-400' :
                      'text-green-700 dark:text-green-400'
                    }`}>{scenario.name}</h3>
                  </div>
                  <p className={`text-xl md:text-2xl font-bold ${
                    idx === 0 ? 'text-red-600' :
                    idx === 1 ? 'text-blue-600' :
                    'text-green-600'
                  }`}>{formatCurrency(scenario.total)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Tabs defaultValue="tornado" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="tornado" className="text-xs md:text-sm">Impact Ranking</TabsTrigger>
            <TabsTrigger value="leadVolume" className="text-xs md:text-sm">Lead Volume</TabsTrigger>
            <TabsTrigger value="winRate" className="text-xs md:text-sm">Win Rate</TabsTrigger>
          </TabsList>

          <TabsContent value="tornado">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Variable Impact Ranking</CardTitle>
                <CardDescription>Which variables have the largest impact (±20%)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tornadoData}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[-25, 10]} tickFormatter={(v) => `${v > 0 ? '+' : ''}$${v}M`} />
                      <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: number) => [`${value > 0 ? '+' : ''}$${value.toFixed(1)}M`, '']} />
                      <ReferenceLine x={0} stroke="#64748b" />
                      <Bar dataKey="low" fill="#ef4444" name="Downside" />
                      <Bar dataKey="high" fill="#22c55e" name="Upside" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leadVolume">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Lead Volume Sensitivity</CardTitle>
                <CardDescription>Total benefit vs lead generation volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={leadVolumeSensitivity} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis domain={['auto', 'auto']} tickFormatter={(v) => `$${v}M`} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: number) => [`$${value.toFixed(1)}M`, 'Total']} />
                      <ReferenceLine x="100%" stroke="#64748b" strokeDasharray="5 5" />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#2563eb" 
                        strokeWidth={3}
                        dot={(props: any) => {
                          const { cx, cy, payload, index } = props;
                          if (payload.isCurrent) {
                            return <circle key={`dot-${index}`} cx={cx} cy={cy} r={8} fill="#2563eb" stroke="#fff" strokeWidth={2} />;
                          }
                          if (payload.isBaseline) {
                            return <circle key={`dot-${index}`} cx={cx} cy={cy} r={6} fill="#64748b" stroke="#fff" strokeWidth={2} />;
                          }
                          return <circle key={`dot-${index}`} cx={cx} cy={cy} r={4} fill="#2563eb" />;
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="winRate">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Win Rate Sensitivity</CardTitle>
                <CardDescription>Total benefit vs win rate improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={winRateSensitivity} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis domain={['auto', 'auto']} tickFormatter={(v) => `$${v}M`} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: number) => [`$${value.toFixed(1)}M`, 'Total']} />
                      <Bar dataKey="total">
                        {winRateSensitivity.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isCurrent ? '#2563eb' : entry.isBaseline ? '#64748b' : '#93c5fd'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Platform Breakdown Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Platform Breakdown</CardTitle>
            <CardDescription>Current scenario impact by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 md:p-3 font-semibold">Platform</th>
                    <th className="text-right p-2 md:p-3 font-semibold">Baseline</th>
                    <th className="text-right p-2 md:p-3 font-semibold">Adjusted</th>
                    <th className="text-right p-2 md:p-3 font-semibold">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "P0: Market Expansion", base: 35000000, adj: calculateAdjustedTotal.platform0 },
                    { name: "P1: Sales Intelligence", base: 24200000, adj: calculateAdjustedTotal.platform1 },
                    { name: "P2: Estimation Suite", base: 23200000, adj: calculateAdjustedTotal.platform2 },
                    { name: "P3: Project Management", base: 21600000, adj: calculateAdjustedTotal.platform3 },
                    { name: "P4: Knowledge Mgmt", base: 7900000, adj: calculateAdjustedTotal.platform4 },
                  ].map((p, idx) => (
                    <tr key={idx} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="p-2 md:p-3 font-medium text-xs md:text-sm">{p.name}</td>
                      <td className="text-right p-2 md:p-3 text-xs md:text-sm">{formatCurrency(p.base)}</td>
                      <td className="text-right p-2 md:p-3 font-semibold text-blue-600 text-xs md:text-sm">{formatCurrency(p.adj)}</td>
                      <td className={`text-right p-2 md:p-3 text-xs md:text-sm ${p.adj >= p.base ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(p.adj - p.base)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                    <td className="p-2 md:p-3 text-xs md:text-sm">Total</td>
                    <td className="text-right p-2 md:p-3 text-xs md:text-sm">{formatCurrency(baselineTotal)}</td>
                    <td className="text-right p-2 md:p-3 text-blue-600 text-xs md:text-sm">{formatCurrency(calculateAdjustedTotal.total)}</td>
                    <td className={`text-right p-2 md:p-3 text-xs md:text-sm ${calculateAdjustedTotal.total >= baselineTotal ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(calculateAdjustedTotal.total - baselineTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
