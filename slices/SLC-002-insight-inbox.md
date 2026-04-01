# SLC-002 — Insight Inbox

## Slice
- ID: SLC-002
- Feature: FEAT-001
- Status: planned
- Priority: Blocker

## Goal
Vollständiger Insight Inbox mit CRUD, Import und Listenansicht. Erster datenführender Bereich des Systems.

## Scope
- Server Actions: inbox.ts (create, update, delete, list, getById, bulkUpdateStatus)
- Import-Logik: Markdown/Text/JSON Datei-Import als Source Records
- Inbox-Seite: Listenansicht mit Filtern (Status, Quelle, Typ, Relevanz)
- Detailansicht pro Eintrag
- Erstellen-Formular mit allen Pflichtfeldern
- Bulk-Statusänderung (Checkbox-Auswahl + Aktion)
- Status-Workflow: ungesehen → gesichtet → verarbeitet → archiviert

## Dependencies
- SLC-001 (DB-Schema, Basis-Layout, Types)

## Verification
- Source Record kann erstellt werden mit allen Pflichtfeldern
- Datei-Import funktioniert (mind. .md und .txt)
- Listenansicht zeigt Einträge mit funktionierenden Filtern
- Bulk-Statusänderung funktioniert