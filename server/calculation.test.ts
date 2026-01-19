import { describe, expect, it } from "vitest";
import { calculateFinancials, DEFAULT_INPUTS } from "../shared/calculationEngine";

describe("Financial Calculations", () => {
  it("should calculate baseline scenario correctly", () => {
    const results = calculateFinancials(DEFAULT_INPUTS);
    
    console.log("Results:", JSON.stringify(results, null, 2));
    
    // Platform 0 should have significant benefits
    expect(results.platform0.total).toBeGreaterThan(0);
    
    // Consolidated total should be around $111.9M
    expect(results.consolidated.grandTotal).toBeGreaterThan(100000000);
    expect(results.consolidated.grandTotal).toBeLessThan(120000000);
  });

  it("should have correct platform totals", () => {
    const results = calculateFinancials(DEFAULT_INPUTS);
    
    // Check each platform has reasonable values
    expect(results.platform0.total).toBeGreaterThan(30000000); // ~$35M
    expect(results.platform1.total).toBeGreaterThan(20000000); // ~$24M
    expect(results.platform2.total).toBeGreaterThan(20000000); // ~$23M
    expect(results.platform3.total).toBeGreaterThan(15000000); // ~$21M
    expect(results.platform4.total).toBeGreaterThan(5000000);  // ~$7M
  });
});
