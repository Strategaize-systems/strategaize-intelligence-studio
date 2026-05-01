/**
 * Tests fuer Vollstaendigkeits-Indikator (SLC-102 MT-6).
 */
import { describe, it, expect } from "vitest";
import {
  getSectionCompleteness,
  getOverallCompleteness,
} from "@/lib/brand/completeness";
import { SECTION_KEYS, type BrandProfileData } from "@/lib/brand/schema";

function fullValidProfile(): BrandProfileData {
  return {
    sections: {
      productOverview: {
        one_line_description: "AI-First CRM",
        what_it_does: "Erfasst per Sprachnotiz und strukturiert.",
        product_category: "Sales Tool",
        product_type: "SaaS",
        business_model: "49EUR/User/Monat",
      },
      targetAudience: {
        target_company_type: { industry: "B2B SaaS", size_band: "10-200", stage: "Series A+" },
        target_decision_makers: [{ role: "Head of Sales", department: "Sales" }],
        primary_use_case: "Voice-Capture nach Calls",
        jobs_to_be_done: ["Pipeline aktuell halten", "Kontext nachvollziehen"],
        specific_use_cases: ["Nach Discovery 60s statt 15min"],
      },
      personas: {
        personas: [
          { type: "user", cares_about: "X", challenge: "Y", value_promise: "Z" },
          { type: "decision_maker", cares_about: "X", challenge: "Y", value_promise: "Z" },
        ],
      },
      painPoints: {
        core_challenge: "CRM nicht aktuell",
        why_current_solutions_fall_short: "Manuelle Eingabe wird vergessen",
        costs: { time: "10h/Woche", money: "5% Pipeline", opportunities: "Verpasste Follow-ups" },
        emotional_tension: "Frust auf beiden Seiten",
      },
      competitiveLandscape: {
        direct_competitors: [{ name: "Salesforce", falls_short: "Schwer" }],
        secondary_competitors: [],
        indirect_competitors: [],
      },
      differentiation: {
        key_differentiators: ["Voice-First"],
        how_we_do_it_differently: "Whisper + Claude",
        why_thats_better: "10x schneller",
        why_customers_choose_us: "Endlich nutzbar",
      },
      objections: {
        top_objections: [{ objection: "Praezision?", response: "95%+" }],
        anti_persona: "Reine Inbound-SaaS",
      },
      switchingDynamics: {
        push: "Forecasts geraten",
        pull: "Pipeline aktuell",
        habit: "CRM = Pflicht",
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
        primary_business_goal: "10 Pilot-Kunden",
        key_conversion_action: "Demo-Call buchen",
        current_metrics: null,
      },
    },
  };
}

describe("getSectionCompleteness", () => {
  it("'leer' wenn profile null", () => {
    expect(getSectionCompleteness(null, "productOverview")).toBe("leer");
  });

  it("'leer' wenn sections.productOverview undefined", () => {
    // @ts-expect-error — partial profile fuer Test
    expect(getSectionCompleteness({ sections: {} }, "productOverview")).toBe("leer");
  });

  it("'leer' wenn alle Felder einer Sektion empty/whitespace", () => {
    const partial = {
      sections: {
        productOverview: {
          one_line_description: "",
          what_it_does: "   ",
          product_category: "",
          // product_type fehlt
        },
      },
    };
    expect(getSectionCompleteness(partial as never, "productOverview")).toBe("leer");
  });

  it("'unvollstaendig' wenn ein Feld da, andere fehlen", () => {
    const partial = {
      sections: {
        productOverview: {
          one_line_description: "AI-First CRM",
          // Rest fehlt
        },
      },
    };
    expect(getSectionCompleteness(partial as never, "productOverview")).toBe("unvollstaendig");
  });

  it("'erfasst' wenn alle Pflichtfelder ausgefuellt", () => {
    expect(getSectionCompleteness(fullValidProfile(), "productOverview")).toBe("erfasst");
  });

  it("'unvollstaendig' bei Section 9 mit < 3 problem phrases", () => {
    const profile = fullValidProfile();
    profile.sections.customerLanguage.verbatim_problem_phrases = ["nur eine"];
    expect(getSectionCompleteness(profile, "customerLanguage")).toBe("unvollstaendig");
  });

  it("'unvollstaendig' bei Section 11 mit nur notable_customers (ohne Metric/Testimonial)", () => {
    const profile = fullValidProfile();
    profile.sections.proofPoints.metrics = [];
    profile.sections.proofPoints.notable_customers = ["ACME Corp"];
    expect(getSectionCompleteness(profile, "proofPoints")).toBe("unvollstaendig");
  });

  it("'erfasst' bei Section 11 mit nur Testimonial (statt Metric)", () => {
    const profile = fullValidProfile();
    profile.sections.proofPoints.metrics = [];
    profile.sections.proofPoints.testimonials = [{ quote: "Top", attribution: "Max" }];
    expect(getSectionCompleteness(profile, "proofPoints")).toBe("erfasst");
  });
});

describe("getOverallCompleteness", () => {
  it("alle 12 Sektionen 'leer' bei null profile", () => {
    const result = getOverallCompleteness(null);
    expect(result.overall).toBe("leer");
    SECTION_KEYS.forEach((k) => expect(result.sections[k]).toBe("leer"));
  });

  it("alle 12 Sektionen 'erfasst' bei vollem Profile", () => {
    const result = getOverallCompleteness(fullValidProfile());
    expect(result.overall).toBe("erfasst");
    SECTION_KEYS.forEach((k) => expect(result.sections[k]).toBe("erfasst"));
  });

  it("'unvollstaendig' overall wenn 1 Sektion unvollstaendig ist", () => {
    const profile = fullValidProfile();
    profile.sections.brandVoice.personality = ["nur", "zwei"];
    const result = getOverallCompleteness(profile);
    expect(result.sections.brandVoice).toBe("unvollstaendig");
    expect(result.overall).toBe("unvollstaendig");
  });
});
