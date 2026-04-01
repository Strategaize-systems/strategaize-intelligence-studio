# FEAT-008 — Brand & Output Control

## Feature
- ID: FEAT-008
- Title: Brand & Output Control
- Status: planned
- Priority: High
- Version: V1

## Description
Sichert Wiedererkennbarkeit und Konsistenz aller erzeugten Outputs. Brand-Konfiguration wird bei jeder Asset-Generierung als Kontext mitgegeben.

## In Scope
- Brand-Konfiguration in der UI: Tonalität, Voice Guide, Strukturvorlagen pro Output-Typ, Do's und Don'ts
- Brand-Kontext bei jeder Asset-Generierung
- Tone Check: Bestehendes Asset gegen Brand Guidelines prüfen (Claude-basiert)
- Tone-Check-Ergebnis: passt / konkrete Abweichungen

## Out of Scope
- Automatischer Tone Check bei jeder Generierung (V1.1)
- Visuelle Style-Prüfung (nicht im Scope)
- Mehrere Brand-Profile (V1.1)

## Acceptance Criteria
- Brand-Konfiguration kann in der UI gepflegt werden
- Asset-Generierung berücksichtigt Brand-Konfiguration
- Tone Check kann auf bestehendes Asset angewendet werden
- Tone Check zeigt konkrete Abweichungen

## Dependencies
- Wird von FEAT-007 (Content Transformer) benötigt
- SQLite-Schema für Brand-Konfiguration