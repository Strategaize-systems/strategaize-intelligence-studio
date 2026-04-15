# FEAT-003 — Portfolio-Monitor

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
Zentrale UI-Übersicht aller aktiven Kundenprojekte. Der Gründer und das Delivery-Team sehen an einem Ort: welche Kunden haben wir, welchen Stack/welche Module, welche Version läuft, welche Knowledge Units gehören dazu. Primärer Einstiegspunkt ins IS.

## In Scope (V1)
- Listen-Ansicht: alle Kunden mit Filter (Status, Deployment-Typ, Module, Version) und Volltext-Suche
- Spalten: Unternehmen, Kontakt (Primär), Deployment-Typ (SaaS shared / SaaS dedicated / Self-Hosted / Lokal), aktive Module, Code-Version, letzter Kontakt, Anzahl zugehöriger KUs
- Detail-Ansicht pro Kunde:
  - Stammdaten (Kontakt, Unternehmen — aus FEAT-002)
  - Deployment-Karte (aus FEAT-007)
  - Zugehörige Knowledge Units (aus FEAT-001, Anzeige + Drilldown in FEAT-004)
  - Zugehörige Opportunities und Decisions (aus FEAT-005)
  - Timeline: letzte Ingest-Änderungen
- Sortierung nach Name, letzter Aktualisierung, Version
- Export: JSON und CSV pro Kunde (für manuelle Weiterverarbeitung)

## Out of Scope (V2+)
- KI-gestützte Muster-Erkennung über Kunden hinweg (V2)
- Bulk-Aktionen (Update an alle Kunden mit Version X — V2)
- Automatische Alerts bei kritischen Zuständen (V2)
- Template-/Multi-Instanz-Sicht (V3)

## Acceptance Criteria
- AC-01: Liste zeigt alle Kunden aus FEAT-002 mit Verknüpfung zu FEAT-007 Deployment-Daten
- AC-02: Filter und Volltext-Suche funktionieren in unter 1 Sekunde (bei < 100 Kunden V1)
- AC-03: Detail-Ansicht zeigt alle verknüpften KUs, Opportunities und Decisions
- AC-04: Kunde ohne Deployment-Eintrag wird trotzdem angezeigt, mit klarer „kein Deployment erfasst"-Markierung
- AC-05: Kunde ohne zugehörige KUs wird angezeigt, mit 0-Badge

## Dependencies
- FEAT-002 (Ingest Business) — liefert Kundenstamm
- FEAT-007 (Deployment Registry) — liefert Deployment-Daten
- FEAT-001 (Ingest Onboarding) — liefert zugehörige KUs
- FEAT-004 (Insight-Layer) — Drilldown-Ziel
- FEAT-005 (Opportunity & Decision) — Drilldown-Ziel

## Notes
- Portfolio-Monitor ist der **primäre Einstieg** ins IS — UI-Design muss klar und schnell sein
- V1-Größe: < 100 Kunden erwartet, keine Performance-Optimierung nötig
- Verknüpfung KU ↔ Kunde erfolgt über Quell-Tenant aus Onboarding (muss mit Business-Kunde gemappt werden — Mapping-Tabelle oder Tenant-Identifier)
