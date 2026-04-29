-- ──────────────────────────────────────────────────────────────────────
-- MIG-001 (V1-Subset) — Foundation Infrastructure
-- StrategAIze Intelligence Studio V1 (Marketing Launcher Closed Loop Lite)
-- Date: 2026-04-28
--
-- Scope (V1-only):
--   - auth.user_role() Helper-Funktion
--   - ai_job_type_enum (initial V6-Werte; V1-Werte via 002 ALTER TYPE)
--   - ai_jobs        (Worker-Queue, DEC-008)
--   - ai_cost_ledger (Cost-Tracking pro externem Call, DEC-009)
--   - audit_log      (generischer Audit-Trail)
--   - service_role GRANTs (siehe backend.md skill: BYPASSRLS != table perms)
--
-- NOT in V1-Subset (V6 only): customer, knowledge_unit, opportunity etc.
-- Diese kommen mit MIG-001-Voll im V6-Slice-Planning. Spec siehe MIGRATIONS.md.
-- ──────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── auth helper ────────────────────────────────────────────────────────
-- ARCHITECTURE.md 5.5: SECURITY DEFINER, liest aus JWT-Claim 'role'.
-- V1 single-tenant: tenant_id-Logik kommt mit V8+ (DEC-010).
-- HINWEIS: Funktion liegt im public-Schema, NICHT auth-Schema. Supabase
-- verwaltet auth-Schema selbst und blockt User-Defined-Funktionen dort
-- (auch fuer postgres-Superuser). public.user_role() ist semantisch identisch.
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.role', true),
    NULLIF(current_setting('request.jwt.claims', true)::jsonb ->> 'role', ''),
    'authenticated'
  );
$$;

-- ── ai_job_type_enum ──────────────────────────────────────────────────
-- V6-Werte initial (per MIG-001-Spec). V1-Werte folgen via 002 ALTER TYPE.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ai_job_type_enum') THEN
    CREATE TYPE ai_job_type_enum AS ENUM (
      'ingest_onboarding',
      'ingest_business',
      'opportunity_scoring',
      'business_status_pull'
    );
  END IF;
END$$;

-- ── ai_jobs Worker-Queue (DEC-008) ────────────────────────────────────
-- Pattern: SKIP LOCKED Polling im Worker.
CREATE TABLE IF NOT EXISTS ai_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type        ai_job_type_enum NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','running','completed','failed','cancelled')),
  payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
  result          JSONB,
  error_message   TEXT,
  attempts        INT  NOT NULL DEFAULT 0,
  max_attempts    INT  NOT NULL DEFAULT 3,
  scheduled_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  template_id     UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID
);

CREATE INDEX IF NOT EXISTS idx_ai_jobs_pending
  ON ai_jobs (scheduled_at)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_ai_jobs_job_type ON ai_jobs (job_type);

-- ── ai_cost_ledger (DEC-009) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_cost_ledger (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID REFERENCES ai_jobs(id) ON DELETE SET NULL,
  provider        TEXT NOT NULL,                    -- 'bedrock' | 'firecrawl' | 'business_pipeline' | ...
  region          TEXT NOT NULL DEFAULT 'eu-central-1',
  model_id        TEXT,
  operation       TEXT NOT NULL,                    -- 'invoke_model' | 'crawl' | 'pipeline_push' | ...
  input_tokens    INT,
  output_tokens   INT,
  cost_usd        NUMERIC(10,6) DEFAULT 0,
  cost_eur        NUMERIC(10,6) DEFAULT 0,
  notes           TEXT,
  template_id     UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_cost_ledger_provider_created
  ON ai_cost_ledger (provider, created_at DESC);

-- ── audit_log (generic) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type      TEXT NOT NULL,                    -- 'adapter_call' | 'rls_denied' | 'login' | ...
  source          TEXT,                             -- 'firecrawlAdapter' | 'businessPipelineAdapter' | 'app' | ...
  actor_id        UUID,
  target_type     TEXT,
  target_id       UUID,
  metadata        JSONB DEFAULT '{}'::jsonb,
  template_id     UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_event_created
  ON audit_log (event_type, created_at DESC);

-- ── RLS aktivieren ────────────────────────────────────────────────────
-- V1 single-tenant: alle authenticated User haben Vollzugriff.
-- Tenant-scoping kommt mit V8+ (DEC-010 + template_id).
ALTER TABLE ai_jobs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cost_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log      ENABLE ROW LEVEL SECURITY;

-- ai_jobs: nur Worker (service_role bypass via GRANT) + authenticated_admin
DROP POLICY IF EXISTS ai_jobs_authenticated_full ON ai_jobs;
CREATE POLICY ai_jobs_authenticated_full ON ai_jobs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS ai_cost_ledger_authenticated_read ON ai_cost_ledger;
CREATE POLICY ai_cost_ledger_authenticated_read ON ai_cost_ledger
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS audit_log_authenticated_read ON audit_log;
CREATE POLICY audit_log_authenticated_read ON audit_log
  FOR SELECT TO authenticated USING (true);

-- ── service_role GRANTs (kritisch fuer self-hosted Supabase) ──────────
-- BYPASSRLS != Table-Permissions. Ohne GRANT bekommt adminClient
-- "permission denied for table X". Siehe backend.md skill.
GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES  IN SCHEMA public TO service_role;
