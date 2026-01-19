/**
 * HyperFormula Calculation Engine Tests
 * 
 * These tests verify that all calculations match the source document exactly.
 * The source document is: Nations Roof 5-Platform AI Transformation Initiative
 * Executive Report (December 2025)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  NationsRoofCalculationEngine,
  calculateFinancials,
  DEFAULT_INPUTS,
  formatMillions,
  formatCurrency,
  formatPercentage,
} from '../shared/hyperformulaEngine';

describe('NationsRoofCalculationEngine', () => {
  let engine: NationsRoofCalculationEngine;

  beforeEach(() => {
    engine = new NationsRoofCalculationEngine();
  });

  afterEach(() => {
    engine.destroy();
  });

  describe('Company Baseline Values', () => {
    it('should have correct annual revenue', () => {
      const results = engine.getResults();
      // Document page 3: Annual Revenue $527,000,000
      expect(engine.getCellValue(2)).toBe(527000000);
    });

    it('should have correct gross margin', () => {
      // Document page 3: Gross Margin 35%
      expect(engine.getCellValue(3)).toBe(0.35);
    });

    it('should have correct net margin', () => {
      // Document page 3: Net Margin 7%
      expect(engine.getCellValue(4)).toBe(0.07);
    });

    it('should have correct annual projects', () => {
      // Document page 3: Annual Projects ~2,100
      expect(engine.getCellValue(5)).toBe(2100);
    });

    it('should have correct annual bids', () => {
      // Document page 3: Annual Bids Submitted 11,700
      expect(engine.getCellValue(6)).toBe(11700);
    });

    it('should have correct win rate', () => {
      // Document page 3: Current Win Rate 22%
      expect(engine.getCellValue(7)).toBe(0.22);
    });

    it('should have correct average project value', () => {
      // Document page 3: Average Project Value $250,000
      expect(engine.getCellValue(8)).toBe(250000);
    });
  });

  describe('Platform 0: AI Market Expansion Engine', () => {
    it('should calculate qualified meetings correctly', () => {
      const results = engine.getResults();
      // Document page 7: 10,000 leads × 12% = 1,200 qualified meetings
      expect(results.platform0.qualifiedMeetings).toBe(1200);
    });

    it('should calculate new projects correctly', () => {
      const results = engine.getResults();
      // Document page 7: 1,200 meetings × 20% = 240 new projects
      expect(results.platform0.newProjects).toBe(240);
    });

    it('should calculate gross revenue correctly', () => {
      const results = engine.getResults();
      // Document page 7: 240 projects × $250,000 = $60,000,000
      expect(results.platform0.grossRevenue).toBe(60000000);
    });

    it('should have correct total benefit', () => {
      const results = engine.getResults();
      // Document page 7: Platform 0 Total = $35,000,000
      expect(results.platform0.total).toBe(35000000);
    });

    it('should have correct revenue breakdown', () => {
      const results = engine.getResults();
      // Document page 7: Revenue Growth $30M + Maintenance $1.5M = $31.5M
      expect(results.platform0.revenueGrowth).toBe(31500000);
    });

    it('should have correct cost savings', () => {
      const results = engine.getResults();
      // Document page 7: Cost Savings $2,300,000
      expect(results.platform0.costReduction).toBe(2300000);
    });

    it('should have correct cash flow impact', () => {
      const results = engine.getResults();
      // Document page 7: Cash Flow Impact $700,000
      expect(results.platform0.cashFlow).toBe(700000);
    });

    it('should have correct risk reduction', () => {
      const results = engine.getResults();
      // Document page 7: Risk Reduction $500,000
      expect(results.platform0.riskMitigation).toBe(500000);
    });
  });

  describe('Platform 1: AI Sales Intelligence', () => {
    it('should calculate new win rate correctly', () => {
      const results = engine.getResults();
      // Document page 9: 22% + 11 pts = 33%
      expect(results.platform1.newWinRate).toBe(0.33);
    });

    it('should calculate additional wins correctly', () => {
      const results = engine.getResults();
      // Document page 9: 11,700 bids × 11% = 1,287 additional wins
      expect(results.platform1.additionalWins).toBe(1287);
    });

    it('should have correct total benefit', () => {
      const results = engine.getResults();
      // Document page 9: Platform 1 Total = $24,195,000
      expect(results.platform1.total).toBe(24195000);
    });

    it('should have correct labor savings', () => {
      const results = engine.getResults();
      // Document page 9: Total Labor = $260K + $280K + $312K = $852,000
      expect(results.platform1.costReduction).toBe(852000);
    });

    it('should have correct revenue growth', () => {
      const results = engine.getResults();
      // Document page 9: Total Revenue = $14,025K + $7,012.5K + $2,305.5K = $23,343,000
      expect(results.platform1.revenueGrowth).toBe(23343000);
    });

    it('should have correct bid assignment total', () => {
      const results = engine.getResults();
      // Document page 9: Bid Assignment = $260K + $14,025K = $14,285,000
      expect(results.platform1.bidAssignmentTotal).toBe(14285000);
    });

    it('should have correct competitor analysis total', () => {
      const results = engine.getResults();
      // Document page 9: Competitor Analysis = $280K + $7,012.5K = $7,292,500
      expect(results.platform1.competitorAnalysisTotal).toBe(7292500);
    });

    it('should have correct competitor scouting total', () => {
      const results = engine.getResults();
      // Document page 9: Competitor Scouting = $312K + $2,305.5K = $2,617,500
      expect(results.platform1.competitorScoutingTotal).toBe(2617500);
    });
  });

  describe('Platform 2: AI Estimation Suite', () => {
    it('should have correct total benefit', () => {
      const results = engine.getResults();
      // Document page 12: Platform 2 Total = $23,210,000
      expect(results.platform2.total).toBe(23210000);
    });

    it('should have correct labor savings', () => {
      const results = engine.getResults();
      // Document page 12: Total Labor = $3,717,000
      expect(results.platform2.costReduction).toBe(3717000);
    });

    it('should have correct revenue growth', () => {
      const results = engine.getResults();
      // Document page 12: Total Revenue = $14,753,000
      expect(results.platform2.revenueGrowth).toBe(14753000);
    });

    it('should have correct risk mitigation', () => {
      const results = engine.getResults();
      // Document page 12: Total Risk = $3,940,000
      expect(results.platform2.riskMitigation).toBe(3940000);
    });

    it('should have correct cash flow', () => {
      const results = engine.getResults();
      // Document page 12: Total Cash = $800,000
      expect(results.platform2.cashFlow).toBe(800000);
    });

    it('should have correct proposal creation total', () => {
      const results = engine.getResults();
      // Document page 12: Proposal Creation = $1,336K + $4,585K + $800K = $6,721,000
      expect(results.platform2.proposalCreationTotal).toBe(6721000);
    });

    it('should have correct spec reviews total', () => {
      const results = engine.getResults();
      // Document page 12: Spec Reviews = $660K + $3,780K + $700K = $5,140,000
      expect(results.platform2.specReviewsTotal).toBe(5140000);
    });

    it('should have correct edge reviews total', () => {
      const results = engine.getResults();
      // Document page 12: Edge Reviews = $308K + $4,095K = $4,403,000
      expect(results.platform2.edgeReviewsTotal).toBe(4403000);
    });

    it('should have correct quote comparison total', () => {
      const results = engine.getResults();
      // Document page 12: Quote Comparison = $330K + $3,240K = $3,570,000
      expect(results.platform2.quoteComparisonTotal).toBe(3570000);
    });

    it('should have correct proposal evaluation total', () => {
      const results = engine.getResults();
      // Document page 12: Proposal Evaluation = $225K + $1,838K = $2,063,000
      expect(results.platform2.proposalEvaluationTotal).toBe(2063000);
    });

    it('should have correct technical questions total', () => {
      const results = engine.getResults();
      // Document page 12: Technical Questions = $858K + $455K = $1,313,000
      expect(results.platform2.technicalQuestionsTotal).toBe(1313000);
    });
  });

  describe('Platform 3: AI Project Management', () => {
    it('should have correct total benefit', () => {
      const results = engine.getResults();
      // Document page 14: Platform 3 Total = $21,585,000
      expect(results.platform3.total).toBe(21585000);
    });

    it('should have correct schedule generation total', () => {
      const results = engine.getResults();
      // Document page 14: Schedule Gen = $94K + $9,450K = $9,544,000
      expect(results.platform3.scheduleGenerationTotal).toBe(9544000);
    });

    it('should have correct BU analysis total', () => {
      const results = engine.getResults();
      // Document page 14: BU Analysis = $107K + $2,025K + $735K = $2,867,000
      expect(results.platform3.buAnalysisTotal).toBe(2867000);
    });

    it('should have correct RFI response total', () => {
      const results = engine.getResults();
      // Document page 14: RFI Response = $284K + $1,563K = $1,847,000
      expect(results.platform3.rfiResponseTotal).toBe(1847000);
    });

    it('should have correct closeout docs total', () => {
      const results = engine.getResults();
      // Document page 14: Closeout = $202K + $150K + $445K = $797,000
      expect(results.platform3.closeoutDocsTotal).toBe(797000);
    });

    it('should have correct daily reports total', () => {
      const results = engine.getResults();
      // Document page 14: Daily Reports = $580,000
      expect(results.platform3.dailyReportsTotal).toBe(580000);
    });

    it('should have correct pre-con packets total', () => {
      const results = engine.getResults();
      // Document page 14: Pre-Con = $700K + $2,000K + $750K = $3,450,000
      expect(results.platform3.preConPacketsTotal).toBe(3450000);
    });
  });

  describe('Platform 4: AI Knowledge Management', () => {
    it('should have correct total benefit', () => {
      const results = engine.getResults();
      // Document page 15: Platform 4 Total = $7,900,000
      expect(results.platform4.total).toBe(7900000);
    });

    it('should have correct submittal assembly total', () => {
      const results = engine.getResults();
      // Document page 15: Submittal = $3,250K + $3,250K = $6,500,000
      expect(results.platform4.submittalAssemblyTotal).toBe(6500000);
    });

    it('should have correct spec mapping total', () => {
      const results = engine.getResults();
      // Document page 15: Spec Mapping = $720K + $680K = $1,400,000
      expect(results.platform4.specMappingTotal).toBe(1400000);
    });

    it('should have correct labor savings', () => {
      const results = engine.getResults();
      // Document page 15: Total Labor = $3,970,000
      expect(results.platform4.costReduction).toBe(3970000);
    });

    it('should have correct revenue growth', () => {
      const results = engine.getResults();
      // Document page 15: Total Revenue = $3,930,000
      expect(results.platform4.revenueGrowth).toBe(3930000);
    });
  });

  describe('Consolidated Summary', () => {
    it('should have correct grand total', () => {
      const results = engine.getResults();
      // Document page 17: Total Annual Benefit = $111.9M (rounded)
      // The exact sum is $111,890,000 but document shows $111.9M
      expect(results.consolidated.grandTotal).toBe(111900000);
    });

    it('should have correct total revenue growth', () => {
      const results = engine.getResults();
      // Document page 17: Total Revenue = $76,200,000
      // Calculated: $31.5M + $23.3M + $14.8M + $2.7M + $3.9M = $76.2M
      expect(results.consolidated.totalRevenue).toBeCloseTo(76200000, -4);
    });

    it('should have correct total cost reduction', () => {
      const results = engine.getResults();
      // Document page 17: Total Cost Reduction = $28,600,000
      expect(results.consolidated.totalCostReduction).toBeCloseTo(28600000, -4);
    });

    it('should have correct total risk mitigation', () => {
      const results = engine.getResults();
      // Document page 17: Total Risk = $4,400,000
      expect(results.consolidated.totalRiskMitigation).toBeCloseTo(4400000, -4);
    });

    it('should have correct total cash flow', () => {
      const results = engine.getResults();
      // Document page 17: Total Cash = $2,700,000
      expect(results.consolidated.totalCashFlow).toBeCloseTo(2700000, -4);
    });

    it('should have correct post-transform revenue', () => {
      const results = engine.getResults();
      // Document page 17: Post-Transform Revenue = $603,000,000
      expect(results.consolidated.postTransformRevenue).toBeCloseTo(603000000, -5);
    });

    it('should have correct post-transform win rate', () => {
      const results = engine.getResults();
      // Document page 17: Post-Transform Win Rate = 33%
      expect(results.consolidated.postTransformWinRate).toBe(0.33);
    });

    it('should have correct post-transform net income', () => {
      const results = engine.getResults();
      // Document page 17: Post-Transform Net Income = $147,500,000
      expect(results.consolidated.postTransformNetIncome).toBeCloseTo(147500000, -5);
    });
  });

  describe('Determinism Tests', () => {
    it('should produce identical results on multiple calculations', () => {
      const results1 = engine.getResults();
      const results2 = engine.getResults();
      const results3 = engine.getResults();

      expect(results1.consolidated.grandTotal).toBe(results2.consolidated.grandTotal);
      expect(results2.consolidated.grandTotal).toBe(results3.consolidated.grandTotal);
    });

    it('should produce identical results across multiple engine instances', () => {
      const engine1 = new NationsRoofCalculationEngine();
      const engine2 = new NationsRoofCalculationEngine();
      const engine3 = new NationsRoofCalculationEngine();

      const results1 = engine1.getResults();
      const results2 = engine2.getResults();
      const results3 = engine3.getResults();

      expect(results1.consolidated.grandTotal).toBe(results2.consolidated.grandTotal);
      expect(results2.consolidated.grandTotal).toBe(results3.consolidated.grandTotal);

      engine1.destroy();
      engine2.destroy();
      engine3.destroy();
    });

    it('should produce same results with calculateFinancials function', () => {
      const results1 = calculateFinancials();
      const results2 = calculateFinancials();

      expect(results1.consolidated.grandTotal).toBe(results2.consolidated.grandTotal);
      expect(results1.platform0.total).toBe(results2.platform0.total);
      expect(results1.platform1.total).toBe(results2.platform1.total);
    });
  });

  describe('Scenario Modification Tests', () => {
    it('should update calculations when baseline is modified', () => {
      const originalResults = engine.getResults();
      
      // Increase annual leads by 50%
      engine.updatePlatform0({ annualLeads: 15000 });
      
      const newResults = engine.getResults();
      
      // Qualified meetings should increase proportionally
      expect(newResults.platform0.qualifiedMeetings).toBe(1800); // 15000 × 0.12
      expect(newResults.platform0.newProjects).toBe(360); // 1800 × 0.20
    });

    it('should maintain formula relationships after updates', () => {
      engine.updatePlatform0({ leadToMeetingConv: 0.15 }); // Increase from 12% to 15%
      
      const results = engine.getResults();
      
      // Should recalculate: 10000 × 0.15 = 1500 meetings
      expect(results.platform0.qualifiedMeetings).toBe(1500);
      // 1500 × 0.20 = 300 projects
      expect(results.platform0.newProjects).toBe(300);
    });
  });
});

describe('Formatting Functions', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1234567)).toBe('$1,234,567');
    expect(formatCurrency(1234567.89, 2)).toBe('$1,234,567.89');
  });

  it('should format millions correctly', () => {
    expect(formatMillions(35000000)).toBe('$35.0M');
    expect(formatMillions(24195000)).toBe('$24.2M');
    expect(formatMillions(111890000)).toBe('$111.9M');
  });

  it('should format percentages correctly', () => {
    expect(formatPercentage(0.22)).toBe('22.0%');
    expect(formatPercentage(0.33)).toBe('33.0%');
    expect(formatPercentage(0.35, 0)).toBe('35%');
  });
});
