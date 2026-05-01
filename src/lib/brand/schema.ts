/**
 * Brand Profile — 12-Sektionen-Zod-Schema (FEAT-008 / SLC-102 MT-1).
 *
 * Quelle: docs/spec-references/brand-profile-12-sections.md (corey-haines, MIT, Snapshot 2026-04-26).
 * V1-Pflichten gemaess SLC-102 Acceptance Criteria.
 */
import { z } from "zod";

const nonEmptyText = z.string().trim().min(1, "Pflichtfeld");

// ─── Section 1: Product Overview ─────────────────────────────────────────
export const productTypeEnum = z.enum([
  "SaaS",
  "Marketplace",
  "E-Commerce",
  "Service",
  "Internal-Tool",
  "Other",
]);

export const section1Schema = z.object({
  one_line_description: nonEmptyText,
  what_it_does: nonEmptyText,
  product_category: nonEmptyText,
  product_type: productTypeEnum,
  business_model: nonEmptyText,
});

// ─── Section 2: Target Audience ──────────────────────────────────────────
export const section2Schema = z.object({
  target_company_type: z.object({
    industry: nonEmptyText,
    size_band: nonEmptyText,
    stage: nonEmptyText,
  }),
  target_decision_makers: z
    .array(z.object({ role: nonEmptyText, department: nonEmptyText }))
    .min(1, "Mind. 1 Decision Maker"),
  primary_use_case: nonEmptyText,
  jobs_to_be_done: z
    .array(nonEmptyText)
    .min(2, "Mind. 2 Jobs-to-be-done")
    .max(3, "Max 3 Jobs-to-be-done (V1-Spec)"),
  specific_use_cases: z.array(nonEmptyText).min(1, "Mind. 1 Use-Case"),
});

// ─── Section 3: Personas (B2B) ───────────────────────────────────────────
export const personaTypeEnum = z.enum([
  "user",
  "champion",
  "decision_maker",
  "financial_buyer",
  "technical_influencer",
]);

const personaSchema = z.object({
  type: personaTypeEnum,
  cares_about: nonEmptyText,
  challenge: nonEmptyText,
  value_promise: nonEmptyText,
});

export const section3Schema = z
  .object({
    personas: z
      .array(personaSchema)
      .min(2, "Mind. 2 Personas (user + decision_maker)"),
  })
  .superRefine((val, ctx) => {
    const types = new Set(val.personas.map((p) => p.type));
    if (!types.has("user")) {
      ctx.addIssue({
        code: "custom",
        path: ["personas"],
        message: "Persona-Typ 'user' ist V1-Pflicht",
      });
    }
    if (!types.has("decision_maker")) {
      ctx.addIssue({
        code: "custom",
        path: ["personas"],
        message: "Persona-Typ 'decision_maker' ist V1-Pflicht",
      });
    }
  });

// ─── Section 4: Problems & Pain Points ───────────────────────────────────
export const section4Schema = z.object({
  core_challenge: nonEmptyText,
  why_current_solutions_fall_short: nonEmptyText,
  costs: z.object({
    time: nonEmptyText,
    money: nonEmptyText,
    opportunities: nonEmptyText,
  }),
  emotional_tension: nonEmptyText,
});

// ─── Section 5: Competitive Landscape ────────────────────────────────────
const competitorSchema = z.object({
  name: nonEmptyText,
  falls_short: nonEmptyText,
});

export const section5Schema = z.object({
  direct_competitors: z.array(competitorSchema).min(1, "Mind. 1 Direct-Competitor"),
  secondary_competitors: z.array(competitorSchema).optional().default([]),
  indirect_competitors: z.array(competitorSchema).optional().default([]),
});

// ─── Section 6: Differentiation ──────────────────────────────────────────
export const section6Schema = z.object({
  key_differentiators: z.array(nonEmptyText).min(1, "Mind. 1 Differentiator"),
  how_we_do_it_differently: nonEmptyText,
  why_thats_better: nonEmptyText,
  why_customers_choose_us: nonEmptyText,
});

// ─── Section 7: Objections & Anti-Personas ───────────────────────────────
const objectionSchema = z.object({
  objection: nonEmptyText,
  response: nonEmptyText,
});

export const section7Schema = z.object({
  top_objections: z
    .array(objectionSchema)
    .min(1, "Mind. 1 Top-Objection")
    .max(3, "Max 3 Top-Objections (V1-Spec)"),
  anti_persona: nonEmptyText,
});

// ─── Section 8: Switching Dynamics (JTBD Four Forces) ────────────────────
export const section8Schema = z.object({
  push: nonEmptyText,
  pull: nonEmptyText,
  habit: nonEmptyText,
  anxiety: nonEmptyText,
});

// ─── Section 9: Customer Language ────────────────────────────────────────
export const section9Schema = z.object({
  verbatim_problem_phrases: z
    .array(nonEmptyText)
    .min(3, "Mind. 3 Verbatim-Problem-Phrases"),
  verbatim_solution_phrases: z
    .array(nonEmptyText)
    .min(3, "Mind. 3 Verbatim-Solution-Phrases"),
  words_to_use: z.array(nonEmptyText).optional().default([]),
  words_to_avoid: z.array(nonEmptyText).optional().default([]),
  glossary: z
    .array(z.object({ term: nonEmptyText, definition: nonEmptyText }))
    .optional()
    .default([]),
});

// ─── Section 10: Brand Voice ─────────────────────────────────────────────
export const section10Schema = z.object({
  tone: nonEmptyText,
  communication_style: nonEmptyText,
  personality: z
    .array(nonEmptyText)
    .min(3, "Mind. 3 Personality-Adjektive")
    .max(5, "Max 5 Personality-Adjektive"),
});

// ─── Section 11: Proof Points ────────────────────────────────────────────
const metricSchema = z.object({
  claim: nonEmptyText,
  evidence: nonEmptyText,
});

const testimonialSchema = z.object({
  quote: nonEmptyText,
  attribution: nonEmptyText,
});

const valueThemeSchema = z.object({
  theme: nonEmptyText,
  proof: nonEmptyText,
});

export const section11Schema = z
  .object({
    metrics: z.array(metricSchema).optional().default([]),
    notable_customers: z.array(nonEmptyText).optional().default([]),
    testimonials: z.array(testimonialSchema).optional().default([]),
    value_themes: z.array(valueThemeSchema).optional().default([]),
  })
  .superRefine((val, ctx) => {
    const hasProof =
      (val.metrics?.length ?? 0) > 0 || (val.testimonials?.length ?? 0) > 0;
    if (!hasProof) {
      ctx.addIssue({
        code: "custom",
        path: ["metrics"],
        message: "Mind. 1 Metric ODER Testimonial ist V1-Pflicht",
      });
    }
  });

// ─── Section 12: Goals ───────────────────────────────────────────────────
export const section12Schema = z.object({
  primary_business_goal: nonEmptyText,
  key_conversion_action: nonEmptyText,
  current_metrics: z.record(z.string(), z.unknown()).nullable().optional(),
});

// ─── Top-Level Brand Profile Data Schema ─────────────────────────────────
export const brandProfileDataSchema = z.object({
  sections: z.object({
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
  }),
});

export type BrandProfileData = z.infer<typeof brandProfileDataSchema>;

export const SECTION_KEYS = [
  "productOverview",
  "targetAudience",
  "personas",
  "painPoints",
  "competitiveLandscape",
  "differentiation",
  "objections",
  "switchingDynamics",
  "customerLanguage",
  "brandVoice",
  "proofPoints",
  "goals",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_INDEX_BY_KEY: Record<SectionKey, number> = {
  productOverview: 1,
  targetAudience: 2,
  personas: 3,
  painPoints: 4,
  competitiveLandscape: 5,
  differentiation: 6,
  objections: 7,
  switchingDynamics: 8,
  customerLanguage: 9,
  brandVoice: 10,
  proofPoints: 11,
  goals: 12,
};

export const SECTION_LABEL_DE: Record<SectionKey, string> = {
  productOverview: "Product Overview",
  targetAudience: "Target Audience",
  personas: "Personas",
  painPoints: "Problems & Pain Points",
  competitiveLandscape: "Competitive Landscape",
  differentiation: "Differentiation",
  objections: "Objections & Anti-Personas",
  switchingDynamics: "Switching Dynamics",
  customerLanguage: "Customer Language",
  brandVoice: "Brand Voice",
  proofPoints: "Proof Points",
  goals: "Goals",
};
