# FEAT-005 — Opportunity & Decision basic

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
Strukturierte Erfassung, Bewertung und Entscheidung über Opportunities (Chancen, Ideen, Vorhaben). Ersetzt informelle Bauchentscheidungen durch nachvollziehbare, dimensionierte Bewertung — mit KI-Unterstützung für die Bewertungs-Argumentation.

## In Scope (V1)

### Opportunity-Entität
- Pflichtfelder: Titel, Kurzbeschreibung, Kategorie (Produktfeature / Vertriebsidee / Interner Prozess / Partnerschaft / Sonstiges)
- Verknüpfung: optional zu einer oder mehreren KUs (FEAT-004) und/oder Kunden (FEAT-003)
- Status: `draft | in_review | decided | in_execution | closed | parked`

### Bewertungs-Dimensionen (11 insgesamt)

**4 Pflicht-Dimensionen (V1):**
1. Strategischer Fit — passt zur StrategAIze-Positionierung?
2. Aufwand / Kosten — Größenordnung
3. Nutzen / Wirkung — Impact, Revenue-Potenzial
4. Risiko / Unsicherheit — was kann schiefgehen

**7 optionale Dimensionen:**
5. Marktgröße / Potenzial
6. Differenzierung (vs. Wettbewerb)
7. Reversibilität (einfach zurückzudrehen?)
8. Zeitdruck (Window of Opportunity?)
9. Abhängigkeiten
10. Benötigte Ressourcen (intern/extern)
11. Strategische Optionalität

Jede Dimension: freier Text + Skala (1–5).

### KI-Unterstützung (Bedrock Sonnet)
- Button „KI-Bewertung vorschlagen": Bedrock schlägt Bewertung für die 4 Pflicht-Dimensionen vor, basierend auf Titel + Beschreibung + verknüpften KUs
- Nutzer akzeptiert oder überschreibt — KI-Vorschlag wird als Referenz gespeichert (nicht final)

### Decision-Board
- Board-Ansicht nach Status (Kanban-Stil)
- Decision-Entity: gehört zu einer Opportunity, Status-Wechsel dokumentiert (Wer, Wann, Warum)
- Decision-Log: pro Opportunity Timeline aller Status-Wechsel mit Kommentar

## Out of Scope (V2+)
- Auto-Abgeleitete Opportunities aus KU-Mustern (V2)
- KI-Entscheidungsempfehlungen (V2)
- Automatische Trigger-Erzeugung in Nachbarsystemen bei Entscheidung (V2 → IS schreibt aktiv in Onboarding/Business)
- Komplexe Portfolio-Bewertung (Summen, Gewichtungen, Szenarien) — V3
- Parallele Workflows mit mehreren Entscheidern / Freigabe-Ketten — V3

## Acceptance Criteria
- AC-01: Opportunity kann in unter 2 Minuten mit 4 Pflicht-Dimensionen erfasst werden
- AC-02: KI-Bewertungsvorschlag funktioniert und ist nachvollziehbar (Prompt + Antwort als Referenz)
- AC-03: Decision-Board zeigt alle Opportunities nach Status in Kanban-Ansicht
- AC-04: Status-Wechsel erzeugt Log-Eintrag mit Nutzer, Zeitpunkt, optionalem Kommentar
- AC-05: Opportunity-Detail zeigt alle verknüpften KUs und Kunden
- AC-06: Optional-Dimensionen können nach Erfassung ergänzt werden (keine Einbahnstraße)

## Dependencies
- FEAT-004 (Insight-Layer) — Opportunities können aus KUs abgeleitet werden
- FEAT-003 (Portfolio-Monitor) — Opportunities können einem Kunden zugeordnet werden
- AWS Bedrock eu-central-1 (Provider-Adapter) für KI-Bewertung

## Notes
- Bewertungs-Dimensionen übernommen aus alter V1-Planung (dort 6+5), reduziert auf 4+7 — schnellere Erfassung, gleiche Denktiefe bei Bedarf
- KI-Bewertung ist **Vorschlag, nicht Entscheidung** — Mensch bleibt im Loop
- Decision-Log ist Audit-Trail, nicht nur Status
