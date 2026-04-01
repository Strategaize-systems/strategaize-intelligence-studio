# SLC-008 — Brand & Output Control

## Slice
- ID: SLC-008
- Feature: FEAT-008
- Status: planned
- Priority: High

## Goal
Brand-Konfiguration und Tone Check. Muss VOR dem Content Transformer fertig sein.

## Scope
- Server Actions: brand.ts (getConfig, updateConfig, toneCheck)
- Prompt-Template: prompts/tone-check.md
- Brand-Seite: Konfigurationsformular (Tonalität, Voice Guide, Do's/Don'ts, Templates)
- Tone Check: Asset gegen Brand Guidelines prüfen
- Tone-Check-Ergebnis-Anzeige

## Dependencies
- SLC-001 (DB-Schema: brand_config Tabelle)

## Verification
- Brand-Konfiguration kann gespeichert und geladen werden
- Tone Check liefert Ergebnis (passt / Abweichungen)
- Alle 4 Template-Felder sind editierbar