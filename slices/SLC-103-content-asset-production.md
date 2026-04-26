# SLC-103 — Content Asset Production (7 Output-Typen)

## Status
- Version: V1
- Status: planned
- Priority: High
- Created: 2026-04-26
- Worktree: optional
- Feature: FEAT-009 (Backlog: BL-010)

## Goal
Asynchrone KI-Erzeugung von Content-Assets in 7 Output-Typen mit Skill-spezifischen Bedrock-Prompt-Buildern, Asset-Bibliothek mit Versionierung und Status-Workflow, Cost-Tracking + Brand-Profile-Snapshot pro Generation. Stellt das Generations-Pattern bereit, das in SLC-106 (Pitch) wiederverwendet wird.

Hinweis: **Few-shot-Loop** wird in SLC-103 als Hook-Punkt vorbereitet (Loader-Modul + Query-Stub), die scharfe Integration mit echten Performance-Daten kommt erst in SLC-108 (FEAT-014). Bis dahin wird Few-shot mit leerem Array aufgerufen (kalter Start).

## In Scope
- Asset-Request-Workflow: UI-Form fuer 7 Output-Typen + Quell-Objekt-Selektor (V1: ICP/Segment/Lead/Pitch/Campaign — Lead/Pitch erst nach SLC-105/106 nutzbar, andere ab sofort)
- Worker-Job `asset_generation` Implementation in `worker/handlers/assetGeneration.ts`
- 7 Bedrock-Prompt-Builder unter `src/prompts/asset/{blogpost,linkedin,onepager,email,casecard,landingpage,websitespec}.ts`
- Skill-spezifische Prompt-Architektur gemaess `docs/spec-references/output-type-skill-mapping.md` (Brand-Profile-Sektion-Hervorhebung pro Skill)
- Few-shot-Loader-Modul `src/prompts/asset/shared/few-shot-loader.ts` (mit Stub-Query, scharf in SLC-108)
- Asset-Bibliothek-Routen `/assets` (Layout3 Grid mit Filter), `/assets/[id]` (Detail mit Versions-Tab + Performance-Tab-Stub)
- Status-Workflow: `entwurf | ueberarbeitet | freigegeben | veroeffentlicht | verworfen` mit Status-Transitions
- Versionierung: jede Aenderung erzeugt neue `asset_version`, Diff-Ansicht zwischen Versionen
- Markdown-Export pro Asset (Single + Batch-ZIP)
- Re-Generate-Button mit gleichem oder geaendertem Briefing
- Cost-Tracking pro Generation in `ai_cost_ledger`, Brand-Profile-Version-Snapshot in `asset.brand_profile_version_snapshot`
- Volltext-Suche ueber `asset_version.markdown_content`, `asset.briefing_note`, `asset.tags`

## Out of Scope (V1)
- Direktes Publishing auf Kanaelen (E-Mail = V2, LinkedIn = V4)
- Multi-Sprachen-Output (V9+)
- Video/Carousel/Praesentation-Output (V9+)
- Auto-Variant-Generierung (V5)
- Asset-Scoring (V5+)
- Auto-Empfehlung zu Briefings (V7)
- KU/Opportunity als Quell-Objekte (V6)
- Few-shot-Loop scharf — Integration mit echten Performance-Daten kommt SLC-108

## Acceptance Criteria
- Asset-Request kann fuer alle 7 Output-Typen erstellt werden — UI-Form validiert Output-Typ + Quell-Objekt + optionales Briefing
- Worker generiert Asset asynchron — Status-Polling von UI funktioniert (Polling auf `asset.status` oder `asset_request.status`)
- Pro Output-Typ wird der Skill-spezifische Prompt-Builder aufgerufen — verifizierbar via `asset_version.metadata.skill_used`
- Brand-Profile (FEAT-008) wird als Kontext mitgegeben — verifizierbar via `metadata.brand_profile_version_snapshot` in Version-Metadata
- Generierte Assets in UI editierbar (Markdown-Editor)
- Status-Workflow durchgaengig (alle 5 Uebergaenge implementiert + UI-Aktionen)
- Versionierung mit Diff-Ansicht funktioniert
- Markdown-Export liefert Skill-spezifisch formatierte Datei (z. B. E-Mail mit klar getrenntem Subject + Body, LinkedIn mit Hook-Block)
- Volltext-Suche findet Assets nach Inhalt + Briefing + Tags
- Cost-pro-Asset wird in `ai_cost_ledger` getrackt mit `provider='bedrock'`, `model='claude-sonnet-4-7'` (oder aktuellem Modell-ID), `tokens_in`, `tokens_out`, `cost_usd`
- Brand-Profile-Version-Snapshot ist pro Asset gespeichert
- Few-shot-Loader-Modul existiert und ist im Prompt-Builder eingehaengt (auch wenn V1 leer zurueckgibt)
- Build/Lint/Typecheck gruen, Tests gruen

## Micro-Tasks

### MT-1: Worker-Handler `assetGeneration`
- Goal: Asynchrone Bedrock-Call-Handler-Implementierung
- Files: `worker/handlers/assetGeneration.ts`, `__tests__/worker/handlers/assetGeneration.test.ts`
- Expected behavior:
  - Liest `asset_id` + `output_type` + `source_object_type/id` + optional `briefing_note` aus `ai_jobs.payload`
  - Laedt aktuelles Brand Profile (`getActiveBrandProfile()` aus SLC-102)
  - Laedt Quell-Objekt-Daten (ICP/Segment/Lead/Pitch/Campaign — abhaengig vom Type)
  - Ruft Output-Type-spezifischen Prompt-Builder (MT-2) auf
  - Ruft Few-shot-Loader (MT-3) — V1: leeres Array
  - Sendet Bedrock-Call via `bedrockAdapter`
  - Schreibt `asset_version` mit Markdown-Content + Metadata + Cost in `ai_cost_ledger`
  - Setzt `asset.status='entwurf'`, `asset.current_version_id`, `asset.brand_profile_version_snapshot`
- Verification: Handler-Test mit Mock-Bedrock + Mock-DB-Layer. Ein Test pro Output-Typ (7 Tests). Verifiziert: korrekter Prompt-Builder-Aufruf, korrekte DB-Schreibung, Cost-Tracking, Error-Handling (Bedrock-Failure → Status `failed`, Retry-Counter).
- Dependencies: MT-2 + MT-3 + SLC-101 (Adapter) + SLC-102 (`getActiveBrandProfile`)
- TDD: Pflicht — kritische Async-Logik mit DB-Schreibung, Failure-Modes muessen abgedeckt sein.

### MT-2: 7 Output-Typ-Prompt-Builder
- Goal: Pro Output-Typ ein deterministischer Prompt-Builder
- Files: `src/prompts/asset/blogpost.ts`, `linkedin.ts`, `onepager.ts`, `email.ts`, `casecard.ts`, `landingpage.ts`, `websitespec.ts`, `index.ts`, `__tests__/prompts/asset/{7 files}.test.ts`
- Expected behavior: Pro Builder eine Funktion `buildPrompt(input: PromptInput): { systemPrompt: string, userPrompt: string }`. Builder liest Brand-Profile + Quell-Objekt + Briefing + Few-shot, baut Skill-spezifischen Prompt gemaess `docs/spec-references/output-type-skill-mapping.md` und `docs/spec-references/social-content-hook-formulas.md` + `cold-email-personalization.md` (fuer linkedin + email).
- Verification: Pro Builder ein Test mit Sample-Input → erwarteter Prompt enthaelt:
  - Brand-Profile-Sektionen (alle 12, mit Hervorhebung der Skill-relevanten)
  - Output-Schema-Hinweis (z. B. fuer LinkedIn: 4 Hook-Formeln genannt)
  - Quell-Objekt-Daten
  - Briefing-Notiz wenn vorhanden
- Dependencies: SLC-102 (Brand-Profile-Builder MT-5)
- TDD: Pflicht — Pure-Functions, deterministisch.

### MT-3: Few-shot-Loader-Modul (Stub)
- Goal: Vorbereitete Hook-Punkt fuer Few-shot-Performance-Loop, V1 mit leerer Implementation
- Files: `src/prompts/asset/shared/few-shot-loader.ts`, `__tests__/prompts/asset/shared/few-shot-loader.test.ts`
- Expected behavior:
  - `loadFewShotExamples(outputType: AssetOutputType, n?: number): Promise<FewShotExample[]>` — V1: gibt `[]` zurueck (TODO-Kommentar fuer SLC-108)
  - Interface `FewShotExample` definiert (asset_id, markdown_snippet, leads_generated, cost_eur)
  - Tests verifizieren: leerer Aufruf gibt leeres Array, Signatur ist stabil
- Verification: Test gruen, TypeScript-Type-Export funktioniert.
- Dependencies: keine
- TDD: Empfohlen — bereitet Stub-Schnittstelle.

### MT-4: Asset-Request-UI + Server Action
- Goal: User-faehige UI fuer Asset-Erzeugung
- Files: `src/app/[locale]/assets/new/page.tsx`, `src/components/assets/AssetRequestForm.tsx`, `src/server/assets/actions.ts`, `__tests__/server/assets/actions.test.ts`
- Expected behavior:
  - Form: Output-Typ-Dropdown, Quell-Objekt-Type-Dropdown (ICP/Segment/Lead/Pitch/Campaign), Quell-Objekt-ID-Picker, Briefing-Textarea
  - Server Action `createAssetRequest(data)`: validiert, erzeugt `asset`-Zeile mit Status `entwurf`, erzeugt `ai_jobs`-Eintrag mit Type `asset_generation`. Gibt `asset_id` zurueck.
  - Redirect auf `/assets/[id]` nach erfolgreicher Submit
- Verification: Action-Tests (DB-Tests fuer asset-Insert + ai_jobs-Insert), Form-Submission (manuell oder E2E)
- Dependencies: SLC-101 Style-Guide-Komponenten

### MT-5: Asset-Bibliothek `/assets` (Listen-Ansicht)
- Goal: Asset-Library mit Filter
- Files: `src/app/[locale]/assets/page.tsx`, `src/components/assets/AssetGrid.tsx`, `src/components/assets/AssetFilters.tsx`, `src/server/assets/queries.ts`
- Expected behavior:
  - Layout3 Grid-Variante
  - Filter: Output-Typ (7 Multi-Select), Quell-Objekt-Typ, Status (5 Multi-Select), Erstelldatum-Range, Tag-Multiselect, Volltext-Suche
  - Sortierung: created_at DESC default, optional updated_at, output_type
  - Pagination via Cursor (10 pro Seite default)
  - Asset-Card zeigt: Output-Typ-Icon, Title (truncated), Status-Badge, Quell-Objekt-Verlinkung, Performance-Snippet (V1 leer falls keine Daten)
- Verification: 10 Test-Assets anlegen, Filter funktioniert, Suche findet anhand Briefing/Tag/Markdown
- Dependencies: MT-4

### MT-6: Asset-Detail `/assets/[id]` mit Versionen + Status-Workflow
- Goal: Detail-Seite fuer ein Asset mit allen Aktionen
- Files: `src/app/[locale]/assets/[id]/page.tsx`, `src/components/assets/AssetDetail.tsx`, `src/components/assets/VersionsTab.tsx`, `src/components/assets/MetadataPanel.tsx`, `src/components/assets/StatusActions.tsx`, `src/server/assets/versionActions.ts`
- Expected behavior:
  - Tabs: Inhalt (Markdown-Editor), Versionen (Liste mit Diff-Action), Metadaten, Performance (V1 leer / Stub)
  - Markdown-Editor: User kann editieren, Save erzeugt neue `asset_version`
  - Diff-Ansicht zwischen 2 Versionen (Markdown-Diff Library)
  - Rollback-Action: Setzt `current_version_id` auf gewaehlte alte Version
  - Status-Workflow-Buttons: Status-Transitions gemaess Spec, mit Pflicht-Felder-Check (z. B. `posted_at` bei `veroeffentlicht`)
  - Re-Generate-Button: Erzeugt neuen `ai_jobs`-Eintrag mit gleichem oder neuem Briefing
- Verification: E2E Smoke: Asset bearbeiten, neue Version sehen, Diff anzeigen, Status-Workflow durchlaufen, Re-Generate triggern.
- Dependencies: MT-4 + MT-5

### MT-7: Markdown-Export
- Goal: Pro Asset Markdown-Export + Batch-ZIP
- Files: `src/server/assets/export.ts`, `src/components/assets/ExportButton.tsx`, `__tests__/server/assets/export.test.ts`
- Expected behavior:
  - `exportAsset(assetId): { content: string, filename: string, mimeType: string }` — Output-Typ-spezifisch formatiert (E-Mail mit Subject+Body, LinkedIn mit Hook-Block-Markup)
  - `exportAssetsBatch(assetIds): zip-Buffer` — ZIP mit allen Files
  - UI-Button im Detail (Single) und in Library (Multi-Select-Batch)
- Verification: Test pro Output-Typ (7 Tests) — Output enthaelt erwartete Struktur. Batch-ZIP enthaelt alle Files.
- Dependencies: MT-5 + MT-6
- TDD: Empfohlen — pure logic.

### MT-8: Volltext-Suche
- Goal: Such-Engine ueber Asset-Inhalt
- Files: `src/server/assets/search.ts`, Migration-Erweiterung in `sql/migrations/002b_assets_fts_index.sql`
- Expected behavior: Postgres `to_tsvector('german', asset_version.markdown_content || ' ' || asset.briefing_note || ' ' || array_to_string(asset.tags, ' '))` GIN-Index. Such-Funktion `searchAssets(q: string): Promise<Asset[]>` nutzt `websearch_to_tsquery`.
- Verification: Tests mit 3 Sample-Assets, Suche nach Begriff aus Body / Briefing / Tag findet jeweils richtige.
- Dependencies: MT-5
- TDD: Pflicht.

## TDD-Policy
- **Pflicht-TDD:** Worker-Handler (MT-1), Prompt-Builder (MT-2), Few-shot-Loader-Stub-Interface (MT-3), Volltext-Suche (MT-8)
- **Empfohlen-TDD:** Server-Actions Validation (MT-4), Markdown-Export (MT-7), Asset-Versions-Logic (MT-6)
- **Nicht-TDD:** UI-Komponenten (MT-4 Form, MT-5 Grid, MT-6 Detail-Layout)

## Risiken
- **R1 Bedrock-Antwortzeiten / Timeouts**: Long-Running Calls. Mitigation: Worker-Async (DEC-011) — kein Sync-Call in Server-Action. Retry mit exp. Backoff bei Bedrock-Throttling.
- **R2 Output-Schema-Compliance**: KI haelt sich evtl. nicht an Skill-Schema. Mitigation: Prompt mit explizitem Output-Format-Schema + Schema-Check post-generation (Light-Validation, kein hartes Reject in V1 — nur Warning-Tag).
- **R3 Few-shot-Stub vs. echter Loop**: Risiko, dass Hook-Punkt vergessen wird. Mitigation: SLC-108 muss explizit `few-shot-loader.ts` aktualisieren — als Acceptance-Criterion in SLC-108 verankert.
- **R4 Cost-Eskalation**: 7 Output-Typen × Brand-Profile (gross) × Quell-Objekt-Daten → grosse Prompts. Mitigation: Cost-Cap pro Generation in `ai_cost_ledger` checken, Alarm bei Monatsschwelle. ENV `ASSET_GENERATION_COST_CAP_EUR` (default 1.00) pro Generation.

## Worktree
Optional. Wenn aktiviert: Branch `worktree/slc-103-asset-production`. Empfohlen wegen Bedrock-Adapter-Touch und 7 Prompt-Builder-Files.

## Verifikations-Schritte (vor `/qa`)
1. `npm run build && npm run lint && npm run typecheck`
2. `npm run test` (alle MT-Tests gruen)
3. E2E-Smoke: Asset-Request fuer mind. 3 verschiedene Output-Typen erzeugen, generieren lassen (Worker startet Bedrock-Call), Asset bearbeiten, neue Version, Status-Workflow durchlaufen
4. Cost-Verification: `SELECT * FROM ai_cost_ledger WHERE provider='bedrock' ORDER BY created_at DESC LIMIT 5` zeigt Eintraege mit `tokens_in`, `tokens_out`, `cost_usd`
5. Few-shot-Loader-Stub: Aufruf mit beliebigem Output-Type gibt `[]` zurueck

## Recommended Next Step
Nach `/qa SLC-103`: `/backend SLC-104` (ICP & Segment).

## Referenzen
- FEAT-009 (Content Asset Production Spec, 7 Output-Typen)
- ARCHITECTURE.md A.3.1 (asset, asset_version, asset_performance), A.4 (Job-Type asset_generation), A.7 (Routen)
- DEC-011 (Asset-Generierung asynchron), DEC-024 (Output-Type/Source-Skill Enum), DEC-026 (asset_performance separate Tabelle), DEC-027 (Few-shot-Mechanik)
- `docs/spec-references/output-type-skill-mapping.md`, `social-content-hook-formulas.md`, `cold-email-personalization.md`
- SLC-102 (Brand-Profile als Kontext)
