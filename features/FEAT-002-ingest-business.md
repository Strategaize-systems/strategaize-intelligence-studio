# FEAT-002 — Ingest-Layer Business Development System

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
IS zieht relevante Entitäten aus dem Business Development System (Fluss 3 + 3b der PLATFORM.md): Kundenstamm, Projektzustand und Signale. Grundlage für Portfolio-Monitor (FEAT-003) und Cross-System-Auswertung.

Der Layer muss **fehlertolerant** sein, weil Business V4 heute einige der benötigten Entitäten noch nicht kennt (kein Produkt-/Angebotskatalog, keine Modul-Zuordnung, keine eigene Projekt-Entität). Wenn Business das später liefert, fließt es automatisch mit.

## In Scope (V1)
- Pull-basierter Import per Cron (Zeitplan: stündlich, ausreichend für V1-Nutzungslast)
- Ingest der folgenden Business-Entitäten, sofern vorhanden:
  - Kontakte (Pflicht — existiert)
  - Unternehmen (Pflicht — existiert)
  - Deals (optional — existiert, Filter auf gewonnen + aktiv)
  - Angebote (optional — existiert teils, Filter auf akzeptiert)
  - Projekt-/Kundenzuordnung (optional — existiert ggf. nicht, fehlertolerant)
  - Modul-/Stack-Einsatz (optional — existiert heute nicht, wartet auf Business-Erweiterung)
  - Ausgewählte Signale: Verlustgründe von Deals, Einwände (optional)
- Speicherung in IS-eigenen Cache-Tabellen, Referenz auf Original-IDs aus Business
- Fehlertolerant: fehlende Felder oder Entitäten werden protokolliert, aber stoppen den Lauf nicht
- Admin-Ansicht: Ingest-Log mit Entitätstypen, Counts, fehlenden Entitäten

## Out of Scope (V2+)
- Push/Webhook von Business (V2)
- Aktive Signal-Erkennung via KI (z. B. Muster in Verlustgründen) — V2
- Rück-Schreiben in Business (V2)
- IMAP-Inbox, Kalender-Events, Cockpit-Chats — bleiben in Business, nicht gebraucht für IS

## Acceptance Criteria
- AC-01: Kontakte und Unternehmen aus Business werden stündlich in IS aktualisiert
- AC-02: Bei Feldern, die in Business heute fehlen (Module, Projekte), bleibt der Lauf erfolgreich, das Feld ist leer
- AC-03: Ingest-Log zeigt pro Entitätstyp: geholt, übersprungen (nicht vorhanden), Fehler
- AC-04: Bei Business-Ausfall läuft der nächste Zyklus ohne Datenverlust
- AC-05: IS-Cache enthält Referenz auf Business-IDs, keine Duplikate
- AC-06: Kontakt, Unternehmen und Deal erscheinen im Portfolio-Monitor (FEAT-003)

## Dependencies
- Business V4 REST-Zugang (existiert)
- Authentifizierung IS → Business (Service-Account oder API-Token)
- Bei späteren Business-Erweiterungen (FEAT-Produktkatalog, FEAT-Projektmodell) Anpassung der Ingest-Map — siehe R-01 im PRD

## Notes
- Fehlertoleranz ist kritisch: Business wird sich 2026/27 stark verändern (Templates, Produktmanagement, Pre-Sale-Features), IS darf nicht bei jeder Business-Änderung brechen
- Business-Datenmodell nicht 1:1 spiegeln, sondern zweckgerichtet (was braucht IS für Portfolio + Learnings)
