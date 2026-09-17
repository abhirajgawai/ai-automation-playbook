# Task 1 report

## Files changed

- `tests/browser/acceptance.spec.ts` — added the readable-body-size assertion to the existing mobile contract.
- `tests/browser/redesign.spec.ts` — added redesign navigation, accessibility, responsive comparison, recomputation, project isolation, import round-trip, first-visit, and deterministic viewport screenshot journeys.
- `tests/components/ui.test.tsx` — added unit coverage for the shared UI primitives.

## Commands and exact results

- `npx vitest run tests/components/ui.test.tsx` — passed, 1 file / 3 tests.
- `npm test` — passed, 4 files / 15 tests.
- `npm run typecheck` — passed (`tsc -b --pretty false`).
- `npx playwright test tests/browser/acceptance.spec.ts` — passed, 11 tests.
- `npx playwright test tests/browser/redesign.spec.ts --reporter=line` — expected baseline result against the old UI: 5 failed and 5 passed. Failures were the new Learn/Decide/Operate landmarks, narrow comparison cards, cross-project review isolation, reset/import journey, and bookmark revisit assertion; the recomputation and four screenshot viewport tests passed.
- `npx prettier --check ...` initially reported formatting issues; `npx prettier --write ...` fixed all three changed test files.

## Commit

`d6f30510b5e9ccfad6d775e401db91e96f09d4d6` — `test: define redesign acceptance contract`

## Self-review

- Tests are scoped to the requested acceptance contract and do not change production code.
- Browser assertions use accessible roles/labels where possible and cover all requested viewport sizes.
- Existing acceptance and unit suites remain green.

## Concerns

- The redesign browser suite intentionally fails on the current UI; later redesign tasks must make those assertions green.
- Screenshot files are generated under `test-results/` and are not committed.
