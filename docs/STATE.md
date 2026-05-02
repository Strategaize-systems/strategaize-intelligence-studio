# STATE

## Project
- Name: StrategAIze Intelligence Studio
- Repository: strategaize-intelligence-studio
- Delivery Mode: internal-tool

## Purpose
System 3 der StrategAIze-Gesamtarchitektur. **V1 ist der Marketing Launcher (Closed Loop Lite)**: ein geschlossener Marketing-Funnel mit Brand Profile (12-Sektionen-Schema), 7 Content-Output-Typen, ICP/Segment, Lead Research (Firecrawl + Clay-CSV), 4-Level-personalisierten Pitches, Campaign Lite, Pipeline-Push ans Business System und Performance-Capture-Loop. Spaeter: Voll-Tracking, Multi-Channel-Publishing, Wissensverdichtungs-Backbone (V6, ehemals V1), Validation, Orchestration.

Referenz: `/strategaize-dev-system/docs/PLATFORM.md`.

## Current State
- High-Level State: qa
- Current Focus: SLC-101 Foundation **/qa PASS** (RPT-012, 2026-04-29) + ISSUE-004 resolved (2026-04-29: Coolify-FQDN auf supabase-kong gesetzt, `https://is-api.strategaizetransition.com` liefert HTTP/2 401, Cert valide). 21/21 unit-tests + 5/5 SAVEPOINT-DB-Constraints + RLS-/GRANTs verifiziert + Stub-Scan clean + Wiring (TS-Types vs DB-Enum) match. 3 verbleibende Medium/Low-Findings (ISSUE-005 Browser-Smoke, ISSUE-006 Vitest-DB-Auto, ISSUE-007 middleware-deprecation) — alle non-blocking. Naechster Schritt: `/backend SLC-102` (Brand Profile FEAT-008).
- Current Phase: V1 Marketing Launcher Implementation (SLC-101 done; bereit fuer SLC-102)

## Immediate Next Steps
1. `/backend SLC-102` (Brand Profile FEAT-008, mandatory worktree). 12-Sektionen-JSONB-Singleton + Changelog + Vollstaendigkeits-Pruefung.
2. **Parallel BL-028:** Firecrawl-Self-Host auf Hetzner (vor SLC-105).
3. **Parallel BL-027:** Business-System Coordination-Sprint (POST `/api/internal/deals` + INTERNAL_API_TOKEN). Vor V1-Final-Check.
4. Slice-Reihenfolge bleibt: SLC-101 ✅ → 102 → 103 → 104 → (BL-028 fertig) → 105 → 106 → 107 → 108.

## Active Scope
**V1 (active):** Marketing Launcher Closed Loop Lite — 7 Features (FEAT-008/009/010/011/014/015/016). Requirements + Architecture + Slice-Planning + SLC-101 Foundation umgesetzt 2026-04-28 (Code-only; Hetzner-Migration MT-2 ausstehend).

**V2..V12+ (planned):** Siehe `/planning/roadmap.json`.

Pivot-Begruendung 2026-04-25: Ohne Marketing Launcher keine Interessenten -> ohne Interessenten keine Kunden -> ohne Kunden keine Customer-Cases -> ohne Customer-Cases ist die Wissensverdichtung leerer Speicher. Marketing Launcher V1 ist Lead-Generator fuer StrategAIze selbst.

**Discovery V6+ Venture-Layer 2026-05-02 (RPT-013) — Re-Numerierung scharfgeschaltet 2026-05-02:** Erweiterung der Intelligence Platform um eine Opportunity-&-Venture-Schicht beschlossen. **V1-V5 (Market Launcher) bleiben unangetastet** — und decken den im Discovery-Input als 'Market Launcher' beschriebenen Research-/Outreach-Apparat fuer den Venture-Bereich vollstaendig ab (FEAT-015 Lead Research + FEAT-010 ICP/Segment + FEAT-009 Content Asset Production). V6 leicht modifiziert (FEAT-005 raus). NEU eingefuehrt: V7 Venture Layer Foundation, V8 Venture Layer Erweitert, V9 Cross-System Integration. Re-Numerierung scharf: V7 alt (Validation) -> V10, V8 alt (Orchestration) -> V11, V9+ alt (Multi-Tenant) -> V12+. Cross-Repo-Vorbereitung: Onboarding-Plattform bekommt BL-070..075 fuer External-Validation-Capture-Mode (founder_assessment / operator_assessment / market_participant_interview / industry_expert_interview) — modulare Erweiterung ueber bestehende Capture-Mode-Hooks (FEAT-025), kein Re-Build, ~3-4 Wochen Implementation wenn IS V9 in Sicht ist.

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
- **2026-05-02 RPT-013 Discovery V6+ Venture-Layer**: BL-005 (FEAT-005 Opportunity & Decision basic) als deprecated markiert — Inhalt wandert in V7 Venture Layer Foundation. V6 Wording in roadmap.json aktualisiert (FEAT-005 raus, V6 bleibt Wissensverdichtungs-Backbone-Foundation). 15 neue BL-Items angelegt: BL-029..034 (V7), BL-035..039 (V8), BL-040..043 (V9). FEAT-005 Spec-Datei `/features/FEAT-005-opportunity-decision.md` bleibt als Vorlage fuer /requirements V7. **Re-Numerierung 2026-05-02 vom User bestaetigt und scharfgeschaltet** (alt-V7 -> V10 Validation, alt-V8 -> V11 Orchestration + Venture-Portfolio, alt-V9+ -> V12+ Multi-Tenant + Voice + Erweiterungen).
