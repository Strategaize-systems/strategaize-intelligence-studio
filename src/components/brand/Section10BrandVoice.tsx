"use client";
import { useFormContext } from "react-hook-form";
import { Input, FormField } from "@/components/design-system";
import type { BrandProfileData } from "@/lib/brand/schema";
import { fieldError } from "./fieldError";
import { StringListField } from "./StringListField";

export function Section10BrandVoice() {
  const { register, formState } = useFormContext<BrandProfileData>();
  const errors = formState.errors;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Tonalitaet"
          required
          hint="z.B. direkt, fachlich, partnerschaftlich"
          error={fieldError(errors, "sections.brandVoice.tone")}
        >
          <Input {...register("sections.brandVoice.tone")} />
        </FormField>
        <FormField
          label="Communication Style"
          required
          hint="z.B. praezise mit Beispielen"
          error={fieldError(errors, "sections.brandVoice.communication_style")}
        >
          <Input {...register("sections.brandVoice.communication_style")} />
        </FormField>
      </div>
      <StringListField<BrandProfileData>
        name="sections.brandVoice.personality"
        label="Personality-Adjektive"
        required
        hint="3-5 Adjektive."
        placeholder="z.B. klar"
        minItems={3}
      />
    </div>
  );
}
