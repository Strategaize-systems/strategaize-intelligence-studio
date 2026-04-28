import { createClient } from "@supabase/supabase-js";

// Admin-Client mit service_role-Key. NUR in API-Routes / Server-Actions verwenden.
// service_role bypasses RLS — siehe backend.md skill, Hinweis zu BYPASSRLS vs GRANTs.
//
// X-Forwarded-Host wird gesetzt, damit GoTrue Email-Links auf die externe Domain
// generiert (statt auf den internen Docker-Hostname supabase-kong).
export function createAdminClient() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  let externalHost = "";
  try {
    externalHost = new URL(appUrl).host;
  } catch {
    // Fallback: no forwarded host
  }

  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: externalHost
          ? {
              "X-Forwarded-Host": externalHost,
              "X-Forwarded-Proto": "https",
            }
          : {},
      },
    }
  );
}
