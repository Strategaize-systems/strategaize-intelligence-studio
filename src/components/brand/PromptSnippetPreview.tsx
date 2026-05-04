// PromptSnippetPreview — zeigt den fertigen Bedrock-System-Prompt mit Skill-Highlight-Auswahl.
"use client";
import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Button, ContentCard, Select, FormField } from "@/components/design-system";
import {
  buildBrandSystemPrompt,
  SKILL_HIGHLIGHTS,
} from "@/prompts/brand/builder";
import type { BrandProfileData } from "@/lib/brand/schema";

interface PromptSnippetPreviewProps {
  profile: BrandProfileData;
}

const SKILL_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "__none", label: "Keine (alle Sektionen neutral)" },
  ...Object.keys(SKILL_HIGHLIGHTS).map((key) => ({ value: key, label: key })),
];

export function PromptSnippetPreview({ profile }: PromptSnippetPreviewProps) {
  const [skill, setSkill] = React.useState<string>("__none");
  const [copied, setCopied] = React.useState(false);

  const highlightSections =
    skill === "__none" ? undefined : SKILL_HIGHLIGHTS[skill];

  const prompt = React.useMemo(
    () => buildBrandSystemPrompt(profile, { highlightSections }),
    [profile, highlightSections]
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard kann blockiert sein — keine Toast hier (Komponente ohne ToastProvider Pflicht)
    }
  }

  return (
    <ContentCard
      title="Prompt-Snippet (Bedrock System-Prompt)"
      subtitle="Genau dieser Block wird allen Marketing-Generierungen als System-Kontext mitgegeben."
      actions={
        <Button type="button" variant="secondary" onClick={copy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Kopiert" : "Kopieren"}
        </Button>
      }
    >
      <div className="space-y-4">
        <FormField
          label="Skill-Highlight"
          hint="Setzt (KEY)-Markierungen auf die fuer den Skill kritischen Sektionen."
        >
          <Select value={skill} onChange={(e) => setSkill(e.target.value)}>
            {SKILL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormField>
        <pre
          className="text-xs font-mono whitespace-pre-wrap break-words bg-slate-900 text-emerald-100 rounded-lg p-4 max-h-[60vh] overflow-y-auto"
          aria-label="Generierter Prompt-Snippet"
        >
          {prompt}
        </pre>
      </div>
    </ContentCard>
  );
}
