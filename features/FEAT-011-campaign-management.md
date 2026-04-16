# FEAT-011 — Campaign Management

## Status
- Version: V3
- Status: planned
- Priority: high

## Purpose
Zentrales Kampagnen-Objekt für alle vertrieblichen und marketingseitigen Ausspiel-Aktivitäten. Modelliert digital + physisch einheitlich mit Parent-Campaign + Channel-Segmenten + Variant-Ebene für A/B-Testing-Vorbereitung.

**Kontext:** Gründer-Entscheidung OQ-V2-01 (2026-04-16): Parent-Campaign mit Channel-Segment-Kindern, Variant-Ebene für späteres A/B-Testing in V5 vorbereitet.

## In Scope (V3)

### Parent-Campaign-Entität
Die strategische Kampagne mit Ziel und Zielgruppe.

**Pflichtfelder:**
- Titel (z. B. „Q2 Akquise Steuerberater Süddeutschland")
- Ziel/Hypothese (Freitext)
- Zugehöriges Segment (n:1 zu FEAT-010 Segment)
- Zeitfenster (Start/Ende)
- Erfolgssignale (strukturierte Liste)
- Kampagnentyp: `standard_outbound`, `inbound_triggered`, `hybrid`, **`high_attention_outreach`**
- Status: `entwurf` → `aktiv` → `abgeschlossen` → `abgebrochen`
- Verantwortlicher (User-Referenz)

**Optionale Felder:**
- Budget-Rahmen
- Verknüpftes Asset-Paket (Referenz auf FEAT-009 Assets)
- Verknüpfte Opportunity (Referenz auf FEAT-005)
- Notizen

### Channel-Segment-Entität
Ein Kanal innerhalb einer Kampagne.

**Pflichtfelder:**
- Parent-Campaign (n:1)
- Kanal: `linkedin`, `email`, `physical_mail`, `phone_call`, `other`
- Zielgruppen-Filter (optional: Untermenge des Parent-Segments)
- Zeitfenster (optional abweichend von Parent)
- Status: `entwurf` / `aktiv` / `abgeschlossen`

**Optionale Felder:**
- Briefing-Notizen
- Verknüpfte Assets (n:m zu FEAT-009)

### Variant-Entität
Eine A/B-Test-Variante innerhalb eines Channel-Segments.

**Pflichtfelder:**
- Parent-Channel-Segment (n:1)
- Titel (z. B. „Betreff-Variante A", „Hook-Variante B")
- Asset-Referenz (n:1 zu FEAT-009)
- Audience-Split-Anteil (Prozent, Summe pro Channel-Segment muss 100 ergeben)
- Status: `entwurf` / `aktiv` / `abgeschlossen`

**Hinweis:** Varianten werden in V3 angelegt. Operative Auswertung kommt erst V5 (Tracking nötig).

### High-Attention-Outreach-Kampagnentyp
Spezielle Handhabung für physische Kampagnen:
- Physical-Mail-Channel-Segment: Adress-Liste + Brief-Content (Asset-Referenz) + Versand-Hinweis
- Phone-Call-Channel-Segment: Anruf-Plan, Follow-up-Script, optional Zeitplan
- **IS bereitet vor, trackt physisch nicht** (Gründer-Fixierung 2026-04-16)
- Manuelles Status-Update: „verschickt am X" + Follow-up-Call-Ausgang

### UI
- Kampagnen-Übersicht: Liste mit Filter (Status, Kanal-Mix, Segment, Typ)
- Detail-Ansicht: Parent + alle Channel-Segmente + Varianten hierarchisch
- Kampagnen-Wizard: Schritt-für-Schritt-Anlage (Segment auswählen → Kanäle wählen → Assets zuordnen → Zeitplan → Start)
- Kalender-Ansicht (optional in V3, sonst V4)

### Template-Ready
- `template_id` (optional, NULL in V3)

## Out of Scope (V3)
- Tatsächliches Publishing auf Kanälen (V4)
- Echtes A/B-Test-Auswertung mit Performance-Vergleich (V5)
- Automatische Kampagnen-Empfehlung aus Opportunities (V6+)
- Kampagnen-Klonen / Templates-als-Ausgangspunkt (V8+)
- Budget-Tracking mit tatsächlichen Kosten (V5+)
- Kampagnen-Workflow-Automation (Triggered-Sequenzen) (V6+)

## Acceptance Criteria
- Parent-Campaign kann mit allen Pflichtfeldern angelegt werden
- Mindestens 2 Channel-Segmente pro Kampagne anlegbar
- Variant-Ebene ist funktional (mindestens 2 Varianten pro Channel-Segment)
- Audience-Split-Anteile werden validiert (Summe = 100)
- High-Attention-Outreach-Kampagnentyp funktioniert mit Physical-Mail + Phone-Call-Channel-Segmenten
- Status-Workflow durchgängig
- Hierarchische Detail-Ansicht zeigt Parent → Channel-Segmente → Varianten
- Verknüpfung zu Assets (FEAT-009), Segment (FEAT-010), Opportunity (FEAT-005) funktioniert

## Dependencies
- FEAT-010 ICP & Segment (Zielgruppen-Referenz)
- FEAT-009 Content Asset Production (Asset-Zuordnung)
- FEAT-005 Opportunity & Decision (optionale Verknüpfung)

## Architektur-Hinweise für `/architecture`
- Drei-Tabellen-Struktur: `campaign` → `channel_segment` (n:1) → `campaign_variant` (n:1)
- Channel-Enum erweiterbar (LinkedIn, E-Mail, Physical-Mail, Phone-Call, Other; Paid-Plattformen folgen V8+)
- Audience-Split-Validierung via Check-Constraint oder App-Layer
- Physical-Mail-Artefakte: Adress-Liste als Array oder separate Tabelle
- Publishing-Events (FEAT V4) werden später an Channel-Segment + Variant verknüpft
- Tracking-Events (FEAT V5) ebenso
