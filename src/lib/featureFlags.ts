// V1 Marketing Launcher Feature-Flags
// Source of truth: ARCHITECTURE.md A.11
// MT-9: Type-safe Feature-Flag-Helper

export type FeatureFlag =
  | "FEATURE_MARKETING_LAUNCHER_ENABLED"
  | "FEATURE_KNOWLEDGE_BACKBONE_ENABLED"
  | "FEATURE_PUBLISHING_ENABLED"
  | "BUSINESS_PIPELINE_PUSH_ENABLED";

const DEFAULTS: Record<FeatureFlag, boolean> = {
  FEATURE_MARKETING_LAUNCHER_ENABLED: true,
  FEATURE_KNOWLEDGE_BACKBONE_ENABLED: false,
  FEATURE_PUBLISHING_ENABLED: false,
  BUSINESS_PIPELINE_PUSH_ENABLED: false,
};

function parseBool(raw: string | undefined, fallback: boolean): boolean {
  if (raw === undefined || raw === "") return fallback;
  return raw === "true" || raw === "1" || raw === "yes";
}

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return parseBool(process.env[flag], DEFAULTS[flag]);
}

export function requireFeature(flag: FeatureFlag): void {
  if (!isFeatureEnabled(flag)) {
    throw new Error(
      `Feature ${flag} is disabled. Set ${flag}=true to enable.`
    );
  }
}

export function getAllFlags(): Record<FeatureFlag, boolean> {
  return {
    FEATURE_MARKETING_LAUNCHER_ENABLED: isFeatureEnabled(
      "FEATURE_MARKETING_LAUNCHER_ENABLED"
    ),
    FEATURE_KNOWLEDGE_BACKBONE_ENABLED: isFeatureEnabled(
      "FEATURE_KNOWLEDGE_BACKBONE_ENABLED"
    ),
    FEATURE_PUBLISHING_ENABLED: isFeatureEnabled("FEATURE_PUBLISHING_ENABLED"),
    BUSINESS_PIPELINE_PUSH_ENABLED: isFeatureEnabled(
      "BUSINESS_PIPELINE_PUSH_ENABLED"
    ),
  };
}
