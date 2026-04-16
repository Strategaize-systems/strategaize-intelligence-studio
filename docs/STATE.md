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
- Current Focus: Requirements V2 abgeschlossen 2026-04-16 (RPT-004). V2-Scope (Brand + Content), V3-Scope (Campaign, Segment, Lead-Recherche, Scoring, Handoff) detailliert spezifiziert mit 7 neuen Features (FEAT-008..014). V1 bleibt unverändert. V4–V7 als „geplante Folgeversionen" benannt, ohne Feature-Detail. 4 OQs (OQ-V2-01..04) in einer Zwischenrunde entschieden und in Architektur-Festlegungen übernommen. Nächster Schritt: `/architecture` — erweitert auf V1–V7 denken.
- Current Phase: Architecture (Requirements V2 abgeschlossen)

## Immediate Next Steps
1. `/architecture` starten. Pflichtlektüre:
   - `/docs/PRD.md` (V1–V7-Scope, Constraints, Non-Goals, Architektur-Festlegungen aus OQ-V2-01..04)
   - `/docs/discovery-input-v2.md` (Scope-Erweiterung + Gründer-Fixpunkte)
   - `/docs/discovery-input.md` (V1-Richtungsvorgaben)
   - `/reports/RPT-001.md` (Discovery V1)
   - `/reports/RPT-002.md` (Requirements V1)
   - `/reports/RPT-003.md` (Discovery V2)
   - `/reports/RPT-004.md` (Requirements V2 — diese Runde)
   - `/features/` (14 Feature-Specs V1 + V2 + V3)
   - `/planning/roadmap.json` (V1–V8+)
   - `/planning/backlog.json` (BL-001..020)
   - `/strategaize-dev-system/docs/PLATFORM.md`
   - `/strategaize-dev-system/.claude/rules/data-residency.md`
2. `/architecture` muss in V1–V7 denken, nicht nur V1. Konkret zu klären (siehe PRD Abschnitt „Open Questions"):
   - OQ-A1: Datenschnitt Business-Ingest V1 (aus V1)
   - OQ-A2: GitHub-Repo für IS einrichten (aus V1)
   - OQ-A3: Tracking-Event-Schema V5 (einheitlich vs. hybrid)
   - OQ-A4: Worker-Layer-Architektur (gemeinsam vs. pro Modul, Empfehlung gemeinsam)
   - OQ-A5: Clay-Integration-Tiefe V3 (CSV-Minimum vs. Webhook/API-Pull)
   - OQ-A6: LinkedIn-Publishing-API-Realität V4 (App-Review-Aufwand, Fallback)
   - OQ-A7: Multi-Instanz-Architektur (Single-Codebase + Feature-Flags empfohlen)
   - OQ-A8: E-Mail-Provider-Auswahl V4
   - OQ-A9: Asset-Generierung synchron vs. asynchron
3. Zusätzliche Business-Roadmap-Abstimmung: Qualified-Lead-Inbox-Entität in Business V4.x/V5 einplanen (BL-016).
4. Nach `/architecture`: `/slice-planning` — Slice-Schnitt auf Basis BL-001..BL-020.

## Active Scope
V1: Fundament + Learning & Pattern Intelligence (FEAT-001..007) — Requirements abgeschlossen, Architecture offen.
V2: Content, Brand & Asset Production (FEAT-008, FEAT-009) — Requirements abgeschlossen 2026-04-16.
V3: Campaign & Lead Intelligence (FEAT-010..014) — Requirements abgeschlossen 2026-04-16.
V4–V8+: als „geplante Folgeversionen" in Roadmap und PRD benannt, ohne Feature-Level-Detail. Feature-Spezifikation in späteren `/requirements`-Läufen.

Gesamtarchitektur: 6 Funktionsbereiche über V1–V7. Gründer-Fixpunkte 2026-04-16: V1..Vn = Bau-Reihenfolge, nicht Scope-Amputation; Business = reine Lead-Abarbeitung; IS macht alles Vorgelagerte.

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
