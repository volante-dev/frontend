<!--
Sync Impact Report
Version change: N/A -> 1.0.0
Modified principles:
- Template principle 1 -> I. Experience Integrity
- Template principle 2 -> II. Bilingual and SEO Correctness
- Template principle 3 -> III. Type-Safe Next.js Boundaries
- Template principle 4 -> IV. Verifiable Quality Gates
- Template principle 5 -> V. Operational Data and Release Discipline
Added sections:
- Product and Technology Constraints
- Delivery Workflow
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ✅ .specify/templates/commands/*.md (directory absent; no command templates to update)
Runtime guidance reviewed:
- ✅ README.md
- ✅ docs/SEO-LAUNCH.md
- ✅ CLAUDE.md
- ✅ AGENTS.md
Follow-up TODOs:
- None
-->
# Studio Volante Frontend Constitution

## Core Principles

### I. Experience Integrity

Every feature MUST preserve the Studio Volante public experience as a polished
bilingual creative-agency website. UI work MUST use the existing App Router
structure, MUI theme tokens, shared layout providers, and reusable components
before adding new primitives. Motion, video, page transitions, and visual effects
MUST respect `prefers-reduced-motion` and MUST not block content discovery,
navigation, or form completion. Rationale: the brand experience is the product,
so visual changes are only acceptable when they remain accessible, responsive,
and consistent with the established system.

### II. Bilingual and SEO Correctness

All public-facing routes and content changes MUST account for French and English.
Unprefixed routes are French, `/en/...` routes are English, and canonical,
alternate, Open Graph, robots, sitemap, breadcrumb, and JSON-LD behavior MUST
remain correct for both locales. Published portfolio, service, testimonial, and
organization facts MUST be verifiable and sourced from approved data or
environment configuration. Rationale: search visibility and language correctness
are first-order requirements for the site, not post-launch cleanup.

### III. Type-Safe Next.js Boundaries

Implementation MUST keep React Server Components as the default for pages and
data-fetching sections, using Client Components only for browser state,
animation, event handlers, or MUI wrappers that require them. TypeScript MUST
remain strict: no `any`, type-only imports where applicable, arrow functions, and
generated Prisma files under `app/generated/prisma/` MUST never be edited by
hand. Database access MUST go through Prisma and the existing PostgreSQL
configuration. Rationale: clear server/client boundaries and type safety prevent
locale cache leaks, hydration bugs, and fragile data access.

### IV. Verifiable Quality Gates

Each feature MUST define how it will be verified before implementation starts.
User-facing journeys MUST include Playwright-BDD coverage in French when the
behavior can be exercised end to end. Reusable UI components MUST have Storybook
coverage or an explicit reason why a story is not useful. Pure logic, routing,
i18n, layout algorithms, and data transforms MUST have focused Vitest tests when
they can fail independently. Every change MUST pass `npm run lint`; release
candidates MUST pass `npm run build`, and affected end-to-end or component tests
MUST pass before merge. Rationale: the site depends on visual, localized, and
SEO-sensitive behavior that regressions can otherwise hide.

### V. Operational Data and Release Discipline

Environment-driven behavior MUST remain explicit and documented, including
`COMING_SOON`, `NEXT_PUBLIC_APP_URL`, Edge Config overrides, Resend, IndexNow,
and database URLs. Prisma schema changes MUST include migrations and must
distinguish runtime pooled connections from direct migration connections. Launch
or SEO-impacting changes MUST update `docs/SEO-LAUNCH.md` when production steps
change. Vercel Analytics and Speed Insights MUST remain active on the public
experience unless a documented replacement is approved. Rationale: production
correctness depends on deploy configuration, database migration discipline, and
search-engine visibility as much as application code.

## Product and Technology Constraints

The application is a Next.js 16 App Router frontend for Studio Volante, built
with React 19, TypeScript, MUI v7, Prisma v7, PostgreSQL, Storybook, Vitest,
Playwright-BDD, Vercel Analytics, and Vercel Speed Insights.

Source ownership follows the current repository layout:

- `app/`: App Router routes, layouts, API routes, metadata, theme, and generated
  Prisma client output.
- `components/`: layout, provider, section, SEO, and shared UI components.
- `lib/`: i18n, SEO, preview, Prisma, sanitization, and route helpers.
- `features/`: French Gherkin feature files for Playwright-BDD.
- `tests/step-definitions/`: Playwright-BDD step definitions.
- `prisma/`: schema and migrations.
- `.storybook/` and component `*.stories.tsx`: component documentation and
  browser-based component tests.

New dependencies MUST be justified in the implementation plan with their user
or operational value. Generated output, build artifacts, and framework cache
directories MUST not be used as source of truth.

## Delivery Workflow

Feature specifications MUST describe independently testable user journeys,
locale impact, SEO/indexing impact, content/data dependencies, and measurable
success criteria. Implementation plans MUST complete the Constitution Check
before Phase 0 research and repeat it after design.

Tasks MUST be grouped by independently deliverable user story. Each story MUST
include verification tasks that match its risk: Playwright-BDD for public
journeys, Storybook/component tests for reusable UI, Vitest for isolated logic,
and build/lint gates for release readiness. Tasks that alter Prisma schema,
environment variables, or launch behavior MUST include migration or operational
documentation updates.

Pull requests MUST document any constitution deviations in the plan's Complexity
Tracking table. Deviations require a simpler alternative, a reason it was
rejected, and explicit reviewer acceptance before merge.

## Governance

This constitution supersedes informal project practices for Spec Kit features in
this repository. Amendments require an explicit constitution update, a semantic
version bump, a Sync Impact Report, and propagation to affected templates and
runtime guidance.

Versioning follows semantic versioning:

- MAJOR: removes or redefines a principle or weakens a mandatory governance
  requirement.
- MINOR: adds a principle, adds a mandatory section, or materially expands
  required quality gates.
- PATCH: clarifies wording, fixes typos, or updates non-semantic examples.

Compliance is reviewed during planning, task generation, implementation, and code
review. If a feature cannot comply, the plan MUST record the violation before
implementation and the reviewer MUST either accept the documented tradeoff or
request a constitution amendment.

**Version**: 1.0.0 | **Ratified**: 2026-06-23 | **Last Amended**: 2026-06-23
