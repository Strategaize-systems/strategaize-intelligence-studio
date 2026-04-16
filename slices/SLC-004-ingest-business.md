# SLC-004 — FEAT-002 Ingest-Layer Business

## Status
- Version: V1
- Feature: BL-003 / FEAT-002
- Priority: High
- Status: planned
- Created: 2026-04-16
- Worktree isolation: optional

## Goal
Pull-basierter Import von Kontakten, Unternehmen und Deals (`active` + `won`, DEC-016) aus Business V4 REST-API, stündlich, fehlertolerant gegen fehlende Entitäten. Admin-Ansicht-Erweiterung mit Business-Source.

## In Scope
- `businessAdapter.pullContacts(since)`, `pullCompanies(since)`, `pullDeals(since, status=['active','won'])` — Shadow-Ingest nach DEC-016
- Worker-Handler `handlers/ingestBusiness.ts` — Multi-Entity-Pull + UPSERT in `business_contact_cache`, `business_company_cache`, `business_deal_cache`
- Coolify-Cron stündlich → POST `/api/cron/ingest-business` → `ai_jobs` INSERT
- Fehlertoleranz: fehlende Endpoints (z. B. Module-/Project-Endpoints in V4 noch nicht da) → Skip ohne Job-Fail, `ingest_error_log` mit `entity_type + skipped_reason`
- Erweiterung Admin-UI `/admin/ingest`: Filter nach Source (`onboarding` | `business`), Anzeige pro Entity-Type (Contacts/Companies/Deals) mit Count + Skipped-Count
- Cursor pro Entity-Typ in `ingest_run`

## Out of Scope
- Angebote-Ingest (V2+, DEC-016)
- Modul-/Project-Zuordnung (wartet auf Business-Erweiterung)
- Push/Webhook (V2)
- Rück-Schreiben in Business (außer Lead-Handoff, das ist V3)
- Signal-Mustererkennung via KI (V2)

## Acceptance Criteria
- AC-01: Kontakte und Unternehmen werden stündlich aktualisiert
- AC-02: Fehlender Endpoint (z. B. `/modules`) → Lauf erfolgreich, `skipped_reason` geloggt
- AC-03: Ingest-Log zeigt pro Entity-Type: geholt, übersprungen, Fehler
- AC-04: Business-Ausfall → nächster Zyklus ohne Datenverlust
- AC-05: Business-IDs sind in Cache-Tabellen referenziert, keine Duplikate
- AC-06: Kontakt/Unternehmen/Deal erscheinen im Portfolio-Monitor (SLC-006)
- AC-07: Deal-Filter greift: nur `status IN ('active', 'won')` in Cache

## Dependencies
- SLC-003 (Cron-Pattern + Admin-UI-Grundgerüst wiederverwenden)
- SLC-001 (businessAdapter-Skeleton)
- Business V4 REST-Zugang + Service-Token

## Risks
- Business-API-Schema kann sich mit V4.1/V4.2/V5 ändern → Adapter als Schutzschicht, Mapping zentral
- Deals mit fehlendem `status` → Default `'unknown'`, werden nicht in Cache aufgenommen
- Zeitzone-Mismatch beim Cursor → strikt UTC

## Micro-Tasks

### MT-1: businessAdapter erweitern
- Goal: 3 Pull-Methoden mit gemeinsamem `fetchJson`-Helper, strukturierte Error-Typen (`NETWORK_ERROR`, `ENDPOINT_NOT_FOUND`, `PARSE_ERROR`).
- Files: `apps/web/src/adapters/businessAdapter.ts`, `apps/web/src/adapters/businessAdapter.test.ts`.
- Expected behavior: `pullContacts({since, limit})` → `{items, next_cursor, has_more}`. `ENDPOINT_NOT_FOUND` als spezifisches Error.
- Verification: Unit-Tests mit Mock-Server.
- Dependencies: SLC-001 MT-5.

### MT-2: Worker-Handler `ingest_business`
- Goal: Multi-Entity-Ingest in definierter Reihenfolge (Companies → Contacts → Deals), Skip-Logik, Cursor-Update pro Entity.
- Files: `apps/worker/src/handlers/ingestBusiness.ts`, `apps/worker/src/handlers/ingestBusiness.test.ts`.
- Expected behavior: Ein Job verarbeitet alle 3 Entity-Types. Fehlender Endpoint → Skip, Job done.
- Verification: Integration-Test mit Mock + echter DB (SAVEPOINT-Pattern).
- Dependencies: MT-1.

### MT-3: Cron-Endpoint + Coolify-Cron stündlich
- Goal: Next.js Route `/api/cron/ingest-business` + Coolify-Cron-Dokumentation.
- Files: `apps/web/src/app/api/cron/ingest-business/route.ts`, `docs/coolify-cron.md` (ergänzen).
- Expected behavior: GET → 200 + `job_id`. Cron-Token-Guard.
- Verification: Manueller Call, Job erscheint in `ai_jobs`.
- Dependencies: MT-2.

### MT-4: Admin-UI-Erweiterung Source-Filter
- Goal: `/admin/ingest` um Source-Filter (`all` | `onboarding` | `business`) erweitern. Pro Row: Entity-Type-Breakdown.
- Files: `apps/web/src/app/(app)/admin/ingest/page.tsx` (Erweiterung), `IngestLogTable.tsx` (Erweiterung).
- Expected behavior: Filter wirkt, Entity-Breakdown sichtbar.
- Verification: Browser-Test.
- Dependencies: MT-3, SLC-003 MT-4.

## Verification
- `/qa` nach Slice-Abschluss
- End-to-End-Test mit Business-API-Mock
- Skipped-Endpoint-Simulation

## Next Slice
SLC-005 FEAT-007 Customer Deployment Registry.
