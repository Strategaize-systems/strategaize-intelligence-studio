import * as React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ className, label, id, ...rest }, ref) {
    const inputId = id ?? `cb-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <label
        htmlFor={inputId}
        className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700"
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-2 border-slate-300 text-brand-primary",
            "focus:ring-2 focus:ring-brand-primary/30",
            className
          )}
          {...rest}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);
