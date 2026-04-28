// Firecrawl-Self-Hosted-Adapter (DEC-028).
// Skeleton — Implementation in SLC-105 (Lead Research).
// Pre-Condition: BL-028 Firecrawl-Self-Host-Setup auf Hetzner.

import { trackCost } from "../shared/cost-tracker";
import { writeAuditLog } from "../shared/audit-logger";
import type { FirecrawlCrawlRequest, FirecrawlCrawlResult } from "./types";

const BASE_URL =
  process.env.FIRECRAWL_API_BASE_URL ?? "http://firecrawl-internal:3002";
const API_KEY = process.env.FIRECRAWL_API_KEY ?? "";

export async function crawlSegment(
  req: FirecrawlCrawlRequest
): Promise<FirecrawlCrawlResult> {
  void BASE_URL;
  void API_KEY;
  void trackCost;
  void writeAuditLog;
  void req;
  throw new Error(
    "firecrawlAdapter.crawlSegment() not implemented (SLC-105 Lead Research). " +
      "Pre-Condition: BL-028 Firecrawl-Self-Host-Setup"
  );
}

export const firecrawlAdapter = { crawlSegment };
