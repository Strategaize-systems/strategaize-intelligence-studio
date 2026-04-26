# Product Requirements Document

## Purpose
StrategAIze Intelligence Studio — System 3 der Gesamtarchitektur. **V1 ist der Marketing Launcher**: ein geschlossener Marketing-Funnel, der Brand-Profil + ICP + Lead Research + personalisierte Pitches + Campaign-Klammer + Pipeline-Handoff + Performance-Capture-Loop in einem operativen Werkzeug bündelt — damit StrategAIze sich selbst Leads holen kann. Spätere Versionen erweitern um Voll-Tracking, Multi-Channel-Publishing, das ursprüngliche Wissensverdichtungs-Backbone (Onboarding-Ingest, Portfolio-Monitor, Cross-Kunden-Learnings — V6) und Validation/Orchestration.

Referenz Gesamtarchitektur: `/strategaize-dev-system/docs/PLATFORM.md`.

## Vision
Ein zentrales, template-fähig konzipiertes System, das die gesamte **Schicht zwischen Wissen und Vertrieb** abdeckt:
- Marketing-Assets (7 Output-Typen) aus Brand-Profil + ICP KI-gestützt mit konsistenter Markenstimme erzeugen
- personalisierte Pitches pro Lead mit 4-Level-Personalization generieren
- Campaign-Klammer + Performance-Capture-Loop schließen die Marketing-Schleife
- qualifizierte Leads via Pipeline-Push ans Business System übergeben
- später: verdichtetes Wissen aus Onboarding-Projekten systematisch sichtbar machen (V6)
- später: Tracking konsolidieren (V5), Multi-Channel-Publishing (V4), Validation und Orchestration (V7+)
- später als Kunden-Template einsetzbar sein (V9+)

**Strategischer Pivot 2026-04-25:** Die ursprüngliche V1-Planung (Wissensverdichtungs-Backbone) wurde auf V6 verschoben. Begründung: Ohne Marketing Launcher keine Interessenten → ohne Interessenten keine Kunden → ohne Kunden keine Customer-Cases → ohne Customer-Cases ist die Wissensverdichtung leerer Speicher. Der Marketing Launcher V1 ist der Lead-Generator für StrategAIze selbst, nicht für externe Kunden.

**Leitprinzip Tracking-Reduktion (Gründer-Fixierung 2026-04-16, weiterhin gültig für V5):** *„Ich will nicht sechs Tracking-Cockpits öffnen müssen — wir holen die Rohdaten zurück und machen unsere eigene Übersicht."*

## Target Users

### V1–V3 (primär intern)
- **Gründer / Strategischer Eigentümer** — Brand-Profil-Definition, ICP/Segment-Definition, Asset-Freigabe, Pitch-Generierung, Performance-Capture, Campaign-Steuerung
- **Marketing-/Sales-Operator (intern, klein)** — Lead-Recherche, Asset-Bibliothek-Pflege, Pipeline-Handoff-Operativ

### V4+
- externe Kanäle (LinkedIn, E-Mail) als Ausspielziele (V2 + V4)
- Platform-Analytics als Tracking-Quelle (V5)

### V6+
- Beratungs-/Delivery-Team für Wissensverdichtung und Cross-Kunden-Learnings

### V9+
- externe Kundenunternehmen als Plattform-Nutzer (Template-Modus)
- Voice-Partner (SMAO-ähnlich) als API-Konsument

## Problem Statement

StrategAIze hat aktuell keine systematische Lead-Generierungs-Maschine. Konkrete Probleme:

1. **Manuelles Marketing-Setup pro Asset.** LinkedIn-Posts, Blogposts, One-Pager und E-Mail-Vorlagen werden ad hoc und inkonsistent erstellt — keine einheitliche Brand-Stimme, hoher Wiederholungsaufwand.
2. **Kein strukturiertes Brand-Profil als KI-Kontext.** Bedrock-Calls für Content-Generierung haben keinen wiederverwendbaren Brand-Kontext, jede Generierung startet bei Null.
3. **Kein definierter ICP/Segment-Prozess.** Wer genau angesprochen werden soll ist nicht systematisch erfasst — Personas sind im Kopf, nicht im System.
4. **Keine wiederholbare Lead-Recherche.** Lead-Listen entstehen pro Kampagne neu, ohne Adapter-Pattern, ohne Duplikat-Erkennung, ohne Anreicherung.
5. **Keine personalisierten Pitches pro Lead.** Cold Outreach läuft mit Templates, die nicht auf Firmen-Spezifika eingehen — Conversion bleibt niedrig.
6. **Kein geschlossener Performance-Loop.** Welcher Asset-Typ welche Cost-per-Lead bringt ist nicht gemessen — kein Lerneffekt für nächste KI-Generierung.
7. **Kein Lead-Handoff an Business.** Qualifizierte Leads landen nicht systematisch in der Business-Pipeline — Pipeline-Funktion existiert dort, wird aber nicht angesteuert.

Die Wissensverdichtungs-Probleme aus der ursprünglichen V1-Planung (siehe V6 Scope unten) sind weiterhin relevant, aber strategisch nachgelagert — sie bauen auf vorhandenen Customer-Cases auf, die der Marketing Launcher V1 erst erzeugen muss.

## Goal / Intended Outcome

Ein operativer Marketing Launcher, in dem:

- ein **Brand Profile** auf 12-Sektionen-Schema (product-marketing-context-Foundation) als zentraler KI-Kontext für alle Generierungen dient
- **7 Output-Typen** (Blogpost, LinkedIn-Post, One-Pager, E-Mail-Vorlage, Case Card, Landingpage-Briefing, Multi-Page-Website-Spec) aus Brand + Quell-Objekt KI-generiert werden, jeder mit Skill-Quellbezug
- **ICP + Segment** strukturiert definiert werden — abgeleitet aus product-marketing-context Sektion 2 + 3
- **Lead Research** über Firecrawl-Adapter (Primary, Pay-as-you-go) + Clay-CSV-Import (Fallback) wiederholbare Lead-Listen erzeugt
- **Messaging-Variation pro Lead** mit 4-Level-Personalization (cold-email-Skill) + marketing-psychology-Booster pro Lead einen personalisierten Pitch produziert
- **Campaign Management Lite** als Parent-Klammer ohne Variants Asset, ICP, Leads und Pitches in einem Zeitfenster bündelt
- **Lead-Handoff via Pipeline-Push** an das Business System (Pipeline „Lead-Generierung", Stage „Neu") qualifizierte Leads als Deals übergibt
- **Performance-Capture-Loop** manuell erfasste Performance-Daten (posted_at, cost_eur, leads_generated) als few-shot in den nächsten KI-Generierungs-Call zurückspielt — das macht V1 zu einem Closed Loop und differenziert von Jasper/Copy.ai

## Product Overview — 7 Funktionsbereiche (über alle Versionen)

| # | Bereich | Zentraler Zweck | Ab Version |
|---|---|---|---|
| 1 | **Marketing Launcher (Closed Loop Lite)** | Brand+ICP+Content+Leads+Pitches+Campaign+Pipeline-Handoff+Performance-Loop in einem Werkzeug | **V1** |
| 2 | **E-Mail-Adapter mit Open-Tracking** | Versand + Open/Click-Tracking pro Lead, schließt erste Auto-Tracking-Lücke | V2 |
| 3 | **Voll-Lead-Research + Lead-Scoring** | Firecrawl-Pull + regelbasiertes Scoring + Disqualifier — ersetzt manuellen Recherche-Aufwand | V3 |
| 4 | **LinkedIn-Publishing + Multi-Channel-Distribution** | Kanal-Adapter-Framework, LinkedIn als zweiter Kanal nach E-Mail | V4 |
| 5 | **Voll-Tracking + KI-Scoring + A/B-Statistik** | Performance-Cockpit, automatische Variants, KI-basiertes Lead-Scoring (löst V3-Regelsystem ab) | V5 |
| 6 | **Wissensverdichtungs-Backbone** | Onboarding-Ingest + Portfolio-Monitor + Insight-Layer + Opportunity-Decision + Cross-Kunden-Learnings + Customer Deployment Registry (ehemals V1) | V6 |
| 7 | **Validation & Idea Testing** | Experiment-Entität, Hypothesen, Kill-or-Go | V7 |
| 8 | **Orchestration & Decision Layer** | Hybrid-Cockpit Top-5 pro Entity-Typ | V8 |
| 9 | **Multi-Tenant + Voice-API + Erweiterungen** | Template-Modus, SMAO-API, Auto-Anonymisierung, weitere Kanäle | V9+ |

## Version Plan

| Version | Inhalt | Status | Primäre neue Features |
|---|---|---|---|
| **V1** | **Marketing Launcher (Closed Loop Lite)** | **Requirements (diese Runde)** | **FEAT-008, FEAT-009, FEAT-010, FEAT-011 (LITE), FEAT-014 (umgeschrieben), FEAT-015, FEAT-016** |
| V2 | E-Mail-Versand-Adapter mit Open-Tracking | geplant | E-Mail-Adapter (Postmark/SES), Open/Click-Tracking, Versand-Queue |
| V3 | Voll-Lead-Research + Lead-Scoring | geplant | FEAT-013 Lead Scoring (regelbasiert + Disqualifier), Firecrawl-Voll-Adapter, Auto-Disqualifier |
| V4 | LinkedIn-Publishing + Multi-Channel-Distribution | geplant | FEAT-011 Voll-Variant (Channel-Segments + Variants), LinkedIn-Adapter, weitere Kanäle |
| V5 | Voll-Tracking + KI-Scoring + A/B-Statistik | geplant | Tracking-Event-Schema, KI-Scoring-Modell, Auto-Variant-Generierung, A/B-Statistik |
| **V6** | **Wissensverdichtungs-Backbone (ehemals V1)** | geplant | FEAT-001..007 (Onboarding-Ingest, Business-Ingest, Portfolio-Monitor, Insight-Layer, Opportunity-Decision, Cross-Kunden-Learnings, Customer Deployment Registry) |
| V7 | Validation & Idea Testing | geplant | Experiment-Entität, Hypothesen, Kill-Kriterien, Research-Task-Erweiterung |
| V8 | Orchestration & Decision Layer | geplant | Hybrid-Cockpit, Priority-Felder, Top-5-Dashboard |
| V9+ | Multi-Tenant, SMAO-API, Auto-Anonymisierung, KI-Auto-Clustering, Deal-Attribution, weitere Kanäle | geplant | Multi-Instanz, Partner-API |

## V1 Scope — Marketing Launcher (Closed Loop Lite) *(diese Runde)*

Zweck: Geschlossener Marketing-Funnel von Brand-Profil bis Pipeline-Handoff in einem Werkzeug — damit StrategAIze sich selbst Leads holen kann.

### Core Features (V1 = 7 Features, davon 5 neu spezifiziert + 2 als Lite-Variante umgewidmet)

#### Neu spezifiziert (Spec-Foundation = coreyhaines31/marketingskills, MIT)
- **FEAT-008 Brand Profile** — Singleton-Brand-Profil auf 12-Sektionen-Schema (`product-marketing-context`-Skill als Foundation): Product Overview, Target Audience, Personas (User/Champion/Decision Maker/Financial Buyer/Technical Influencer), Problems & Pain Points, Competitive Landscape (Direct/Secondary/Indirect), Differentiation, Objections & Anti-Personas, Switching Dynamics (JTBD Four Forces: Push/Pull/Habit/Anxiety), Customer Language (verbatim, words-to-use/avoid, glossary), Brand Voice, Proof Points, Goals. Ersetzt das alte FEAT-008-Schema vollständig. Singleton in V1, Multi-Brand = V9+.
- **FEAT-009 Content Asset Production (7 Output-Typen)** — KI-Generierung via Bedrock mit Brand Profile + Quell-Objekt als Kontext. 7 Output-Typen mit Skill-Quellbezug pro Typ:
  1. Blogpost (`copywriting`-Skill — Page Copy + Annotations + Alternatives + Meta Content)
  2. LinkedIn-Post (`social-content`-Skill — Hook in 4 Formeln + Pillar-Framework + Caption + Engagement)
  3. One-Pager (`sales-enablement`-Skill — 5-Sektionen: Problem / Solution / 3-Differentiators / Proof / CTA)
  4. E-Mail-Vorlage (`cold-email`-Skill — Subject 2-4 Wörter + Body 4 Frameworks + 4-Level-Personalization + Follow-up-Sequence)
  5. Case Card (`sales-enablement`-Skill — 6-Felder: Customer / Challenge / Solution / Results / Pull-Quote / Tags)
  6. Landingpage-Briefing (`copywriting` + `page-cro`-Skills — 7-Dimensionen-CRO-Analyse als Briefing-Spec)
  7. Multi-Page-Website-Spec (`site-architecture`-Skill — ASCII-Tree + Mermaid-Sitemap + URL-Map-Table + Nav-Spec + Linking-Plan)
  Asset-Bibliothek mit Filter, Versionierung, Status-Workflow (Entwurf → überarbeitet → freigegeben → veröffentlicht), Markdown-Export.
- **FEAT-010 ICP & Segment** — ICP-Entität abgeleitet aus product-marketing-context Sektion 2 (Target Audience) + Sektion 3 (Personas). Strukturierte Felder: Branche, Größe, Umsatz-Band, Strukturmerkmale, Trigger-Signale, Persona-Set. Segment-Entität: gefilterte ICP-Instanz mit konkreter Lead-Auswahl.
- **FEAT-015 Lead Research (NEU)** — Firecrawl-Adapter als Primary (API, Pay-as-you-go, planbare Kosten) + Clay-CSV-Import als Fallback. Research-Task pro Segment, Duplikat-Erkennung (Company-Name + Domain), manuelle Lead-Ergänzung. Lead-Entität mit Segment- und Campaign-Referenz.
- **FEAT-016 Messaging-Variation pro Lead (NEU)** — Pro Lead wird ein personalisierter Pitch generiert via cold-email 4-Level-Personalization (Industry / Company / Role / Individual) + marketing-psychology-Skill als Refinement-Booster. Output ist ein Asset vom Typ E-Mail-Vorlage oder LinkedIn-Post mit lead_id-Referenz. Versionierung pro Lead-Pitch.

#### Lite-Variante umgewidmet aus V3-Planung
- **FEAT-011 Campaign Management LITE** — Parent-Campaign als Klammer **ohne Channel-Segments und ohne Variants** (Voll-Variant kommt V4/V5). Pflichtfelder: Titel, Ziel, Zeitfenster, ICP-Referenz, Erfolgssignale. Verknüpft Assets, Leads und Pitches. Status-Workflow: entwurf → aktiv → abgeschlossen → abgebrochen. **High-Attention-Outreach (physischer Brief + Call) ist V1 NICHT mehr enthalten** — verschoben auf V4 als Channel-Variante.
- **FEAT-014 Lead Handoff (Pipeline-Push) + Performance-Capture (UMGESCHRIEBEN)** — **Ersetzt die Qualified-Lead-Inbox-Architektur aus DEC-005.** Statt einer separaten Inbox-Entität im Business pusht V1 qualifizierte Leads als neuen Deal in eine bestehende Business-Pipeline (Pipeline „Lead-Generierung", Stage „Neu"). Pipeline-Funktion existiert im Business System bereits — kein neues Feature dort nötig. Auth via Internal-API-Token (gleiche Hetzner-Coolify-Umgebung). Status-Sync zurück via Webhook (Business → IS). Plus: Performance-Capture-Felder pro Asset (posted_at, channel, cost_eur, impressions, clicks, leads_generated, notes). Manuelle Eingabe nach Posting (~10 Sek pro Asset). LinkedIn-Ads-CSV-Import als Adapter. **Performance-Daten werden als few-shot in den nächsten KI-Generierungs-Call zurückgespielt** — das macht V1 zum Closed Loop.

Feature-Details unter `/features/`.

### Architektonische Festlegungen V1

- **Foundation bleibt gültig:** ARCHITECTURE.md V2 (13 Sektionen), MIG-001 Schema-Baseline (17 Tabellen, RLS, ai_jobs, ai_cost_ledger), Style Guide V2 (DEC-017), DEC-001..019. Adaption an Marketing-Launcher-Scope erfolgt im `/architecture V1`-Lauf (Addendum, nicht Komplett-Rewrite).
- **DEC-005 (Qualified-Lead-Inbox) wird durch DEC-022 (Pipeline-Push) abgelöst** — siehe `/docs/DECISIONS.md`.
- **DEC-020 (vorgemerkt):** Marketing Launcher als funktional eigenständiges Produkt im Single-Repo + template_id-Vorbereitung. Verkaufs-Verpackung später via separater Coolify-Deployments. Kombi-Paket Marketing Launcher + Business System nur wenn echter Kunde anfragt.
- **DEC-021 (vorgemerkt):** Spec-Foundation = coreyhaines31/marketingskills (MIT-Lizenz, 47 Skills) als reference/-Folder im IS-Repo. Reference dient als Spec-Quelle für Datenmodell und Bedrock-Prompt-Vorlagen, **nicht** als runtime-Komponente. Skills im Business-System bleiben unverändert.
- **Asset-Generierung asynchron** via Worker (DEC-011 bleibt) — gilt für 7 Output-Typen sowie für Pitch-Generierung in FEAT-016.
- **Lead-Research-Adapter** im Provider-Adapter-Pattern (DEC-009): `firecrawlAdapter` + `clayCsvAdapter` parallel, beide schreiben in `lead`-Tabelle.
- **Pipeline-Push** als `businessPipelineAdapter` mit Internal-API-Token. Endpoint im Business System wird in V1-Implementierung mit dem Business-Team geklärt.

## V2 Scope — E-Mail-Versand-Adapter + Open-Tracking *(geplant)*

Zweck: V1 erzeugt nur Asset (Markdown). V2 schaltet den Versand frei.

- E-Mail-Provider-Adapter (Postmark EU primär, AWS SES Frankfurt als Alternative — DEC-013 bleibt gültig)
- Versand-Queue mit Scheduling
- Open/Click-Tracking via Pixel + Link-Wrapper
- Bounce/Complaint-Verarbeitung
- DSGVO-Opt-out-Handling

Features werden in eigener Requirements-Runde spezifiziert.

## V3 Scope — Voll-Lead-Research + Lead-Scoring *(geplant)*

- **FEAT-013 Lead Scoring** (Spec existiert bereits, bleibt V3-Scope) — regelbasiert mit Disqualifier-Logik, konfigurierbare Regeln (Feld/Operator/Wert/Punkte/Kategorie), Threshold pro Segment/Kampagne
- Voll-Firecrawl-Adapter (Webhook + API-Pull, V1 ist nur Pull-on-Demand)
- Auto-Disqualifier-Regeln vor Pitch-Generierung

## V4 Scope — LinkedIn-Publishing + Multi-Channel-Distribution *(geplant)*

- FEAT-011 Voll-Variant (Channel-Segments + Variants — A/B-Vorbereitung)
- LinkedIn-Publishing-Adapter (Creator-API primär, Buffer/Hootsuite als Fallback-Brücke — DEC-014 bleibt)
- Weitere Kanäle nach Bedarf
- High-Attention-Outreach (physischer Brief + Call) als Channel-Variante zurückgeholt

## V5 Scope — Voll-Tracking + KI-Scoring + A/B-Statistik *(geplant)*

- Tracking-Event-Schema Hybrid (DEC-015 bleibt) — Core-Felder + kanalspezifisches JSON-Payload
- Konsolidiertes Performance-Cockpit
- KI-Scoring (löst regelbasiertes Scoring aus V3 ab)
- Auto-Variant-Generierung
- A/B-Statistik mit Signifikanz-Test
- Attribution auf Kampagnen-Ebene (NICHT auf Deal-Ebene — Deal-Attribution V9+)

## V6 Scope — Wissensverdichtungs-Backbone (ehemals V1) *(geplant)*

**Inhaltlich identisch zur ursprünglichen V1-Planung 2026-04-15/16** — verschoben auf V6 weil ohne Customer-Cases (die der Marketing Launcher V1 erst erzeugt) leerer Speicher.

- **FEAT-001 Ingest-Layer Onboarding** — Pull-basierter Import verdichteter Knowledge Units aus Onboarding-SLC-010-Export-API
- **FEAT-002 Ingest-Layer Business** — Pull-basierter Import relevanter Entitäten aus Business V4+, fehlertolerant
- **FEAT-003 Portfolio-Monitor** — UI-Übersicht aller Kundenprojekte mit Filter, Suche, Detail-Ansicht
- **FEAT-004 Insight-Layer** — KU-Liste mit Volltext-Suche, Tag-System, manuellem Clustering
- **FEAT-005 Opportunity & Decision basic** — strukturierte Bewertung (4 Pflicht- + 7 optionale Dimensionen) mit KI-Unterstützung, Decision-Board
- **FEAT-006 Cross-Kunden-Learnings basic** — manuelle Freigabe-Markierung und Anonymisierung pro KU, interne Cross-Kunden-Ansicht
- **FEAT-007 Customer Deployment Registry** — Deployment-Typ, Server-Referenzen, aktive Module, Code-Version, Update-Rollout-Ansicht

Feature-Specs FEAT-001..007 existieren bereits unter `/features/` (aus V1-Planung 2026-04-15/16) und bleiben gültig — werden in V6-Slice-Planning später zugeschnitten.

## V7 Scope — Validation & Idea Testing *(geplant)*

Experiment-Entität mit Hypothese, Zielgruppe, Kanal, Kill-Kriterien, Erfolgssignalen, Budget, Zeitfenster. KI-Vorschlag von Experiment-Designs aus Opportunities. Research-Task mit 6 Research-Typen (aus archiviertem alten FEAT-012). Strukturierte Ergebnis-Dokumentation und Folgeentscheidung. Verknüpfung: Experiment → ggf. Kampagne → ggf. Lead → ggf. Deal.

## V8 Scope — Orchestration & Decision Layer *(geplant)*

Hybrid-Cockpit (Gründer-Entscheidung OQ-V2-04, DEC-007 bleibt). Priorisierung primär über Priority-Felder in bestehenden Listen. Zusätzlich: leichtgewichtige Dashboard-Seite „Was ist wichtig?" mit Top-5 pro Entity-Typ (Opportunity, Kampagne, Experiment, Lead). Manuelle Flags + Sortierung. **KI-Auto-Priorisierung ist V9+**.

## V9+ Scope — Multi-Tenant + Voice-API + Erweiterungen *(geplant)*

- Template-Modus für externe Kundenunternehmen (Multi-Instanz-Aktivierung)
- Custom-Brand-Profile pro Kunde
- SMAO-Partner-API mit Auth + Rate-Limiting (Knowledge Packaging)
- Auto-Anonymisierung via Bedrock für Cross-Kunden-Learnings
- KI-Auto-Clustering und Auto-Pattern-Erkennung
- KI-Auto-Priorisierung im Orchestration-Layer
- Deal-Ebene-Attribution (Kampagne → Deal-Abschluss)
- Weitere Publishing-Kanäle (X, YouTube/Short-Video, Paid-Ads)

## Success Criteria

### V1 — Marketing Launcher (Closed Loop Lite)

- Brand Profile auf 12-Sektionen-Schema einmalig konfiguriert (alle 12 Sektionen mit Pflichtfeldern befüllt)
- Alle 7 Output-Typen sind generierbar und exportierbar — KI-Output enthält die Skill-spezifischen Strukturelemente (z. B. cold-email Subject 2-4 Wörter, social-content Hook-Formel)
- Asset-Bibliothek ist durchsuchbar, filterbar, versioniert, statusgeführt
- ICP + Segment definiert, mindestens 1 Segment mit ≥ 20 Leads
- Lead Research via Firecrawl funktioniert (Pull mit Duplikat-Erkennung), Clay-CSV-Import funktioniert
- Pro Lead wird ein personalisierter Pitch generiert (E-Mail-Vorlage oder LinkedIn-Post) mit 4-Level-Personalization-Substanz
- Campaign Lite verbindet Assets, Leads und Pitches in einem Zeitfenster
- Pipeline-Push an Business System funktioniert: Deal entsteht in Pipeline „Lead-Generierung", Stage „Neu" — verifiziert über Business-API-Smoke-Test
- Performance-Capture-Felder pro Asset eingabefähig (posted_at, cost_eur, impressions, clicks, leads_generated)
- Performance-Daten werden als few-shot in den nächsten KI-Generierungs-Call zurückgespielt — verifiziert über Prompt-Inspection
- IS läuft stabil auf Hetzner über Coolify, ohne US-Datenfluss
- KI-Freigabe-Quote > 60 % ohne manuelle Überarbeitung (gemessen über die ersten 30 Assets)
- Mindestens 5 qualifizierte Leads in Business-Pipeline-„Lead-Generierung" gepusht innerhalb 4 Wochen nach V1-Deploy

## Out of Scope V1 *(verschoben auf spätere Versionen)*

- E-Mail-Versand und Open/Click-Tracking → **V2**
- LinkedIn-Publishing → **V4**
- Auto-Disqualifier-Regeln → **V3**
- Lead-Scoring (regelbasiert oder KI) → **V3** bzw. **V5**
- Channel-Segments + Variants in Campaign → **V4**
- High-Attention-Outreach (physischer Brief + Call) → **V4**
- Voll-Tracking-Cockpit + A/B-Statistik → **V5**
- Statistisch saubere A/B-Auswertung → **V5**
- KI-Auto-Variant-Generierung → **V5**
- **Wissensverdichtungs-Backbone** (Onboarding-Ingest, Portfolio-Monitor, Insight-Layer, Opportunity-Decision, Cross-Kunden-Learnings, Customer Deployment Registry) → **V6**
- Validation/Experiment-Entität → **V7**
- Orchestration/Hybrid-Cockpit → **V8**
- Template-Modus, Multi-Tenant, SMAO-API → **V9+**

## Out of Scope *(dauerhaft, PLATFORM.md-Non-Goals)*

- Eigener RAG-Chat-Layer oder Wissens-Plattform über Kundenrohdaten
- Fremdsystem-Konnektoren (Outlook, Gmail, Drive, Sharepoint, Datev, Lexware) — IS schreibt nur in Business-Pipeline via API
- Eigene Voice-Oberfläche (V9+ nur als API für SMAO-Partner)
- Rohdatenverarbeitung (bleibt in Onboarding bzw. den Quellsystemen)
- Deal-Management, Gesprächsdokumentation, Revenue-Tracking im IS (bleibt Business)
- Physische Zustellungs-Tracking (bleibt offline, V4 bereitet nur vor)
- IS als verkaufsfähiger Multi-Kanal-Publisher (kein Publish-Produkt — Publishing dient Marketing Launcher)
- IS als Google-Analytics-Ersatz (nur eigene Kampagnen-Konsolidierung in V5)

## Constraints

### Technical
- Hetzner + Supabase + Docker-Compose via Coolify (analog Onboarding-Plattform)
- Next.js 16+ mit App Router, React 19, Tailwind, shadcn/ui
- AWS Bedrock eu-central-1 als einziger LLM (Claude Sonnet/Opus), Provider-Adapter-Pattern verbindlich (DEC-002, DEC-009)
- GitHub-Repo `Strategaize-systems/strategaize-intelligence-studio` aktiv (DEC-018), Coolify-Auto-Deploy aus
- Bedrock-Calls für 7 Output-Typen + Pitch-Generierung pro Lead → asynchron via Worker (DEC-011)

### Data Residency (verbindlich)
- EU-Hosting, bevorzugt Deutschland
- Keine US-Direktanbieter, keine US-Regionen — auch nicht temporär
- Firecrawl: vor V1-Implementierung verifizieren, dass EU-Endpoint + DPA verfügbar ist (sonst alternative Lösung wie selbst gehostetes Crawl-Skript)
- Referenz: `/strategaize-dev-system/.claude/rules/data-residency.md`

### Spec-Foundation-Constraint
- V1 baut auf coreyhaines31/marketingskills (MIT-Lizenz, geklont nach `reference/corey-haines-marketing-skills/`)
- Reference ist **Spec-Quelle**, **kein Runtime-Bestandteil** — die Skills laufen nicht im IS-Worker, sondern dienen als Vorlage für Datenmodell und Bedrock-Prompt-Vorlagen
- Git-Strategie für reference-Folder: siehe DEC-021 + Open Question OQ-V1-01 unten

### Business-System-Constraint (Pipeline-Push)
- Business System V4+ hat bereits eine Pipeline-Funktion mit konfigurierbaren Stages
- Marketing Launcher V1 setzt voraus: eine Pipeline „Lead-Generierung" mit Stage „Neu" existiert (oder wird im V1-Deploy angelegt)
- API-Endpoint für Deal-Erstellung muss verfügbar sein — verifiziert in V1-Implementierung mit Business-Team
- Auth: Internal-API-Token (gleiche Hetzner-Coolify-Umgebung)

### Scope-Protection
- Schema V1 template-ready (DEC-010 bleibt): optionale `template_id`-Felder und Feature-Flags pro Modul
- Multi-Instanz-Aktivierung frühestens V9+
- Brand-Profil in V1 = **eins**, Multi-Brand = V9+

### Architektur-Imperativ (für `/architecture V1`)
- ARCHITECTURE.md V2 bleibt Foundation — V1 braucht **Addendum**, keinen Rewrite:
  - Tabellen für Brand-Profil-12-Sektionen (kann als JSONB strukturiert sein, einzelne Foreign-Keys nur wo Filterung relevant)
  - 7 Output-Typen mit Skill-Quellbezug → Asset-Tabelle hat `source_skill`-Feld
  - Lead-Tabelle mit Segment- und Campaign-FK
  - Pitch-Tabelle (FEAT-016) mit Lead-FK + Asset-FK
  - Performance-Capture-Felder als JSONB an Asset oder als eigene `asset_performance`-Tabelle
  - Pipeline-Push-Adapter (`businessPipelineAdapter`) im Adapter-Verzeichnis
  - Firecrawl-Adapter im Adapter-Verzeichnis
- Adapter-Pattern bleibt einheitliches Framework: Bedrock (LLM), Firecrawl (Lead-Research), Business-Pipeline (Lead-Push), Clay-CSV (Lead-Import-Fallback). E-Mail (V2), LinkedIn (V4), Tracking (V5) folgen.
- Worker-Layer-Architektur: gemeinsam, wie in DEC-008 festgelegt — kein Modul-eigener Worker

## Risks / Assumptions

### Risks (V1)
- **R-01: Firecrawl-EU-Endpoint und DPA.** Wenn Firecrawl in V1-Implementierung kein DSGVO-belastbares EU-Hosting bietet, ist Lead-Research-Primary-Provider blockiert. Mitigation: Vor SLC-005 (Lead Research) verifizieren — bei negativem Ergebnis Pivot auf Clay-CSV-only oder selbst gehostetes Crawl-Skript.
- **R-02: Business-Pipeline-API-Lücke.** Pipeline-Funktion existiert in Business System, aber API-Endpoint für externe Deal-Erstellung muss in V1-Implementierung mit Business-Team verifiziert werden. Mitigation: Smoke-Test im Bridge-Slice (vor SLC-008), bei Lücke kurzer Business-System-Sprint.
- **R-03: KI-Output-Qualität pro Skill-Quelle.** 7 Output-Typen mit jeweils eigenem Skill-Schema bedeutet 7 individuelle Bedrock-Prompts. Wenn ein Output-Typ konsistent unter Freigabe-Quote 60 % bleibt, blockiert er V1-Erfolg. Mitigation: pro Skill 5 Beispiel-Outputs aus Corey-Haines-Repo als few-shot mitgeben + iteratives Prompt-Tuning.
- **R-04: 4-Level-Personalization-Aufwand.** Pro Lead 4-Level-Pitch (Industry/Company/Role/Individual) bedeutet 4 Bedrock-Calls oder einen großen Multi-Section-Call. Cost-pro-Lead könnte auflaufen. Mitigation: Cost-Tracking ab Tag 1 (DEC-009), bei Cost-pro-Lead > 0,50 EUR Refactoring zu single-call.
- **R-05: Performance-Capture-Disziplin.** Performance-Loop funktioniert nur, wenn nach Posting wirklich Daten manuell erfasst werden. Mitigation: 10-Sek-UX, Reminder-Mechanismus, Default-Werte aus LinkedIn-Ads-CSV.
- **R-06: Reference-Folder-Lizenz und Updates.** Corey-Haines-Repo ist MIT, aber Updates am Quell-Repo könnten unsere Spec-Foundation drift. Mitigation: Spec-Snapshot in `docs/spec-references/` extrahieren (siehe Empfehlung Git-Strategie b in OQ-V1-01).
- **R-07: Bedrock-Cost-Auflauf.** 7 Output-Typen + Pitch-Generierung pro Lead bedeutet bei 100 Leads/Monat ~700 Bedrock-Calls. Mitigation: Cost-Cap pro Generation in `ai_cost_ledger`, Alarm bei Monatsschwelle.

### Risks (mit Auswirkung auf spätere Versionen)
- **R-08: V6 Wissensverdichtungs-Backbone-Verschiebung.** Wenn V6 erst nach 6+ Monaten kommt, sind Onboarding-Ingest-Annahmen veraltet. Mitigation: Onboarding-SLC-010-Export-API bleibt Ingest-Quelle, FEAT-001-Spec wird vor V6-Slice-Planning aktualisiert.
- **R-09: Business V4 Lead-Pipeline-Stages-Konvention.** V1 setzt Stage „Neu" voraus. Wenn Business-Roadmap die Stage-Namen ändert, Pipeline-Push-Adapter anpassen.

### Assumptions
- Primärnutzer V1: Gründer + 1 Marketing-Operator
- Deployment erfolgt analog Onboarding: Coolify + Docker-Compose + Supabase + Bedrock-Adapter
- Bedrock-Call-Kosten für Content-Generierung sind akzeptabel (geschätzt 30–80 Calls/Tag in V1)
- LinkedIn + E-Mail sind als erste Publishing-Kanäle ausreichend für V2 + V4
- Pipeline-Funktion im Business System hat einen erreichbaren API-Endpoint für externe Deal-Erstellung (Verifikation in V1-Implementierung)
- Firecrawl bietet einen DSGVO-belastbaren EU-Endpoint (Verifikation in V1-Implementierung)

## Open Questions

### Pre-Architecture V1 (zu klären in `/architecture V1`-Lauf oder im Implementierungs-Bridge-Slice)

- **OQ-V1-01: Git-Strategie für reference/corey-haines-marketing-skills/** — drei Optionen:
  - a) ins Git committen (self-contained Repo, Updates am Upstream gehen verloren)
  - b) gitignoren + Setup-README + Spec-Extraktion in `docs/spec-references/` (schlank, Empfehlung)
  - c) Git-Submodule (versionsgepinnte Quelle, etwas mehr Komplexität)
  - **Empfehlung: b)** — siehe DEC-021 (Status: pending Bestätigung im Skill-Lauf).
- **OQ-V1-02: Firecrawl EU-Hosting verifizieren** — DPA-Status und Endpoint-Region prüfen, Alternative bei Negativ-Ergebnis. Vor SLC-005 in V1.
- **OQ-V1-03: Pipeline-Push-API-Endpoint im Business System** — exakte Route, Payload-Schema, Auth-Modell mit Business-Team klären. Vor SLC-008 in V1.
- **OQ-V1-04: 4-Level-Personalization Cost-Strategie** — single-call multi-section vs. 4 sequential calls. Entscheidung nach erstem Prototyp im Architektur-Lauf.
- **OQ-V1-05: Performance-Capture-UX** — Inline-Eingabe in Asset-Detail vs. separater Performance-Capture-Workflow. Entscheidung im UI-Slice.

### Offen für `/architecture V1`

- **OQ-A1: Datenmodell 12-Sektionen-Brand-Profile** — JSONB-Singleton vs. ausgespreizte Tabelle. Empfehlung: JSONB mit definiertem Schema (kein zusätzlicher Migration-Bedarf bei Sektion-Erweiterung).
- **OQ-A2: Asset-Tabelle mit `source_skill`-Feld** — als Enum oder Free-Text mit Validation gegen Skill-Liste.
- **OQ-A3: Lead-Pitch-Beziehung** — eine Pitch-Tabelle mit Lead-FK + Asset-FK, oder wird Pitch nur als spezialisierter Asset-Subtype geführt? Entscheidung beeinflusst Versionierung.
- **OQ-A4: Performance-Capture-Tabelle** — eigene `asset_performance`-Tabelle vs. JSONB-Spalte an `asset`. Entscheidung beeinflusst Reporting-Queries.
- **OQ-A5: Few-shot-Performance-Loop-Mechanik** — Wie werden Performance-Daten in den nächsten Prompt eingespeist? Top-N-Performer per Skill-Typ als Beispiele? Klassifikation High-/Mid-/Low-Performer? Entscheidung im Architektur-Lauf.

### Offen für `/requirements` V2+ (später)

- **OQ-R1:** E-Mail-Provider-Wahl V2 (DEC-013 schlägt Postmark EU vor — Bestätigung im V2-Lauf)
- **OQ-R2:** LinkedIn-API-Realität V4 (DEC-014 schlägt Creator-API + Buffer-Fallback vor — App-Review-Test im V4-Lauf)
- **OQ-R3:** Custom-Brand-Profile pro Kunde — wann V9+ aktivieren, welche Pricing-Relevanz

## Delivery Mode

**`internal-tool`**

Begründung: V1–V8 werden primär intern genutzt (Gründer + 1–2 Marketing-/Sales-Operator). Deployment cloud-fähig (Hetzner + Supabase), aber kein SaaS-Produkt. Template-Modus für externe Kundeneinsätze kommt V9+ — dann kann sich der Delivery Mode auf `client-app` oder `SaaS` erweitern.

## Referenzen

- Gesamtarchitektur: `/strategaize-dev-system/docs/PLATFORM.md`
- Data Residency: `/strategaize-dev-system/.claude/rules/data-residency.md`
- Spec-Foundation: `/reference/corey-haines-marketing-skills/` (MIT-Lizenz, 47 Skills)
- Discovery V1 (alt): `/reports/RPT-001.md`
- Requirements V1 (alt): `/reports/RPT-002.md`
- Discovery V2 (alt): `/reports/RPT-003.md`
- Requirements V2 (alt): `/reports/RPT-004.md`
- Architecture V1 (Foundation, gültig): `/reports/RPT-005.md`
- Slice-Planning V1 (alt): `/reports/RPT-006.md`
- SLC-001 Backend-Setup (alt): `/reports/RPT-007.md`
- **Requirements V1 Marketing Launcher Pivot (diese Runde): `/reports/RPT-008.md`**
- Richtungsvorgaben V1 (alt): `/docs/discovery-input.md`
- Richtungsvorgaben V2 (alt): `/docs/discovery-input-v2.md`
- Memory: `session_handoff_2026_04_25_marketing_launcher_pivot.md`, `project_marketing_launcher_v1_scope.md`
