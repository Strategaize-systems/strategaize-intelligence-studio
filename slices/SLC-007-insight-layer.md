# SLC-007 — FEAT-004 Insight-Layer

## Status
- Version: V1
- Feature: BL-005 / FEAT-004
- Priority: High
- Status: planned
- Created: 2026-04-16
- Worktree isolation: optional

## Goal
Durchsuchbare, filterbare KU-Liste mit Tag-System, manuellem Clustering und Aktionen (Ableitung zu Opportunity / Markierung als Learning). Erfüllt FEAT-004 als Basis für Opportunity-Workflow (SLC-008) und Cross-Kunden-Learnings (SLC-009).

## In Scope
- `/insights`-Liste (Layout 3 List-Variante, keine Deutschland-Karte)
- Filter: Kunde, Unit-Typ, Confidence, Validation-Status, Zeitraum
- Volltext-Suche mit Supabase FTS (`knowledge_unit.search_vector`)
- Tag-System: freie Tags pro KU (Tabelle `ku_tag`), mehrere pro KU
- Manuelles Clustering: Cluster-Entität (`ku_cluster`) + n:m-Mitgliedschaft (`ku_cluster_member`)
- Detail-Ansicht `/insights/[id]`: voller KU-Inhalt, Quell-Session, Quell-Kunde, Tags, Cluster, verknüpfte Opportunities
- Aktionen pro KU:
  - Tag hinzufügen/entfernen
  - Cluster zuweisen (via Modal)
  - „Zu Opportunity ableiten" → Redirect auf `/opportunities/new?from_ku=ID` (SLC-008)
  - „Als Learning markieren" → öffnet Learning-Modal (SLC-009)
- Paginierung: 50 Einträge pro Seite

## Out of Scope
- KI-Auto-Clustering (V2)
- KI-Tag-Vorschläge (V2)
- Vektor-Ähnlichkeitssuche (V2)
- Cross-Kunden-KI-Verdichtung (V2)

## Acceptance Criteria (aus FEAT-004)
- AC-01: Volltext-Suche < 2s bei < 10.000 KUs
- AC-02: Tag/Cluster-Zuordnung persistent + nachvollziehbar (created_by)
- AC-03: Ableitung zu Opportunity startet SLC-008-Form mit vorbefülltem Context
- AC-04: 50 Einträge/Seite mit Paginierung
- AC-05: Filterkombination (Kunde X + Unit-Typ `risk`) funktioniert
- AC-06: „Als Learning markieren" öffnet SLC-009-Modal

## Dependencies
- SLC-003 (KU-Daten)
- SLC-002 (Layout 3, Modal, FilterBar)
- SLC-006 (Customer-Daten für Kunden-Filter)

## Risks
- FTS auf vielen KUs braucht GIN-Index — in MIG-001 bereits vorgesehen, Verifikation in MT-3
- Filter-Kombinationen können zu komplexen Queries führen — in Supabase-JS strukturiert halten
- „Als Learning markieren" vs. „Zu Opportunity ableiten" Modal-Pattern muss konsistent sein

## Micro-Tasks

### MT-1: KU-Liste `/insights` mit Filter + Pagination
- Goal: Listen-UI mit FilterBar (Kunde, Unit-Typ, Confidence, Validation-Status, Zeitraum, Tag), Server-Pagination 50/Seite.
- Files: `apps/web/src/app/(app)/insights/page.tsx`, `KUList.tsx`, `KUFilters.tsx`, `apps/web/src/lib/data/ku-queries.ts`.
- Expected behavior: Filter greifen, Pagination funktioniert, URL reflektiert Filter-State (`?kunde=X&type=risk`).
- Verification: Browser-Test mit Seed-Daten.
- Dependencies: SLC-003, SLC-002 MT-3.

### MT-2: Tag-System
- Goal: Tags pro KU hinzufügen/entfernen. Tag-Typeahead (existierende Tags vorschlagen).
- Files: `apps/web/src/app/(app)/insights/[id]/TagEditor.tsx`, `apps/web/src/lib/data/ku-tags.ts`, `apps/web/src/app/api/ku-tags/route.ts`.
- Expected behavior: Tag hinzufügen → Row in `ku_tag`. Entfernen → DELETE.
- Verification: Browser-Test.
- Dependencies: MT-1.

### MT-3: Volltext-Suche + Index-Verifikation
- Goal: `knowledge_unit.search_vector` (tsvector generated) + GIN-Index. RPC `search_ku(query, tenant_id)` für gewichtete Suche.
- Files: `sql/migrations/006_ku_search.sql`, `apps/web/src/lib/data/ku-search.ts`.
- Expected behavior: `search("Preis")` liefert Treffer nach ts_rank sortiert.
- Verification: EXPLAIN zeigt Index-Nutzung, Timing < 2s bei Test-Daten.
- Dependencies: MT-1.

### MT-4: Manuelles Clustering
- Goal: Cluster anlegen, KUs zu Cluster zuweisen über Modal. Cluster-Ansicht als Drilldown.
- Files: `apps/web/src/app/(app)/insights/clusters/page.tsx`, `ClusterList.tsx`, `ClusterDetail.tsx`, `ClusterAssignModal.tsx`, `apps/web/src/lib/data/ku-clusters.ts`.
- Expected behavior: Cluster anlegen, KUs zuweisen, in Cluster-Detail sehen.
- Verification: Browser-Test.
- Dependencies: MT-2, SLC-002 MT-5.

### MT-5: Detail-Ansicht + Aktionen
- Goal: `/insights/[id]` mit vollem KU-Inhalt, Tags, Clustern, verknüpften Opportunities. Aktions-Buttons „Zu Opportunity", „Als Learning markieren".
- Files: `apps/web/src/app/(app)/insights/[id]/page.tsx`, `KUDetail.tsx`, `KUActions.tsx`.
- Expected behavior: Alles sichtbar, Buttons lösen Redirects/Modals aus.
- Verification: Browser-Test.
- Dependencies: MT-4.

## Verification
- `/qa` nach Slice-Abschluss
- FTS-Performance-Check
- Filter-Kombinationen
- Tag-Persistence

## Next Slice
SLC-008 FEAT-005 Opportunity & Decision.
