# SLC-007 — Decision & Action Board

## Slice
- ID: SLC-007
- Feature: FEAT-006
- Status: planned
- Priority: High

## Goal
Board-Ansicht für ausstehende Entscheidungen mit Folgeaktions-Erzeugung.

## Scope
- Server Actions: decisions.ts (getUndecided, decide, getReviewDue)
- Decision-Board-Seite: Alle Objekte ohne Entscheidung
- Entscheidungs-Dialog pro Objekt (alle Optionen)
- Folgeaktion-Erzeugung: z.B. "Content bauen" erstellt Asset Request
- Undecided-Filter
- Später-prüfen-Übersicht mit Datumsfilter
- Entscheidungs-History pro Objekt

## Dependencies
- SLC-003 (Insights), SLC-005 (Improvements), SLC-006 (Opportunities)
- Muss objektübergreifend auf Insights, Improvements, Opportunities zugreifen

## Verification
- Board zeigt alle unentschiedenen Objekte
- Entscheidung kann getroffen werden
- Folgeaktion wird korrekt erzeugt
- Später-prüfen mit Datum funktioniert