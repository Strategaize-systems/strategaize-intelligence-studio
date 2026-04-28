// Clay-CSV-Adapter-Types (FEAT-015).
// Manueller CSV-Upload, kein Runtime-API-Call.

export interface ClayCsvRow {
  companyName: string;
  domain: string;
  industry?: string;
  country?: string;
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  linkedinUrl?: string;
  phone?: string;
  triggerSignals?: string[];
  raw?: Record<string, unknown>;
}

export interface ClayCsvParseResult {
  rows: ClayCsvRow[];
  schemaErrors: ClayCsvSchemaError[];
  duplicatesWithin: number; // dedupe within file
}

export interface ClayCsvSchemaError {
  rowIndex: number;
  message: string;
}
