# STATE

## Project
- Name: StrategAIze Intelligence Studio
- Repository: strategaize-intelligence-studio
- Delivery Mode: internal-tool

## Purpose
System 3 der StrategAIze-Gesamtarchitektur. **V1 ist der Marketing Launcher (Closed Loop Lite)**: ein geschlossener Marketing-Funnel mit Brand Profile (12-Sektionen-Schema), 7 Content-Output-Typen, ICP/Segment, Lead Research (Firecrawl + Clay-CSV), 4-Level-personalisierten Pitches, Campaign Lite, Pipeline-Push ans Business System und Performance-Capture-Loop. Spaeter: Voll-Tracking, Multi-Channel-Publishing, Wissensverdichtungs-Backbone (V6, ehemals V1), Validation, Orchestration.

Referenz: `/strategaize-dev-system/docs/PLATFORM.md`.

## Current State
- High-Level State: slice-planning
- Current Focus: V1 Slice-Planning abgeschlossen 2026-04-26. 8 Slice-Specs (SLC-101 Foundation, SLC-102 Brand Profile, SLC-103 Asset Production, SLC-104 ICP&Segment, SLC-105 Lead Research, SLC-106 Messaging-Variation, SLC-107 Campaign LITE, SLC-108 Lead Handoff+Performance) mit Micro-Task-Decomposition + TDD-Policy + Worktree-Empfehlung erstellt. Pre-Implementation-Bridges BL-028 (Firecrawl Self-Host vor SLC-105) + BL-027 (Business-Coordination-Sprint vor V1-Final-Check) als parallele Tasks im Backlog. RPT-010 dokumentiert. Naechster Skill-Schritt: `/backend SLC-101` (Foundation-Refresh + MIG-002 ausfuehren auf Hetzner).
- Current Phase: V1 Marketing Launcher Implementation (SLC-101 Foundation als naechster Schritt)

## Immediate Next Steps
1. **Parallel-Setup BL-028** (Pre-Condition fuer SLC-105): Firecrawl-Self-Host auf Hetzner einrichten (Container im Compose oder dedizierter Server, Auth-Token, Smoke-Test). Eigene kurze Setup-Session.
2. **Parallel-Coordination BL-027** (Pre-Condition fuer V1-Final-Check): Business-System-Sprint im strategaize-business-system Repo: POST `/api/internal/deals` + INTERNAL_API_TOKEN-Auth + Pipeline `Lead-Generierung` Stage `Neu`-Migration. Laeuft parallel zu V1-IS-Implementation.
3. `/backend SLC-101` Foundation-Refresh: MIG-002 ausfuehren auf Hetzner gemaess `sql-migration-hetzner.md`, Style-Guide-V2-Komponenten + 5 Layouts, 4 Adapter-Skeletons, Worker-Job-Type-Enum-Erweiterung, Feature-Flag-System.
4. Nach SLC-101: `/qa SLC-101` pflichtgemaess (CLAUDE.md), dann `/backend SLC-102` (Brand Profile).
5. Slice-Reihenfolge: SLC-101 → SLC-102 → SLC-103 → SLC-104 → (BL-028 fertig) → SLC-105 → SLC-106 → SLC-107 → SLC-108 (Manual-Mode V1-default, Flag scharf nach BL-027).
6. Vor `/final-check V1`: Gesamt-`/qa V1` ueber alle 8 Slices + BL-027 abgeschlossen + Feature-Flag `BUSINESS_PIPELINE_PUSH_ENABLED=true` + mind. 1 erfolgreicher Pipeline-Push verifiziert.
7. Nach Final-Check: `/go-live V1` → `/deploy V1` → `/post-launch V1`.

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
