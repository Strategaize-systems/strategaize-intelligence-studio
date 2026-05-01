/**
 * Brand Profile Repository (FEAT-008 / SLC-102 MT-2).
 *
 * Singleton-Insert/Update + Versions-Inkrement + Changelog-Schreibung.
 * Verwendet ServiceRole-Client (admin.ts) — Schreiben auf brand_profile ist
 * konzeptionell strategaize_admin-only (DEC-023). V1 single-tenant, daher
 * Server-Action prueft Authentifizierung, RLS deckt zusaetzlich (V8+ wird die
 * Rolle-Trennung scharf gemacht).
 */
import { createAdminClient } from "@/lib/supabase/admin";
import {
  brandProfileDataSchema,
  SECTION_KEYS,
  type BrandProfileData,
  type SectionKey,
} from "@/lib/brand/schema";

export interface BrandProfileRow {
  id: string;
  template_id: string | null;
  is_active: boolean;
  version: number;
  data: BrandProfileData;
  updated_at: string;
  updated_by: string | null;
}

export interface ChangelogEntry {
  id: string;
  brand_profile_id: string;
  version_from: number;
  version_to: number;
  jsonb_path_changed: string | null;
  old_value: unknown;
  new_value: unknown;
  changed_at: string;
  changed_by: string | null;
}

export interface SaveResult {
  version: number;
  changedSectionKeys: SectionKey[];
}

export class BrandProfileValidationError extends Error {
  fieldErrors: Record<string, string[]>;
  constructor(fieldErrors: Record<string, string[]>) {
    super("Brand Profile Validation Failed");
    this.name = "BrandProfileValidationError";
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Liest die aktive Brand-Profile-Zeile (Singleton) aus der DB.
 * Liefert null, wenn noch kein Profile existiert.
 */
export async function getActiveBrandProfile(): Promise<BrandProfileRow | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("brand_profile")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`getActiveBrandProfile: ${error.message}`);
  }
  return (data as BrandProfileRow | null) ?? null;
}

/**
 * Saves a brand profile (insert oder update der aktiven Zeile).
 * Validiert via Zod. Schreibt Changelog-Eintraege fuer geaenderte Sektionen.
 *
 * @param input — Volles Brand Profile gemaess Zod-Schema
 * @param userId — UUID des speichernden Users (fuer Audit)
 * @returns Neue Version + Liste geaenderter Sektion-Keys
 */
export async function saveBrandProfile(
  input: unknown,
  userId: string | null
): Promise<SaveResult> {
  const parsed = brandProfileDataSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    throw new BrandProfileValidationError(fieldErrors);
  }

  const validData: BrandProfileData = parsed.data;
  const supabase = createAdminClient();
  const existing = await getActiveBrandProfile();

  if (!existing) {
    // Erst-Insert: version=1, kein Changelog
    const { data, error } = await supabase
      .from("brand_profile")
      .insert({
        is_active: true,
        version: 1,
        data: validData,
        updated_by: userId,
      })
      .select("version")
      .single();

    if (error) {
      throw new Error(`saveBrandProfile insert: ${error.message}`);
    }
    return { version: data.version, changedSectionKeys: [] };
  }

  // Update + Changelog
  const newVersion = existing.version + 1;
  const changedSectionKeys = computeChangedSections(existing.data, validData);

  const { error: updateError } = await supabase
    .from("brand_profile")
    .update({
      data: validData,
      version: newVersion,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    })
    .eq("id", existing.id);

  if (updateError) {
    throw new Error(`saveBrandProfile update: ${updateError.message}`);
  }

  if (changedSectionKeys.length > 0) {
    const changelogRows = changedSectionKeys.map((key) => ({
      brand_profile_id: existing.id,
      version_from: existing.version,
      version_to: newVersion,
      jsonb_path_changed: `sections.${key}`,
      old_value: existing.data.sections[key],
      new_value: validData.sections[key],
      changed_by: userId,
    }));

    const { error: clError } = await supabase
      .from("brand_profile_changelog")
      .insert(changelogRows);

    if (clError) {
      throw new Error(`saveBrandProfile changelog: ${clError.message}`);
    }
  }

  return { version: newVersion, changedSectionKeys };
}

/**
 * Vergleicht alte und neue Sections und gibt geaenderte Section-Keys zurueck.
 * V1: Top-Level-Vergleich pro Sektion via JSON.stringify (deterministisch
 * dank konsistenter Key-Reihenfolge im Zod-Schema). Nested-Path-Diff ist
 * V2+ Scope (R1-Risiko der Slice-Spec).
 */
export function computeChangedSections(
  oldData: BrandProfileData,
  newData: BrandProfileData
): SectionKey[] {
  const changed: SectionKey[] = [];
  for (const key of SECTION_KEYS) {
    const a = JSON.stringify(oldData.sections[key]);
    const b = JSON.stringify(newData.sections[key]);
    if (a !== b) changed.push(key);
  }
  return changed;
}

/**
 * Listet Changelog-Eintraege einer Brand-Profile-Zeile, neueste zuerst.
 */
export async function listChangelog(
  brandProfileId: string,
  limit = 50
): Promise<ChangelogEntry[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("brand_profile_changelog")
    .select("*")
    .eq("brand_profile_id", brandProfileId)
    .order("changed_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`listChangelog: ${error.message}`);
  }
  return (data ?? []) as ChangelogEntry[];
}
