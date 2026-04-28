// Worker-internal Postgres-Client. Direct pg-Connection.
// Worker laeuft im Docker-Compose neben supabase-db, nutzt internal Hostname.

import { Client } from "pg";

let cachedClient: Client | null = null;

export async function getDbClient(): Promise<Client> {
  if (cachedClient) return cachedClient;
  const conn =
    process.env.DATABASE_URL ??
    `postgresql://postgres:${process.env.POSTGRES_PASSWORD ?? ""}@${
      process.env.POSTGRES_HOST ?? "supabase-db"
    }:5432/postgres`;
  cachedClient = new Client({ connectionString: conn });
  await cachedClient.connect();
  return cachedClient;
}

export async function closeDbClient(): Promise<void> {
  if (cachedClient) {
    await cachedClient.end();
    cachedClient = null;
  }
}
