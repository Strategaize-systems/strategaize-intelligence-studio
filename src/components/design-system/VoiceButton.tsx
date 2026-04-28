// VoiceButton — Mikro-Interaktion fuer Voice-Eingabe (Style Guide V2)
import * as React from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const VoiceButton = React.forwardRef<HTMLButtonElement, VoiceButtonProps>(
  function VoiceButton({ active = false, className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={active}
        aria-label={active ? "Voice-Eingabe stoppen" : "Voice-Eingabe starten"}
        className={cn(
          "inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 font-bold transition-all",
          active
            ? "bg-red-600 text-white border-transparent animate-pulse shadow-lg"
            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm",
          className
        )}
        {...rest}
      >
        {active ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>
    );
  }
);
