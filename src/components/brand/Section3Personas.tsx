"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Input, Select, Textarea, FormField } from "@/components/design-system";
import { Plus, Trash2 } from "lucide-react";
import type { BrandProfileData } from "@/lib/brand/schema";
import { fieldError } from "./fieldError";

const PERSONA_TYPES = [
  { value: "user", label: "User (V1-Pflicht)" },
  { value: "champion", label: "Champion" },
  { value: "decision_maker", label: "Decision Maker (V1-Pflicht)" },
  { value: "financial_buyer", label: "Financial Buyer" },
  { value: "technical_influencer", label: "Technical Influencer" },
];

export function Section3Personas() {
  const { register, control, formState } = useFormContext<BrandProfileData>();
  const errors = formState.errors;

  const personas = useFieldArray({
    control,
    name: "sections.personas.personas",
  });

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-600">
        V1-Pflicht: mind. <strong>User</strong> + <strong>Decision Maker</strong>.
      </p>

      <FormField
        label="Personas"
        error={fieldError(errors, "sections.personas.personas")}
        required
      >
        <div className="space-y-3">
          {personas.fields.length === 0 && (
            <p className="text-xs text-slate-400 italic">Noch keine Personas erfasst.</p>
          )}
          {personas.fields.map((field, index) => (
            <div
              key={field.id}
              className="border-2 border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="grid gap-3 md:grid-cols-2 flex-1">
                  <FormField
                    label="Persona-Typ"
                    required
                    error={fieldError(errors, `sections.personas.personas.${index}.type`)}
                  >
                    <Select {...register(`sections.personas.personas.${index}.type`)}>
                      <option value="">— bitte waehlen —</option>
                      {PERSONA_TYPES.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField
                    label="Cares about"
                    required
                    error={fieldError(
                      errors,
                      `sections.personas.personas.${index}.cares_about`
                    )}
                  >
                    <Input
                      placeholder="Was ist dieser Person wichtig?"
                      {...register(`sections.personas.personas.${index}.cares_about`)}
                    />
                  </FormField>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (personas.fields.length > 2) personas.remove(index);
                  }}
                  aria-label="Persona entfernen"
                  disabled={personas.fields.length <= 2}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <FormField
                label="Challenge"
                required
                error={fieldError(errors, `sections.personas.personas.${index}.challenge`)}
              >
                <Textarea
                  rows={2}
                  placeholder="Hauptproblem dieser Persona"
                  {...register(`sections.personas.personas.${index}.challenge`)}
                />
              </FormField>
              <FormField
                label="Value Promise"
                required
                error={fieldError(
                  errors,
                  `sections.personas.personas.${index}.value_promise`
                )}
              >
                <Textarea
                  rows={2}
                  placeholder="Was wir dieser Persona versprechen"
                  {...register(`sections.personas.personas.${index}.value_promise`)}
                />
              </FormField>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              personas.append({
                type: "user",
                cares_about: "",
                challenge: "",
                value_promise: "",
              })
            }
          >
            <Plus className="w-4 h-4" />
            Persona hinzufuegen
          </Button>
        </div>
      </FormField>
    </div>
  );
}
