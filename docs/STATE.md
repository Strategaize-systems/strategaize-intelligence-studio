# STATE

## Project
- Name: StrategAIze Intelligence Studio
- Repository: strategaize-intelligence-studio
- Delivery Mode: internal-tool

## Purpose
Das lokale Intelligence-, IP-, Modul-, Script- und Wissensverdichtungs-System von StrategAIze. Es verarbeitet Erkenntnisse aus Onboarding, Delivery, Vertrieb, Marktbeobachtung und internen Ideen, verdichtet sie zu Mustern und Chancen, überführt sie in wiederverwendbare Kataloge und erzeugt daraus gezielt Assets, Produktideen und wissensplattformfähige Outputs.

## Current State
- High-Level State: requirements
- Current Focus: Discovery abgeschlossen — V1-Scope mit 10 Modulen definiert, 5 technische Grundsatzentscheidungen getroffen. Nächster Schritt: vollständiges PRD via /requirements.
- Current Phase: Requirements

## Immediate Next Steps
1. /requirements — Vollständiges PRD auf Basis der Discovery erstellen
2. /architecture — Technische Architektur definieren

## Active Scope
V1 Intelligence Studio MVP: Insight Inbox, Insight Analyzer, Pattern & Signal Clustering (Basis), Improvement Engine, Opportunity & Product Catalog, Decision & Action Board, Content & Asset Transformer (Grundtypen), Brand & Output Control, Modules & Script Builder (Basis), Knowledge Packaging Engine (Basis).

## Blockers
- aktuell keine

## Last Stable Version
- none yet

## Notes
- System 4 in der StrategAIze-Gesamtarchitektur (querliegende Lern- und Produktionsschicht über System 1-3)
- Primärnutzer: Gründer, ggf. 1 interne Person — kein Multiuser-System
- Lokal-first: Next.js lokal + SQLite + Claude Code Agent Tool (Max-Subscription)
- DSGVO-Schnitt: Rohdaten lokal, nur abstrahierte Insights an Claude
- Discovery-Report: /reports/RPT-001.md