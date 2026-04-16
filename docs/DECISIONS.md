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
- Status: accepted
- Reason: Gründer-Entscheidung 2026-04-16 zu OQ-V2-02. IS ist Pre-Sales-Schicht, Business = reine Lead-Abarbeitungs-Plattform. Qualifizierte Leads dürfen nicht direkt als Kontakt+Deal in Business landen, weil das die Pipeline verzerrt. Stattdessen: neue Entität `QualifiedLead` im Business als Eingangstopf, Berater entscheidet manuell über Umwandlung in Kontakt/Deal oder Verwerfen. Option "IS behält Leads, Business zieht sie" wurde wegen dauerhafter Laufzeit-Abhängigkeit verworfen.
- Consequence: FEAT-014 Qualified Lead Handoff erzeugt Handoff-Events und pusht sie via API an Business Qualified-Lead-Inbox (sobald vorhanden). **Kritische Abhängigkeit:** Business V4.x/V5 muss Qualified-Lead-Inbox-Entität als neues Feature bauen (ISSUE-001). Bis dahin CSV-Export als Übergangslösung.

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
