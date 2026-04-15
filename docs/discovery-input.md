# Discovery Input — Re-Discovery 2026-04-15

Dieses Dokument sammelt die beim Re-Discovery-Start vorgegebenen Richtungsideen, Positionierungen und Non-Goals. `/discovery` muss diesen Input als Kontext einlesen, bevor die offene Fragerunde beginnt.

## 1. Systemische Rolle

- Intelligence Studio = **System 3** der StrategAIze-Gesamtarchitektur.
- Referenz: `/strategaize-dev-system/docs/PLATFORM.md` (Abschnitte 3, 10, 11, 13, 15).
- Position: interne Intelligence-, IP-, Opportunity- und Produktionsschicht — plus zusätzliche Produkt- und Monitor-Rolle (siehe Punkt 3).

## 2. Zielmarkt und Abgrenzung

- **Deutscher Mittelstand (KMU), Umsatzband ca. 2–5 Mio. €.**
- **Nicht Enterprise.** Wir treten nicht gegen Glean, Guru, Sinequa, Kontexta, ZYON oder vergleichbare Enterprise-RAG-Plattformen an.
- Fokus bleibt: Wissen aus KMU heben, verdichten, für Beratungs- und Produktzwecke nutzen.

## 3. Zusätzliche Produkt- und Einsatzrollen (Idee 1)

### 3a. IS als template-fähiges Produkt (wie Onboarding-Plattform)
- IS soll von Anfang an so gebaut werden, dass es **später in Kundenunternehmen einsetzbar** ist — in angepasster, reduzierter Form.
- Template-Logik entscheidet, welche IS-Module in einer Kunden-Instanz aktiv sind.
- Input für jede Instanz: **ausschließlich verdichtetes Wissen**, keine Rohdaten. Bewusste Abgrenzung zur Onboarding-Plattform, die die Roh- und Verdichtungs-Pipeline abdeckt.
- Architektur muss Multi-Instanz-Fähigkeit und Template-Varianten von Grund auf vorsehen.

### 3b. IS als interner Kunden-/Portfolio-Monitor
- IS wird gleichzeitig internes Werkzeug, um **alle aktiven Kundenprojekte zu überblicken**.
- Datenfluss-Ergänzung: **Business System → Intelligence Studio** (nicht nur Business → Onboarding).
  - Kundenstammdaten (Kontakt, Unternehmen)
  - Projektstand (was wurde gekauft, welche Module/Systeme sind im Einsatz, welcher Stand)
  - Relevante Vertragssignale
- Abstrahierte Learnings aus jedem Kundenprojekt fließen hier als interner IP-Speicher zusammen — **ohne Kundennamen, ohne projektspezifische Details** (Anonymisierungs-Layer nötig).
- Zwecke:
  - Pflege- und Support-Übersicht (welcher Kunde, welcher Codestand, welche Module)
  - Modul- und Produktverbesserung aus realen Einsatzerfahrungen
  - Cross-Kunden-Hilfe („an anderer Stelle haben wir X gemacht, das könnte hier helfen")
  - Ableitung neuer Geschäftsideen
- Diese Rolle ergänzt Fluss 11 der PLATFORM.md um einen **Fluss 3b: Business → Intelligence (Kundenstamm + Projektzustand)**.

## 4. Non-Goals für das Intelligence Studio

- **Kein eigener RAG-Chat-Layer über Kundenrohdaten.** Wissens-Chat-Plattformen sind Markt von Glean/Kontexta/ZYON — dort treten wir nicht an. (Idee 3 aus Re-Discovery explizit verworfen.)
- **Keine eigene Voice-Oberfläche.** 24/7-Voice-Assistenz läuft über White-Label-Partner.
- **Keine eigenen Fremdsystem-Konnektoren** (Outlook, Gmail, Drive, Sharepoint, Datev, Lexware usw.). Bei Kundenbedarf Vermittlung an Partner.
- **Keine Rohdatenverarbeitung im IS selbst.** Rohdaten bleiben in Onboarding-Plattform (Capture-Modi A–F inkl. Evidence-Bulk, siehe Punkt 5). IS konsumiert ausschließlich verdichtete Knowledge Units.

## 5. Relevante Inputs aus den Nachbarsystemen

### Von Onboarding-Plattform (Fluss 1)
- Verdichtete Knowledge Units aus allen Capture-Modi
- **Evidence-Bulk-Outputs** (neues Onboarding-V2-Feature, BL-020): aus E-Mail-Archiven, Angebots-Historien und Dokumentenbeständen extrahierte KUs. Schneller Initial-Wissens-Boost für jeden Kunden.
- Sessions, Validierungs-Status, Lücken, Muster

### Von Business Development System (Flüsse 3 + neu 3b)
- **Fluss 3 (bestehend):** Einwände, Verlustmuster, Gesprächssignale, Marktbeobachtungen
- **Fluss 3b (neu):** Kundenstammdaten + Projektzustand (siehe 3b)

## 6. Partner-Integrationen (Idee 4)

### SMAO (oder vergleichbarer White-Label-Voice-Partner)
- Annahme: kein Eigenbau. SMAO-Partnerschaft bleibt als Plan bestehen.
- Integration: StrategAIze liefert Wissens-API aus verdichteten KUs + Templates. SMAO betreibt Voice-Frontend.
- Lead-Rückfluss: qualifizierte Leads und Gesprächssignale aus SMAO → **Business Development System** als neue Lead-Quelle.
- IS-Scope-Frage für Discovery: muss die Wissens-API im IS, in Onboarding oder als separater Layer liegen?

### Enterprise-RAG / Suche
- Vermittlung an Glean, Kontexta, Sinequa, ZYON bei Kundenbedarf.
- IS stellt exportierbare, validierte Wissensbasis bereit (DSGVO-konform, versioniert).

## 7. Verbindliche Tech- und Hosting-Vorgaben

- LLM: **AWS Bedrock eu-central-1** (Claude Sonnet/Opus).
- Speech (falls benötigt — eher unwahrscheinlich, da SMAO): **Azure Speech EU** oder self-hosted Whisper, niemals OpenAI-API direkt.
- Hosting ausschließlich EU, bevorzugt Deutschland.
- Provider-Adapter-Pattern Pflicht.
- Referenz: `/strategaize-dev-system/.claude/rules/data-residency.md`.

## 8. Offene Fragen für /discovery

- Wie wird die Multi-Instanz-/Template-Fähigkeit technisch umgesetzt? Eine IS-Codebasis mit Template-Flag, oder schlanker Kern + Plug-in-Pattern?
- Welche Module sind in der externen (Kunden-)Variante aktiv, welche nur intern?
- Wie genau sieht der Anonymisierungs-Layer für Cross-Kunden-Learnings aus (automatisch via KI-Redaction, manuell, Mischform)?
- Welche konkreten Business-System-Entitäten werden gespiegelt (Kontakt, Deal, Angebot, Projekt, Modul-Einsatz)? Push, Pull, oder Read-Replica?
- Welche Deployment-Form passt? Lokal-only (wie alte V1-Planung) widerspricht dem Multi-Instanz-Gedanken — Hetzner + Supabase wie Onboarding ist wahrscheinlich.
- Welche Wissens-API-Form soll SMAO (und künftige Voice-Partner) konsumieren? REST, GraphQL, Export-Datei?
- V1-Scope: wo ziehen wir die Linie, damit wir nicht wieder bei 14 Slices landen? Kandidaten für V1-Kern: Portfolio-Monitor, verdichtete-KU-Ingest aus Onboarding, Opportunity-/Entscheidungs-Layer. Kandidaten für spätere Versionen: Content-Transformer, Experiment-Manager, Research-Prep.

## 9. Historischer Kontext

- Vorherige V1-Planung (RPT-001..009, 12 Features, 14 Slices) archiviert unter `/reports/archive/v1-planning/`, `/features/archive/v1-original/`, `/slices/archive/v1-original/`, `/docs/archive/`, `/planning/archive/`.
- Gründe für Reset: Systemrolle (War „System 4", ist jetzt System 3), LLM-Wechsel auf Bedrock, fehlende Input-Quellen-Definition, kollidierende Lokal-first-Entscheidung, zu breit geschnittener V1-Scope.
- Nicht alles ist verloren: Einzelne Features der alten Planung (Opportunity & Venture Evaluation, Decision & Trigger Board, Knowledge Packaging) bleiben als konzeptuelle Kandidaten für das neue Discovery relevant — aber mit anderem Input-Fundament (KU-basierte Ingest statt manuelle Inbox).
