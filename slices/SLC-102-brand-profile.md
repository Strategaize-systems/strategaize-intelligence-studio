# SLC-102 — Brand Profile (12-Sektionen-Singleton)

## Status
- Version: V1
- Status: planned
- Priority: High
- Created: 2026-04-26
- Worktree: mandatory (`worktree/slc-102-brand-profile`)
- Feature: FEAT-008 (Backlog: BL-009)

## Goal
StrategAIze-eigenes Brand Profile als JSONB-Singleton mit 12-Sektionen-Schema (DEC-023) bedienbar machen. UI als 12-Sektionen-Accordion in Settings, Pflichtfeld-Validierung pro Sektion via Zod, Versions-Snapshot pro Aenderung mit Changelog-Audit, LLM-Prompt-Snippet-Vorschau. Foundation-Layer fuer alle Bedrock-Calls in SLC-103 + SLC-106.

## In Scope
- Settings-Route `/settings/brand` mit 12-Sektionen-Accordion (jede Sektion editierbar, Pflichtfelder markiert)
- Zod-Schema fuer 12 Sektionen gemaess `docs/spec-references/brand-profile-12-sections.md`
- Server Action `saveBrandProfile(data)` mit Validation, schreibt in `brand_profile` (Singleton-Insert oder Update der aktiven Zeile) + erzeugt `brand_profile_changelog`-Eintrag
- Vorschau-Modus: Strukturierter LLM-Prompt-Snippet (was Bedrock als System-Kontext bekommt)
- Changelog-Tab: Liste der Aenderungen (wer/wann/welche Sektion-Pfad/old/new)
- Vollstaendigkeits-Indikator pro Sektion (`erfasst | unvollstaendig | leer`)
- Brand-Profile-Read-Helper `getActiveBrandProfile(): Promise<BrandProfile>` fuer Konsumenten (SLC-103, SLC-106)
- LLM-Prompt-Builder-Modul-Skeleton `/src/prompts/brand/builder.ts` (Implementation kommt in SLC-103)

## Out of Scope (V1)
- Multi-Brand / Multi-Tenant-Brand-Profile (V9+)
- Auto-Lernen aus Assets (V9+)
- Visuelles Brand-System (V9+)
- A/B-Test von Brand-Profil-Varianten (V9+)
- KI-Brand-Profil-Audit (V8+)
- Mehrere Personas in Sektion 3 ueber Pflicht-Set hinaus (User+Decision Maker reichen V1, weitere optional)

## Acceptance Criteria
- Settings-Route `/settings/brand` rendert 12-Sektionen-Accordion mit Style-Guide-V2-Komponenten
- Alle Pflichtfelder gemaess Spec validiert (Zod-Schema), Save schlaegt fehl bei Unvollstaendigkeit mit klarer Meldung
- Mindestens Persona-Typen User + Decision Maker in Sektion 3 erfasst
- Sektion 9 mit mind. 3 Verbatim-Problem-Phrases + 3 Verbatim-Solution-Phrases
- Sektion 11 mit mind. 1 Metric oder Testimonial
- Singleton-Constraint greift: zweiter aktiver Insert schlaegt mit klarem Error fehl
- Versions-Snapshot bei Aenderung: `version` inkrementiert, Changelog-Eintrag mit `version_from`, `version_to`, `jsonb_path_changed`, `old_value`, `new_value` geschrieben
- Vorschau-Modus zeigt zusammengesetzten LLM-Prompt-Snippet (Brand-Profile als JSON-Structured + Text)
- Changelog-Tab listet Aenderungen sortiert neuestes oben mit User + Timestamp
- Vollstaendigkeits-Indikator zeigt korrekt `erfasst/unvollstaendig/leer` pro Sektion
- `getActiveBrandProfile()` Helper liefert aktuelles Profile inkl. `version`
- RLS: nur `strategaize_admin` darf schreiben (DEC-023 Sonderregel)
- Build/Lint/Typecheck gruen, `npm run test` lauffaehig

## Micro-Tasks

### MT-1: Zod-Schema fuer 12 Sektionen
- Goal: Type-safe Validation-Schema pro Sektion + Top-Level
- Files: `src/lib/brand/schema.ts`, `__tests__/lib/brand/schema.test.ts`
- Expected behavior: Pro Sektion ein Zod-Schema mit Pflicht-/Optional-Feldern gemaess FEAT-008-Spec + spec-references-Snapshot. Top-Level `brandProfileSchema` haengt 12 Sektionen zusammen. Hilfs-Type `type BrandProfileData = z.infer<typeof brandProfileSchema>`.
- Verification: Tests fuer (a) vollstaendiges valides Profile, (b) fehlende Pflichtfelder pro Sektion (12 Negativ-Tests), (c) Persona-Set < User+DecisionMaker schlaegt fehl, (d) Verbatim-Phrases-Mindestanzahl Sektion 9.
- Dependencies: keine (parallel zu MT-2..3)
- TDD: Pflicht — Zod-Schema gibt Strukturgarantie, Tests muessen vorher rot sein.

### MT-2: Server Actions + DB-Layer
- Goal: Save + Read + Changelog-Schreibung
- Files: `src/server/brand/actions.ts`, `src/server/brand/repository.ts`, `__tests__/server/brand/repository.test.ts`
- Expected behavior:
  - `getActiveBrandProfile(): Promise<BrandProfile | null>` liest aktive Zeile via Service-Role-Supabase
  - `saveBrandProfile(input: BrandProfileData): Promise<{ version: number }>` validiert (MT-1), startet Transaction, INSERT (wenn keine aktive Zeile) oder UPDATE der aktiven Zeile, JSONB-Diff zu vorheriger Version → schreibt `brand_profile_changelog`-Eintraege pro geaenderten JSONB-Pfad. Inkrementiert `version`.
  - RLS-Pruefung: nur `strategaize_admin` darf schreiben (Server-Action prueft Rolle vor Aufruf, RLS deckt zusaetzlich ab)
- Verification: Repository-Tests gegen Coolify-Test-DB:
  - (a) Erst-Save erzeugt Zeile mit `version=1`, kein Changelog
  - (b) Zweiter Save mit Aenderung in Sektion 4 erzeugt `version=2` + Changelog-Eintrag mit `jsonb_path_changed='sections.painPoints'`
  - (c) Save mit invaliden Daten schlaegt fehl (Zod)
  - (d) Schreib-Versuch als `tenant_admin`-Rolle blockiert (RLS-Test mit SAVEPOINT)
- Dependencies: MT-1
- TDD: Pflicht — Singleton-Logic + Changelog-Diff sind subtile Logik mit echten Failure-Modes.

### MT-3: Settings-Route + 12-Sektionen-Accordion-UI
- Goal: User kann das Brand Profile editieren
- Files: `src/app/[locale]/settings/brand/page.tsx`, `src/components/brand/BrandProfileForm.tsx`, `src/components/brand/Section1ProductOverview.tsx` ... `Section12Goals.tsx` (12 Datei oder eine zusammengefasste — Empfehlung: 12 separate Komponenten fuer Wartbarkeit), `src/components/brand/CompletenessBadge.tsx`
- Expected behavior:
  - Settings-Route nutzt Layout1Dashboard (oder eigenes Settings-Layout)
  - Accordion mit 12 Sektionen, jede expandable. Sektion-Header zeigt CompletenessBadge.
  - Form nutzt React Hook Form + Zod-Resolver (MT-1)
  - Save-Button ruft `saveBrandProfile`-Action (MT-2) auf, zeigt Erfolgs-/Fehler-Toast
  - Initial-Load via `getActiveBrandProfile()` — bei `null` zeigt Empty-State mit Hilfetext
- Verification: E2E-Smoke (Playwright oder manuell): Profil komplett ausfuellen, speichern, neu laden zeigt Werte. Pflichtfeld leer lassen, Save zeigt Validation-Error.
- Dependencies: MT-1 + MT-2 + SLC-101 Style-Guide-Komponenten
- TDD: Optional — UI-Komponenten primaer visuell. Logik (Validation, Submit) ist via MT-1 + MT-2 abgedeckt.

### MT-4: Changelog-Tab
- Goal: Aenderungs-Audit sichtbar machen
- Files: `src/app/[locale]/settings/brand/changelog/page.tsx`, `src/components/brand/ChangelogList.tsx`, `src/server/brand/changelogRepository.ts`
- Expected behavior: Listet `brand_profile_changelog`-Eintraege sortiert `changed_at DESC` mit User-Avatar + Timestamp + Sektion-Pfad + Preview von old/new (truncated bei langen JSONB-Werten).
- Verification: Nach 3 manuellen Saves zeigt Liste 3 Eintraege.
- Dependencies: MT-2

### MT-5: LLM-Prompt-Snippet-Vorschau
- Goal: User sieht, was Bedrock als System-Kontext bekommt
- Files: `src/components/brand/PromptSnippetPreview.tsx`, `src/prompts/brand/builder.ts`
- Expected behavior: `buildBrandSystemPrompt(profile: BrandProfile, options?: { highlightSections?: number[] }): string` — generiert Markdown/Text-Block mit Brand-Profile-Daten in der Form, in der Bedrock sie konsumiert. UI-Komponente zeigt das Ergebnis in einem Code-Block (Layout3 Sidebar oder Accordion-Vorschau-Tab).
- Verification: Test gegen Sample-Profile: Output enthaelt alle 12 Sektionen-Daten, Hervorhebung funktioniert (z. B. `## Sektion 4 (KEY) - Pain Points`).
- Dependencies: MT-1 (Schema fuer Type)
- TDD: Empfohlen — Prompt-Builder ist deterministische Pure-Function.

### MT-6: Vollstaendigkeits-Indikator-Logik
- Goal: Pro Sektion Status `leer | unvollstaendig | erfasst` berechnen
- Files: `src/lib/brand/completeness.ts`, `__tests__/lib/brand/completeness.test.ts`
- Expected behavior: `getSectionCompleteness(profile: BrandProfile, sectionIndex: number): 'leer' | 'unvollstaendig' | 'erfasst'`. `leer` = keine Felder. `unvollstaendig` = mind. 1 Feld, aber nicht alle Pflicht. `erfasst` = alle Pflicht.
- Verification: Tests pro Sektion mit allen 3 Zustaenden.
- Dependencies: MT-1
- TDD: Pflicht — pure logic, einfach testbar.

### MT-7: RLS-Verifikation + DB-Tests
- Goal: RLS-Pattern korrekt fuer brand_profile Sonderregel (DEC-023)
- Files: `__tests__/migrations/brand_profile_rls.test.ts`
- Expected behavior: SAVEPOINT-Tests:
  - `strategaize_admin` darf SELECT/INSERT/UPDATE
  - `tenant_admin` darf NICHTS (Sonderregel)
  - `tenant_member` darf NICHTS
  - Singleton-Constraint: Zweiter Insert mit `is_active=true` schlaegt fehl
- Verification: Tests gegen Coolify-Test-DB gruen.
- Dependencies: SLC-101 MT-2 (Migration auf Hetzner) — Test gegen separate Test-DB-Instanz oder Coolify-Test-DB
- TDD: Pflicht.

## TDD-Policy
- **Pflicht-TDD:** Zod-Schema (MT-1), Repository + Singleton-Logic + Changelog-Diff (MT-2), Vollstaendigkeits-Logik (MT-6), RLS-Tests (MT-7)
- **Empfohlen-TDD:** Prompt-Builder (MT-5)
- **Nicht-TDD:** UI-Form (MT-3), Changelog-Tab-Rendering (MT-4)

## Risiken
- **R1 JSONB-Diff-Logik**: Aenderung in tief geschachteltem JSONB-Feld korrekt als Pfad-String zu erkennen ist nicht trivial. Mitigation: `json-diff`-Library oder eigener Pfad-Walker. Tests fuer 3 Diff-Cases (top-level, nested, array-element).
- **R2 Persona-Set-Variabilitaet**: Sektion 3 hat mind. User + Decision Maker, kann optional weitere haben. Schema muss `array.min(2)` mit Discriminator nutzen.
- **R3 Versions-Snapshot bei vielen kleinen Edits**: Kann zu vielen Versionen fuehren. Akzeptiert in V1 (jede Save = neue Version), Auto-Bundling V2+.

## Worktree
Mandatory. Branch `worktree/slc-102-brand-profile`. Merge nach `/qa SLC-102`.

## Verifikations-Schritte (vor `/qa`)
1. `npm run build && npm run lint && npm run typecheck`
2. `npm run test` (alle MT-Tests gruen)
3. Browser-Smoke: Brand-Profile vollstaendig anlegen, speichern, Changelog ansehen, Prompt-Snippet ansehen
4. Singleton-Constraint-Verifikation (manuell oder Test): zweiter Insert schlaegt fehl
5. RLS-Verifikation (Test MT-7)

## Recommended Next Step
Nach `/qa SLC-102`: `/backend SLC-103` (Content Asset Production).

## Referenzen
- FEAT-008 (Brand Profile Spec mit 12 Sektionen)
- ARCHITECTURE.md A.3.1 (brand_profile + brand_profile_changelog), A.10 (Spec-Snapshot-Strategie)
- MIGRATIONS.md MIG-002 (Schema)
- DEC-006 (Singleton), DEC-023 (JSONB-Singleton)
- `docs/spec-references/brand-profile-12-sections.md`
