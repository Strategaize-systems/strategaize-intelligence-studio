# FEAT-001 — Ingest-Layer Onboarding

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
IS zieht verdichtete Knowledge Units aus der Onboarding-Plattform automatisch und regelmäßig in eine eigene Datenbasis. Das ist der Haupt-Input-Fluss (Fluss 1 der PLATFORM.md). Ohne diesen Fluss fehlt dem Insight-Layer und allen abgeleiteten Features die Grundlage.

## In Scope (V1)
- Pull-basierter Import aus Onboarding-Export-API (SLC-010)
- Zeitplan: alle 10 Minuten, inkrementell (nur neue/geänderte KUs seit letztem Cursor)
- Speicherung in IS-eigener KU-Cache-Tabelle mit Referenz auf Original-Session und Quelle
- Fehlerbehandlung: bei Onboarding-Ausfall kein Datenverlust, Retry beim nächsten Zyklus
- Ingest-Metadaten: Zeitstempel, Anzahl geholter KUs, letzter Cursor, Status pro Lauf
- Pro KU gespeichert: Inhalt, Unit-Typ, Confidence, Quell-Session, Quell-Tenant, Zeitstempel, Validation-Status
- Admin-Ansicht: Ingest-Log mit Start/Ende/Anzahl/Fehler, manuell auslösbarer Lauf

## Out of Scope (V2+)
- Push/Webhook vom Onboarding (V2 wenn Latenz kritisch wird)
- Auto-Anreicherung der KUs durch KI-Clustering (V2)
- Rück-Schreiben in Onboarding (V2)
- Multi-Instanz-Ingest für Template-Kunden-Einsätze (V3)

## Acceptance Criteria
- AC-01: Nach 10 Minuten ist eine neue KU aus Onboarding in IS sichtbar
- AC-02: Bei Onboarding-Ausfall läuft der nächste Zyklus ohne Datenverlust
- AC-03: Admin sieht Ingest-Log mit Laufzeit, Menge, Fehlern
- AC-04: Manueller Trigger („jetzt abrufen") ist möglich
- AC-05: Inkrementell — bereits geholte KUs werden nicht doppelt geholt
- AC-06: KUs sind im Insight-Layer (FEAT-004) durchsuchbar

## Dependencies
- Onboarding-Plattform SLC-010 (JSON-Export-API) muss verfügbar sein — siehe R-02 im PRD
- Authentifizierung zwischen IS und Onboarding (Service-Account oder API-Token)
- Keine Abhängigkeit zu anderen IS-Features — kann isoliert gebaut werden

## Notes
- Pull-Mechanik: robust gegenüber Ausfällen, einfache Architektur
- Confidence-Feld: `low | medium | high` (Enum, wie Onboarding)
- Falls Onboarding später PDF/Markdown-Exports unterstützt (V2): separate Verarbeitung, nicht V1-Scope
