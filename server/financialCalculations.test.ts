import { describe, expect, it } from "vitest";
import { calculateFinancials, DEFAULT_INPUTS } from "../shared/calculationEngine";

describe("Financial Calculations - Document Accuracy Tests", () => {
  describe("Company Baseline", () => {
    it("should use correct baseline values from document", () => {
      expect(DEFAULT_INPUTS.companyBaseline.annualRevenue).toBe(527000000);
      expect(DEFAULT_INPUTS.companyBaseline.grossMargin).toBe(0.35);
      expect(DEFAULT_INPUTS.companyBaseline.netMargin).toBe(0.07);
      expect(DEFAULT_INPUTS.companyBaseline.annualProjects).toBe(2100);
      expect(DEFAULT_INPUTS.companyBaseline.annualBids).toBe(11700);
      expect(DEFAULT_INPUTS.companyBaseline.winRate).toBe(0.22);
      expect(DEFAULT_INPUTS.companyBaseline.avgProjectValue).toBe(250000);
    });
  });

  describe("Platform 0: Market Expansion - Document Accuracy", () => {
    it("should calculate Platform 0 total benefit as exactly $35.0M per document", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      const platform0Total = results.platform0.total;
      
      // Should be exactly $35M as per source document
      expect(platform0Total).toBe(35000000);
    });

    it("should calculate correct qualified meetings from leads", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      
      // 10,000 leads * 12% conversion = 1,200 meetings
      expect(results.platform0.qualifiedMeetings).toBe(1200);
    });

    it("should calculate correct new projects from meetings", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      
      // 1,200 meetings * 20% close rate = 240 projects
      expect(results.platform0.newProjects).toBe(240);
    });
  });

  describe("Platform 1: Sales Intelligence - Document Accuracy", () => {
    it("should calculate Platform 1 total benefit as exactly $24.2M per document", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      const platform1Total = results.platform1.total;
      
      // Should be $24.195M as per source document (rounds to $24.2M)
      expect(platform1Total).toBe(24195000);
    });

    it("should calculate correct win rate improvement", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      
      // Win rate should improve from 22% to 33% (11 percentage points)
      expect(results.platform1.newWinRate).toBeCloseTo(0.33, 2);
    });

    it("should calculate additional wins correctly", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      
      // Additional wins calculation from formula
      expect(results.platform1.additionalWins).toBeGreaterThan(700);
      expect(results.platform1.additionalWins).toBeLessThan(1500);
    });
  });

  describe("Platform 2: Estimation Suite - Document Accuracy", () => {
    it("should calculate Platform 2 total benefit as exactly $23.2M per document", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      const platform2Total = results.platform2.total;
      
      // Should be $23.21M as per source document
      expect(platform2Total).toBe(23210000);
    });
  });

  describe("Platform 3: Project Management - Document Accuracy", () => {
    it("should calculate Platform 3 total benefit as exactly $21.6M per document", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      const platform3Total = results.platform3.total;
      
      // Should be $21.63M as per source document (rounds to $21.6M)
      expect(platform3Total).toBe(21630000);
    });
  });

  describe("Platform 4: Knowledge Management - Document Accuracy", () => {
    it("should calculate Platform 4 total benefit as exactly $7.9M per document", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      const platform4Total = results.platform4.total;
      
      // Should be $7.9M as per source document
      expect(platform4Total).toBe(7900000);
    });
  });

  describe("Consolidated Totals - Document Accuracy", () => {
    it("should calculate grand total as exactly $111.9M per document", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      const grandTotal = results.consolidated.grandTotal;
      
      // Should be exactly $111.935M as per source document (rounds to $111.9M)
      expect(grandTotal).toBe(111935000);
    });

    it("should sum all platform benefits to grand total", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      
      const sum = 
        results.platform0.total +
        results.platform1.total +
        results.platform2.total +
        results.platform3.total +
        results.platform4.total;
      
      // Sum should equal grand total
      expect(sum).toBe(results.consolidated.grandTotal);
    });

    it("should have all platforms contribute positive benefit", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      
      // All platforms should have positive total benefit
      expect(results.platform0.total).toBeGreaterThan(0);
      expect(results.platform1.total).toBeGreaterThan(0);
      expect(results.platform2.total).toBeGreaterThan(0);
      expect(results.platform3.total).toBeGreaterThan(0);
      expect(results.platform4.total).toBeGreaterThan(0);
    });
  });

  describe("Deterministic Behavior", () => {
    it("should produce identical results for identical inputs", () => {
      const results1 = calculateFinancials(DEFAULT_INPUTS);
      const results2 = calculateFinancials(DEFAULT_INPUTS);
      
      expect(results1.consolidated.grandTotal).toBe(results2.consolidated.grandTotal);
      expect(results1.platform0.total).toBe(results2.platform0.total);
      expect(results1.platform1.total).toBe(results2.platform1.total);
      expect(results1.platform2.total).toBe(results2.platform2.total);
      expect(results1.platform3.total).toBe(results2.platform3.total);
      expect(results1.platform4.total).toBe(results2.platform4.total);
    });
  });

  describe("ROI Calculations", () => {
    it("should calculate positive ROI for Platform 0", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      
      // Platform 0 has ROI calculation
      expect(results.platform0.roi).toBeGreaterThan(0);
      expect(results.platform0.paybackMonths).toBeGreaterThan(0);
      expect(results.platform0.paybackMonths).toBeLessThan(24);
    });
  });

  describe("Post-Transformation Metrics", () => {
    it("should calculate increased annual revenue", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      
      // Post-transformation revenue should be higher than baseline
      expect(results.consolidated.postTransformRevenue).toBeGreaterThan(DEFAULT_INPUTS.companyBaseline.annualRevenue);
    });

    it("should calculate improved net margin", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      
      // Post-transformation net margin should be higher than baseline
      expect(results.consolidated.postTransformNetMargin).toBeGreaterThan(DEFAULT_INPUTS.companyBaseline.netMargin);
    });

    it("should calculate increased project volume", () => {
      const results = calculateFinancials(DEFAULT_INPUTS);
      
      // Post-transformation projects should be higher than baseline
      expect(results.consolidated.postTransformProjects).toBeGreaterThan(DEFAULT_INPUTS.companyBaseline.annualProjects);
    });
  });
});
