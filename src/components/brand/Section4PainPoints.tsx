"use client";
import { useFormContext } from "react-hook-form";
import { Input, Textarea, FormField } from "@/components/design-system";
import type { BrandProfileData } from "@/lib/brand/schema";
import { fieldError } from "./fieldError";

export function Section4PainPoints() {
  const { register, formState } = useFormContext<BrandProfileData>();
  const errors = formState.errors;

  return (
    <div className="space-y-4">
      <FormField
        label="Core Challenge"
        required
        error={fieldError(errors, "sections.painPoints.core_challenge")}
      >
        <Textarea
          rows={2}
          placeholder="Das eine Kern-Problem, das User wirklich treibt"
          {...register("sections.painPoints.core_challenge")}
        />
      </FormField>
      <FormField
        label="Warum bestehende Loesungen zu kurz greifen"
        required
        error={fieldError(errors, "sections.painPoints.why_current_solutions_fall_short")}
      >
        <Textarea
          rows={2}
          {...register("sections.painPoints.why_current_solutions_fall_short")}
        />
      </FormField>

      <fieldset className="border-2 border-slate-200 rounded-lg p-4 space-y-3">
        <legend className="text-sm font-bold text-slate-700 px-2">Costs</legend>
        <div className="grid gap-3 md:grid-cols-3">
          <FormField
            label="Zeit"
            required
            error={fieldError(errors, "sections.painPoints.costs.time")}
          >
            <Input
              placeholder="z.B. 8h/Woche"
              {...register("sections.painPoints.costs.time")}
            />
          </FormField>
          <FormField
            label="Geld"
            required
            error={fieldError(errors, "sections.painPoints.costs.money")}
          >
            <Input
              placeholder="z.B. 5k EUR/Monat"
              {...register("sections.painPoints.costs.money")}
            />
          </FormField>
          <FormField
            label="Verpasste Chancen"
            required
            error={fieldError(errors, "sections.painPoints.costs.opportunities")}
          >
            <Input
              placeholder="z.B. verlorene Leads"
              {...register("sections.painPoints.costs.opportunities")}
            />
          </FormField>
        </div>
      </fieldset>

      <FormField
        label="Emotional Tension"
        required
        error={fieldError(errors, "sections.painPoints.emotional_tension")}
      >
        <Textarea
          rows={2}
          placeholder="Welche Emotion entsteht durch das Problem?"
          {...register("sections.painPoints.emotional_tension")}
        />
      </FormField>
    </div>
  );
}
