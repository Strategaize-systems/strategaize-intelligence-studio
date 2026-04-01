# FEAT-003 — Pattern & Signal Clustering (Basis)

## Feature
- ID: FEAT-003
- Title: Pattern & Signal Clustering (Basis)
- Status: planned
- Priority: High
- Version: V1

## Description
Einzelbeobachtungen zu wiederkehrenden Mustern verdichten. V1 = einfache regelbasierte + KI-gestützte Erkennung, manuelles Clustering.

## In Scope
- Manuelles Erstellen von Patterns
- Pattern-Typen: Problemtyp, Branchenmuster, Deal-Killer, KI-Chance, Methodikschwäche, Positionierungsmuster
- Zuordnung Insights → Patterns (n:m)
- KI-Vorschläge für Pattern-Bildung
- Pattern-Übersicht und Detailansicht

## Out of Scope
- ML-basiertes Auto-Clustering (V1.1)
- Embedding-basierte Ähnlichkeitssuche (V1.1)
- Automatische Pattern-Erkennung ohne Nutzer-Bestätigung (V1.1)

## Acceptance Criteria
- Pattern kann manuell erstellt werden
- Insights können Patterns zugeordnet werden
- KI kann Patterns vorschlagen
- Übersicht zeigt alle Patterns mit Insight-Anzahl
- Detailansicht zeigt zugeordnete Insights

## Dependencies
- FEAT-002 (Insights müssen existieren)
- Claude Code Agent Tool Integration