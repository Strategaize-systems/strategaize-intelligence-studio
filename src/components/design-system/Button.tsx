// Standard-Button (Style Guide V2)
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white shadow-lg hover:shadow-xl border-transparent",
  secondary:
    "bg-white text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm",
  ghost:
    "bg-transparent text-slate-700 border-transparent hover:bg-slate-100",
  danger:
    "bg-red-600 text-white border-transparent hover:bg-red-700 shadow-sm",
};

const SIZE: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, children, ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg border-2 font-bold transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          VARIANT[variant],
          SIZE[size],
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
