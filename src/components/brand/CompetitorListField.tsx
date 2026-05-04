"use client";
import { useFieldArray, useFormContext, type FieldValues, type Path } from "react-hook-form";
import { Button, Input, FormField, Textarea } from "@/components/design-system";
import { Plus, Trash2 } from "lucide-react";

interface CompetitorListFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  hint?: string;
  required?: boolean;
  minItems?: number;
}

export function CompetitorListField<T extends FieldValues>({
  name,
  label,
  hint,
  required,
  minItems = 0,
}: CompetitorListFieldProps<T>) {
  const { register, control } = useFormContext<T>();
  const { fields, append, remove } = useFieldArray<T>({
    control,
    name: name as never,
  });

  return (
    <FormField label={label} hint={hint} required={required}>
      <div className="space-y-2">
        {fields.length === 0 && (
          <p className="text-xs text-slate-400 italic">Noch keine Eintraege.</p>
        )}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start"
          >
            <Input
              placeholder="Name"
              {...register(`${name}.${index}.name` as Path<T>)}
            />
            <Textarea
              rows={1}
              placeholder="Wo greift dieser Competitor zu kurz?"
              {...register(`${name}.${index}.falls_short` as Path<T>)}
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
          onClick={() =>
            append({ name: "", falls_short: "" } as never)
          }
        >
          <Plus className="w-4 h-4" />
          Competitor hinzufuegen
        </Button>
      </div>
    </FormField>
  );
}
