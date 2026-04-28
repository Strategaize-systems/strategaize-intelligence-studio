import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 4, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900",
        "placeholder:text-slate-400 resize-vertical",
        "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...rest}
    />
  );
});
