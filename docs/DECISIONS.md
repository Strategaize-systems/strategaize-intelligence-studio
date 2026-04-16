# Decisions

## Hinweis
Alle vorherigen DECs (DEC-001 bis DEC-009 + Tradeoffs) sind durch das Re-Discovery vom 2026-04-15 aufgehoben.
Archiv: `/docs/archive/DECISIONS-v1-original.md` — nur als Referenz, nicht mehr gültig.

Neue DECs werden ab `DEC-001` wieder frisch nummeriert und in `/discovery`, `/requirements` und `/architecture` gesetzt.

## DEC-001 — Re-Discovery auf Basis der aktualisierten Gesamtarchitektur
- Status: accepted
- Reason: Mit der Strategieentscheidung zur Onboarding-Plattform (2026-04-14) und dem Gesamtarchitektur-Dokument (2026-04-15) hat sich die Rolle des Intelligence Studios grundlegend verändert (System 3 statt System 4, Inputs aus konkreten Fremdsystemen statt manueller Insight Inbox, neue Rückfluss-Ziele). Die alte V1-Planung (12 Features, 14 Slices, 77 Micro-Tasks, 17 Tabellen) würde bei Umsetzung Doppelarbeit mit der Onboarding-Verdichtung erzeugen und kollidiert mit der neuen verbindlichen LLM-Provider-Wahl.
- Consequence: Gesamte V1-Planung archiviert. Projekt startet neu bei Discovery. Alte Reports, Features, Slices, DECs, Roadmap, Backlog nur noch als Archiv-Referenz.

## DEC-002 — LLM-Provider ist AWS Bedrock eu-central-1 (Frankfurt)
- Status: accepted
- Reason: Verbindliche Regel aus `/strategaize-dev-system/.claude/rules/data-residency.md`. Beste technische Qualität + DSGVO-belastbar + EU-gehostet. Alle anderen aktiven Systeme (Onboarding, Business, Blueprint) nutzen bereits Bedrock Frankfurt — Intelligence Studio reiht sich ein. Claude Code CLI/Max-Subscription bleibt für Dev-Workflow, nicht für Laufzeit-/Analyse-Pfad. Die API-Kosten pro Analyse sind bewusst akzeptiert gegen den Gewinn aus State-of-the-Art-Qualität und Infrastruktur-Vermeidung.
- Consequence: Alle KI-Aufrufe in IS laufen zur Laufzeit über AWS Bedrock Frankfurt. Kein Ollama, kein lokales LLM, keine direkte Anthropic-API. Provider-Adapter-Pattern ist Pflicht (Austauschbarkeit).

## DEC-003 — Hosting-Region: ausschließlich EU, bevorzugt Deutschland
- Status: accepted
- Reason: Übergreifender StrategAIze-Grundsatz (Data-Residency-Rule). Unternehmenswissen aus Kundenprojekten darf nicht in Drittländer mit unzureichendem Datenschutzniveau übertragen werden. Gilt für LLMs, Speech-APIs, Embeddings, sonstige KI-Dienste. USA-Direktanbieter (OpenAI-API, Anthropic-API, Pinecone-US etc.) sind ausgeschlossen.
- Consequence: Jede neue API-Abhängigkeit wird gegen diese Regel geprüft. Keine Integration ohne nachweisbaren EU-Endpoint + DPA. Audit-Log pro externer Call mit Anbieter/Region/Modell-ID.

## DEC-004 — Campaign-Modell = Parent-Campaign + Channel-Segmente + Varianten
- Status: accepted
- Reason: Gründer-Entscheidung 2026-04-16 zu OQ-V2-01. Multi-Channel-Kampagnen (digital + physisch) werden in einem gemeinsamen Modell mit Parent-Campaign und hierarchischen Channel-Segmenten abgebildet, plus Variant-Ebene für A/B-Testing-Vorbereitung. Alternative "flache Kampagne = ein Kanal" wurde verworfen, weil sie natürlichen Kampagnen-Gedanken bricht und Reporting/Attribution komplex macht. Alternative "komplett flexibler Graph" wurde als Overkill verworfen.
- Consequence: Datenmodell V3 (FEAT-011) hat drei Tabellen: `campaign` → `channel_segment` (n:1) → `campaign_variant` (n:1). Audience-Split pro Channel-Segment muss auf 100% summieren. A/B-Testing operativ nutzbar erst V5 (Tracking nötig). Physische Zustellung bleibt offline, IS bereitet nur vor.

## DEC-005 — Lead-Handoff IS → Business = Qualified-Lead-Inbox im Business
- Status: accepted
- Reason: Gründer-Entscheidung 2026-04-16 zu OQ-V2-02. IS ist Pre-Sales-Schicht, Business = reine Lead-Abarbeitungs-Plattform. Qualifizierte Leads dürfen nicht direkt als Kontakt+Deal in Business landen, weil das die Pipeline verzerrt. Stattdessen: neue Entität `QualifiedLead` im Business als Eingangstopf, Berater entscheidet manuell über Umwandlung in Kontakt/Deal oder Verwerfen. Option "IS behält Leads, Business zieht sie" wurde wegen dauerhafter Laufzeit-Abhängigkeit verworfen.
- Consequence: FEAT-014 Qualified Lead Handoff erzeugt Handoff-Events und pusht sie via API an Business Qualified-Lead-Inbox (sobald vorhanden). **Kritische Abhängigkeit:** Business V4.x/V5 muss Qualified-Lead-Inbox-Entität als neues Feature bauen (ISSUE-001). Bis dahin CSV-Export als Übergangslösung.

## DEC-006 — Brand-Profil = Singleton (ein StrategAIze-Eigen), Multi-Brand = V8+
- Status: accepted
- Reason: Gründer-Entscheidung 2026-04-16 zu OQ-V2-03. V2 hat genau ein Brand-Profil (StrategAIze-Eigen) mit strukturierten Feldern (Tonalität, Do's, Don'ts, Struktur-Templates pro Output-Typ, 3–5 Beispiel-Assets als few-shot). Für spätere Kunden-Instanzen gilt "Powered by StrategAIze"-Footer als Default ok. Volles Custom-Brand-Profil pro Kunde erst V8+, wenn echter Marktbedarf und Pricing-Rechtfertigung. Minimale Variante (reiner Freitext) wurde verworfen, weil KI-Output-Konsistenz dann zu niedrig wäre. Vollumfängliches Brand-System (Logo-Regeln, Layoutgrid, Voice-Samples) wurde als Overkill verworfen.
- Consequence: FEAT-008 Brand Profile ist Singleton-Table mit `template_id`-Feld (NULL in V2, für V8+ vorbereitet). Schema template-ready, aber V2 aktiviert keine Multi-Tenant-Logik. 3–5 Beispiel-Assets sind Pflichtfelder.

## DEC-007 — Orchestration & Decision Layer = Hybrid (Priority-Felder + leichtgewichtiges Top-5-Dashboard)
- Status: accepted
- Reason: Gründer-Entscheidung 2026-04-16 zu OQ-V2-04. V7 Orchestration ist eine Meta-Schicht. Option "eigenes Strategic Cockpit" mit KI-Ranking wurde zurückgestellt — wäre ohne ausreichend gefüllte Module darunter leer. Option "nur Priority-Felder in bestehenden Listen" wäre zu dünn, weil keine cross-Entity-Sicht. Hybrid: Priorisierung lebt primär in Listen (Priority-Feld + Sortierbarkeit), plus zusätzlich ein leichtgewichtiges Dashboard „Was ist wichtig?" mit Top-5 pro Entity-Typ (Opportunity, Kampagne, Experiment). KI-Auto-Priorisierung = V8+.
- Consequence: FEAT V7 Orchestration bleibt überschaubar bauarbeitsmäßig. Manuelle Flags + Sortierung in V7, KI-Scoring über alle Entity-Typen hinweg erst V8+. Learning-Rückflüsse an Onboarding (Fragenkataloge) und Business (Argumente) werden in V7 mitkonzipiert.
