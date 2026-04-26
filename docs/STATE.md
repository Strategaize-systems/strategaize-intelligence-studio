# STATE

## Project
- Name: StrategAIze Intelligence Studio
- Repository: strategaize-intelligence-studio
- Delivery Mode: internal-tool

## Purpose
System 3 der StrategAIze-Gesamtarchitektur. **V1 ist der Marketing Launcher (Closed Loop Lite)**: ein geschlossener Marketing-Funnel mit Brand Profile (12-Sektionen-Schema), 7 Content-Output-Typen, ICP/Segment, Lead Research (Firecrawl + Clay-CSV), 4-Level-personalisierten Pitches, Campaign Lite, Pipeline-Push ans Business System und Performance-Capture-Loop. Spaeter: Voll-Tracking, Multi-Channel-Publishing, Wissensverdichtungs-Backbone (V6, ehemals V1), Validation, Orchestration.

Referenz: `/strategaize-dev-system/docs/PLATFORM.md`.

## Current State
- High-Level State: requirements
- Current Focus: V1 Requirements abgeschlossen 2026-04-26 als Pivot zum Marketing Launcher (Closed Loop Lite). 7 V1-Features spezifiziert (FEAT-008 Brand Profile, FEAT-009 Content Asset Production, FEAT-010 ICP & Segment, FEAT-011 Campaign LITE, FEAT-014 Pipeline-Push + Performance-Capture, FEAT-015 Lead Research, FEAT-016 Messaging-Variation). Spec-Foundation = coreyhaines31/marketingskills (MIT). Naechster Skill-Schritt: `/architecture V1`.
- Current Phase: V1 Marketing Launcher Planning

## Immediate Next Steps
1. `/architecture V1` — Addendum zu ARCHITECTURE.md V2 (kein Rewrite). Neue Tabellen: brand_profile (JSONB-Singleton), asset + asset_version + asset_performance (mit source_skill-Feld, 7 Output-Typen), lead + research_run (FEAT-015), pitch + pitch_version (FEAT-016), handoff_event (FEAT-014, Pipeline-Push), campaign + campaign_asset/lead/pitch (FEAT-011 LITE), erweiterte icp + segment (FEAT-010). Neue Adapter: firecrawlAdapter, clayCsvAdapter, businessPipelineAdapter, linkedinAdsCsvAdapter. Open Questions OQ-A1..A5 aus PRD klaeren.
2. **Pre-Implementation-Verifikationen** (BL-025 + BL-026): Firecrawl EU-Hosting + DPA verifizieren (vor SLC-005). Business-Pipeline-API-Endpoint im Business System verifizieren (vor SLC-008).
3. `/slice-planning V1` — geplant 8 Slices (Setup + Brand Profile + Content Asset Production + ICP/Segment + Lead Research + Messaging-Variation + Campaign Lite + Lead Handoff/Performance), mit Micro-Task-Decomposition pro Slice.
4. `/backend SLC-001` Project Setup & Foundation Refresh (auch wenn Foundation bereits aus altem Slicing existiert — V1-Marketing-Launcher-Schema-Erweiterungen einarbeiten).
5. Nach jedem V1-Slice: `/qa` pflichtgemaess (CLAUDE.md).
6. Vor `/final-check V1`: Gesamt-QA ueber alle 8 Slices.

## Active Scope
**V1 (active):** Marketing Launcher Closed Loop Lite — 7 Features (FEAT-008/009/010/011/014/015/016). Requirements abgeschlossen 2026-04-26. Architektur-Addendum, Slice-Planning, Implementation, QA, Final-Check, Go-Live, Deploy, Post-Launch stehen aus.

**V2 (planned):** E-Mail-Versand-Adapter mit Open-Tracking (Postmark EU primaer, DEC-013).

**V3 (planned):** Voll-Lead-Research + Lead-Scoring (FEAT-013 regelbasiert + Disqualifier, Voll-Firecrawl-Adapter mit Webhook).

**V4 (planned):** LinkedIn-Publishing + Multi-Channel-Distribution (FEAT-011 Voll-Variant mit Channel-Segments + Variants, LinkedIn-Adapter, High-Attention-Outreach).

**V5 (planned):** Voll-Tracking + KI-Scoring + A/B-Statistik (Tracking-Event-Schema Hybrid DEC-015, KI-Scoring loest V3 ab).

**V6 (planned, ehemals V1):** Wissensverdichtungs-Backbone — FEAT-001..007 (Onboarding-Ingest, Business-Ingest, Portfolio-Monitor, Insight-Layer, Opportunity-Decision, Cross-Kunden-Learnings, Customer Deployment Registry). Specs existieren, bleiben gueltig.

**V7 (planned):** Validation & Idea Testing (Experiment-Entitaet, 6 Research-Typen aus archiviertem alten FEAT-012).

**V8 (planned):** Orchestration & Decision Layer (Hybrid-Cockpit DEC-007).

**V9+ (planned):** Multi-Tenant + SMAO-API + Auto-Anonymisierung + Deal-Attribution + weitere Kanaele.

Pivot-Begruendung 2026-04-25: Ohne Marketing Launcher keine Interessenten -> ohne Interessenten keine Kunden -> ohne Kunden keine Customer-Cases -> ohne Customer-Cases ist die Wissensverdichtung leerer Speicher. Marketing Launcher V1 ist Lead-Generator fuer StrategAIze selbst.

## Blockers
- aktuell keine

## Last Stable Version
- none yet

## Notes
- Spec-Foundation V1: `reference/corey-haines-marketing-skills/` (geklont, MIT-Lizenz, gitignored gemaess DEC-021). Setup-Anweisung: `reference/SETUP.md`. Spec-Extraktionen kommen schrittweise in `docs/spec-references/` waehrend `/architecture V1`.
- ARCHITECTURE.md V2 (13 Sektionen) bleibt Foundation — V1 braucht Addendum, keinen Rewrite.
- MIG-001 Schema-Baseline (17 Tabellen, RLS, ai_jobs, ai_cost_ledger) bleibt gueltig.
- Style Guide V2 (DEC-017) bleibt verbindlich.
- DEC-001..019 bleiben gueltig. DEC-020+021+022 ergaenzt 2026-04-26. **DEC-005 (Qualified-Lead-Inbox) wurde durch DEC-022 (Pipeline-Push) abgeloest.**
- Alte V1-Slices SLC-001..010 sind als deprecated markiert in `slices/INDEX.md` — sie waren fuer das alte Wissensverdichtungs-V1 (jetzt V6) gedacht.
- Hosting/Provider: EU-only, Bedrock eu-central-1, Firecrawl-EU-Hosting vor SLC-005 zu verifizieren.
- Worker/Queue: `ai_jobs` mit `SKIP LOCKED` (DEC-008) — neue Job-Types ab V1: `asset_generation`, `pitch_generation`, `lead_research_run`.
- Feature-Specs FEAT-001..007 existieren bereits unter `/features/` und bleiben fuer V6 gueltig (werden in V6-Slice-Planning zugeschnitten).
- Backlog: BL-024 (personalisierter Sales-Pitch) ist auf `in_progress` gesetzt — wird auf `done` gesetzt sobald FEAT-016 V1-released. Neue BL-025 (Firecrawl-EU-Verifikation) und BL-026 (Pipeline-API-Verifikation) als Pre-Implementation-Aufgaben.
