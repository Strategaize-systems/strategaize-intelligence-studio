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
- Current Focus: SLC-102 Brand Profile **Backend-QA PASS 2026-05-04** (RPT-014, branch `worktree/slc-102-brand-profile`). 5 von 7 Micro-Tasks im Backend-Scope sind PASS: MT-1 Zod-Schema, MT-2 Repository + Server Actions, MT-5 Prompt-Builder, MT-6 Completeness-Logik, MT-7 RLS-Tests. 81 Unit-Tests + 9 DB-Integration-Tests gegen Coolify-DB gruen, Build/Lint/Typecheck clean, Stub-Scan clean. Findings: 1 Medium (ISSUE-008 Atomicity), 2 Low (ISSUE-009 Action-API, ISSUE-010 Sektion-Summary) — alle non-blocking, V1.1+ deferred. UI-Tasks (MT-3 Accordion, MT-4 Changelog-Tab, MT-5 PromptSnippetPreview) bleiben fuer `/frontend SLC-102`. Naechster Schritt: `/frontend SLC-102` im selben Worktree.
- Current Phase: V1 Marketing Launcher Implementation (SLC-101 done, SLC-102 backend QA PASS)

## Immediate Next Steps
1. `/frontend SLC-102` (UI-Tasks MT-3 + MT-4 + MT-5 PromptSnippetPreview, mandatory worktree). Style Guide V2 Pflicht. ISSUE-009 + ISSUE-010 dort beruecksichtigen.
2. Nach `/frontend SLC-102`: `/qa SLC-102` (Frontend-Teil) + Komplett-/qa.
3. Worktree `worktree/slc-102-brand-profile` mergen nach `master` nach komplettem /qa.
4. **Parallel BL-028:** Firecrawl-Self-Host auf Hetzner (vor SLC-105).
5. **Parallel BL-027:** Business-System Coordination-Sprint (POST `/api/internal/deals` + INTERNAL_API_TOKEN). Vor V1-Final-Check.
6. Slice-Reihenfolge bleibt: SLC-101 ✅ → 102 (Backend-QA PASS, Frontend offen) → 103 → 104 → (BL-028 fertig) → 105 → 106 → 107 → 108.

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
