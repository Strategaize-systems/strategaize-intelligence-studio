# SLC-004 — Pattern & Signal Clustering

## Slice
- ID: SLC-004
- Feature: FEAT-003
- Status: planned
- Priority: High

## Goal
Einzelbeobachtungen zu wiederkehrenden Mustern verdichten. Manuelles und KI-gestütztes Clustering von Insights zu Patterns mit n:m-Beziehungen.

## Scope
- Server Actions für Patterns CRUD + Junction (actions/patterns.ts)
- Prompt-Template für Pattern-Vorschläge (prompts/suggest-patterns.md)
- Pattern-Listenansicht mit Insight-Anzahl
- Pattern-Detailansicht mit zugeordneten Insights
- Erstellen/Bearbeiten-Formular
- Insight-Zuordnung zu Patterns (n:m via pattern_insights)
- KI-Vorschlag: "Diese Insights könnten ein Pattern bilden"

## Not in Scope
- ML-basiertes Auto-Clustering (V1.1)
- Similarity Finder (V1.1)

## Dependencies
- SLC-003 (Insights existieren)

## Micro-Tasks

#### MT-1: Server Actions — Patterns CRUD + Junction
- Goal: CRUD für Patterns + Insight-Zuordnung verwalten
- Files: `app/src/actions/patterns.ts`
- Expected behavior: create, read (single + list), update, delete. addInsight(patternId, insightId), removeInsight(). getInsightsForPattern(), getPatternsForInsight().
- Verification: Patterns und Zuordnungen werden korrekt in DB gespeichert
- Dependencies: none

#### MT-2: Prompt Template
- Goal: KI-Vorschlag-Template für Pattern-Erkennung
- Files: `app/prompts/suggest-patterns.md`
- Expected behavior: Template erhält Liste von Insights, schlägt Gruppierungen vor
- Verification: Template-Datei existiert
- Dependencies: none

#### MT-3: Patterns List + Create Form
- Goal: Listenansicht aller Patterns mit Insight-Anzahl + Erstellformular
- Files: `app/src/app/patterns/page.tsx`, `app/src/app/patterns/new/page.tsx`, `app/src/components/forms/pattern-form.tsx`
- Expected behavior: Tabelle mit Titel, Typ, Anzahl Insights, Status. Formular mit Titel, Beschreibung, Typ (6 Typen).
- Verification: Liste und Formular rendern korrekt
- Dependencies: MT-1

#### MT-4: Pattern Detail + Linked Insights
- Goal: Detailansicht mit zugeordneten Insights und Zuordnungs-UI
- Files: `app/src/app/patterns/[id]/page.tsx`, `app/src/app/patterns/[id]/edit/page.tsx`
- Expected behavior: Zeigt Pattern-Details. Listet alle zugeordneten Insights. UI zum Hinzufügen/Entfernen von Insights.
- Verification: Detailansicht zeigt zugeordnete Insights korrekt
- Dependencies: MT-1, MT-3

#### MT-5: KI Pattern-Vorschlag
- Goal: Claude-basierte Pattern-Vorschläge aus unzugeordneten Insights
- Files: `app/src/actions/patterns.ts` (erweitern), `app/src/app/patterns/page.tsx` (erweitern)
- Expected behavior: "Patterns vorschlagen"-Button. Claude analysiert Insights ohne Pattern und schlägt Gruppierungen vor. Vorschläge werden angezeigt, User kann akzeptieren oder ablehnen.
- Verification: KI-Vorschlag wird generiert und angezeigt
- Dependencies: MT-1, MT-2

## Verification
- Pattern kann manuell erstellt werden
- Insights können einem Pattern zugeordnet werden
- KI kann Patterns vorschlagen basierend auf ähnlichen Insights
- Pattern-Übersicht zeigt alle Patterns mit Insight-Anzahl
- Pattern-Detailansicht zeigt zugeordnete Insights
