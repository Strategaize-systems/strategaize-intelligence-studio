// CompletenessBadge — Vollstaendigkeits-Status pro Sektion (Style Guide V2)
import { StatusBadge } from "@/components/design-system";
import type { CompletenessStatus } from "@/lib/brand/completeness";

const TONE: Record<CompletenessStatus, "muted" | "warning" | "success"> = {
  leer: "muted",
  unvollstaendig: "warning",
  erfasst: "success",
};

const LABEL: Record<CompletenessStatus, string> = {
  leer: "Leer",
  unvollstaendig: "Unvollstaendig",
  erfasst: "Erfasst",
};

export function CompletenessBadge({ status }: { status: CompletenessStatus }) {
  return <StatusBadge label={LABEL[status]} tone={TONE[status]} />;
}
