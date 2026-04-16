# SLC-002 — Design-System-Grundstock

## Status
- Version: V1
- Feature: BL-021 (Design-System-Grundstock, neu in diesem Slice-Planning)
- Priority: Blocker
- Status: planned
- Created: 2026-04-16
- Worktree isolation: empfohlen (`slc-002-design-system`)

## Goal
Style Guide V2 wird vollständig als wiederverwendbare Komponenten-Bibliothek + Layout-Templates + Tailwind-Theme umgesetzt, bevor Feature-UIs gebaut werden. Ergebnis ist eine Design-System-Seite als Showcase, von der ab SLC-005 jeder Feature-Slice die Komponenten zieht.

## Hintergrund
DEC-017 fixiert Style Guide V2 als verbindliche Grundlage ab Tag 1. `feedback_design_system_first` Memory: „erste Frontend-Slice ist immer Design-System-Grundstock (Komponentenbibliothek + Tailwind-Theme + Layouts), bevor Feature-UIs gebaut werden". Kein späterer Rewrite.

## In Scope
- Tailwind-Theme-Extension mit Brand-Farben + Border-Radius + Max-Width (siehe ARCHITECTURE 7.2)
- `src/lib/design-tokens.ts` mit TS-Konstanten für Gradients, Status-Styles, Entity-Icon-Farben
- Komponenten-Bibliothek unter `apps/web/src/components/design-system/`:
  - Header, KPICard, FilterBar, VoiceButton, AIButton, StatusBadge, ContentCard, DeutschlandKarte, Modal, FormField, TextInput, Select, TextArea, Button, EmptyState, LoadingState, ErrorState
- Layout-Templates unter `apps/web/src/components/layouts/`:
  - Layout1Dashboard, Layout2MeinTag, Layout3Beziehungen, Layout4Pipeline, Layout5Aufgaben
- Voice/KI-Buttons: in V1 sichtbar, bei Click Toast „Voice/KI-Suche kommt mit V5" (keine Backend-Logik)
- Design-System-Showcase-Seite unter `/design-system` (nur in DEV/Admin sichtbar) — alle Komponenten mit allen Zuständen rendern
- Globale Styles in `apps/web/src/app/globals.css` mit Style-Guide-Farben als CSS-Variables
- Storybook-Ersatz: Playground-Seite reicht in V1 (kein Storybook — zu viel Overhead)

## Out of Scope
- Feature-Pages mit Daten (SLC-003..SLC-009)
- Voice/KI-Funktionalität (V5+)
- Deutschlandkarte mit echten Geo-Daten (SVG-Statisch in V1 reicht, Daten-Binding in SLC-006)
- Dark Mode (V8+)
- Accessibility-Full-Audit (V1 Best-Effort, Full-Audit in V5)

## Acceptance Criteria
- AC-01: `/design-system` zeigt alle Komponenten in ihren Zuständen (default, hover, disabled, loading, error, empty)
- AC-02: Tailwind-Build enthält alle Brand-Token, `bg-brand-primary` und Konsorten funktionieren
- AC-03: Alle 5 Layouts rendern mit Dummy-Inhalt und sind responsiv (Breakpoints: mobile < 640, tablet 640-1024, desktop > 1024)
- AC-04: Voice- und AI-Button sind in jeder FilterBar sichtbar, Click → Toast „kommt mit V5"
- AC-05: Modal-System funktioniert (Öffnen, Schließen, ESC, Outside-Click, Focus-Trap)
- AC-06: Keine Farb-/Radius-/Shadow-Klasse außerhalb Tailwind-Theme oder design-tokens.ts
- AC-07: TypeScript typed props für alle Komponenten, keine `any`

## Dependencies
- SLC-001 abgeschlossen (Repo + Next.js läuft)
- `/docs/STYLE_GUIDE_V2.md` als Spec-Grundlage
- shadcn/ui-Primitiven als Basis (Dialog für Modal, Input für TextInput, Select-Primitive, Toast)

## Risks
- Style Guide V2 ist umfangreich — Versuchung, „schnell mal V1-UI ohne System" zu bauen → aktiv gegensteuern
- Modal-Focus-Trap: ohne Testing bricht Keyboard-Navigation
- Voice/KI-Button-Toast muss einheitlich sein, sonst entsteht Inkonsistenz in späteren Slices

## Micro-Tasks

### MT-1: Tailwind-Theme + design-tokens.ts + globals.css
- Goal: Brand-Farben, Border-Radius, Max-Width als Tailwind-Extension. TS-Konstanten für Gradients und Status-Styles.
- Files: `apps/web/tailwind.config.ts`, `apps/web/src/lib/design-tokens.ts`, `apps/web/src/app/globals.css`.
- Expected behavior: `bg-brand-primary`, `rounded-xl`, `max-w-content` greifen. `getStatusStyle('active')` gibt typed Konstanten zurück.
- Verification: Dummy-Page mit allen Brand-Farben rendert visuell korrekt.
- Dependencies: none.

### MT-2: Core-Komponenten (Button, StatusBadge, FormField, TextInput, Select, TextArea)
- Goal: Primitive Form- und Action-Komponenten.
- Files: `apps/web/src/components/design-system/Button.tsx`, `StatusBadge.tsx`, `FormField.tsx`, `TextInput.tsx`, `Select.tsx`, `TextArea.tsx`, `index.ts`.
- Expected behavior: Varianten (Primary/Secondary/Danger), Sizes (sm/md/lg), Disabled-/Loading-States. FormField wrapped Label + Error + Hint.
- Verification: Storybook-ähnliche Seite rendert alle Varianten, visual review.
- Dependencies: MT-1.

### MT-3: Action-Komponenten (VoiceButton, AIButton, FilterBar, Header)
- Goal: Voice- und AI-Buttons mit Toast-Placeholder, FilterBar mit Such-Input + Filter-Dropdowns, Sticky-Header mit Backdrop-Blur.
- Files: `apps/web/src/components/design-system/VoiceButton.tsx`, `AIButton.tsx`, `FilterBar.tsx`, `Header.tsx`.
- Expected behavior: Voice- und AI-Click → sonner-Toast „kommt mit V5". FilterBar responsive. Header sticky mit Blur.
- Verification: Click-Verhalten getestet, Header scrollt korrekt.
- Dependencies: MT-2.

### MT-4: Container-Komponenten (KPICard, ContentCard, EmptyState, LoadingState, ErrorState)
- Goal: Content-Karten + Non-Happy-States.
- Files: `apps/web/src/components/design-system/KPICard.tsx`, `ContentCard.tsx`, `EmptyState.tsx`, `LoadingState.tsx`, `ErrorState.tsx`.
- Expected behavior: KPICard = 4-Spalten-Grid-fähig mit Icon + Gradient. ContentCard = Grid/List-tauglich mit Hover. Non-Happy-States einheitlich.
- Verification: Alle Varianten auf Showcase-Seite sichtbar.
- Dependencies: MT-2.

### MT-5: Modal-System + DeutschlandKarte
- Goal: Modal mit Focus-Trap + ESC + Outside-Click, Deutschland-Karte als SVG-Komponente (Daten-Binding optional).
- Files: `apps/web/src/components/design-system/Modal.tsx`, `DeutschlandKarte.tsx`, `apps/web/src/assets/deutschland.svg`.
- Expected behavior: Modal keyboard-tauglich. Deutschland-Karte rendert + Pins auf Koordinaten.
- Verification: Keyboard-Test (Tab, Shift-Tab, Esc), Map-Pins sichtbar.
- Dependencies: MT-4.

### MT-6: Layout-Templates (Layout1..Layout5)
- Goal: 5 Layouts als Template-Komponenten mit Content-Slots.
- Files: `apps/web/src/components/layouts/Layout1Dashboard.tsx`, `Layout2MeinTag.tsx`, `Layout3Beziehungen.tsx`, `Layout4Pipeline.tsx`, `Layout5Aufgaben.tsx`, `index.ts`.
- Expected behavior: Jedes Layout rendert Header + Content-Slot + ggf. Sidebar. Responsive auf 3 Breakpoints.
- Verification: Showcase-Seite zeigt jedes Layout mit Dummy-Inhalt.
- Dependencies: MT-3, MT-4.

### MT-7: Design-System-Showcase-Seite
- Goal: `/design-system`-Route, die alle Komponenten + Layouts mit allen Zuständen rendert. Nur für `strategaize_admin` sichtbar in PROD.
- Files: `apps/web/src/app/(app)/design-system/page.tsx`, `apps/web/src/app/(app)/design-system/ComponentsShowcase.tsx`, `LayoutsShowcase.tsx`.
- Expected behavior: Eine Seite, Navigation zwischen Komponenten und Layouts, alle Zustände visuell prüfbar.
- Verification: Browser-Test durch Entwickler.
- Dependencies: MT-5, MT-6.

## Verification
- `/qa` nach Slice-Abschluss
- Visual Review der Showcase-Seite
- Responsive-Check auf 3 Breakpoints
- Keyboard-Navigation im Modal
- Lint + Typecheck grün

## Next Slice
SLC-003 FEAT-001 Ingest-Onboarding.
