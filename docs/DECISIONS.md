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

## DEC-006 — better-sqlite3 statt ORM (Prisma/Drizzle)
- Status: accepted
- Reason: Kein ORM-Overhead für Single-User-App. Direktes SQL gibt maximale Kontrolle. Synchrones API von better-sqlite3 passt zu Server Actions. Kein Connection-Pool nötig.
- Consequence: SQL wird direkt geschrieben. TypeScript-Typen manuell definiert in lib/types.ts. Schema-Migrations als SQL-Dateien in sql/migrations/.

## DEC-007 — Claude Code CLI statt API für KI-Aufrufe
- Status: accepted
- Reason: Max-Subscription erlaubt CLI-Nutzung ohne API-Kosten. CLI-Aufruf über child_process.execFile ist einfach und zuverlässig. Latenz (~2-5s pro Aufruf) ist für Single-User akzeptabel.
- Consequence: Jeder KI-Aufruf geht über den claude CLI-Befehl. Keine Streaming-Unterstützung in V1. Batch-Analyse ist sequentiell.

## DEC-008 — Server Actions statt REST API
- Status: accepted
- Reason: Next.js Server Actions sind typsicher, boilerplate-arm und für Single-User lokale App ideal. Kein externer API-Consumer geplant.
- Consequence: Alle Datenmutationen über Server Actions. Keine separaten REST-Endpoints. Route Handlers nur für komplexe Queries wenn nötig.

## DEC-009 — Prompt Templates als Flat Markdown Files
- Status: accepted
- Reason: Einfach, lesbar, direkt editierbar ohne Framework-Dependency. Prompt-Iteration über Dateisystem statt Datenbank.
- Consequence: Alle Prompt-Templates liegen in prompts/ als .md-Dateien. Variablen werden über {{placeholder}}-Syntax ersetzt. Keine Prompt-Versionierung in V1.