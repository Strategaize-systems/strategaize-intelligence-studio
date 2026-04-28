// KPI-Card mit Brand-Gradient Top-Accent (Style Guide V2)
import { cn } from "@/lib/utils";

type Tone = "brand" | "success" | "warning" | "ai";

const TONE_GRADIENT: Record<Tone, string> = {
  brand: "bg-gradient-brand",
  success: "bg-gradient-success",
  warning: "bg-gradient-warning",
  ai: "bg-gradient-ai",
};

interface KPICardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: Tone;
  icon?: React.ReactNode;
  className?: string;
}

export function KPICard({
  label,
  value,
  hint,
  tone = "brand",
  icon,
  className,
}: KPICardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border-2 border-slate-200 p-6 shadow-lg relative overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1",
          TONE_GRADIENT[tone]
        )}
      />
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-slate-600 font-medium">{label}</p>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <p className="text-4xl font-bold text-slate-900 tracking-tight">
        {value}
      </p>
      {hint && <p className="text-xs text-slate-500 mt-2">{hint}</p>}
    </div>
  );
}
