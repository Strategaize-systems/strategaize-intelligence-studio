# FEAT-009 — Modules, Flows & Build Drafts

## Feature
- ID: FEAT-009
- Title: Modules, Flows & Build Drafts
- Status: planned
- Priority: High
- Version: V1

## Description
Baukasten für strukturierte Build-Artefakte für alle Systeme. Nicht nur generische Scripts, sondern alle Arten operativer Entwürfe: Fragebögen, Flows, Kataloge, Delivery-Bausteine, Kampagnenlogiken, Onboarding-Drafts und mehr. V1 = strukturierte Entwürfe mit Templates und KI-Generierung.

## In Scope
- Module Draft erstellen (manuell oder KI-gestützt aus Opportunity/Pattern/Decision)
- Draft-Typen (13):
  - Fragebogen-Entwurf (→ S1)
  - Assessment-Flow (→ S1)
  - Zusatzkatalog-Entwurf (→ S1)
  - Beratungsmodul-Entwurf (→ S2)
  - Delivery-Script (→ S2)
  - Prompt-/Skill-Erweiterung (→ Dev System)
  - Modulbeschreibung (allgemein)
  - Prozess-/Flow-Draft
  - Onboarding-Draft
  - Landingpage-Briefing
  - Outreach-Pack-Entwurf
  - Kampagnenlogik-Entwurf
  - Präsentationsentwurf
- Zielsystem-Zuordnung (S1/S2/S3/Dev/intern) pro Draft
- KI-generierte strukturierte Entwürfe
- Pflichtfelder: Titel, Draft-Typ, Zielsystem, Quell-Objekt, Problem, Ziel, Inhalt (Markdown), Status
- Status-Workflow: Entwurf → überarbeitet → bereit → umgesetzt → verworfen
- Listenansicht mit Filter nach Draft-Typ, Zielsystem und Status
- Markdown-Export

## Out of Scope
- Automatische Integration in Zielsysteme (V2)
- Versionierung von Modulentwürfen (V1.1)
- Modulvergleichslogik (V1.1)
- Automatische Ausführung der Entwürfe (V2)

## Acceptance Criteria
- Module Draft kann manuell und KI-gestützt erstellt werden
- Alle 13 Draft-Typen sind verfügbar
- Zielsystem-Zuordnung funktioniert
- Entwurfsinhalt ist als Markdown editierbar
- Status-Workflow funktioniert
- Listenansicht mit Filtern funktioniert
- Markdown-Export funktioniert

## Dependencies
- FEAT-005 (Opportunities) und FEAT-003 (Patterns) als Quell-Objekte
- FEAT-006 (Decision Board) kann Module Drafts als Trigger erzeugen
- Claude Code Agent Tool Integration

## Hinweis: Priorität angehoben
Priorität in V1 von Medium auf **High** angehoben, da Modules/Flows/Build Drafts jetzt eine zentrale Rolle in der Decision-to-Execution-Kette spielen (Entscheidung → Build Draft → Zielsystem).
