# Migrations

### MIG-001 — Initial Schema Baseline V1 *(V1-Subset implementiert 2026-04-28)*
- Date: 2026-04-28 (V1-Subset SQL committed; Hetzner-Apply pending MT-2)
- Scope (V1-Subset, in `sql/migrations/001_v1_foundation.sql`): `ai_jobs`, `ai_cost_ledger`, `audit_log`, `auth.user_role()`, `ai_job_type_enum` (V6-Werte), service_role GRANTs. Pre-Condition fuer MIG-002.
- Scope (Original-Spec, V6-Slice-Planning): 14 weitere V6-Tabellen (FEAT-001..007) — wandert mit V6-Slice-Planning, NICHT in V1.
- Reason: Architektur V2 definiert V1-Schema für Ingest, Knowledge-Units, Opportunity/Decision, Cross-Kunden-Learnings, Customer Deployment Registry. Siehe `/docs/ARCHITECTURE.md` Abschnitt 5.1.
- Affected Areas: Initiale Datenbank-Baseline. Keine Daten-Migration nötig (Leer-Projekt).
- Risk: Schema-Fehler sind später schwer zurückzunehmen, daher Template-Readiness (`template_id`) ab Tag 1, um Multi-Instanz-Refactor in V8+ zu vermeiden. RLS-Policies müssen vor jedem Production-Deploy mit SAVEPOINT-Tests gegen echte DB verifiziert werden (Muster aus `strategaize-dev-system/.claude/rules/coolify-test-setup`).
- Rollback Notes: Initiale Migration — Rollback = Datenbank-Drop. Kein Produktivdatenbestand, der verloren gehen könnte.
- Tabellen:
  - `customer` — Portfolio-Basis (FEAT-003)
  - `business_contact_cache` — Shadow Business (FEAT-002)
  - `business_company_cache` — Shadow Business (FEAT-002)
  - `business_deal_cache` — Shadow Business, nur status IN ('active', 'won') (FEAT-002, DEC-016)
  - `ingest_run` — Ingest-Metadaten (FEAT-001, FEAT-002)
  - `ingest_error_log` — Ingest-Fehlertoleranz (FEAT-002)
  - `knowledge_unit` — KU-Cache (FEAT-001, FEAT-004, FEAT-006)
  - `ku_tag` — Freie Tags (FEAT-004)
  - `ku_cluster` — Manuelles Clustering (FEAT-004)
  - `ku_cluster_member` — n:m KU↔Cluster (FEAT-004)
  - `learning_visibility` — Audit Cross-Kunden (FEAT-006)
  - `opportunity` — Opportunity-Kern (FEAT-005)
  - `opportunity_dimension_value` — 4+7 Bewertungs-Dimensionen (FEAT-005)
  - `decision` — Decision-Status-Wechsel (FEAT-005)
  - `decision_log` — Audit (FEAT-005)
  - `deployment` — Customer Deployment Registry (FEAT-007)
  - `deployment_version_history` — Deployment-Audit (FEAT-007)
- Infrastruktur-Tabellen:
  - `ai_jobs` — Zentrale Job-Queue (Worker-Pattern, DEC-008)
  - `ai_cost_ledger` — Cost-Tracking pro externem Call (DEC-009)
  - `audit_log` — Generic Audit-Trail

### MIG-002 — V1 Marketing Launcher Schema Extension *(SQL implementiert 2026-04-28, Hetzner-Apply pending)*
- Date: 2026-04-28 (SQL-File `sql/migrations/002_v1_marketing_launcher_schema.sql` committed; Hetzner-Apply pending MT-2 / IS-Coolify-Supabase-Instanz)
- Scope: 16 Tabellen fuer V1-Marketing-Launcher (FEAT-008..011 + 014..016). Plus Enum-Erweiterung von `ai_job_type_enum` um 3 Werte (`asset_generation`, `pitch_generation`, `lead_research_run`).
- Reason: Strategischer Pivot 2026-04-25 — V1 ist Marketing Launcher (Closed Loop Lite). Architektur-Foundation V2 (MIG-001) bleibt als V6-Vorbereitung gueltig. MIG-002 ergaenzt das V1-Datenmodell aus FEAT-008..016. Architekturaufloesung der OQ-A1..A5 in DEC-023..027 (siehe `/docs/DECISIONS.md`).
- Affected Areas: 16 neue Tabellen, keine Aenderungen an MIG-001-Tabellen. Erweiterung `ai_jobs.job_type` Enum um 3 Werte.
- Risk: Brand-Profile-Singleton-Constraint muss per Partial-Unique-Index enforced werden (`CREATE UNIQUE INDEX ON brand_profile(is_active) WHERE is_active=true`). Lead-Duplikat-Constraint per `(domain, COALESCE(contact_email, ''))`. Handoff-Idempotency per `UNIQUE (lead_id, campaign_id)`. RLS auf allen 16 neuen Tabellen aktiv (gleiche Helper-Funktionen `auth.user_tenant_id()` + `auth.user_role()` aus MIG-001).
- Rollback Notes: Tabellen-Drop in umgekehrter Abhaengigkeitsreihenfolge: handoff_event → campaign_pitch → campaign_lead → campaign_asset → campaign → pitch_version → pitch → research_run → lead → segment → icp → asset_performance → asset_version → asset → brand_profile_changelog → brand_profile. Enum-Werte koennen in PostgreSQL nicht entfernt werden, daher Rollback laesst sie stehen (harmlos, ungenutzt). Initiale V1-Implementation, daher keine Daten-Migration.

#### Tabellen (Detail)

**Brand & Content (FEAT-008 + FEAT-009 — 5 Tabellen)**
- `brand_profile` — JSONB-Singleton (DEC-023). Spalten: `id (UUID PK)`, `template_id (UUID NULL)`, `is_active (bool default true)`, `version (int default 1)`, `data (JSONB NOT NULL)` mit 12-Sektionen-Schema, `updated_at`, `updated_by`. Partial-Unique-Index `WHERE is_active=true` als Singleton-Enforcement.
- `brand_profile_changelog` — Audit-Trail. Spalten: `id`, `brand_profile_id (FK)`, `version_from (int)`, `version_to (int)`, `jsonb_path_changed (text)`, `old_value (JSONB)`, `new_value (JSONB)`, `changed_at (timestamp)`, `changed_by (uuid)`.
- `asset` — Generated Asset. Spalten: `id`, `output_type (Enum)`, `source_skill (Enum)`, `source_object_type (text)`, `source_object_id (uuid NULL)`, `current_version_id (FK asset_version NULL)`, `status (Enum: entwurf|ueberarbeitet|freigegeben|veroeffentlicht|verworfen)`, `template_id (NULL)`, `brand_profile_version_snapshot (int)`, `briefing_note (text NULL)`, `tags (text[] default '{}')`, `created_at`, `created_by`.
- `asset_version` — Versions-History. Spalten: `id`, `asset_id (FK)`, `version_number (int)`, `markdown_content (text)`, `metadata (JSONB)` (Modell, Tokens, Cost, Antwortzeit, Skill-Quelle, Few-shot-Snapshot), `is_ai_generated (bool)`, `created_at`, `created_by`. UNIQUE (asset_id, version_number).
- `asset_performance` — Eigene Tabelle (DEC-026), 1:n moeglich. Spalten: `id`, `asset_id (FK)`, `posted_at (timestamp)`, `channel (text)`, `cost_eur (numeric default 0)`, `impressions (int NULL)`, `clicks (int NULL)`, `leads_generated (int default 0)`, `notes (text NULL)`, `template_id (NULL)`, `entered_at (timestamp default now())`, `entered_by (uuid)`.

**ICP & Segment (FEAT-010 — 2 Tabellen)**
- `icp` — Strukturierte ICP-Definition. Spalten: `id`, `title (text)`, `description (text)`, `brand_profile_id (FK NULL)`, `target_company_type (JSONB)`, `decision_makers (text[])`, `primary_use_case (text)`, `jobs_to_be_done (text[])`, `personas (JSONB)`, `revenue_band (text NULL)`, `region_country (text)`, `trigger_signals (text[])`, `pain_points (text[] NULL)`, `budget_estimate (text NULL)`, `market_size_estimate (numeric NULL)`, `anti_persona (text NULL)`, `notes (text NULL)`, `template_id (NULL)`, `created_at`, `created_by`.
- `segment` — Gefilterte ICP-Instanz. Spalten: `id`, `title (text)`, `icp_id (FK)`, `filter_definition (JSONB)`, `is_snapshot (bool default false)`, `snapshot_at (timestamp NULL)`, `manual_includes (uuid[] NULL)`, `manual_excludes (uuid[] NULL)`, `template_id (NULL)`, `created_at`, `created_by`. V1 Live-Query (kein `segment_member`-Table).

**Lead Research (FEAT-015 — 2 Tabellen)**
- `lead` — Lead-Pool. Spalten: `id`, `company_name (text)`, `domain (text)`, `industry (text)`, `country (text)`, `source (Enum: firecrawl|clay_csv|manual)`, `source_run_id (FK research_run NULL)`, `status (Enum: new|qualified|pushed|acknowledged|rejected|converted|dead default 'new')`, `company_size_band (text NULL)`, `revenue_band (text NULL)`, `contact_name (text NULL)`, `contact_role (text NULL)`, `contact_email (text NULL)`, `linkedin_url (text NULL)`, `phone (text NULL)`, `trigger_signals_matched (text[] default '{}')`, `enrichment_data (JSONB NULL)`, `notes (text NULL)`, `tags (text[] default '{}')`, `business_deal_id (uuid NULL)`, `template_id (NULL)`, `created_at`, `created_by`. UNIQUE INDEX auf `(domain, COALESCE(contact_email, ''))`.
- `research_run` — Recherche-Lauf. Spalten: `id`, `segment_id (FK)`, `provider (Enum)`, `status (Enum: pending|running|completed|failed default 'pending')`, `started_at (timestamp NULL)`, `completed_at (timestamp NULL)`, `leads_found (int default 0)`, `leads_new (int default 0)`, `leads_duplicate (int default 0)`, `cost_eur (numeric default 0)`, `provider_run_id (text NULL)`, `provider_query (JSONB)`, `error_message (text NULL)`, `notes (text NULL)`, `created_by`, `created_at`.

**Messaging-Variation (FEAT-016 — 2 Tabellen)**
- `pitch` — Lead-spezifischer Pitch (DEC-025). Spalten: `id`, `lead_id (FK)`, `output_type (Enum: email|linkedin_post)`, `current_version_id (FK pitch_version NULL)`, `status (Enum: entwurf|ueberarbeitet|freigegeben|gesendet|verworfen default 'entwurf')`, `personalization_level_used (Enum: industry|company|role|individual)`, `psychology_boosters_used (text[] default '{}')`, `framework_used (text NULL)`, `briefing_note (text NULL)`, `tags (text[] default '{}')`, `linked_asset_id (FK asset NULL)`, `brand_profile_version_snapshot (int)`, `template_id (NULL)`, `created_at`, `created_by`.
- `pitch_version` — Versions-History. Spalten: `id`, `pitch_id (FK)`, `version_number (int)`, `subject (text NULL)` (nur bei email), `body_markdown (text)`, `metadata (JSONB)` (Modell, Tokens, Cost, 4-Level-Snapshot, Booster-Liste), `is_ai_generated (bool)`, `created_at`, `created_by`. UNIQUE (pitch_id, version_number).

**Campaign LITE (FEAT-011 — 4 Tabellen)**
- `campaign` — Parent-Klammer. Spalten: `id`, `title (text)`, `goal (text)`, `icp_id (FK)`, `segment_id (FK)`, `start_at (timestamp)`, `end_at (timestamp)`, `success_signals (text[])`, `status (Enum: entwurf|aktiv|abgeschlossen|abgebrochen default 'entwurf')`, `owner_id (uuid)`, `budget_estimate (numeric NULL)`, `notes (text NULL)`, `template_id (NULL)`, `created_at`, `created_by`. CHECK `start_at < end_at`.
- `campaign_asset` — n:m. Spalten: `campaign_id (FK)`, `asset_id (FK)`, `added_at (timestamp default now())`. PRIMARY KEY (campaign_id, asset_id).
- `campaign_lead` — n:m. Spalten: `campaign_id (FK)`, `lead_id (FK)`, `added_at`. PRIMARY KEY (campaign_id, lead_id).
- `campaign_pitch` — n:m. Spalten: `campaign_id (FK)`, `pitch_id (FK)`, `added_at`. PRIMARY KEY (campaign_id, pitch_id).

**Lead Handoff (FEAT-014 — 1 Tabelle)**
- `handoff_event` — Pipeline-Push-Audit. Spalten: `id`, `lead_id (FK)`, `campaign_id (FK)`, `pitch_id (FK NULL)`, `pushed_at (timestamp NULL)`, `mechanism (Enum: pipeline_push|manual)`, `business_deal_id (uuid NULL)`, `business_pipeline_name (text NULL)`, `business_stage_name (text NULL)`, `status (Enum: pending|pushed|failed|acknowledged|converted|rejected default 'pending')`, `payload_snapshot (JSONB)`, `error_message (text NULL)`, `notes (text NULL)`, `template_id (NULL)`, `created_at`, `created_by`. UNIQUE (lead_id, campaign_id) als Idempotency-Key.

**Total: 16 neue Tabellen.** Alle mit RLS aktiv und `template_id UUID NULL` konform DEC-010.

#### Enum-Erweiterungen
```sql
ALTER TYPE ai_job_type_enum ADD VALUE 'asset_generation';
ALTER TYPE ai_job_type_enum ADD VALUE 'pitch_generation';
ALTER TYPE ai_job_type_enum ADD VALUE 'lead_research_run';
```

#### Indizes (V1)
- `brand_profile`: `UNIQUE (is_active) WHERE is_active=true` (Singleton)
- `lead`: `UNIQUE (domain, COALESCE(contact_email, ''))` (Duplikat)
- `lead`: INDEX `(status)`, INDEX `(industry)` fuer Segment-Live-Query-Filter
- `asset`: INDEX `(output_type, status)` fuer Asset-Library-Filter
- `asset_performance`: INDEX `(asset_id, posted_at)` fuer Performance-Queries
- `asset_performance`: INDEX `(leads_generated DESC)` partial WHERE `leads_generated > 0` fuer Few-shot-Top-N-Query (DEC-027)
- `pitch`: INDEX `(lead_id)`, INDEX `(status)`
- `handoff_event`: `UNIQUE (lead_id, campaign_id)` (Idempotency), INDEX `(status)`, INDEX `(business_deal_id)` partial WHERE NOT NULL
- `campaign`: INDEX `(status, start_at)`
- `research_run`: INDEX `(segment_id, started_at DESC)`
- `asset_version`, `pitch_version`: bereits UNIQUE-PK ueber (parent_id, version_number)

#### RLS-Pattern (V1, alle 16 Tabellen)
Identisch zu MIG-001-Pattern (siehe ARCHITECTURE.md Sektion 5.5):
- `{table}_admin_full` — `strategaize_admin` Cross-Tenant-Vollzugriff
- `{table}_tenant_read` — `tenant_admin` + `tenant_member` lesen Tenant-Daten
- `{table}_tenant_admin_write` — `tenant_admin` schreibt
- Sonderregel `brand_profile`: nur `strategaize_admin` (StrategAIze-eigenes Singleton, V9+ Multi-Brand spaeter)

### MIG-003 — V3 Schema Extension: Campaign + Lead *(geplant, nicht ausgeführt)*
- Date: TBD (V3 Implementation, nach Business-Qualified-Lead-Inbox-Abstimmung)
- Scope: ca. 12 Tabellen für ICP/Segment, Campaign-Hierarchie (DEC-004), Lead-Research/Enrichment, Scoring, Handoff.
- Reason: V3-Scope Campaign & Lead Intelligence vollständig in DB abbilden. Campaign-Hierarchie (`campaign → channel_segment → campaign_variant`) nach DEC-004.
- Affected Areas: Neue Tabellen + FK von `campaign_variant.asset_id` → `asset.id` (V2-Dependency). Handoff-Event mit möglicher Business-Inbox-FK (abhängig von ISSUE-001).
- Risk: Campaign-Hierarchie-Semantik (Audience-Split auf 100%) muss per CHECK-Constraint + App-Layer-Validierung abgesichert werden. Handoff-Fallback auf CSV, solange Business-Inbox fehlt.
- Rollback Notes: Tabellen-Drop. Handoff-Export-Log vorher extrahieren falls aktiv genutzt.
- Geplante Tabellen: `icp`, `segment`, `segment_membership`, `campaign`, `channel_segment`, `campaign_variant`, `lead`, `research_task`, `research_task_leads`, `scoring_rule`, `lead_score`, `lead_score_history`, `threshold_config`, `handoff_event`, `handoff_export_log`.

### MIG-004 — V4 Schema Extension: Publishing *(geplant, nicht ausgeführt)*
- Date: TBD (V4 Implementation)
- Scope: `publish_event`, `publishing_credentials` (verschlüsselt).
- Reason: Publish-Status-Tracking + Kredential-Storage für Kanal-Adapter.
- Affected Areas: Neue Tabellen. FK `publish_event.campaign_variant_id` → `campaign_variant.id`.
- Risk: Kredentialspeicherung braucht Verschlüsselung + Rotation-Feld.

### MIG-005 — V5 Schema Extension: Tracking *(geplant, nicht ausgeführt)*
- Date: TBD (V5 Implementation)
- Scope: `tracking_event` mit Hybrid-Schema (DEC-015) — Core-Felder + `payload JSONB`. Attribution-Kette-FKs.
- Reason: Konsolidiertes Performance-Cockpit über alle Kanäle.
- Affected Areas: Neue Tabelle mit hohem Volumen. Indexierung auf Core-Felder für Reports.

### MIG-006 — V6 Schema Extension: Experiments *(geplant, nicht ausgeführt)*
- Date: TBD (V6 Implementation)
- Scope: `experiment`-Tabelle + Verknüpfung zu `opportunity` / `campaign`.
- Reason: Validation & Idea Testing Layer.

### MIG-007 — V7 Schema Extension: Priorities *(geplant, nicht ausgeführt)*
- Date: TBD (V7 Implementation)
- Scope: `priority_flag` generisches Priorisierungs-Overlay (entity_type, entity_id, priority_value, sort_override).
- Reason: Hybrid-Orchestration (DEC-007) — Priority-Felder auf bestehenden Entities + Top-5-Dashboard.

---

## Migration-Disziplin

- Jede Migration ist idempotent (IF EXISTS / CREATE IF NOT EXISTS wo möglich).
- RLS-Policies werden **in derselben Migration** wie die Tabelle angelegt (nicht nachträglich).
- Test-Pattern: SAVEPOINT-basierte RLS-Tests gegen Coolify-DB (siehe `/strategaize-dev-system/.claude/rules/coolify-test-setup.md`, `sql-migration-hetzner.md`).
- Migrations-Files liegen unter `/sql/migrations/NNN_description.sql` mit sequentieller Nummerierung.
- Ausführung auf Hetzner: `docker exec -i <supabase-db-container> psql -U postgres -d postgres < /tmp/NNN_migration.sql` (siehe `sql-migration-hetzner.md`).
