# Spec References

## Zweck

Snapshot-Auszuege aus `reference/corey-haines-marketing-skills/` (MIT) — die im V1 als Datenmodell- und Bedrock-Prompt-Foundation dienen.

Hintergrund: Per DEC-021 ist `reference/corey-haines-marketing-skills/` als gitignored Spec-Quelle im Repo praesent, wird aber **nicht** committed. Damit das IS-Repo nach Spec-Inhalt durchsuchbar bleibt und die Bedrock-Prompts auditierbar sind, werden die V1-relevanten Spec-Auszuege hier als committed Snapshots extrahiert.

## Snapshots

| File | V1-FEAT | Quelle (im reference-Folder) |
|---|---|---|
| `brand-profile-12-sections.md` | FEAT-008 | `skills/product-marketing-context/SKILL.md` Sektion 1-12 |
| `cold-email-personalization.md` | FEAT-016 | `skills/cold-email/SKILL.md` 4-Level-Personalization + 4 Frameworks |
| `social-content-hook-formulas.md` | FEAT-009 LinkedIn-Post + FEAT-016 LinkedIn-Pitch | `skills/social-content/SKILL.md` Hook-Formeln + Pillars |
| `output-type-skill-mapping.md` | FEAT-009 (alle 7 Output-Typen) | Mapping-Tabelle Output-Typ -> Quell-Skill |

## Pflege-Regel

Bei Upstream-Update am Quell-Repo (Corey-Haines):
1. ADR (DEC) anlegen: "Spec-Foundation-Version-Bump auf vX"
2. Snapshot hier neu extrahieren
3. Migrations-Pfad pruefen falls JSONB-Schema betroffen (z.B. brand_profile.data-Schema)
4. Bedrock-Prompts pruefen falls Skill-Schema betroffen

## Lizenz-Hinweis

`coreyhaines31/marketingskills` ist MIT-lizenziert. Snapshots sind als Auszug zulaessig. Original-Lizenz und Authorship in jedem Snapshot-File referenziert.
