"use client";
import { useFormContext } from "react-hook-form";
import { Input, Select, FormField } from "@/components/design-system";
import type { BrandProfileData } from "@/lib/brand/schema";
import { fieldError } from "./fieldError";

export function Section1ProductOverview() {
  const { register, formState } = useFormContext<BrandProfileData>();
  const errors = formState.errors;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        label="One-Line-Description"
        required
        hint="Was ist es in einem Satz?"
        error={fieldError(errors, "sections.productOverview.one_line_description")}
      >
        <Input
          placeholder="z.B. KI-gestuetzte Marketing-Plattform fuer B2B-SaaS"
          {...register("sections.productOverview.one_line_description")}
        />
      </FormField>
      <FormField
        label="Was es macht"
        required
        error={fieldError(errors, "sections.productOverview.what_it_does")}
      >
        <Input
          placeholder="Konkrete Funktion in einem Satz"
          {...register("sections.productOverview.what_it_does")}
        />
      </FormField>
      <FormField
        label="Produkt-Kategorie"
        required
        error={fieldError(errors, "sections.productOverview.product_category")}
      >
        <Input
          placeholder="z.B. Marketing-Automation"
          {...register("sections.productOverview.product_category")}
        />
      </FormField>
      <FormField
        label="Produkt-Typ"
        required
        error={fieldError(errors, "sections.productOverview.product_type")}
      >
        <Select {...register("sections.productOverview.product_type")}>
          <option value="">— bitte waehlen —</option>
          <option value="SaaS">SaaS</option>
          <option value="Marketplace">Marketplace</option>
          <option value="E-Commerce">E-Commerce</option>
          <option value="Service">Service</option>
          <option value="Internal-Tool">Internal-Tool</option>
          <option value="Other">Other</option>
        </Select>
      </FormField>
      <FormField
        label="Geschaeftsmodell"
        required
        hint="z.B. Subscription, License, Usage-based"
        error={fieldError(errors, "sections.productOverview.business_model")}
        className="md:col-span-2"
      >
        <Input
          placeholder="Wie wird Umsatz erzielt?"
          {...register("sections.productOverview.business_model")}
        />
      </FormField>
    </div>
  );
}
