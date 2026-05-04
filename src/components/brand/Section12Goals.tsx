"use client";
import { useFormContext } from "react-hook-form";
import { Input, Textarea, FormField } from "@/components/design-system";
import type { BrandProfileData } from "@/lib/brand/schema";
import { fieldError } from "./fieldError";

export function Section12Goals() {
  const { register, formState } = useFormContext<BrandProfileData>();
  const errors = formState.errors;

  return (
    <div className="space-y-4">
      <FormField
        label="Primary Business Goal"
        required
        error={fieldError(errors, "sections.goals.primary_business_goal")}
      >
        <Textarea
          rows={2}
          placeholder="Was soll dieses Quartal erreicht werden?"
          {...register("sections.goals.primary_business_goal")}
        />
      </FormField>
      <FormField
        label="Key Conversion Action"
        required
        hint="z.B. Demo gebucht, Trial gestartet"
        error={fieldError(errors, "sections.goals.key_conversion_action")}
      >
        <Input
          {...register("sections.goals.key_conversion_action")}
        />
      </FormField>
      <p className="text-xs text-slate-500">
        Aktuelle Metriken (current_metrics) sind in V1 nur als JSON-Snapshot
        vorgesehen — UI-Editor folgt mit Performance-Capture-Loop in einer
        spaeteren Slice.
      </p>
    </div>
  );
}
