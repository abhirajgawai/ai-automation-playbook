import type { DecisionResult } from "./models";
export interface ProblemQuestion {
  id: string;
  label: string;
  kind?: "text";
  options?: readonly string[];
}
export const problemQuestions: readonly ProblemQuestion[] = [
  { id: "outcome", label: "What outcome should improve?", kind: "text" },
  {
    id: "process",
    label: "How stable is the current process?",
    options: ["stable", "variable", "unknown"],
  },
  {
    id: "exceptions",
    label: "How common are exceptions?",
    options: ["rare", "frequent", "unknown"],
  },
  {
    id: "data",
    label: "Are required data and systems accessible?",
    options: ["yes", "partly", "no", "unknown"],
  },
  {
    id: "rules",
    label: "Can fixed rules solve it?",
    options: ["yes", "partly", "no", "unknown"],
  },
  {
    id: "impact",
    label: "What is the consequence of a wrong action?",
    options: ["low", "moderate", "high", "unknown"],
  },
  {
    id: "reversible",
    label: "Can an incorrect action be safely reversed?",
    options: ["yes", "partly", "no", "unknown"],
  },
  {
    id: "autonomy",
    label: "What may the system do?",
    options: ["read-only", "draft", "approved-action", "autonomous", "unknown"],
  },
  {
    id: "timing",
    label: "How quickly must it finish?",
    options: ["synchronous", "long-running", "either", "unknown"],
  },
  {
    id: "review",
    label: "Is human review capacity available?",
    options: ["yes", "limited", "no", "unknown"],
  },
  {
    id: "constraints",
    label: "Stack, volume, latency, budget or operational constraints?",
    kind: "text",
  },
];
/**
 * Task 8 groups the flat `problemQuestions` list into five named steps for
 * progressive presentation. This grouping is purely a UI concern: every
 * answer is still stored under its original question `id`, so existing
 * projects, exports and the `evaluateAnswers` rules above are untouched.
 */
export interface DiscoveryStep {
  id: "outcome" | "process" | "consequence" | "authority" | "operations";
  title: string;
  description: string;
  questionIds: string[];
}
export const discoverySteps: readonly DiscoveryStep[] = [
  {
    id: "outcome",
    title: "Outcome",
    description: "What should improve, and for whom.",
    questionIds: ["outcome"],
  },
  {
    id: "process",
    title: "Process",
    description: "How stable and rule-governed the current work is.",
    questionIds: ["process", "exceptions", "data", "rules"],
  },
  {
    id: "consequence",
    title: "Consequence",
    description: "What happens if the system gets it wrong.",
    questionIds: ["impact", "reversible"],
  },
  {
    id: "authority",
    title: "Authority",
    description: "What the system may do, and who checks it.",
    questionIds: ["autonomy", "review"],
  },
  {
    id: "operations",
    title: "Operations",
    description: "Timing and real-world constraints.",
    questionIds: ["timing", "constraints"],
  },
];
export function evaluateAnswers(a: Record<string, string>): DecisionResult[] {
  const r: DecisionResult[] = [];
  if (a.rules === "yes")
    r.push({
      title: "Prefer conventional automation first",
      reason:
        "Fixed rules can solve this task. Deterministic code is easier to test and operate.",
      guideIds: ["business-discovery"],
      level: "info",
    });
  if (["high", "unknown"].includes(a.impact))
    r.push({
      title: "Define an exact approval boundary",
      reason:
        a.impact === "high"
          ? "Errors have high consequences. Bind approval to the exact proposed action."
          : "Impact is unknown. Resolve this evidence gap before granting write access.",
      guideIds: ["security", "durable-execution"],
      level: "warning",
    });
  if (["approved-action", "autonomous"].includes(a.autonomy))
    r.push({
      title: "Design for uncertain outcomes and recovery",
      reason:
        "Action-taking systems need idempotency, reconciliation, audit evidence and a safe stop path.",
      guideIds: ["durable-execution", "tool-design"],
      level: "check",
    });
  if (a.timing === "long-running")
    r.push({
      title: "Persist execution state",
      reason:
        "Long-running work must survive worker restarts and support bounded resume.",
      guideIds: ["durable-execution", "harness-engineering"],
      level: "check",
    });
  if (
    a.review === "no" &&
    ["approved-action", "autonomous"].includes(a.autonomy)
  )
    r.push({
      title: "Reduce autonomy or add review capacity",
      reason:
        "The requested action level has no available human review capacity.",
      guideIds: ["security"],
      level: "warning",
    });
  if (a.process === "variable" || a.exceptions === "frequent")
    r.push({
      title: "Map exceptions before automating",
      reason:
        "Variable work or frequent exceptions need explicit routing, escalation and stop conditions.",
      guideIds: ["business-discovery", "workflow-patterns"],
      level: "check",
    });
  if (a.data === "no" || a.data === "partly")
    r.push({
      title: "Resolve data access first",
      reason:
        "Missing or partial access is a feasibility gap. Validate authoritative sources and permissions.",
      guideIds: ["business-discovery", "retrieval"],
      level: "warning",
    });
  if (a.reversible === "no" && a.autonomy !== "read-only")
    r.push({
      title: "Keep irreversible actions behind approval",
      reason:
        "The action cannot be safely reversed, so prevention and exact-action approval are required.",
      guideIds: ["security", "durable-execution"],
      level: "warning",
    });
  for (const q of problemQuestions)
    if (q.options && (!a[q.id] || a[q.id] === "unknown"))
      r.push({
        title: `Resolve: ${q.label}`,
        reason:
          "An unknown answer remains an evidence gap; no recommendation assumes a favorable answer.",
        guideIds: [],
        level: "warning",
      });
  const answered = problemQuestions
    .filter((q) => q.options)
    .every((q) => a[q.id] && a[q.id] !== "unknown");
  return r.length
    ? r
    : [
        {
          title: answered
            ? "Proceed to a bounded design review"
            : "Answer a few questions to reveal the decision path",
          reason: answered
            ? "No elevated trigger was found. Document success criteria, test representative failures and review the design before release."
            : "Results update immediately when an upstream answer changes.",
          guideIds: answered ? ["architecture", "evaluations"] : [],
          level: "info",
        },
      ];
}
