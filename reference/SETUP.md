# Reference Folder — Setup

Dieser Ordner enthaelt externe Referenz-Material, das **nicht** Teil des IS-Repos ist und nicht committed wird (siehe `.gitignore`). Die Inhalte dienen als **Spec-Quelle** fuer Datenmodell, Bedrock-Prompt-Vorlagen und Architektur-Entscheidungen — sie laufen **nicht zur Runtime** im IS-Worker.

Diese Datei ist dagegen **committed** und beschreibt, wie der reference-Folder neu aufgesetzt wird (z. B. nach Repo-Clone, in einer neuen Dev-Umgebung, oder nach versehentlichem Loeschen).

## Was kommt hier rein

| Quelle | Zweck | Lizenz |
|---|---|---|
| `corey-haines-marketing-skills/` | Spec-Foundation fuer V1 Marketing Launcher (12-Sektionen-Brand-Profile-Schema, 7 Output-Typen mit Skill-Quellbezug, 4-Level-Personalization, marketing-psychology-Booster) | MIT |

## Initial-Setup

Nach Repo-Clone in einer neuen Dev-Umgebung — einmalig ausfuehren:

```bash
cd <is-repo-root>
git clone --depth 1 https://github.com/coreyhaines31/marketingskills reference/corey-haines-marketing-skills
```

Verifikation:

```bash
ls reference/corey-haines-marketing-skills/skills/product-marketing-context/SKILL.md
```

Sollte existieren.

## Refresh / Update

Wenn die Quelle (`coreyhaines31/marketingskills`) Updates erhaelt und du diese im IS uebernehmen willst:

```bash
rm -rf reference/corey-haines-marketing-skills
git clone --depth 1 https://github.com/coreyhaines31/marketingskills reference/corey-haines-marketing-skills
```

**Wichtig:** Aenderungen an der Spec-Foundation koennen die V1-FEAT-Specs (FEAT-008 / FEAT-009 / FEAT-016) inhaltlich beeinflussen. Vor einem Refresh:

1. Pruefen, ob die im `/architecture V1` extrahierten Specs in `docs/spec-references/` noch gueltig sind.
2. Bei Drift: ADR (DEC) anlegen, das die neue Foundation-Version festhaelt + Migrations-Pfad fuer betroffene Tabellen (z. B. `brand_profile.data` JSONB-Schema).

## Snapshot-Strategie (Empfehlung)

`reference/` ist gitignored. Damit das IS-Repo bei einem Build / Deploy ohne Internet trotzdem funktioniert, werden die wirklich genutzten Specs schrittweise in `docs/spec-references/` extrahiert. Diese Extraktionen sind **committed** und enthalten:

- Skill-Schema-Auszuege (z. B. die 12 Sektionen aus `product-marketing-context`)
- Bedrock-Prompt-Vorlagen pro Output-Typ
- Personalization-Frameworks (cold-email)

Damit haengt die Runtime nicht vom externen Repo ab, und Audit-Trail fuer Prompt-Inhalte bleibt im IS-Repo.

## Hintergrund (DEC-021)

Siehe `/docs/DECISIONS.md` DEC-021 fuer die strategische Begruendung der Spec-Foundation-Wahl.
