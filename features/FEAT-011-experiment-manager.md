# FEAT-011 — Experiment / Market Test Manager (Basis)

## Feature
- ID: FEAT-011
- Title: Experiment / Market Test Manager (Basis)
- Status: planned
- Priority: High
- Version: V1

## Description
Strukturierte Hypothesenprüfung. Ein Experiment ist kein lose notierter Testgedanke, sondern ein strukturiertes Objekt mit klarer Entscheidungsvorbereitung und Kill-or-Go-Logik. V1 = Objektmanagement mit CRUD, KI-Vorschlag und manueller Ergebnisdokumentation.

## In Scope
- Experiment erstellen (manuell oder KI-gestützt aus Opportunity/Decision/Pattern)
- KI-Vorschlag: Claude schlägt Experiment-Designs aus Opportunities vor
- Pflichtfelder:
  - Titel
  - Hypothese (was wird getestet?)
  - Quell-Objekt (Opportunity, Decision, Pattern oder manuell)
  - Zielgruppe (wer wird getestet?)
  - Kanal (über welchen Weg?)
  - Budget-Rahmen (geschätzt)
  - Zeitfenster (Start/Ende)
  - Erfolgssignale (woran erkennt man Erfolg?)
  - Kill-Kriterien (was stoppt sofort?)
  - Status: geplant → aktiv → abgeschlossen → abgebrochen
  - Ergebnis (Freitext, nach Abschluss)
  - Folgeentscheidung (was passiert danach?)
- Abschluss-Workflow: Ergebnis eintragen → Folgeentscheidung → ggf. neuer Action Trigger
- Listenansicht mit Filter nach Status, Zielgruppe, Kanal
- Detailansicht mit allen Feldern

## Out of Scope
- Automatisches Test-Tracking / KPI-Messung (V1.1)
- Experiment-Dashboard mit Vergleichslogik (V1.1)
- A/B-Test-Framework (nicht geplant)
- Automatische Ergebnis-Auswertung (V1.1)

## Acceptance Criteria
- Experiment kann manuell erstellt werden mit allen Pflichtfeldern
- Experiment kann KI-gestützt aus Opportunity/Pattern abgeleitet werden
- Kill-Kriterien und Erfolgssignale sind klar dokumentiert
- Status-Workflow funktioniert
- Ergebnis kann nach Abschluss dokumentiert werden
- Folgeentscheidung kann getroffen werden (erzeugt ggf. neuen Action Trigger)
- Listenansicht mit Filtern funktioniert

## Dependencies
- FEAT-005 (Opportunities) als primäre Quell-Objekte
- FEAT-006 (Decision Board) kann Experiments als Trigger erzeugen
- Claude Code Agent Tool Integration
- Neue SQLite-Tabelle: experiments
