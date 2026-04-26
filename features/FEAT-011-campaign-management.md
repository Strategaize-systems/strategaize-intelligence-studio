# FEAT-011 — Campaign Management LITE (V1) + Voll-Variant (V4)

## Status
- Version: V1 (LITE) + V4 (Voll-Variant)
- Status: planned
- Priority: high

## Purpose
Zentrales Kampagnen-Objekt für alle vertrieblichen und marketingseitigen Ausspiel-Aktivitäten. **V1 ist eine Lite-Variante** (Parent-Klammer ohne Channel-Segments und ohne Variants), die V1-Marketing-Launcher-Slices zusammenklammert. **V4 erweitert auf Voll-Variant** (Channel-Segments + Variants für A/B-Vorbereitung) — dann ist Multi-Channel-Distribution scharfgeschaltet.

**Kontext-Update 2026-04-25:** Die ursprüngliche V3-Spec sah Channel-Segments + Variants direkt vor. Pivot 2026-04-25: V1 startet mit Lite-Klammer (kein Channel-Segment, kein Variant), weil V1 noch keine echte Multi-Channel-Distribution ausspielt. Voll-Variant inklusive High-Attention-Outreach (physischer Brief + Call) verschiebt sich auf V4. DEC-004 (Parent + Channel-Segments + Variants) bleibt strukturell gültig — nur die V1-Aktivierung ist auf Parent-only reduziert.

## In Scope V1 (LITE)

### Parent-Campaign-Entität (Klammer ohne Channel-Segments)

Die strategische Kampagne als Klammer für Asset-Set + Lead-Set + Pitch-Set in einem Zeitfenster.

**Pflichtfelder V1:**
- Titel (z. B. „Q2 2026 Steuerberater Süddeutschland Outreach")
- Ziel/Hypothese (Freitext)
- Zugehöriges ICP (n:1 zu FEAT-010 ICP)
- Zugehöriges Segment (n:1 zu FEAT-010 Segment)
- Zeitfenster (Start/Ende)
- Erfolgssignale (strukturierte Liste — z. B. „mind. 5 Pipeline-Pushes", „Cost-per-Lead < 80 EUR")
- Status: `entwurf` → `aktiv` → `abgeschlossen` → `abgebrochen`
- Verantwortlicher (User-Referenz)

**Optionale Felder V1:**
- Budget-Rahmen (Schätzung, kein Auto-Tracking in V1)
- Verknüpftes Asset-Set (n:m zu FEAT-009) — welche Assets gehören zur Kampagne
- Verknüpftes Lead-Set (n:m zu FEAT-015) — welche Leads sind Adressaten
- Verknüpfte Pitch-Set (n:m zu FEAT-016) — welche Pitches wurden generiert
- Notizen

**V1 NICHT enthalten (aktiviert mit V4):**
- Channel-Segment-Entität (LinkedIn / E-Mail / Physical-Mail / Phone-Call als Sub-Klammern)
- Variant-Entität (A/B-Varianten innerhalb eines Channel-Segments)
- High-Attention-Outreach-Kampagnentyp (physischer Brief + Call)
- Audience-Split-Validierung
- Channel-Mix-Filter

### UI V1

- **Kampagnen-Übersicht:** Liste mit Filter (Status, ICP, Segment, Zeitraum)
- **Detail-Ansicht V1:** Parent-Felder + zugeordnete Asset-Set + Lead-Set + Pitch-Set (jeweils als Tab oder Accordion)
- **Kampagnen-Wizard V1 (Step-by-Step):**
  1. Titel + Ziel + Zeitfenster
  2. ICP + Segment auswählen (FEAT-010)
  3. Asset-Set zuordnen (FEAT-009)
  4. Lead-Set zuordnen (FEAT-015)
  5. Pitch-Set zuordnen (FEAT-016 — nach Lead-Auswahl, je 1 Pitch pro Lead)
  6. Erfolgssignale + Verantwortlicher
  7. Speichern als Entwurf oder direkt aktivieren
- **Kalender-Ansicht** (optional V1, sonst V4)

### Performance-Aggregation V1

Die Kampagnen-Detail-Ansicht zeigt aggregierte Performance über alle zugeordneten Assets (aus FEAT-014 Performance-Capture):
- Posts gesamt
- Impressions gesamt
- Clicks gesamt
- Leads-generated gesamt
- Cost gesamt (EUR)
- Cost-per-Lead (berechnet)
- Pipeline-Pushes (aus FEAT-014 Lead-Handoff)

## In Scope V4 (Voll-Variant)

In V4 wird die Lite-Klammer um die folgenden Strukturen erweitert:

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

### Variant-Entität (A/B-Vorbereitung)

**Pflichtfelder:**
- Parent-Channel-Segment (n:1)
- Titel (z. B. „Betreff-Variante A", „Hook-Variante B")
- Asset-Referenz (n:1 zu FEAT-009)
- Audience-Split-Anteil (Prozent, Summe pro Channel-Segment muss 100 ergeben)
- Status: `entwurf` / `aktiv` / `abgeschlossen`

**Hinweis:** Operative A/B-Auswertung mit Signifikanz-Test kommt erst V5 (Tracking-Voll nötig).

### High-Attention-Outreach-Kampagnentyp (V4)

- Physical-Mail-Channel-Segment: Adress-Liste + Brief-Content (Asset-Referenz) + Versand-Hinweis
- Phone-Call-Channel-Segment: Anruf-Plan, Follow-up-Script, optional Zeitplan
- IS bereitet vor, trackt physisch nicht (Gründer-Fixierung 2026-04-16 bleibt gültig)
- Manuelles Status-Update: „verschickt am X" + Follow-up-Call-Ausgang

### Template-Ready (V1 + V4)
- `template_id` (UUID NULL in V1)

## Out of Scope V1

- Channel-Segment-Entität (V4)
- Variant-Entität (V4)
- High-Attention-Outreach-Kampagnentyp (V4)
- Tatsächliches Publishing auf Kanälen (V2 E-Mail / V4 LinkedIn)
- A/B-Auswertung (V5)
- Automatische Kampagnen-Empfehlung aus Opportunities (V7+, abhängig V6)
- Kampagnen-Klonen / Templates (V9+)
- Budget-Tracking mit tatsächlichen Kosten (V5+)
- Kampagnen-Workflow-Automation (V7+)

## Acceptance Criteria V1

- Parent-Campaign kann mit allen Pflichtfeldern (V1) angelegt werden
- ICP + Segment-Verknüpfung funktioniert
- Asset-Set / Lead-Set / Pitch-Set-Zuordnung funktioniert (n:m)
- Status-Workflow durchgängig (entwurf → aktiv → abgeschlossen → abgebrochen)
- Performance-Aggregation in Detail-Ansicht zeigt korrekte Summen aus FEAT-014 Performance-Capture
- Kampagnen-Wizard führt Schritt-für-Schritt durch alle Pflicht-Inputs

## Dependencies V1

- FEAT-010 ICP & Segment (Audience-Verknüpfung)
- FEAT-009 Content Asset Production (Asset-Set)
- FEAT-015 Lead Research (Lead-Set)
- FEAT-016 Messaging-Variation (Pitch-Set)
- FEAT-014 Lead Handoff + Performance-Capture (für Aggregation)

## Architektur-Hinweise für `/architecture V1`

- **V1 Tabelle `campaign`** (Parent-only): `id`, `title`, `goal`, `icp_id`, `segment_id`, `start_at`, `end_at`, `success_signals (text[])`, `status`, `owner_id`, `budget_estimate (NULL)`, `notes`, `template_id (NULL)`, `created_at`, `created_by`
- **V1 Verknüpfungstabellen** (n:m): `campaign_asset (campaign_id, asset_id)`, `campaign_lead (campaign_id, lead_id)`, `campaign_pitch (campaign_id, pitch_id)`
- **Performance-Aggregation:** Als Materialized View oder On-the-fly-Query über `asset_performance` joined via `campaign_asset` — Empfehlung On-the-fly für V1 (kleines Volumen)
- **V4 Erweiterung (vorbereitet):** Tabellen `channel_segment` und `campaign_variant` werden in V4-Migration angelegt — V1-Schema enthält keine ungenutzten leeren Tabellen
- Kampagnen-Wizard als Multi-Step-Form-Komponente (analog Onboarding-Wizard-Pattern)

## Migration aus V3-Spec

Die alte V3-Spec sah die Voll-Variant direkt vor. V1-Tabellen-Subset wird angelegt, V4-Erweiterung dokumentiert aber nicht migriert. Es gibt keine Daten-Migration — V1 startet mit leerer Kampagnen-Tabelle.

## Referenzen

- DEC-004 (Campaign-Modell Parent + Channel-Segments + Variants) bleibt strukturell gültig — V1 aktiviert nur Parent-Subset
- FEAT-008 (Brand Profile als KI-Kontext für Asset-Generierung)
- FEAT-014 (Performance-Capture-Loop)
