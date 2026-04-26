# Slice Index

## Status

**V1 Marketing Launcher Slice-Planning abgeschlossen 2026-04-26 (RPT-010).** 8 Slices SLC-101..108 mit Micro-Task-Decomposition + TDD-Policy + Worktree-Empfehlung spezifiziert. Pre-Implementation-Bridges (BL-027 + BL-028) als parallele Coordination-Tasks im Backlog. Naechster Skill-Schritt: `/backend SLC-101` (Foundation-Refresh + MIG-002).

## V1 Marketing Launcher Slices

| ID | Slice | Feature | Status | Priority | Created |
|----|-------|---------|--------|----------|---------|
| SLC-101 | [Foundation Refresh](SLC-101-foundation-refresh.md) | Setup / BL-016 + BL-017 | planned | Blocker | 2026-04-26 |
| SLC-102 | [Brand Profile (12-Sektionen)](SLC-102-brand-profile.md) | FEAT-008 / BL-009 | planned | High | 2026-04-26 |
| SLC-103 | [Content Asset Production (7 Output-Typen)](SLC-103-content-asset-production.md) | FEAT-009 / BL-010 | planned | High | 2026-04-26 |
| SLC-104 | [ICP & Segment](SLC-104-icp-segment.md) | FEAT-010 / BL-011 | planned | High | 2026-04-26 |
| SLC-105 | [Lead Research (Firecrawl + Clay-CSV)](SLC-105-lead-research.md) | FEAT-015 / BL-014 | planned | High | 2026-04-26 |
| SLC-106 | [Messaging-Variation pro Lead](SLC-106-messaging-variation.md) | FEAT-016 / BL-015 | planned | High | 2026-04-26 |
| SLC-107 | [Campaign Management LITE](SLC-107-campaign-lite.md) | FEAT-011 / BL-012 | planned | High | 2026-04-26 |
| SLC-108 | [Lead Handoff (Pipeline-Push) + Performance-Capture](SLC-108-lead-handoff-performance.md) | FEAT-014 / BL-013 | planned | High | 2026-04-26 |

## Pre-Implementation-Bridges (parallele Coordination-Tasks)

| Bridge | Pre-Condition fuer | Repository | Status |
|---|---|---|---|
| **BL-028** Firecrawl Self-Host-Setup auf Hetzner | SLC-105 (Lead Research) — Implementation kann ohne Firecrawl-Endpoint nicht testbar sein | Self-Host-Operations (Hetzner-Compose oder dedizierter Server) | open |
| **BL-027** Business-System Coordination-Sprint (POST `/api/internal/deals` + INTERNAL_API_TOKEN) | V1-Final-Check / Go-Live (Auto-Mode des Pipeline-Push) — SLC-108 selbst ist Flag-gated und ohne BL-027 implementierbar | strategaize-business-system Repo | open |

**Bridge-Plan:** Beide Bridges laufen **parallel** zur V1-IS-Implementation, sind keine eigenen IS-Slices. BL-028 muss vor SLC-105-Implementation-Start abgeschlossen sein. BL-027 muss vor `/final-check V1` abgeschlossen sein.

## Worktree-Empfehlungen

| Slice | Worktree | Begruendung |
|---|---|---|
| SLC-101 | mandatory | DB-Migration, Foundation-Touch, viele Files |
| SLC-102 | mandatory | Singleton-Constraint + JSONB-Schema-Validation, kritische Foundation |
| SLC-103 | optional | Bedrock-Adapter-Touch + 7 Prompt-Builder, Worktree empfohlen |
| SLC-104 | optional | Geringes Risiko |
| SLC-105 | mandatory | Self-Host-Adapter + Cross-System-Integration |
| SLC-106 | optional | Wiederverwendet Pattern aus SLC-103 |
| SLC-107 | optional | Geringes Risiko |
| SLC-108 | mandatory | Cross-System-Integration Business-API + Closed-Loop-Schluss |

## TDD-Policy-Uebersicht

V1-Delivery-Mode = **Internal-Tool**, daher Default-Empfohlen. **Pflicht-TDD** fuer:
- Adapter-Implementations (alle 4 neuen + bedrockAdapter): `firecrawlAdapter`, `clayCsvAdapter`, `businessPipelineAdapter`, `linkedinAdsCsvAdapter`
- RLS-Policies aller 16 neuen Tabellen (SAVEPOINT-Tests gegen Coolify-Test-DB)
- Worker-Job-Handler (`assetGeneration`, `pitchGeneration`, `leadResearchRun`, `businessStatusPull`)
- Singleton-Constraint Brand-Profile, Duplikat-Constraint Lead, Idempotency-Constraint Handoff
- Bedrock-Prompt-Builder (alle 7 Asset + 2 Pitch)
- Few-shot-Loop-Query (DEC-027, scharf in SLC-108)
- 4-Level-Composer + Filter-Builder + Statemachine
- Volltext-Suche, Live-Query-Executor, Markdown-Export

**Empfohlen-TDD:** Server-Actions, Aggregation-Queries, Batch-Logic.

**Nicht-TDD:** UI-Komponenten (Forms, Listen, Detail-Layouts). Visuelle Verifikation reicht.

## Slice-Reihenfolge-Rationale

- **SLC-101 zuerst:** Foundation (MIG-002, Style-Guide, Adapter-Skeletons, Worker-Enum) ist Pre-Condition fuer alle Feature-Slices.
- **SLC-102 vor SLC-103:** Asset-Generation braucht Brand-Profile als KI-Kontext.
- **SLC-103 vor SLC-106:** Pitch-Generation wiederverwendet Asset-Generation-Pattern (Worker-Handler, Prompt-Builder-Layout, Few-shot-Loader-Stub).
- **SLC-104 vor SLC-105:** Lead-Research filtert ueber ICP/Segment.
- **SLC-105 nach BL-028:** Firecrawl muss Self-Host laufen.
- **SLC-105 vor SLC-106:** Pitch-Generation braucht Lead-Daten als Personalization-Quelle.
- **SLC-106 vor SLC-107:** Campaign LITE klammert Pitches mit ein.
- **SLC-107 vor SLC-108:** Pipeline-Push pusht Lead mit Campaign-Kontext, Performance-Aggregation lebt auf Campaign-Ebene.
- **SLC-108 als letzter:** Schliesst die Schleife mit Performance-Capture-Loop + Few-shot-scharf-Schaltung. Beruehrt SLC-103-Stub und macht Closed-Loop-Differentiator aktiv.

## V6+ Slices

V6 Wissensverdichtungs-Backbone (ehemals V1, FEAT-001..007) wird in einer separaten `/slice-planning V6`-Runde nach V5-Abschluss zugeschnitten. Feature-Spec-Grundlagen existieren bereits unter `/features/`.

V2-V5 + V7-V9+ Slice-Planning erfolgt jeweils nach den entsprechenden Requirements-Runden.

## Deprecated — alte V1-Slices (ehemaliges Wissensverdichtungs-V1, jetzt V6)

**Status: deprecated 2026-04-26 durch Pivot zum Marketing Launcher V1.**

Die folgenden Slices wurden im alten Slice-Planning-Lauf 2026-04-16 fuer das urspruengliche V1 (Wissensverdichtungs-Backbone) spezifiziert. Sie sind durch den Pivot 2026-04-25 nicht mehr V1-Slices und passen inhaltlich zu V6. Im V6-Slice-Planning-Lauf werden sie als Vorlage verwendet, ggf. neu zugeschnitten.

| ID (alt) | Slice | Feature | Status | Priority | Created |
|----|-------|---------|--------|----------|---------|
| SLC-001 (deprecated) | [Project Setup & Foundation](SLC-001-project-setup.md) | BL-008 (V6) | deprecated | — | 2026-04-16 |
| SLC-002 (deprecated) | [Design-System-Grundstock](SLC-002-design-system-foundation.md) | BL-017 (V1) | deprecated | — | 2026-04-16 |
| SLC-003 (deprecated) | [FEAT-001 Ingest-Onboarding](SLC-003-ingest-onboarding.md) | BL-001 (V6) / FEAT-001 | deprecated | — | 2026-04-16 |
| SLC-004 (deprecated) | [FEAT-002 Ingest-Business](SLC-004-ingest-business.md) | BL-002 (V6) / FEAT-002 | deprecated | — | 2026-04-16 |
| SLC-005 (deprecated) | [FEAT-007 Deployment Registry](SLC-005-deployment-registry.md) | BL-007 (V6) / FEAT-007 | deprecated | — | 2026-04-16 |
| SLC-006 (deprecated) | [FEAT-003 Portfolio-Monitor](SLC-006-portfolio-monitor.md) | BL-003 (V6) / FEAT-003 | deprecated | — | 2026-04-16 |
| SLC-007 (deprecated) | [FEAT-004 Insight-Layer](SLC-007-insight-layer.md) | BL-004 (V6) / FEAT-004 | deprecated | — | 2026-04-16 |
| SLC-008 (deprecated) | [FEAT-005 Opportunity & Decision](SLC-008-opportunity-decision.md) | BL-005 (V6) / FEAT-005 | deprecated | — | 2026-04-16 |
| SLC-009 (deprecated) | [FEAT-006 Cross-Kunden-Learnings](SLC-009-cross-kunden-learnings.md) | BL-006 (V6) / FEAT-006 | deprecated | — | 2026-04-16 |
| SLC-010 (deprecated) | [V1 Gesamt-QA + Polish](SLC-010-v1-gesamt-qa.md) | alle alten V1 | deprecated | — | 2026-04-16 |

**Wichtig:**
- Slice-Markdown-Dateien bleiben physisch erhalten als Spec-Vorlage fuer V6.
- SLC-002 (Design-System-Grundstock alt) ist inhaltlich in SLC-101 (Foundation Refresh) integriert.
- Im V6-Slice-Planning werden die Slices entweder uebernommen oder neu zugeschnitten.

## Archivierte V1-Slices (aelter, vor 2026-04-16 Re-Discovery)

`/slices/archive/v1-original/` — alte Pre-Re-Discovery-Slices, nur historische Referenz.
