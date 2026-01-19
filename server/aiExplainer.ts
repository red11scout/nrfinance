/**
 * AI Explainer Service
 * 
 * Provides clear, step-by-step explanations of financial calculations
 * using the built-in LLM in Ernest Hemingway style.
 */

import { invokeLLM } from "./_core/llm";
import type { CalculationResults } from "../shared/calculationEngine";

const SYSTEM_PROMPT = `You are a financial analyst explaining the Nations Roof AI transformation initiative to the CEO and CFO.

CRITICAL FACTS (memorize these):
- Total ANNUAL benefit: $111.9M per year (NOT over five years - this is ANNUAL)
- Platform 0 (Market Expansion): $35.0M annual benefit
- Platform 1 (Sales Intelligence): $24.2M annual benefit
- Platform 2 (Estimation Suite): $23.2M annual benefit
- Platform 3 (Project Management): $21.6M annual benefit
- Platform 4 (Knowledge Management): $7.9M annual benefit
- Total Investment: $5.2M (one-time)
- Payback Period: Less than 4 months
- Year 1 ROI: 2,100%+
- Nations Roof current revenue: $527M annually

BENEFIT BREAKDOWN (annual):
- Revenue Growth: $74.8M (67% of total)
- Cost Reduction: $28.5M (25% of total)
- Risk Mitigation: $4.4M (4% of total)
- Cash Flow Impact: $2.7M (2% of total)

Your style is Ernest Hemingway: clear, direct, factual. No fluff. No jargon. Short sentences. Simple words. Facts matter.

Rules:
- ALWAYS say "annual benefit" or "per year" - never imply it's a multi-year total
- Use millions (M) for large numbers: $35.0M, not $35,000,000
- Show formulas clearly: Revenue = Projects × Value
- Be precise with numbers - use the exact figures above
- Connect individual benefits to the $111.9M ANNUAL total
- Be polite but direct
- No marketing speak
- Facts only

When explaining:
- Start with what the number represents
- Show the calculation
- Explain the business impact
- Connect to the bigger picture`;

/**
 * Generate explanation for a specific platform
 */
export async function explainPlatform(
  platformName: string,
  platformNumber: number,
  results: CalculationResults
): Promise<string> {
  const platformKey = `platform${platformNumber}` as keyof CalculationResults;
  const platformResults = results[platformKey];

  if (!platformResults || typeof platformResults !== 'object') {
    throw new Error(`Invalid platform number: ${platformNumber}`);
  }

  const userPrompt = `Explain Platform ${platformNumber}: ${platformName}.

Current calculations:
${JSON.stringify(platformResults, null, 2)}

Consolidated totals:
${JSON.stringify(results.consolidated, null, 2)}

Provide a clear, step-by-step explanation of:
1. What this platform does
2. How the ANNUAL financial benefit is calculated
3. Why each component matters
4. How it contributes to the $111.9M ANNUAL total

IMPORTANT: The $111.9M is an ANNUAL benefit, not a multi-year total.

Keep it under 300 words. Be direct. Show the math.`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (typeof content === 'string') {
    return content;
  }
  return "Unable to generate explanation.";
}

/**
 * Generate explanation for the consolidated total
 */
export async function explainConsolidated(results: CalculationResults): Promise<string> {
  const userPrompt = `Explain the consolidated ANNUAL total of $111.9M.

All platform results:
${JSON.stringify(results, null, 2)}

Provide a clear explanation of:
1. How the five platforms work together
2. How each platform contributes to the ANNUAL total
3. The breakdown by benefit type (revenue, cost reduction, risk, cash flow)
4. Why this matters for Nations Roof

CRITICAL: The $111.9M is an ANNUAL benefit. Each year Nations Roof will realize this benefit. Over 5 years, that's approximately $560M in total value.

Keep it under 400 words. Be direct. Show how it all connects.`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (typeof content === 'string') {
    return content;
  }
  return "Unable to generate explanation.";
}

/**
 * Generate explanation for a specific calculation or metric
 */
export async function explainCalculation(
  question: string,
  results: CalculationResults,
  context?: string
): Promise<string> {
  const userPrompt = `Question: ${question}

${context ? `Context: ${context}\n\n` : ''}Current calculations:
${JSON.stringify(results, null, 2)}

CRITICAL REMINDER: The $111.9M is an ANNUAL benefit (per year), not a multi-year total.

Provide a clear, direct answer. Show the math. Explain why it matters. Keep it under 200 words.`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (typeof content === 'string') {
    return content;
  }
  return "Unable to generate explanation.";
}

/**
 * Interactive chat for custom questions
 */
export async function chatExplainer(
  question: string,
  results: CalculationResults,
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // Add conversation history if provided
  if (conversationHistory && conversationHistory.length > 0) {
    messages.push(...conversationHistory);
  }

  // Add context about current calculations
  const contextMessage = `Current financial calculations (all values are ANNUAL):
${JSON.stringify(results, null, 2)}

REMINDER: All benefits are ANNUAL (per year). The $111.9M total is realized each year.

User question: ${question}`;

  messages.push({ role: "user", content: contextMessage });

  const response = await invokeLLM({
    messages,
  });

  const content = response.choices[0]?.message?.content;
  if (typeof content === 'string') {
    return content;
  }
  return "Unable to generate response.";
}
