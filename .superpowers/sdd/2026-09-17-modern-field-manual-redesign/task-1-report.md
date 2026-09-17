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

## Fix Round 1

Review findings addressed:

- The export/reset/import journey now compares the complete restored schema-v2 state against the exported state, ignoring only the generated `exportedAt` field.
- Project isolation now covers evidence, status, owner, assumptions, rationale, and revisit fields, and selects the original project by its persisted ID.
- The first-visit journey reopens the saved bookmark, verifies the note, and verifies the bookmark action is now `Remove bookmark`.
- Mobile comparison checks card geometry, stacked vertical positions, width, and minimum 16px card text.
- The linear alternative checks representative decision steps in their required order.
- Existing deterministic screenshot captures cover all four requested viewports and six requested routes; no visual baseline files are present in the repository, so a later manual visual gate remains necessary. No additional code was needed for this review item.

Commands and exact results:

- `npx prettier --write tests/browser/redesign.spec.ts` — passed; formatted 1 file.
- `npx vitest run tests/components/ui.test.tsx` — passed, 1 file / 3 tests.
- `npm run typecheck` — passed (`tsc -b --pretty false`).
- `npx playwright test tests/browser/redesign.spec.ts --grep 'home has|comparison presents|review evidence|export reset|first visit' --reporter=line` — baseline old UI result: 4 failed and 1 passed. The failures are the expected redesign contract gaps (landmarks/linear contract, cards, project isolation, and bookmark view); export/reset/import equivalence passed.

Fix commit: `a6e9c095651c2931af2c7d793c5474137de077fd` — `test: strengthen redesign acceptance contract`.

Self-review: assertions now cover every requested state field and journey detail without modifying production code. Remaining browser failures are intentional until the redesign implementation lands.
