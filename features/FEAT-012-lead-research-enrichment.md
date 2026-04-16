# FEAT-012 — Lead Research & Enrichment

## Status
- Version: V3
- Status: planned
- Priority: high

## Purpose
Strukturierte Lead-Recherche und Datenanreicherung als Input-Layer für Kampagnen (FEAT-011). Kombiniert manuelle Recherche, Research-Briefings und externe Enrichment-Tools (Clay) in einheitlichem Lead-Pool. Ohne diesen Layer hat Campaign keine Zielgruppen-Instanzen außer Business-Kontakten.

## In Scope (V3)

### Lead-Entität
Ein recherchierter oder importierter potenzieller Kontakt.

**Pflichtfelder:**
- Unternehmen (Name, ggf. Handelsregister-Nr.)
- Vollname + Position (wenn bekannt)
- Quelle: `manual`, `clay_import`, `research_task`, `csv_import`, `webhook`
- Status: `new` / `qualified` / `contacted` / `handed_off` / `rejected` / `dead`
- Zugeordnete Kampagne (optional, n:1 zu FEAT-011)
- Zugeordnete Segmente (optional, n:m zu FEAT-010)
- Zugeordnete Research Task (optional, n:1 zu Research Task unten)

**Optionale (Enrichment-)Felder:**
- E-Mail, Telefon, LinkedIn-URL, Unternehmens-Website
- Firmografische Daten: Größe, Umsatz, Branche, Region
- Trigger-Signale (Match zu ICP)
- Freie Notizen
- Enrichment-Rohdaten (JSON, für spätere Auswertung)

### Research-Task-Entität
Basierend auf archiviertem FEAT-012 (Research & Market Prep).

**Pflichtfelder:**
- Titel
- Research-Typ: `zielgruppen_recherche`, `operator_suchprofil`, `multiplikator_profilierung`, `testmarkt_analyse`, `outreach_pack`, `listenauftrag`
- Quell-Objekt (optional: Opportunity aus FEAT-005, Kampagne aus FEAT-011, oder manuell)
- Fragestellung (Freitext: was soll herausgefunden werden?)
- Kontext (Freitext: warum wird das gebraucht?)
- Status: `offen` / `in_recherche` / `abgeschlossen` / `verworfen`

**Optionale Felder:**
- Kontakt-/Suchkriterien (strukturiert)
- Ergebnis (Markdown-Freitext nach Abschluss)
- Ergebnis-Leads (n:m zu Lead-Entität: welche Leads sind aus dieser Research entstanden)

### Clay-Enrichment-Adapter
**V3-Minimum: CSV-Import.**
- CSV-Upload-Interface (Drag-and-drop + Feld-Mapping)
- Standard-Feld-Mapping für Clay-Export-Format (documented in `/architecture`)
- Duplikat-Erkennung (Unternehmens-Name + Domain-Match)

**V3-Optional (Entscheidung in `/architecture`):**
- Webhook-Endpoint für Clay → IS (Push-Pattern)
- Clay-API-Pull (Pull-Pattern) für bestehende Clay-Tables

### Manuelle Lead-Ergänzung
- Lead manuell anlegen mit allen Feldern
- Lead an bestehenden Research Task oder Kampagne knüpfen
- Lead-Bulk-Import per CSV (generisch, nicht Clay-spezifisch)

### UI
- Lead-Übersicht: Liste mit Filter (Status, Kampagne, Segment, Quelle), Volltext-Suche
- Lead-Detail: alle Felder + Enrichment-Rohdaten-Ansicht + History
- Research-Task-Übersicht: Liste mit Filter nach Research-Typ und Status
- Research-Task-Detail: alle Felder + verknüpfte Leads
- CSV-Upload-Wizard

### Template-Ready
- `template_id` (optional, NULL in V3)

## Out of Scope (V3)
- Automatische Lead-Generierung aus externen Quellen ohne Clay (V8+)
- Real-time Enrichment bei Lead-Anlage (V8+)
- Kontakt-Historie-Tracking (gehört zu Business nach Handoff)
- Dubletten-Merge-Logik mit Business-Kontakten (V5+, wenn Business-Constraint klarer)
- LinkedIn-Scraping oder ähnliche scraping-basierte Recherche (rechtlich kritisch, nicht geplant)
- Research-Task-KI-Vorschlag aus Opportunities (V6+)

## Acceptance Criteria
- Lead kann manuell angelegt werden mit allen Pflichtfeldern
- CSV-Import funktioniert mit Clay-Export-Format + generischem Format
- Duplikat-Erkennung identifiziert bestehende Leads (anhand Unternehmen + Domain)
- Research Task kann angelegt werden, alle 6 Research-Typen verfügbar
- Research-Task-Ergebnis kann dokumentiert und mit Leads verknüpft werden
- Lead kann einer Kampagne zugeordnet werden
- Lead-Status-Workflow funktioniert
- Enrichment-Rohdaten werden als JSON gespeichert und in UI einsehbar

## Dependencies
- FEAT-010 ICP & Segment (Segment-Zuordnung, Trigger-Signal-Match)
- Wird genutzt von: FEAT-011 Campaign, FEAT-013 Scoring, FEAT-014 Handoff

## Architektur-Hinweise für `/architecture`
- Lead-Tabelle mit JSON-Feld für Enrichment-Rohdaten (flexibel über Quellen hinweg)
- Research-Task als separate Tabelle mit n:m zu Lead
- CSV-Import als Worker-Job (async für große Uploads)
- Duplikat-Erkennung: Unternehmens-Name (fuzzy) + Domain (exact) als Primary-Match
- Clay-Adapter abstract: V3 nur CSV; Interface für Webhook/API-Pull vorbereiten
- Lead ↔ Business-Kontakt-Mapping: in V3 noch nicht erforderlich (Handoff als Export, FEAT-014); in V5+ ggf. Live-Link
