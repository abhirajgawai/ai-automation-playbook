import { describe, expect, it } from "vitest";
import { calculateMonthlyCost, weightedScore } from "../src/lib/calculator";
describe("calculator", () => {
  it("includes human review and cost per successful outcome", () => {
    const x = calculateMonthlyCost({
      inputTokens: 1_000_000,
      outputTokens: 500_000,
      calls: 2,
      inputPerMillion: 1,
      outputPerMillion: 4,
      otherMonthly: 10,
      successRate: 50,
      humanReviewMinutes: 30,
      humanHourlyRate: 60,
    });
    expect(x.monthly).toBe(76);
    expect(x.costPerSuccess).toBe(76);
  });
  it("separates business attempts from model calls and review effort", () => {
    const x = calculateMonthlyCost({
      inputTokens: 1_000_000,
      outputTokens: 0,
      attempts: 10,
      callsPerAttempt: 3,
      inputPerMillion: 1,
      outputPerMillion: 0,
      otherMonthly: 0,
      successRate: 50,
      humanReviewMinutes: 6,
      humanHourlyRate: 60,
    });
    expect(x.totalCalls).toBe(30);
    expect(x.human).toBe(60);
    expect(x.monthly).toBe(90);
    expect(x.successfulOutcomes).toBe(5);
    expect(x.costPerSuccess).toBe(18);
  });
  it("rejects negative, infinite and invalid success inputs", () => {
    expect(() =>
      calculateMonthlyCost({
        inputTokens: -1,
        outputTokens: 0,
        calls: 1,
        inputPerMillion: 1,
        outputPerMillion: 1,
        otherMonthly: 0,
      }),
    ).toThrow("nonnegative");
    expect(() =>
      calculateMonthlyCost({
        inputTokens: 1,
        outputTokens: 0,
        calls: 1,
        inputPerMillion: 1,
        outputPerMillion: 1,
        otherMonthly: 0,
        successRate: 0,
      }),
    ).toThrow("Success rate");
  });
  it("keeps mandatory gates separate from preferences", () => {
    expect(
      weightedScore([
        { weight: 5, mandatory: true, score: 0 },
        { weight: 1, mandatory: false, score: 4 },
      ]),
    ).toEqual({
      score: 4,
      mandatoryUnknown: false,
      mandatoryFailed: true,
      verifiedWeight: 1,
    });
    expect(
      weightedScore([
        { weight: 5, mandatory: true, score: "unverified" },
        { weight: 1, mandatory: false, score: 4 },
      ]).mandatoryUnknown,
    ).toBe(true);
  });
});
