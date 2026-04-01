# SLC-010 — Modules & Script Builder

## Slice
- ID: SLC-010
- Feature: FEAT-009
- Status: planned
- Priority: Medium

## Goal
Strukturierte Modulentwürfe mit Templates und KI-Generierung.

## Scope
- Server Actions: modules.ts (create, update, delete, list, generate)
- Prompt-Template: prompts/generate-module-draft.md
- Module-Seite: Listenansicht mit Filtern (Draft-Typ, Status)
- Detailansicht mit Markdown-Editor
- Erstellen-Formular mit allen Pflichtfeldern
- KI-Generierung aus Opportunity/Pattern
- Status-Workflow: Entwurf → überarbeitet → bereit → umgesetzt → verworfen
- Markdown-Export

## Dependencies
- SLC-004 (Patterns), SLC-006 (Opportunities) als Quell-Objekte

## Verification
- Module Draft kann manuell und KI-gestützt erstellt werden
- Markdown-Editor funktioniert
- Status-Workflow funktioniert
- Export funktioniert