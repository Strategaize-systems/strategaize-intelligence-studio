# SLC-013 — Knowledge Packaging Engine

## Slice
- ID: SLC-013
- Feature: FEAT-010
- Status: planned
- Priority: Medium

## Goal
Wissensplattformfähige Outputs aus Erkenntnissen verpacken. 6 Package-Typen mit CRUD, KI-gestützter Generierung, Markdown-Editor und Export (einzeln + Bulk).

## Scope
- Server Actions für Knowledge Packages CRUD + KI-Generierung (actions/knowledge.ts)
- Prompt-Template für Package-Generierung (prompts/generate-knowledge-package.md)
- Knowledge-Listenansicht mit Filtern (Package-Typ, Status)
- Erstellen/Bearbeiten-Formular mit 6 Package-Typen
- KI-gestützte Package-Generierung aus Insight/Pattern/Improvement
- Markdown-Editor für Content
- Markdown-Export (einzeln + Bulk)
- Status-Workflow: Entwurf → überarbeitet → freigegeben

## Not in Scope
- Knowledge-Base-Integration (V2)
- Wissensplattform / LMS

## Dependencies
- SLC-003 (Insights)
- SLC-004 (Patterns)
- SLC-005 (Improvements)

## Micro-Tasks

#### MT-1: Server Actions — Knowledge Packages CRUD
- Goal: CRUD für Knowledge Packages
- Files: `app/src/actions/knowledge.ts`
- Expected behavior: create, read (single + list with filters), update, delete, updateStatus. Filter nach package_type, status, target_platform.
- Verification: DB-Operationen funktionieren
- Dependencies: none

#### MT-2: Prompt Template
- Goal: KI-Template für Package-Generierung
- Files: `app/prompts/generate-knowledge-package.md`
- Expected behavior: Template erhält Package-Typ + Quell-Objekt-Kontext, erzeugt strukturiertes Knowledge Package
- Verification: Template-Datei existiert
- Dependencies: none

#### MT-3: Knowledge List Page
- Goal: Listenansicht mit Filtern
- Files: `app/src/app/knowledge/page.tsx`, `app/src/app/knowledge/loading.tsx`
- Expected behavior: Tabelle mit Titel, Package-Typ, Zielplattform, Status, Erstelldatum. Filter nach Package-Typ und Status.
- Verification: Seite rendert, Filter funktionieren
- Dependencies: MT-1

#### MT-4: Create/Edit Form
- Goal: Formular mit 6 Package-Typen
- Files: `app/src/app/knowledge/new/page.tsx`, `app/src/app/knowledge/[id]/edit/page.tsx`, `app/src/components/forms/knowledge-package-form.tsx`
- Expected behavior: Titel, Package-Typ (SOP, Wissensbaustein, FAQ, Rollenbeschreibung, Prozessbeschreibung, Entscheidungslogik), Quell-Objekt, Content (Markdown-Textarea), Zielplattform (intern/extern/unbestimmt). Validierung.
- Verification: Formular speichert korrekt
- Dependencies: MT-1

#### MT-5: KI Generation + Detail View
- Goal: Claude-basierte Package-Generierung + Detailansicht
- Files: `app/src/app/knowledge/[id]/page.tsx`, `app/src/actions/knowledge.ts` (erweitern)
- Expected behavior: "KI-Package generieren"-Button. Claude erstellt strukturiertes Package. Detailansicht zeigt alle Felder. Content als Markdown editierbar.
- Verification: KI generiert Package, Content kann bearbeitet werden
- Dependencies: MT-1, MT-2

#### MT-6: Markdown Export (einzeln + Bulk)
- Goal: Knowledge Packages als Markdown exportieren
- Files: `app/src/app/knowledge/page.tsx` (erweitern), `app/src/app/knowledge/[id]/page.tsx` (erweitern), `app/src/lib/export.ts` (erweitern)
- Expected behavior: Einzel-Export auf Detail-Seite. Bulk-Export auf Listenansicht (Checkbox + "Exportieren"-Button). Alle Dateien in exports/.
- Verification: Einzel- und Bulk-Export erstellen korrekte Markdown-Dateien
- Dependencies: MT-5

## Verification
- Knowledge Package kann manuell erstellt werden
- Package kann KI-gestützt aus Quell-Objekt generiert werden
- Inhalt ist als Markdown editierbar
- Status-Workflow funktioniert
- Markdown-Export funktioniert (einzeln und Bulk)
