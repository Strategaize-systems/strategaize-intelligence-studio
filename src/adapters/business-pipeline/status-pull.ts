// Cron-Pull-Logic (V1): GET /api/export/deals?pipeline=Lead-Generierung&since=...
// Skeleton — Impl in SLC-108. ARCHITECTURE A.5.3 + A.8.

import type { BusinessDealStatus } from "./types";

export interface StatusPullRequest {
  pipelineName: string;
  since: string; // ISO timestamp
}

export interface StatusPullResult {
  updates: BusinessDealStatus[];
  pulledUntil: string;
}

export async function pullPipelineStatus(
  req: StatusPullRequest
): Promise<StatusPullResult> {
  void req;
  throw new Error(
    "businessPipelineAdapter.pullPipelineStatus() not implemented (SLC-108)"
  );
}
