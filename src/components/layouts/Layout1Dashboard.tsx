// Layout 1 — Dashboard (Style Guide V2)
// Header + KPI-Grid-Slot + Hauptbereich + Sidebar.

import { Header } from "@/components/design-system/Header";
import { cn } from "@/lib/utils";

interface Layout1DashboardProps {
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  kpis?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Layout1Dashboard({
  title,
  subtitle,
  headerActions,
  kpis,
  sidebar,
  children,
  className,
}: Layout1DashboardProps) {
  return (
    <div className={cn("min-h-screen bg-slate-50", className)}>
      <Header title={title} subtitle={subtitle} actions={headerActions} />
      <main className="max-w-page mx-auto px-8 py-8 space-y-8">
        {kpis && <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{kpis}</div>}
        <div
          className={cn(
            "grid gap-8",
            sidebar ? "grid-cols-1 lg:grid-cols-[1fr_320px]" : "grid-cols-1"
          )}
        >
          <div className="space-y-6">{children}</div>
          {sidebar && <aside className="space-y-6">{sidebar}</aside>}
        </div>
      </main>
    </div>
  );
}
