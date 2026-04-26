# SLC-108 — Lead Handoff (Pipeline-Push) + Performance-Capture-Loop

## Status
- Version: V1
- Status: planned
- Priority: High
- Created: 2026-04-26
- Worktree: mandatory (`worktree/slc-108-lead-handoff`)
- Feature: FEAT-014 (Backlog: BL-013)

## Pre-Implementation-Bridge
**BL-027 Business-System Coordination-Sprint ist Pre-Condition fuer V1-Final-Check / Go-Live**, NICHT fuer SLC-108-Implementation. SLC-108 wird mit Feature-Flag `BUSINESS_PIPELINE_PUSH_ENABLED=false` implementiert und manual-mode-deployt. Nach Abschluss BL-027: Flag auf `true`, Smoke-Test gegen Business-API, Final-Check freigegeben.

**BL-027-Status muss vor V1-Final-Check verifiziert sein.** SLC-108 selbst kann ohne BL-027 implementiert + per Manual-Mode gebraucht werden.

## Goal
Schliesst die Marketing-Schleife mit zwei zusammengehoerigen Mechaniken:
1. **Lead-Handoff via Pipeline-Push** (Feature-Flag-gated, manual-mode V1-default): qualifizierte Leads als Deals in Business-Pipeline `Lead-Generierung` Stage `Neu` pushen, Idempotency, Status-Sync zurueck via Cron-Pull
2. **Performance-Capture-Loop** mit 10-Sek-UX nach Posting + LinkedIn-Ads-CSV-Adapter + **Few-shot-Loop scharf machen** (loest SLC-103-Stub ab) → Top-2-Performer als Few-shot in naechste Generation

## In Scope
- `businessPipelineAdapter` Implementation: HTTP-Client gegen Business-System POST `/api/internal/deals` mit Bearer-Token, Idempotency-Key, Retry-Logic
- Feature-Flag `BUSINESS_PIPELINE_PUSH_ENABLED` Logic — bei `false` Manual-Mode, bei `true` Auto-Push
- `linkedinAdsCsvAdapter` Implementation: CSV-Parser, Mapping CSV → `asset_performance`, manuelle Asset-ID-Zuordnung-UI
- Worker-Job-Erweiterung: Cron-getriggerter `business_status_pull` (taeglich) — Worker-Handler liest Business-API + aktualisiert `handoff_event.status`
- Few-shot-Loader: scharfe Implementation in `src/prompts/asset/shared/few-shot-loader.ts` (loest SLC-103-Stub ab)
- Routen: `/handoffs` (Layout5 Liste), `/handoffs/dashboard` (Layout1 KPI-Dashboard mit Conversion-Rate-Funnel), Lead-Detail-Erweiterung Handoff-History-Tab
- Performance-Capture-UI: 10-Sek-Pop-Up nach Status-Wechsel auf `veroeffentlicht` (3 Pflichtfelder: posted_at, channel, cost_eur), Asset-Detail-Performance-Tab (Edit + Spaeter-Eingabe von impressions/clicks/leads_generated)
- "An Pipeline pushen"-Button im Lead-Detail mit Pre-Check (Pflichtfelder, Pitch existiert, Lead-Status `qualified`)
- "Manuell als gepusht markieren"-Button als Fallback (V1-Default solange Flag=false)
- Batch-Trigger: "Alle Leads im Status `qualified` der letzten X Tage pushen"
- Cron-Job-Setup `business-status-pull` (taeglich 07:00) via Coolify-Cron auf `POST /api/cron/business-status-pull`

## Out of Scope (V1)
- Auto-Trigger via Lead-Score (V3+, FEAT-013)
- Webhook-Empfang fuer Status-Sync (V2 Erweiterung — V1 nur Cron-Pull)
- Bidirektionale Sync ueber andere Felder als Status (V5+)
- Lead-Reaktivierung (V8+)
- Multi-Destination-Handoff (V9+)
- Auto-Tracking aus E-Mail-Open/Click (V2)
- Auto-Tracking aus LinkedIn-Posting (V4)
- KI-Auto-Klassifikation Top/Mid/Low (V5)
- A/B-Statistik mit Signifikanz (V5)

## Acceptance Criteria

### Lead-Handoff (Pipeline-Push)
- Manueller Trigger funktioniert: Lead als qualifiziert markieren + Klick → Handoff-Event erzeugt + (wenn Flag=true) Pipeline-Push ausgeloest
- Pipeline-Push erzeugt Deal in Business `Lead-Generierung` Stage `Neu` — verifiziert ueber Business-API-Smoke-Test (mind. 1 erfolgreicher Push **nach BL-027** = V1-Acceptance)
- Idempotency funktioniert: Doppel-Push wird durch UNIQUE `(lead_id, campaign_id)` verhindert
- Status-Sync via Cron-Pull aktualisiert IS-Handoff-Status
- Manueller Fallback funktioniert (User markiert manuell, Idempotency-Key trotzdem geschrieben)
- Conversion-Rate-Dashboard berechnet korrekt
- Lead-Status-Statemaschine `qualified → pushed → acknowledged|rejected|converted` funktioniert
- Pre-Check bei "An Pipeline pushen": fehlende Pflichtfelder zeigen klare Fehlermeldung

### Performance-Capture
- Performance-Felder pro Asset eingebbar (`posted_at`, `channel`, `cost_eur` Pflicht beim `veroeffentlicht`-Status)
- 10-Sek-Pop-Up nach Posting funktioniert
- LinkedIn-Ads-CSV-Import funktioniert (mind. 1 Test-Import in V1-Acceptance)
- Spaetere Werte (impressions/clicks/leads_generated) nachtraeglich erfassbar
- **Few-shot-Loop scharf**: Bei Asset-Request gleichen Output-Typs werden Top-2-Performer eingespeist (verifizierbar via Prompt-Inspection in `asset_version.metadata.fewshot_used`)
- Performance-Dashboard pro Campaign / Output-Typ / Asset zeigt korrekte Aggregationen
- ENV `PERFORMANCE_FEWSHOT_N` greift (Default 2, anpassbar)

## Micro-Tasks

### MT-1: `businessPipelineAdapter` Implementation
- Goal: HTTP-Client mit Idempotency + Retry
- Files: `src/adapters/business-pipeline/client.ts`, `src/adapters/business-pipeline/types.ts`, `__tests__/adapters/business-pipeline/client.test.ts`
- Expected behavior:
  - `pushLead(payload: PushPayload, idempotencyKey: string): Promise<{ businessDealId: string }>` macht POST auf `${BUSINESS_API_BASE_URL}/api/internal/deals` mit `Authorization: Bearer ${BUSINESS_API_TOKEN}`, `X-Idempotency-Key: ${idempotencyKey}`
  - Payload: title, contact_name, contact_email, company, lead_source_data (JSON), expected_close_date, idempotency_key, plus pipeline_name + stage_name aus ENV
  - Retry: 3 Versuche mit exp. Backoff bei 5xx oder Network-Error, kein Retry bei 4xx
  - Audit-Log + Cost-Tracker (Cost=0, Self-Hosted) via Shared-Helper
- Verification: Tests mit Mock-HTTP (msw): Erfolgreicher Push, Idempotency-Header, Retry-Path, 4xx-Error
- Dependencies: SLC-101 (Adapter-Skeleton)
- TDD: Pflicht

### MT-2: Cron-Pull-Handler `business_status_pull`
- Goal: Taeglicher Pull der Business-Deal-Stati
- Files: `src/adapters/business-pipeline/status-pull.ts`, `worker/handlers/businessStatusPull.ts`, `src/app/api/cron/business-status-pull/route.ts`, `__tests__/worker/handlers/businessStatusPull.test.ts`
- Expected behavior:
  - Coolify-Cron-Endpoint POST `/api/cron/business-status-pull` erzeugt `ai_jobs`-Eintrag mit Type `business_status_pull`
  - Worker-Handler ruft `GET ${BUSINESS_API_BASE_URL}/api/export/deals?pipeline=Lead-Generierung&since=${last_sync}` (READ-only existing Endpoint, EXPORT_API_KEY-Auth)
  - Mappt Business-Deal-Stati zurueck auf IS-`handoff_event.status` (acknowledged / rejected / converted / dead)
  - Schreibt `last_sync` in eigene `sync_state`-Tabelle oder als Konfiguration in `audit_log`
  - Skip wenn Feature-Flag `BUSINESS_PIPELINE_PUSH_ENABLED=false`
- Verification: Test mit Mock-Business-API: 5 Deal-Status-Updates → 5 handoff_event-Updates
- Dependencies: MT-1 + SLC-101
- TDD: Pflicht

### MT-3: Server Actions Handoff
- Goal: Manuell + Auto-Push via Server Actions
- Files: `src/server/handoff/actions.ts`, `src/server/handoff/repository.ts`, `__tests__/server/handoff/actions.test.ts`
- Expected behavior:
  - `triggerHandoff(leadId, campaignId, pitchId)`:
    - Pre-Check: Lead.status='qualified', Pflichtfelder vorhanden
    - Erzeugt `handoff_event` mit Status `pending`, Idempotency-Key
    - Wenn Feature-Flag aktiv: Push via `businessPipelineAdapter`, Status → `pushed`, schreibt `business_deal_id`, setzt `lead.business_deal_id` + `lead.status='pushed'`
    - Wenn Flag inaktiv: Status bleibt `pending` mit `mechanism='manual'`, UI zeigt "Bitte manuell anlegen"
  - `markAsManuallyPushed(handoffEventId, businessDealId)`: User-Action wenn manuell angelegt
  - `triggerHandoffBatch(leadIds[], campaignId)`: Parallele Verarbeitung mit Cap (max 50/Batch)
- Verification: Tests fuer beide Flag-Modi, Batch, Idempotency-Konflikt-Behandlung
- Dependencies: MT-1 + SLC-105 (Lead-Statemachine)
- TDD: Pflicht

### MT-4: Performance-Capture-UI (10-Sek-Pop-Up + Performance-Tab)
- Goal: User erfasst Performance-Daten effizient
- Files: `src/components/asset/PostedPopup.tsx`, `src/components/asset/PerformanceTab.tsx`, `src/components/asset/PerformanceForm.tsx`, `src/server/asset/performanceActions.ts`, `__tests__/server/asset/performanceActions.test.ts`
- Expected behavior:
  - Pop-Up triggered bei Status-Wechsel `freigegeben → veroeffentlicht`: 3 Pflichtfelder (`posted_at`, `channel`, `cost_eur`) — schnell ausfuellbar (Datepicker, Channel-Dropdown, Number-Input)
  - Performance-Tab in Asset-Detail: Listet alle `asset_performance`-Eintraege (1:n moeglich) mit Edit-Action fuer impressions/clicks/leads_generated/notes
  - Reminder-Notification (V1 Light): Asset-Detail zeigt Banner "Performance-Daten unvollstaendig" wenn `entered_at` > 7 Tage alt und impressions=NULL
- Verification: E2E: Asset auf `veroeffentlicht` setzen → Pop-Up erscheint → 3 Felder ausfuellen → Save → Performance-Tab zeigt Eintrag → Spaeter impressions nachtragen
- Dependencies: SLC-103 (Asset-Detail)

### MT-5: `linkedinAdsCsvAdapter` Implementation
- Goal: CSV-Import fuer LinkedIn-Ads-Reports
- Files: `src/adapters/linkedin-ads-csv/parser.ts`, `src/adapters/linkedin-ads-csv/mapper.ts`, `src/components/asset/LinkedinAdsCsvImport.tsx`, `__tests__/adapters/linkedin-ads-csv/*.test.ts`
- Expected behavior:
  - Parser: LinkedIn-Standard-CSV-Format → Roh-Records
  - Mapper: Pro Record Asset-ID-Zuordnung via UI-Mapping-Schritt (Asset-ID-Tag im Ad-Name oder Manual-Drop-Down)
  - Schreibt `asset_performance`-Eintraege mit `channel='linkedin_ads'`, mappt impressions/clicks/cost_eur
- Verification: Test-CSV (10 Zeilen LinkedIn-Standard-Schema) korrekt geparst, Mapping-Schritt zu 5 Test-Assets, 5 `asset_performance`-Eintraege geschrieben
- Dependencies: SLC-101 (Adapter-Skeleton)
- TDD: Pflicht

### MT-6: Few-shot-Loop scharf machen
- Goal: Top-2-Performer-Query in `few-shot-loader.ts` ersetzt Stub
- Files: `src/prompts/asset/shared/few-shot-loader.ts` (Update aus SLC-103), `__tests__/prompts/asset/shared/few-shot-loader.test.ts`
- Expected behavior:
  - Query gemaess DEC-027:
    ```sql
    SELECT a.id, av.markdown_content, ap.leads_generated, ap.cost_eur
    FROM asset_performance ap
    JOIN asset a ON a.id = ap.asset_id
    JOIN asset_version av ON av.id = a.current_version_id
    WHERE a.output_type = $1 AND ap.leads_generated > 0
    ORDER BY (ap.leads_generated::float / GREATEST(ap.cost_eur, 1)) DESC
    LIMIT $2 (default ENV PERFORMANCE_FEWSHOT_N=2)
    ```
  - Bei `leads_generated = 0` oder NULL: leerer Return (kalter Start)
  - Schreibt fewshot-Snapshot in `asset_version.metadata.fewshot_used` (Asset-IDs + Snippet-Hashes) — siehe DEC-027
- Verification: Tests:
  - (a) Empty State: keine Performance-Daten → leeres Array
  - (b) 5 Assets mit Performance → Top-2 nach Ratio zurueckgegeben
  - (c) Sort-Order korrekt (kleinerer Cost = besseres Ratio = oben)
- Dependencies: MT-4 (Performance-Daten existieren), SLC-103 (Stub existiert)
- TDD: Pflicht

### MT-7: Routen `/handoffs` + `/handoffs/dashboard`
- Goal: Handoff-Inbox + KPI-Dashboard
- Files: `src/app/[locale]/handoffs/page.tsx`, `src/app/[locale]/handoffs/dashboard/page.tsx`, `src/components/handoff/HandoffList.tsx`, `src/components/handoff/HandoffDashboard.tsx`, `src/server/handoff/dashboardQueries.ts`
- Expected behavior:
  - `/handoffs` Layout5: Liste mit Filter (Status, Campaign, Zeitraum, Mechanism)
  - `/handoffs/dashboard` Layout1: KPI-Karten:
    - Conversion-Funnel: qualified → pushed → acknowledged → converted (Counter + Prozent)
    - Cost-per-Push (sum cost_eur / count pushes)
    - Cost-per-Conversion
    - Top-Campaigns nach Conversion-Rate
- Verification: Dashboard rendert mit Live-Daten (V1 anfangs leer, fuellt sich nach ersten Pushes)
- Dependencies: MT-3 + SLC-101 Style-Guide

### MT-8: Lead-Detail "An Pipeline pushen"-Button + Handoff-History-Tab
- Goal: Trigger im Lead-Detail
- Files: `src/components/lead/PushToPipelineButton.tsx`, `src/components/lead/HandoffHistoryTab.tsx`
- Expected behavior:
  - Button mit Pre-Check (Lead.status='qualified', Pitch existiert)
  - Modal: Campaign + Pitch + Begleit-Notiz waehlen (Multi-Select bei Campaign falls Lead in mehreren)
  - Bei Flag=false: zeigt explizit "Manual-Mode aktiv" und ruft `markAsManuallyPushed` mit Modal "Business-Deal-ID eintragen"
  - History-Tab listet alle handoff_events des Leads mit Status + Business-Deal-Link
- Verification: E2E: Lead qualifizieren, pushen-Klick, Modal, Submit, History-Tab zeigt Eintrag
- Dependencies: MT-3 + SLC-105 (Lead-Detail)

### MT-9: RLS-Tests + Idempotency-Tests + Cost-Audit
- Goal: Sicherheit + DB-Constraints
- Files: `__tests__/migrations/handoff_event_rls.test.ts`, `__tests__/migrations/handoff_event_idempotency.test.ts`, `__tests__/integration/businessPipelineAdapter-audit.test.ts`
- Expected behavior:
  - RLS-Matrix
  - UNIQUE `(lead_id, campaign_id)` greift (zweiter Insert schlaegt fehl)
  - audit_log nach Push-Adapter-Call existiert
- Verification: Tests gruen
- Dependencies: MT-1 + MT-3
- TDD: Pflicht

## TDD-Policy
- **Pflicht-TDD:** businessPipelineAdapter (MT-1), Cron-Pull-Handler (MT-2), Handoff-Server-Actions inkl. Idempotency (MT-3), linkedinAdsCsvAdapter (MT-5), Few-shot-Loop (MT-6), RLS+Idempotency+Audit (MT-9)
- **Empfohlen-TDD:** Performance-Actions (MT-4)
- **Nicht-TDD:** UI-Komponenten (MT-7, MT-8)

## Risiken
- **R1 BL-027 verzoegert sich → V1-Final-Check blockiert**: Mitigation: BL-027 als Coordination-Sprint im Business-Repo parallel zur V1-IS-Implementation. SLC-108 selbst ist Flag-gated, deploybar ohne BL-027. Final-Check setzt BL-027 voraus.
- **R2 Idempotency-Race-Conditions**: Bei parallelen Trigger-Versuchen (z. B. zwei User klicken gleichzeitig) koennten 2 Push-Calls passieren. Mitigation: UNIQUE-Constraint DB-seitig + ON CONFLICT DO NOTHING in Insert + 409-Handling im Adapter.
- **R3 Few-shot-Daten-Quality bei kaltem Start**: V1-Anfang hat keine Performance-Daten → Few-shot leer → kein Differentiator. Mitigation: ist gewollt (kalter Start), Differentiator wird mit den ersten Performance-Daten aktiv. UI-Banner kommuniziert "Few-shot wird aktiv ab erstem Performance-Eintrag".
- **R4 LinkedIn-CSV-Format-Drift**: LinkedIn aendert evtl. Spalten-Schema. Mitigation: Adapter-Tests gegen aktuelles Format-Schema-Snapshot, Spalten-Mismatch zeigt klare Fehlermeldung.
- **R5 Cron-Pull-Authentifizierung**: Existing GET `/api/export/deals` nutzt `EXPORT_API_KEY`, nicht `INTERNAL_API_TOKEN`. Mitigation: Cron-Pull liest mit `EXPORT_API_KEY`, Push schreibt mit `INTERNAL_API_TOKEN` — beide ENV separat.

## Worktree
Mandatory. Branch `worktree/slc-108-lead-handoff`. Begruendung: Cross-System-Integration (Business-API), kritischer Closed-Loop-Schluss. Nach `/qa SLC-108` mergen.

## Verifikations-Schritte (vor `/qa`)
1. `npm run build && npm run lint && npm run typecheck`
2. `npm run test`
3. E2E Manual-Mode: Lead qualifizieren, "Pushen"-Klick, Modal, "manuell als gepusht markieren", Handoff-Event existiert
4. E2E Auto-Mode (nur wenn BL-027 fertig): Flag setzen, push-Klick, Business-API erhaelt Call, Deal-ID kommt zurueck, IS speichert
5. Cron-Pull Smoke: Test-Endpoint manuell triggern, Mock-Business-API liefert 3 Status-Updates, IS-handoff_events aktualisiert
6. Performance-Capture: Asset auf `veroeffentlicht`, Pop-Up, Daten eingeben, Asset-Detail-Performance-Tab zeigt
7. LinkedIn-Ads-CSV: Test-Import funktioniert
8. Few-shot-Loop: Asset-Request fuer Output-Typ mit existierenden Performance-Daten → Prompt enthaelt Top-2-Snippets (verifizierbar via Worker-Log oder `asset_version.metadata.fewshot_used`)
9. Idempotency-Test: Doppel-Push schlaegt mit klarem Error fehl

## Pre-Final-Check-Bridge
Vor `/final-check V1`: BL-027 abgeschlossen (Business-System POST `/api/internal/deals` live), Smoke-Test mit echtem Business-API erfolgreich, Feature-Flag `BUSINESS_PIPELINE_PUSH_ENABLED=true`, mind. 1 erfolgreicher Pipeline-Push verifiziert. Erst dann `/final-check V1`.

## Recommended Next Step
Nach `/qa SLC-108`: Gesamt-`/qa V1` ueber alle 8 Slices, dann BL-027-Check, dann `/final-check V1`.

## Referenzen
- FEAT-014 (Lead Handoff + Performance-Capture Spec)
- ARCHITECTURE.md A.3.6 (handoff_event), A.5.3 (businessPipelineAdapter), A.5.4 (linkedinAdsCsvAdapter), A.7 (Routen), A.8 (Cron-Job)
- DEC-022 (Pipeline-Push), DEC-026 (asset_performance separate Tabelle), DEC-027 (Few-shot N=2 Ratio), DEC-029 (Coordination-Sprint)
- ISSUE-002 (Business-System hat keinen POST-Endpoint)
- BL-027 Backlog-Item (Business-System-Sprint)
- SLC-103 (Few-shot-Loader-Stub, hier scharf), SLC-105 (Lead), SLC-106 (Pitch), SLC-107 (Campaign)
