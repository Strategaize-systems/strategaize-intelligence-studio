# SLC-006 — FEAT-003 Portfolio-Monitor

## Status
- Version: V1
- Feature: BL-004 / FEAT-003
- Priority: High
- Status: planned
- Created: 2026-04-16
- Worktree isolation: optional

## Goal
Zentrale UI-Übersicht aller Kundenprojekte mit Filter, Volltext-Suche, Detail-Ansicht mit Deployment, KUs, Opportunities. Primärer IS-Einstiegspunkt. Basiert auf Layout 3 (Grid + Deutschland-Karte).

## In Scope
- `/customers`-Liste: Layout 3 (Grid-Variante mit Deutschland-Karte, toggelbar zu List-Variante)
- Spalten: Unternehmen, Primär-Kontakt, Deployment-Typ, aktive Module, Code-Version, Letzter Kontakt, #KUs
- Filter: Status, Deployment-Typ, Module, Version; Volltext-Suche über Name + Notizen
- Sortierung: Name, letzte Aktualisierung, Version
- Detail-Ansicht unter `/customers/[id]` (Custom-Layout aus Layout 3 abgeleitet):
  - Stammdaten-Card (aus `business_contact_cache` + `business_company_cache`)
  - Deployment-Card (aus SLC-005, eingebettet)
  - KU-Liste (aus `knowledge_unit`, Drilldown nach `/insights/[id]`)
  - Opportunity-Liste (aus `opportunity`, Drilldown nach `/opportunities/[id]`)
  - Timeline: letzte Ingest-Änderungen (aus `ingest_run`)
- Export JSON + CSV pro Kunde
- Tenant↔Kunde-Mapping: `customer.source_tenant_id` (Onboarding) + `customer.business_company_id` (Business)

## Out of Scope
- KI-gestützte Muster-Erkennung über Kunden (V2)
- Bulk-Aktionen (V2)
- Alerts bei kritischen Zuständen (V2)
- Template-Sicht (V3)
- Performance-Optimierung (V1 < 100 Kunden erwartet, keine Indexe nötig)

## Acceptance Criteria (aus FEAT-003)
- AC-01: Liste zeigt alle Kunden aus SLC-004 mit SLC-005 Deployment-Daten
- AC-02: Filter + Suche < 1s bei < 100 Kunden
- AC-03: Detail-Ansicht zeigt KUs + Opportunities + Decisions
- AC-04: Kunde ohne Deployment wird sichtbar mit „kein Deployment erfasst"-Markierung
- AC-05: Kunde ohne KUs wird sichtbar mit 0-Badge
- AC-06: Deutschland-Karte zeigt Pins für aktive Kunden (Location-Feld optional, fallback Zentrum)
- AC-07: JSON/CSV-Export triggert Download

## Dependencies
- SLC-004 (Business-Cache-Daten)
- SLC-005 (Deployment-Entität + Customer-Mapping)
- SLC-003 (KU-Daten für Zählung und Drilldown-Vorbereitung)
- SLC-002 (Layout 3 + DeutschlandKarte + FilterBar)

## Risks
- Tenant↔Kunde-Mapping ist ambivalent: Onboarding-`tenant_id` und Business-`company_id` müssen konsistent sein. In V1 pragmatisch: manuelle Zuordnung als Admin-Feature + Auto-Match via Domain/Name.
- KU-Count-Query bei vielen Kunden → effiziente COUNT-Query mit Join
- Deutschland-Karte-Geocoding: in V1 optional, ohne Koordinaten werden Kunden „in Listenform" gezeigt

## Micro-Tasks

### MT-1: Customer-Mapping-Erweiterung
- Goal: `customer` Tabelle um `source_tenant_id` und `business_company_id` erweitern (falls in SLC-005 MT-1 noch nicht da). Admin-UI zum manuellen Verlinken.
- Files: `sql/migrations/004_customer_mapping_extension.sql` (falls nötig), `apps/web/src/app/(app)/admin/customer-mapping/page.tsx`, `CustomerMappingForm.tsx`.
- Expected behavior: Admin kann einen `customer` mit Onboarding-Tenant und Business-Company verknüpfen.
- Verification: Browser-Test.
- Dependencies: SLC-005 MT-1.

### MT-2: `/customers`-Liste mit Layout 3
- Goal: Liste mit FilterBar + Deutschland-Karte + Grid/List-Toggle.
- Files: `apps/web/src/app/(app)/customers/page.tsx`, `CustomerGrid.tsx`, `CustomerList.tsx`, `CustomerFilters.tsx`, `apps/web/src/lib/data/customer-queries.ts`.
- Expected behavior: Liste rendert, Filter greifen, Karte zeigt Pins.
- Verification: Browser-Test mit Seed-Daten.
- Dependencies: MT-1, SLC-002 MT-5, MT-6.

### MT-3: Detail-Ansicht `/customers/[id]`
- Goal: Custom-Layout mit Stammdaten, Deployment, KU-Liste, Opportunity-Liste, Timeline.
- Files: `apps/web/src/app/(app)/customers/[id]/page.tsx`, `CustomerHeader.tsx`, `DeploymentCard.tsx`, `KUListPreview.tsx`, `OpportunityListPreview.tsx`, `IngestTimeline.tsx`.
- Expected behavior: Alle Karten rendern, Drilldown-Links funktionieren.
- Verification: Browser-Test mit Seed-Daten.
- Dependencies: MT-2.

### MT-4: Export JSON + CSV
- Goal: `/customers/[id]/export?format=json|csv` + Button in Detail-Ansicht.
- Files: `apps/web/src/app/api/customers/[id]/export/route.ts`, Export-Button in Detail-Ansicht.
- Expected behavior: Download triggert, Inhalt korrekt.
- Verification: Dateien spot-checken.
- Dependencies: MT-3.

### MT-5: Volltext-Suche mit Postgres FTS
- Goal: `customer.search_vector` (tsvector, generated) + GIN-Index + Supabase-RPC für Suche.
- Files: `sql/migrations/005_customer_search.sql`, `apps/web/src/lib/data/customer-search.ts`.
- Expected behavior: Suche „kunde x" findet Customer mit Namens- oder Notiz-Match in < 1s.
- Verification: SQL EXPLAIN + Browser-Test.
- Dependencies: MT-2.

## Verification
- `/qa` nach Slice-Abschluss
- Browser-Test alle Filter-Kombinationen
- Performance-Check Volltext-Suche
- Export-Test (beide Formate)

## Next Slice
SLC-007 FEAT-004 Insight-Layer.
