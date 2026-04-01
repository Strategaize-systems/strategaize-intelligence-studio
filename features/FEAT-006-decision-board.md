# FEAT-006 — Decision & Action Board

## Feature
- ID: FEAT-006
- Title: Decision & Action Board
- Status: planned
- Priority: High
- Version: V1

## Description
Disziplinierungsinstanz: Für jede Insight, Idee, Opportunity oder Verbesserung wird eine klare Folgeentscheidung erzwungen. Verhindert, dass das System zur Ideenmüllhalde wird.

## In Scope
- Board-Ansicht: Alle Objekte, die eine Entscheidung brauchen
- Entscheidungsoptionen: ignorieren, archivieren, beobachten, in Katalog aufnehmen, Content bauen, Modul bauen, Frage/Skill/Vertriebsargument verbessern, später prüfen
- Entscheidung erzeugt die richtige Folgeaktion (z.B. erstellt Asset Request oder Improvement)
- Undecided-Filter
- Später-prüfen-Übersicht mit Wiedervorlagedatum
- Entscheidung ist nachvollziehbar gespeichert

## Out of Scope
- KI-gestützte Entscheidungsempfehlungen (V1.1)
- Automatische Weiterleitung nach Entscheidung (V1.1)

## Acceptance Criteria
- Board zeigt alle Objekte ohne Entscheidung
- Entscheidung kann getroffen und gespeichert werden
- Folgeaktion wird korrekt erzeugt
- Undecided-Filter funktioniert
- Später-prüfen mit Datumsfilter funktioniert

## Dependencies
- FEAT-002 (Insights), FEAT-004 (Improvements), FEAT-005 (Opportunities)
- Muss objektübergreifend arbeiten