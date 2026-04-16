# FEAT-008 — Brand Profile

## Status
- Version: V2
- Status: planned
- Priority: high

## Purpose
Ein einziges, strukturiertes Brand-Profil (StrategAIze-Eigen) als LLM-Kontext für alle Content-Generierungen. Sorgt für konsistente Markenstimme über alle Asset-Typen hinweg — ohne Agentur-Aufwand.

**Kontext:** Gründer-Entscheidung OQ-V2-03 (2026-04-16): V2 hat **genau ein** Brand-Profil. Multi-Tenant-Brand-Profile für Kunden = V8+. „Powered by Strategize"-Footer als Default akzeptabel.

## In Scope (V2)

### Brand-Profil-Entität
Ein Singleton-Datensatz (pro IS-Instanz) mit folgenden Feldern:

**Pflichtfelder:**
- **Markenstimme (Freitext)** — beschreibt Tonalität und Stimme in 3–5 Sätzen
- **Zielgruppen-Stimme** — an wen wird gesprochen (z. B. „KMU-Geschäftsführer 2–5 Mio €, nicht Marketing-Manager")
- **Tonalitäts-Regeln** — strukturierte Liste (z. B. „ruhig", „direkt", „ohne Hype")
- **Do's** — Liste konkreter Stil-Anweisungen (z. B. „klare Thesen", „konkrete Zahlen", „Bezug zu Beratungserfahrung")
- **Don'ts** — Liste verbotener Begriffe/Stile (z. B. „Game-Changer", „Disruption", „leverage", „Emojis")
- **Struktur-Templates pro Output-Typ** — Markdown-Templates je Asset-Typ:
  - LinkedIn-Post: „Hook (1 Satz) + These + Begründung in 2–3 Punkten + CTA"
  - Blogpost: Freie Struktur-Vorgabe
  - One-Pager: Abschnitts-Gliederung
  - E-Mail-Vorlage: Aufbau-Skelett
  - Case Card: Feld-Struktur
  - Landingpage-Briefing: Block-Gliederung
- **Beispiel-Assets (3–5)** — Referenz-Texte als „so klingen wir". Mindestens 3, maximal 5 in V2. Werden als few-shot-Examples im LLM-Kontext mitgegeben.

**Optionale Felder:**
- Farben-Hex-Codes (für spätere Landingpage-Briefings, in V2 noch nicht aktiv verwendet)
- Typografie-Namen (gleiches)
- Freier Notizen-Bereich

**Template-Ready-Felder:**
- `template_id` (optional, NULL in V2)
- `is_active` (boolean, default true)

### UI
- Einzige Brand-Profil-Seite (Settings-Bereich): CRUD auf das Singleton-Profil
- Strukturierte Eingabe-Form mit Vorschau-Ansicht
- Changelog: wer hat wann was geändert
- Validierung: mindestens 3 Beispiel-Assets Pflicht

### LLM-Integration
- Brand-Profil wird bei jedem Content-Generierungs-Call (FEAT-009) automatisch als System-Kontext + few-shot-Examples an Bedrock übergeben
- Änderungen am Brand-Profil wirken sich sofort auf neue Generierungen aus (alte Assets bleiben unverändert)

## Out of Scope (V2)
- Multi-Tenant-Brand-Profile (V8+)
- Automatisches Brand-Profil-Lernen aus bestehenden Assets (V8+)
- Visuelles Brand-System (Logo-Regeln, Bildsprache, Layoutgrid) (V8+)
- Brand-Profil-Export als Style-Guide-PDF (V8+)
- A/B-Test von Brand-Profil-Varianten (V8+)

## Acceptance Criteria
- Ein Brand-Profil kann angelegt, bearbeitet und validiert werden
- Alle Pflichtfelder sind verpflichtend
- Mindestens 3 Beispiel-Assets sind pflicht
- Brand-Profil wird bei jedem Content-Generierungs-Call mitgegeben (prüfbar via API-Log)
- Schema-Template-Ready-Felder sind vorhanden (`template_id` NULL)
- UI zeigt Vorschau der generierten Prompt-Struktur mit Brand-Kontext

## Dependencies
- Keine — FEAT-008 ist V2-Auftakt
- Wird genutzt von: FEAT-009 Content Asset Production

## Architektur-Hinweise für `/architecture`
- Brand-Profil als Singleton-Table mit `template_id`-Feld vorbereiten (Multi-Instanz-Aktivierung V8+)
- LLM-Prompt-Builder-Modul, das Brand-Profil + Output-Typ-Template + Quell-Objekt-Kontext konkateniert
- Changelog-Tabelle für Audit (wer, wann, welches Feld)
