// Business-Pipeline-Adapter-Types (DEC-029, FEAT-014).
// Pipeline-Push in bestehende Business-Pipeline "Lead-Generierung" / Stage "Neu".

export interface PipelinePushRequest {
  leadId: string;
  campaignId: string;
  pitchId?: string | null;
  pipelineName?: string;
  stageName?: string;
  payload: PipelinePushPayload;
}

export interface PipelinePushPayload {
  companyName: string;
  domain: string;
  industry?: string;
  contactName?: string;
  contactEmail?: string;
  triggerSignalsMatched: string[];
  campaignTitle: string;
  pitchSummary?: string;
}

export interface PipelinePushResult {
  status: "pushed" | "duplicate" | "failed";
  businessDealId?: string;
  errorMessage?: string;
}

export interface BusinessDealStatus {
  businessDealId: string;
  status: "acknowledged" | "converted" | "rejected" | "active";
  updatedAt: string;
}
