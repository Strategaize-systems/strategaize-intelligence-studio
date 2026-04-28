// Layout 2 — Mein Tag (Style Guide V2)
// Header + 2-Spalten Tagesansicht + Tasks-Sidebar.

import { Header } from "@/components/design-system/Header";
import { cn } from "@/lib/utils";

interface Layout2MeinTagProps {
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  primary: React.ReactNode;
  secondary: React.ReactNode;
  className?: string;
}

export function Layout2MeinTag({
  title,
  subtitle,
  headerActions,
  primary,
  secondary,
  className,
}: Layout2MeinTagProps) {
  return (
    <div className={cn("min-h-screen bg-slate-50", className)}>
      <Header title={title} subtitle={subtitle} actions={headerActions} />
      <main className="max-w-page mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <section className="space-y-6">{primary}</section>
          <aside className="space-y-6">{secondary}</aside>
        </div>
      </main>
    </div>
  );
}
