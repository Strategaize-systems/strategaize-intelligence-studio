# SLC-008 — FEAT-005 Opportunity & Decision basic

## Status
- Version: V1
- Feature: BL-006 / FEAT-005
- Priority: High
- Status: planned
- Created: 2026-04-16
- Worktree isolation: empfohlen (`slc-008-opportunity`)

## Goal
Opportunity-CRUD mit 4 Pflicht + 7 optionalen Bewertungs-Dimensionen, KI-Bewertung via Bedrock (asynchron via Worker), Decision-Board (Kanban) mit Status-Workflow und Audit-Log.

Dies ist der größte V1-Slice: KI-Call-Pipeline wird hier zum ersten Mal produktiv durchlaufen. `bedrockAdapter` wird vom Skeleton (SLC-001) zur vollen Implementierung erweitert.

## In Scope
- `/opportunities` Kanban-Board (Layout 4) nach Status (`draft | in_review | decided | in_execution | closed | parked`)
- `/opportunities/new` Create-Form mit Modal (Custom-Layout für Detail-Feel)
- `/opportunities/[id]` Detail-Ansicht mit Dimensions-Bewertung (4 Pflicht + 7 optional ausklappbar)
- 11 Bewertungs-Dimensionen pro Opportunity, jede mit Text + Score 1–5
- `bedrockAdapter.scoreOpportunity(opp_data, dimensions, optional_brand_context=null)` — Skeleton aus SLC-001 jetzt produktiv
- Worker-Handler `handlers/opportunityScoring.ts` — asynchron, schreibt `ai_score` + `ai_reference` in `opportunity_dimension_value`
- UI zeigt „Bewertung läuft …" mit Polling auf `ai_jobs.status`
- Decision-Board Kanban mit Drag-&-Drop (Status-Wechsel per Click reicht in V1, Drag-&-Drop stretch)
- Decision-Log pro Opportunity: Timeline aller Status-Wechsel mit Kommentar-Feld + Actor
- Verknüpfung: Opportunity ↔ KUs (aus SLC-007 „Zu Opportunity ableiten"), Opportunity ↔ Kunden (optional)
- `audit_log`-Eintrag bei jedem Status-Wechsel

## Out of Scope
- Auto-Abgeleitete Opportunities aus KU-Mustern (V2)
- KI-Entscheidungsempfehlungen (V2)
- Auto-Trigger in Nachbarsystemen (V2)
- Portfolio-Bewertung mit Summen/Gewichtungen (V3)
- Parallele Freigabe-Ketten (V3)

## Acceptance Criteria (aus FEAT-005)
- AC-01: Opportunity < 2 min erfassbar (4 Pflicht-Dimensionen)
- AC-02: KI-Bewertungsvorschlag nachvollziehbar (Prompt + Antwort als Referenz in `ai_reference`)
- AC-03: Decision-Board zeigt alle Opportunities nach Status (Kanban)
- AC-04: Status-Wechsel erzeugt Log-Eintrag (Nutzer, Zeitpunkt, Kommentar optional)
- AC-05: Detail zeigt alle verknüpften KUs + Kunden
- AC-06: Optional-Dimensionen nachträglich ergänzbar
- AC-07: KI-Bewertung läuft asynchron, UI zeigt Status
- AC-08: `ai_cost_ledger` erhält Eintrag pro Bedrock-Call

## Dependencies
- SLC-001 (`bedrockAdapter`-Skeleton + `ai_jobs` + `ai_cost_ledger`)
- SLC-002 (Layout 4 Kanban + Modal + Form-Komponenten)
- SLC-006 (Customer-Link-Ziel)
- SLC-007 (KU-Link-Ziel + „Zu Opportunity ableiten"-Flow)

## Risks
- Bedrock-Aufruf-Kosten — `ai_cost_ledger` muss korrekt erfassen; ENV `BEDROCK_MAX_COST_USD_PER_DAY` als Notbremse (optional V1)
- Prompt-Engineering: 4 Pflicht-Dimensionen = 4 strukturierte Bewertungs-Slots — Claude-Output muss JSON-parseable sein. Fallback: wenn Parse-Fehler, Job als `failed` markieren + `ai_reference` speichern.
- Polling-Overhead: UI pollt `ai_jobs.status` alle 3s mit Timeout 90s. Supabase-Realtime als Nice-to-Have (V2).
- Drag-&-Drop in V1 optional, Status-Wechsel per Klick reicht als MVP
- 11 Dimensionen in UI: Layout muss übersichtlich bleiben (Accordion für Optional-Dimensionen)

## Micro-Tasks

### MT-1: Opportunity-CRUD + Pflicht-Dimensionen
- Goal: Create-/Edit-/Delete-UI + Form mit 4 Pflicht-Dimensionen (Text + Score 1–5). Kanban-Board-Liste.
- Files: `apps/web/src/app/(app)/opportunities/page.tsx`, `OpportunityKanban.tsx`, `OpportunityCard.tsx`, `apps/web/src/app/(app)/opportunities/new/page.tsx`, `OpportunityForm.tsx`, `opportunityFormSchema.ts` (zod), `apps/web/src/lib/data/opportunity-queries.ts`, API-Routes unter `apps/web/src/app/api/opportunities/...`.
- Expected behavior: Kanban nach Status, Form-Validierung, CREATE/UPDATE funktioniert.
- Verification: Browser-Test End-to-End.
- Dependencies: SLC-002 Kanban + Modal.

### MT-2: Detail-Ansicht + Optional-Dimensionen
- Goal: `/opportunities/[id]`-Detail, Optional-Dimensionen als Accordion, Inline-Edit, verknüpfte KUs + Kunden.
- Files: `apps/web/src/app/(app)/opportunities/[id]/page.tsx`, `OpportunityDetail.tsx`, `DimensionSection.tsx`, `KULinkSection.tsx`, `CustomerLinkSection.tsx`.
- Expected behavior: Optional-Dimensionen ausklappbar, Inline-Edit speichert.
- Verification: Browser-Test.
- Dependencies: MT-1, SLC-007 (KU-Daten).

### MT-3: bedrockAdapter produktiv + Prompt
- Goal: `scoreOpportunity(opp_data, dimensions, brand_context=null)` via AWS Bedrock Claude Sonnet, strukturierter Prompt, JSON-Output mit 4 Dimensionen + Score + Reasoning.
- Files: `apps/web/src/adapters/bedrockAdapter.ts` (Erweiterung), `apps/web/src/adapters/prompts/scoreOpportunity.ts`, `apps/web/src/adapters/bedrockAdapter.test.ts` (Unit-Tests gegen Mock).
- Expected behavior: Call gegen Bedrock liefert validierbares JSON. `ai_cost_ledger`-Eintrag wird geschrieben.
- Verification: Unit-Tests + manueller Integration-Test mit echter Bedrock-Credential.
- Dependencies: SLC-001 MT-5.

### MT-4: Worker-Handler `opportunity_scoring`
- Goal: Handler liest `opp_id` aus Job-Payload, ruft `bedrockAdapter` auf, UPSERT-t `opportunity_dimension_value` mit `ai_score` + `ai_reference`, schreibt `ai_cost_ledger`, updatet `ai_jobs.status='done'`.
- Files: `apps/worker/src/handlers/opportunityScoring.ts`, `apps/worker/src/handlers/opportunityScoring.test.ts`, `apps/worker/src/jobDispatcher.ts` (Eintrag).
- Expected behavior: Job-Dauer < 60s bei normalem Bedrock-Response.
- Verification: Manueller Job-INSERT + DB-Check.
- Dependencies: MT-3.

### MT-5: UI-KI-Bewertung-Trigger + Polling
- Goal: Button „KI-Bewertung vorschlagen" erzeugt `ai_jobs`-Eintrag. UI pollt `ai_jobs.status` alle 3s, Timeout 90s, danach „Bedrock lief lange, bitte Status-Seite prüfen".
- Files: `apps/web/src/app/(app)/opportunities/[id]/AIScoreButton.tsx`, `apps/web/src/app/api/ai-jobs/[id]/route.ts`, `apps/web/src/lib/hooks/useAIJobPolling.ts`.
- Expected behavior: Button → Job → nach < 60s werden KI-Scores angezeigt.
- Verification: Browser-Test.
- Dependencies: MT-4.

### MT-6: Decision-Log + Audit-Trail
- Goal: Bei jedem Status-Wechsel `decision_log`-Row + `audit_log`-Row. Timeline in Detail-Ansicht.
- Files: `apps/web/src/app/(app)/opportunities/[id]/DecisionTimeline.tsx`, `apps/web/src/lib/data/decision.ts`, API-Route für Status-Change.
- Expected behavior: Status-Wechsel UI → DB-Update + Log. Timeline zeigt Actor + Comment + Zeitstempel.
- Verification: Browser-Test.
- Dependencies: MT-2.

### MT-7: RLS + Cost-Cap
- Goal: RLS-Tests (Admin darf cross-Tenant lesen, Member nicht). Optional: ENV-Flag `BEDROCK_DAILY_COST_USD_CAP` — wenn > Cap, Job als `failed` mit Error `COST_CAP_REACHED`.
- Files: `apps/web/src/lib/data/opportunity.test.ts`, `apps/worker/src/lib/costCap.ts`.
- Expected behavior: Test greift, Cap schlägt an wenn überschritten.
- Verification: SAVEPOINT-Test, Unit-Test für Cost-Cap.
- Dependencies: MT-4.

## Verification
- `/qa` nach Slice-Abschluss — besonders kritisch wegen KI-Pipeline
- Bedrock-Integration-Test mit echten Credentials (in Coolify-Staging-ENV)
- Cost-Ledger-Audit (alle Calls erfasst?)
- Browser-Test End-to-End inkl. KI-Bewertung

## Next Slice
SLC-009 FEAT-006 Cross-Kunden-Learnings.
