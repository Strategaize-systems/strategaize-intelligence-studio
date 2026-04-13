# SLC-002 — Insight Inbox

## Slice
- ID: SLC-002
- Feature: FEAT-001
- Status: planned
- Priority: Blocker

## Goal
Strukturierter Eingangskorb für alle Rohsignale. Manuelles Erstellen, Datei-Import, Listenansicht mit Filtern, Status-Workflow und Bulk-Statusänderung.

## Scope
- Server Actions für Source Records CRUD (actions/inbox.ts)
- Inbox-Listenansicht mit Filtern (Status, Quelle, Typ, Relevanz, Datum)
- Detailansicht pro Eintrag
- Erstellen/Bearbeiten-Formular mit allen Pflichtfeldern
- Status-Workflow: ungesehen → gesichtet → verarbeitet → archiviert
- Datei-Import (Markdown, Text, JSON) via lib/import.ts
- Bulk-Statusänderung (mehrere Einträge gleichzeitig)

## Not in Scope
- Analyse-Funktion (SLC-003)
- Volltextsuche (grundsätzlich über FTS5 angelegt, UI kommt in SLC-014)

## Dependencies
- SLC-001 (DB, Types, Layout)

## Micro-Tasks

#### MT-1: Server Actions — Source Records CRUD
- Goal: Alle CRUD-Operationen für source_records als Server Actions
- Files: `app/src/actions/inbox.ts`
- Expected behavior: create, read (single + list with filters), update, delete, updateStatus (single + bulk)
- Verification: Actions aufrufbar, DB-Operationen funktionieren
- Dependencies: none

#### MT-2: Inbox List Page
- Goal: Listenansicht aller Source Records mit Filtern und Sortierung
- Files: `app/src/app/inbox/page.tsx`, `app/src/app/inbox/loading.tsx`
- Expected behavior: Tabelle mit Datum, Titel, Quelle, Typ, Relevanz, Status. Filter-Dropdowns für Status, Quelle, Typ, Relevanz.
- Verification: Seite rendert, Filter funktionieren
- Dependencies: MT-1

#### MT-3: Create/Edit Form
- Goal: Formular zum Erstellen und Bearbeiten von Source Records
- Files: `app/src/app/inbox/new/page.tsx`, `app/src/app/inbox/[id]/edit/page.tsx`, `app/src/components/forms/source-record-form.tsx`
- Expected behavior: Alle Pflichtfelder (Quelle, Datum, Kontext, Typ, Sprache, Relevanz, Titel, Content). Validierung. Speichern erstellt/aktualisiert DB-Eintrag.
- Verification: Eintrag erstellen und bearbeiten funktioniert
- Dependencies: MT-1

#### MT-4: Detail View
- Goal: Detailansicht eines einzelnen Source Records
- Files: `app/src/app/inbox/[id]/page.tsx`
- Expected behavior: Zeigt alle Felder. Links zu Edit. Status-Change-Buttons. Später: Link zu Analyse-Ergebnissen.
- Verification: Detailseite rendert mit allen Feldern
- Dependencies: MT-1

#### MT-5: File Import
- Goal: Markdown/Text/JSON-Dateien als Source Records importieren
- Files: `app/src/lib/import.ts`, `app/src/app/inbox/import/page.tsx`
- Expected behavior: Datei-Upload, Parsing, Metadaten-Extraktion, Erstellung von Source Records. Unterstützt .md, .txt, .json.
- Verification: Datei-Import erstellt korrekte Source Records in der DB
- Dependencies: MT-1

#### MT-6: Bulk Status Change
- Goal: Mehrere Einträge gleichzeitig auf einen Status setzen
- Files: `app/src/app/inbox/page.tsx` (erweitern), `app/src/actions/inbox.ts` (erweitern)
- Expected behavior: Checkboxen in der Liste, Bulk-Action-Dropdown (gesichtet, archiviert)
- Verification: Mehrfachauswahl + Status-Änderung funktioniert
- Dependencies: MT-2

## Verification
- Inbox-Eintrag kann manuell erstellt werden mit allen Pflichtfeldern
- Markdown/Text/JSON-Dateien können importiert werden
- Listenansicht zeigt alle Einträge mit Filtern
- Status-Workflow funktioniert (ungesehen → gesichtet → verarbeitet → archiviert)
- Bulk-Statusänderung funktioniert
