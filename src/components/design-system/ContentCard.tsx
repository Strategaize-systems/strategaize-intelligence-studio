// ContentCard — Standardrahmen fuer Content-Sections (Style Guide V2)
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContentCard({
  title,
  subtitle,
  actions,
  children,
  className,
}: ContentCardProps) {
  return (
    <section
      className={cn(
        "bg-white rounded-xl border-2 border-slate-200 shadow-lg",
        className
      )}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            {title && (
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-slate-600 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </header>
      )}
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}
