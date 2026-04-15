# FEAT-012 — Research & Market Prep (Basis)

## Feature
- ID: FEAT-012
- Title: Research & Market Prep (Basis)
- Status: planned
- Priority: High
- Version: V1

## Description
Vorbereitungslogik für Markt-, Operator- und Zielgruppenarbeit. Das System designt und dokumentiert Research-Aufträge — es exekutiert sie nicht. Kein CRM, kein Versand, kein Kontakt-Tracking. V1 = Briefing- und Entwurfslogik mit strukturierten Objekten.

## In Scope
- Research Task erstellen (manuell oder KI-gestützt aus Opportunity/Experiment/Decision)
- Research-Typen (6):
  - Zielgruppenrecherche
  - Operator-Suchprofil
  - Multiplikator-Profilierung
  - Testmarkt-Analyse
  - Outreach-Pack
  - Listenauftrag / Listenbriefing
- KI-generierte strukturierte Research-Briefings
- Pflichtfelder:
  - Titel
  - Research-Typ
  - Quell-Objekt (Opportunity, Experiment, Decision oder manuell)
  - Fragestellung (was soll herausgefunden werden?)
  - Kontext (warum wird das gebraucht?)
  - Kontaktkriterien / Suchlogik (falls zutreffend)
  - Ergebnis (Freitext/Markdown, nach Abschluss)
  - Status: offen → in Recherche → abgeschlossen → verworfen
- Listenansicht mit Filter nach Research-Typ und Status
- Detailansicht mit allen Feldern
- Markdown-Export

## Out of Scope
- Kontaktdatenbank / CRM-Funktionalität (gehört zu S3)
- Versand / Outreach-Tracking (gehört zu S3)
- Automatische Anreicherung aus externen Quellen (V2)
- Research-Dashboard / Ergebnisvergleich (V1.1)

## Acceptance Criteria
- Research Task kann manuell erstellt werden mit allen Pflichtfeldern
- Research Task kann KI-gestützt aus Opportunity/Experiment abgeleitet werden
- Alle 6 Research-Typen sind verfügbar und auswählbar
- Ergebnis kann nach Abschluss dokumentiert werden
- Status-Workflow funktioniert
- Listenansicht mit Filtern funktioniert
- Markdown-Export funktioniert

## Dependencies
- FEAT-005 (Opportunities) und FEAT-011 (Experiments) als primäre Quell-Objekte
- FEAT-006 (Decision Board) kann Research Tasks als Trigger erzeugen
- Claude Code Agent Tool Integration
- Neue SQLite-Tabelle: research_tasks

## Grenzlinie (wichtig für V1)
Research Task = "Was suche ich und warum?" + "Ergebnis dokumentiert"
NICHT: "Wen habe ich kontaktiert und wann?" — das gehört zu System 3.
