# SLC-010 — Experiment / Market Test Manager

## Slice
- ID: SLC-010
- Feature: FEAT-011
- Status: planned
- Priority: High

## Goal
Strukturierte Hypothesentestung mit Kill-or-Go-Logik. CRUD für Experiments mit KI-gestütztem Design, Abschluss-Workflow mit Ergebnisdokumentation und Folgeentscheidung.

## Scope
- Server Actions für Experiments CRUD + KI-Design (actions/experiments.ts)
- Prompt-Template für Experiment-Design (prompts/design-experiment.md — bereits in Architecture definiert)
- Experiments-Listenansicht mit Filtern (Status, Zielgruppe, Kanal)
- Erstellen/Bearbeiten-Formular mit allen Pflichtfeldern
- KI-gestütztes Experiment-Design aus Opportunity
- Abschluss-Workflow: Ergebnis eintragen → Folgeentscheidung → ggf. neuer Action Trigger
- Detailansicht mit allen Feldern

## Not in Scope
- Experiment-Dashboard mit KPIs (V1.1)
- Test-Vergleichslogik (V1.1)
- Automatisches Test-Tracking

## Dependencies
- SLC-006 (Opportunities — für Ableitung)
- SLC-007 (Decision Board — für Folge-Trigger nach Abschluss, optional)

## Micro-Tasks

#### MT-1: Server Actions — Experiments CRUD
- Goal: CRUD für Experiments
- Files: `app/src/actions/experiments.ts`
- Expected behavior: create, read (single + list with filters), update, delete, updateStatus. Filter nach status, target_group, channel.
- Verification: DB-Operationen funktionieren
- Dependencies: none

#### MT-2: Prompt Template
- Goal: KI-Template für Experiment-Design
- Files: `app/prompts/design-experiment.md`
- Expected behavior: Template erhält Opportunity-Daten, schlägt strukturiertes Experiment vor (hypothesis, target_group, channel, success_signals, kill_criteria, timeframe, budget)
- Verification: Template-Datei existiert mit korrekten Platzhaltern
- Dependencies: none

#### MT-3: Experiments List Page
- Goal: Listenansicht mit Filtern
- Files: `app/src/app/experiments/page.tsx`, `app/src/app/experiments/loading.tsx`
- Expected behavior: Tabelle mit Titel, Hypothese (gekürzt), Status, Zielgruppe, Kanal, Zeitfenster. Filter nach Status, Zielgruppe, Kanal.
- Verification: Seite rendert, Filter funktionieren
- Dependencies: MT-1

#### MT-4: Create/Edit Form
- Goal: Formular mit allen Pflichtfeldern
- Files: `app/src/app/experiments/new/page.tsx`, `app/src/app/experiments/[id]/edit/page.tsx`, `app/src/components/forms/experiment-form.tsx`
- Expected behavior: Titel, Hypothese, Quell-Objekt, Zielgruppe, Kanal, Budget-Rahmen, Zeitfenster (Start/Ende), Erfolgssignale, Kill-Kriterien. Validierung der Pflichtfelder.
- Verification: Formular speichert korrekt
- Dependencies: MT-1

#### MT-5: KI Experiment Design
- Goal: Claude-basiertes Design aus Opportunity
- Files: `app/src/actions/experiments.ts` (erweitern)
- Expected behavior: "Experiment entwerfen"-Button auf Opportunity-Detailseite. Claude schlägt vollständiges Experiment-Design vor. User kann Vorschlag anpassen und speichern.
- Verification: KI generiert strukturierten Experiment-Vorschlag
- Dependencies: MT-1, MT-2

#### MT-6: Completion Workflow
- Goal: Abschluss-Workflow mit Ergebnis und Folgeentscheidung
- Files: `app/src/app/experiments/[id]/page.tsx`, `app/src/actions/experiments.ts` (erweitern)
- Expected behavior: Detailansicht zeigt alle Felder. Bei Status "aktiv" oder "abgeschlossen": Ergebnis-Textfeld und Folgeentscheidung-Textfeld. "Abschließen"-Button setzt Status auf completed, speichert Ergebnis. Optional: Folgeentscheidung erzeugt neuen Action Trigger via decisions.ts.
- Verification: Experiment kann abgeschlossen werden mit Ergebnis und Folgeentscheidung
- Dependencies: MT-1

## Verification
- Experiment kann manuell erstellt werden mit allen Pflichtfeldern
- Experiment kann KI-gestützt aus Opportunity abgeleitet werden
- Kill-Kriterien und Erfolgssignale werden klar dokumentiert
- Status-Workflow funktioniert (geplant → aktiv → abgeschlossen/abgebrochen)
- Ergebnis kann nach Abschluss dokumentiert werden
- Folgeentscheidung kann getroffen werden
- Listenansicht mit Filtern funktioniert
