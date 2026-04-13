# FEAT-007 — Content & Asset Transformer (Grundtypen)

## Feature
- ID: FEAT-007
- Title: Content & Asset Transformer (Grundtypen)
- Status: planned
- Priority: High
- Version: V1

## Description
Produktionsschicht: Aus Erkenntnissen, Mustern, Katalogeinträgen und Experimenten direkt nutzbare Assets erzeugen. V1 = 6 Grundtypen (erweitert von ursprünglich 4).

## In Scope
- Asset Request erstellen (Quell-Objekt + Output-Typ)
- V1 Output-Typen (6):
  - Blogpost (Markdown)
  - LinkedIn-Post (Kurztext)
  - One-Pager (Markdown, strukturiert)
  - Interne Produktnotiz (Markdown)
  - E-Mail-Vorlage (Markdown)
  - Landingpage-Briefing (Markdown, strukturiert)
- KI-Generierung via Claude mit Brand Guidelines als Kontext
- Entwurf in UI anzeigen und bearbeiten
- Asset-Status: Entwurf → überarbeitet → freigegeben → veröffentlicht
- Asset-Bibliothek mit Filter
- Markdown-Export

## Out of Scope
- Carousel, Video-Script, Präsentation als eigene Output-Typen (V1.1)
- Direkte Veröffentlichung / Publishing (nicht geplant)
- Multi-Sprachen-Output (V1.1)
- Versand / Distribution (gehört zu S3)

## Acceptance Criteria
- Asset Request kann aus jedem Quell-Objekttyp erstellt werden (inkl. Experiments)
- Claude generiert Entwurf für alle 6 Output-Typen
- Generierter Entwurf respektiert Brand Guidelines
- Entwurf kann in UI bearbeitet werden
- Markdown-Export funktioniert
- Asset-Bibliothek mit Filtern funktioniert

## Dependencies
- FEAT-008 (Brand & Output Control — Brand Guidelines müssen konfigurierbar sein)
- Claude Code Agent Tool Integration
- Quell-Objekte aus FEAT-002 bis FEAT-005, FEAT-011

## Änderung gegenüber Vorversion
Output-Typen erweitert von 4 auf 6 (E-Mail-Vorlage und Landingpage-Briefing hinzugefügt). Experiment als zusätzlicher Quell-Objekttyp.
