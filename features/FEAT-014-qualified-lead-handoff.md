# FEAT-014 — Qualified Lead Handoff

## Status
- Version: V3
- Status: planned
- Priority: high

## Purpose
**Fluss 5b der Gesamtarchitektur.** Wenn ein Lead qualifiziert ist (Score über Threshold, FEAT-013), wird er aus IS an das Business Development System übergeben — in eine dortige „Qualified Lead Inbox", die der Berater manuell bearbeitet. Grenzlinie IS ↔ Business: IS = Pre-Sales, Business = Lead-Abarbeitung (Gründer-Fixierung 2026-04-16).

**Kritische Abhängigkeit:** Business V4 hat heute keine Qualified-Lead-Inbox-Entität. Business-seitige Erweiterung ist Voraussetzung für den scharfgeschalteten Handoff. Bis dahin: CSV-Export als Übergangslösung (siehe Risk R-05 im PRD).

## In Scope (V3)

### Handoff-Event-Entität
Jede Übergabe erzeugt ein Event.

**Pflichtfelder:**
- Lead-Referenz (n:1 zu FEAT-012 Lead)
- Kampagnen-Referenz (n:1 zu FEAT-011 Parent-Campaign)
- Channel-Segment-Referenz (optional, aus welchem Channel-Segment kam der Lead)
- Variant-Referenz (optional, aus welcher Variante kam der Lead)
- Zeitpunkt
- Übergabe-Mechanismus: `api_push` / `csv_export` / `manual`
- Business-Seitige-ID (wenn via API erzeugt, die ID der neuen Business-Qualified-Lead-Inbox-Entität)
- Score-Snapshot zum Zeitpunkt der Übergabe
- Status: `pending` / `sent` / `received` / `rejected_by_business` / `converted` / `dead`

**Optionale Felder:**
- Begleit-Notizen (Freitext, Kontext für Berater)
- Score-Begründung (automatisch generiert: welche Regeln haben getroffen)
- Asset-Referenzen (welche Content-Assets der Lead schon gesehen hat)

### Handoff-Mechaniken
**Primär (sobald Business liefert):** API-Push an Business Qualified-Lead-Inbox-Endpoint.
- REST-Call mit JSON-Payload (Lead-Daten + Kampagnen-Kontext + Score-Begründung)
- Business bestätigt Empfang mit ID
- Business meldet Status-Änderungen zurück (received/rejected/converted)

**Übergang (während Business-Inbox fehlt):** CSV-Export.
- Manueller Trigger: „Alle qualifizierten Leads der letzten X Tage exportieren"
- CSV-Format kompatibel mit Business-Manual-Import
- Berater importiert CSV manuell in Business

**Fallback:** Manueller Handoff.
- Einzelner Lead wird per Copy-Paste an Berater kommuniziert (Slack, E-Mail)
- UI bietet „Manueller Handoff — markieren als übergeben"-Button

### Trigger-Logik
- Automatischer Trigger: Lead überschreitet Threshold → Handoff-Event wird erzeugt (pending)
- Manueller Trigger: Berater markiert Lead manuell als „jetzt übergeben"
- Batch-Handoff: „alle qualifizierten Leads jetzt übergeben"

### Status-Sync
- IS erhält Status-Updates aus Business (via API bei API-Push; manuell bei CSV/Manual)
- IS-Lead-Status wird entsprechend gespiegelt: `qualified` → `handed_off` → (von Business gemeldet: `converted` / `rejected` / `dead`)

### UI
- Handoff-Inbox-Übersicht: Liste aller Handoff-Events mit Filter (Status, Kampagne, Zeitraum)
- Lead-Detail: zeigt Handoff-History und aktuellen Business-Status
- Handoff-Dashboard: Conversion-Rate (qualifiziert → handed_off → converted)
- CSV-Export-Button für Übergangsphase

### Template-Ready
- `template_id` (optional, NULL in V3)

## Out of Scope (V3)
- Automatischer Deal-Anlage im Business (Business entscheidet selbst, was aus einer Inbox-Zeile wird)
- Bidirektionale Sync (Business → IS über andere Felder als Status) — V5+, wenn Attribution auf Deal-Ebene relevant wird
- Lead-Reaktivierung („dead" → „re-engaged") (V8+)
- Multi-Destination-Handoff (ein Lead an mehrere Systeme) (V8+)
- Automatisierter Status-Nachsync ohne Business-API (V5+)

## Acceptance Criteria
- Handoff-Event wird bei Threshold-Überschreitung automatisch erzeugt (Status `pending`)
- CSV-Export mit korrektem Format funktioniert (Übergangslösung)
- API-Push funktioniert, **sobald Business-Endpoint existiert** (V3-Test kann ohne Business-Endpoint nur mit Mock erfolgen)
- Manueller Handoff-Button funktioniert für einzelnen Lead
- Status-Sync (API oder manuell) aktualisiert IS-Lead-Status korrekt
- UI zeigt Handoff-History pro Lead nachvollziehbar
- Conversion-Rate-Dashboard funktioniert (berechnet auf Basis der Status-Updates)

## Dependencies
- FEAT-013 Lead Scoring (Threshold-Trigger)
- FEAT-012 Lead Research & Enrichment (Lead-Daten)
- FEAT-011 Campaign Management (Kampagnen-Kontext im Handoff)
- **Business V4.x/V5** — Qualified-Lead-Inbox-Entität als neues Feature (extern, Business-Roadmap)

## Architektur-Hinweise für `/architecture`
- Handoff-Event-Tabelle mit JSON-Feld für Payload-Snapshot (unveränderlich nach Export)
- Outbound-API-Client für Business-Push (Retry-Logic, Idempotency-Key)
- CSV-Export-Worker-Job für Batch-Exporte
- Status-Sync: IS empfängt Business-Webhooks (falls Business das liefert) oder pollt Business-API
- Lead-Status `handed_off`, `converted`, `rejected`, `dead` als Statusmaschine modellieren
- Konfiguration: Business-API-Endpoint + Auth-Token als ENV-Variable

## Business-System-Abstimmung nötig
Vor V3-Slice-Planning klären:
- Hat Business V4.x/V5 eine Qualified-Lead-Inbox auf der Roadmap? Wenn nein: einplanen.
- Welches Auth-Modell (API-Token, OAuth, mTLS)?
- Welche Felder muss der JSON-Payload enthalten?
- Wie macht Business die Status-Rückmeldung? Webhook oder Poll?
