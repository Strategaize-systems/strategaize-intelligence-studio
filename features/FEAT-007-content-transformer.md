# FEAT-007 — Content & Asset Transformer (Grundtypen)

## Feature
- ID: FEAT-007
- Title: Content & Asset Transformer (Grundtypen)
- Status: planned
- Priority: High
- Version: V1

## Description
Produktionsschicht: Aus Erkenntnissen, Mustern und Katalogeinträgen direkt nutzbare Assets erzeugen. V1 = 4 Grundtypen.

## In Scope
- Asset Request erstellen (Quell-Objekt + Output-Typ)
- V1 Output-Typen: Blogpost, LinkedIn-Post, One-Pager, Interne Produktnotiz
- KI-Generierung via Claude mit Brand Guidelines als Kontext
- Entwurf in UI anzeigen und bearbeiten
- Asset-Status: Entwurf → überarbeitet → freigegeben → veröffentlicht
- Asset-Bibliothek mit Filter
- Markdown-Export

## Out of Scope
- Carousel, Video-Script, Präsentation (V1.1)
- Direkte Veröffentlichung / Publishing (nicht geplant)
- Multi-Sprachen-Output (V1.1)

## Acceptance Criteria
- Asset Request kann aus jedem Quell-Objekttyp erstellt werden
- Claude generiert Entwurf für alle 4 Output-Typen
- Generierter Entwurf respektiert Brand Guidelines
- Entwurf kann in UI bearbeitet werden
- Markdown-Export funktioniert
- Asset-Bibliothek mit Filtern funktioniert

## Dependencies
- FEAT-008 (Brand & Output Control — Brand Guidelines müssen konfigurierbar sein)
- Claude Code Agent Tool Integration
- Quell-Objekte aus FEAT-002 bis FEAT-005