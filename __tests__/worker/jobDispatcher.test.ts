// Worker-JobDispatcher Unit-Tests (MT-8).
// Pruefen: alle 7 Job-Types haben einen Handler eingehaengt.

import { describe, it, expect } from "vitest";
import {
  dispatchJob,
  listRegisteredHandlers,
} from "../../worker/jobDispatcher";
import type { AiJob, AiJobType } from "../../worker/types";

const ALL_TYPES: AiJobType[] = [
  "ingest_onboarding",
  "ingest_business",
  "opportunity_scoring",
  "business_status_pull",
  "asset_generation",
  "pitch_generation",
  "lead_research_run",
];

function fakeJob(type: AiJobType): AiJob {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    job_type: type,
    status: "pending",
    payload: {},
    attempts: 0,
    max_attempts: 3,
    scheduled_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
}

describe("worker/jobDispatcher", () => {
  it("registers handlers for all 7 ai_job_type values", () => {
    const registered = listRegisteredHandlers();
    for (const t of ALL_TYPES) {
      expect(registered).toContain(t);
    }
    expect(registered.length).toBe(ALL_TYPES.length);
  });

  it("dispatches V1 handlers and they throw not-implemented (skeletons)", async () => {
    for (const t of [
      "asset_generation",
      "pitch_generation",
      "lead_research_run",
      "business_status_pull",
    ] as AiJobType[]) {
      await expect(dispatchJob(fakeJob(t))).rejects.toThrow(/not implemented/);
    }
  });

  it("V6 handlers throw FEATURE_KNOWLEDGE_BACKBONE_ENABLED disabled", async () => {
    for (const t of [
      "ingest_onboarding",
      "ingest_business",
      "opportunity_scoring",
    ] as AiJobType[]) {
      await expect(dispatchJob(fakeJob(t))).rejects.toThrow(
        /FEATURE_KNOWLEDGE_BACKBONE_ENABLED=false/
      );
    }
  });
});
