"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Input, Textarea, FormField } from "@/components/design-system";
import { Plus, Trash2 } from "lucide-react";
import type { BrandProfileData } from "@/lib/brand/schema";
import { fieldError } from "./fieldError";
import { StringListField } from "./StringListField";

export function Section11ProofPoints() {
  const { register, control, formState } = useFormContext<BrandProfileData>();
  const errors = formState.errors;

  const metrics = useFieldArray({
    control,
    name: "sections.proofPoints.metrics",
  });
  const testimonials = useFieldArray({
    control,
    name: "sections.proofPoints.testimonials",
  });
  const valueThemes = useFieldArray({
    control,
    name: "sections.proofPoints.value_themes",
  });

  const aggregatedError =
    fieldError(errors, "sections.proofPoints.metrics") ??
    fieldError(errors, "sections.proofPoints");

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-600">
        V1-Pflicht: <strong>mind. 1 Metric ODER 1 Testimonial</strong>.
      </p>

      <FormField label="Metrics" hint="Behauptung + Evidenz." error={aggregatedError}>
        <div className="space-y-2">
          {metrics.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start">
              <Input
                placeholder="Behauptung"
                {...register(`sections.proofPoints.metrics.${index}.claim`)}
              />
              <Textarea
                rows={1}
                placeholder="Evidenz"
                {...register(`sections.proofPoints.metrics.${index}.evidence`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => metrics.remove(index)}
                aria-label="Metric entfernen"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => metrics.append({ claim: "", evidence: "" })}
          >
            <Plus className="w-4 h-4" />
            Metric hinzufuegen
          </Button>
        </div>
      </FormField>

      <FormField label="Testimonials" hint="Zitat + Attribution.">
        <div className="space-y-2">
          {testimonials.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-start">
              <Textarea
                rows={2}
                placeholder="Zitat"
                {...register(`sections.proofPoints.testimonials.${index}.quote`)}
              />
              <Input
                placeholder="Attribution (Name / Rolle / Firma)"
                {...register(`sections.proofPoints.testimonials.${index}.attribution`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => testimonials.remove(index)}
                aria-label="Testimonial entfernen"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => testimonials.append({ quote: "", attribution: "" })}
          >
            <Plus className="w-4 h-4" />
            Testimonial hinzufuegen
          </Button>
        </div>
      </FormField>

      <StringListField<BrandProfileData>
        name="sections.proofPoints.notable_customers"
        label="Notable Customers"
        hint="Optional. Logo-Referenzen / Brand-Names."
        placeholder="Firmen-Name"
      />

      <FormField label="Value Themes" hint="Optional. Theme + Proof.">
        <div className="space-y-2">
          {valueThemes.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start">
              <Input
                placeholder="Theme"
                {...register(`sections.proofPoints.value_themes.${index}.theme`)}
              />
              <Textarea
                rows={1}
                placeholder="Proof"
                {...register(`sections.proofPoints.value_themes.${index}.proof`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => valueThemes.remove(index)}
                aria-label="Theme entfernen"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => valueThemes.append({ theme: "", proof: "" })}
          >
            <Plus className="w-4 h-4" />
            Theme hinzufuegen
          </Button>
        </div>
      </FormField>
    </div>
  );
}
