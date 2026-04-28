// StatusBadge mit Tone-Mapping (Style Guide V2)
import { cn } from "@/lib/utils";

export type StatusTone =
  | "neutral"
  | "info"
  | "warning"
  | "success"
  | "danger"
  | "muted";

const TONE: Record<StatusTone, string> = {
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  warning: "bg-orange-100 text-orange-700 border-orange-200",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  danger: "bg-red-100 text-red-700 border-red-200",
  muted: "bg-slate-100 text-slate-400 border-slate-200",
};

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  className?: string;
}

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border",
        TONE[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
