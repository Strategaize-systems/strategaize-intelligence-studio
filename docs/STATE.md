# STATE

## Project
- Name: StrategAIze Intelligence Studio
- Repository: strategaize-intelligence-studio
- Delivery Mode: internal-tool

## Purpose
System 3 der StrategAIze-Gesamtarchitektur. Interne Intelligence-, IP-, Opportunity- und Produktionsschicht. Sammelt Erkenntnisse aus Onboarding-Plattform (System 1) und Business Development System (System 2), verdichtet sie, priorisiert Chancen, erzeugt neue Module, Assets und Verbesserungen und übersetzt Entscheidungen in konkrete Folgearbeit — inklusive KI-, Automatisierungs- und Produktentscheidungen.

Referenz: `/strategaize-dev-system/docs/PLATFORM.md`.

## Current State
- High-Level State: requirements
- Current Focus: Discovery abgeschlossen 2026-04-15 (RPT-001). V1-Scope auf 6 Features geschnitten (F-01 Ingest Onboarding, F-02 Ingest Business, F-03 Portfolio Monitor, F-04 Insight-Layer, F-05 Opportunity & Decision basic, F-06 Cross-Kunden-Learnings basic). Nächster Schritt: `/requirements` mit 7 offenen Entscheidungsfragen aus RPT-001 Abschnitt 9.
- Current Phase: Requirements (Discovery abgeschlossen)

## Immediate Next Steps
1. `/requirements` starten. Pflichtlektüre:
   - `/reports/RPT-001.md` (Discovery-Ergebnis, V1-Scope + 7 offene Fragen)
   - `/strategaize-dev-system/docs/PLATFORM.md`
   - `/strategaize-dev-system/.claude/rules/data-residency.md`
   - `/docs/discovery-input.md` (weiterhin gültige Richtungsvorgaben)
2. Im `/requirements`-Lauf: die 7 Entscheidungsfragen beantworten (Deployment, Ingest-Mechanik Onboarding, Ingest-Mechanik Business, Business-Entitäten-Scope, Modul-/Stack-Modell, Anonymisierungs-UX, Opportunity-Bewertungs-Dimensionen).
3. Dann `/architecture` — explizit gegen PLATFORM.md und data-residency-Rule prüfen. Schema template-ready designen (auch wenn Template-Modus erst V3 aktiviert wird).

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
