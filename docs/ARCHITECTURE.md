# Architecture

## Status
Re-Discovery läuft. Dieses Dokument wird im Rahmen von `/architecture` nach abgeschlossenem `/requirements` neu geschrieben.

Vorherige V1-Architektur: `/docs/archive/ARCHITECTURE-v1-original.md` — nicht mehr gültig.

## Verbindliche Rahmenbedingungen für die Neufassung
- Gesamtarchitektur-Referenz: `/strategaize-dev-system/docs/PLATFORM.md`
- Data-Residency und LLM-Provider: `/strategaize-dev-system/.claude/rules/data-residency.md`
  - LLM: AWS Bedrock eu-central-1 (Claude Sonnet/Opus), EU-Region verbindlich
  - Speech (falls benötigt): Azure Speech EU oder self-hosted Whisper; OpenAI-API direkt nicht zulässig
  - Provider-Adapter-Pattern erforderlich
- Integrationen (zu klären in `/architecture`):
  - Fluss 1: Inputs aus Onboarding-Plattform (Knowledge Units, Sessions, Lücken, Muster)
  - Fluss 3: Inputs aus Business Development System (Verlustmuster, Einwände, Gesprächssignale)
  - Fluss 4: Outputs zurück in Onboarding (Fragenkataloge, Templates, Capture-Logiken, Bewertungslogiken)
  - Fluss 5: Outputs zurück in Business (Argumente, Angebotsbausteine, Kataloge)
