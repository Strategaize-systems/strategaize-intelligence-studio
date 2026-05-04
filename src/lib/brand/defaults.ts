/**
 * Default-Empty-Values fuer das BrandProfile-Form.
 * Muessen ALLE Pflicht-Pfade aus dem Zod-Schema instanziieren, damit RHF
 * die Felder korrekt verwaltet (sonst werfen `.min(N)`-Konstellationen
 * unklare Fehler).
 */
import type { BrandProfileData } from "./schema";

export function emptyBrandProfile(): BrandProfileData {
  return {
    sections: {
      productOverview: {
        one_line_description: "",
        what_it_does: "",
        product_category: "",
        product_type: "SaaS",
        business_model: "",
      },
      targetAudience: {
        target_company_type: { industry: "", size_band: "", stage: "" },
        target_decision_makers: [{ role: "", department: "" }],
        primary_use_case: "",
        jobs_to_be_done: ["", ""],
        specific_use_cases: [""],
      },
      personas: {
        personas: [
          { type: "user", cares_about: "", challenge: "", value_promise: "" },
          {
            type: "decision_maker",
            cares_about: "",
            challenge: "",
            value_promise: "",
          },
        ],
      },
      painPoints: {
        core_challenge: "",
        why_current_solutions_fall_short: "",
        costs: { time: "", money: "", opportunities: "" },
        emotional_tension: "",
      },
      competitiveLandscape: {
        direct_competitors: [{ name: "", falls_short: "" }],
        secondary_competitors: [],
        indirect_competitors: [],
      },
      differentiation: {
        key_differentiators: [""],
        how_we_do_it_differently: "",
        why_thats_better: "",
        why_customers_choose_us: "",
      },
      objections: {
        top_objections: [{ objection: "", response: "" }],
        anti_persona: "",
      },
      switchingDynamics: { push: "", pull: "", habit: "", anxiety: "" },
      customerLanguage: {
        verbatim_problem_phrases: ["", "", ""],
        verbatim_solution_phrases: ["", "", ""],
        words_to_use: [],
        words_to_avoid: [],
        glossary: [],
      },
      brandVoice: {
        tone: "",
        communication_style: "",
        personality: ["", "", ""],
      },
      proofPoints: {
        metrics: [],
        notable_customers: [],
        testimonials: [],
        value_themes: [],
      },
      goals: {
        primary_business_goal: "",
        key_conversion_action: "",
        current_metrics: null,
      },
    },
  };
}
