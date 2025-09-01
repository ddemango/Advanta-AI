// Price per 1M tokens in CREDITS (1 credit ~ 1 small token by default)
export type PriceRow = { in: number; out: number };

export const PRICES: Record<string, PriceRow> = {
  // OpenAI - the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
  "gpt-5": { in: 750_000, out: 2_250_000 }, // Premium pricing for latest model
  "gpt-4o": { in: 500_000, out: 1_500_000 },
  "gpt-4o-mini": { in: 5_000, out: 15_000 },
  "gpt-4": { in: 600_000, out: 1_800_000 },
  "gpt-3.5-turbo": { in: 50_000, out: 150_000 },
  
  // Anthropic (approximate pricing)
  "claude-3-5-sonnet-latest": { in: 300_000, out: 1_000_000 },
  
  // Google
  "gemini-1.5-pro": { in: 350_000, out: 1_050_000 },
};

export function priceFor(model: string): PriceRow {
  return PRICES[model] || PRICES["gpt-4o-mini"];
}

export function estimateCredits(model: string, inTok: number, outTok: number): number {
  const p = priceFor(model);
  // Linear proration - calculate cost per million tokens
  return Math.ceil((inTok * p.in + outTok * p.out) / 1_000_000);
}

// Helper to get token counts for billing
export function getTokenCount(text: string): number {
  // Simple approximation: ~4 chars per token
  // In production, use proper tokenization library
  return Math.ceil(text.length / 4);
}

// Plan-based credit limits
export const PLAN_LIMITS = {
  free: {
    dailyCredits: 1000,
    maxAgentRuns: 2,
    maxStepsPerRun: 3
  },
  pro: {
    dailyCredits: 50000,
    maxAgentRuns: 20,
    maxStepsPerRun: 10
  },
  enterprise: {
    dailyCredits: 500000,
    maxAgentRuns: 100,
    maxStepsPerRun: 50
  }
} as const;

export function getPlanLimits(plan: keyof typeof PLAN_LIMITS) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}