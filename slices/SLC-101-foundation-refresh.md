# SLC-101 — Foundation Refresh

## Status
- Version: V1
- Status: planned
- Priority: Blocker
- Created: 2026-04-26
- Worktree: mandatory (`worktree/slc-101-foundation`)
- Feature: Setup (kein FEAT-Mapping, ist V1-Auftakt)

## Goal
V1-Marketing-Launcher-Foundation aufbauen: Project-Setup-Refresh, MIG-002 ausfuehren (16 neue Tabellen), Style-Guide-V2-Komponenten + 5 Layout-Templates verfuegbar machen, 4 neue Adapter-Skeletons anlegen, Worker-Job-Type-Enum erweitern, Feature-Flag-System aufsetzen. Nach SLC-101 koennen alle FEAT-Slices darauf aufbauen.

## In Scope
- MIG-002 SQL-Migration nach `/sql/migrations/002_v1_marketing_launcher_schema.sql` (16 Tabellen + 3 Enum-Werte + Indizes + RLS-Policies)
- Migration auf Hetzner gemaess `/strategaize-dev-system/.claude/rules/sql-migration-hetzner.md`
- Style-Guide-V2-Komponenten-Bibliothek: `Header`, `KPICard`, `FilterBar`, `VoiceButton`, `AIButton`, `StatusBadge`, `ContentCard`, `Modal`, Form-Komponenten unter `/src/components/design-system/`
- 5 Layout-Templates unter `/src/components/layouts/`: `Layout1Dashboard`, `Layout2MeinTag`, `Layout3Beziehungen`, `Layout4Pipeline`, `Layout5Aufgaben`
- Tailwind-Theme mit Brand-Farben in `tailwind.config.ts`
- 4 neue Adapter-Skeletons: `firecrawlAdapter`, `clayCsvAdapter`, `businessPipelineAdapter`, `linkedinAdsCsvAdapter` unter `/src/adapters/` (DEC-009-Pattern)
- Worker-Job-Type-Enum-Erweiterung: `asset_generation`, `pitch_generation`, `lead_research_run` (drei neue Handler als Skeletons unter `/worker/handlers/`)
- Feature-Flag-System: `FEATURE_MARKETING_LAUNCHER_ENABLED`, `FEATURE_KNOWLEDGE_BACKBONE_ENABLED`, `BUSINESS_PIPELINE_PUSH_ENABLED` in `.env.example` + Lese-Helper `/src/lib/featureFlags.ts`
- ENV-Konfiguration aus A.11: `FIRECRAWL_API_BASE_URL`, `BUSINESS_API_BASE_URL`, `BUSINESS_API_TOKEN`, `BUSINESS_PIPELINE_NAME`, `BUSINESS_STAGE_NAME`, `PERFORMANCE_FEWSHOT_N`, `RESEARCH_RUN_COST_CAP_EUR`
- Bedrock-Adapter-Bestaetigung: bestehender `bedrockAdapter` ist V1-tauglich (DEC-002, eu-central-1)

## Out of Scope (V1)
- UI-Routen fuer Brand/ICP/Asset/Lead/Pitch/Campaign/Handoff (kommen in SLC-102..108)
- Adapter-Implementierungs-Logic (Skeletons reichen — Implementation in SLC-105 + SLC-108)
- BL-028 Firecrawl-Self-Host-Setup (eigene Coordination-Session)
- BL-027 Business-System-Coordination-Sprint (Business-Repo, parallel)
- Worker-Handler-Implementierungs-Logic (Skeletons reichen — Implementation in SLC-103, SLC-105, SLC-106)
- V6-Backbone-Aktivierung (`FEATURE_KNOWLEDGE_BACKBONE_ENABLED=false`)

## Acceptance Criteria
- MIG-002 erfolgreich auf Hetzner ausgefuehrt — alle 16 Tabellen mit RLS aktiv
- Singleton-Partial-Index auf `brand_profile(is_active) WHERE is_active=true` greift (Test: zweiter aktiver Insert schlaegt fehl)
- Lead-Duplikat-Constraint `UNIQUE (domain, COALESCE(contact_email, ''))` greift
- Idempotency-Constraint `UNIQUE handoff_event(lead_id, campaign_id)` greift
- 3 neue Enum-Werte in `ai_job_type_enum` verfuegbar (`SELECT enum_range(NULL::ai_job_type_enum)`)
- Style-Guide-V2-Showcase-Seite `/_design-system` rendert alle Komponenten (Smoke-Test)
- 5 Layout-Templates importierbar und gerendert in Showcase
- 4 Adapter-Skeletons importierbar mit definiertem Interface (selbst wenn `throw new Error('not implemented')`)
- 3 Worker-Handler-Skeletons im `jobDispatcher.ts` Switch-Case eingehaengt
- Feature-Flag-Helper `isFeatureEnabled(flag)` liest ENV korrekt aus
- Build gruen, Lint clean, keine TypeScript-Errors
- `npm run test` (falls eingerichtet) lauffaehig

## Micro-Tasks

### MT-1: SQL-Migration MIG-002 erstellen
- Goal: Idempotente SQL-Migration mit 16 Tabellen + 3 Enum-Werten + Indizes + RLS-Policies anlegen
- Files: `sql/migrations/002_v1_marketing_launcher_schema.sql`
- Expected behavior: Datei enthaelt CREATE TYPE fuer 2 neue Enums (`asset_output_type_enum`, `asset_source_skill_enum`), ALTER TYPE fuer 3 `ai_job_type_enum`-Werte, CREATE TABLE fuer 16 Tabellen (siehe MIG-002 in MIGRATIONS.md), CREATE INDEX (Singleton, Duplikat, Performance, Few-shot, Idempotency), RLS-Policies pro Tabelle nach Pattern aus MIG-001 (Sektion 5.5 ARCHITECTURE.md). Datei laeuft idempotent durch (CREATE IF NOT EXISTS wo moeglich, Enum-ADD-VALUE mit IF NOT EXISTS).
- Verification: Lokal Dry-Run gegen Coolify-Test-DB (siehe `/strategaize-dev-system/.claude/rules/coolify-test-setup.md`). Erfolgreich, wenn `\d brand_profile`, `\d lead`, `\d handoff_event` etc. die definierten Spalten zeigen.
- Dependencies: keine

### MT-2: Migration auf Hetzner ausfuehren
- Goal: MIG-002 auf Hetzner-Coolify-Supabase-Instanz produktiv anwenden
- Files: keine (DB-Aenderung)
- Expected behavior: Migration uebertragen via Base64 + ausgefuehrt als `postgres`-User gemaess `sql-migration-hetzner.md`. Vorher: Container-Name ermitteln. Nachher: alle 16 Tabellen via `\dt` sichtbar, Enum-Werte verfuegbar.
- Verification: `docker exec -i <supabase-db-container> psql -U postgres -d postgres -c "\dt brand_profile asset lead handoff_event"` zeigt Tabellen. `SELECT enum_range(NULL::ai_job_type_enum)` zeigt 6+ Werte (drei neue + bestehende).
- Dependencies: MT-1

### MT-3: Style-Guide-V2-Komponenten-Bibliothek aufsetzen
- Goal: Alle Style-Guide-V2-Pflichtkomponenten als React-Komponenten verfuegbar
- Files: `src/components/design-system/Header.tsx`, `KPICard.tsx`, `FilterBar.tsx`, `VoiceButton.tsx`, `AIButton.tsx`, `StatusBadge.tsx`, `ContentCard.tsx`, `Modal.tsx`, `FormField.tsx`, `Button.tsx`, `Input.tsx`, `Textarea.tsx`, `Select.tsx`, `Checkbox.tsx`, `index.ts` (Re-Exports)
- Expected behavior: Komponenten folgen STYLE_GUIDE_V2.md-Tokens (Farben, Spacing, Typografie). Tailwind-Klassen, keine Inline-Styles. Props sind getypt.
- Verification: `npm run build` gruen. Showcase-Seite (MT-5) rendert ohne Fehler.
- Dependencies: keine (parallel zu MT-1)

### MT-4: 5 Layout-Templates anlegen
- Goal: 5 Layout-Templates aus Style Guide V2 als Wrapper-Komponenten
- Files: `src/components/layouts/Layout1Dashboard.tsx`, `Layout2MeinTag.tsx`, `Layout3Beziehungen.tsx`, `Layout4Pipeline.tsx`, `Layout5Aufgaben.tsx`, `index.ts`
- Expected behavior: Jedes Layout nimmt `children` + Layout-spezifische Props (Sidebar-Items, Header-Title, etc.). Renderbar auch ohne Daten.
- Verification: Import in Showcase-Seite (MT-5) rendert alle 5 Layouts.
- Dependencies: MT-3

### MT-5: Design-System-Showcase-Seite
- Goal: Eine Seite, auf der alle Komponenten + Layouts gerendert sind, fuer Smoke-Test und Referenz
- Files: `src/app/_design-system/page.tsx`
- Expected behavior: Listet alle Komponenten mit Beispiel-Props, alle 5 Layouts mit Demo-Content. Kein Routing-Konflikt mit normalen Routen (deshalb `_design-system`).
- Verification: `npm run dev` und Browser-Aufruf `/[locale]/_design-system` zeigt alles.
- Dependencies: MT-3 + MT-4

### MT-6: Tailwind-Theme + Brand-Farben
- Goal: Tailwind-Config mit Brand-Tokens aus Style Guide V2
- Files: `tailwind.config.ts`
- Expected behavior: `theme.extend.colors.brand`, `theme.extend.fontFamily`, `theme.extend.spacing` gemaess Style-Guide-V2.
- Verification: Komponenten in MT-3 nutzen `bg-brand-primary` und renderen korrekt.
- Dependencies: keine (parallel)

### MT-7: 4 Adapter-Skeletons
- Goal: Adapter-Pattern-Skeletons gemaess DEC-009 + ARCHITECTURE A.6
- Files:
  - `src/adapters/firecrawl/client.ts`, `query-builder.ts`, `types.ts`, `index.ts`
  - `src/adapters/clay-csv/parser.ts`, `schema.ts`, `types.ts`, `index.ts`
  - `src/adapters/business-pipeline/client.ts`, `status-pull.ts`, `types.ts`, `index.ts`
  - `src/adapters/linkedin-ads-csv/parser.ts`, `types.ts`, `index.ts`
  - `src/adapters/shared/audit-logger.ts`, `cost-tracker.ts`
- Expected behavior: Jeder Adapter exportiert eine Funktion/Klasse mit definierter Signatur (siehe FEAT-Specs Architektur-Hinweise). Body wirft `throw new Error('not implemented')`. Audit/Cost-Helper sind funktional implementiert (schreiben in `audit_log` + `ai_cost_ledger`).
- Verification: TypeScript-Build gruen. Imports aus `@/adapters/firecrawl` etc. funktionieren.
- Dependencies: keine (parallel zu MT-3..6)

### MT-8: Worker-Job-Type-Erweiterung + Handler-Skeletons
- Goal: Drei neue Handler-Skeletons im Worker eingehaengt
- Files:
  - `worker/handlers/assetGeneration.ts` — neu
  - `worker/handlers/pitchGeneration.ts` — neu
  - `worker/handlers/leadResearchRun.ts` — neu
  - `worker/jobDispatcher.ts` — Switch-Case erweitert
- Expected behavior: Jeder Handler hat Signatur `async function handle(job: Ai_Job): Promise<void>`, wirft initial `throw new Error('not implemented')`. Dispatcher routet Job-Type korrekt.
- Verification: Worker startet ohne Fehler. Job-Insert mit neuem Type wird erkannt (auch wenn er failt mit not-implemented). Test: `INSERT INTO ai_jobs (job_type, payload) VALUES ('asset_generation', '{}')` und Worker-Log zeigt Dispatch-Versuch.
- Dependencies: MT-2 (Enum muss existieren)

### MT-9: Feature-Flag-System
- Goal: Zentralisierter Lese-Helper fuer Feature-Flags
- Files: `src/lib/featureFlags.ts`, `.env.example` (erweitert), `.env.local.example` falls vorhanden
- Expected behavior: `isFeatureEnabled(flag: keyof FeatureFlags): boolean` liest aus `process.env`. Default-Werte aus A.11. Type-safe.
- Verification: `isFeatureEnabled('FEATURE_MARKETING_LAUNCHER_ENABLED')` in einer Test-Route gibt `true` zurueck. `isFeatureEnabled('BUSINESS_PIPELINE_PUSH_ENABLED')` gibt `false` zurueck initial.
- Dependencies: keine

### MT-10: Build + Smoke-Verifikation + Commit
- Goal: Alles zusammen verifizieren und in einer atomaren Commit-Reihenfolge sichern
- Files: keine (Verifikation)
- Expected behavior: `npm run build`, `npm run lint`, `npm run typecheck` (falls eingerichtet) gruen. Showcase-Seite rendert. Worker startet. DB-Tabellen vorhanden.
- Verification: Alle Befehle exit-code 0. Manueller Browser-Smoke-Test der Showcase-Seite.
- Dependencies: MT-2 + MT-5 + MT-7 + MT-8 + MT-9

## TDD-Policy (Internal-Tool, Pflicht-Bereiche)
- **Pflicht-TDD:**
  - RLS-Policies (SAVEPOINT-Tests gegen Coolify-Test-DB pro Tabelle, mind. 1 Test je Helper-Funktion `auth.user_tenant_id()` + `auth.user_role()`)
  - Singleton-Partial-Index (Test: zweiter Insert mit `is_active=true` schlaegt fehl)
  - Duplikat-Constraint Lead (Test: `(domain, NULL contact_email)` Duplikat schlaegt fehl)
  - Idempotency-Constraint Handoff (Test: zweiter Push mit gleichem `(lead_id, campaign_id)` schlaegt fehl)
  - Adapter-Skeleton-Interfaces (Test: Import + Signatur-Check pro Adapter)
- **Empfohlen:**
  - Feature-Flag-Helper (Unit-Test mit Mock-ENV)
  - Layout-Templates (Snapshot-Test)
- **Nicht-TDD:**
  - Showcase-Seite (Visuelle Inspection reicht)
  - Tailwind-Theme (Build-Verifikation reicht)

Test-Files: `__tests__/migrations/002_*.test.ts`, `__tests__/adapters/{firecrawl,clay-csv,business-pipeline,linkedin-ads-csv}.test.ts`, `__tests__/lib/featureFlags.test.ts`

## Risiken
- **R1 Migration-Reihenfolge**: 16 Tabellen mit FK-Beziehungen erfordern korrekte Reihenfolge. Mitigation: SQL nach Dependency-Graph sortiert (FK-leere zuerst: `brand_profile`, `icp`, dann abhaengige).
- **R2 RLS-Policy-Vollstaendigkeit**: 16 Tabellen × 3-4 Policies = ~50 Policies. Mitigation: Pattern aus MIG-001 1:1 wiederverwenden + automatisierte Generation in der SQL-Datei.
- **R3 Style-Guide-V2-Tokens nicht 1:1 ableitbar**: Manche Tokens evtl. unklar. Mitigation: STYLE_GUIDE_V2.md (im IS-Repo unter `/docs/`) als Single Source — bei Unklarheit am Ende dokumentieren statt raten.

## Worktree
Mandatory. Branch `worktree/slc-101-foundation`. Nach erfolgreichem `/qa SLC-101` mergen.

## Verifikations-Schritte (vor `/qa`)
1. MIG-002 Hetzner-Verifikation: `\dt`, `\d brand_profile`, `\d lead`, `\d handoff_event`, `SELECT enum_range(NULL::ai_job_type_enum)`
2. Build/Lint/Typecheck: `npm run build && npm run lint && npm run typecheck`
3. Tests (falls eingerichtet): `npm run test`
4. Showcase-Smoke: Browser `/[locale]/_design-system`
5. Worker-Start: Container startet, Log zeigt 3 neue Handler registriert

## Recommended Next Step
Nach `/qa SLC-101`: `/backend SLC-102` (Brand Profile).

## Referenzen
- ARCHITECTURE.md A.3 (Datenmodell), A.4 (Job-Types), A.5 (Adapter), A.6 (Verzeichnis-Layout), A.7 (UI-Routen — wird in spaeteren Slices), A.11 (Feature-Flags)
- MIGRATIONS.md MIG-002 (Tabellen-Detail)
- DEC-009 Provider-Adapter-Pattern, DEC-017 Style Guide V2 verbindlich, DEC-023..029 V1-Schema-Entscheidungen
- `/strategaize-dev-system/.claude/rules/sql-migration-hetzner.md`
- `/strategaize-dev-system/.claude/rules/coolify-test-setup.md`
