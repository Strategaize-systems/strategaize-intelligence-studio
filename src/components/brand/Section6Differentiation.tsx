"use client";
import { useFormContext } from "react-hook-form";
import { Textarea, FormField } from "@/components/design-system";
import type { BrandProfileData } from "@/lib/brand/schema";
import { fieldError } from "./fieldError";
import { StringListField } from "./StringListField";

export function Section6Differentiation() {
  const { register, formState } = useFormContext<BrandProfileData>();
  const errors = formState.errors;

  return (
    <div className="space-y-4">
      <StringListField<BrandProfileData>
        name="sections.differentiation.key_differentiators"
        label="Key Differentiators"
        required
        hint="Mind. 1. Was hebt uns wirklich ab?"
        placeholder="Differentiator"
        minItems={1}
      />
      <FormField
        label="How we do it differently"
        required
        error={fieldError(errors, "sections.differentiation.how_we_do_it_differently")}
      >
        <Textarea
          rows={2}
          {...register("sections.differentiation.how_we_do_it_differently")}
        />
      </FormField>
      <FormField
        label="Why that's better"
        required
        error={fieldError(errors, "sections.differentiation.why_thats_better")}
      >
        <Textarea
          rows={2}
          {...register("sections.differentiation.why_thats_better")}
        />
      </FormField>
      <FormField
        label="Why customers choose us"
        required
        error={fieldError(errors, "sections.differentiation.why_customers_choose_us")}
      >
        <Textarea
          rows={2}
          {...register("sections.differentiation.why_customers_choose_us")}
        />
      </FormField>
    </div>
  );
}
