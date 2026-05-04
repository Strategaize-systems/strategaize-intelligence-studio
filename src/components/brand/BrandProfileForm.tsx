// BrandProfileForm — RHF + Zod-Resolver, 12-Sektionen-Accordion (Style Guide V2).
"use client";
import * as React from "react";
import {
  useForm,
  FormProvider,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Save } from "lucide-react";
import { Button, ContentCard } from "@/components/design-system";
import { cn } from "@/lib/utils";
import {
  brandProfileDataSchema,
  SECTION_KEYS,
  SECTION_LABEL_DE,
  SECTION_INDEX_BY_KEY,
  type BrandProfileData,
  type SectionKey,
} from "@/lib/brand/schema";
import { emptyBrandProfile } from "@/lib/brand/defaults";
import { getOverallCompleteness, type CompletenessStatus } from "@/lib/brand/completeness";
import {
  summarizeSectionErrors,
  formatSectionErrorList,
} from "@/lib/brand/errors";
import {
  saveBrandProfileAction,
  type SaveActionResult,
} from "@/server/brand/actions";
import { CompletenessBadge } from "./CompletenessBadge";
import { Section1ProductOverview } from "./Section1ProductOverview";
import { Section2TargetAudience } from "./Section2TargetAudience";
import { Section3Personas } from "./Section3Personas";
import { Section4PainPoints } from "./Section4PainPoints";
import { Section5CompetitiveLandscape } from "./Section5CompetitiveLandscape";
import { Section6Differentiation } from "./Section6Differentiation";
import { Section7Objections } from "./Section7Objections";
import { Section8SwitchingDynamics } from "./Section8SwitchingDynamics";
import { Section9CustomerLanguage } from "./Section9CustomerLanguage";
import { Section10BrandVoice } from "./Section10BrandVoice";
import { Section11ProofPoints } from "./Section11ProofPoints";
import { Section12Goals } from "./Section12Goals";
import { useToast } from "./Toast";

const SECTION_RENDERERS: Record<SectionKey, React.ComponentType> = {
  productOverview: Section1ProductOverview,
  targetAudience: Section2TargetAudience,
  personas: Section3Personas,
  painPoints: Section4PainPoints,
  competitiveLandscape: Section5CompetitiveLandscape,
  differentiation: Section6Differentiation,
  objections: Section7Objections,
  switchingDynamics: Section8SwitchingDynamics,
  customerLanguage: Section9CustomerLanguage,
  brandVoice: Section10BrandVoice,
  proofPoints: Section11ProofPoints,
  goals: Section12Goals,
};

interface BrandProfileFormProps {
  initialData: BrandProfileData | null;
  initialVersion: number | null;
}

export function BrandProfileForm({ initialData, initialVersion }: BrandProfileFormProps) {
  const toast = useToast();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [version, setVersion] = React.useState<number | null>(initialVersion);

  // Zod-Schema hat divergente Input/Output-Typen wegen `.default([])` —
  // wir cast'en den Resolver auf BrandProfileData (Output-Type), weil RHF
  // intern zwischen beiden nicht differenziert. Die echte Validation laeuft
  // ueber das Schema und ist damit weiterhin korrekt.
  const methods = useForm<BrandProfileData>({
    resolver: zodResolver(brandProfileDataSchema) as unknown as Resolver<BrandProfileData>,
    defaultValues: initialData ?? emptyBrandProfile(),
    mode: "onSubmit",
  });

  const { handleSubmit, watch, formState, setError } = methods;
  const watchedValues = watch();

  const completeness = React.useMemo(
    () => getOverallCompleteness(watchedValues),
    [watchedValues]
  );

  const onSubmit: SubmitHandler<BrandProfileData> = async (values) => {
    setServerError(null);
    let result: SaveActionResult;
    try {
      result = await saveBrandProfileAction(values);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
      setServerError(msg);
      toast.show({ tone: "error", title: "Speichern fehlgeschlagen", detail: msg });
      return;
    }

    if (result.success) {
      if (typeof result.version === "number") setVersion(result.version);
      toast.show({
        tone: "success",
        title: "Brand Profile gespeichert",
        detail: `Version ${result.version}`,
      });
      return;
    }

    if (result.fieldErrors) {
      for (const [path, messages] of Object.entries(result.fieldErrors)) {
        const message = messages[0];
        if (message) {
          setError(path as keyof BrandProfileData, { type: "server", message });
        }
      }
      const sectionKeys = summarizeSectionErrors(result.fieldErrors);
      const detail = sectionKeys.length
        ? `Sektionen unvollstaendig: ${formatSectionErrorList(sectionKeys)}`
        : result.error ?? "Validierung fehlgeschlagen";
      setServerError(detail);
      toast.show({ tone: "error", title: "Validierung fehlgeschlagen", detail });
      return;
    }

    const msg = result.error ?? "Unbekannter Fehler";
    setServerError(msg);
    toast.show({ tone: "error", title: "Speichern fehlgeschlagen", detail: msg });
  };

  function onInvalid() {
    const sectionKeys = summarizeSectionErrors(toFieldErrors(formState.errors));
    const detail = sectionKeys.length
      ? `Sektionen unvollstaendig: ${formatSectionErrorList(sectionKeys)}`
      : "Bitte Pflichtfelder pruefen.";
    toast.show({ tone: "error", title: "Validierung fehlgeschlagen", detail });
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="space-y-6"
      >
        <ContentCard
          title="Brand Profile"
          subtitle={
            version
              ? `Aktive Version: v${version} — ${labelForOverall(completeness.overall)}`
              : `Noch kein Profile gespeichert — ${labelForOverall(completeness.overall)}`
          }
          actions={
            <Button type="submit" disabled={formState.isSubmitting}>
              <Save className="w-4 h-4" />
              {formState.isSubmitting ? "Speichere ..." : "Speichern"}
            </Button>
          }
        >
          {serverError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
            >
              {serverError}
            </div>
          )}

          <Accordion.Root
            type="multiple"
            defaultValue={initialData ? [] : [SECTION_KEYS[0]]}
            className="space-y-2"
          >
            {SECTION_KEYS.map((key) => {
              const SectionComponent = SECTION_RENDERERS[key];
              const status = completeness.sections[key];
              return (
                <Accordion.Item
                  key={key}
                  value={key}
                  className="rounded-xl border-2 border-slate-200 bg-white overflow-hidden"
                >
                  <Accordion.Header>
                    <Accordion.Trigger
                      className={cn(
                        "group w-full flex items-center justify-between gap-4 px-5 py-4",
                        "text-left hover:bg-slate-50 transition-colors"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-xs font-bold text-slate-700 shrink-0">
                          {SECTION_INDEX_BY_KEY[key]}
                        </span>
                        <span className="text-base font-bold text-slate-900 tracking-tight truncate">
                          {SECTION_LABEL_DE[key]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <CompletenessBadge status={status} />
                        <ChevronDown
                          className="w-4 h-4 text-slate-500 transition-transform group-data-[state=open]:rotate-180"
                          aria-hidden
                        />
                      </div>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="border-t border-slate-100 bg-slate-50/30">
                    <div className="px-5 py-5">
                      <SectionComponent />
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </ContentCard>
      </form>
    </FormProvider>
  );
}

function labelForOverall(status: CompletenessStatus): string {
  switch (status) {
    case "erfasst":
      return "vollstaendig erfasst";
    case "unvollstaendig":
      return "unvollstaendig";
    case "leer":
      return "leer";
  }
}

function toFieldErrors(errors: unknown): Record<string, string[]> | undefined {
  if (!errors || typeof errors !== "object") return undefined;
  const out: Record<string, string[]> = {};
  walk("", errors as Record<string, unknown>, out);
  return out;
}

function walk(
  prefix: string,
  obj: Record<string, unknown>,
  out: Record<string, string[]>
): void {
  for (const [key, val] of Object.entries(obj)) {
    if (!val || typeof val !== "object") continue;
    const path = prefix ? `${prefix}.${key}` : key;
    const node = val as Record<string, unknown>;
    if (typeof node.message === "string") {
      out[path] = [node.message];
      continue;
    }
    if (node.root && typeof (node.root as { message?: unknown }).message === "string") {
      out[path] = [(node.root as { message: string }).message];
    }
    walk(path, node, out);
  }
}
