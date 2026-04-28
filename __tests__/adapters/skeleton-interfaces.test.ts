// Adapter-Skeleton-Interface-Tests (MT-7, slice-spec TDD-Pflicht-Bereich).
// Pruefen:
//   1. Adapter-Funktionen sind importierbar mit definierter Signatur
//   2. Skeleton-Implementierungen werfen 'not implemented' (kein silent-fail)
//   3. Shared helpers (audit-logger, cost-tracker) sind funktional importierbar

import { describe, it, expect } from "vitest";

describe("firecrawlAdapter", () => {
  it("crawlSegment is exported and throws not-implemented", async () => {
    const { firecrawlAdapter, crawlSegment } = await import(
      "@/adapters/firecrawl"
    );
    expect(typeof firecrawlAdapter.crawlSegment).toBe("function");
    expect(typeof crawlSegment).toBe("function");
    await expect(
      crawlSegment({ segmentId: "00000000-0000-0000-0000-000000000000", query: { triggerSignals: [] } })
    ).rejects.toThrow(/not implemented/i);
  });

  it("buildFirecrawlQuery is exported and throws not-implemented", async () => {
    const { buildFirecrawlQuery } = await import("@/adapters/firecrawl");
    expect(() => buildFirecrawlQuery({})).toThrowError(/not implemented/i);
  });
});

describe("clayCsvAdapter", () => {
  it("parseClayCsv is exported and throws not-implemented", async () => {
    const { clayCsvAdapter, parseClayCsv } = await import(
      "@/adapters/clay-csv"
    );
    expect(typeof clayCsvAdapter.parseClayCsv).toBe("function");
    expect(() => parseClayCsv("dummy")).toThrowError(/not implemented/i);
  });

  it("ClayCsvRowSchema validates expected shape", async () => {
    const { ClayCsvRowSchema } = await import("@/adapters/clay-csv");
    const ok = ClayCsvRowSchema.safeParse({
      "Company Name": "X GmbH",
      Domain: "x.de",
    });
    expect(ok.success).toBe(true);

    const fail = ClayCsvRowSchema.safeParse({ Domain: "x.de" });
    expect(fail.success).toBe(false);
  });
});

describe("businessPipelineAdapter", () => {
  it("pushLeadToPipeline is exported", async () => {
    const { businessPipelineAdapter, pushLeadToPipeline } = await import(
      "@/adapters/business-pipeline"
    );
    expect(typeof businessPipelineAdapter.pushLeadToPipeline).toBe("function");
    expect(typeof pushLeadToPipeline).toBe("function");
  });

  it("pushLeadToPipeline throws when feature flag disabled (DEC-029 default)", async () => {
    delete process.env.BUSINESS_PIPELINE_PUSH_ENABLED;
    const { pushLeadToPipeline } = await import(
      "@/adapters/business-pipeline"
    );
    await expect(
      pushLeadToPipeline({
        leadId: "00000000-0000-0000-0000-000000000000",
        campaignId: "00000000-0000-0000-0000-000000000000",
        payload: {
          companyName: "X",
          domain: "x.de",
          triggerSignalsMatched: [],
          campaignTitle: "T",
        },
      })
    ).rejects.toThrow(/BUSINESS_PIPELINE_PUSH_ENABLED is disabled/);
  });

  it("pullPipelineStatus is exported and throws not-implemented", async () => {
    const { pullPipelineStatus } = await import(
      "@/adapters/business-pipeline"
    );
    await expect(
      pullPipelineStatus({ pipelineName: "Lead-Generierung", since: "2026-04-28" })
    ).rejects.toThrow(/not implemented/i);
  });
});

describe("linkedinAdsCsvAdapter", () => {
  it("parseLinkedinAdsCsv is exported and throws not-implemented", async () => {
    const { linkedinAdsCsvAdapter, parseLinkedinAdsCsv } = await import(
      "@/adapters/linkedin-ads-csv"
    );
    expect(typeof linkedinAdsCsvAdapter.parseLinkedinAdsCsv).toBe("function");
    expect(() => parseLinkedinAdsCsv("dummy")).toThrowError(/not implemented/i);
  });
});

describe("bedrockAdapter", () => {
  it("invokeBedrock is exported and throws not-implemented", async () => {
    const { bedrockAdapter, invokeBedrock } = await import(
      "@/adapters/bedrock"
    );
    expect(typeof bedrockAdapter.invokeBedrock).toBe("function");
    await expect(
      invokeBedrock({ userMessage: "hello" })
    ).rejects.toThrow(/not implemented/i);
  });
});

describe("shared helpers (functional)", () => {
  it("writeAuditLog is exported and is async", async () => {
    const mod = await import("@/adapters/shared/audit-logger");
    expect(typeof mod.writeAuditLog).toBe("function");
    expect(mod.writeAuditLog.constructor.name).toBe("AsyncFunction");
  });

  it("trackCost is exported and is async", async () => {
    const mod = await import("@/adapters/shared/cost-tracker");
    expect(typeof mod.trackCost).toBe("function");
    expect(mod.trackCost.constructor.name).toBe("AsyncFunction");
  });
});
