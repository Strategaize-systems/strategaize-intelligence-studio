/**
 * Brand Profile Validation-Error-Helper (FEAT-008 / SLC-102 MT-3, ISSUE-010).
 *
 * Aggregiert `Record<string, string[]>` aus `BrandProfileValidationError.fieldErrors`
 * (Zod-Issue-Pfade) zu einer Liste eindeutiger Sektion-Keys, fuer deutsche Toast-Anzeige.
 */
import { SECTION_KEYS, SECTION_LABEL_DE, type SectionKey } from "./schema";

const SECTION_KEY_SET = new Set<string>(SECTION_KEYS);

export function summarizeSectionErrors(
  fieldErrors: Record<string, string[]> | undefined
): SectionKey[] {
  if (!fieldErrors) return [];
  const found = new Set<SectionKey>();
  for (const path of Object.keys(fieldErrors)) {
    const segments = path.split(".");
    if (segments[0] !== "sections") continue;
    const key = segments[1];
    if (key && SECTION_KEY_SET.has(key)) {
      found.add(key as SectionKey);
    }
  }
  return SECTION_KEYS.filter((k) => found.has(k));
}

export function formatSectionErrorList(keys: SectionKey[]): string {
  return keys.map((k) => SECTION_LABEL_DE[k]).join(", ");
}
