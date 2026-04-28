import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side Supabase client. Verwendet die internal SUPABASE_URL (Docker-Network),
// faellt zurueck auf NEXT_PUBLIC_SUPABASE_URL nur als letzte Defensive
// (siehe backend.md skill: server-side immer SUPABASE_URL bevorzugen).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from Server Component — silently ignore
          }
        },
      },
    }
  );
}
