// Unit-Tests fuer Feature-Flag-Helper (MT-9).
// Per slice-spec TDD-Pflicht-Bereich.

import { describe, it, expect, beforeEach, afterEach } from "vitest";

const FLAGS = [
  "FEATURE_MARKETING_LAUNCHER_ENABLED",
  "FEATURE_KNOWLEDGE_BACKBONE_ENABLED",
  "FEATURE_PUBLISHING_ENABLED",
  "BUSINESS_PIPELINE_PUSH_ENABLED",
] as const;

describe("featureFlags", () => {
  const original: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const f of FLAGS) {
      original[f] = process.env[f];
      delete process.env[f];
    }
  });

  afterEach(() => {
    for (const f of FLAGS) {
      if (original[f] === undefined) delete process.env[f];
      else process.env[f] = original[f]!;
    }
  });

  it("returns DEFAULTS when no ENV is set", async () => {
    const { isFeatureEnabled } = await import("@/lib/featureFlags");
    expect(isFeatureEnabled("FEATURE_MARKETING_LAUNCHER_ENABLED")).toBe(true);
    expect(isFeatureEnabled("FEATURE_KNOWLEDGE_BACKBONE_ENABLED")).toBe(false);
    expect(isFeatureEnabled("FEATURE_PUBLISHING_ENABLED")).toBe(false);
    expect(isFeatureEnabled("BUSINESS_PIPELINE_PUSH_ENABLED")).toBe(false);
  });

  it("respects ENV='true' override", async () => {
    process.env.BUSINESS_PIPELINE_PUSH_ENABLED = "true";
    const { isFeatureEnabled } = await import("@/lib/featureFlags");
    expect(isFeatureEnabled("BUSINESS_PIPELINE_PUSH_ENABLED")).toBe(true);
  });

  it("respects ENV='false' override on default-true flag", async () => {
    process.env.FEATURE_MARKETING_LAUNCHER_ENABLED = "false";
    const { isFeatureEnabled } = await import("@/lib/featureFlags");
    expect(isFeatureEnabled("FEATURE_MARKETING_LAUNCHER_ENABLED")).toBe(false);
  });

  it("accepts '1' and 'yes' as truthy", async () => {
    process.env.BUSINESS_PIPELINE_PUSH_ENABLED = "1";
    let mod = await import("@/lib/featureFlags");
    expect(mod.isFeatureEnabled("BUSINESS_PIPELINE_PUSH_ENABLED")).toBe(true);

    process.env.BUSINESS_PIPELINE_PUSH_ENABLED = "yes";
    mod = await import("@/lib/featureFlags");
    expect(mod.isFeatureEnabled("BUSINESS_PIPELINE_PUSH_ENABLED")).toBe(true);
  });

  it("requireFeature throws when disabled", async () => {
    const { requireFeature } = await import("@/lib/featureFlags");
    expect(() =>
      requireFeature("FEATURE_KNOWLEDGE_BACKBONE_ENABLED")
    ).toThrowError(/disabled/);
  });

  it("requireFeature does not throw when enabled", async () => {
    const { requireFeature } = await import("@/lib/featureFlags");
    expect(() =>
      requireFeature("FEATURE_MARKETING_LAUNCHER_ENABLED")
    ).not.toThrow();
  });

  it("getAllFlags returns all 4 flags with V1-defaults", async () => {
    const { getAllFlags } = await import("@/lib/featureFlags");
    const flags = getAllFlags();
    expect(flags).toEqual({
      FEATURE_MARKETING_LAUNCHER_ENABLED: true,
      FEATURE_KNOWLEDGE_BACKBONE_ENABLED: false,
      FEATURE_PUBLISHING_ENABLED: false,
      BUSINESS_PIPELINE_PUSH_ENABLED: false,
    });
  });
});
