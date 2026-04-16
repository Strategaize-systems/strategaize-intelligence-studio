# SLC-005 — FEAT-007 Customer Deployment Registry

## Status
- Version: V1
- Feature: BL-008 / FEAT-007
- Priority: High
- Status: planned
- Created: 2026-04-16
- Worktree isolation: optional

## Goal
Deployment-Entität pro Kunde + CRUD-UI + Update-Rollout-Ansicht, damit Support und Roll-outs auf Basis echter Deployment-Daten planbar sind. Keine Secrets in IS.

## Warum vor Portfolio-Monitor
FEAT-003 Portfolio-Monitor braucht Deployment-Daten für die Detail-Ansicht. Registry muss daher zuerst laufen.

## In Scope
- CRUD-UI unter `/deployments` (Layout 3 List-Variante, keine Deutschland-Karte)
- Deployment-Entität nach MIG-001: `deployment_type`, `hoster`, `host_identifier`, `access_method`, `active_modules` (JSONB), `code_version`, `last_updated_at`, `config_notes`, `status`
- Validierungen (FEAT-007 AC):
  - `deployment_type = self_hosted` → `host_identifier` Pflicht
  - `access_method` darf keine Secrets enthalten (regex-Block: `(password|token|key|secret|api_key)\s*[=:]`)
- Modal-System (aus SLC-002) für Create/Edit
- `deployment_version_history` Audit-Trail: bei jedem UPDATE wird alte Row-Version in History geschrieben (Trigger-Option oder App-Layer)
- Update-Rollout-Ansicht unter `/deployments/rollout` (Layout 3 List + Filter):
  - Filter: „Version X?", „Seit > N Tagen nicht aktualisiert?"
  - Gruppierung nach `deployment_type`
  - CSV-Export

## Out of Scope
- Automatische Version-Erkennung per API-Call zum Kundensystem (V2)
- Health-Checks der Kunden-Deployments (V2)
- Update-Trigger / Auto-Deploy aus IS (V3)
- Alerts bei veralteten Versionen (V2)
- Template-Modus (V3)

## Acceptance Criteria (aus FEAT-007)
- AC-01: Neues Deployment pro Kunde anlegbar (alle Felder)
- AC-02: Validierung `self_hosted` → `host_identifier` Pflicht
- AC-03: `access_method` Secret-Pattern-Block greift
- AC-04: Update-Rollout-Ansicht filtert nach Version, Zeitraum, Typ
- AC-05: Änderungen versioniert (History verfügbar)
- AC-06: Kunde ohne Deployment wird in FEAT-003 trotzdem angezeigt (Vorbereitung SLC-006)
- AC-07: CSV-Export funktioniert und enthält alle Filter-gesetzten Rows

## Dependencies
- SLC-001 (Schema + Auth)
- SLC-002 (Layout 3 + Modal + FormField)
- SLC-004 (Customer-Cache aus Business-Ingest als Auswahl-Quelle für `customer_id`)

## Risks
- Secret-Pattern-Block kann false-positives haben → klare Fehlermeldung mit Beispiel
- History-Trigger vs. App-Layer — Trigger ist robuster, App-Layer flexibler. Entscheidung in MT-2.
- Deployment ohne Customer (temporär) → UI muss klar sein, dass `customer_id` gesetzt werden muss

## Micro-Tasks

### MT-1: Customer-Entität + Mapping
- Goal: `customer` Tabelle als IS-eigene Kundenreferenz mit Link zu `business_company_cache.company_id`. Seed aus vorhandenen Business-Cache-Einträgen.
- Files: `sql/migrations/002_customer_mapping.sql`, `apps/web/src/lib/data/customer.ts`.
- Expected behavior: `customer`-Rows existieren für jeden aktiven Business-Company. Einmaliger Sync-Job (kann später via Cron automatisiert werden).
- Verification: SQL-Query zeigt Customer-Count = Company-Cache-Count.
- Dependencies: SLC-004.

### MT-2: Deployment-CRUD-UI
- Goal: `/deployments`-Liste, `/deployments/new` und `/deployments/[id]/edit` als Modal-Flows. Form-Validierung client- und serverseitig.
- Files: `apps/web/src/app/(app)/deployments/page.tsx`, `DeploymentTable.tsx`, `DeploymentForm.tsx`, `deploymentFormSchema.ts` (zod), `apps/web/src/app/api/deployments/route.ts`, `apps/web/src/app/api/deployments/[id]/route.ts`.
- Expected behavior: Liste mit Layout 3. Create/Edit über Modal. zod-Schema validiert. Secret-Pattern-Block greift.
- Verification: Browser-Test aller Pflicht-/Optionalfelder, Validierungs-Fehler sichtbar.
- Dependencies: MT-1, SLC-002 MT-5.

### MT-3: History / Audit
- Goal: `deployment_version_history` wird bei jedem UPDATE geschrieben. Entscheidung DB-Trigger (robuster) oder App-Layer (flexibler).
- Files: `sql/migrations/003_deployment_history_trigger.sql` (falls Trigger), oder `apps/web/src/lib/data/deployment-history.ts` (falls App-Layer), `HistoryTab.tsx` in Detail-Ansicht.
- Expected behavior: Jedes UPDATE erzeugt eine History-Row mit Before/After + Actor-ID.
- Verification: UPDATE auslösen, History-Zeile prüfen.
- Dependencies: MT-2.

### MT-4: Update-Rollout-Ansicht + CSV-Export
- Goal: `/deployments/rollout` mit Filter (Version, Alter, Typ) + CSV-Export.
- Files: `apps/web/src/app/(app)/deployments/rollout/page.tsx`, `RolloutFilters.tsx`, `RolloutTable.tsx`, `apps/web/src/app/api/deployments/export/route.ts`.
- Expected behavior: Filter-Kombinationen funktionieren, Export triggert Download.
- Verification: Browser-Test, CSV-Inhalt spot-checked.
- Dependencies: MT-2.

### MT-5: RLS-Policies prüfen
- Goal: `strategaize_admin` + `tenant_admin` dürfen schreiben, `tenant_member` nur lesen.
- Files: (Policies bereits in MIG-001, hier Verifikations-Tests) `apps/web/src/lib/data/deployment.test.ts`.
- Expected behavior: SAVEPOINT-Test mit Member-Role, INSERT wirft RLS-Error.
- Verification: Test grün.
- Dependencies: MT-2.

## Verification
- `/qa` nach Slice-Abschluss
- Secret-Pattern-Block mit Test-Cases (Positiv + Negativ)
- RLS-Tests im Test-Suite
- Browser-Test CRUD-Flows + CSV-Export

## Next Slice
SLC-006 FEAT-003 Portfolio-Monitor.
