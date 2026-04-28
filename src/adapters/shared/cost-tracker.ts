// Zentrale ai_cost_ledger-Schreibung pro kostenrelevantem Call (DEC-009).
// Self-Hosted Provider (Firecrawl V1) tragen cost_usd=0, notes='self_hosted'.

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export interface CostEntry {
  jobId?: string | null;
  provider: string; // 'bedrock' | 'firecrawl' | 'business_pipeline' | ...
  region?: string;
  modelId?: string;
  operation: string; // 'invoke_model' | 'crawl' | 'pipeline_push' | ...
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
  costEur?: number;
  notes?: string;
}

export async function trackCost(entry: CostEntry): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("ai_cost_ledger").insert({
      job_id: entry.jobId ?? null,
      provider: entry.provider,
      region: entry.region ?? "eu-central-1",
      model_id: entry.modelId ?? null,
      operation: entry.operation,
      input_tokens: entry.inputTokens ?? null,
      output_tokens: entry.outputTokens ?? null,
      cost_usd: entry.costUsd ?? 0,
      cost_eur: entry.costEur ?? 0,
      notes: entry.notes ?? null,
    });
    if (error) {
      logger.warn("ai_cost_ledger insert failed", {
        source: "cost-tracker",
        error: error.message,
      });
    }
  } catch (e) {
    logger.warn("ai_cost_ledger write threw", {
      source: "cost-tracker",
      error: (e as Error).message,
    });
  }
}
