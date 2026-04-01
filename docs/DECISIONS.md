# Decisions

## DEC-001 — Lokale Architektur statt Web-first
- Status: accepted
- Reason: IP-Schutz, maximale Flexibilität, keine API-Kosten, schnelle Iteration, sensible Querverwertung, Experimentierfreiheit, hohe Änderbarkeit. Primärnutzer ist der Gründer selbst.
- Consequence: System wird lokal-first gebaut. Keine Multiuser-Web-Oberfläche in V1. Spätere interne UI möglich, aber nicht als Webprodukt gedacht.

## DEC-002 — Hybrid UI-Modus: Skills/Agents + lokale Web-UI
- Status: accepted
- Reason: Core-Workflows (Analyse, Transformation, Packaging) laufen über Claude Code Skills/Agents. Für Katalog-Browsing, Inbox-Übersicht und Decision Board wird eine lokale Web-UI benötigt, um Bequemlichkeit und Übersichtlichkeit zu gewährleisten.
- Consequence: Next.js lokale App für UI-Layer. Claude Code Agent Tool für Verarbeitungslogik. Kein öffentliches Web-Deployment.

## DEC-003 — SQLite als Datenhaltung
- Status: accepted
- Reason: Genug Struktur für Katalog, Suche und Relationen. Kein Server-Overhead. Lokal-first. Einfach zu sichern (eine Datei). Skaliert problemlos für Single-User mit tausenden Einträgen über Jahre. Kein Grund für schwerere Infrastruktur (Supabase) bei einem Ein-Personen-System.
- Consequence: Alle persistenten Daten in SQLite. Keine separate Datenbank-Infrastruktur. Backup = Dateikopie.

## DEC-004 — KI-Integration über Claude Code Agent Tool (Max-Subscription)
- Status: accepted
- Reason: Kein API-Budget. Max-Subscription deckt alles ab. Claude Code Agent Tool ist leistungsfähiger als lokale LLMs. Bereits bewährt im OS. Ollama als Ergänzung für Batch-Verarbeitung ist V1.1-Option.
- Consequence: Alle KI-Verarbeitung läuft über Claude Code innerhalb der Max-Subscription. Keine separate LLM-Infrastruktur in V1.

## DEC-005 — DSGVO-bewusster Datenschnitt bei KI-Verarbeitung
- Status: accepted
- Reason: Claude Code verarbeitet Daten auf Anthropic-Servern (USA), nicht lokal. Max-Subscription-Daten werden nicht fürs Training verwendet, verlassen aber den Rechner. Kundenbezogene Rohdaten (Transkripte, E-Mails) sind DSGVO-relevant.
- Consequence: System-Design trennt Rohdaten (lokal in SQLite) von abstrahierten Insights (dürfen an Claude gehen). Kundendaten werden vor KI-Verarbeitung anonymisiert/pseudonymisiert oder nur als bereits abstrahierte Erkenntnisse verarbeitet. Dieser Schnitt wird in der Architektur verankert.