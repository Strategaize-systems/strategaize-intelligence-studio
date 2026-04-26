# SLC-105 — Lead Research (Firecrawl + Clay-CSV + Manual)

## Status
- Version: V1
- Status: planned
- Priority: High
- Created: 2026-04-26
- Worktree: mandatory (`worktree/slc-105-lead-research`)
- Feature: FEAT-015 (Backlog: BL-014)

## Pre-Implementation-Bridge
**BL-028 Firecrawl Self-Host-Setup auf Hetzner muss abgeschlossen sein, bevor SLC-105 Implementation startet.** Das ist Pre-Condition: ENV `FIRECRAWL_API_BASE_URL` + `FIRECRAWL_API_KEY` zeigen auf laufenden Self-Hosted Firecrawl-Container. Smoke-Test (kleiner Crawl) erfolgreich. SLC-105 kann ohne BL-028 nicht implementiert werden, weil Adapter ohne erreichbaren Endpoint nicht testbar ist.

## Goal
Wiederholbare Lead-Recherche mit drei Quellen: `firecrawlAdapter` (Self-Host, Primary), `clayCsvAdapter` (Fallback, offline-CSV), `manual` (UI-Form). Lead-Pool als Datenquelle fuer Segment-Live-Query (SLC-104), Pitch-Generation (SLC-106) und Pipeline-Push (SLC-108). Duplikat-Erkennung ueber `(domain, contact_email)`.

## In Scope
- `firecrawlAdapter` Implementation: HTTP-Client gegen Self-Hosted Firecrawl-Endpoint, Query-Builder von Segment-Filter → Firecrawl-Query, Mapping Roh-Daten → `lead`-Felder
- `clayCsvAdapter` Implementation: CSV-Parser mit Schema-Validierung, Mapping CSV → `lead`-Felder, Schema-Vorlage zum Download
- Manuelle Lead-Eintragung via UI-Form (alle Pflicht- + Optional-Felder)
- Duplikat-Check beim Insert: Query auf `(domain, COALESCE(contact_email, ''))` — Update statt Insert bei Match (merge `enrichment_data`, `tags`, `notes`)
- Worker-Job `lead_research_run` Implementation
- `research_run`-Tracking: Status, Cost, lead-counts (found/new/duplicate), provider_query als JSONB
- Routen: `/leads` (Layout3 List), `/leads/[id]` (Detail), `/research-runs` (Layout5 mit Status), Segment-Detail-Erweiterung "Recherchieren mit Firecrawl"-Button
- Cost-Cap pro Research-Run: ENV `RESEARCH_RUN_COST_CAP_EUR` (default 5)
- Lead-Status-Statemaschine: `new → qualified → pushed → acknowledged|rejected|converted|dead`

## Out of Scope (V1)
- Auto-Disqualifier-Regeln (V3)
- Lead-Scoring (V3 regelbasiert, V5+ KI)
- Voll-Firecrawl-Webhook + Auto-Scheduling (V3)
- Clay-API-Integration (V3, DEC-012 Voll-Variant)
- Enrichment-on-Demand mit zusaetzlichen Datenquellen (V3)
- Multi-Source-Merge-Logic (V5+)
- 6-Research-Typen-Workflow aus altem FEAT-012 (V7)
- Cloud-Firecrawl (US-gehostet, verboten DEC-028)

## Acceptance Criteria
- `firecrawlAdapter` macht erfolgreichen Smoke-Crawl gegen Self-Host: Test-Segment generiert mind. 5 Leads
- `clayCsvAdapter` importiert Test-CSV (mind. 10 Zeilen) korrekt
- Manuelle Lead-Anlage funktioniert mit allen Feldern
- Duplikat-Erkennung greift: zweiter Insert mit gleicher `(domain, contact_email)` fuehrt zu Update (Merge), nicht zu neuem Eintrag
- Lead-Pool-Liste `/leads` mit Filter (Segment, Status, Source, Branche, Tag) funktioniert
- Lead-Detail zeigt: alle Felder, zugehoerige Research-Run, zugehoerige Segmente (Live-Query), Pitch-Tab-Stub (V1 leer bis SLC-106)
- Research-Run-Liste zeigt Cost + Status + Lead-Counts
- Cost-Tracking in `ai_cost_ledger` pro Firecrawl-Run (auch wenn `cost_usd=0` wegen Self-Host, dann `notes='self_hosted'`)
- Cost-Cap greift: Run, der Cap ueberschreitet, wird abgebrochen mit Status `failed` + Error-Message
- Audit-Log: Pro Adapter-Call ein `audit_log`-Eintrag mit Provider, Endpoint, Modell, Zeitstempel, Request-ID
- Lead-Status-Statemaschine: erlaubte Uebergaenge funktionieren, unerlaubte werden geblockt
- RLS: tenant_admin schreibt, tenant_member liest

## Micro-Tasks

### MT-1: `firecrawlAdapter` Implementation
- Goal: HTTP-Client + Query-Builder + Response-Mapping
- Files: `src/adapters/firecrawl/client.ts`, `src/adapters/firecrawl/query-builder.ts`, `src/adapters/firecrawl/response-mapper.ts`, `__tests__/adapters/firecrawl/*.test.ts`
- Expected behavior:
  - `crawl(query: FirecrawlQuery): Promise<FirecrawlResult>` macht POST auf `${FIRECRAWL_API_BASE_URL}/v1/scrape` (oder gemaess Self-Host-Endpoint-Spec) mit Bearer-Token
  - Query-Builder: `buildQueryFromSegment(segment: Segment, icp: Icp): FirecrawlQuery` — wandelt Segment-Filter in Firecrawl-Search-Query (Branche-Keywords, Region, Size-Hints, Trigger-Keywords)
  - Response-Mapper: `mapResultsToLeads(result: FirecrawlResult, segmentId: string): Partial<Lead>[]`
  - Audit + Cost-Tracking via `shared/audit-logger.ts` + `cost-tracker.ts` (SLC-101)
  - Error-Handling: 4xx → Error mit User-Message, 5xx → Retry mit exp. Backoff
- Verification: Tests mit Mock-HTTP-Client (msw oder nock) — verifizieren: korrekter Request, Response-Mapping, Audit-Log-Schreibung, Cost-Tracking-Schreibung, Error-Handling.
- Dependencies: SLC-101 (Adapter-Skeleton + Shared-Helper), BL-028 (laufendes Firecrawl)
- TDD: Pflicht

### MT-2: `clayCsvAdapter` Implementation
- Goal: CSV-Parser mit Schema-Validation
- Files: `src/adapters/clay-csv/parser.ts`, `src/adapters/clay-csv/schema.ts`, `__tests__/adapters/clay-csv/parser.test.ts`
- Expected behavior:
  - `parseClayCsv(buffer: Buffer): { leads: Partial<Lead>[], errors: ValidationError[] }`
  - Erwartete Spalten dokumentiert in `schema.ts` (gemaess Clay-Standard-Format)
  - Spalten-Mismatch → in `errors` mit Zeile + Feld
  - Trim/Normalize von Whitespace + Lowercase fuer email/domain
- Verification: Tests:
  - (a) Valider CSV → 10 Leads korrekt geparst
  - (b) Fehlende Pflichtspalte → ValidationError, leads-Array leer
  - (c) Ungueltige Email-Format-Zeile → Lead trotzdem geparst (Email als optional), aber Warning in errors
- Dependencies: SLC-101 (Adapter-Skeleton)
- TDD: Pflicht

### MT-3: Lead-Repository + Duplikat-Check
- Goal: Insert-or-Merge-Logic
- Files: `src/server/lead/repository.ts`, `__tests__/server/lead/repository.test.ts`
- Expected behavior:
  - `insertOrUpdateLead(input: Partial<Lead>): Promise<{ leadId: string, action: 'inserted' | 'updated' }>`
  - Duplikat-Check via `(domain, COALESCE(contact_email, ''))`
  - Bei Update: Merge `enrichment_data` (JSONB-Merge), Append-Unique `tags`, Concat `notes` mit Trennlinie
  - Transaction-safe (READ + INSERT/UPDATE in einer Transaction)
- Verification: Tests:
  - (a) Erst-Insert mit `(domain.de, mail@x)` → action='inserted'
  - (b) Zweiter Insert mit gleicher Kombi → action='updated', enrichment_data merged
  - (c) Insert mit `(domain.de, NULL)` und dann mit `(domain.de, mail@x)` → 2 separate Eintraege (NULL als ''-Coalesce)
- Dependencies: SLC-101
- TDD: Pflicht

### MT-4: Worker-Handler `leadResearchRun`
- Goal: Asynchrone Research-Run-Ausfuehrung
- Files: `worker/handlers/leadResearchRun.ts`, `__tests__/worker/handlers/leadResearchRun.test.ts`
- Expected behavior:
  - Liest `segment_id` + `provider` aus Job-Payload
  - Setzt `research_run.status='running'`, `started_at=now()`
  - Provider=`firecrawl`: ruft `firecrawlAdapter.crawl()`
  - Provider=`clay_csv`: liest Storage-CSV und ruft `clayCsvAdapter.parse()` auf
  - Mappt Ergebnisse, ruft `insertOrUpdateLead()` pro Lead, zaehlt new/duplicate
  - Setzt `research_run.status='completed'`, `completed_at`, `leads_found`, `leads_new`, `leads_duplicate`, `cost_eur`
  - Cost-Cap-Check: wenn `cost_eur > RESEARCH_RUN_COST_CAP_EUR` → Abbruch mit Status `failed` + Error
- Verification: Handler-Test mit Mocks fuer Adapter + Repository — verifiziert: Status-Lifecycle, Counter, Cost-Cap-Branching, Error-Path
- Dependencies: MT-1 + MT-2 + MT-3
- TDD: Pflicht

### MT-5: UI-Routen `/leads` + `/leads/[id]` + `/research-runs`
- Goal: Lead-Pool-UI + Lead-Detail + Research-Run-Liste
- Files: `src/app/[locale]/leads/page.tsx`, `src/app/[locale]/leads/[id]/page.tsx`, `src/app/[locale]/leads/new/page.tsx`, `src/app/[locale]/research-runs/page.tsx`, `src/components/lead/LeadList.tsx`, `src/components/lead/LeadDetail.tsx`, `src/components/lead/LeadForm.tsx`, `src/components/lead/ResearchRunList.tsx`
- Expected behavior:
  - `/leads` Layout3 mit Filter (Segment via FK-Lookup, Status, Source, Industry, Tag), Volltext-Search ueber company_name + contact_name
  - `/leads/[id]` Custom Layout: Lead-Daten + Tabs (Pitches V1 leer, Handoff-History V1 leer, Notes, Tags)
  - `/leads/new` Manual-Form mit Pflichtfeld-Validation
  - `/research-runs` Layout5 mit Status-Filter
- Verification: 10 Test-Leads anlegen (manual + via CSV-Import), Filter funktioniert, Detail zeigt korrekte Daten
- Dependencies: MT-3 + SLC-101 Style-Guide

### MT-6: Segment-Detail-Erweiterung "Recherchieren mit Firecrawl" + CSV-Import-UX
- Goal: Trigger-Buttons im Segment-Detail
- Files: `src/components/segment/SegmentResearchActions.tsx`, `src/app/[locale]/api/segments/[id]/research/route.ts`, `src/app/[locale]/api/segments/[id]/import-csv/route.ts`
- Expected behavior:
  - "Recherchieren mit Firecrawl"-Button: erzeugt `research_run` + `ai_jobs`-Eintrag, redirectet auf `/research-runs/[id]` mit Live-Status
  - "Clay-CSV importieren"-Button: File-Upload (multipart/form-data) → speichert CSV in Supabase Storage → erzeugt `research_run` mit provider=`clay_csv`
  - Cost-Schaetzung-Vorschau vor Firecrawl-Start: Anzahl-Pages-Estimate × EUR-pro-Page
  - "Manuell hinzufuegen"-Button: redirectet auf `/leads/new?segmentId=...`
- Verification: E2E mit Mock-Firecrawl: Klick → Job ausgeloest → Status-Polling zeigt Progress → fertig mit Lead-Count
- Dependencies: MT-4 + MT-5

### MT-7: Lead-Status-Statemaschine
- Goal: Erlaubte Uebergaenge enforcen
- Files: `src/lib/lead/statemachine.ts`, `__tests__/lib/lead/statemachine.test.ts`
- Expected behavior:
  - Map erlaubter Uebergaenge: `new → qualified | dead`, `qualified → pushed | dead`, `pushed → acknowledged | rejected | converted`, `acknowledged → converted | rejected | dead`
  - `canTransition(from: LeadStatus, to: LeadStatus): boolean`
  - `transitionLead(leadId, to)`-Action validiert + schreibt
- Verification: Tests fuer alle erlaubten + 5 unerlaubten Uebergaenge
- Dependencies: keine
- TDD: Pflicht (state-machine-Logik)

### MT-8: RLS-Tests + audit_log + ai_cost_ledger Verifikation
- Goal: Sicherheits- + Audit-Verifikation
- Files: `__tests__/migrations/{lead,research_run}_rls.test.ts`, `__tests__/integration/firecrawl-audit.test.ts`
- Expected behavior:
  - RLS-Matrix pro Tabelle pro Rolle
  - audit_log: nach Mock-Adapter-Call existiert Eintrag mit korrektem Provider/Endpoint
  - ai_cost_ledger: nach Run existiert Eintrag mit `provider='firecrawl'`, `notes='self_hosted'`
- Verification: Alle Tests gruen
- Dependencies: MT-1 + MT-3 + MT-4
- TDD: Pflicht

## TDD-Policy
- **Pflicht-TDD:** Adapter (MT-1, MT-2), Repository + Duplikat-Logic (MT-3), Worker-Handler (MT-4), Statemachine (MT-7), RLS + Audit (MT-8)
- **Empfohlen-TDD:** Cost-Cap-Branching (Teil MT-4), Server-Actions in MT-6
- **Nicht-TDD:** UI-Komponenten (MT-5, MT-6)

## Risiken
- **R1 BL-028 Self-Host-Setup verzoegert sich**: Mitigation: BL-028 ist Pre-Condition, in eigener Session vor SLC-105-Start. Fallback: clayCsvAdapter + Manual-Mode reichen technisch fuer Acceptance ohne Firecrawl, aber Acceptance-Criterion "Test-Segment >=5 Leads" verlangt Firecrawl.
- **R2 Firecrawl-API-Schema-Drift**: Self-Host-Version vs. erwartete API koennte abweichen. Mitigation: Adapter-Tests gegen Mock-Server, BL-028-Smoke-Test verifiziert echtes Schema, dokumentiert in `docs/spec-references/firecrawl-self-host-api.md` falls neu.
- **R3 Duplikat-Logik bei NULL-Email-Coalesce**: Tricky Edge-Case. Mitigation: Test-Coverage MT-3 (c).
- **R4 Cost-Eskalation bei Self-Host**: Self-Host = Fixkosten, aber Crawl-Volumen kann Server-CPU stressen. Mitigation: ENV-Cap + zusaetzlich Rate-Limit-Layer im Adapter (max N parallel Crawls).

## Worktree
Mandatory. Branch `worktree/slc-105-lead-research`. Begruendung: Risiko-Slice (Adapter, Self-Host-Touch). Nach `/qa SLC-105` mergen.

## Verifikations-Schritte (vor `/qa`)
1. BL-028 abgeschlossen verifiziert: Self-Hosted Firecrawl erreichbar, Smoke-Crawl OK
2. `npm run build && npm run lint && npm run typecheck`
3. `npm run test`
4. E2E mit echtem Self-Host: Segment anlegen, "Recherchieren" → mind. 5 Leads in Pool
5. CSV-Import-Smoke: Test-CSV mit 10 Zeilen, alle korrekt importiert, 1 Duplikat erkannt
6. Manuelle Anlage funktioniert
7. audit_log + ai_cost_ledger zeigen Eintraege

## Recommended Next Step
Nach `/qa SLC-105`: `/backend SLC-106` (Messaging-Variation).

## Referenzen
- FEAT-015 (Lead Research Spec)
- ARCHITECTURE.md A.3.3 (lead, research_run), A.5.1 (firecrawlAdapter), A.5.2 (clayCsvAdapter), A.7 (Routen)
- DEC-009 (Adapter-Pattern), DEC-012 (Clay V3+ API), DEC-028 (Firecrawl Self-Host)
- ISSUE-003 (Firecrawl-Cloud verletzt Data-Residency)
- BL-028 Backlog-Item (Self-Host-Setup)
- SLC-101 (Adapter-Skeleton + Shared-Helper), SLC-104 (Segment + Filter-Executor)
