# SLC-010 — V1 Gesamt-QA + Polish

## Status
- Version: V1
- Feature: alle V1 (BL-001..008, BL-021)
- Priority: High
- Status: planned
- Created: 2026-04-16
- Worktree isolation: optional

## Goal
Inhaltliche End-to-End-Prüfung aller V1-Features im Verbund nach Abschluss von SLC-001..SLC-009. Findet Fehler, die Einzel-Slice-QAs übersehen, weil sie nur ihren eigenen Scope prüfen. Produziert `/reports/RPT-XXX-v1-gesamt-qa.md` mit Befunden und Fix-Liste.

## Abgrenzung QA vs. Final-Check
- **QA (dieser Slice)**: inhaltliche Prüfung — funktionieren die Features zusammen? AC-Erfüllung? Cross-Feature-Integration?
- **/final-check** (nach diesem Slice): Hygiene, Dependencies, Security-Audit, Deployment-Readiness, Dokumentations-Konsistenz.
QA und Final-Check sind zwei separate Schritte (siehe CLAUDE.md / mandatory-completion-report).

## In Scope
- End-to-End-Testdurchlauf:
  - Ingest Onboarding + Business laufen als Cron durch (live-verifiziert)
  - Portfolio-Monitor zeigt Kunden mit KUs + Opportunities + Deployments
  - Insight-Layer: Filter, Suche, Tagging, Clustering, Ableitung zu Opportunity
  - Opportunity: CRUD + KI-Bewertung + Decision-Log
  - Cross-Kunden-Learnings: Freigabe + Anonymisierungs-Warnung + Cross-View + Rücknahme
  - Deployment-Registry: CRUD + Rollout-Ansicht + CSV-Export
- RLS-Smoke-Test pro Rolle (admin / tenant_admin / tenant_member) über alle Tabellen
- `ai_cost_ledger`-Audit: alle Bedrock-Calls erfasst
- `audit_log`-Audit: Status-Wechsel protokolliert
- Style-Guide-Konsistenz-Check: keine Ad-hoc-Komponenten, alle Farben aus Theme
- Empty-/Loading-/Error-State-Check pro Feature-Seite
- Polish-Fixes für einfache Findings (Typo, Layout-Glitch, Copy-Text)
- Dokumentations-Update: `/docs/STATE.md` auf `implementing → qa → final-check`

## Out of Scope
- Security-Audit (Teil von /final-check)
- Performance-Load-Tests (V2)
- Accessibility-Full-Audit (V5)
- Deployment-Tests (Teil von /final-check + /deploy)
- Bug-Fix-Work für größere Findings (eigener Slice oder /doctor)

## Acceptance Criteria
- AC-01: Alle V1-AC aus FEAT-001..007 live verifiziert
- AC-02: Findings kategorisiert (Blocker / High / Medium / Low)
- AC-03: RLS-Test-Matrix dokumentiert (Rolle × Tabelle × Operation)
- AC-04: KI-Call-Audit: alle produktiven Bedrock-Calls erzeugen `ai_cost_ledger`-Zeile
- AC-05: Style-Guide-Konsistenz-Check durchgeführt, Abweichungen dokumentiert
- AC-06: Polish-Fixes mit < 30 min Aufwand werden sofort gemacht, größere als Findings eingetragen
- AC-07: `/reports/RPT-XXX-v1-gesamt-qa.md` geschrieben mit Outcome, Fundstellen, Fix-Priorität
- AC-08: STATE.md auf Phase `final-check` gesetzt

## Dependencies
- SLC-001..SLC-009 abgeschlossen und deployed auf Staging
- Bedrock-Credentials in Staging-ENV
- Mindestens 10 Test-KUs, 3 Customer, 3 Opportunities, 2 Learnings als Seed

## Risks
- Findings könnten umfangreiche Rework-Slices auslösen (dann eigener Slice SLC-011 Rework oder /doctor-Durchlauf)
- KI-Calls kosten Geld — QA-Tests sollten auf Staging mit Cost-Cap laufen
- Cross-Feature-Integration kann Überraschungen bringen (Tenant-Mapping zwischen Onboarding-Source-Tenant und Business-Company)

## Micro-Tasks

### MT-1: Seed-Daten + Test-Szenarien vorbereiten
- Goal: Seed-Script mit 3 Customer, 10 KUs, 3 Opportunities, 2 Deployments, 2 Learnings.
- Files: `sql/seeds/002_v1_test_data.sql`, `docs/qa/v1-scenarios.md` (Testfälle).
- Expected behavior: Nach Seed ist Staging realistisch gefüllt.
- Verification: Seed läuft idempotent.
- Dependencies: Alle SLC-001..SLC-009.

### MT-2: Feature-Walkthrough + AC-Matrix
- Goal: Jedes FEAT-001..007 durchgehen, jede AC als `pass/fail/partial` markieren.
- Files: `reports/RPT-XXX-v1-gesamt-qa-matrix.md` (Teilreport).
- Expected behavior: 100 % der ACs sind geprüft und dokumentiert.
- Verification: Matrix vollständig, keine Lücke.
- Dependencies: MT-1.

### MT-3: RLS-Test-Matrix
- Goal: SAVEPOINT-Tests pro Rolle über alle Tabellen (Read/Write/Delete). Ergebnisse als Matrix.
- Files: `apps/web/src/lib/data/rls-matrix.test.ts`, `reports/RPT-XXX-rls-matrix.md` (Teil des Hauptreports).
- Expected behavior: Admin hat Vollzugriff, Member nur eigene Tenant-Daten, anonymous kein Zugriff.
- Verification: Test-Suite grün.
- Dependencies: MT-1.

### MT-4: KI-Call + Audit-Log-Check
- Goal: Opportunity-KI-Bewertung auslösen, prüfen dass `ai_cost_ledger` + `audit_log` Einträge entstehen. Dasselbe für Asset-Request (falls V2 vorgezogen — in V1 skipping).
- Files: `reports/RPT-XXX-ai-audit.md` (Teil).
- Expected behavior: 1:1-Mapping Job → Cost-Ledger-Row.
- Verification: Manuelle SQL-Queries.
- Dependencies: MT-2.

### MT-5: Style-Guide-Konsistenz-Check
- Goal: Alle Feature-Seiten visuell durchgehen. Prüfen: keine Ad-hoc-Farben, keine neuen Shadow-/Radius-Klassen, alle FilterBars haben Voice+AI-Button, Empty/Loading/Error-States da.
- Files: `reports/RPT-XXX-style-audit.md` (Teil).
- Expected behavior: Liste von Abweichungen mit Fix-Priorität.
- Verification: Visueller Walk-Through.
- Dependencies: MT-2.

### MT-6: Polish-Fixes + Finaler QA-Report
- Goal: Kleine Findings (< 30 min Aufwand pro Fix) direkt beheben. Großer Report unter `/reports/RPT-XXX-v1-gesamt-qa.md` mit allen Teilreports aggregiert und Prio-Liste für noch offene Punkte.
- Files: `reports/RPT-XXX-v1-gesamt-qa.md`.
- Expected behavior: Report enthält: Outcome, Findings je FEAT, RLS-Matrix, KI-Audit, Style-Audit, offene Fix-Liste, empfohlener nächster Schritt.
- Verification: Report vollständig.
- Dependencies: MT-2, MT-3, MT-4, MT-5.

### MT-7: STATE.md + Records
- Goal: STATE.md auf Phase `final-check`. Known-Issues für offene Findings ergänzen. backlog-Items auf `done` wo abgeschlossen.
- Files: `docs/STATE.md`, `docs/KNOWN_ISSUES.md`, `planning/backlog.json`, `features/INDEX.md`, `slices/INDEX.md`.
- Expected behavior: Cockpit zeigt V1 als QA-abgeschlossen.
- Verification: Cockpit-Check.
- Dependencies: MT-6.

## Verification
- Alle Teilreports existieren
- Hauptreport aggregiert
- STATE.md auf `final-check`
- Keine `status=open` Blocker-Findings ohne Owner

## Next Slice
Kein neuer Slice — nächster Skill-Schritt ist `/final-check` (falls keine Blocker) oder `/doctor`/Rework-Slice (falls Blocker).
