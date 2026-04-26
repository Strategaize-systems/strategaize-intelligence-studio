# Brand Profile — 12-Sektionen-Schema (Snapshot)

## Quelle

`reference/corey-haines-marketing-skills/skills/product-marketing-context/SKILL.md` (MIT-Lizenz, coreyhaines31/marketingskills, version 1.1.0). Snapshot-Datum: 2026-04-26.

## Zweck im V1

V1-Datenmodell `brand_profile.data` (JSONB) folgt diesem Schema 1:1. Bedrock-Calls fuer FEAT-009 Content Asset Production und FEAT-016 Messaging-Variation erhalten dieses JSONB als System-Prompt-Kontext mit skill-spezifischer Sektion-Hervorhebung.

## Schema (12 Sektionen)

### Sektion 1: Product Overview
- `one_line_description` (text)
- `what_it_does` (text, 2-3 Saetze)
- `product_category` (text — "Regal", in dem Kunden suchen)
- `product_type` (enum: SaaS, Marketplace, E-Commerce, Service, Internal-Tool, Other)
- `business_model` (text — Pricing-Logik kurz)

### Sektion 2: Target Audience
- `target_company_type` (object: industry, size_band, stage)
- `target_decision_makers` (array of objects: role, department)
- `primary_use_case` (text — Hauptproblem das geloest wird)
- `jobs_to_be_done` (array of text, 2-3 Items)
- `specific_use_cases` (array of text — konkrete Szenarien)

### Sektion 3: Personas (B2B)
Pro Persona-Typ ein Object mit Pflichtfeldern `cares_about`, `challenge`, `value_promise`. Persona-Typen:
- `user`
- `champion`
- `decision_maker` (V1-Pflicht zusammen mit `user`)
- `financial_buyer`
- `technical_influencer`

### Sektion 4: Problems & Pain Points
- `core_challenge` (text)
- `why_current_solutions_fall_short` (text)
- `costs` (object: time, money, opportunities)
- `emotional_tension` (text)

### Sektion 5: Competitive Landscape
- `direct_competitors` (array of objects: name, falls_short)
- `secondary_competitors` (array of objects: name, falls_short)
- `indirect_competitors` (array of objects: name, falls_short)

### Sektion 6: Differentiation
- `key_differentiators` (array of text)
- `how_we_do_it_differently` (text)
- `why_thats_better` (text — konkrete Benefits)
- `why_customers_choose_us` (text — verbatim wenn moeglich)

### Sektion 7: Objections & Anti-Personas
- `top_objections` (array of objects: objection, response, max 3)
- `anti_persona` (text — wer ist NICHT gut geeignet)

### Sektion 8: Switching Dynamics (JTBD Four Forces)
- `push` (text — was treibt weg von aktueller Loesung)
- `pull` (text — was zieht zu uns)
- `habit` (text — was haelt an alter Loesung fest)
- `anxiety` (text — was beunruhigt am Wechsel)

### Sektion 9: Customer Language
- `verbatim_problem_phrases` (array of text, mind. 3)
- `verbatim_solution_phrases` (array of text, mind. 3)
- `words_to_use` (array of text)
- `words_to_avoid` (array of text)
- `glossary` (array of objects: term, definition)

### Sektion 10: Brand Voice
- `tone` (text)
- `communication_style` (text)
- `personality` (array of text, 3-5 Adjektive)

### Sektion 11: Proof Points
- `metrics` (array of objects: claim, evidence)
- `notable_customers` (array of text)
- `testimonials` (array of objects: quote, attribution)
- `value_themes` (array of objects: theme, proof)

### Sektion 12: Goals
- `primary_business_goal` (text)
- `key_conversion_action` (text — z.B. "Buchung Demo-Call")
- `current_metrics` (object NULL — falls bekannt)

## Skill-spezifische Sektion-Hervorhebung (V1-Bedrock-Prompts)

| FEAT | Skill | Hervorgehobene Sektionen |
|---|---|---|
| FEAT-009 Blogpost | copywriting | 4, 6, 9, 10 |
| FEAT-009 LinkedIn-Post | social-content | 2, 9, 10 |
| FEAT-009 One-Pager | sales-enablement | 4, 6, 11 |
| FEAT-009 E-Mail-Vorlage | cold-email | 4, 8, 9, 11 |
| FEAT-009 Case Card | sales-enablement | 11 (Testimonials, Metrics) |
| FEAT-009 Landingpage-Briefing | copywriting + page-cro | 1, 6, 11 |
| FEAT-009 Multi-Page-Website-Spec | site-architecture | 1, 2, 6 |
| FEAT-016 Cold-Email-Pitch | cold-email | 4, 8, 9, 11 |
| FEAT-016 LinkedIn-Pitch | social-content | 2, 9, 10 |

## Lizenz

MIT — coreyhaines31/marketingskills. Snapshot-Auszug zulaessig. Original-Datei in `reference/corey-haines-marketing-skills/skills/product-marketing-context/SKILL.md`.
