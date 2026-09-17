# Modern Technical Field Manual Redesign

Date: 2026-09-17  
Status: Approved direction; implementation specification  
Reference quality: React Flow's modern developer-product clarity, adapted into an original identity and a field-manual reading experience

## Objective

Redesign the entire AI Systems Playbook so it is sleek, modern, beautiful, easy to read and easy to understand. Preserve the substantive content, local-only data model, accessibility, deep links, and deployment architecture while replacing the current administration-style interface with a coherent modern technical field manual.

The experience must help a senior engineer orient quickly, understand difficult system relationships visually, reach a defensible next action, and read detailed guidance without fatigue.

## Design direction

The product combines two complementary modes:

1. A modern developer-product shell influenced by the clarity, whitespace, confident typography, technical canvas and interactive storytelling of React Flow's website.
2. A precision-editorial field manual for long-form guidance, with disciplined line length, strong section hierarchy, margin navigation and explicit evidence treatment.

The design must be original. It must not copy React Flow's brand, layout, illustrations or pink accent. The playbook identity uses electric blue with signal lime, deep ink and quiet cool-neutral surfaces.

## Design principles

### One idea per composition

Every major section has one dominant message or interaction. Avoid grids of identical cards, dense dashboards and undifferentiated metadata.

### Comprehension before density

Present a summary, mental model and next action before detailed implementation material. Use progressive disclosure for supporting depth, never for critical warnings.

### Relationships should be visible

Use React Flow when spatial relationships, branching, state transitions, ownership or system boundaries are materially clearer than prose. Do not use diagrams as decoration or repeat nearby text without adding understanding.

### Reading is a primary interaction

Guide typography, line length, rhythm, headings, examples and annotations must be designed with the same care as forms and diagrams.

### Evidence has a visual grammar

Users must distinguish principles, recommendations, hypotheses, evidence gaps, warnings, examples, sources and user-recorded evidence at a glance.

### Mobile gets a native composition

Do not squeeze desktop tables or graphs into a narrow viewport. Replace them with focused comparison cards, step views, expandable attributes and textual graph alternatives.

## Visual system

### Palette

- Ink 950: `#101828` — primary text and dark technical canvases.
- Electric blue 600: `#2367FF` — primary action, selection and active paths.
- Electric blue 50: `#EDF3FF` — selected and explanatory surfaces.
- Signal lime 400: `#A3E635` — verified progress, safe paths and deliberate highlights.
- Cool canvas 50: `#F5F7FA` — page background.
- Surface: `#FFFFFF` — reading and control surfaces.
- Slate 500: `#667085` — secondary text.
- Border: `#D8DEE8` — quiet structure.
- Warning: `#E04F39` with a pale supporting surface.

Dark mode uses ink surfaces, high-contrast text, restrained blue and lime highlights, and does not simply invert colors.

### Typography

- Interface and display: a modern grotesk sans with strong weight range and compact display metrics. Prefer a locally bundled open-source family after bundle and rendering review.
- Long-form guide text: a highly readable editorial serif with generous x-height and calm italics, also locally bundled.
- Code and machine identifiers: a locally bundled monospace used only where the content is actually code, state or data.
- Body text is at least 16px desktop and mobile, with approximately 1.65 line height for prose.
- Guide paragraphs target 60–72 characters per line.
- Display headlines are bold and compact; guide titles may use the editorial serif.
- Avoid pervasive uppercase labels, tiny metadata and decorative typography that does not encode meaning.

### Shape, spacing and motion

- A restrained radius scale differentiates controls, content surfaces and large technical canvases.
- Shadows are limited to elevated interactive canvases and overlays; borders and whitespace carry most structure.
- Spacing follows a coherent 4/8-based scale with generous section gaps.
- Motion responds to user action: graph selection, disclosure, navigation and status changes. Respect reduced-motion preferences.
- One coordinated entry moment may be used on the homepage; do not animate every card.

## Information architecture

The top-level mental model becomes:

- Learn — guides, glossary, sources and topic exploration.
- Decide — start a problem, comparisons and decision paths.
- Operate — projects, design review, troubleshooting and saved work.

The existing URLs remain available. Navigation labels may be reorganized without breaking deep links or browser history.

Global navigation includes the product identity, the three primary modes, search, theme, and compact access to saved projects. Desktop guide pages may add a contextual left rail. Mobile uses a purposeful menu and in-page section navigator.

## Page architecture

### Homepage

The homepage opens with the core promise: build AI systems you can explain. It includes:

- A short statement of purpose and two clear actions: start with a problem or explore the manual.
- A meaningful interactive React Flow decision map showing outcome definition, deterministic suitability, consequence mapping and bounded autonomy.
- A synchronized explanation panel for the selected node.
- A stage-oriented path through Discover, Design, Verify and Operate.
- Resume state when projects or recent guides exist.
- Unresolved evidence shown as actionable work, not dashboard statistics.
- A concise local-only storage explanation near the first saved interaction.

### Guide

Every guide follows a consistent learning sequence where applicable:

1. Orientation: category, stage, reading time, update date and source scope.
2. Summary: plain-language explanation and why it matters.
3. Decision rule: a visually distinct actionable principle.
4. Mental model: React Flow or a smaller native diagram when relationships warrant it.
5. When required, optional or unnecessary.
6. Alternatives and trade-offs.
7. Worked example or failure trace.
8. Implementation guidance.
9. Verification and evidence checklist.
10. Failure modes, sources, ownership and revisit triggers.

Desktop guides use contextual navigation and a readable central column. Mobile guides replace fixed rails with an accessible section menu. Critical content remains visible without opening accordions.

### Start a Problem

Convert the long form into a guided decision workspace:

- Group questions into outcome, process, consequence, action boundary and operating constraints.
- Show progress and permit backward navigation without losing answers.
- Keep unknown as a first-class answer.
- Recompute guidance immediately when upstream answers change.
- Present triggered guidance in a synchronized decision map and concise evidence-gap list.
- Explain why each recommendation appeared.

### Review a Design

- Use stage navigation with visible completion and unresolved evidence counts.
- Present one review item at a time or in a readable focused list, not a wall of bordered accordions.
- Separate status, evidence, owner, assumptions and revisit conditions visually.
- Make stale content review and N/A rationale obvious.
- Preserve independent project state.

### Troubleshoot

- Begin with a symptom picker grouped by runtime, data/context, tools, cost and quality.
- Use a React Flow diagnostic tree when evidence changes the remaining causes.
- Synchronize the selected branch with the evidence prompt, safe mitigation and durable fix.
- Preserve a complete accessible linear sequence.
- Clearly distinguish observed fact, hypothesis, ruled-out cause and supported cause.

### Compare

- Replace the desktop mega-table as the primary interface.
- Let users shortlist two or three options and compare only relevant attributes.
- Treat mandatory gates before preference weights.
- Use readable comparison rows on desktop and stacked option cards on mobile.
- Keep source, verification date and unverified status adjacent to each material technology claim.
- Move pattern comparisons into dedicated editorial sections rather than appending a long card grid.

### Projects and settings

- Projects become calm workspaces with next actions, unresolved evidence and recent activity derived only from local state.
- Settings groups appearance, backup/restore and destructive reset with clear hierarchy.
- Export/import remains explicit, validated and local-only.

## React Flow system

React Flow is a reusable visual language across the playbook, not a single homepage widget.

### Diagram types

- Decision path — suitability, autonomy and framework gates.
- State model — durable execution, approvals and release lifecycle.
- System map — agent harness, context assembly, retrieval and tool boundaries.
- Diagnostic tree — troubleshooting evidence and plausible causes.
- Sequence/failure trace — unknown outcomes and recovery.

### Custom components

- `DecisionNode`: question, current answer and consequence.
- `PrincipleNode`: durable engineering rule.
- `SystemNode`: component, responsibility and owner.
- `EvidenceNode`: known, unknown, supported or ruled-out evidence.
- `RiskNode`: consequence and required control.
- `OutcomeNode`: verified terminal result and next action.
- Custom labelled edges for conditions, evidence and control boundaries.
- Reusable selected-node inspector and diagram legend.

### Interaction rules

- Nodes are selectable by pointer and keyboard.
- Selection updates a nearby explanation rather than relying on tiny node text.
- Fit/reset and zoom controls are available but not dominant.
- Important branches highlight together; unrelated branches recede.
- Diagrams are read-only unless editing adds real user value.
- Every essential diagram has a semantically equivalent ordered or nested text representation.
- Mobile defaults to a focused step/branch view instead of an unreadably scaled canvas.

## Component system

Create a small, intentional component system rather than page-specific CSS:

- App shell, global navigation, contextual rail and mobile navigation.
- Page intro, section heading and editorial prose primitives.
- Command/search surface with categorized results.
- Decision rule, principle, warning, evidence gap, worked example and source-scope blocks.
- Stage indicator, progress steps and status legend.
- Guide index item and project summary.
- Responsive comparison matrix and comparison option card.
- Review item and evidence editor.
- Diagram frame, diagram inspector, legend and linear alternative.
- Empty, loading, error, import preview and recovery states.

Components use semantic design tokens. Avoid a universal rounded-card treatment; shape and surface must communicate role.

## Content presentation changes

The structured content remains the source of truth. Add presentation metadata only where it avoids inference in components, such as guide reading sequence, callout type, diagram definition or section importance.

Do not rewrite substantive technical guidance merely to fit a layout. Improve headings, summaries and progressive disclosure when that materially improves comprehension. Preserve sources, reviewed dates, stable IDs, content versions and unknown imported IDs.

## Responsive behavior

Design and validate at approximately 390px, 768px, 1280px and a wide desktop.

- Navigation changes structure rather than simply shrinking.
- Guide rails become accessible in-page navigation.
- Comparison tables become stacked/focused comparisons.
- React Flow becomes a focused branch or step view with an equivalent linear representation.
- Forms use one column with persistent context and comfortable touch targets.
- No text essential to comprehension is rendered at tiny sizes to force fit.

## Accessibility

- Preserve semantic landmarks, heading order, skip navigation and visible focus.
- Meet WCAG AA contrast for text and meaningful controls.
- All navigation and workflows are keyboard operable.
- React Flow nodes, controls and alternative representations are keyboard accessible and meaningfully labelled.
- Status is never communicated by color alone.
- Respect reduced motion and browser text zoom.
- Automated checks are necessary but must be supplemented by manual keyboard and reading-order review.

## Performance

- Continue static hosting with no runtime API or telemetry.
- Route-level lazy loading should reduce the initial application bundle.
- Load React Flow only on pages that use it.
- Bundle fonts locally and subset weights/languages appropriately.
- Preserve fingerprinted immutable assets and revalidated entry HTML.
- Avoid large decorative raster assets unless they materially improve understanding.

## Phased delivery

### Phase 1 — Foundation and vertical slice

- Tokens, typography, responsive shell and primary navigation.
- Homepage redesign.
- One representative guide: durable execution.
- Primary decision path with the reusable React Flow foundation.
- Desktop and mobile screenshot critique.
- Accessibility, performance and regression checks.

Phase 1 is a design checkpoint. Expansion begins only after the rendered result meets the agreed standard.

### Phase 2 — Learning experience

- Apply the guide system to all 15 guides.
- Add the highest-value system maps and state diagrams.
- Redesign Explore, search, glossary, sources and related navigation.
- Review content hierarchy and readability across all categories.

### Phase 3 — Decision workspace

- Redesign Start, Review, Troubleshoot, Compare, Projects, Bookmarks and Settings.
- Add diagnostic React Flow experiences and focused comparison behavior.
- Preserve and migrate all existing local state without data loss.

### Phase 4 — Polish and release

- Cross-browser responsive review and screenshot comparison.
- Manual keyboard, zoom and reading-order review.
- Unit, content and browser journey coverage, including previously identified export/import and project-isolation gaps.
- Bundle and runtime performance review.
- Production image build, deployment, restart, live verification and unchanged-service checks.
- Documentation, release evidence and repository push.

## Verification and acceptance

Each phase must provide fresh evidence appropriate to its scope. The final release requires:

- All existing functionality and personal data behavior preserved.
- Content validation, unit tests, typecheck and production build passing.
- Browser journeys passing locally and against the deployed host.
- Screenshot review at mobile, tablet and desktop sizes.
- No serious or critical automated accessibility violations plus manual keyboard verification.
- No unintended external runtime requests.
- Direct routes, back/forward navigation and refresh working.
- Comparison content readable on mobile without tiny squeezed columns.
- React Flow interactions useful with pointer and keyboard, with complete linear alternatives.
- Container healthy after deployment and explicit restart.
- Existing Hermes and portfolio services unchanged.

## Out of scope

- Backend services, accounts, cloud sync, runtime LLMs and telemetry.
- Copying React Flow's branding, illustrations or exact layouts.
- Decorative diagrams that do not improve comprehension.
- Replacing sound technical content with marketing copy.
- A comprehensive logo or corporate identity program beyond the product mark and interface identity required for this application.

## Material risks and mitigations

- **Visual polish masks poor comprehension:** test task understanding and reading flow, not only screenshots.
- **React Flow overuse:** require each diagram to pass the “clearer than prose” test.
- **Content migration regressions:** preserve stable IDs and validate every reference during the redesign.
- **Local data loss:** keep the storage schema compatible and add migration tests before release.
- **Mobile regression:** design mobile compositions explicitly at the component level.
- **Bundle growth:** lazy-load routes and diagram code, then measure the production build.
- **Inconsistent expansion:** complete and critique the vertical slice before applying the system across all pages.
