"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Input, FormField } from "@/components/design-system";
import { Plus, Trash2 } from "lucide-react";
import type { BrandProfileData } from "@/lib/brand/schema";
import { fieldError } from "./fieldError";
import { StringListField } from "./StringListField";

export function Section9CustomerLanguage() {
  const { register, control, formState } = useFormContext<BrandProfileData>();
  const errors = formState.errors;

  const glossary = useFieldArray({
    control,
    name: "sections.customerLanguage.glossary",
  });

  return (
    <div className="space-y-5">
      <StringListField<BrandProfileData>
        name="sections.customerLanguage.verbatim_problem_phrases"
        label="Verbatim Problem-Phrases"
        required
        hint="Mind. 3. Originalformulierungen aus Kunden-Calls."
        placeholder="z.B. „Ich verbringe Stunden mit ..."
        minItems={3}
      />
      <StringListField<BrandProfileData>
        name="sections.customerLanguage.verbatim_solution_phrases"
        label="Verbatim Solution-Phrases"
        required
        hint="Mind. 3."
        placeholder="z.B. „Endlich kann ich ..."
        minItems={3}
      />
      <StringListField<BrandProfileData>
        name="sections.customerLanguage.words_to_use"
        label="Words to use"
        hint="Optional"
        placeholder="Begriff"
      />
      <StringListField<BrandProfileData>
        name="sections.customerLanguage.words_to_avoid"
        label="Words to avoid"
        hint="Optional"
        placeholder="Begriff"
      />

      <FormField label="Glossar" hint="Optional. Begriff + Definition.">
        <div className="space-y-2">
          {glossary.fields.length === 0 && (
            <p className="text-xs text-slate-400 italic">Noch keine Eintraege.</p>
          )}
          {glossary.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start">
              <Input
                placeholder="Begriff"
                {...register(`sections.customerLanguage.glossary.${index}.term`)}
              />
              <Input
                placeholder="Definition"
                {...register(`sections.customerLanguage.glossary.${index}.definition`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => glossary.remove(index)}
                aria-label="Eintrag entfernen"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => glossary.append({ term: "", definition: "" })}
          >
            <Plus className="w-4 h-4" />
            Begriff hinzufuegen
          </Button>
        </div>
        {fieldError(errors, "sections.customerLanguage.glossary") && (
          <p className="text-xs font-medium text-red-700 mt-1">
            {fieldError(errors, "sections.customerLanguage.glossary")}
          </p>
        )}
      </FormField>
    </div>
  );
}
