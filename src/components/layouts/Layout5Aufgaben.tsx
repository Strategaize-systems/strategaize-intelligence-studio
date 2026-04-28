// Layout 5 — Aktivitaeten/Aufgaben (Liste + Status, Style Guide V2)
// Header + FilterBar + Stream/Liste mit Status-Indikator.
// Genutzt fuer research_runs, handoffs.

import { Header } from "@/components/design-system/Header";
import { cn } from "@/lib/utils";

interface Layout5AufgabenProps {
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  filters?: React.ReactNode;
  summary?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Layout5Aufgaben({
  title,
  subtitle,
  headerActions,
  filters,
  summary,
  children,
  className,
}: Layout5AufgabenProps) {
  return (
    <div className={cn("min-h-screen bg-slate-50", className)}>
      <Header title={title} subtitle={subtitle} actions={headerActions} />
      <main className="max-w-page mx-auto px-8 py-8 space-y-6">
        {summary}
        {filters}
        <div className="space-y-3">{children}</div>
      </main>
    </div>
  );
}
