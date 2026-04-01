# SLC-001 — Project Setup & Foundation

## Slice
- ID: SLC-001
- Feature: Infrastruktur (BL-011)
- Status: planned
- Priority: Blocker

## Goal
Next.js-Projekt initialisieren, SQLite-Schema anlegen, Basis-Layout mit Navigation erstellen. Danach kann jedes Feature-Slice unabhängig gebaut werden.

## Scope
- Next.js 14+ App mit App Router erstellen (create-next-app)
- Tailwind CSS + shadcn/ui konfigurieren
- better-sqlite3 installieren und db.ts Connection Helper
- SQL-Migration 001-initial-schema.sql mit allen 11 Tabellen + Indexes + FTS5
- Migration-Runner (einfaches Script das SQL-Dateien ausführt)
- lib/types.ts mit TypeScript-Typen für alle Objekttypen
- lib/ai.ts mit Claude CLI Wrapper (callClaude, callClaudeJSON, buildSafePrompt)
- Root Layout mit Sidebar-Navigation (alle 10 Feature-Bereiche)
- Dashboard-Seite (Platzhalter mit Statistik-Übersicht)
- prompts/ Verzeichnis mit erstem Template (analyze-insight.md)

## Not in Scope
- Feature-spezifische Seiten (kommen in den jeweiligen Slices)
- Datenbank-Inhalt
- Vollständige Prompt-Templates (kommen mit dem jeweiligen Feature)

## Dependencies
- Keine (erster Slice)

## Verification
- `npm run dev` startet erfolgreich auf localhost:3500
- SQLite-DB wird erstellt mit allen Tabellen
- Navigation zeigt alle 10 Bereiche
- Claude CLI Wrapper ist aufrufbar (Basis-Test)