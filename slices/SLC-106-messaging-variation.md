# SLC-106 — Messaging-Variation pro Lead (4-Level + Psychology-Booster)

## Status
- Version: V1
- Status: planned
- Priority: High
- Created: 2026-04-26
- Worktree: optional
- Feature: FEAT-016 (Backlog: BL-015, schliesst BL-024 als V1-Implementierung)

## Goal
Pro qualifiziertem Lead einen personalisierten Pitch (E-Mail oder LinkedIn-Post) generieren mit 4-Level-Personalization (Industry/Company/Role/Individual) und Marketing-Psychology-Boostern. Wiederverwendet das Generation-Pattern aus SLC-103, aber mit `pitch`-Tabelle (DEC-025) statt `asset` und Lead-spezifischer Prompt-Logik. Differenzierender Closed-Loop-Use-Case (BL-024).

## In Scope
- Worker-Job `pitch_generation` Implementation
- 4-Level-Personalization-Composer: erkennt verfuegbare Lead-Daten und befuellt Slots
- Marketing-Psychology-Booster-Auswahl (1-2 pro Pitch, KI-getrieben)
- 2 Output-Typen: `email` (cold-email-Skill) + `linkedin_post` (social-content-Skill)
- 4 Frameworks pro Email: Problem-Solution / Curiosity / Trigger-Event / Direct-Pitch
- Routen: Lead-Detail-Erweiterung (Pitches-Tab), `/pitches` Cross-Lead-Liste, `/pitches/[id]` Detail mit Versionen
- "Pitch generieren"-Button im Lead-Detail mit Output-Typ + Framework-Auswahl
- Batch-Generation: "Pitches fuer alle Leads im Segment generieren" (parallele Worker-Jobs)
- Pitch-Versionierung: jede Aenderung neue `pitch_version`, Diff-Ansicht
- Re-Generate-Button mit anderem Framework
- Status-Workflow: `entwurf | ueberarbeitet | freigegeben | gesendet | verworfen`
- Cross-Reference `pitch.linked_asset_id`: "In Asset-Bibliothek uebernehmen"-Action erzeugt FEAT-009-Asset
- Cost-Cap pro Pitch: max 0.30 EUR Default in `ai_cost_ledger`-Logic

## Out of Scope (V1)
- Tatsaechlicher Versand (E-Mail = V2, LinkedIn-DM = V4+)
- A/B-Test-Auswertung mehrerer Varianten pro Lead (V5)
- KI-Auto-Booster-Auswahl mit Performance-Optimierung (V5)
- Voice-Pitch-Variante (V9+)
- Multi-Sprachen (V9+)
- Pitch-Sequence Auto-Follow-up nach Tag 3/7/14 (V2 fuer Email, V4 fuer LinkedIn)
- Auto-Re-Pitch bei Lead-Update (V5)
- Pitch-Personalization-Score (V5+)

## Acceptance Criteria
- Pitch fuer Lead generierbar — Output-Typ E-Mail oder LinkedIn waehlbar
- 4-Level-Personalization: bei vollstaendigen Lead-Daten alle 4 Slots befuellt; bei fehlendem Contact-Name+LinkedIn-URL faellt Level 4 weg + `personalization_level_used='role'`
- `personalization_level_used` korrekt gesetzt (hoechster erreichter Level)
- `psychology_boosters_used` enthaelt 1-2 Eintraege
- E-Mail-Pitch: Subject 2-4 Woerter (max 50 Zeichen), Body in einem von 4 Frameworks
- LinkedIn-Pitch: Hook in einer von 4 Formeln (Question/Stat/Story/Contrarian) + Pillar-Body + CTA
- Brand-Profile (FEAT-008) als Kontext mitgegeben — verifizierbar
- Few-shot aus Performance-Loop wird mitgegeben (V1 leer bis SLC-108 scharf)
- Cost in `ai_cost_ledger` < 0.30 EUR pro Pitch im Test
- Versionierung mit Diff funktioniert
- Re-Generate mit anderem Framework funktioniert
- Batch-Generation parallel fuer mehrere Leads
- Status-Workflow durchgaengig
- "In Asset-Bibliothek uebernehmen": erzeugt `asset` mit Backlink, `pitch.linked_asset_id` gesetzt
- RLS: tenant_admin schreibt, tenant_member liest

## Micro-Tasks

### MT-1: 4-Level-Composer + Slot-Logic
- Goal: Bestimmt verfuegbare Levels aus Lead-Daten
- Files: `src/lib/pitch/personalizationComposer.ts`, `__tests__/lib/pitch/personalizationComposer.test.ts`
- Expected behavior:
  - `composeLevels(lead: Lead, icp: Icp, brandProfile: BrandProfile): { level: Level, slots: Record<string, string> }`
  - Level-Logik:
    - Level 1 (Industry): immer wenn `lead.industry` + `icp.industry` vorhanden
    - Level 2 (Company): zusaetzlich wenn `lead.company_name` + `lead.enrichment_data` vorhanden
    - Level 3 (Role): zusaetzlich wenn `lead.contact_role` vorhanden
    - Level 4 (Individual): zusaetzlich wenn `lead.contact_name` + (`lead.linkedin_url` ODER `lead.notes`) vorhanden
  - Output `personalization_level_used` = hoechster erreichter Level
  - Slots als Strings, leer bei nicht-erreichten Levels
- Verification: Tests fuer 4 Lead-Daten-Konstellationen (alle, ohne Individual, ohne Role+Individual, nur Industry)
- Dependencies: keine
- TDD: Pflicht

### MT-2: Booster-Auswahl-Helper
- Goal: KI waehlt 1-2 passende Booster
- Files: `src/lib/pitch/boosterSelector.ts`, `__tests__/lib/pitch/boosterSelector.test.ts`
- Expected behavior:
  - V1: KI-Auswahl im selben Bedrock-Call (kein separater Sub-Call) — Booster-Selektion ist Teil des System-Prompts
  - Helper-Funktion `parseBoostersFromResponse(response: string): string[]` extrahiert verwendete Booster aus Bedrock-Response (Bedrock muss in Response markieren, welche Booster verwendet wurden — Output-Schema-Hinweis im Prompt)
- Verification: Tests fuer Response-Parsing (verschiedene Marker-Formate)
- Dependencies: keine
- TDD: Empfohlen

### MT-3: Pitch-Prompt-Builder (E-Mail + LinkedIn)
- Goal: Spezifische Prompt-Builder fuer 2 Output-Typen
- Files: `src/prompts/pitch/email.ts`, `src/prompts/pitch/linkedin.ts`, `src/prompts/pitch/index.ts`, `__tests__/prompts/pitch/*.test.ts`
- Expected behavior:
  - `buildEmailPitchPrompt(input)` → cold-email-Skill-konformer Prompt mit:
    - Brand-Profile-Sektionen 4 + 8 + 9 + 11 hervorgehoben
    - 4-Level-Slots als `{INDUSTRY_HOOK}`, `{COMPANY_INSIGHT}`, `{ROLE_RELEVANCE}`, `{INDIVIDUAL_OBSERVATION}`
    - Framework-Vorgabe (User-Wahl oder KI-Empfehlung)
    - Subject-Regel: 2-4 Woerter, max 50 Zeichen
    - Output-Format: "Subject: ...\nBody: ...\nBoosters used: [...]"
  - `buildLinkedinPitchPrompt(input)` → social-content-Skill mit:
    - 4 Hook-Formeln genannt
    - Pillar-Framework (Engage / Sell fuer Cold-Outreach)
    - CTA explizit am Ende
- Verification: Tests gegen Sample-Inputs verifizieren Prompt-Inhalt (Brand-Profile-Sektionen, 4-Level-Slots, Framework-Hinweis)
- Dependencies: MT-1 + SLC-102 Brand-Builder (MT-5)
- TDD: Pflicht

### MT-4: Worker-Handler `pitchGeneration`
- Goal: Asynchrone Pitch-Erzeugung
- Files: `worker/handlers/pitchGeneration.ts`, `__tests__/worker/handlers/pitchGeneration.test.ts`
- Expected behavior:
  - Liest `lead_id` + `output_type` + optional `framework` aus Job-Payload
  - Laedt Lead, ICP, Brand Profile
  - Composed Levels (MT-1)
  - Laedt Few-shot via SLC-103-Loader (V1 leer)
  - Ruft Prompt-Builder (MT-3) auf
  - Bedrock-Call via `bedrockAdapter`
  - Parsed Response: Subject (bei email), Body, Boosters (MT-2)
  - Schreibt `pitch` + `pitch_version` mit Metadata-Snapshot (4-Level-Snapshot, Booster-Liste, Cost, Modell)
  - Cost-Cap: wenn `cost_eur > 0.30` → Warning-Log, kein Abbruch (Soft-Cap V1)
- Verification: Handler-Test mit Mocks. Verifiziert: Korrekte Prompt-Builder-Aufrufe, Pitch + Version-Insert, Cost-Tracking, Booster-Parse, Framework-Default-Branching
- Dependencies: MT-1 + MT-2 + MT-3 + SLC-103 (Few-shot-Loader)
- TDD: Pflicht

### MT-5: Lead-Detail-Erweiterung (Pitches-Tab) + Trigger
- Goal: User generiert Pitch aus Lead-Detail
- Files: `src/components/lead/PitchesTab.tsx`, `src/components/lead/GeneratePitchButton.tsx`, `src/server/pitch/actions.ts`
- Expected behavior:
  - PitchesTab listet alle Pitches fuer Lead mit Status + Output-Typ
  - GeneratePitchButton: Modal mit Output-Typ-Dropdown + Framework-Dropdown (oder "KI-Empfehlung")
  - Server Action `createPitchRequest`: erzeugt `pitch`-Zeile + `ai_jobs`-Eintrag, redirectet auf `/pitches/[id]`
- Verification: E2E: Lead-Detail oeffnen, Pitch generieren, redirected, Status-Polling zeigt Pitch fertig
- Dependencies: MT-4 + SLC-105 Lead-Detail

### MT-6: Pitch-Detail `/pitches/[id]` mit Versionen + Re-Generate
- Goal: Pitch bearbeiten + Re-Generate + Status-Workflow
- Files: `src/app/[locale]/pitches/[id]/page.tsx`, `src/components/pitch/PitchDetail.tsx`, `src/components/pitch/PitchVersionsTab.tsx`, `src/components/pitch/RegenerateButton.tsx`, `src/components/pitch/LinkedAssetButton.tsx`
- Expected behavior:
  - Subject + Body in editierbarem Markdown-Editor (separat fuer Subject)
  - Metadata-Panel: 4-Level-Snapshot (welche Slots befuellt), Booster-Liste, Cost, Framework
  - Versionen mit Diff
  - Re-Generate-Button: Modal mit anderem Framework — erzeugt neuen `ai_jobs`-Eintrag mit gleichem Lead+Output-Typ aber anderem Framework
  - "In Asset-Bibliothek uebernehmen"-Button: erzeugt FEAT-009-`asset` mit gleichem Markdown + Backlink, setzt `pitch.linked_asset_id`
  - Status-Workflow-Buttons
- Verification: E2E
- Dependencies: MT-5

### MT-7: Pitch-Bibliothek `/pitches` (Cross-Lead)
- Goal: Cross-Lead-Liste fuer Vergleich
- Files: `src/app/[locale]/pitches/page.tsx`, `src/components/pitch/PitchList.tsx`, `src/server/pitch/queries.ts`
- Expected behavior: Layout3 mit Filter (Output-Typ, Status, Lead-Industry, personalization_level), Sortierung created_at DESC
- Verification: 5 Pitches anlegen, Filter funktioniert
- Dependencies: MT-5

### MT-8: Batch-Generation
- Goal: Pitches fuer alle Leads im Segment parallel generieren
- Files: `src/components/segment/BatchPitchGenerationButton.tsx`, `src/server/pitch/batchActions.ts`, `__tests__/server/pitch/batchActions.test.ts`
- Expected behavior:
  - Modal: Output-Typ + Framework + Limit (max N Leads, default 50, max 200)
  - Server Action erzeugt N `ai_jobs`-Eintraege (einer pro Lead) — Worker prozessiert parallel mit SKIP LOCKED
  - Cost-Vorab-Estimate angezeigt: N × 0.20 EUR
- Verification: Test: 10 Leads, Batch-Trigger, 10 Jobs in Queue, alle nach Worker-Run abgeschlossen
- Dependencies: MT-4
- TDD: Empfohlen (Batch-Logic + Cost-Estimate)

### MT-9: RLS-Tests + Cost-Verifikation
- Goal: Sicherheit + Cost-Audit
- Files: `__tests__/migrations/{pitch,pitch_version}_rls.test.ts`, `__tests__/integration/pitch-cost-audit.test.ts`
- Expected behavior: RLS-Matrix + nach Test-Run existiert `ai_cost_ledger`-Eintrag mit `provider='bedrock'`, `model`, `cost_usd`
- Verification: Tests gruen
- Dependencies: MT-4
- TDD: Pflicht

## TDD-Policy
- **Pflicht-TDD:** 4-Level-Composer (MT-1), Prompt-Builder (MT-3), Worker-Handler (MT-4), RLS+Cost (MT-9)
- **Empfohlen-TDD:** Booster-Parser (MT-2), Batch-Logic (MT-8)
- **Nicht-TDD:** UI-Komponenten (MT-5, MT-6, MT-7)

## Risiken
- **R1 4-Level-Slot-Composer Edge-Cases**: Lead mit unklaren Daten (z. B. role als Freitext). Mitigation: Liberal-fuellen + KI-Schritt entscheidet pro Slot.
- **R2 Booster-Parsing-Fragility**: Bedrock-Output-Format kann variieren. Mitigation: Strikter Schema-Hinweis im Prompt + Fallback auf leeres Array bei Parse-Fehler + Warning-Log.
- **R3 Cost-Eskalation bei Batch**: 100 Leads × 0.30 EUR = 30 EUR pro Batch. Mitigation: Vorab-Estimate-Modal + Cost-Cap-Soft-Limit + Limit-N-Slider.
- **R4 Pitch vs. Asset-Type-Konfusion**: User koennte verwirrt sein, ob Pitch oder Asset zu nutzen. Mitigation: UI-Tooltips + Cross-Reference-Action ("In Asset-Bibliothek uebernehmen").

## Worktree
Optional. Empfohlen falls parallel mit anderem Slice.

## Verifikations-Schritte (vor `/qa`)
1. `npm run build && npm run lint && npm run typecheck`
2. `npm run test`
3. E2E: Pitch fuer 1 Lead in beiden Output-Typen generieren, Versionen sehen, Re-Generate mit anderem Framework
4. Batch-Test: Pitches fuer 5 Leads parallel, alle erfolgreich
5. Cost-Verifikation: `ai_cost_ledger`-Eintrag pro Pitch < 0.30 EUR
6. Cross-Reference: Pitch in Asset uebernehmen, `pitch.linked_asset_id` gesetzt

## Recommended Next Step
Nach `/qa SLC-106`: `/backend SLC-107` (Campaign LITE).

## Referenzen
- FEAT-016 (Messaging-Variation Spec)
- ARCHITECTURE.md A.3.4 (pitch, pitch_version), A.4 (Job-Type pitch_generation)
- DEC-025 (Pitch separate Tabelle)
- `docs/spec-references/cold-email-personalization.md`, `social-content-hook-formulas.md`
- BL-024 (Backlog-Idee, V1-Implementation = SLC-106)
- SLC-102 (Brand-Profile), SLC-103 (Asset-Generation-Pattern + Few-shot-Loader-Stub), SLC-105 (Lead-Detail)
