/**
 * Brand Profile Server Actions (FEAT-008 / SLC-102 MT-2).
 * Next.js "use server" wrapper um Repository — Auth-Check + Error-Mapping.
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import {
  saveBrandProfile,
  getActiveBrandProfile,
  listChangelog,
  BrandProfileValidationError,
  type BrandProfileRow,
  type ChangelogEntry,
} from "./repository";
import type { BrandProfileData } from "@/lib/brand/schema";

export interface SaveActionResult {
  success: boolean;
  version?: number;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export type LoadActionResult =
  | { success: true; profile: BrandProfileRow | null }
  | { success: false; error: string };

export type ChangelogActionResult =
  | { success: true; entries: ChangelogEntry[] }
  | { success: false; error: string };

/**
 * Server Action: speichert Brand Profile.
 *
 * V1 single-tenant: jeder authenticated User wirkt als strategaize_admin.
 * V8+ wird die Rolle scharf gemacht (DEC-023).
 */
export async function saveBrandProfileAction(
  input: BrandProfileData
): Promise<SaveActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Nicht eingeloggt" };
  }

  try {
    const result = await saveBrandProfile(input, user.id);
    return { success: true, version: result.version };
  } catch (e) {
    if (e instanceof BrandProfileValidationError) {
      return {
        success: false,
        error: "Validierung fehlgeschlagen",
        fieldErrors: e.fieldErrors,
      };
    }
    const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: liest aktives Brand Profile.
 *
 * Result-Pattern (ISSUE-009): konsistent mit `saveBrandProfileAction`.
 * `profile=null` bedeutet "noch kein Profile angelegt".
 */
export async function getActiveBrandProfileAction(): Promise<LoadActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Nicht eingeloggt" };
  }

  try {
    const profile = await getActiveBrandProfile();
    return { success: true, profile };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: listet Changelog-Eintraege fuer das aktive Brand Profile.
 * Result-Pattern (ISSUE-009).
 */
export async function listBrandProfileChangelogAction(
  limit = 50
): Promise<ChangelogActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Nicht eingeloggt" };
  }

  try {
    const profile = await getActiveBrandProfile();
    if (!profile) {
      return { success: true, entries: [] };
    }
    const entries = await listChangelog(profile.id, limit);
    return { success: true, entries };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
    return { success: false, error: msg };
  }
}
