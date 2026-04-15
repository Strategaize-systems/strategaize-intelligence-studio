# Product Requirements Document

## Purpose
StrategAIze Intelligence Studio — System 3 der Gesamtarchitektur. Interne Intelligence-, IP-, Opportunity- und Produktionsschicht. Sammelt verdichtetes Wissen aus Onboarding-Plattform (System 1) und Business Development System (System 2), übersetzt es in Portfolio-Übersicht, strukturierte Bewertungen und Entscheidungen und speichert Cross-Kunden-Learnings für interne IP-Entwicklung. Wissen und Fremdsystem-Zugriff enden nach der Verdichtung — keine eigene RAG-/Chat-/Voice-Plattform.

## Vision
Ein zentrales, template-fähig konzipiertes System, das verdichtetes Wissen aus allen aktiven Kundenprojekten systematisch sichtbar macht, in strukturierte Entscheidungen übersetzt und als Grundlage für Produktweiterentwicklung und kontrollierte Partner-Integrationen dient.

## Target Users

### V1 (primär intern)
- **Gründer / Strategischer Eigentümer** — Portfolio-Überblick, Opportunity-Bewertung, strategische Entscheidungen, Cross-Kunden-Learnings
- **Beratungs-/Delivery-Team (intern, klein)** — Kundenmonitor, Deployment-Stand pro Kunde, Support-Kontext, Learning-Erfassung aus Delivery

### Spätere Versionen
- V3: externe Kundenunternehmen als Plattform-Nutzer (Template-Modus)
- V2/V3: Voice-Partner (SMAO-ähnlich) als API-Konsument

## Problem Statement
Wissen und operative Information entstehen verteilt über alle aktiven Systeme und Kundenprojekte, aber:
1. Es gibt keinen zentralen Ort, an dem verdichtete Erkenntnisse aus Onboarding-Projekten zusammenlaufen
2. Das Kundenportfolio (welcher Kunde, welcher Stack, welche Version, welche Module) ist nicht systematisch erfasst — Support und Update-Rollout sind ad hoc
3. Opportunities und Produktentscheidungen werden informell getroffen, nicht strukturiert bewertet und nicht nachvollziehbar dokumentiert
4. Cross-Kunden-Learnings bleiben im Kopf und sind für spätere Projekte oder Produktverbesserungen nicht abgreifbar
5. Die Grundlage für kontrollierte Partner-Integrationen (z. B. Voice via SMAO) fehlt

## Goal / Intended Outcome
Ein operatives Intelligence Studio, in dem:
- verdichtete Knowledge Units aus Onboarding und relevante Signale aus Business automatisch auflaufen
- ein Portfolio-Monitor pro Kunde Deployment-Typ, Stack, Version und Modul-Einsatz zeigt
- Opportunities entlang fester Dimensionen strukturiert bewertet und Entscheidungen nachvollziehbar getroffen werden
- anonymisierte Cross-Kunden-Learnings als interne IP verfügbar sind
- Updates und Support auf Basis strukturierter Daten geplant werden können

## V1 Scope

### Core Features
- **FEAT-001 Ingest-Layer Onboarding** — Pull-basierter Import verdichteter Knowledge Units aus Onboarding-Plattform
- **FEAT-002 Ingest-Layer Business** — Pull-basierter Import relevanter Entitäten aus Business Development System, fehlertolerant gegen fehlende Felder
- **FEAT-003 Portfolio-Monitor** — UI-Überblick aller Kundenprojekte mit Filter, Suche, Detail-Ansicht
- **FEAT-004 Insight-Layer** — KU-Liste mit Volltext-Suche, Tag-System, manuellem Clustering
- **FEAT-005 Opportunity & Decision basic** — strukturierte Bewertung (4 Pflicht-, 7 optionale Dimensionen) mit KI-Unterstützung, Decision-Board mit Status-Workflow
- **FEAT-006 Cross-Kunden-Learnings basic** — manuelle Freigabe-Markierung und Anonymisierung pro KU, interne Cross-Kunden-Ansicht
- **FEAT-007 Customer Deployment Registry** — Deployment-Typ, Server-Referenzen, aktive Module, Code-Version, Update-Rollout-Ansicht (IS-eigen, weil Business kein Deployment-Modell hat)

Feature-Details unter `/features/`.

## Success Criteria V1
- Verdichtete Knowledge Units aus Onboarding-Plattform werden automatisch im IS sichtbar und durchsuchbar
- Das Kundenportfolio ist zentral einsehbar mit mindestens Kontakt, Unternehmen, Deployment-Typ, Stack, Code-Version
- Opportunities lassen sich in unter 2 Minuten erfassen (4 Pflicht-Dimensionen) und mit KI-Unterstützung bewerten
- Mindestens 10 anonymisierte Learnings sind cross-Kunde intern zugänglich
- Update-Rollout kann auf Basis der Customer Deployment Registry geplant werden („welche Kunden laufen auf Version X?")
- IS läuft stabil auf Hetzner über Coolify, ohne US-Datenfluss

## Out of Scope (V1)

### Hart Non-Goal (PLATFORM.md 4b)
- Eigener RAG-Chat-Layer oder Wissens-Plattform über Kundenrohdaten
- Fremdsystem-Konnektoren (Outlook, Gmail, Drive, Sharepoint, Datev, Lexware)
- Eigene Voice-Oberfläche
- Rohdatenverarbeitung (Rohdaten bleiben in Onboarding)

### V2+
- Template-Produkt-Modus für externe Kundeneinsätze (V3)
- SMAO-Partner-API mit Auth + Rate-Limiting (V3); nur JSON-Export ab V2
- KI-Auto-Clustering und Pattern-Erkennung (V2)
- Auto-Anonymisierung via Bedrock (V2)
- Automatische Rückspielung von Improvements in Onboarding/Business (V2)
- Content-Transformer, Brand-Control, Experiment-Manager, Knowledge-Packaging-Engine, Research & Market Prep (V2/V3)

### Parked
- Modules/Flows/Build-Drafts (13 Draft-Typen aus alter V1-Planung) — neu denken nach V2-Erfahrung
- Process-Mining-Connector, Branchen-Layer, Anomalie-Flagging (V4+)

## Constraints

### Technical
- Hetzner + Supabase + Docker-Compose via Coolify (analog Onboarding-Plattform)
- Next.js 16+ mit App Router, React 19, Tailwind, shadcn/ui
- AWS Bedrock eu-central-1 als einziger LLM (Claude Sonnet/Opus), Provider-Adapter-Pattern verbindlich
- Kein Remote-Git-Repo vorhanden — für V1-Deploy ist GitHub-Repo + Coolify-Setup Teil des Project-Setup-Slices

### Data Residency (verbindlich)
- EU-Hosting, bevorzugt Deutschland
- Keine US-Direktanbieter, keine US-Regionen — auch nicht temporär
- Referenz: `/strategaize-dev-system/.claude/rules/data-residency.md`

### Business-System-Constraint
Business V4 hat heute: Kontakte, Unternehmen, Deals, Angebote (teilweise).
Business V4 hat heute **nicht**: Produkt-/Angebotskatalog, Modul-/Stack-Zuordnung, Projekt-Status als eigenes Modell.

Konsequenz:
- Ingest-Layer V1 muss fehlertolerant gebaut werden: was existiert wird ingestet, was fehlt wird leer gelassen und kommt später automatisch mit, sobald Business das liefert
- FEAT-007 Customer Deployment Registry wird **IS-seitig primäre Wahrheit** — nicht abhängig vom Business-Produkt-Modell
- Bei zukünftigen Business-Erweiterungen (Produkte, Module, Projekte) Anpassung der Ingest-Map erforderlich, aber keine Breaking Changes

### Scope-Protection
- Schema V1 muss template-ready sein: optionale `template_id`-Felder und Feature-Flags pro Modul vorsehen
- Template-Modus selbst wird erst V3 aktiviert — V1 fällt keine Multi-Instanz-Komplexität an

## Risks / Assumptions

### Risks
- **R-01: Business V4/V4.1 Erweiterungen.** Neue Entitäten (Produkte, Projekte, Module) werden Ingest-Anpassungen in IS V1.x erfordern. Akzeptiert, fehlertoleranter Ingest adressiert das.
- **R-02: Onboarding-Export-Abhängigkeit.** Ingest V1 hängt von Onboarding SLC-010 (JSON-Export-API) ab. Ohne diese Export-API kann FEAT-001 nicht getestet werden.
- **R-03: Scope-Kreep.** Bei aktiver Ideenfindung besteht Risiko, dass V2/V3-Features in V1 gezogen werden. Mitigation: Non-Goals hart im PRD verankert.
- **R-04: Sensitive Daten in FEAT-007.** Deployment-Registry enthält Server-Referenzen. Regel: nur Metadaten (Host, Hoster, Zugangs-Methode-Referenz) — Secrets bleiben im Passwort-Manager.

### Assumptions
- Onboarding-Plattform stellt stabile Export-API bereit (SLC-010, V1-Abschluss)
- Business V4 bietet REST-Zugang zu Kontakten, Unternehmen, Deals, Angeboten
- Primärnutzer V1: Gründer + 1–2 Berater (keine Skalierungs-/Multi-Tenant-Anforderungen in V1)
- Deployment erfolgt analog Onboarding: Coolify + Docker-Compose + Supabase + Bedrock-Adapter
- Bedrock-Call-Kosten für Opportunity-Bewertung sind akzeptabel (wenige Calls pro Tag)

## Open Questions
- **OQ-01:** Zeitpunkt Onboarding-SLC-010 (Export-API) — Voraussetzung für Ingest-Test
- **OQ-02:** Genauer Datenschnitt Business-Ingest V1: welche Deal-States (alle oder nur gewonnen/aktiv)? Welche Angebote (akzeptiert only oder auch offen)? Klärung in `/architecture`
- **OQ-03:** Einheitliches GitHub-Repo für IS einrichten — Empfehlung ja, damit Coolify-Auto-Deploy möglich
- **OQ-04:** Pre-Sale-Ideen aus Business-Roadmap (kostenlose Fragebögen als Lead-Magnet) — kein V1-IS-Scope, aber bei späterer Umsetzung ggf. als Quelle für Business-Ingest relevant

## Delivery Mode
**`internal-tool`**

Begründung: V1 wird primär intern genutzt (Gründer + kleines Team, keine Multi-Tenant-Anforderungen). Deployment ist zwar cloud-fähig (Hetzner + Supabase), aber V1 ist kein SaaS-Produkt. Template-Modus für externe Kundeneinsätze kommt V3 — dann kann sich der Delivery Mode auf `client-app` oder `SaaS` erweitern.

## Referenzen
- Gesamtarchitektur: `/strategaize-dev-system/docs/PLATFORM.md`
- Data Residency: `/strategaize-dev-system/.claude/rules/data-residency.md`
- Discovery: `/reports/RPT-001.md`
- Richtungsvorgaben: `/docs/discovery-input.md`
