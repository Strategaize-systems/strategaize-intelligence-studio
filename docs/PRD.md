# Product Requirements Document

## Purpose
StrategAIze Intelligence Studio ist das lokale Intelligence-, IP- und Produktionssystem von StrategAIze. Es sammelt Erkenntnisse aus Onboarding, Delivery, Vertrieb, Markt und internen Ideen, verdichtet sie zu Mustern, Chancen und Verbesserungen, entwickelt daraus wiederverwendbare Module, Scripts und Wissensbausteine, organisiert sie in Katalogen und erzeugt daraus gezielt Assets, Produktideen und wissensplattformfähige Outputs.

## Vision
System 4 in der StrategAIze-Gesamtarchitektur: Eine querliegende Lern-, Verdichtungs- und Produktionsschicht über allen anderen Systemen. Das Studio konserviert IP, verbessert die Methodik systemisch und produziert intelligenzbasierte Assets statt generischen Content.

## Project
- Name: StrategAIze Intelligence Studio
- Working title: Intelligence Studio
- Owner: StrategAIze (Gründer)
- Status: Requirements
- Delivery mode: internal-tool

## Problem Statement
Erkenntnisse aus Beratung, Onboarding, Delivery, Vertrieb und Marktbeobachtung entstehen täglich — aber sie verflüchtigen sich in Chats, Notizen und Gesprächen. Es fehlt ein System, das diese Signale strukturiert aufnimmt, verdichtet, katalogisiert und in wiederverwendbare Produkte (Module, Scripts, Content, Wissensbausteine) überführt. Ohne ein solches System geht der wertvollste Teil der Arbeit — die Erfahrungsschicht — systematisch verloren.

## Goal
Ein funktionales lokales System, das:
1. Rohsignale aus allen relevanten Quellen strukturiert aufnimmt
2. Diese Signale KI-gestützt klassifiziert, bewertet und verdichtet
3. Muster, Chancen und Verbesserungspotenziale sichtbar macht
4. Konkrete Verbesserungen für Fragen, Skills, Methodik und Angebote ableitet
5. Produkt- und Automatisierungsideen katalogisiert und bewertbar macht
6. Für jede Erkenntnis eine klare Folgeentscheidung erzwingt
7. Aus Erkenntnissen direkt nutzbare Content-Assets produziert
8. Marken- und Stilkonsistenz aller Outputs sichert
9. Neue Module, Scripts und Fragebögen in Entwurfsform entwickelt
10. Wissensplattformfähige Outputs (Markdown, SOPs, FAQ) erzeugt

## Target Users
- **Primär**: Gründer (alleiniger Operator und Nutzer)
- **Sekundär** (perspektivisch): Maximal 1 weitere interne Vertrauensperson
- **Ausdrücklich nicht**: Kunden, externe Partner, breite Nutzergruppen

## User / Problem Context
StrategAIze betreibt drei Systeme: Blueprint-Plattform (Onboarding/Assessment), Operating System (Delivery/Analyse), Business Development System (Vertrieb/CRM). In allen drei Systemen entstehen täglich wertvolle Signale — Kundenantworten, Analyseergebnisse, Vertriebsfeedback, Einwände, Methodikbeobachtungen. Diese Signale werden aktuell nicht systematisch gesammelt, verdichtet oder in wiederverwendbare IP überführt. Das Intelligence Studio schließt diese Lücke als querliegende Schicht.

---

## V1 Scope — Intelligence Studio MVP

### Überblick
V1 liefert den funktionalen Kern: Signale rein, verdichten, katalogisieren, entscheiden, produzieren. Alle 10 Module werden in V1 umgesetzt, mit bewusster Tiefenbegrenzung bei Pattern Clustering, Module Builder und Knowledge Packaging.

### Technischer Rahmen (aus Discovery-Entscheidungen)
- **UI**: Lokale Next.js-Anwendung für Übersichten, Katalog, Inbox, Decision Board
- **Verarbeitungslogik**: Claude Code Agent Tool (Max-Subscription) für KI-gestützte Workflows
- **Datenbank**: SQLite (lokal, eine Datei, kein Server)
- **DSGVO-Schnitt**: Rohdaten bleiben in SQLite, nur abstrahierte Insights gehen an Claude
- **Deployment**: Nur lokal, kein Web-Deployment

---

## Core Features (V1)

### FEAT-001 — Insight Inbox
**Zweck**: Strukturierter Eingangskorb für alle Rohsignale.

**Funktionale Anforderungen**:
- Manuelles Erstellen von Inbox-Einträgen über die UI
- Datei-Import (Markdown, Text, JSON) für Bulk-Eingabe
- Pflichtfelder pro Eintrag:
  - Quelle (System 1/2/3, manuell, extern, Research)
  - Datum
  - Kontext (Projekt, Kunde, Thema — freitext)
  - Typ (Transkript, Notiz, E-Mail-Zusammenfassung, Export, Idee, Research, Dokument, Beobachtung)
  - Sprache (DE/EN)
  - Grobrelevanz (hoch/mittel/niedrig/unklar)
  - Status: ungesehen → gesichtet → verarbeitet → archiviert
  - Eingabemodus: manuell / import
- Listenansicht mit Filter und Sortierung (Status, Quelle, Datum, Relevanz)
- Detailansicht pro Eintrag
- Bulk-Statusänderung (mehrere Einträge gleichzeitig auf "gesichtet" / "archiviert" setzen)

**Akzeptanzkriterien**:
- [ ] Inbox-Eintrag kann manuell erstellt werden mit allen Pflichtfeldern
- [ ] Markdown/Text/JSON-Dateien können importiert werden
- [ ] Listenansicht zeigt alle Einträge mit Filtern (Status, Quelle, Typ, Relevanz)
- [ ] Status-Workflow funktioniert (ungesehen → gesichtet → verarbeitet → archiviert)
- [ ] Bulk-Statusänderung funktioniert für Mehrfachauswahl

### FEAT-002 — Insight Analyzer
**Zweck**: KI-gestützte Klassifizierung und Bewertung von Inbox-Einträgen.

**Funktionale Anforderungen**:
- Einzelanalyse: Einen Inbox-Eintrag durch Claude analysieren lassen
- Batch-Analyse: Mehrere ungesichtete Einträge nacheinander analysieren
- Analyse-Output pro Eintrag:
  - Klassifizierung: Insight / Einwand / Opportunity / Improvement / Content-Angle / Musterkandidat / Rohidee / Rauschen
  - Relevanzbewertung (hoch/mittel/niedrig) mit Begründung
  - Bereichszuordnung: vertriebsrelevant / deliveryrelevant / produktrelevant / methodikrelevant / rauschen
  - Vorgeschlagene Tags (Freitext)
  - Zusammenfassung (1-3 Sätze)
  - Vorgeschlagene Folgeaktion (Decision Board, Katalog, Content, Improvement, ignorieren)
- Ergebnisse werden als strukturierte Daten in SQLite gespeichert
- Originaler Inbox-Eintrag bleibt unverändert (Analyse ist separater Datensatz)
- UI zeigt Analyse-Ergebnis neben dem Original-Eintrag

**Akzeptanzkriterien**:
- [ ] Einzelner Inbox-Eintrag kann analysiert werden, Ergebnis erscheint in der UI
- [ ] Batch-Analyse verarbeitet mehrere Einträge sequentiell
- [ ] Klassifizierung, Relevanzbewertung und Bereichszuordnung werden korrekt gespeichert
- [ ] Original-Eintrag bleibt unverändert, Analyse ist separater Datensatz
- [ ] DSGVO-Schnitt: Nur abstrahierte Inhalte gehen an Claude, nicht Kunden-Rohdaten

### FEAT-003 — Pattern & Signal Clustering (Basis)
**Zweck**: Einzelbeobachtungen zu wiederkehrenden Mustern verdichten.

**V1-Tiefe**: Einfache regelbasierte + KI-gestützte Mustererkennung, manuelles Clustering. Kein ML-basiertes Auto-Clustering.

**Funktionale Anforderungen**:
- Manuelles Erstellen eines Patterns mit Titel, Beschreibung, Typ
- Pattern-Typen: Problemtyp, Branchenmuster, Deal-Killer, KI-Chance, Methodikschwäche, Positionierungsmuster
- Zuordnung von Insights zu Patterns (n:m Beziehung)
- KI-Vorschlag: "Diese 3 Insights könnten ein Pattern bilden" (Claude-basiert)
- Pattern-Übersicht mit Anzahl zugeordneter Insights
- Pattern-Detailansicht mit allen zugeordneten Insights

**Akzeptanzkriterien**:
- [ ] Pattern kann manuell erstellt werden
- [ ] Insights können einem Pattern zugeordnet werden
- [ ] KI kann Patterns vorschlagen basierend auf ähnlichen Insights
- [ ] Pattern-Übersicht zeigt alle Patterns mit Insight-Anzahl
- [ ] Pattern-Detailansicht zeigt zugeordnete Insights

### FEAT-004 — Improvement Engine
**Zweck**: Konkrete Verbesserungsvorschläge für Fragen, Skills, Methodik, Angebote und Assets ableiten.

**Funktionale Anforderungen**:
- Improvement kann manuell erstellt oder aus einem Insight/Pattern abgeleitet werden
- KI-gestützte Ableitung: Claude analysiert ein Insight oder Pattern und schlägt Improvements vor
- Pflichtfelder pro Improvement:
  - Titel
  - Beschreibung
  - Quell-Objekt (Insight, Pattern oder manuell)
  - Zielbereich: Fragenkatalog (System 1) / Delivery-Logik (System 2) / Vertriebsargumentation (System 3) / Skills-Prompts-Templates (Dev System) / Produktbeschreibung / Asset-Qualität / Angebotsbausteine / Standarddeliverables
  - Typ: Question Improvement / Prompt Improvement / Skill Improvement / Method Update / Offer Improvement / Positioning Improvement / Asset Improvement / New Module Suggestion
  - Priorität (hoch/mittel/niedrig)
  - Status: Vorschlag → geprüft → angenommen → umgesetzt → verworfen
- Listenansicht mit Filter nach Zielbereich, Typ, Status, Priorität
- Detailansicht mit Verlinkung zum Quell-Objekt

**Akzeptanzkriterien**:
- [ ] Improvement kann manuell erstellt werden
- [ ] Improvement kann KI-gestützt aus Insight oder Pattern abgeleitet werden
- [ ] Alle Pflichtfelder werden korrekt gespeichert
- [ ] Status-Workflow funktioniert
- [ ] Listenansicht mit Filtern funktioniert
- [ ] Verlinkung zum Quell-Objekt (Insight/Pattern) funktioniert

### FEAT-005 — Opportunity & Product Catalog
**Zweck**: Strategischer Katalog für Produkt-, Automatisierungs-, Angebots- und Use-Case-Ideen.

**Funktionale Anforderungen**:
- Katalog-Eintrag erstellen (manuell oder aus Insight/Pattern/Improvement abgeleitet)
- KI-gestützte Ableitung: Claude schlägt Opportunities aus Patterns oder Insights vor
- Pflichtfelder pro Eintrag:
  - Titel
  - Kurzbeschreibung
  - Ursprung/Quelle (Insight, Pattern, Improvement oder manuell)
  - Problem, das gelöst wird
  - Lösungsidee
  - Zielgruppe/Branche
  - Potenzieller Nutzen
  - Reifegrad: Rohidee → geprüft → relevant → in Ausarbeitung → umgesetzt → geparkt → verworfen
  - Priorität (hoch/mittel/niedrig)
  - Status (aktiv/geparkt/verworfen/umgesetzt)
  - Verwandte Einträge (manuelle Verlinkung zu anderen Catalog Entries)
  - Bezug zu bestehenden Produkten/Modulen/Skills
- Katalogansicht mit Filter und Sortierung
- Detailansicht mit allen Feldern und verlinkten Objekten
- Schnellfilter: "Alle relevanten", "Alle in Ausarbeitung", "Alle geparkten"

**Akzeptanzkriterien**:
- [ ] Katalog-Eintrag kann manuell erstellt werden mit allen Pflichtfeldern
- [ ] Eintrag kann KI-gestützt aus Insight/Pattern abgeleitet werden
- [ ] Reifegrad-Workflow funktioniert
- [ ] Verwandte Einträge können verlinkt werden
- [ ] Katalogansicht mit Filtern und Schnellfilterfunktioniert
- [ ] Detailansicht zeigt alle Felder und Verlinkungen

### FEAT-006 — Decision & Action Board
**Zweck**: Für jede Insight, Idee, Opportunity oder Verbesserung eine klare Folgeentscheidung erzwingen.

**Funktionale Anforderungen**:
- Board-Ansicht zeigt alle Objekte, die eine Entscheidung brauchen (Insights ohne Folgeaktion, neue Opportunities, offene Improvements)
- Entscheidungsoptionen pro Objekt:
  - ignorieren
  - archivieren
  - beobachten
  - in Katalog aufnehmen
  - Content daraus bauen (→ Asset Request)
  - Modul daraus bauen (→ Module Draft)
  - Frage verbessern (→ Improvement)
  - Skill verbessern (→ Improvement)
  - Vertriebsargument anpassen (→ Improvement)
  - später prüfen (mit Datum)
- Entscheidung wird gespeichert und ist nachvollziehbar
- "Undecided"-Filter: Alle Objekte ohne Entscheidung
- "Später prüfen"-Erinnerung: Übersicht aller Objekte mit Wiedervorlagedatum

**Akzeptanzkriterien**:
- [ ] Board zeigt alle Objekte, die eine Entscheidung brauchen
- [ ] Entscheidung kann getroffen und gespeichert werden
- [ ] Entscheidung erzeugt die richtige Folgeaktion (z.B. Asset Request, Improvement)
- [ ] Undecided-Filter funktioniert
- [ ] Später-prüfen-Übersicht mit Datumsfilter funktioniert

### FEAT-007 — Content & Asset Transformer (Grundtypen)
**Zweck**: Aus Erkenntnissen, Mustern und Katalogeinträgen direkt nutzbare Assets erzeugen.

**V1-Output-Typen**:
- Blogpost (Markdown)
- LinkedIn-Post (Kurztext)
- One-Pager (Markdown, strukturiert)
- Interne Produktnotiz (Markdown)

**Funktionale Anforderungen**:
- Asset Request erstellen: Quell-Objekt auswählen (Insight, Pattern, Opportunity, Improvement) + gewünschten Output-Typ wählen
- KI-Generierung: Claude erzeugt einen Entwurf basierend auf Quell-Objekt + Brand Guidelines
- Entwurf wird in der UI angezeigt und kann bearbeitet werden
- Asset-Status: Entwurf → überarbeitet → freigegeben → veröffentlicht
- Asset-Bibliothek: Alle erzeugten Assets mit Filter nach Typ und Status
- Markdown-Export für jedes Asset

**Akzeptanzkriterien**:
- [ ] Asset Request kann aus jedem Quell-Objekttyp erstellt werden
- [ ] Claude generiert einen Entwurf für jeden der 4 Output-Typen
- [ ] Generierter Entwurf respektiert Brand Guidelines (Tonalität, Struktur)
- [ ] Entwurf kann in der UI bearbeitet werden
- [ ] Asset kann als Markdown exportiert werden
- [ ] Asset-Bibliothek zeigt alle Assets mit Filtern

### FEAT-008 — Brand & Output Control
**Zweck**: Wiedererkennbarkeit und Konsistenz aller erzeugten Outputs sichern.

**Funktionale Anforderungen**:
- Brand-Konfiguration in der UI:
  - Tonalität-Beschreibung (Freitext)
  - Voice-Guide (Freitext)
  - Strukturvorlagen pro Output-Typ (Blogpost-Template, LinkedIn-Template, One-Pager-Template, Produktnotiz-Template)
  - Do's und Don'ts (Freitext)
- Brand-Konfiguration wird bei jeder Asset-Generierung als Kontext an Claude mitgegeben
- Tone Check: Bestehendes Asset gegen Brand Guidelines prüfen lassen (Claude-basiert)
- Ergebnisse des Tone Checks werden angezeigt (passt / Abweichungen)

**Akzeptanzkriterien**:
- [ ] Brand-Konfiguration kann in der UI gepflegt werden
- [ ] Asset-Generierung berücksichtigt die Brand-Konfiguration
- [ ] Tone Check kann auf ein bestehendes Asset angewendet werden
- [ ] Tone Check zeigt konkrete Abweichungen vom Brand Guide

### FEAT-009 — Modules & Script Builder (Basis)
**Zweck**: Aus wiederkehrenden Themen und Chancen neue Module, Scripts, Mini-Assessments und Delivery-Bausteine entwickeln.

**V1-Tiefe**: Strukturierte Entwürfe mit Templates — kein vollautomatischer Modulbaukasten.

**Funktionale Anforderungen**:
- Module Draft erstellen (manuell oder aus Opportunity/Pattern abgeleitet)
- Draft-Typen: Fragebogen, Assessment-Flow, Beratungsmodul, Delivery-Script, Modulbeschreibung, Prompt/Skill-Erweiterung
- KI-gestützte Generierung: Claude erstellt einen strukturierten Entwurf basierend auf Quell-Objekt und Draft-Typ
- Pflichtfelder:
  - Titel
  - Draft-Typ
  - Quell-Objekt (Opportunity, Pattern oder manuell)
  - Problembeschreibung
  - Zielbeschreibung
  - Entwurfsinhalt (Markdown, editierbar)
  - Status: Entwurf → überarbeitet → bereit → umgesetzt → verworfen
- Listenansicht mit Filter nach Draft-Typ und Status
- Markdown-Export

**Akzeptanzkriterien**:
- [ ] Module Draft kann manuell erstellt werden
- [ ] Module Draft kann KI-gestützt aus Opportunity/Pattern generiert werden
- [ ] Entwurfsinhalt ist als Markdown editierbar
- [ ] Status-Workflow funktioniert
- [ ] Listenansicht mit Filtern funktioniert
- [ ] Markdown-Export funktioniert

### FEAT-010 — Knowledge Packaging Engine (Basis)
**Zweck**: Erkenntnisse, SOPs, Prozesse und Strukturen als wissensplattformfähige Outputs verpacken.

**V1-Tiefe**: Markdown-Export mit Strukturvorgaben — keine Knowledge-Base-Integration.

**Funktionale Anforderungen**:
- Knowledge Package erstellen (manuell oder aus Insight/Pattern/Improvement abgeleitet)
- Package-Typen: SOP-Markdown, Wissensbaustein, FAQ-Eintrag, Rollenbeschreibung, Prozessbeschreibung, Entscheidungslogik
- KI-gestützte Generierung: Claude erstellt ein strukturiertes Package basierend auf Quell-Objekt und Package-Typ
- Pflichtfelder:
  - Titel
  - Package-Typ
  - Quell-Objekt (Insight, Pattern, Improvement oder manuell)
  - Inhalt (Markdown, editierbar)
  - Zielplattform (intern / extern / unbestimmt)
  - Status: Entwurf → überarbeitet → freigegeben
- Listenansicht mit Filter nach Package-Typ und Status
- Markdown-Export (einzeln und Bulk)

**Akzeptanzkriterien**:
- [ ] Knowledge Package kann manuell erstellt werden
- [ ] Package kann KI-gestützt aus Quell-Objekt generiert werden
- [ ] Inhalt ist als Markdown editierbar
- [ ] Status-Workflow funktioniert
- [ ] Markdown-Export funktioniert (einzeln und Bulk)

---

## Objektmodell (V1)

| # | Objekttyp | Beschreibung | Erstellt durch | Beziehungen |
|---|-----------|-------------|----------------|-------------|
| 1 | **Source Record** | Rohsignal in der Inbox | Manuell, Import | → wird zu Insight |
| 2 | **Insight** | Klassifizierte Einzelerkenntnis | Analyzer aus Source Record | → Pattern, Improvement, Opportunity, Asset Request |
| 3 | **Pattern** | Verdichtetes Muster aus mehreren Insights | Manuell, KI-Vorschlag | ← Insights (n:m), → Improvement, Opportunity |
| 4 | **Improvement** | Konkreter Verbesserungsvorschlag | Manuell, KI aus Insight/Pattern | ← Insight/Pattern, → Zielsystem |
| 5 | **Opportunity** | Katalogisierte Produkt-/Automatisierungschance | Manuell, KI aus Insight/Pattern | ← Insight/Pattern, → Module Draft, Asset Request |
| 6 | **Catalog Entry** | = Opportunity im Katalogformat | Aus Opportunity | ← Opportunity, → verwandte Entries |
| 7 | **Module Draft** | Entwurf eines Moduls/Scripts/Fragebogens | Manuell, KI aus Opportunity/Pattern | ← Opportunity/Pattern |
| 8 | **Knowledge Package** | Wissensplattformfähiger Output | Manuell, KI aus Insight/Pattern/Improvement | ← Insight/Pattern/Improvement |
| 9 | **Asset Request** | Auftrag zur Content-Erzeugung | Decision Board, manuell | ← Quell-Objekt, → Asset |
| 10 | **Asset** | Fertiger Output (Blog, Post, etc.) | Content Transformer | ← Asset Request |

**Design-Anmerkung**: Opportunity und Catalog Entry werden in V1 als ein Objekttyp implementiert (Opportunity mit Katalog-Feldern). Die konzeptionelle Trennung bleibt für V1.1 erhalten.

---

## Input-Quellen (V1)

| Quelle | V1-Anbindung | Methode |
|--------|-------------|---------|
| System 1 (Blueprint) | Manuell | Export → Import in Inbox |
| System 2 (Operating System) | Manuell | Copy/Export → Import in Inbox |
| System 3 (Business Dev) | Manuell | Copy/Export → Import in Inbox |
| Manuelle Notizen/Ideen | Direkt | Manuelles Erstellen in Inbox |
| Externe Quellen/Research | Manuell | Manuelles Erstellen oder Datei-Import |

**V1-Prinzip**: Alle Input-Quellen werden manuell oder per Datei-Import bedient. Keine automatischen System-Anbindungen in V1.

---

## Out of Scope (V1)

### Explizit nicht in V1
- Reuse & Similarity Finder (semantische Suche) → V1.1
- ML-basiertes Auto-Clustering → V1.1
- Erweiterte Output-Typen (Carousel, Video-Script, Präsentation) → V1.1
- Automatische Zufuhr aus System 2+3 → V2
- Research & Enrichment (externe Anreicherung) → V2
- Cross-Project-Auswertung → V2
- Branchen-/Zielgruppen-Layer → V2

### Grundsätzlich nicht Teil dieses Projekts
- CRM / Deal-Pipeline / Kontaktpflege
- Kanban / Pipeline-Management
- Kunden-Onboarding
- Delivery-Hauptsystem
- Allgemeine Dokumentenablage
- Social Publishing / E-Mail-Kampagnen
- Wissensplattform / LMS / E-Learning
- Zertifikate / Prüfungslogik
- Kunden-Projektmanagement
- Multiuser-System / externe Zugriffe
- White-Label

---

## Constraints

### Technische Constraints
- Lokal-first: Keine Cloud-Infrastruktur, kein externes Deployment
- SQLite als einzige Datenhaltung (keine separate DB-Infrastruktur)
- KI ausschließlich über Claude Code Agent Tool (Max-Subscription)
- Next.js als UI-Framework (lokale Ausführung)
- Kein API-Budget — alles innerhalb Max-Subscription

### Business Constraints
- Ein-Personen-Betrieb: System muss von einer Person bedienbar sein
- IP-Schutz: Sensible Geschäftsdaten dürfen nicht unkontrolliert nach außen gehen
- Kein Multiuser-Bedarf in V1

### Datenschutz-Constraints (DEC-005)
- Kunden-Rohdaten (Transkripte, E-Mails, Blueprint-Exporte) bleiben ausschließlich in SQLite
- An Claude gehen nur abstrahierte Insights, keine personenbezogenen Rohdaten
- Anonymisierung/Pseudonymisierung vor KI-Verarbeitung bei kundenbezogenen Daten

### Operative Constraints
- System muss ohne laufende Hintergrundprozesse nutzbar sein (kein Daemon)
- Backup = Kopie der SQLite-Datei
- Keine externen Abhängigkeiten zur Laufzeit (außer Claude Code)

---

## Risks / Assumptions

### Risks
- **Kontextfenster-Limit**: Lange oder komplexe Quell-Objekte könnten bei der KI-Analyse das Kontextfenster belasten. Mitigation: Zusammenfassungen statt Volltexte an Claude senden.
- **Daten-Disziplin**: Ohne konsequente Nutzung der Inbox wird das System wertlos. Mitigation: Decision Board erzwingt Entscheidungen, leere Inbox ist sichtbar.
- **Brand-Qualität**: KI-generierte Assets könnten trotz Brand Guidelines qualitativ variieren. Mitigation: Tone Check als Prüfschritt, manuelles Review bleibt Standard.

### Assumptions
- Claude Code Agent Tool bleibt langfristig über Max-Subscription verfügbar
- SQLite reicht für die erwarteten Datenmengen (tausende Einträge über Jahre)
- Ein-Personen-Bedienung ist ausreichend — kein Team-Bedarf in absehbarer Zukunft
- Manuelle Input-Anbindung (Copy/Import) ist in V1 akzeptabel

---

## Success Criteria

1. **Inbox funktioniert**: Signale aus allen Quellen können innerhalb von 2 Minuten strukturiert aufgenommen werden (manuell oder Import)
2. **Analyse funktioniert**: Ein Inbox-Eintrag kann innerhalb von 30 Sekunden KI-gestützt klassifiziert und bewertet werden
3. **Verdichtung funktioniert**: Aus 10+ Insights können Patterns gebildet und visualisiert werden
4. **Verbesserungen werden abgeleitet**: Aus Insights/Patterns entstehen konkrete, zielbereichsbezogene Improvements
5. **Katalog ist nutzbar**: Opportunities können erstellt, bewertet, gefiltert und verlinkt werden
6. **Entscheidungen werden erzwungen**: Kein Objekt bleibt dauerhaft ohne Folgeentscheidung
7. **Assets entstehen**: Aus Erkenntnissen können Blog, LinkedIn-Post, One-Pager und Produktnotiz generiert werden
8. **Brand-Konsistenz ist prüfbar**: Generierte Assets können gegen Brand Guidelines geprüft werden
9. **Module entstehen**: Neue Module/Scripts/Fragebögen können als strukturierte Entwürfe entwickelt werden
10. **Wissen wird verpackt**: SOPs, FAQ, Wissensbausteine können als saubere Markdown-Outputs erzeugt werden

---

## Scope Classification

### Now (V1)
- Insight Inbox mit Pflichtfeldern und Import
- Insight Analyzer mit KI-Klassifizierung
- Pattern & Signal Clustering (Basis)
- Improvement Engine mit Zielbereichen
- Opportunity & Product Catalog
- Decision & Action Board
- Content & Asset Transformer (4 Grundtypen)
- Brand & Output Control
- Modules & Script Builder (Basis)
- Knowledge Packaging Engine (Basis)
- Lokale Next.js UI
- SQLite Datenhaltung
- Claude Code Agent Integration

### Later (V1.1 / V2)
- Reuse & Similarity Finder
- Stärkere Clusterlogik (ML)
- Erweiterte Output-Typen
- Automatische System-Anbindungen
- Research & Enrichment
- Cross-Project-Auswertung
- Branchen-Layer
- Modulvergleichslogik
- Ollama für Batch-Verarbeitung

### Not Part of This Project
- CRM, Pipeline, Kontaktpflege
- Delivery-Hauptsystem
- Wissensplattform / LMS
- Social Publishing
- Multiuser / externe Zugriffe
- White-Label

---

## Open Questions
- Keine offenen Fragen. Alle Discovery-Fragen (Q1-Q3) sind beantwortet und als Entscheidungen dokumentiert (DEC-002 bis DEC-005).

---

## Recommended Next Step
`/architecture` — Technische Architektur auf Basis dieses PRD definieren.