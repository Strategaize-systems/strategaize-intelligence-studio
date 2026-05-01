/**
 * Brand Profile → Bedrock System-Prompt Snippet (FEAT-008 / SLC-102 MT-5).
 *
 * Liefert deterministischen Markdown-Block, den Bedrock-Calls in SLC-103/106
 * als System-Kontext erhalten. Section-Hervorhebung pro FEAT-Skill (Mapping
 * siehe docs/spec-references/brand-profile-12-sections.md).
 */
import {
  SECTION_KEYS,
  SECTION_INDEX_BY_KEY,
  SECTION_LABEL_DE,
  type BrandProfileData,
  type SectionKey,
} from "@/lib/brand/schema";

const KEY_BY_INDEX: Record<number, SectionKey> = SECTION_KEYS.reduce(
  (acc, k) => {
    acc[SECTION_INDEX_BY_KEY[k]] = k;
    return acc;
  },
  {} as Record<number, SectionKey>
);

export interface BuildOptions {
  /** Sektionen-Indizes (1-12), die im Prompt mit "(KEY)" markiert werden. */
  highlightSections?: number[];
}

/**
 * Builds a Markdown block describing the brand profile, with optional KEY-section highlighting.
 * Output ist deterministisch — gleiches Profile + gleiche Options ergeben gleichen String.
 */
export function buildBrandSystemPrompt(
  profile: BrandProfileData,
  options: BuildOptions = {}
): string {
  const highlight = new Set(options.highlightSections ?? []);
  const lines: string[] = [];

  lines.push("# Brand Profile (StrategAIze)");
  lines.push("");
  lines.push(
    "Folgendes Brand Profile dient als zwingender Kontext fuer alle Marketing-Generierungen. Halte dich an Tonalitaet, Verbatim-Phrases und Differenzierung."
  );
  lines.push("");

  for (let i = 1; i <= 12; i++) {
    const key = KEY_BY_INDEX[i];
    const label = SECTION_LABEL_DE[key];
    const marker = highlight.has(i) ? " (KEY)" : "";
    lines.push(`## Sektion ${i}${marker} — ${label}`);
    lines.push("");
    const data = profile.sections[key];
    lines.push("```json");
    lines.push(JSON.stringify(data, null, 2));
    lines.push("```");
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

/**
 * Skill → highlighted-Section-Indices Mapping aus
 * docs/spec-references/brand-profile-12-sections.md.
 */
export const SKILL_HIGHLIGHTS: Record<string, number[]> = {
  // FEAT-009 Asset Production
  blogpost: [4, 6, 9, 10],
  "linkedin-post": [2, 9, 10],
  "one-pager": [4, 6, 11],
  "email-template": [4, 8, 9, 11],
  "case-card": [11],
  "landing-briefing": [1, 6, 11],
  "multi-page-website": [1, 2, 6],
  // FEAT-016 Messaging-Variation
  "cold-email-pitch": [4, 8, 9, 11],
  "linkedin-pitch": [2, 9, 10],
};
