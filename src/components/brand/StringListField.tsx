// Editier-Feld fuer String-Arrays (Verbatim-Phrases, Adjektive, Use-Cases ...).
"use client";
import * as React from "react";
import { useFieldArray, useFormContext, type FieldValues, type Path } from "react-hook-form";
import { Input, Button, FormField } from "@/components/design-system";
import { Plus, Trash2 } from "lucide-react";

interface StringListFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  minItems?: number;
}

export function StringListField<T extends FieldValues>({
  name,
  label,
  hint,
  required,
  placeholder,
  minItems = 0,
}: StringListFieldProps<T>) {
  const { control, register, formState } = useFormContext<T>();
  const { fields, append, remove } = useFieldArray<T>({
    control,
    // react-hook-form FieldArrayPath constraint — name muss array-pfad sein.
    name: name as never,
  });

  const errorMessage = pickArrayLevelError(formState.errors as Record<string, unknown>, name);

  return (
    <FormField label={label} hint={hint} required={required} error={errorMessage}>
      <div className="space-y-2">
        {fields.length === 0 && (
          <p className="text-xs text-slate-400 italic">Noch keine Eintraege.</p>
        )}
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <Input
              placeholder={placeholder}
              {...register(`${name}.${index}` as Path<T>)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (fields.length > minItems) remove(index);
              }}
              aria-label="Eintrag entfernen"
              disabled={fields.length <= minItems}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append("" as never)}
        >
          <Plus className="w-4 h-4" />
          Eintrag hinzufuegen
        </Button>
      </div>
    </FormField>
  );
}

function pickArrayLevelError(
  errors: Record<string, unknown>,
  path: string
): string | undefined {
  const segments = path.split(".");
  let node: unknown = errors;
  for (const seg of segments) {
    if (!node || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[seg];
  }
  if (
    node &&
    typeof node === "object" &&
    "message" in (node as Record<string, unknown>)
  ) {
    const msg = (node as { message?: unknown }).message;
    return typeof msg === "string" ? msg : undefined;
  }
  if (
    node &&
    typeof node === "object" &&
    "root" in (node as Record<string, unknown>)
  ) {
    const root = (node as { root?: { message?: unknown } }).root;
    if (root && typeof root.message === "string") return root.message;
  }
  return undefined;
}
