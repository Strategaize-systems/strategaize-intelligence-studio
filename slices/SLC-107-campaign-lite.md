# SLC-107 — Campaign Management LITE

## Status
- Version: V1
- Status: planned
- Priority: High
- Created: 2026-04-26
- Worktree: optional
- Feature: FEAT-011 (Backlog: BL-012)

## Goal
Parent-Campaign als Klammer fuer Asset-Set + Lead-Set + Pitch-Set in einem Zeitfenster (V1 ohne Channel-Segments / Variants — die kommen V4). Wizard fuehrt durch 7 Schritte, Detail aggregiert Performance ueber alle zugeordneten Assets, n:m-Verknuepfungstabellen verbinden Campaign mit Assets/Leads/Pitches.

## In Scope
- Campaign-Routen `/campaigns` (Layout4 Kanban ueber Status), `/campaigns/new` (Wizard), `/campaigns/[id]` (Detail mit Tabs)
- 7-Step-Wizard: 1) Titel+Ziel+Zeitfenster, 2) ICP+Segment, 3) Asset-Set, 4) Lead-Set, 5) Pitch-Set, 6) Erfolgssignale+Verantwortlicher, 7) Speichern (Entwurf oder direkt aktiv)
- Status-Workflow: `entwurf | aktiv | abgeschlossen | abgebrochen`
- n:m-Verknuepfungen via `campaign_asset`, `campaign_lead`, `campaign_pitch`
- Performance-Aggregation in Detail-Ansicht (V1: Posts gesamt, Impressions gesamt, Clicks gesamt, Leads-generated gesamt, Cost gesamt, Cost-per-Lead, Pipeline-Pushes — letzteres erst SLC-108 mit Daten gefuellt)
- Server Actions `createCampaign`, `updateCampaign`, `deleteCampaign`, `addAssetToCampaign`, `removeAssetFromCampaign` (analog fuer lead/pitch)
- Validation: `start_at < end_at` CHECK-Constraint + App-Layer-Pflicht-Set fuer aktive Kampagnen
- Performance-View `view_campaign_performance` (On-the-fly-Query, kein Materialized View V1)

## Out of Scope (V1)
- Channel-Segments + Variants (V4)
- High-Attention-Outreach (physischer Brief + Call) (V4)
- Tatsaechliches Publishing auf Kanaelen (V2/V4)
- A/B-Auswertung (V5)
- Auto-Empfehlung aus Opportunities (V7+)
- Kampagnen-Klonen / Templates (V9+)
- Budget-Tracking mit echten Kosten (V5+)
- Workflow-Automation (V7+)

## Acceptance Criteria
- Parent-Campaign mit allen V1-Pflichtfeldern anlegbar
- ICP + Segment-Verknuepfung funktioniert
- Asset-Set / Lead-Set / Pitch-Set-Zuordnung funktioniert (n:m)
- Status-Workflow durchgaengig (entwurf → aktiv → abgeschlossen → abgebrochen)
- Wizard fuehrt durch 7 Schritte mit Inline-Validation (kein Step-Skip ohne Pflichtfelder)
- Detail-Ansicht zeigt aggregierte Performance korrekt (V1: meiste Werte 0 bis SLC-108 scharf)
- `start_at < end_at` Constraint enforced
- RLS: tenant_admin schreibt, tenant_member liest

## Micro-Tasks

### MT-1: Zod-Schema + Server Actions Campaign
- Goal: Campaign-CRUD mit Validation
- Files: `src/lib/campaign/schema.ts`, `src/server/campaign/actions.ts`, `src/server/campaign/repository.ts`, `__tests__/server/campaign/*.test.ts`
- Expected behavior:
  - Zod-Schema: title, goal, icp_id, segment_id, start_at, end_at, success_signals (text[], min 1), status, owner_id Pflicht
  - `start_at < end_at` Validation in Schema + DB-CHECK
  - Status-Transitions enforced (entwurf → aktiv → abgeschlossen | abgebrochen, abgebrochen ist terminal)
  - Actions: CRUD + getCampaignById + listCampaigns
- Verification: Tests fuer Schema-Validation + Status-Transitions
- Dependencies: SLC-104 (ICP/Segment IDs)
- TDD: Pflicht (Validation + Statemachine)

### MT-2: n:m-Verknuepfungs-Actions
- Goal: Asset/Lead/Pitch zu Campaign hinzufuegen/entfernen
- Files: `src/server/campaign/membershipActions.ts`, `__tests__/server/campaign/membershipActions.test.ts`
- Expected behavior:
  - `addAssetToCampaign(campaignId, assetId)` — ON CONFLICT DO NOTHING
  - `removeAssetFromCampaign(campaignId, assetId)`
  - Analog fuer Lead + Pitch
  - Batch-Variante: `addAssetsToCampaign(campaignId, assetIds[])`
- Verification: Tests fuer Add (idempotent), Remove, Batch
- Dependencies: MT-1
- TDD: Empfohlen

### MT-3: 7-Step-Wizard-UI
- Goal: Step-by-Step-Anlage einer Campaign
- Files: `src/app/[locale]/campaigns/new/page.tsx`, `src/components/campaign/CampaignWizard.tsx`, `src/components/campaign/wizard/Step1Basics.tsx`, `Step2IcpSegment.tsx`, `Step3Assets.tsx`, `Step4Leads.tsx`, `Step5Pitches.tsx`, `Step6Signals.tsx`, `Step7Review.tsx`
- Expected behavior:
  - State-Management ueber alle Steps (React Hook Form + Wizard-Reducer oder URL-State)
  - Inline-Validation pro Step, "Weiter" disabled bei Pflichtfeld-Mangel
  - Multi-Select-Pickers fuer Asset/Lead/Pitch (Modal mit Filter)
  - Step 7: Review zeigt alle Eingaben mit Edit-Links pro Step + "Als Entwurf speichern" / "Direkt aktivieren"
- Verification: E2E: Wizard durchklicken, Validation greift, Save funktioniert, Detail zeigt Werte
- Dependencies: MT-1 + MT-2 + SLC-101 Style-Guide

### MT-4: Campaign-List `/campaigns` (Layout4 Kanban)
- Goal: Kanban-Board ueber Status
- Files: `src/app/[locale]/campaigns/page.tsx`, `src/components/campaign/CampaignKanban.tsx`, `src/components/campaign/CampaignCard.tsx`
- Expected behavior:
  - 4 Status-Spalten (entwurf / aktiv / abgeschlossen / abgebrochen)
  - Pro Karte: Title, ICP-Badge, Zeitfenster, Performance-Mini-Stats
  - Status-Wechsel via Drag-and-Drop ODER Click-Action (V1 Click reicht — DnD ist Polish)
- Verification: 5 Test-Campaigns in verschiedenen Status, Kanban rendert korrekt
- Dependencies: MT-1

### MT-5: Campaign-Detail mit Tabs + Performance-Aggregation
- Goal: Detail-Seite
- Files: `src/app/[locale]/campaigns/[id]/page.tsx`, `src/components/campaign/CampaignDetail.tsx`, `src/components/campaign/AssetsTab.tsx`, `LeadsTab.tsx`, `PitchesTab.tsx`, `PerformanceTab.tsx`, `src/server/campaign/performanceQueries.ts`
- Expected behavior:
  - Tabs: Overview (Basics + Status-Actions), Assets, Leads, Pitches, Performance
  - Performance-Tab zeigt aggregierte Werte ueber alle `campaign_asset`-FK-Zeilen via `asset_performance`-Join
  - Aggregation-Query: SUM(impressions/clicks/leads_generated/cost_eur), Cost-per-Lead = cost_eur / NULLIF(leads_generated, 0)
  - V1: Pipeline-Pushes-Counter aus `handoff_event`-Tabelle (V1 leer bis SLC-108)
- Verification: Test-Campaign mit 3 Assets + 5 Leads, Performance-Tab zeigt Aggregation (V1 mit 0-Werten korrekt)
- Dependencies: MT-1 + MT-2

### MT-6: RLS-Tests + Constraint-Tests
- Goal: Sicherheits- + DB-Constraint-Verifikation
- Files: `__tests__/migrations/{campaign,campaign_asset,campaign_lead,campaign_pitch}_rls.test.ts`, `__tests__/migrations/campaign_constraints.test.ts`
- Expected behavior:
  - RLS-Matrix
  - CHECK `start_at < end_at` greift (Insert mit invertiertem Datum schlaegt fehl)
  - n:m-PRIMARY-KEY-Constraints greifen (Doppel-Insert fehlschlaegt)
- Verification: Tests gruen
- Dependencies: SLC-101 (Migration)
- TDD: Pflicht

## TDD-Policy
- **Pflicht-TDD:** Schema + Status-Transitions (MT-1), RLS + Constraints (MT-6)
- **Empfohlen-TDD:** Membership-Actions (MT-2), Performance-Aggregation-Query (MT-5)
- **Nicht-TDD:** Wizard-UI (MT-3), Kanban-UI (MT-4)

## Risiken
- **R1 Wizard-State-Management-Komplexitaet**: 7 Steps mit Cross-Step-Validation. Mitigation: React Hook Form mit Schema-Resolver pro Step + Reducer fuer Aggregat.
- **R2 Performance-Query bei vielen Assets/Leads**: Aggregation kann teuer werden. Mitigation: V1 keine Materialized View — bei < 100 Assets pro Campaign akzeptabel. V5 Materialized View bei Bedarf.
- **R3 Pflicht-Felder-Blanace fuer "aktiv"**: Status-Wechsel auf aktiv darf nicht ohne mind. 1 Asset / 1 Lead passieren. Mitigation: Inline-Pre-Check vor Status-Switch.

## Worktree
Optional. Empfohlen falls parallel mit anderem Slice.

## Verifikations-Schritte (vor `/qa`)
1. `npm run build && npm run lint && npm run typecheck`
2. `npm run test`
3. E2E: Wizard fuer Campaign mit 2 Assets + 3 Leads + 1 Pitch durchklicken, speichern, Detail zeigt alle Verknuepfungen
4. Status-Workflow: Entwurf → Aktiv → Abgeschlossen
5. Performance-Tab zeigt 0-Werte korrekt (V1 leer bis SLC-108)

## Recommended Next Step
Nach `/qa SLC-107`: `/backend SLC-108` (Lead Handoff + Performance-Capture). Davor: BL-027 Status checken (Coordination-Sprint im Business-Repo, Pre-Condition fuer Final-Check).

## Referenzen
- FEAT-011 (Campaign Management LITE Spec)
- ARCHITECTURE.md A.3.5 (campaign + n:m), A.7 (Routen)
- DEC-004 (Campaign-Modell strukturell V4-Voll), in V1 nur Parent-Subset
- SLC-103 (Assets), SLC-104 (ICP/Segment), SLC-105 (Leads), SLC-106 (Pitches)
