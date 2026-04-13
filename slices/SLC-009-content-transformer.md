# SLC-009 — Content & Asset Transformer

## Slice
- ID: SLC-009
- Feature: FEAT-007
- Status: planned
- Priority: High

## Goal
KI-gestützte Asset-Generierung für 6 Output-Typen. Asset Requests aus Quell-Objekten, Generierung mit Brand-Kontext, Markdown-Editor, Asset-Bibliothek, Export.

## Scope
- Server Actions für Asset Requests + Assets (actions/assets.ts)
- 6 Prompt-Templates für Generierung (Blogpost, LinkedIn, One-Pager, Produktnotiz, E-Mail, Landingpage)
- Asset Request UI: Quell-Objekt + Output-Typ wählen
- KI-Generierung mit Brand Config als Kontext
- Asset-Bibliothek (app/assets/page.tsx) mit Filtern nach Typ und Status
- Asset-Detailansicht mit Markdown-Editor
- Markdown-Export (lib/export.ts)
- Status-Workflow: Entwurf → überarbeitet → freigegeben → veröffentlicht

## Not in Scope
- Erweiterte Output-Typen wie Carousel, Video-Script (V1.1)
- Social Publishing / Versand

## Dependencies
- SLC-008 (Brand Config muss existieren)
- Quell-Objekte aus SLC-003 (Insights), SLC-004 (Patterns), SLC-005 (Improvements), SLC-006 (Opportunities)

## Micro-Tasks

#### MT-1: Server Actions — Assets CRUD + Generation
- Goal: Asset Request CRUD + KI-Generierung für alle 6 Typen
- Files: `app/src/actions/assets.ts`
- Expected behavior: createRequest(sourceType, sourceId, outputType) → erstellt Asset Request. generateAsset(requestId) → lädt Quell-Objekt + Brand Config, wählt Prompt-Template, ruft Claude auf, speichert Asset. CRUD für Assets (list with filters, read, update, delete).
- Verification: Asset wird generiert und in DB gespeichert
- Dependencies: none

#### MT-2: Prompt Templates (6 Typen)
- Goal: Generierungs-Templates für alle 6 Output-Typen
- Files: `app/prompts/generate-blogpost.md`, `app/prompts/generate-linkedin.md`, `app/prompts/generate-one-pager.md`, `app/prompts/generate-product-note.md`, `app/prompts/generate-email-template.md`, `app/prompts/generate-landingpage-briefing.md`
- Expected behavior: Jedes Template akzeptiert Quell-Objekt-Kontext + Brand Config und produziert formatspezifischen Output
- Verification: Alle 6 Template-Dateien existieren
- Dependencies: none

#### MT-3: Asset Request UI
- Goal: UI zum Erstellen von Asset Requests aus verschiedenen Quell-Objekten
- Files: `app/src/components/forms/asset-request-form.tsx`
- Expected behavior: Quell-Objekt-Auswahl (Insight, Pattern, Opportunity, Improvement, Experiment). Output-Typ-Auswahl (6 Typen). "Generieren"-Button. Integration in Detailseiten der Quell-Objekte.
- Verification: Asset Request wird erstellt und Generierung gestartet
- Dependencies: MT-1

#### MT-4: Asset Library Page
- Goal: Bibliothek aller erzeugten Assets mit Filtern
- Files: `app/src/app/assets/page.tsx`, `app/src/app/assets/loading.tsx`
- Expected behavior: Tabelle/Grid mit Titel, Output-Typ, Status, Erstelldatum. Filter nach Output-Typ und Status.
- Verification: Bibliothek zeigt Assets korrekt
- Dependencies: MT-1

#### MT-5: Asset Detail + Markdown Editor
- Goal: Detailansicht mit editierbarem Markdown-Inhalt
- Files: `app/src/app/assets/[id]/page.tsx`, `app/src/app/assets/[id]/edit/page.tsx`
- Expected behavior: Zeigt Asset-Inhalt als Markdown. Edit-Mode mit Textarea. Status-Änderungs-Buttons. Tone-Check-Button (nutzt SLC-008 Logik). Link zum Quell-Request und Original-Objekt.
- Verification: Asset kann bearbeitet und Status geändert werden
- Dependencies: MT-1

#### MT-6: Markdown Export
- Goal: Assets als Markdown-Dateien exportieren
- Files: `app/src/lib/export.ts`, `app/src/app/assets/[id]/page.tsx` (erweitern)
- Expected behavior: Export-Button auf Asset-Detailseite. Speichert als .md in exports/. Dateiname: Typ-Titel-Datum.md.
- Verification: Export erstellt korrekte Markdown-Datei
- Dependencies: MT-5

## Verification
- Asset Request kann aus jedem Quell-Objekttyp erstellt werden
- Claude generiert einen Entwurf für jeden der 6 Output-Typen
- Generierter Entwurf respektiert Brand Guidelines
- Entwurf kann in der UI bearbeitet werden
- Asset kann als Markdown exportiert werden
- Asset-Bibliothek zeigt alle Assets mit Filtern
