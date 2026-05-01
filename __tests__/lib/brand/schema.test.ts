/**
 * Tests fuer Brand Profile Zod-Schema (FEAT-008 / SLC-102 MT-1).
 * TDD-Pflicht — Acceptance Criteria deck-deckend gepruef.
 */
import { describe, it, expect } from "vitest";
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
  type BrandProfileData,
} from "@/lib/brand/schema";

function validProfile(): BrandProfileData {
  return {
    sections: {
      productOverview: {
        one_line_description: "AI-First CRM mit Voice-Capture",
        what_it_does:
          "Erfasst Vertriebs-Aktivitaeten per Sprachnotiz, strukturiert sie automatisch und befuellt Pipeline-Stufen ohne manuelle Eingabe.",
        product_category: "B2B Sales Productivity Tool",
        product_type: "SaaS",
        business_model: "SaaS-Subscription, 49EUR/User/Monat, Enterprise auf Anfrage",
      },
      targetAudience: {
        target_company_type: {
          industry: "B2B SaaS",
          size_band: "10-200 MA",
          stage: "Series A bis Pre-IPO",
        },
        target_decision_makers: [
          { role: "Head of Sales", department: "Sales" },
          { role: "VP Revenue Operations", department: "RevOps" },
        ],
        primary_use_case:
          "Vertriebsteam erfasst Aktivitaeten waehrend/nach Kundengespraechen ohne CRM-Klickerei.",
        jobs_to_be_done: [
          "Pipeline-Status aktuell halten ohne Admin-Zeit",
          "Kontext eines Deals nachvollziehen vor Folge-Termin",
        ],
        specific_use_cases: [
          "Nach Discovery-Call: 60s Sprachnotiz statt 15min Eintraege",
          "Vor Folge-Call: Briefing aus letzten 3 Aktivitaeten in 30s",
        ],
      },
      personas: {
        personas: [
          {
            type: "user",
            cares_about: "Weniger Admin-Zeit, mehr Verkaufszeit",
            challenge: "CRM-Pflege wird vergessen oder zu spaet gemacht",
            value_promise: "60s Sprachnotiz erspart 15 Min CRM-Klickerei",
          },
          {
            type: "decision_maker",
            cares_about: "Pipeline-Hygiene, Forecasts auf realer Datenbasis",
            challenge: "Reporting-Daten sind unvollstaendig oder veraltet",
            value_promise: "Echtzeit-Pipeline durch Voice-First-Capture",
          },
        ],
      },
      painPoints: {
        core_challenge:
          "Vertriebsteams pflegen CRM nach, wenn ueberhaupt — Daten sind unvollstaendig oder veraltet.",
        why_current_solutions_fall_short:
          "Klassische CRMs verlangen manuelle Eingabe, die im hektischen Vertriebsalltag hinten runter faellt.",
        costs: {
          time: "10-15h/Woche pro Vertriebler fuer CRM-Admin",
          money: "Fehlende Forecasts kosten 5-15% Pipeline-Visibility",
          opportunities: "Verpasste Follow-ups durch fehlenden Kontext",
        },
        emotional_tension:
          "Vertriebsleiter wollen Daten sehen, Vertriebler wollen verkaufen — beide frustriert.",
      },
      competitiveLandscape: {
        direct_competitors: [
          { name: "Salesforce", falls_short: "Schwer, 6-12 Monate Setup, kein Voice-First" },
        ],
        secondary_competitors: [],
        indirect_competitors: [],
      },
      differentiation: {
        key_differentiators: [
          "Voice-First-Capture (60s statt 15min)",
          "Auto-Strukturierung via LLM",
        ],
        how_we_do_it_differently:
          "Speech-to-Text + LLM-Strukturierung in 30s vs. 15min manuelle CRM-Eintraege.",
        why_thats_better:
          "10x schnellere Pflege bei gleicher Datenqualitaet — Vertriebler nutzen es WIRKLICH.",
        why_customers_choose_us:
          "Endlich CRM-Hygiene ohne Vertriebler-Frust",
      },
      objections: {
        top_objections: [
          {
            objection: "Sprachnotiz ist nicht praezise genug",
            response:
              "Whisper + Claude liefern 95%+ Praezision; manuell ist meist NULL Eintrag, also faktisch schlechter.",
          },
        ],
        anti_persona:
          "Reine Inbound-SaaS ohne aktiven Vertrieb — die brauchen kein CRM.",
      },
      switchingDynamics: {
        push: "Forecasting-Meetings werden zur Datenarchaeologie",
        pull: "Pipeline ist immer aktuell, ohne Druck auf Vertriebler",
        habit:
          "Vertriebsteam ist gewohnt, CRM-Pflege als laestige Pflicht zu sehen — nicht als Werkzeug",
        anxiety: "Was wenn die Sprachnotiz falsch interpretiert wird?",
      },
      customerLanguage: {
        verbatim_problem_phrases: [
          "Ich kriege das CRM einfach nicht aktuell",
          "Wir verbringen mehr Zeit mit Klickerei als Verkaufen",
          "Forecasts sind immer geraten",
        ],
        verbatim_solution_phrases: [
          "Endlich kann ich nach dem Call einfach reden",
          "Die Pipeline ist auf einmal richtig aktuell",
          "Mein Sales-Team nutzt das CRM tatsaechlich",
        ],
        words_to_use: [],
        words_to_avoid: [],
        glossary: [],
      },
      brandVoice: {
        tone: "Direkt, pragmatisch, ohne Bullshit-Bingo",
        communication_style:
          "Praezise, deutsche Sales-Realitaet, keine Buzzwords",
        personality: ["pragmatisch", "kompetent", "direkt"],
      },
      proofPoints: {
        metrics: [
          {
            claim: "10x schnellere CRM-Pflege",
            evidence:
              "Eigener Pilot mit 8 SDRs: 12h/Woche → 75min/Woche fuer CRM-Admin (Q1/2026 Daten)",
          },
        ],
        notable_customers: [],
        testimonials: [],
        value_themes: [],
      },
      goals: {
        primary_business_goal: "10 zahlende Pilot-Kunden bis Q3/2026",
        key_conversion_action: "Buchung 30-Min-Demo-Call",
        current_metrics: null,
      },
    },
  };
}

describe("Brand Profile Schema — Top-Level", () => {
  it("akzeptiert ein vollstaendiges valides Profile", () => {
    const result = brandProfileDataSchema.safeParse(validProfile());
    expect(result.success).toBe(true);
  });
});

describe("Section 1 — Product Overview", () => {
  it("erlaubt alle Pflichtfelder", () => {
    expect(
      section1Schema.safeParse(validProfile().sections.productOverview).success
    ).toBe(true);
  });

  it("schlaegt fehl wenn one_line_description fehlt", () => {
    const data = validProfile().sections.productOverview as Record<string, unknown>;
    delete data.one_line_description;
    expect(section1Schema.safeParse(data).success).toBe(false);
  });

  it("schlaegt fehl bei invalidem product_type-Enum", () => {
    const data = { ...validProfile().sections.productOverview, product_type: "Banane" };
    expect(section1Schema.safeParse(data).success).toBe(false);
  });
});

describe("Section 2 — Target Audience", () => {
  it("akzeptiert valide Daten", () => {
    expect(section2Schema.safeParse(validProfile().sections.targetAudience).success).toBe(true);
  });

  it("schlaegt fehl bei < 2 jobs_to_be_done", () => {
    const data = {
      ...validProfile().sections.targetAudience,
      jobs_to_be_done: ["nur einer"],
    };
    expect(section2Schema.safeParse(data).success).toBe(false);
  });

  it("schlaegt fehl bei > 3 jobs_to_be_done", () => {
    const data = {
      ...validProfile().sections.targetAudience,
      jobs_to_be_done: ["a", "b", "c", "d"],
    };
    expect(section2Schema.safeParse(data).success).toBe(false);
  });
});

describe("Section 3 — Personas", () => {
  it("akzeptiert user + decision_maker als Mindest-Set", () => {
    expect(section3Schema.safeParse(validProfile().sections.personas).success).toBe(true);
  });

  it("schlaegt fehl wenn 'user' fehlt", () => {
    const data = validProfile().sections.personas;
    data.personas = data.personas.filter((p) => p.type !== "user");
    // Topup auf min 2:
    data.personas.push({
      type: "champion",
      cares_about: "X",
      challenge: "Y",
      value_promise: "Z",
    });
    expect(section3Schema.safeParse(data).success).toBe(false);
  });

  it("schlaegt fehl wenn 'decision_maker' fehlt", () => {
    const data = validProfile().sections.personas;
    data.personas = data.personas.filter((p) => p.type !== "decision_maker");
    data.personas.push({
      type: "champion",
      cares_about: "X",
      challenge: "Y",
      value_promise: "Z",
    });
    expect(section3Schema.safeParse(data).success).toBe(false);
  });

  it("erlaubt zusaetzliche Personas neben dem Pflicht-Paar", () => {
    const data = validProfile().sections.personas;
    data.personas.push({
      type: "champion",
      cares_about: "X",
      challenge: "Y",
      value_promise: "Z",
    });
    expect(section3Schema.safeParse(data).success).toBe(true);
  });
});

describe("Section 4 — Pain Points", () => {
  it("akzeptiert valide Daten", () => {
    expect(section4Schema.safeParse(validProfile().sections.painPoints).success).toBe(true);
  });

  it("schlaegt fehl wenn costs.money fehlt", () => {
    const data = validProfile().sections.painPoints;
    delete (data.costs as Record<string, unknown>).money;
    expect(section4Schema.safeParse(data).success).toBe(false);
  });
});

describe("Section 5 — Competitive Landscape", () => {
  it("akzeptiert mit nur direct_competitors", () => {
    expect(section5Schema.safeParse(validProfile().sections.competitiveLandscape).success).toBe(true);
  });

  it("schlaegt fehl ohne direct_competitors", () => {
    const data = { ...validProfile().sections.competitiveLandscape, direct_competitors: [] };
    expect(section5Schema.safeParse(data).success).toBe(false);
  });
});

describe("Section 6 — Differentiation", () => {
  it("akzeptiert valide Daten", () => {
    expect(section6Schema.safeParse(validProfile().sections.differentiation).success).toBe(true);
  });

  it("schlaegt fehl bei leerem key_differentiators", () => {
    const data = { ...validProfile().sections.differentiation, key_differentiators: [] };
    expect(section6Schema.safeParse(data).success).toBe(false);
  });
});

describe("Section 7 — Objections", () => {
  it("akzeptiert valide Daten", () => {
    expect(section7Schema.safeParse(validProfile().sections.objections).success).toBe(true);
  });

  it("schlaegt fehl bei > 3 Objections", () => {
    const obj = { objection: "x", response: "y" };
    const data = {
      ...validProfile().sections.objections,
      top_objections: [obj, obj, obj, obj],
    };
    expect(section7Schema.safeParse(data).success).toBe(false);
  });
});

describe("Section 8 — Switching Dynamics", () => {
  it("akzeptiert valide Daten", () => {
    expect(section8Schema.safeParse(validProfile().sections.switchingDynamics).success).toBe(true);
  });

  it("schlaegt fehl wenn anxiety fehlt", () => {
    const data = validProfile().sections.switchingDynamics as Record<string, unknown>;
    delete data.anxiety;
    expect(section8Schema.safeParse(data).success).toBe(false);
  });
});

describe("Section 9 — Customer Language", () => {
  it("akzeptiert min. 3 problem + 3 solution phrases", () => {
    expect(section9Schema.safeParse(validProfile().sections.customerLanguage).success).toBe(true);
  });

  it("schlaegt fehl bei < 3 verbatim_problem_phrases", () => {
    const data = {
      ...validProfile().sections.customerLanguage,
      verbatim_problem_phrases: ["nur 1", "nur 2"],
    };
    expect(section9Schema.safeParse(data).success).toBe(false);
  });

  it("schlaegt fehl bei < 3 verbatim_solution_phrases", () => {
    const data = {
      ...validProfile().sections.customerLanguage,
      verbatim_solution_phrases: ["nur 1", "nur 2"],
    };
    expect(section9Schema.safeParse(data).success).toBe(false);
  });
});

describe("Section 10 — Brand Voice", () => {
  it("akzeptiert 3-5 Personality-Adjektive", () => {
    expect(section10Schema.safeParse(validProfile().sections.brandVoice).success).toBe(true);
  });

  it("schlaegt fehl bei < 3 Personality-Adjektive", () => {
    const data = { ...validProfile().sections.brandVoice, personality: ["nur", "zwei"] };
    expect(section10Schema.safeParse(data).success).toBe(false);
  });

  it("schlaegt fehl bei > 5 Personality-Adjektive", () => {
    const data = {
      ...validProfile().sections.brandVoice,
      personality: ["a", "b", "c", "d", "e", "f"],
    };
    expect(section10Schema.safeParse(data).success).toBe(false);
  });
});

describe("Section 11 — Proof Points", () => {
  it("akzeptiert mit min. 1 Metric", () => {
    expect(section11Schema.safeParse(validProfile().sections.proofPoints).success).toBe(true);
  });

  it("akzeptiert mit min. 1 Testimonial (statt Metric)", () => {
    const data = {
      metrics: [],
      testimonials: [{ quote: "Top Tool", attribution: "Max M., VP Sales" }],
      notable_customers: [],
      value_themes: [],
    };
    expect(section11Schema.safeParse(data).success).toBe(true);
  });

  it("schlaegt fehl ohne Metric UND ohne Testimonial", () => {
    const data = { metrics: [], testimonials: [], notable_customers: [], value_themes: [] };
    expect(section11Schema.safeParse(data).success).toBe(false);
  });
});

describe("Section 12 — Goals", () => {
  it("akzeptiert valide Daten", () => {
    expect(section12Schema.safeParse(validProfile().sections.goals).success).toBe(true);
  });

  it("akzeptiert null fuer current_metrics", () => {
    const data = { ...validProfile().sections.goals, current_metrics: null };
    expect(section12Schema.safeParse(data).success).toBe(true);
  });

  it("schlaegt fehl wenn primary_business_goal fehlt", () => {
    const data = validProfile().sections.goals as Record<string, unknown>;
    delete data.primary_business_goal;
    expect(section12Schema.safeParse(data).success).toBe(false);
  });
});

describe("validProfile-Helper bleibt intern konsistent (Top-Level Re-Validation)", () => {
  it("durchlaeuft brandProfileDataSchema komplett", () => {
    expect(brandProfileDataSchema.safeParse(validProfile()).success).toBe(true);
  });
});
