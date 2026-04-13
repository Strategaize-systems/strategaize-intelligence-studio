# SLC-011 — Research & Market Prep

## Slice
- ID: SLC-011
- Feature: FEAT-012
- Status: planned
- Priority: High

## Goal
Vorbereitungslogik für Markt-, Operator- und Zielgruppenarbeit. 6 Research-Typen mit CRUD, KI-gestütztem Briefing, Ergebnisdokumentation und Markdown-Export.

## Scope
- Server Actions für Research Tasks CRUD + KI-Briefing (actions/research.ts)
- Prompt-Template für Research-Briefings (prompts/generate-research-briefing.md — bereits in Architecture definiert)
- Research Tasks-Listenansicht mit Filtern (Research-Typ, Status)
- Erstellen/Bearbeiten-Formular mit allen Pflichtfeldern + 6 Research-Typen
- KI-gestützte Briefing-Generierung
- Ergebnisdokumentation nach Abschluss
- Markdown-Export
- Status-Workflow: offen → in Recherche → abgeschlossen → verworfen

## Not in Scope
- Research & Enrichment / externe Datenanreicherung (V2)
- Kontakt-Tracking / Outreach-CRM (nie — gehört zu S3)

## Dependencies
- SLC-006 (Opportunities — für Ableitung)

## Micro-Tasks

#### MT-1: Server Actions — Research Tasks CRUD
- Goal: CRUD für Research Tasks
- Files: `app/src/actions/research.ts`
- Expected behavior: create, read (single + list with filters), update, delete, updateStatus. Filter nach research_type, status.
- Verification: DB-Operationen funktionieren
- Dependencies: none

#### MT-2: Prompt Template
- Goal: KI-Template für strukturierte Research-Briefings
- Files: `app/prompts/generate-research-briefing.md`
- Expected behavior: Template erhält Research-Typ + Kontext, erzeugt Briefing mit Suchfragen, empfohlenen Quellen/Methoden, erwarteter Ergebnisstruktur, Relevanzkriterien
- Verification: Template-Datei existiert
- Dependencies: none

#### MT-3: Research Tasks List Page
- Goal: Listenansicht mit Filtern
- Files: `app/src/app/research/page.tsx`, `app/src/app/research/loading.tsx`
- Expected behavior: Tabelle mit Titel, Research-Typ, Status, Quell-Objekt, Erstelldatum. Filter nach Research-Typ und Status.
- Verification: Seite rendert, Filter funktionieren
- Dependencies: MT-1

#### MT-4: Create/Edit Form
- Goal: Formular mit allen Pflichtfeldern und 6 Research-Typen
- Files: `app/src/app/research/new/page.tsx`, `app/src/app/research/[id]/edit/page.tsx`, `app/src/components/forms/research-task-form.tsx`
- Expected behavior: Titel, Research-Typ (Zielgruppenrecherche, Operator-Suchprofil, Multiplikator-Profilierung, Testmarkt-Analyse, Outreach-Pack, Listenauftrag/Listenbriefing), Quell-Objekt, Fragestellung, Kontext, Kontaktkriterien/Suchlogik (optional). Validierung.
- Verification: Formular speichert korrekt
- Dependencies: MT-1

#### MT-5: KI Briefing + Detail View
- Goal: Claude-basierte Briefing-Generierung + Detailansicht mit Ergebnisdokumentation
- Files: `app/src/app/research/[id]/page.tsx`, `app/src/actions/research.ts` (erweitern)
- Expected behavior: "KI-Briefing generieren"-Button. Claude erstellt strukturiertes Research-Briefing. Detailansicht zeigt alle Felder. Ergebnis-Feld (Markdown) für manuelle Dokumentation nach Abschluss.
- Verification: KI generiert Briefing, Ergebnis kann dokumentiert werden
- Dependencies: MT-1, MT-2

#### MT-6: Markdown Export
- Goal: Research Tasks als Markdown exportieren
- Files: `app/src/app/research/[id]/page.tsx` (erweitern), `app/src/lib/export.ts` (erweitern)
- Expected behavior: Export-Button auf Detail-Seite. Exportiert Briefing + Ergebnis als .md in exports/.
- Verification: Export erstellt korrekte Markdown-Datei
- Dependencies: MT-5

## Verification
- Research Task kann manuell erstellt werden mit allen Pflichtfeldern
- Research Task kann KI-gestützt aus Opportunity/Experiment abgeleitet werden
- Alle Research-Typen sind verfügbar und auswählbar
- Ergebnis kann nach Abschluss dokumentiert werden
- Status-Workflow funktioniert
- Listenansicht mit Filtern funktioniert
- Markdown-Export funktioniert
