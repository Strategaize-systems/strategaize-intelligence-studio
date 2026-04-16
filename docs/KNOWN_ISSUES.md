# Known Issues

### ISSUE-001 — Business-System hat keine Qualified-Lead-Inbox-Entität
- Status: open
- Severity: High
- Area: Cross-System-Abhängigkeit / Business Development System
- Summary: FEAT-014 Qualified Lead Handoff (IS V3) hängt von einer Qualified-Lead-Inbox-Entität im Business Development System ab, die heute nicht existiert. Business V4 hat nur Kontakte, Unternehmen, Deals, Angebote — keinen dedizierten Lead-Eingangstopf für Pre-Sales-Leads.
- Impact: Ohne Business-seitige Inbox kann FEAT-014 nur als CSV-Export + manueller Import laufen (Übergangslösung). Der geplante API-Push mit Status-Sync funktioniert erst, wenn Business die Inbox-Entität liefert. Das ist keine V3-Scharfschaltung im vollen Sinn.
- Workaround: CSV-Export-Mechanismus in FEAT-014 gebaut lassen. Manueller Handoff-Button als Fallback. IS zeichnet Handoff-Events trotzdem auf, Status-Sync wird im CSV-Modus manuell vom Berater erfasst.
- Next Action: Business-Roadmap-Abstimmung vor V3-Slice-Planning. BL-016 im Backlog. Zu klären: Business-Version für Feature-Integration (V4.2, V5?), Auth-Modell (API-Token, OAuth, mTLS), JSON-Payload-Struktur, Status-Sync-Mechanik (Webhook vs. Poll).