// business_status_pull handler — Skeleton.
// Impl in SLC-108 (Lead Handoff). Cron-getriggert taeglich 07:00,
// pulled GET /api/export/deals?pipeline=Lead-Generierung&since=...
// und aktualisiert handoff_event.status.

import type { AiJob } from "../types";

export async function handleBusinessStatusPull(job: AiJob): Promise<void> {
  void job;
  throw new Error(
    "handleBusinessStatusPull not implemented (SLC-108 Lead Handoff)"
  );
}
