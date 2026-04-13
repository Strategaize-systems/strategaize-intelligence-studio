# SLC-007 — Decision & Trigger Board

## Slice
- ID: SLC-007
- Feature: FEAT-006
- Status: planned
- Priority: High

## Goal
Zentrale Entscheidungs- und Trigger-Instanz. Board-Ansicht für alle Objekte, die eine Entscheidung brauchen. Entscheidungen erzeugen typisierte Action Triggers. Trigger-Übersicht mit Status.

## Scope
- Server Actions für Decision Board + Action Trigger Logik (actions/decisions.ts)
- Board-View: Alle Objekte die eine Entscheidung brauchen (Insights ohne Folgeaktion, neue Opportunities, offene Improvements, abgeschlossene Experiments)
- Entscheidungs-Dialog mit allen Optionen (ignorieren, archivieren, beobachten, in Katalog aufnehmen, Content bauen, Modul/Flow bauen, verbessern, Hypothese testen, Research-Aufgabe, Onboarding-Entwurf, Operator-Profil, Wissensbaustein, später prüfen)
- Action Trigger-Erzeugung mit Typ, Zielsystem, Quell-Objekt, Beschreibung
- Trigger-Übersicht (app/triggers/page.tsx) mit Status-Filter
- "Undecided"-Filter
- "Später prüfen"-Übersicht mit Wiedervorlagedatum
- Entscheidung wird am Quell-Objekt gespeichert (insights.decision, insights.decision_date, insights.decision_note)

## Not in Scope
- Automatische Trigger-Weiterleitung an andere Systeme (V2)
- KI-gestützte Entscheidungsempfehlungen (V1.1)

## Dependencies
- SLC-003 (Insights)
- SLC-005 (Improvements)
- SLC-006 (Opportunities)

## Micro-Tasks

#### MT-1: Server Actions — Decision + Trigger Logic
- Goal: Entscheidungs-Speicherung und Action Trigger CRUD
- Files: `app/src/actions/decisions.ts`
- Expected behavior: makeDecision(objectType, objectId, decisionType, note) → speichert Entscheidung am Objekt + erzeugt Action Trigger. getUndecidedObjects() → alle Objekte ohne Entscheidung. getReviewReminders() → alle Objekte mit Wiedervorlagedatum. Trigger CRUD: list (with filters), updateStatus, getBySource.
- Verification: Entscheidung erzeugt korrekten Action Trigger in DB
- Dependencies: none

#### MT-2: Board View Page
- Goal: Übersichtsseite aller Objekte, die eine Entscheidung brauchen
- Files: `app/src/app/decisions/page.tsx`, `app/src/app/decisions/loading.tsx`
- Expected behavior: Gruppierte Ansicht: Insights ohne Entscheidung, neue Opportunities, offene Improvements, abgeschlossene Experiments. Anzahl pro Gruppe. Sortierung nach Datum/Relevanz.
- Verification: Board zeigt korrekte Objekte
- Dependencies: MT-1

#### MT-3: Decision Dialog
- Goal: Dialog/Panel für Entscheidungsfindung mit allen Optionen
- Files: `app/src/components/forms/decision-dialog.tsx`
- Expected behavior: Modal/Panel zeigt Objekt-Zusammenfassung. Dropdown/Buttons für alle Entscheidungsoptionen. Optionales Notiz-Feld. "Später prüfen" mit Datumsfeld. Speichern erzeugt Action Trigger.
- Verification: Dialog öffnet, Entscheidung wird korrekt gespeichert
- Dependencies: MT-1

#### MT-4: Action Trigger Creation
- Goal: Korrekte Trigger-Erzeugung für jeden Entscheidungstyp
- Files: `app/src/actions/decisions.ts` (erweitern)
- Expected behavior: Mapping: Entscheidungstyp → trigger_type + target_system. z.B. "Hypothese testen" → create_market_test / internal. "Fragebogen bauen" → create_onboarding_draft / s1. Trigger wird mit source_object_type, source_object_id, description gespeichert.
- Verification: Jeder Entscheidungstyp erzeugt korrekten Trigger
- Dependencies: MT-1

#### MT-5: Trigger Overview Page
- Goal: Übersichtsseite aller Action Triggers mit Status
- Files: `app/src/app/triggers/page.tsx`, `app/src/app/triggers/loading.tsx`
- Expected behavior: Tabelle mit Trigger-Typ, Zielsystem, Quell-Objekt, Beschreibung, Status. Filter nach Typ, Zielsystem, Status. Status-Buttons (created → in_progress → completed → rejected).
- Verification: Trigger-Liste rendert, Status-Änderung funktioniert
- Dependencies: MT-1

#### MT-6: Undecided Filter + Review Reminders
- Goal: Spezialfilter für offene Entscheidungen und Wiedervorlagen
- Files: `app/src/app/decisions/page.tsx` (erweitern)
- Expected behavior: Tab/Toggle: "Offen" / "Später prüfen". Später-prüfen zeigt alle Objekte mit Wiedervorlagedatum, sortiert nach Datum. Farbliche Hervorhebung überfälliger Wiedervorlagen.
- Verification: Filter funktionieren, Wiedervorlagen werden korrekt angezeigt
- Dependencies: MT-2

## Verification
- Board zeigt alle Objekte, die eine Entscheidung brauchen
- Entscheidung kann getroffen und gespeichert werden
- Entscheidung erzeugt korrekten Action Trigger mit Typ und Zielsystem
- Action Trigger wird als eigenständiges Objekt gespeichert
- Undecided-Filter funktioniert
- Später-prüfen-Übersicht mit Datumsfilter funktioniert
- Action-Trigger-Übersicht zeigt alle Folgeobjekte mit Status
