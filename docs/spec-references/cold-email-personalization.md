# Cold-Email — 4-Level-Personalization + Frameworks (Snapshot)

## Quelle

`reference/corey-haines-marketing-skills/skills/cold-email/SKILL.md` (MIT-Lizenz, coreyhaines31/marketingskills). Snapshot-Datum: 2026-04-26.

## Zweck im V1

FEAT-016 Messaging-Variation pro Lead generiert pro Lead einen personalisierten Pitch mit 4-Level-Personalization. Dieses Schema definiert die Slot-Struktur und Framework-Auswahl im Bedrock-Prompt.

FEAT-009 E-Mail-Vorlage nutzt dasselbe Framework + Subject-Schema fuer generische E-Mail-Templates.

## Subject-Line-Regel

- 2-4 Woerter
- Max 50 Zeichen
- Keine "Re:" / "Fwd:" Faking
- Keine Caps-Lock, keine Emojis
- Konkret, neugierig-machend, nicht clickbait

## 4 Body-Frameworks

| # | Framework | Kurzform | Wann verwenden |
|---|---|---|---|
| 1 | **Problem-Solution** | Pain-Point benennen -> Loesung skizzieren -> CTA | Lead in Pain-Point-Phase |
| 2 | **Curiosity** | Provokative Frage -> Andeutung Antwort -> CTA fuer Vollantwort | Lead muss erst aufmerksam werden |
| 3 | **Trigger-Event** | Konkretes Ereignis erwaehnen (Funding, Hiring, Pivot) -> Relevanz -> CTA | Wenn Lead-Trigger-Signal erkennbar |
| 4 | **Direct-Pitch** | Klare Werteversprechen + Proof -> CTA | Lead bereits warm oder hoch-personalisiert |

## 4-Level-Personalization-Slots

Jeder Pitch hat 4 Slot-Variablen die KI fuellt. Slots werden im Body als markierte Stellen eingebaut und nicht zwingend in dieser Reihenfolge.

### Level 1: Industry (Pflicht)
- **Slot:** `{INDUSTRY_HOOK}`
- **Quelle:** Lead.industry + ICP.industry + Brand-Profile-Sektion 4 (Pain Points der Branche)
- **Beispiel:** "Bei Steuerberater-Kanzleien wie Ihrer in Sueddeutschland sehen wir aktuell, dass Mandanten-Onboarding 3 Tage braucht, was..."

### Level 2: Company (Pflicht)
- **Slot:** `{COMPANY_INSIGHT}`
- **Quelle:** Lead.company_name + Lead.enrichment_data + Trigger-Signals
- **Beispiel:** "Da Ihre Kanzlei in den letzten 12 Monaten von 8 auf 15 MA gewachsen ist..."

### Level 3: Role (optional je nach Lead-Daten)
- **Slot:** `{ROLE_RELEVANCE}`
- **Quelle:** Lead.contact_role + ICP.decision_makers + Brand-Profile-Sektion 3 (Personas)
- **Beispiel:** "Als Geschaeftsfuehrer wissen Sie, dass Skalierung von Kanzlei-Prozessen nicht ueber..."

### Level 4: Individual (optional, hoechste Personalisierung)
- **Slot:** `{INDIVIDUAL_OBSERVATION}`
- **Quelle:** Lead.contact_name + Lead.linkedin_url + Lead.notes
- **Beispiel:** "Ihre kuerzliche LinkedIn-Aussage, dass die Branche ueberreguliert ist, deckt sich..."
- **Fallback:** Ohne LinkedIn-URL und Notizen wird Level 4 weggelassen, `personalization_level_used = role` gesetzt

## Level-Hierarchie (V1-Implementation)

```
personalization_level_used := highest_filled(industry, company, role, individual)
```

Mindestanforderung V1: `industry` + `company` muessen befuellt sein (sonst Generation abgebrochen mit Fehler `INSUFFICIENT_LEAD_DATA`).

## Follow-up-Sequence (V1: Vorbereitung, Versand erst V2)

Skill-Schema definiert 3-Step-Follow-up:
- **Step 1 (Day 0):** Initial-Pitch (das was V1 generiert)
- **Step 2 (Day 3-4):** Bump mit weiterem Angle (Curiosity oder Social Proof)
- **Step 3 (Day 7-10):** Letzte Erinnerung mit klarem Out ("Falls kein Interesse, gerne 'Nein, danke' antworten")

V1 generiert nur Step 1. Step 2+3 bleiben als Vorbereitung im `pitch_version.metadata.followup_outline`-Slot.

## Marketing-Psychology-Booster (separat dokumentiert)

Im selben Generation-Call laesst V1 Bedrock 1-2 marketing-psychology-Booster auswaehlen aus:
- Reciprocity, Social Proof, Scarcity, Authority, Liking, Commitment/Consistency

Auswahl wird in `pitch.psychology_boosters_used` (text[]) gespeichert.

## Lizenz

MIT — coreyhaines31/marketingskills. Snapshot-Auszug zulaessig. Originale in:
- `reference/corey-haines-marketing-skills/skills/cold-email/SKILL.md`
- `reference/corey-haines-marketing-skills/skills/cold-email/references/personalization.md`
- `reference/corey-haines-marketing-skills/skills/cold-email/references/frameworks.md`
- `reference/corey-haines-marketing-skills/skills/cold-email/references/follow-up-sequences.md`
- `reference/corey-haines-marketing-skills/skills/marketing-psychology/SKILL.md`
