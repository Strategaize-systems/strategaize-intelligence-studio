# FEAT-010 — ICP & Segment

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
Definition von Ideal-Customer-Profiles (ICP) und daraus abgeleiteten Segmenten als Grundlage für Lead-Recherche (FEAT-015), Messaging-Variation pro Lead (FEAT-016), Campaign Lite (FEAT-011) und Lead-Handoff (FEAT-014). ICP-Felder sind direkt aus Brand Profile Sektion 2 (Target Audience) und Sektion 3 (Personas) ableitbar — das eliminiert Definitions-Drift zwischen Brand-Profil und Zielgruppen-Auswahl.

**Spec-Foundation:** Sektion 2 + Sektion 3 aus `reference/corey-haines-marketing-skills/skills/product-marketing-context/SKILL.md`. ICP ist die strukturierte, filterbare Form der Brand-Profile-Sektionen 2+3 — gleicher Schema-Ursprung, andere Operative Nutzung (Filter und Listen).

## In Scope (V1)

### ICP-Entität

Beschreibt einen idealtypischen Kunden strukturiert. Felder mappen 1:1 auf product-marketing-context Sektion 2 + 3.

**Pflichtfelder (aus product-marketing-context Sektion 2 — Target Audience):**
- Titel (z. B. „Steuerberater-Kanzlei 5–20 MA")
- Beschreibung (Freitext, Hintergrund und Positionierung)
- **Target company type:**
  - Branche
  - Größenband (Mitarbeiter)
  - Stage / Reifegrad (z. B. „etabliert seit 5+ Jahren", „in Wachstum", „Nachfolge offen")
- **Target decision-makers:** Liste von Rollen + Abteilungen
- **Primary use case** (Hauptproblem, das gelöst wird — Freitext)
- **Jobs-to-be-Done** (2-3 Items als Liste — was Kunden „anheuern")

**Pflichtfelder (aus product-marketing-context Sektion 3 — Personas):**
- **Persona-Set** (mindestens User + Decision Maker, optional Champion / Financial Buyer / Technical Influencer)
  - Pro Persona: cares-about, challenge, value-promise (kann via Referenz auf Brand-Profile übernommen werden)

**Pflichtfelder (firmografisch + strukturell, ICP-spezifisch):**
- Umsatzband (Schätzung)
- Region/Land
- **Trigger-Signale:** strukturierte Liste von beobachtbaren Situationen, die ICP-Eignung anzeigen (z. B. „Wachstum > 20 %/Jahr", „Nachfolge offen", „Digitalisierungsrückstand erkennbar")

**Optionale Felder:**
- Schmerz-Punkte (Liste — kann via Referenz auf Brand-Profile Sektion 4 übernommen werden)
- Budget-Rahmen (Schätzung)
- Marktgröße-Schätzung (Anzahl Unternehmen, die das ICP erfüllen)
- Anti-Persona (kann via Referenz auf Brand-Profile Sektion 7 übernommen werden)
- Notizen

**Brand-Profile-Verknüpfung:**
- ICP referenziert das aktive Brand Profile (`brand_profile_id`, NULL erlaubt für Multi-ICP-Tests)
- ICP-Felder können bei Erstanlage aus Brand Profile vorbefüllt werden (Convenience-Action „Aus Brand Profile übernehmen") — danach unabhängig editierbar

### Segment-Entität

Konkrete, gefilterte Instanz eines ICP mit tatsächlichen Leads als Mitgliedern.

**Pflichtfelder:**
- Titel
- Zugehöriges ICP (n:1 zu FEAT-010 ICP)
- Filter-Definition: strukturierte Regeln über Lead-Felder (aus FEAT-015)
- Aktuelle Mitglieder-Liste (dynamisch berechnet oder zum Zeitpunkt gesnapshoted — Entscheidung in `/architecture V1`)

**Optionale Felder:**
- Manuelle Ergänzungen (einzelne Leads, die zum Segment hinzugefügt wurden)
- Ausschlüsse (Leads, die aus Segment entfernt wurden)

**Wichtig V1:**
- Segment-Mitglieder kommen in V1 **ausschließlich aus FEAT-015 Lead Research** (Firecrawl + Clay-CSV-Import + manuell)
- Business-Ingest-Kontakte als Segment-Quelle kommen erst mit V6 (Wissensverdichtungs-Backbone) verfügbar — bis dahin nicht relevant für Marketing Launcher V1

### UI

- **ICP-Übersicht:** Liste, Detail-Ansicht mit allen Feldern, „Aus Brand Profile übernehmen"-Action
- **Segment-Übersicht:** Liste mit Anzahl Mitglieder, ICP-Referenz, Erstelldatum
- **Segment-Detail:** aktuelle Mitglieder mit Filter-Ansicht, manuelle Nachbearbeitung (Add / Remove / Pin)
- **Segment-Definition-Builder:** Regel-basierter Query-Builder über Lead-Felder (Branche, Größe, Trigger-Signal-Match, Score-Range falls FEAT-013 später aktiv, Tag-Match)
- **Cross-Link:** Vom ICP-Detail aus „Segmente, die dieses ICP nutzen" + „Leads, die dieses ICP erfüllen" aus FEAT-015

### Template-Ready
- `template_id` (UUID NULL in V1)

## Out of Scope (V1)

- Dynamische Segment-Aktualisierung in Echtzeit (V5+; V1 = Snapshot oder Cron-Refresh)
- KI-generierte ICP-Vorschläge aus Cross-Kunden-Learnings (V8+, abhängig von V6)
- Marktgröße-Auto-Berechnung via externer Datenquellen (V9+)
- ICP/Segment-Vererbung und Kompositionen (V9+)
- Multi-Tenant-ICP-Bibliothek (V9+)
- Auto-Resegmentierung bei ICP-Änderung (V5+)
- Business-Ingest-Kontakte als Segment-Quelle (V6+)

## Acceptance Criteria

- ICP kann mit allen Pflichtfeldern angelegt werden, „Aus Brand Profile übernehmen" funktioniert
- Mehrere ICPs sind parallel anlegbar
- Pflichtfelder sind validiert (Persona-Set hat mindestens User + Decision Maker)
- Segment kann aus ICP abgeleitet werden mit Filter-Regeln über Lead-Felder
- Segment-Mitglieder werden korrekt berechnet (aus FEAT-015 Lead-Pool)
- Manuelle Ergänzungen und Ausschlüsse funktionieren
- UI-Übersicht zeigt Segment-Größe
- Filter-Regeln sind nach Erstellung editierbar
- ICP-Brand-Profile-Verknüpfung speichert `brand_profile_id` korrekt

## Dependencies

- **FEAT-008 Brand Profile** — als Foundation, „Aus Brand Profile übernehmen" greift auf Sektion 2+3 zu
- **FEAT-015 Lead Research** — Lead-Pool als Segment-Mitglieder-Quelle
- **Wird genutzt von:** FEAT-011 Campaign Lite (als Audience-Reference), FEAT-016 Messaging-Variation pro Lead, FEAT-014 Lead Handoff (Audience-Kontext beim Pipeline-Push)

## Architektur-Hinweise für `/architecture V1`

- **ICP-Tabelle:** `id`, `title`, `description`, `brand_profile_id (NULL)`, `target_company_type (JSONB)`, `decision_makers (text[])`, `primary_use_case (text)`, `jobs_to_be_done (text[])`, `personas (JSONB)`, `revenue_band`, `region_country`, `trigger_signals (text[])`, `pain_points (text[] NULL)`, `budget_estimate (NULL)`, `market_size_estimate (NULL)`, `anti_persona (text NULL)`, `notes`, `template_id (NULL)`, `created_at`, `created_by`
- **Segment-Tabelle:** `id`, `title`, `icp_id`, `filter_definition (JSONB)`, `is_snapshot (bool)`, `snapshot_at (NULL)`, `manual_includes (uuid[] NULL)`, `manual_excludes (uuid[] NULL)`, `template_id (NULL)`, `created_at`, `created_by`
- **Segment-Mitgliedschaft:** Wenn Snapshot → Tabelle `segment_member` mit `segment_id, lead_id`. Wenn Live-Query → keine Tabelle, sondern Materialized View. Empfehlung in V1: Live-Query (kleine Volumina), Snapshot ab V5 mit Tracking-Voll.
- **Query-Builder:** Filter-Definitionen als JSON, Executor-Service wandelt in SQL-Filter über `lead`-Tabelle
- **Brand-Profile-Sync:** Bei „Aus Brand Profile übernehmen" werden Sektion 2 + 3-Daten in ICP-Felder kopiert (Wert-Übernahme), kein Live-Sync — danach editierbar ohne Auswirkung auf Brand Profile

## Migration aus alter V3-Spec

Die alte FEAT-010-V3-Spec war konzeptionell sehr ähnlich (firmografisch + Trigger-Signale). Hauptunterschiede:
- Persona-Set ist jetzt Pflichtfeld (vorher optional) — aus product-marketing-context-Schema übernommen
- Brand-Profile-Verknüpfung ist neu (vorher gab es kein Brand Profile)
- Business-Ingest-Kontakte als Segment-Quelle entfällt für V1 (kommt mit V6)
- Filter-Builder läuft nur über `lead`-Tabelle (FEAT-015), nicht mehr über `business_contact_cache`

Es gibt keine Daten zu migrieren — V1 startet mit leerer ICP- und Segment-Tabelle.

## Referenzen

- Spec-Foundation: `reference/corey-haines-marketing-skills/skills/product-marketing-context/SKILL.md` (Sektion 2 + 3)
- FEAT-008 Brand Profile (12-Sektionen-Schema)
- FEAT-015 Lead Research
- FEAT-011 Campaign Lite, FEAT-016 Messaging-Variation, FEAT-014 Lead Handoff (als Konsumenten)
