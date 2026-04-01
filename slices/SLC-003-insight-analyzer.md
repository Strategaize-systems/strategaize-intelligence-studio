# SLC-003 — Insight Analyzer

## Slice
- ID: SLC-003
- Feature: FEAT-002
- Status: planned
- Priority: Blocker

## Goal
KI-gestützte Analyse von Inbox-Einträgen. Erste Claude-Integration des Systems.

## Scope
- Server Actions: analyzer.ts (analyzeSingle, analyzeBatch)
- Prompt-Template: prompts/analyze-insight.md
- DSGVO-Filter: buildSafePrompt Nutzung für alle Analyse-Aufrufe
- Analyse-Ergebnis als Insight in DB gespeichert
- UI: "Analysieren"-Button in Inbox-Detailansicht
- UI: Batch-Analyse-Button in Inbox-Listenansicht
- UI: Insight-Ergebnis neben Original anzeigen
- Insights-Listenansicht mit Filtern (Klassifizierung, Bereich, Relevanz)
- Source Record Status automatisch auf "processed" nach Analyse

## Dependencies
- SLC-001 (Claude CLI Wrapper, DB-Schema)
- SLC-002 (Source Records müssen existieren)

## Verification
- Einzelanalyse erzeugt Insight mit allen Feldern
- Batch-Analyse verarbeitet mehrere Einträge
- DSGVO-Filter entfernt personenbezogene Daten aus Prompt
- Insights-Liste zeigt alle analysierten Einträge