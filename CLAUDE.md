# CLAUDE

## Purpose

This file defines the default operating behavior for Claude Code inside the StrategAIze Intelligence Studio repository.

It is intended to work together with:
- the project documentation
- the project `.claude/rules/`
- the project `.claude/skills/`

## Operating mode

Use repository documentation and project records as the source of truth.

Do not invent scope, requirements, architecture, or release assumptions that are not supported by project documentation or explicit user direction.

Prefer narrow, testable changes over broad speculative implementation.

## Skill usage

When an appropriate skill exists, prefer the project skill workflow before ad hoc implementation.

### Mandatory workflow sequence

The following sequence is **mandatory** and must not be skipped, regardless of perceived scope size:

1. `/discovery` (only when idea is still rough)
2. `/requirements`
3. `/architecture`
4. `/slice-planning`
5. `/frontend` and/or `/backend` (per slice)
6. `/qa` (after every /frontend, /backend, /slice-planning AND as Gesamt-QA after all slices)
7. `/final-check`
8. `/go-live`
9. `/deploy`
10. `/post-launch`

**No step may be skipped** with justifications like "the scope is small enough" or "this is straightforward enough". Even small changes benefit from the discipline of the full sequence. The only valid reason to skip a step is explicit user approval.

**After every `/frontend`, `/backend`, or `/slice-planning` step**, `/qa` must be run automatically.

### Support skills (can be used at any point):
- `/help`
- `/docs`
- `/doctor`
- `/rollback`
- `/ui-update`
- `/review`

## Project records to respect

Treat these files as the primary project control documents where present:

- `/docs/STATE.md`
- `/docs/PRD.md`
- `/docs/ARCHITECTURE.md`
- `/docs/DECISIONS.md`
- `/docs/KNOWN_ISSUES.md`
- `/docs/RELEASES.md`
- `/docs/MIGRATIONS.md`
- `/docs/SKILL_IMPROVEMENTS.md`
- `/features/INDEX.md`
- `/slices/INDEX.md`

## File Path Reporting (MANDATORY)

Whenever creating, modifying, moving, renaming, or deleting files, always report the full repository-relative path.

Always group file results by:
- Created
- Modified
- Renamed
- Deleted

Never describe file changes without explicit paths.

## Documentation discipline

When meaningful implementation or planning changes occur, update the matching project documents.

Do not leave important project documentation stale after meaningful changes.

## Scope discipline

Do not silently expand V1.
Do not convert a focused intelligence tool into a broader platform without explicit approval.
Prefer the smallest correct next step.

## Project context

StrategAIze Intelligence Studio is the local intelligence, IP, and production system of StrategAIze. It collects insights from onboarding, delivery, sales, market observation, and internal ideas, condenses them into patterns and opportunities, develops reusable modules, scripts, and knowledge building blocks, organizes them in catalogs, and produces targeted assets, product ideas, and knowledge-platform-ready outputs.

This is System 4 in the StrategAIze ecosystem — a cross-cutting learning and production layer over Systems 1-3.