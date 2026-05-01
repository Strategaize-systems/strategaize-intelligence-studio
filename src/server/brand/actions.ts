/**
 * Brand Profile Server Actions (FEAT-008 / SLC-102 MT-2).
 * Next.js "use server" wrapper um Repository — Auth-Check + Error-Mapping.
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import {
  saveBrandProfile,
  getActiveBrandProfile,
  BrandProfileValidationError,
  type BrandProfileRow,
} from "./repository";
import type { BrandProfileData } from "@/lib/brand/schema";

export interface SaveActionResult {
  success: boolean;
  version?: number;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

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
 * Gibt null zurueck wenn noch kein Profile existiert.
 */
export async function getActiveBrandProfileAction(): Promise<BrandProfileRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Nicht eingeloggt");
  }

  return getActiveBrandProfile();
}
