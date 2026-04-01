# SLC-009 — Content & Asset Transformer

## Slice
- ID: SLC-009
- Feature: FEAT-007
- Status: planned
- Priority: High

## Goal
KI-gestützte Asset-Generierung für 4 Grundtypen mit Brand-Kontext.

## Scope
- Server Actions: assets.ts (createRequest, generate, update, list, export)
- Prompt-Templates: generate-blogpost.md, generate-linkedin.md, generate-one-pager.md, generate-product-note.md
- Asset-Request-Flow: Quell-Objekt wählen → Output-Typ wählen → Generieren
- Asset in UI anzeigen + Markdown-Editor zum Bearbeiten
- Asset-Status-Workflow: Entwurf → überarbeitet → freigegeben → veröffentlicht
- Asset-Bibliothek: Alle Assets mit Filter nach Typ und Status
- Markdown-Export in exports/

## Dependencies
- SLC-008 (Brand Config muss verfügbar sein für Prompt-Kontext)
- SLC-003/004/005/006 (Quell-Objekte)

## Verification
- Asset Request kann erstellt werden
- Generierung funktioniert für alle 4 Typen
- Brand Guidelines fließen in die Generierung ein
- Markdown-Export funktioniert