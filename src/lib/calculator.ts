import type { CostInput } from "./models";
export function calculateMonthlyCost(
  i: CostInput & {
    successRate?: number;
    humanReviewMinutes?: number;
    humanHourlyRate?: number;
  },
) {
  const values = Object.values(i);
  if (values.some((v) => !Number.isFinite(v) || v < 0))
    throw new Error("All cost inputs must be finite and nonnegative.");
  if (
    i.successRate !== undefined &&
    (i.successRate <= 0 || i.successRate > 100)
  )
    throw new Error("Success rate must be greater than 0 and at most 100.");
  const attempts = i.attempts ?? i.calls ?? 0;
  const totalCalls =
    i.attempts === undefined
      ? (i.calls ?? 0)
      : attempts * (i.callsPerAttempt ?? 1);
  const usage =
    ((i.inputTokens * totalCalls) / 1e6) * i.inputPerMillion +
    ((i.outputTokens * totalCalls) / 1e6) * i.outputPerMillion;
  const human =
    ((i.humanReviewMinutes ?? 0) / 60) * (i.humanHourlyRate ?? 0) * attempts;
  const monthly = usage + i.otherMonthly + human;
  const successes = attempts * ((i.successRate ?? 100) / 100);
  return {
    usage,
    human,
    totalCalls,
    successfulOutcomes: successes,
    monthly,
    costPerSuccess: successes ? monthly / successes : null,
  };
}
export type ScoreValue = number | "unverified";
export function weightedScore(
  criteria: { weight: number; mandatory: boolean; score: ScoreValue }[],
) {
  if (
    criteria.some(
      (c) => !Number.isFinite(c.weight) || c.weight < 0 || c.weight > 10,
    )
  )
    throw new Error("Weights must be between 0 and 10.");
  let total = 0,
    weight = 0;
  const gates = criteria.filter((c) => c.mandatory);
  const mandatoryUnknown = gates.some((c) => c.score === "unverified");
  const mandatoryFailed = gates.some((c) => c.score === 0);
  for (const c of criteria.filter((c) => !c.mandatory))
    if (typeof c.score === "number") {
      total += c.score * c.weight;
      weight += c.weight;
    }
  return {
    score: weight ? total / weight : null,
    mandatoryUnknown,
    mandatoryFailed,
    verifiedWeight: weight,
  };
}
