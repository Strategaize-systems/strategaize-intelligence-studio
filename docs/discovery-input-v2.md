# Discovery Input V2 — 2026-04-16

Erweiterung des Re-Discovery-Inputs vom 2026-04-15. Grund: beim Zuschnitt der V1 auf 7 Features (FEAT-001..FEAT-007) sind zentrale IS-Funktionsbereiche aus dem Scope gefallen, die in der ursprünglich archivierten V1-Planung bereits vorgesehen waren — plus ein strategisch wichtiger Block (Campaign & Lead Intelligence) ist bewusst neu dazugekommen.

Dieses Dokument ersetzt `discovery-input.md` **nicht**, sondern ergänzt ihn. Beide Dateien sind Pflichtlektüre für `/discovery` V2.

---

## 1. Anlass für /discovery V2

Die am 2026-04-15 abgeschlossene Requirements-Runde hat IS zu schmal geschnitten. Fokus lag auf **Ingest + Portfolio-Monitor + Insight/Opportunity-Layer**. Komplett gefehlt haben:

- Content-/Asset-Produktion als eigener Funktionsbereich
- Brand-/Designsystem-Grundlage
- Validierung neuer Business-Ideen (Experiment-Schicht)
- Vorgelagerte Markt- und Lead-Recherche
- Kampagnen- und Outbound-Logik
- Übergreifende Entscheidungs- und Priorisierungs-Schicht

Ohne diese Schichten ist IS analytische Backstage-Anzeige — nicht die operative Intelligence + Produktions + Go-To-Market-Schicht, die sie laut PLATFORM.md und Systemrolle sein soll.

**Wichtig:** FEAT-001..FEAT-007 werden nicht verworfen. Sie sind solide, bleiben in V1, und werden in Discovery V2 als Fundament ("Input- und Analyseschicht") eingeordnet. Die neuen Funktionsbereiche setzen darauf auf.

---

## 2. Neue Gesamtrolle des Intelligence Studio

IS ist nicht nur Analyse- und Opportunity-Schicht, sondern eine **Intelligence + Produktions + Go-To-Market-Steuerungsschicht**, die aus Wissen + Signalen + Markt strukturiert **Kampagnen, Assets, Hypothesen, Tests und Entscheidungen** erzeugt.

IS verbindet:

- **Onboarding** (verdichtetes Unternehmenswissen, Knowledge Units)
- **Business Development** (reale Markt- und Gesprächssignale)
- **Markt-/Wettbewerbssignale** (eigene Recherche + externe Daten wie Clay)

…und übersetzt das in:

- neue Module, Templates, Produktideen
- Content-, Brand- und Messaging-Assets
- Kampagnen + qualifizierte Leads für Business
- strukturierte Hypothesen-Tests mit Kill-or-Go-Logik
- priorisierte Entscheidungen über Testen / Weiterentwickeln / Verwerfen

Der operative Vertrieb, Deal-Steuerung und Revenue-Abschluss bleiben zwingend im **Business System**. IS steuert die **Schicht davor**.

---

## 3. Fünf Funktionsbereiche (verbindlich für Discovery V2)

### 3.1 Learning & Pattern Intelligence
**Status:** bestehender Kern, in FEAT-004 + FEAT-005 + FEAT-006 angelegt.

- Mustererkennung aus Onboarding-KUs, Delivery-Erfahrungen, BD-Signalen, Marktbeobachtungen
- Ableitung von Opportunities, Verbesserungen, neuen Modul-/Template-Kandidaten
- Cross-Kunden-Learnings (anonymisiert)

### 3.2 Content, Brand & Asset Production *(neu explizit)*
**Status:** fehlt in FEAT-001..007. War im Archiv in FEAT-007 (Content Transformer) + FEAT-008 (Brand Control) vorhanden.

- Messaging-Logiken, Vertriebsargumente, Angebotsbausteine
- Case Cards, One-Pager, Content-Assets (Outbound / Inbound)
- Vorlagen (Templates) und Brand-/Designsystem-Grundlagen (Farben, Struktur, Stil)
- KI-Generierung mit Brand Guidelines als Kontext
- Ziel: einheitliche, wiederverwendbare, systematisch erzeugte Kommunikations- und Vertriebsbasis

### 3.3 Campaign & Lead Intelligence *(neu — zentrale Erweiterung)*
**Status:** komplett neu. War im Archiv NICHT drin. Alte FEAT-012 hatte explizit ausgeschlossen: *"Wen habe ich kontaktiert und wann — gehört zu System 3"*. Diese Grenzlinie wird jetzt **bewusst verschoben**.

Vollständige vorgelagerte Lead- und Kampagnenlogik:

- ICP-Definition, Segmentierung
- Trigger-Signale (z. B. Wachstum, Probleme, Strukturdefizite)
- Lead-Recherche
- Datenanreicherung (z. B. über externe Tools wie Clay — **nur Daten-/Enrichment-Layer, nicht Kernsystem**)
- Lead-Scoring
- Kampagnenlogiken (Outbound, Inbound, Hybrid)
- Übergabe qualifizierter Leads an das Business Development System

**Neue Systemabgrenzung:**

- IS macht **ICP, Segmentierung, Lead-Recherche, Enrichment, Scoring, Kampagnen-Design und Kampagnen-Orchestrierung**
- Business System macht **Lead-Bearbeitung, Gespräche, Deal-Steuerung, Revenue-Abschluss**
- Schnittstelle: qualifizierter Lead + Kampagnen-Kontext wird von IS an Business übergeben

### 3.4 Validation & Business-Idea Testing *(neu — strategisch kritisch)*
**Status:** fehlt in FEAT-001..007. War im Archiv in FEAT-011 (Experiment Manager) + FEAT-012 (Research & Market Prep) vorhanden. Idee wird erweitert.

Systematisches Testen neuer Ideen:

- Aufnahme neuer Business-Ideen (z. B. aus Kundenwissen, BD-Signalen, Marktbeobachtung)
- Markt- und Wettbewerbsrecherche
- Hypothesenbildung
- Definition von Testcases (Zielgruppe, Kanal, Erfolgs- und Kill-Kriterien, Budget, Zeitfenster)
- Aufbau kleiner Testkampagnen (fließt in 3.3 ein)
- Generierung erster Leads, Durchführung von Erstgesprächen (fließt in Business ein)
- Feedback-Erfassung und strukturierte Auswertung

**Leitprinzip:** "Kill early, kill cheap." Schnelle Validierung oder Verwerfung von neuen Angeboten, Zielgruppen, Kampagnen, Positionierungen.

### 3.5 Orchestration & Decision Layer *(neu explizit)*
**Status:** fehlt in FEAT-001..007 als eigener Bereich. Teile stecken verteilt in FEAT-005.

Übergreifende Steuerung:

- Priorisierung von Ideen, Kampagnen und Tests
- Entscheidung: testen / weiterentwickeln / verwerfen / skalieren
- Steuerung von Content-Produktion, Kampagnen, Lead-Generierung
- Rückführung von Learnings in: Onboarding-Plattform, Business Development, Produkt-/Modul-Logik

### 3.6 Distribution & Tracking *(neu — Ergänzung 2026-04-16)*
**Status:** neu, nicht im Archiv, nicht im ursprünglichen Brief. Kommt aus Gründer-Ergänzung 2026-04-16 als logische Fortsetzung von 3.2 (Assets erzeugen) + 3.3 (Kampagnen steuern).

**Leitprinzip:** *„Ich will nicht fünf oder sechs Tracking-Cockpits öffnen müssen — wir holen die Rohdaten zurück und machen unsere eigene Übersicht."*

**Zwei Teile:**

**3.6a Publishing / Distribution**
- Ausspielung von Assets und Kampagnen-Inhalten an die gewählten Kanäle (LinkedIn, andere Social-/Content-Plattformen, E-Mail, ggf. Paid-Channels)
- Kanal-Adapter-Pattern — pro Kanal ein Adapter, kein Hard-Wiring
- Scheduling, Queue, Kanal-spezifische Format-Anpassung
- Welche Kanäle genau in V1 aktiv sind, bleibt offen — aber Datenmodell und Adapter-Struktur müssen von Anfang an vorgesehen sein

**3.6b Tracking / Zentrales Performance-Cockpit**
- Rohdaten-Rückfluss aus den Kanälen (Impressions, Clicks, Engagement, Conversions, wo verfügbar)
- Konsolidierte IS-eigene Übersicht: ein Cockpit über alle Kanäle, nicht N-Kanal-Konsolen
- **Keine Abhängigkeit** von externen Analytics-Produkten als Primär-UI
- Tracking muss **vorbereitet** sein (Schema, Adapter, Datenfluss), Ausbau-Tiefe iterativ über spätere Versionen
- Verknüpfung: Tracking-Daten hängen an Kampagne, Asset und (wo möglich) Lead — damit 3.3 Lead-Scoring und 3.5 Orchestration wirklich performance-basiert entscheiden können

**Wichtig — Abgrenzung:**
- IS postet **aus IS heraus** an Kanäle. Kein manuelles Cross-Posting-Tool.
- IS **konsumiert** Tracking-Rohdaten der Kanäle, ist **nicht** Ersatz für Google Analytics / Platform-Analytics — sondern die **konsolidierte Schicht darüber**.
- Physische Kanäle (Brief, Paket) aus 3.3 High-Attention Outreach laufen **nicht** über 3.6. Dort bleibt Versand offline.

---

## 4. Spezieller Kampagnentyp: High-Attention Outreach

Explizit als definierter Kampagnentyp innerhalb 3.3:

- stark personalisierte physische Mailings (z. B. Brief + Geldschein)
- gezielte Zustellung an Entscheider
- anschließendes telefonisches Follow-up

**Eigenschaften:** keine Skalierung über Masse, sehr selektive Zielgruppe, hohe Aufmerksamkeit, stark abhängig von Zielauswahl, Timing, Gesprächsqualität.

**Ziel:** Zugang zu Entscheidern, schnelle Qualifizierung von Interesse.

**Folge für IS (fixiert 2026-04-16):** Kampagnen-Datenmodell bildet digitale (E-Mail, LinkedIn, weitere) + physische Zustellwege (Brief, Paket) in einem Modell ab. Für physische Zustellung:
- IS **bereitet vor** (Adress-Liste, personalisierter Brief-Content, Kurier-/Post-Hinweis, Follow-up-Call-Zeitpunkt)
- IS **trackt nicht** die physische Zustellung selbst (keine Paket-Tracking-Adapter, kein Zustell-Status-Polling)
- Die physische Zustellung bleibt **offline**; IS erfasst nur „verschickt am X" als manuelles Status-Update und den nachgelagerten Follow-up-Call-Ausgang
- Kein Drittzusteller-API-Adapter in V1+ geplant

---

## 5. Abgleich Archiv ↔ heutiger Brief ↔ bestehender V1-Scope

| Funktionsbereich | Archiv V1 (gestrichen) | Brief 2026-04-16 | Aktuelle FEAT-001..007 |
|---|---|---|---|
| Learning & Pattern Intelligence | FEAT-002..006 (Insight Inbox + Analyzer + Clustering + Improvement + Opportunity) | 3.1 | FEAT-004, FEAT-005, FEAT-006 ✅ |
| Portfolio-/Kunden-Monitor | *(nicht im Archiv)* | implizit, Nebenrolle | FEAT-003, FEAT-007 ✅ (neu) |
| Ingest aus Onboarding/Business | *(nicht explizit)* | Voraussetzung | FEAT-001, FEAT-002 ✅ (neu) |
| Content & Asset Production | FEAT-007 (Content Transformer) | 3.2 | **FEHLT** ❌ |
| Brand & Output Control | FEAT-008 (Brand Control) | Teil von 3.2 | **FEHLT** ❌ |
| Experiment / Idea Testing | FEAT-011 (Experiment Manager) | 3.4 | **FEHLT** ❌ |
| Research & Market Prep | FEAT-012 (Research) | Teil von 3.4 | **FEHLT** ❌ |
| Campaign & Lead Intelligence | **war ausgeschlossen** (FEAT-012 Grenzlinie: "gehört zu System 3") | **3.3 (neu)** | **FEHLT** ❌ |
| High-Attention Outreach | *(nicht im Archiv)* | expliziter Kampagnentyp in 3.3 | **FEHLT** ❌ |
| Orchestration & Decision Layer | verteilt in FEAT-005 (Opportunity), FEAT-006 (Decision Board) | 3.5 (eigenständig) | teilweise in FEAT-005 🟡 |
| **Distribution / Publishing** | *(nicht im Archiv)* | **3.6a (neu, 2026-04-16)** | **FEHLT** ❌ |
| **Tracking / Performance-Cockpit** | *(nicht im Archiv)* | **3.6b (neu, 2026-04-16)** | **FEHLT** ❌ |
| Knowledge Packaging (API für SMAO) | FEAT-010 (Knowledge Packaging) | implizit (SMAO in v1 input) | **FEHLT** ❌ |
| Modules/Flows Build-Drafts | FEAT-009 | nicht explizit genannt | **FEHLT** 🟡 |

**Zusammenfassung:**
- **3 von 5 Funktionsbereichen** fehlen in aktuellem V1-Scope komplett (3.2, 3.3, 3.4)
- **1 Bereich** ist nur teilweise abgedeckt (3.5)
- **2 Bereiche** sind bereits gut verankert (3.1, + Ingest/Portfolio als Fundament)
- **1 Bereich** ist bewusst neu über Archiv hinaus (3.3 Campaign & Lead Intelligence)
- **1 Bereich** aus Archiv bleibt offen zu bewerten (FEAT-009 Modules/Flows Build-Drafts)

---

## 6. Verschobene Systemabgrenzung

Alte Grenzlinie (aus archiviertem FEAT-012):
> "Research Task = Was suche ich und warum? + Ergebnis dokumentiert. NICHT: Wen habe ich kontaktiert und wann — das gehört zu System 3."

Neue Grenzlinie ab Discovery V2:

### Onboarding-Plattform (System 1)
Wissen erfassen, strukturieren, validieren, verdichten. Alle Capture-Modi. Rohdaten bleiben hier.

### Intelligence Studio (System 3)
Wissen + Markt + Signale → **ICP, Segmente, Kampagnen-Design, Lead-Recherche, Enrichment, Lead-Scoring, Content-/Asset-Produktion, Hypothesen-Tests, Idea-Validation, Priorisierung und Entscheidungen**. Orchestriert den gesamten Pre-Sales- und Produktions-Zyklus.

### Business Development System (System 2)
**Fixiert 2026-04-16:** Reine Lead-Abarbeitungs-Plattform. Leads aus **beliebiger Quelle** kommen rein (IS-Kampagnen, SMAO-Voice-Partner, eingehende Anfragen, manuelle Ergänzungen) und werden dort abgearbeitet. Gespräche, Deals, Revenue-Abschluss, Verlust-/Einwandsignale zurückspielen — mehr nicht.

Business System ist **nicht**:
- Kampagnen-Designer
- Lead-Recherche-Tool
- Content-/Asset-Produktion
- Tracking-/Analytics-Cockpit

**Zwingend:** Keine Vermischung dieser Rollen. Insbesondere kein Kampagnen-Design im Business System, kein Deal-Management in IS, keine Publishing-/Tracking-Funktionen im Business System.

---

## 7. Daten- und Signalflüsse (erweitert)

Ergänzung zur PLATFORM.md:

| Fluss | Richtung | Inhalt | Status |
|---|---|---|---|
| 1 | Onboarding → IS | Knowledge Units (verdichtet) | bestehend (FEAT-001) |
| 3 | Business → IS | Gesprächssignale, Einwände, Verluste | bestehend (FEAT-002) |
| 3b | Business → IS | Kundenstamm + Projektstand | bestehend (FEAT-002/003) |
| 4 | IS → Onboarding | Fragenkataloge, Template-Updates | bestehend, Scope unklar |
| 5 | IS → Business | Angebots-/Vertriebsbausteine | bestehend, Scope unklar |
| **5b** | **IS → Business** | **Qualifizierte Leads + Kampagnen-Kontext** | **NEU (3.3)** |
| **6** | **Extern (Clay et al.) → IS** | **Enrichment-Daten, Firmensignale, Trigger** | **NEU (3.3)** |
| **7** | **IS → extern (SMAO, Partner)** | **Wissens-API aus KUs + Templates (Knowledge Packaging)** | bestehend, Scope unklar |
| **8** | **IS → Business** | **Content-/Asset-Pakete zur Nutzung im Vertrieb** | **NEU (3.2)** |
| **9** | **IS → externe Kanäle** | **Publishing (LinkedIn, Social, E-Mail, ggf. Paid)** | **NEU (3.6a)** |
| **10** | **externe Kanäle → IS** | **Tracking-Rohdaten (Impressions, Clicks, Engagement, Conversions)** | **NEU (3.6b)** |
| **11** | **SMAO-Voice → Business** | **Qualifizierte Lead-Rückflüsse aus Voice-Abschlüssen** | bestehend |

OQ-02 (Business-Ingest-Datenschnitt) aus V1 bleibt offen und wird in Discovery V2 geschärft — jetzt zusätzlich mit der Frage, wie Leads **rückwärts** sauber in Business landen (Fluss 5b).

---

## 8. Einordnung externer Tools

- **Clay** (und vergleichbare Enrichment-Tools): Daten-/Enrichment-Layer. **Nicht Kernsystem.** IS konsumiert Clay-Daten, IS ist nicht Clay-Ersatz. Adapter-Pattern pflicht.
- **SMAO** (Voice-Partner): bleibt wie in v1 definiert. IS liefert Wissens-API aus verdichteten KUs + Templates. Lead-Rückfluss von SMAO → Business.
- **Enterprise-RAG** (Glean, Kontexta, Sinequa, ZYON): bleibt Vermittlungs-Layer.
- **LLM**: Bedrock eu-central-1 (DEC-002 verbindlich).
- **Physische Zustellung** (Brief, Paket für 3.4 High-Attention Outreach): **offline**, kein Adapter, kein Tracking. IS bereitet nur Content + Adress-Liste + Versand-Hinweis vor.
- **Publishing-Kanäle** (LinkedIn, weitere Social-/Content-Plattformen, E-Mail, ggf. Paid): jeder Kanal über eigenen Adapter. Auswahl und V1-Scope offen.
- **Tracking / Platform-Analytics**: native Analytics der Kanäle werden **nicht als UI** genutzt. IS zieht deren Rohdaten (via APIs, wo verfügbar) und baut ein eigenes konsolidiertes Performance-Cockpit. Keine Abhängigkeit von Google Analytics oder Single-Platform-Dashboards als Primäransicht.

---

## 9. Erwartetes Ergebnis Discovery V2

1. **Präzise, aktualisierte Gesamtrolle** des IS (Intelligence + Produktion + Go-To-Market-Steuerung)
2. **Saubere interne Modulstruktur** entlang der 5 Funktionsbereiche (3.1–3.5)
3. **Klare Kernobjekte:** ICP, Segment, Kampagne, Hypothese, Testcase, Asset, Brand-Profil, Content-Request, Lead, Deployment, Opportunity, Decision
4. **Definierte Outputs und Artefakte** pro Modul
5. **Klare Entscheidungslogiken:** testen / verwerfen / skalieren / weiterentwickeln
6. **Saubere Daten- und Signalflüsse** inkl. neuer Flüsse 5b, 6, 8
7. **Einordnung externer Tools** (Clay, SMAO, Drittzusteller) als Adapter-Layer
8. **Schärfere Abgrenzung zu Onboarding und Business** mit der verschobenen Grenzlinie
9. **Einschätzung pro Modul:** rein intern / template-fähig / später produktisierbar

---

## 10. Offene Fragen für /discovery V2

Neu / geschärft gegenüber v1 (Stand 2026-04-16):

- **V1-Scope vs. später:** *entschärft* durch Gründer-Festlegung — IS wird komplett in einem Rutsch gebaut (Reihenfolge optimieren, aber keine Funktionsbereich-Amputation). Reihenfolgen-Frage bleibt relevant, Scope-Ausschluss-Frage nicht mehr.
- **Knowledge Packaging (API für SMAO/Partner):** IS oder Onboarding? (alte OQ aus v1, jetzt relevanter)
- **Campaign-Objekt-Modell:** wie werden digitale + physische Kampagnen in **einem** Modell sauber abgebildet, ohne zwei getrennte Silos zu bauen? Zusätzlich: wie greift das Campaign-Modell ins Publishing-Modell (3.6a)?
- **Lead-Übergabe-Mechanik:** welche Felder + welchen Kampagnen-Kontext übergibt IS an Business beim Fluss 5b? Mapping auf Business-Contact/Deal?
- **Clay-Adapter:** wie tief integrieren wir Clay? Webhook + Pull? Nur CSV-Import? Zusammenspiel mit 3.6b Tracking-Adaptern (eigener Adapter-Pattern-Standard)?
- **Brand Guidelines als Kontext:** wie wird das Brand-Profil strukturiert, damit Content-Generierung deterministisch mit Markenstimme arbeitet?
- **Idea-Testing → Kampagne → Business-Lead:** ist das ein einziger Workflow (Experiment führt zu Kampagne führt zu Lead) oder getrennt?
- **Orchestration-Layer:** eigenständiges Modul mit eigenem UI (Decision Board) oder durchgängiges Prinzip ohne eigene Oberfläche?
- **Priorisierungs-Logik:** manuell / regelbasiert / KI-gestützt? Scoring-Mechanik?
- **Multi-Instanz für Kunden:** bleiben alle 6 Bereiche bei einer Kunden-Einsetzbarkeit erhalten, oder werden 3.3/3.4/3.6 rein intern?
- **Publishing-Kanäle (3.6a) Start-Set:** welche Kanäle sind der erste sinnvolle Wurf? LinkedIn + E-Mail als Minimum? Wie generisch ist der Adapter-Pattern?
- **Tracking (3.6b) Datenmodell:** einheitliches Event-Schema über alle Kanäle, oder Kanal-spezifisch? Wie tief ist Attribution (Kampagne → Asset → Lead → Deal) sinnvoll abbildbar?
- **Scheduling / Queue / Fehler-Retry** für Publishing: eigener Worker oder bestehende Infrastruktur (Onboarding-Worker-Muster)?

---

## 11. Vorgehen nach Discovery V2

1. `/discovery` V2 läuft gegen diesen Input + `discovery-input.md` + PLATFORM.md + data-residency.md.
2. Ergebnis: RPT-003 (Discovery V2 Report) + aktualisierte `/docs/PRD.md`.
3. Anschließend `/requirements` V2 — integriert bestehende FEAT-001..007 und ergänzt um neue Features für Modul 3.2, 3.3, 3.4, 3.5, 3.6.
4. Archivierte Feature-Specs (FEAT-007 Content Transformer, FEAT-008 Brand Control, FEAT-011 Experiment, FEAT-012 Research) werden als Referenz gelesen, nicht 1:1 übernommen — Scope und Grenzen haben sich verändert.

---

## 12. Fixpunkte Gründer 2026-04-16 (verbindlich für /discovery)

Folgendes ist nach der Rückmeldung des Gründers am 2026-04-16 **fixiert** und steht in `/discovery` nicht mehr zur Debatte:

1. **Grenzlinien-Verschiebung IS ↔ Business ist gewollt und vollständig.**
   - IS übernimmt alles Vorgelagerte: ICP, Segmentierung, Lead-Recherche, Enrichment, Lead-Scoring, Kampagnen-Design, Kampagnen-Orchestrierung, Publishing, Performance-Tracking.
   - Business = reine Lead-Abarbeitungs-Plattform. Leads aus jeder Quelle rein, dort abarbeiten. Nichts darüber hinaus.

2. **High-Attention Outreach: Vorbereitung ja, Tracking nein.**
   - IS bereitet Brief-Content, Adress-Listen, Follow-up-Call-Zeitpunkte vor.
   - Physische Zustellung bleibt offline. Kein Paket-Tracking, kein Drittzusteller-API-Adapter.
   - IS erfasst nur manuellen Status „verschickt am X" + Follow-up-Call-Ergebnis.

3. **V1-Scope-Diskussion zurückgestellt.**
   - Die Software wird so lange gebaut, bis alle relevanten Funktionsbereiche operativ sind.
   - `/discovery` und `/requirements` schneiden daher **nicht entlang V1-Amputationen**, sondern entlang **sinnvoller Bau-Reihenfolge**.
   - Versions-Nummerierung (V1/V2/V3) dient der Reihenfolge, nicht dem Scope-Cut.

4. **Archiv-Rückholung ist vollständig akzeptiert.**
   - Alle im Archiv steckenden Funktionsbereiche (Content, Brand, Experiment, Research) fließen zurück.
   - Einzelne archivierte Feature-Specs dienen als Referenz, nicht als Copy-Paste-Vorlage.
   - FEAT-001..FEAT-007 bleiben als Fundament erhalten, nichts wird gestrichen.

5. **Publishing + Tracking ist Pflichtbestandteil (3.6).**
   - IS postet aus sich heraus an ausgewählte Kanäle (LinkedIn + weitere tbd).
   - IS holt Tracking-Rohdaten der Kanäle zurück.
   - IS baut ein **einziges konsolidiertes Performance-Cockpit** — keine Abhängigkeit von 5 oder 6 externen Analytics-Konsolen.
   - Mindestanforderung: Schema + Adapter-Struktur **vorbereitet**, Ausbau-Tiefe iterativ.

6. **Nicht weiter zu debattieren in /discovery:**
   - ob Business Kampagnen-Funktionen bekommt (nein)
   - ob physische Zustellung im IS getrackt wird (nein)
   - ob Content-/Brand-/Experiment-Schichten überhaupt ins IS gehören (ja, fixiert)
   - ob Publishing-/Tracking-Layer kommt (ja, fixiert)

`/discovery` konzentriert sich auf: **Modulstruktur, Objekte, Flüsse, Entscheidungslogiken, Abgrenzungen, Reihenfolge** — nicht auf Scope-Grundsatzfragen.
