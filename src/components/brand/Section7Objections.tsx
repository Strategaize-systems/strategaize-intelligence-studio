"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Textarea, Input, FormField } from "@/components/design-system";
import { Plus, Trash2 } from "lucide-react";
import type { BrandProfileData } from "@/lib/brand/schema";
import { fieldError } from "./fieldError";

export function Section7Objections() {
  const { register, control, formState } = useFormContext<BrandProfileData>();
  const errors = formState.errors;

  const objections = useFieldArray({
    control,
    name: "sections.objections.top_objections",
  });

  return (
    <div className="space-y-4">
      <FormField
        label="Top Objections (max. 3)"
        required
        hint="Mind. 1, max. 3 Top-Objections."
        error={fieldError(errors, "sections.objections.top_objections")}
      >
        <div className="space-y-2">
          {objections.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start">
              <Input
                placeholder="Einwand"
                {...register(`sections.objections.top_objections.${index}.objection`)}
              />
              <Textarea
                rows={1}
                placeholder="Antwort"
                {...register(`sections.objections.top_objections.${index}.response`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (objections.fields.length > 1) objections.remove(index);
                }}
                disabled={objections.fields.length <= 1}
                aria-label="Einwand entfernen"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={objections.fields.length >= 3}
            onClick={() => objections.append({ objection: "", response: "" })}
          >
            <Plus className="w-4 h-4" />
            Einwand hinzufuegen
          </Button>
        </div>
      </FormField>
      <FormField
        label="Anti-Persona"
        required
        hint="Wer ist NICHT unser Kunde?"
        error={fieldError(errors, "sections.objections.anti_persona")}
      >
        <Textarea
          rows={2}
          {...register("sections.objections.anti_persona")}
        />
      </FormField>
    </div>
  );
}
