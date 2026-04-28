// Sticky Header (Style Guide V2)
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Header({ title, subtitle, actions, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6 shadow-sm sticky top-0 z-20",
        className
      )}
    >
      <div className="max-w-page mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-600 font-medium">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
