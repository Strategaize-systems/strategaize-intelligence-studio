// Clay-CSV-Schema-Definition + Mapping zu lead-Tabellen-Spalten.
// Skeleton — Impl in SLC-105.

import { z } from "zod";

export const ClayCsvRowSchema = z.object({
  "Company Name": z.string().min(1),
  Domain: z.string().min(1),
  Industry: z.string().optional(),
  Country: z.string().optional(),
  "Contact Name": z.string().optional(),
  "Contact Role": z.string().optional(),
  "Contact Email": z.string().email().optional(),
  "LinkedIn URL": z.string().url().optional(),
  Phone: z.string().optional(),
  "Trigger Signals": z.string().optional(), // semicolon-separated
});

export type ClayCsvRawRow = z.infer<typeof ClayCsvRowSchema>;
