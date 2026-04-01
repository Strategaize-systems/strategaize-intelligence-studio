# FEAT-005 — Opportunity & Product Catalog

## Feature
- ID: FEAT-005
- Title: Opportunity & Product Catalog
- Status: planned
- Priority: High
- Version: V1

## Description
Strategischer Katalog für Produkt-, Automatisierungs-, Angebots- und Use-Case-Ideen. Strukturierte Speicherung und Bewertung von Chancen.

## In Scope
- Katalog-Einträge erstellen (manuell oder KI-gestützt)
- Vollständige Pflichtfelder: Titel, Beschreibung, Ursprung, Problem, Lösung, Zielgruppe, Nutzen, Reifegrad, Priorität, Status, Verwandte Einträge, Produktbezug
- Reifegrad-Workflow: Rohidee → geprüft → relevant → in Ausarbeitung → umgesetzt → geparkt → verworfen
- Verlinkung verwandter Einträge
- Katalogansicht mit Filter und Schnellfilter
- Detailansicht

## Out of Scope
- Automatische Ähnlichkeitserkennung (V1.1)
- Branchen-spezifische Katalogansichten (V2)
- Bewertungs-Scoring-Algorithmus (V1.1)

## Acceptance Criteria
- Eintrag kann manuell und KI-gestützt erstellt werden
- Reifegrad-Workflow funktioniert
- Verwandte Einträge können verlinkt werden
- Katalogansicht mit Filtern funktioniert
- Detailansicht zeigt alle Felder und Verlinkungen

## Dependencies
- FEAT-002 (Insights) und/oder FEAT-003 (Patterns) als Quell-Objekte
- SQLite-Schema für Catalog Entries