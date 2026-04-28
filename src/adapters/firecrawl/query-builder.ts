// Segment-Filter -> Firecrawl-Query Mapping. Skeleton — Impl in SLC-105.

import type { FirecrawlQuery } from "./types";

export interface SegmentFilterDefinition {
  industries?: string[];
  countries?: string[];
  companySizeBands?: string[];
  triggerSignals?: string[];
  pagesLimit?: number;
}

export function buildFirecrawlQuery(
  filterDef: SegmentFilterDefinition
): FirecrawlQuery {
  void filterDef;
  throw new Error(
    "firecrawlAdapter.buildFirecrawlQuery() not implemented (SLC-105 Lead Research)"
  );
}
