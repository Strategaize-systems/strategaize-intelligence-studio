# FEAT-009 — Modules & Script Builder (Basis)

## Feature
- ID: FEAT-009
- Title: Modules & Script Builder (Basis)
- Status: planned
- Priority: Medium
- Version: V1

## Description
Baukasten für neue wiederverwendbare Methodik. Aus wiederkehrenden Themen und Chancen neue Module, Scripts, Mini-Assessments und Delivery-Bausteine entwickeln. V1 = strukturierte Entwürfe mit Templates.

## In Scope
- Module Draft erstellen (manuell oder KI-gestützt)
- Draft-Typen: Fragebogen, Assessment-Flow, Beratungsmodul, Delivery-Script, Modulbeschreibung, Prompt/Skill-Erweiterung
- KI-generierte strukturierte Entwürfe
- Pflichtfelder: Titel, Draft-Typ, Quell-Objekt, Problem, Ziel, Inhalt (Markdown), Status
- Status-Workflow: Entwurf → überarbeitet → bereit → umgesetzt → verworfen
- Listenansicht mit Filtern
- Markdown-Export

## Out of Scope
- Automatische Integration in Zielsysteme (V2)
- Versionierung von Modulentwürfen (V1.1)
- Modulvergleichslogik (V1.1)

## Acceptance Criteria
- Module Draft kann manuell und KI-gestützt erstellt werden
- Entwurfsinhalt ist als Markdown editierbar
- Status-Workflow funktioniert
- Listenansicht mit Filtern funktioniert
- Markdown-Export funktioniert

## Dependencies
- FEAT-005 (Opportunities) und FEAT-003 (Patterns) als Quell-Objekte
- Claude Code Agent Tool Integration