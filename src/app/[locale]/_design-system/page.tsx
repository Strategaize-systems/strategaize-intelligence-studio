// Design-System-Showcase — Smoke-Test + Live-Referenz fuer Style Guide V2.
// Route: /[locale]/_design-system
// Underscore-Prefix verhindert Routen-Konflikte mit Echt-Routen.

import { Header, KPICard, FilterBar, Button, VoiceButton, AIButton, StatusBadge, ContentCard, Input, Textarea, Select, Checkbox, FormField } from "@/components/design-system";
import { Layout1Dashboard, Layout2MeinTag, Layout3Beziehungen, Layout4Pipeline, Layout5Aufgaben } from "@/components/layouts";

export default async function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Design System V2 — Showcase"
        subtitle="Style Guide V2 Komponenten und Layouts (DEC-017)"
        actions={
          <>
            <VoiceButton />
            <AIButton />
            <Button>Action</Button>
          </>
        }
      />

      <div className="max-w-page mx-auto px-8 py-8 space-y-12">
        {/* ── KPI Cards ─────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">KPI Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard label="Leads" value={42} hint="+12 vs. letzte Woche" tone="brand" />
            <KPICard label="Aktive Kampagnen" value={3} tone="success" />
            <KPICard label="Pipeline EUR" value="48k" tone="warning" />
            <KPICard label="KI-Generierungen" value={128} tone="ai" />
          </div>
        </section>

        {/* ── Buttons ───────────────────────────── */}
        <ContentCard title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <VoiceButton />
            <VoiceButton active />
            <AIButton />
          </div>
        </ContentCard>

        {/* ── Status Badges ─────────────────────── */}
        <ContentCard title="Status Badges">
          <div className="flex flex-wrap gap-2">
            <StatusBadge label="Lead" tone="neutral" />
            <StatusBadge label="Qualifiziert" tone="info" />
            <StatusBadge label="Aktiv" tone="warning" />
            <StatusBadge label="Kunde" tone="success" />
            <StatusBadge label="Inaktiv" tone="muted" />
            <StatusBadge label="Fehler" tone="danger" />
          </div>
        </ContentCard>

        {/* ── Form Components ───────────────────── */}
        <ContentCard title="Form Components">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Firmenname" required hint="Domain wird automatisch ergaenzt">
              <Input placeholder="StrategAIze GmbH" />
            </FormField>
            <FormField label="Industrie">
              <Select defaultValue="">
                <option value="" disabled>Bitte waehlen…</option>
                <option value="saas">SaaS</option>
                <option value="agency">Agentur</option>
                <option value="consulting">Beratung</option>
              </Select>
            </FormField>
            <FormField label="Notizen" className="md:col-span-2">
              <Textarea placeholder="Optionale Notizen zum Lead…" />
            </FormField>
            <FormField label="Einstellungen" className="md:col-span-2">
              <div className="flex flex-col gap-2">
                <Checkbox label="Per E-Mail benachrichtigen" />
                <Checkbox label="Pipeline-Push aktivieren (Flag)" defaultChecked />
              </div>
            </FormField>
          </div>
        </ContentCard>

        {/* ── FilterBar ─────────────────────────── */}
        <ContentCard title="FilterBar">
          <FilterBar
            actions={
              <>
                <Button variant="secondary" size="sm">Reset</Button>
                <Button size="sm">Anwenden</Button>
              </>
            }
          >
            <Input placeholder="Suchen…" className="max-w-xs" />
            <Select className="max-w-xs">
              <option>Alle Industrien</option>
              <option>SaaS</option>
              <option>Agentur</option>
            </Select>
          </FilterBar>
        </ContentCard>

        {/* ── Layouts (Mini-Previews) ───────────── */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Layouts (Mini-Preview)</h2>
          <div className="space-y-6 text-sm text-slate-700">
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 bg-white">
              <p className="font-bold text-slate-900 mb-2">Layout1Dashboard</p>
              <p>Header + KPI-Grid + Hauptbereich + optionale Sidebar (320px). Genutzt fuer /handoffs/dashboard.</p>
            </div>
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 bg-white">
              <p className="font-bold text-slate-900 mb-2">Layout2MeinTag</p>
              <p>Header + 2-Spalten Tagesansicht (Primary 2fr / Secondary 1fr).</p>
            </div>
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 bg-white">
              <p className="font-bold text-slate-900 mb-2">Layout3Beziehungen</p>
              <p>Header + FilterBar + Listen-Body. Genutzt fuer ICP, Segments, Leads, Assets, Pitches.</p>
            </div>
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 bg-white">
              <p className="font-bold text-slate-900 mb-2">Layout4Pipeline</p>
              <p>Header + horizontaler Spalten-Container fuer Status-Kanban. Genutzt fuer /campaigns.</p>
            </div>
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 bg-white">
              <p className="font-bold text-slate-900 mb-2">Layout5Aufgaben</p>
              <p>Header + Summary + FilterBar + Stream-Liste. Genutzt fuer research_runs, handoffs.</p>
            </div>
          </div>
        </section>

        {/* Layouts werden hier bewusst NICHT live gerendert — sie wuerden den Header doppelt zeichnen.
            Verifikation der Layouts erfolgt in den Feature-Slices SLC-102..108. */}
        <p className="text-xs text-slate-500">
          Layout-Komponenten werden in den Feature-Slices (SLC-102..108) live verwendet und geprueft.
          Importe verifiziert: Layout1Dashboard, Layout2MeinTag, Layout3Beziehungen, Layout4Pipeline,
          Layout5Aufgaben sind importierbar.
        </p>
      </div>
    </div>
  );
}

// Layout-Imports zur Compile-Zeit-Verifikation (nicht im JSX gerendert)
void Layout1Dashboard;
void Layout2MeinTag;
void Layout3Beziehungen;
void Layout4Pipeline;
void Layout5Aufgaben;
