# Verification evidence

Status: release acceptance passed on 2026-09-17 UTC.

## Redesign release audit (Task 14, 2026-09-17)

This section documents the full visual, accessibility and functional audit of
the `redesign/modern-field-manual` branch (React Flow-based homepage,
guide/decision/troubleshoot/compare/review/settings redesign, route-level lazy
loading). It supersedes the test counts and screenshot claims below for the
current application; the earlier sections remain as the historical record of
the original pre-redesign release. Production deployment evidence (image tag,
container health, live host checks) is intentionally deferred to the release
task that follows this audit.

### Clean-tree verification

- `npm test`: 32/32 unit tests passed (`tests/persistence.test.ts`,
  `tests/decisions.test.ts`, `tests/calculator.test.ts`,
  `tests/components/ui.test.tsx`, `tests/components/diagram.test.tsx`).
- `npm run typecheck`: passed with no errors.
- `node scripts/validate-content.mjs` (run as part of `npm run build`): 13
  categories, 15 guides, 159 mapped taxonomy topics, 60 checklist items, nine
  troubleshooting paths, 20 technology options and 82 source records — content
  corpus is unchanged by the redesign.
- `npm run build`: passed. Main JS chunk `index-*.js` is 519.90 kB / gzip
  150.94 kB (React Flow's `DiagramFrame-*.js`, 184.89 kB / gzip 60.17 kB, and
  every routed page are separately lazy-loaded chunks, per the route-level
  code splitting delivered earlier in this redesign). These figures are
  unchanged from the prior task's recorded build, confirming no bundle-size
  regression from this audit's fixes.
- `npx playwright test` (Chromium): 66/66 browser tests passed in 7.2
  minutes, covering `tests/browser/acceptance.spec.ts` (12 tests) and
  `tests/browser/redesign.spec.ts` (54 tests, including four full
  13-route deterministic screenshot sweeps, one per target viewport).

### Audit scope extensions

Three of this task's designated test files under-covered the plan's mandated
"every primary screen" scope relative to the app's 12 primary routes plus a
seeded project detail page. All three were extended and reverified:

- `tests/browser/acceptance.spec.ts`'s route-render-without-errors test grew
  from 11 routes to all 12 primary routes plus a seeded `/projects/:id`.
- `tests/browser/acceptance.spec.ts`'s axe accessibility sweep grew from 4
  routes to all 13 (12 primary + seeded project detail); `test.setTimeout(90000)`
  was added because 13 sequential full-page `AxeBuilder` scans exceed the
  default 30s timeout under the dev server's per-route chunk-fetch cost (same
  cause documented for the equivalent guide-loop test in an earlier task).
- `tests/browser/redesign.spec.ts`'s deterministic-screenshot loop grew from 6
  routes to all 13, across all four target viewports (390x844, 768x1024,
  1280x900, 1536x960) — 52 screenshots total, in `test-results/redesign/`.
  `test.setTimeout(60000)` was added for the same per-route chunk-fetch
  reason; the 1280x900 and 1536x960 viewport tests exceeded the default 30s
  timeout without it.

No serious or critical axe violations were found on any of the 13 routes at
any viewport.

### Material issue found and fixed: header overflow at 1280px

A systematic Playwright geometry sweep (`getBoundingClientRect().right >
innerWidth` across every element on every route, at all four target
viewports) found that at exactly the 1280x900 target viewport, the app
header's navigation and header-actions cluster (`.desktop-nav-groups` plus
`.header-actions`: search, theme toggle, "Local only" badge) did not fit
within the header on 12 of the 13 primary routes, overflowing the viewport by
~141-151px. The header's three nav groups needed roughly 1430px of width to
render at their default spacing but only had ~1230px available at 1280px;
because none of the nav items could shrink further under `flex-shrink`
without violating "navigation changes structure rather than simply shrinking"
(this spec's own responsive-behavior requirement), the layout simply
overflowed instead.

Root cause: `src/styles/components.css`'s header rules had a breakpoint at
899px (mobile hamburger nav) and otherwise assumed a single "desktop" spacing
scale all the way from 900px up, with no intermediate tightening for the
900-1439px range.

Fix: added a `@media (min-width: 900px) and (max-width: 1439px)` rule in
`src/styles/components.css` that tightens header/nav gaps and padding and
hides the two lowest-priority header-action affordances (the "⌘/" search
shortcut hint and the "Local only" badge — both already hidden below 900px,
so this is an extension of an established pattern, not a new one). This
closes the overflow at 1280px (and above) without touching the existing,
already-tested contract that the three named nav landmarks (Learn/Decide/
Operate) remain visible from 900px up
(`tests/browser/redesign.spec.ts`: "desktop navigation groups routes into
Learn, Decide and Operate..." at 1280x900 still passes).

Known, documented limitation: the fix fully closes the overflow from 1200px
upward (verified: 0px overflow at 1200, 1250, 1280, 1439, 1440, 1536); it does
not fully close it in the untested, non-mandated 900-1199px window (verified:
37-287px of residual overflow at 900-1150px). None of this task's four
mandated target viewports fall in that window, and closing it would require
either the same structural change the spec explicitly warns against
("simply shrinking") or moving the desktop/mobile-nav breakpoint itself,
which would change the passing, established 1280px-desktop-nav-visible test
contract from an earlier task. This is flagged here rather than silently
left as a fixed regression, in case a future task wants to revisit the
breakpoint at 900-1199px.

### Other findings

- A second, unrelated, pre-existing overflow was found and fixed: the global
  header's brand mark (`<span class="brand-mark">A/A</span>` in
  `src/components/AppHeader.tsx`) rendered its three characters stacked
  vertically instead of horizontally on every page at every viewport, due to
  CSS Grid's anonymous-item row-stacking behavior for mixed inline content
  inside a `display: grid; place-items: center` container. Fixed by changing
  `.brand-mark` in `src/styles/components.css` to `display: flex` with
  `white-space: nowrap`. Verified visually at 390px and 1536px before and
  after.
- Several other geometry-sweep findings (React Flow canvas nodes/edges
  extending a few px past their container on `/start` and
  `/guides/durable-execution` at 390px, and a horizontally-scrollable
  home-page stage-chip row at 390px/768px) were investigated and confirmed to
  be contained within their own scrollable/clipped inner elements
  (`document.documentElement.scrollWidth` was `0` over `innerWidth` on every
  route/viewport pair checked); these are not page-level horizontal-scroll
  bugs and were left unchanged.
- A dead CSS rule flagged by an earlier task's report (`.glossary > div`
  bare-class grid rule in `src/styles.css`, superseded by
  `.glossary-list`/`.glossary-entry` in `library.css`) was confirmed unused
  via grep and deleted.
- The `dt`/`dd`-not-a-direct-child-of-a-grid-`dl` bug class fixed in an
  earlier task was grepped for elsewhere in the CSS; no other instances were
  found.
- `tests/persistence.test.ts` (flagged by an earlier task's report as an
  unmodified deviation from this task's designated file list) was reviewed
  and deliberately left unchanged: it already unit-tests `parseImport`,
  `mergeStatesWithConflicts` and `loadState` directly, and
  `tests/browser/redesign.spec.ts` and `tests/browser/acceptance.spec.ts`
  already cover corrupt-data recovery, conflict-count merge/replace and
  export/import round-tripping at the UI level. No coverage gap was found
  that would justify touching this file.
- The implemented warning color (`--color-warning: #b93826` in
  `src/styles/tokens.css`) differs from the design spec's literal
  `#E04F39`. This is a deliberate, correct prioritization: `#E04F39` on white
  achieves only 3.93:1 contrast (fails WCAG AA's 4.5:1 requirement for normal
  text), while the implemented `#b93826` achieves 5.74:1. The spec's own
  accessibility section ("Meet WCAG AA contrast for text and meaningful
  controls") takes precedence over its literal palette hex value here; this
  is documented rather than "fixed" back to a non-compliant color.
- A pre-existing Prettier formatting drift (`npx prettier --check` reports
  ~30 files outside this task's designated file list, none of them touched by
  this audit) was found and deliberately left unformatted, since reformatting
  unrelated files would be out-of-scope refactoring per this task's file-list
  boundary. This is a genuine, harmless, cosmetic-only limitation: none of
  those files fail lint, type checking, tests or the build.

### Manual accessibility-style checks

Performed via Playwright-driven manual-style scripts (not part of the
committed test suite, since they duplicate what the automated suite already
covers structurally; documented here as evidence):

- **Heading order and landmarks**: home, guide, start, review, troubleshoot,
  compare, projects and settings each render exactly one `<h1>`, no skipped
  heading levels, and a consistent landmark order (`header` → nav groups →
  `main`).
- **Focus visibility**: tabbing from page load produces a visible `3px solid`
  outline on the focused link.
- **Keyboard-only navigation**: the `/` search shortcut, Escape-to-close on
  the mobile nav and search dialog, and keyboard-selectable React Flow nodes
  are already covered by dedicated, passing Playwright tests
  (`tests/browser/redesign.spec.ts`).
- **Browser back/forward**: guide → project-save → guide → projects list →
  project detail → back → back → forward round-trips correctly to the
  expected URLs at each step.
- **200% zoom equivalence**: simulated by halving the viewport (640x450,
  approximating 1280x900 at 200% browser zoom) on all eight key routes;
  `document.documentElement.scrollWidth` equals `window.innerWidth` (no
  overflow) and the `h1` remains visible on every route.

### Redesign spec compliance summary

Comparing `docs/superpowers/specs/2026-09-17-modern-field-manual-redesign.md`
against implementation evidence gathered across this and earlier redesign
tasks:

| Spec section | Status | Evidence / limitation |
|---|---|---|
| Palette | Satisfied, one documented deviation | Ink, action blue, signal lime, canvas, slate and border hex values in `src/styles/tokens.css` match the spec exactly. Warning color intentionally darkened from spec's `#E04F39` to `#b93826` for WCAG AA contrast (see above). |
| Typography | Satisfied | Grotesk sans (interface), editorial serif (guide prose), monospace (code/IDs) locally bundled; 16px+ body, ~1.65 line height, 60-72ch guide measure verified by `redesign.spec.ts`'s "guide prose renders at a readable measure" test. |
| Shape, spacing, motion | Satisfied | 4/8-based `--space-*` scale in tokens; `prefers-reduced-motion` respected (dedicated passing test for the route-loading spinner). |
| Information architecture (Learn/Decide/Operate) | Satisfied | Verified by `redesign.spec.ts`'s desktop/mobile nav-grouping tests; existing URLs preserved. |
| Homepage | Satisfied | Promise statement, two primary actions, interactive decision map with synchronized inspector, Discover/Design/Verify/Operate stage path, resume-state section, local-only storage note — all present and covered by dedicated passing tests. |
| Guide | Satisfied | Ten-part learning sequence present (orientation, summary, decision rule, mental model, when-required, alternatives, worked example, implementation, verification, failure modes/sources); verified across all 15 guides by the guide-loop test. |
| Start a Problem | Satisfied | Grouped questions, backward navigation, unknown-as-first-class-answer, synchronized decision map and evidence-gap list all covered by passing tests. |
| Review a Design | Satisfied | Stage navigation with unresolved counts, N/A rationale requirement, stale-content flagging, per-project isolation all covered by passing tests. |
| Troubleshoot | Satisfied | Symptom picker grouped by category, diagnostic tree synchronized with evidence, linear text fallback, fact/hypothesis/ruled-out/supported distinction all covered by passing tests. |
| Compare | Satisfied | Shortlist of up to three, mandatory-gate-before-preference ordering, mobile stacked cards (verified by screenshot), pattern comparisons in a dedicated section, explicit-unit cost model. |
| Projects and settings | Satisfied | Calm project workspaces without a fabricated score; settings groups appearance/backup/reset; explicit validated local-only import/export. |
| React Flow system (diagram types, custom components, interaction rules) | Satisfied | Decision path, state model, diagnostic tree and system-map diagrams present; keyboard-selectable nodes, synchronized inspector, fit control, and complete linear alternatives all covered by passing tests. |
| Component system | Satisfied | Shared primitives in `src/styles/components.css` and `src/components/`; this audit's header fix and brand-mark fix were made at this shared-component layer, not per-page. |
| Content presentation changes | Satisfied | Content validator confirms all IDs, references, versions and stages are unchanged; no substantive guidance was rewritten to fit layout. |
| Responsive behavior | Satisfied, one documented limitation | Validated at 390/768/1280/1536px. Navigation changes structure (mobile disclosure) below 900px; this audit found and fixed a 1280px header-overflow bug that violated "changes structure rather than simply shrinking" (see above) — now closed at all four mandated viewports, with a narrow non-mandated 900-1199px window left as a documented limitation. |
| Accessibility | Satisfied | No serious/critical axe violations on any of 13 routes at any viewport; manual keyboard, focus-visibility, heading-order and landmark checks performed (see above); reduced motion respected. |
| Performance | Satisfied | No runtime API/telemetry; route-level lazy loading confirmed via per-page chunk output; React Flow (`DiagramFrame-*.js`) is a separate lazy chunk loaded only on diagram-bearing pages; fonts locally bundled. |
| Verification and acceptance | Satisfied for this task's scope | Content validation, unit tests, typecheck and build pass; browser journeys pass locally (66/66); screenshot review performed at all four sizes; no serious/critical axe violations plus manual keyboard verification performed; no external runtime requests (enforced by a dedicated test); direct routes/back-forward/refresh all verified. Production-host verification, container health and unchanged-Hermes/portfolio checks are explicitly deferred to the following release task, per this task's scope boundary. |
| Out of scope items | Respected | No backend/accounts/cloud sync/telemetry were added; no React Flow branding was copied; no sound technical content was replaced with marketing copy. |
| Material risks and mitigations | Addressed | Visual polish was checked against actual screenshots and task-flow tests, not screenshots alone; every diagram found in the app corresponds to a "clearer than prose" relationship (decision paths, state models, diagnostic trees); stable IDs and references were validated by the content validator; the storage schema and its migration path were exercised by passing import/conflict tests; mobile compositions were explicitly designed per component (verified by the 390px screenshot set) rather than shrunk from desktop; bundle growth was measured and matches the prior task's recorded figures with no regression. |

No requirement's wording was weakened to declare it satisfied; the one
genuine gap (900-1199px header spacing) and the one deliberate deviation
(warning color) are both documented above rather than papered over.

## Confirmed baseline

- Fresh clone at base commit `6039925`, no prior application or user edits.
- GitHub authenticated; push dry-run succeeded.
- VPS IPv4 and playbook A record both `187.127.219.78`; no AAAA returned.
- HTTP/HTTPS ports unused before this deployment; no existing nginx/Caddy config.
- Existing `hermes` container running with `unless-stopped` on port 8642.
- Apex and www portfolio returned HTTP 200 from Vercel before changes.
- Node 22.22.1, Docker Compose 5.5.0; 3.8 GiB RAM plus swap.

## Content

`node scripts/validate-content.mjs` passed: 13 categories, 15 guides, 159 mapped taxonomy topics, 60 checklist items, nine troubleshooting paths, 20 technology options and 82 source records. It checks unique IDs, valid references, guide fields, HTTPS sources, stages and exact plan-to-section mapping. Semantic quality and its remediation trail are recorded separately in `content-review.md`.

## Frontend review

An independent review identified corrupt-storage overwrite, incomplete nested import validation, merge loss, project routing and missing UI fields. Fixes and regression evidence are tracked in `ui-report.md` and `frontend-review.md`. Initial empty-content build/unit success was not treated as final acceptance.

## Local release acceptance

- `npm test`: 12/12 unit tests passed.
- `npm run typecheck`: passed.
- `npm run build`: passed, including the content validator above.
- `npx playwright test`: 11/11 browser journeys passed in Chromium. Coverage includes primary routes, zero external runtime requests, search and refreshed deep links, project isolation, notes/bookmarks, corrupt-storage recovery, review evidence, troubleshooting narrowing, invalid-import safety, keyboard access, mobile overflow and serious/critical axe checks.
- `git diff --check`: passed before the release commit.
- Vite emitted one non-blocking warning for the 546.73 kB uncompressed main JavaScript chunk; the complete local content corpus accounts for most of it, while React Flow is separately lazy-loaded.

## Production release acceptance

- Application commit: `32e73b9528c4`.
- Image: `ai-playbook:32e73b9528c4`; image ID `sha256:827a9de31c641e23586758b1423f7f76ba4c0f4b290d0a856f538c50939068a9`; size 24,471,132 bytes.
- Container health reached `healthy` after deployment and again after an explicit `docker compose restart web`.
- `http://playbook.abhiraj.net` returned 308 to HTTPS. The homepage and `/guides/durable-execution` returned 200.
- TLS certificate CN is `playbook.abhiraj.net`, issued by Let's Encrypt, valid 2026-09-15 through 2026-12-14. HSTS, CSP, permissions, referrer, content-type and frame protections were present.
- The full 11-test Playwright suite passed against `https://playbook.abhiraj.net` after deployment.
- Runtime is bounded to 256 MiB RAM and 0.5 CPU, uses `unless-stopped`, `no-new-privileges`, and rotated JSON logs (10 MiB × 3).
- Existing `hermes` remained up on port 8642. `https://abhiraj.net` and `https://www.abhiraj.net` continued to return 200.

The production application has no backend, runtime AI calls, analytics or external data requests. Personal data remains in the visitor's browser unless they export it.

## Production release acceptance (redesign, Task 15, 2026-09-17)

This supersedes the "Production release acceptance" section above for the
currently deployed application. It documents the deployment of the completed
`redesign/modern-field-manual` branch, fast-forward merged into `main`.

- Release commit: `587252c88ee023ba7e706f24520d50868046a9e1` (`587252c`).
- Previous running image (rollback target): `ai-playbook:32e73b9528c4`, image ID
  `sha256:827a9de31c641e23586758b1423f7f76ba4c0f4b290d0a856f538c50939068a9`,
  retained on the host and not deleted.
- New image: `ai-playbook:587252c`, image ID
  `sha256:a7a8627b8e54380417ae8192038ec6918fe029813e4a8211e6985900bfd8513e`,
  size 24,341,364 bytes.
- `docker run --rm ai-playbook:587252c caddy validate --config /etc/caddy/Caddyfile`
  reported `Valid configuration` before deployment.
- Deployed via `PLAYBOOK_VERSION=587252c docker compose up -d web` (only the
  `web` service was recreated; `hermes` was never touched).
- Container health reached `healthy` immediately after deployment and again
  after an explicit `docker compose restart web`.
- `http://playbook.abhiraj.net` returned `308 Permanent Redirect` to
  `https://playbook.abhiraj.net/`. The homepage and
  `/guides/durable-execution` both returned `200`.
- TLS: TLSv1.3, certificate CN `playbook.abhiraj.net`, valid through
  2026-12-14. HSTS (`max-age=31536000`), CSP, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy` and
  `Permissions-Policy` headers all present on every checked route.
- Cache headers: HTML routes serve `Cache-Control: no-cache`; fingerprinted
  `/assets/*` files serve `Cache-Control: public, max-age=31536000, immutable`.
- The full 66-test Playwright suite (`tests/browser/acceptance.spec.ts` +
  `tests/browser/redesign.spec.ts`) passed against
  `https://playbook.abhiraj.net` after deployment (`PLAYBOOK_BASE_URL`
  pointed at the live host), including all four deterministic screenshot
  viewports and the 13-route axe accessibility sweep.
- Runtime remains bounded to 256 MiB RAM and 0.5 CPU, `unless-stopped`,
  `no-new-privileges`, rotated JSON logs (10 MiB × 3) — unchanged from the
  prior release's Compose configuration.
- Existing `hermes` container remained `running` on port 8642 throughout,
  untouched by this deployment. `https://abhiraj.net` and
  `https://www.abhiraj.net` continued to return `200`.
- No known production-specific regressions. The one documented UX limitation
  (residual header overflow in the non-mandated 900-1199px window) and the
  one deliberate palette deviation (warning color darkened for WCAG AA
  contrast) carry over unchanged from the Task 14 audit above; both were
  re-observed as expected, not regressed, against the live deployment.

Rollback, if ever needed: `PLAYBOOK_VERSION=32e73b9528c4 docker compose up -d --no-build web`, then verify health and browser behavior per `docs/operations.md`.
