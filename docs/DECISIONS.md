# Decisions

## Hinweis
Alle vorherigen DECs (DEC-001 bis DEC-009 + Tradeoffs) sind durch das Re-Discovery vom 2026-04-15 aufgehoben.
Archiv: `/docs/archive/DECISIONS-v1-original.md` — nur als Referenz, nicht mehr gültig.

Neue DECs werden ab `DEC-001` wieder frisch nummeriert und in `/discovery`, `/requirements` und `/architecture` gesetzt.

## DEC-001 — Re-Discovery auf Basis der aktualisierten Gesamtarchitektur
- Status: accepted
- Reason: Mit der Strategieentscheidung zur Onboarding-Plattform (2026-04-14) und dem Gesamtarchitektur-Dokument (2026-04-15) hat sich die Rolle des Intelligence Studios grundlegend verändert (System 3 statt System 4, Inputs aus konkreten Fremdsystemen statt manueller Insight Inbox, neue Rückfluss-Ziele). Die alte V1-Planung (12 Features, 14 Slices, 77 Micro-Tasks, 17 Tabellen) würde bei Umsetzung Doppelarbeit mit der Onboarding-Verdichtung erzeugen und kollidiert mit der neuen verbindlichen LLM-Provider-Wahl.
- Consequence: Gesamte V1-Planung archiviert. Projekt startet neu bei Discovery. Alte Reports, Features, Slices, DECs, Roadmap, Backlog nur noch als Archiv-Referenz.

## DEC-002 — LLM-Provider ist AWS Bedrock eu-central-1 (Frankfurt)
- Status: accepted
- Reason: Verbindliche Regel aus `/strategaize-dev-system/.claude/rules/data-residency.md`. Beste technische Qualität + DSGVO-belastbar + EU-gehostet. Alle anderen aktiven Systeme (Onboarding, Business, Blueprint) nutzen bereits Bedrock Frankfurt — Intelligence Studio reiht sich ein. Claude Code CLI/Max-Subscription bleibt für Dev-Workflow, nicht für Laufzeit-/Analyse-Pfad. Die API-Kosten pro Analyse sind bewusst akzeptiert gegen den Gewinn aus State-of-the-Art-Qualität und Infrastruktur-Vermeidung.
- Consequence: Alle KI-Aufrufe in IS laufen zur Laufzeit über AWS Bedrock Frankfurt. Kein Ollama, kein lokales LLM, keine direkte Anthropic-API. Provider-Adapter-Pattern ist Pflicht (Austauschbarkeit).

## DEC-003 — Hosting-Region: ausschließlich EU, bevorzugt Deutschland
- Status: accepted
- Reason: Übergreifender StrategAIze-Grundsatz (Data-Residency-Rule). Unternehmenswissen aus Kundenprojekten darf nicht in Drittländer mit unzureichendem Datenschutzniveau übertragen werden. Gilt für LLMs, Speech-APIs, Embeddings, sonstige KI-Dienste. USA-Direktanbieter (OpenAI-API, Anthropic-API, Pinecone-US etc.) sind ausgeschlossen.
- Consequence: Jede neue API-Abhängigkeit wird gegen diese Regel geprüft. Keine Integration ohne nachweisbaren EU-Endpoint + DPA. Audit-Log pro externer Call mit Anbieter/Region/Modell-ID.
