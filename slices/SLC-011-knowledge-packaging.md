# SLC-011 — Knowledge Packaging Engine

## Slice
- ID: SLC-011
- Feature: FEAT-010
- Status: planned
- Priority: Medium

## Goal
Wissensplattformfähige Outputs als Markdown mit Strukturvorgaben.

## Scope
- Server Actions: knowledge.ts (create, update, delete, list, generate, exportSingle, exportBulk)
- Prompt-Template: prompts/generate-knowledge-package.md
- Knowledge-Seite: Listenansicht mit Filtern (Package-Typ, Status)
- Detailansicht mit Markdown-Editor
- Erstellen-Formular mit allen Pflichtfeldern
- KI-Generierung aus Insight/Pattern/Improvement
- Status-Workflow: Entwurf → überarbeitet → freigegeben
- Markdown-Export (einzeln + Bulk in exports/)

## Dependencies
- SLC-003 (Insights), SLC-004 (Patterns), SLC-005 (Improvements)

## Verification
- Knowledge Package kann manuell und KI-gestützt erstellt werden
- Markdown-Editor funktioniert
- Einzel- und Bulk-Export funktionieren
- Status-Workflow funktioniert