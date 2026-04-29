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

### ISSUE-004 — Coolify-Service-FQDN nicht via API setzbar (Supabase Kong)
- Status: open
- Severity: Medium
- Area: Deployment / Coolify
- Summary: Beim Setup auf Hetzner-Coolify (2026-04-29, /backend SLC-101 MT-2): Coolify v4.0.0 erlaubt das Setzen einer Custom-Domain auf Sub-Applications eines Service-Stacks (z.B. supabase-kong) NICHT zuverlaessig via REST-API. PATCH auf SERVICE_FQDN_SUPABASEKONG ENV-Var erfolgreich, aber Stop+Start + Re-Deploy regenerieren die Traefik-Labels NICHT mit dem neuen FQDN. Kong-Container behaelt die auto-generierte sslip.io Domain. Endpoint /services/{uuid} mit `fqdn`-Field wird mit "Validation failed" abgelehnt; /services/{uuid}/applications/{uuid} liefert "not found".
- Impact: External-HTTPS-URL fuer is-api.strategaizetransition.com ist nicht aktiv. Browser-side Supabase-Calls (NEXT_PUBLIC_SUPABASE_URL) wuerden fehlschlagen — relevant ab SLC-103 (Asset Production), wo Next.js auf Supabase zugreift. Fuer SLC-101 Foundation + SLC-102 Brand Profile (server-only) NICHT relevant, weil Server-Code SUPABASE_URL=http://supabase-kong:8000 internal nutzt.
- Workaround: Coolify-UI manuell — Service-Detail → supabase-kong sub-app → Domains-Field auf https://is-api.strategaizetransition.com setzen → Save → Redeploy. 2-Klick-Job fuer User. Nicht jetzt erledigt weil nicht-blocking fuer SLC-101.
- Next Action: Vor SLC-103 Implementation-Start: User klickt Domain-Config in Coolify-UI. Alternativ: Workaround per direktem docker-compose-Patch + Service-Reload (hacky, vermeiden).

### ISSUE-005 — Browser-Smoke-Test der Showcase-Seite nicht durchgefuehrt
- Status: open
- Severity: Low
- Area: Verifikation / SLC-101
- Summary: SLC-101 MT-5 produziert eine Design-System-Showcase-Seite unter `/[locale]/_design-system`. Build + statische Generierung erfolgreich, aber kein Live-Browser-Test gegen einen laufenden Coolify-Deploy. Per Memory-Feedback `feedback_no_local_docker.md` ist lokaler Docker-Test verboten — Verifikation gehoert auf Hetzner. App ist aber noch nicht via Coolify deployt (kommt mit SLC-102/-103).
- Impact: Showcase-Seite wird in /qa SLC-101 nur statisch verifiziert (Build success, keine TS-Errors, importierbare Komponenten). Visuelle Korrektheit + Tailwind-CSS-Hydration + Layout-Rendering noch nicht im Browser bestaetigt.
- Workaround: Importierbarkeit + TypeScript-Korrektheit aller 14 Komponenten + 5 Layouts via Build verifiziert. Visuelle Pruefung erfolgt mit erstem Coolify-Deploy in SLC-102.
- Next Action: Resolve mit erstem Coolify-Deploy der Next.js App (vermutlich Ende SLC-102 oder Anfang SLC-103). Browser-Aufruf `https://is.strategaizetransition.com/de/_design-system` muss alle Komponenten + Layouts korrekt rendern.

### ISSUE-006 — Vitest DB-Tests laufen nicht automatisch gegen Hetzner-DB
- Status: open
- Severity: Low
- Area: Test-Infrastruktur
- Summary: `__tests__/migrations/002-constraints.test.ts` enthaelt 4 SAVEPOINT-basierte Constraint-Tests, die `TEST_DATABASE_URL` benoetigen. Aktuell skipped weil ENV nicht gesetzt im Standard-`npm run test`-Lauf. Per `coolify-test-setup.md` ist das Pattern `docker run --network ... node:20 npx vitest run` mit ENV-Override — nicht automatisiert in CI/CD weil noch keine CI/CD eingerichtet (V1 ist Internal-Tool).
- Impact: Constraints werden nur manuell verifiziert (in /qa SLC-101 via direktem psql + SAVEPOINT-Pattern erfolgreich getestet — alle 5 Constraints feuern korrekt). Aber: kein automatisierter Regression-Schutz bei kuenftigen Migrations-Aenderungen.
- Workaround: Manuelle Verifikation via direktem psql-Pattern (siehe RPT-012 QA-Output). Bei jeder neuen Migration zwingend die psql-Tests aktualisieren.
- Next Action: Spaeter (V1.1+ Hardening): npm-Script `test:db` einfuehren, das einen Test-DB-Container am Server-Netzwerk startet (per coolify-test-setup-Pattern). Vor V1-Final-Check pruefen ob noetig.

### ISSUE-007 — Next 16 hat `middleware.ts` zu `proxy.ts` Convention deprecated
- Status: open
- Severity: Low
- Area: Framework / Tech-Debt
- Summary: Beim Build-Output (Next 16.2.4): `⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.` SLC-101 nutzt `src/middleware.ts` fuer next-intl Locale-Routing. Funktioniert aktuell, ist aber deprecated.
- Impact: Build-Warning bei jedem Build. In zukuenftigen Next-Major-Versions (Next 17?) wird middleware.ts vermutlich entfernt.
- Workaround: Aktuell keine — middleware.ts funktioniert noch in Next 16.x.
- Next Action: V1.1+ Tech-Debt-Slice: middleware.ts → proxy.ts migrieren. Pattern aus next-intl Docs fuer Next 16+ uebernehmen. Nicht-blocking fuer V1.
