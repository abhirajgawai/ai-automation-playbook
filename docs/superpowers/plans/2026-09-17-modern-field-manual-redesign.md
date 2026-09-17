# Modern Technical Field Manual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the complete playbook into a sleek, modern, highly readable technical field manual with meaningful React Flow teaching and decision experiences while preserving all content, local data and deployment behavior.

**Architecture:** Split the monolithic page module into focused feature pages and a semantic component system backed by design tokens. Introduce a reusable React Flow diagram layer for decision, state, system and diagnostic views; keep every essential diagram paired with a linear alternative. Preserve routes and storage schema, lazy-load route modules and diagram code, and redesign mobile compositions instead of shrinking desktop layouts.

**Tech Stack:** React 19, TypeScript 5.9, React Router 7, Vite 7, `@xyflow/react` 12, MiniSearch, CSS custom properties, Vitest, Testing Library, Playwright and axe.

**Spec:** `docs/superpowers/specs/2026-09-17-modern-field-manual-redesign.md`

## Global Constraints

- Preserve every existing route, stable content ID, source reference and schema-version-2 personal state.
- No backend, accounts, telemetry, runtime LLM, remote content fetch or paid dependency.
- Use electric blue `#2367FF`, signal lime `#A3E635`, ink `#101828`, cool canvas `#F5F7FA` and semantic derived tokens; dark mode must be independently tuned.
- Body copy is at least 16px with readable line height; guide prose targets 60–72 characters per line.
- React Flow is used only where relationships are clearer than prose and always has a semantically equivalent linear representation.
- Mobile comparison and diagram experiences must be recomposed, never squeezed to fit.
- Preserve keyboard navigation, reduced-motion support, WCAG AA contrast and visible focus.
- All fonts and core content remain locally bundled.
- Each task must keep `npm test`, `npm run typecheck` and relevant Playwright tests passing.
- Do not deploy until the full local suite, visual critique and release audit pass.

---

### Task 1: Baseline visual regression and test contract

**Files:**
- Modify: `tests/browser/acceptance.spec.ts`
- Create: `tests/browser/redesign.spec.ts`
- Create: `tests/components/ui.test.tsx`

**Interfaces:**
- Consumes: existing routes, labels and local-storage schema.
- Produces: explicit redesign acceptance tests and screenshot viewports used by all later tasks.

- [ ] Add failing browser assertions for `Learn`, `Decide`, and `Operate` navigation landmarks, a homepage decision diagram with an accessible linear alternative, minimum readable computed body font size, mobile comparison cards, and keyboard-selected diagram detail.
- [ ] Add the missing plan journeys: upstream decision recomputation, two-project review/note isolation, export-reset-import equivalence and the complete first-visit-to-bookmark path.
- [ ] Add screenshot projects or explicit viewport loops for 390×844, 768×1024, 1280×900 and 1536×960; save deterministic screenshots for homepage, durable-execution guide, start, review, troubleshoot and compare.
- [ ] Run `npx playwright test tests/browser/redesign.spec.ts` and confirm the new redesign assertions fail against the old UI while existing acceptance tests remain green.
- [ ] Commit with `test: define redesign acceptance contract`.

### Task 2: Design tokens, typography and primitives

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/styles/components.css`
- Create: `src/components/Primitives.tsx`
- Modify: `src/main.tsx`
- Modify: `src/components/UI.tsx`
- Modify: `src/styles.css`
- Test: `tests/components/ui.test.tsx`

**Interfaces:**
- Produces: `PageIntro`, `SectionHeading`, `Callout`, `StatusPill`, `IconButton`, `ReadingMeta`, `EmptyState` and semantic CSS tokens.
- `Callout` accepts `tone: "principle" | "evidence" | "warning" | "example" | "success"`, `title: string`, and `children: ReactNode`.

- [ ] Write component tests proving callout tones have visible text labels, headings retain semantic levels, and icon buttons require accessible names.
- [ ] Define light/dark semantic tokens, type scale, spacing, radii, borders, elevation and motion durations in `tokens.css`.
- [ ] Import only required local font subsets/weights and implement readable global typography, selection, focus, form and reduced-motion behavior in `base.css`.
- [ ] Build the primitives with semantic markup and no page-specific layout.
- [ ] Convert the legacy stylesheet into a compatibility layer, deleting rules as their pages migrate rather than stacking conflicting overrides.
- [ ] Run `npm test && npm run typecheck`; commit `feat: add modern field manual design system`.

### Task 3: Responsive application shell and navigation

**Files:**
- Create: `src/app/navigation.ts`
- Create: `src/components/AppHeader.tsx`
- Create: `src/components/MobileNav.tsx`
- Create: `src/components/SearchCommand.tsx`
- Modify: `src/app/Layout.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/styles/components.css`
- Test: `tests/browser/redesign.spec.ts`

**Interfaces:**
- Produces grouped navigation modes `{ label: "Learn" | "Decide" | "Operate", items: NavItem[] }` and a global search overlay.
- Search consumes the existing guide/category/failure-mode index and returns typed internal destinations.

- [ ] Add failing tests for grouped desktop navigation, mobile disclosure, Escape-to-close, focus return, active-route indication and search keyboard flow.
- [ ] Replace the permanent administration sidebar with the modern top navigation and contextual mobile menu while preserving every URL.
- [ ] Build a search command surface with categorized results and visible query feedback; keep the normal Explore page for full browsing.
- [ ] Add compact theme and saved-project access without turning the header into a dashboard.
- [ ] Verify keyboard order and 200% zoom behavior at desktop and mobile widths.
- [ ] Commit `feat: redesign application navigation`.

### Task 4: Reusable React Flow visual language

**Files:**
- Create: `src/features/diagrams/types.ts`
- Create: `src/features/diagrams/nodes.tsx`
- Create: `src/features/diagrams/edges.tsx`
- Create: `src/features/diagrams/DiagramFrame.tsx`
- Create: `src/features/diagrams/DiagramInspector.tsx`
- Create: `src/features/diagrams/LinearDiagram.tsx`
- Create: `src/features/diagrams/diagrams.css`
- Modify: `src/features/DecisionGraph.tsx`
- Test: `tests/components/diagram.test.tsx`
- Test: `tests/browser/redesign.spec.ts`

**Interfaces:**
- `DiagramDefinition = { id; title; description; nodes: PlaybookNode[]; edges: PlaybookEdge[]; linearSteps: LinearStep[] }`.
- Node kinds: `decision`, `principle`, `system`, `evidence`, `risk`, `outcome`.
- `DiagramFrame` accepts `definition`, `initialSelection?`, `variant: "light" | "dark"`, and `mobileMode: "canvas" | "steps"`.

- [ ] Write failing tests for node accessible names, keyboard selection, synchronized inspector text, branch highlighting and complete linear-step rendering.
- [ ] Implement custom node and edge components using semantic status labels, distinct shapes and restrained color.
- [ ] Implement selection state, fit/reset controls, legend, inspector and narrow-screen step mode.
- [ ] Rebuild the existing decision graph on `DiagramDefinition`; remove default-looking React Flow styles.
- [ ] Verify reduced motion, focus visibility, touch targets and no essential drag interaction.
- [ ] Commit `feat: establish playbook diagram system`.

### Task 5: Homepage vertical slice

**Files:**
- Create: `src/features/home/HomePage.tsx`
- Create: `src/features/home/home.css`
- Create: `src/features/home/homeDecision.ts`
- Modify: `src/app/App.tsx`
- Modify: `src/features/pages.tsx`
- Test: `tests/browser/redesign.spec.ts`

**Interfaces:**
- Consumes the reusable diagram system and existing recent-project/recent-guide/unresolved-review state.
- Produces a homepage route with stable accessible names for primary actions and diagram regions.

- [ ] Write failing tests for the promise, primary actions, decision-node explanation, stage path, local-only explanation and state-aware continuation.
- [ ] Implement the technical-canvas hero, interactive decision map and selected-node detail.
- [ ] Implement Discover/Design/Verify/Operate stage navigation using varied editorial composition rather than identical dashboard cards.
- [ ] Surface recent work and unresolved evidence only when real local data exists.
- [ ] Capture and critique all four target viewports; fix hierarchy, wrapping, focus and spacing issues before committing.
- [ ] Commit `feat: redesign playbook homepage`.

### Task 6: Guide reading system and durable-execution exemplar

**Files:**
- Create: `src/features/guides/GuidePage.tsx`
- Create: `src/features/guides/GuideNavigation.tsx`
- Create: `src/features/guides/GuideSection.tsx`
- Create: `src/features/guides/guide.css`
- Create: `src/features/diagrams/definitions/durableExecution.ts`
- Modify: `src/app/App.tsx`
- Modify: `src/features/pages.tsx`
- Test: `tests/browser/redesign.spec.ts`

**Interfaces:**
- Consumes `Guide`, source registry, bookmark/note state and `DiagramDefinition`.
- Produces stable section anchors, contextual navigation and optional guide-diagram lookup by guide ID.

- [ ] Add failing tests for 60–72ch prose, orientation metadata, decision rule, state diagram, safe/dangerous actions, section navigation, note persistence, bookmarks and source scope.
- [ ] Implement the editorial guide shell with desktop contextual rail and mobile in-page navigation.
- [ ] Map guide fields into the agreed learning sequence without hiding critical warnings.
- [ ] Add the durable-execution state model and failure trace using the diagram system.
- [ ] Validate browser back/forward, deep anchors, direct refresh and content without JavaScript-created external requests.
- [ ] Capture and critique desktop/mobile screenshots; commit `feat: create modern guide reading experience`.

### Task 7: Expand guide and exploration experience

**Files:**
- Create: `src/features/explore/ExplorePage.tsx`
- Create: `src/features/explore/GuideIndexItem.tsx`
- Create: `src/features/explore/explore.css`
- Create: `src/features/diagrams/definitions/contextAssembly.ts`
- Create: `src/features/diagrams/definitions/agentHarness.ts`
- Create: `src/features/diagrams/definitions/retrievalPipeline.ts`
- Modify: `src/features/guides/GuidePage.tsx`
- Modify: `src/app/App.tsx`
- Test: `tests/browser/redesign.spec.ts`

**Interfaces:**
- Uses the existing MiniSearch document index and guide IDs.
- Diagram registry maps guide ID to zero or one primary diagram plus optional supporting definitions.

- [ ] Build the filterable Learn landing page with topic/stage groupings and substantive previews.
- [ ] Apply the guide reading system to all 15 guides and verify every field remains reachable.
- [ ] Add only the three high-value system diagrams listed above; keep other relationships as structured prose unless a diagram adds clarity.
- [ ] Redesign related guides, glossary links, source freshness and bookmarks as coherent reading continuations.
- [ ] Run content validation and crawl all guide routes for console errors and broken internal links.
- [ ] Commit `feat: extend modern learning experience`.

### Task 8: Guided problem discovery

**Files:**
- Create: `src/features/discovery/StartProblemPage.tsx`
- Create: `src/features/discovery/QuestionStep.tsx`
- Create: `src/features/discovery/DecisionResults.tsx`
- Create: `src/features/discovery/discovery.css`
- Create: `src/features/diagrams/definitions/problemDecision.ts`
- Modify: `src/app/App.tsx`
- Test: `tests/decisions.test.ts`
- Test: `tests/browser/redesign.spec.ts`

**Interfaces:**
- Consumes `problemQuestions`, `evaluateAnswers`, existing project state and the diagram system.
- Produces grouped step IDs `outcome`, `process`, `consequence`, `authority`, `operations` while storing the same answer keys.

- [ ] Add unit and browser tests for grouped navigation, unknown answers, immediate recomputation and removal of stale dependent guidance.
- [ ] Implement progressive questions with an always-visible summary and transparent trigger explanations.
- [ ] Synchronize answers with a read-only decision graph and evidence-gap list.
- [ ] Preserve create, edit, explore-without-saving and project-specific routes.
- [ ] Commit `feat: redesign problem discovery workflow`.

### Task 9: Design review and project workspaces

**Files:**
- Create: `src/features/reviews/ReviewPage.tsx`
- Create: `src/features/reviews/ReviewItem.tsx`
- Create: `src/features/projects/ProjectsPage.tsx`
- Create: `src/features/projects/ProjectPage.tsx`
- Create: `src/features/projects/projects.css`
- Modify: `src/app/App.tsx`
- Test: `tests/browser/redesign.spec.ts`

**Interfaces:**
- Consumes unchanged `Project`, `ReviewRecord`, `ReviewStatus` and content-version semantics.
- Produces project summary calculations without persisting derived scores.

- [ ] Add failing tests for two-project review/evidence isolation, N/A rationale, stale review reassessment and stage-level unresolved counts.
- [ ] Implement focused review items, stage navigation, evidence grammar and obvious next actions.
- [ ] Redesign project list/detail around decisions, evidence gaps and continuation, not fake activity metrics.
- [ ] Preserve all existing records and add no readiness score.
- [ ] Commit `feat: redesign reviews and project workspaces`.

### Task 10: Evidence-driven troubleshooting

**Files:**
- Create: `src/features/troubleshooting/TroubleshootPage.tsx`
- Create: `src/features/troubleshooting/DiagnosticInspector.tsx`
- Create: `src/features/troubleshooting/troubleshooting.css`
- Create: `src/features/diagrams/troubleshootingDefinition.ts`
- Modify: `src/app/App.tsx`
- Test: `tests/browser/redesign.spec.ts`

**Interfaces:**
- Converts each existing `TroubleshootingFlow` and saved per-cause evidence answer into a `DiagramDefinition` without changing storage keys.

- [ ] Add failing tests for symptom grouping, cause selection, rule-out/support state, synchronized safe mitigation, persisted evidence and linear fallback.
- [ ] Implement the diagnostic React Flow tree with observed/supported/unknown/ruled-out states.
- [ ] Show one selected cause's evidence, safe mitigation and durable fix at a readable width.
- [ ] Ensure unconditional retry warnings remain prominent for uncertain side effects.
- [ ] Commit `feat: redesign evidence troubleshooting`.

### Task 11: Comparisons and cost model

**Files:**
- Create: `src/features/compare/ComparePage.tsx`
- Create: `src/features/compare/ComparisonPicker.tsx`
- Create: `src/features/compare/ComparisonMatrix.tsx`
- Create: `src/features/compare/CostModel.tsx`
- Create: `src/features/compare/compare.css`
- Modify: `src/app/App.tsx`
- Test: `tests/calculator.test.ts`
- Test: `tests/browser/redesign.spec.ts`

**Interfaces:**
- Consumes existing `ComparisonOption`, mandatory/preference criteria and `calculateMonthlyCost`.
- Produces a shortlist of at most three option IDs held in component state; no fabricated default ranking.

- [ ] Add tests for shortlisting, mandatory gates, unverified evidence, responsive stacked output, explicit units and calls-versus-attempts cost behavior.
- [ ] Replace the mega-table with catalogue filters, a two/three-option focused matrix and mobile comparison cards.
- [ ] Keep source scope, verification dates, limitations and unknown capability adjacent to each claim.
- [ ] Redesign pattern comparison and cost calculator as separate editorial sections.
- [ ] Capture a 390px screenshot and reject any treatment requiring tiny columns or horizontal reading.
- [ ] Commit `feat: redesign comparisons and cost model`.

### Task 12: Remaining supporting pages and data controls

**Files:**
- Create: `src/features/library/BookmarksPage.tsx`
- Create: `src/features/library/GlossaryPage.tsx`
- Create: `src/features/library/SourcesPage.tsx`
- Create: `src/features/settings/SettingsPage.tsx`
- Create: `src/features/settings/settings.css`
- Modify: `src/app/App.tsx`
- Modify: `src/features/pages.tsx`
- Test: `tests/persistence.test.ts`
- Test: `tests/browser/redesign.spec.ts`

**Interfaces:**
- Consumes existing validated import/export functions and unchanged personal-state schema.

- [ ] Redesign bookmarks, glossary and sources with search, useful empty states and clear reading continuations.
- [ ] Redesign settings into appearance, backup/restore and destructive-action sections.
- [ ] Implement and test export-reset-import browser equivalence, conflict preview, malformed import preservation, corrupt raw recovery and quota/unavailable-storage messaging.
- [ ] Remove migrated exports from `src/features/pages.tsx`; delete that file once no route imports remain.
- [ ] Commit `feat: complete supporting page redesign`.

### Task 13: Route-level loading and performance

**Files:**
- Modify: `src/app/App.tsx`
- Create: `src/components/RouteFallback.tsx`
- Modify: `vite.config.ts`
- Modify: `src/styles/base.css`

**Interfaces:**
- Produces lazy route modules with named default wrappers and a consistent accessible loading state.

- [ ] Lazy-load route modules and diagrams so the homepage does not eagerly load every feature.
- [ ] Configure stable vendor/content chunks only when measurement proves improvement; do not hide warnings by raising thresholds.
- [ ] Run `npm run build`, record compressed chunk sizes and verify direct nested routes.
- [ ] Test loading focus, reduced motion and stale-chunk failure behavior under normal static deployment constraints.
- [ ] Commit `perf: split playbook routes and diagrams`.

### Task 14: Full visual, accessibility and functional audit

**Files:**
- Modify: `tests/browser/acceptance.spec.ts`
- Modify: `tests/browser/redesign.spec.ts`
- Modify: `docs/verification.md`
- Modify: `docs/progress.md`

**Interfaces:**
- Consumes the final redesigned application and produces release evidence.

- [ ] Run formatting, unit tests, typecheck, content validation and production build from a clean tree.
- [ ] Run all browser journeys locally with console/network capture and serious/critical axe checks on every primary screen.
- [ ] Perform manual keyboard, focus, browser back/forward, 200% zoom and screen reading-order checks.
- [ ] Capture all target viewport screenshots and critique hierarchy, contrast, wrapping, density and comprehension; fix every material issue and rerun affected checks.
- [ ] Compare every plan requirement and redesign-spec section against implementation evidence; document genuine limitations rather than weakening the requirement.
- [ ] Commit `test: complete redesign release audit`.

### Task 15: Production release and handover

**Files:**
- Modify: `README.md`
- Modify: `docs/operations.md`
- Modify: `docs/handover.md`
- Modify: `docs/verification.md`
- Modify: `docs/progress.md`

**Interfaces:**
- Produces an exact release commit, versioned image and documented rollback target.

- [ ] Commit the final application release candidate and record its exact hash.
- [ ] Build `ai-playbook:<release-commit>` using Compose and validate the Caddy configuration.
- [ ] Deploy only the `ai-playbook` web service, wait for health and run the full browser suite against `https://playbook.abhiraj.net`.
- [ ] Verify HTTP redirect, TLS, security/cache headers, homepage assets, nested routes, representative interactions and explicit container restart.
- [ ] Verify Hermes remains healthy and apex/www still return 200.
- [ ] Record image ID, release commit, test counts, screenshots, limitations and rollback command in the handover.
- [ ] Push `main`, confirm local and remote hashes match, confirm clean status, and commit/push any final evidence-only documentation update.
