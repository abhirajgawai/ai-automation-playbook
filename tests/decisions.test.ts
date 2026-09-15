import { describe, expect, it } from "vitest";
import { evaluateAnswers } from "../src/lib/decisions";
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
