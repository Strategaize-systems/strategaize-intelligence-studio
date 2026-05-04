// Helper: liest tief verschachtelten react-hook-form-Error-Pfad und gibt message-String oder undefined zurueck.
import type { FieldErrors, FieldValues } from "react-hook-form";

export function fieldError<T extends FieldValues>(
  errors: FieldErrors<T>,
  path: string
): string | undefined {
  const segments = path.split(".");
  let node: unknown = errors;
  for (const seg of segments) {
    if (!node || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[seg];
  }
  if (!node || typeof node !== "object") return undefined;
  const candidate = node as { message?: unknown; root?: { message?: unknown } };
  if (typeof candidate.message === "string") return candidate.message;
  if (candidate.root && typeof candidate.root.message === "string") {
    return candidate.root.message;
  }
  return undefined;
}
