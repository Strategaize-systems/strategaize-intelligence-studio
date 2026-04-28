// Business-Pipeline-Push-Adapter (DEC-029, BL-027 Coordination-Sprint).
// Pre-Condition: Business-System POST /api/internal/deals + INTERNAL_API_TOKEN.
// Feature-Flag-gated via BUSINESS_PIPELINE_PUSH_ENABLED (default false in V1).

import { isFeatureEnabled } from "@/lib/featureFlags";
import { trackCost } from "../shared/cost-tracker";
import { writeAuditLog } from "../shared/audit-logger";
import type {
  PipelinePushRequest,
  PipelinePushResult,
} from "./types";

const BASE_URL = process.env.BUSINESS_API_BASE_URL ?? "";
const API_TOKEN = process.env.BUSINESS_API_TOKEN ?? "";
const PIPELINE_NAME =
  process.env.BUSINESS_PIPELINE_NAME ?? "Lead-Generierung";
const STAGE_NAME = process.env.BUSINESS_STAGE_NAME ?? "Neu";

export async function pushLeadToPipeline(
  req: PipelinePushRequest
): Promise<PipelinePushResult> {
  if (!isFeatureEnabled("BUSINESS_PIPELINE_PUSH_ENABLED")) {
    throw new Error(
      "BUSINESS_PIPELINE_PUSH_ENABLED is disabled. " +
        "Use mechanism='manual' until BL-027 Business-Sprint completes."
    );
  }

  void BASE_URL;
  void API_TOKEN;
  void PIPELINE_NAME;
  void STAGE_NAME;
  void trackCost;
  void writeAuditLog;
  void req;

  throw new Error(
    "businessPipelineAdapter.pushLeadToPipeline() not implemented (SLC-108 Lead Handoff)"
  );
}

export const businessPipelineAdapter = { pushLeadToPipeline };
