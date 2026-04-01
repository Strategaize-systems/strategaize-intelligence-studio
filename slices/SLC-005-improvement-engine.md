# SLC-005 — Improvement Engine

## Slice
- ID: SLC-005
- Feature: FEAT-004
- Status: planned
- Priority: High

## Goal
Verbesserungsvorschläge manuell und KI-gestützt erstellen mit Zielbereichen und Status-Workflow.

## Scope
- Server Actions: improvements.ts (create, update, delete, list, deriveFromInsight, deriveFromPattern)
- Prompt-Template: prompts/derive-improvement.md
- Improvements-Seite: Listenansicht mit Filtern (Zielbereich, Typ, Status, Priorität)
- Detailansicht mit Verlinkung zum Quell-Objekt
- Erstellen-Formular mit allen Pflichtfeldern
- KI-Ableitung: Button in Insight- und Pattern-Detailansicht
- Status-Workflow: Vorschlag → geprüft → angenommen → umgesetzt → verworfen

## Dependencies
- SLC-003 (Insights) und SLC-004 (Patterns) als Quell-Objekte

## Verification
- Improvement kann manuell erstellt werden
- KI-Ableitung aus Insight und Pattern funktioniert
- Verlinkung zum Quell-Objekt funktioniert
- Filter und Status-Workflow funktionieren