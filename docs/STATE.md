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
- Current Focus: Re-Discovery auf Basis der aktualisierten Gesamtarchitektur (2026-04-15). Vorherige V1-Planung (12 Features, 14 Slices, 77 Micro-Tasks) wurde vollständig archiviert und ist überholt. Neu zu entscheiden: Scope, Tech-Stack (insb. LLM-Provider), Deployment-Modell, Integrationspunkte zu Onboarding-Plattform und Business System.
- Current Phase: Re-Discovery

## Immediate Next Steps
1. User-Ideen für erweiterten Discovery-Scope einsammeln (vor Skill-Start)
2. `/discovery` starten mit neuem Kontext: System 3 der Gesamtarchitektur, Inputs aus Onboarding + Business, LLM = AWS Bedrock Frankfurt (verbindlich laut Data-Residency-Rule)
3. Nach Discovery: `/requirements` — V1-Scope neu schneiden, Überlappungen mit Onboarding-Verdichtung vermeiden
4. Dann `/architecture` — explizit gegen PLATFORM.md und data-residency-Rule prüfen

## Active Scope
Keiner. V1-Planung wurde archiviert. Neuer Scope wird über Discovery + Requirements definiert.

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
