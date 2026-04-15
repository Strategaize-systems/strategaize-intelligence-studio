# SLC-012 — Modules, Flows & Build Drafts

## Slice
- ID: SLC-012
- Feature: FEAT-009
- Status: planned
- Priority: High

## Goal
Strukturierte Build-Artefakte für alle Systeme. 13 Draft-Typen mit Zielsystem-Zuordnung, KI-gestützter Generierung, Markdown-Editor und Export.

## Scope
- Server Actions für Module Drafts CRUD + KI-Generierung (actions/modules.ts)
- Prompt-Template für Draft-Generierung (prompts/generate-module-draft.md)
- Modules-Listenansicht mit Filtern (Draft-Typ, Zielsystem, Status)
- Erstellen/Bearbeiten-Formular mit 13 Draft-Typen + Zielsystem
- KI-gestützte Draft-Generierung aus Opportunity/Pattern/Decision
- Markdown-Editor für Entwurfsinhalt
- Markdown-Export
- Status-Workflow: Entwurf → überarbeitet → bereit → umgesetzt → verworfen

## Not in Scope
- Vollautomatischer Modulbaukasten
- Modulvergleichslogik (V1.1)

## Dependencies
- SLC-004 (Patterns — für Ableitung)
- SLC-006 (Opportunities — für Ableitung)

## Micro-Tasks

#### MT-1: Server Actions — Module Drafts CRUD
- Goal: CRUD für Module Drafts
- Files: `app/src/actions/modules.ts`
- Expected behavior: create, read (single + list with filters), update, delete, updateStatus. Filter nach draft_type, target_system, status.
- Verification: DB-Operationen funktionieren
- Dependencies: none

#### MT-2: Prompt Template
- Goal: KI-Template für Draft-Generierung
- Files: `app/prompts/generate-module-draft.md`
- Expected behavior: Template erhält Draft-Typ + Quell-Objekt-Kontext + Zielsystem, erzeugt strukturierten Entwurf
- Verification: Template-Datei existiert
- Dependencies: none

#### MT-3: Modules List Page
- Goal: Listenansicht mit Filtern
- Files: `app/src/app/modules/page.tsx`, `app/src/app/modules/loading.tsx`
- Expected behavior: Tabelle mit Titel, Draft-Typ, Zielsystem, Status, Erstelldatum. Filter nach Draft-Typ, Zielsystem, Status.
- Verification: Seite rendert, Filter funktionieren
- Dependencies: MT-1

#### MT-4: Create/Edit Form
- Goal: Formular mit 13 Draft-Typen und Zielsystem
- Files: `app/src/app/modules/new/page.tsx`, `app/src/app/modules/[id]/edit/page.tsx`, `app/src/components/forms/module-draft-form.tsx`
- Expected behavior: Titel, Draft-Typ (13 Optionen: Fragebogen, Assessment-Flow, Zusatzkatalog, Beratungsmodul, Delivery-Script, Prompt-/Skill-Erweiterung, Modulbeschreibung, Prozess-/Flow-Draft, Onboarding-Draft, Landingpage-Briefing, Outreach-Pack, Kampagnenlogik, Präsentation), Zielsystem (S1/S2/S3/Dev/intern), Quell-Objekt, Problembeschreibung, Zielbeschreibung, Content (Markdown-Textarea). Validierung.
- Verification: Formular speichert korrekt mit allen Feldern
- Dependencies: MT-1

#### MT-5: KI Draft Generation + Detail View
- Goal: Claude-basierte Draft-Generierung + Detailansicht
- Files: `app/src/app/modules/[id]/page.tsx`, `app/src/actions/modules.ts` (erweitern)
- Expected behavior: "KI-Entwurf generieren"-Button. Claude erstellt strukturierten Entwurf basierend auf Draft-Typ und Quell-Objekt. Detailansicht zeigt alle Felder. Content als Markdown editierbar.
- Verification: KI generiert Draft, Content kann bearbeitet werden
- Dependencies: MT-1, MT-2

#### MT-6: Markdown Export
- Goal: Module Drafts als Markdown exportieren
- Files: `app/src/app/modules/[id]/page.tsx` (erweitern), `app/src/lib/export.ts` (erweitern)
- Expected behavior: Export-Button auf Detail-Seite. Exportiert Draft als .md in exports/.
- Verification: Export erstellt korrekte Markdown-Datei
- Dependencies: MT-5

## Verification
- Module Draft kann manuell erstellt werden
- Module Draft kann KI-gestützt aus Opportunity/Pattern/Decision generiert werden
- Alle 13 Draft-Typen sind verfügbar und auswählbar
- Zielsystem-Zuordnung funktioniert
- Entwurfsinhalt ist als Markdown editierbar
- Status-Workflow funktioniert
- Listenansicht mit Filtern funktioniert
- Markdown-Export funktioniert
