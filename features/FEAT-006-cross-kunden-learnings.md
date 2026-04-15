# FEAT-006 — Cross-Kunden-Learnings basic

## Status
- Version: V1
- Status: planned
- Priority: medium

## Purpose
Aus konkreten Kundenprojekten abgeleitete Erkenntnisse dauerhaft und intern cross-Kunden-nutzbar machen — ohne Kundennamen, ohne konkrete Details, DSGVO-sauber. Grundlage für „wir haben an anderer Stelle X gemacht, das könnte Dir helfen"-Wissen.

## In Scope (V1)
- Zusatzfelder an jeder Knowledge Unit (FEAT-001):
  - `is_shareable` (boolean, default `false`) — darf cross-Kunde intern genutzt werden
  - `shared_text` (text) — anonymisierte/abstrahierte Version des KU-Inhalts, vom Nutzer selbst verfasst
  - `shared_at` (timestamp, wer/wann)
- Regel: `is_shareable = true` ist nur erlaubt, wenn `shared_text` befüllt ist
- UI-Aktion an KU: „Als Learning freigeben" öffnet Editor mit Original-Text, Nutzer schreibt `shared_text`, bestätigt
- Cross-Kunden-Ansicht: gefilterte Liste aller `is_shareable = true`-KUs, **nur** `shared_text` sichtbar (nicht Original)
- Volltext-Suche + Tag-Filter in Cross-Kunden-Ansicht
- Ursprungs-Kunde ist in Cross-Kunden-Ansicht **nicht** sichtbar (nur durch explizites Umschalten für Admin-Rolle)

## Out of Scope (V2+)
- Auto-Anonymisierung via Bedrock (Vorschlag + manuelle Freigabe) — V2
- KI-gestützte Ähnlichkeitssuche zwischen Cross-Kunden-Learnings (V2)
- Strukturierte Learning-Typen (SOP, Anti-Pattern, Best Practice) — V2
- Export/Share mit externen Partnern (V3 via API)
- Rollen-basierte Learning-Freigabe (z. B. Partner-Team vs. internes Team) — V3

## Acceptance Criteria
- AC-01: „Als Learning freigeben" an jeder KU möglich
- AC-02: `is_shareable = true` ohne `shared_text` wird verhindert (Validierung)
- AC-03: Cross-Kunden-Ansicht zeigt nur `shared_text`, nicht Original
- AC-04: Ursprungs-Kunde ist in Cross-Kunden-Ansicht unsichtbar (Default), Admin kann einblenden
- AC-05: Freigegebene Learnings sind in Volltext-Suche auffindbar
- AC-06: Rücknahme möglich: `is_shareable = false` wieder setzbar, entfernt Learning aus Cross-Kunden-Ansicht sofort

## Dependencies
- FEAT-001 (Ingest Onboarding) — liefert die KUs
- FEAT-004 (Insight-Layer) — Einstieg zur Learning-Freigabe
- Rollenmodell (Basis aus Project-Setup): normaler Nutzer darf freigeben, Admin kann Ursprungs-Kunde einblenden

## Notes
- DSGVO-Rationale: Original-KU enthält identifizierbare Kundendaten; `shared_text` ist eine manuell erzeugte abstrakte Fassung, die intern frei zirkuliert
- V1 bewusst manuell: jeder Berater ist für die eigene Abstraktion verantwortlich. Auto-Anonymisierung (V2) wird Bedrock-Vorschlag anbieten, aber der Mensch muss final freigeben.
- Ziel Success Criteria: mindestens 10 Learnings in V1-Betrieb
