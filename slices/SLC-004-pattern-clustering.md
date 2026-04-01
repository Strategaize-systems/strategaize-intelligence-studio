# SLC-004 — Pattern & Signal Clustering

## Slice
- ID: SLC-004
- Feature: FEAT-003
- Status: planned
- Priority: High

## Goal
Manuelles und KI-gestütztes Clustering von Insights zu Patterns.

## Scope
- Server Actions: patterns.ts (create, update, delete, list, addInsight, removeInsight, suggestPatterns)
- Prompt-Template: prompts/suggest-patterns.md
- Pattern-Seite: Übersicht mit Insight-Anzahl pro Pattern
- Pattern-Detailansicht mit zugeordneten Insights
- Erstellen-Formular (Titel, Beschreibung, Typ)
- Insight-Zuordnung: Insights einem Pattern hinzufügen/entfernen
- KI-Vorschlag: Button "Patterns vorschlagen lassen"

## Dependencies
- SLC-003 (Insights müssen existieren)

## Verification
- Pattern kann erstellt werden
- Insights können zugeordnet/entfernt werden
- KI-Vorschlag liefert sinnvolle Gruppierungen
- Übersicht zeigt korrekte Insight-Anzahl