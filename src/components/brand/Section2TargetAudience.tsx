"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Input, FormField } from "@/components/design-system";
import { Plus, Trash2 } from "lucide-react";
import type { BrandProfileData } from "@/lib/brand/schema";
import { fieldError } from "./fieldError";
import { StringListField } from "./StringListField";

export function Section2TargetAudience() {
  const { register, control, formState } =
    useFormContext<BrandProfileData>();
  const errors = formState.errors;

  const dmArray = useFieldArray({
    control,
    name: "sections.targetAudience.target_decision_makers",
  });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          label="Branche"
          required
          error={fieldError(errors, "sections.targetAudience.target_company_type.industry")}
        >
          <Input
            placeholder="z.B. SaaS B2B"
            {...register("sections.targetAudience.target_company_type.industry")}
          />
        </FormField>
        <FormField
          label="Firmen-Groesse"
          required
          error={fieldError(errors, "sections.targetAudience.target_company_type.size_band")}
        >
          <Input
            placeholder="z.B. 50-500 MA"
            {...register("sections.targetAudience.target_company_type.size_band")}
          />
        </FormField>
        <FormField
          label="Firmen-Stage"
          required
          error={fieldError(errors, "sections.targetAudience.target_company_type.stage")}
        >
          <Input
            placeholder="z.B. Series A-B"
            {...register("sections.targetAudience.target_company_type.stage")}
          />
        </FormField>
      </div>

      <FormField
        label="Decision Makers"
        required
        hint="Mind. 1. Rolle + Abteilung."
        error={fieldError(errors, "sections.targetAudience.target_decision_makers")}
      >
        <div className="space-y-2">
          {dmArray.fields.length === 0 && (
            <p className="text-xs text-slate-400 italic">Noch keine Decision Maker.</p>
          )}
          {dmArray.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
              <Input
                placeholder="Rolle (z.B. Head of Marketing)"
                {...register(
                  `sections.targetAudience.target_decision_makers.${index}.role`
                )}
              />
              <Input
                placeholder="Abteilung"
                {...register(
                  `sections.targetAudience.target_decision_makers.${index}.department`
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (dmArray.fields.length > 1) dmArray.remove(index);
                }}
                aria-label="Entfernen"
                disabled={dmArray.fields.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => dmArray.append({ role: "", department: "" })}
          >
            <Plus className="w-4 h-4" />
            Decision Maker hinzufuegen
          </Button>
        </div>
      </FormField>

      <FormField
        label="Primary Use Case"
        required
        error={fieldError(errors, "sections.targetAudience.primary_use_case")}
      >
        <Input
          placeholder="Hauptanwendungsfall"
          {...register("sections.targetAudience.primary_use_case")}
        />
      </FormField>

      <StringListField<BrandProfileData>
        name="sections.targetAudience.jobs_to_be_done"
        label="Jobs-to-be-done"
        required
        hint="Mind. 2, max. 3 Jobs."
        placeholder="Job-Statement"
        minItems={2}
      />

      <StringListField<BrandProfileData>
        name="sections.targetAudience.specific_use_cases"
        label="Specific Use Cases"
        required
        placeholder="Konkreter Use Case"
        minItems={1}
      />
    </div>
  );
}
