# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Studio Volante — bilingual (FR/EN) creative agency website built with Next.js 16 App Router.

## Commands

```bash
npm run dev              # Start dev server
npm run build            # prisma generate + next build
npm run lint             # ESLint (flat config v9)
npm run storybook        # Storybook dev on port 6006
npm run test:e2e         # bddgen + playwright (headless)
npm run test:e2e:ui      # Playwright with interactive UI
```

Run a single Playwright test file:
```bash
npx playwright test tests/step-definitions/homepage.spec.ts
```

Run Vitest (Storybook component tests):
```bash
npx vitest
```

## Architecture

### Routing & Middleware

The locale routing is handled by a **custom `proxy.ts`** (not a Next.js `middleware.ts`). The public URL is the source of truth: unprefixed paths are French and `/en/...` paths are English. The proxy rewrites them to distinct internal `[locale]` routes so App Router caches cannot mix languages. Pages read locale from their route params.

### Internationalization

- Locales: French (default) and English
- Complete French and English fallback dictionaries live in `lib/i18n-messages.ts`
- **Vercel Edge Config** can override dictionary values without becoming a runtime dependency
- Server Components call `getTranslations(locale)`; Client Components consume the shared `I18nProvider`

### Database

- PostgreSQL hosted on Neon, accessed via Prisma v7 with `@prisma/adapter-pg`
- **Two connection strings are required**:
  - `DATABASE_URL` — pooled via pgBouncer, used at runtime
  - `DATABASE_URL_UNPOOLED` — direct connection, used only for migrations
- Prisma client is generated into `app/generated/prisma/` — never edit it manually
- Schema models: `Project`, `Service`, `StudioValue`, `Testimonial`

### Component Boundaries

- Pages and data-fetching sections are **React Server Components** by default
- UI wrappers (`components/ui/`) use `"use client"` and wrap MUI components
- MUI v7 is integrated via `@mui/material-nextjs` for App Router compatibility; the custom theme lives in `app/theme/`

### Feature Flag

`COMING_SOON=true` env var switches the root route to serve the `app/coming-soon/` landing page.

## Code Style

Enforced by ESLint + Prettier (see `eslint.config.mjs` and `.prettierrc`):
- Arrow functions only (no `function` declarations)
- No `any` — strict TypeScript throughout
- Type imports (`import type { ... }`)
- Self-closing JSX components
- 100-char line width, single quotes off, trailing commas, LF line endings

## Testing

- **E2E (Playwright-BDD)**: Gherkin feature files in `features/` and step definitions in `tests/step-definitions/`. All scenarios are written **in French**.
- **Component tests**: Vitest + Storybook Vitest addon running in a Playwright Chromium browser
- **Visual regression**: Storybook Chromatic addon
- Playwright config runs two projects: Chromium desktop and iPhone 14 mobile
