/**
 * Database helper functions for scenario management
 */

import { eq, and, desc } from "drizzle-orm";
import { scenarios, type Scenario, type InsertScenario } from "../drizzle/schema";
import { getDb } from "./db";
import type { CalculationInputs, CalculationResults } from "../shared/calculationEngine";

export interface ScenarioData {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  isBaseline: boolean;
  inputs: CalculationInputs;
  calculatedResults: CalculationResults | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Convert database scenario to ScenarioData
 */
function dbToScenarioData(dbScenario: Scenario): ScenarioData {
  return {
    id: dbScenario.id,
    userId: dbScenario.userId,
    name: dbScenario.name,
    description: dbScenario.description,
    isBaseline: dbScenario.isBaseline === 1,
    inputs: {
      companyBaseline: JSON.parse(dbScenario.companyBaseline),
      platform0: JSON.parse(dbScenario.platform0),
      platform1: JSON.parse(dbScenario.platform1),
      platform2: JSON.parse(dbScenario.platform2),
      platform3: JSON.parse(dbScenario.platform3),
      platform4: JSON.parse(dbScenario.platform4),
    },
    calculatedResults: dbScenario.calculatedResults 
      ? JSON.parse(dbScenario.calculatedResults) 
      : null,
    createdAt: dbScenario.createdAt,
    updatedAt: dbScenario.updatedAt,
  };
}

/**
 * Get all scenarios for a user
 */
export async function getUserScenarios(userId: number): Promise<ScenarioData[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const results = await db
    .select()
    .from(scenarios)
    .where(eq(scenarios.userId, userId))
    .orderBy(desc(scenarios.updatedAt));

  return results.map(dbToScenarioData);
}

/**
 * Get a specific scenario by ID
 */
export async function getScenarioById(scenarioId: number, userId: number): Promise<ScenarioData | null> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const results = await db
    .select()
    .from(scenarios)
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.userId, userId)))
    .limit(1);

  return results.length > 0 ? dbToScenarioData(results[0]) : null;
}

/**
 * Create a new scenario
 */
export async function createScenario(
  userId: number,
  name: string,
  description: string | null,
  inputs: CalculationInputs,
  calculatedResults: CalculationResults | null = null,
  isBaseline: boolean = false
): Promise<ScenarioData> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const insertData: InsertScenario = {
    userId,
    name,
    description,
    isBaseline: isBaseline ? 1 : 0,
    companyBaseline: JSON.stringify(inputs.companyBaseline),
    platform0: JSON.stringify(inputs.platform0),
    platform1: JSON.stringify(inputs.platform1),
    platform2: JSON.stringify(inputs.platform2),
    platform3: JSON.stringify(inputs.platform3),
    platform4: JSON.stringify(inputs.platform4),
    calculatedResults: calculatedResults ? JSON.stringify(calculatedResults) : null,
  };

  const result = await db.insert(scenarios).values(insertData);
  const insertId = Number(result[0].insertId);

  const created = await getScenarioById(insertId, userId);
  if (!created) {
    throw new Error("Failed to retrieve created scenario");
  }

  return created;
}

/**
 * Update an existing scenario
 */
export async function updateScenario(
  scenarioId: number,
  userId: number,
  updates: {
    name?: string;
    description?: string | null;
    inputs?: CalculationInputs;
    calculatedResults?: CalculationResults | null;
    isBaseline?: boolean;
  }
): Promise<ScenarioData> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const updateData: Partial<InsertScenario> = {};

  if (updates.name !== undefined) {
    updateData.name = updates.name;
  }
  if (updates.description !== undefined) {
    updateData.description = updates.description;
  }
  if (updates.isBaseline !== undefined) {
    updateData.isBaseline = updates.isBaseline ? 1 : 0;
  }
  if (updates.inputs) {
    updateData.companyBaseline = JSON.stringify(updates.inputs.companyBaseline);
    updateData.platform0 = JSON.stringify(updates.inputs.platform0);
    updateData.platform1 = JSON.stringify(updates.inputs.platform1);
    updateData.platform2 = JSON.stringify(updates.inputs.platform2);
    updateData.platform3 = JSON.stringify(updates.inputs.platform3);
    updateData.platform4 = JSON.stringify(updates.inputs.platform4);
  }
  if (updates.calculatedResults !== undefined) {
    updateData.calculatedResults = updates.calculatedResults 
      ? JSON.stringify(updates.calculatedResults) 
      : null;
  }

  await db
    .update(scenarios)
    .set(updateData)
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.userId, userId)));

  const updated = await getScenarioById(scenarioId, userId);
  if (!updated) {
    throw new Error("Failed to retrieve updated scenario");
  }

  return updated;
}

/**
 * Delete a scenario
 */
export async function deleteScenario(scenarioId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .delete(scenarios)
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.userId, userId)));

  return true;
}

/**
 * Get the baseline scenario for a user (or create if doesn't exist)
 */
export async function getOrCreateBaselineScenario(userId: number): Promise<ScenarioData> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Try to find existing baseline
  const results = await db
    .select()
    .from(scenarios)
    .where(and(eq(scenarios.userId, userId), eq(scenarios.isBaseline, 1)))
    .limit(1);

  if (results.length > 0) {
    return dbToScenarioData(results[0]);
  }

  // Create baseline scenario with default values
  const { DEFAULT_INPUTS } = await import("../shared/calculationEngine");
  
  return createScenario(
    userId,
    "Baseline Scenario",
    "Default Nations Roof financial projections based on the source document",
    DEFAULT_INPUTS,
    null,
    true
  );
}
