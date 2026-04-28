// Zentrale audit_log-Schreibung fuer alle Adapter (DEC-009).
// Schreibt jeden externen Adapter-Call mit Provider/Endpoint/Zeitstempel.

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export interface AuditLogEntry {
  eventType: string; // 'adapter_call' | 'rls_denied' | ...
  source: string; // 'firecrawlAdapter' | ...
  actorId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("audit_log").insert({
      event_type: entry.eventType,
      source: entry.source,
      actor_id: entry.actorId ?? null,
      target_type: entry.targetType ?? null,
      target_id: entry.targetId ?? null,
      metadata: entry.metadata ?? {},
    });
    if (error) {
      logger.warn("audit_log insert failed", {
        source: "audit-logger",
        error: error.message,
      });
    }
  } catch (e) {
    logger.warn("audit_log write threw", {
      source: "audit-logger",
      error: (e as Error).message,
    });
  }
}
