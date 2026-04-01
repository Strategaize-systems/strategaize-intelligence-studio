# Architecture

## Architecture Summary

StrategAIze Intelligence Studio ist eine lokale Next.js-Anwendung mit SQLite-Datenbank und Claude Code Agent Tool als KI-Verarbeitungsschicht.

Die Architektur besteht aus drei Schichten:
1. **UI-Layer**: Next.js App Router mit Server Components und Server Actions
2. **Data-Layer**: SQLite via better-sqlite3 (synchron, kein ORM-Overhead)
3. **AI-Layer**: Claude Code Agent Tool über CLI-Aufruf für KI-Verarbeitung

Kein Docker, kein externer Server, kein API-Gateway. Alles läuft lokal auf einer Maschine.

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

### 3. AI Processing Layer
- **Methode**: Claude Code Agent Tool via CLI (`claude` command)
- **Aufruf**: Aus Next.js Server Actions via `child_process.execFile`
- **Kontext**: Prompt-Templates in `prompts/` — pro Aufgabentyp eine Template-Datei
- **DSGVO-Schnitt**: Server Action baut den Prompt, filtert Rohdaten, sendet nur abstrahierte Inhalte

### 4. File Import Handler
- **Zweck**: Markdown/Text/JSON-Dateien parsen und als Source Records in die DB schreiben
- **Ort**: Server Action, liest Datei, extrahiert Metadaten, erstellt DB-Einträge

### 5. Markdown Export Engine
- **Zweck**: Assets, Module Drafts, Knowledge Packages als Markdown exportieren
- **Ort**: Server Action, liest aus DB, rendert Template, schreibt Datei in `exports/`

---

## Responsibilities per Component

### Next.js Application
- UI-Rendering für alle 10 Features
- Form-Handling und Validierung
- Navigation und Routing
- Server Actions für alle Datenmutationen
- Aufruf des AI-Layers
- Datei-Import und Export

### SQLite Database
- Persistenz aller Objekttypen (Source Records, Insights, Patterns, etc.)
- Relationen (n:m via Junction Tables)
- Filterung und Sortierung
- Volltextsuche (SQLite FTS5 für einfache Suche in V1)

### AI Processing Layer
- Insight-Analyse und Klassifizierung
- Pattern-Vorschläge
- Improvement-Ableitung
- Opportunity-Vorschläge
- Content-Generierung (4 Typen)
- Tone Check
- Module Draft Generierung
- Knowledge Package Generierung

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

### Core Tables

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
  suggested_action TEXT,         -- 'decision_board', 'catalog', 'content', 'improvement', 'ignore'
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

-- Opportunities (= Catalog Entries in V1)
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
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Opportunity Relations (verwandte Einträge)
CREATE TABLE opportunity_relations (
  opportunity_id INTEGER NOT NULL REFERENCES opportunities(id),
  related_opportunity_id INTEGER NOT NULL REFERENCES opportunities(id),
  PRIMARY KEY (opportunity_id, related_opportunity_id)
);

-- Asset Requests
CREATE TABLE asset_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_type TEXT NOT NULL,     -- 'insight', 'pattern', 'opportunity', 'improvement'
  source_id INTEGER NOT NULL,
  output_type TEXT NOT NULL,     -- 'blogpost', 'linkedin_post', 'one_pager', 'product_note'
  status TEXT DEFAULT 'pending', -- 'pending', 'generated', 'completed'
  created_at TEXT DEFAULT (datetime('now'))
);

-- Assets
CREATE TABLE assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_request_id INTEGER REFERENCES asset_requests(id),
  output_type TEXT NOT NULL,     -- 'blogpost', 'linkedin_post', 'one_pager', 'product_note'
  title TEXT NOT NULL,
  content TEXT NOT NULL,         -- Markdown content
  status TEXT DEFAULT 'draft',   -- 'draft', 'revised', 'approved', 'published'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Module Drafts
CREATE TABLE module_drafts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  draft_type TEXT NOT NULL,      -- 'questionnaire', 'assessment_flow', 'consulting_module', 'delivery_script', 'module_description', 'prompt_skill_extension'
  source_type TEXT,              -- 'opportunity', 'pattern', 'manual'
  source_id INTEGER,
  problem_description TEXT,
  goal_description TEXT,
  content TEXT NOT NULL,         -- Markdown content
  status TEXT DEFAULT 'draft',   -- 'draft', 'revised', 'ready', 'implemented', 'rejected'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Knowledge Packages
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

-- Brand Configuration (Singleton — eine Zeile)
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
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### Indexes

```sql
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
```

### Full-Text Search (V1 Basis)

```sql
-- FTS5 für einfache Suche über Source Records und Insights
CREATE VIRTUAL TABLE source_records_fts USING fts5(title, content, content=source_records, content_rowid=id);
CREATE VIRTUAL TABLE insights_fts USING fts5(summary, tags, content=insights, content_rowid=id);
```

---

## Application Structure

```
strategaize-intelligence-studio/
├── app/                        # Next.js App (wird in /slice-planning erstellt)
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Dashboard / Übersicht
│   │   │   ├── inbox/          # FEAT-001: Insight Inbox
│   │   │   ├── insights/       # FEAT-002: Analyzer results
│   │   │   ├── patterns/       # FEAT-003: Pattern Clustering
│   │   │   ├── improvements/   # FEAT-004: Improvement Engine
│   │   │   ├── catalog/        # FEAT-005: Opportunity Catalog
│   │   │   ├── decisions/      # FEAT-006: Decision Board
│   │   │   ├── assets/         # FEAT-007: Content Transformer
│   │   │   ├── brand/          # FEAT-008: Brand Control
│   │   │   ├── modules/        # FEAT-009: Module Builder
│   │   │   ├── knowledge/      # FEAT-010: Knowledge Packaging
│   │   │   ├── layout.tsx      # Root Layout mit Navigation
│   │   │   └── api/            # Route Handlers (wenn nötig)
│   │   ├── components/         # Shared UI Components
│   │   │   ├── ui/             # shadcn/ui Basiskomponenten
│   │   │   ├── forms/          # Wiederverwendbare Formularkomponenten
│   │   │   ├── tables/         # Wiederverwendbare Tabellenkomponenten
│   │   │   └── layout/         # Navigation, Sidebar, Header
│   │   ├── lib/                # Shared Libraries
│   │   │   ├── db.ts           # SQLite Connection + Query Helpers
│   │   │   ├── ai.ts           # Claude Code Agent Wrapper
│   │   │   ├── import.ts       # File Import Logic
│   │   │   ├── export.ts       # Markdown Export Logic
│   │   │   └── types.ts        # TypeScript Typen für alle Objekttypen
│   │   └── actions/            # Server Actions
│   │       ├── inbox.ts        # CRUD für Source Records
│   │       ├── analyzer.ts     # Insight-Analyse via Claude
│   │       ├── patterns.ts     # CRUD für Patterns
│   │       ├── improvements.ts # CRUD für Improvements
│   │       ├── catalog.ts      # CRUD für Opportunities
│   │       ├── decisions.ts    # Decision Board Logik
│   │       ├── assets.ts       # Asset Requests + Generierung
│   │       ├── brand.ts        # Brand Config CRUD
│   │       ├── modules.ts      # Module Draft CRUD
│   │       └── knowledge.ts    # Knowledge Package CRUD
│   ├── data/
│   │   └── studio.db           # SQLite Datenbank
│   ├── prompts/                # Claude Prompt Templates
│   │   ├── analyze-insight.md
│   │   ├── suggest-patterns.md
│   │   ├── derive-improvement.md
│   │   ├── suggest-opportunity.md
│   │   ├── generate-blogpost.md
│   │   ├── generate-linkedin.md
│   │   ├── generate-one-pager.md
│   │   ├── generate-product-note.md
│   │   ├── tone-check.md
│   │   ├── generate-module-draft.md
│   │   └── generate-knowledge-package.md
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

### Flow 1: Inbox → Analyse → Decision

```
[User erstellt/importiert Source Record]
    ↓
[Source Record in SQLite gespeichert (status: unseen)]
    ↓
[User klickt "Analysieren" in UI]
    ↓
[Server Action: analyzer.ts]
    ├── Liest Source Record aus DB
    ├── Baut Prompt aus Template (analyze-insight.md)
    ├── DSGVO-Filter: Entfernt personenbezogene Daten / nimmt nur Zusammenfassung
    ├── Ruft Claude Code Agent auf (child_process.execFile)
    ├── Parst Claude-Antwort (JSON-Format erwartet)
    └── Speichert Insight in DB (classification, relevance, area, tags, summary, suggested_action)
    ↓
[Source Record status → 'processed']
    ↓
[Insight erscheint auf Decision Board (wenn noch keine Entscheidung)]
    ↓
[User trifft Entscheidung → Folgeaktion wird erzeugt]
```

### Flow 2: Insight → Pattern

```
[User navigiert zu Patterns]
    ↓
[Klickt "Pattern vorschlagen lassen"]
    ↓
[Server Action: patterns.ts]
    ├── Lädt alle Insights ohne Pattern-Zuordnung
    ├── Sendet Zusammenfassungen an Claude (suggest-patterns.md Template)
    ├── Claude schlägt Gruppen vor
    └── Zeigt Vorschläge in UI
    ↓
[User bestätigt/modifiziert Pattern]
    ↓
[Pattern + Zuordnungen in DB gespeichert]
```

### Flow 3: Content-Generierung

```
[User erstellt Asset Request (Quell-Objekt + Output-Typ)]
    ↓
[Server Action: assets.ts]
    ├── Lädt Quell-Objekt aus DB
    ├── Lädt Brand Config aus DB
    ├── Wählt Prompt-Template nach Output-Typ
    ├── Baut kombinierten Prompt (Quell-Daten + Brand Guidelines + Template)
    ├── Ruft Claude Code Agent auf
    ├── Speichert generiertes Asset in DB (status: draft)
    └── Zeigt Entwurf in UI
    ↓
[User bearbeitet Entwurf in Markdown-Editor]
    ↓
[Optional: Tone Check via Claude]
    ↓
[User setzt Status auf 'approved' / exportiert als Markdown]
```

---

## AI Integration Design

### Claude Code Agent Aufruf

```typescript
// lib/ai.ts — Wrapper für Claude Code Agent
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function callClaude(prompt: string): Promise<string> {
  const { stdout } = await execFileAsync('claude', [
    '-p', prompt,
    '--output-format', 'text'
  ], {
    timeout: 120000, // 2 Minuten Timeout
    maxBuffer: 1024 * 1024 // 1MB Output Buffer
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

### DSGVO-Filter

```typescript
// lib/ai.ts — DSGVO-konformer Prompt-Bau
export function buildSafePrompt(template: string, data: Record<string, string>): string {
  // Rohdaten werden NICHT direkt an Claude gesendet
  // Stattdessen: Zusammenfassung, Typ, Kontext — keine Namen, keine E-Mails, keine Firmennamen
  const safeData = {
    ...data,
    content: data.summary || data.content?.substring(0, 500) || '', // Zusammenfassung bevorzugt
  };

  // Template-Variablen ersetzen
  let prompt = template;
  for (const [key, value] of Object.entries(safeData)) {
    prompt = prompt.replace(`{{${key}}}`, value);
  }
  return prompt;
}
```

### Prompt-Template-Beispiel (analyze-insight.md)

```markdown
Du bist ein Analyst im StrategAIze Intelligence Studio.

Analysiere den folgenden Inbox-Eintrag und klassifiziere ihn.

## Eingabe
- Typ: {{type}}
- Quelle: {{source}}
- Kontext: {{context}}
- Inhalt: {{content}}

## Aufgabe
Antworte im folgenden JSON-Format:
{
  "classification": "insight|objection|opportunity|improvement|content_angle|pattern_candidate|raw_idea|noise",
  "relevance": "high|medium|low",
  "relevance_reason": "...",
  "area": "sales|delivery|product|methodology|noise",
  "tags": ["tag1", "tag2"],
  "summary": "1-3 Sätze Zusammenfassung",
  "suggested_action": "decision_board|catalog|content|improvement|ignore"
}
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

### DSGVO-Datenschnitt (DEC-005)
- **Rohdaten** (Source Records mit Kunden-Transkripten, E-Mails, etc.) bleiben ausschließlich in SQLite
- **An Claude** gehen nur: Zusammenfassungen, Typ-Information, Kontext ohne personenbezogene Daten
- Der `buildSafePrompt`-Mechanismus in `lib/ai.ts` ist der zentrale Enforcement-Punkt
- Jede Server Action, die Claude aufruft, MUSS über `buildSafePrompt` gehen

### Lokale Sicherheit
- SQLite-Datei liegt im Projektverzeichnis — Zugriffschutz über OS-Level Berechtigungen
- Keine Netzwerk-Exposition — App läuft nur auf localhost
- Kein Auth nötig — Single-User-System, lokaler Zugriff

### Backup
- `data/studio.db` kann jederzeit kopiert werden
- Git-Tracking der .db-Datei ist NICHT empfohlen (binär, wächst)
- Empfehlung: Regelmäßige Dateikopie in Backup-Verzeichnis

---

## Constraints and Tradeoffs

### Tradeoff 1: better-sqlite3 (synchron) statt Prisma/Drizzle
- **Pro**: Kein ORM-Overhead, direktes SQL, maximale Kontrolle, schneller für Single-User
- **Contra**: Kein Schema-Generierung, kein Type-Safety auf Query-Ebene
- **Mitigation**: TypeScript-Typen in `lib/types.ts` manuell definiert, SQL-Migrations manuell verwaltet

### Tradeoff 2: Claude CLI statt API
- **Pro**: Kein API-Budget, Max-Subscription genutzt, einfach aufzurufen
- **Contra**: Latenz durch CLI-Startup (~2-5s pro Aufruf), keine Streaming-Unterstützung
- **Mitigation**: Für V1 akzeptabel, Batch-Analyse ist sequentiell nicht parallel

### Tradeoff 3: Server Actions statt REST API
- **Pro**: Weniger Boilerplate, typsicher end-to-end, Next.js-native
- **Contra**: Nicht von außen aufrufbar (kein separater API-Consumer in V1)
- **Mitigation**: Für Single-User lokale App perfekt passend

### Tradeoff 4: Flat Prompt Templates statt Prompt-Engineering-Framework
- **Pro**: Einfach, lesbar, direkt editierbar, keine Dependency
- **Contra**: Keine Prompt-Versionierung, kein A/B-Testing
- **Mitigation**: Templates liegen in `prompts/` — können jederzeit iteriert werden

---

## Open Technical Questions

Keine offenen Fragen. Alle architekturrelevanten Entscheidungen sind getroffen:
- Stack: Next.js + SQLite + Claude CLI (DEC-001 bis DEC-004)
- DSGVO: Filter-Layer in Server Actions (DEC-005)
- Datenmodell: 11 Tabellen + 2 Junction Tables + FTS5
- UI: shadcn/ui + Tailwind
- KI: Claude Code CLI über child_process

---

## Recommended Implementation Direction

1. **Slice 1**: Projektsetup (Next.js, SQLite, Schema-Migration, Basis-Layout mit Navigation)
2. **Slice 2**: Insight Inbox (FEAT-001) — CRUD + Import + Listenansicht
3. **Slice 3**: Insight Analyzer (FEAT-002) — Claude-Integration + Analyse-UI
4. **Slice 4**: Pattern Clustering (FEAT-003) — Pattern CRUD + Insight-Zuordnung
5. **Slice 5**: Improvement Engine (FEAT-004) — CRUD + KI-Ableitung
6. **Slice 6**: Opportunity Catalog (FEAT-005) — CRUD + Verlinkung
7. **Slice 7**: Decision Board (FEAT-006) — Board-View + Folgeaktionen
8. **Slice 8**: Brand Control (FEAT-008) — Brand Config UI (vor Content Transformer)
9. **Slice 9**: Content Transformer (FEAT-007) — Asset-Generierung + Bibliothek
10. **Slice 10**: Module Builder (FEAT-009) — Draft CRUD + Generierung
11. **Slice 11**: Knowledge Packaging (FEAT-010) — Package CRUD + Export

Die exakte Slice-Aufteilung wird in `/slice-planning` verfeinert.

---

## Recommended Next Step
`/slice-planning` — V1 in implementierbare Slices aufteilen.