/**
 * Export utilities for generating PDF and Excel reports
 */

import jsPDF from "jspdf";
import * as XLSX from "xlsx";

interface ExportData {
  consolidated: {
    grandTotal: number;
    totalRevenue: number;
    totalCostReduction: number;
    totalRiskMitigation: number;
    totalCashFlow: number;
  };
  platforms: {
    name: string;
    benefit: number;
    percentOfTotal: number;
  }[];
  companyBaseline: {
    annualRevenue: number;
    grossMargin: number;
    annualProjects: number;
    avgProjectValue: number;
    winRate: number;
  };
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(0)}%`;
};

/**
 * Generate PDF report
 */
export function generatePDF(data: ExportData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235); // Blue
  doc.text("Nations Roof Financial Analysis", pageWidth / 2, yPos, { align: "center" });
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("AI Transformation Initiative - 5-Platform Analysis", pageWidth / 2, yPos, { align: "center" });
  yPos += 20;

  // Total Benefit
  doc.setFontSize(36);
  doc.setTextColor(34, 197, 94); // Green
  doc.text(formatCurrency(data.consolidated.grandTotal), pageWidth / 2, yPos, { align: "center" });
  yPos += 10;

  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("Total Annual Financial Benefit", pageWidth / 2, yPos, { align: "center" });
  yPos += 20;

  // Benefit Breakdown
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Financial Benefit Breakdown", 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  const benefits = [
    { label: "Revenue Growth", value: data.consolidated.totalRevenue, color: [34, 197, 94] },
    { label: "Cost Reduction", value: data.consolidated.totalCostReduction, color: [59, 130, 246] },
    { label: "Risk Mitigation", value: data.consolidated.totalRiskMitigation, color: [245, 158, 11] },
    { label: "Cash Flow Impact", value: data.consolidated.totalCashFlow, color: [168, 85, 247] },
  ];

  benefits.forEach((benefit) => {
    doc.setTextColor(0, 0, 0);
    doc.text(`${benefit.label}:`, 20, yPos);
    doc.setTextColor(benefit.color[0], benefit.color[1], benefit.color[2]);
    doc.text(formatCurrency(benefit.value), 80, yPos);
    const percent = ((benefit.value / data.consolidated.grandTotal) * 100).toFixed(0);
    doc.setTextColor(100, 100, 100);
    doc.text(`(${percent}%)`, 120, yPos);
    yPos += 8;
  });

  yPos += 10;

  // Platform Breakdown
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Platform Breakdown", 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  data.platforms.forEach((platform, index) => {
    doc.setTextColor(0, 0, 0);
    doc.text(`P${index}: ${platform.name}`, 20, yPos);
    doc.setTextColor(37, 99, 235);
    doc.text(formatCurrency(platform.benefit), 100, yPos);
    doc.setTextColor(100, 100, 100);
    doc.text(`(${formatPercent(platform.percentOfTotal)})`, 140, yPos);
    yPos += 8;
  });

  yPos += 10;

  // Company Baseline
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Company Baseline", 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  const baseline = [
    { label: "Annual Revenue", value: formatCurrency(data.companyBaseline.annualRevenue) },
    { label: "Gross Margin", value: formatPercent(data.companyBaseline.grossMargin) },
    { label: "Annual Projects", value: data.companyBaseline.annualProjects.toLocaleString() },
    { label: "Avg Project Value", value: formatCurrency(data.companyBaseline.avgProjectValue) },
    { label: "Win Rate", value: formatPercent(data.companyBaseline.winRate) },
  ];

  baseline.forEach((item) => {
    doc.setTextColor(0, 0, 0);
    doc.text(`${item.label}:`, 20, yPos);
    doc.setTextColor(37, 99, 235);
    doc.text(item.value, 80, yPos);
    yPos += 8;
  });

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: "center" });

  // Save
  doc.save("nations-roof-financial-analysis.pdf");
}

/**
 * Generate Excel report
 */
export function generateExcel(data: ExportData): void {
  const workbook = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ["Nations Roof Financial Analysis"],
    ["AI Transformation Initiative - 5-Platform Analysis"],
    [""],
    ["Total Annual Financial Benefit", formatCurrency(data.consolidated.grandTotal)],
    [""],
    ["Financial Benefit Breakdown"],
    ["Category", "Amount", "Percentage"],
    ["Revenue Growth", formatCurrency(data.consolidated.totalRevenue), formatPercent(data.consolidated.totalRevenue / data.consolidated.grandTotal)],
    ["Cost Reduction", formatCurrency(data.consolidated.totalCostReduction), formatPercent(data.consolidated.totalCostReduction / data.consolidated.grandTotal)],
    ["Risk Mitigation", formatCurrency(data.consolidated.totalRiskMitigation), formatPercent(data.consolidated.totalRiskMitigation / data.consolidated.grandTotal)],
    ["Cash Flow Impact", formatCurrency(data.consolidated.totalCashFlow), formatPercent(data.consolidated.totalCashFlow / data.consolidated.grandTotal)],
    [""],
    ["Platform Breakdown"],
    ["Platform", "Annual Benefit", "% of Total"],
    ...data.platforms.map((p, i) => [`P${i}: ${p.name}`, formatCurrency(p.benefit), formatPercent(p.percentOfTotal)]),
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Company Baseline Sheet
  const baselineData = [
    ["Company Baseline"],
    [""],
    ["Metric", "Value"],
    ["Annual Revenue", formatCurrency(data.companyBaseline.annualRevenue)],
    ["Gross Margin", formatPercent(data.companyBaseline.grossMargin)],
    ["Annual Projects", data.companyBaseline.annualProjects],
    ["Avg Project Value", formatCurrency(data.companyBaseline.avgProjectValue)],
    ["Win Rate", formatPercent(data.companyBaseline.winRate)],
  ];

  const baselineSheet = XLSX.utils.aoa_to_sheet(baselineData);
  XLSX.utils.book_append_sheet(workbook, baselineSheet, "Company Baseline");

  // Platform Details Sheet
  const platformData = [
    ["Platform Details"],
    [""],
    ["Platform", "Name", "Annual Benefit", "% of Total"],
    ...data.platforms.map((p, i) => [`P${i}`, p.name, p.benefit, p.percentOfTotal]),
  ];

  const platformSheet = XLSX.utils.aoa_to_sheet(platformData);
  XLSX.utils.book_append_sheet(workbook, platformSheet, "Platform Details");

  // Save
  XLSX.writeFile(workbook, "nations-roof-financial-analysis.xlsx");
}
