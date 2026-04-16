# Slice Index

## Status
Slice-Planning V1 abgeschlossen 2026-04-16. 10 Slices (SLC-001..SLC-010) definiert — Foundation + Design-System + 7 V1-Feature-Slices + Gesamt-QA.

Nächster Schritt: `/backend` für SLC-001 Project Setup.

Archivierte V1-Slices (alte Planung, nicht mehr gültig): `/slices/archive/v1-original/`

## V1 Slices

| ID | Slice | Feature | Status | Priority | Created |
|----|-------|---------|--------|----------|---------|
| SLC-001 | [Project Setup & Foundation](SLC-001-project-setup.md) | BL-001 | planned | Blocker | 2026-04-16 |
| SLC-002 | [Design-System-Grundstock](SLC-002-design-system-foundation.md) | BL-021 | planned | Blocker | 2026-04-16 |
| SLC-003 | [FEAT-001 Ingest-Onboarding](SLC-003-ingest-onboarding.md) | BL-002 / FEAT-001 | planned | High | 2026-04-16 |
| SLC-004 | [FEAT-002 Ingest-Business](SLC-004-ingest-business.md) | BL-003 / FEAT-002 | planned | High | 2026-04-16 |
| SLC-005 | [FEAT-007 Deployment Registry](SLC-005-deployment-registry.md) | BL-008 / FEAT-007 | planned | High | 2026-04-16 |
| SLC-006 | [FEAT-003 Portfolio-Monitor](SLC-006-portfolio-monitor.md) | BL-004 / FEAT-003 | planned | High | 2026-04-16 |
| SLC-007 | [FEAT-004 Insight-Layer](SLC-007-insight-layer.md) | BL-005 / FEAT-004 | planned | High | 2026-04-16 |
| SLC-008 | [FEAT-005 Opportunity & Decision](SLC-008-opportunity-decision.md) | BL-006 / FEAT-005 | planned | High | 2026-04-16 |
| SLC-009 | [FEAT-006 Cross-Kunden-Learnings](SLC-009-cross-kunden-learnings.md) | BL-007 / FEAT-006 | planned | Medium | 2026-04-16 |
| SLC-010 | [V1 Gesamt-QA + Polish](SLC-010-v1-gesamt-qa.md) | alle V1 | planned | High | 2026-04-16 |

## Reihenfolge-Rationale

- **SLC-001 → SLC-002 zuerst**: Foundation (Repo, Supabase, Auth, Adapter-Skeletons, Worker) + Design-System müssen vor Feature-UIs stehen (DEC-017).
- **SLC-003/004 Ingest vor UIs**: Ingest liefert Daten, die Portfolio-Monitor, Insight-Layer und Opportunity brauchen.
- **SLC-005 Deployment-Registry vor SLC-006 Portfolio-Monitor**: Portfolio-Monitor-Detail zeigt Deployment-Card eingebettet.
- **SLC-006 Portfolio-Monitor vor SLC-007/008**: Portfolio ist Einstiegspunkt, Drilldown-Ziel von Insight-Layer und Opportunity.
- **SLC-007 Insight-Layer vor SLC-008 Opportunity**: Opportunity-Create greift auf KU-Ableitung (SLC-007 MT-5) zurück.
- **SLC-008 Opportunity vor SLC-009 Cross-Kunden-Learnings**: Learning-Modal ist Ergänzung zu Insight-Layer, aber KI-Pipeline aus SLC-008 etabliert Cost-Cap-Pattern.
- **SLC-010 Gesamt-QA als letzter Slice**: E2E-Prüfung über alle Features, separater Schritt vor `/final-check`.

## Worktree-Empfehlung

- Empfohlen: SLC-001 (Foundation), SLC-002 (großer UI-Impact), SLC-008 (KI-Pipeline-Risiko)
- Optional: SLC-003, SLC-004, SLC-005, SLC-006, SLC-007, SLC-009, SLC-010

## Offene V1-Nebenaufgaben
- `BL-016` Business-Roadmap-Abstimmung: NICHT V1, sondern vor V3-Slice-Planning.
- `OQ-A6` LinkedIn Creator-API-Realitätscheck: NICHT V1, sondern vor V4-Slice-Planning.

## V2+ Slices
V2 und V3 werden in einer separaten `/slice-planning`-Runde nach V1-Deploy geplant. Feature-Spec-Grundlagen (FEAT-008..014) bereits vorhanden.
