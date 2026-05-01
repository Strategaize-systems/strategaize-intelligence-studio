/**
 * Brand Profile Vollstaendigkeits-Indikator (FEAT-008 / SLC-102 MT-6).
 * Pure function — pro Sektion 'leer' | 'unvollstaendig' | 'erfasst'.
 */
import {
  brandProfileDataSchema,
  section1Schema,
  section2Schema,
  section3Schema,
  section4Schema,
  section5Schema,
  section6Schema,
  section7Schema,
  section8Schema,
  section9Schema,
  section10Schema,
  section11Schema,
  section12Schema,
  SECTION_KEYS,
  type SectionKey,
  type BrandProfileData,
} from "./schema";

import type { z } from "zod";

export type CompletenessStatus = "leer" | "unvollstaendig" | "erfasst";

const SECTION_SCHEMAS: Record<SectionKey, z.ZodTypeAny> = {
  productOverview: section1Schema,
  targetAudience: section2Schema,
  personas: section3Schema,
  painPoints: section4Schema,
  competitiveLandscape: section5Schema,
  differentiation: section6Schema,
  objections: section7Schema,
  switchingDynamics: section8Schema,
  customerLanguage: section9Schema,
  brandVoice: section10Schema,
  proofPoints: section11Schema,
  goals: section12Schema,
};

function isEffectivelyEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0 || value.every(isEffectivelyEmpty);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).every(isEffectivelyEmpty);
  }
  return false;
}

export function getSectionCompleteness(
  profile: Partial<BrandProfileData> | null | undefined,
  sectionKey: SectionKey
): CompletenessStatus {
  const sectionData = profile?.sections?.[sectionKey];
  if (sectionData === undefined || isEffectivelyEmpty(sectionData)) {
    return "leer";
  }
  const schema = SECTION_SCHEMAS[sectionKey];
  return schema.safeParse(sectionData).success ? "erfasst" : "unvollstaendig";
}

export function getOverallCompleteness(
  profile: Partial<BrandProfileData> | null | undefined
): { sections: Record<SectionKey, CompletenessStatus>; overall: CompletenessStatus } {
  const sections = {} as Record<SectionKey, CompletenessStatus>;
  for (const key of SECTION_KEYS) {
    sections[key] = getSectionCompleteness(profile, key);
  }
  const allErfasst = SECTION_KEYS.every((k) => sections[k] === "erfasst");
  const allLeer = SECTION_KEYS.every((k) => sections[k] === "leer");
  // Top-Level "erfasst" muss zusaetzlich Schema-Top-Level passen
  const overall: CompletenessStatus = allErfasst
    ? brandProfileDataSchema.safeParse(profile).success
      ? "erfasst"
      : "unvollstaendig"
    : allLeer
    ? "leer"
    : "unvollstaendig";
  return { sections, overall };
}
