# SLC-009 — FEAT-006 Cross-Kunden-Learnings basic

## Status
- Version: V1
- Feature: BL-007 / FEAT-006
- Priority: Medium
- Status: planned
- Created: 2026-04-16
- Worktree isolation: optional

## Goal
Manuelle Freigabe und Anonymisierung pro KU, interne Cross-Kunden-Ansicht mit Tenant-Masking. DSGVO-sauber: Original-KU bleibt tenant-scoped, `shared_text` zirkuliert cross-Kunde ohne Identifikatoren.

## In Scope
- Zusatzfelder auf `knowledge_unit` (bereits in MIG-001): `is_shareable`, `shared_text`, `shared_at`, `shared_by`
- Regel: `is_shareable = true` nur erlaubt wenn `shared_text` befüllt (CHECK-Constraint bereits in Schema, hier Validierung auf App-Layer)
- UI-Aktion „Als Learning freigeben" (Ergänzung zu SLC-007 MT-5):
  - Modal mit Original-Text (read-only) + Editor für `shared_text` + Submit
  - Validierung: `shared_text` min. 20 Zeichen, darf keine E-Mail-Addresse / URL / bekannte Kundennamen enthalten (Pattern-Warnung, kein harter Block)
- Cross-Kunden-Ansicht unter `/learnings` (Layout 3 List-Variante):
  - Zeigt nur `is_shareable = true`-KUs
  - Nur `shared_text` sichtbar, nicht Original
  - Volltext-Suche + Tag-Filter
  - Ursprungs-Kunde standardmäßig ausgeblendet
  - Admin-Toggle: „Ursprungs-Kunde einblenden" (nur `strategaize_admin`-Rolle)
- RLS-Policy für Cross-Kunden-Read: Masking in View oder RPC

## Out of Scope
- Auto-Anonymisierung via Bedrock (V2)
- KI-Ähnlichkeitssuche zwischen Learnings (V2)
- Strukturierte Learning-Typen (SOP, Best Practice) — V2
- Export an externe Partner (V3)
- Rollenbasierte Freigabe (V3)

## Acceptance Criteria (aus FEAT-006)
- AC-01: „Als Learning freigeben" an jeder KU möglich
- AC-02: `is_shareable=true` ohne `shared_text` wird verhindert
- AC-03: Cross-Kunden-Ansicht zeigt nur `shared_text`
- AC-04: Ursprungs-Kunde unsichtbar (Default), Admin kann einblenden
- AC-05: Freigegebene Learnings in Volltext-Suche auffindbar
- AC-06: Rücknahme möglich: `is_shareable = false` entfernt sofort aus Cross-View

## Dependencies
- SLC-003 (KU-Daten)
- SLC-007 (Insight-Layer mit „Als Learning markieren"-Action)
- SLC-002 (Layout 3 + Modal + FormField)

## Risks
- Tenant-Masking in Postgres: Option 1 View mit row-level Redaction, Option 2 RPC. Entscheidung in MT-3 basierend auf RLS-Test-Ergebnis
- Pattern-Warnung bei Namen/Emails kann false positive sein → nur Warnung, kein Block
- `learning_visibility`-Audit muss jede Freigabe/Rücknahme protokollieren

## Micro-Tasks

### MT-1: Freigabe-Modal an KU-Detail
- Goal: In `/insights/[id]` neuer Button „Als Learning freigeben". Modal mit Original-Text + Editor + Validierung.
- Files: `apps/web/src/app/(app)/insights/[id]/LearningShareModal.tsx`, `apps/web/src/app/api/ku/[id]/share/route.ts`, `apps/web/src/lib/data/ku-learning.ts`.
- Expected behavior: Submit → UPDATE `knowledge_unit` mit `is_shareable`, `shared_text`, `shared_at`, `shared_by`. `learning_visibility`-Row wird geschrieben.
- Verification: Browser-Test.
- Dependencies: SLC-007 MT-5, SLC-002 MT-5.

### MT-2: Anonymisierungs-Pattern-Warnung
- Goal: Client-seitige + Server-seitige Prüfung auf E-Mail-/URL-/Kundenname-Muster. Warnung, nicht Block.
- Files: `apps/web/src/lib/validation/anonymization.ts`, `apps/web/src/lib/validation/anonymization.test.ts`, Erweiterung LearningShareModal.
- Expected behavior: Regex erkennt `@`, `https?://`, Kundennamen aus DB (Top-20 Company-Namen). Warnung im Modal.
- Verification: Unit-Tests für Patterns.
- Dependencies: MT-1.

### MT-3: Cross-Kunden-Ansicht `/learnings`
- Goal: Liste aller `is_shareable=true`-KUs. Tenant-Masking via RLS oder RPC.
- Files: `sql/migrations/007_cross_learning_view.sql`, `apps/web/src/app/(app)/learnings/page.tsx`, `LearningList.tsx`, `LearningFilters.tsx`, `apps/web/src/lib/data/cross-learning-queries.ts`.
- Expected behavior: Nur `shared_text` sichtbar, Source-Tenant-Spalte masked (z. B. `Kunde A`), Admin-Toggle blendet echten Namen ein.
- Verification: Browser-Test mit Member- und Admin-Rolle (RLS).
- Dependencies: MT-1.

### MT-4: Volltext-Suche auf `shared_text`
- Goal: Zweiter tsvector oder Erweiterung des bestehenden `knowledge_unit.search_vector` auf `shared_text`.
- Files: `sql/migrations/008_shared_text_search.sql`, Erweiterung `cross-learning-queries.ts`.
- Expected behavior: Suche findet Learnings auch nach anonymisiertem Text.
- Verification: SQL-Test + Browser-Test.
- Dependencies: MT-3.

### MT-5: Rücknahme + Audit
- Goal: Button „Freigabe zurücknehmen" in Learning-Detail + KU-Detail. Setzt `is_shareable=false`, schreibt `learning_visibility`-Row mit `action='revoked'`.
- Files: `apps/web/src/app/(app)/learnings/[id]/RevokeButton.tsx`, `apps/web/src/app/api/ku/[id]/unshare/route.ts`.
- Expected behavior: Nach Revoke verschwindet Learning sofort aus Cross-View.
- Verification: Browser-Test.
- Dependencies: MT-3.

## Verification
- `/qa` nach Slice-Abschluss
- Tenant-Masking-Test mit Admin- und Member-Rolle
- Pattern-Warnung mit bekannten Kundennamen
- Audit-Trail-Check

## Next Slice
SLC-010 V1 Gesamt-QA + Polish.
