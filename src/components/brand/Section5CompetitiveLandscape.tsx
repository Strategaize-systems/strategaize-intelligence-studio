"use client";
import type { BrandProfileData } from "@/lib/brand/schema";
import { CompetitorListField } from "./CompetitorListField";

export function Section5CompetitiveLandscape() {
  return (
    <div className="space-y-5">
      <CompetitorListField<BrandProfileData>
        name="sections.competitiveLandscape.direct_competitors"
        label="Direkte Competitors"
        required
        hint="Mind. 1 Direkt-Competitor."
        minItems={1}
      />
      <CompetitorListField<BrandProfileData>
        name="sections.competitiveLandscape.secondary_competitors"
        label="Sekundaere Competitors"
        hint="Optional"
      />
      <CompetitorListField<BrandProfileData>
        name="sections.competitiveLandscape.indirect_competitors"
        label="Indirekte Competitors"
        hint="Optional"
      />
    </div>
  );
}
