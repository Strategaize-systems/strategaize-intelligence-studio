# Output-Type-to-Skill Mapping (V1 — FEAT-009)

## Quelle

Mapping aus FEAT-009-Spec (Sektion "7 Output-Typen mit Skill-Quellbezug"), basierend auf coreyhaines31/marketingskills (MIT). Snapshot-Datum: 2026-04-26.

## Zweck im V1

V1-Datenmodell `asset.source_skill` (PostgreSQL-Enum, DEC-024) folgt diesem Mapping. Pro Output-Typ existiert ein dedizierter Bedrock-Prompt-Builder unter `src/prompts/asset/<output_type>.ts`, der den Skill-spezifischen Output-Schema einhaelt.

## V1 Output-Typen

| # | `output_type` (Enum) | `source_skill` (Enum) | Reference-Skill | Output-Schema (Kurzfassung) |
|---|---|---|---|---|
| 1 | `blogpost` | `copywriting` | `skills/copywriting/SKILL.md` | Page Copy + 1-2 Alternative-Headlines + Editorial-Annotations + Meta-Description |
| 2 | `linkedin_post` | `social_content` | `skills/social-content/SKILL.md` | 4 Hook-Optionen + Empfehlung + Pillar-Klassifikation + Body + CTA |
| 3 | `onepager` | `sales_enablement_onepager` | `skills/sales-enablement/SKILL.md` | 5 Sektionen: Problem / Solution / 3 Differentiators / Proof / CTA |
| 4 | `email_template` | `cold_email` | `skills/cold-email/SKILL.md` | Subject 2-4 Woerter + Body in 1 von 4 Frameworks + 4-Level-Slots + Follow-up-Outline |
| 5 | `case_card` | `sales_enablement_casecard` | `skills/sales-enablement/SKILL.md` | 6 Felder: Customer / Challenge / Solution / Results / Pull-Quote / Tags |
| 6 | `landingpage_briefing` | `copywriting_landingpage` | `skills/copywriting/SKILL.md` + `skills/page-cro/SKILL.md` | 7-Dimensionen-CRO-Briefing: Above-Fold-Hook, Value-Prop, Social-Proof-Block, Differentiation, Objection-Handling, CTA, Scarcity/Trust-Signals |
| 7 | `website_spec` | `site_architecture` | `skills/site-architecture/SKILL.md` | ASCII-Tree + Mermaid-Sitemap + URL-Map-Table + Nav-Spec + Internal-Linking-Plan |

## V1-Pflicht-Sektionen aus Brand-Profile pro Output-Typ

(Siehe `docs/spec-references/brand-profile-12-sections.md` Sektion "Skill-spezifische Sektion-Hervorhebung")

## Erweiterungen V2+ (nicht in V1-Enum)

Spaeter geplant (gehoeren NICHT in V1-Enum, kommen mit eigenem Migration-Slice):
- `video_script` (V9+)
- `carousel` (V9+)
- `presentation` (V9+)
- `ad_creative` (V4 — `ad-creative`-Skill aus reference)

## Bedrock-Prompt-Builder-Verzeichnis

```
src/prompts/asset/
├── blogpost.ts            # FEAT-009 Output-Typ 1
├── linkedin-post.ts       # FEAT-009 Output-Typ 2
├── onepager.ts            # FEAT-009 Output-Typ 3
├── email-template.ts      # FEAT-009 Output-Typ 4
├── case-card.ts           # FEAT-009 Output-Typ 5
├── landingpage-briefing.ts# FEAT-009 Output-Typ 6
├── website-spec.ts        # FEAT-009 Output-Typ 7
└── shared/
    ├── brand-profile-context.ts   # System-Prompt-Builder (alle 12 Sektionen)
    ├── few-shot-loader.ts         # Lade Top-N Performer aus asset_performance
    └── prompt-types.ts             # Shared types

src/prompts/pitch/
├── email.ts               # FEAT-016 Cold-Email-Pitch
└── linkedin.ts            # FEAT-016 LinkedIn-Pitch
```

## Lizenz

MIT — coreyhaines31/marketingskills. Mapping-Dokumentation ist eigenes IP.
