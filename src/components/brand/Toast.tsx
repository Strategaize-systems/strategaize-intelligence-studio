// Lightweight Toast — Style Guide V2 (Brand-Tokens, kein zusaetzliches Lib)
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastTone = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  tone: ToastTone;
  title: string;
  detail?: string;
}

interface ToastContextValue {
  show: (msg: Omit<ToastMessage, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const ICON: Record<ToastTone, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const FRAME: Record<ToastTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-slate-200 bg-white text-slate-900",
};

const ICON_COLOR: Record<ToastTone, string> = {
  success: "text-emerald-600",
  error: "text-red-600",
  info: "text-brand-primary",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<ToastMessage[]>([]);
  const counterRef = React.useRef(0);

  const show = React.useCallback((msg: Omit<ToastMessage, "id">) => {
    counterRef.current += 1;
    const id = counterRef.current;
    setMessages((prev) => [...prev, { ...msg, id }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, msg.tone === "error" ? 8000 : 5000);
  }, []);

  const dismiss = React.useCallback((id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const value = React.useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      >
        {messages.map((m) => {
          const Icon = ICON[m.tone];
          return (
            <div
              key={m.id}
              role="status"
              className={cn(
                "pointer-events-auto rounded-xl border-2 shadow-lg px-4 py-3 flex items-start gap-3",
                FRAME[m.tone]
              )}
            >
              <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", ICON_COLOR[m.tone])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold tracking-tight">{m.title}</p>
                {m.detail && (
                  <p className="text-xs font-medium mt-0.5 opacity-90 break-words">
                    {m.detail}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="Schliessen"
                onClick={() => dismiss(m.id)}
                className="rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
