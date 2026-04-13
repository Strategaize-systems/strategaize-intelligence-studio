# SLC-005 — Improvement Engine

## Slice
- ID: SLC-005
- Feature: FEAT-004
- Status: planned
- Priority: High

## Goal
Konkrete Verbesserungsvorschläge für Fragen, Skills, Methodik, Angebote und Assets aus Insights und Patterns ableiten. Manuell und KI-gestützt.

## Scope
- Server Actions für Improvements CRUD + KI-Ableitung (actions/improvements.ts)
- Prompt-Template für Improvement-Vorschläge (prompts/derive-improvement.md)
- Improvements-Listenansicht mit Filtern (Zielbereich, Typ, Status, Priorität)
- Erstellen/Bearbeiten-Formular mit allen Pflichtfeldern
- Detailansicht mit Verlinkung zum Quell-Objekt
- KI-gestützte Ableitung aus Insight oder Pattern
- Status-Workflow: Vorschlag → geprüft → angenommen → umgesetzt → verworfen

## Not in Scope
- Automatische Weiterleitung an Zielsystem (V2)

## Dependencies
- SLC-003 (Insights existieren)
- SLC-004 (Patterns existieren — für Ableitung aus Patterns)

## Micro-Tasks

#### MT-1: Server Actions — Improvements CRUD
- Goal: CRUD-Operationen für Improvements
- Files: `app/src/actions/improvements.ts`
- Expected behavior: create, read (single + list with filters), update, delete, updateStatus. Filter nach target_area, improvement_type, priority, status.
- Verification: DB-Operationen funktionieren korrekt
- Dependencies: none

#### MT-2: Prompt Template
- Goal: KI-Vorschlag-Template für Improvement-Ableitung
- Files: `app/prompts/derive-improvement.md`
- Expected behavior: Template erhält Insight oder Pattern, schlägt konkrete Improvements vor mit Titel, Beschreibung, Zielbereich, Typ
- Verification: Template-Datei existiert
- Dependencies: none

#### MT-3: Improvements List Page
- Goal: Listenansicht mit Filtern
- Files: `app/src/app/improvements/page.tsx`, `app/src/app/improvements/loading.tsx`
- Expected behavior: Tabelle mit Titel, Zielbereich, Typ, Priorität, Status. Filter-Dropdowns für alle Dimensionen.
- Verification: Seite rendert, Filter funktionieren
- Dependencies: MT-1

#### MT-4: Create/Edit Form
- Goal: Formular mit allen Pflichtfeldern
- Files: `app/src/app/improvements/new/page.tsx`, `app/src/app/improvements/[id]/edit/page.tsx`, `app/src/components/forms/improvement-form.tsx`
- Expected behavior: Titel, Beschreibung, Quell-Objekt (Insight/Pattern/manuell), Zielbereich (8 Optionen), Improvement-Typ (8 Optionen), Priorität, Status.
- Verification: Formular speichert korrekt
- Dependencies: MT-1

#### MT-5: Detail View + KI-Ableitung
- Goal: Detailansicht mit Quell-Verlinkung + KI-Vorschlag-UI
- Files: `app/src/app/improvements/[id]/page.tsx`, `app/src/actions/improvements.ts` (erweitern)
- Expected behavior: Detail zeigt alle Felder + Link zum Quell-Objekt. "Improvement ableiten"-Button auf Insight- und Pattern-Detailseiten. Claude schlägt Improvements vor, User kann akzeptieren/anpassen.
- Verification: KI-Ableitung erzeugt Improvement-Vorschlag, Quell-Verlinkung funktioniert
- Dependencies: MT-1, MT-2

## Verification
- Improvement kann manuell erstellt werden
- Improvement kann KI-gestützt aus Insight oder Pattern abgeleitet werden
- Alle Pflichtfelder werden korrekt gespeichert
- Status-Workflow funktioniert
- Listenansicht mit Filtern funktioniert
- Verlinkung zum Quell-Objekt funktioniert
