# SLC-003 — Insight Analyzer

## Slice
- ID: SLC-003
- Feature: FEAT-002
- Status: planned
- Priority: Blocker

## Goal
KI-gestützte Klassifizierung und Bewertung von Inbox-Einträgen. Einzel- und Batch-Analyse durch Claude mit strukturiertem Output. Insight-Ergebnisse als eigenständige Datensätze.

## Scope
- Prompt-Template für Insight-Analyse (prompts/analyze-insight.md — aktualisieren)
- Server Actions für Analyse-Logik (actions/analyzer.ts)
- Einzelanalyse: Einen Source Record analysieren → Insight erstellen
- Batch-Analyse: Mehrere ungesichtete Einträge sequentiell analysieren
- DSGVO-Filter: Nur abstrahierte Inhalte an Claude senden
- Analyse-UI: Button in Inbox-Detailansicht, Ergebnis-Anzeige
- Insights-Listenansicht (app/insights/page.tsx) mit Filtern
- Insight-Detailansicht

## Not in Scope
- Pattern-Erkennung (SLC-004)
- Entscheidungs-Workflow (SLC-007)

## Dependencies
- SLC-001 (DB, AI Wrapper, Types)
- SLC-002 (Source Records existieren)

## Micro-Tasks

#### MT-1: Prompt Template
- Goal: Analyse-Prompt-Template aktualisieren/erstellen
- Files: `app/prompts/analyze-insight.md`
- Expected behavior: Template akzeptiert Source-Record-Kontext und produziert: classification, relevance, relevance_reason, area, tags, summary, suggested_action
- Verification: Template-Datei existiert mit korrekten Platzhaltern
- Dependencies: none

#### MT-2: Server Actions — Analyzer
- Goal: Einzel- und Batch-Analyse als Server Actions
- Files: `app/src/actions/analyzer.ts`
- Expected behavior: analyzeSingle(sourceRecordId) → Insight erstellt. analyzeBatch(ids[]) → mehrere Insights sequentiell. DSGVO-Filter via buildSafePrompt. Source Record Status wird auf "processed" gesetzt.
- Verification: Analyse erzeugt Insight mit korrekten Feldern
- Dependencies: MT-1

#### MT-3: Analysis UI in Inbox
- Goal: Analyse-Button in Inbox-Detail und Batch-Analyse in Inbox-Liste
- Files: `app/src/app/inbox/[id]/page.tsx` (erweitern), `app/src/app/inbox/page.tsx` (erweitern)
- Expected behavior: "Analysieren"-Button auf Detail-Seite. "Batch analysieren"-Button in Liste für ausgewählte Einträge. Loading-State während Analyse.
- Verification: Analyse-Buttons funktionieren, Insights werden erstellt
- Dependencies: MT-2

#### MT-4: Insights List Page
- Goal: Listenansicht aller Insights mit Filtern
- Files: `app/src/app/insights/page.tsx`, `app/src/app/insights/loading.tsx`
- Expected behavior: Tabelle mit Zusammenfassung, Klassifizierung, Relevanz, Bereich, vorgeschlagene Aktion. Filter nach Klassifizierung, Relevanz, Bereich.
- Verification: Seite rendert, Filter funktionieren
- Dependencies: MT-2

#### MT-5: Insight Detail View
- Goal: Detailansicht eines Insights mit Verlinkung zum Source Record
- Files: `app/src/app/insights/[id]/page.tsx`
- Expected behavior: Zeigt alle Felder: Klassifizierung, Relevanz mit Begründung, Bereich, Tags, Zusammenfassung, vorgeschlagene Aktion. Link zurück zum Source Record. Entscheidungs-Felder (decision, decision_date, decision_note) als Platzhalter — werden in SLC-007 aktiv.
- Verification: Detailseite rendert mit allen Feldern und Quell-Verlinkung
- Dependencies: MT-2

## Verification
- Einzelner Inbox-Eintrag kann analysiert werden, Ergebnis erscheint in der UI
- Batch-Analyse verarbeitet mehrere Einträge sequentiell
- Klassifizierung, Relevanzbewertung und Bereichszuordnung werden korrekt gespeichert
- Original-Eintrag bleibt unverändert, Analyse ist separater Datensatz
- DSGVO-Schnitt: Nur abstrahierte Inhalte gehen an Claude
