# FEAT-008 — Brand Profile (12-Sektionen-Schema)

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
Singleton-Brand-Profil (StrategAIze-Eigen) als zentraler KI-Kontext für alle Content-Generierungen in FEAT-009 und alle Pitch-Generierungen in FEAT-016. Sorgt für konsistente Markenstimme, präzise Zielgruppen-Ansprache und nachvollziehbare Differenzierung über alle Asset-Typen hinweg — ohne Agentur-Aufwand.

**Spec-Foundation:** `reference/corey-haines-marketing-skills/skills/product-marketing-context/SKILL.md` (MIT-Lizenz). Das 12-Sektionen-Schema ersetzt das frühere V2-Brand-Profile-Schema (Tonalität / Do's / Don'ts / 3-5 Beispiel-Assets) vollständig — es ist deutlich reicher und liefert die Foundation, die alle nachgelagerten Skills (copywriting, cold-email, social-content, sales-enablement, page-cro, site-architecture, content-strategy, marketing-psychology) als Input erwarten.

## In Scope (V1)

### Brand-Profil-Entität — Singleton mit 12 Sektionen

**Sektion 1: Product Overview (Pflicht)**
- One-line description
- What it does (2-3 Sätze)
- Product category (das Regal, in dem Kunden suchen — z. B. „Beratungs-OS", „Marketing Launcher")
- Product type (SaaS, Service, Internal Tool, Marketplace)
- Business model und Pricing (kurz)

**Sektion 2: Target Audience (Pflicht)**
- Target company type (Branche, Größe, Stage)
- Target decision-makers (Rollen, Abteilungen)
- Primary use case (Hauptproblem, das gelöst wird)
- Jobs-to-be-Done (2-3 Dinge, für die Kunden „angeheuert" werden)
- Spezifische Use Cases / Szenarien

**Sektion 3: Personas (Pflicht für B2B — V1)**
Pro Persona-Typ Pflichtfelder: cares-about, challenge, value-promise.
Persona-Typen (mindestens User + Decision Maker, optional weitere):
- User
- Champion
- Decision Maker
- Financial Buyer
- Technical Influencer

**Sektion 4: Problems & Pain Points (Pflicht)**
- Core challenge (Was Kunden vor StrategAIze frustriert)
- Why current solutions fall short
- Was es Kunden kostet (Zeit, Geld, Chancen)
- Emotional tension (Stress, Angst, Zweifel)

**Sektion 5: Competitive Landscape (Pflicht)**
- **Direct competitors:** Gleiche Lösung, gleiches Problem (z. B. „Beratungs-Tool A" vs. StrategAIze)
- **Secondary competitors:** Andere Lösung, gleiches Problem (z. B. „Excel-Tabelle" vs. StrategAIze)
- **Indirect competitors:** Konfliktierender Ansatz (z. B. „Eigene Marketing-Agentur" vs. StrategAIze)
- Pro Competitor: Was fällt für Kunden weg

**Sektion 6: Differentiation (Pflicht)**
- Key differentiators (Capabilities, die Alternativen fehlen)
- How we do it differently
- Why that's better (konkrete Benefits)
- Why customers choose us (Verbatim-Begründung wenn vorhanden)

**Sektion 7: Objections & Anti-Personas (Pflicht)**
- Top 3 Objections aus Sales und Antwort dazu
- Anti-Persona: Wer ist NICHT gut geeignet (explizit)

**Sektion 8: Switching Dynamics — JTBD Four Forces (Pflicht)**
- **Push:** Was treibt Kunden vom aktuellen Setup weg
- **Pull:** Was zieht Kunden zu uns
- **Habit:** Was hält Kunden an der alten Lösung fest
- **Anxiety:** Was beunruhigt Kunden am Wechsel

**Sektion 9: Customer Language (Pflicht)**
- Verbatim-Phrases: Wie Kunden das Problem beschreiben (Originalzitate)
- Verbatim-Phrases: Wie Kunden uns beschreiben (Originalzitate)
- Words to use (klare Liste)
- Words to avoid (klare Liste — z. B. „Game-Changer", „Disruption", „leverage")
- Glossary: Produkt-spezifische Begriffe mit Definition

**Sektion 10: Brand Voice (Pflicht)**
- Tone (z. B. „professional, direct, ohne Hype")
- Communication style (z. B. „direkt, evidenzbasiert, ruhig")
- Brand personality (3-5 Adjektive)

**Sektion 11: Proof Points (Pflicht)**
- Key Metrics oder Results (z. B. „30 Min Setup statt 3 Tage")
- Notable Customers / Logos
- Testimonials (Originalzitate)
- Value-Themes mit Proof-Mapping (Tabelle Theme → Proof)

**Sektion 12: Goals (Pflicht)**
- Primary business goal
- Key conversion action (was Kunden tun sollen — z. B. „Buchung Demo-Call", „Trial-Anmeldung")
- Current metrics (falls bekannt)

### Template-Ready-Felder
- `template_id` (UUID, optional, NULL in V1)
- `is_active` (boolean, default true)
- `version` (integer, inkrementiert bei jeder Änderung)
- `updated_at` (timestamp)
- `updated_by` (user_id)

### UI

- **Brand-Profil-Seite (Settings-Bereich, eine Seite mit 12 Sektionen als Accordion oder Tab-System)**
- Pflichtfeld-Validierung pro Sektion: Vor „Speichern" alle Pflichtfelder gefüllt
- Vollständigkeits-Indikator: Pro Sektion „erfasst / unvollständig / leer"
- Eingabe-Hinweise pro Feld (Tooltip mit Beispielen aus dem Skill-Schema)
- Vorschau-Modus: Zeigt strukturiertes Brand-Profil als LLM-Prompt-Snippet (was Bedrock bekommt)
- Changelog-Tab: Wer hat wann was geändert (verlinkt auf Sektion + Feld)

### LLM-Integration

- Brand-Profil wird bei jedem Content-Generierungs-Call (FEAT-009) und jedem Pitch-Generierungs-Call (FEAT-016) als System-Kontext an Bedrock übergeben
- **Skill-spezifische Prompt-Erweiterung:** Pro Output-Typ (FEAT-009) wird der Skill-spezifische Prompt-Builder die relevanten Sektionen zusätzlich hervorheben (z. B. cold-email-Skill nutzt vor allem Sektion 4 Pain Points + 8 Switching Dynamics + 9 Customer Language)
- Änderungen am Brand-Profil wirken sich sofort auf neue Generierungen aus — alte Assets bleiben unverändert (Versions-Snapshot in `asset.brand_profile_version`)

### Datenmodell-Hinweis (für `/architecture V1`)

V1 empfiehlt **JSONB-Singleton-Tabelle** statt 12 separater Sub-Tabellen:
- Tabelle `brand_profile` mit Feldern: `id (UUID PK)`, `template_id (UUID NULL)`, `is_active (bool)`, `version (int)`, `data (JSONB)`, `updated_at`, `updated_by`
- `data` JSONB enthält die 12 Sektionen als nested objects gemäß Schema
- Vorteil: Sektion-Erweiterung ohne Migration, einfacher Versions-Snapshot
- Nachteil: Filterung über JSONB ist langsamer — aber Brand-Profil wird kaum gefiltert (immer Singleton-Read)

Alternative `JSONB-mit-Foreign-Keys-Hybrid` falls Filterung relevant wird (z. B. für Multi-Brand V9+) — Entscheidung in `/architecture V1` (OQ-A1).

## Out of Scope (V1)

- Multi-Tenant-Brand-Profile (V9+)
- Automatisches Brand-Profil-Lernen aus bestehenden Assets (V9+)
- Visuelles Brand-System (Logo-Regeln, Bildsprache, Layoutgrid) (V9+)
- Brand-Profil-Export als Style-Guide-PDF (V9+)
- A/B-Test von Brand-Profil-Varianten (V9+)
- KI-gestützter Brand-Profil-Audit / Konsistenz-Check (V8 oder V9+)

## Acceptance Criteria

- Alle 12 Sektionen sind in der UI editierbar
- Pflichtfelder pro Sektion verhindern Speichern bei Unvollständigkeit
- Mindestens Persona-Typen User + Decision Maker sind in Sektion 3 erfasst
- Sektion 9 Customer Language hat mindestens 3 Verbatim-Problem-Phrases und 3 Verbatim-Solution-Phrases
- Sektion 11 Proof Points hat mindestens 1 konkretes Metric oder Testimonial
- Brand-Profil wird bei jedem Content-Generierungs-Call (FEAT-009) als Kontext mitgegeben — verifizierbar via API-Log und Prompt-Inspection
- Schema hat `template_id`-Feld (NULL in V1)
- Vorschau-Modus zeigt vollständigen LLM-Prompt-Kontext
- Changelog protokolliert jede Änderung mit User + Timestamp + geändertem Feld

## Dependencies

- Keine direkten Feature-Dependencies — FEAT-008 ist V1-Auftakt
- **Wird genutzt von:** FEAT-009 (Content Asset Production), FEAT-010 (ICP & Segment via Sektion 2 + 3), FEAT-016 (Messaging-Variation pro Lead)
- Indirekt: alle nachgelagerten KI-Generierungen (V2 E-Mail, V4 LinkedIn, V5 Auto-Variants)

## Architektur-Hinweise für `/architecture V1`

- Brand-Profil als JSONB-Singleton (siehe Datenmodell-Hinweis oben) — siehe OQ-A1
- LLM-Prompt-Builder-Modul zentral: konkateniert Brand-Profil + Skill-spezifische Sektion-Hervorhebung + Output-Typ-Template + Quell-Objekt-Kontext
- Versions-Snapshot pro Asset: `asset.brand_profile_version` (integer, Snapshot der Brand-Profil-Version zum Zeitpunkt der Generierung) — erlaubt späteres Reproduzieren der Generierung
- Changelog-Tabelle für Audit (`brand_profile_changelog`): wer, wann, welcher JSONB-Pfad, alter Wert, neuer Wert
- Cost-Tracking: Brand-Profil-Größe (Tokens) als Metadata pro Generierung in `ai_cost_ledger`

## Migration aus V2-Schema (für /architecture V1)

Das alte V2-Schema (Tonalität / Do's / Don'ts / 3-5 Beispiel-Assets) wird **nicht migriert** — V1 startet mit leerem Brand-Profil und der Gründer befüllt das 12-Sektionen-Schema neu. Das ist effizienter als Mapping, weil die alten Felder zu schmal für das neue Schema sind. Vorhandene Beispiel-Asset-Texte können manuell als Verbatim-Snippets in Sektion 9 (Customer Language) und Sektion 11 (Proof Points / Testimonials) übernommen werden.

## Referenzen

- Spec-Foundation: `reference/corey-haines-marketing-skills/skills/product-marketing-context/SKILL.md`
- DEC-006 (Singleton, Multi-Brand = V9+) bleibt gültig
- DEC-021 (Spec-Foundation Corey-Haines-Repo) — pending, vorgemerkt für /architecture V1
