# Frontend review

Reviewed against `plan.md` sections 5, 8, 9 and 11, `docs/ui-brief.md`, `docs/ui-report.md`, frontend source, content interfaces, and existing unit tests. This is a source review of the untracked implementation on base `6039925`; substantive content/index integration is excluded. Existing passing tests were inspected, not rerun. Browser appearance and deployment were not assessed.

## Verdicts

- **Specification: changes required.** The shell and principal screens exist, but saved-project continuation, troubleshooting evidence capture, mandatory comparison gates, graph details, and several guide fields do not fulfill the agreed journeys.
- **Code quality: changes required.** Storage recovery, nested validation and merge behavior can lose or corrupt personal work. The nine tests cover happy paths and a few rejection cases but miss these consequential failures. The very long, single-line components in `pages.tsx` also make state-flow problems difficult to inspect and maintain.

## Prioritized findings

### P1 — Corrupt saved data is overwritten before recovery

**Location:** `src/app/StateContext.tsx:7-9`; `src/lib/persistence.ts:9`.

Reproduce by placing malformed JSON in `ai-playbook-state`, then loading the app. `loadState` returns `emptyState` plus the original raw value, but the mount effect immediately saves the empty state over the original storage key. The download recovery button can recover the raw value only during that mount; refresh again and it is gone. This violates the explicit no-silent-erasure requirement even though an error banner appears. Preserve the raw data durably and block automatic writes until recovery/reset/import is chosen.

### P1 — Import validation accepts values that crash rendering

**Location:** `src/lib/persistence.ts:4-6`; consumers in `src/features/pages.tsx:21,24,32`.

`validateState` checks only shallow truthiness for project answers/reviews/notes and accepts any object as global notes. For example, a valid export edited to contain `notes: {"existing-guide-id": {"bad": true}}`, or an object-valued project answer, is accepted; opening that guide/project passes an object into a text control or React child. A review `{status: 17}` is accepted and then fails on `status.replaceAll`. Schema 1 bypasses validation entirely, so `{schemaVersion:1,projects:null}` is accepted and crashes `state.projects.length`. Missing timestamps, duplicate/malformed project IDs, invalid review statuses and nonstring map values also pass. Validate the fully migrated structure, all nested fields/enums/IDs, and uniqueness before applying it; preserve unknown content IDs as valid string keys.

### P1 — Saved-project actions lose project identity

**Location:** `src/features/pages.tsx:17,24,32`; `src/app/App.tsx`.

Save project A with answers, then open its detail and click **Revisit discovery**. It navigates to `/start` without an ID; every answer is blank and saving creates another project. There is no path to edit A's answers or inspect its recalculated guidance. With two projects, opening the older one's detail and selecting **Continue design review** navigates to `/review`, which selects `state.projects[0]`, so the user can edit the wrong project. Carry the project ID through both routes, load its answers/reviews and update that project.

### P1 — “Merge” silently discards same-project work

**Location:** `src/lib/persistence.ts:7`; `src/features/pages.tsx:37`.

Export a project, add an evidence note or review locally, then import the older export using **Merge with current data**. `incoming.projects.forEach(x => p.set(x.id,x))` replaces the complete newer project with the old one. The preview shows counts only, with no collision/loss warning. Merge project maps with an explicit conflict strategy and show conflicts, or offer a separate clearly described overwrite operation. The existing same-ID test checks only length and does not detect this loss.

### P2 — Mandatory requirements are scored as preferences

**Location:** `src/lib/calculator.ts:4`; `src/features/pages.tsx:28`.

Set Operational fit (mandatory) to 0 and the two other criteria to 5. The result displays 2.92 with no failing-gate indication. Mandatory only produces an alert when its value is `unverified`; it has no pass/fail semantics and can be weighted to zero. Requirements must be separate verified pass/fail/unknown gates, with weighted preference scores clearly secondary. Show the denominator/unknown exclusions so partially verified scores are understandable.

### P2 — Review completion and content-version semantics are incomplete

**Location:** `src/features/pages.tsx:24`.

Select **not applicable** and leave rationale empty: the choice persists immediately despite `required`, because there is no submission/validation boundary. Open a project whose review has an older content version and reassess the item: edits preserve its old `reviewedContentVersion` forever. The warning identifies no affected items, and a fresh stage reports “0 unresolved or needing evidence” without showing how many items remain unreviewed. Require/expose missing N/A rationale, provide a deliberate reassessment action that records the current version, and distinguish unreviewed coverage from resolved items with per-item stale guidance signals.

### P2 — Troubleshooting cannot save evidence or continue to related guidance

**Location:** `src/features/pages.tsx:26`.

Choose any symptom and inspect its causes. There is no note field, project selector, persistence action or related-guide link, although flows contain `guideIds`. Acceptance journey 9 (diagnostic steps → evidence note) cannot be completed. Add project-scoped evidence capture and render the related guides; retain the selected symptom in navigation state or URL for return visits.

### P2 — Important authored guide fields are never displayed

**Location:** `src/features/pages.tsx:21`; `src/content/types.ts:7-15`.

Open any populated guide: `prerequisites`, `tradeoffs`, `examples`, `owner` and `reconsiderWhen` are never read by the page. These omissions hide practical setup requirements, worked examples and revisit conditions even when the content is complete. Render these fields with appropriate progressive disclosure; keep critical requirements and warnings visible. Checklist `guideIds` likewise have no links in the review UI.

### P2 — Graph lacks selection details and an equivalent linear path

**Location:** `src/features/DecisionGraph.tsx`; `src/features/pages.tsx:15`.

Click or keyboard-select a graph node: no explanation/detail panel or branch highlighting exists. The linear alternative is a generic four-item list; it omits the graph's explicit “yes → conventional automation” outcome and high/unknown condition, so it is not equivalent decision guidance. Add useful selected-node details and branch conditions/outcomes to the linear representation, with keyboard-operable controls. React Flow controls do supply fit/zoom; the issue is missing semantics, not basic zoom access.

### P2 — Comparison evidence cannot be checked from the comparison

**Location:** `src/features/pages.tsx:28`.

Select a technology option. Its evidence status is shown, but its `sourceIds` and `verifiedAt` are not, even though the content interface supplies both. Readers cannot tell when a claimed language/deployment capability was checked or inspect its evidence from this screen. Render the verification date and supporting source links beside the relevant option, including explicit unverified dates.

### P2 — Ordinary decision answers can yield an empty terminal path

**Location:** `src/lib/decisions.ts:3-26`.

Supply every select: process=variable, rules=no, impact=low, autonomy=read-only, timing=synchronous, review=yes. None of the substantive rules match and there are no unknowns, so the result says “Answer a few questions” despite all questions being answered. Process stability and free-text constraints never affect results; there are no structured questions for available data/systems, reversibility or exceptions. Provide an honest terminal result with next checks for fully answered branches and cover the required discovery dimensions without pretending to interpret free text automatically.

### P2 — Numeric controls permit nonsensical cost/score outputs

**Location:** `src/features/pages.tsx:28,30`; `src/lib/calculator.ts:2-4`.

Type a negative calls value or negative criterion weight directly into the number inputs. HTML `min`/`max` attributes do not prevent `onChange` from storing it; there is no submitted form validity check or calculation guard. Negative monthly costs and out-of-range weighted scores are then displayed. Validate finite, nonnegative values and bounded weights before calculation, with a visible input error. Explain that calls means monthly calls and token counts are per call; those units currently are implicit.

## Remaining acceptance checks

After fixes and content integration, run the required browser journeys, especially two-project continuation, edited-answer persistence, stale review reassessment, corrupt-storage recovery across two reloads, malformed nested imports, same-ID merge conflicts, and troubleshooting evidence restoration. Verify narrow-screen keyboard access and visual contrast in the browser. Home also lacks recent-guide tracking, saved-item/unreviewed summaries and a category overview, while Sources displays a release number but no actual change history; these remain specification gaps rather than an empty-index issue.
