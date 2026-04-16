# FEAT-013 — Lead Scoring

## Status
- Version: V3
- Status: planned
- Priority: medium

## Purpose
Regelbasiertes Scoring für Leads (FEAT-012), das qualifizierte von unqualifizierten Leads unterscheidet. Bestimmt, welche Leads über den Handoff-Fluss (FEAT-014) an Business gehen. V3 = deterministisch regelbasiert; KI-basiertes Scoring kommt V5+, wenn Tracking-Daten vorliegen.

## In Scope (V3)

### Scoring-Regel-Entität
Konfigurierbare Regeln, die auf Lead-Felder angewendet werden.

**Pflichtfelder:**
- Titel (z. B. „ICP-Branchen-Match", „Umsatz-Band passt")
- Regel-Logik (strukturiert):
  - Feld (z. B. `lead.company.industry`, `lead.company.revenue_band`, `lead.trigger_signals_count`)
  - Operator (`equals`, `in`, `greater_than`, `contains`, `regex_match`)
  - Wert (Vergleichswert oder Liste)
- Punkte (positiv oder negativ, Integer)
- Kategorie: `fit` (Passung zum ICP) / `intent` (Kaufabsicht-Signal) / `timing` (zeitliche Eignung) / `disqualifier` (K.O.-Kriterium)
- Status: `aktiv` / `deaktiviert`

**Optionale Felder:**
- Gewichtung (wenn andere Logik als reine Addition gewünscht)
- Notizen/Begründung

### Score-Berechnung
- Score pro Lead = Summe Punkte aller aktiven, passenden Regeln
- Disqualifier-Treffer setzen Score auf -∞ (Lead wird niemals qualifiziert)
- Re-Berechnung bei:
  - neuer Regel aktiviert/deaktiviert
  - Lead-Felder geändert (Enrichment-Update)
  - manuelles Trigger „Score neu berechnen"

### Schwellenwert-Konfiguration
- Konfigurierbarer Qualification-Threshold (Score ≥ X → `qualified`-Status)
- Threshold pro Segment überschreibbar (optional)
- Threshold pro Kampagne überschreibbar (optional)

### UI
- Scoring-Regel-Übersicht: Liste mit Filter nach Kategorie, Status, Anzahl Matches
- Regel-Editor: strukturierter Form-Builder (Feld → Operator → Wert → Punkte → Kategorie)
- Lead-Score-Ansicht: pro Lead sichtbar, welche Regeln getroffen haben, mit Begründung
- Dashboard: Verteilung der Scores über Lead-Pool (Histogramm)
- Threshold-Einstellungen: global + Override-Möglichkeit

### Template-Ready
- `template_id` (optional, NULL in V3)

## Out of Scope (V3)
- KI-basiertes Scoring (V5+, wenn Tracking + Conversion-Daten da sind)
- Machine-Learning-Modell-Training aus historischen Abschluss-Daten (V8+)
- Scoring basierend auf Engagement-Events (Click, Open) (V5+, benötigt Tracking)
- Automatische Regel-Empfehlung aus Abschluss-Mustern (V8+)
- Multi-Dimensionales Scoring (separate Fit-/Intent-/Timing-Scores) (V5+; V3 = ein summierter Score)
- A/B-Testing von Scoring-Regeln (V8+)

## Acceptance Criteria
- Scoring-Regel kann mit allen Pflichtfeldern angelegt werden
- Mindestens 5 verschiedene Regeln sind parallel aktivierbar
- Score wird pro Lead korrekt berechnet (Summe der Treffer)
- Disqualifier-Logik funktioniert (setzt Score auf nicht-qualifizierbar)
- Threshold-Konfiguration funktioniert, Lead-Status `qualified` wird bei Schwellenwert-Überschreitung gesetzt
- UI zeigt pro Lead nachvollziehbar, welche Regeln getroffen haben
- Manuelle Neu-Berechnung des Scores funktioniert für Lead oder Lead-Batch
- Histogramm/Dashboard zeigt Score-Verteilung

## Dependencies
- FEAT-012 Lead Research & Enrichment (Lead-Daten als Scoring-Input)
- FEAT-010 ICP & Segment (ICP-Trigger-Signale als Scoring-Basis)
- Wird genutzt von: FEAT-014 Qualified Lead Handoff

## Architektur-Hinweise für `/architecture`
- Scoring-Regel als JSON-Struktur (field-path + operator + value + points)
- Regel-Executor: transformiert Regel-Struktur in SQL-/App-Check
- Score-Recalculation als Worker-Job (async bei Regel-Änderung für alle Leads)
- Score-Historie: jede Neu-Berechnung speichert alten Score + Zeitstempel für Audit
- Lead-Tabelle bekommt `current_score` (integer), `current_score_calculated_at` (timestamp)
- Trigger für Neu-Berechnung: Regel-Change, Lead-Feld-Change, manuelles Refresh
