# Slice Index

## Status

**V1 Marketing Launcher Slice-Planning ist NOCH NICHT durchgelaufen.** Naechster Skill-Schritt nach Architecture: `/slice-planning V1`.

Geplante Slice-Anzahl: 8 (Setup + Brand Profile + Content Asset Production + ICP/Segment + Lead Research + Messaging-Variation + Campaign Lite + Lead Handoff/Performance) — siehe Memory `project_marketing_launcher_v1_scope.md`. Finaler Slice-Schnitt entsteht im `/slice-planning V1`-Lauf.

## V1 Marketing Launcher Slices (planned, noch nicht spezifiziert)

| ID | Slice | Feature | Status | Priority | Created |
|----|-------|---------|--------|----------|---------|
| SLC-101 | Project Setup & Foundation Refresh | BL-016 | not-yet-planned | Blocker | tbd |
| SLC-102 | FEAT-008 Brand Profile (12-Sektionen) | BL-009 / FEAT-008 | not-yet-planned | High | tbd |
| SLC-103 | FEAT-009 Content Asset Production (7 Output-Typen) | BL-010 / FEAT-009 | not-yet-planned | High | tbd |
| SLC-104 | FEAT-010 ICP & Segment | BL-011 / FEAT-010 | not-yet-planned | High | tbd |
| SLC-105 | FEAT-015 Lead Research (Firecrawl + Clay-CSV) | BL-014 / FEAT-015 | not-yet-planned | High | tbd |
| SLC-106 | FEAT-016 Messaging-Variation pro Lead | BL-015 / FEAT-016 | not-yet-planned | High | tbd |
| SLC-107 | FEAT-011 Campaign Management LITE | BL-012 / FEAT-011 | not-yet-planned | High | tbd |
| SLC-108 | FEAT-014 Lead Handoff (Pipeline-Push) + Performance-Capture | BL-013 / FEAT-014 | not-yet-planned | High | tbd |

**Hinweis zur ID-Konvention:** Die V1-Marketing-Launcher-Slices verwenden den Praefix `SLC-1xx`, um Verwechslungen mit den deprecated alten V1-Slices (SLC-001..010, jetzt zu V6 gehoerig) zu vermeiden. Finale IDs entstehen im `/slice-planning V1`-Lauf.

## Pre-Implementation-Verifikationen (vor SLC-105 + SLC-108)

- **BL-025 Firecrawl EU-Hosting + DPA verifizieren** — vor SLC-105 (Lead Research). Risk R-01 + OQ-V1-02.
- **BL-026 Business-Pipeline-API-Endpoint verifizieren** — vor SLC-108 (Lead Handoff). Risk R-02 + OQ-V1-03.

## Reihenfolge-Rationale (Vorschlag fuer /slice-planning V1)

- **SLC-101 Foundation Refresh zuerst:** Schema-Erweiterungen (brand_profile, asset/asset_version/asset_performance, lead/research_run, pitch/pitch_version, handoff_event, campaign mit n:m-Verknuepfungstabellen) muessen vor allen Feature-Slices stehen.
- **SLC-102 Brand Profile vor SLC-103:** Asset-Generierung (FEAT-009) braucht Brand Profile als KI-Kontext.
- **SLC-103 Content Asset Production vor SLC-106:** Pitch-Generation (FEAT-016) wiederverwendet Asset-Generation-Pattern.
- **SLC-104 ICP & Segment vor SLC-105:** Lead Research filtert ueber ICP/Segment.
- **SLC-105 Lead Research vor SLC-106:** Pitch-Generation braucht Lead-Daten.
- **SLC-106 Messaging-Variation vor SLC-107:** Campaign Lite klammert Pitches mit ein.
- **SLC-107 Campaign Lite vor SLC-108:** Pipeline-Push pusht Lead mit Campaign-Kontext.
- **SLC-108 als letzter Slice:** Performance-Capture braucht alle vorherigen Slices, Pipeline-Push braucht Campaign + Lead + Pitch.

Pre-Implementation-Verifikationen (BL-025 + BL-026) als Vorab-Bridges in SLC-101 oder als eigene Mini-Slices.

## Worktree-Empfehlung (Vorschlag)

- Empfohlen: SLC-101 (Foundation), SLC-102 (Schema-Migration), SLC-105 (Firecrawl-Adapter-Risiko), SLC-108 (Pipeline-Push-Risiko)
- Optional: SLC-103, SLC-104, SLC-106, SLC-107

## V6+ Slices

V6 Wissensverdichtungs-Backbone (ehemals V1, FEAT-001..007) wird in einer separaten `/slice-planning`-Runde nach V5-Abschluss zugeschnitten. Feature-Spec-Grundlagen existieren bereits unter `/features/`.

V2-V5 + V7-V9+ Slice-Planning erfolgt jeweils nach den entsprechenden Requirements-Runden.

## Deprecated — alte V1-Slices (ehemaliges Wissensverdichtungs-V1, jetzt V6)

**Status: deprecated 2026-04-26 durch Pivot zum Marketing Launcher V1.**

Die folgenden Slices wurden im alten Slice-Planning-Lauf 2026-04-16 fuer das urspruengliche V1 (Wissensverdichtungs-Backbone) spezifiziert. Sie sind durch den Pivot 2026-04-25 nicht mehr V1-Slices und passen inhaltlich zu V6 (Wissensverdichtungs-Backbone). Im V6-Slice-Planning-Lauf (spaeter) werden sie als Vorlage verwendet, ggf. neu zugeschnitten und mit neuen IDs versehen.

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
- Die Slice-Markdown-Dateien bleiben physisch erhalten (nicht geloescht), weil sie inhaltlich gute Spec-Vorlage fuer V6 sind.
- SLC-002 (Design-System-Grundstock) bleibt auch fuer V1-Marketing-Launcher relevant — wird im `/slice-planning V1` als Sub-Aufgabe von SLC-101 (Foundation Refresh) wieder aufgenommen oder als eigener V1-Slice neu spezifiziert.
- Im V6-Slice-Planning werden die Slices entweder uebernommen oder neu zugeschnitten.

## Archivierte V1-Slices (aelter, vor 2026-04-16 Re-Discovery)

`/slices/archive/v1-original/` — alte Pre-Re-Discovery-Slices, nur historische Referenz.
