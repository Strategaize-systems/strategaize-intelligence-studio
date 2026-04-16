# SLC-001 — Project Setup & Foundation

## Status
- Version: V1
- Feature: BL-001 (umfasst Foundation für FEAT-001..007)
- Priority: Blocker
- Status: planned
- Created: 2026-04-16
- Worktree isolation: empfohlen (`slc-001-setup`)

## Goal
Next.js 16+ App + Worker + Supabase-Stack lauffähig auf Coolify inkl. Auth, Schema-Baseline (MIG-001) und Adapter-Skeletons. Danach kann jeder Folge-Slice direkt Feature-Arbeit leisten.

## In Scope
- Next.js 16+ Repo-Skelett (App Router, React 19, TypeScript, Tailwind, shadcn/ui) unter `/apps/web` (oder flach, Entscheidung in MT-1)
- Worker-Container unter `/apps/worker` mit `jobDispatcher.ts` + `ai_jobs`-Polling mit `SKIP LOCKED`
- Supabase-Self-hosted-Stack via Coolify (8 Container: db, kong, auth, rest, realtime, storage, studio, meta)
- MIG-001 Initial Schema Baseline: 17 Tabellen + RLS + Helper-Funktionen (`auth.user_tenant_id`, `auth.user_role`) + `template_id UUID NULL`
- Auth-Setup: Supabase GoTrue, 3 Rollen (`strategaize_admin`, `tenant_admin`, `tenant_member`)
- `bedrockAdapter`-Skeleton (Client + Cost-Logging + Audit-Log), keine Produktiv-Calls
- `onboardingAdapter` + `businessAdapter`-Skeletons (leere Methoden, werden in SLC-003/004 befüllt)
- Feature-Flags in `.env.example` (`FEATURE_CAMPAIGN_ENABLED=false`, `FEATURE_PUBLISHING_ENABLED=false`, …)
- Docker-Compose + Coolify-Resource angelegt (Auto-Deploy AUS, DEC-018)
- URL-Strategie dokumentiert + umgesetzt (intern `http://supabase-kong:8000`, extern `https://is.strategaizetransition.com` — DEC-019)
- Basis-Layout `app/(app)/layout.tsx` mit leerer Auth-Guard-Komponente
- Landing-/Login-Seite minimal (volle Styling-Arbeit passiert in SLC-002)

## Out of Scope
- Alle Feature-UIs (folgen in SLC-003..SLC-009)
- Voll-Komponentenbibliothek und Layout-Templates (SLC-002)
- Ingest-Business-Logik (SLC-003/004)
- Produktiv-Bedrock-Calls (SLC-008)
- QA-Dokumentation über Setup hinaus (SLC-010)

## Acceptance Criteria
- AC-01: `docker compose up` lokal oder Coolify-Deploy starten App + Worker + Supabase erfolgreich, Health-Check grün
- AC-02: `https://is.strategaizetransition.com` erreichbar, Login mit Seed-Admin funktioniert
- AC-03: MIG-001 ausgeführt, alle 17 Tabellen + RLS verifiziert (SAVEPOINT-Tests grün)
- AC-04: Worker pollt `ai_jobs` mit `SKIP LOCKED`, Dummy-Job `noop` wird claimed + done
- AC-05: `bedrockAdapter.scoreDummy()` (Skeleton) schreibt Eintrag in `ai_cost_ledger` + `audit_log`
- AC-06: GitHub-Repo verbunden, Coolify-Resource existiert, Auto-Deploy-Toggle AUS
- AC-07: Feature-Flags aus `.env` werden von App + Worker beim Start geladen und geloggt
- AC-08: Seed-Skript legt mindestens einen `strategaize_admin`-User an

## Dependencies
- GitHub-Repo (erledigt: `Strategaize-systems/strategaize-intelligence-studio`)
- Coolify-Zugang auf Hetzner-Server
- Bedrock-Credentials in Coolify-ENV (BEDROCK_REGION, BEDROCK_ACCESS_KEY_ID, BEDROCK_SECRET_ACCESS_KEY)
- Onboarding-Plattform-Repo als Worker-Pattern-Referenz (`/strategaize-onboarding-plattform/`)

## Risks
- Docker-Compose-Netzwerk-Config (interner vs. externer Host) — Onboarding-Muster 1:1 übernehmen
- Kong-Key-Auth-Env-Substitution (`${VAR}` wird nicht automatisch aufgelöst) — dev-system-Regel beachten
- Migrations-Reihenfolge: Helper-Funktionen vor Policies

## Micro-Tasks

### MT-1: Repo-Skelett + Next.js + Worker-Layout
- Goal: `/apps/web` + `/apps/worker` + Root-Monorepo-Config (npm workspaces oder flache Struktur — Entscheidung hier), `package.json` mit Scripts, `tsconfig.json`, `eslint.config.mjs`.
- Files: `package.json`, `tsconfig.base.json`, `apps/web/package.json`, `apps/web/next.config.mjs`, `apps/web/tsconfig.json`, `apps/worker/package.json`, `apps/worker/tsconfig.json`, `apps/worker/src/index.ts`, `.gitignore`, `.nvmrc`.
- Expected behavior: `npm install` läuft, `npm run build` bei leerem Zustand grün, keine Runtime-Logik.
- Verification: `npm run build`, `npm run typecheck` ohne Fehler.
- Dependencies: none.

### MT-2: Docker-Compose + Coolify-Resource
- Goal: Compose-Stack für app + worker + Supabase, Coolify-Resource mit Auto-Deploy AUS.
- Files: `docker-compose.yml`, `docker-compose.prod.yml`, `docker/app/Dockerfile`, `docker/worker/Dockerfile`, `docker/supabase/kong.yml`, `.env.example`.
- Expected behavior: `docker compose up` bringt alle Container hoch, Health-Checks vorhanden.
- Verification: `docker compose config` valid, lokaler `docker compose up` erreicht App auf `:3000`, Supabase-Kong auf `:8000`.
- Dependencies: MT-1.

### MT-3: MIG-001 SQL + RLS + Helper
- Goal: SQL-File für alle 17 Tabellen + RLS-Policies + Helper-Funktionen. Idempotent.
- Files: `sql/migrations/001_initial_baseline.sql`, `sql/migrations/README.md`.
- Expected behavior: Ausführung auf leerer DB erzeugt 17 Tabellen + alle Policies. Re-Run wirft keinen Fehler.
- Verification: `docker exec -i supabase-db-... psql -U postgres -d postgres < sql/migrations/001_initial_baseline.sql` grün. `\dt` zeigt 17 Tabellen. RLS-SAVEPOINT-Test (Dev-System `coolify-test-setup` Muster) mit einem Fake-User grün.
- Dependencies: MT-2.

### MT-4: Supabase-Client + Auth-Setup
- Goal: Server- und Client-Supabase-Client, Auth-Guard, 3 Rollen als JWT-Claims, Seed-Script.
- Files: `apps/web/src/lib/supabase/server.ts`, `apps/web/src/lib/supabase/browser.ts`, `apps/web/src/lib/auth/guard.ts`, `apps/web/src/app/(app)/layout.tsx`, `apps/web/src/app/login/page.tsx`, `sql/seeds/001_admin_user.sql`.
- Expected behavior: Login mit Magic-Link + Passwort, `user_metadata.role` gesetzt, Auth-Guard leitet Nicht-Authentifizierte auf `/login`.
- Verification: Login lokal funktioniert, Cookie gesetzt, geschützte Route fordert Login.
- Dependencies: MT-3.

### MT-5: bedrockAdapter-Skeleton + ai_jobs-Worker
- Goal: Bedrock-Client mit `invokeModel`-Wrapper (noch kein echter Call in V1, nur Skeleton + Cost-Log), Worker-Dispatcher mit Dummy-`noop`-Handler.
- Files: `apps/web/src/adapters/bedrockAdapter.ts`, `apps/web/src/adapters/onboardingAdapter.ts`, `apps/web/src/adapters/businessAdapter.ts`, `apps/worker/src/jobDispatcher.ts`, `apps/worker/src/handlers/noop.ts`, `apps/worker/src/lib/claimJob.ts`.
- Expected behavior: Worker pollt alle 2s, Dummy-Job mit `job_type='noop'` wird claimed + done. Bedrock-Skeleton-Call erzeugt Eintrag in `ai_cost_ledger` (dummy tokens/costs).
- Verification: Manueller `INSERT INTO ai_jobs (job_type, payload) VALUES ('noop', '{}')`. Nach < 5s `status='done'`. `ai_cost_ledger` hat Eintrag.
- Dependencies: MT-4.

### MT-6: Coolify-Wire-Up + Prod-Deploy-Verifikation
- Goal: Coolify-Resource konfiguriert, ENVs gesetzt, erster manueller Deploy durchgeführt.
- Files: `docs/deployment.md`, `.env.example` (final), Coolify-Seite (kein Repo-File).
- Expected behavior: `https://is.strategaizetransition.com/login` ist live. Health-Check-Endpoint `/api/health` antwortet 200.
- Verification: Browser-Test Login-Seite, `curl https://is-api.strategaizetransition.com/rest/v1/` mit Kong-Key gibt 200.
- Dependencies: MT-5.

## Verification
- `/qa` nach Slice-Abschluss (CLAUDE.md Mandatory-QA-Regel)
- RLS-Policies mit SAVEPOINT-Tests (`coolify-test-setup` + `sql-migration-hetzner` Regeln)
- Build-Test: `npm run build` grün für app + worker
- Browser-Smoke-Test: Login + `/api/health`

## Next Slice
SLC-002 Design-System-Grundstock.
