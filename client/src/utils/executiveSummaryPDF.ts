/**
 * Executive Summary PDF Generator
 * Creates a one-page board presentation-ready PDF
 */

import jsPDF from "jspdf";

interface ExecutiveSummaryData {
  totalBenefit: number;
  paybackMonths: number;
  roi: number;
  platforms: {
    name: string;
    benefit: number;
    highlight: string;
  }[];
  keyMetrics: {
    revenueGrowth: number;
    costReduction: number;
    riskMitigation: number;
    cashFlowImprovement: number;
  };
  investment: {
    platformCost: number;
    annualDataCost: number;
    implementationCost: number;
    totalInvestment: number;
  };
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

/**
 * Generate Executive Summary PDF for board presentation
 */
export function generateExecutiveSummaryPDF(data: ExecutiveSummaryData): void {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  
  // Background gradient effect (simulated with rectangles)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 50, "F");
  
  // BlueAlly branding - Add "BlueAlly" text logo
  doc.setFontSize(16);
  doc.setTextColor(59, 130, 246); // BlueAlly blue
  doc.text("BlueAlly", margin, 15);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Prepared by", margin, 10);
  
  // Header
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("Nations Roof AI Transformation", margin, 32);
  
  doc.setFontSize(14);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Executive Summary - Board Presentation", margin, 42);
  
  // Date
  doc.setFontSize(10);
  doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), pageWidth - margin, 42, { align: "right" });
  
  // Hero Section - Total Benefit
  let yPos = 60;
  
  // Large benefit box
  doc.setFillColor(34, 197, 94); // green-500
  doc.roundedRect(margin, yPos, 80, 45, 3, 3, "F");
  
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255);
  doc.text(formatCurrency(data.totalBenefit), margin + 40, yPos + 22, { align: "center" });
  
  doc.setFontSize(11);
  doc.text("Total Annual Benefit", margin + 40, yPos + 35, { align: "center" });
  
  // ROI and Payback boxes
  const boxWidth = 55;
  const boxStartX = margin + 90;
  
  // ROI Box
  doc.setFillColor(59, 130, 246); // blue-500
  doc.roundedRect(boxStartX, yPos, boxWidth, 20, 2, 2, "F");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.roi.toLocaleString()}%`, boxStartX + boxWidth/2, yPos + 12, { align: "center" });
  doc.setFontSize(9);
  doc.text("ROI", boxStartX + boxWidth/2, yPos + 18, { align: "center" });
  
  // Payback Box
  doc.setFillColor(168, 85, 247); // purple-500
  doc.roundedRect(boxStartX + boxWidth + 5, yPos, boxWidth, 20, 2, 2, "F");
  doc.setFontSize(20);
  doc.text(`<${data.paybackMonths}mo`, boxStartX + boxWidth + 5 + boxWidth/2, yPos + 12, { align: "center" });
  doc.setFontSize(9);
  doc.text("Payback", boxStartX + boxWidth + 5 + boxWidth/2, yPos + 18, { align: "center" });
  
  // Investment Box
  doc.setFillColor(245, 158, 11); // amber-500
  doc.roundedRect(boxStartX, yPos + 25, boxWidth * 2 + 5, 20, 2, 2, "F");
  doc.setFontSize(16);
  doc.text(`${formatCurrency(data.investment.totalInvestment)} Investment`, boxStartX + (boxWidth * 2 + 5)/2, yPos + 37, { align: "center" });
  doc.setFontSize(9);
  doc.text("Year 1 Total", boxStartX + (boxWidth * 2 + 5)/2, yPos + 43, { align: "center" });
  
  // Top 3 Platforms Section
  const platformStartX = pageWidth/2 + 10;
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text("Top Platform Recommendations", platformStartX, yPos);
  
  yPos += 8;
  
  // Top 3 platforms
  const topPlatforms = [...data.platforms]
    .sort((a, b) => b.benefit - a.benefit)
    .slice(0, 3);
  
  const platformColors = [
    [34, 197, 94],   // green
    [59, 130, 246],  // blue
    [168, 85, 247],  // purple
  ];
  
  topPlatforms.forEach((platform, idx) => {
    const platformY = yPos + (idx * 25);
    
    // Rank badge
    doc.setFillColor(platformColors[idx][0], platformColors[idx][1], platformColors[idx][2]);
    doc.circle(platformStartX + 5, platformY + 8, 5, "F");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`${idx + 1}`, platformStartX + 5, platformY + 10, { align: "center" });
    
    // Platform info
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(platform.name, platformStartX + 15, platformY + 6);
    
    doc.setFontSize(14);
    doc.setTextColor(platformColors[idx][0], platformColors[idx][1], platformColors[idx][2]);
    doc.text(formatCurrency(platform.benefit), platformStartX + 15, platformY + 14);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(platform.highlight, platformStartX + 50, platformY + 14);
  });
  
  // Financial Impact Breakdown
  yPos = 115;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 35, 3, 3, "F");
  
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text("Financial Impact Breakdown", margin + 5, yPos + 8);
  
  const impactMetrics = [
    { label: "Revenue Growth", value: data.keyMetrics.revenueGrowth, color: [34, 197, 94] },
    { label: "Cost Reduction", value: data.keyMetrics.costReduction, color: [59, 130, 246] },
    { label: "Risk Mitigation", value: data.keyMetrics.riskMitigation, color: [245, 158, 11] },
    { label: "Cash Flow", value: data.keyMetrics.cashFlowImprovement, color: [168, 85, 247] },
  ];
  
  const metricWidth = (pageWidth - margin * 2 - 10) / 4;
  impactMetrics.forEach((metric, idx) => {
    const metricX = margin + 5 + (idx * metricWidth);
    
    doc.setFontSize(18);
    doc.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
    doc.text(formatCurrency(metric.value), metricX, yPos + 22);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(metric.label, metricX, yPos + 30);
  });
  
  // All 5 Platforms Summary
  yPos = 158;
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text("5-Platform AI Transformation Suite", margin, yPos);
  
  yPos += 8;
  const platformWidth = (pageWidth - margin * 2 - 20) / 5;
  
  data.platforms.forEach((platform, idx) => {
    const platX = margin + (idx * (platformWidth + 5));
    
    // Platform box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(platX, yPos, platformWidth, 30, 2, 2, "FD");
    
    // Platform number
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`P${idx}`, platX + 3, yPos + 6);
    
    // Platform name (truncated if needed)
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const shortName = platform.name.length > 15 ? platform.name.substring(0, 14) + "..." : platform.name;
    doc.text(shortName, platX + 3, yPos + 14);
    
    // Benefit
    doc.setFontSize(12);
    doc.setTextColor(34, 197, 94);
    doc.text(formatCurrency(platform.benefit), platX + 3, yPos + 24);
  });
  
  // Footer
  yPos = pageHeight - 12;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("BlueAlly | Nations Roof AI Transformation Financial Analysis | Confidential", margin, yPos);
  doc.text(`Page 1 of 1 | Generated ${new Date().toLocaleDateString()}`, pageWidth - margin, yPos, { align: "right" });
  
  // Save
  doc.save("nations-roof-executive-summary.pdf");
}

/**
 * Get default executive summary data from calculation results
 */
export function getDefaultExecutiveSummaryData(): ExecutiveSummaryData {
  return {
    totalBenefit: 111900000,
    paybackMonths: 4,
    roi: 2138,
    platforms: [
      { name: "Market Expansion", benefit: 35000000, highlight: "New lead generation" },
      { name: "Sales Intelligence", benefit: 24200000, highlight: "+11pt win rate" },
      { name: "Estimation Suite", benefit: 23200000, highlight: "Proposal automation" },
      { name: "Project Management", benefit: 21600000, highlight: "Delivery optimization" },
      { name: "Knowledge Management", benefit: 7900000, highlight: "Submittal automation" },
    ],
    keyMetrics: {
      revenueGrowth: 59200000,
      costReduction: 31500000,
      riskMitigation: 14200000,
      cashFlowImprovement: 7000000,
    },
    investment: {
      platformCost: 3500000,
      annualDataCost: 1500000,
      implementationCost: 500000,
      totalInvestment: 5500000,
    },
  };
}
