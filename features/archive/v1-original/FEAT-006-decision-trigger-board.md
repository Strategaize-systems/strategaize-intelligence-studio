# FEAT-006 — Decision & Trigger Board

## Feature
- ID: FEAT-006
- Title: Decision & Trigger Board
- Status: planned
- Priority: High
- Version: V1

## Description
Zentrale Entscheidungs- und Trigger-Instanz des Intelligence Studio. Für jede Insight, Idee, Opportunity, Verbesserung oder Testidee wird eine klare Folgeentscheidung erzwungen — und diese Entscheidung wird in ein konkretes, typisiertes Folgeobjekt (Action Trigger) übersetzt. Verhindert, dass das System zur Ideenmüllhalde wird, und stellt die Brücke zwischen Erkenntnis und Aktion her.

## In Scope
- Board-Ansicht: Alle Objekte, die eine Entscheidung brauchen
- Erweiterte Entscheidungsoptionen:
  - ignorieren
  - archivieren
  - beobachten
  - in Katalog aufnehmen (→ Opportunity)
  - Content bauen (→ Asset Request)
  - Modul/Flow bauen (→ Module Draft)
  - Frage/Skill/Vertriebsargument verbessern (→ Improvement)
  - Hypothese testen (→ Experiment)
  - Research-/Marktaufgabe erstellen (→ Research Task)
  - Onboarding-Entwurf erstellen (→ Module Draft / Onboarding)
  - Operator-Suchprofil erstellen (→ Research Task / Operator)
  - Wissensbaustein bauen (→ Knowledge Package)
  - später prüfen (mit Datum)
- Entscheidung erzeugt typisierten **Action Trigger** mit: Trigger-Typ, Zielsystem, Quell-Objekt, Status, Beschreibung
- Action Trigger als eigenständiges, nachverfolgbares Objekt
- Undecided-Filter
- Später-prüfen-Übersicht mit Wiedervorlagedatum
- Action Trigger-Übersicht: Alle erzeugten Folgeobjekte mit Status
- Entscheidung ist nachvollziehbar gespeichert

## Out of Scope
- KI-gestützte Entscheidungsempfehlungen (V1.1)
- Automatische Trigger-Weiterleitung an andere Systeme (V2)
- Dashboard/Statistiken über Entscheidungshistorie (V1.1)

## Acceptance Criteria
- Board zeigt alle Objekte ohne Entscheidung
- Entscheidung kann getroffen und gespeichert werden
- Entscheidung erzeugt korrekten Action Trigger mit Typ und Zielsystem
- Action Trigger wird als eigenständiges Objekt gespeichert
- Undecided-Filter funktioniert
- Später-prüfen mit Datumsfilter funktioniert
- Action-Trigger-Übersicht zeigt alle Folgeobjekte mit Status

## Dependencies
- FEAT-002 (Insights), FEAT-004 (Improvements), FEAT-005 (Opportunities), FEAT-011 (Experiments)
- Muss objektübergreifend arbeiten
- Action Triggers als neue SQLite-Tabelle
