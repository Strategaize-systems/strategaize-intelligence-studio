# Architecture

## Architecture Summary

StrategAIze Intelligence Studio ist eine lokale Next.js-Anwendung mit SQLite-Datenbank und Claude Code Agent Tool als KI-Verarbeitungsschicht.

Die Architektur besteht aus drei Schichten:
1. **UI-Layer**: Next.js App Router mit Server Components und Server Actions
2. **Data-Layer**: SQLite via better-sqlite3 (synchron, kein ORM-Overhead)
3. **AI-Layer**: Claude Code Agent Tool über CLI-Aufruf für KI-Verarbeitung

Kein Docker, kein externer Server, kein API-Gateway. Alles läuft lokal auf einer Maschine.

Das System ist eine Decision-to-Execution Engine: Erkenntnisse fließen von der Inbox über Analyse, Verdichtung und Bewertung in Entscheidungen — und Entscheidungen werden in typisierte Folgeobjekte (Action Triggers) übersetzt.

---

## Main Components

### 1. Next.js Application (UI + API)
- **Framework**: Next.js 14+ mit App Router
- **Rendering**: Server Components (default) + Client Components (für interaktive UI)
- **Styling**: Tailwind CSS + shadcn/ui
- **API**: Server Actions für Mutations, Route Handlers für komplexe Queries
- **Port**: localhost:3500 (oder konfigurierbar)

### 2. SQLite Database
- **Library**: better-sqlite3 (synchron, schnell, kein Connection-Pool nötig)
- **Datei**: `data/studio.db` im Projektverzeichnis
- **Migrations**: SQL-Dateien in `sql/migrations/` — sequentiell nummeriert
- **Backup**: Kopie der .db-Datei
- **Tabellen**: 14 Core-Tabellen + 2 Junction-Tabellen + 2 FTS-Tabellen

### 3. AI Processing Layer
- **Methode**: Claude Code Agent Tool via CLI (`claude` command)
- **Aufruf**: Aus Next.js Server Actions via `child_process.execFile`
- **Kontext**: Prompt-Templates in `prompts/` — pro Aufgabentyp eine Template-Datei
- **DSGVO-Schnitt**: Server Action baut den Prompt, filtert Rohdaten, sendet nur abstrahierte Inhalte

### 4. File Import Handler
- **Zweck**: Markdown/Text/JSON-Dateien parsen und als Source Records in die DB schreiben
- **Ort**: Server Action, liest Datei, extrahiert Metadaten, erstellt DB-Einträge

### 5. Markdown Export Engine
- **Zweck**: Assets, Module Drafts, Knowledge Packages, Research Tasks als Markdown exportieren
- **Ort**: Server Action, liest aus DB, rendert Template, schreibt Datei in `exports/`

---

## Responsibilities per Component

### Next.js Application
- UI-Rendering für alle 12 Features
- Form-Handling und Validierung
- Navigation und Routing
- Server Actions für alle Datenmutationen
- Aufruf des AI-Layers
- Datei-Import und Export

### SQLite Database
- Persistenz aller Objekttypen (Source Records, Insights, Patterns, Experiments, Research Tasks, Action Triggers, etc.)
- Relationen (n:m via Junction Tables)
- Filterung und Sortierung
- Volltextsuche (SQLite FTS5 für einfache Suche in V1)

### AI Processing Layer
- Insight-Analyse und Klassifizierung
- Pattern-Vorschläge
- Improvement-Ableitung
- Opportunity-Vorschläge und Bewertungsunterstützung
- Content-Generierung (6 Typen)
- Tone Check
- Module/Flow Draft Generierung
- Knowledge Package Generierung
- Experiment-Design-Vorschläge
- Research-Briefing-Generierung

### File Import Handler
- Parsing von .md, .txt, .json Dateien
- Extraktion von Metadaten (Datum, Typ wenn erkennbar)
- Erstellung von Source Records in der DB

### Markdown Export Engine
- Template-basiertes Rendering
- Einzelexport und Bulk-Export
- Ausgabe in `exports/` Verzeichnis

---

## Data Model (SQLite Schema)

### Core Tables (bestehend — unverändert)

```sql
-- Source Records (Insight Inbox)
CREATE TABLE source_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,          -- 'system1', 'system2', 'system3', 'manual', 'external', 'research'
  date TEXT NOT NULL,            -- ISO date
  context TEXT,                  -- Freitext: Projekt, Kunde, Thema
  type TEXT NOT NULL,            -- 'transcript', 'note', 'email_summary', 'export', 'idea', 'research', 'document', 'observation'
  language TEXT DEFAULT 'de',    -- 'de', 'en'
  relevance TEXT DEFAULT 'unclear', -- 'high', 'medium', 'low', 'unclear'
  status TEXT DEFAULT 'unseen',  -- 'unseen', 'seen', 'processed', 'archived'
  input_mode TEXT DEFAULT 'manual', -- 'manual', 'import'
  title TEXT,
  content TEXT NOT NULL,         -- Rohinhalt
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Insights (Analyse-Ergebnisse)
CREATE TABLE insights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_record_id INTEGER NOT NULL REFERENCES source_records(id),
  classification TEXT NOT NULL,  -- 'insight', 'objection', 'opportunity', 'improvement', 'content_angle', 'pattern_candidate', 'raw_idea', 'noise'
  relevance TEXT NOT NULL,       -- 'high', 'medium', 'low'
  relevance_reason TEXT,
  area TEXT NOT NULL,            -- 'sales', 'delivery', 'product', 'methodology', 'noise'
  tags TEXT,                     -- JSON array as text
  summary TEXT NOT NULL,
  suggested_action TEXT,         -- 'decision_board', 'catalog', 'content', 'improvement', 'experiment', 'research', 'ignore'
  decision TEXT,                 -- Entscheidung aus Decision Board
  decision_date TEXT,
  decision_note TEXT,
  review_date TEXT,              -- Wiedervorlagedatum
  created_at TEXT DEFAULT (datetime('now'))
);

-- Patterns
CREATE TABLE patterns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,            -- 'problem_type', 'industry_pattern', 'deal_killer', 'ai_opportunity', 'methodology_weakness', 'positioning_pattern'
  status TEXT DEFAULT 'active',  -- 'active', 'archived'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Pattern-Insight Junction (n:m)
CREATE TABLE pattern_insights (
  pattern_id INTEGER NOT NULL REFERENCES patterns(id),
  insight_id INTEGER NOT NULL REFERENCES insights(id),
  PRIMARY KEY (pattern_id, insight_id)
);

-- Improvements
CREATE TABLE improvements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source_type TEXT,              -- 'insight', 'pattern', 'manual'
  source_id INTEGER,            -- ID des Quell-Objekts
  target_area TEXT NOT NULL,    -- 'questions_s1', 'delivery_s2', 'sales_s3', 'skills_dev', 'product_desc', 'asset_quality', 'offer_blocks', 'standard_deliverables'
  improvement_type TEXT NOT NULL, -- 'question', 'prompt', 'skill', 'method', 'offer', 'positioning', 'asset', 'new_module'
  priority TEXT DEFAULT 'medium', -- 'high', 'medium', 'low'
  status TEXT DEFAULT 'suggestion', -- 'suggestion', 'reviewed', 'accepted', 'implemented', 'rejected'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### Core Tables (bestehend — erweitert)

```sql
-- Opportunities (erweitert um Bewertungsschema)
CREATE TABLE opportunities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  source_type TEXT,              -- 'insight', 'pattern', 'improvement', 'manual'
  source_id INTEGER,
  problem TEXT,
  solution_idea TEXT,
  target_audience TEXT,
  potential_benefit TEXT,
  maturity TEXT DEFAULT 'raw_idea', -- 'raw_idea', 'reviewed', 'relevant', 'in_progress', 'implemented', 'parked', 'rejected'
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'active',  -- 'active', 'parked', 'rejected', 'implemented'
  product_reference TEXT,        -- Bezug zu bestehenden Produkten/Modulen
  -- Pflicht-Bewertungsfelder (6 in V1)
  eval_problem_class TEXT,       -- Pflicht: Übergeordnete Problemklasse
  eval_target_group TEXT,        -- Pflicht: Zielgruppe
  eval_strategic_fit TEXT,       -- Pflicht: Strategischer Fit (high/medium/low/unclear)
  eval_value_type TEXT,          -- Pflicht: 'cashflow', 'asset', 'option'
  eval_test_need TEXT,           -- Pflicht: Validierungsbedarf (Freitext)
  eval_kill_criteria TEXT,       -- Pflicht: No-Go-Signale (Freitext)
  -- Optionale Bewertungsfelder (5, Pflicht ab V1.1)
  eval_core_engine_fit TEXT,     -- Optional: Fit zur Core Engine (high/medium/low/unclear)
  eval_form_type TEXT,           -- Optional: 'product', 'framework', 'venture_candidate'
  eval_minimal_viable TEXT,      -- Optional: Minimale marktfähige Form (Freitext)
  eval_operator_type TEXT,       -- Optional: Plausibler Operator (Freitext)
  eval_monetization TEXT,        -- Optional: Monetarisierungslogik (Freitext)
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Opportunity Relations (verwandte Einträge — unverändert)
CREATE TABLE opportunity_relations (
  opportunity_id INTEGER NOT NULL REFERENCES opportunities(id),
  related_opportunity_id INTEGER NOT NULL REFERENCES opportunities(id),
  PRIMARY KEY (opportunity_id, related_opportunity_id)
);

-- Asset Requests (erweitert um Experiment als Quelle)
CREATE TABLE asset_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_type TEXT NOT NULL,     -- 'insight', 'pattern', 'opportunity', 'improvement', 'experiment'
  source_id INTEGER NOT NULL,
  output_type TEXT NOT NULL,     -- 'blogpost', 'linkedin_post', 'one_pager', 'product_note', 'email_template', 'landingpage_briefing'
  status TEXT DEFAULT 'pending', -- 'pending', 'generated', 'completed'
  created_at TEXT DEFAULT (datetime('now'))
);

-- Assets (unverändert)
CREATE TABLE assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_request_id INTEGER REFERENCES asset_requests(id),
  output_type TEXT NOT NULL,     -- 'blogpost', 'linkedin_post', 'one_pager', 'product_note', 'email_template', 'landingpage_briefing'
  title TEXT NOT NULL,
  content TEXT NOT NULL,         -- Markdown content
  status TEXT DEFAULT 'draft',   -- 'draft', 'revised', 'approved', 'published'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Module Drafts (erweitert um Zielsystem und neue Draft-Typen)
CREATE TABLE module_drafts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  draft_type TEXT NOT NULL,      -- 'questionnaire', 'assessment_flow', 'catalog_draft', 'consulting_module', 'delivery_script', 'prompt_skill_extension', 'module_description', 'process_flow_draft', 'onboarding_draft', 'landingpage_briefing', 'outreach_pack_draft', 'campaign_logic_draft', 'presentation_draft'
  target_system TEXT,            -- 's1', 's2', 's3', 'dev', 'internal'
  source_type TEXT,              -- 'opportunity', 'pattern', 'decision', 'manual'
  source_id INTEGER,
  problem_description TEXT,
  goal_description TEXT,
  content TEXT NOT NULL,         -- Markdown content
  status TEXT DEFAULT 'draft',   -- 'draft', 'revised', 'ready', 'implemented', 'rejected'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Knowledge Packages (unverändert)
CREATE TABLE knowledge_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  package_type TEXT NOT NULL,    -- 'sop', 'knowledge_block', 'faq', 'role_description', 'process_description', 'decision_logic'
  source_type TEXT,              -- 'insight', 'pattern', 'improvement', 'manual'
  source_id INTEGER,
  content TEXT NOT NULL,         -- Markdown content
  target_platform TEXT DEFAULT 'internal', -- 'internal', 'external', 'undetermined'
  status TEXT DEFAULT 'draft',   -- 'draft', 'revised', 'approved'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Brand Configuration (erweitert um 2 Templates)
CREATE TABLE brand_config (
  id INTEGER PRIMARY KEY CHECK (id = 1), -- Singleton
  tonality TEXT,
  voice_guide TEXT,
  dos TEXT,
  donts TEXT,
  template_blogpost TEXT,
  template_linkedin TEXT,
  template_one_pager TEXT,
  template_product_note TEXT,
  template_email TEXT,           -- NEU: E-Mail-Vorlage Template
  template_landingpage TEXT,     -- NEU: Landingpage-Briefing Template
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### Neue Tabellen (3)

```sql
-- Experiments (FEAT-011)
CREATE TABLE experiments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  hypothesis TEXT NOT NULL,       -- Was wird getestet?
  source_type TEXT,               -- 'opportunity', 'decision', 'pattern', 'manual'
  source_id INTEGER,
  target_group TEXT NOT NULL,     -- Wer wird getestet?
  channel TEXT NOT NULL,          -- Über welchen Weg?
  budget_range TEXT,              -- Geschätzter Aufwand/Kosten (Freitext)
  time_start TEXT,                -- ISO date
  time_end TEXT,                  -- ISO date
  success_signals TEXT NOT NULL,  -- Woran erkennt man Erfolg? (Freitext)
  kill_criteria TEXT NOT NULL,    -- Was stoppt den Test sofort? (Freitext)
  status TEXT DEFAULT 'planned',  -- 'planned', 'active', 'completed', 'cancelled'
  result TEXT,                    -- Ergebnis nach Abschluss (Freitext)
  follow_up_decision TEXT,        -- Folgeentscheidung (Freitext)
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Research Tasks (FEAT-012)
CREATE TABLE research_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  research_type TEXT NOT NULL,    -- 'target_group', 'operator_profile', 'multiplier_profiling', 'test_market', 'outreach_pack', 'list_briefing'
  source_type TEXT,               -- 'opportunity', 'experiment', 'decision', 'manual'
  source_id INTEGER,
  question TEXT NOT NULL,         -- Was soll herausgefunden werden?
  context TEXT,                   -- Warum wird das gebraucht?
  search_criteria TEXT,           -- Kontaktkriterien/Suchlogik (falls zutreffend)
  result TEXT,                    -- Ergebnis nach Abschluss (Markdown)
  status TEXT DEFAULT 'open',     -- 'open', 'researching', 'completed', 'rejected'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Action Triggers (FEAT-006 — Decision-to-Execution)
CREATE TABLE action_triggers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trigger_type TEXT NOT NULL,     -- 'create_onboarding_draft', 'create_catalog_draft', 'create_module_draft', 'create_asset_brief', 'create_market_test', 'create_research_task', 'create_operator_profile', 'create_improvement', 'create_knowledge_package', 'create_outreach_pack'
  target_system TEXT,             -- 's1', 's2', 's3', 'dev', 'internal'
  source_object_type TEXT NOT NULL, -- 'insight', 'pattern', 'opportunity', 'improvement', 'experiment'
  source_object_id INTEGER NOT NULL,
  decision_note TEXT,             -- Begründung der Entscheidung
  description TEXT,               -- Auftragsbeschreibung
  target_object_type TEXT,        -- Typ des erzeugten Folgeobjekts (falls bereits erstellt)
  target_object_id INTEGER,       -- ID des erzeugten Folgeobjekts (falls bereits erstellt)
  status TEXT DEFAULT 'created',  -- 'created', 'in_progress', 'completed', 'rejected'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### Indexes

```sql
-- Bestehende Indexes (unverändert)
CREATE INDEX idx_source_records_status ON source_records(status);
CREATE INDEX idx_source_records_source ON source_records(source);
CREATE INDEX idx_insights_classification ON insights(classification);
CREATE INDEX idx_insights_area ON insights(area);
CREATE INDEX idx_insights_decision ON insights(decision);
CREATE INDEX idx_improvements_target_area ON improvements(target_area);
CREATE INDEX idx_improvements_status ON improvements(status);
CREATE INDEX idx_opportunities_maturity ON opportunities(maturity);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_assets_output_type ON assets(output_type);
CREATE INDEX idx_assets_status ON assets(status);

-- Neue Indexes
CREATE INDEX idx_experiments_status ON experiments(status);
CREATE INDEX idx_experiments_source ON experiments(source_type, source_id);
CREATE INDEX idx_research_tasks_status ON research_tasks(status);
CREATE INDEX idx_research_tasks_type ON research_tasks(research_type);
CREATE INDEX idx_action_triggers_status ON action_triggers(status);
CREATE INDEX idx_action_triggers_type ON action_triggers(trigger_type);
CREATE INDEX idx_action_triggers_source ON action_triggers(source_object_type, source_object_id);
CREATE INDEX idx_module_drafts_target ON module_drafts(target_system);
```

### Full-Text Search (V1 Basis — unverändert)

```sql
CREATE VIRTUAL TABLE source_records_fts USING fts5(title, content, content=source_records, content_rowid=id);
CREATE VIRTUAL TABLE insights_fts USING fts5(summary, tags, content=insights, content_rowid=id);
```

---

## Tabellen-Übersicht

| # | Tabelle | Feature | Typ |
|---|---------|---------|-----|
| 1 | source_records | FEAT-001 | Core |
| 2 | insights | FEAT-002 | Core |
| 3 | patterns | FEAT-003 | Core |
| 4 | pattern_insights | FEAT-003 | Junction |
| 5 | improvements | FEAT-004 | Core |
| 6 | opportunities | FEAT-005 | Core (erweitert) |
| 7 | opportunity_relations | FEAT-005 | Junction |
| 8 | asset_requests | FEAT-007 | Core (erweitert) |
| 9 | assets | FEAT-007 | Core |
| 10 | module_drafts | FEAT-009 | Core (erweitert) |
| 11 | knowledge_packages | FEAT-010 | Core |
| 12 | brand_config | FEAT-008 | Singleton (erweitert) |
| 13 | **experiments** | FEAT-011 | **Neu** |
| 14 | **research_tasks** | FEAT-012 | **Neu** |
| 15 | **action_triggers** | FEAT-006 | **Neu** |
| 16 | source_records_fts | FEAT-001 | FTS |
| 17 | insights_fts | FEAT-002 | FTS |

**Gesamt: 14 Core + 2 Junction + 1 Singleton + 2 FTS = 17 physische Tabellen + 2 virtuelle Tabellen**

---

## Application Structure

```
strategaize-intelligence-studio/
├── app/                        # Next.js App
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Dashboard / Übersicht
│   │   │   ├── inbox/          # FEAT-001: Insight Inbox
│   │   │   ├── insights/       # FEAT-002: Analyzer results
│   │   │   ├── patterns/       # FEAT-003: Pattern Clustering
│   │   │   ├── improvements/   # FEAT-004: Improvement Engine
│   │   │   ├── catalog/        # FEAT-005: Opportunity & Venture Evaluation
│   │   │   ├── decisions/      # FEAT-006: Decision & Trigger Board
│   │   │   ├── triggers/       # FEAT-006: Action Trigger Übersicht
│   │   │   ├── assets/         # FEAT-007: Content Transformer + Bibliothek
│   │   │   ├── brand/          # FEAT-008: Brand Control
│   │   │   ├── modules/        # FEAT-009: Modules, Flows & Build Drafts
│   │   │   ├── knowledge/      # FEAT-010: Knowledge Packaging
│   │   │   ├── experiments/    # FEAT-011: Experiment Manager
│   │   │   ├── research/       # FEAT-012: Research & Market Prep
│   │   │   ├── layout.tsx      # Root Layout mit Navigation
│   │   │   └── api/            # Route Handlers (wenn nötig)
│   │   ├── components/         # Shared UI Components
│   │   │   ├── ui/             # shadcn/ui Basiskomponenten
│   │   │   ├── forms/          # Wiederverwendbare Formularkomponenten
│   │   │   ├── tables/         # Wiederverwendbare Tabellenkomponenten
│   │   │   └── layout/         # Navigation, Sidebar, Header
│   │   ├── lib/                # Shared Libraries
│   │   │   ├── db.ts           # SQLite Connection + Query Helpers
│   │   │   ├── ai.ts           # Claude Code Agent Wrapper + DSGVO-Filter
│   │   │   ├── import.ts       # File Import Logic
│   │   │   ├── export.ts       # Markdown Export Logic
│   │   │   └── types.ts        # TypeScript Typen für alle 12 Objekttypen
│   │   └── actions/            # Server Actions
│   │       ├── inbox.ts        # CRUD für Source Records
│   │       ├── analyzer.ts     # Insight-Analyse via Claude
│   │       ├── patterns.ts     # CRUD für Patterns
│   │       ├── improvements.ts # CRUD für Improvements
│   │       ├── catalog.ts      # CRUD für Opportunities + Bewertungsschema
│   │       ├── decisions.ts    # Decision Board + Action Trigger Logik
│   │       ├── assets.ts       # Asset Requests + 6-Typ-Generierung
│   │       ├── brand.ts        # Brand Config CRUD (6 Templates)
│   │       ├── modules.ts      # Module/Flow/Build Draft CRUD (13 Typen)
│   │       ├── knowledge.ts    # Knowledge Package CRUD
│   │       ├── experiments.ts  # Experiment CRUD + KI-Design
│   │       └── research.ts     # Research Task CRUD + KI-Briefing
│   ├── data/
│   │   └── studio.db           # SQLite Datenbank
│   ├── prompts/                # Claude Prompt Templates
│   │   ├── analyze-insight.md
│   │   ├── suggest-patterns.md
│   │   ├── derive-improvement.md
│   │   ├── suggest-opportunity.md
│   │   ├── evaluate-opportunity.md  # NEU: Bewertungsschema-Unterstützung
│   │   ├── generate-blogpost.md
│   │   ├── generate-linkedin.md
│   │   ├── generate-one-pager.md
│   │   ├── generate-product-note.md
│   │   ├── generate-email-template.md    # NEU
│   │   ├── generate-landingpage-briefing.md  # NEU
│   │   ├── tone-check.md
│   │   ├── generate-module-draft.md
│   │   ├── generate-knowledge-package.md
│   │   ├── design-experiment.md          # NEU: Experiment-Design
│   │   └── generate-research-briefing.md # NEU: Research-Briefing
│   ├── exports/                # Exportierte Markdown-Dateien
│   └── sql/
│       └── migrations/
│           └── 001-initial-schema.sql
├── docs/                       # Projektdokumentation
├── features/                   # Feature-Specs
├── slices/                     # Slice-Definitionen
├── planning/                   # Roadmap + Backlog
├── reports/                    # Skill-Reports
└── CLAUDE.md
```

---

## Main Flows

### Flow 1: Inbox → Analyse → Decision → Action Trigger

```
[User erstellt/importiert Source Record]
    ↓
[Source Record in SQLite (status: unseen)]
    ↓
[User klickt "Analysieren"]
    ↓
[Server Action: analyzer.ts]
    ├── Liest Source Record
    ├── DSGVO-Filter: Entfernt personenbezogene Daten
    ├── Ruft Claude Code Agent auf
    └── Speichert Insight (classification, relevance, suggested_action)
    ↓
[Insight erscheint auf Decision Board]
    ↓
[User trifft Entscheidung (z.B. "Hypothese testen")]
    ↓
[Server Action: decisions.ts]
    ├── Speichert Entscheidung am Insight
    ├── Erzeugt Action Trigger (type: 'create_market_test', target: 'internal')
    └── Optional: Erzeugt direkt das Ziel-Objekt (Experiment)
    ↓
[Action Trigger in Trigger-Übersicht sichtbar]
```

### Flow 2: Opportunity → Bewertung → Experiment → Research

```
[Opportunity wird erstellt (manuell oder KI-abgeleitet)]
    ↓
[User füllt Pflicht-Bewertungsschema aus]
    ├── Problemklasse, Zielgruppe, Strategischer Fit
    ├── Cashflow/Asset/Option, Testbedarf, Kill-Kriterien
    └── Optional: Core Engine Fit, Operator-Typ, Monetarisierung
    ↓
[Testbedarf identifiziert → Entscheidung: "Hypothese testen"]
    ↓
[Experiment wird erstellt]
    ├── Hypothese, Zielgruppe, Kanal
    ├── Kill-Kriterien, Erfolgssignale
    └── Budget, Zeitfenster
    ↓
[Zielgruppe unklar → Research Task erstellen]
    ├── Typ: Zielgruppenrecherche
    ├── Fragestellung, Kontext, Suchlogik
    └── Status: offen → recherchiert → abgeschlossen
    ↓
[Research-Ergebnis fließt in Experiment-Design]
```

### Flow 3: Decision → Trigger → Ziel-Objekt

```
[Entscheidung auf Decision Board getroffen]
    ↓
[Action Trigger erzeugt]
    ├── trigger_type: 'create_module_draft'
    ├── target_system: 's1'
    ├── source: Opportunity #42
    ├── description: "Fragebogen-Entwurf für Zusatzerhebung Vertriebsbereitschaft"
    └── status: 'created'
    ↓
[User öffnet Trigger-Übersicht]
    ↓
[Klickt "Ausführen" → Weiterleitung zu Modules/Flows]
    ↓
[Module Draft wird erstellt]
    ├── draft_type: 'questionnaire'
    ├── target_system: 's1'
    ├── source: Opportunity #42
    └── KI-generierter Entwurf
    ↓
[Action Trigger aktualisiert]
    ├── target_object_type: 'module_draft'
    ├── target_object_id: <neue ID>
    └── status: 'completed'
```

### Flow 4: Content-Generierung (erweitert)

```
[Asset Request (Quell-Objekt + 1 von 6 Output-Typen)]
    ↓
[Server Action: assets.ts]
    ├── Lädt Quell-Objekt
    ├── Lädt Brand Config (inkl. E-Mail- und Landingpage-Templates)
    ├── Wählt Prompt-Template nach Output-Typ
    ├── Ruft Claude Code Agent auf
    └── Speichert Asset (status: draft)
    ↓
[User bearbeitet in Markdown-Editor]
    ↓
[Optional: Tone Check]
    ↓
[Freigabe / Export]
```

---

## AI Integration Design

### Claude Code Agent Aufruf (unverändert)

```typescript
// lib/ai.ts
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function callClaude(prompt: string): Promise<string> {
  const { stdout } = await execFileAsync('claude', [
    '-p', prompt,
    '--output-format', 'text'
  ], {
    timeout: 120000,
    maxBuffer: 1024 * 1024
  });
  return stdout.trim();
}

export async function callClaudeJSON<T>(prompt: string): Promise<T> {
  const { stdout } = await execFileAsync('claude', [
    '-p', prompt,
    '--output-format', 'json'
  ], {
    timeout: 120000,
    maxBuffer: 1024 * 1024
  });
  return JSON.parse(stdout);
}
```

### DSGVO-Filter (unverändert)

```typescript
export function buildSafePrompt(template: string, data: Record<string, string>): string {
  const safeData = {
    ...data,
    content: data.summary || data.content?.substring(0, 500) || '',
  };
  let prompt = template;
  for (const [key, value] of Object.entries(safeData)) {
    prompt = prompt.replace(`{{${key}}}`, value);
  }
  return prompt;
}
```

### Neue Prompt Templates

**evaluate-opportunity.md** — Unterstützung beim Ausfüllen des Bewertungsschemas:
```markdown
Du bist ein strategischer Berater im StrategAIze Intelligence Studio.
Hilf bei der Bewertung folgender Opportunity.

## Opportunity
- Titel: {{title}}
- Problem: {{problem}}
- Lösungsidee: {{solution_idea}}
- Zielgruppe: {{target_audience}}

## Aufgabe
Bewerte anhand dieser Dimensionen (JSON):
{
  "problem_class": "...",
  "strategic_fit": "high|medium|low|unclear",
  "value_type": "cashflow|asset|option",
  "test_need": "...",
  "kill_criteria": "..."
}
```

**design-experiment.md** — KI-gestütztes Experiment-Design:
```markdown
Entwirf einen strukturierten Markttest für folgende Opportunity.

## Opportunity
- Titel: {{title}}
- Zielgruppe: {{target_audience}}
- Problem: {{problem}}
- Testbedarf: {{test_need}}

## Aufgabe
Erstelle ein Experiment-Design (JSON):
{
  "hypothesis": "...",
  "target_group": "...",
  "channel": "...",
  "success_signals": "...",
  "kill_criteria": "...",
  "suggested_timeframe": "...",
  "suggested_budget_range": "..."
}
```

**generate-research-briefing.md** — Strukturierte Research-Aufgabe:
```markdown
Erstelle ein Research-Briefing für folgende Aufgabe.

## Kontext
- Typ: {{research_type}}
- Quell-Objekt: {{source_title}}
- Fragestellung: {{question}}

## Aufgabe
Erstelle ein strukturiertes Briefing mit:
- Konkrete Suchfragen
- Empfohlene Quellen/Methoden
- Erwartete Ergebnisstruktur
- Kriterien für Relevanz
```

---

## External Dependencies

| Dependency | Purpose | V1 Required |
|-----------|---------|-------------|
| Next.js 14+ | UI Framework + Server Actions | Ja |
| better-sqlite3 | SQLite-Anbindung (synchron, schnell) | Ja |
| Tailwind CSS | Styling | Ja |
| shadcn/ui | UI-Komponentenbibliothek | Ja |
| Claude Code CLI | KI-Verarbeitung | Ja (muss installiert sein) |
| TypeScript | Typsicherheit | Ja |

**Keine weiteren externen Abhängigkeiten zur Laufzeit.**

---

## Security / Privacy Considerations

### DSGVO-Datenschnitt (DEC-005 — unverändert)
- **Rohdaten** bleiben ausschließlich in SQLite
- **An Claude** gehen nur: Zusammenfassungen, Typ-Information, Kontext ohne personenbezogene Daten
- Der `buildSafePrompt`-Mechanismus ist der zentrale Enforcement-Punkt
- Gilt identisch für alle neuen Module (Experiments, Research Tasks)

### Lokale Sicherheit (unverändert)
- SQLite-Datei im Projektverzeichnis — Zugriffschutz über OS-Level
- Keine Netzwerk-Exposition — nur localhost
- Kein Auth — Single-User-System

### Backup (unverändert)
- `data/studio.db` jederzeit kopierbar
- Kein Git-Tracking der .db-Datei

---

## Constraints and Tradeoffs

### Bestehende Tradeoffs (DEC-001 bis DEC-009 — alle unverändert gültig)

1. **better-sqlite3 statt ORM** — Pro: Kein Overhead. Contra: Kein Type-Safety auf Query-Ebene.
2. **Claude CLI statt API** — Pro: Kein Budget. Contra: ~2-5s Latenz pro Aufruf.
3. **Server Actions statt REST** — Pro: Typsicher. Contra: Nicht extern aufrufbar.
4. **Flat Prompt Templates** — Pro: Einfach. Contra: Keine Versionierung.

### Neuer Tradeoff: Action Triggers als eigene Tabelle vs. in Decision-Feld

- **Pro eigene Tabelle**: Eigenständig nachverfolgbar, filtrierbar, Status-Workflow, Verknüpfung zum erzeugten Ziel-Objekt möglich.
- **Contra eigene Tabelle**: Zusätzliche Komplexität, mehr Joins.
- **Entscheidung**: Eigene Tabelle. Action Triggers sind die zentrale Decision-to-Execution-Brücke und müssen als First-Class-Objekte behandelt werden.

### Neuer Tradeoff: Opportunity-Bewertung inline vs. separate Tabelle

- **Pro inline** (eval_*-Felder in opportunities-Tabelle): Einfacher, keine Joins, ein Objekt = eine Zeile.
- **Contra inline**: Tabelle wird breiter, Schema-Erweiterungen bei neuen Dimensionen nötig.
- **Entscheidung**: Inline. Bei 11 festen Dimensionen ist eine separate Tabelle Over-Engineering. In V1.1 kann bei Bedarf normalisiert werden.

---

## Open Technical Questions

Keine offenen Fragen. Alle architekturrelevanten Entscheidungen sind getroffen:
- Stack: Next.js + SQLite + Claude CLI (DEC-001 bis DEC-009)
- DSGVO: Filter-Layer in Server Actions (DEC-005)
- Datenmodell: 14 Core-Tabellen + Junction + FTS
- Neue Tabellen: experiments, research_tasks, action_triggers
- Bewertungsschema: Inline in opportunities
- Action Triggers: Eigene Tabelle
- Prompt Templates: 4 neue Templates (evaluate-opportunity, design-experiment, generate-email-template, generate-research-briefing)

---

## Recommended Implementation Direction

1. **Slice 1**: Projektsetup (Next.js, SQLite, Schema-Migration mit allen 17 Tabellen, Basis-Layout mit Navigation für 12 Bereiche)
2. **Slice 2**: Insight Inbox (FEAT-001) — CRUD + Import + Listenansicht
3. **Slice 3**: Insight Analyzer (FEAT-002) — Claude-Integration + Analyse-UI
4. **Slice 4**: Pattern Clustering (FEAT-003) — Pattern CRUD + Insight-Zuordnung
5. **Slice 5**: Improvement Engine (FEAT-004) — CRUD + KI-Ableitung
6. **Slice 6**: Opportunity & Venture Evaluation (FEAT-005) — CRUD + Bewertungsschema + KI-Evaluierung
7. **Slice 7**: Decision & Trigger Board (FEAT-006) — Board-View + Action Trigger-Erzeugung + Trigger-Übersicht
8. **Slice 8**: Brand Control (FEAT-008) — Brand Config UI (6 Templates, vor Content Transformer)
9. **Slice 9**: Content Transformer (FEAT-007) — 6-Typ-Generierung + Bibliothek
10. **Slice 10**: Experiment Manager (FEAT-011) — CRUD + KI-Design + Abschluss-Workflow
11. **Slice 11**: Research & Market Prep (FEAT-012) — CRUD + 6 Research-Typen + KI-Briefing
12. **Slice 12**: Modules, Flows & Build Drafts (FEAT-009) — CRUD + 13 Draft-Typen + Zielsystem
13. **Slice 13**: Knowledge Packaging (FEAT-010) — CRUD + Export
14. **Slice 14**: Dashboard & Integration (Übersichtsseite, Objekt-Verlinkungen, Gesamtnavigation)

**Kernlogik der Reihenfolge**: Die Signalkette (Slices 1-5) → Bewertungskette (Slice 6) → Entscheidungskette (Slice 7) → Produktionskette (Slices 8-13) → Integration (Slice 14). Das Decision Board kommt nach der Bewertungskette, weil es auf Opportunities, Improvements und Insights reagiert.

Die exakte Slice-Aufteilung wird in `/slice-planning` verfeinert.

---

## Recommended Next Step
`/slice-planning` — V1 in implementierbare Slices aufteilen.
