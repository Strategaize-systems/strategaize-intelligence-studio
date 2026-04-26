# FEAT-015 — Lead Research (Firecrawl + Clay-CSV)

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
Wiederholbare Lead-Recherche pro Segment mit zwei Quellen: **Firecrawl-Adapter als Primary** (API, Pay-as-you-go, planbare Kosten) und **Clay-CSV-Import als Fallback**. Lead-Pool ist Datenquelle für Segment-Mitgliedschaft (FEAT-010), Pitch-Generierung (FEAT-016) und Lead-Handoff (FEAT-014).

**Kontext:** Diese Spec ersetzt die alte FEAT-012 (Lead Research & Enrichment, V3-Spec). Hauptunterschiede: Firecrawl statt offene API-Pull-Strategie, kein Research-Task-Workflow mit 6 Typen (V7+), keine Clay-API-Integration in V1 (nur CSV-Import), kein Enrichment-Layer (V3+).

**Alte FEAT-012-Spec wird im /architecture V1-Lauf entweder archiviert oder als „v1-pivot-redirect" markiert.**

## In Scope (V1)

### Lead-Entität

Repräsentiert einen einzelnen Lead (Unternehmen + Kontaktperson).

**Pflichtfelder:**
- `id` (UUID)
- `company_name` (text)
- `domain` (text — für Duplikat-Erkennung)
- `industry` (text)
- `country` (text)
- `source`: `firecrawl` / `clay_csv` / `manual`
- `source_run_id` (UUID NULL — Referenz auf den Research-Run, der den Lead erzeugt hat; NULL bei manueller Anlage)
- `status`: `new` / `qualified` / `pushed` / `acknowledged` / `rejected` / `converted` / `dead`
- `created_at`
- `created_by`

**Optionale Felder:**
- `company_size_band` (text — z. B. „10-50 MA", „50-200 MA")
- `revenue_band` (text NULL)
- `contact_name` (text NULL)
- `contact_role` (text NULL)
- `contact_email` (text NULL)
- `linkedin_url` (text NULL)
- `phone` (text NULL)
- `trigger_signals_matched` (text[] — welche ICP-Trigger-Signale wurden bei der Recherche identifiziert)
- `enrichment_data` (JSONB NULL — Roh-Daten aus Firecrawl/Clay für späteren Pitch-Kontext)
- `notes` (text NULL)
- `tags` (text[])
- `business_deal_id` (UUID NULL — gesetzt nach erfolgreichem Pipeline-Push, FEAT-014)
- `template_id` (UUID NULL)

**Constraints:**
- Unique-Constraint auf (`domain`, `contact_email`) für Duplikat-Vermeidung (NULL-Email zählt als „kein Kontakt") — Empfehlung in `/architecture V1`

### Research-Run-Entität

Ein Research-Run ist ein einzelner Recherche-Vorgang über ein Segment.

**Pflichtfelder:**
- `id` (UUID)
- `segment_id` (n:1 zu FEAT-010 Segment)
- `provider`: `firecrawl` / `clay_csv` / `manual`
- `status`: `pending` / `running` / `completed` / `failed`
- `started_at`
- `completed_at` (NULL bis fertig)
- `leads_found` (integer)
- `leads_new` (integer — neue Leads, die nicht schon im Pool waren)
- `leads_duplicate` (integer)
- `cost_eur` (numeric — Provider-Kosten für diesen Run)
- `created_by`

**Optionale Felder:**
- `provider_run_id` (text NULL — externe ID beim Provider, falls relevant)
- `provider_query` (JSONB — was wurde abgefragt — Branche, Region, Größenband, Trigger-Keywords)
- `error_message` (text NULL)
- `notes` (text NULL)

### Mechanik 1: Firecrawl-Adapter (Primary)

**Funktionsweise:**
- Firecrawl-API-Client als Adapter (`firecrawlAdapter`) konsistent mit DEC-009 Provider-Adapter-Pattern
- Pull-on-Demand: User triggert Research-Run aus dem Segment-Detail (Button „Recherchieren mit Firecrawl")
- Adapter wandelt Segment-Filter-Definition in Firecrawl-Query (Branche-Suchbegriffe, Region-Filter, optional Size-Hints)
- Firecrawl liefert Roh-Daten (Company, Domain, Industry, Country, ggf. Contact-Hints)
- Adapter mappt auf `lead`-Tabelle, schreibt in DB, erfasst Cost in `ai_cost_ledger` und `research_run.cost_eur`

**EU-Hosting-Verifikation (R-01):**
- Vor SLC-005 (Lead Research) verifizieren: Firecrawl-DPA + EU-Endpoint
- Bei Negativ: Pivot auf Clay-CSV-only (Mechanik 2) oder selbst gehostetes Crawl-Skript
- Verifikation dokumentiert in OQ-V1-02 (PRD) — Antwort fließt in DEC oder ISSUE

**Audit-Logging (DEC-009):**
- Jeder Firecrawl-Call wird in `audit_log` eingetragen (Provider, Region, Modell-ID, Zeitstempel, Request-ID)
- Cost-Tracking in `ai_cost_ledger`
- Cost-Cap pro Research-Run als ENV-Variable (Default 5 EUR pro Run)

**Pay-as-you-go-Modell:**
- Kosten pro Run sind transparent — Firecrawl rechnet pro Page-Crawl
- UI zeigt Kosten-Schätzung vor Run-Start basierend auf Segment-Größe-Hint

### Mechanik 2: Clay-CSV-Import-Adapter (Fallback)

**Funktionsweise:**
- Adapter `clayCsvAdapter` parsed CSV-Datei mit Clay-Standard-Format
- User erhält CSV-Schablone (Download), füllt sie in Clay (eigenes Tool, läuft extern), lädt zurück hoch
- Adapter mappt CSV-Spalten auf `lead`-Felder, erkennt Duplikate (über `domain` + `contact_email`), schreibt neu
- Cost ist 0 EUR pro Import (Clay-Kosten fallen extern an)

**Wichtig:** Clay-API-Webhook-Integration kommt erst V3 (DEC-012 bleibt für Voll-Variant gültig). V1 nutzt nur CSV-Import.

### Mechanik 3: Manueller Lead-Eintrag

- UI-Form für einzelnen Lead-Eintrag (alle Pflichtfelder + optionale)
- Duplikat-Check beim Speichern
- `source = manual`, `source_run_id = NULL`

### UI

- **Segment-Detail-Erweiterung:** Im Segment-Detail (FEAT-010) ist ein Sub-Tab „Leads" mit Liste der Mitglieder + Buttons:
  - „Recherchieren mit Firecrawl" → erstellt Research-Run, zeigt Progress
  - „Clay-CSV importieren" → File-Upload mit Parse-Vorschau
  - „Manuell hinzufügen" → Form
- **Lead-Pool-Übersicht (Cross-Segment):** Liste aller Leads im System mit Filter (Segment, Status, Source, Branche, Tag)
- **Lead-Detail:**
  - Alle Felder + zugehörige Research-Run + zugehörige Segmente
  - Pitch-Set (FEAT-016) — welche Pitches wurden für diesen Lead generiert
  - Handoff-History (FEAT-014) — Pipeline-Push-Historie
  - Tags und Notizen editierbar
- **Research-Run-Übersicht:** Liste aller Runs mit Cost, Lead-Count, Status — pro Segment filterbar

### Duplikat-Erkennung

- Beim Schreiben jedes Leads: Query auf existierende Leads mit gleichem (`domain`, `contact_email`)
- Duplikat → Update bestehender Eintrag (merge `enrichment_data`, `tags`, `notes`) statt Neuerstellung
- Update-Trail: `lead_update_log` (optional V1, V5+ wenn relevant)

### Template-Ready
- `template_id` (UUID NULL) auf `lead` und `research_run`

## Out of Scope (V1)

- **Auto-Disqualifier-Regeln** vor Pitch-Generierung (V3 — FEAT-013 Lead Scoring)
- **Lead-Scoring** (V3 = regelbasiert, V5+ = KI)
- **Voll-Firecrawl-Adapter** mit Webhook + Auto-Scheduling (V3 — Voll-Lead-Research-Sprint)
- **Clay-API-Integration** (V3 — DEC-012 Voll-Variant)
- **Enrichment-on-Demand** (V3 — Roh-Adapter um zusätzliche Datenquellen)
- **Multi-Source-Merge** (V5+)
- **6 Research-Typen-Workflow** aus archiviertem alten FEAT-012 (V7 — Validation & Idea Testing)
- **Auto-Resegmentierung bei Lead-Update** (V5+)

## Acceptance Criteria

- Firecrawl-Adapter funktioniert: Segment-Filter wird in Query übersetzt, Run erzeugt mind. 5 Leads im Test-Segment
- EU-Endpoint-Verifikation für Firecrawl ist dokumentiert (DEC oder ISSUE)
- Clay-CSV-Import funktioniert: 1 Test-CSV (mind. 10 Zeilen) wird korrekt importiert
- Manuelle Lead-Anlage funktioniert
- Duplikat-Erkennung funktioniert über (domain, contact_email)
- Lead-Pool-Übersicht zeigt alle Leads mit funktionalen Filtern
- Research-Run-Übersicht zeigt Cost und Status
- Cost-Tracking in `ai_cost_ledger` für jeden Firecrawl-Run
- Lead-Detail zeigt zugehörige Pitches und Handoff-History
- Lead-Status-Statemaschine funktioniert (new → qualified → pushed)

## Dependencies

- **FEAT-010 ICP & Segment** — Segment als Quelle für Research-Query
- **DEC-009 Provider-Adapter-Pattern** — Firecrawl + Clay-CSV als Adapter
- **Wird genutzt von:** FEAT-011 Campaign Lite (Lead-Set), FEAT-016 Messaging-Variation pro Lead, FEAT-014 Lead Handoff (Pipeline-Push pro Lead)

## Architektur-Hinweise für `/architecture V1`

- **Tabelle `lead`** mit allen Feldern oben + Unique-Index auf (`domain`, `contact_email`)
- **Tabelle `research_run`** mit Status-Statemaschine
- **Adapter `firecrawlAdapter`:** Cost-Cap, Audit-Log, Region-ENV (`FIRECRAWL_REGION`)
- **Adapter `clayCsvAdapter`:** CSV-Parser mit Schema-Validierung
- **Worker-Job `lead_research_run`** (Type-Enum in `ai_jobs`): Triggert Firecrawl-Pull asynchron, Status-Update on Completion
- **ENV-Konfiguration:**
  - `FIRECRAWL_API_KEY`, `FIRECRAWL_API_BASE_URL`, `FIRECRAWL_REGION` (default `eu-west-1` falls verfügbar)
  - `RESEARCH_RUN_COST_CAP_EUR` (default 5)
- **Lead-Status-Statemaschine** modellieren als Enum mit erlaubten Übergängen
- **Pitch-Tabelle (FEAT-016)** referenziert `lead_id` als FK
- **Handoff-Event-Tabelle (FEAT-014)** referenziert `lead_id` als FK

## Migration / Verhältnis zur alten FEAT-012-Spec

Alte FEAT-012 (Lead Research & Enrichment, V3-Spec) wird durch FEAT-015 ersetzt. Hauptunterschiede:

| Aspekt | Alte FEAT-012 V3 | Neue FEAT-015 V1 |
|---|---|---|
| Primary Provider | Clay (CSV + V5+ API) | Firecrawl (API) |
| Fallback | manuell | Clay-CSV |
| Research-Task-Workflow | 6 Research-Typen | nicht in V1, V7+ Validation |
| Enrichment-Layer | dedizierter Adapter | Inline in `lead.enrichment_data` |
| Auto-Scheduling | Webhook + Cron | Pull-on-Demand in V1 |
| Disqualifier | Teil von FEAT-013 | nicht in V1, V3 |

Es gibt keine Daten-Migration (V1 startet leer). Alte FEAT-012-V3-Spec-Datei wird im `/architecture V1`-Lauf archiviert oder als „v1-pivot-redirect" markiert.

## Referenzen

- DEC-009 Provider-Adapter-Pattern
- DEC-012 (Clay-Integration V3 = CSV-Import-Minimum, API V5+) — bleibt für V3+ gültig, V1 deckt Clay-CSV bereits ab
- FEAT-010 ICP & Segment (Filter-Quelle)
- FEAT-016 Messaging-Variation (Konsument)
- FEAT-014 Lead Handoff (Konsument)
- Memory-Notiz: Firecrawl als Primary wegen planbarer Pay-as-you-go-Kosten
