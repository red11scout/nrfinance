/**
 * tRPC routers for financial calculations and scenario management
 */

import { z } from "zod";
import { explainPlatform, explainConsolidated, explainCalculation, chatExplainer } from "./aiExplainer";
import { router, publicProcedure } from "./_core/trpc";
import {
  getUserScenarios,
  getScenarioById,
  createScenario,
  updateScenario,
  deleteScenario,
  getOrCreateBaselineScenario,
} from "./scenarioDb";
import {
  calculateFinancials,
  DEFAULT_INPUTS,
  type CalculationInputs,
} from "../shared/calculationEngine";

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

const CompanyBaselineSchema = z.object({
  annualRevenue: z.number().min(0),
  grossMargin: z.number().min(0).max(1),
  netMargin: z.number().min(0).max(1),
  annualProjects: z.number().int().min(0),
  annualBids: z.number().int().min(0),
  winRate: z.number().min(0).max(1),
  avgProjectValue: z.number().min(0),
  currentLeadsPerYear: z.number().int().min(0),
  currentCostPerLead: z.number().min(0),
});

const Platform0Schema = z.object({
  annualLeads: z.number().int().min(0),
  leadToMeetingConv: z.number().min(0).max(1),
  meetingToCloseRate: z.number().min(0).max(1),
  costPerLead: z.number().min(0),
  maintenancePlanAttachRate: z.number().min(0).max(1),
  salesCycleReductionDays: z.number().min(0),
  platformInvestment: z.number().min(0),
  annualDataCosts: z.number().min(0),
});

const Platform1Schema = z.object({
  winRateImprovement: z.number().min(0),
  bidEvaluationTimeBaseline: z.number().min(0),
  bidEvaluationTimeTarget: z.number().min(0),
  competitiveInsightsBaseline: z.number().int().min(0),
  competitiveInsightsTarget: z.number().int().min(0),
});

const Platform2Schema = z.object({
  proposalCreationTimeBaseline: z.number().min(0),
  proposalCreationTimeTarget: z.number().min(0),
  specReviewTimeBaseline: z.number().min(0),
  specReviewTimeTarget: z.number().min(0),
  estimateErrorRateBaseline: z.number().min(0).max(1),
  estimateErrorRateTarget: z.number().min(0).max(1),
  specQuoteMatchBaseline: z.number().min(0).max(1),
  specQuoteMatchTarget: z.number().min(0).max(1),
  technicalQATimeBaseline: z.number().min(0),
  technicalQATimeTarget: z.number().min(0),
});

const Platform3Schema = z.object({
  scheduleCreationTimeBaseline: z.number().min(0),
  scheduleCreationTimeTarget: z.number().min(0),
  projectDelayBaseline: z.number().min(0),
  projectDelayTarget: z.number().min(0),
  varianceDetectionBaseline: z.number().min(0),
  varianceDetectionTarget: z.number().min(0),
  closeoutTimeBaseline: z.number().min(0),
  closeoutTimeTarget: z.number().min(0),
  reportCreationTimeBaseline: z.number().min(0),
  reportCreationTimeTarget: z.number().min(0),
});

const Platform4Schema = z.object({
  submittalAssemblyTimeBaseline: z.number().min(0),
  submittalAssemblyTimeTarget: z.number().min(0),
  completenessRateBaseline: z.number().min(0).max(1),
  completenessRateTarget: z.number().min(0).max(1),
  mappingAccuracyBaseline: z.number().min(0).max(1),
  mappingAccuracyTarget: z.number().min(0).max(1),
});

const CalculationInputsSchema = z.object({
  companyBaseline: CompanyBaselineSchema,
  platform0: Platform0Schema,
  platform1: Platform1Schema,
  platform2: Platform2Schema,
  platform3: Platform3Schema,
  platform4: Platform4Schema,
});

// ============================================================================
// CALCULATION ROUTER
// ============================================================================

export const calculationRouter = router({
  /**
   * Calculate financial results from inputs
   */
  calculate: publicProcedure
    .input(CalculationInputsSchema)
    .mutation(async ({ input }) => {
      const results = calculateFinancials(input);
      return results;
    }),

  /**
   * Get default input values
   */
  getDefaults: publicProcedure.query(() => {
    return DEFAULT_INPUTS;
  }),
});

// ============================================================================
// SCENARIO ROUTER
// ============================================================================

export const scenarioRouter = router({
  /**
   * List all scenarios for the current user
   */
  list: publicProcedure.query(async ({ ctx }) => {
    // Return empty array if no user is logged in
    if (!ctx.user) return [];
    const scenarios = await getUserScenarios(ctx.user.id);
    return scenarios;
  }),

  /**
   * Get a specific scenario by ID
   */
  get: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const scenario = await getScenarioById(input.id, ctx.user.id);
      if (!scenario) {
        throw new Error("Scenario not found");
      }
      return scenario;
    }),

  /**
   * Get or create the baseline scenario
   */
  getBaseline: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Not authenticated");
    const baseline = await getOrCreateBaselineScenario(ctx.user.id);
    return baseline;
  }),

  /**
   * Create a new scenario
   */
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().nullable().optional(),
        inputs: CalculationInputsSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      // Calculate results
      const calculatedResults = calculateFinancials(input.inputs);

      // Create scenario
      const scenario = await createScenario(
        ctx.user.id,
        input.name,
        input.description || null,
        input.inputs,
        calculatedResults,
        false
      );

      return scenario;
    }),

  /**
   * Update an existing scenario
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.number().int(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().nullable().optional(),
        inputs: CalculationInputsSchema.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const updates: any = {};

      if (input.name !== undefined) {
        updates.name = input.name;
      }
      if (input.description !== undefined) {
        updates.description = input.description;
      }
      if (input.inputs) {
        updates.inputs = input.inputs;
        updates.calculatedResults = calculateFinancials(input.inputs);
      }

      const scenario = await updateScenario(input.id, ctx.user.id, updates);
      return scenario;
    }),

  /**
   * Delete a scenario
   */
  delete: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      await deleteScenario(input.id, ctx.user.id);
      return { success: true };
    }),

  /**
   * Duplicate a scenario
   */
  duplicate: publicProcedure
    .input(z.object({ id: z.number().int(), newName: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      // Get the original scenario
      const original = await getScenarioById(input.id, ctx.user.id);
      if (!original) {
        throw new Error("Scenario not found");
      }

      // Create a duplicate
      const duplicate = await createScenario(
        ctx.user.id,
        input.newName,
        original.description,
        original.inputs,
        original.calculatedResults,
        false
      );

      return duplicate;
    }),
});

// ============================================================================
// AI EXPLAINER ROUTER
// ============================================================================

export const aiRouter = router({
  /**
   * Explain a specific platform
   */
  explainPlatform: publicProcedure
    .input(z.object({
      platformName: z.string(),
      platformNumber: z.number().int().min(0).max(4),
      results: z.any(),
    }))
    .mutation(async ({ input }) => {
      const explanation = await explainPlatform(
        input.platformName,
        input.platformNumber,
        input.results
      );
      return { explanation };
    }),

  /**
   * Explain the consolidated total
   */
  explainConsolidated: publicProcedure
    .input(z.object({
      results: z.any(),
    }))
    .mutation(async ({ input }) => {
      const explanation = await explainConsolidated(input.results);
      return { explanation };
    }),

  /**
   * Explain a specific calculation
   */
  explainCalculation: publicProcedure
    .input(z.object({
      question: z.string(),
      results: z.any(),
      context: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const explanation = await explainCalculation(
        input.question,
        input.results,
        input.context
      );
      return { explanation };
    }),

  /**
   * Interactive chat
   */
  chat: publicProcedure
    .input(z.object({
      question: z.string(),
      results: z.any(),
      conversationHistory: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const response = await chatExplainer(
        input.question,
        input.results,
        input.conversationHistory
      );
      return { response };
    }),
});
