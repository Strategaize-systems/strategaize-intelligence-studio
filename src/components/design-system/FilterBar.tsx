// FilterBar mit Search + Action-Slot (Style Guide V2)
import { cn } from "@/lib/utils";

interface FilterBarProps {
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, actions, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border-2 border-slate-200 p-4 shadow-sm",
        "flex flex-wrap items-center justify-between gap-4",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3 flex-1">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
