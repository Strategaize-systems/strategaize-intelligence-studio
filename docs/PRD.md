# Product Requirements Document

## Purpose
StrategAIze Intelligence Studio ist die zentrale interne Decision-to-Execution Engine von StrategAIze. Es sammelt Erkenntnisse aus Onboarding, Delivery, Vertrieb, Markt und internen Ideen, verdichtet sie zu Mustern, Chancen und Verbesserungen, bewertet und priorisiert sie, übersetzt Entscheidungen in konkrete Folgeobjekte und löst Folgearbeit in den anderen Systemen aus. Das System erzeugt wiederverwendbare Module, Scripts, Fragebögen, Wissensbausteine und Assets — und strukturiert Markt- und Hypothesentests.

## Vision
System 4 in der StrategAIze-Gesamtarchitektur: Eine querliegende Lern-, Bewertungs-, Entscheidungs- und Produktionsschicht über allen anderen Systemen. Das Studio konserviert IP, verbessert die Methodik systemisch, produziert intelligenzbasierte Assets, bewertet Chancen strukturiert, testet Hypothesen diszipliniert und löst Folgearbeit in System 1, 2 und 3 aus.

Das Intelligence Studio ist nicht nur ein Denk- und Sammelraum. Es ist eine Decision-to-Execution Engine: Jede Erkenntnis soll zu einer Entscheidung führen, und jede Entscheidung soll in ein konkretes Folgeobjekt übersetzbar sein.

## Project
- Name: StrategAIze Intelligence Studio
- Working title: Intelligence Studio
- Owner: StrategAIze (Gründer)
- Status: Requirements (Revision)
- Delivery mode: internal-tool

## Problem Statement
Erkenntnisse aus Beratung, Onboarding, Delivery, Vertrieb und Marktbeobachtung entstehen täglich — aber sie verflüchtigen sich in Chats, Notizen und Gesprächen. Es fehlt ein System, das diese Signale strukturiert aufnimmt, verdichtet, katalogisiert, bewertet und in wiederverwendbare Produkte und Folgearbeit überführt.

Darüber hinaus fehlt eine zentrale Instanz, die aus Einzelerkenntnissen strategische Entscheidungen ableitet: Welche Chancen sind relevant? Welche Hypothesen müssen getestet werden? Welche Zusatzinformationen fehlen? Welche Folgearbeit muss in welchem System ausgelöst werden?

Ohne ein solches System geht nicht nur die Erfahrungsschicht verloren, sondern auch die Fähigkeit, systematisch von Erkenntnis zu Aktion zu kommen.

## Goal
Ein funktionales lokales System, das:
1. Rohsignale aus allen relevanten Quellen strukturiert aufnimmt
2. Diese Signale KI-gestützt klassifiziert, bewertet und verdichtet
3. Muster, Chancen und Verbesserungspotenziale sichtbar macht
4. Konkrete Verbesserungen für Fragen, Skills, Methodik, Angebote und Assets ableitet
5. Produkt-, Angebots-, Automatisierungs- und Venture-Ideen katalogisiert und strukturiert bewertet
6. Für jede Erkenntnis eine klare Folgeentscheidung erzwingt
7. Entscheidungen in typisierte Folgeobjekte übersetzt (Trigger für andere Systeme)
8. Aus Erkenntnissen direkt nutzbare Content-Assets produziert
9. Marken- und Stilkonsistenz aller Outputs sichert
10. Neue Module, Scripts, Fragebögen, Flows und Delivery-Bausteine in Entwurfsform entwickelt
11. Wissensplattformfähige Outputs erzeugt
12. Markt- und Hypothesentests strukturiert und Kill-or-Go-Entscheidungen unterstützt
13. Vorbereitungslogik für Markt-, Operator- und Zielgruppenarbeit bereitstellt

## Systemabgrenzung

### System 1 — Blueprint / Onboarding Platform
Zieht strukturiert Wissen von außen oder aus konkreten Erhebungen heraus.
Nicht verantwortlich für Opportunity-Bewertung oder strategische Priorisierung.

### System 2 — Operating System
Verdichtet Wissen zu Deliverables, Standards, Roadmaps und Umsetzungslogik.
Nicht primär zuständig für Opportunity-Selektion oder Marktprüfung.

### System 3 — Business Development System
Exekutiert laufende Markt-, Deal- und Relationship-Arbeit.
Nicht primär verantwortlich für die strategische Definition neuer Tests, neuer Vertikalen oder neuer Opportunity-Hypothesen.

### System 4 — Intelligence Studio (dieses System)
Definiert, bewertet und strukturiert:
- welche Chancen relevant sind
- welche Hypothesen getestet werden
- welche Zusatzinformationen fehlen
- welche Assets/Module/Fragebögen gebaut werden müssen
- welche Folgearbeit in S1/S2/S3 ausgelöst wird

**Kurzform:** Intelligence entscheidet und entwirft. Business Development exekutiert bestehende oder freigegebene Marktlogik. Onboarding erhebt strukturierte Zusatzdaten. Operating verdichtet und verarbeitet.

## Target Users
- **Primär**: Gründer (alleiniger Operator und Nutzer)
- **Sekundär** (perspektivisch): Maximal 1 weitere interne Vertrauensperson
- **Ausdrücklich nicht**: Kunden, externe Partner, breite Nutzergruppen

## User / Problem Context
StrategAIze betreibt drei Systeme: Blueprint-Plattform (Onboarding/Assessment), Operating System (Delivery/Analyse), Business Development System (Vertrieb/CRM). In allen drei Systemen entstehen täglich wertvolle Signale — Kundenantworten, Analyseergebnisse, Vertriebsfeedback, Einwände, Methodikbeobachtungen. Diese Signale werden aktuell nicht systematisch gesammelt, verdichtet, bewertet oder in Folgearbeit überführt. Das Intelligence Studio schließt diese Lücke als querliegende Entscheidungs- und Produktionsschicht.

---

## V1 Scope — Intelligence Studio MVP (Decision-to-Execution Engine)

### Überblick
V1 liefert den funktionalen Kern: Signale rein, verdichten, bewerten, entscheiden, Folgearbeit auslösen, produzieren. Alle 12 Module werden in V1 umgesetzt, mit bewusster Tiefenbegrenzung bei den neuen Modulen (Experiment, Research) und den Basis-Modulen (Pattern Clustering, Module Builder, Knowledge Packaging).

### Technischer Rahmen (aus Discovery-Entscheidungen)
- **UI**: Lokale Next.js-Anwendung für Übersichten, Katalog, Inbox, Decision Board
- **Verarbeitungslogik**: Claude Code Agent Tool (Max-Subscription) für KI-gestützte Workflows
- **Datenbank**: SQLite (lokal, eine Datei, kein Server)
- **DSGVO-Schnitt**: Rohdaten bleiben in SQLite, nur abstrahierte Insights gehen an Claude
- **Deployment**: Nur lokal, kein Web-Deployment

---

## Core Features (V1) — 12 Module

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
  - Vorgeschlagene Folgeaktion (Decision Board, Katalog, Content, Improvement, Experiment, Research, ignorieren)
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

### FEAT-005 — Opportunity & Venture Evaluation
**Zweck**: Strategisches Bewertungs- und Katalogsystem für Produkt-, Automatisierungs-, Angebots-, Venture- und Use-Case-Ideen. Aus einem Ideenlager wird ein belastbares Entscheidungssystem.

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
- **Pflicht-Bewertungsschema** (strukturierte Evaluation jeder Opportunity):
  - Problemklasse (Pflicht) — Welches übergeordnete Problem wird adressiert?
  - Zielgruppe (Pflicht) — Wer genau hat dieses Problem?
  - Strategischer Fit (Pflicht) — Wie gut passt das zur StrategAIze-Positionierung?
  - Core Engine Fit (Optional in V1) — Wie gut nutzt es die bestehende Core Engine?
  - Einordnung: Cashflow / Asset / Option (Pflicht) — Welcher Typ Wertbeitrag entsteht?
  - Einordnung: Produkt / Framework / Venture-Kandidat (Optional in V1) — Welche Form hat die Umsetzung?
  - Minimale marktfähige Form (Optional in V1) — Was ist das Minimal Viable Offering?
  - Plausibler Operator-Typ (Optional in V1) — Wer operiert das realistisch?
  - Monetarisierungslogik (Optional in V1) — Wie wird Umsatz erzeugt?
  - Testbedarf / Validierungsbedarf (Pflicht) — Was muss geprüft werden bevor Invest?
  - Kill-Kriterien / No-Go-Signale (Pflicht) — Was würde die Idee sofort stoppen?
- Katalogansicht mit Filter und Sortierung
- Detailansicht mit allen Feldern, Bewertungsschema und verlinkten Objekten
- Schnellfilter: "Alle relevanten", "Alle in Ausarbeitung", "Alle geparkten", "Alle mit Testbedarf"

**Akzeptanzkriterien**:
- [ ] Katalog-Eintrag kann manuell erstellt werden mit allen Pflichtfeldern
- [ ] Eintrag kann KI-gestützt aus Insight/Pattern abgeleitet werden
- [ ] Bewertungsschema mit 6 Pflicht- und 5 optionalen Dimensionen funktioniert
- [ ] Reifegrad-Workflow funktioniert
- [ ] Verwandte Einträge können verlinkt werden
- [ ] Katalogansicht mit Filtern und Schnellfilter funktioniert
- [ ] Detailansicht zeigt alle Felder, Bewertung und Verlinkungen

### FEAT-006 — Decision & Trigger Board
**Zweck**: Zentrale Entscheidungs- und Trigger-Instanz. Für jede Insight, Idee, Opportunity, Verbesserung oder Testidee wird eine klare Folgeentscheidung erzwungen — und diese Entscheidung wird in ein konkretes, typisiertes Folgeobjekt übersetzt.

**Funktionale Anforderungen**:
- Board-Ansicht zeigt alle Objekte, die eine Entscheidung brauchen (Insights ohne Folgeaktion, neue Opportunities, offene Improvements, abgeschlossene Experiments)
- Entscheidungsoptionen pro Objekt:
  - ignorieren
  - archivieren
  - beobachten
  - in Katalog aufnehmen (→ Opportunity)
  - Content daraus bauen (→ Asset Request)
  - Modul/Flow daraus bauen (→ Module Draft)
  - Frage/Skill/Vertriebsargument verbessern (→ Improvement)
  - Hypothese testen (→ Experiment)
  - Research-/Marktaufgabe erstellen (→ Research Task)
  - Onboarding-Entwurf erstellen (→ Module Draft / Onboarding)
  - Operator-Suchprofil erstellen (→ Research Task / Operator)
  - Wissensbaustein bauen (→ Knowledge Package)
  - später prüfen (mit Datum)
- **Entscheidung erzeugt typisierten Action Trigger** mit:
  - Trigger-Typ (aus der Liste oben)
  - Zielsystem (S1/S2/S3/intern)
  - Quell-Objekt (welches Objekt hat die Entscheidung ausgelöst)
  - Status: erstellt → in Arbeit → erledigt → verworfen
  - Beschreibung / Auftrag
- Entscheidung wird gespeichert und ist nachvollziehbar
- "Undecided"-Filter: Alle Objekte ohne Entscheidung
- "Später prüfen"-Erinnerung: Übersicht aller Objekte mit Wiedervorlagedatum
- Action Trigger-Übersicht: Alle erzeugten Folgeobjekte mit Status

**Akzeptanzkriterien**:
- [ ] Board zeigt alle Objekte, die eine Entscheidung brauchen
- [ ] Entscheidung kann getroffen und gespeichert werden
- [ ] Entscheidung erzeugt korrekten Action Trigger mit Typ und Zielsystem
- [ ] Action Trigger wird als eigenständiges Objekt gespeichert
- [ ] Undecided-Filter funktioniert
- [ ] Später-prüfen-Übersicht mit Datumsfilter funktioniert
- [ ] Action-Trigger-Übersicht zeigt alle Folgeobjekte mit Status

### FEAT-007 — Content & Asset Transformer (Grundtypen)
**Zweck**: Aus Erkenntnissen, Mustern und Katalogeinträgen direkt nutzbare Assets erzeugen.

**V1-Output-Typen**:
- Blogpost (Markdown)
- LinkedIn-Post (Kurztext)
- One-Pager (Markdown, strukturiert)
- Interne Produktnotiz (Markdown)
- E-Mail-Vorlage (Markdown)
- Landingpage-Briefing (Markdown, strukturiert)

**Funktionale Anforderungen**:
- Asset Request erstellen: Quell-Objekt auswählen (Insight, Pattern, Opportunity, Improvement, Experiment) + gewünschten Output-Typ wählen
- KI-Generierung: Claude erzeugt einen Entwurf basierend auf Quell-Objekt + Brand Guidelines
- Entwurf wird in der UI angezeigt und kann bearbeitet werden
- Asset-Status: Entwurf → überarbeitet → freigegeben → veröffentlicht
- Asset-Bibliothek: Alle erzeugten Assets mit Filter nach Typ und Status
- Markdown-Export für jedes Asset

**Akzeptanzkriterien**:
- [ ] Asset Request kann aus jedem Quell-Objekttyp erstellt werden
- [ ] Claude generiert einen Entwurf für jeden der 6 Output-Typen
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
  - Strukturvorlagen pro Output-Typ (Blogpost-Template, LinkedIn-Template, One-Pager-Template, Produktnotiz-Template, E-Mail-Template, Landingpage-Template)
  - Do's und Don'ts (Freitext)
- Brand-Konfiguration wird bei jeder Asset-Generierung als Kontext an Claude mitgegeben
- Tone Check: Bestehendes Asset gegen Brand Guidelines prüfen lassen (Claude-basiert)
- Ergebnisse des Tone Checks werden angezeigt (passt / Abweichungen)

**Akzeptanzkriterien**:
- [ ] Brand-Konfiguration kann in der UI gepflegt werden
- [ ] Asset-Generierung berücksichtigt die Brand-Konfiguration
- [ ] Tone Check kann auf ein bestehendes Asset angewendet werden
- [ ] Tone Check zeigt konkrete Abweichungen vom Brand Guide

### FEAT-009 — Modules, Flows & Build Drafts
**Zweck**: Aus wiederkehrenden Themen, Chancen und Entscheidungen strukturierte Build-Artefakte für andere Systeme entwickeln. Nicht nur generische Scripts, sondern alle Arten von operativen Entwürfen.

**V1-Tiefe**: Strukturierte Entwürfe mit Templates — kein vollautomatischer Modulbaukasten.

**Funktionale Anforderungen**:
- Module Draft erstellen (manuell oder aus Opportunity/Pattern/Decision abgeleitet)
- Draft-Typen:
  - Fragebogen-Entwurf (für System 1)
  - Assessment-Flow (für System 1)
  - Zusatzkatalog-Entwurf (für System 1)
  - Beratungsmodul-Entwurf (für System 2)
  - Delivery-Script (für System 2)
  - Prompt-/Skill-Erweiterung (für Dev System)
  - Modulbeschreibung
  - Prozess-/Flow-Draft
  - Onboarding-Draft
  - Landingpage-Briefing
  - Outreach-Pack-Entwurf
  - Kampagnenlogik-Entwurf
  - Präsentationsentwurf
- KI-gestützte Generierung: Claude erstellt einen strukturierten Entwurf basierend auf Quell-Objekt und Draft-Typ
- Pflichtfelder:
  - Titel
  - Draft-Typ
  - Zielsystem (S1/S2/S3/Dev/intern)
  - Quell-Objekt (Opportunity, Pattern, Decision oder manuell)
  - Problembeschreibung
  - Zielbeschreibung
  - Entwurfsinhalt (Markdown, editierbar)
  - Status: Entwurf → überarbeitet → bereit → umgesetzt → verworfen
- Listenansicht mit Filter nach Draft-Typ, Zielsystem und Status
- Markdown-Export

**Akzeptanzkriterien**:
- [ ] Module Draft kann manuell erstellt werden
- [ ] Module Draft kann KI-gestützt aus Opportunity/Pattern/Decision generiert werden
- [ ] Alle Draft-Typen sind verfügbar und auswählbar
- [ ] Zielsystem-Zuordnung funktioniert
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

### FEAT-011 — Experiment / Market Test Manager (Basis)
**Zweck**: Strukturierte Hypothesenprüfung. Ein Experiment ist kein lose notierter Testgedanke, sondern ein strukturiertes Objekt mit klarer Entscheidungsvorbereitung und Kill-or-Go-Logik.

**V1-Tiefe**: Strukturiertes Objektmanagement mit CRUD, KI-Vorschlag und manueller Ergebnisdokumentation. Kein automatisches Test-Tracking, kein Ergebnis-Dashboard.

**Funktionale Anforderungen**:
- Experiment erstellen (manuell oder aus Opportunity/Decision/Pattern abgeleitet)
- KI-gestützte Ableitung: Claude schlägt Experiment-Designs aus Opportunities vor
- Pflichtfelder pro Experiment:
  - Titel
  - Hypothese (was genau wird getestet?)
  - Quell-Objekt (Opportunity, Decision, Pattern oder manuell)
  - Zielgruppe (wer wird getestet?)
  - Kanal (über welchen Weg wird getestet?)
  - Budget-Rahmen (geschätzter Aufwand / Kosten)
  - Zeitfenster (Start- und Enddatum)
  - Erfolgssignale (woran erkennt man Erfolg?)
  - Kill-Kriterien (was stoppt den Test sofort?)
  - Status: geplant → aktiv → abgeschlossen → abgebrochen
  - Ergebnis (Freitext, nach Abschluss)
  - Folgeentscheidung (was passiert als nächstes?)
- Listenansicht mit Filter nach Status, Zielgruppe, Kanal
- Detailansicht mit allen Feldern
- Abschluss-Workflow: Ergebnis eintragen → Folgeentscheidung treffen → ggf. neuer Action Trigger

**Akzeptanzkriterien**:
- [ ] Experiment kann manuell erstellt werden mit allen Pflichtfeldern
- [ ] Experiment kann KI-gestützt aus Opportunity/Pattern abgeleitet werden
- [ ] Kill-Kriterien und Erfolgssignale werden klar dokumentiert
- [ ] Status-Workflow funktioniert (geplant → aktiv → abgeschlossen/abgebrochen)
- [ ] Ergebnis kann nach Abschluss dokumentiert werden
- [ ] Folgeentscheidung kann getroffen werden (erzeugt ggf. neuen Action Trigger)
- [ ] Listenansicht mit Filtern funktioniert

### FEAT-012 — Research & Market Prep (Basis)
**Zweck**: Vorbereitungslogik für Markt-, Operator- und Zielgruppenarbeit. Das System designt und dokumentiert Research-Aufträge — es exekutiert sie nicht (kein CRM, kein Versand, kein Tracking).

**V1-Tiefe**: Briefing- und Entwurfslogik. Zielgruppensegmente definieren, Suchprofile erstellen, Outreach-Packs vorbereiten. Alles als strukturierte Objekte mit Markdown-Inhalten.

**Funktionale Anforderungen**:
- Research Task erstellen (manuell oder aus Opportunity/Experiment/Decision abgeleitet)
- Research-Typen:
  - Zielgruppenrecherche (Wer ist die Zielgruppe? Wie groß? Wo erreichbar?)
  - Operator-Suchprofil (Wer operiert das? Welche Qualifikation? Wo finden?)
  - Multiplikator-Profilierung (Wer hat Reichweite in dieser Zielgruppe?)
  - Testmarkt-Analyse (Welcher Markt eignet sich für einen Test?)
  - Outreach-Pack (Was brauche ich für die Ansprache? Messaging, Materialien, Kontaktstrategie)
  - Listenauftrag / Listenbriefing (Was soll recherchiert und gelistet werden?)
- KI-gestützte Generierung: Claude erstellt strukturierte Research-Briefings
- Pflichtfelder pro Research Task:
  - Titel
  - Research-Typ
  - Quell-Objekt (Opportunity, Experiment, Decision oder manuell)
  - Fragestellung (was genau soll herausgefunden werden?)
  - Kontext (warum wird das gebraucht?)
  - Kontaktkriterien / Suchlogik (falls zutreffend)
  - Ergebnis (Freitext/Markdown, nach Abschluss)
  - Status: offen → in Recherche → abgeschlossen → verworfen
- Listenansicht mit Filter nach Research-Typ und Status
- Detailansicht mit allen Feldern
- Markdown-Export

**Akzeptanzkriterien**:
- [ ] Research Task kann manuell erstellt werden mit allen Pflichtfeldern
- [ ] Research Task kann KI-gestützt aus Opportunity/Experiment abgeleitet werden
- [ ] Alle Research-Typen sind verfügbar und auswählbar
- [ ] Ergebnis kann nach Abschluss dokumentiert werden
- [ ] Status-Workflow funktioniert
- [ ] Listenansicht mit Filtern funktioniert
- [ ] Markdown-Export funktioniert

---

## Decision-to-Execution Prinzip

Das zentrale Designprinzip des Intelligence Studio: Jede Erkenntnis muss zu einer Entscheidung führen, und jede Entscheidung muss in ein konkretes Folgeobjekt übersetzbar sein.

### Trigger-Typen (V1 — fachlich modelliert, manuell ausgelöst)

| Trigger-Typ | Erzeugt | Zielsystem |
|-------------|---------|------------|
| Create Onboarding Draft | Module Draft (Typ: Onboarding) | S1 |
| Create Question Catalog Draft | Module Draft (Typ: Zusatzkatalog) | S1 |
| Create Module Draft | Module Draft (allgemein) | S2/Dev |
| Create Asset Brief | Asset Request | Intern |
| Create Market Test | Experiment | Intern |
| Create Research Task | Research Task | Intern |
| Create Operator Search Profile | Research Task (Typ: Operator) | Intern/S3 |
| Create Improvement Proposal | Improvement | S1/S2/S3/Dev |
| Create Knowledge Package | Knowledge Package | Intern |
| Create Outreach Pack | Research Task (Typ: Outreach) | S3 |

**V1**: Trigger werden im Decision Board erzeugt und als Action Triggers gespeichert. Die tatsächliche Umsetzung erfolgt manuell — es gibt keine automatische API-Weiterleitung an andere Systeme.

**V2**: Trigger können halbautomatisch an andere Systeme weitergeleitet werden.

### Beispielhafte Übersetzungsketten

- Wissenslücke → Fragebogen-Entwurf für S1
- Opportunity → Markt-Test (Experiment)
- Pattern-Erkenntnis → Improvement für S2/S3
- Produktidee → Pitchdeck/One-Pager/Landingpage-Brief
- Marktchance → Operator-Suchprofil (Research Task)
- Kommunikationsidee → Asset Request
- Testidee → Zielgruppen-/Research-Aufgabe

---

## Objektmodell (V1)

| # | Objekttyp | Beschreibung | Erstellt durch | Beziehungen |
|---|-----------|-------------|----------------|-------------|
| 1 | **Source Record** | Rohsignal in der Inbox | Manuell, Import | → wird zu Insight |
| 2 | **Insight** | Klassifizierte Einzelerkenntnis | Analyzer aus Source Record | → Pattern, Improvement, Opportunity, Experiment, Research, Asset Request |
| 3 | **Pattern** | Verdichtetes Muster aus mehreren Insights | Manuell, KI-Vorschlag | ← Insights (n:m), → Improvement, Opportunity, Experiment |
| 4 | **Improvement** | Konkreter Verbesserungsvorschlag | Manuell, KI aus Insight/Pattern | ← Insight/Pattern, → Zielsystem |
| 5 | **Opportunity** | Katalogisierte und bewertete Chance | Manuell, KI aus Insight/Pattern | ← Insight/Pattern, → Experiment, Research Task, Module Draft, Asset Request |
| 6 | **Module Draft** | Entwurf eines Moduls/Scripts/Flows/Fragebogens | Manuell, KI aus Opportunity/Pattern/Decision | ← Opportunity/Pattern/Decision |
| 7 | **Knowledge Package** | Wissensplattformfähiger Output | Manuell, KI aus Insight/Pattern/Improvement | ← Insight/Pattern/Improvement |
| 8 | **Asset Request** | Auftrag zur Content-Erzeugung | Decision Board, manuell | ← Quell-Objekt, → Asset |
| 9 | **Asset** | Fertiger Output (Blog, Post, E-Mail, etc.) | Content Transformer | ← Asset Request |
| 10 | **Experiment** | Strukturierter Markt-/Hypothesentest | Manuell, KI aus Opportunity/Decision | ← Opportunity/Decision/Pattern, → Research Task, Action Trigger |
| 11 | **Research Task** | Recherche-/Marktvorbereitungsauftrag | Manuell, KI aus Opportunity/Experiment | ← Opportunity/Experiment/Decision |
| 12 | **Action Trigger** | Typisiertes Folgeobjekt aus Entscheidung | Decision Board | ← Decision, → erzeugt Ziel-Objekt |

**Design-Anmerkung**: Opportunity und Catalog Entry werden in V1 weiterhin als ein Objekttyp implementiert (Opportunity mit Katalog- und Bewertungsfeldern). Die Trennung in Katalog und separates Scoring bleibt für V1.1.

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
- KI-gestützte Entscheidungsempfehlungen → V1.1
- Automatische Trigger-Weiterleitung an andere Systeme → V2
- Automatische Zufuhr aus System 2+3 → V2
- Research & Enrichment (externe Datenanreicherung) → V2
- Cross-Project-Auswertung → V2
- Branchen-/Zielgruppen-Layer → V2
- Experiment-Dashboard mit KPIs → V1.1
- Test-Vergleichslogik → V1.1
- Alle 11 Bewertungsdimensionen Pflicht (V1: 6 Pflicht + 5 optional) → V1.1
- Kontakt-Tracking / Outreach-Tracking → Nie (gehört zu S3)

### Grundsätzlich nicht Teil dieses Projekts
- CRM / Deal-Pipeline / Kontaktpflege
- Kanban / Pipeline-Management
- Kunden-Onboarding als Frontend-System
- Delivery-Hauptsystem
- Allgemeine Dokumentenablage
- Social Publishing als Versand-/Distributionssystem
- E-Mail-Kampagnen als Versandplattform
- Wissensplattform / LMS / E-Learning
- Zertifikate / Prüfungslogik
- Kunden-Projektmanagement
- Multiuser-System / externe Zugriffe
- White-Label

### Explizit IN Scope (Klarstellung — nicht mit Out-of-Scope verwechseln)
- E-Mail-Vorlagen und Messaging-Entwürfe (als Assets/Build Drafts)
- Kampagnenlogik-Entwürfe (als Build Drafts)
- Präsentationsentwürfe (als Build Drafts)
- One-Pager und Landingpage-Briefings (als Assets/Build Drafts)
- Operator-/Outreach-/Targeting-Packs (als Research Tasks)
- Fragebogen- und Katalogentwürfe (als Build Drafts)
- Trigger-/Folgeobjekte für S1/S2/S3 (als Action Triggers)

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
- **Scope Creep bei Research/Experiment**: Die neuen Module könnten zum CRM-Ersatz wuchern. Mitigation: Strenge V1-Tiefenbegrenzung — nur Design/Briefing, kein Tracking/Versand/CRM.
- **Action Trigger-Komplexität**: Zu viele Trigger-Typen könnten die UI überlasten. Mitigation: In V1 sind alle Trigger manuell und die Erzeugung läuft über das Decision Board als einzigen Einstiegspunkt.

### Assumptions
- Claude Code Agent Tool bleibt langfristig über Max-Subscription verfügbar
- SQLite reicht für die erwarteten Datenmengen (tausende Einträge über Jahre)
- Ein-Personen-Bedienung ist ausreichend — kein Team-Bedarf in absehbarer Zukunft
- Manuelle Input-Anbindung (Copy/Import) ist in V1 akzeptabel
- Manuelle Trigger-Ausführung ist in V1 akzeptabel (keine Auto-API nötig)

---

## Success Criteria

1. **Inbox funktioniert**: Signale aus allen Quellen können innerhalb von 2 Minuten strukturiert aufgenommen werden
2. **Analyse funktioniert**: Ein Inbox-Eintrag kann innerhalb von 30 Sekunden KI-gestützt klassifiziert werden
3. **Verdichtung funktioniert**: Aus 10+ Insights können Patterns gebildet werden
4. **Verbesserungen werden abgeleitet**: Aus Insights/Patterns entstehen konkrete Improvements
5. **Opportunities werden belastbar bewertet**: Jede Opportunity hat ein strukturiertes Bewertungsschema
6. **Entscheidungen werden erzwungen**: Kein Objekt bleibt dauerhaft ohne Folgeentscheidung
7. **Folgeobjekte entstehen**: Aus Entscheidungen werden typisierte Action Triggers erzeugt
8. **Assets entstehen**: Blog, LinkedIn-Post, One-Pager, E-Mail-Vorlage, Landingpage-Briefing, Produktnotiz
9. **Brand-Konsistenz ist prüfbar**: Assets können gegen Brand Guidelines geprüft werden
10. **Module und Flows entstehen**: Neue Module, Fragebögen, Flows und Delivery-Bausteine als Entwürfe
11. **Wissen wird verpackt**: SOPs, FAQ, Wissensbausteine als saubere Markdown-Outputs
12. **Tests werden strukturiert**: Experimente haben Hypothese, Kill-Kriterien und Folgeentscheidung
13. **Marktarbeit wird vorbereitet**: Research Tasks liefern strukturierte Briefings

---

## Scope Classification

### Now (V1)
- Insight Inbox mit Pflichtfeldern und Import
- Insight Analyzer mit KI-Klassifizierung
- Pattern & Signal Clustering (Basis)
- Improvement Engine mit Zielbereichen
- Opportunity & Venture Evaluation mit Pflicht-Bewertungsschema
- Decision & Trigger Board mit Action Triggers
- Content & Asset Transformer (6 Grundtypen)
- Brand & Output Control
- Modules, Flows & Build Drafts (13 Draft-Typen)
- Knowledge Packaging Engine (Basis)
- Experiment / Market Test Manager (Basis)
- Research & Market Prep (Basis)
- Lokale Next.js UI
- SQLite Datenhaltung
- Claude Code Agent Integration

### Later (V1.1 / V2)
- Reuse & Similarity Finder
- Stärkere Clusterlogik (ML)
- KI-Entscheidungsempfehlungen
- Erweiterte Output-Typen (Carousel, Video-Script, Präsentation)
- Automatische System-Anbindungen und Trigger-Weiterleitung
- Research & Enrichment
- Cross-Project-Auswertung
- Branchen-Layer
- Experiment-Dashboard und Test-Vergleichbarkeit
- Alle Bewertungsdimensionen Pflicht
- Modulvergleichslogik

### Not Part of This Project
- CRM, Pipeline, Kontaktpflege
- Delivery-Hauptsystem
- Kunden-Onboarding-Frontend
- Wissensplattform / LMS
- Social Publishing / E-Mail-Versand
- Multiuser / externe Zugriffe
- White-Label
- Kontakt-Tracking / Outreach-CRM

---

## Leitplanke

Das Intelligence Studio ist kein allgemeines Notizbuch und kein Content-Spielzeug.

Es ist ein internes strategisches System für:
- Lernen
- Verdichten
- Bewerten
- Testen
- Auslösen von Folgearbeit
- Asset-/Fragebogen-/Modul-Produktion
- Vorbereitung von Markt- und Operator-Entscheidungen

---

## Open Questions
- Keine offenen Fragen. Alle Discovery-Fragen sind beantwortet (DEC-001 bis DEC-009). Die strategische Revision (RPT-005) ist integriert.

---

## Recommended Next Step
`/architecture` — Technische Architektur aktualisieren: 3 neue Tabellen, erweiterte Enums, Prompt-Templates für neue Module.
