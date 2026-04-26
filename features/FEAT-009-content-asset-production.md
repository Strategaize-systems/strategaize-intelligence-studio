# FEAT-009 — Content Asset Production (7 Output-Typen mit Skill-Quellbezug)

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
KI-gestützte Erzeugung wiederverwendbarer Content-Assets aus Brand Profile (FEAT-008) + Quell-Objekt (ICP, Segment, Lead, Pitch, später KU/Opportunity ab V6) + Output-Typ. Jeder Output-Typ folgt einem dedizierten Skill-Schema aus dem Corey-Haines-Repo (MIT) — das ersetzt freie Markdown-Generierung und sorgt für strukturelle Konsistenz pro Asset-Typ.

**Spec-Foundation:** `reference/corey-haines-marketing-skills/skills/{copywriting, social-content, sales-enablement, cold-email, page-cro, site-architecture}/SKILL.md` (alle MIT-Lizenz). Pro Output-Typ ein definiertes Quell-Skill mit explizitem Output-Schema.

## In Scope (V1)

### 7 Output-Typen mit Skill-Quellbezug

| # | Output-Typ | Quell-Skill | Output-Schema (Kurzfassung) |
|---|---|---|---|
| 1 | **Blogpost** | `copywriting` | Page Copy + Annotations + Alternatives + Meta Content (Markdown, längerer Beitrag) |
| 2 | **LinkedIn-Post** | `social-content` | Hook (4 Formel-Optionen) + Pillar-Framework-Zuordnung + Caption + Engagement-CTA (Kurztext) |
| 3 | **One-Pager** | `sales-enablement` | 5-Sektionen: Problem / Solution / 3-Differentiators / Proof / CTA (Markdown, ein-Seite-Argumentation) |
| 4 | **E-Mail-Vorlage** | `cold-email` | Subject (2-4 Wörter) + Body (4 Frameworks: Problem-Solution / Curiosity / Trigger-Event / Direct-Pitch) + 4-Level-Personalization-Slots + Follow-up-Sequence (3-Step) |
| 5 | **Case Card** | `sales-enablement` | 6 Felder: Customer / Challenge / Solution / Results / Pull-Quote / Tags (kompakte Markdown-Karte) |
| 6 | **Landingpage-Briefing** | `copywriting` + `page-cro` | 7-Dimensionen-CRO-Analyse als Briefing-Spec: Above-the-Fold-Hook, Value-Prop, Social-Proof-Block, Differentiation, Objection-Handling, CTA, Scarcity/Trust-Signals |
| 7 | **Multi-Page-Website-Spec** | `site-architecture` | ASCII-Tree + Mermaid-Sitemap + URL-Map-Table + Nav-Spec + Internal-Linking-Plan |

### Asset-Request-Workflow

- **Asset-Request erstellen** mit Pflicht-Inputs:
  - Output-Typ (eines der 7)
  - Quell-Objekt-Typ + Quell-Objekt-ID (V1: ICP, Segment, Lead, Pitch, Campaign — später KU, Opportunity, Pattern ab V6)
  - Optionale Briefing-Notiz (Freitext, Zusatzkontext für Bedrock)
- **Generierung asynchron via Worker** (DEC-011 bleibt) — Asset-Request erzeugt `ai_jobs`-Eintrag (Type `asset_generation`), UI zeigt „Wird generiert…" mit Polling oder Realtime-Abo auf `asset_request.status`
- **Pro Output-Typ ein dedizierter Bedrock-Prompt-Builder** der das Skill-spezifische Output-Schema strikt einhält
- **Brand Profile als System-Kontext** (FEAT-008) bei jedem Call mit Skill-spezifischer Sektion-Hervorhebung
- **Performance-Few-Shot-Loop** (FEAT-014): Top-Performer-Assets desselben Output-Typs werden als few-shot mitgegeben — das ist der Closed-Loop-Differentiator

### Asset-Bibliothek

- **Listen-Ansicht aller Assets** mit Filter:
  - nach Output-Typ (7 Typen)
  - nach Quell-Objekt-Typ
  - nach Status (Entwurf / überarbeitet / freigegeben / veröffentlicht / verworfen)
  - nach Erstelldatum
  - nach Tag (freie Tags + automatische Skill-Quelle)
  - nach Performance-Ranking (Top-Performer, Mid-Performer, Low-Performer — siehe FEAT-014)
- **Volltext-Suche** über Asset-Inhalt, Briefing-Notiz, Tags
- **Detail-Ansicht** mit:
  - Quell-Objekt-Verlinkung
  - Generierungs-Metadaten (Modell, Skill-Quelle, Prompt-Länge, Antwortzeit, Cost EUR, Brand-Profile-Version-Snapshot)
  - aktuelle Version + Versions-History
  - Performance-Capture-Felder (FEAT-014): posted_at, channel, cost_eur, impressions, clicks, leads_generated, notes
  - Re-Generieren-Button (mit gleichem oder geändertem Briefing)

### Status-Workflow

| Status | Bedeutung | Trigger |
|---|---|---|
| Entwurf | KI-generiertes Initial-Ergebnis | Worker schreibt Erstversion |
| überarbeitet | Manuelle Bearbeitung durch Nutzer | User-Edit speichert neue Version |
| freigegeben | Final, bereit zur Veröffentlichung | Manuelle Status-Änderung |
| veröffentlicht | Manuell als veröffentlicht markiert (V1 noch ohne Auto-Posting) | Manuelle Status-Änderung mit posted_at-Pflichtfeld |
| verworfen | Nicht zur Veröffentlichung geeignet | Manuelle Status-Änderung |

### Versionierung

- Jede Bearbeitung erzeugt eine neue Version (Asset-History)
- Diff-Ansicht zwischen Versionen
- Rollback zu älterer Version möglich
- KI-Re-Generation erzeugt neue Version (kein Überschreiben)

### Export

- Markdown-Export pro Asset (Kopie in Zwischenablage + Download)
- Output-Typ-spezifische Export-Formate:
  - Blogpost / Landingpage-Briefing / One-Pager / Case Card → `.md`
  - LinkedIn-Post → `.txt` mit kopierbarem Hook + Caption-Block
  - E-Mail-Vorlage → `.md` mit klar getrenntem Subject + Body + Variablen-Platzhalter-Liste
  - Multi-Page-Website-Spec → `.md` + optional `.zip` mit Mermaid-File und URL-Map-CSV
- Batch-Export mehrerer Assets als ZIP

### Template-Ready
- Schema mit `template_id` (UUID NULL in V1)
- Asset-Typ-spezifisches Template-Handling vorbereitet (Pro Output-Typ ein konfigurierbarer Prompt-Template-Slot, in V1 hart kodiert)

## Out of Scope (V1)

- Direkte Veröffentlichung auf Kanälen (E-Mail = V2, LinkedIn = V4)
- Multi-Sprachen-Output (V9+)
- Video-Script, Carousel, Präsentation als Output-Typen (V9+)
- Automatische Asset-Varianten-Generierung für A/B-Tests (V5)
- Asset-Scoring (Qualitätsbewertung via KI vor Freigabe) (V5+)
- Automatische Asset-Empfehlung zu Kampagnen-Briefings (V7)
- KU- und Opportunity-Quell-Objekte (kommen mit V6 wenn Wissensverdichtungs-Backbone live)
- Pattern-Erkennung als Quell-Objekt (V9+)

## Acceptance Criteria

- Asset-Request kann aus allen V1-Quell-Objekt-Typen erstellt werden (ICP, Segment, Lead, Pitch, Campaign)
- Alle 7 Output-Typen sind generierbar
- Pro Output-Typ wird der Skill-spezifische Prompt-Builder aufgerufen — verifizierbar via Prompt-Log (Skill-Name in Metadata)
- Brand-Profil (FEAT-008) wird bei jedem Call als Kontext mitgegeben — verifizierbar
- Generierte Assets sind in UI editierbar
- Status-Workflow funktioniert durchgängig (Entwurf → überarbeitet → freigegeben → veröffentlicht → optional verworfen)
- Versionierung erhält vollständige History mit Diff-Ansicht
- Markdown-Export liefert saubere, Skill-spezifisch formatierte Dateien
- Volltext-Suche findet Assets nach Inhalt, Briefing und Metadaten
- Performance-Few-Shot-Loop funktioniert: Bei Asset-Request des gleichen Output-Typs werden Top-2-Performer als few-shot eingespeist (verifizierbar via Prompt-Inspection)
- KI-Freigabe-Quote > 60 % ohne manuelle Überarbeitung — gemessen über die ersten 30 Assets, idealerweise pro Output-Typ
- Cost-pro-Asset-Generierung wird in `ai_cost_ledger` getrackt
- Brand-Profile-Version-Snapshot ist pro Asset gespeichert

## Dependencies

- **FEAT-008 Brand Profile** — muss vor V1-Release existieren mit allen 12 Sektionen erfasst
- **FEAT-010 ICP & Segment** — als Quell-Objekt
- **FEAT-015 Lead Research** — als Quell-Objekt (für Lead-spezifische Assets)
- **FEAT-016 Messaging-Variation** — generiert Pitch-Assets (E-Mail-Vorlage / LinkedIn-Post mit Lead-FK)
- **FEAT-011 Campaign Management LITE** — als Quell-Objekt + Klammer
- **FEAT-014 Lead Handoff + Performance-Capture** — Performance-Daten als few-shot-Quelle
- Bedrock-Adapter (DEC-009)
- Worker-Layer mit `ai_jobs`-Queue (DEC-008)

## Architektur-Hinweise für `/architecture V1`

- Asset-Tabelle: `id`, `output_type` (Enum 7 Typen), `source_skill` (Enum mit Skill-Namen), `source_object_type`, `source_object_id`, `current_version_id`, `status`, `template_id (NULL)`, `brand_profile_version_snapshot (int)`, `briefing_note (text)`, `tags (text[])`, `created_at`, `created_by`
- Asset-Version-Tabelle: `id`, `asset_id`, `version_number`, `markdown_content (text)`, `metadata (JSONB)` (Modell, Tokens, Cost, Antwortzeit), `created_at`, `created_by`, `is_ai_generated (bool)`
- Asset-Performance-Tabelle (gemeinsam mit FEAT-014): `id`, `asset_id`, `posted_at`, `channel`, `cost_eur`, `impressions`, `clicks`, `leads_generated`, `notes`, `entered_at`, `entered_by`
- Pro Output-Typ ein eigenes Prompt-Builder-Modul unter `src/prompts/asset/{blogpost,linkedin,onepager,email,casecard,landingpage,websitespec}.ts`
- Gemeinsame Bedrock-Service-Layer (DEC-009 Provider-Adapter-Pattern) — alle Prompt-Builder rufen den gleichen Service auf
- Cost-Cap pro Generation in `ai_cost_ledger`, Alarm bei Monatsschwelle
- Performance-Few-Shot-Loop: Beim Asset-Request des gleichen Output-Typs Query auf `asset_performance` für Top-2-Performer (gemessen an `leads_generated / cost_eur`-Ratio) und mitschicken als few-shot

## Skill-spezifische Prompt-Hinweise (für Implementation)

- **Blogpost (copywriting):** Prompt fragt nach Page-Copy + Editorial-Annotations + 1-2 Alternative-Headlines + Meta-Description. Output ist Markdown mit klaren Section-Headern.
- **LinkedIn-Post (social-content):** Prompt fragt nach 4 Hook-Optionen (Question / Stat / Story / Contrarian) und einer Empfehlung. Caption-Body folgt Pillar-Framework (Educate / Entertain / Engage / Sell). CTA explizit am Ende.
- **One-Pager (sales-enablement):** Strikt 5 Sektionen, jede mit klaren Sub-Headern. Differentiators als 3 Bullet-Pairs.
- **E-Mail-Vorlage (cold-email):** Subject 2-4 Wörter, Body folgt einem von 4 Frameworks (User wählt oder KI empfiehlt aus Quell-Objekt). 4-Level-Personalization-Slots als `{INDUSTRY_HOOK}`, `{COMPANY_INSIGHT}`, `{ROLE_RELEVANCE}`, `{INDIVIDUAL_OBSERVATION}`. Follow-up-Sequence 3-Step.
- **Case Card (sales-enablement):** Strikt 6 Felder, jeweils kurz (1-3 Sätze). Pull-Quote mit Zuschreibung. Tags als Markdown-Liste.
- **Landingpage-Briefing (copywriting + page-cro):** 7-Dimensionen-Briefing als Block-Liste. Jede Dimension mit konkretem Vorschlag + Begründung.
- **Multi-Page-Website-Spec (site-architecture):** ASCII-Tree für Hierarchie, Mermaid-Block für Sitemap-Visualisierung, URL-Map als Markdown-Tabelle, Nav-Spec, Internal-Linking-Plan.

## Referenzen

- Spec-Foundation Skills:
  - `reference/corey-haines-marketing-skills/skills/copywriting/SKILL.md`
  - `reference/corey-haines-marketing-skills/skills/social-content/SKILL.md`
  - `reference/corey-haines-marketing-skills/skills/sales-enablement/SKILL.md`
  - `reference/corey-haines-marketing-skills/skills/cold-email/SKILL.md`
  - `reference/corey-haines-marketing-skills/skills/page-cro/SKILL.md`
  - `reference/corey-haines-marketing-skills/skills/site-architecture/SKILL.md`
- DEC-011 (Asset-Generierung asynchron) bleibt gültig
- DEC-021 (Spec-Foundation Corey-Haines-Repo) — pending
