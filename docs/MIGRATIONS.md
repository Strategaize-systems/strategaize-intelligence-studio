# Migrations

### MIG-001 — Initial Schema Baseline V1
- Date: 2026-04-16
- Scope: 17 Tabellen für V1 (FEAT-001..007) inkl. Infrastruktur-Tabellen (`ai_jobs`, `ai_cost_ledger`, `audit_log`). Alle Tabellen mit RLS aktiv, `template_id UUID NULL` als V8+-Vorbereitung, Standard-Rollen-Helper-Funktionen (`auth.user_tenant_id()`, `auth.user_role()`).
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

### MIG-002 — V2 Schema Extension: Brand + Content *(geplant, nicht ausgeführt)*
- Date: TBD (V2 Implementation)
- Scope: 5 Tabellen für Brand Profile + Content Asset Production (FEAT-008, FEAT-009). Singleton-Constraint auf `brand_profile`, polymorphe `source_type`/`source_id` auf `asset_request`.
- Reason: V2-Features erfordern Brand-Profil als LLM-Kontext-Singleton (DEC-006) und Asset-Bibliothek mit Versionierung.
- Affected Areas: Neue Tabellen, keine Änderungen an V1-Tabellen.
- Risk: Singleton-Constraint muss per CHECK + Unique-Partial-Index enforced werden. Polymorphe FKs brauchen App-Layer-Validierung.
- Rollback Notes: Tabellen-Drop ohne V1-Auswirkung.
- Geplante Tabellen: `brand_profile`, `brand_profile_example`, `brand_profile_changelog`, `asset_request`, `asset`, `asset_version`.

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
