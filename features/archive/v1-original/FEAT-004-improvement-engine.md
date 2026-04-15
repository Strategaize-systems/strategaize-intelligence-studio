# FEAT-004 — Improvement Engine

## Feature
- ID: FEAT-004
- Title: Improvement Engine
- Status: planned
- Priority: High
- Version: V1

## Description
Leitet konkrete Verbesserungsvorschläge für Fragen, Skills, Methodik, Angebote und Assets ab. Verbindet Erkenntnisse mit den Zielsystemen.

## In Scope
- Manuelles Erstellen von Improvements
- KI-gestützte Ableitung aus Insights/Patterns
- Zielbereiche: Fragenkatalog, Delivery-Logik, Vertriebsargumentation, Skills/Prompts, Produktbeschreibungen, Asset-Qualität, Angebotsbausteine, Standarddeliverables
- Improvement-Typen: Question/Prompt/Skill/Method/Offer/Positioning/Asset Improvement, New Module Suggestion
- Status-Workflow: Vorschlag → geprüft → angenommen → umgesetzt → verworfen
- Listenansicht mit Filtern
- Verlinkung zum Quell-Objekt

## Out of Scope
- Automatisches Durchführen von Improvements in Zielsystemen (V2)
- Tracking ob ein Improvement tatsächlich umgesetzt wurde (V1.1)

## Acceptance Criteria
- Improvement kann manuell und KI-gestützt erstellt werden
- Alle Pflichtfelder werden gespeichert
- Status-Workflow funktioniert
- Listenansicht mit Filtern funktioniert
- Quell-Objekt-Verlinkung funktioniert

## Dependencies
- FEAT-002 (Insights) und/oder FEAT-003 (Patterns)
- Claude Code Agent Tool Integration