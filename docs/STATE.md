# STATE

## Project
- Name: StrategAIze Intelligence Studio
- Repository: strategaize-intelligence-studio
- Delivery Mode: internal-tool

## Purpose
System 3 der StrategAIze-Gesamtarchitektur. **V1 ist der Marketing Launcher (Closed Loop Lite)**: ein geschlossener Marketing-Funnel mit Brand Profile (12-Sektionen-Schema), 7 Content-Output-Typen, ICP/Segment, Lead Research (Firecrawl + Clay-CSV), 4-Level-personalisierten Pitches, Campaign Lite, Pipeline-Push ans Business System und Performance-Capture-Loop. Spaeter: Voll-Tracking, Multi-Channel-Publishing, Wissensverdichtungs-Backbone (V6, ehemals V1), Validation, Orchestration.

Referenz: `/strategaize-dev-system/docs/PLATFORM.md`.

## Current State
- High-Level State: implementing
- Current Focus: SLC-101 Foundation komplett (alle 10 MTs done inkl. MT-2 Hetzner-Migration auf 2026-04-29). Hetzner-Server `is-coolify-nbg1` (162.55.216.180, CPX42, Ubuntu 24.04) mit Coolify v4.0.0 + Supabase-Stack (14 Container healthy) live. MIG-001 + MIG-002 erfolgreich applied (19 Tabellen public-Schema, 3 Enums, RLS auf allen V1-Tabellen, alle 4 kritischen Indizes). Naechster Schritt: `/qa SLC-101` (mandatory per CLAUDE.md), danach Worktree-Branch mergen + `/backend SLC-102` (Brand Profile FEAT-008).
- Current Phase: V1 Marketing Launcher Implementation (SLC-101 done; bereit fuer /qa)

## Immediate Next Steps
1. `/qa SLC-101` — mandatory per CLAUDE.md, mit echten DB-Tests gegen die neue Hetzner-Supabase (TEST_DATABASE_URL via coolify-test-setup-Pattern). Erwartung: Singleton/Dedupe/Idempotency-Constraints, RLS-Policies, 21 unit-tests + 4 DB-tests gruen.
2. **DNS-Records** anlegen (User klickt): is.strategaizetransition.com → 162.55.216.180 (Coolify-Proxy regelt subdomain → Service). Konkrete Eintraege werden im Anschluss geliefert sobald User DNS-Provider bestaetigt.
3. Worktree-Branch `worktree/slc-101-foundation` nach `/qa`-Pass mergen in master.
4. Danach `/backend SLC-102` (Brand Profile FEAT-008, mandatory worktree).
5. **Parallel BL-028:** Firecrawl-Self-Host auf Hetzner (vor SLC-105).
6. **Parallel BL-027:** Business-System Coordination-Sprint (POST `/api/internal/deals` + INTERNAL_API_TOKEN). Vor V1-Final-Check.
7. Slice-Reihenfolge bleibt: SLC-101 → 102 → 103 → 104 → (BL-028 fertig) → 105 → 106 → 107 → 108.

## Active Scope
**V1 (active):** Marketing Launcher Closed Loop Lite — 7 Features (FEAT-008/009/010/011/014/015/016). Requirements + Architecture + Slice-Planning + SLC-101 Foundation umgesetzt 2026-04-28 (Code-only; Hetzner-Migration MT-2 ausstehend).

**V2..V9+ (planned):** Siehe `/planning/roadmap.json`.

Pivot-Begruendung 2026-04-25: Ohne Marketing Launcher keine Interessenten -> ohne Interessenten keine Kunden -> ohne Kunden keine Customer-Cases -> ohne Customer-Cases ist die Wissensverdichtung leerer Speicher. Marketing Launcher V1 ist Lead-Generator fuer StrategAIze selbst.

## Blockers
- aktuell keine

## Last Stable Version
- none yet

## Notes
- Foundation-Refresh-Slice SLC-101 wurde realiter zum Initial-Setup-Slice — vor SLC-101 existierte kein `src/`, `package.json`, `worker/`, `sql/`. Spec-Wording "Refresh" war irrefuehrend; Inhalt + Acceptance bleiben gleich. Lesson kommt in IMP-XXX.
- Die im Slice-Spec referenzierte Rule `coolify-test-setup.md` wurde am 2026-04-28 im Dev-System angelegt (vorher nur als Memory). Damit ist die Pflichtlektuere vollstaendig.
- MIG-001 wurde nie als SQL geschrieben — V1-Subset (`ai_jobs`, `ai_cost_ledger`, `audit_log`, `auth.user_role()`, `ai_job_type_enum` mit V6-Werten) liegt jetzt unter `sql/migrations/001_v1_foundation.sql`. Volles MIG-001 mit den 14 V6-Tabellen wandert in V6-Slice-Planning.
- MIG-002 enthaelt 16 V1-Tabellen + 2 neue Enums + 3 neue ai_job_type-Werte + Indizes + RLS (V1 single-tenant: alle authenticated User haben Vollzugriff; tenant-scoping kommt mit V8+).
- Spec-Foundation V1: `reference/corey-haines-marketing-skills/` (geklont, MIT-Lizenz, gitignored gemaess DEC-021).
- Style Guide V2 (DEC-017) bleibt verbindlich. Komponenten + Layouts in `src/components/design-system/` + `src/components/layouts/`. Showcase-Seite unter `/[locale]/_design-system`.
- Worker-Skeleton in `worker/` mit 4 V1-Handlern + 3 V6-Stubs. Alle wirft "not implemented" oder "FEATURE_KNOWLEDGE_BACKBONE_ENABLED=false".
- 4 Adapter-Skeletons in `src/adapters/{firecrawl,clay-csv,business-pipeline,linkedin-ads-csv}/` + bedrock + shared/audit-logger + cost-tracker.
- Feature-Flags in `src/lib/featureFlags.ts` + `.env.example` mit allen V1-ENV-Vars.
- Tests: 21 unit-tests passed (featureFlags, adapter-skeleton-interfaces, jobDispatcher), 4 DB-tests skipped (TEST_DATABASE_URL fehlt — laufen erst nach MT-2).
- DEC-005 (Qualified-Lead-Inbox) bleibt durch DEC-022 (Pipeline-Push) abgeloest.
- ESLint v9 mit flat-config (typescript-eslint), Next 16 hat `next lint` entfernt — Workaround per `npm run lint = eslint .`.
- Next 16 hat `middleware`-Convention deprecated zugunsten `proxy`. V1 nutzt noch middleware.ts, Migration zu proxy.ts in V2-Followup-Sprint.
