# FEAT-001 — Insight Inbox

## Feature
- ID: FEAT-001
- Title: Insight Inbox
- Status: planned
- Priority: Blocker
- Version: V1

## Description
Strukturierter Eingangskorb für alle Rohsignale aus allen Quellen. Erste Disziplinierung der Rohdaten mit Pflichtfeldern, Status-Tracking und Import-Fähigkeit.

## In Scope
- Manuelles Erstellen von Inbox-Einträgen
- Datei-Import (Markdown, Text, JSON)
- Pflichtfelder: Quelle, Datum, Kontext, Typ, Sprache, Grobrelevanz, Status, Eingabemodus
- Status-Workflow: ungesehen → gesichtet → verarbeitet → archiviert
- Listenansicht mit Filter und Sortierung
- Detailansicht pro Eintrag
- Bulk-Statusänderung

## Out of Scope
- Automatische Zufuhr aus anderen Systemen (V2)
- E-Mail-Integration (nicht geplant)
- Sprachaufnahme / Voice-to-Text (nicht geplant)

## Acceptance Criteria
- Inbox-Eintrag kann manuell erstellt werden mit allen Pflichtfeldern
- Markdown/Text/JSON-Dateien können importiert werden
- Listenansicht zeigt alle Einträge mit Filtern
- Status-Workflow funktioniert vollständig
- Bulk-Statusänderung funktioniert

## Dependencies
- SQLite-Datenbankschema (Source Records Tabelle)
- Next.js UI-Grundstruktur