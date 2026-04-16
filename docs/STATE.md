# STATE

## Project
- Name: StrategAIze Intelligence Studio
- Repository: strategaize-intelligence-studio
- Delivery Mode: internal-tool

## Purpose
System 3 der StrategAIze-Gesamtarchitektur. Interne Intelligence-, IP-, Opportunity- und Produktionsschicht. Sammelt Erkenntnisse aus Onboarding-Plattform (System 1) und Business Development System (System 2), verdichtet sie, priorisiert Chancen, erzeugt neue Module, Assets und Verbesserungen und übersetzt Entscheidungen in konkrete Folgearbeit — inklusive KI-, Automatisierungs- und Produktentscheidungen.

Referenz: `/strategaize-dev-system/docs/PLATFORM.md`.

## Current State
- High-Level State: discovery
- Current Focus: Discovery V2 abgeschlossen 2026-04-16 (RPT-003). Scope-Erweiterung um 5 neue Funktionsbereiche (Content/Brand, Campaign/Lead, Validation, Orchestration, Publishing/Tracking). V1-Planung (FEAT-001..007) bleibt unverändert als Fundament. Versions-Reihenfolge V1–V7 vorgeschlagen. Gründer-Fixpunkte 2026-04-16 in discovery-input-v2.md fixiert. Nächster Schritt: `/requirements` V2 nach Klärung von 4 OQs.
- Current Phase: Discovery V2 abgeschlossen, vor `/requirements` V2

## Immediate Next Steps
1. 4 kritische OQs vor `/requirements` V2 klären (siehe RPT-003 Abschnitt 9):
   - OQ-V2-01: Campaign-Objektmodell digital + physisch
   - OQ-V2-02: Lead-Übergabe-Mechanik IS → Business (Fluss 5b)
   - OQ-V2-03: Brand-Profil-Struktur
   - OQ-V2-04: Orchestration mit eigenem UI vs. durchgängiges Prinzip
2. `/requirements` V2 starten. Pflichtlektüre:
   - `/docs/PRD.md` (aktueller V1-Scope)
   - `/docs/discovery-input-v2.md` (Scope-Erweiterung + Gründer-Fixpunkte)
   - `/docs/discovery-input.md` (V1-Richtungsvorgaben, bleiben gültig)
   - `/reports/RPT-003.md` (Discovery V2 Report)
   - `/features/` (7 bestehende V1-Specs)
   - `/features/archive/v1-original/` (Referenz für Content, Brand, Experiment, Research)
   - `/strategaize-dev-system/docs/PLATFORM.md`
   - `/strategaize-dev-system/.claude/rules/data-residency.md`
3. `/requirements` V2 Fokus:
   - V1 unverändert lassen (FEAT-001..007)
   - V2 neu spezifizieren: Brand-Profil + Content-Asset-Production
   - V3 neu spezifizieren: Campaign, Segment, Lead-Recherche, Enrichment, Lead-Scoring, Fluss 5b
   - V4–V7 im PRD als „geplante Folgeversionen" benennen, ohne Feature-Detail
4. Danach `/architecture` erweitert auf V1–V7 denken (Schema-, Adapter-, Worker-Entscheidungen für Langfrist-Tauglichkeit).

## Active Scope
V1-Requirements vom 2026-04-15 bleiben gültig als Fundament (FEAT-001..007: Ingest, Portfolio, Insight, Opportunity/Decision, Cross-Kunden-Learnings, Deployment Registry). Discovery V2 vom 2026-04-16 erweitert den Gesamt-Scope auf 6 Funktionsbereiche über V1–V7 Versions-Reihenfolge. `/requirements` V2 steht an.

## Blockers
- aktuell keine

## Last Stable Version
- none yet

## Notes
- Alte V1-Planung unter `/docs/archive/`, `/reports/archive/v1-planning/`, `/features/archive/v1-original/`, `/slices/archive/v1-original/`, `/planning/archive/`.
- Gründe für Re-Discovery:
  1. Systemrolle neu: IS ist **System 3** (nicht System 4). Gesamtarchitektur hat drei aktive Systeme.
  2. LLM-Entscheidung neu: Bedrock Frankfurt verbindlich, Claude Code CLI/Max nur noch für Dev-Workflow zulässig. Siehe `.claude/rules/data-residency.md` im Dev System.
  3. Input-Quellen neu definiert: Knowledge Units aus Onboarding + Signale aus Business (Verlustmuster, Einwände, Gesprächssignale). Alte „Insight Inbox" war manuell-first — passt nicht mehr.
  4. Output-Rückflüsse neu: Flüsse 4+5 der Gesamtarchitektur (IS → Onboarding-Fragenkataloge/Templates, IS → Business-Argumente/Bausteine) lösen alte „Action Triggers"-Logik ab.
  5. Alte Lokal-first-Entscheidung (DEC-001) kollidiert mit den Hetzner-basierten Datenquellen; Deployment-Modell ist offen.
- Gesamtarchitektur-Referenz: `/strategaize-dev-system/docs/PLATFORM.md`.
- Hosting-/Provider-Referenz: `/strategaize-dev-system/.claude/rules/data-residency.md`.
