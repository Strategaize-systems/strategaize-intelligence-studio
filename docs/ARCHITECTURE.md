# Architecture

## Status
Version: 2.0 (Architecture V2). Entstanden 2026-04-16 nach Requirements V2 (RPT-004). Ersetzt den Platzhalter-Zustand aus der Re-Discovery-Phase.

Umfang: V1 detailliert, V2–V3 konzeptionell mit schema-ready Feldern, V4–V7 grobe Richtung (Adapter-Framework, Event-Modell, Orchestrierung). Alle Architektur-Festlegungen sind als DECs in `/docs/DECISIONS.md` dokumentiert.

Vorherige V1-Architektur: `/docs/archive/ARCHITECTURE-v1-original.md` — nicht mehr gültig.

---

## 1. Architecture Summary

StrategAIze Intelligence Studio ist eine Next.js-basierte Webanwendung mit drei Hauptlaufzeiten (Next.js-App, separater Node-Worker, Supabase-Postgres + Auth + Storage), betrieben als Docker-Compose-Stack über Coolify auf Hetzner. Alle LLM- und Enrichment-Aufrufe laufen über einen einheitlichen **Provider-Adapter-Layer** (Bedrock Frankfurt für LLM, Clay für Enrichment, Business V4 und Onboarding V1 als Shadow-Ingest, ab V4 LinkedIn + E-Mail-Provider für Publishing, ab V5 Tracking-Adapter). Alle asynchronen Hintergrundarbeiten (Ingest-Polling, KI-Job-Verarbeitung, Asset-Generierung, Lead-Scoring-Recalc, später Publish-Scheduling) laufen über eine zentrale `ai_jobs`-Queue im gemeinsamen Node-Worker (DB-Polling mit `SKIP LOCKED`, Muster aus Onboarding übernommen).

Die Frontend-Architektur basiert verbindlich auf **StrategAIze Style Guide V2** — ein Design-System mit 5 Layout-Templates, Voice+KI-Pattern, Modal-System und Farbpalette wird ab der allerersten UI (FEAT-003 Portfolio-Monitor) durchgehend angewendet. Kein späterer Frontend-Rewrite, keine UI-Experimente außerhalb des Design-Systems.

Datenbank-Schema ist **template-ready**: Alle Haupt-Tabellen tragen `template_id`-Feld (NULL in V1–V7), Multi-Instanz-Aktivierung erst V8+. Schema V1 definiert 17 Tabellen; V2 ergänzt Brand + Content, V3 fügt ICP/Segment/Campaign/Lead/Scoring/Handoff hinzu, V4 ergänzt Publishing-Events, V5 Tracking-Events, V6 Experiments, V7 Priorities. Alle Foreign-Key-Beziehungen zwischen Versionen sind in Schema V1 konzeptionell mitbedacht.

---

## 2. System Context

### Position im StrategAIze-Stack

```
┌───────────────────────┐   Fluss 1: KUs (pull)       ┌───────────────────────┐
│ Onboarding-Plattform  │ ──────────────────────────▶ │                       │
│ (System 1)            │                              │                       │
└───────────────────────┘   Fluss 4: Fragenkataloge   │                       │
                                                       │ Intelligence Studio   │
┌───────────────────────┐   Fluss 3: Signale (pull)  │ (System 3 — THIS REPO)│
│ Business Development  │ ──────────────────────────▶ │                       │
│ System (System 2)     │                              │                       │
│                       │ ◀───────────────────────────│                       │
└───────────────────────┘   Fluss 5: Argumente        │                       │
          ▲                 Fluss 5b: Qualified Leads  │                       │
          │                 Fluss 8: Content/Assets    │                       │
          │                                            └──────────┬────────────┘
          │                                                       │
          │                                                       ▼
          │   Fluss 9: Publish     ┌─────────────────────────────────────────┐
          │ ◀──────────────────── │ Publishing-Adapter                      │
          │                       │ (LinkedIn, E-Mail, ...) — ab V4         │
          │                       └─────────────────────────────────────────┘
          │                                                       │
          │                                                       ▼
          │   Fluss 10: Tracking   ┌─────────────────────────────────────────┐
          │ ◀──────────────────── │ Tracking-Adapter                        │
          │                       │ (LinkedIn Analytics, E-Mail-Events, ...) │
          │                       └─────────────────────────────────────────┘
          │
          │   Fluss 6: Enrichment  ┌─────────────────────────────────────────┐
          │ ──────────────────────▶│ Clay (extern)                           │
          │                       └─────────────────────────────────────────┘
```

Referenz: PLATFORM.md Abschnitt 11 + discovery-input-v2.md Abschnitt 7.

### System-Rolle IS

- **Input:** Knowledge Units aus Onboarding, Kontakte/Unternehmen/Deals aus Business, später Tracking-Rohdaten aus Kanälen.
- **Verarbeitung:** Analyse, Opportunity-Bewertung, Content-Erzeugung, Kampagnen-Design, Lead-Recherche, Scoring, Priorisierung.
- **Output:** Qualifizierte Leads an Business (Fluss 5b), Content-/Argumente-Pakete an Business (Fluss 5/8), Fragenkataloge/Templates an Onboarding (Fluss 4), Publishing an externe Kanäle (Fluss 9).
- **Non-Goals:** Kein Deal-Management, keine Voice-Oberfläche, keine Fremdsystem-Konnektoren (Outlook, Gmail, Drive), keine eigene RAG-Chat-Plattform. IS endet nach der Verdichtung.

---

## 3. Main Components

### 3.1 Next.js Application Container (`app`)
- **Laufzeit:** Next.js 16+ mit App Router, React 19, Server Components + Server Actions als Haupt-Interaktionsmuster.
- **Verantwortung:** Alle UI-Seiten, serverseitige Authentifizierung/Authorisierung, Supabase-Server-Aufrufe, kurzlebige Server-Actions (CRUD, Filter, Export). **Keine** Bedrock-Long-Running-Calls in Request-Handlern.
- **Datenzugriff:** Supabase-JS mit Service-Role-Key (Server-Side) und Anon-Key mit RLS (Client-Side, nur für nicht-sensitive Read-Operations).
- **Rollen:** Auth via Supabase GoTrue, drei kanonische Rollen analog Onboarding: `strategaize_admin`, `tenant_admin`, `tenant_member`.
- **Port:** 3000 intern, `https://is.strategaizetransition.com` (oder vergleichbar) extern.

### 3.2 Worker Container (`worker`)
- **Laufzeit:** Dedizierter Node.js-Prozess, kein HTTP-Port, rein Queue-gesteuert.
- **Verantwortung:** Alle asynchronen Long-Running-Jobs — Ingest-Polling (10 min-Cron für Onboarding, stündlich für Business), KI-Jobs (Opportunity-Bewertung, Asset-Generierung, Lead-Scoring-Recalc), ab V4 Publish-Scheduling, ab V5 Tracking-Pull.
- **Queue-Mechanik:** DB-Polling auf `ai_jobs`-Tabelle mit PostgreSQL `SKIP LOCKED` + RPC-Claim (Muster aus Onboarding 1:1 übernommen). Poll-Intervall via `AI_WORKER_POLL_MS` (default 2000 ms).
- **Job-Dispatching:** Ein Worker, viele Job-Types (`opportunity_scoring`, `asset_generation`, `lead_scoring_recalc`, `ingest_onboarding`, `ingest_business`, später `publish_scheduling`, `tracking_sync`). Dispatcher ruft pro Job-Type einen Handler auf.
- **Skalierung V1–V3:** Ein Worker-Container reicht. V4+ optional mehrere Worker oder BullMQ/Redis, wenn Publish-Queue oder Tracking-Sync-Last es erfordert.

### 3.3 Supabase Stack (8 Container)
- **db:** PostgreSQL 15, Haupt-Datenbank mit allen Tabellen + RLS-Policies.
- **kong:** API-Gateway mit Key-Auth für PostgREST-Endpoints.
- **auth (GoTrue):** Session-Management, Cookie-basierte Auth.
- **rest (PostgREST):** REST-Interface auf DB, hauptsächlich für Edge-Cases verwendet; Primär-Zugriff ist Supabase-JS im Next.js-Server.
- **realtime:** Aktuell nicht zwingend genutzt, reserviert für spätere Live-Updates (z. B. Portfolio-Monitor-Refresh).
- **storage:** Für Asset-Export-Dateien und CSV-Imports.
- **studio + meta:** Admin-UI lokal/Dev.

### 3.4 Provider-Adapter-Layer (in `app` + `worker`)
Alle externen Systeme werden über Adapter-Objekte angesprochen. Kein direktes SDK in Business-Logik.

| Adapter | Version aktiv | Zweck |
|---|---|---|
| `bedrockAdapter` | V1+ | Claude Sonnet/Opus Aufrufe, Cost-Logging, Retry/Timeout |
| `onboardingAdapter` | V1+ | Pull-basierter KU-Import aus Onboarding SLC-010 API |
| `businessAdapter` | V1+ | Pull-basierter Import + Handoff-Push an Business |
| `clayAdapter` | V3+ | CSV-Import V3, Webhook/API V5+ |
| `linkedinAdapter` | V4+ | Publishing (Creator-API primär, Buffer-Fallback) |
| `emailAdapter` | V4+ | Postmark EU primär, SES Frankfurt Alternative |
| `trackingAdapters/*` | V5+ | Pro Kanal ein Adapter für Rohdaten-Pull |

Regeln: Region-Config über ENV, Audit-Log pro externem Call (Provider, Region, Modell, Zeitstempel, Request-ID), Cost-Logging wo Kosten pro Call entstehen (Bedrock, Clay, E-Mail-Provider).

### 3.5 Design-System-Layer (Frontend-Component-Library)
Siehe Abschnitt 7 "Frontend Architecture & Design System". Ist als eigener Architektur-Pfeiler behandelt, nicht als Implementierungsdetail.

---

## 4. Responsibilities per Component

### Next.js App
- Alle UI-Seiten basierend auf Style Guide V2 Layouts (siehe Abschnitt 7).
- Server Actions für CRUD, Export, Filter — direkt gegen Supabase via Service-Role.
- Kurze Bedrock-Calls sind **nicht** in Server Actions erlaubt (Timeout-Risiko). Stattdessen: Server Action erzeugt `ai_jobs`-Eintrag → Worker verarbeitet asynchron → UI pollt Status oder abonniert Realtime-Update.
- Auth-Guard in jedem Request-Pfad, RLS als Defense-in-Depth.

### Worker
- Ein zentraler `jobDispatcher.ts` mit Switch-Case über Job-Type.
- Pro Job-Type ein Handler-Modul (`handlers/opportunityScoring.ts`, `handlers/assetGeneration.ts`, ...).
- Cron-Jobs als spezielle `ai_jobs`-Einträge, die pg_cron oder externer Cron-Trigger (Coolify Cron-Job via HTTP-Trigger) einfügt. Lokal: Coolify-Cron ruft Next.js-Route `/api/cron/:jobType` auf, die nur einen `ai_jobs`-Eintrag erzeugt. Muster aus Business V4 / Onboarding.

### Supabase
- `db`: Schema-Owner, RLS aktiv auf allen Geschäftstabellen.
- `kong`: Key-Auth für extern erreichbare Endpoints.
- `auth`: Session + JWT. Cookie-Strategy: HttpOnly, SameSite=Lax, Secure.
- `storage`: Export-Dateien und CSV-Uploads in private Buckets.

### Design-System-Layer
- Zentrale Component-Library unter `/src/components/design-system/` — alle Seiten nutzen ausschließlich diese Komponenten.
- Layout-Templates unter `/src/components/layouts/` (Layout1Dashboard, Layout2MeinTag, Layout3Beziehungen, Layout4Pipeline, Layout5Aufgaben).
- Design-Tokens als Tailwind-Theme-Extension in `tailwind.config.ts`.

---

## 5. Data Model

### 5.1 V1 Schema (detailliert — MIG-001)

Siehe `/docs/MIGRATIONS.md` MIG-001 für vollständige Spalten-Definitionen. Hier die Tabellen-Struktur mit Zweck:

**Ingest & Portfolio (FEAT-001, FEAT-002, FEAT-003, FEAT-007)**
- `customer` — Kern-Entität für alle Kundenprojekte (Name, Branche, Kontakt-Snapshot). Primärschlüssel für Portfolio-Monitor. Kombination aus Business-Import + manueller Pflege.
- `business_contact_cache` — Shadow-Kopie aus Business V4 (stündlicher Pull).
- `business_company_cache` — Shadow-Kopie aus Business V4.
- `business_deal_cache` — Nur `active` + `won` Deals (OQ-A1 Entscheidung, DEC-016).
- `ingest_run` — Metadaten pro Ingest-Lauf (run_id, source, timestamp, status, cursor, count).
- `ingest_error_log` — Fehlertolerante Feld-Miss-Logs (entity_type, field_name, run_id).
- `deployment` — Customer Deployment Registry (customer_id FK, deployment_type enum, hoster, host_identifier, access_method, active_modules JSONB, code_version, config_notes).
- `deployment_version_history` — Audit für deployment-Updates.

**Knowledge Units (FEAT-001, FEAT-004, FEAT-006)**
- `knowledge_unit` — IS-eigene KU-Cache aus Onboarding-Pull, + Zusatz-Felder für Insight-Layer (tags werden separat, Cluster separat). Felder: `id`, `tenant_id`, `source_session_id`, `source_tenant`, `unit_type`, `body`, `confidence`, `validation_status`, `ingested_at`, `is_shareable` (FEAT-006), `shared_text`, `shared_at`, `template_id`.
- `ku_tag` — Freie Tags (ku_id FK, tag_name, created_by).
- `ku_cluster` — Manuelles Clustering (id, tenant_id, cluster_name, description).
- `ku_cluster_member` — n:m zwischen KU und Cluster.
- `learning_visibility` — Audit für Cross-Kunden-Freigabe.

**Opportunity & Decision (FEAT-005)**
- `opportunity` — Opportunity-Kern (id, tenant_id, title, description, category, status, created_by, created_at).
- `opportunity_dimension_value` — 4 Pflicht + 7 optionale Bewertungs-Dimensionen, per Opportunity eine Zeile pro Dimension, Score 1–5 + Text, optional `ai_reference` für LLM-Zitat.
- `decision` — Status-Wechsel mit Begründung.
- `decision_log` — Audit-Trail.

**Infrastructure (projektweit)**
- `ai_jobs` — Zentrale Job-Queue (id, job_type, payload JSONB, status enum [queued/claimed/processing/done/failed], claimed_by, claimed_at, started_at, finished_at, attempts, last_error).
- `ai_cost_ledger` — Cost-Tracking (tenant_id, provider, model, tokens_in, tokens_out, cost_usd, duration_ms, job_id FK nullable, created_at).
- `audit_log` — Generic Audit-Trail (actor_id, action, entity_type, entity_id, payload JSONB, created_at).

**V1 Summe:** 17 Tabellen.

### 5.2 V2 Schema-Erweiterung (Brand + Content)

V2 fügt 5 Tabellen hinzu:
- `brand_profile` — Singleton-Entität (DEC-006), is_active, voice_text, audience_voice, tonality_rules JSONB, dos/donts JSONB, templates JSONB, `template_id`.
- `brand_profile_example` — 3–5 Pflicht-Examples pro Output-Typ.
- `brand_profile_changelog` — Audit.
- `asset_request` — Request-Workflow (source_type enum, source_id, output_type, briefing_note, status).
- `asset` + `asset_version` — Asset-Bibliothek mit Versionierung.

Verknüpfungen: `asset_request.source_id` kann auf `opportunity.id`, `knowledge_unit.id`, später `pattern.id`, `campaign.id`, `experiment.id` zeigen — polymorphe Referenz über `source_type`.

### 5.3 V3 Schema-Erweiterung (Campaign + Lead)

V3 fügt ca. 12 Tabellen hinzu:
- `icp`, `segment`, `segment_membership` (FEAT-010)
- `campaign`, `channel_segment`, `campaign_variant` (FEAT-011, DEC-004)
- `lead`, `research_task`, `research_task_leads` (FEAT-012)
- `scoring_rule`, `lead_score`, `lead_score_history`, `threshold_config` (FEAT-013)
- `handoff_event`, `handoff_export_log` (FEAT-014)

Kritische Foreign-Key-Beziehung V2↔V3: `campaign_variant.asset_id` → `asset.id`. Muss in V2-Schema-Design vorbereitet sein.

### 5.4 V4–V7 Schema-Konzept (nicht in MIG-001, aber mitbedacht)

- **V4 Publishing:** `publish_event` (campaign_variant_id FK, channel, scheduled_at, published_at, status, external_post_id, error_log), `publishing_credentials` (channel, tenant_id, encrypted_token, rotation_at).
- **V5 Tracking:** `tracking_event` (hybrid-Schema pro DEC-015: Core-Felder + `payload JSONB`) mit Attribution-Kette `campaign_variant_id → asset_id → (optional) lead_id`. Pull-Mechanik pro Kanal-Adapter.
- **V6 Experiments:** `experiment` (hypothesis, kill_criteria JSONB, budget, time_window), Verknüpfung zu Opportunity + ggf. Campaign.
- **V7 Priorities:** `priority_flag` (entity_type, entity_id, priority_value int, sort_override), generisches Priorisierungs-Overlay auf Opportunity/Campaign/Experiment.

### 5.5 RLS-Modell (alle Versionen)

- **Alle Tabellen** mit RLS aktiv.
- **Helper-Funktionen:** `auth.user_tenant_id()`, `auth.user_role()` als SECURITY DEFINER.
- **Policy-Muster:**
  - `{table}_admin_full` — `strategaize_admin` darf alles (Cross-Tenant).
  - `{table}_tenant_read` — `tenant_admin` + `tenant_member` lesen eigene Tenant-Daten.
  - `{table}_tenant_admin_write` — nur `tenant_admin` schreibt eigene Tenant-Daten.
- **Sonderregeln:**
  - `knowledge_unit` bei `is_shareable=true`: Cross-Tenant-Lesbarkeit mit Tenant-Masking (nur Admin sieht Source-Tenant).
  - `brand_profile`: ausschließlich `strategaize_admin` (Singleton für StrategAIze-Eigen, V2).
  - `ai_jobs`: nur Worker-Service-Role + `strategaize_admin`.

### 5.6 Template-Readiness (V8+-Vorbereitung)

- Alle Haupt-Tabellen bekommen `template_id UUID NULL` ab V1.
- Brand-Profile-Schema ist bereits Multi-Instanz-fähig (DEC-006), aber V2 erlaubt nur einen Eintrag via DB-Constraint.
- Feature-Flags in `.env` (z. B. `FEATURE_CAMPAIGN_ENABLED=false` in V1–V2) steuern, welche Module aktiv sind.
- Multi-Instanz-Aktivierung frühestens V8+ (DEC-010).

---

## 6. Data Flow / Request Flow

### 6.1 Ingest-Fluss (Onboarding → IS)

```
Coolify Cron (10min) ─▶ POST /api/cron/ingest-onboarding
                          │
                          └─▶ ai_jobs INSERT {job_type: 'ingest_onboarding'}
                                    │
                                    ▼
Worker Poll ─▶ claim job ─▶ onboardingAdapter.pullDelta()
                                    │
                                    ▼
                             Onboarding SLC-010 API (GET /api/export/ku?since=CURSOR)
                                    │
                                    ▼
                             UPSERT in knowledge_unit
                                    │
                                    ▼
                             UPDATE ingest_run (cursor, count, status)
```

Fehlerbehandlung: Bei Netz-/API-Fehler → Exponential-Retry in `ai_jobs.attempts`. Bei Datenfehler → `ingest_error_log` + Job als `done` markieren (nicht fail), damit nächster Pull läuft.

### 6.2 KI-Bewertung (Opportunity → Bedrock)

```
User klickt "KI-Bewertung anfordern" im Opportunity-Detail
     │
     ▼
Server Action ─▶ ai_jobs INSERT {job_type: 'opportunity_scoring', payload: {opportunity_id}}
     │
     ▼
UI zeigt "Bewertung läuft…" + pollt ai_jobs oder abonniert Realtime
     │
     ▼
Worker claim ─▶ bedrockAdapter.scoreOpportunity(opp_data, dimensions, brand_context)
     │
     ▼
UPSERT opportunity_dimension_value (ai_score, ai_reference)
UPDATE ai_cost_ledger (tokens, cost_usd)
UPDATE ai_jobs SET status='done', result=payload
     │
     ▼
UI refresh zeigt KI-Vorschläge neben manuellen Scores
```

### 6.3 Asset-Generierung (V2)

Analog 6.2, aber Job-Type `asset_generation`. Worker zieht `brand_profile` als System-Kontext, generiert `asset_version.markdown_content`. Synchrone Variante (< 30s) existiert nicht — immer asynchron (DEC-011).

### 6.4 Lead-Handoff (V3, Fluss 5b)

```
Lead-Scoring-Recalc ─▶ lead_score.current_score ≥ threshold
                          │
                          ▼
                    Trigger: ai_jobs INSERT {job_type: 'qualify_lead', lead_id}
                          │
                          ▼
                    Worker:
                      - businessAdapter.pushQualifiedLead(lead_payload)
                      - falls Business-Inbox verfügbar: API-Push
                      - falls nicht: handoff_export_log erzeugen + CSV-Export
                          │
                          ▼
                    INSERT handoff_event (mechanism, status)
                    UI zeigt Handoff-Status in Lead-Detail
```

Abhängig von Business V4.x/V5 Qualified-Lead-Inbox-Entität (ISSUE-001).

---

## 7. Frontend Architecture & Design System

**Verbindlich ab Tag 1 — kein späterer Rewrite.**

### 7.1 Quelle
StrategAIze Style Guide V2 (Version 2.0, April 2026, Production Ready) lebt **physisch im IS-Repo** unter `/docs/STYLE_GUIDE_V2.md` (Kopie aus `strategaize-dev-system/STRATEGAIZE_STYLE_GUIDE_V2.md`, per DEC-017 verbindlich). Änderungen am Style Guide passieren im Dev-System und werden in IS synchronisiert.

### 7.2 Design-Tokens (Tailwind-Theme-Extension)

Die Style-Guide-Farben werden als Tailwind-Theme-Tokens abgebildet. In `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      'brand-primary-dark': '#120774',
      'brand-primary': '#4454b8',
      'brand-success-dark': '#00a84f',
      'brand-success': '#4dcb8b',
      'brand-warning': '#f2b705',
      'brand-warning-light': '#ffd54f',
    },
    borderRadius: { 'xl': '12px', 'lg': '8px' },
    maxWidth: { 'content': '1800px' },
  },
}
```

Zusätzlich `/src/lib/design-tokens.ts` mit exportierten TS-Konstanten für Gradients und Status-Styles.

### 7.3 Komponenten-Bibliothek

Feste Verzeichnisstruktur ab FEAT-003 (erste UI):

```
/src/components/design-system/
├── Header.tsx              — Sticky-Header mit Backdrop-Blur (Style Guide Sektion 1)
├── KPICard.tsx             — 4-Spalten-Grid-Karte mit Gradient + Icon (Sektion 2)
├── FilterBar.tsx           — Suche + Voice + KI + Dropdown + Action-Button (Sektion 3)
├── VoiceButton.tsx         — Standard-Voice-Button (konsistent überall)
├── AIButton.tsx            — Standard-KI-Button (konsistent überall)
├── StatusBadge.tsx         — Status-Badges (Sektion 4)
├── ContentCard.tsx         — Grid/List-Karte mit Hover-Effects (Sektion 5)
├── DeutschlandKarte.tsx    — Wiederverwendbare Karten-Komponente (Sektion 6)
├── Modal.tsx               — Modal-System (Sektion Modal)
├── FormField.tsx           — Label + Error + Hint Wrapper
├── TextInput.tsx           — Standard-Input
├── Select.tsx              — Standard-Select
├── TextArea.tsx            — Standard-TextArea
├── Button.tsx              — Primary / Secondary / Danger Variants
└── index.ts                — Barrel-Export

/src/components/layouts/
├── Layout1Dashboard.tsx    — KPIs + 2-Spalten (8+4) — für Home/Dashboard
├── Layout2MeinTag.tsx      — Timeline + Sidebar — für „Mein Tag"-ähnliche Views
├── Layout3Beziehungen.tsx  — Grid/List + Deutschland-Karte — für FEAT-003 Portfolio, FEAT-004 Insight, FEAT-009 Asset-Library
├── Layout4Pipeline.tsx     — Kanban — für FEAT-005 Decision-Board, FEAT-011 Campaign-Status
└── Layout5Aufgaben.tsx     — Liste mit Checkboxen — für ToDos/Actions
```

### 7.4 Layout-Zuordnung IS V1–V3

| Feature | Page | Layout |
|---|---|---|
| FEAT-003 Portfolio-Monitor | `/customers` | Layout 3 (Grid + Deutschland-Karte) |
| FEAT-004 Insight-Layer | `/insights` | Layout 3 (List-Variante, statt Karte → Filter-Sidebar) |
| FEAT-005 Opportunity-Board | `/opportunities` | Layout 4 (Kanban über Status) |
| FEAT-005 Opportunity-Detail | `/opportunities/[id]` | Custom (Modal-ähnliches Detail + Dimension-Bewertung) |
| FEAT-006 Cross-Kunden-Learnings | `/learnings` | Layout 3 (List-Variante) |
| FEAT-007 Deployment Registry | `/deployments` | Layout 3 (List-Variante, keine Karte) |
| FEAT-008 Brand Profile (V2) | `/settings/brand` | Custom (Form-heavy, Modal-Pattern + FormSection) |
| FEAT-009 Asset Library (V2) | `/assets` | Layout 3 (Grid mit Asset-Preview statt Karte) |
| FEAT-010 ICP & Segment (V3) | `/icp`, `/segments` | Layout 3 (List-Variante) |
| FEAT-011 Campaign-Management (V3) | `/campaigns` | Layout 4 (Kanban über Status) |
| FEAT-011 Campaign-Detail | `/campaigns/[id]` | Custom (hierarchisch: Parent → Channel-Segmente → Variants) |
| FEAT-012 Lead-Research (V3) | `/leads`, `/research` | Layout 3 (List-Variante) |
| FEAT-013 Lead-Scoring-Config (V3) | `/settings/scoring` | Custom (Regel-Editor) |
| FEAT-014 Handoff-Log (V3) | `/handoffs` | Layout 5 (Liste mit Status) |
| V7 Top-5-Dashboard | `/dashboard` | Layout 1 (KPIs + 2-Spalten) |

### 7.5 Voice- und KI-Pattern

Style Guide V2 fordert Voice + KI Buttons in **jeder** Filter-Leiste. Für IS V1–V3 gilt:

- **Komponenten existieren ab V1** (VoiceButton, AIButton in FilterBar).
- **Funktional leer in V1:** Buttons sind sichtbar, aber Click → Toast „Voice/KI-Suche kommt mit V5". Keine Platzhalter-Logik hinter den Kulissen — konsistent mit Feedback-Memory (keine API-Kosten ohne Nutzen).
- **V5+:** KI-Button ruft Bedrock-basierte Natürlich-Sprache-Query auf (z. B. „zeige mir alle Mittelstandskunden mit offenen Opportunities"). Voice-Button nutzt Azure Speech EU (DSGVO-konform, DEC-002).

### 7.6 Modal-System

- Alle „Neu erstellen" / „Bearbeiten" Flows nutzen das Modal-System aus Style Guide V2 Abschnitt „Modal/Popup".
- Icon-Farben pro Entity-Typ (Opportunity blau, Asset grün, Campaign orange) als Konstanten in `/src/lib/design-tokens.ts`.
- Keine Ad-hoc-Dialogs — Alles über das zentrale Modal.

### 7.7 Entwicklungs-Regel

Bei jeder neuen Page/Komponente:
1. Zuerst: Style-Guide V2 prüfen, passendes Layout identifizieren.
2. Dann: Existierende Komponenten aus `/src/components/design-system/` nutzen.
3. Erst bei echtem Custom-Bedarf: Neue Komponente bauen + in `/src/components/design-system/` ergänzen (nicht pro Page-Ordner).
4. Keine neuen Farben, Border-Radii, Shadow-Klassen außerhalb Style Guide.

DEC-017 dokumentiert die Verbindlichkeit.

---

## 8. External Dependencies / Integrations

| Dependency | Version | Zweck | Adapter | Region | DSGVO |
|---|---|---|---|---|---|
| AWS Bedrock | V1+ | LLM (Claude Sonnet/Opus) | `bedrockAdapter` | eu-central-1 (Frankfurt) | ✅ DEC-002 |
| Supabase (self-hosted) | V1+ | DB, Auth, Storage | Supabase-JS | Hetzner EU | ✅ |
| Onboarding-Plattform API | V1+ | KU-Pull (SLC-010) | `onboardingAdapter` | Hetzner EU | ✅ |
| Business V4 REST-API | V1+ | Kontakte/Unternehmen/Deal-Pull, Handoff-Push | `businessAdapter` | Hetzner EU | ✅ |
| Clay | V3+ | Lead-Enrichment (CSV-Import V3, API V5+) | `clayAdapter` | extern (Clay) | ⚠ zu prüfen pro DPA |
| LinkedIn API | V4+ | Publishing (Creator-API, Fallback Buffer) | `linkedinAdapter` | extern | ⚠ zu prüfen DPA, OQ-A6 |
| Postmark | V4+ | E-Mail-Versand (primär, EU-Region) | `emailAdapter` | EU | ✅ DEC-013 |
| AWS SES | V4+ | E-Mail-Versand (Fallback) | `emailAdapter` | eu-central-1 | ✅ |
| Azure Speech (EU) | V5+ | Voice-Transkription (optional) | `speechAdapter` | EU (DSGVO) | ✅ |

**Nicht zulässig:** OpenAI-API direkt, Anthropic-API direkt, AWS Bedrock US-Regionen, Pinecone-US, alles ohne EU-DPA (data-residency.md).

---

## 9. Security / Privacy Considerations

### 9.1 Datenhaltung
- Alle Business-/Onboarding-Daten bleiben EU-gehostet (Hetzner Falkenstein/Nürnberg).
- Kein Export sensibler Kundendaten in externe Systeme ohne DPA.
- Passwörter/Tokens werden **nie** in `deployment.access_method` gespeichert — nur Passwort-Manager-Referenzen (String-Label).

### 9.2 Auth & RBAC
- Supabase GoTrue für User-Auth (E-Mail + Magic-Link minimal V1, OAuth optional V2+).
- Drei Rollen: `strategaize_admin`, `tenant_admin`, `tenant_member`. Rollenzuweisung via `auth.users.user_metadata.role`.
- RLS auf allen Tabellen. Defense-in-Depth, keine App-Layer-only-Filterung als Sicherheit.

### 9.3 Secrets
- `.env` niemals in Git. `.env.example` als Template mit allen benötigten Variablen.
- Runtime-Secrets in Coolify verwaltet (Bedrock-Keys, Clay-Keys, E-Mail-Provider-Keys).
- Worker-only-Secrets (Service-Role-Key, AWS-Keys) **nie** in `NEXT_PUBLIC_*`-Variablen.

### 9.4 Audit-Log
- `audit_log` bei jeder Status-Änderung von Opportunity/Decision/Campaign/Handoff.
- `ai_cost_ledger` bei jedem externen KI-Call (Provider, Region, Modell, Kosten, Dauer).
- `ingest_run` + `ingest_error_log` als Ingest-Audit.

### 9.5 Sensitive Daten in Features
- **FEAT-006 Cross-Kunden-Learnings:** Tenant-Masking bei Cross-Tenant-Read. Nur `strategaize_admin` sieht Source-Tenant, alle anderen nur `shared_text`. Freigabe ist explizit pro KU (`is_shareable`-Flag, manuelle Anonymisierung durch Operator).
- **FEAT-007 Deployment Registry:** Nur Metadaten, keine Secrets. Zugriffskontrolle: `strategaize_admin` + `tenant_admin`. `tenant_member` liest nur öffentliche Teile.
- **FEAT-014 Handoff:** DSGVO-Lead-Datenfluss. Handoff-Payload muss dokumentiert sein, welche Felder zu Business fließen (für Compliance-Doku).

### 9.6 Kong API-Gateway
- Kong mit Key-Auth für alle externen PostgREST-Endpoints.
- Kong-Config braucht explizite ENV-Substitution (Kong 2.x, `${VAR}` wird NICHT auto-resolved — siehe dev-system-Regel).

### 9.7 URL-Strategie (Self-hosted Stack)
- **Internal URLs (Container-to-Container):** `SUPABASE_URL=http://supabase-kong:8000`, `NEXT_PUBLIC_SUPABASE_URL` ist extern (Browser-Side).
- **External URLs (Browser):** `https://is.strategaizetransition.com` (App), `https://is-api.strategaizetransition.com` (Kong).
- Split zwischen `SUPABASE_URL` (intern, Server/Worker) und `NEXT_PUBLIC_SUPABASE_URL` (extern, Browser) ist verbindlich.

---

## 10. Constraints and Tradeoffs

### 10.1 Harte Constraints

- **Hosting:** Hetzner + Coolify + Supabase + Docker Compose. Kein Vercel, kein Supabase Cloud. Analog Onboarding-Plattform.
- **LLM:** Ausschließlich AWS Bedrock eu-central-1 zur Laufzeit. Claude Code CLI nur für Dev-Workflow.
- **Frontend:** Next.js 16+ App Router, React 19, Tailwind, shadcn/ui als Basis. Style Guide V2 verbindlich.
- **Data Residency:** EU-only. Kein US-Fallback, auch nicht „nur temporär".

### 10.2 Bewusste Tradeoffs

- **Worker statt direktem Request-Handler für KI-Calls:** Mehr Komplexität (UI muss pollen), aber kein Timeout-Risiko, bessere Kostenkontrolle, einheitliches Audit-Log. Gewählt.
- **Template-ready ab V1, Multi-Instanz erst V8+:** Schema trägt `template_id`-Felder ohne Nutzen in V1–V7. Geringer Overhead, aber spart massiven Refactor später. Gewählt.
- **V1 Ein-Worker-Container ohne Redis/BullMQ:** Einfach, reicht für V1–V3-Last. V4+ eventuell umbauen. Gewählt.
- **Clay V3 nur CSV-Import:** Schneller V3-Launch, weniger Clay-API-Kosten. Nachteil: manueller Schritt. Gewählt (DEC-012).
- **LinkedIn V4 Creator-API primär, Buffer als Fallback:** Riskant (App-Review-Aufwand), aber direkte API hat beste Qualität. Buffer als Brücke. Gewählt (DEC-014).

### 10.3 Nicht-Verhandelbares

- Keine direkten Bedrock-Calls außerhalb `bedrockAdapter`.
- Keine UI-Komponente außerhalb Style-Guide-Bibliothek.
- Keine Cross-Tenant-Reads ohne explizites Anonymisierungs-Flag.
- Keine Secrets in `NEXT_PUBLIC_*`.
- Keine direkten Provider-SDKs in Business-Logik.

---

## 11. Open Technical Questions

### 11.1 Geklärt in dieser Architektur-Runde (als DECs dokumentiert)

| OQ | Entscheidung | DEC |
|---|---|---|
| OQ-A1 | Business-Ingest V1 = Kontakt + Unternehmen + Deal (active/won), Angebote V2+ | DEC-016 |
| OQ-A3 | Tracking-Event-Schema V5 = Hybrid (Core + JSON-Payload) | DEC-015 |
| OQ-A4 | Worker-Layer = gemeinsamer Container mit Job-Type-Dispatching | DEC-008 |
| OQ-A5 | Clay-Integration V3 = CSV-Import-Minimum, API V5+ | DEC-012 |
| OQ-A7 | Multi-Instanz = Single-Codebase + Feature-Flags + `template_id` | DEC-010 |
| OQ-A8 | E-Mail-Provider V4 = Postmark EU primär, SES Frankfurt Alternative | DEC-013 |
| OQ-A9 | Asset-Generierung V2 = asynchron via Worker | DEC-011 |
| Style-Guide | Style Guide V2 verbindlich als Design-System-Pfeiler | DEC-017 |
| Adapter-Pattern | Alle externen Systeme über Adapter-Layer | DEC-009 |
| Repo-Setup | GitHub Public Repo, Coolify-Auto-Deploy **aus** (manueller Deploy) | DEC-018 |

### 11.2 Offen (für spätere Runden)

- **OQ-A2 Repo-Setup:** In dieser Session zu erledigen (GitHub-Repo anlegen). Als Architektur-Aufgabe abgeschlossen, Umsetzung siehe Abschnitt 13.
- **OQ-A6 LinkedIn-API-Realitätscheck:** Vor V4-Slice-Planning. Creator-API-App-Review-Prozess, erforderliche Permissions, Rate-Limits. Falls App-Review > 4 Wochen, Buffer als primär umstellen.
- **OQ-BD1 Business-Qualified-Lead-Inbox-Entität:** Vor V3-Slice-Planning Business-Roadmap-Abstimmung. Auth-Modell (mTLS vs. API-Token), Payload-JSON, Webhook vs. Poll-Status-Sync. Bis dahin CSV-Export.
- **OQ-R1 SMAO-API:** V8+-Frage, nicht in dieser Runde.
- **OQ-R2 Custom-Brand-Profile:** V8+-Frage.

### 11.3 Architektur-Risiken (bewusst akzeptiert)

- **R-01 Business V4/V4.1-Erweiterungen:** Ingest-Adapter muss fehlertolerant bleiben. Akzeptiert.
- **R-02 Onboarding-Export-Abhängigkeit:** Ingest V1 hängt von SLC-010. Akzeptiert, Status-Sync via `ingest_run`.
- **R-05 Business-Qualified-Lead-Inbox fehlt:** ISSUE-001, OQ-BD1. CSV-Fallback implementiert.
- **R-06 LinkedIn-API-Hürde V4:** OQ-A6, Buffer-Fallback als Brücke.
- **R-08 Clay-API-Kosten:** CSV-Minimum V3, API V5+ mit expliziter Kostenbeobachtung.

---

## 12. Recommended Implementation Direction

### 12.1 Gesamt-Umsetzungsreihenfolge

1. **BL-001 Project Setup & Foundation** — erster Slice. Next.js 16 init, Supabase-Stack via Coolify, Basis-Schema mit `template_id`-Feldern, Auth-RBAC, `bedrockAdapter`-Skeleton, **Design-System-Komponenten aus Style Guide V2 als Grundstock** (Header, FilterBar, VoiceButton, AIButton, StatusBadge, Modal, Layout 3 als erste Template-Instanziierung), GitHub-Repo-Setup + Coolify-Deploy.
2. **V1-Kern (FEAT-001..005):** Ingest + Portfolio + Insight + Opportunity. KI-Bewertung via Worker.
3. **V1-Rand (FEAT-006 + FEAT-007):** Cross-Kunden + Deployment-Registry.
4. **V1 Gesamt-QA + Final-Check + Deploy.**
5. **V2 (FEAT-008 Brand + FEAT-009 Content):** Nach V1-Stable. Neuer Worker-Handler `asset_generation`.
6. **V2 Gesamt-QA + Deploy.**
7. **Business-Roadmap-Abstimmung OQ-BD1** vor V3-Slice-Planning.
8. **V3 (FEAT-010..014):** ICP/Segment/Campaign/Lead/Scoring/Handoff. Clay-CSV-Adapter. Handoff mit Fallback CSV.
9. **V3 Gesamt-QA + Deploy.**
10. **V4–V7:** Jeweils eigene Requirements-Runde + Architecture-Refresh (inkrementell auf dieser ARCHITECTURE.md aufbauend).

### 12.2 Nächster Schritt

**`/slice-planning`** für V1 + Design-System-Grundstock.

Slice-Vorschlag (zur Bestätigung im `/slice-planning`):

| SLC | Inhalt | Umfang |
|---|---|---|
| SLC-001 | Project Setup + Supabase-Schema V1 + Auth-RBAC + Bedrock-Adapter-Skeleton + GitHub-Repo + Coolify-Deploy | Groß (Foundation) |
| SLC-002 | Design-System-Grundstock: alle Komponenten aus Style Guide V2, Tailwind-Theme, Layouts 1+3+4+5 | Mittel |
| SLC-003 | FEAT-001 Ingest-Onboarding (Worker-Handler + Cron + UI-Status-Seite) | Mittel |
| SLC-004 | FEAT-002 Ingest-Business (Worker-Handler + fehlertolerant + Cron) | Klein |
| SLC-005 | FEAT-007 Customer Deployment Registry (CRUD-UI + customer-Entity) | Mittel |
| SLC-006 | FEAT-003 Portfolio-Monitor (UI-Aggregation auf Layout 3) | Mittel |
| SLC-007 | FEAT-004 Insight-Layer (KU-Liste + Tags + Cluster) | Mittel |
| SLC-008 | FEAT-005 Opportunity & Decision (Layout 4 Kanban + 4+7-Dimensions-Bewertung + KI-Call) | Groß |
| SLC-009 | FEAT-006 Cross-Kunden-Learnings (Freigabe-Flow + Cross-Tenant-View) | Klein |
| SLC-010 | V1 Gesamt-QA + Polish | Mittel |

Detail-Schnitt, Micro-Tasks, Priorisierung und TDD-Policy passieren in `/slice-planning`.

### 12.3 TDD-Policy für Internal Tool

- **Empfohlen, nicht hart verpflichtend** (Delivery Mode `internal-tool`).
- Pflicht-TDD für:
  - `bedrockAdapter` (Cost-Logging-Korrektheit, Error-Handling)
  - `scoring_rule`-Evaluator (FEAT-013, regelbasierte Scoring-Logik)
  - RLS-Policies (SAVEPOINT-Tests gegen echte DB, Muster aus dev-system `coolify-test-setup`)
  - Ingest-Fehlertoleranz (FEAT-002 mit fehlenden Feldern)
- Lightweight-Tests (Snapshot, Smoke) für UI-Komponenten.

### 12.4 Deployment-Pfad

- Entwicklung: lokal Docker Compose + Dev-Supabase.
- Staging: `is-staging.strategaizetransition.com` via Coolify.
- Production: `is.strategaizetransition.com` via Coolify.
- **Auto-Deploy aus** (DEC-018, feedback_manual_deploy Memory). Gründer deployt manuell über Coolify-UI.

---

## 13. Pending Execution Items (aus dieser Runde)

### 13.1 Sofort

- **GitHub-Repo anlegen:** `rbellaerts/strategaize-intelligence-studio` (Public). Alle 6 lokalen Commits (e8feadc, ac48bb5, d7db7ae, af2ee24, b9aa11a, + Architecture-Commit) pushen. Coolify-Wire-Up als Teil von SLC-001 Project-Setup.
- **Style Guide V2 physisch in Repo kopieren:** `/docs/STYLE_GUIDE_V2.md` (Kopie aus Dev-System). Nicht als Symlink, damit das Repo standalone kompilierbar bleibt.

### 13.2 Vor V3-Slice-Planning (nicht in dieser Session)

- Business-Roadmap-Abstimmung: Qualified-Lead-Inbox-Entität als FEAT im Business planen (BL-016). Auth-Modell, Payload-Schema, Status-Sync-Mechanik.

### 13.3 Vor V4-Slice-Planning (nicht in dieser Session)

- LinkedIn Creator-API-Realitätscheck (OQ-A6).
- E-Mail-Provider-Vertrag Postmark EU (DEC-013).

---

## Referenzen

- Gesamtarchitektur: `/strategaize-dev-system/docs/PLATFORM.md`
- Data Residency: `/strategaize-dev-system/.claude/rules/data-residency.md`
- Style Guide V2: `/docs/STYLE_GUIDE_V2.md` (Kopie im IS-Repo), Original in `/strategaize-dev-system/STRATEGAIZE_STYLE_GUIDE_V2.md`
- Worker-Referenz: `/strategaize-onboarding-plattform/` (Worker-Muster, `ai_jobs`-Queue)
- Discovery V2: `/reports/RPT-003.md`
- Requirements V2: `/reports/RPT-004.md`
- Richtungsvorgaben: `/docs/discovery-input-v2.md`
- PRD V1–V7: `/docs/PRD.md`
- Decisions: `/docs/DECISIONS.md`
- Migrations: `/docs/MIGRATIONS.md`
- Known Issues: `/docs/KNOWN_ISSUES.md`
