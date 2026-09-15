# Content review

Reviewed: 2026-09-15

## Verdict

The authored guidance is unusually careful about uncertainty, authorization, idempotency, and the difference between durable state and correct business effects. I found no advice that is obviously dangerous or a clearly false technical claim in the 15 guides. However, the content does **not yet justify treating all 159 taxonomy items as substantively reviewed**. Several product promises are represented by labels and short prose, but not by decision-ready material.

## Priority findings

### P0 — The comparison catalogue is not a meaningful side-by-side comparison

All 18 entries repeat the same text in `languages` and `deployment`; `strengths` and `maturity` mostly repeat `summary`. This is a concrete data-quality defect, not just sparse writing. It prevents comparison of runtime language, hosting model, operational maturity, and actual differentiators. The catalogue also contains no provider/model or thin-custom baseline entry, although C04 asks the reader to distinguish and select those layers.

**Fix:** author each field independently. Define maturity evidence (release stability, maintenance, production references, or explicitly unverified), separate language/runtime from deployment, and give two or three specific strengths. Add non-framework baselines and either provider/model entries or a clearly separate provider/model selection matrix. Keep unknowns as unverified.

### P0 — Troubleshooting does not actually narrow a diagnosis

The nine flows have useful cautions, but each is only three questions followed by two unconnected causes. Answers do not select a branch, change the next question, or rule causes in/out. For example, “tool failure” combines wrong selection, validation failure, timeout, accepted-but-pending, and false completion, but only supplies causes for ambiguous selection and unknown timeout. This falls short of the plan's symptom-to-diagnostic-evidence-to-mitigation journey.

**Fix:** make each answer lead to a next check or cause; add terminal states for validation rejection, authorization denial, provider acceptance without completion, bad postcondition, and observability failure. Do the same for context (storage, retrieval, assembly, attention, freshness) and cost (demand, retry amplification, provider throttling, queue saturation, human-review bottleneck).

### P1 — “Implemented” coverage is being used as a proxy for semantic review

Every coverage entry has the same verification text and note, and all 159 are marked `implemented`. The note claims a semantic review occurred, but records no reviewer, finding, content location, test, or acceptance evidence. Several sections closely mirror the taxonomy heading and fit all listed subtopics into one paragraph. Structural mapping is useful, but it cannot establish depth or correctness.

**Fix:** keep `implemented` for the reference check, but give semantic review a separate state/evidence field. Record section anchor, review date, reviewer, gaps, and evidence. Mark compound requirements partially covered when only some clauses have actionable treatment.

### P1 — Examples are too shallow for a daily engineering playbook

Each guide has one short hypothetical paragraph. The advice is generally sound, but the reader rarely receives a worked artifact: no state-transition table, exact-action approval record, retry decision table, evaluation result with uncertainty, retrieval test set, threat model, framework gate matrix, or release manifest. C03 promises pattern examples and failure modes, yet its example only says what should and should not run in parallel.

**Fix:** add a small end-to-end case reused across chapters, with concrete inputs and outputs. At minimum include a workflow/state diagram or table, tool schema plus approval object, ambiguous-timeout recovery trace, evaluation report, framework hard-gate matrix, and release/rollback record. Show a failed version and the corrected version where practical.

### P1 — Source support is too coarse for the breadth of claims

Guide citations are chapter-level: several large guides cite only one or two sources while making claims about distributed transactions, fencing, statistical uncertainty, security controls, retention, and legal review. The 81-source framework research is strong, but most of it is only attached to catalogue entries; `framework-selection` itself cites only the NIST source. A reader cannot tell which source supports which time-sensitive statement.

**Fix:** attach source IDs to sections or material claims. Use standards/vendor docs for technical guarantees and label uncited material as engineering guidance. Link the framework guide to the research/catalogue sources it summarizes. Do not imply a citation supports the whole chapter.

### P2 — Evaluation guidance names statistics without making them usable

The evaluation guide correctly mentions repeated runs, confidence intervals, sample size, disagreement, segmentation, and rare severe failures. It does not show how to choose a denominator, report an interval, handle paired comparisons, measure reviewer agreement, or avoid claiming “zero risk” from zero observed events. A senior engineer is warned about uncertainty but not given a usable reporting template.

**Fix:** add a compact example report with numerator/denominator, interval method, paired task comparison, per-segment counts, reviewer disagreement, severe-event upper-bound caveat, and a release decision tied to consequence rather than a universal threshold.

### P2 — Security coverage needs a concrete confused-deputy and egress case

The security guide correctly says prompts cannot enforce authority and covers injection, tenant isolation, secrets, sandboxing, and exact-action approval. It never works through the common compound failure where an authorized connector is induced by untrusted content to read one resource and exfiltrate it through another allowed tool. Generic “restrict egress” advice is not enough to design enforcement.

**Fix:** add a worked attack path and controls at each boundary: caller identity, per-object authorization, information-flow/egress policy, destination allowlist, taint-aware handling where feasible, approval display, audit event, and incident reconciliation. State the residual limitations of prompt-injection defenses.

### P2 — Current technology research needs an explicit freshness contract

The research and entries are dated and generally careful, but the UI data does not state when an entry becomes stale or who must reverify it. A single `verifiedAt` date can look like continuing endorsement, especially for emerging projects and licensing.

**Fix:** add `reverifyBy` or a documented age policy, plus per-claim evidence status for license, language, deployment, and durability. Do not let one reviewed source make all fields appear reviewed.

## Scope actually reviewed

- Read `plan.md`, including the product/content contract and all C01–C13 taxonomy requirements.
- Read all 15 guides and their 159 section mappings, alternatives, examples, verification prompts, failure modes, and source references in `src/content/guides.json` and `src/content/coverage.json`.
- Read all 18 comparison entries, all nine troubleshooting flows, and the content types.
- Inspected the 60 checklist records, 30 glossary records, 81 source records, and category metadata for shape and role; these were not individually fact-checked line by line.
- Read `docs/framework-research.md` and treated its primary-source research as the baseline for technology claims. I did not repeat broad web research.
- Ran `node scripts/validate-content.mjs`; it passed structural validation. That result does not resolve the semantic findings above.

No UI, deployment, or runtime implementation was assessed in this review.
