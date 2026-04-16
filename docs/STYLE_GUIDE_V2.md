# 🎨 STRATEGAIZE BUSINESS DEVELOPMENT - STYLE GUIDE V2

**Premium SaaS Design System für interne CRM-Tools**

Version: 2.0  
Letzte Aktualisierung: April 2026  
Status: Production Ready

---

## 📋 INHALTSVERZEICHNIS

1. [Design-Prinzipien](#design-prinzipien)
2. [Farbpalette](#farbpalette)
3. [Typografie](#typografie)
4. [Komponenten-Bibliothek](#komponenten-bibliothek)
5. [Layout-Templates](#layout-templates)
   - Layout 1: Dashboard
   - Layout 2: Mein Tag
   - Layout 3: Beziehungen (Multiplikatoren, Firmen, Kontakte)
   - Layout 4: Pipeline
   - Layout 5: Aktivitäten/Aufgaben
6. [Modal/Popup System](#modal-popup-system)
7. [Best Practices](#best-practices)

---

## 🎯 DESIGN-PRINZIPIEN

### Core Values
1. **Premium & Modern** - Hochwertige SaaS-Anmutung für tägliche Nutzung
2. **Informationsdichte** - Produktiv ohne Überfrachtung
3. **Konsistenz** - Gleiche Patterns über alle Seiten
4. **Interaktivität** - Voice + KI in allen Such- und Filterbereichen
5. **Wiederverwendbarkeit** - Komponenten als Bausteine für zukünftige Projekte

### Design-Standards
- **Border Radius:** `rounded-xl` (12px) für Cards, `rounded-lg` (8px) für Buttons
- **Border Width:** `border-2` (2px) für alle wichtigen Elemente
- **Shadows:** `shadow-lg` für Cards, `shadow-xl` für Hover
- **Transitions:** `transition-all` für smooth Animationen
- **Font Weights:** `font-bold` für Labels, `font-semibold` für Dropdowns
- **Spacing:** Konsistent 6er-Grid (gap-6, p-6, py-6, etc.)

---

## 🎨 FARBPALETTE

### Brand-Farben (Primär)

```css
/* Blau (Primär) */
--primary-dark: #120774;
--primary: #4454b8;

/* Grün (Erfolg) */
--success-dark: #00a84f;
--success: #4dcb8b;

/* Gelb (Warnung) */
--warning: #f2b705;
--warning-light: #ffd54f;
```

### Gradients

```tsx
// Primär (Blau)
className="bg-gradient-to-r from-[#120774] to-[#4454b8]"

// Erfolg (Grün)
className="bg-gradient-to-r from-[#00a84f] to-[#4dcb8b]"

// Warnung (Gelb)
className="bg-gradient-to-r from-[#f2b705] to-[#ffd54f]"

// KI (Lila/Indigo)
className="bg-gradient-to-r from-purple-600 to-indigo-600"
```

### Utility-Farben

```tsx
// Status-Badges
'Lead': slate (bg-slate-100, text-slate-700, border-slate-200)
'Qualifiziert': blue (bg-blue-100, text-blue-700, border-blue-200)
'Aktiv': orange (bg-orange-100, text-orange-700, border-orange-200)
'Kunde': emerald (bg-emerald-100, text-emerald-700, border-emerald-200)
'Inaktiv': slate-light (bg-slate-100, text-slate-400, border-slate-200)
```

### Hintergründe

```tsx
// Slate für Neutralität
bg-slate-50, bg-slate-100, bg-slate-200
border-slate-200, border-slate-300
text-slate-500, text-slate-600, text-slate-700, text-slate-900

// Weiß für Hauptflächen
bg-white

// Gradient-Hintergründe
bg-gradient-to-br from-slate-50 to-white
```

---

## ✍️ TYPOGRAFIE

### Font-Größen

```tsx
// Überschriften
h1: text-3xl (30px)
h2: text-2xl (24px)
h3: text-xl (20px)
h4: text-lg (18px)

// Body
body: text-sm (14px)
small: text-xs (12px)

// Display (KPIs)
display: text-4xl (36px)
display-large: text-5xl (48px)
```

### Font-Weights

```tsx
font-bold: 700 (Überschriften, Labels, Buttons)
font-semibold: 600 (Dropdowns, wichtige Texte)
font-medium: 500 (Body-Text, Hints)
```

### Textfarben

```tsx
// Primär
text-slate-900: Haupttext (Überschriften)
text-slate-700: Normaler Text (Labels, Body)
text-slate-600: Sekundärer Text (Subtitles)
text-slate-500: Tertiärer Text (Hints, Meta)
text-slate-400: Placeholder

// Kontext
text-blue-700: Links, Aktionen
text-emerald-700: Erfolg, Potenzial
text-orange-700: Warnung, Pipeline
text-red-700: Fehler, Danger
```

---

## 🧩 KOMPONENTEN-BIBLIOTHEK

### 1. HEADER COMPONENT

**Sticky Header für alle Seiten**

```tsx
<header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6 shadow-sm sticky top-0 z-20">
  <div className="max-w-[1800px] mx-auto">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
          Seitentitel
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Untertitel · Beschreibung
        </p>
      </div>

      {/* Optional: View Toggle, Actions, etc. */}
      <div className="flex items-center gap-2">
        {/* Action Buttons */}
      </div>
    </div>
  </div>
</header>
```

**Eigenschaften:**
- Transluzent mit Backdrop Blur
- Sticky Position (bleibt oben)
- Max-Width 1800px (zentriert)
- Border-Bottom für Trennung

---

### 2. KPI CARDS

**4-Spalten Grid für Metriken**

```tsx
<div className="grid grid-cols-4 gap-6">
  <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-lg relative overflow-hidden">
    {/* Top Accent Line */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#120774] to-[#4454b8]" />
    
    {/* Icon */}
    <div className="flex items-center justify-between mb-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#120774] to-[#4454b8] flex items-center justify-center shadow-lg">
        <Building2 size={24} className="text-white" strokeWidth={2.5} />
      </div>
    </div>
    
    {/* Metric */}
    <div className="text-4xl font-bold text-slate-900 mb-1">42</div>
    <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
      Label
    </div>
  </div>
</div>
```

**Varianten:**
- Blau: `from-[#120774] to-[#4454b8]` (Primär)
- Grün: `from-[#00a84f] to-[#4dcb8b]` (Erfolg)
- Gelb: `from-[#f2b705] to-[#ffd54f]` (Warnung)
- Emerald: `from-emerald-500 to-emerald-600` (Kunden)

---

### 3. FILTER & SUCHE MIT VOICE + KI

**Standard Filter-Leiste (alle Seiten gleich!)**

```tsx
<div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-6">
  <div className="flex items-center gap-4">
    {/* Suche */}
    <div className="w-[300px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={2.5} />
        <input
          type="text"
          placeholder="Suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-slate-200 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#4454b8] focus:ring-2 focus:ring-[#4454b8]/20 transition-all"
        />
      </div>
    </div>

    {/* MIKROFON-BUTTON (Voice) */}
    <button
      onClick={() => setIsRecording(!isRecording)}
      className={`px-4 py-2.5 rounded-lg border-2 font-bold text-sm transition-all flex items-center gap-2 ${
        isRecording 
          ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100 animate-pulse' 
          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
      }`}
    >
      <Mic size={16} strokeWidth={2.5} />
      {isRecording ? 'Aufnahme...' : 'Voice'}
    </button>

    {/* KI-BUTTON */}
    <button
      onClick={() => setIsAIProcessing(!isAIProcessing)}
      className={`px-4 py-2.5 rounded-lg border-2 font-bold text-sm transition-all flex items-center gap-2 ${
        isAIProcessing
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-transparent text-white shadow-lg'
          : 'bg-gradient-to-r from-[#120774] to-[#4454b8] border-transparent text-white hover:shadow-lg'
      }`}
    >
      <Sparkles size={16} strokeWidth={2.5} className={isAIProcessing ? 'animate-spin' : ''} />
      KI
    </button>

    {/* Filter Dropdowns */}
    <select className="px-4 py-2.5 rounded-lg border-2 border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#4454b8] focus:ring-2 focus:ring-[#4454b8]/20 transition-all cursor-pointer">
      <option>Filter 1</option>
    </select>

    {/* Action Button (z.B. "Neue Firma") */}
    <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00a84f] to-[#4dcb8b] text-white text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
      <Plus size={16} strokeWidth={2.5} />
      Neu erstellen
    </button>
  </div>
</div>
```

**WICHTIG:** Voice + KI Buttons sind auf ALLEN Seiten identisch!

---

### 4. STATUS BADGES

**Wiederverwendbare Badge-Komponente**

```tsx
function StatusBadge({ status }: { status: string }) {
  const styles = {
    'Lead': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', icon: '🎯' },
    'Qualifiziert': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: '✓' },
    'Aktiv': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: '🔥' },
    'Kunde': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: '⭐' },
    'Inaktiv': { bg: 'bg-slate-100', text: 'text-slate-400', border: 'border-slate-200', icon: '💤' },
  };
  const style = styles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
      <span>{style.icon}</span>
      {status}
    </span>
  );
}
```

---

### 5. CONTENT CARDS

**Grid-Ansicht Cards (2-Spalten)**

```tsx
<div 
  className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden hover:border-[#4454b8] hover:shadow-xl transition-all group cursor-pointer"
  onMouseEnter={() => setHoveredCard(id)}
  onMouseLeave={() => setHoveredCard(null)}
>
  {/* Header */}
  <div className="p-5 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
    <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-[#120774] transition-colors">
      Titel
    </h3>
    <div className="flex items-center gap-2">
      {/* Badges */}
    </div>
  </div>

  {/* Content */}
  <div className="p-5 bg-white">
    {/* Stats, Info, etc. */}
  </div>
</div>
```

**Features:**
- Hover-Effect (Border-Farbe + Shadow)
- Gradient-Header
- Smooth Transitions
- Group-Hover für Kind-Elemente

---

### 6. DEUTSCHLAND-KARTE

**Wiederverwendbare Karte-Komponente**

```tsx
import { DeutschlandKarte, plzToPosition } from '../components/DeutschlandKarte';

<DeutschlandKarte
  markers={items.map(item => ({
    id: item.id,
    name: item.name,
    position: plzToPosition(item.plz || '10115'),
    color: item.status === 'Kunde' ? '#10b981' : '#f97316',
    type: item.status,
    isActive: hoveredCard === item.id
  }))}
  hoveredId={hoveredCard}
  onMarkerHover={setHoveredCard}
/>
```

**Verwendet in:** Firmen, Kontakte, Multiplikatoren

---

## 📐 LAYOUT-TEMPLATES

---

## LAYOUT 1: DASHBOARD

**Verwendung:** Übersichts-Seite mit KPIs, Aktivitäten und Schnellzugriff

### Layout-Struktur

```
┌─────────────────────────────────────────────────┐
│ HEADER (Sticky)                                 │
│ - Titel: "Dashboard"                           │
│ - Subtitle: "Übersicht · Heute"                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ KPI CARDS (4-Spalten Grid)                     │
│ [Metrik 1] [Metrik 2] [Metrik 3] [Metrik 4]   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 2-Spalten Layout (8 + 4)                       │
│                                                 │
│ ┌─────────────────┐  ┌───────────────────┐    │
│ │ LINKS (8 Cols)  │  │ RECHTS (4 Cols)   │    │
│ │                 │  │                   │    │
│ │ - Quick Actions │  │ - Kalender        │    │
│ │ - Aktivitäten   │  │ - Nächste Schritte│    │
│ │ - Timeline      │  │ - Shortcuts       │    │
│ │                 │  │                   │    │
│ └─────────────────┘  └───────────────────┘    │
└─────────────────────────────────────────────────┘
```

### Code-Template

```tsx
export function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6 shadow-sm sticky top-0 z-20">
        <div className="max-w-[1800px] mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Dashboard</h1>
          <p className="text-sm text-slate-600 font-medium">Übersicht · Heute</p>
        </div>
      </header>

      {/* MAIN */}
      <main className="px-8 py-8">
        <div className="max-w-[1800px] mx-auto space-y-6">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-4 gap-6">
            {/* KPI Card 1 */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#120774] to-[#4454b8]" />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#120774] to-[#4454b8] flex items-center justify-center shadow-lg mb-3">
                <Icon size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-1">42</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Metrik</div>
            </div>
            {/* Repeat for 4 KPIs */}
          </div>

          {/* 2-SPALTEN LAYOUT */}
          <div className="grid grid-cols-12 gap-6">
            {/* LINKS (8 Cols) */}
            <div className="col-span-8 space-y-6">
              {/* Content Cards */}
            </div>

            {/* RECHTS (4 Cols) - Sticky */}
            <div className="col-span-4">
              <div className="sticky top-32 space-y-6">
                {/* Sidebar Content */}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
```

### Key Features
- ✅ 4 KPI Cards oben
- ✅ 2-Spalten Layout (8+4)
- ✅ Rechte Spalte ist sticky
- ✅ Keine Filter-Leiste (da Übersicht)

---

## LAYOUT 2: MEIN TAG

**Verwendung:** Tagesübersicht mit Timeline, priorisierten Aufgaben und Terminen

### Layout-Struktur

```
┌─────────────────────────────────────────────────┐
│ HEADER (Sticky)                                 │
│ - Titel: "Mein Tag"                            │
│ - Datum: Heute mit Wochentag                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ KPI CARDS (3-4 Spalten)                        │
│ [Aufgaben] [Meetings] [Calls] [Follow-ups]    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 2-Spalten Layout (8 + 4)                       │
│                                                 │
│ ┌─────────────────┐  ┌───────────────────┐    │
│ │ LINKS (8 Cols)  │  │ RECHTS (4 Cols)   │    │
│ │                 │  │                   │    │
│ │ - Timeline      │  │ - Kalender        │    │
│ │ - Prioritäten   │  │ - Top 5 Tasks     │    │
│ │ - Termine       │  │ - Quick Notes     │    │
│ │                 │  │                   │    │
│ └─────────────────┘  └───────────────────┘    │
└─────────────────────────────────────────────────┘
```

### Code-Template

```tsx
export function MeinTag() {
  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6 shadow-sm sticky top-0 z-20">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Mein Tag</h1>
              <p className="text-sm text-slate-600 font-medium">
                {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="px-8 py-8">
        <div className="max-w-[1800px] mx-auto space-y-6">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-4 gap-6">
            {/* KPIs für Tagesübersicht */}
          </div>

          {/* 2-SPALTEN LAYOUT */}
          <div className="grid grid-cols-12 gap-6">
            {/* TIMELINE & TASKS (8 Cols) */}
            <div className="col-span-8 space-y-6">
              {/* Timeline, Aufgaben, Termine */}
            </div>

            {/* SIDEBAR (4 Cols) - Sticky */}
            <div className="col-span-4">
              <div className="sticky top-32 space-y-6">
                {/* Kalender, Top Tasks, Notes */}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
```

### Key Features
- ✅ Datum im Header
- ✅ Timeline-Ansicht links
- ✅ Kalender + Top Tasks rechts
- ✅ Keine komplexe Filter-Leiste (nur Tages-Fokus)

---

## LAYOUT 3: BEZIEHUNGEN (Multiplikatoren, Firmen, Kontakte)

**Verwendung:** Listen-/Grid-Ansicht mit Filter, Suche, Deutschland-Karte

### Layout-Struktur

```
┌─────────────────────────────────────────────────┐
│ HEADER (Sticky)                                 │
│ - Titel: "Firmen" / "Kontakte" / "Multiplikat."│
│ - View Toggle (Grid/List)                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ KPI CARDS (4-Spalten Grid)                     │
│ [Total] [Potenzial] [Pipeline] [Kunden]       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FILTER & SUCHE                                  │
│ [Suche] [Voice] [KI] [Filter] [Neu erstellen] │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 2-Spalten Layout (8 + 4)                       │
│                                                 │
│ ┌─────────────────┐  ┌───────────────────┐    │
│ │ LINKS (8 Cols)  │  │ RECHTS (4 Cols)   │    │
│ │                 │  │                   │    │
│ │ GRID (2 Cols):  │  │ - PLZ-Filter      │    │
│ │ ┌────┐ ┌────┐  │  │ - Deutschlandkarte│    │
│ │ │Card│ │Card│  │  │ - Stats           │    │
│ │ └────┘ └────┘  │  │                   │    │
│ │ ┌────┐ ┌────┐  │  │ (Sticky!)         │    │
│ │ │Card│ │Card│  │  │                   │    │
│ │ └────┘ └────┘  │  │                   │    │
│ └─────────────────┘  └───────────────────┘    │
└─────────────────────────────────────────────────┘
```

### Code-Template (REFERENZ: Firmen-Seite)

```tsx
export function Beziehungen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6 shadow-sm sticky top-0 z-20">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Firmen</h1>
              <p className="text-sm text-slate-600 font-medium">Unternehmensmanagement · Leads, Pipeline & Kunden</p>
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="px-8 py-8">
        <div className="max-w-[1800px] mx-auto space-y-6">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-4 gap-6">
            {/* 4 KPI Cards */}
          </div>

          {/* FILTER & SUCHE MIT VOICE + KI */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-6">
            <div className="flex items-center gap-4">
              {/* SUCHE */}
              <div className="w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={2.5} />
                  <input
                    type="text"
                    placeholder="Firma oder Branche suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-slate-200 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#4454b8] focus:ring-2 focus:ring-[#4454b8]/20 transition-all"
                  />
                </div>
              </div>

              {/* MIKROFON-BUTTON */}
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`px-4 py-2.5 rounded-lg border-2 font-bold text-sm transition-all flex items-center gap-2 ${
                  isRecording 
                    ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100 animate-pulse' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <Mic size={16} strokeWidth={2.5} />
                {isRecording ? 'Aufnahme...' : 'Voice'}
              </button>

              {/* KI-BUTTON */}
              <button
                onClick={() => setIsAIProcessing(!isAIProcessing)}
                className={`px-4 py-2.5 rounded-lg border-2 font-bold text-sm transition-all flex items-center gap-2 ${
                  isAIProcessing
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-transparent text-white shadow-lg'
                    : 'bg-gradient-to-r from-[#120774] to-[#4454b8] border-transparent text-white hover:shadow-lg'
                }`}
              >
                <Sparkles size={16} strokeWidth={2.5} className={isAIProcessing ? 'animate-spin' : ''} />
                KI
              </button>

              {/* FILTER DROPDOWNS */}
              <select className="px-4 py-2.5 rounded-lg border-2 border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#4454b8] focus:ring-2 focus:ring-[#4454b8]/20 transition-all cursor-pointer">
                <option value="Alle">Alle Status</option>
              </select>

              {/* NEUE FIRMA BUTTON */}
              <button 
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00a84f] to-[#4dcb8b] text-white text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                onClick={() => setShowModal(true)}
              >
                <Building2 size={16} strokeWidth={2.5} />
                Neue Firma
              </button>
            </div>
          </div>

          {/* 2-SPALTEN LAYOUT: CARDS + KARTE */}
          <div className="grid grid-cols-12 gap-6">
            {/* FIRMEN CARDS - 2 SPALTEN LINKS (8 Cols) */}
            <div className="col-span-8">
              <div className="grid grid-cols-2 gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden hover:border-[#4454b8] hover:shadow-xl transition-all group cursor-pointer"
                  >
                    {/* Card Content */}
                  </div>
                ))}
              </div>
            </div>

            {/* DEUTSCHLAND-KARTE RECHTS (4 Cols) - FIXIERT */}
            <div className="col-span-4">
              <div className="sticky top-32">
                {/* PLZ-FILTER */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-4 mb-4">
                  {/* PLZ Input */}
                </div>

                {/* DEUTSCHLAND-KARTE */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Map size={16} strokeWidth={2.5} className="text-[#4454b8]" />
                      Deutschland
                    </h3>
                  </div>
                  
                  <div className="relative rounded-xl border-2 border-slate-200 overflow-hidden">
                    <DeutschlandKarte
                      markers={items.map(item => ({
                        id: item.id,
                        name: item.name,
                        position: plzToPosition(item.plz || '10115'),
                        color: getColorByStatus(item.status),
                        type: item.status,
                        isActive: hoveredCard === item.id
                      }))}
                      hoveredId={hoveredCard}
                      onMarkerHover={setHoveredCard}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
```

### Key Features
- ✅ **View Toggle** (Grid/List) im Header
- ✅ **Filter-Leiste mit Voice + KI** (Standard!)
- ✅ **2-Spalten Grid:** 8 Cols Cards + 4 Cols Karte
- ✅ **Deutschland-Karte** rechts (sticky!)
- ✅ **Hover-Sync** zwischen Cards und Karte
- ✅ **"Neu erstellen" Button** (grün) in Filter-Leiste

**Verwenden für:** Firmen, Kontakte, Multiplikatoren (identisches Layout!)

---

## LAYOUT 4: PIPELINE

**Verwendung:** Kanban-Board / Deal-Flow Ansicht

### Layout-Struktur

```
┌─────────────────────────────────────────────────┐
│ HEADER (Sticky)                                 │
│ - Titel: "Pipeline"                            │
│ - View Toggle (Kanban/Timeline)                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ KPI CARDS (4-Spalten)                          │
│ [Gesamt] [Qualifiziert] [Verhandlung] [Gewon.]│
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FILTER & SUCHE                                  │
│ [Suche] [Voice] [KI] [Filter] [Neu Deal]      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ KANBAN BOARD (Horizontal Scroll)               │
│                                                 │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ Lead │ │Quali.│ │Verh. │ │Vertr.│ │Gewon.│ │
│ │──────│ │──────│ │──────│ │──────│ │──────│ │
│ │ Card │ │ Card │ │ Card │ │ Card │ │ Card │ │
│ │ Card │ │ Card │ │ Card │ │      │ │ Card │ │
│ │ Card │ │      │ │      │ │      │ │      │ │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
└─────────────────────────────────────────────────┘
```

### Code-Template

```tsx
export function Pipeline() {
  const [viewMode, setViewMode] = useState<'kanban' | 'timeline'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  const stages = ['Lead', 'Qualifiziert', 'Verhandlung', 'Vertrag', 'Gewonnen'];

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6 shadow-sm sticky top-0 z-20">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Pipeline</h1>
              <p className="text-sm text-slate-600 font-medium">Deal-Flow · Opportunities & Abschlüsse</p>
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                  viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                  viewMode === 'timeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Timeline
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="px-8 py-8">
        <div className="max-w-[1800px] mx-auto space-y-6">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-4 gap-6">
            {/* KPIs */}
          </div>

          {/* FILTER & SUCHE MIT VOICE + KI */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-6">
            <div className="flex items-center gap-4">
              {/* Suche, Voice, KI, Filter, "Neuer Deal" Button */}
            </div>
          </div>

          {/* KANBAN BOARD */}
          <div className="flex gap-6 overflow-x-auto pb-4">
            {stages.map((stage) => (
              <div key={stage} className="flex-shrink-0 w-80">
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-4">
                  {/* Stage Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">{stage}</h3>
                    <span className="text-xs font-bold text-slate-500">3 Deals</span>
                  </div>

                  {/* Deal Cards */}
                  <div className="space-y-3">
                    {/* Deal Card */}
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 hover:border-[#4454b8] transition-all cursor-grab">
                      {/* Deal Content */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
```

### Key Features
- ✅ View Toggle (Kanban/Timeline)
- ✅ Filter-Leiste mit Voice + KI
- ✅ Horizontal scrollendes Kanban-Board
- ✅ Drag & Drop (optional, mit react-dnd)
- ✅ Stage-Spalten mit Deal-Cards

---

## LAYOUT 5: AKTIVITÄTEN / AUFGABEN

**Verwendung:** Aufgaben-Management, To-Dos, Follow-ups

### Layout-Struktur

```
┌─────────────────────────────────────────────────┐
│ HEADER (Sticky)                                 │
│ - Titel: "Aufgaben"                            │
│ - View Toggle (Liste/Kalender)                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ KPI CARDS (4-Spalten)                          │
│ [Gesamt] [Heute] [Überfällig] [Erledigt]      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FILTER & SUCHE                                  │
│ [Suche] [Voice] [KI] [Filter] [Neue Aufgabe]  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ AUFGABEN-LISTE                                  │
│                                                 │
│ ┌───────────────────────────────────────────┐  │
│ │ [✓] Aufgabe 1                      Heute   │  │
│ │ [✓] Aufgabe 2                  Morgen      │  │
│ │ [✓] Aufgabe 3                  15.04.     │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ Oder: Gruppiert nach Status/Datum              │
└─────────────────────────────────────────────────┘
```

### Code-Template

```tsx
export function Aufgaben() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'Alle' | 'Offen' | 'Erledigt'>('Alle');

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6 shadow-sm sticky top-0 z-20">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Aufgaben</h1>
              <p className="text-sm text-slate-600 font-medium">Aktivitäten · To-Dos & Follow-ups</p>
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                  viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Kalender
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="px-8 py-8">
        <div className="max-w-[1800px] mx-auto space-y-6">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-4 gap-6">
            {/* KPIs */}
          </div>

          {/* FILTER & SUCHE MIT VOICE + KI */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-6">
            <div className="flex items-center gap-4">
              {/* Suche, Voice, KI, Filter, "Neue Aufgabe" Button */}
            </div>
          </div>

          {/* AUFGABEN-LISTE */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
            <div className="divide-y divide-slate-200">
              {/* Aufgabe */}
              <div className="p-4 hover:bg-slate-50 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-slate-300 text-[#4454b8] focus:ring-[#4454b8]/20"
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#120774]">
                      Aufgabentitel
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Beschreibung oder Notizen
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600">Heute</span>
                    <StatusBadge status="Offen" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
```

### Key Features
- ✅ View Toggle (Liste/Kalender)
- ✅ Filter-Leiste mit Voice + KI
- ✅ Checkbox für Erledig-Status
- ✅ Gruppierung nach Datum/Status (optional)
- ✅ Hover-Effects für Interaktivität

---

## 🪟 MODAL / POPUP SYSTEM

**Verwendung:** Alle "Neu erstellen" Formulare (Firma, Kontakt, Aufgabe, Deal, etc.)

### Modal-Struktur

```
┌────────────────────────────────────────────┐
│ HEADER (mit Icon + Accent Line)           │
│ ┌────┐ Titel                          [X] │
│ │Icon│ Untertitel                         │
│ └────┘                                     │
├────────────────────────────────────────────┤
│ CONTENT (Scrollable)                       │
│                                            │
│ ─── SEKTION 1 ────────────────────────    │
│ [Input]                                    │
│ [Input]                                    │
│                                            │
│ ─── SEKTION 2 ────────────────────────    │
│ [Input]                                    │
│ [Select]                                   │
│                                            │
├────────────────────────────────────────────┤
│ FOOTER (Actions)                           │
│                      [Abbrechen] [Speichern]│
└────────────────────────────────────────────┘
```

### Modal-Komponenten

**1. Haupt-Modal**
```tsx
import { Modal } from './components/Modal';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Neue Firma"
  subtitle="Fügen Sie eine neue Firma zu Ihrem CRM hinzu"
  icon={<Building2 size={28} className="text-white" strokeWidth={2.5} />}
  iconBgColor="from-[#120774] to-[#4454b8]"
  size="lg"
  footer={
    <div className="flex items-center justify-end gap-3">
      <Button variant="secondary" onClick={handleCancel}>
        <X size={16} />
        Abbrechen
      </Button>
      <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
        <Save size={16} />
        Speichern
      </Button>
    </div>
  }
>
  {/* Content */}
</Modal>
```

**2. Form-Felder**
```tsx
import { FormField, TextInput, Select, TextArea, FormSection } from './components/Modal';

{/* Sektion */}
<FormSection 
  title="Basis-Informationen" 
  subtitle="Grundlegende Firmendaten"
/>

{/* Input mit Label */}
<FormField 
  label="Firmenname" 
  required
  error={errors.firmenname}
  hint="Optional: Hinweistext"
>
  <TextInput
    placeholder="z.B. Acme Corporation GmbH"
    value={formData.firmenname}
    onChange={(e) => handleChange('firmenname', e.target.value)}
    error={!!errors.firmenname}
  />
</FormField>

{/* Select */}
<FormField label="Branche">
  <Select value={value} onChange={handleChange}>
    <option value="">— Auswählen —</option>
    <option value="IT">IT & Software</option>
  </Select>
</FormField>

{/* TextArea */}
<FormField label="Notizen">
  <TextArea
    placeholder="Zusätzliche Informationen..."
    rows={4}
    value={value}
    onChange={handleChange}
  />
</FormField>
```

**3. Buttons**
```tsx
import { Button } from './components/Modal';

{/* Primary */}
<Button variant="primary" onClick={handleSave} loading={isLoading}>
  <Save size={16} />
  Speichern
</Button>

{/* Secondary */}
<Button variant="secondary" onClick={handleCancel}>
  <X size={16} />
  Abbrechen
</Button>

{/* Danger */}
<Button variant="danger" onClick={handleDelete}>
  <Trash2 size={16} />
  Löschen
</Button>
```

### Icon-Farben für verschiedene Modals

```tsx
// Firma (Blau)
iconBgColor="from-[#120774] to-[#4454b8]"

// Kontakt (Grün)
iconBgColor="from-[#00a84f] to-[#4dcb8b]"

// Aufgabe (Gelb)
iconBgColor="from-[#f2b705] to-[#ffd54f]"

// Deal (Blau-Lila)
iconBgColor="from-blue-500 to-indigo-600"

// Multiplikator (Lila)
iconBgColor="from-purple-500 to-purple-600"
```

### Modal Best Practices

1. **Validierung:** Immer Required-Felder validieren
2. **Loading States:** Zeige Spinner während Submit
3. **Error Handling:** Klare Fehlermeldungen unter Inputs
4. **2-Column Layout:** `grid grid-cols-2 gap-4` für Formulare
5. **Sektionen:** Gruppiere verwandte Felder mit `FormSection`
6. **Keyboard Support:** ESC schließt Modal (bereits eingebaut)
7. **Click Outside:** Klick auf Overlay schließt Modal (bereits eingebaut)

### Vollständiges Modal-Beispiel

Siehe: `/src/app/components/NeueFirmaModal.tsx` als Referenz-Implementation!

---

## ✅ BEST PRACTICES

### 1. Konsistenz

- **Alle "Beziehungen"-Seiten** (Firmen, Kontakte, Multiplikatoren) verwenden **identisches Layout**
- **Voice + KI Buttons** sind auf **allen Seiten gleich** (Position, Style, Funktion)
- **Filter-Leiste** hat immer gleiche Struktur: Suche → Voice → KI → Dropdowns → Action-Button
- **Spacing:** Immer `gap-6` zwischen Sections, `gap-4` innerhalb Sections
- **Border Radius:** `rounded-xl` für Cards, `rounded-lg` für Buttons/Inputs

### 2. Interaktivität

- **Hover-Effects:** Cards sollen bei Hover Border-Farbe + Shadow ändern
- **Group-Hover:** Nutze `group` und `group-hover:` für Kind-Elemente
- **Transitions:** Immer `transition-all` für smooth Animationen
- **Loading States:** Zeige Spinner oder "Pulse" während Aktionen
- **Keyboard Support:** Alle Modals schließen mit ESC

### 3. Performance

- **Sticky Sidebar:** Rechte Spalte mit `sticky top-32` fixieren
- **Virtualisierung:** Bei langen Listen (>100 Items) react-window verwenden
- **Lazy Loading:** Bilder/Karten nur bei Bedarf laden
- **Debounce:** Such-Inputs mit 300ms Debounce

### 4. Accessibility

- **Labels:** Alle Inputs brauchen Labels (auch wenn hidden)
- **Title Attribute:** Buttons mit Icons brauchen `title` für Tooltips
- **Contrast:** Mindestens 4.5:1 für Text auf Background
- **Focus States:** Immer sichtbare Focus-Rings (`focus:ring-2`)

### 5. Responsive (Optional)

Falls gewünscht:
```tsx
// Desktop: 2-Spalten
className="grid grid-cols-12 gap-6"

// Tablet: 1-Spalte
className="lg:grid-cols-12 md:grid-cols-1"
```

### 6. Code-Organisation

```
/src/app/
├── components/
│   ├── Modal.tsx              (Generisches Modal-System)
│   ├── DeutschlandKarte.tsx   (Wiederverwendbare Karte)
│   ├── NeueFirmaModal.tsx     (Beispiel-Modal)
│   └── ...
├── pages/
│   ├── Dashboard.tsx          (Layout 1)
│   ├── MeinTag.tsx            (Layout 2)
│   ├── Firmen.tsx             (Layout 3)
│   ├── Kontakte.tsx           (Layout 3)
│   ├── Multiplikatoren.tsx    (Layout 3)
│   ├── Pipeline.tsx           (Layout 4)
│   └── Aufgaben.tsx           (Layout 5)
└── routes.tsx
```

---

## 🎯 QUICK REFERENCE

### Standard-Komponenten Import

```tsx
// Icons
import { Building2, Users, Search, Mic, Sparkles, Plus } from 'lucide-react';

// Modal-System
import { Modal, FormField, TextInput, Select, Button } from './components/Modal';

// Deutschland-Karte
import { DeutschlandKarte, plzToPosition } from './components/DeutschlandKarte';
```

### Standard State

```tsx
const [searchQuery, setSearchQuery] = useState('');
const [isRecording, setIsRecording] = useState(false);
const [isAIProcessing, setIsAIProcessing] = useState(false);
const [hoveredCard, setHoveredCard] = useState<number | null>(null);
const [showModal, setShowModal] = useState(false);
```

### Standard Filter-Leiste

```tsx
<div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-6">
  <div className="flex items-center gap-4">
    {/* Suche (300px) */}
    <div className="w-[300px]">{/* ... */}</div>
    
    {/* Voice Button */}
    <button className={isRecording ? 'pulse' : 'normal'}>{/* ... */}</button>
    
    {/* KI Button */}
    <button className="gradient-blue">{/* ... */}</button>
    
    {/* Dropdowns */}
    <select>{/* ... */}</select>
    
    {/* Action Button (Grün) */}
    <button className="gradient-green">{/* ... */}</button>
  </div>
</div>
```

---

## 📝 ZUSAMMENFASSUNG

### Die 5 Layouts

1. **Dashboard** - KPIs + 2-Spalten (Aktivitäten + Sidebar)
2. **Mein Tag** - Timeline + Kalender (tagesfokussiert)
3. **Beziehungen** - Grid/List + Deutschland-Karte (Filter mit Voice+KI)
4. **Pipeline** - Kanban-Board (horizontale Stages)
5. **Aufgaben** - Liste mit Checkboxen (gruppierbar)

### Wiederverwendbare Komponenten

- ✅ Header (Sticky)
- ✅ KPI Cards (4-Spalten)
- ✅ Filter-Leiste mit Voice + KI
- ✅ Content Cards (Grid/List)
- ✅ Deutschland-Karte
- ✅ Modal-System (Popup)
- ✅ Status Badges
- ✅ Form-Komponenten

### Standard-Features auf allen Seiten

- ✅ Sticky Header mit Backdrop Blur
- ✅ Max-Width 1800px (zentriert)
- ✅ Voice + KI Buttons in Such-/Filterbereichen
- ✅ Konsistente Farben, Spacing, Border-Radii
- ✅ Hover-Effects & Smooth Transitions
- ✅ "Neu erstellen" Button (grün) in Filter-Leiste

---

**Dieser Style Guide ist production-ready und kann als Basis für alle zukünftigen internen CRM-Tools verwendet werden!** 🚀

---

## 📄 VERWENDUNG IN CLAUDE / CURSOR

**So verwendest du diesen Style Guide:**

1. Kopiere dieses Dokument in dein Projekt
2. Referenziere beim Prompt: "Erstelle eine neue Seite basierend auf Layout 3 aus dem Style Guide"
3. Alle Komponenten sind dokumentiert und wiederverwendbar
4. Code-Beispiele können direkt kopiert werden

**Für neue Seiten:**
- Identifiziere das passende Layout (1-5)
- Kopiere das Code-Template
- Passe Daten und Logik an
- Behalte alle Standard-Komponenten (Header, Filter, etc.) bei

**Für neue Modals:**
- Verwende Modal-System aus `/src/app/components/Modal.tsx`
- Folge Beispiel in `NeueFirmaModal.tsx`
- Passe Icon-Farbe und Felder an

**Das war's!** 🎉
