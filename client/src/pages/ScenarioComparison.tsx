import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, GitCompare, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "wouter";

export default function ScenarioComparison() {
  const [scenario1Id, setScenario1Id] = useState<number | null>(null);
  const [scenario2Id, setScenario2Id] = useState<number | null>(null);

  const { data: scenarios } = trpc.scenario.list.useQuery();

  const scenario1 = scenarios?.find(s => s.id === scenario1Id);
  const scenario2 = scenarios?.find(s => s.id === scenario2Id);

  const calculateMutation1 = trpc.calculation.calculate.useMutation();
  const calculateMutation2 = trpc.calculation.calculate.useMutation();

  const handleCompare = () => {
    if (scenario1?.inputs && scenario2?.inputs) {
      calculateMutation1.mutate(scenario1.inputs as any);
      calculateMutation2.mutate(scenario2.inputs as any);
    }
  };

  const results1 = calculateMutation1.data;
  const results2 = calculateMutation2.data;

  if (!scenarios || scenarios.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scenario Comparison</h1>
              <p className="text-gray-600">Compare different scenarios side-by-side</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>No Scenarios Available</CardTitle>
              <CardDescription>You need at least 2 saved scenarios to use the comparison feature</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/scenario-builder">Go to Scenario Builder</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scenario Comparison</h1>
            <p className="text-gray-600">Compare two scenarios side-by-side</p>
          </div>
        </div>

        {/* Scenario Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Select Scenarios to Compare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Scenario 1</label>
                <Select onValueChange={(value) => setScenario1Id(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id.toString()}>
                        {scenario.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Scenario 2</label>
                <Select onValueChange={(value) => setScenario2Id(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id.toString()}>
                        {scenario.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={handleCompare} 
                  disabled={!scenario1Id || !scenario2Id || calculateMutation1.isPending || calculateMutation2.isPending}
                  className="w-full"
                >
                  Compare Scenarios
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {results1 && results2 && (
          <>
            {/* Summary Comparison */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Total Annual Benefit Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">{scenario1?.name}</div>
                    <div className="text-3xl font-bold text-blue-700">
                      ${(results1.consolidated.grandTotal / 1000000).toFixed(1)}M
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      {results2.consolidated.grandTotal > results1.consolidated.grandTotal ? (
                        <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-2" />
                      ) : (
                        <TrendingDown className="h-12 w-12 text-red-600 mx-auto mb-2" />
                      )}
                      <div className="text-2xl font-bold">
                        {((Math.abs(results2.consolidated.grandTotal - results1.consolidated.grandTotal) / results1.consolidated.grandTotal) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Difference</div>
                    </div>
                  </div>

                  <div className="p-6 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">{scenario2?.name}</div>
                    <div className="text-3xl font-bold text-purple-700">
                      ${(results2.consolidated.grandTotal / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform-by-Platform Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Platform-by-Platform Comparison</CardTitle>
                <CardDescription>Detailed breakdown of financial impact by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Platform</th>
                        <th className="text-right p-3 font-semibold">{scenario1?.name}</th>
                        <th className="text-right p-3 font-semibold">{scenario2?.name}</th>
                        <th className="text-right p-3 font-semibold">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">Platform 0: Market Expansion</td>
                        <td className="text-right p-3">${(results1.platform0.total / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3">${(results2.platform0.total / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3 font-semibold">
                          <span className={results2.platform0.total > results1.platform0.total ? "text-green-700" : "text-red-700"}>
                            ${((results2.platform0.total - results1.platform0.total) / 1000000).toFixed(1)}M
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">Platform 1: Sales Intelligence</td>
                        <td className="text-right p-3">${(results1.platform1.total / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3">${(results2.platform1.total / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3 font-semibold">
                          <span className={results2.platform1.total > results1.platform1.total ? "text-green-700" : "text-red-700"}>
                            ${((results2.platform1.total - results1.platform1.total) / 1000000).toFixed(1)}M
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">Platform 2: Estimation Suite</td>
                        <td className="text-right p-3">${(results1.platform2.total / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3">${(results2.platform2.total / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3 font-semibold">
                          <span className={results2.platform2.total > results1.platform2.total ? "text-green-700" : "text-red-700"}>
                            ${((results2.platform2.total - results1.platform2.total) / 1000000).toFixed(1)}M
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">Platform 3: Project Management</td>
                        <td className="text-right p-3">${(results1.platform3.total / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3">${(results2.platform3.total / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3 font-semibold">
                          <span className={results2.platform3.total > results1.platform3.total ? "text-green-700" : "text-red-700"}>
                            ${((results2.platform3.total - results1.platform3.total) / 1000000).toFixed(1)}M
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">Platform 4: Knowledge Management</td>
                        <td className="text-right p-3">${(results1.platform4.total / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3">${(results2.platform4.total / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3 font-semibold">
                          <span className={results2.platform4.total > results1.platform4.total ? "text-green-700" : "text-red-700"}>
                            ${((results2.platform4.total - results1.platform4.total) / 1000000).toFixed(1)}M
                          </span>
                        </td>
                      </tr>
                      <tr className="font-bold bg-gray-100">
                        <td className="p-3">Total</td>
                        <td className="text-right p-3">${(results1.consolidated.grandTotal / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3">${(results2.consolidated.grandTotal / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-3">
                          <span className={results2.consolidated.grandTotal > results1.consolidated.grandTotal ? "text-green-700" : "text-red-700"}>
                            ${((results2.consolidated.grandTotal - results1.consolidated.grandTotal) / 1000000).toFixed(1)}M
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
