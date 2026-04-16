# FEAT-009 — Content Asset Production

## Status
- Version: V2
- Status: planned
- Priority: high

## Purpose
KI-gestützte Erzeugung wiederverwendbarer Content-Assets aus Knowledge Units, Opportunities, Patterns und später Kampagnen-Briefings. Assets werden mit Brand-Profil (FEAT-008) als Kontext generiert und in einer durchsuchbaren Bibliothek verwaltet.

## In Scope (V2)

### Asset-Request-Workflow
- Asset-Request erstellen: Quell-Objekt (KU aus FEAT-001, Opportunity aus FEAT-005, Pattern aus FEAT-004) + Output-Typ + optionale Briefing-Notiz
- V2 Output-Typen (6):
  - **Blogpost** (Markdown, länger, strukturiert)
  - **LinkedIn-Post** (Kurztext, Hook-These-Begründung-CTA)
  - **One-Pager** (Markdown, ein-Seite-Argumentation)
  - **E-Mail-Vorlage** (Markdown, Betreff + Body + Variablen-Platzhalter)
  - **Case Card** (strukturierte Kurz-Case, Problem-Lösung-Ergebnis)
  - **Landingpage-Briefing** (Markdown, Block-Gliederung als Briefing für spätere Umsetzung)
- KI-Generierung via Bedrock (Claude Sonnet/Opus in eu-central-1) mit Brand-Profil als System-Kontext + few-shot-Examples
- Synchrone Generierung wenn Antwortzeit < 30s, sonst asynchron via Worker (Design in `/architecture`)

### Asset-Bibliothek
- Listen-Ansicht aller Assets mit Filter:
  - nach Output-Typ
  - nach Quell-Objekt-Typ (KU, Opportunity, Pattern)
  - nach Status (Entwurf / überarbeitet / freigegeben / veröffentlicht)
  - nach Erstelldatum
  - nach Kategorie/Tag (freie Tags)
- Volltext-Suche über Asset-Inhalt
- Detail-Ansicht: Quell-Objekt, Generierungs-Metadaten (Modell, Prompt-Länge, Antwortzeit, Cost), aktuelle Version

### Status-Workflow
- **Entwurf** — KI-generiertes Initial-Ergebnis
- **überarbeitet** — manuelle Bearbeitung durch Nutzer
- **freigegeben** — final, bereit zur Veröffentlichung
- **veröffentlicht** — ab V4 aktiv (Publishing); in V2 nur manuell-markierter Status
- **verworfen** — nicht zur Veröffentlichung geeignet

### Versionierung
- Jede Bearbeitung erzeugt eine neue Version (Asset-History)
- Vergleich zwischen Versionen (Diff-Ansicht)
- Rollback zu älterer Version möglich

### Export
- Markdown-Export pro Asset (Kopie in Zwischenablage + Download)
- Batch-Export mehrerer Assets als ZIP

### Template-Ready
- Schema mit `template_id` (optional, NULL in V2)
- Asset-Typ-spezifisches Template-Handling vorbereitet

## Out of Scope (V2)
- Direkte Veröffentlichung auf Kanälen (V4)
- Multi-Sprachen-Output (V8+)
- Video-Script, Carousel, Präsentation als Output-Typen (V8+)
- Automatische Asset-Varianten-Generierung für A/B-Tests (V5+)
- Asset-Scoring (Qualitätsbewertung via KI) (V8+)
- Automatische Asset-Empfehlung zu Kampagnen-Briefings (V6+)

## Acceptance Criteria
- Asset-Request kann aus allen Quell-Objekt-Typen erstellt werden
- Alle 6 Output-Typen sind generierbar
- Brand-Profil wird bei jedem Call als Kontext mitgegeben (prüfbar)
- Generierte Assets sind in UI editierbar
- Status-Workflow funktioniert durchgängig
- Versionierung erhält vollständige History
- Markdown-Export liefert saubere Markdown-Dateien
- Volltext-Suche findet Assets nach Inhalt und Metadaten
- KI-Freigabe-Quote > 60 % ohne manuelle Überarbeitung (gemessen über die ersten 20 Assets)

## Dependencies
- **FEAT-008 Brand Profile** — muss vor V2-Release existieren und mindestens 3 Beispiel-Assets haben
- FEAT-004 Insight-Layer (KU als Quell-Objekt)
- FEAT-005 Opportunity & Decision (Opportunity als Quell-Objekt)
- Bedrock-Adapter (analog Onboarding-Plattform)

## Architektur-Hinweise für `/architecture`
- Synchron vs. asynchron in Abhängigkeit von Bedrock-Antwortzeit — entscheiden
- Asset-Tabelle mit `source_type`, `source_id`, `output_type`, `current_version_id`, `template_id` (optional)
- Asset-Version-Tabelle für History mit Markdown-Content
- Prompt-Builder teilt sich Code mit FEAT-005 (KI-Bewertung) über gemeinsamen LLM-Service-Layer
- Cost-Tracking pro Generierung (Tokens in/out, Kosten EUR) für späteres Monitoring
