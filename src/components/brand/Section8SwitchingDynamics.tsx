"use client";
import { useFormContext } from "react-hook-form";
import { Textarea, FormField } from "@/components/design-system";
import type { BrandProfileData } from "@/lib/brand/schema";
import { fieldError } from "./fieldError";

const FIELDS: Array<{
  key: "push" | "pull" | "habit" | "anxiety";
  label: string;
  hint: string;
}> = [
  { key: "push", label: "Push", hint: "Was schiebt vom Status-Quo weg?" },
  { key: "pull", label: "Pull", hint: "Was zieht zur Loesung hin?" },
  { key: "habit", label: "Habit", hint: "Welche Gewohnheit haelt fest?" },
  { key: "anxiety", label: "Anxiety", hint: "Welche Sorge bremst den Wechsel?" },
];

export function Section8SwitchingDynamics() {
  const { register, formState } = useFormContext<BrandProfileData>();
  const errors = formState.errors;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {FIELDS.map(({ key, label, hint }) => (
        <FormField
          key={key}
          label={label}
          hint={hint}
          required
          error={fieldError(errors, `sections.switchingDynamics.${key}`)}
        >
          <Textarea rows={2} {...register(`sections.switchingDynamics.${key}`)} />
        </FormField>
      ))}
    </div>
  );
}
