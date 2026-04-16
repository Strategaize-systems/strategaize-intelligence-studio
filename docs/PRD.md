# Product Requirements Document

## Purpose
StrategAIze Intelligence Studio — System 3 der Gesamtarchitektur. Intelligence + Produktions + Go-To-Market-Steuerungsschicht. Sammelt verdichtetes Wissen aus Onboarding-Plattform (System 1) und Signale aus Business Development System (System 2), übersetzt das in strukturierte Entscheidungen, Content, Brand-Assets, Kampagnen, qualifizierte Leads, Performance-Tracking. Spielt über eigene Kanal-Adapter aus (LinkedIn + E-Mail + mehr) und konsolidiert Tracking-Rohdaten in einem eigenen Performance-Cockpit. Wissen und Fremdsystem-Zugriff enden nach der Verdichtung — keine eigene RAG-/Chat-/Voice-Plattform.

Referenz Gesamtarchitektur: `/strategaize-dev-system/docs/PLATFORM.md`.

## Vision
Ein zentrales, template-fähig konzipiertes System, das die gesamte **Schicht zwischen Wissen und Vertrieb** abdeckt:
- verdichtetes Wissen aus Onboarding-Projekten systematisch sichtbar machen
- daraus Content, Brand-Assets, Kampagnen und Hypothesen-Tests strukturiert erzeugen
- qualifizierte Leads an Business übergeben
- Performance konsolidiert tracken, ohne N externe Analytics-Konsolen zu öffnen
- strategische Priorisierung und Entscheidungen über alle Ebenen orchestrieren
- später als Kunden-Template einsetzbar sein

**Leitprinzip (Gründer-Fixierung 2026-04-16):** *„Ich will nicht sechs Tracking-Cockpits öffnen müssen — wir holen die Rohdaten zurück und machen unsere eigene Übersicht."*

## Target Users

### V1–V3 (primär intern)
- **Gründer / Strategischer Eigentümer** — Portfolio-Überblick, Opportunity-Bewertung, Content-Freigabe, Kampagnen-Steuerung, strategische Entscheidungen
- **Beratungs-/Delivery-Team (intern, klein)** — Kundenmonitor, Deployment-Stand, Asset-Nutzung, Cross-Kunden-Learnings
- **Marketing-/Sales-Operator (intern)** — ab V3: Kampagnen-Ausführung, Lead-Recherche, Lead-Scoring-Kuratierung

### V4+
- externe Kanäle (LinkedIn, E-Mail) als Ausspielziele (V4)
- Platform-Analytics als Tracking-Quelle (V5)

### V8+
- externe Kundenunternehmen als Plattform-Nutzer (Template-Modus)
- Voice-Partner (SMAO-ähnlich) als API-Konsument

## Problem Statement
Wissen, Marktsignale und Umsetzungsarbeit entstehen verteilt über mehrere Systeme, Tools und Plattformen. Konkrete Probleme:

1. **Fehlende zentrale Wissens-Verdichtung** — Erkenntnisse aus Onboarding-Projekten laufen heute nicht strukturiert zusammen.
2. **Fehlender Portfolio-Überblick** — Kundenstand (Stack, Version, Module) ist nicht systematisch erfasst, Support und Rollout ad hoc.
3. **Informelle Opportunities und Entscheidungen** — Produktentscheidungen nicht strukturiert bewertet und nicht nachvollziehbar dokumentiert.
4. **Cross-Kunden-Learnings gehen verloren** — Erkenntnisse bleiben im Kopf, sind für spätere Projekte oder Produktverbesserungen nicht abgreifbar.
5. **Content und Brand-Assets sind einmalig und inkonsistent** — keine systematische Wiederverwendung, keine einheitliche Markenstimme, hoher Wiederholungsaufwand.
6. **Kampagnen-Steuerung findet in Spreadsheets und separaten Tools statt** — keine einheitliche ICP-, Segment-, oder Kampagnen-Definition; kein durchgängiger Lead-Fluss.
7. **Tool-Zoo im Tracking** — LinkedIn Analytics, E-Mail-Provider-Analytics, Google Analytics, Clay — fünf bis sechs Dashboards, keine konsolidierte Sicht.
8. **Neue Business-Ideen werden ad hoc getestet oder gar nicht** — fehlende Kill-or-Go-Struktur kostet Zeit und Geld.
9. **Keine orchestrierende Sicht über alles** — Priorisierung passiert im Kopf, nicht auf Basis von Daten.

## Goal / Intended Outcome
Ein operatives Intelligence Studio, in dem:

- verdichtete Knowledge Units aus Onboarding und Signale aus Business automatisch auflaufen
- ein Portfolio-Monitor pro Kunde Deployment-Typ, Stack, Version und Modul-Einsatz zeigt
- Opportunities strukturiert bewertet und Entscheidungen nachvollziehbar getroffen werden
- anonymisierte Cross-Kunden-Learnings als interne IP verfügbar sind
- Brand-Assets und Content KI-gestützt mit konsistenter Markenstimme erzeugt werden
- Kampagnen mit ICP, Segmenten, mehreren Kanälen und A/B-Varianten geplant und qualifizierte Leads automatisch an Business übergeben werden
- Publishing auf externen Kanälen (LinkedIn, E-Mail) aus IS heraus passiert
- Tracking-Rohdaten konsolidiert in einem einzigen Performance-Cockpit landen
- neue Business-Ideen strukturiert getestet und mit klaren Kill-or-Go-Kriterien bewertet werden
- Priorisierung über alle Ebenen in einem Hybrid-Cockpit sichtbar wird

## Product Overview — 6 Funktionsbereiche

IS deckt über den Gesamt-Lebenszyklus folgende Funktionsbereiche ab:

| # | Bereich | Zentraler Zweck | Ab Version |
|---|---|---|---|
| 1 | **Learning & Pattern Intelligence** | Wissen verdichten, Opportunities ableiten, Cross-Kunden-Learnings | V1 |
| 2 | **Content, Brand & Asset Production** | KI-gestützt konsistente Assets mit Brand-Profil als Kontext | V2 |
| 3 | **Campaign & Lead Intelligence** | ICP, Segmente, Kampagnen, Lead-Recherche, Enrichment, Scoring, Handoff | V3 |
| 4 | **Distribution / Publishing** | Aus IS heraus auf LinkedIn, E-Mail und weitere Kanäle posten | V4 |
| 5 | **Tracking / Performance-Cockpit** | Rohdaten aus Kanälen konsolidieren, attributionierte Kampagnen-Performance | V5 |
| 6 | **Validation & Idea Testing** | Hypothesen, Experimente, Research mit Kill-or-Go-Logik | V6 |
| 7 | **Orchestration & Decision Layer** | Hybrid-Cockpit für Priorisierung über alle Ebenen | V7 |

Plus Fundament (Teil V1):
- **Ingest** aus Onboarding + Business
- **Portfolio-Monitor** mit Customer Deployment Registry

## Version Plan

Versions-Reihenfolge = **Bau-Reihenfolge**, nicht Scope-Amputation (Gründer-Fixierung 2026-04-16). Alles wird gebaut.

| Version | Inhalt | Status | Primäre neue Features |
|---|---|---|---|
| V1 | Fundament + Learning & Pattern Intelligence | Requirements abgeschlossen, Architecture offen | FEAT-001..007 |
| V2 | Content, Brand & Asset Production | Requirements (diese Runde) | FEAT-008, FEAT-009 |
| V3 | Campaign & Lead Intelligence Kern | Requirements (diese Runde) | FEAT-010..014 |
| V4 | Publishing / Distribution | geplant | Kanal-Adapter-Framework, LinkedIn + E-Mail |
| V5 | Tracking / Performance-Cockpit | geplant | Event-Schema, Rohdaten-Pull, Konsolidierung |
| V6 | Validation & Idea Testing | geplant | Experiment-Entität, Research-Task |
| V7 | Orchestration & Decision Layer | geplant | Hybrid-Cockpit, Priority-Felder |
| V8+ | Template-Modus, SMAO-API, Auto-Anonymisierung, KI-Auto-Clustering, weitere Kanäle | geplant | Multi-Instanz, Partner-API |

## V1 Scope *(unverändert, bereits abgeschlossen 2026-04-15)*

### Core Features
- **FEAT-001 Ingest-Layer Onboarding** — Pull-basierter Import verdichteter Knowledge Units aus Onboarding-Plattform
- **FEAT-002 Ingest-Layer Business** — Pull-basierter Import relevanter Entitäten aus Business Development System, fehlertolerant gegen fehlende Felder
- **FEAT-003 Portfolio-Monitor** — UI-Überblick aller Kundenprojekte mit Filter, Suche, Detail-Ansicht
- **FEAT-004 Insight-Layer** — KU-Liste mit Volltext-Suche, Tag-System, manuellem Clustering
- **FEAT-005 Opportunity & Decision basic** — strukturierte Bewertung (4 Pflicht-, 7 optionale Dimensionen) mit KI-Unterstützung, Decision-Board mit Status-Workflow
- **FEAT-006 Cross-Kunden-Learnings basic** — manuelle Freigabe-Markierung und Anonymisierung pro KU, interne Cross-Kunden-Ansicht
- **FEAT-007 Customer Deployment Registry** — Deployment-Typ, Server-Referenzen, aktive Module, Code-Version, Update-Rollout-Ansicht

Feature-Details unter `/features/`.

## V2 Scope — Content, Brand & Asset Production *(neu)*

Zweck: KI-gestützt konsistente Content- und Kommunikations-Assets erzeugen, die nach StrategAIze klingen und auf Brand-Profil-Basis wiederverwendbar sind.

### Core Features
- **FEAT-008 Brand Profile** — **ein einziges** Brand-Profil (StrategAIze-Eigen) mit strukturierten Feldern: Tonalität, Zielgruppen-Stimme, Do's, Don'ts, Struktur-Templates pro Output-Typ, 3–5 Beispiel-Assets als „so klingen wir". Farben/Typo als optionale Felder. Dient als LLM-Kontext für alle Content-Generierungen.
- **FEAT-009 Content Asset Production** — Asset-Request-Workflow mit Quell-Objekt (KU, Opportunity, Pattern, Kampagne, Experiment — soweit in der jeweiligen Version vorhanden) und Output-Typ. KI-Generierung via Bedrock mit Brand-Profil als Kontext. 6 Output-Typen: Blogpost (Markdown), LinkedIn-Post, One-Pager, E-Mail-Vorlage, Case Card, Landingpage-Briefing. Asset-Bibliothek mit Filter, Versionierung, Status-Workflow (Entwurf → überarbeitet → freigegeben → veröffentlicht). Markdown-Export.

### Architektonische Festlegungen V2
- **Nur ein Brand-Profil** in V2. Multi-Tenant-Brand-Profile = V8+ (Gründer-Entscheidung OQ-V2-03 am 2026-04-16). „Powered by Strategize"-Footer ist akzeptabler Default.
- Brand-Profil-Schema muss template-ready sein (`template_id` optional), aber V2 aktiviert keine Multi-Tenant-Logik.
- Asset-Erzeugung ist **synchron** (Request-Response in <30s) oder asynchron via Worker je nach Bedrock-Antwortzeit. Design in `/architecture`.
- Publishing passiert in V2 **nicht** — Assets werden nur erzeugt, via Markdown-Export aus IS heraus manuell gepostet.

## V3 Scope — Campaign & Lead Intelligence *(neu)*

Zweck: Alles Vorgelagerte zum Vertrieb in IS bündeln. ICP, Segmente, Kampagnen (digital + physisch), Lead-Recherche, Enrichment, Scoring, Handoff an Business. Grenzlinie zu Business: IS = Pre-Sales, Business = Deal-Management (Gründer-Fixierung 2026-04-16).

### Core Features
- **FEAT-010 ICP & Segment** — ICP-Entität (Ideal-Customer-Profile): Branche, Größe, Umsatz-Band, Strukturmerkmale, Trigger-Signale. Segment-Entität: gefilterte ICP-Instanz mit konkreter Auswahl (aus Business-Kontakten und/oder extern recherchierten Leads).
- **FEAT-011 Campaign Management** — Parent-Campaign-Entität mit Channel-Segmenten (digital + physisch in einem Modell) und Variant-Ebene für A/B-Testing-Vorbereitung. Kampagnentypen: Standard Outbound, Inbound-Triggered, Hybrid, **High-Attention Outreach** (physischer Brief/Geldschein + Follow-up-Call). Pflichtfelder pro Kampagne: Titel, Ziel, Zielgruppe (Segment-Referenz), Kanäle, Zeitfenster, Erfolgssignale. Status-Workflow: entwurf → aktiv → abgeschlossen → abgebrochen.
- **FEAT-012 Lead Research & Enrichment** — Lead-Recherche-Workflow mit Research-Typen (Zielgruppenrecherche, Operator-Profil, Multiplikator, Testmarkt, Outreach-Pack, Listenauftrag — aus archiviertem FEAT-012 übernommen). Clay-Enrichment-Adapter: CSV-Import in V3, Webhook/Pull-Evaluation in `/architecture`. Manuelle Lead-Ergänzung. Lead-Entität mit Kampagnen- und Segment-Referenz.
- **FEAT-013 Lead Scoring** — regelbasiertes Scoring in V3 (konfigurierbare Regeln auf Lead-Feldern: Größe, Branche, Trigger-Match, Interaktionshistorie). KI-basiertes Scoring kommt V5+, wenn Tracking-Daten verfügbar sind.
- **FEAT-014 Qualified Lead Handoff** — **Fluss 5b der Gesamtarchitektur.** Wenn Lead-Score einen Schwellenwert überschreitet: Export-Mechanismus an Business Development System in den dortigen „Qualified Lead Inbox". Mit Kampagnen-Kontext, Quell-Recherche, Score-Begründung. Statussync: IS sieht, welche Leads Business übernommen/verworfen hat.

### Architektonische Festlegungen V3
- **Campaign-Modell:** Parent-Campaign + Channel-Segmente + Variants (Gründer-Entscheidung OQ-V2-01). Das Modell gibt A/B-Testing operativ frei, **aber operative A/B-Auswertung kommt erst V5** (Tracking nötig).
- **Lead-Handoff-Mechanik:** Qualified-Lead-Inbox im Business (Gründer-Entscheidung OQ-V2-02). **Kritische Abhängigkeit:** Business V4 hat heute keine solche Inbox — Business-seitige Erweiterung notwendig (siehe Risks R-05). FEAT-014 kann erst scharf geschaltet werden, wenn Business die Inbox liefert. Bis dahin: Export nach CSV oder manueller Handoff.
- **Physische Zustellung:** IS bereitet vor (Brief-Content, Adress-Liste, Follow-up-Call-Zeitpunkt). Kein Paket-Tracking. Manuelles Status-Update „verschickt am X" (Gründer-Fixierung 2026-04-16).
- **Clay-Integration-Tiefe:** in `/architecture` zu entscheiden. V3-Minimum: CSV-Import.
- **Kanal-Ausspielung passiert in V3 noch NICHT** — V3 ist Kampagnen-Design + Lead-Recherche. Publishing ist V4.

## V4 Scope — Publishing / Distribution *(geplant)*

Ausspielung von Assets und Kampagnen-Inhalten aus IS heraus. Kanal-Adapter-Framework mit LinkedIn + E-Mail als erste Kanäle. Scheduling, Queue, Format-Anpassung. Publish-Status-Tracking. Verknüpfung: Asset + Kampagne + Channel-Segment + Publish-Event.

Offene Architektur-Fragen (`/architecture`):
- LinkedIn-API-Realität (Creator-API, App-Review-Aufwand)
- Scheduling/Worker-Layer (gemeinsam mit Ingest-Workern oder separat)
- E-Mail-Provider-Auswahl (Postmark, SES, etc.)

## V5 Scope — Tracking / Performance-Cockpit *(geplant)*

Rohdaten-Rückfluss aus Publishing-Kanälen. Einheitliches Event-Schema (Impressions, Engagement, Conversions wo verfügbar). Konsolidiertes Cockpit: Kampagne → Asset → Kanal → Performance. Attribution auf Kampagnen-Ebene, **nicht** auf Deal-Ebene in V5. A/B-Auswertung für Kampagnen-Varianten wird hier operativ nutzbar. KI-Scoring für Leads (Ersatz des regelbasierten Scorings aus V3) wird hier möglich.

## V6 Scope — Validation & Idea Testing *(geplant)*

Experiment-Entität mit Hypothese, Zielgruppe, Kanal, Kill-Kriterien, Erfolgssignalen, Budget, Zeitfenster. KI-Vorschlag von Experiment-Designs aus Opportunities. Research-Task mit 6 Research-Typen (aus archiviertem FEAT-012). Strukturierte Ergebnis-Dokumentation und Folgeentscheidung. Verknüpfung: Experiment → ggf. Kampagne → ggf. Lead → ggf. Deal.

## V7 Scope — Orchestration & Decision Layer *(geplant)*

Hybrid-Cockpit (Gründer-Entscheidung OQ-V2-04). Priorisierung primär über Priority-Felder in bestehenden Listen. Zusätzlich: leichtgewichtige Dashboard-Seite „Was ist wichtig?" mit Top-5 pro Entity-Typ (Opportunity, Kampagne, Experiment). Manuelle Flags + Sortierung. **KI-Auto-Priorisierung ist V8+**.

## V8+ Scope — Spätere Verdichtung *(geplant)*

- Template-Modus für externe Kundenunternehmen (Multi-Instanz-Aktivierung)
- Custom-Brand-Profile pro Kunde
- SMAO-Partner-API mit Auth + Rate-Limiting (Knowledge Packaging)
- Auto-Anonymisierung via Bedrock für Cross-Kunden-Learnings
- KI-Auto-Clustering und Auto-Pattern-Erkennung
- KI-Auto-Priorisierung im Orchestration-Layer
- Deal-Ebene-Attribution (Kampagne → Deal-Abschluss)
- Weitere Publishing-Kanäle (X, YouTube/Short-Video, Paid-Ads)

## Success Criteria

### V1 *(unverändert)*
- Verdichtete Knowledge Units aus Onboarding werden automatisch im IS sichtbar und durchsuchbar
- Kundenportfolio ist zentral einsehbar (Kontakt, Unternehmen, Deployment-Typ, Stack, Code-Version)
- Opportunities lassen sich in unter 2 Minuten erfassen und mit KI-Unterstützung bewerten
- Mindestens 10 anonymisierte Learnings sind cross-Kunde intern zugänglich
- Update-Rollout kann auf Basis der Customer Deployment Registry geplant werden
- IS läuft stabil auf Hetzner über Coolify, ohne US-Datenfluss

### V2
- Brand-Profil ist einmalig konfiguriert und LLM-Kontext-fähig
- Alle 6 Output-Typen sind generierbar und exportierbar
- Asset-Bibliothek ist durchsuchbar, filterbar, versioniert
- Asset-Status-Workflow funktioniert (Entwurf → freigegeben → veröffentlicht)
- KI-generierter Content klingt konsistent nach StrategAIze (Freigabe-Quote > 60 % ohne manuelle Überarbeitung)

### V3
- ICP kann definiert und Segmente daraus abgeleitet werden
- Parent-Campaign mit Channel-Segmenten (digital + physisch) ist erstellbar
- High-Attention-Outreach-Kampagne (Brief + Call) ist strukturiert erfassbar
- Lead-Recherche-Workflow produziert strukturierte Leads
- Clay-CSV-Import funktioniert
- Regelbasiertes Lead-Scoring funktioniert mit mindestens 5 konfigurierbaren Regeln
- Qualified-Lead-Handoff an Business funktioniert (via Qualified-Lead-Inbox, sobald Business diese liefert; bis dahin CSV-Export)

## Out of Scope *(dauerhaft)*

### Hart Non-Goal (PLATFORM.md 4b + Gründer-Fixierung 2026-04-16)
- Eigener RAG-Chat-Layer oder Wissens-Plattform über Kundenrohdaten
- Fremdsystem-Konnektoren (Outlook, Gmail, Drive, Sharepoint, Datev, Lexware)
- Eigene Voice-Oberfläche
- Rohdatenverarbeitung (bleibt in Onboarding)
- Deal-Management, Gesprächsdokumentation, Revenue-Tracking im IS (bleibt Business)
- Physische Zustellungs-Tracking (bleibt offline)
- IS als verkaufsfähiger Multi-Kanal-Publisher (kein Publish-Produkt)
- IS als Google-Analytics-Ersatz (nur eigene Kampagnen-Konsolidierung)
- Business V4/V5 als Kampagnen-Designer (Business = reine Lead-Abarbeitung)

### Parked
- Modules/Flows/Build-Drafts (alte FEAT-009) — nach V2/V3-Erfahrung neu bewerten
- Process-Mining-Connector, Branchen-Layer, Anomalie-Flagging — V8+

## Constraints

### Technical
- Hetzner + Supabase + Docker-Compose via Coolify (analog Onboarding-Plattform)
- Next.js 16+ mit App Router, React 19, Tailwind, shadcn/ui
- AWS Bedrock eu-central-1 als einziger LLM (Claude Sonnet/Opus), Provider-Adapter-Pattern verbindlich
- Kein Remote-Git-Repo vorhanden — für V1-Deploy ist GitHub-Repo + Coolify-Setup Teil des Project-Setup-Slices

### Data Residency (verbindlich)
- EU-Hosting, bevorzugt Deutschland
- Keine US-Direktanbieter, keine US-Regionen — auch nicht temporär
- Referenz: `/strategaize-dev-system/.claude/rules/data-residency.md`

### Business-System-Constraint (V1 + V3)
Business V4 hat heute: Kontakte, Unternehmen, Deals, Angebote (teilweise).
Business V4 hat **nicht**: Produkt-/Angebotskatalog, Modul-Zuordnung, Projekt-Status als eigenes Modell, **Qualified-Lead-Inbox als Entität**.

Konsequenzen:
- Ingest-Layer V1 fehlertolerant: was existiert wird ingestet, was fehlt wird leer gelassen
- FEAT-007 Customer Deployment Registry IS-seitig primäre Wahrheit
- **FEAT-014 Qualified Lead Handoff hängt von Business-seitiger Erweiterung ab** — Business muss eine Qualified-Lead-Inbox als eigene Entität bauen. V3 kann bis dahin mit CSV-Export überbrücken.

### Scope-Protection
- Schema V1 template-ready: optionale `template_id`-Felder und Feature-Flags pro Modul
- Multi-Instanz-Aktivierung frühestens V8+
- Brand-Profil in V2 = **eins**, Multi-Brand = V8+

### Architektur-Imperativ (für `/architecture`)
- Schema-Design V1 muss die Objekt-Struktur von V2–V7 zumindest konzeptionell mitbedenken: Content-, Asset-, Brand-, Kampagnen-, Segment-, Lead-, Publish-Event-, Tracking-Event-Tabellen
- Adapter-Pattern als einheitliches Framework: Bedrock (LLM), Clay (Enrichment), LinkedIn (Publishing), E-Mail (Publishing), weitere Kanäle später
- Gemeinsame Worker-Layer-Architektur (analog Onboarding-Worker), nicht pro Modul eigenständig
- `/architecture`-Runde denkt in V1–V7, nicht nur in V1

## Risks / Assumptions

### Risks
- **R-01: Business V4/V4.1 Erweiterungen.** Neue Entitäten werden Ingest-Anpassungen in IS erfordern. Akzeptiert.
- **R-02: Onboarding-Export-Abhängigkeit.** Ingest V1 hängt von Onboarding SLC-010 ab.
- **R-03: Scope-Kreep.** Bei aktiver Ideenfindung könnten V3+-Features in V1/V2 gezogen werden. Mitigation: Non-Goals hart verankert, Versions-Reihenfolge fixiert.
- **R-04: Sensitive Daten in FEAT-007.** Deployment-Registry enthält Server-Referenzen. Nur Metadaten, keine Secrets.
- **R-05: Business-Qualified-Lead-Inbox fehlt.** FEAT-014 braucht Business-seitige Inbox. Ohne diese nur CSV-Export möglich. Business-Roadmap-Abstimmung nötig.
- **R-06: LinkedIn-API-Hürde V4.** Creator-API-App-Review dauert Wochen bis Monate. Mitigation: Früh in `/architecture` evaluieren, ggf. Buffer-/Hootsuite-Zwischen-Ebene als temporäre Brücke.
- **R-07: Attribution-Komplexität V5.** Durchgängige Attribution (Kampagne → Deal) ist bekanntes Hard-Problem. Mitigation: V5 bewusst nur auf Kampagnen-Ebene, Deal-Attribution V8+.
- **R-08: Clay-API-Kosten.** Je nach Integration-Tiefe. Mitigation: V3-Minimum CSV-Import.
- **R-09: Tracking-Rohdaten-Limitierungen.** Plattformen liefern oft nur Aggregate, keine Raw-Events. Akzeptiert — IS konsolidiert was da ist.
- **R-10: Brand-Konsistenz-Qualität V2.** Wenn Brand-Profil zu minimal ist, driftet KI-Output. Mitigation: 3–5 Beispiel-Assets als Pflicht-Feld.

### Assumptions
- Onboarding-Plattform stellt stabile Export-API bereit (SLC-010)
- Business V4 bietet REST-Zugang zu Kontakten, Unternehmen, Deals, Angeboten
- Primärnutzer V1–V3: Gründer + 1–2 Berater
- Deployment erfolgt analog Onboarding: Coolify + Docker-Compose + Supabase + Bedrock-Adapter
- Bedrock-Call-Kosten für Content-Generierung sind akzeptabel (geschätzt 10–50 Calls/Tag)
- LinkedIn + E-Mail sind als erste Publishing-Kanäle ausreichend für V4
- Business bekommt ab V4.x oder V5 eine Qualified-Lead-Inbox-Entität

## Open Questions

*OQ-V2-01..04 wurden am 2026-04-16 entschieden und sind Bestandteil der Architektur-Festlegungen oben.*

### Offen für `/architecture` V2
- **OQ-A1:** Genauer Datenschnitt Business-Ingest V1 (Deal-States, Angebote) — aus V1-Requirements übernommen (war OQ-02)
- **OQ-A2:** Einheitliches GitHub-Repo für IS einrichten — aus V1-Requirements übernommen (war OQ-03)
- **OQ-A3:** Tracking-Event-Schema V5: einheitlich (rigide) vs. hybrid (Core + kanal-spezifisches JSON-Payload)
- **OQ-A4:** Worker-Layer-Architektur: gemeinsam für alle Module oder pro Modul eigenständig (Empfehlung: gemeinsam)
- **OQ-A5:** Clay-Integration-Tiefe V3: CSV-Import-Minimum vs. Webhook + API-Pull
- **OQ-A6:** LinkedIn-Publishing-API-Realität V4: Creator-API-App-Review-Aufwand, ggf. Buffer-/Hootsuite-Zwischen-Ebene
- **OQ-A7:** Multi-Instanz-Architektur: Single-Codebase + Feature-Flags (Empfehlung) vs. Plug-in-Pattern
- **OQ-A8:** E-Mail-Provider-Auswahl V4: Postmark, SES, Custom-SMTP
- **OQ-A9:** Asset-Generierung synchron (in-Request) vs. asynchron via Worker je nach Bedrock-Antwortzeit

### Offen für `/requirements` V3+ (später)
- **OQ-R1:** Knowledge Packaging / SMAO-API — welche Version, welcher Auth-Standard (V8+)
- **OQ-R2:** Custom-Brand-Profile pro Kunde — wann V8+ aktivieren, welche Pricing-Relevanz

### Business-Roadmap-Abhängigkeit
- **OQ-BD1:** Business V4.x/V5: Qualified-Lead-Inbox-Entität als neues Feature einplanen. Ohne diese Business-seitige Erweiterung kann FEAT-014 Qualified Lead Handoff nicht scharf geschaltet werden. Abstimmung mit Business-Roadmap vor V3-Slice-Planning.

## Delivery Mode
**`internal-tool`**

Begründung: V1–V7 werden primär intern genutzt (Gründer + kleines Team). Deployment cloud-fähig (Hetzner + Supabase), aber kein SaaS-Produkt. Template-Modus für externe Kundeneinsätze kommt V8+ — dann kann sich der Delivery Mode auf `client-app` oder `SaaS` erweitern.

## Referenzen
- Gesamtarchitektur: `/strategaize-dev-system/docs/PLATFORM.md`
- Data Residency: `/strategaize-dev-system/.claude/rules/data-residency.md`
- Discovery V1: `/reports/RPT-001.md`
- Discovery V2: `/reports/RPT-003.md`
- Requirements V1: `/reports/RPT-002.md`
- Requirements V2 (diese Runde): `/reports/RPT-004.md`
- Richtungsvorgaben V1: `/docs/discovery-input.md`
- Richtungsvorgaben V2: `/docs/discovery-input-v2.md`
