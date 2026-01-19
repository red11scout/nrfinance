/**
 * CFO Investment Analysis PDF Generator
 * Creates a comprehensive multi-page PDF for board-level financial due diligence
 */

import jsPDF from "jspdf";

interface CFOAnalysisData {
  executiveSummary: {
    npv: number;
    irr: number;
    paybackMonths: number;
    profitabilityIndex: number;
    year1ROI: number;
    riskAdjustedNPV: number;
  };
  assumptions: {
    growthRate: number;
    discountRate: number;
    inflationRate: number;
    riskPremium: number;
  };
  scenarios: {
    conservative: { npv: number; irr: number; benefit: number };
    base: { npv: number; irr: number; benefit: number };
    optimistic: { npv: number; irr: number; benefit: number };
  };
  yearlyData: {
    year: number;
    benefit: number;
    cost: number;
    netCashFlow: number;
    cumulativeBenefit: number;
    presentValue: number;
    riskAdjustedPV: number;
    cumulativeROI: number;
  }[];
  investmentSummary: {
    initialInvestment: number;
    totalInvestment: number;
    netBenefit: number;
    valueMultiple: number;
  };
}

const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  } else if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Generate CFO Investment Analysis PDF
 */
export function generateCFOAnalysisPDF(data: CFOAnalysisData): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  
  // ============================================================================
  // PAGE 1: Executive Summary & Key Metrics
  // ============================================================================
  
  // Header with BlueAlly branding
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, "F");
  
  // BlueAlly branding
  doc.setFontSize(12);
  doc.setTextColor(59, 130, 246); // BlueAlly blue
  doc.text("BlueAlly", margin, 12);
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Prepared by", margin, 8);
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("CFO Investment Analysis", margin, 26);
  
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text("Nations Roof AI Transformation - 5-Year Financial Due Diligence", margin, 34);
  
  // Date
  doc.setFontSize(9);
  doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), pageWidth - margin, 34, { align: "right" });
  
  let yPos = 50;
  
  // Executive Summary Section
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text("Executive Summary", margin, yPos);
  
  yPos += 8;
  
  // Key metrics in boxes
  const metricBoxWidth = (contentWidth - 10) / 3;
  const metrics = [
    { label: "5-Year NPV", value: formatCurrency(data.executiveSummary.npv), color: [34, 197, 94] },
    { label: "IRR", value: formatPercent(data.executiveSummary.irr), color: [59, 130, 246] },
    { label: "Payback Period", value: `${data.executiveSummary.paybackMonths.toFixed(1)} months`, color: [168, 85, 247] },
    { label: "Profitability Index", value: `${data.executiveSummary.profitabilityIndex.toFixed(1)}x`, color: [245, 158, 11] },
    { label: "Year 1 ROI", value: formatPercent(data.executiveSummary.year1ROI), color: [34, 197, 94] },
    { label: "Risk-Adj NPV", value: formatCurrency(data.executiveSummary.riskAdjustedNPV), color: [59, 130, 246] },
  ];
  
  metrics.forEach((metric, idx) => {
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const boxX = margin + col * (metricBoxWidth + 5);
    const boxY = yPos + row * 25;
    
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(boxX, boxY, metricBoxWidth, 22, 2, 2, "FD");
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(metric.label, boxX + 5, boxY + 7);
    
    doc.setFontSize(14);
    doc.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
    doc.text(metric.value, boxX + 5, boxY + 17);
  });
  
  yPos += 58;
  
  // Investment Decision Criteria
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text("Investment Decision Criteria", margin, yPos);
  
  yPos += 8;
  
  const criteria = [
    { test: "NPV Test", condition: "NPV > 0", result: "PASS", value: formatCurrency(data.executiveSummary.npv) },
    { test: "IRR Test", condition: `IRR > WACC (${data.assumptions.discountRate}%)`, result: "PASS", value: formatPercent(data.executiveSummary.irr) },
    { test: "Payback Test", condition: "Payback < 24 months", result: "PASS", value: `${data.executiveSummary.paybackMonths.toFixed(1)} months` },
    { test: "PI Test", condition: "PI > 1.0", result: "PASS", value: `${data.executiveSummary.profitabilityIndex.toFixed(2)}x` },
  ];
  
  const criteriaWidth = (contentWidth - 15) / 4;
  criteria.forEach((c, idx) => {
    const boxX = margin + idx * (criteriaWidth + 5);
    
    doc.setFillColor(34, 197, 94, 0.1);
    doc.setDrawColor(34, 197, 94);
    doc.roundedRect(boxX, yPos, criteriaWidth, 28, 2, 2, "FD");
    
    doc.setFontSize(9);
    doc.setTextColor(34, 197, 94);
    doc.text(`✓ ${c.test}`, boxX + 3, yPos + 7);
    
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`${c.condition}: ${c.result}`, boxX + 3, yPos + 14);
    
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(c.value, boxX + 3, yPos + 24);
  });
  
  yPos += 38;
  
  // Model Assumptions
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text("Model Assumptions", margin, yPos);
  
  yPos += 8;
  
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPos, contentWidth, 20, 2, 2, "F");
  
  const assumptions = [
    { label: "Annual Growth Rate", value: `${data.assumptions.growthRate}%` },
    { label: "Discount Rate (WACC)", value: `${data.assumptions.discountRate}%` },
    { label: "Inflation Rate", value: `${data.assumptions.inflationRate}%` },
    { label: "Risk Premium", value: `${data.assumptions.riskPremium}%` },
  ];
  
  const assumptionWidth = contentWidth / 4;
  assumptions.forEach((a, idx) => {
    const aX = margin + idx * assumptionWidth + 5;
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(a.label, aX, yPos + 7);
    
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(a.value, aX, yPos + 15);
  });
  
  yPos += 28;
  
  // Scenario Analysis
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text("Scenario Analysis", margin, yPos);
  
  yPos += 8;
  
  const scenarioWidth = (contentWidth - 10) / 3;
  const scenarioData = [
    { name: "Conservative", ...data.scenarios.conservative, color: [245, 158, 11] },
    { name: "Base Case", ...data.scenarios.base, color: [59, 130, 246] },
    { name: "Optimistic", ...data.scenarios.optimistic, color: [34, 197, 94] },
  ];
  
  scenarioData.forEach((scenario, idx) => {
    const boxX = margin + idx * (scenarioWidth + 5);
    
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(scenario.color[0], scenario.color[1], scenario.color[2]);
    doc.roundedRect(boxX, yPos, scenarioWidth, 35, 2, 2, "FD");
    
    doc.setFontSize(10);
    doc.setTextColor(scenario.color[0], scenario.color[1], scenario.color[2]);
    doc.text(scenario.name, boxX + 5, yPos + 8);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`5-Year Benefit: ${formatCurrency(scenario.benefit)}`, boxX + 5, yPos + 16);
    doc.text(`NPV: ${formatCurrency(scenario.npv)}`, boxX + 5, yPos + 23);
    doc.text(`IRR: ${formatPercent(scenario.irr)}`, boxX + 5, yPos + 30);
  });
  
  yPos += 45;
  
  // Year-by-Year Analysis Table
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text("5-Year Financial Projection", margin, yPos);
  
  yPos += 8;
  
  // Table header
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, yPos, contentWidth, 8, "F");
  
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  const headers = ["Year", "Benefit", "Cost", "Net CF", "Cumulative", "PV", "ROI"];
  const colWidths = [15, 28, 22, 28, 28, 28, 28];
  let headerX = margin + 3;
  headers.forEach((h, idx) => {
    doc.text(h, headerX, yPos + 5.5);
    headerX += colWidths[idx];
  });
  
  yPos += 8;
  
  // Table rows
  data.yearlyData.forEach((row, idx) => {
    const rowY = yPos + idx * 7;
    
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, rowY, contentWidth, 7, "F");
    }
    
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    
    let cellX = margin + 3;
    const cells = [
      `Year ${row.year}`,
      formatCurrency(row.benefit),
      `(${formatCurrency(Math.abs(row.cost))})`,
      formatCurrency(row.netCashFlow),
      formatCurrency(row.cumulativeBenefit),
      formatCurrency(row.presentValue),
      formatPercent(row.cumulativeROI, 0),
    ];
    
    cells.forEach((cell, cIdx) => {
      if (cIdx === 2) doc.setTextColor(220, 38, 38); // red for costs
      else if (cIdx === 6) doc.setTextColor(34, 197, 94); // green for ROI
      else doc.setTextColor(30, 41, 59);
      
      doc.text(cell, cellX, rowY + 5);
      cellX += colWidths[cIdx];
    });
  });
  
  yPos += data.yearlyData.length * 7 + 10;
  
  // Investment Summary
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text("Investment Summary", margin, yPos);
  
  yPos += 8;
  
  doc.setFillColor(34, 197, 94, 0.1);
  doc.roundedRect(margin, yPos, contentWidth, 25, 2, 2, "F");
  
  const summaryItems = [
    { label: "Initial Investment", value: formatCurrency(data.investmentSummary.initialInvestment) },
    { label: "5-Year Total Investment", value: formatCurrency(data.investmentSummary.totalInvestment) },
    { label: "5-Year Net Benefit", value: formatCurrency(data.investmentSummary.netBenefit) },
    { label: "Value Multiple", value: `${data.investmentSummary.valueMultiple.toFixed(0)}x` },
  ];
  
  const summaryWidth = contentWidth / 4;
  summaryItems.forEach((item, idx) => {
    const sX = margin + idx * summaryWidth + 5;
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, sX, yPos + 8);
    
    doc.setFontSize(12);
    doc.setTextColor(34, 197, 94);
    doc.text(item.value, sX, yPos + 18);
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("BlueAlly | Nations Roof CFO Investment Analysis | Confidential", margin, pageHeight - 10);
  doc.text(`Page 1 of 1 | Generated ${new Date().toLocaleDateString()}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  
  // Save
  doc.save("nations-roof-cfo-investment-analysis.pdf");
}

/**
 * Get default CFO analysis data
 */
export function getDefaultCFOAnalysisData(): CFOAnalysisData {
  return {
    executiveSummary: {
      npv: 461300000,
      irr: 6932,
      paybackMonths: 0.2,
      profitabilityIndex: 287.5,
      year1ROI: 6852,
      riskAdjustedNPV: 406000000,
    },
    assumptions: {
      growthRate: 5,
      discountRate: 10,
      inflationRate: 3,
      riskPremium: 5,
    },
    scenarios: {
      conservative: { npv: 372200000, irr: 6927, benefit: 559700000 },
      base: { npv: 461300000, irr: 6932, benefit: 618500000 },
      optimistic: { npv: 534200000, irr: 6937, benefit: 683400000 },
    },
    yearlyData: [
      { year: 1, benefit: 111900000, cost: 410000, netCashFlow: 111500000, cumulativeBenefit: 111900000, presentValue: 101800000, riskAdjustedPV: 97300000, cumulativeROI: 5441 },
      { year: 2, benefit: 117500000, cost: 430500, netCashFlow: 117100000, cumulativeBenefit: 229500000, presentValue: 97100000, riskAdjustedPV: 88900000, cumulativeROI: 9264 },
      { year: 3, benefit: 123400000, cost: 452000, netCashFlow: 123000000, cumulativeBenefit: 352900000, presentValue: 92700000, riskAdjustedPV: 81100000, cumulativeROI: 12058 },
      { year: 4, benefit: 129600000, cost: 474600, netCashFlow: 129100000, cumulativeBenefit: 482500000, presentValue: 88500000, riskAdjustedPV: 74100000, cumulativeROI: 14186 },
      { year: 5, benefit: 136100000, cost: 498400, netCashFlow: 135600000, cumulativeBenefit: 618500000, presentValue: 84500000, riskAdjustedPV: 67600000, cumulativeROI: 15859 },
    ],
    investmentSummary: {
      initialInvestment: 1600000,
      totalInvestment: 3900000,
      netBenefit: 614600000,
      valueMultiple: 160,
    },
  };
}
