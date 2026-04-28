// asset_generation handler — Skeleton.
// Impl in SLC-103 (Content Asset Production). Calls bedrockAdapter,
// reads brand_profile snapshot, writes asset_version + ai_cost_ledger.

import type { AiJob } from "../types";

export async function handleAssetGeneration(job: AiJob): Promise<void> {
  void job;
  throw new Error(
    "handleAssetGeneration not implemented (SLC-103 Asset Production)"
  );
}
