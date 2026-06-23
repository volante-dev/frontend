# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript, React 19, Next.js 16 App Router

**Primary Dependencies**: MUI v7, Prisma v7, PostgreSQL, Vercel Analytics/Speed
Insights, Resend, Edge Config where relevant

**Storage**: PostgreSQL via Prisma, or N/A if the feature is static/presentation-only

**Testing**: ESLint, Vitest, Storybook browser tests, Playwright-BDD

**Target Platform**: Vercel-hosted public web frontend, desktop and mobile browsers

**Project Type**: Next.js frontend with App Router API routes

**Performance Goals**: Preserve Core Web Vitals, responsive page transitions,
fast bilingual route discovery, and non-blocking public navigation

**Constraints**: French default routes, `/en` English routes, correct canonical
and alternate metadata, `prefers-reduced-motion` support, no manual edits under
`app/generated/prisma/`, no unverified public claims

**Scale/Scope**: Public Studio Volante website, portfolio/service content,
contact flow, SEO/indexing, and preview/coming-soon behavior

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Experience Integrity**: Reuses existing App Router structure, MUI theme
  tokens, providers, and components; preserves accessibility, responsive layout,
  and reduced-motion behavior.
- **Bilingual and SEO Correctness**: Defines French and English behavior,
  canonical/alternate metadata, Open Graph, robots/sitemap, JSON-LD, and
  verifiable content impact.
- **Type-Safe Next.js Boundaries**: Keeps Server Components as default, limits
  Client Components to browser-only needs, uses Prisma for data access, and
  preserves strict TypeScript/ESLint rules.
- **Verifiable Quality Gates**: Lists required Playwright-BDD, Storybook,
  Vitest, lint, and build checks for the changed behavior.
- **Operational Data and Release Discipline**: Identifies env vars, Edge Config,
  Prisma migrations, launch/SEO docs, analytics, and deployment effects.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
app/
├── (public)/              # Public routes/layouts, localized pages, project detail routes
├── api/                   # App Router API routes
├── coming-soon/           # Launch-gated landing page
├── generated/prisma/      # Generated Prisma client output; do not edit
└── theme/                 # MUI theme and design tokens

components/
├── layout/                # Header/footer, transitions, public experience providers
├── providers/             # Shared client providers
├── sections/              # Page sections and feature UI
├── seo/                   # JSON-LD and metadata helpers
└── ui/                    # Reusable MUI-backed primitives

lib/                       # i18n, SEO, preview, Prisma, sanitization, route helpers
features/                  # French Playwright-BDD feature files
tests/step-definitions/    # Playwright-BDD steps
prisma/                    # Schema and migrations
.storybook/                # Storybook/Vitest browser test configuration
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
