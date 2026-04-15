# SLC-008 — Brand & Output Control

## Slice
- ID: SLC-008
- Feature: FEAT-008
- Status: planned
- Priority: High

## Goal
Brand-Konfiguration in der UI: Tonalität, Voice-Guide, Do's/Don'ts und 6 Strukturvorlagen. Tone Check. Wird vor dem Content Transformer gebaut, weil Brand-Kontext in die Asset-Generierung fließt.

## Scope
- Server Actions für Brand Config CRUD (actions/brand.ts) — Singleton-Tabelle
- Brand-Konfigurationsseite (app/brand/page.tsx) mit editierbaren Feldern
- 6 Template-Editoren (Blogpost, LinkedIn, One-Pager, Produktnotiz, E-Mail, Landingpage)
- Prompt-Template für Tone Check (prompts/tone-check.md)
- Tone Check Funktion: Asset gegen Brand Guidelines prüfen

## Not in Scope
- Asset-Generierung (SLC-009)
- Erweiterte Template-Logik (V1.1)

## Dependencies
- SLC-001 (DB, Types, Layout)

## Micro-Tasks

#### MT-1: Server Actions — Brand Config CRUD
- Goal: CRUD für brand_config Singleton
- Files: `app/src/actions/brand.ts`
- Expected behavior: getConfig() → aktuelle Brand-Konfiguration lesen. updateConfig(data) → aktualisieren. initConfig() → Standardwerte setzen falls leer.
- Verification: Config wird korrekt gelesen und geschrieben
- Dependencies: none

#### MT-2: Brand Config Page
- Goal: UI-Seite zum Pflegen der Brand-Konfiguration
- Files: `app/src/app/brand/page.tsx`
- Expected behavior: Formular mit Textfeldern für Tonalität, Voice-Guide, Do's, Don'ts. 6 Textarea-Felder für Templates (Blogpost, LinkedIn, One-Pager, Produktnotiz, E-Mail, Landingpage). Speichern-Button.
- Verification: Konfiguration kann bearbeitet und gespeichert werden
- Dependencies: MT-1

#### MT-3: Tone Check
- Goal: Assets gegen Brand Guidelines prüfen lassen
- Files: `app/prompts/tone-check.md`, `app/src/actions/brand.ts` (erweitern)
- Expected behavior: checkTone(assetContent) → Claude vergleicht Content gegen Brand Config → gibt Feedback (passt / Abweichungen mit konkreten Hinweisen).
- Verification: Tone Check gibt strukturiertes Feedback zurück
- Dependencies: MT-1

## Verification
- Brand-Konfiguration kann in der UI gepflegt werden
- Alle 6 Templates können bearbeitet werden
- Tone Check kann auf ein bestehendes Asset angewendet werden
- Tone Check zeigt konkrete Abweichungen vom Brand Guide
