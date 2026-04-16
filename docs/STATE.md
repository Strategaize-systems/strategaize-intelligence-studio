# STATE

## Project
- Name: StrategAIze Intelligence Studio
- Repository: strategaize-intelligence-studio
- Delivery Mode: internal-tool

## Purpose
System 3 der StrategAIze-Gesamtarchitektur. Interne Intelligence-, IP-, Opportunity- und Produktionsschicht. Sammelt Erkenntnisse aus Onboarding-Plattform (System 1) und Business Development System (System 2), verdichtet sie, priorisiert Chancen, erzeugt neue Module, Assets und Verbesserungen und übersetzt Entscheidungen in konkrete Folgearbeit — inklusive KI-, Automatisierungs- und Produktentscheidungen.

Referenz: `/strategaize-dev-system/docs/PLATFORM.md`.

## Current State
- High-Level State: slice-planning
- Current Focus: Slice-Planning V1 abgeschlossen 2026-04-16 (RPT-006). 10 Slices SLC-001..SLC-010 spezifiziert mit Micro-Task-Decomposition, AC, Dependencies, Risks, Worktree-Empfehlung. BL-021 Design-System-Grundstock als neuer Backlog-Eintrag formalisiert. Nächster Skill-Schritt: `/backend` für SLC-001 Project Setup & Foundation.
- Current Phase: Slice-Planning abgeschlossen — bereit für Implementation-Start

## Immediate Next Steps
1. `/backend` für SLC-001 Project Setup & Foundation (Blocker für alle folgenden Slices). Pflichtlektüre:
   - `/slices/SLC-001-project-setup.md` (Micro-Tasks MT-1..MT-6)
   - `/docs/ARCHITECTURE.md` Abschnitt 3–6 + 9 (Komponenten + Data Flow + Security)
   - `/docs/MIGRATIONS.md` MIG-001 (17 Tabellen + RLS)
   - `/docs/DECISIONS.md` DEC-008, DEC-009, DEC-017..019
   - `/strategaize-onboarding-plattform/` Worker-Pattern-Referenz
2. Nach SLC-001 Abschluss: `/qa` (mandatory per CLAUDE.md).
3. Danach SLC-002 Design-System-Grundstock mit `/frontend`.
4. Vor V3-Slice-Planning (später, separate Session): Business-Roadmap-Abstimmung zu Qualified-Lead-Inbox (BL-016, ISSUE-001, OQ-BD1).
5. Vor V4-Slice-Planning (später, separate Session): LinkedIn Creator-API-Realitätscheck (OQ-A6).

## Active Scope
V1: Fundament + Learning & Pattern Intelligence (FEAT-001..007) — Requirements + Architecture + Slice-Planning abgeschlossen. 10 Slices SLC-001..SLC-010 planned.
V2: Content, Brand & Asset Production (FEAT-008, FEAT-009) — Requirements + Architecture (konzeptionell) abgeschlossen 2026-04-16. Slice-Planning folgt nach V1-Deploy.
V3: Campaign & Lead Intelligence (FEAT-010..014) — Requirements + Architecture (konzeptionell) abgeschlossen 2026-04-16. Slice-Planning nach Business-Abstimmung + V2-Abschluss.
V4–V7: Architectural Direction in ARCHITECTURE.md skizziert, Feature-Spezifikation in späteren `/requirements`-Läufen.
V8+: Template-Modus, SMAO-API, Auto-Anonymisierung, KI-Auto-Priorisierung, Deal-Attribution.

Gesamtarchitektur: 6 Funktionsbereiche über V1–V7. Gründer-Fixpunkte 2026-04-16: V1..Vn = Bau-Reihenfolge, nicht Scope-Amputation; Business = reine Lead-Abarbeitung; IS macht alles Vorgelagerte. Style Guide V2 verbindlich ab Tag 1 (DEC-017).

## Blockers
- aktuell keine

## Last Stable Version
- none yet

## Notes
- Slice-Index: `/slices/INDEX.md` (10 V1-Slices).
- Alte V1-Planung unter `/docs/archive/`, `/reports/archive/v1-planning/`, `/features/archive/v1-original/`, `/slices/archive/v1-original/`, `/planning/archive/`.
- Gesamtarchitektur-Referenz: `/strategaize-dev-system/docs/PLATFORM.md`.
- Hosting-/Provider-Referenz: `/strategaize-dev-system/.claude/rules/data-residency.md`.
- Worker-/Queue-Muster: übernommen aus `/strategaize-onboarding-plattform/` (`ai_jobs` + `SKIP LOCKED` Pattern).
- Design-System: StrategAIze Style Guide V2 im Dev-System (`strategaize-dev-system/STRATEGAIZE_STYLE_GUIDE_V2.md`), physische Kopie im IS-Repo (`/docs/STYLE_GUIDE_V2.md`).
