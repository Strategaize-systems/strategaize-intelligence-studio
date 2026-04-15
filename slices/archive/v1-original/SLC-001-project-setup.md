# SLC-001 — Project Setup & Foundation

## Slice
- ID: SLC-001
- Feature: BL-011 (Infrastruktur)
- Status: planned
- Priority: Blocker

## Goal
Next.js-Projekt initialisieren, SQLite-Schema mit allen 17 Tabellen anlegen, Basis-Layout mit Navigation für 12 Feature-Bereiche erstellen. Danach kann jedes Feature-Slice unabhängig gebaut werden.

## Scope
- Next.js 14+ App mit App Router erstellen (create-next-app)
- Tailwind CSS + shadcn/ui konfigurieren
- better-sqlite3 installieren und db.ts Connection Helper
- SQL-Migration 001-initial-schema.sql mit allen 17 Tabellen + Indexes + FTS5
- Migration-Runner (einfaches Script das SQL-Dateien ausführt)
- lib/types.ts mit TypeScript-Typen für alle 12 Objekttypen
- lib/ai.ts mit Claude CLI Wrapper (callClaude, callClaudeJSON, buildSafePrompt)
- Root Layout mit Sidebar-Navigation (12 Feature-Bereiche + Dashboard)
- Dashboard-Seite (Platzhalter mit Überschriften für spätere Statistiken)
- prompts/ Verzeichnis mit erstem Template (analyze-insight.md)

## Not in Scope
- Feature-spezifische Seiten (kommen in den jeweiligen Slices)
- Datenbank-Inhalt
- Vollständige Prompt-Templates (kommen mit dem jeweiligen Feature)
- lib/import.ts und lib/export.ts (kommen in SLC-002 bzw. SLC-009)

## Dependencies
- Keine (erster Slice)

## Micro-Tasks

#### MT-1: Next.js Project Init
- Goal: Next.js-Projekt mit App Router, TypeScript, Tailwind CSS erstellen
- Files: `app/package.json`, `app/tsconfig.json`, `app/tailwind.config.ts`, `app/next.config.ts`
- Expected behavior: `npm run dev` startet ohne Fehler
- Verification: `npm run dev` erfolgreich, leere Seite auf localhost:3500
- Dependencies: none

#### MT-2: shadcn/ui Setup
- Goal: shadcn/ui initialisieren und Basis-Komponenten installieren
- Files: `app/components.json`, `app/src/components/ui/button.tsx`, `app/src/components/ui/input.tsx`, `app/src/components/ui/select.tsx`, `app/src/components/ui/table.tsx`, `app/src/components/ui/dialog.tsx`, `app/src/components/ui/badge.tsx`, `app/src/components/ui/textarea.tsx`, `app/src/components/ui/card.tsx`
- Expected behavior: shadcn/ui Komponenten importierbar und renderbar
- Verification: Build erfolgreich
- Dependencies: MT-1

#### MT-3: SQLite Setup + Migration Runner
- Goal: better-sqlite3 installieren, Connection Helper und Migration Runner erstellen
- Files: `app/src/lib/db.ts`, `app/sql/migrations/001-initial-schema.sql`, `app/scripts/migrate.ts`
- Expected behavior: Migration Runner liest SQL-Dateien und erstellt die DB in data/studio.db
- Verification: `npx tsx scripts/migrate.ts` erstellt studio.db mit allen 17 Tabellen
- Dependencies: MT-1

#### MT-4: Schema Migration (alle 17 Tabellen)
- Goal: Komplettes SQLite-Schema mit 14 Core-Tabellen + 2 Junction + 1 Singleton + 2 FTS + alle Indexes
- Files: `app/sql/migrations/001-initial-schema.sql`
- Expected behavior: Alle Tabellen aus ARCHITECTURE.md sind angelegt (source_records, insights, patterns, pattern_insights, improvements, opportunities, opportunity_relations, asset_requests, assets, module_drafts, knowledge_packages, brand_config, experiments, research_tasks, action_triggers + 2 FTS)
- Verification: `.tables` in SQLite zeigt alle 17 Tabellen + 2 FTS
- Dependencies: MT-3

#### MT-5: TypeScript Types + AI Wrapper
- Goal: Typdefinitionen für alle 12 Objekttypen und Claude CLI Wrapper erstellen
- Files: `app/src/lib/types.ts`, `app/src/lib/ai.ts`
- Expected behavior: Alle Objekttypen (SourceRecord, Insight, Pattern, Improvement, Opportunity, AssetRequest, Asset, ModuleDraft, KnowledgePackage, BrandConfig, Experiment, ResearchTask, ActionTrigger) als TypeScript-Typen verfügbar. callClaude/callClaudeJSON/buildSafePrompt exportiert.
- Verification: TypeScript compile ohne Fehler
- Dependencies: MT-1

#### MT-6: Root Layout + Sidebar Navigation
- Goal: App-weites Layout mit Sidebar-Navigation für alle 12 Feature-Bereiche
- Files: `app/src/app/layout.tsx`, `app/src/components/layout/sidebar.tsx`, `app/src/components/layout/header.tsx`
- Expected behavior: Sidebar zeigt: Dashboard, Inbox, Insights, Patterns, Improvements, Katalog, Decisions, Triggers, Assets, Brand, Modules, Knowledge, Experiments, Research. Aktiver Link ist hervorgehoben.
- Verification: Navigation rendert korrekt, Links verweisen auf richtige Routen
- Dependencies: MT-1, MT-2

#### MT-7: Dashboard Placeholder + Prompt Template
- Goal: Dashboard-Startseite mit Platzhalter-Statistiken und erstes Prompt-Template
- Files: `app/src/app/page.tsx`, `app/prompts/analyze-insight.md`
- Expected behavior: Dashboard zeigt Überschrift + Platzhalter-Cards für Statistiken. Prompt-Template existiert in prompts/.
- Verification: Dashboard rendert ohne Fehler
- Dependencies: MT-6

## Verification
- `npm run dev` startet erfolgreich auf localhost:3500
- SQLite-DB wird erstellt mit allen 17 Tabellen
- Navigation zeigt alle 12+2 Bereiche (14 Menüpunkte inkl. Dashboard)
- TypeScript compile ohne Fehler
- Claude CLI Wrapper ist aufrufbar (Basis-Test)
