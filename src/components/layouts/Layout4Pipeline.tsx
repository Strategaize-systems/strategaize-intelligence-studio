// Layout 4 — Pipeline (Kanban-Style, Style Guide V2)
// Header + Spalten-Container fuer Status-basierte Karten. Genutzt fuer Campaigns.

import { Header } from "@/components/design-system/Header";
import { cn } from "@/lib/utils";

interface Layout4PipelineProps {
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode; // typically grid of columns
  className?: string;
}

export function Layout4Pipeline({
  title,
  subtitle,
  headerActions,
  filters,
  children,
  className,
}: Layout4PipelineProps) {
  return (
    <div className={cn("min-h-screen bg-slate-50", className)}>
      <Header title={title} subtitle={subtitle} actions={headerActions} />
      <main className="max-w-page mx-auto px-8 py-8 space-y-6">
        {filters}
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] gap-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
