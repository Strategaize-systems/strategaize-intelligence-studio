// lead_research_run handler — Skeleton.
// Impl in SLC-105 (Lead Research). Calls firecrawlAdapter mit
// segment.filter_definition, schreibt research_run + lead-Eintraege.

import type { AiJob } from "../types";

export async function handleLeadResearchRun(job: AiJob): Promise<void> {
  void job;
  throw new Error(
    "handleLeadResearchRun not implemented (SLC-105 Lead Research). " +
      "Pre-Condition: BL-028 Firecrawl-Self-Host-Setup"
  );
}
