# SLC-014 — Dashboard & Integration

## Slice
- ID: SLC-014
- Feature: Cross-Feature (alle)
- Status: planned
- Priority: Medium

## Goal
Übersichtsseite mit Statistiken, Cross-Objekt-Verlinkungen in allen Modulen, Gesamtnavigation verfeinern, Volltextsuche.

## Scope
- Dashboard mit Statistiken (Zähler + Status-Breakdowns pro Objekttyp)
- Cross-Objekt-Verlinkungen: Von jedem Objekt zu verwandten Objekten navigieren
- Globale Navigation verfeinern + Breadcrumbs
- FTS-Suche über Source Records + Insights (SQLite FTS5)
- Gesamtkonsistenz-Check über alle Module

## Not in Scope
- Automatische System-Anbindungen (V2)
- Cross-Project-Auswertung (V2)

## Dependencies
- SLC-001 bis SLC-013 (alle Module müssen existieren)

## Micro-Tasks

#### MT-1: Dashboard Statistics
- Goal: Übersichtsseite mit Echtzeit-Statistiken
- Files: `app/src/app/page.tsx` (ersetzen), `app/src/actions/dashboard.ts`
- Expected behavior: Cards für jeden Objekttyp mit: Gesamtanzahl, Status-Breakdown (z.B. "5 ungesehen, 3 verarbeitet, 2 archiviert"). Highlights: Offene Entscheidungen, aktive Experiments, überfällige Wiedervorlagen.
- Verification: Dashboard zeigt korrekte Zahlen
- Dependencies: none

#### MT-2: Cross-Object Links
- Goal: Von jedem Objekt zu verwandten Objekten navigieren
- Files: Detailseiten aller Module (erweitern)
- Expected behavior: Insight → zeigt Pattern(s), Improvement(s), Asset Request(s). Opportunity → zeigt Experiments, Research Tasks, Module Drafts. Action Trigger → Link zu Quell-Objekt + Ziel-Objekt. Jede Verlinkung ist bidirektional navigierbar.
- Verification: Verlinkungen funktionieren in beide Richtungen
- Dependencies: none

#### MT-3: Navigation Refinement + Breadcrumbs
- Goal: Gesamtnavigation verfeinern, Breadcrumbs hinzufügen
- Files: `app/src/components/layout/sidebar.tsx` (verfeinern), `app/src/components/layout/breadcrumbs.tsx`
- Expected behavior: Aktiver Bereich in Sidebar hervorgehoben. Breadcrumbs auf jeder Unterseite (z.B. Inbox > Eintrag #42 > Bearbeiten). Badge-Zähler in Sidebar für offene Entscheidungen.
- Verification: Navigation ist konsistent und Breadcrumbs korrekt
- Dependencies: none

#### MT-4: Full-Text Search
- Goal: Volltextsuche über Source Records und Insights via FTS5
- Files: `app/src/app/search/page.tsx`, `app/src/actions/search.ts`
- Expected behavior: Suchfeld in Header oder eigene Suchseite. Suche über source_records_fts und insights_fts. Ergebnisse zeigen Typ, Titel, Relevanz-Snippet. Link zum jeweiligen Objekt.
- Verification: Suche findet Einträge über beide FTS-Tabellen
- Dependencies: none

## Verification
- Dashboard zeigt korrekte Statistiken für alle Objekttypen
- Cross-Objekt-Verlinkungen funktionieren bidirektional
- Navigation ist konsistent mit Breadcrumbs
- Volltextsuche findet Einträge in Source Records und Insights
- Gesamtnavigation fühlt sich zusammenhängend an
