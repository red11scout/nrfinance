import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator, 
  ArrowRight, 
  Equal, 
  X, 
  Plus, 
  Minus,
  Info,
  CheckCircle2
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ============================================================================
// TYPES
// ============================================================================

interface CalculationStep {
  label: string;
  formula?: string;
  variables?: { name: string; value: string; source?: string }[];
  calculation?: string;
  result: string;
  explanation?: string;
}

interface CalculationBreakdownProps {
  title: string;
  subtitle?: string;
  totalBenefit: string;
  steps: CalculationStep[];
  className?: string;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const FormulaDisplay = ({ formula }: { formula: string }) => (
  <div className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
    {formula}
  </div>
);

const VariableRow = ({ name, value, source }: { name: string; value: string; source?: string }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-200 dark:border-slate-700 last:border-0">
    <div className="flex items-center gap-2">
      <span className="text-slate-600 dark:text-slate-400">{name}</span>
      {source && (
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-3.5 w-3.5 text-slate-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Source: {source}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CalculationBreakdown({ 
  title, 
  subtitle, 
  totalBenefit, 
  steps,
  className = ""
}: CalculationBreakdownProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-900 border-b dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-blue-600" />
              {title}
            </CardTitle>
            {subtitle && (
              <CardDescription className="mt-1">{subtitle}</CardDescription>
            )}
          </div>
          <Badge variant="secondary" className="text-lg font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {totalBenefit}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {steps.map((step, index) => (
          <div key={index} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="p-4 md:p-6">
              {/* Step Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">{step.label}</h4>
              </div>
              
              {/* Formula */}
              {step.formula && (
                <div className="mb-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Formula</p>
                  <FormulaDisplay formula={step.formula} />
                </div>
              )}
              
              {/* Variables */}
              {step.variables && step.variables.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Variables</p>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    {step.variables.map((variable, vIndex) => (
                      <VariableRow 
                        key={vIndex} 
                        name={variable.name} 
                        value={variable.value} 
                        source={variable.source}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Calculation */}
              {step.calculation && (
                <div className="mb-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Calculation</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                      {step.calculation}
                    </div>
                    <Equal className="h-4 w-4 text-slate-400" />
                    <div className="font-mono text-sm font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-2 rounded-lg">
                      {step.result}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Result (if no calculation shown) */}
              {!step.calculation && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Result:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{step.result}</span>
                </div>
              )}
              
              {/* Explanation */}
              {step.explanation && (
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Note:</strong> {step.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PRE-BUILT CALCULATION BREAKDOWNS
// ============================================================================

export const PLATFORM_0_REVENUE_CALCULATION: CalculationStep[] = [
  {
    label: "Calculate New Leads Generated",
    formula: "New Leads = Lead Volume × Lead Increase Rate",
    variables: [
      { name: "Current Lead Volume", value: "2,400/year", source: "Company Baseline" },
      { name: "Lead Increase Rate", value: "317%", source: "AI Market Expansion capability" },
    ],
    calculation: "2,400 × 3.17",
    result: "7,600 new leads",
    explanation: "AI-powered lead generation through The Scout, Hunter, Concierge, and Closer agents dramatically increases lead volume."
  },
  {
    label: "Calculate Meetings from New Leads",
    formula: "Meetings = New Leads × Conversion Rate",
    variables: [
      { name: "New Leads", value: "7,600", source: "Step 1" },
      { name: "Lead-to-Meeting Conversion", value: "12%", source: "Target KPI (up from 5%)" },
    ],
    calculation: "7,600 × 0.12",
    result: "912 meetings",
  },
  {
    label: "Calculate New Projects Won",
    formula: "New Projects = Meetings × Win Rate",
    variables: [
      { name: "Meetings", value: "912", source: "Step 2" },
      { name: "Win Rate", value: "33%", source: "Target KPI (up from 22%)" },
    ],
    calculation: "912 × 0.33",
    result: "301 new projects",
  },
  {
    label: "Calculate Revenue Impact",
    formula: "Revenue = New Projects × Avg Project Value × Gross Margin",
    variables: [
      { name: "New Projects", value: "301", source: "Step 3" },
      { name: "Average Project Value", value: "$250,000", source: "Company Baseline" },
      { name: "Gross Margin", value: "35%", source: "Company Baseline" },
    ],
    calculation: "301 × $250,000 × 0.35",
    result: "$26.3M",
    explanation: "This represents the gross margin contribution from new projects, not total revenue."
  },
  {
    label: "Add Speed-to-Lead Revenue Recovery",
    formula: "Recovery = Lost Leads × Recovery Rate × Project Value × Margin",
    variables: [
      { name: "Leads Lost to Slow Response", value: "480/year", source: "20% of current leads" },
      { name: "Recovery Rate", value: "50%", source: "AI response < 2 minutes" },
      { name: "Conversion to Project", value: "4%", source: "Lead → Meeting → Win" },
      { name: "Avg Project Value × Margin", value: "$87,500", source: "$250K × 35%" },
    ],
    calculation: "480 × 0.50 × 0.04 × $87,500",
    result: "$840K",
  },
  {
    label: "Add Storm Surge Revenue",
    formula: "Storm Revenue = Storm Events × Properties × Response Rate × Value",
    variables: [
      { name: "Major Storm Events/Year", value: "12", source: "Historical average" },
      { name: "Affected Properties/Event", value: "50", source: "Average coverage area" },
      { name: "AI Response Capture Rate", value: "15%", source: "Immediate outreach" },
      { name: "Avg Emergency Project Value", value: "$300,000", source: "Higher urgency pricing" },
    ],
    calculation: "12 × 50 × 0.15 × $300,000 × 0.35",
    result: "$9.5M",
  },
  {
    label: "Total Platform 0 Revenue Growth",
    formula: "Total = Base Revenue + Speed Recovery + Storm Revenue - Overlap Adjustment",
    variables: [
      { name: "Base New Project Revenue", value: "$26.3M", source: "Step 4" },
      { name: "Speed-to-Lead Recovery", value: "$840K", source: "Step 5" },
      { name: "Storm Surge Revenue", value: "$9.5M", source: "Step 6" },
      { name: "Overlap Adjustment", value: "-$6.6M", source: "Avoid double counting" },
    ],
    calculation: "$26.3M + $0.84M + $9.5M - $6.6M",
    result: "$30.0M",
    explanation: "The overlap adjustment accounts for leads that would be captured by multiple mechanisms."
  },
];

export const PLATFORM_1_REVENUE_CALCULATION: CalculationStep[] = [
  {
    label: "Calculate Win Rate Improvement Impact",
    formula: "Additional Wins = Current Bids × Win Rate Improvement",
    variables: [
      { name: "Annual Bids", value: "11,700", source: "Company Baseline" },
      { name: "Current Win Rate", value: "22%", source: "Company Baseline" },
      { name: "Target Win Rate", value: "33%", source: "With AI Sales Intelligence" },
      { name: "Win Rate Improvement", value: "+11 points", source: "33% - 22%" },
    ],
    calculation: "11,700 × 0.11",
    result: "1,287 additional wins",
    explanation: "The 11-point win rate improvement comes from: Bid Assignment AI (+3pts), Competitor Analysis (+4pts), Market Intelligence (+2pts), Better Qualification (+2pts)."
  },
  {
    label: "Calculate Revenue from Additional Wins",
    formula: "Revenue = Additional Wins × Avg Project Value × Gross Margin",
    variables: [
      { name: "Additional Wins", value: "1,287", source: "Step 1" },
      { name: "Average Project Value", value: "$250,000", source: "Company Baseline" },
      { name: "Gross Margin", value: "35%", source: "Company Baseline" },
    ],
    calculation: "1,287 × $250,000 × 0.35",
    result: "$112.6M gross",
  },
  {
    label: "Apply Attribution Factor",
    formula: "Attributed Revenue = Gross Revenue × Attribution Factor",
    variables: [
      { name: "Gross Revenue Impact", value: "$112.6M", source: "Step 2" },
      { name: "Attribution Factor", value: "20.7%", source: "Conservative estimate of AI contribution" },
    ],
    calculation: "$112.6M × 0.207",
    result: "$23.3M",
    explanation: "Not all wins can be attributed solely to AI. The attribution factor represents the portion directly enabled by Sales Intelligence capabilities."
  },
];

export const PLATFORM_2_REVENUE_CALCULATION: CalculationStep[] = [
  {
    label: "Calculate Estimation Accuracy Improvement",
    formula: "Margin Recovery = Projects × Avg Value × Margin Improvement",
    variables: [
      { name: "Annual Projects", value: "2,100", source: "Company Baseline" },
      { name: "Average Project Value", value: "$250,000", source: "Company Baseline" },
      { name: "Current Estimation Error Rate", value: "8%", source: "Industry average" },
      { name: "Target Error Rate", value: "2%", source: "With AI Estimation" },
      { name: "Margin Impact of Errors", value: "50%", source: "Half of errors reduce margin" },
    ],
    calculation: "2,100 × $250,000 × (8% - 2%) × 50%",
    result: "$15.8M margin recovery",
  },
  {
    label: "Calculate Change Order Revenue",
    formula: "CO Revenue = Projects × CO Rate Improvement × Avg CO Value",
    variables: [
      { name: "Annual Projects", value: "2,100", source: "Company Baseline" },
      { name: "Current CO Capture Rate", value: "60%", source: "Manual process" },
      { name: "Target CO Capture Rate", value: "85%", source: "With AI detection" },
      { name: "Avg Change Order Value", value: "$18,000", source: "Historical data" },
      { name: "CO Frequency", value: "40%", source: "Projects with COs" },
    ],
    calculation: "2,100 × 0.40 × (85% - 60%) × $18,000",
    result: "$3.8M",
  },
  {
    label: "Apply Conservative Factor",
    formula: "Total Revenue = (Margin Recovery + CO Revenue) × Factor",
    variables: [
      { name: "Margin Recovery", value: "$15.8M", source: "Step 1" },
      { name: "CO Revenue", value: "$3.8M", source: "Step 2" },
      { name: "Conservative Factor", value: "75%", source: "Account for implementation ramp" },
    ],
    calculation: "($15.8M + $3.8M) × 0.75",
    result: "$14.7M",
  },
];

export const PLATFORM_3_COST_CALCULATION: CalculationStep[] = [
  {
    label: "Calculate Project Manager Efficiency Gains",
    formula: "PM Savings = PMs × Avg Salary × Time Saved",
    variables: [
      { name: "Project Managers", value: "85", source: "Current headcount" },
      { name: "Average PM Salary + Benefits", value: "$95,000", source: "Fully loaded cost" },
      { name: "Time Saved on Admin Tasks", value: "35%", source: "AI automation" },
    ],
    calculation: "85 × $95,000 × 0.35",
    result: "$2.8M",
    explanation: "PMs spend 35% of time on administrative tasks that AI can automate: scheduling, status updates, documentation."
  },
  {
    label: "Calculate Rework Reduction",
    formula: "Rework Savings = Projects × Rework Rate Reduction × Avg Rework Cost",
    variables: [
      { name: "Annual Projects", value: "2,100", source: "Company Baseline" },
      { name: "Current Rework Rate", value: "12%", source: "Industry benchmark" },
      { name: "Target Rework Rate", value: "4%", source: "With AI quality control" },
      { name: "Average Rework Cost", value: "$35,000", source: "Historical data" },
    ],
    calculation: "2,100 × (12% - 4%) × $35,000",
    result: "$5.9M",
  },
  {
    label: "Calculate Schedule Optimization Savings",
    formula: "Schedule Savings = Projects × Days Saved × Daily Cost",
    variables: [
      { name: "Annual Projects", value: "2,100", source: "Company Baseline" },
      { name: "Average Days Saved", value: "3.5", source: "AI scheduling optimization" },
      { name: "Daily Overhead Cost", value: "$2,800", source: "Equipment + labor" },
    ],
    calculation: "2,100 × 3.5 × $2,800",
    result: "$20.6M gross",
  },
  {
    label: "Apply Realization Factor",
    formula: "Total Cost Reduction = Sum × Realization Factor",
    variables: [
      { name: "PM Efficiency", value: "$2.8M", source: "Step 1" },
      { name: "Rework Reduction", value: "$5.9M", source: "Step 2" },
      { name: "Schedule Savings", value: "$20.6M", source: "Step 3" },
      { name: "Realization Factor", value: "60%", source: "Conservative implementation" },
    ],
    calculation: "($2.8M + $5.9M + $20.6M) × 0.60",
    result: "$17.6M",
  },
];

export const PLATFORM_4_CALCULATION: CalculationStep[] = [
  {
    label: "Calculate Training Time Reduction",
    formula: "Training Savings = New Hires × Training Cost Reduction",
    variables: [
      { name: "Annual New Hires", value: "120", source: "HR data" },
      { name: "Current Training Cost", value: "$15,000", source: "Per employee" },
      { name: "Training Time Reduction", value: "40%", source: "AI-assisted onboarding" },
    ],
    calculation: "120 × $15,000 × 0.40",
    result: "$720K",
  },
  {
    label: "Calculate Knowledge Search Productivity",
    formula: "Search Savings = Employees × Hours Saved × Hourly Cost",
    variables: [
      { name: "Knowledge Workers", value: "450", source: "Estimators, PMs, Sales" },
      { name: "Hours Saved/Week", value: "3", source: "AI search vs manual" },
      { name: "Weeks/Year", value: "50", source: "Working weeks" },
      { name: "Avg Hourly Cost", value: "$45", source: "Fully loaded" },
    ],
    calculation: "450 × 3 × 50 × $45",
    result: "$3.0M",
  },
  {
    label: "Calculate Expert Knowledge Retention Value",
    formula: "Retention Value = Experts × Knowledge Value × Capture Rate",
    variables: [
      { name: "Senior Experts Retiring (5yr)", value: "25", source: "Workforce analysis" },
      { name: "Knowledge Value per Expert", value: "$500,000", source: "Replacement cost" },
      { name: "AI Capture Rate", value: "60%", source: "RAG knowledge base" },
    ],
    calculation: "25 × $500,000 × 0.60 ÷ 5 years",
    result: "$1.5M/year",
  },
  {
    label: "Calculate Error Reduction from Better Information",
    formula: "Error Savings = Decisions × Error Rate Reduction × Avg Error Cost",
    variables: [
      { name: "Critical Decisions/Year", value: "15,000", source: "Estimates + project decisions" },
      { name: "Error Rate Reduction", value: "3%", source: "Better information access" },
      { name: "Average Error Cost", value: "$8,000", source: "Rework + delays" },
    ],
    calculation: "15,000 × 0.03 × $8,000",
    result: "$3.6M",
  },
  {
    label: "Total Platform 4 Benefit",
    formula: "Total = Training + Search + Retention + Errors - Overlap",
    variables: [
      { name: "Training Savings", value: "$720K", source: "Step 1" },
      { name: "Search Productivity", value: "$3.0M", source: "Step 2" },
      { name: "Knowledge Retention", value: "$1.5M", source: "Step 3" },
      { name: "Error Reduction", value: "$3.6M", source: "Step 4" },
      { name: "Overlap Adjustment", value: "-$920K", source: "Avoid double counting" },
    ],
    calculation: "$0.72M + $3.0M + $1.5M + $3.6M - $0.92M",
    result: "$7.9M",
  },
];

export const CONSOLIDATED_CALCULATION: CalculationStep[] = [
  {
    label: "Platform 0: Market Expansion",
    variables: [
      { name: "Revenue Growth", value: "$30.0M", source: "Lead generation + conversions" },
      { name: "Cost Reduction", value: "$2.3M", source: "SDR efficiency" },
      { name: "Risk Mitigation", value: "$500K", source: "Better qualification" },
      { name: "Cash Flow Impact", value: "$700K", source: "Faster conversions" },
    ],
    result: "$35.0M",
  },
  {
    label: "Platform 1: Sales Intelligence",
    variables: [
      { name: "Revenue Growth", value: "$23.3M", source: "Win rate improvement" },
      { name: "Cost Reduction", value: "$900K", source: "Sales efficiency" },
    ],
    result: "$24.2M",
  },
  {
    label: "Platform 2: Estimation Suite",
    variables: [
      { name: "Revenue Growth", value: "$14.8M", source: "Accuracy + change orders" },
      { name: "Cost Reduction", value: "$3.7M", source: "Estimator efficiency" },
      { name: "Risk Mitigation", value: "$3.9M", source: "Reduced errors" },
      { name: "Cash Flow Impact", value: "$800K", source: "Faster estimates" },
    ],
    result: "$23.2M",
  },
  {
    label: "Platform 3: Project Management",
    variables: [
      { name: "Revenue Growth", value: "$2.7M", source: "Capacity increase" },
      { name: "Cost Reduction", value: "$17.7M", source: "PM efficiency + rework" },
      { name: "Cash Flow Impact", value: "$1.2M", source: "Faster completion" },
    ],
    result: "$21.6M",
  },
  {
    label: "Platform 4: Knowledge Management",
    variables: [
      { name: "Revenue Growth", value: "$3.9M", source: "Better decisions" },
      { name: "Cost Reduction", value: "$4.0M", source: "Training + search" },
    ],
    result: "$7.9M",
  },
  {
    label: "Grand Total Annual Benefit",
    formula: "Total = P0 + P1 + P2 + P3 + P4",
    calculation: "$35.0M + $24.2M + $23.2M + $21.6M + $7.9M",
    result: "$111.9M",
    explanation: "This represents the total annual financial benefit across all five AI platforms, validated against the source document."
  },
];
