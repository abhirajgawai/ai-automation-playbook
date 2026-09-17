import { describe, expect, it } from "vitest";
import {
  discoverySteps,
  evaluateAnswers,
  problemQuestions,
} from "../src/lib/decisions";
describe("decision rules", () => {
  it("prefers rules when sufficient", () =>
    expect(
      evaluateAnswers({ rules: "yes" }).some((x) =>
        x.title.includes("conventional"),
      ),
    ).toBe(true));
  it("treats unknown high-impact fields as gaps", () =>
    expect(
      evaluateAnswers({ impact: "unknown" }).some((x) =>
        x.reason.includes("evidence gap"),
      ),
    ).toBe(true));
  it("adds recovery for action-taking systems", () =>
    expect(
      evaluateAnswers({ autonomy: "autonomous" }).some((x) =>
        x.title.includes("recovery"),
      ),
    ).toBe(true));
});
describe("discovery step grouping", () => {
  it("buckets every question into exactly one of the five named steps", () => {
    expect(discoverySteps.map((s) => s.id)).toEqual([
      "outcome",
      "process",
      "consequence",
      "authority",
      "operations",
    ]);
    const bucketed = discoverySteps.flatMap((s) => s.questionIds);
    expect(bucketed.sort()).toEqual(
      problemQuestions.map((q) => q.id).sort(),
    );
    // Every question id appears in exactly one step.
    const seen = new Map<string, number>();
    for (const id of bucketed) seen.set(id, (seen.get(id) || 0) + 1);
    expect([...seen.values()].every((count) => count === 1)).toBe(true);
  });
  it("stores answers under the original question id regardless of grouping", () => {
    const allQuestionIds = new Set(problemQuestions.map((q) => q.id));
    for (const step of discoverySteps)
      for (const id of step.questionIds) expect(allQuestionIds.has(id)).toBe(true);
  });
});
describe("evaluateAnswers robustness", () => {
  it("does not crash on unanswered/empty answers", () => {
    expect(() => evaluateAnswers({})).not.toThrow();
    const results = evaluateAnswers({});
    expect(results.length).toBeGreaterThan(0);
  });
  it("does not crash on a partially answered set with unknown values", () => {
    expect(() =>
      evaluateAnswers({ rules: "unknown", impact: "unknown" }),
    ).not.toThrow();
  });
  it("recomputes immediately with no stale state between calls", () => {
    const withRules = evaluateAnswers({ rules: "yes" });
    expect(withRules.some((x) => x.title.includes("conventional"))).toBe(
      true,
    );
    const withoutRules = evaluateAnswers({ rules: "no" });
    expect(
      withoutRules.some((x) => x.title.includes("conventional")),
    ).toBe(false);
    // The first call's result set is unaffected by the second call.
    expect(withRules.some((x) => x.title.includes("conventional"))).toBe(
      true,
    );
  });
  it("removes stale dependent guidance once the upstream answer no longer triggers it", () => {
    const autonomous = evaluateAnswers({ autonomy: "autonomous" });
    expect(autonomous.some((x) => x.title.includes("recovery"))).toBe(true);
    const readOnly = evaluateAnswers({ autonomy: "read-only" });
    expect(readOnly.some((x) => x.title.includes("recovery"))).toBe(false);
  });
});
