// LinkedIn-Ads-CSV-Adapter-Types (FEAT-014, A.5.4).
// Offline-CSV-Upload, manuelle Asset-ID-Zuordnung.

export interface LinkedinAdsCsvRow {
  adName: string;
  impressions: number;
  clicks: number;
  spendEur: number;
  raw?: Record<string, unknown>;
}

export interface LinkedinAdsCsvParseResult {
  rows: LinkedinAdsCsvRow[];
  schemaErrors: { rowIndex: number; message: string }[];
}

export interface LinkedinAdsAssetMapping {
  adName: string;
  assetId: string;
  channel: string; // "linkedin_ads_personal" | "linkedin_ads_company" | ...
}
