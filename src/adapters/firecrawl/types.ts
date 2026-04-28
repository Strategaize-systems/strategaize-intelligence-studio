// Firecrawl-Adapter-Types (DEC-028 self-hosted on Hetzner).

export interface FirecrawlCrawlRequest {
  segmentId: string;
  query: FirecrawlQuery;
  costCapEur?: number;
}

export interface FirecrawlQuery {
  triggerSignals: string[];
  industries?: string[];
  countries?: string[];
  companySizeBands?: string[];
  pagesLimit?: number;
}

export interface FirecrawlLeadHit {
  companyName: string;
  domain: string;
  industry?: string;
  country?: string;
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  linkedinUrl?: string;
  triggerSignalsMatched: string[];
  enrichmentData?: Record<string, unknown>;
}

export interface FirecrawlCrawlResult {
  providerRunId: string;
  leadsFound: number;
  hits: FirecrawlLeadHit[];
  costEur: number;
  warnings: string[];
}
