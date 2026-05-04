// ChangelogList — sortiert neuestes oben, Sektion-Pfad + old/new (truncated).
"use client";
import * as React from "react";
import { ContentCard, StatusBadge } from "@/components/design-system";
import {
  SECTION_LABEL_DE,
  SECTION_INDEX_BY_KEY,
  SECTION_KEYS,
  type SectionKey,
} from "@/lib/brand/schema";
import type { ChangelogEntry } from "@/server/brand/repository";

const SECTION_KEY_SET = new Set<string>(SECTION_KEYS);

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "short",
});

interface ChangelogListProps {
  entries: ChangelogEntry[];
}

export function ChangelogList({ entries }: ChangelogListProps) {
  if (entries.length === 0) {
    return (
      <ContentCard title="Changelog">
        <p className="text-sm text-slate-600">
          Noch keine Aenderungen — der Changelog fuellt sich bei jedem Speichern.
        </p>
      </ContentCard>
    );
  }

  return (
    <ContentCard
      title="Changelog"
      subtitle={`${entries.length} Eintrag${entries.length === 1 ? "" : "e"} (neuestes oben)`}
    >
      <ol className="space-y-3">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="rounded-lg border-2 border-slate-200 bg-slate-50/50 p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <StatusBadge
                  label={`v${entry.version_from} → v${entry.version_to}`}
                  tone="info"
                />
                <SectionLabel path={entry.jsonb_path_changed} />
              </div>
              <time
                dateTime={entry.changed_at}
                className="text-xs font-medium text-slate-500 shrink-0"
              >
                {dateFormatter.format(new Date(entry.changed_at))}
              </time>
            </div>
            <div className="grid gap-2 md:grid-cols-2 mt-2">
              <DiffBlock label="Vorher" value={entry.old_value} tone="old" />
              <DiffBlock label="Nachher" value={entry.new_value} tone="new" />
            </div>
            {entry.changed_by && (
              <p className="text-xs text-slate-500 mt-2">
                User-ID: <code className="font-mono">{entry.changed_by}</code>
              </p>
            )}
          </li>
        ))}
      </ol>
    </ContentCard>
  );
}

function SectionLabel({ path }: { path: string | null }) {
  const sectionKey = extractSectionKey(path);
  if (!sectionKey) {
    return <span className="text-sm font-bold text-slate-700">{path ?? "—"}</span>;
  }
  return (
    <span className="text-sm font-bold text-slate-900">
      Sektion {SECTION_INDEX_BY_KEY[sectionKey]} —{" "}
      {SECTION_LABEL_DE[sectionKey]}
    </span>
  );
}

function extractSectionKey(path: string | null): SectionKey | null {
  if (!path) return null;
  const segments = path.split(".");
  if (segments[0] !== "sections") return null;
  const key = segments[1];
  if (key && SECTION_KEY_SET.has(key)) return key as SectionKey;
  return null;
}

function DiffBlock({
  label,
  value,
  tone,
}: {
  label: string;
  value: unknown;
  tone: "old" | "new";
}) {
  const text = React.useMemo(() => truncatePretty(value), [value]);
  const frame =
    tone === "old"
      ? "border-slate-200 bg-white"
      : "border-emerald-200 bg-emerald-50";
  return (
    <div className={`rounded-lg border-2 ${frame} p-3`}>
      <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
        {label}
      </p>
      <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
        {text}
      </pre>
    </div>
  );
}

function truncatePretty(value: unknown, max = 1200): string {
  let text: string;
  try {
    text = JSON.stringify(value, null, 2) ?? "—";
  } catch {
    text = String(value);
  }
  if (text.length <= max) return text;
  return text.slice(0, max) + "\n...";
}
