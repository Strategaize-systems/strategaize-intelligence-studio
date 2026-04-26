# Decisions

## Hinweis
Alle vorherigen DECs (DEC-001 bis DEC-009 + Tradeoffs) sind durch das Re-Discovery vom 2026-04-15 aufgehoben.
Archiv: `/docs/archive/DECISIONS-v1-original.md` — nur als Referenz, nicht mehr gültig.

Neue DECs werden ab `DEC-001` wieder frisch nummeriert und in `/discovery`, `/requirements` und `/architecture` gesetzt.

## DEC-001 — Re-Discovery auf Basis der aktualisierten Gesamtarchitektur
- Status: accepted
- Reason: Mit der Strategieentscheidung zur Onboarding-Plattform (2026-04-14) und dem Gesamtarchitektur-Dokument (2026-04-15) hat sich die Rolle des Intelligence Studios grundlegend verändert (System 3 statt System 4, Inputs aus konkreten Fremdsystemen statt manueller Insight Inbox, neue Rückfluss-Ziele). Die alte V1-Planung (12 Features, 14 Slices, 77 Micro-Tasks, 17 Tabellen) würde bei Umsetzung Doppelarbeit mit der Onboarding-Verdichtung erzeugen und kollidiert mit der neuen verbindlichen LLM-Provider-Wahl.
- Consequence: Gesamte V1-Planung archiviert. Projekt startet neu bei Discovery. Alte Reports, Features, Slices, DECs, Roadmap, Backlog nur noch als Archiv-Referenz.

## DEC-002 — LLM-Provider ist AWS Bedrock eu-central-1 (Frankfurt)
- Status: accepted
- Reason: Verbindliche Regel aus `/strategaize-dev-system/.claude/rules/data-residency.md`. Beste technische Qualität + DSGVO-belastbar + EU-gehostet. Alle anderen aktiven Systeme (Onboarding, Business, Blueprint) nutzen bereits Bedrock Frankfurt — Intelligence Studio reiht sich ein. Claude Code CLI/Max-Subscription bleibt für Dev-Workflow, nicht für Laufzeit-/Analyse-Pfad. Die API-Kosten pro Analyse sind bewusst akzeptiert gegen den Gewinn aus State-of-the-Art-Qualität und Infrastruktur-Vermeidung.
- Consequence: Alle KI-Aufrufe in IS laufen zur Laufzeit über AWS Bedrock Frankfurt. Kein Ollama, kein lokales LLM, keine direkte Anthropic-API. Provider-Adapter-Pattern ist Pflicht (Austauschbarkeit).

## DEC-003 — Hosting-Region: ausschließlich EU, bevorzugt Deutschland
- Status: accepted
- Reason: Übergreifender StrategAIze-Grundsatz (Data-Residency-Rule). Unternehmenswissen aus Kundenprojekten darf nicht in Drittländer mit unzureichendem Datenschutzniveau übertragen werden. Gilt für LLMs, Speech-APIs, Embeddings, sonstige KI-Dienste. USA-Direktanbieter (OpenAI-API, Anthropic-API, Pinecone-US etc.) sind ausgeschlossen.
- Consequence: Jede neue API-Abhängigkeit wird gegen diese Regel geprüft. Keine Integration ohne nachweisbaren EU-Endpoint + DPA. Audit-Log pro externer Call mit Anbieter/Region/Modell-ID.

## DEC-004 — Campaign-Modell = Parent-Campaign + Channel-Segmente + Varianten
- Status: accepted
- Reason: Gründer-Entscheidung 2026-04-16 zu OQ-V2-01. Multi-Channel-Kampagnen (digital + physisch) werden in einem gemeinsamen Modell mit Parent-Campaign und hierarchischen Channel-Segmenten abgebildet, plus Variant-Ebene für A/B-Testing-Vorbereitung. Alternative "flache Kampagne = ein Kanal" wurde verworfen, weil sie natürlichen Kampagnen-Gedanken bricht und Reporting/Attribution komplex macht. Alternative "komplett flexibler Graph" wurde als Overkill verworfen.
- Consequence: Datenmodell V3 (FEAT-011) hat drei Tabellen: `campaign` → `channel_segment` (n:1) → `campaign_variant` (n:1). Audience-Split pro Channel-Segment muss auf 100% summieren. A/B-Testing operativ nutzbar erst V5 (Tracking nötig). Physische Zustellung bleibt offline, IS bereitet nur vor.

## DEC-005 — Lead-Handoff IS → Business = Qualified-Lead-Inbox im Business
- Status: superseded
- Superseded by: DEC-022 (2026-04-26)
- Reason: Gründer-Entscheidung 2026-04-16 zu OQ-V2-02. IS ist Pre-Sales-Schicht, Business = reine Lead-Abarbeitungs-Plattform. Qualifizierte Leads dürfen nicht direkt als Kontakt+Deal in Business landen, weil das die Pipeline verzerrt. Stattdessen: neue Entität `QualifiedLead` im Business als Eingangstopf, Berater entscheidet manuell über Umwandlung in Kontakt/Deal oder Verwerfen. Option "IS behält Leads, Business zieht sie" wurde wegen dauerhafter Laufzeit-Abhängigkeit verworfen.
- Consequence: FEAT-014 Qualified Lead Handoff erzeugt Handoff-Events und pusht sie via API an Business Qualified-Lead-Inbox (sobald vorhanden). **Kritische Abhängigkeit:** Business V4.x/V5 muss Qualified-Lead-Inbox-Entität als neues Feature bauen (ISSUE-001). Bis dahin CSV-Export als Übergangslösung.
- **Supersession-Hinweis (2026-04-26):** Diese Entscheidung wurde durch DEC-022 abgelöst. Pivot-Begründung: Pipeline-Funktion mit konfigurierbaren Stages existiert im Business System V4+ bereits. Eine separate Qualified-Lead-Inbox-Entität ist redundant — Pipeline-Push in eine bestehende Pipeline „Lead-Generierung" mit Stage „Neu" erfüllt den gleichen Zweck ohne Business-seitige Erweiterung. Damit fällt die Business-Roadmap-Abhängigkeit (ISSUE-001 / BL-016 alt) weg und V1-Marketing-Launcher kann den Handoff direkt scharf schalten.

## DEC-006 — Brand-Profil = Singleton (ein StrategAIze-Eigen), Multi-Brand = V8+
- Status: accepted
- Reason: Gründer-Entscheidung 2026-04-16 zu OQ-V2-03. V2 hat genau ein Brand-Profil (StrategAIze-Eigen) mit strukturierten Feldern (Tonalität, Do's, Don'ts, Struktur-Templates pro Output-Typ, 3–5 Beispiel-Assets als few-shot). Für spätere Kunden-Instanzen gilt "Powered by StrategAIze"-Footer als Default ok. Volles Custom-Brand-Profil pro Kunde erst V8+, wenn echter Marktbedarf und Pricing-Rechtfertigung. Minimale Variante (reiner Freitext) wurde verworfen, weil KI-Output-Konsistenz dann zu niedrig wäre. Vollumfängliches Brand-System (Logo-Regeln, Layoutgrid, Voice-Samples) wurde als Overkill verworfen.
- Consequence: FEAT-008 Brand Profile ist Singleton-Table mit `template_id`-Feld (NULL in V2, für V8+ vorbereitet). Schema template-ready, aber V2 aktiviert keine Multi-Tenant-Logik. 3–5 Beispiel-Assets sind Pflichtfelder.

## DEC-007 — Orchestration & Decision Layer = Hybrid (Priority-Felder + leichtgewichtiges Top-5-Dashboard)
- Status: accepted
- Reason: Gründer-Entscheidung 2026-04-16 zu OQ-V2-04. V7 Orchestration ist eine Meta-Schicht. Option "eigenes Strategic Cockpit" mit KI-Ranking wurde zurückgestellt — wäre ohne ausreichend gefüllte Module darunter leer. Option "nur Priority-Felder in bestehenden Listen" wäre zu dünn, weil keine cross-Entity-Sicht. Hybrid: Priorisierung lebt primär in Listen (Priority-Feld + Sortierbarkeit), plus zusätzlich ein leichtgewichtiges Dashboard „Was ist wichtig?" mit Top-5 pro Entity-Typ (Opportunity, Kampagne, Experiment). KI-Auto-Priorisierung = V8+.
- Consequence: FEAT V7 Orchestration bleibt überschaubar bauarbeitsmäßig. Manuelle Flags + Sortierung in V7, KI-Scoring über alle Entity-Typen hinweg erst V8+. Learning-Rückflüsse an Onboarding (Fragenkataloge) und Business (Argumente) werden in V7 mitkonzipiert.

## DEC-008 — Worker-Layer = gemeinsamer Node.js-Container mit Job-Type-Dispatching
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-16 zu OQ-A4. Ein zentraler Worker-Container verarbeitet alle Job-Types (Ingest-Polling, KI-Bewertung, Asset-Generierung, Lead-Scoring-Recalc, später Publish-Scheduling, Tracking-Sync). Alternative "pro Modul eigener Worker" wurde verworfen wegen Overhead, doppelter Queue-Mechanik und uneinheitlichem Cost-Logging. Onboarding-Muster (`ai_jobs`-Queue mit `SKIP LOCKED`) wird 1:1 übernommen — gleiche Mechanik, gleiche Ops-Erfahrung.
- Consequence: Ein `worker`-Container im Docker-Compose-Netz. `ai_jobs`-Tabelle als zentrale Queue. Job-Types via `job_type`-Enum. Ein `jobDispatcher.ts` mit Switch-Case ruft Handler-Module pro Type. V1–V3 einreichend, V4+ bei Bedarf auf BullMQ/Redis umstellbar. Polling-Intervall via `AI_WORKER_POLL_MS` ENV.

## DEC-009 — Provider-Adapter-Pattern für alle externen Systeme verbindlich
- Status: accepted
- Reason: Data-Residency-Regel + Austauschbarkeit. Jede externe Abhängigkeit (Bedrock, Clay, Business-API, Onboarding-API, LinkedIn, Postmark/SES, Tracking-Kanäle) wird über ein Adapter-Objekt angesprochen. Kein direkter SDK-Aufruf in Business-Logik oder Server-Action. Regionswahl, Audit-Logging, Cost-Tracking und DPA-Prüfung bleiben damit zentral änderbar.
- Consequence: `/src/adapters/` Verzeichnis mit `bedrockAdapter`, `onboardingAdapter`, `businessAdapter`, `clayAdapter` (V3+), `linkedinAdapter` (V4+), `emailAdapter` (V4+), `trackingAdapters/*` (V5+). Alle Adapter schreiben nach `ai_cost_ledger` (bei kostenrelevanten Calls) und `audit_log`. Region-ENV-Variablen sind Pflicht (`BEDROCK_REGION`, `POSTMARK_REGION`, etc.).

## DEC-010 — Multi-Instanz-Architektur = Single-Codebase + Feature-Flags + template_id-Felder
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-16 zu OQ-A7. Template-Modus für externe Kunden kommt frühestens V8+. Bis dahin läuft eine Instanz (StrategAIze-intern). Plug-in-Architektur wurde als Overkill verworfen — verdoppelt Testaufwand und Build-Komplexität ohne V1-V7-Nutzen.
- Consequence: Alle Haupt-Tabellen bekommen `template_id UUID NULL` ab MIG-001 (V1). Feature-Flags in `.env` steuern Modul-Aktivierung (z. B. `FEATURE_CAMPAIGN_ENABLED=false` in V1–V2, `FEATURE_PUBLISHING_ENABLED=false` in V1–V3). Schema bleibt damit migrationsarm bei V8+-Aktivierung. V8+-Slice muss nur Feature-Flags umlegen und Multi-Tenant-Policies erweitern.

## DEC-011 — Asset-Generierung V2 = asynchron via Worker (kein synchroner Bedrock-Call)
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-16 zu OQ-A9. Bedrock-Antwortzeiten für längere Assets (Blogpost, One-Pager, Case Card) liegen oft bei 20–60s. Synchroner Call in Server Action würde Next.js-Edge-Timeout reißen oder UX-Stau erzeugen. Asynchron via Worker (wie KI-Bewertung in FEAT-005) ist konsistent mit Onboarding-Muster und gibt Kostenkontrolle + Retry-Logik out-of-the-box.
- Consequence: Asset-Request-Submit erzeugt `ai_jobs`-Eintrag (Type `asset_generation`). UI zeigt „Wird generiert…" mit Polling oder Realtime-Abo auf `asset_request.status`. Worker schreibt `asset_version.markdown_content` + `ai_cost_ledger`. Keine separate Sync-Code-Pfad.

## DEC-012 — Clay-Integration V3 = CSV-Import-Minimum, API/Webhook V5+
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-16 zu OQ-A5. V3-Ziel ist schneller Launch mit funktionierendem Lead-Research-Flow. Tiefere Clay-Integration (Webhook, API-Pull, Enrichment-on-Demand) bringt zusätzliche API-Kosten, DPA-Prüfung (Clay US vs. EU), und Retry-Komplexität. In V3 reicht manueller CSV-Export aus Clay + IS-Import. V5+ wenn Tracking-Rohdaten ohnehin Adapter-Ökosystem etablieren.
- Consequence: FEAT-012 liefert `clayAdapter.importCsv()` mit Duplikat-Detection (Company-Name + Domain). Kein Webhook-Endpoint in V3. API-Pull kommt frühestens V5 mit Tracking-Adaptern.

## DEC-013 — E-Mail-Provider V4 = Postmark EU primär, AWS SES Frankfurt als Alternative
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-16 zu OQ-A8. Postmark hat EU-Region mit explizitem DPA, bessere Transactional-Reputation und sauberes API. AWS SES Frankfurt ist kostengünstiger, aber bei Reputationsproblemen härter zu recoveren. Für Kampagnen-Mails ist Postmark-primär die sicherere Wahl. SES als Fallback bei Postmark-Ausfall oder Volume-Grenzen.
- Consequence: `emailAdapter` unterstützt beide Provider via Config-Switch `EMAIL_PROVIDER=postmark|ses`. V4-Feature-Spec spezifiziert Opt-out-Handling (DSGVO), Template-Versionierung, Bounce/Complaint-Verarbeitung. Keine Custom-SMTP-Relay-Option.

## DEC-014 — LinkedIn-Publishing V4 = Creator-API primär, Buffer/Hootsuite als Fallback-Brücke
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-16 zu OQ-A6. LinkedIn Creator-API ist der saubere Weg, hat aber einen App-Review-Prozess von mehreren Wochen. Ohne Fallback droht V4-Launch-Verzögerung. Buffer/Hootsuite als Zwischen-Ebene erlaubt schnelleren V4-Launch mit akzeptabler Qualität. Realitätscheck (App-Review-Dauer, Permissions, Rate-Limits) passiert vor V4-Slice-Planning.
- Consequence: `linkedinAdapter` mit zwei Modi (`direct_api` | `buffer_bridge`). V4-Feature-Spec prüft, ob App-Review rechtzeitig zum V4-Launch durchläuft — falls nicht, Buffer-Modus aktiv bis Direct-API verfügbar. Beide Modi teilen `publish_event`-Schema. ISSUE für App-Review-Tracking wird bei V4-Start angelegt.

## DEC-015 — Tracking-Event-Schema V5 = Hybrid (Core-Fields + kanalspezifisches JSON-Payload)
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-16 zu OQ-A3. Rein einheitliches Schema wäre zu rigide — Kanal-APIs liefern unterschiedliche Event-Typen und Metadaten. Rein Kanal-spezifisches Schema verhindert konsolidiertes Reporting. Hybrid: Core-Felder (event_type, timestamp, campaign_variant_id, asset_id, lead_id) sind kanalübergreifend typisiert; kanalspezifische Felder (LinkedIn: impression_count, reactions; E-Mail: open, click-Throughs) landen in `payload JSONB`. Views/Reports aggregieren über Core-Felder, Detail-Drilldown nutzt `payload`.
- Consequence: `tracking_event`-Tabelle in V5-Schema hat beide Struktur-Ebenen. Attribution-Kette via Core-FKs. Report-Queries primär gegen Core-Felder. Adapter-Pro-Kanal transformiert Raw-API-Response in Hybrid-Struktur.

## DEC-016 — Business-Ingest V1 = Kontakt + Unternehmen + Deal (active/won), Angebote V2+
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-16 zu OQ-A1. V1-Ziel ist Portfolio-Monitor + Insight-Layer-Datenquelle. Deal-States `active` + `won` reichen für Kundenportfolio-Sicht (Kunde vs. laufendes Projekt). Angebote/Offers sind strukturell komplex in Business V4 und liefern in V1 keinen unmittelbaren Mehrwert für Opportunity-Bewertung — verschoben auf V2 oder on-demand-Pull.
- Consequence: `businessAdapter.pullDelta()` filtert `deal.status IN ('active', 'won')`. `business_deal_cache` trägt nur diese Rows. Angebot-Cache in V1 nicht gebaut. V2 ergänzt, falls Content-Produktion Angebotsdaten als Context braucht.

## DEC-017 — Design-System = StrategAIze Style Guide V2 verbindlich ab Tag 1
- Status: accepted
- Reason: Gründer-Entscheidung 2026-04-16. Style Guide V2 (Version 2.0, April 2026, Production Ready) ist bereits ausgearbeitet und für interne CRM-Tools gedacht. Jede UI-Arbeit ab der ersten Seite folgt dem Guide — kein späterer Frontend-Rewrite, keine UI-Experimente außerhalb des Systems. Alle 5 Layout-Templates (Dashboard, Mein Tag, Beziehungen, Pipeline, Aufgaben), Voice+KI-Pattern, Modal-System und Farbpalette sind verbindlich. Style Guide-Änderungen passieren im Dev-System und werden in IS synchronisiert.
- Consequence: Style-Guide-Datei wird physisch ins IS-Repo kopiert (`/docs/STYLE_GUIDE_V2.md`), nicht symlinked — damit Repo standalone kompilierbar bleibt. SLC-002 „Design-System-Grundstock" baut alle Komponenten (Header, KPICard, FilterBar, VoiceButton, AIButton, StatusBadge, ContentCard, DeutschlandKarte, Modal-System, Form-Komponenten) unter `/src/components/design-system/`. Layout-Templates unter `/src/components/layouts/`. Tailwind-Theme mit Brand-Farben in `tailwind.config.ts`. Alle Features ab FEAT-003 nutzen ausschließlich Style-Guide-Komponenten.

## DEC-018 — Repository-Setup = GitHub Repo unter Org Strategaize-systems, Coolify-Auto-Deploy deaktiviert
- Status: accepted
- Reason: Gründer-Entscheidung 2026-04-16 zu OQ-A2. Lokal-only Commits sind Risiko (Backup, Kollaboration, Coolify-Sync). GitHub-Repo `Strategaize-systems/strategaize-intelligence-studio` wurde in dieser Architektur-Session angelegt. Auto-Deploy ist per feedback-Memory `feedback_manual_deploy` aus — Gründer deployt immer manuell über Coolify-UI, damit ungewollte Pushes nicht live gehen.
- Consequence: Remote `origin = https://github.com/Strategaize-systems/strategaize-intelligence-studio.git` gesetzt, alle 6 Commits gepusht (e8feadc → 47e5547). Branch `master` ist Default-Branch. Coolify-Repo-Wire-Up als Teil von SLC-001 Project-Setup (Coolify-Resource einrichten, aber Auto-Deploy-Toggle aus). Deploy manuell via Coolify-UI bei jeder Version.

## DEC-019 — URL-Strategie für Self-hosted Stack: Internal vs. External explizit getrennt
- Status: accepted
- Reason: Self-hosted Docker-Compose-Stack mit Supabase + Kong + App + Worker braucht saubere Trennung zwischen interner Container-Kommunikation und externer Browser-Kommunikation. Hairpin-NAT über Public-URLs ist unzuverlässig und erzeugt Kong-/Auth-Routing-Probleme. Konsistent mit Onboarding-Plattform-Muster.
- Consequence: `SUPABASE_URL=http://supabase-kong:8000` (intern, Server/Worker), `NEXT_PUBLIC_SUPABASE_URL=https://is-api.strategaizetransition.com` (extern, Browser). App-Host `https://is.strategaizetransition.com`. Kong-Key-Auth für externe PostgREST-Routes. Alle ENV-Variablen dokumentiert in `.env.example` mit Kommentar "internal" oder "external". Server-Side-Auth bevorzugt gegenüber Client-Side-Auth (vermeidet CORS/Proxy-Komplexität).

## DEC-020 — Marketing Launcher als funktional eigenständiges V1-Produkt im Single-Repo + template_id-Vorbereitung
- Status: accepted
- Reason: Strategischer Pivot 2026-04-25. V1 wird auf Marketing Launcher (Closed Loop Lite) umgestellt — das ursprüngliche V1 (Wissensverdichtungs-Backbone) wandert auf V6. Begründung: Ohne Marketing Launcher keine Interessenten → ohne Interessenten keine Kunden → ohne Kunden keine Customer-Cases → ohne Customer-Cases ist die Wissensverdichtung leerer Speicher. Marketing Launcher V1 ist der Lead-Generator für StrategAIze selbst, nicht für externe Kunden. Architektonische Implikation: V1 läuft funktional eigenständig (ohne IS-Wissensplattform-Anbau), aber im selben Single-Repo + mit aktiver template_id-Foundation (DEC-010 bleibt) — Multi-Tenant ist später ohne Refactoring aktivierbar. Verkaufs-Verpackung als separate Coolify-Deployments pro Kunde-Instanz, gleiche Codebase. Kombi-Paket Marketing Launcher + Business System nur wenn echter Kunde anfragt.
- Consequence: V1-Migration (MIG-001 Schema-Baseline) bekommt zusätzliche Tabellen für Marketing-Launcher-Scope (`brand_profile`, `asset`, `asset_version`, `asset_performance`, `lead`, `research_run`, `pitch`, `pitch_version`, `handoff_event`, erweiterte `icp` + `segment`, `campaign` LITE mit n:m-Verknüpfungstabellen). Alle neuen Tabellen erhalten `template_id UUID NULL`-Feld konsistent zu DEC-010. Feature-Flags via ENV: `FEATURE_MARKETING_LAUNCHER_ENABLED=true` (V1 default), `FEATURE_KNOWLEDGE_BACKBONE_ENABLED=false` (V6+), `FEATURE_PUBLISHING_ENABLED=false` (V2 E-Mail / V4 LinkedIn). V1 ist ohne V6-Backbone vollständig funktional. PRD V1-Sektion umgeschrieben am 2026-04-26 (RPT-008).

## DEC-021 — Spec-Foundation V1 = coreyhaines31/marketingskills (MIT) als reference/-Folder, gitignored
- Status: accepted
- Reason: Strategieentscheidung 2026-04-25 nach Evaluation der Corey-Haines-Marketing-Skills-Library (MIT-Lizenz, 47 Skills). Die Library bietet ein 12-Sektionen-product-marketing-context-Schema (FEAT-008-Foundation), 7 Output-Schemas mit Skill-Quellbezug (FEAT-009: copywriting / social-content / sales-enablement / cold-email / page-cro / site-architecture / weiteres), 4-Level-Personalization-Framework (FEAT-016: cold-email-Skill) und marketing-psychology-Booster — deutlich reicher als selbst entworfene Spec, MIT-frei nutzbar, sofort verfügbar. Verwendung als **Spec-Quelle**, nicht als Runtime-Bestandteil — die Skills laufen nicht im IS-Worker, sondern dienen als Vorlage für Datenmodell und Bedrock-Prompt-Vorlagen. Skills im Business-System bleiben unverändert (eigener CLI-Use-Case, separate Codepfade). Git-Strategie: Repo nach `reference/corey-haines-marketing-skills/` geklont, gitignored (nicht im IS-Repo committed) — relevante Spec-Auszüge werden schrittweise in `docs/spec-references/` extrahiert während `/architecture V1` (Snapshot-Strategie). Setup-Anweisung in `reference/SETUP.md` (committed). Begründung Snapshot statt Submodule: Submodule erhöht Setup-Komplexität und Ambiguität bei Updates; Snapshot in `docs/spec-references/` macht die genutzten Specs explizit und stabil unabhängig vom Quell-Repo.
- Consequence: `.gitignore` enthält `reference/*` mit Whitelist `!reference/SETUP.md`. `reference/corey-haines-marketing-skills/` muss nach Repo-Clone manuell geklont werden (siehe SETUP.md). Spec-Extraktionen in `docs/spec-references/` entstehen während `/architecture V1` und werden committed (Audit-Trail für Prompt-Inhalte). Bei Upstream-Updates am Quell-Repo gilt: ADR (DEC) anlegen für Foundation-Version-Bump + Migration-Pfad falls JSONB-Schema betroffen.

## DEC-022 — Lead-Handoff V1 = Pipeline-Push in bestehende Business-Pipeline (löst DEC-005 ab)
- Status: accepted
- Supersedes: DEC-005
- Reason: Strategischer Pivot 2026-04-25. Im Business System V4+ existiert bereits eine Pipeline-Funktion mit konfigurierbaren Stages. Eine separate Qualified-Lead-Inbox-Entität (DEC-005) ist redundant — Pipeline-Push in eine bestehende Pipeline „Lead-Generierung" mit Stage „Neu" erfüllt den gleichen Zweck ohne Business-seitige Feature-Erweiterung. Damit fällt die Business-Roadmap-Abhängigkeit (alte ISSUE-001 / BL-016) weg und V1-Marketing-Launcher kann den Handoff direkt scharfschalten. Auth via Internal-API-Token (gleiche Hetzner-Coolify-Umgebung, kein externes Auth-Theater). Status-Sync zurück via Webhook (Empfehlung) oder Cron-Pull (V1-pragmatisch).
- Consequence: FEAT-014 wurde umgeschrieben (RPT-008, 2026-04-26): Pipeline-Push statt Qualified-Lead-Inbox-Push. Adapter `businessPipelineAdapter` ersetzt geplanten Qualified-Lead-Inbox-Adapter. Konfiguration via ENV: `BUSINESS_API_BASE_URL`, `BUSINESS_API_TOKEN`, `BUSINESS_PIPELINE_NAME` (default „Lead-Generierung"), `BUSINESS_STAGE_NAME` (default „Neu"). Idempotency-Key (Lead-ID + Campaign-ID). Pre-Implementation-Verifikation (BL-026): API-Endpoint im Business System für externe Deal-Erstellung ist vor SLC-108 zu verifizieren (Risk R-02 + OQ-V1-03 in PRD). DEC-005 ist auf `superseded` gesetzt — Übergangs-CSV-Export-Mechanismus aus DEC-005 entfällt, da Pipeline direkt verfügbar ist.

## DEC-023 — Brand-Profile-Datenmodell V1 = JSONB-Singleton statt 12-Tabellen-Spread
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-26 zu OQ-A1 aus PRD V1. Brand-Profile (FEAT-008) ist ein Singleton-Objekt mit 12 Sektionen, das immer komplett gelesen wird (pro Bedrock-Call als System-Kontext). 12 separate Tabellen mit Joins fuer ein Singleton waeren ueberkomplex und erschwerten Sektion-Erweiterungen (jede neue Sektion braeuchte Migration). JSONB-Singleton mit definiertem Schema (siehe `docs/spec-references/brand-profile-12-sections.md`) eliminiert diese Komplexitaet. Nachteil "JSONB-Filter-Performance" entfaellt, weil Brand-Profile niemals nach Inhalt gefiltert wird — immer Singleton-Read.
- Consequence: Tabelle `brand_profile` mit Spalte `data JSONB NOT NULL`, JSON-Schema-Validierung in App-Layer (Zod), Versions-Snapshot-Mechanik via `version (int)`-Spalte + komplettes JSONB-Snapshot in `brand_profile_changelog`. Sektion-Erweiterung in V2+ erfolgt ohne Migration (nur Zod-Schema-Update + ggf. UI-Update). Singleton-Constraint via Partial-Unique-Index `WHERE is_active=true`. Multi-Brand V9+ deaktiviert den Partial-Index und nutzt `template_id` als zusaetzliche Unique-Komponente.

## DEC-024 — Asset.source_skill und Asset.output_type = PostgreSQL-Enum
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-26 zu OQ-A2 aus PRD V1. Free-Text mit App-Layer-Validierung waere fragiler — DB-Constraint via Enum garantiert Konsistenz und macht Filter-Queries einfacher. PostgreSQL erlaubt Enum-Erweiterung via `ALTER TYPE ADD VALUE` ohne Down-Time, daher Future-Proof fuer V2+ neue Output-Typen.
- Consequence: Zwei Enums in MIG-002 angelegt:
  - `asset_output_type_enum`: `blogpost | linkedin_post | onepager | email_template | case_card | landingpage_briefing | website_spec` (7 V1-Werte)
  - `asset_source_skill_enum`: `copywriting | social_content | sales_enablement_onepager | sales_enablement_casecard | cold_email | copywriting_landingpage | site_architecture` (7 V1-Werte, 1:1-Mapping zum output_type)
  Erweiterungen V2+ (z.B. `ad_creative` in V4, `video_script` in V9+) via Enum-Add-Value. Komplette Mapping-Tabelle siehe `docs/spec-references/output-type-skill-mapping.md`.

## DEC-025 — Pitch als separate Tabelle, nicht Asset-Subtype
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-26 zu OQ-A3 aus PRD V1. Pitch (FEAT-016) und Asset (FEAT-009) teilen Aehnlichkeiten (Markdown-Content, Versionierung, Bedrock-generiert), unterscheiden sich aber in:
  - **Pitch hat `lead_id`-FK** (Asset hat polymorphe Quell-Objekt-Referenz)
  - **Pitch traegt 4-Level-Personalization-Snapshot** (`personalization_level_used`, `psychology_boosters_used`, `framework_used`)
  - **Pitch-UX im Lead-Detail-Tab**, Asset-UX in Asset-Bibliothek (unterschiedliche Layout-Templates)
  - Asset-Subtype mit nullable Lead-FK + nullable 4-Level-Felder waere schwammiges Modell — Konstrastraints und Validierungen wuerden case-by-case komplex.
- Consequence: Separate Tabelle `pitch` + `pitch_version` mit eigenen Status-/Versions-Mechaniken. Cross-Referenz `pitch.linked_asset_id (FK NULL)` fuer Use-Case "Pitch in Asset-Bibliothek uebernehmen" — UI bietet Action, DB schreibt einen FEAT-009-Asset und setzt `pitch.linked_asset_id`. Few-shot-Loop kombiniert beide Quellen: `asset_performance` JOIN `asset` (fuer FEAT-009-Output-Typen) UND eine zukuenftige `pitch_performance` (V2+ wenn Pitch-Versand mit Tracking via E-Mail-Adapter).

## DEC-026 — Performance-Capture als eigene `asset_performance`-Tabelle, NICHT JSONB-Spalte
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-26 zu OQ-A4 aus PRD V1. JSONB-Spalte an `asset` waere einfacher, hat aber 3 Probleme:
  - **1:n-Faelle bestehen** — ein Asset kann mehrfach gepostet werden (LinkedIn-Personal + LinkedIn-Company + Newsletter). JSONB-Spalte koennte das nur als Array abbilden, was Reporting-Queries komplex macht.
  - **Reporting-Queries** wie "Top-2-Performer pro Output-Typ" (Few-shot-Loop, DEC-027) sind mit dedizierter Tabelle als SQL-JOIN trivial, mit JSONB-Spalte umstaendlich (`jsonb_array_elements`).
  - **Aggregation auf Campaign-Ebene** ueber `campaign_asset` JOIN `asset_performance` ist sauberer.
- Consequence: Tabelle `asset_performance` mit FK auf `asset`, 1:n erlaubt. Indizes auf `(asset_id, posted_at)` und Partial-Index `(leads_generated DESC) WHERE leads_generated > 0` fuer Few-shot-Top-N-Query. Performance-Aggregation-Views (`view_campaign_performance`, `view_output_type_performance`) als On-the-fly-Queries (V1-Volumen klein). Materialized Views ab V5 wenn Tracking-Voll und Volumen waechst.

## DEC-027 — Few-shot-Performance-Loop = Top-N=2 nach leads_generated/cost_eur-Ratio pro output_type
- Status: accepted
- Reason: Architektur-Entscheidung 2026-04-26 zu OQ-A5 aus PRD V1. Mechanik muss einfach genug fuer V1-Implementation sein, aber gut genug um den Closed-Loop-Differentiator zu liefern.
  - Top-N=2 als Default (1 zu wenig fuer Pattern-Erkennung durch Bedrock, 5+ blaeht Prompt zu sehr auf — Cost-Effizienz bei N=2 optimal).
  - Sortierung nach `leads_generated / GREATEST(cost_eur, 1)` Ratio: Reflektiert Cost-per-Lead (kleiner = besser, daher invertiert: leads_per_eur, groesser = besser).
  - GREATEST mit 1 verhindert Division-by-Zero bei Organic-Posts (cost_eur=0).
  - Klassifikation Top/Mid/Low (V1 einfach): Top = obere 25% per Ratio, Mid = mittlere 50%, Low = untere 25%. V1 nutzt nur "Top" (= Top-2). V5 Auto-Variant kann Top/Low-Kontrast nutzen.
- Consequence: ENV `PERFORMANCE_FEWSHOT_N` (default 2) — anpassbar pro Deployment. Few-shot-Loader-Modul `src/prompts/asset/shared/few-shot-loader.ts` mit Query (siehe FEAT-014-Spec-Architektur-Hinweise). Few-shot-Snapshot wird in `asset_version.metadata.fewshot_used` (Asset-IDs + Markdown-Snippet-Hashes) gespeichert — Audit-Trail welche Beispiele in welcher Generation als Inspiration dienten. Bei `asset_performance.leads_generated = 0 OR NULL` keine Few-shot-Mitgabe (kalter Start ohne historische Daten).

## DEC-028 — Firecrawl-Hosting V1 = Self-Hosted auf Hetzner, kein Cloud-Service
- Status: accepted
- Reason: Pre-Implementation-Verifikation (BL-025, durchgefuehrt 2026-04-26 in `/architecture V1`-Lauf): Firecrawl-Cloud-Service ist explizit US-gehostet ("Firecrawl's servers are located in the United States and this is where your data and information will be stored"). Das verletzt DEC-002 (LLM-Provider eu-central-1) und DEC-003 (EU-only Hosting) und data-residency.md-Regel — auch wenn Firecrawl GDPR-konform agiert, der Datenfluss erfolgt in US-Region. Firecrawl ist Open Source und unterstuetzt Self-Hosting explizit ("ideal for enterprises with data residency requirements"). Daher: Self-Host als V1-Default, kein Cloud-Adapter.
- Consequence: `firecrawlAdapter` zeigt auf Self-Hosted-Endpoint (ENV `FIRECRAWL_API_BASE_URL`, default `http://firecrawl-internal:3002` als Compose-internal-Service oder dedizierter Hetzner-Server). BL-028 als Pre-Implementation-Aufgabe vor SLC-105: Firecrawl-Self-Host-Setup (Compose-Container oder eigener Server, Auth-Token konfigurieren, Smoke-Test). Cost-Modell aendert sich: Self-Host ist Server-Fixkosten statt Pay-as-you-go — bei V1-Volumen-Estimate 200-500 Crawls/Monat akzeptabler Trade-off. `ai_cost_ledger` traegt `cost_usd=0`, `notes='self_hosted'` ein. Cost-Soft-Limit `RESEARCH_RUN_COST_CAP_EUR` (default 5) bleibt fuer Crawl-Volumen-Steuerung (Anzahl-Pages × Estimate-EUR-pro-Page-Crawl). Audit-Pfad bleibt: jede Adapter-Call schreibt `audit_log`-Eintrag mit Endpoint, Zeitstempel, Request-ID. Bei Bedarf Re-Evaluation in V3 (Voll-Lead-Research-Sprint), falls Firecrawl-EU-Cloud verfuegbar wuerde.

## DEC-029 — Pipeline-Push-Bridge V1 = Business-System Coordination-Sprint vor V1-Release
- Status: accepted
- Reason: Pre-Implementation-Verifikation (BL-026, durchgefuehrt 2026-04-26 in `/architecture V1`-Lauf): Business-System V4+ hat **keinen** POST-Endpoint fuer externe Deal-Erstellung. Es existiert nur `GET /api/export/deals` (READ-only, Auth via `EXPORT_API_KEY`). Das war nicht in den Annahmen von DEC-022 dokumentiert — DEC-022 ging davon aus, dass die Pipeline-Funktion API-fertig ist. Sie ist es nicht. Optionen evaluiert:
  - **a) V1-IS launcht ohne Pipeline-Push (Manual-Mode-only):** Marketing-Launcher-Schleife unvollstaendig — V1-Acceptance-Criterion "mind. 1 erfolgreicher Pipeline-Push" nicht erreichbar.
  - **b) Direct-DB-Write IS → Business-DB:** Bricht Bounded-Context, verletzt System-Trennung, kein Audit-Pfad. Verworfen.
  - **c) Coordination-Sprint im Business-System:** Business-System bekommt einen kleinen Slice fuer `POST /api/internal/deals` mit `INTERNAL_API_TOKEN`-Auth. Parallel zu V1-IS-Implementation. **Gewaehlt.**
- Consequence:
  - **BL-027** (NEU) im Backlog: "Business-System Coordination-Sprint — POST `/api/internal/deals` Endpoint + INTERNAL_API_TOKEN-Auth". Im Business-System-Repo eigener Slice/Feature, parallel zu V1-IS.
  - **V1-IS Feature-Flag `BUSINESS_PIPELINE_PUSH_ENABLED`** (default `false` initial). Adapter `businessPipelineAdapter` wird vollstaendig implementiert in SLC-108, aber per Flag deaktiviert bis BL-027 abgeschlossen. Im Manual-Mode setzt UI `mechanism=manual`, User markiert manuell als "im Business-Pipeline angelegt", Idempotency-Key wird trotzdem geschrieben (`UNIQUE (lead_id, campaign_id)`).
  - **V1-Final-Check / Go-Live-Bedingung:** BL-027 abgeschlossen, Smoke-Test erfolgreich, Feature-Flag auf `true`. Bis dahin V1 darf nicht Released sein.
  - **Status-Sync zurueck**: Cron-Pull (V1-pragmatisch) ueber bestehenden `GET /api/export/deals?pipeline=Lead-Generierung`-Endpoint. Webhook (V2) als optionale Erweiterung wenn Volumen wachst.
