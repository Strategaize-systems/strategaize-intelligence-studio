-- ──────────────────────────────────────────────────────────────────────
-- MIG-002 — V1 Marketing Launcher Schema Extension
-- StrategAIze Intelligence Studio V1 (Closed Loop Lite)
-- Date: 2026-04-28
--
-- Scope: 16 V1-Tabellen (FEAT-008..011 + 014..016) + 2 neue Enums
--        + 3 neue Werte fuer ai_job_type_enum + Indizes + RLS
--
-- Pre-Condition: 001_v1_foundation.sql ist applied (ai_job_type_enum
--                + ai_jobs/ai_cost_ledger/audit_log + auth.user_role()).
--
-- Idempotenz: alle CREATE TABLE / TYPE / INDEX / POLICY mit IF [NOT] EXISTS.
-- Reihenfolge: Dependency-Graph (FK-leere zuerst, zirkulaere Refs via ALTER).
-- DECs: 023 (JSONB-Singleton), 024 (Enums), 025 (separate Pitch),
--       026 (asset_performance Tabelle), 027 (Few-shot N=2), 010 (template_id).
-- ──────────────────────────────────────────────────────────────────────

-- ╔═════════════════════════════════════════════════════════════════════╗
-- ║ ENUMS                                                               ║
-- ╚═════════════════════════════════════════════════════════════════════╝

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_output_type_enum') THEN
    CREATE TYPE asset_output_type_enum AS ENUM (
      'blogpost',
      'linkedin_post',
      'onepager',
      'email_template',
      'case_card',
      'landingpage_briefing',
      'website_spec'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_source_skill_enum') THEN
    CREATE TYPE asset_source_skill_enum AS ENUM (
      'copywriting',
      'social_content',
      'sales_enablement_onepager',
      'sales_enablement_casecard',
      'cold_email',
      'copywriting_landingpage',
      'site_architecture'
    );
  END IF;
END$$;

-- ai_job_type_enum erweitern (DEC-027 Impl + ARCH A.4)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'asset_generation'
                 AND enumtypid = 'ai_job_type_enum'::regtype) THEN
    ALTER TYPE ai_job_type_enum ADD VALUE 'asset_generation';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'pitch_generation'
                 AND enumtypid = 'ai_job_type_enum'::regtype) THEN
    ALTER TYPE ai_job_type_enum ADD VALUE 'pitch_generation';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'lead_research_run'
                 AND enumtypid = 'ai_job_type_enum'::regtype) THEN
    ALTER TYPE ai_job_type_enum ADD VALUE 'lead_research_run';
  END IF;
END$$;

-- ╔═════════════════════════════════════════════════════════════════════╗
-- ║ BRAND & CONTENT (FEAT-008 + FEAT-009)                                ║
-- ╚═════════════════════════════════════════════════════════════════════╝

-- DEC-023: Brand-Profile = JSONB-Singleton
CREATE TABLE IF NOT EXISTS brand_profile (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id     UUID,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  version         INT NOT NULL DEFAULT 1,
  data            JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by      UUID
);

-- Singleton-Constraint: max 1 row mit is_active=true
CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_profile_singleton_active
  ON brand_profile (is_active)
  WHERE is_active = true;

CREATE TABLE IF NOT EXISTS brand_profile_changelog (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_profile_id    UUID NOT NULL REFERENCES brand_profile(id) ON DELETE CASCADE,
  version_from        INT NOT NULL,
  version_to          INT NOT NULL,
  jsonb_path_changed  TEXT,
  old_value           JSONB,
  new_value           JSONB,
  changed_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  changed_by          UUID
);

CREATE INDEX IF NOT EXISTS idx_brand_profile_changelog_profile
  ON brand_profile_changelog (brand_profile_id, changed_at DESC);

-- ── ASSET (DEC-024 Enums; current_version_id zirkulaer → ALTER spaeter) ──
CREATE TABLE IF NOT EXISTS asset (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  output_type                     asset_output_type_enum NOT NULL,
  source_skill                    asset_source_skill_enum NOT NULL,
  source_object_type              TEXT,
  source_object_id                UUID,
  current_version_id              UUID,
  status                          TEXT NOT NULL DEFAULT 'entwurf'
    CHECK (status IN ('entwurf','ueberarbeitet','freigegeben','veroeffentlicht','verworfen')),
  template_id                     UUID,
  brand_profile_version_snapshot  INT NOT NULL DEFAULT 1,
  briefing_note                   TEXT,
  tags                            TEXT[] NOT NULL DEFAULT '{}'::text[],
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by                      UUID
);

CREATE INDEX IF NOT EXISTS idx_asset_output_type_status
  ON asset (output_type, status);

CREATE TABLE IF NOT EXISTS asset_version (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id        UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  version_number  INT NOT NULL,
  markdown_content TEXT NOT NULL,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_ai_generated BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  UNIQUE (asset_id, version_number)
);

-- jetzt zirkulaere FK setzen
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'asset_current_version_id_fkey'
  ) THEN
    ALTER TABLE asset
      ADD CONSTRAINT asset_current_version_id_fkey
      FOREIGN KEY (current_version_id)
      REFERENCES asset_version(id) ON DELETE SET NULL;
  END IF;
END$$;

-- DEC-026: asset_performance als eigene Tabelle (1:n)
CREATE TABLE IF NOT EXISTS asset_performance (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id          UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  posted_at         TIMESTAMPTZ NOT NULL,
  channel           TEXT NOT NULL,
  cost_eur          NUMERIC(10,2) NOT NULL DEFAULT 0,
  impressions       INT,
  clicks            INT,
  leads_generated   INT NOT NULL DEFAULT 0,
  notes             TEXT,
  template_id       UUID,
  entered_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  entered_by        UUID
);

CREATE INDEX IF NOT EXISTS idx_asset_performance_asset_posted
  ON asset_performance (asset_id, posted_at DESC);

-- DEC-027 Few-shot Top-N-Query: partial index auf leads_generated > 0
CREATE INDEX IF NOT EXISTS idx_asset_performance_fewshot_topn
  ON asset_performance (leads_generated DESC)
  WHERE leads_generated > 0;

-- ╔═════════════════════════════════════════════════════════════════════╗
-- ║ ICP & SEGMENT (FEAT-010)                                             ║
-- ╚═════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS icp (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                    TEXT NOT NULL,
  description              TEXT,
  brand_profile_id         UUID REFERENCES brand_profile(id) ON DELETE SET NULL,
  target_company_type      JSONB NOT NULL DEFAULT '{}'::jsonb,
  decision_makers          TEXT[] NOT NULL DEFAULT '{}'::text[],
  primary_use_case         TEXT,
  jobs_to_be_done          TEXT[] NOT NULL DEFAULT '{}'::text[],
  personas                 JSONB NOT NULL DEFAULT '[]'::jsonb,
  revenue_band             TEXT,
  region_country           TEXT,
  trigger_signals          TEXT[] NOT NULL DEFAULT '{}'::text[],
  pain_points              TEXT[],
  budget_estimate          TEXT,
  market_size_estimate     NUMERIC(15,2),
  anti_persona             TEXT,
  notes                    TEXT,
  template_id              UUID,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by               UUID
);

CREATE TABLE IF NOT EXISTS segment (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  icp_id              UUID NOT NULL REFERENCES icp(id) ON DELETE CASCADE,
  filter_definition   JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_snapshot         BOOLEAN NOT NULL DEFAULT false,
  snapshot_at         TIMESTAMPTZ,
  manual_includes     UUID[],
  manual_excludes     UUID[],
  template_id         UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by          UUID
);

CREATE INDEX IF NOT EXISTS idx_segment_icp ON segment (icp_id);

-- ╔═════════════════════════════════════════════════════════════════════╗
-- ║ LEAD RESEARCH (FEAT-015)                                             ║
-- ╚═════════════════════════════════════════════════════════════════════╝

-- research_run zuerst, weil lead.source_run_id darauf zeigt
CREATE TABLE IF NOT EXISTS research_run (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_id       UUID NOT NULL REFERENCES segment(id) ON DELETE CASCADE,
  provider         TEXT NOT NULL CHECK (provider IN ('firecrawl','clay_csv','manual')),
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','running','completed','failed')),
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  leads_found      INT NOT NULL DEFAULT 0,
  leads_new        INT NOT NULL DEFAULT 0,
  leads_duplicate  INT NOT NULL DEFAULT 0,
  cost_eur         NUMERIC(10,2) NOT NULL DEFAULT 0,
  provider_run_id  TEXT,
  provider_query   JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message    TEXT,
  notes            TEXT,
  created_by       UUID,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_run_segment_started
  ON research_run (segment_id, started_at DESC);

CREATE TABLE IF NOT EXISTS lead (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name             TEXT NOT NULL,
  domain                   TEXT NOT NULL,
  industry                 TEXT,
  country                  TEXT,
  source                   TEXT NOT NULL CHECK (source IN ('firecrawl','clay_csv','manual')),
  source_run_id            UUID REFERENCES research_run(id) ON DELETE SET NULL,
  status                   TEXT NOT NULL DEFAULT 'new'
                           CHECK (status IN ('new','qualified','pushed','acknowledged','rejected','converted','dead')),
  company_size_band        TEXT,
  revenue_band             TEXT,
  contact_name             TEXT,
  contact_role             TEXT,
  contact_email            TEXT,
  linkedin_url             TEXT,
  phone                    TEXT,
  trigger_signals_matched  TEXT[] NOT NULL DEFAULT '{}'::text[],
  enrichment_data          JSONB,
  notes                    TEXT,
  tags                     TEXT[] NOT NULL DEFAULT '{}'::text[],
  business_deal_id         UUID,
  template_id              UUID,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by               UUID
);

-- Duplikat-Constraint: domain + COALESCE(contact_email,'')
CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_dedupe
  ON lead (domain, COALESCE(contact_email, ''));

CREATE INDEX IF NOT EXISTS idx_lead_status   ON lead (status);
CREATE INDEX IF NOT EXISTS idx_lead_industry ON lead (industry);

-- ╔═════════════════════════════════════════════════════════════════════╗
-- ║ MESSAGING-VARIATION (FEAT-016, DEC-025 separate Tabelle)            ║
-- ╚═════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS pitch (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id                         UUID NOT NULL REFERENCES lead(id) ON DELETE CASCADE,
  output_type                     TEXT NOT NULL CHECK (output_type IN ('email','linkedin_post')),
  current_version_id              UUID,
  status                          TEXT NOT NULL DEFAULT 'entwurf'
    CHECK (status IN ('entwurf','ueberarbeitet','freigegeben','gesendet','verworfen')),
  personalization_level_used      TEXT NOT NULL CHECK (personalization_level_used IN ('industry','company','role','individual')),
  psychology_boosters_used        TEXT[] NOT NULL DEFAULT '{}'::text[],
  framework_used                  TEXT,
  briefing_note                   TEXT,
  tags                            TEXT[] NOT NULL DEFAULT '{}'::text[],
  linked_asset_id                 UUID REFERENCES asset(id) ON DELETE SET NULL,
  brand_profile_version_snapshot  INT NOT NULL DEFAULT 1,
  template_id                     UUID,
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by                      UUID
);

CREATE INDEX IF NOT EXISTS idx_pitch_lead   ON pitch (lead_id);
CREATE INDEX IF NOT EXISTS idx_pitch_status ON pitch (status);

CREATE TABLE IF NOT EXISTS pitch_version (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id        UUID NOT NULL REFERENCES pitch(id) ON DELETE CASCADE,
  version_number  INT NOT NULL,
  subject         TEXT,
  body_markdown   TEXT NOT NULL,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_ai_generated BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  UNIQUE (pitch_id, version_number)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pitch_current_version_id_fkey'
  ) THEN
    ALTER TABLE pitch
      ADD CONSTRAINT pitch_current_version_id_fkey
      FOREIGN KEY (current_version_id)
      REFERENCES pitch_version(id) ON DELETE SET NULL;
  END IF;
END$$;

-- ╔═════════════════════════════════════════════════════════════════════╗
-- ║ CAMPAIGN LITE (FEAT-011)                                             ║
-- ╚═════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS campaign (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  goal             TEXT,
  icp_id           UUID NOT NULL REFERENCES icp(id) ON DELETE RESTRICT,
  segment_id       UUID NOT NULL REFERENCES segment(id) ON DELETE RESTRICT,
  start_at         TIMESTAMPTZ NOT NULL,
  end_at           TIMESTAMPTZ NOT NULL,
  success_signals  TEXT[] NOT NULL DEFAULT '{}'::text[],
  status           TEXT NOT NULL DEFAULT 'entwurf'
                   CHECK (status IN ('entwurf','aktiv','abgeschlossen','abgebrochen')),
  owner_id         UUID,
  budget_estimate  NUMERIC(10,2),
  notes            TEXT,
  template_id      UUID,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by       UUID,
  CHECK (start_at < end_at)
);

CREATE INDEX IF NOT EXISTS idx_campaign_status_start ON campaign (status, start_at);

CREATE TABLE IF NOT EXISTS campaign_asset (
  campaign_id  UUID NOT NULL REFERENCES campaign(id) ON DELETE CASCADE,
  asset_id     UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  added_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (campaign_id, asset_id)
);

CREATE TABLE IF NOT EXISTS campaign_lead (
  campaign_id  UUID NOT NULL REFERENCES campaign(id) ON DELETE CASCADE,
  lead_id      UUID NOT NULL REFERENCES lead(id) ON DELETE CASCADE,
  added_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (campaign_id, lead_id)
);

CREATE TABLE IF NOT EXISTS campaign_pitch (
  campaign_id  UUID NOT NULL REFERENCES campaign(id) ON DELETE CASCADE,
  pitch_id     UUID NOT NULL REFERENCES pitch(id) ON DELETE CASCADE,
  added_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (campaign_id, pitch_id)
);

-- ╔═════════════════════════════════════════════════════════════════════╗
-- ║ LEAD HANDOFF (FEAT-014)                                              ║
-- ╚═════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS handoff_event (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id                  UUID NOT NULL REFERENCES lead(id) ON DELETE CASCADE,
  campaign_id              UUID NOT NULL REFERENCES campaign(id) ON DELETE CASCADE,
  pitch_id                 UUID REFERENCES pitch(id) ON DELETE SET NULL,
  pushed_at                TIMESTAMPTZ,
  mechanism                TEXT NOT NULL CHECK (mechanism IN ('pipeline_push','manual')),
  business_deal_id         UUID,
  business_pipeline_name   TEXT,
  business_stage_name      TEXT,
  status                   TEXT NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending','pushed','failed','acknowledged','converted','rejected')),
  payload_snapshot         JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message            TEXT,
  notes                    TEXT,
  template_id              UUID,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by               UUID
);

-- Idempotency (lead, campaign) — verhindert Doppel-Push
CREATE UNIQUE INDEX IF NOT EXISTS idx_handoff_event_idempotency
  ON handoff_event (lead_id, campaign_id);

CREATE INDEX IF NOT EXISTS idx_handoff_event_status
  ON handoff_event (status);

CREATE INDEX IF NOT EXISTS idx_handoff_event_business_deal
  ON handoff_event (business_deal_id)
  WHERE business_deal_id IS NOT NULL;

-- ╔═════════════════════════════════════════════════════════════════════╗
-- ║ RLS — V1 single-tenant: authenticated → ALL access                   ║
-- ║ V8+ Multi-Tenant via template_id: Pattern aus ARCH 5.5 erweiterbar   ║
-- ╚═════════════════════════════════════════════════════════════════════╝

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'brand_profile','brand_profile_changelog',
    'asset','asset_version','asset_performance',
    'icp','segment',
    'research_run','lead',
    'pitch','pitch_version',
    'campaign','campaign_asset','campaign_lead','campaign_pitch',
    'handoff_event'
  ])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_authenticated_full', t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      t || '_authenticated_full', t
    );
  END LOOP;
END$$;

-- Sonderregel brand_profile: nur strategaize_admin (V8+ relevant). V1 single-tenant
-- = alle authenticated User sind effektiv Admin (Policy oben), Sonderregel kommt
-- mit Multi-Brand V9+. Hier dokumentiert, nicht enforced in V1.

-- ╔═════════════════════════════════════════════════════════════════════╗
-- ║ service_role GRANTs (re-applied nach neuen Tabellen)                ║
-- ║ siehe backend.md: BYPASSRLS != Table-Permissions                    ║
-- ╚═════════════════════════════════════════════════════════════════════╝

GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES  IN SCHEMA public TO service_role;
