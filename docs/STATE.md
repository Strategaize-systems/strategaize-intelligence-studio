# STATE

## Project
- Name: StrategAIze Intelligence Studio
- Repository: strategaize-intelligence-studio
- Delivery Mode: internal-tool

## Purpose
System 3 der StrategAIze-Gesamtarchitektur. **V1 ist der Marketing Launcher (Closed Loop Lite)**: ein geschlossener Marketing-Funnel mit Brand Profile (12-Sektionen-Schema), 7 Content-Output-Typen, ICP/Segment, Lead Research (Firecrawl + Clay-CSV), 4-Level-personalisierten Pitches, Campaign Lite, Pipeline-Push ans Business System und Performance-Capture-Loop. Spaeter: Voll-Tracking, Multi-Channel-Publishing, Wissensverdichtungs-Backbone (V6, ehemals V1), Validation, Orchestration.

Referenz: `/strategaize-dev-system/docs/PLATFORM.md`.

## Current State
- High-Level State: architecture
- Current Focus: V1 Architecture-Addendum abgeschlossen 2026-04-26. ARCHITECTURE.md V2.1-Addendum (Sektionen A.1-A.14) + MIG-002 (16 neue V1-Tabellen) + 7 neue ADRs (DEC-023..029) + 4 Spec-Snapshots in docs/spec-references/. Pre-Implementation-Verifikationen BL-025 (Firecrawl) + BL-026 (Business-Pipeline-API) abgeschlossen mit kritischen Erkenntnissen: Firecrawl-Cloud = US-gehostet (DEC-028 Self-Host), Business-System hat keinen POST-Endpoint (DEC-029 Coordination-Sprint via BL-027). ISSUE-001 als resolved markiert (DEC-022/Pipeline-Push), ISSUE-002 + ISSUE-003 neu. Naechster Skill-Schritt: `/slice-planning V1`.
- Current Phase: V1 Marketing Launcher Slice-Planning

## Immediate Next Steps
1. `/slice-planning V1` — finale 8 Slices SLC-101..108 mit Micro-Task-Decomposition pro Slice. Slice-Vorschlag bereits in ARCHITECTURE.md Sektion A.13 + slices/INDEX.md.
2. **Pre-Implementation-Bridges** (vor SLC-105 + V1-Final-Check):
   - **BL-028** Firecrawl-Self-Host-Setup (eigener Hetzner-Container/Server mit Auth-Token + Smoke-Test) — Pre-Condition fuer SLC-105
   - **BL-027** Business-System Coordination-Sprint (POST `/api/internal/deals` + INTERNAL_API_TOKEN) im Business-Repo — Pre-Condition fuer V1-Final-Check / Go-Live, parallel zu V1-IS-Implementation
3. `/backend SLC-101` Foundation-Refresh: MIG-002 ausfuehren auf Hetzner, Style-Guide-V2-Component-Verzeichnis pruefen (DEC-017), Adapter-Skeletons anlegen (firecrawl, clay-csv, business-pipeline, linkedin-ads-csv).
4. Nach jedem V1-Slice: `/qa` pflichtgemaess (CLAUDE.md).
5. Vor `/final-check V1`: Gesamt-QA ueber alle 8 Slices + BL-027 abgeschlossen + Feature-Flag `BUSINESS_PIPELINE_PUSH_ENABLED` aktiv + 1 erfolgreicher Pipeline-Push verifiziert.
6. Nach Final-Check: `/go-live V1` -> `/deploy V1` -> `/post-launch V1`.

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
