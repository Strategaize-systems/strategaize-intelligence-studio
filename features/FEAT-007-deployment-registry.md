# FEAT-007 — Customer Deployment Registry

## Status
- Version: V1
- Status: planned
- Priority: high

## Purpose
Pro Kunde festhalten, **was wirklich läuft** — Deployment-Typ, Server, aktive Module, Code-Version, Konfiguration. Grundlage für Support, Update-Rollout und strukturierten Überblick, welcher Kunde auf welchem technischen Stand ist.

Diese Daten werden **IS-seitig** geführt, weil Business V4 kein Produkt-/Deployment-Modell hat und das auch nicht zu Business' Revenue-/CRM-Fokus passt.

## In Scope (V1)

### Deployment-Entität (pro Kunde, n:1 zu Kunde aus FEAT-002)
Felder:
- `deployment_type`: `saas_shared | saas_dedicated | self_hosted | local`
- `hoster`: freier Text (z. B. "Hetzner", "AWS Kunde", "Büro-Server", "Lokaler Laptop")
- `host_identifier`: Server-Name oder Host-Referenz (z. B. "onboarding.kunde-xyz.de", "hetzner-cpx31-dedicated-3", "intern lokal"). **Keine Secrets.**
- `access_method`: freier Text zur Zugangs-Methode (z. B. "SSH via 1Password Eintrag Onboarding-Kunde-XYZ", "Coolify Web-UI", "Kein Zugriff, Kunde operiert selbst"). Referenziert Passwort-Manager, speichert keine Secrets.
- `active_modules`: Liste aktiver Module/Templates (z. B. ["onboarding-questionnaire", "onboarding-exception", "business-v4-cockpit"])
- `code_version`: Versionsstring oder Commit-Hash (z. B. "v1.0.5" oder "abc1234")
- `last_updated_at`: wann wurde der Kunde zuletzt geupdated
- `config_notes`: freier Text für Abweichungen, Sonderlocken, Kundenwünsche
- `status`: `active | paused | archived`

### UI

**Deployment-Detail-Ansicht (pro Kunde, in FEAT-003 eingebettet)**
Zeigt alle Felder, erlaubt Editing.

**Update-Rollout-Ansicht (eigene Seite)**
- Liste aller aktiven Kunden mit `code_version` und `last_updated_at`
- Filter: „welche Kunden laufen auf Version X?", „welche Kunden sind seit > 90 Tagen nicht aktualisiert?"
- Gruppiert nach `deployment_type` (SaaS-Kunden separat, Self-Hosted separat)
- Export-CSV für Rollout-Planung

## Out of Scope (V2+)
- Automatische Erkennung der aktuellen Version per API-Call zum Kundensystem (V2)
- Update-Trigger / Auto-Deploy aus IS (V3)
- Health-Checks der Kunden-Deployments (V2)
- Alerts bei veralteten Versionen (V2)
- Template-Konfiguration des Kunden-Plattform-Modus (V3 — Template-Modus Feature)
- Shared-Infrastruktur-Sicht (z. B. welche Jitsi-Instanz nutzt welcher Kunde) — V2

## Acceptance Criteria
- AC-01: Neues Deployment kann pro Kunde angelegt werden (alle Felder)
- AC-02: Validierung: `deployment_type = self_hosted` erfordert `host_identifier`
- AC-03: Validierung: `access_method` darf keine Secrets enthalten (simple Pattern-Prüfung: kein Passwort, kein Token, kein Key-String)
- AC-04: Update-Rollout-Ansicht filtert korrekt nach Version, Zeitraum, Typ
- AC-05: Änderungen an Deployment sind versioniert (History — wer hat wann geändert)
- AC-06: Kunde ohne Deployment-Eintrag wird in FEAT-003 trotzdem angezeigt

## Dependencies
- FEAT-002 (Ingest Business) — liefert Kunden-Entitäten, auf die sich Deployments beziehen
- FEAT-003 (Portfolio-Monitor) — UI-Host für Deployment-Detail

## Notes
- **Sicherheitsregel:** Secrets (SSH-Keys, Passwörter, API-Tokens) werden NICHT im IS gespeichert. `access_method` ist nur Referenz auf Passwort-Manager-Eintrag oder Zugangs-Hinweis.
- **V3-Erweiterung:** Wenn Template-Produkt-Modus kommt, wird `active_modules` zum Template-Konfigurationsspeicher. Schema heute schon flexibel (JSONB oder freie Liste).
- V1-Größe: max ~50 Deployments erwartet, keine Performance-Sorge.
