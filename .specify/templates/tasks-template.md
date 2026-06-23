---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Verification tasks are required when the changed behavior can fail.
Use Playwright-BDD for public journeys, Storybook/component tests for reusable UI,
Vitest for isolated logic, and lint/build tasks for release readiness.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Routes/layouts/API**: `app/`
- **Reusable UI and sections**: `components/`
- **Shared logic**: `lib/`
- **E2E specs**: `features/` and `tests/step-definitions/`
- **Component stories/tests**: colocated `*.stories.tsx` files and `.storybook/`
- **Database**: `prisma/schema.prisma` and `prisma/migrations/`
- **Generated Prisma client**: `app/generated/prisma/` (never edit manually)

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Update Prisma schema/migrations in prisma/ if data model changes
- [ ] T005 [P] Update shared i18n messages/routes in lib/ if locale behavior changes
- [ ] T006 [P] Update App Router API or route structure in app/ if needed
- [ ] T007 Create shared data helpers or Server Component boundaries all stories depend on
- [ ] T008 Configure error handling, analytics, and SEO metadata infrastructure
- [ ] T009 Document environment configuration and launch impacts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Verification for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Add/update French Gherkin scenario for [journey] in features/[name].feature
- [ ] T011 [P] [US1] Add/update Playwright-BDD steps in tests/step-definitions/[name].steps.ts
- [ ] T012 [P] [US1] Add/update Storybook story for [component] in components/[area]/[component]/[component].stories.tsx
- [ ] T013 [P] [US1] Add/update Vitest coverage for [logic] in lib/[name].test.ts or components/[area]/[name].test.ts

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create/update route or layout in app/[route]/[file].tsx
- [ ] T015 [P] [US1] Create/update reusable component in components/[area]/[component]/[component].tsx
- [ ] T016 [US1] Implement server/data helper in lib/[name].ts (depends on T014/T015 as needed)
- [ ] T017 [US1] Add validation, error handling, and empty-state behavior
- [ ] T018 [US1] Add French and English copy plus metadata/JSON-LD updates

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Verification for User Story 2 ⚠️

- [ ] T019 [P] [US2] Add/update French Gherkin scenario for [journey] in features/[name].feature
- [ ] T020 [P] [US2] Add/update Playwright-BDD steps in tests/step-definitions/[name].steps.ts
- [ ] T021 [P] [US2] Add/update Storybook or Vitest coverage for changed UI/logic

### Implementation for User Story 2

- [ ] T022 [P] [US2] Create/update route, section, or API handler in app/ or components/
- [ ] T023 [US2] Implement shared logic in lib/[name].ts
- [ ] T024 [US2] Integrate with User Story 1 components if needed
- [ ] T025 [US2] Add locale, SEO, and accessibility handling

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Verification for User Story 3 ⚠️

- [ ] T026 [P] [US3] Add/update French Gherkin scenario for [journey] in features/[name].feature
- [ ] T027 [P] [US3] Add/update Playwright-BDD steps in tests/step-definitions/[name].steps.ts
- [ ] T028 [P] [US3] Add/update Storybook or Vitest coverage for changed UI/logic

### Implementation for User Story 3

- [ ] T029 [P] [US3] Create/update route, section, or API handler in app/ or components/
- [ ] T030 [US3] Implement shared logic in lib/[name].ts
- [ ] T031 [US3] Add locale, SEO, and accessibility handling

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional Vitest coverage for changed logic
- [ ] TXXX [P] Storybook accessibility review for changed reusable UI
- [ ] TXXX Security hardening
- [ ] TXXX SEO/indexing verification for changed public routes
- [ ] TXXX Run `npm run lint`
- [ ] TXXX Run affected Playwright-BDD, Vitest, and Storybook checks
- [ ] TXXX Run `npm run build` before release
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Verification tasks MUST be written before implementation when behavior can fail independently
- Prisma schema/migrations before code that depends on changed generated types
- Server/data helpers before route and component integration
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All verification tasks for a user story marked [P] can run in parallel
- Independent routes, components, and helpers within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Add/update French Gherkin scenario in features/[name].feature"
Task: "Add/update Playwright-BDD steps in tests/step-definitions/[name].steps.ts"
Task: "Add/update Storybook story in components/[area]/[component]/[component].stories.tsx"

# Launch independent implementation work for User Story 1 together:
Task: "Create/update route in app/[route]/[file].tsx"
Task: "Create/update component in components/[area]/[component]/[component].tsx"
Task: "Create/update helper in lib/[name].ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing when adding new automated coverage
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
