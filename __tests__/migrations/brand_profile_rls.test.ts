/**
 * SLC-102 MT-7 — Brand Profile RLS + Integration-Tests gegen Coolify-DB.
 *
 * V1-Realitaet (DEC-023, MIG-002): brand_profile hat KEINE separate
 * strategaize_admin-Rolle in V1 single-tenant — alle authenticated User
 * haben Vollzugriff (gleiche Policy wie alle anderen Tabellen). Die
 * Sonderregel ist als Kommentar in MIG-002 dokumentiert und wird in V8+
 * scharf gemacht. Diese Tests verifizieren:
 *
 * 1. Insert + Update + Changelog End-to-End (via postgres-user / service_role)
 * 2. anon-Role ist blockiert (kann nicht lesen/schreiben)
 * 3. authenticated-Role kann SELECT/INSERT/UPDATE (V1 single-tenant)
 * 4. service_role kann lesen/schreiben (GRANTs aus MIG-002)
 *
 * Skipped wenn TEST_DATABASE_URL fehlt.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Client } from "pg";

const TEST_DB_URL = process.env.TEST_DATABASE_URL;
const RUN_TESTS = !!TEST_DB_URL;
const desc = RUN_TESTS ? describe : describe.skip;

desc("SLC-102 MT-7 — Brand Profile RLS + Integration", () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({ connectionString: TEST_DB_URL });
    await client.connect();
  });

  afterAll(async () => {
    if (client) await client.end();
  });

  it("End-to-End: Insert → Update → Changelog-Eintrag geschrieben", async () => {
    await client.query("BEGIN");
    await client.query("SAVEPOINT pre");

    try {
      const initialData = {
        _test: "slc102-mt7-e2e",
        sections: { painPoints: { core_challenge: "alt" } },
      };
      const updatedData = {
        _test: "slc102-mt7-e2e",
        sections: { painPoints: { core_challenge: "neu" } },
      };

      // Cleanup
      await client.query("DELETE FROM brand_profile WHERE data->>'_test'='slc102-mt7-e2e'");

      // Erst-Insert (version=1)
      const inserted = await client.query<{ id: string; version: number }>(
        `INSERT INTO brand_profile (data, is_active, version) VALUES ($1::jsonb, true, 1)
         RETURNING id, version`,
        [JSON.stringify(initialData)]
      );
      expect(inserted.rows[0].version).toBe(1);
      const profileId = inserted.rows[0].id;

      // Update (version=2)
      await client.query(
        `UPDATE brand_profile SET data=$1::jsonb, version=2, updated_at=now()
         WHERE id=$2`,
        [JSON.stringify(updatedData), profileId]
      );

      // Changelog-Eintrag schreiben
      await client.query(
        `INSERT INTO brand_profile_changelog
           (brand_profile_id, version_from, version_to, jsonb_path_changed,
            old_value, new_value)
         VALUES ($1, 1, 2, 'sections.painPoints', $2::jsonb, $3::jsonb)`,
        [
          profileId,
          JSON.stringify(initialData.sections.painPoints),
          JSON.stringify(updatedData.sections.painPoints),
        ]
      );

      // Verifikation: Changelog hat genau 1 Eintrag fuer dieses Profile
      const cl = await client.query<{
        version_from: number;
        version_to: number;
        jsonb_path_changed: string;
      }>(
        `SELECT version_from, version_to, jsonb_path_changed
         FROM brand_profile_changelog WHERE brand_profile_id=$1
         ORDER BY changed_at DESC`,
        [profileId]
      );
      expect(cl.rows).toHaveLength(1);
      expect(cl.rows[0].version_from).toBe(1);
      expect(cl.rows[0].version_to).toBe(2);
      expect(cl.rows[0].jsonb_path_changed).toBe("sections.painPoints");

      // Verifikation: brand_profile hat version=2
      const final = await client.query<{ version: number }>(
        `SELECT version FROM brand_profile WHERE id=$1`,
        [profileId]
      );
      expect(final.rows[0].version).toBe(2);
    } finally {
      await client.query("ROLLBACK TO SAVEPOINT pre");
      await client.query("ROLLBACK");
    }
  });

  it("anon-Rolle: SELECT auf brand_profile blockiert (RLS)", async () => {
    await client.query("BEGIN");
    await client.query("SAVEPOINT pre");
    await client.query("SET LOCAL ROLE anon");

    let result: { rowCount: number | null } | null = null;
    let errMsg: string | null = null;

    await client.query("SAVEPOINT try_anon");
    try {
      result = await client.query("SELECT id FROM brand_profile LIMIT 1");
    } catch (e) {
      errMsg = (e as Error).message;
    }
    await client.query("ROLLBACK TO SAVEPOINT try_anon");

    await client.query("RESET ROLE");
    await client.query("ROLLBACK TO SAVEPOINT pre");
    await client.query("ROLLBACK");

    // Entweder permission denied (Policy) oder 0 rows (Policy filtert alles weg)
    if (errMsg) {
      expect(errMsg).toMatch(/(permission denied|policy)/i);
    } else {
      expect(result?.rowCount ?? 0).toBe(0);
    }
  });

  it("anon-Rolle: INSERT auf brand_profile blockiert (RLS)", async () => {
    await client.query("BEGIN");
    await client.query("SAVEPOINT pre");
    await client.query("SET LOCAL ROLE anon");

    let errMsg: string | null = null;

    await client.query("SAVEPOINT try_anon_insert");
    try {
      await client.query(
        `INSERT INTO brand_profile (data, is_active) VALUES ('{}'::jsonb, true)`
      );
    } catch (e) {
      errMsg = (e as Error).message;
    }
    await client.query("ROLLBACK TO SAVEPOINT try_anon_insert");

    await client.query("RESET ROLE");
    await client.query("ROLLBACK TO SAVEPOINT pre");
    await client.query("ROLLBACK");

    expect(errMsg).toMatch(/(permission denied|policy|row-level security|new row violates)/i);
  });

  it("authenticated-Rolle: SELECT/INSERT/UPDATE erlaubt (V1 single-tenant)", async () => {
    await client.query("BEGIN");
    await client.query("SAVEPOINT pre");

    let errMsg: string | null = null;

    try {
      // Cleanup
      await client.query(
        "DELETE FROM brand_profile WHERE data->>'_test'='slc102-mt7-auth'"
      );
      await client.query("SET LOCAL ROLE authenticated");

      const inserted = await client.query<{ id: string }>(
        `INSERT INTO brand_profile (data, is_active, version)
         VALUES ($1::jsonb, true, 1) RETURNING id`,
        [JSON.stringify({ _test: "slc102-mt7-auth" })]
      );
      expect(inserted.rows.length).toBe(1);

      const selected = await client.query(
        "SELECT id FROM brand_profile WHERE data->>'_test'='slc102-mt7-auth'"
      );
      expect(selected.rowCount).toBe(1);

      await client.query(
        `UPDATE brand_profile SET version=2 WHERE id=$1`,
        [inserted.rows[0].id]
      );
    } catch (e) {
      errMsg = (e as Error).message;
    } finally {
      await client.query("RESET ROLE");
      await client.query("ROLLBACK TO SAVEPOINT pre");
      await client.query("ROLLBACK");
    }

    expect(errMsg).toBeNull();
  });

  it("service_role: hat dank GRANTs Schreibzugriff (BYPASSRLS + GRANT)", async () => {
    await client.query("BEGIN");
    await client.query("SAVEPOINT pre");

    let errMsg: string | null = null;

    try {
      await client.query(
        "DELETE FROM brand_profile WHERE data->>'_test'='slc102-mt7-srv'"
      );
      await client.query("SET LOCAL ROLE service_role");
      await client.query(
        `INSERT INTO brand_profile (data, is_active, version)
         VALUES ($1::jsonb, true, 1)`,
        [JSON.stringify({ _test: "slc102-mt7-srv" })]
      );
    } catch (e) {
      errMsg = (e as Error).message;
    } finally {
      await client.query("RESET ROLE");
      await client.query("ROLLBACK TO SAVEPOINT pre");
      await client.query("ROLLBACK");
    }

    expect(errMsg).toBeNull();
  });
});
