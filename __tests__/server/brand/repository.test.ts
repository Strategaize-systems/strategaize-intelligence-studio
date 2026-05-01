/**
 * Repository Unit-Tests (SLC-102 MT-2) — pure-function Tests.
 * DB-Integration-Tests (Singleton, RLS, Insert/Update + Changelog) liegen in
 * __tests__/migrations/brand_profile_rls.test.ts (MT-7) — mit TEST_DATABASE_URL.
 */
import { describe, it, expect } from "vitest";
import {
  computeChangedSections,
  saveBrandProfile,
  BrandProfileValidationError,
} from "@/server/brand/repository";
import type { BrandProfileData } from "@/lib/brand/schema";

function fullValidProfile(): BrandProfileData {
  return {
    sections: {
      productOverview: {
        one_line_description: "AI-First CRM",
        what_it_does: "Voice-Capture",
        product_category: "Sales",
        product_type: "SaaS",
        business_model: "49EUR/User/Monat",
      },
      targetAudience: {
        target_company_type: { industry: "B2B", size_band: "10-200", stage: "Series A" },
        target_decision_makers: [{ role: "Head of Sales", department: "Sales" }],
        primary_use_case: "Pipeline aktuell halten",
        jobs_to_be_done: ["Pipeline pflegen", "Kontext finden"],
        specific_use_cases: ["60s Sprachnotiz nach Discovery"],
      },
      personas: {
        personas: [
          { type: "user", cares_about: "X", challenge: "Y", value_promise: "Z" },
          { type: "decision_maker", cares_about: "X", challenge: "Y", value_promise: "Z" },
        ],
      },
      painPoints: {
        core_challenge: "CRM nicht aktuell",
        why_current_solutions_fall_short: "Manuell wird vergessen",
        costs: { time: "10h", money: "5%", opportunities: "Verpasst" },
        emotional_tension: "Frust",
      },
      competitiveLandscape: {
        direct_competitors: [{ name: "Salesforce", falls_short: "Schwer" }],
        secondary_competitors: [],
        indirect_competitors: [],
      },
      differentiation: {
        key_differentiators: ["Voice-First"],
        how_we_do_it_differently: "Whisper",
        why_thats_better: "10x",
        why_customers_choose_us: "Nutzbar",
      },
      objections: {
        top_objections: [{ objection: "Praezision?", response: "95%+" }],
        anti_persona: "Inbound-only",
      },
      switchingDynamics: {
        push: "Forecasts geraten",
        pull: "Pipeline aktuell",
        habit: "CRM=Pflicht",
        anxiety: "Falsch interpretiert?",
      },
      customerLanguage: {
        verbatim_problem_phrases: ["P1", "P2", "P3"],
        verbatim_solution_phrases: ["S1", "S2", "S3"],
        words_to_use: [],
        words_to_avoid: [],
        glossary: [],
      },
      brandVoice: {
        tone: "Direkt",
        communication_style: "Kein Bullshit",
        personality: ["pragmatisch", "kompetent", "direkt"],
      },
      proofPoints: {
        metrics: [{ claim: "10x", evidence: "Pilot Q1/2026" }],
        notable_customers: [],
        testimonials: [],
        value_themes: [],
      },
      goals: {
        primary_business_goal: "10 Kunden",
        key_conversion_action: "Demo-Call",
        current_metrics: null,
      },
    },
  };
}

describe("computeChangedSections", () => {
  it("liefert leere Liste bei identischen Profiles", () => {
    const a = fullValidProfile();
    const b = fullValidProfile();
    expect(computeChangedSections(a, b)).toEqual([]);
  });

  it("erkennt Aenderung in Sektion painPoints", () => {
    const a = fullValidProfile();
    const b = fullValidProfile();
    b.sections.painPoints.core_challenge = "Anderer Pain";
    expect(computeChangedSections(a, b)).toEqual(["painPoints"]);
  });

  it("erkennt Aenderung in Sektion brandVoice (mehrere Felder gleichzeitig)", () => {
    const a = fullValidProfile();
    const b = fullValidProfile();
    b.sections.brandVoice.tone = "Anders";
    b.sections.brandVoice.personality = ["a", "b", "c", "d"];
    expect(computeChangedSections(a, b)).toEqual(["brandVoice"]);
  });

  it("erkennt mehrere Sektionen gleichzeitig geaendert", () => {
    const a = fullValidProfile();
    const b = fullValidProfile();
    b.sections.painPoints.core_challenge = "X";
    b.sections.brandVoice.tone = "Y";
    b.sections.goals.primary_business_goal = "Z";
    const changed = computeChangedSections(a, b);
    expect(changed.sort()).toEqual(["brandVoice", "goals", "painPoints"]);
  });

  it("erkennt Array-Aenderung (verbatim_phrases neu)", () => {
    const a = fullValidProfile();
    const b = fullValidProfile();
    b.sections.customerLanguage.verbatim_problem_phrases = ["X", "Y", "Z"];
    expect(computeChangedSections(a, b)).toEqual(["customerLanguage"]);
  });
});

describe("saveBrandProfile — Validation-Branch (kein DB-Touch)", () => {
  it("wirft BrandProfileValidationError bei invaliden Daten", async () => {
    const invalid = { sections: {} };
    await expect(saveBrandProfile(invalid, null)).rejects.toBeInstanceOf(
      BrandProfileValidationError
    );
  });

  it("ValidationError enthaelt fieldErrors-Map mit konkreten Pfaden", async () => {
    const invalid = { sections: {} };
    try {
      await saveBrandProfile(invalid, null);
      throw new Error("sollte werfen");
    } catch (e) {
      expect(e).toBeInstanceOf(BrandProfileValidationError);
      const err = e as BrandProfileValidationError;
      expect(Object.keys(err.fieldErrors).length).toBeGreaterThan(0);
    }
  });
});
