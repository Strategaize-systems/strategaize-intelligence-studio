// Worker-Types (mirror of ai_jobs row + job-handler-signature).

export type AiJobType =
  | "ingest_onboarding"
  | "ingest_business"
  | "opportunity_scoring"
  | "business_status_pull"
  | "asset_generation"
  | "pitch_generation"
  | "lead_research_run";

export type AiJobStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface AiJob {
  id: string;
  job_type: AiJobType;
  status: AiJobStatus;
  payload: Record<string, unknown>;
  result?: Record<string, unknown> | null;
  error_message?: string | null;
  attempts: number;
  max_attempts: number;
  scheduled_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  template_id?: string | null;
  created_at: string;
  created_by?: string | null;
}

export type JobHandler = (job: AiJob) => Promise<void>;
