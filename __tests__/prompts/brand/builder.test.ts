/**
 * Tests fuer Brand-Prompt-Builder (SLC-102 MT-5).
 */
import { describe, it, expect } from "vitest";
import {
  buildBrandSystemPrompt,
  SKILL_HIGHLIGHTS,
} from "@/prompts/brand/builder";
import type { BrandProfileData } from "@/lib/brand/schema";

function sampleProfile(): BrandProfileData {
  return {
    sections: {
      productOverview: {
        one_line_description: "AI-First CRM",
        what_it_does: "Voice-Capture + Auto-Strukturierung",
        product_category: "Sales Tool",
        product_type: "SaaS",
        business_model: "49EUR/User/Monat",
      },
      targetAudience: {
        target_company_type: { industry: "B2B SaaS", size_band: "10-200", stage: "Series A+" },
        target_decision_makers: [{ role: "Head of Sales", department: "Sales" }],
        primary_use_case: "Voice-Capture nach Calls",
        jobs_to_be_done: ["Pipeline aktuell halten", "Kontext nachvollziehen"],
        specific_use_cases: ["Discovery 60s statt 15min"],
      },
      personas: {
        personas: [
          { type: "user", cares_about: "Weniger Admin", challenge: "CRM-Pflege", value_promise: "60s" },
          { type: "decision_maker", cares_about: "Pipeline-Hygiene", challenge: "Forecasting", value_promise: "Echtzeit" },
        ],
      },
      painPoints: {
        core_challenge: "CRM nicht aktuell",
        why_current_solutions_fall_short: "Manuelle Eingabe wird vergessen",
        costs: { time: "10h/Woche", money: "5%", opportunities: "Verpasste Follow-ups" },
        emotional_tension: "Frust",
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

describe("buildBrandSystemPrompt", () => {
  it("enthaelt alle 12 Sektionen", () => {
    const out = buildBrandSystemPrompt(sampleProfile());
    for (let i = 1; i <= 12; i++) {
      expect(out).toContain(`## Sektion ${i}`);
    }
  });

  it("ist deterministisch (gleicher Input ergibt gleichen Output)", () => {
    const a = buildBrandSystemPrompt(sampleProfile());
    const b = buildBrandSystemPrompt(sampleProfile());
    expect(a).toBe(b);
  });

  it("hebt KEY-Sektionen mit '(KEY)' hervor", () => {
    const out = buildBrandSystemPrompt(sampleProfile(), {
      highlightSections: [4, 6, 9, 10],
    });
    expect(out).toContain("## Sektion 4 (KEY)");
    expect(out).toContain("## Sektion 6 (KEY)");
    expect(out).toContain("## Sektion 9 (KEY)");
    expect(out).toContain("## Sektion 10 (KEY)");
    // Nicht-KEY bleibt ohne Marker
    expect(out).toContain("## Sektion 1 — ");
    expect(out).not.toContain("## Sektion 1 (KEY)");
  });

  it("Profile-Daten erscheinen im JSON-Block", () => {
    const out = buildBrandSystemPrompt(sampleProfile());
    expect(out).toContain("AI-First CRM");
    expect(out).toContain("Voice-First");
    expect(out).toContain("decision_maker");
  });

  it("ohne highlight-Option: kein KEY-Marker irgendwo", () => {
    const out = buildBrandSystemPrompt(sampleProfile());
    expect(out).not.toContain("(KEY)");
  });
});

describe("SKILL_HIGHLIGHTS Mapping", () => {
  it("blogpost markiert 4, 6, 9, 10", () => {
    expect(SKILL_HIGHLIGHTS.blogpost).toEqual([4, 6, 9, 10]);
  });

  it("cold-email-pitch markiert 4, 8, 9, 11", () => {
    expect(SKILL_HIGHLIGHTS["cold-email-pitch"]).toEqual([4, 8, 9, 11]);
  });

  it("alle Highlight-Indizes sind im 1-12 Range", () => {
    for (const skill of Object.keys(SKILL_HIGHLIGHTS)) {
      for (const idx of SKILL_HIGHLIGHTS[skill]) {
        expect(idx).toBeGreaterThanOrEqual(1);
        expect(idx).toBeLessThanOrEqual(12);
      }
    }
  });
});
