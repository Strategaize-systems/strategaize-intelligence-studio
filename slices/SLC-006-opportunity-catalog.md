# SLC-006 — Opportunity & Product Catalog

## Slice
- ID: SLC-006
- Feature: FEAT-005
- Status: planned
- Priority: High

## Goal
Strategischer Katalog für Chancen mit Reifegrad, Verlinkung und Filtern.

## Scope
- Server Actions: catalog.ts (create, update, delete, list, linkRelated, unlinkRelated, suggestOpportunity)
- Prompt-Template: prompts/suggest-opportunity.md
- Katalog-Seite: Übersicht mit Filter und Schnellfilter
- Detailansicht mit allen Feldern und verlinkten Einträgen
- Erstellen-Formular mit allen Pflichtfeldern
- Verwandte-Einträge-Verlinkung
- KI-Vorschlag: Button in Insight/Pattern-Detailansicht
- Reifegrad-Workflow

## Dependencies
- SLC-003 (Insights), SLC-004 (Patterns) als Quell-Objekte

## Verification
- Katalog-Eintrag kann erstellt werden
- Verwandte Einträge können verlinkt werden
- KI-Vorschlag funktioniert
- Filter und Schnellfilter funktionieren