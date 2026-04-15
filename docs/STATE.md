# STATE

## Project
- Name: StrategAIze Intelligence Studio
- Repository: strategaize-intelligence-studio
- Delivery Mode: internal-tool

## Purpose
System 3 der StrategAIze-Gesamtarchitektur. Interne Intelligence-, IP-, Opportunity- und Produktionsschicht. Sammelt Erkenntnisse aus Onboarding-Plattform (System 1) und Business Development System (System 2), verdichtet sie, priorisiert Chancen, erzeugt neue Module, Assets und Verbesserungen und übersetzt Entscheidungen in konkrete Folgearbeit — inklusive KI-, Automatisierungs- und Produktentscheidungen.

Referenz: `/strategaize-dev-system/docs/PLATFORM.md`.

## Current State
- High-Level State: architecture
- Current Focus: Requirements abgeschlossen 2026-04-15 (RPT-002). V1-Scope auf 7 Features geschnitten (FEAT-001..FEAT-007), PRD befüllt, Roadmap und Backlog angelegt. Alle 7 Discovery-Fragen beantwortet und eingearbeitet. Wichtiger Business-Constraint dokumentiert (kein Produkt-/Modul-Modell in Business V4). Nächster Schritt: `/architecture`.
- Current Phase: Architecture (Requirements abgeschlossen)

## Immediate Next Steps
1. `/architecture` starten. Pflichtlektüre:
   - `/docs/PRD.md` (V1-Scope, Constraints, Non-Goals)
   - `/features/` (7 Feature-Specs)
   - `/planning/roadmap.json` und `/planning/backlog.json`
   - `/strategaize-dev-system/docs/PLATFORM.md`
   - `/strategaize-dev-system/.claude/rules/data-residency.md`
   - `/reports/RPT-001.md` + `/reports/RPT-002.md`
2. Im `/architecture`-Lauf zu klären:
   - OQ-02 aus PRD: genauer Datenschnitt Business-Ingest (welche Deal-States? welche Angebote?)
   - OQ-03: einheitliches GitHub-Repo für IS einrichten — für Coolify-Auto-Deploy
   - Schema mit template-ready Feldern designen (`template_id` optional + Feature-Flags pro Modul), ohne V1-Aktivierung
   - Ingest-Mechanik im Detail (Cursor-Verwaltung, Retry-Policy, Auth zwischen IS und Onboarding/Business)
   - Bedrock-Adapter-Integration (analog Onboarding)
3. Nach `/architecture`: `/slice-planning` — Slice-Schnitt auf Basis von BL-001..BL-008.

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
