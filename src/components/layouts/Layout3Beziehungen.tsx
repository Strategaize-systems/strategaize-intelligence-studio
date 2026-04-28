// Layout 3 — Beziehungen (Listen-Layout, Style Guide V2)
// Header + FilterBar-Slot + List/Table-Body. Genutzt fuer ICP, Segments, Leads, Assets, Pitches, Handoffs.

import { Header } from "@/components/design-system/Header";
import { cn } from "@/lib/utils";

interface Layout3BeziehungenProps {
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Layout3Beziehungen({
  title,
  subtitle,
  headerActions,
  filters,
  children,
  className,
}: Layout3BeziehungenProps) {
  return (
    <div className={cn("min-h-screen bg-slate-50", className)}>
      <Header title={title} subtitle={subtitle} actions={headerActions} />
      <main className="max-w-page mx-auto px-8 py-8 space-y-6">
        {filters}
        <div className="space-y-4">{children}</div>
      </main>
    </div>
  );
}
