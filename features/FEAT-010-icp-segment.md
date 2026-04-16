# FEAT-010 — ICP & Segment

## Status
- Version: V3
- Status: planned
- Priority: high

## Purpose
Definition von Ideal-Customer-Profiles (ICP) und daraus abgeleiteten Segmenten als Grundlage für Kampagnen (FEAT-011), Lead-Recherche (FEAT-012) und Scoring (FEAT-013). Ohne ICP/Segment gibt es keine Zielgruppen-Logik.

## In Scope (V3)

### ICP-Entität
Beschreibt einen idealtypischen Kunden strukturiert.

**Pflichtfelder:**
- Titel (z. B. „Steuerberater-Kanzlei 5–20 MA")
- Beschreibung (Freitext, Hintergrund und Positionierung)
- **Firmografische Merkmale:** Branche, Größenband (Mitarbeiter), Umsatzband, Region/Land
- **Strukturmerkmale:** z. B. Rechtsform, Alter des Unternehmens, Eigentümer-geführt ja/nein
- **Trigger-Signale:** strukturierte Liste von beobachtbaren Situationen, die ICP-Eignung anzeigen (z. B. „Wachstum > 20 %/Jahr", „Nachfolge offen", „Digitalisierungsrückstand erkennbar")

**Optionale Felder:**
- Schmerz-Punkte (Liste)
- Entscheider-Rollen (Liste von Positionen)
- Budget-Rahmen (Schätzung)
- Marktgröße-Schätzung (Anzahl Unternehmen, die das ICP erfüllen)
- Notizen

### Segment-Entität
Konkrete, gefilterte Instanz eines ICP mit tatsächlichen Unternehmen/Leads als Inhalt.

**Pflichtfelder:**
- Titel
- Zugehöriges ICP (n:1 zu FEAT-010 ICP)
- Filter-Definition: strukturierte Regeln über Business-Kontakte (FEAT-002) und/oder extern recherchierte Leads (FEAT-012)
- Aktuelle Mitglieder-Liste (dynamisch berechnet oder zum Zeitpunkt gesnapshoted — Entscheidung in `/architecture`)

**Optionale Felder:**
- Manuelle Ergänzungen (einzelne Unternehmen, die zum Segment hinzugefügt wurden)
- Ausschlüsse (Unternehmen, die aus Segment entfernt wurden)

### UI
- ICP-Übersicht: Liste, Detail-Ansicht mit allen Feldern
- Segment-Übersicht: Liste mit Anzahl Mitglieder, ICP-Referenz
- Segment-Detail: aktuelle Mitglieder mit Filter-Ansicht, manuelle Nachbearbeitung
- Segment-Definition-Builder: Regel-basierter Query-Builder über Business-Felder und Lead-Felder

### Template-Ready
- `template_id` (optional, NULL in V3)

## Out of Scope (V3)
- Dynamische Segment-Aktualisierung in Echtzeit (V5+; V3 = Snapshot oder Cron-Refresh)
- KI-generierte ICP-Vorschläge aus Cross-Kunden-Learnings (V8+)
- Marktgröße-Auto-Berechnung via externer Datenquellen (V8+)
- ICP/Segment-Vererbung und Kompositionen (V8+)
- Multi-Tenant-ICP-Bibliothek (V8+)

## Acceptance Criteria
- ICP kann mit allen Pflichtfeldern angelegt werden
- Mehrere ICPs sind parallel anlegbar
- Segment kann aus ICP abgeleitet werden mit Filter-Regeln
- Segment-Mitglieder werden korrekt berechnet (aus Business-Kontakten + Lead-Pool)
- Manuelle Ergänzungen und Ausschlüsse funktionieren
- UI-Übersicht zeigt Segment-Größe
- Filter-Regeln sind nach Erstellung editierbar

## Dependencies
- FEAT-002 Ingest-Layer Business (Kontakt-/Unternehmen-Daten für Filter)
- FEAT-012 Lead Research & Enrichment (externe Leads als Segment-Mitglieder)
- Wird genutzt von: FEAT-011 Campaign, FEAT-013 Scoring, FEAT-014 Handoff

## Architektur-Hinweise für `/architecture`
- ICP-Tabelle mit Json-Feldern für flexible Merkmal-Listen
- Segment-Mitgliedschaft als M:N (Segment ↔ Unternehmen) mit `source` (business_contact, external_lead, manual)
- Query-Builder: Regel-Definitionen als JSON, Executor-Service wandelt in SQL-Filter
- Segment-Snapshot vs. Live-Query: Entscheidung abhängig von Kontakt-Volumen
