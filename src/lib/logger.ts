// V1: Console-Logger. Schreibt strukturierte Eintraege nach stdout/stderr.
// V2 (geplant): zusaetzlich audit_log/error_log Persistierung wie Onboarding-Plattform.

type Level = "debug" | "info" | "warn" | "error";

interface LogContext {
  source?: string;
  [key: string]: unknown;
}

function emit(level: Level, message: string, context?: LogContext): void {
  const entry = {
    ts: new Date().toISOString(),
    level,
    source: context?.source ?? "app",
    message,
    ...(context ? { ctx: { ...context, source: undefined } } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => emit("debug", msg, ctx),
  info: (msg: string, ctx?: LogContext) => emit("info", msg, ctx),
  warn: (msg: string, ctx?: LogContext) => emit("warn", msg, ctx),
  error: (msg: string, ctx?: LogContext) => emit("error", msg, ctx),
};

export function captureException(
  error: unknown,
  context?: LogContext
): void {
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error(err.message, {
    ...context,
    stack: err.stack,
  });
}
