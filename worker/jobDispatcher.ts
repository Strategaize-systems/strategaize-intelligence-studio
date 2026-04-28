// Job-Dispatcher: Switch-Case fuer alle ai_job_type-Werte.
// V1: 4 V1-Handler + 3 V6-Handler-Stubs (FEATURE_KNOWLEDGE_BACKBONE_ENABLED=false).

import type { AiJob, JobHandler } from "./types";
import { handleAssetGeneration } from "./handlers/assetGeneration";
import { handlePitchGeneration } from "./handlers/pitchGeneration";
import { handleLeadResearchRun } from "./handlers/leadResearchRun";
import { handleBusinessStatusPull } from "./handlers/businessStatusPull";

const HANDLERS: Record<AiJob["job_type"], JobHandler> = {
  // V1 Marketing Launcher
  asset_generation: handleAssetGeneration,
  pitch_generation: handlePitchGeneration,
  lead_research_run: handleLeadResearchRun,
  business_status_pull: handleBusinessStatusPull,

  // V6 Knowledge Backbone — Stubs (FEATURE_KNOWLEDGE_BACKBONE_ENABLED=false)
  ingest_onboarding: async (job) => {
    throw new Error(
      `ingest_onboarding not enabled in V1 (FEATURE_KNOWLEDGE_BACKBONE_ENABLED=false). job=${job.id}`
    );
  },
  ingest_business: async (job) => {
    throw new Error(
      `ingest_business not enabled in V1 (FEATURE_KNOWLEDGE_BACKBONE_ENABLED=false). job=${job.id}`
    );
  },
  opportunity_scoring: async (job) => {
    throw new Error(
      `opportunity_scoring not enabled in V1 (FEATURE_KNOWLEDGE_BACKBONE_ENABLED=false). job=${job.id}`
    );
  },
};

export async function dispatchJob(job: AiJob): Promise<void> {
  const handler = HANDLERS[job.job_type];
  if (!handler) {
    throw new Error(`No handler registered for job_type=${job.job_type}`);
  }
  await handler(job);
}

export function listRegisteredHandlers(): string[] {
  return Object.keys(HANDLERS);
}
