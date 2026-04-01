# FEAT-002 — Insight Analyzer

## Feature
- ID: FEAT-002
- Title: Insight Analyzer
- Status: planned
- Priority: Blocker
- Version: V1

## Description
KI-gestützte Klassifizierung und Bewertung von Inbox-Einträgen. Verwandelt Rohdaten in strukturierte, bewertete Insights.

## In Scope
- Einzelanalyse eines Inbox-Eintrags durch Claude
- Batch-Analyse mehrerer Einträge
- Klassifizierung: Insight / Einwand / Opportunity / Improvement / Content-Angle / Musterkandidat / Rohidee / Rauschen
- Relevanzbewertung mit Begründung
- Bereichszuordnung (vertriebs-/delivery-/produkt-/methodikrelevant)
- Tags und Zusammenfassung
- Vorgeschlagene Folgeaktion
- DSGVO-konformer Datenschnitt

## Out of Scope
- Automatische Analyse bei Inbox-Eingang (V1.1)
- Sentiment-Analyse (V1.1)

## Acceptance Criteria
- Einzelner Eintrag kann analysiert werden, Ergebnis erscheint in UI
- Batch-Analyse funktioniert sequentiell
- Klassifizierung und Bewertung werden korrekt gespeichert
- Original bleibt unverändert, Analyse ist separater Datensatz
- Nur abstrahierte Inhalte gehen an Claude

## Dependencies
- FEAT-001 (Insight Inbox — Source Records müssen existieren)
- Claude Code Agent Tool Integration