# Feature Index

**Pivot 2026-04-25:** V1 ist jetzt der **Marketing Launcher** (Closed Loop Lite). Die ursprüngliche V1-Planung (Wissensverdichtungs-Backbone) ist auf **V6** verschoben. Spec-Foundation für V1: coreyhaines31/marketingskills (MIT, 47 Skills) — siehe `reference/corey-haines-marketing-skills/`.

## V1 Features — Marketing Launcher (Closed Loop Lite)

| ID | Feature | Status | Spec | Created |
|----|---------|--------|------|---------|
| FEAT-008 | Brand Profile (12-Sektionen-Schema) | planned | [Spec](FEAT-008-brand-profile.md) | 2026-04-25 |
| FEAT-009 | Content Asset Production (7 Output-Typen mit Skill-Quellbezug) | planned | [Spec](FEAT-009-content-asset-production.md) | 2026-04-25 |
| FEAT-010 | ICP & Segment (aus product-marketing-context Sektion 2+3) | planned | [Spec](FEAT-010-icp-segment.md) | 2026-04-25 |
| FEAT-011 | Campaign Management LITE (Parent-Klammer ohne Variants) | planned | [Spec](FEAT-011-campaign-management.md) | 2026-04-25 |
| FEAT-014 | Lead Handoff (Pipeline-Push) + Performance-Capture | planned | [Spec](FEAT-014-qualified-lead-handoff.md) | 2026-04-25 |
| FEAT-015 | Lead Research (Firecrawl + Clay-CSV) | planned | [Spec](FEAT-015-lead-research.md) | 2026-04-25 |
| FEAT-016 | Messaging-Variation pro Lead | planned | [Spec](FEAT-016-messaging-variation.md) | 2026-04-25 |

## V2 Features — E-Mail-Versand-Adapter + Open-Tracking

| Bereich | Primärer Inhalt | Status |
|---------|-----------------|--------|
| E-Mail-Adapter | Postmark EU primär, AWS SES Frankfurt als Alternative (DEC-013), Versand-Queue, Open/Click-Tracking | geplant — Feature-Spec in eigener Requirements-Runde |

## V3 Features — Voll-Lead-Research + Lead-Scoring

| ID | Feature | Status | Spec | Created |
|----|---------|--------|------|---------|
| FEAT-013 | Lead Scoring (regelbasiert + Disqualifier) | planned | [Spec](FEAT-013-lead-scoring.md) | 2026-04-16 |

Plus: Voll-Firecrawl-Adapter (Webhook + API-Pull), Auto-Disqualifier-Regeln vor Pitch-Generierung — Spec in eigener V3-Requirements-Runde.

## V4 Features — LinkedIn-Publishing + Multi-Channel-Distribution

| Bereich | Primärer Inhalt | Status |
|---------|-----------------|--------|
| FEAT-011 Voll-Variant | Channel-Segments + Variants (A/B-Vorbereitung, ergänzt V1-Lite) | geplant |
| LinkedIn-Adapter | Creator-API primär, Buffer/Hootsuite als Fallback (DEC-014) | geplant |
| High-Attention-Outreach | Physischer Brief + Call als Channel-Variante (zurückgeholt aus alter V3) | geplant |

Feature-Specs in eigener V4-Requirements-Runde.

## V5 Features — Voll-Tracking + KI-Scoring + A/B-Statistik

| Bereich | Primärer Inhalt | Status |
|---------|-----------------|--------|
| Tracking-Event-Schema | Hybrid (DEC-015): Core-Felder + kanalspezifisches JSON-Payload | geplant |
| Performance-Cockpit | Konsolidiertes Cockpit, Attribution auf Kampagnen-Ebene | geplant |
| KI-Scoring | Löst FEAT-013 regelbasiertes Scoring ab | geplant |
| Auto-Variant-Generierung | KI-generiert Asset-Varianten, A/B-Statistik mit Signifikanz-Test | geplant |

Feature-Specs in eigener V5-Requirements-Runde.

## V6 Features — Wissensverdichtungs-Backbone (ehemals V1)

**Verschoben 2026-04-25.** Inhaltlich identisch zur ursprünglichen V1-Planung 2026-04-15/16. Specs existieren bereits, bleiben gültig.

| ID | Feature | Status | Spec | Created |
|----|---------|--------|------|---------|
| FEAT-001 | Ingest-Layer Onboarding | planned | [Spec](FEAT-001-ingest-onboarding.md) | 2026-04-15 |
| FEAT-002 | Ingest-Layer Business | planned | [Spec](FEAT-002-ingest-business.md) | 2026-04-15 |
| FEAT-003 | Portfolio-Monitor | planned | [Spec](FEAT-003-portfolio-monitor.md) | 2026-04-15 |
| FEAT-004 | Insight-Layer | planned | [Spec](FEAT-004-insight-layer.md) | 2026-04-15 |
| FEAT-005 | Opportunity & Decision basic | planned | [Spec](FEAT-005-opportunity-decision.md) | 2026-04-15 |
| FEAT-006 | Cross-Kunden-Learnings basic | planned | [Spec](FEAT-006-cross-kunden-learnings.md) | 2026-04-15 |
| FEAT-007 | Customer Deployment Registry | planned | [Spec](FEAT-007-deployment-registry.md) | 2026-04-15 |

Feature-Specs werden in V6-Slice-Planning später zugeschnitten — sie sind aktuell nicht aktiv und auf das Marketing-Launcher-V1 wartend.

## Verschoben/Umgewidmet aus alter V3-Planung

- **FEAT-012 Lead Research & Enrichment (alt)** — Inhalt geht in **FEAT-015 (V1)** auf. Alte Spec-Datei wird im /architecture-V1-Lauf archiviert oder als „v1-pivot-redirect" markiert.

## V7 Features — Validation & Idea Testing

| Bereich | Primärer Inhalt | Status |
|---------|-----------------|--------|
| Experiment-Entität | Hypothese, Kill-Kriterien, Erfolgssignale, Budget, Zeitfenster | geplant |
| KI-Vorschlag | Experiment-Designs aus Opportunities (V6+ verfügbar) | geplant |
| Research-Task | 6 Research-Typen (aus archiviertem alten FEAT-012) | geplant |

Feature-Specs in eigener V7-Requirements-Runde.

## V8 Features — Orchestration & Decision Layer

| Bereich | Primärer Inhalt | Status |
|---------|-----------------|--------|
| Hybrid-Cockpit | Priority-Felder + Top-5-Dashboard (DEC-007) | geplant |
| Manuelle Flags | Sortierung nach Priorität | geplant |
| Learning-Rückflüsse | An Onboarding (Fragenkataloge) und Business (Argumente) | geplant |

KI-Auto-Priorisierung = V9+. Feature-Specs in eigener V8-Requirements-Runde.

## V9+ Features — Multi-Tenant + Voice-API + Erweiterungen

| Bereich | Primärer Inhalt | Status |
|---------|-----------------|--------|
| Template-Modus | Multi-Instanz-Aktivierung für externe Kundenunternehmen | geplant |
| Custom-Brand-Profile | Pro Kunde (löst V1-Singleton ab) | geplant |
| SMAO-Partner-API | Auth, Rate-Limiting, Knowledge Packaging | geplant |
| Auto-Anonymisierung | Via Bedrock für Cross-Kunden-Learnings | geplant |
| KI-Auto-Clustering | Auto-Pattern-Erkennung | geplant |
| KI-Auto-Priorisierung | Im Orchestration-Layer | geplant |
| Deal-Ebene-Attribution | Kampagne → Deal-Abschluss | geplant |
| Weitere Kanäle | X, YouTube/Short-Video, Paid-Ads | geplant |

## Archiv

Archivierte V1-Features (alte Re-Discovery 2026-04-15-Planung): `/features/archive/v1-original/` — nur Referenz, nicht mehr gültig.

Referenz-Mapping Archiv → neue Specs:
- Archiv FEAT-007 Content Transformer → neuer **FEAT-009** (auf 7 Output-Typen erweitert)
- Archiv FEAT-008 Brand Control → neuer **FEAT-008** (auf 12-Sektionen-Schema umgeschrieben)
- Archiv FEAT-011 Experiment Manager → wird in V7 aufgegriffen
- Archiv FEAT-012 Research & Market Prep → teilweise FEAT-015 (V1, Lead Research) + V7 (Research-Task)
- Archiv FEAT-010 Knowledge Packaging → V9+ (SMAO-API)
- Archiv FEAT-009 Modules/Flows Build-Drafts → parked, später neu bewerten
