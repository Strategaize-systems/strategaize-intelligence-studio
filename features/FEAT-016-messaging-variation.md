# FEAT-016 — Messaging-Variation pro Lead

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
Pro qualifiziertem Lead wird ein **personalisierter Pitch** generiert mit **4-Level-Personalization** (Industry → Company → Role → Individual) und marketing-psychology-Boostern. Output ist ein Asset (E-Mail-Vorlage oder LinkedIn-Post) mit `lead_id`-FK, das vor dem Pipeline-Push (FEAT-014) als Pitch-Substanz dient.

**Spec-Foundation:** `reference/corey-haines-marketing-skills/skills/cold-email/SKILL.md` (4-Level-Personalization-Framework) + `reference/corey-haines-marketing-skills/skills/marketing-psychology/SKILL.md` (Refinement-Booster wie Reciprocity, Social Proof, Scarcity, Authority — angewandt auf Cold-Outreach-Context).

**Differentiator gegenüber Template-basiertem Outreach:** Statt einer einzigen Vorlage mit Variablen-Platzhaltern wird pro Lead ein eigener Pitch generiert, der auf Firmen-Spezifika eingeht (Funding-Status, Hiring-Signale, Tech-Stack, Branche). Das ist konkrete Anwendung von BL-024 (Personalisierter Sales-Pitch pro Lead, Clay + Content-Kombination) — V1 ist die V1-Implementierung dieses Use-Cases.

## In Scope (V1)

### Pitch-Entität

Repräsentiert einen Lead-spezifischen Pitch.

**Pflichtfelder:**
- `id` (UUID)
- `lead_id` (n:1 zu FEAT-015 Lead)
- `output_type`: `email` / `linkedin_post` (V1 = nur diese 2; weitere Typen V4+)
- `current_version_id` (FK auf `pitch_version`)
- `status`: `entwurf` / `überarbeitet` / `freigegeben` / `gesendet` / `verworfen`
- `personalization_level_used`: `industry` / `company` / `role` / `individual` (höchster Level erreicht)
- `psychology_boosters_used` (text[] — z. B. „social_proof", „authority", „scarcity")
- `brand_profile_version_snapshot` (integer)
- `template_id` (UUID NULL)
- `created_at`
- `created_by`

**Optionale Felder:**
- `framework_used`: `problem_solution` / `curiosity` / `trigger_event` / `direct_pitch` (eines der 4 cold-email-Frameworks)
- `briefing_note` (text NULL)
- `tags` (text[])
- `linked_asset_id` (UUID NULL — wenn Pitch ein FEAT-009 Asset wird, Cross-Referenz)

### Pitch-Version-Entität

Pro Edit/Re-Generation eine neue Version.

**Pflichtfelder:**
- `id` (UUID)
- `pitch_id` (n:1)
- `version_number` (int)
- `subject` (text NULL — nur bei E-Mail-Vorlage)
- `body_markdown` (text)
- `metadata` (JSONB — Modell, Tokens, Cost, Antwortzeit, Skill-Quelle, 4-Level-Snapshot)
- `is_ai_generated` (bool)
- `created_at`
- `created_by`

### 4-Level-Personalization-Mechanik

Der Pitch wird in einer Bedrock-Generation mit allen 4 Personalization-Slots erzeugt.

**Level 1: Industry (Pflicht)**
- Bedrock erhält: Lead-Branche, ICP-Industry-Kontext (FEAT-010), Brand-Profile-Sektion 4 (Pain Points der Branche)
- Output-Slot: `{INDUSTRY_HOOK}` — z. B. „Bei Steuerberater-Kanzlien wie Ihrer in Süddeutschland sehen wir aktuell..."

**Level 2: Company (Pflicht)**
- Bedrock erhält: Lead-Firma-Daten + Enrichment-Data (FEAT-015 `lead.enrichment_data`)
- Erkennt Trigger-Signals (Wachstum, Nachfolge, Hiring, Tech-Stack-Indikatoren)
- Output-Slot: `{COMPANY_INSIGHT}` — z. B. „Da Ihre Kanzlei in den letzten 12 Monaten von 8 auf 15 MA gewachsen ist..."

**Level 3: Role (optional je nach Lead-Daten)**
- Bedrock erhält: Lead-Contact-Role + ICP-Decision-Maker-Set + Brand-Profile-Sektion 3 (Personas)
- Persona-Mapping (User / Champion / Decision Maker / Financial Buyer / Technical Influencer)
- Output-Slot: `{ROLE_RELEVANCE}` — z. B. „Als Geschäftsführer (Decision Maker) wissen Sie..."

**Level 4: Individual (optional, höchste Personalisierung)**
- Bedrock erhält: Lead-Contact-Name + LinkedIn-URL-Snippet (falls verfügbar) + Notizen zum Lead
- Erkennt individuelle Hooks (Background, kürzliche Posts, gemeinsame Connections)
- Output-Slot: `{INDIVIDUAL_OBSERVATION}` — z. B. „Ihre kürzliche Aussage, dass die Branche überreguliert ist..."
- **Hinweis:** Ohne LinkedIn-URL und Notizen fällt Level 4 weg → System markiert `personalization_level_used = role` und der Slot bleibt leer

### Marketing-Psychology-Booster

Im selben Generation-Call wird ein zweiter Pass durch den marketing-psychology-Skill geschickt:

- **Reciprocity:** „Hier ist eine kostenlose Insight als Geschenk, die Ihnen sofort hilft..."
- **Social Proof:** „Andere Steuerberater-Kanzleien wie [Customer X] haben damit..."
- **Scarcity:** „Wir nehmen aktuell nur 3 neue Beratungen pro Quartal..."
- **Authority:** „Basierend auf 50+ Onboardings in der Branche..."
- **Liking:** „Mir ist aufgefallen, dass Sie auch [Detail über Lead]..."
- **Commitment/Consistency:** „Falls Ihnen ähnliche Themen wichtig sind, wie wir vermuten..."

**Auswahl-Logik V1:**
- Bedrock erhält Brand-Profile-Sektion 11 (Proof Points) und Lead-Daten
- KI wählt 1-2 passende Booster und integriert sie in den Pitch
- Output: `pitch.psychology_boosters_used` (text[]) trackt welche Booster verwendet wurden

### Generation-Workflow

1. **Trigger:** User klickt im Lead-Detail (FEAT-015) auf „Pitch generieren" oder selektiert mehrere Leads für Batch-Generation
2. **Pre-Check:** Mindestens Pflichtfelder erfasst (Lead.industry, Lead.company_name) — sonst Fehlermeldung
3. **Generation asynchron via Worker** (DEC-008 + DEC-011): Asset-Generation-Pattern wiederverwendet
4. **Bedrock-Call** mit:
   - System-Prompt: Brand-Profile (alle 12 Sektionen, mit Hervorhebung von Sektion 4, 8, 9, 11 für Cold-Email-Kontext)
   - few-shot: Top-2-Performer-Pitches gleichen Output-Typs (FEAT-014 Performance-Loop)
   - User-Prompt: 4-Level-Personalization-Slots + Lead-Daten + Marketing-Psychology-Booster-Selection
   - Output-Format-Vorgabe: cold-email-Skill-Schema (Subject 2-4 Wörter + Body 4 Frameworks) ODER social-content-Skill-Schema (Hook + Pillar + CTA)
5. **Persistierung:** `pitch` + `pitch_version` werden geschrieben, `metadata` enthält 4-Level-Snapshot + Booster-Liste
6. **Status:** `entwurf` initial, User editiert oder gibt frei

### Cost-Strategie

- Pro Pitch ein Bedrock-Call (single-call multi-section) — Empfehlung in V1
- Cost pro Pitch geschätzt 0.10-0.25 EUR (Brand-Profile-Kontext groß, aber kompakter als Full-Asset)
- Cost-Cap pro Pitch in `ai_cost_ledger`, Alarm bei Monatsschwelle
- Bei Cost-pro-Lead > 0,50 EUR: Refactoring auf 2-call-split (Industry+Company in Pass 1, Role+Individual in Pass 2) — siehe OQ-V1-04

### UI

- **Lead-Detail-Erweiterung (FEAT-015):** Sub-Tab „Pitches" mit:
  - Liste aller Pitches für diesen Lead
  - „Pitch generieren"-Button mit Output-Typ-Auswahl (E-Mail / LinkedIn-Post) + Framework-Auswahl (optional, sonst KI-Empfehlung)
- **Pitch-Detail:**
  - Subject + Body in editierbarem Markdown-Editor
  - Metadata-Anzeige (4-Level-Snapshot, Booster-Liste, Cost, Modell)
  - Versionen-History mit Diff-Ansicht
  - „Re-Generate mit anderem Framework"-Button
  - Status-Workflow-Aktionen (entwurf → überarbeitet → freigegeben → gesendet)
- **Pitch-Bibliothek (Cross-Lead):** Liste aller Pitches mit Filter (Output-Typ, Status, Lead-Industry, personalization_level)
- **Batch-Generation:** Im Segment-Detail (FEAT-010) „Pitches für alle Leads im Segment generieren" — erstellt parallele Worker-Jobs

### Verknüpfung mit FEAT-009 Asset

- Ein Pitch ist konzeptionell ein lead-spezifisches Asset
- V1-Entscheidung: **separate Pitch-Tabelle**, keine Asset-Tabellen-Erweiterung — wegen Lead-FK und 4-Level-Snapshot-Spezifität
- Cross-Referenz `pitch.linked_asset_id`: Wenn ein Pitch in die Asset-Bibliothek übernommen wird (z. B. als Vorlage für ähnliche Leads), wird ein FEAT-009-Asset erzeugt mit Backlink — siehe OQ-A3 in PRD

### Template-Ready
- `template_id` (UUID NULL) auf `pitch` und `pitch_version`

## Out of Scope (V1)

- **Tatsächlicher Versand** des Pitches (E-Mail = V2, LinkedIn-DM = V4+)
- **A/B-Test-Auswertung** zwischen mehreren Pitch-Varianten pro Lead (V5)
- **KI-Auto-Booster-Auswahl mit Performance-Optimierung** (V5)
- **Voice-Pitch-Variante** (Audio-Output für SMAO) (V9+)
- **Multi-Sprachen-Pitch** (V9+)
- **Pitch-Sequence** (Follow-up-Mail nach Tag 3, 7, 14) — Cold-Email-Skill liefert das Schema, Implementierung V2 (E-Mail) bzw. V4 (LinkedIn)
- **Auto-Re-Pitch bei Lead-Update** (z. B. neue Funding-Runde sichtbar) (V5)
- **Pitch-Personalization-Score** (Wie personalisiert ist der Pitch?) (V5+)

## Acceptance Criteria

- Pitch kann für einen Lead generiert werden — Output-Typ E-Mail oder LinkedIn-Post wählbar
- 4-Level-Personalization funktioniert: bei vollständigen Lead-Daten werden alle 4 Slots befüllt; bei fehlenden Daten fällt Level 4 weg
- `personalization_level_used` wird korrekt gesetzt (höchster erreichter Level)
- Marketing-Psychology-Booster werden verwendet (`psychology_boosters_used` enthält 1-2 Einträge)
- E-Mail-Pitch hat Subject 2-4 Wörter und Body in einem der 4 Frameworks
- LinkedIn-Pitch hat Hook (eine der 4 Formeln aus social-content-Skill) + Pillar-Body + CTA
- Brand-Profile (FEAT-008) wird als Kontext mitgegeben — verifizierbar via Prompt-Inspection
- Few-shot aus Performance-Loop (FEAT-014) wird mitgegeben (Top-2-Performer)
- Cost wird in `ai_cost_ledger` getrackt, Cost pro Pitch < 0,30 EUR im Test
- Versionierung mit Diff-Ansicht funktioniert
- Re-Generate mit anderem Framework funktioniert
- Batch-Generation für alle Leads im Segment funktioniert (parallele Worker-Jobs)
- Status-Workflow durchgängig
- Pitch wird im Lead-Detail (FEAT-015) angezeigt

## Dependencies

- **FEAT-008 Brand Profile** — Vollständiges 12-Sektionen-Schema als KI-Kontext
- **FEAT-010 ICP & Segment** — ICP-Industry-Kontext und Persona-Set
- **FEAT-015 Lead Research** — Lead-Daten und Enrichment-Data als Personalization-Quelle
- **FEAT-014 Lead Handoff** — Performance-Capture-Loop für few-shot
- **FEAT-009 Content Asset Production** — gemeinsamer Bedrock-Service-Layer und Asset-Vorbereitungs-Pattern
- DEC-008 Worker-Layer, DEC-009 Provider-Adapter-Pattern, DEC-011 Asset-Generierung asynchron

## Architektur-Hinweise für `/architecture V1`

- **Tabelle `pitch`** (siehe Felder oben) mit FK auf `lead.id` und FK auf `pitch_version.id` (current_version_id)
- **Tabelle `pitch_version`** mit JSONB-metadata-Feld
- **Worker-Job `pitch_generation`** (Type-Enum in `ai_jobs`): Triggert Bedrock-Call mit 4-Level-Slots + Booster, schreibt Pitch + Pitch-Version
- **Prompt-Builder-Modul `src/prompts/pitch/{email,linkedin}.ts`** mit 4-Level-Composing-Logic
- **Marketing-Psychology-Booster-Auswahl:** Kann als separater Bedrock-Sub-Call laufen oder in Single-Call integriert sein — Empfehlung Single-Call (Cost-Effizienz), Booster-Auswahl als Teil des System-Prompts
- **Few-shot-Integration:** Bei Pitch-Generation gleiche Mechanik wie FEAT-009-Few-shot-Loop, Query auf `asset_performance` mit `output_type = email` oder `linkedin_post`
- **Cross-Reference auf Asset:** Wenn `pitch.linked_asset_id NOT NULL`, dann existiert ein FEAT-009-Asset mit Backlink. UI bietet „In Asset-Bibliothek übernehmen"-Action
- **Cost-Cap** in `ai_cost_ledger`-Logic: Pro Pitch max 0.30 EUR (Default), Alarm bei Überschreitung

## Skill-spezifische Prompt-Hinweise (für Implementation)

- **E-Mail-Pitch (cold-email-Skill):**
  - Subject 2-4 Wörter, max 50 Zeichen
  - Body 1 von 4 Frameworks: Problem-Solution / Curiosity / Trigger-Event / Direct-Pitch
  - 4-Level-Slots als `{INDUSTRY_HOOK}`, `{COMPANY_INSIGHT}`, `{ROLE_RELEVANCE}`, `{INDIVIDUAL_OBSERVATION}`
  - Follow-up-Sequence-Vorbereitung: Pitch enthält Hinweis auf 2 Follow-up-Mails (Versand erst V2)
- **LinkedIn-Pitch (social-content-Skill):**
  - Hook in einer von 4 Formeln: Question / Stat / Story / Contrarian
  - Body folgt Pillar-Framework (Educate / Entertain / Engage / Sell — V1 fokussiert auf Engage und Sell für Cold-Outreach)
  - CTA explizit am Ende (z. B. „Lass uns kurz sprechen — 15 Min Slot finden Sie hier: [Link]")

## Beziehung zu BL-024 (Personalisierter Sales-Pitch pro Lead — Clay + Content-Kombination)

BL-024 ist ein backlog-Item, das diesen Use-Case in Idee-Form formuliert hat. FEAT-016 ist die V1-Implementierung. BL-024 wird im Backlog auf `done` gesetzt sobald FEAT-016 V1-released ist (Mapping in `backlog.json`).

## Referenzen

- Spec-Foundation: `reference/corey-haines-marketing-skills/skills/cold-email/SKILL.md` + `marketing-psychology/SKILL.md`
- Reference-Files: `reference/corey-haines-marketing-skills/skills/cold-email/references/{personalization,frameworks,subject-lines,follow-up-sequences,benchmarks}.md`
- FEAT-008 (Brand Profile als KI-Kontext, Sektion 4 + 8 + 9 + 11 besonders relevant für Cold-Email)
- FEAT-014 (Performance-Capture-Loop)
- FEAT-009 (gemeinsamer Bedrock-Service-Layer)
- BL-024 (Backlog-Idee, V1-Implementierung)
