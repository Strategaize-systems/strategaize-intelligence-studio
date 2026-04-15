# FEAT-004 — Insight-Layer

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
Durchsuchbare, filterbare Liste aller aus Onboarding eingegangenen Knowledge Units. Grundlage für strukturiertes Arbeiten mit dem Wissen: Tagging, manuelles Clustering, Ableitung zu Opportunities und Learnings.

## In Scope (V1)
- Listen-Ansicht aller KUs mit Filter:
  - nach Kunde / Unternehmen
  - nach Unit-Typ (fact, rule, exception, risk, ...)
  - nach Confidence (low / medium / high)
  - nach Validation-Status
  - nach Zeitraum
- Volltext-Suche über KU-Inhalt und Meta-Felder
- Tag-System: manuelle Tags pro KU (mehrere pro KU möglich)
- Manuelles Clustering: KUs zu benannten Gruppen verbinden („Thema Prozess-Automation", „Thema Preismodell", ...)
- Detail-Ansicht pro KU: voller Inhalt, Quell-Session, Quell-Kunde, verknüpfte Opportunities, Tags, Cluster
- Aktionen pro KU:
  - Tag hinzufügen/entfernen
  - Cluster zuweisen
  - zu Opportunity ableiten (Übergabe an FEAT-005)
  - als Learning markieren (Übergabe an FEAT-006)

## Out of Scope (V2+)
- KI-Auto-Clustering und Pattern-Erkennung (V2)
- KI-Vorschläge für Tags oder Cluster (V2)
- Vektor-/Embedding-basierte Ähnlichkeitssuche (V2)
- Cross-Kunden-Aggregation mit KI-Verdichtung (V2)

## Acceptance Criteria
- AC-01: Volltext-Suche liefert Treffer in unter 2 Sekunden (bei < 10.000 KUs V1)
- AC-02: Tag- und Cluster-Zuordnung ist persistent und pro Nutzer nachvollziehbar (wer hat wann getaggt)
- AC-03: Ableitung einer KU zu einer Opportunity startet FEAT-005 mit vorbefülltem Kontext
- AC-04: KU-Liste zeigt 50 Einträge pro Seite mit Paginierung
- AC-05: Filterkombination (z. B. Kunde X + Unit-Typ risk) funktioniert

## Dependencies
- FEAT-001 (Ingest Onboarding) — liefert die KUs
- FEAT-005 (Opportunity & Decision) — Übergabe-Ziel
- FEAT-006 (Cross-Kunden-Learnings) — Übergabe-Ziel

## Notes
- Volltext-Suche V1 über Supabase FTS (Postgres tsvector), kein separater Such-Index nötig
- Tag-Schema: freie Tags V1, kein Tag-Vokabular-Management (V2)
- Cluster sind pro User sichtbar (keine Team-Cluster in V1 — Team ist ohnehin klein)
