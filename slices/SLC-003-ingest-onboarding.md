# SLC-003 — FEAT-001 Ingest-Layer Onboarding

## Status
- Version: V1
- Feature: BL-002 / FEAT-001
- Priority: High
- Status: planned
- Created: 2026-04-16
- Worktree isolation: optional

## Goal
Pull-basierter Import verdichteter Knowledge Units aus Onboarding-Plattform (SLC-010-Export-API) alle 10 Minuten inkrementell. Worker-Handler `ingest_onboarding` + Admin-Ansicht für Ingest-Log + manueller Trigger.

## In Scope
- `onboardingAdapter.pullDelta(since, limit)` — HTTP-Call gegen Onboarding-Export-API mit Cursor
- Worker-Handler `handlers/ingestOnboarding.ts` — Delta-Pull + UPSERT `knowledge_unit` + `ingest_run`-Update
- Coolify-Cron: alle 10 min → POST `/api/cron/ingest-onboarding` → `ai_jobs` INSERT
- Admin-UI `/admin/ingest` (Layout 5 Aufgaben-Liste): letzte 50 `ingest_run`-Einträge mit Duration, Count, Error, Status
- Button „Jetzt abrufen" → erzeugt manuellen `ai_jobs`-Eintrag
- Fehlerbehandlung: Netz-/API-Fehler → Exponential-Retry in `ai_jobs.attempts`. Datenfehler → `ingest_error_log` + Job `done`.
- Cursor-Management: letzter erfolgreicher Pull-Zeitpunkt pro Source in `ingest_run`
- Confidence-Enum (`low | medium | high`) kompatibel zu Onboarding

## Out of Scope
- Push/Webhook vom Onboarding (V2)
- Auto-Anreicherung via KI (V2)
- Rück-Schreiben in Onboarding (V2)
- Bulk-Backfill-UI (manuell per SQL falls nötig)

## Acceptance Criteria
- AC-01 (aus FEAT-001): Nach 10 min ist eine neue KU aus Onboarding in IS sichtbar
- AC-02: Onboarding-Ausfall → nächster Zyklus ohne Datenverlust
- AC-03: Admin-Ansicht zeigt Ingest-Log mit Laufzeit, Menge, Fehlern
- AC-04: Manueller Trigger erzeugt innerhalb 5s einen Job
- AC-05: Inkrementell: identischer Re-Run holt 0 neue KUs
- AC-06: UPSERT verhindert Duplikate bei KU-ID-Kollision
- AC-07: `ingest_error_log` erfasst fehlende Pflichtfelder mit `run_id + entity_type + field_name`

## Dependencies
- SLC-001 (Worker + `ai_jobs` + `onboardingAdapter`-Skeleton)
- SLC-002 (Layout 5 für Admin-Ansicht)
- Onboarding-SLC-010-Export-API erreichbar + Service-Token vorhanden

## Risks
- Onboarding-API-Schema noch unscharf — Adapter muss Feld-Mapping-Layer haben, damit Onboarding-Schema-Änderungen nur den Adapter brechen
- Cursor-Inkonsistenz bei Onboarding-Restart → Cursor-Reset-Option im Admin-UI

## Micro-Tasks

### MT-1: onboardingAdapter + HTTP-Client
- Goal: `onboardingAdapter.pullDelta({since, limit})` → `{items, next_cursor, has_more}`. Fehler → strukturierte Error-Typen.
- Files: `apps/web/src/adapters/onboardingAdapter.ts`, `apps/web/src/adapters/onboardingAdapter.test.ts`, `apps/web/src/lib/http/fetch.ts`.
- Expected behavior: HTTP-GET mit Bearer-Token, JSON-Parsing, Mapping auf internen KU-Typ.
- Verification: Unit-Tests mit `msw` oder `nock`-Mock.
- Dependencies: SLC-001 MT-5.

### MT-2: Worker-Handler `ingest_onboarding`
- Goal: Handler pollt Adapter in Schleife bis `has_more=false`, schreibt UPSERT in `knowledge_unit`, aktualisiert `ingest_run`.
- Files: `apps/worker/src/handlers/ingestOnboarding.ts`, `apps/worker/src/handlers/ingestOnboarding.test.ts`, `apps/worker/src/jobDispatcher.ts` (Dispatch-Eintrag).
- Expected behavior: Ein Job verarbeitet Delta-Pull in < 2 min bei < 500 neuen KUs.
- Verification: Manueller `ai_jobs`-INSERT, Worker verarbeitet, DB-Row-Count stimmt.
- Dependencies: MT-1.

### MT-3: Cron-Endpoint + Coolify-Cron
- Goal: Next.js Route `/api/cron/ingest-onboarding` erzeugt `ai_jobs`-Eintrag. Coolify-Cron triggert alle 10 min.
- Files: `apps/web/src/app/api/cron/ingest-onboarding/route.ts`, `docs/coolify-cron.md`.
- Expected behavior: GET → 200 + `job_id`. Cron-Token via Header gegen Missbrauch.
- Verification: Cron manuell triggern, Job wird erzeugt.
- Dependencies: MT-2.

### MT-4: Admin-UI `/admin/ingest`
- Goal: Seite mit Ingest-Log-Tabelle (letzte 50 `ingest_run`), Status-Badge, Button „Jetzt abrufen".
- Files: `apps/web/src/app/(app)/admin/ingest/page.tsx`, `IngestLogTable.tsx`, `TriggerButton.tsx`.
- Expected behavior: Tabelle mit Layout 5, Button erzeugt Job + zeigt Toast „Job angelegt".
- Verification: Browser-Test.
- Dependencies: MT-3, SLC-002.

### MT-5: Fehlertoleranz + Cursor-Reset
- Goal: `ingest_error_log` für fehlende Felder. Cursor-Reset-Button im Admin-UI mit Confirm-Dialog.
- Files: `apps/web/src/app/(app)/admin/ingest/CursorResetButton.tsx`, `apps/worker/src/handlers/ingestOnboarding.ts` (Error-Handling-Erweiterung).
- Expected behavior: Fehlendes Pflichtfeld → Log-Eintrag, Job done. Cursor-Reset → `ingest_run.cursor = NULL`.
- Verification: Manueller Test mit malformiertem Payload.
- Dependencies: MT-4.

## Verification
- `/qa` nach Slice-Abschluss
- Cron-Test lokal via manuellem HTTP-Call
- Browser-Test Admin-UI
- DB-Counts nach Pull verifiziert

## Next Slice
SLC-004 FEAT-002 Ingest-Business.
