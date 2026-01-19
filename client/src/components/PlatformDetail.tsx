import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Zap,
  Bot,
  AlertTriangle,
  Target,
  Briefcase,
  Database,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface FrictionPoint {
  category: string;
  issue: string;
  businessImpact: string;
  cost: number;
}

interface UseCase {
  id: number | string;
  name: string;
  description: string;
  primaryValue?: string;
}

interface KPI {
  useCase?: string;
  metric: string;
  baseline: string;
  target: string;
  improvement?: string;
  industryBenchmark?: string;
}

interface Agent {
  name: string;
  subtitle?: string;
  role?: string;
  trigger?: string;
  responsibility?: string;
  technology?: string;
}

interface FinancialItem {
  id?: number | string;
  useCase?: string;
  laborSavings?: number;
  revenueGrowth?: number;
  riskMitigation?: number;
  costReduction?: number;
  cashFlow?: number;
  total: number;
  formula?: string;
  calculation?: string;
}

interface PlatformDetailProps {
  platformNumber: number;
  name: string;
  subtitle: string;
  annualBenefit: number;
  percentOfTotal: number;
  frictionPoints: FrictionPoint[];
  useCases?: UseCase[];
  kpis: KPI[];
  agents: Agent[];
  financialBreakdown: FinancialItem[];
  keyMetrics?: Record<string, string>;
  dataSources?: Array<{ source: string; provider: string; useCase: string; cost: number }>;
  winRateAttribution?: {
    totalImprovement: number;
    breakdown: Array<{ driver: string; points: number; attribution: number }>;
  };
  foundationResponsibilities?: string[];
  colorScheme: {
    primary: string;
    bg: string;
    border: string;
    text: string;
  };
}

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

export function PlatformDetail({
  platformNumber,
  name,
  subtitle,
  annualBenefit,
  percentOfTotal,
  frictionPoints,
  useCases,
  kpis,
  agents,
  financialBreakdown,
  keyMetrics,
  dataSources,
  winRateAttribution,
  foundationResponsibilities,
  colorScheme,
}: PlatformDetailProps) {
  const totalFrictionCost = frictionPoints.reduce((sum, fp) => sum + fp.cost, 0);
  const totalFinancialBenefit = financialBreakdown.reduce((sum, fb) => sum + fb.total, 0);

  return (
    <div className="space-y-8 pt-6">
      {/* Platform Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className={`${colorScheme.bg} ${colorScheme.border}`}>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Annual Benefit</div>
            <div className={`text-3xl font-bold ${colorScheme.text}`}>
              {formatCurrency(annualBenefit)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {formatPercent(percentOfTotal)} of total $111.9M
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Current Friction Cost</div>
            <div className="text-3xl font-bold text-destructive">
              {formatCurrency(totalFrictionCost)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Annual cost of current state issues
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success/10 border-success/20">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Net Value Created</div>
            <div className="text-3xl font-bold text-success">
              {formatCurrency(totalFinancialBenefit)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              From {financialBreakdown.length} use cases
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics (if available) */}
      {keyMetrics && Object.keys(keyMetrics).length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Key Metrics
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(keyMetrics).map(([key, value]) => (
                <Card key={key} className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="text-2xl font-bold mt-2">{value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Foundation Responsibilities (Platform 4) */}
      {foundationResponsibilities && foundationResponsibilities.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Foundation Layer Responsibilities
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {foundationResponsibilities.map((resp, idx) => (
                <Card key={idx} className={`${colorScheme.bg} ${colorScheme.border}`}>
                  <CardContent className="pt-4 flex items-start gap-3">
                    <CheckCircle2 className={`h-5 w-5 ${colorScheme.text} mt-0.5 flex-shrink-0`} />
                    <p className="text-sm">{resp}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Friction Points */}
      <Separator />
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Current State Friction Points
        </h4>
        <div className="space-y-3">
          {frictionPoints.map((friction, idx) => (
            <Card key={idx} className="bg-destructive/5 border-destructive/20">
              <CardContent className="pt-4">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge variant="destructive" className="mb-2">{friction.category}</Badge>
                    <p className="text-sm font-medium">{friction.issue}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">Impact:</span> {friction.businessImpact}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-destructive">{formatCurrency(friction.cost)}</div>
                    <div className="text-xs text-muted-foreground">Annual Cost</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-muted">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Total Friction Cost</div>
                <div className="text-xl font-bold text-destructive">{formatCurrency(totalFrictionCost)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Use Cases */}
      {useCases && useCases.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              AI Use Cases
            </h4>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {useCases.map((useCase, idx) => (
                <Card key={idx} className={`${colorScheme.bg} ${colorScheme.border}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        UC-{useCase.id}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{useCase.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    {useCase.primaryValue && (
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <ArrowRight className={`h-3 w-3 ${colorScheme.text}`} />
                        <span className={`font-medium ${colorScheme.text}`}>{useCase.primaryValue}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Win Rate Attribution (Platform 1) */}
      {winRateAttribution && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Win Rate Improvement Attribution (+{winRateAttribution.totalImprovement} points)
            </h4>
            <div className="space-y-3">
              {winRateAttribution.breakdown.map((item, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.driver}</p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <div className={`text-lg font-bold ${colorScheme.text}`}>+{item.points} pts</div>
                          <div className="text-xs text-muted-foreground">{formatPercent(item.attribution)} attribution</div>
                        </div>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colorScheme.text.replace('text-', 'bg-')}`}
                            style={{ width: `${item.attribution * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* AI Agents */}
      <Separator />
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Bot className="h-4 w-4" />
          AI Agents ({agents.length})
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          {agents.map((agent, idx) => (
            <Card key={idx} className={`${colorScheme.bg} ${colorScheme.border}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className={`h-4 w-4 ${colorScheme.text}`} />
                  {agent.name}
                </CardTitle>
                {agent.subtitle && (
                  <CardDescription className="text-xs">{agent.subtitle}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {agent.role && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Role</div>
                    <p className="text-sm">{agent.role}</p>
                  </div>
                )}
                {agent.responsibility && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Responsibility</div>
                    <p className="text-sm">{agent.responsibility}</p>
                  </div>
                )}
                {agent.trigger && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Trigger & Action</div>
                    <p className="text-sm">{agent.trigger}</p>
                  </div>
                )}
                {agent.technology && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Technology</div>
                    <p className="text-sm text-muted-foreground">{agent.technology}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Sources (Platform 0) */}
      {dataSources && dataSources.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Sources & APIs
            </h4>
            <div className="space-y-2">
              {dataSources.map((source, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium">{source.source}</div>
                        <div className="text-sm text-muted-foreground">{source.provider}</div>
                        <div className="text-xs text-muted-foreground mt-1">{source.useCase}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(source.cost)}/yr</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="bg-muted">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Total Data Investment</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(dataSources.reduce((sum, s) => sum + s.cost, 0))}/yr
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* KPIs */}
      <Separator />
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Target className="h-4 w-4" />
          Performance KPIs
        </h4>
        <div className="space-y-2">
          {kpis.map((kpi, idx) => (
            <Card key={idx}>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {kpi.useCase && (
                    <div>
                      <Badge variant="outline" className="text-xs">{kpi.useCase}</Badge>
                    </div>
                  )}
                  <div className={kpi.useCase ? "" : "md:col-span-2"}>
                    <div className="font-medium text-sm">{kpi.metric}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Baseline</div>
                    <div className="font-mono text-sm">{kpi.baseline}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Target</div>
                    <div className={`font-mono font-bold text-sm ${colorScheme.text}`}>{kpi.target}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">
                      {kpi.industryBenchmark ? "Industry" : "Improvement"}
                    </div>
                    <div className="font-mono text-muted-foreground text-sm">
                      {kpi.industryBenchmark || kpi.improvement || "—"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Financial Breakdown */}
      <Separator />
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Financial Impact by Use Case
        </h4>
        <div className="space-y-3">
          {financialBreakdown.map((item, idx) => (
            <Card key={idx}>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-3">
                  {/* Header row */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.id && <Badge variant="outline" className="text-xs">UC-{item.id}</Badge>}
                        <span className="font-medium">{item.useCase}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs">
                        {item.laborSavings && item.laborSavings > 0 && (
                          <span className="text-primary">
                            Labor: {formatCurrency(item.laborSavings)}
                          </span>
                        )}
                        {item.revenueGrowth && item.revenueGrowth > 0 && (
                          <span className="text-success">
                            Revenue: {formatCurrency(item.revenueGrowth)}
                          </span>
                        )}
                        {item.costReduction && item.costReduction > 0 && (
                          <span className="text-blue-600">
                            Cost Red: {formatCurrency(item.costReduction)}
                          </span>
                        )}
                        {item.riskMitigation && item.riskMitigation > 0 && (
                          <span className="text-warning">
                            Risk: {formatCurrency(item.riskMitigation)}
                          </span>
                        )}
                        {item.cashFlow && item.cashFlow > 0 && (
                          <span className="text-purple-600">
                            Cash: {formatCurrency(item.cashFlow)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${colorScheme.text}`}>{formatCurrency(item.total)}</div>
                      <div className="text-xs text-muted-foreground">Total Benefit</div>
                    </div>
                  </div>
                  
                  {/* Formula and Calculation */}
                  {item.formula && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">Formula</div>
                      <div className="font-mono text-sm text-slate-700 dark:text-slate-300 mb-2">
                        {item.formula}
                      </div>
                      {item.calculation && (
                        <>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5 mt-2">Calculation</div>
                          <div className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded inline-block">
                            {item.calculation} = <span className={`font-bold ${colorScheme.text}`}>{formatCurrency(item.total)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className={`${colorScheme.bg} ${colorScheme.border}`}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Platform {platformNumber} Total Benefit</div>
                <div className={`text-2xl font-bold ${colorScheme.text}`}>{formatCurrency(totalFinancialBenefit)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
