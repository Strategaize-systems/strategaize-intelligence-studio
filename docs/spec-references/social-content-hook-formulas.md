# Social Content — Hook-Formeln + Pillar-Framework (Snapshot)

## Quelle

`reference/corey-haines-marketing-skills/skills/social-content/SKILL.md` (MIT-Lizenz, coreyhaines31/marketingskills). Snapshot-Datum: 2026-04-26.

## Zweck im V1

FEAT-009 Output-Typ "LinkedIn-Post" und FEAT-016 LinkedIn-Pitch-Variante nutzen dieses Schema fuer Bedrock-Prompts.

## Struktur eines LinkedIn-Posts (V1-Schema)

```
{HOOK}              <- 1-3 Saetze, generiert nach 1 von 4 Formeln
{BODY}              <- Pillar-Framework-konformer Hauptteil
{CTA}               <- explizite Handlungsaufforderung am Ende
```

## 4 Hook-Formeln

KI generiert pro Post 4 Hook-Optionen und empfiehlt eine. User waehlt oder akzeptiert Empfehlung.

| # | Formel | Pattern | Beispiel |
|---|---|---|---|
| 1 | **Question** | Provokative Frage zur Pain-Point | "Warum brauchen Steuerberater 3 Tage fuer Mandanten-Onboarding, wenn der Prozess 30 Minuten dauern koennte?" |
| 2 | **Stat** | Konkrete Zahl + Spannung | "73% der Beratungen verbringen 40% ihrer Zeit mit Wissens-Suche statt mit Kunden-Wert." |
| 3 | **Story** | Persoenliche Story-Hook (1-2 Saetze) | "Letzte Woche hat ein Mandant uns gefragt: 'Wie schafft ihr es, dass jeder im Team alles weiss?'" |
| 4 | **Contrarian** | Gegen-These zur Industry-Common-Wisdom | "Die meisten denken, KI im Beratungsalltag bedeutet Chatbots. Sie liegen falsch." |

## Pillar-Framework (Body-Klassifikation)

Jeder Post folgt einem von 4 Pillars. KI waehlt basierend auf Quell-Objekt-Kontext und Brand-Profile-Sektion 12 (Goals).

| Pillar | Zweck | Tone |
|---|---|---|
| **Educate** | Wissen vermitteln, Pain-Point verstaerken, Aha-Momente | Lehrend, evidenzbasiert |
| **Entertain** | Story, Humor, Persoenliches | Locker, persoenlich |
| **Engage** | Frage, Diskussion ausloesen, Meinungs-Hot-Take | Provokativ, einladend |
| **Sell** | Werteversprechen, Conversion-Trigger | Direkt, klar |

V1 fuer Cold-Outreach (FEAT-016): Fokus auf **Engage** und **Sell**.
V1 fuer Branding (FEAT-009 LinkedIn-Post): Mix aus allen 4.

## CTA-Regeln

- Eine konkrete Handlungsaufforderung am Ende
- Verb aktiv (nicht passiv)
- Niedrige Aktivierungsenergie ("Lass uns 15 Min sprechen", nicht "Buche unverbindliches Erstgespraech")
- Optional Link am Ende, nicht im Body (LinkedIn-Algorithmus bestraft Links im Body)
- V1-LinkedIn-Pitch (FEAT-016): CTA ist `{LEAD_CTA}` Slot — wird mit Calendar-Link oder DM-Bitte gefuellt

## Caption-Length-Regel

- LinkedIn-Standard-Post: 1300-1900 Zeichen
- Hook = erste 200 Zeichen (vor dem "...mehr"-Klick)
- Hook MUSS Mehrwert standalone bieten (nicht "Read more in comments")

## Skill-spezifische Output-Formatierung

Bedrock-Output-Schema:
```json
{
  "hooks": [
    { "formula": "question", "text": "..." },
    { "formula": "stat", "text": "..." },
    { "formula": "story", "text": "..." },
    { "formula": "contrarian", "text": "..." }
  ],
  "recommended_hook": "question|stat|story|contrarian",
  "pillar": "educate|entertain|engage|sell",
  "body": "...",
  "cta": "...",
  "estimated_engagement_signal": "high|medium|low (KI-Schaetzung)"
}
```

## Lizenz

MIT — coreyhaines31/marketingskills. Snapshot-Auszug zulaessig. Originale in:
- `reference/corey-haines-marketing-skills/skills/social-content/SKILL.md`
- `reference/corey-haines-marketing-skills/skills/social-content/references/post-templates.md`
- `reference/corey-haines-marketing-skills/skills/social-content/references/platform-limits.md`
