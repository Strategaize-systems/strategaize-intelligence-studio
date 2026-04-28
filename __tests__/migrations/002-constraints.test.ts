// MIG-002 Constraints — Integration-Tests gegen Coolify-DB.
// Pflicht-TDD per slice-spec: Singleton, Duplikat, Idempotency.
// Skipped wenn TEST_DATABASE_URL fehlt (lokale Entwicklung ohne DB-Zugriff).

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Client } from "pg";
import { randomUUID } from "node:crypto";

const TEST_DB_URL = process.env.TEST_DATABASE_URL;
const RUN_TESTS = !!TEST_DB_URL;

const desc = RUN_TESTS ? describe : describe.skip;

desc("MIG-002 — Constraints (against Coolify-DB)", () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({ connectionString: TEST_DB_URL });
    await client.connect();
  });

  afterAll(async () => {
    if (client) await client.end();
  });

  it("brand_profile Singleton: zweiter is_active=true Insert schlaegt fehl", async () => {
    await client.query("BEGIN");
    await client.query("SAVEPOINT pre");

    let errMsg: string | null = null;
    try {
      // Cleanup any existing
      await client.query("DELETE FROM brand_profile WHERE data->>'_test'='constraint-check'");
      await client.query(
        `INSERT INTO brand_profile (data, is_active) VALUES ($1::jsonb, true)`,
        [JSON.stringify({ _test: "constraint-check", a: 1 })]
      );
      await client.query("SAVEPOINT try_dup");
      try {
        await client.query(
          `INSERT INTO brand_profile (data, is_active) VALUES ($1::jsonb, true)`,
          [JSON.stringify({ _test: "constraint-check", b: 2 })]
        );
      } catch (e) {
        errMsg = (e as Error).message;
      }
      await client.query("ROLLBACK TO SAVEPOINT try_dup");
    } finally {
      await client.query("ROLLBACK TO SAVEPOINT pre");
      await client.query("ROLLBACK");
    }

    expect(errMsg).toMatch(/(duplicate key|unique constraint)/i);
  });

  it("lead Duplikat: gleicher (domain, email) schlaegt fehl", async () => {
    await client.query("BEGIN");
    await client.query("SAVEPOINT pre");

    let errMsg: string | null = null;
    try {
      const domain = `slc101-${randomUUID()}.test`;
      await client.query(
        `INSERT INTO lead (company_name, domain, source, contact_email)
         VALUES ($1, $2, 'manual', $3)`,
        ["Test GmbH", domain, "x@" + domain]
      );
      await client.query("SAVEPOINT try_dup");
      try {
        await client.query(
          `INSERT INTO lead (company_name, domain, source, contact_email)
           VALUES ($1, $2, 'manual', $3)`,
          ["Test GmbH 2", domain, "x@" + domain]
        );
      } catch (e) {
        errMsg = (e as Error).message;
      }
      await client.query("ROLLBACK TO SAVEPOINT try_dup");
    } finally {
      await client.query("ROLLBACK TO SAVEPOINT pre");
      await client.query("ROLLBACK");
    }

    expect(errMsg).toMatch(/(duplicate key|unique constraint)/i);
  });

  it("handoff_event Idempotency: zweiter (lead_id, campaign_id) schlaegt fehl", async () => {
    await client.query("BEGIN");
    await client.query("SAVEPOINT pre");

    let errMsg: string | null = null;
    try {
      const domain = `slc101-${randomUUID()}.test`;
      const lead = await client.query<{ id: string }>(
        `INSERT INTO lead (company_name, domain, source) VALUES ($1, $2, 'manual') RETURNING id`,
        ["X", domain]
      );
      const icp = await client.query<{ id: string }>(
        `INSERT INTO icp (title) VALUES ('Test ICP') RETURNING id`
      );
      const segment = await client.query<{ id: string }>(
        `INSERT INTO segment (title, icp_id) VALUES ('Test Segment', $1) RETURNING id`,
        [icp.rows[0].id]
      );
      const camp = await client.query<{ id: string }>(
        `INSERT INTO campaign (title, icp_id, segment_id, start_at, end_at)
         VALUES ('C', $1, $2, now(), now() + interval '30 days') RETURNING id`,
        [icp.rows[0].id, segment.rows[0].id]
      );
      await client.query(
        `INSERT INTO handoff_event (lead_id, campaign_id, mechanism, payload_snapshot)
         VALUES ($1, $2, 'manual', '{}'::jsonb)`,
        [lead.rows[0].id, camp.rows[0].id]
      );
      await client.query("SAVEPOINT try_dup");
      try {
        await client.query(
          `INSERT INTO handoff_event (lead_id, campaign_id, mechanism, payload_snapshot)
           VALUES ($1, $2, 'manual', '{}'::jsonb)`,
          [lead.rows[0].id, camp.rows[0].id]
        );
      } catch (e) {
        errMsg = (e as Error).message;
      }
      await client.query("ROLLBACK TO SAVEPOINT try_dup");
    } finally {
      await client.query("ROLLBACK TO SAVEPOINT pre");
      await client.query("ROLLBACK");
    }

    expect(errMsg).toMatch(/(duplicate key|unique constraint)/i);
  });

  it("ai_job_type_enum hat 7 Werte (4 V1 + 3 V6)", async () => {
    const result = await client.query<{ enum_range: string[] }>(
      `SELECT enum_range(NULL::ai_job_type_enum) AS enum_range`
    );
    const values = result.rows[0]?.enum_range ?? [];
    for (const expected of [
      "asset_generation",
      "pitch_generation",
      "lead_research_run",
      "business_status_pull",
      "ingest_onboarding",
      "ingest_business",
      "opportunity_scoring",
    ]) {
      expect(values).toContain(expected);
    }
  });
});
