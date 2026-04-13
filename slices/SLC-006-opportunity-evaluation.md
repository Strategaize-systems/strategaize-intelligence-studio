# SLC-006 — Opportunity & Venture Evaluation

## Slice
- ID: SLC-006
- Feature: FEAT-005
- Status: planned
- Priority: High

## Goal
Strategisches Bewertungs- und Katalogsystem für Opportunities. CRUD mit 11-Dimensionen-Bewertungsschema (6 Pflicht, 5 optional), KI-gestützte Ableitung und Evaluierung, Schnellfilter.

## Scope
- Server Actions für Opportunities CRUD + Bewertung (actions/catalog.ts)
- Prompt-Templates (prompts/suggest-opportunity.md + prompts/evaluate-opportunity.md)
- Katalogansicht mit Filtern und Schnellfiltern
- Erstellen/Bearbeiten-Formular mit Bewertungsschema
- Detailansicht mit allen Feldern, Bewertung und verlinkten Objekten
- KI-Vorschlag: Opportunities aus Insights/Patterns ableiten
- KI-Evaluierung: Bewertungsschema-Unterstützung
- Verwandte Einträge verlinken (opportunity_relations)
- Reifegrad-Workflow: Rohidee → geprüft → relevant → in Ausarbeitung → umgesetzt → geparkt → verworfen

## Not in Scope
- Alle 11 Dimensionen Pflicht (V1.1 — in V1 sind 5 optional)
- Modulvergleichslogik (V1.1)

## Dependencies
- SLC-003 (Insights existieren)
- SLC-004 (Patterns existieren)

## Micro-Tasks

#### MT-1: Server Actions — Catalog CRUD + Relations
- Goal: CRUD für Opportunities inkl. Bewertungsfelder + Relationen
- Files: `app/src/actions/catalog.ts`
- Expected behavior: create, read (single + list with filters), update, delete. addRelation(), removeRelation(). Filter nach maturity, status, priority, eval_strategic_fit, eval_value_type.
- Verification: DB-Operationen funktionieren, Bewertungsfelder werden korrekt gespeichert
- Dependencies: none

#### MT-2: Prompt Templates
- Goal: KI-Templates für Opportunity-Vorschlag und Bewertungs-Unterstützung
- Files: `app/prompts/suggest-opportunity.md`, `app/prompts/evaluate-opportunity.md`
- Expected behavior: suggest-opportunity erhält Insight/Pattern, schlägt Opportunity vor. evaluate-opportunity unterstützt beim Ausfüllen der 11 Dimensionen.
- Verification: Template-Dateien existieren
- Dependencies: none

#### MT-3: Catalog List Page + Quick Filters
- Goal: Katalogansicht mit Filtern und Schnellfiltern
- Files: `app/src/app/catalog/page.tsx`, `app/src/app/catalog/loading.tsx`
- Expected behavior: Tabelle mit Titel, Reifegrad, Priorität, Status, Strategischer Fit, Value-Typ. Schnellfilter: "Alle relevanten", "Alle in Ausarbeitung", "Alle geparkten", "Alle mit Testbedarf".
- Verification: Seite rendert, Filter und Schnellfilter funktionieren
- Dependencies: MT-1

#### MT-4: Create/Edit Form mit Bewertungsschema
- Goal: Formular mit allen Pflichtfeldern + Bewertungsdimensionen
- Files: `app/src/app/catalog/new/page.tsx`, `app/src/app/catalog/[id]/edit/page.tsx`, `app/src/components/forms/opportunity-form.tsx`
- Expected behavior: Basis-Felder (Titel, Kurzbeschreibung, Problem, Lösungsidee, Zielgruppe, etc.) + Bewertungsbereich mit 6 Pflicht- und 5 optionalen Dimensionen. Pflicht-Felder markiert. Validierung.
- Verification: Formular speichert alle Felder korrekt
- Dependencies: MT-1

#### MT-5: Detail View + Verlinkungen
- Goal: Vollständige Detailansicht mit Bewertungsdisplay und verlinkten Objekten
- Files: `app/src/app/catalog/[id]/page.tsx`
- Expected behavior: Zeigt alle Felder + Bewertungsschema übersichtlich. Verwandte Opportunities. Link zu Quell-Objekt. Edit/Delete-Buttons.
- Verification: Detailseite zeigt alle Felder und Verlinkungen
- Dependencies: MT-1, MT-4

#### MT-6: KI-Vorschlag + Evaluierung
- Goal: Claude-basierte Opportunity-Ableitung und Bewertungs-Unterstützung
- Files: `app/src/actions/catalog.ts` (erweitern)
- Expected behavior: "Opportunity ableiten"-Funktion von Insight/Pattern-Detailseiten. "KI-Bewertung"-Button im Bewertungsbereich des Formulars — Claude schlägt Werte für die 11 Dimensionen vor.
- Verification: KI erzeugt Opportunity-Vorschlag und Bewertungs-Unterstützung
- Dependencies: MT-1, MT-2

## Verification
- Katalog-Eintrag kann manuell erstellt werden mit allen Pflichtfeldern
- Eintrag kann KI-gestützt aus Insight/Pattern abgeleitet werden
- Bewertungsschema mit 6 Pflicht- und 5 optionalen Dimensionen funktioniert
- Reifegrad-Workflow funktioniert
- Verwandte Einträge können verlinkt werden
- Katalogansicht mit Filtern und Schnellfilter funktioniert
- Detailansicht zeigt alle Felder, Bewertung und Verlinkungen
