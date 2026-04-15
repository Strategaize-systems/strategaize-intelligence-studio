# FEAT-005 — Opportunity & Venture Evaluation

## Feature
- ID: FEAT-005
- Title: Opportunity & Venture Evaluation
- Status: planned
- Priority: High
- Version: V1

## Description
Strategisches Bewertungs- und Katalogsystem für Produkt-, Automatisierungs-, Angebots-, Venture- und Use-Case-Ideen. Jede Opportunity wird anhand eines Pflicht-Bewertungsschemas eingeordnet, nicht nur als Idee katalogisiert. Aus einem Ideenlager wird ein belastbares Entscheidungssystem.

## In Scope
- Katalog-Einträge erstellen (manuell oder KI-gestützt aus Insight/Pattern/Improvement)
- Vollständige Pflichtfelder: Titel, Beschreibung, Ursprung, Problem, Lösung, Zielgruppe, Nutzen, Reifegrad, Priorität, Status, Verwandte Einträge, Produktbezug
- **Pflicht-Bewertungsschema** mit 11 Dimensionen:
  - Problemklasse (Pflicht)
  - Zielgruppe (Pflicht)
  - Strategischer Fit (Pflicht)
  - Core Engine Fit (Optional in V1)
  - Einordnung: Cashflow / Asset / Option (Pflicht)
  - Einordnung: Produkt / Framework / Venture-Kandidat (Optional in V1)
  - Minimale marktfähige Form (Optional in V1)
  - Plausibler Operator-Typ (Optional in V1)
  - Monetarisierungslogik (Optional in V1)
  - Testbedarf / Validierungsbedarf (Pflicht)
  - Kill-Kriterien / No-Go-Signale (Pflicht)
- Reifegrad-Workflow: Rohidee → geprüft → relevant → in Ausarbeitung → umgesetzt → geparkt → verworfen
- Verlinkung verwandter Einträge
- Katalogansicht mit Filter, Sortierung und Schnellfiltern
- Schnellfilter: "Alle relevanten", "Alle in Ausarbeitung", "Alle geparkten", "Alle mit Testbedarf"
- Detailansicht mit allen Feldern, Bewertungsschema und Verlinkungen

## Out of Scope
- Automatische Ähnlichkeitserkennung (V1.1)
- Branchen-spezifische Katalogansichten (V2)
- Bewertungs-Scoring-Algorithmus (V1.1)
- Alle 11 Dimensionen als Pflicht (V1.1 — V1 hat 6 Pflicht + 5 optional)

## Acceptance Criteria
- Eintrag kann manuell und KI-gestützt erstellt werden
- Bewertungsschema mit 6 Pflicht- und 5 optionalen Dimensionen funktioniert
- Reifegrad-Workflow funktioniert
- Verwandte Einträge können verlinkt werden
- Katalogansicht mit Filtern und Schnellfiltern funktioniert
- Detailansicht zeigt alle Felder, Bewertung und Verlinkungen

## Dependencies
- FEAT-002 (Insights) und/oder FEAT-003 (Patterns) als Quell-Objekte
- SQLite-Schema für Opportunities mit erweiterten Bewertungsfeldern
