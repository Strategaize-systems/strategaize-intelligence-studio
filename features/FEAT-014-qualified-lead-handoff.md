# FEAT-014 — Lead Handoff (Pipeline-Push) + Performance-Capture

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
**Schließt die Marketing-Schleife: qualifizierte Leads landen als Deal in einer Business-Pipeline, Performance-Daten gehen als few-shot zurück in den nächsten KI-Generierungs-Call.**

Zwei zusammengehörige Mechaniken:
1. **Lead-Handoff via Pipeline-Push:** Statt einer separaten Qualified-Lead-Inbox-Entität im Business System (alte FEAT-014-V3-Architektur, DEC-005) pusht V1 qualifizierte Leads als neuen Deal in eine bestehende Business-Pipeline. Pipeline-Funktion existiert im Business System bereits — kein Neu-Feature dort nötig.
2. **Performance-Capture-Loop:** Pro Asset werden Performance-Daten manuell erfasst (10-Sek-UX nach Posting). Top-Performer werden als few-shot in den nächsten KI-Generierungs-Call zurückgespielt — das macht V1 zum Closed Loop.

**Ablöse von DEC-005:** Die ursprüngliche Architektur (Qualified-Lead-Inbox als neue Entität im Business V4.x/V5) wird durch DEC-022 (Pipeline-Push) ersetzt. Begründung: Pipeline-Funktion mit konfigurierbaren Stages existiert bereits, doppelte Entitäten-Modellierung ist unnötig, die Pipeline „Lead-Generierung" mit Stage „Neu" erfüllt den gleichen Zweck.

## In Scope (V1)

### Mechanik 1: Lead-Handoff via Pipeline-Push

#### Handoff-Event-Entität

Jede Übergabe erzeugt ein Event als Audit-Trail.

**Pflichtfelder:**
- Lead-Referenz (n:1 zu FEAT-015 Lead)
- Campaign-Referenz (n:1 zu FEAT-011 Campaign)
- Pitch-Referenz (n:1 zu FEAT-016 Pitch — der Pitch, der den Lead qualifiziert hat)
- Zeitpunkt
- Übergabe-Mechanismus: `pipeline_push` / `manual` (V1 = Pipeline-Push als Default; Manual als Fallback)
- Business-Seitige-Deal-ID (UUID des erzeugten Deals in Business — nach erfolgreichem Push)
- Business-Seitige-Pipeline-Name (z. B. „Lead-Generierung")
- Business-Seitige-Stage-Name (z. B. „Neu")
- Status: `pending` / `pushed` / `failed` / `acknowledged` / `converted` / `rejected`

**Optionale Felder:**
- Begleit-Notizen (Freitext, Kontext für Berater)
- Score-Snapshot (V1 = manuelle Markierung als „qualifiziert"; ab V3 = FEAT-013 Score)
- Asset-Referenzen (welche Content-Assets der Lead schon gesehen hat)

#### Pipeline-Push-Mechanik

**Default V1 (Pipeline-Push):**
- REST-Call an Business-System-API-Endpoint
- Auth: Internal-API-Token (gleiche Hetzner-Coolify-Umgebung)
- JSON-Payload enthält: Lead-Daten (Name, Firma, E-Mail, LinkedIn-URL, Branche), Pitch-Inhalt, Asset-Referenzen, Campaign-Kontext, IS-Lead-ID
- Business-Seite erzeugt einen Deal in Pipeline „Lead-Generierung", Stage „Neu" und gibt Deal-UUID zurück
- IS speichert Business-Deal-ID im Handoff-Event und im Lead-Record (`lead.business_deal_id`)
- Idempotency: Wenn IS-Lead bereits gepusht wurde, kein doppelter Push (Konstrastraint auf Lead-ID + Campaign-ID)

**Fallback V1 (Manual):**
- Wenn Pipeline-Push fehlschlägt (z. B. Business-API nicht erreichbar): Status `failed` + Notification
- UI bietet „Manuell als gepusht markieren"-Button (Berater erstellt Deal selbst, trägt Business-Deal-ID nach)

**Status-Sync zurück (V1 Light):**
- Webhook-Endpoint im IS: Business kann bei Stage-Wechsel oder Deal-Abschluss benachrichtigen
- IS aktualisiert Handoff-Event-Status entsprechend (`acknowledged` → `converted` oder `rejected`)
- Wenn Webhook nicht implementiert: täglicher Cron-Sync via Business-API-Pull (Liste der Deals der letzten 30 Tage in Pipeline „Lead-Generierung")

#### Trigger-Logik V1

- **Manueller Trigger (V1-Default):** Berater markiert einen Lead als „qualifiziert" → Klick auf „An Pipeline pushen" → Handoff-Event wird erzeugt + Push ausgelöst
- **Batch-Trigger:** „Alle Leads im Status `qualified` der letzten X Tage pushen"
- **Auto-Trigger via Score (V3+):** Wenn FEAT-013 Lead Scoring aktiv und Lead überschreitet Threshold → automatischer Handoff (in V1 nicht aktiv)

#### UI

- **Handoff-Inbox-Übersicht:** Liste aller Handoff-Events mit Filter (Status, Campaign, Zeitraum, Push-Mechanismus)
- **Lead-Detail:** zeigt Handoff-History und aktuellen Business-Deal-Status
- **Handoff-Dashboard:** Conversion-Rate (qualifiziert → gepusht → acknowledged → converted), Cost-per-Push, Cost-per-Conversion
- **„An Pipeline pushen"-Button** im Lead-Detail (mit Pre-Check ob alle Pflichtfelder erfasst sind)
- **„Manuell als gepusht markieren"-Button** als Fallback

### Mechanik 2: Performance-Capture-Loop

#### Performance-Capture-Felder (pro Asset)

Performance-Daten werden manuell erfasst, weil V1 noch kein Auto-Tracking hat (V2 E-Mail-Tracking, V5 Voll-Tracking).

**Felder pro Asset (an FEAT-009 Asset gehängt):**
- `posted_at` (timestamp, Pflicht beim Statuswechsel auf „veröffentlicht")
- `channel` (text — z. B. „LinkedIn-Personal-Profile", „LinkedIn-Company-Page", „E-Mail-Sendung", „Blog-Veröffentlichung", „Brief-Versand")
- `cost_eur` (numeric — z. B. LinkedIn-Ad-Budget, Brief-Druck-und-Porto, „0" für Organic)
- `impressions` (integer NULL — erfasst nach 7-30 Tagen)
- `clicks` (integer NULL)
- `leads_generated` (integer — Anzahl Leads, die direkt aus diesem Asset kamen)
- `notes` (text NULL — qualitatives Feedback)
- `entered_at` (timestamp, automatisch)
- `entered_by` (user_id)

**LinkedIn-Ads-CSV-Import-Adapter:**
- Adapter `linkedinAdsCsvAdapter` importiert LinkedIn-Ads-Reports und mappt automatisch auf `asset_performance`-Felder (impressions, clicks, cost_eur)
- CSV-Format LinkedIn-Standard, keine Auth nötig (offline-Import nach manuellem CSV-Download)
- Manuelle Zuordnung Asset ↔ Ad-Kampagne nötig (Asset-ID-Tag in Ad-Name oder UI-Mapping-Schritt)

#### UX: 10-Sek-Capture nach Posting

- Asset-Detail hat einen separaten „Performance"-Tab mit den Felder
- Nach Statuswechsel auf „veröffentlicht" Pop-Up: „Wann gepostet? Auf welchem Kanal? Welche Kosten?" (3 Pflichtfelder direkt abfragbar)
- Spätere Werte (impressions, clicks, leads_generated, notes) werden manuell nachgetragen — UI-Reminder nach 7 / 14 / 30 Tagen

#### Few-shot-Performance-Loop in KI-Generierung

- Bei Asset-Request des gleichen Output-Typs (FEAT-009) Query auf `asset_performance` für Top-Performer
- **Klassifikation Top/Mid/Low** (V1 einfach): basierend auf `leads_generated / cost_eur`-Ratio (mit Fallback auf `leads_generated` wenn Cost = 0)
- Top-2-Performer als few-shot mitgeben in Prompt: „Diese Beispiele haben gut funktioniert" + Asset-Markdown
- Optional: Top-1-Performer + Low-1-Performer als Kontrast: „Funktioniert: X. Funktioniert NICHT: Y"
- **Differentiator gegenüber Jasper/Copy.ai:** Generischer Content-Generator hat diesen Performance-Loop nicht — V1-Marketing-Launcher schließt ihn schon mit minimaler manueller Erfassung.

### UI Performance-Aggregation

- **Performance-Dashboard pro Campaign** (FEAT-011): Aggregation über alle zugeordneten Assets
- **Performance-Dashboard pro Output-Typ** (FEAT-009): Vergleich Cost-per-Lead pro Skill-Quelle (welcher Output-Typ konvertiert besser)
- **Performance-Dashboard pro Asset:** Detail-Ansicht mit Eingabe-Form

### Template-Ready
- `template_id` (UUID NULL in V1) auf `handoff_event` und `asset_performance`

## Out of Scope (V1)

- **Qualified-Lead-Inbox als separate Entität im Business** (DEC-005, abgelöst durch DEC-022 — Pipeline-Push) — entfällt dauerhaft
- Auto-Trigger via Lead-Score (V3+, FEAT-013-Threshold)
- Automatische Deal-Anlage im Business **mit Business-Roadmap-Auto-Pipeline** (V9+)
- Bidirektionale Sync (Business → IS über andere Felder als Status) — V5+
- Lead-Reaktivierung („dead" → „re-engaged") (V8+)
- Multi-Destination-Handoff (ein Lead an mehrere Systeme) (V9+)
- Auto-Tracking aus E-Mail-Open/Click (V2) und LinkedIn-Posting (V4)
- KI-Auto-Klassifikation Top/Mid/Low (V5)
- A/B-Statistik mit Signifikanz-Test (V5)

## Acceptance Criteria

### Lead-Handoff (Pipeline-Push)

- Manueller Trigger funktioniert: Berater markiert Lead als qualifiziert + Klick → Pipeline-Push wird ausgelöst
- Pipeline-Push erzeugt Deal in Business-Pipeline „Lead-Generierung", Stage „Neu" — verifiziert über Business-API-Smoke-Test (mind. 1 erfolgreicher Push in V1-Acceptance)
- Idempotency funktioniert: Doppel-Push wird verhindert
- Status-Sync zurück (Webhook oder Cron-Pull) aktualisiert IS-Handoff-Status korrekt
- Manueller Fallback („manuell als gepusht markieren") funktioniert
- Conversion-Rate-Dashboard berechnet auf Basis der Status-Updates korrekt

### Performance-Capture

- Performance-Felder pro Asset eingabefähig (`posted_at`, `channel`, `cost_eur` als Pflicht beim „veröffentlicht"-Status)
- 10-Sek-UX nach Posting funktioniert (Pop-Up mit 3 Pflichtfeldern)
- LinkedIn-Ads-CSV-Import funktioniert (mind. 1 Test-Import in V1-Acceptance)
- Spätere Werte (impressions, clicks, leads_generated) sind nachträglich erfassbar
- Few-shot-Performance-Loop funktioniert: Bei Asset-Request des gleichen Output-Typs werden Top-2-Performer eingespeist (verifizierbar via Prompt-Inspection)
- Performance-Dashboard pro Campaign / Output-Typ / Asset zeigt korrekte Aggregationen

## Dependencies

- **FEAT-015 Lead Research** (Lead-Datenquelle)
- **FEAT-016 Messaging-Variation** (Pitch als Auslöser des Pushes)
- **FEAT-011 Campaign Management LITE** (Campaign-Kontext im Push)
- **FEAT-009 Content Asset Production** (Asset-Performance hängt an Asset)
- **Business System V4+** — Pipeline-Funktion mit erreichbarem API-Endpoint für Deal-Erstellung. Pipeline „Lead-Generierung" mit Stage „Neu" muss existieren oder im V1-Deploy angelegt werden.

## Architektur-Hinweise für `/architecture V1`

### Lead-Handoff

- **Tabelle `handoff_event`:** `id`, `lead_id`, `campaign_id`, `pitch_id`, `pushed_at`, `mechanism (enum)`, `business_deal_id (NULL)`, `business_pipeline_name (text NULL)`, `business_stage_name (text NULL)`, `status (enum)`, `payload_snapshot (JSONB)`, `notes (text)`, `template_id (NULL)`, `created_at`, `created_by`
- **Adapter `businessPipelineAdapter`:** Outbound-API-Client mit Internal-API-Token-Auth, Idempotency-Key (Lead-ID + Campaign-ID), Retry-Logic
- **Konfiguration via ENV:** `BUSINESS_API_BASE_URL`, `BUSINESS_API_TOKEN`, `BUSINESS_PIPELINE_NAME` (default „Lead-Generierung"), `BUSINESS_STAGE_NAME` (default „Neu")
- **Status-Sync zurück:**
  - Option A (Webhook): IS exposed Endpoint `/api/webhooks/business/deal-status` mit Token-Auth, Business pushed Status-Updates
  - Option B (Cron-Pull): Worker-Job pollt täglich Business-API für Deals der letzten 30 Tage in Pipeline „Lead-Generierung"
  - V1-Empfehlung: B (einfacher zu integrieren), A als V2-Erweiterung wenn Webhook-Infrastruktur etabliert
- **Lead-Status-Statemaschine:** `new` → `qualified` → `pushed` → (von Business: `acknowledged` / `rejected` / `converted` / `dead`)
- **Pipeline-Push-API-Endpoint im Business System:** Vor V1-Implementierung verifizieren (OQ-V1-03 im PRD). Erwartetes Endpoint-Schema: POST /api/pipelines/{pipeline_id}/deals mit Lead-Payload, Response = Deal-UUID

### Performance-Capture

- **Tabelle `asset_performance`:** `id`, `asset_id`, `posted_at`, `channel (text)`, `cost_eur (numeric)`, `impressions (int NULL)`, `clicks (int NULL)`, `leads_generated (int)`, `notes (text NULL)`, `template_id (NULL)`, `entered_at`, `entered_by`
- **Adapter `linkedinAdsCsvAdapter`:** CSV-Parser mit Mapping-Logic, schreibt in `asset_performance`. Adapter-Verzeichnis konsistent mit DEC-009 Provider-Adapter-Pattern.
- **Few-shot-Loop in `assetGenerationWorker`:** Bei Asset-Request des gleichen Output-Typs Query
  ```sql
  SELECT a.id, av.markdown_content, ap.leads_generated, ap.cost_eur
  FROM asset_performance ap
  JOIN asset a ON a.id = ap.asset_id
  JOIN asset_version av ON av.id = a.current_version_id
  WHERE a.output_type = $1
    AND ap.leads_generated > 0
  ORDER BY (ap.leads_generated::float / GREATEST(ap.cost_eur, 1)) DESC
  LIMIT 2
  ```
- **Performance-Aggregation-Views:** `view_campaign_performance`, `view_output_type_performance`, `view_asset_performance_summary` — alle aus `asset_performance` joined mit `campaign_asset`, `asset`, `asset_version`

## Migration aus alter V3-Spec

Die alte V3-Spec basierte auf einer separaten Qualified-Lead-Inbox-Entität im Business (DEC-005). DEC-022 löst das ab durch Pipeline-Push.

- Keine Daten-Migration (V1 startet leer)
- Alte FEAT-014-V3-Architektur-Hinweise zur Inbox-Push-Mechanik bleiben als historische Referenz im Archiv
- DEC-005 wird als „superseded by DEC-022" markiert

## Referenzen

- DEC-005 (Qualified-Lead-Inbox) — wird abgelöst durch DEC-022 (Pipeline-Push)
- DEC-022 (Pipeline-Push) — neu in dieser Runde, siehe `/docs/DECISIONS.md`
- FEAT-009 (Asset-Performance hängt an Asset)
- FEAT-011 (Campaign-Aggregation nutzt Performance-Daten)
- Pipeline-Funktion im Business System V4+ (existiert)
