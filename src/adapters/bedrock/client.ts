// Bedrock-Adapter (DEC-002, eu-central-1, Claude Sonnet).
// Skeleton — Implementation in SLC-103 (Asset Production) als erste Nutzung.

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { trackCost } from "../shared/cost-tracker";
import { writeAuditLog } from "../shared/audit-logger";
import type { BedrockInvokeRequest, BedrockInvokeResponse } from "./types";

const REGION = process.env.BEDROCK_REGION ?? "eu-central-1";
const DEFAULT_MODEL =
  process.env.BEDROCK_MODEL_ID ??
  "eu.anthropic.claude-sonnet-4-5-20251001-v1:0";

let cachedClient: BedrockRuntimeClient | null = null;

function getClient(): BedrockRuntimeClient {
  if (!cachedClient) {
    cachedClient = new BedrockRuntimeClient({ region: REGION });
  }
  return cachedClient;
}

export async function invokeBedrock(
  req: BedrockInvokeRequest
): Promise<BedrockInvokeResponse> {
  // SKELETON — full implementation lands in SLC-103.
  // Minimum-viable: send Anthropic-Messages-API payload, parse response,
  // write cost-ledger + audit-log entries.
  void getClient();
  void InvokeModelCommand;
  void trackCost;
  void writeAuditLog;
  void req;
  void DEFAULT_MODEL;
  throw new Error(
    "bedrockAdapter.invokeBedrock() not implemented (SLC-103 will land Asset Production)"
  );
}

export const bedrockAdapter = { invokeBedrock };
