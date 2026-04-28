// AIButton — KI-spezifischer CTA (lila/indigo Gradient, Style Guide V2)
import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  label?: string;
}

export const AIButton = React.forwardRef<HTMLButtonElement, AIButtonProps>(
  function AIButton(
    { loading = false, label = "Mit KI generieren", className, children, ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        disabled={loading || rest.disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-transparent",
          "bg-gradient-ai text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...rest}
      >
        <Sparkles className={cn("w-4 h-4", loading && "animate-spin")} />
        {children ?? label}
      </button>
    );
  }
);
