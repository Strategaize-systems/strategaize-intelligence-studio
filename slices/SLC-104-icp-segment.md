# SLC-104 — ICP & Segment

## Status
- Version: V1
- Status: planned
- Priority: High
- Created: 2026-04-26
- Worktree: optional
- Feature: FEAT-010 (Backlog: BL-011)

## Goal
ICP-Definitions-UI (strukturierte 1:1-Mapping auf Brand-Profile-Sektionen 2+3) + Segment-Builder mit Live-Query-Filter ueber `lead`-Tabelle (V1 ohne segment_member-Materialisierung). Ermoeglicht "Aus Brand Profile uebernehmen"-Convenience und stellt Audience-Foundation fuer SLC-105 (Lead Research), SLC-106 (Pitch), SLC-107 (Campaign), SLC-108 (Handoff).

## In Scope
- ICP-Routen `/icp` (Layout3 List), `/icp/new`, `/icp/[id]` (Detail-Form mit "Aus Brand Profile uebernehmen")
- Segment-Routen `/segments` (Layout3 List mit Mitgliederzahl), `/segments/new`, `/segments/[id]` (Detail mit Filter-Builder + Lead-Liste-Tab)
- Server Actions `createIcp`, `updateIcp`, `deleteIcp`, `createSegment`, `updateSegment`, `deleteSegment`
- Filter-Definition-Builder (regelbasiert) mit JSON-Output
- Live-Query-Executor: wandelt JSON-Filter in SQL-WHERE auf `lead`-Tabelle um (kein segment_member-Table)
- "Aus Brand Profile uebernehmen"-Action: kopiert Sektion-2- + Sektion-3-Daten in ICP-Felder (Snapshot, kein Live-Sync)
- Manuelle Includes/Excludes pro Segment (Lead-IDs als Array)
- Cross-Link: ICP-Detail zeigt "Segmente, die dieses ICP nutzen"

## Out of Scope (V1)
- Dynamische Echtzeit-Aktualisierung (V5+)
- KI-generierte ICP-Vorschlaege (V8+)
- Marktgroesse-Auto-Berechnung (V9+)
- Multi-Tenant-ICP-Bibliothek (V9+)
- Auto-Resegmentierung (V5+)
- Business-Ingest-Kontakte als Segment-Quelle (V6)
- Segment-Snapshot mit `segment_member`-Table (V5+ wenn Tracking aktiv)

## Acceptance Criteria
- ICP mit allen Pflichtfeldern (FEAT-010 Spec) anlegbar
- "Aus Brand Profile uebernehmen" kopiert Sektion 2 + 3 → ICP-Felder
- Mehrere ICPs parallel anlegbar
- Persona-Set hat mind. User + Decision Maker (Validation)
- Segment kann aus ICP abgeleitet werden mit Filter-Regeln ueber Lead-Felder
- Segment-Mitglieder werden korrekt berechnet (Live-Query) — V1 vor SLC-105 leer, nach SLC-105 mit Lead-Pool
- Manuelle Includes / Excludes funktionieren
- UI zeigt Segment-Groesse (Live-Count)
- Filter-Regeln nach Erstellung editierbar
- ICP-Brand-Profile-Verknuepfung speichert `brand_profile_id` korrekt
- RLS: tenant_admin schreibt, tenant_member liest
- Build/Lint/Typecheck gruen, Tests gruen

## Micro-Tasks

### MT-1: Zod-Schemas + Server Actions ICP
- Goal: ICP-CRUD mit Validation
- Files: `src/lib/icp/schema.ts`, `src/server/icp/actions.ts`, `src/server/icp/repository.ts`, `__tests__/server/icp/{schema,actions}.test.ts`
- Expected behavior:
  - Zod-Schema enforced Pflichtfelder + Persona-Set-Mindestgroesse
  - Actions: `createIcp`, `updateIcp`, `deleteIcp`, `getIcpById`, `listIcps`
  - "Aus Brand Profile uebernehmen": Server-Helper `mapBrandProfileToIcp(brandProfile)` extrahiert Sektion 2 + 3 → ICP-Initial-Daten
- Verification: Tests fuer Validation + CRUD + Mapping
- Dependencies: SLC-102 (`getActiveBrandProfile`)
- TDD: Pflicht (Validation + Mapping deterministisch)

### MT-2: Zod-Schemas + Server Actions Segment + Filter-Definition
- Goal: Segment-CRUD mit JSON-Filter-Schema
- Files: `src/lib/segment/schema.ts`, `src/lib/segment/filterSchema.ts`, `src/server/segment/actions.ts`, `src/server/segment/repository.ts`, `__tests__/server/segment/*.test.ts`
- Expected behavior:
  - Filter-Schema: rekursive `{ op: 'AND'|'OR', children: [...] }` oder `{ op: 'EQ'|'IN'|'CONTAINS'|'GTE'|'LTE'|'BETWEEN', field: string, value: ... }`
  - Filter-Felder erlaubt: industry, country, company_size_band, revenue_band, status, tags, trigger_signals_matched
  - Actions: CRUD + `getSegmentMembers(segmentId): Promise<Lead[]>` (Live-Query)
- Verification: Tests fuer Filter-Validation + simple/nested Filter + Mitgliedschafts-Berechnung mit Sample-Leads
- Dependencies: MT-1
- TDD: Pflicht

### MT-3: Live-Query-Executor
- Goal: JSON-Filter → SQL-WHERE-Builder
- Files: `src/lib/segment/queryExecutor.ts`, `__tests__/lib/segment/queryExecutor.test.ts`
- Expected behavior:
  - `buildWhereClause(filter: FilterDefinition): { sql: string, params: unknown[] }` — sicher gegen SQL-Injection (parametrisiert)
  - Unterstuetzte Operatoren: `EQ`, `IN`, `CONTAINS` (fuer text-arrays via `&&`-Operator), `GTE`, `LTE`, `BETWEEN`, `AND`, `OR`, `NOT`
  - `manual_includes` und `manual_excludes` werden in `OR id IN (...)` bzw. `AND id NOT IN (...)` integriert
- Verification: Tests fuer 8 Filter-Patterns + SQL-Injection-Defense (Boolean-Strings als Werte werden parametrisiert)
- Dependencies: MT-2
- TDD: Pflicht (sicherheitskritisch)

### MT-4: ICP-UI (List + Detail + "Aus Brand Profile uebernehmen")
- Goal: User kann ICPs verwalten
- Files: `src/app/[locale]/icp/page.tsx`, `src/app/[locale]/icp/new/page.tsx`, `src/app/[locale]/icp/[id]/page.tsx`, `src/components/icp/IcpList.tsx`, `src/components/icp/IcpForm.tsx`, `src/components/icp/SyncFromBrandProfileButton.tsx`
- Expected behavior:
  - Liste mit Filter (Title-Search), Action "Neu"
  - Detail-Form mit allen Pflicht- + Optional-Feldern
  - Persona-Set als Sub-Form (mind. 2 Personas) mit cares-about/challenge/value-promise
  - Trigger-Signale als Tag-Input (multi-line-array)
  - "Aus Brand Profile uebernehmen"-Button: erst aktiv, wenn ICP `brand_profile_id` gesetzt; bei Klick laedt + uebernimmt Sektion 2 + 3
- Verification: E2E: ICP anlegen, Brand-Profile-Sync nutzen, speichern, neu laden zeigt Werte
- Dependencies: MT-1 + SLC-101 Style-Guide

### MT-5: Segment-UI (List + Detail + Filter-Builder + Lead-Tab-Stub)
- Goal: User kann Segmente erstellen + Filter editieren + Mitglieder sehen
- Files: `src/app/[locale]/segments/page.tsx`, `src/app/[locale]/segments/new/page.tsx`, `src/app/[locale]/segments/[id]/page.tsx`, `src/components/segment/SegmentList.tsx`, `src/components/segment/SegmentForm.tsx`, `src/components/segment/FilterBuilder.tsx`, `src/components/segment/SegmentMembersTab.tsx`
- Expected behavior:
  - List mit Mitgliederzahl-Badge pro Segment (Live-Count)
  - Detail mit Tabs: Definition (ICP-Verknuepfung + Filter), Members (Lead-Liste — V1 leer bis SLC-105 nutzbar), Manual-Pins (Includes/Excludes)
  - Filter-Builder als visueller Tree-Editor (AND/OR-Gruppen + Leaf-Conditions)
- Verification: Filter visuell zusammenklicken, Save, neu laden zeigt Filter; Lead-Liste leer bis SLC-105
- Dependencies: MT-2 + MT-3 + SLC-101 Style-Guide

### MT-6: RLS-Tests
- Goal: tenant_admin schreibt, tenant_member liest, strategaize_admin all
- Files: `__tests__/migrations/{icp,segment}_rls.test.ts`
- Expected behavior: SAVEPOINT-Tests pro Tabelle pro Rolle (CRUD-Erlaubnis-Matrix)
- Verification: Alle Tests gruen
- Dependencies: SLC-101 (Migration ausgefuehrt)
- TDD: Pflicht

## TDD-Policy
- **Pflicht-TDD:** Schema (MT-1, MT-2), Live-Query-Executor (MT-3), RLS (MT-6)
- **Empfohlen-TDD:** ICP-Server-Actions (MT-1), Segment-Server-Actions (MT-2)
- **Nicht-TDD:** UI-Forms + Filter-Builder visuelle Komponente

## Risiken
- **R1 Filter-Builder-UX-Komplexitaet**: Tree-Editor ist nicht trivial. Mitigation: V1 mit max 2 Verschachtelungs-Tiefen, AND/OR + Leaf. Tiefer kommt V3+.
- **R2 SQL-Injection-Risiko im Live-Query-Executor**: Strikt parametrisiert + Whitelist erlaubter Felder + Operator-Whitelist.
- **R3 Persona-Set-Pflicht-Validation**: User vergisst evtl. Decision Maker. Mitigation: Inline-Validation mit Klartext-Hinweis.

## Worktree
Optional. Empfohlen falls parallel mit SLC-103-Worktree.

## Verifikations-Schritte (vor `/qa`)
1. `npm run build && npm run lint && npm run typecheck`
2. `npm run test`
3. E2E: ICP via "Aus Brand Profile uebernehmen" anlegen, Segment mit Filter erstellen, Segment-Detail zeigt Filter korrekt
4. Filter-Builder mit 2 verschachtelten Conditions speichern, Live-Count berechnet (auch wenn 0 wegen leerem Lead-Pool)

## Recommended Next Step
Nach `/qa SLC-104`: BL-028 (Firecrawl-Self-Host-Setup) abschliessen, dann `/backend SLC-105` (Lead Research).

## Referenzen
- FEAT-010 (ICP & Segment Spec)
- ARCHITECTURE.md A.3.2 (icp, segment), A.7 (Routen)
- `docs/spec-references/brand-profile-12-sections.md` (Sektion 2 + 3 als ICP-Quelle)
- SLC-102 (Brand-Profile-Read-Helper)
