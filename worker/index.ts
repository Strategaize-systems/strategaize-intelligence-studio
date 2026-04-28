// Worker-Entry: pollt ai_jobs (SKIP LOCKED), dispatcht zum Handler.
// DEC-008: gemeinsamer Node.js-Container mit Job-Type-Dispatching.

import { getDbClient, closeDbClient } from "./db";
import { dispatchJob, listRegisteredHandlers } from "./jobDispatcher";
import type { AiJob } from "./types";

const POLL_MS = parseInt(process.env.AI_WORKER_POLL_MS ?? "5000", 10);
const SHUTDOWN_TIMEOUT_MS = 30_000;

let isShuttingDown = false;

async function fetchNextJob(): Promise<AiJob | null> {
  const db = await getDbClient();
  // SKIP LOCKED Polling — claim einen pending Job atomar.
  const result = await db.query<AiJob>(`
    UPDATE ai_jobs
    SET status = 'running',
        started_at = now(),
        attempts = attempts + 1
    WHERE id = (
      SELECT id FROM ai_jobs
      WHERE status = 'pending' AND scheduled_at <= now()
      ORDER BY scheduled_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING *
  `);
  return result.rows[0] ?? null;
}

async function markCompleted(jobId: string): Promise<void> {
  const db = await getDbClient();
  await db.query(
    `UPDATE ai_jobs SET status='completed', completed_at=now() WHERE id=$1`,
    [jobId]
  );
}

async function markFailed(
  jobId: string,
  errorMessage: string,
  attempts: number,
  maxAttempts: number
): Promise<void> {
  const db = await getDbClient();
  const status = attempts >= maxAttempts ? "failed" : "pending";
  await db.query(
    `UPDATE ai_jobs
     SET status=$2,
         error_message=$3,
         completed_at=CASE WHEN $2='failed' THEN now() ELSE NULL END,
         scheduled_at=CASE WHEN $2='pending' THEN now() + interval '30 seconds' ELSE scheduled_at END
     WHERE id=$1`,
    [jobId, status, errorMessage]
  );
}

async function pollOnce(): Promise<boolean> {
  const job = await fetchNextJob();
  if (!job) return false;

  console.log(
    `[worker] dispatching job=${job.id} type=${job.job_type} attempt=${job.attempts}`
  );
  try {
    await dispatchJob(job);
    await markCompleted(job.id);
    console.log(`[worker] completed job=${job.id}`);
  } catch (e) {
    const msg = (e as Error).message;
    console.error(`[worker] failed job=${job.id}: ${msg}`);
    await markFailed(job.id, msg, job.attempts, job.max_attempts);
  }
  return true;
}

async function loop(): Promise<void> {
  console.log(
    `[worker] started — polling every ${POLL_MS}ms — handlers: ${listRegisteredHandlers().join(", ")}`
  );

  while (!isShuttingDown) {
    try {
      const dispatched = await pollOnce();
      if (!dispatched) {
        await new Promise((r) => setTimeout(r, POLL_MS));
      }
    } catch (e) {
      console.error(`[worker] poll-loop error: ${(e as Error).message}`);
      await new Promise((r) => setTimeout(r, POLL_MS));
    }
  }

  console.log("[worker] shutdown complete");
  await closeDbClient();
}

function setupShutdown() {
  const shutdown = (signal: string) => {
    if (isShuttingDown) return;
    console.log(`[worker] received ${signal} — finishing current job`);
    isShuttingDown = true;
    setTimeout(() => {
      console.warn("[worker] shutdown timeout reached, exiting");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

setupShutdown();
loop().catch((e) => {
  console.error("[worker] fatal:", e);
  process.exit(1);
});
