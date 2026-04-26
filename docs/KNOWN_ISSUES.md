# Known Issues

### ISSUE-001 — Business-System hat keine Qualified-Lead-Inbox-Entität
- Status: resolved
- Severity: High
- Area: Cross-System-Abhängigkeit / Business Development System
- Summary: FEAT-014 Qualified Lead Handoff (alte V3-Architektur, DEC-005) hing von einer Qualified-Lead-Inbox-Entität im Business Development System ab, die nicht existierte.
- Impact: Hat Business-Roadmap-Abhaengigkeit erzeugt (alte BL-016).
- Resolution: Strategischer Pivot 2026-04-25/26 (DEC-022) — Qualified-Lead-Inbox-Architektur durch Pipeline-Push in bestehende Business-Pipeline `Lead-Generierung` ersetzt. Die separate Inbox-Entitaet ist nicht mehr noetig. Business-Roadmap-Abhaengigkeit (BL-016) entfaellt.
- Replacement-Issue: Aus der Pipeline-Push-Architektur ergibt sich eine neue, kleinere Abhaengigkeit (POST-Endpoint im Business-System fehlt), die als ISSUE-002 separat dokumentiert ist.
- Next Action: Erledigt. Status auf resolved, Verweis auf DEC-022 + ISSUE-002.

### ISSUE-002 — Business-System hat keinen POST-Endpoint fuer externe Deal-Erstellung
- Status: open
- Severity: High
- Area: Cross-System-Abhängigkeit / Business Development System
- Summary: Pre-Implementation-Verifikation (BL-026, 2026-04-26): Business-System V4+ hat eine Pipeline-Funktion mit konfigurierbaren Stages (Tabellen `pipelines`, `pipeline_stages`, `deals`), aber **keinen** POST-Endpoint fuer externe Deal-Erstellung. Es existiert nur `GET /api/export/deals` (READ-only, Auth via `EXPORT_API_KEY`). Auch keine `INTERNAL_API_TOKEN`-Auth-Pattern, keine `/api/internal/*`-Namespace. Keine Webhooks fuer Deal-Status-Aenderungen.
- Impact: V1-Marketing-Launcher SLC-108 (Lead Handoff via Pipeline-Push) kann nicht voll funktionieren. Acceptance-Criterion "mind. 1 erfolgreicher Pipeline-Push" ist nicht erreichbar bis Business-Sprint POST-Endpoint liefert.
- Workaround: V1 SLC-108 implementiert `businessPipelineAdapter` vollstaendig, aber per Feature-Flag `BUSINESS_PIPELINE_PUSH_ENABLED=false` initial deaktiviert. Manual-Mode-Markierung im UI wird als V1-Default verwendet (User markiert Lead manuell als "in Business-Pipeline angelegt"). Idempotency-Key (UNIQUE auf `lead_id, campaign_id`) wird trotzdem geschrieben fuer spaeteren Auto-Push.
- Next Action: BL-027 im IS-Backlog dokumentiert: Business-System Coordination-Sprint im Business-Repo: POST `/api/internal/deals` Endpoint + INTERNAL_API_TOKEN-Auth + Pipeline „Lead-Generierung" Stage „Neu" als Default-Konfiguration. Parallel zu V1-IS-Implementation. V1-Marketing-Launcher Final-Check/Go-Live setzt voraus: BL-027 abgeschlossen, Smoke-Test erfolgreich, Feature-Flag aktiv.

### ISSUE-003 — Firecrawl-Cloud verletzt Data-Residency (US-Hosting)
- Status: open
- Severity: High
- Area: Data Residency / DSGVO
- Summary: Pre-Implementation-Verifikation (BL-025, 2026-04-26): Firecrawl-Cloud-Service ist explizit US-gehostet (Quelle: Firecrawl Privacy Policy — "Firecrawl's servers are located in the United States and this is where your data and information will be stored"). Verletzt DEC-002 (Bedrock eu-central-1), DEC-003 (EU-only Hosting) und `.claude/rules/data-residency.md`. Auch wenn Firecrawl GDPR-konform agiert, der tatsaechliche Datenfluss erfolgt in US-Region — bei deutschen B2B-Customer-Daten nicht akzeptabel.
- Impact: V1-FEAT-015 (Lead Research) Primary-Provider ist gefaehrdet. Cloud-Variante darf nicht verwendet werden.
- Workaround: Firecrawl ist Open Source und unterstuetzt Self-Hosting explizit. DEC-028 entscheidet: V1 = Self-Hosted Firecrawl auf Hetzner.
- Next Action: BL-028 im IS-Backlog dokumentiert: Firecrawl-Self-Host-Setup (Container im Compose oder dedizierter Hetzner-Server, Auth-Token, Smoke-Test). Vor SLC-105 (Lead Research) abzuschliessen. Bei Volumen-Wachstum > 10k Crawls/Monat ist Self-Host kostenmaessig klar im Vorteil. Bei < 1k Crawls/Monat moeglicherweise Server-Fixkosten ueberwiegen — V1-Volumen-Estimate 200-500 Crawls/Monat ist akzeptabler Trade-off, DSGVO-Konformitaet ist nicht-verhandelbar.
