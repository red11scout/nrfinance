import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, RefreshCw, Download, ArrowLeft, Info, TrendingUp, DollarSign, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";
import type { CalculationInputs } from "../../../shared/calculationEngine";

// Format currency in user-friendly way
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

export default function ScenarioBuilder() {
  const { theme, toggleTheme } = useTheme();
  const [inputs, setInputs] = useState<CalculationInputs | null>(null);
  const [scenarioName, setScenarioName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: defaults } = trpc.calculation.getDefaults.useQuery();
  const { data: scenarios } = trpc.scenario.list.useQuery();
  
  const calculateMutation = trpc.calculation.calculate.useMutation();
  const saveScenarioMutation = trpc.scenario.create.useMutation({
    onSuccess: () => {
      toast.success("Scenario saved successfully");
      setHasUnsavedChanges(false);
      setSaveDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to save scenario: ${error.message}`);
    },
  });

  // Initialize with defaults
  useEffect(() => {
    if (defaults && !inputs) {
      setInputs(defaults);
    }
  }, [defaults]);

  // Calculate results whenever inputs change
  useEffect(() => {
    if (inputs) {
      calculateMutation.mutate(inputs);
      setHasUnsavedChanges(true);
    }
  }, [inputs]);

  const handleInputChange = (section: keyof CalculationInputs, field: string, value: number) => {
    if (!inputs) return;
    setInputs({
      ...inputs,
      [section]: {
        ...inputs[section],
        [field]: value,
      },
    });
  };

  const handleReset = () => {
    if (defaults) {
      setInputs(defaults);
      toast.info("Reset to default values");
    }
  };

  const handleSave = () => {
    if (!scenarioName.trim()) {
      toast.error("Please enter a scenario name");
      return;
    }
    if (!inputs) return;

    saveScenarioMutation.mutate({
      name: scenarioName,
      description: `Custom scenario created on ${new Date().toLocaleDateString()}`,
      inputs,
    });
  };

  const handleLoadScenario = (scenarioId: number) => {
    const scenario = scenarios?.find(s => s.id === scenarioId);
    if (scenario && scenario.inputs) {
      setInputs(scenario.inputs as CalculationInputs);
      toast.success(`Loaded scenario: ${scenario.name}`);
    }
  };

  const results = calculateMutation.data;
  const loading = !inputs || calculateMutation.isPending;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-slate-600 dark:text-slate-400">Loading scenario builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button variant="outline" asChild className="w-fit">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src={theme === 'dark' ? '/blueally-logo-white.png' : '/blueally-logo-dark.png'} 
                alt="BlueAlly" 
                className="h-8 md:h-10 w-auto flex-shrink-0"
              />
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Scenario Builder</h1>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">Modify variables and see real-time financial impact</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Scenario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Scenario</DialogTitle>
                  <DialogDescription>
                    Give your scenario a name to save it for later comparison
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="scenario-name">Scenario Name</Label>
                    <Input
                      id="scenario-name"
                      placeholder="e.g., Conservative Estimate, Aggressive Growth"
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full" disabled={saveScenarioMutation.isPending}>
                    {saveScenarioMutation.isPending ? "Saving..." : "Save Scenario"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Load Scenario */}
        {scenarios && scenarios.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Load Saved Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => handleLoadScenario(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a scenario to load" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id.toString()}>
                      {scenario.name} - {new Date(scenario.createdAt).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        {results && (
          <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Current Scenario Results</CardTitle>
              <CardDescription className="text-blue-100">
                Real-time calculation based on your inputs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold">${(results.consolidated.grandTotal / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-blue-100">Total Annual Benefit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">${(results.platform0.total / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-blue-100">Platform 0</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">${(results.platform1.total / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-blue-100">Platform 1</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">${(results.platform2.total / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-blue-100">Platform 2</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">${(results.platform3.total / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-blue-100">Platform 3</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input Sections */}
        <Tabs defaultValue="baseline" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1">
            <TabsTrigger value="baseline" className="text-xs md:text-sm px-2">Baseline</TabsTrigger>
            <TabsTrigger value="platform0" className="text-xs md:text-sm px-2">P0</TabsTrigger>
            <TabsTrigger value="platform1" className="text-xs md:text-sm px-2">P1</TabsTrigger>
            <TabsTrigger value="platform2" className="text-xs md:text-sm px-2">P2</TabsTrigger>
            <TabsTrigger value="platform3" className="text-xs md:text-sm px-2">P3</TabsTrigger>
            <TabsTrigger value="platform4" className="text-xs md:text-sm px-2">P4</TabsTrigger>
          </TabsList>

          {/* Company Baseline */}
          <TabsContent value="baseline">
            <Card>
              <CardHeader>
                <CardTitle>Company Baseline Metrics</CardTitle>
                <CardDescription>
                  Current state of Nations Roof operations and financial performance
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
                  <Input
                    id="annualRevenue"
                    type="number"
                    value={inputs?.companyBaseline.annualRevenue || 0}
                    onChange={(e) => handleInputChange("companyBaseline", "annualRevenue", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="grossMargin">Gross Margin (%)</Label>
                  <Input
                    id="grossMargin"
                    type="number"
                    step="0.01"
                    value={(inputs?.companyBaseline.grossMargin || 0) * 100}
                    onChange={(e) => handleInputChange("companyBaseline", "grossMargin", parseFloat(e.target.value) / 100)}
                  />
                </div>
                <div>
                  <Label htmlFor="netMargin">Net Margin (%)</Label>
                  <Input
                    id="netMargin"
                    type="number"
                    step="0.01"
                    value={(inputs?.companyBaseline.netMargin || 0) * 100}
                    onChange={(e) => handleInputChange("companyBaseline", "netMargin", parseFloat(e.target.value) / 100)}
                  />
                </div>
                <div>
                  <Label htmlFor="annualProjects">Annual Projects</Label>
                  <Input
                    id="annualProjects"
                    type="number"
                    value={inputs?.companyBaseline.annualProjects || 0}
                    onChange={(e) => handleInputChange("companyBaseline", "annualProjects", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="annualBids">Annual Bids</Label>
                  <Input
                    id="annualBids"
                    type="number"
                    value={inputs?.companyBaseline.annualBids || 0}
                    onChange={(e) => handleInputChange("companyBaseline", "annualBids", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="winRate">Win Rate (%)</Label>
                  <Input
                    id="winRate"
                    type="number"
                    step="0.01"
                    value={(inputs?.companyBaseline.winRate || 0) * 100}
                    onChange={(e) => handleInputChange("companyBaseline", "winRate", parseFloat(e.target.value) / 100)}
                  />
                </div>
                <div>
                  <Label htmlFor="avgProjectValue">Average Project Value ($)</Label>
                  <Input
                    id="avgProjectValue"
                    type="number"
                    value={inputs?.companyBaseline.avgProjectValue || 0}
                    onChange={(e) => handleInputChange("companyBaseline", "avgProjectValue", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="currentLeadsPerYear">Current Leads Per Year</Label>
                  <Input
                    id="currentLeadsPerYear"
                    type="number"
                    value={inputs?.companyBaseline.currentLeadsPerYear || 0}
                    onChange={(e) => handleInputChange("companyBaseline", "currentLeadsPerYear", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="currentCostPerLead">Current Cost Per Lead ($)</Label>
                  <Input
                    id="currentCostPerLead"
                    type="number"
                    value={inputs?.companyBaseline.currentCostPerLead || 0}
                    onChange={(e) => handleInputChange("companyBaseline", "currentCostPerLead", parseFloat(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform 0 */}
          <TabsContent value="platform0">
            <Card>
              <CardHeader>
                <CardTitle>Platform 0: AI Market Expansion Engine</CardTitle>
                <CardDescription>
                  Autonomous lead generation delivering 10,000+ qualified leads annually
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="inputs">
                    <AccordionTrigger>Input Variables</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div>
                          <Label htmlFor="p0_annualLeads">Annual Leads Generated</Label>
                          <Input
                            id="p0_annualLeads"
                            type="number"
                            value={inputs?.platform0.annualLeads || 0}
                            onChange={(e) => handleInputChange("platform0", "annualLeads", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="p0_leadToMeetingConv">Lead to Meeting Conversion (%)</Label>
                          <Input
                            id="p0_leadToMeetingConv"
                            type="number"
                            step="0.01"
                            value={(inputs?.platform0.leadToMeetingConv || 0) * 100}
                            onChange={(e) => handleInputChange("platform0", "leadToMeetingConv", parseFloat(e.target.value) / 100)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="p0_meetingToCloseRate">Meeting to Close Rate (%)</Label>
                          <Input
                            id="p0_meetingToCloseRate"
                            type="number"
                            step="0.01"
                            value={(inputs?.platform0.meetingToCloseRate || 0) * 100}
                            onChange={(e) => handleInputChange("platform0", "meetingToCloseRate", parseFloat(e.target.value) / 100)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="p0_costPerLead">Cost Per Lead ($)</Label>
                          <Input
                            id="p0_costPerLead"
                            type="number"
                            value={inputs?.platform0.costPerLead || 0}
                            onChange={(e) => handleInputChange("platform0", "costPerLead", parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="p0_maintenancePlanAttachRate">Maintenance Plan Attach Rate (%)</Label>
                          <Input
                            id="p0_maintenancePlanAttachRate"
                            type="number"
                            step="0.01"
                            value={(inputs?.platform0.maintenancePlanAttachRate || 0) * 100}
                            onChange={(e) => handleInputChange("platform0", "maintenancePlanAttachRate", parseFloat(e.target.value) / 100)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="p0_salesCycleReductionDays">Sales Cycle Reduction (Days)</Label>
                          <Input
                            id="p0_salesCycleReductionDays"
                            type="number"
                            value={inputs?.platform0.salesCycleReductionDays || 0}
                            onChange={(e) => handleInputChange("platform0", "salesCycleReductionDays", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="p0_platformInvestment">Platform Investment ($)</Label>
                          <Input
                            id="p0_platformInvestment"
                            type="number"
                            value={inputs?.platform0.platformInvestment || 0}
                            onChange={(e) => handleInputChange("platform0", "platformInvestment", parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="p0_annualDataCosts">Annual Data Costs ($)</Label>
                          <Input
                            id="p0_annualDataCosts"
                            type="number"
                            value={inputs?.platform0.annualDataCosts || 0}
                            onChange={(e) => handleInputChange("platform0", "annualDataCosts", parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {results && (
                    <AccordionItem value="results">
                      <AccordionTrigger>Financial Impact</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="text-sm text-gray-600">Qualified Meetings</div>
                            <div className="text-2xl font-bold text-green-700">{results.platform0.qualifiedMeetings.toLocaleString()}</div>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="text-sm text-gray-600">New Projects</div>
                            <div className="text-2xl font-bold text-green-700">{results.platform0.newProjects.toLocaleString()}</div>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="text-sm text-gray-600">Gross Revenue</div>
                            <div className="text-2xl font-bold text-green-700">${(results.platform0.grossRevenue / 1000000).toFixed(1)}M</div>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-sm text-gray-600">Revenue Growth</div>
                            <div className="text-2xl font-bold text-blue-700">${(results.platform0.revenueGrowth / 1000000).toFixed(1)}M</div>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-sm text-gray-600">Cost Reduction</div>
                            <div className="text-2xl font-bold text-blue-700">${(results.platform0.costReduction / 1000000).toFixed(1)}M</div>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="text-sm text-gray-600">Total Benefit</div>
                            <div className="text-2xl font-bold text-purple-700">${(results.platform0.total / 1000000).toFixed(1)}M</div>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg">
                            <div className="text-sm text-gray-600">ROI</div>
                            <div className="text-2xl font-bold text-orange-700">{results.platform0.roi.toFixed(0)}%</div>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg">
                            <div className="text-sm text-gray-600">Payback Period</div>
                            <div className="text-2xl font-bold text-orange-700">{results.platform0.paybackMonths.toFixed(1)} mo</div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform 1 - Similar structure, abbreviated for brevity */}
          <TabsContent value="platform1">
            <Card>
              <CardHeader>
                <CardTitle>Platform 1: AI Sales Intelligence</CardTitle>
                <CardDescription>
                  Bid assignment AI and competitor analysis improving win rates from 22% to 33%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="p1_winRateImprovement">Win Rate Improvement (percentage points)</Label>
                    <Input
                      id="p1_winRateImprovement"
                      type="number"
                      value={inputs?.platform1.winRateImprovement || 0}
                      onChange={(e) => handleInputChange("platform1", "winRateImprovement", parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="p1_bidEvaluationTimeBaseline">Bid Evaluation Time Baseline (hours)</Label>
                    <Input
                      id="p1_bidEvaluationTimeBaseline"
                      type="number"
                      step="0.1"
                      value={inputs?.platform1.bidEvaluationTimeBaseline || 0}
                      onChange={(e) => handleInputChange("platform1", "bidEvaluationTimeBaseline", parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="p1_bidEvaluationTimeTarget">Bid Evaluation Time Target (hours)</Label>
                    <Input
                      id="p1_bidEvaluationTimeTarget"
                      type="number"
                      step="0.1"
                      value={inputs?.platform1.bidEvaluationTimeTarget || 0}
                      onChange={(e) => handleInputChange("platform1", "bidEvaluationTimeTarget", parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                {results && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">New Win Rate</div>
                      <div className="text-2xl font-bold text-green-700">{(results.platform1.newWinRate * 100).toFixed(0)}%</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Additional Wins</div>
                      <div className="text-2xl font-bold text-green-700">{results.platform1.additionalWins.toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Total Benefit</div>
                      <div className="text-2xl font-bold text-purple-700">${(results.platform1.total / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform 2, 3, 4 - Similar structure */}
          <TabsContent value="platform2">
            <Card>
              <CardHeader>
                <CardTitle>Platform 2: AI Estimation Suite</CardTitle>
                <CardDescription>
                  Automated proposal creation and specification reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Platform 2 inputs coming soon...</p>
                {results && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Total Benefit</div>
                      <div className="text-2xl font-bold text-purple-700">${(results.platform2.total / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platform3">
            <Card>
              <CardHeader>
                <CardTitle>Platform 3: AI Project Management</CardTitle>
                <CardDescription>
                  Automated schedule generation and project tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Platform 3 inputs coming soon...</p>
                {results && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Total Benefit</div>
                      <div className="text-2xl font-bold text-purple-700">${(results.platform3.total / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platform4">
            <Card>
              <CardHeader>
                <CardTitle>Platform 4: AI Knowledge Management</CardTitle>
                <CardDescription>
                  Automated submittal assembly and specification mapping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Platform 4 inputs coming soon...</p>
                {results && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Total Benefit</div>
                      <div className="text-2xl font-bold text-purple-700">${(results.platform4.total / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {hasUnsavedChanges && (
          <div className="fixed bottom-8 right-8 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-yellow-700" />
              <span className="text-sm font-medium text-yellow-900">You have unsaved changes</span>
              <Button size="sm" onClick={() => setSaveDialogOpen(true)}>
                Save Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
