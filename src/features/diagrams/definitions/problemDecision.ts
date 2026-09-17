import type { DiagramDefinition, NodeStatus } from "../types";

/**
 * The guided discovery decision path (Task 8). Unlike the static homepage
 * decision map, this diagram is re-derived from the live discovery answers
 * every render: `projectProblemDecision` overlays each node's status and
 * reports which node represents the furthest-resolved point on the path, so
 * `DecisionResults` can highlight the current recommended path instead of a
 * single fixed illustration. The base shape below only supplies structure
 * (ids, positions, edges, linear text) — never per-answer state.
 */
export const problemDecisionDiagram: DiagramDefinition = {
  id: "problem-decision-path",
  title: "Guided problem decision path",
  description:
    "A live view of the discovery answers: whether conventional automation applies, what risk controls are triggered and what remains unknown.",
  nodes: [
    {
      id: "outcome",
      type: "decision",
      position: { x: 0, y: 120 },
      data: {
        label: "Outcome & process known",
        detail:
          "Name the outcome and how stable the current process is before choosing an approach.",
      },
    },
    {
      id: "rules",
      type: "decision",
      position: { x: 260, y: 0 },
      data: {
        label: "Can fixed rules solve it?",
        detail:
          "If yes, deterministic automation is preferred over a probabilistic system.",
      },
    },
    {
      id: "automation",
      type: "outcome",
      position: { x: 520, y: 0 },
      data: {
        label: "Prefer conventional automation",
        detail:
          "Fixed rules are sufficient; build the smallest deterministic workflow first.",
      },
    },
    {
      id: "risk",
      type: "risk",
      position: { x: 260, y: 220 },
      data: {
        label: "Map consequence & reversibility",
        detail:
          "Impact and reversibility decide how tightly actions must be bounded.",
      },
    },
    {
      id: "authority",
      type: "decision",
      position: { x: 520, y: 220 },
      data: {
        label: "Bound autonomy & review",
        detail:
          "What the system may do, and whether human review capacity exists to support it.",
      },
    },
    {
      id: "operate",
      type: "principle",
      position: { x: 780, y: 120 },
      data: {
        label: "Design for recovery & persistence",
        detail:
          "Action-taking or long-running work needs idempotency, audit evidence and a safe stop path.",
      },
    },
  ],
  edges: [
    { id: "a", source: "outcome", target: "rules", data: { condition: "process known" } },
    { id: "b", source: "outcome", target: "risk", data: { condition: "always" } },
    { id: "c", source: "rules", target: "automation", data: { condition: "yes" } },
    { id: "d", source: "risk", target: "authority", data: { condition: "high / unknown impact" } },
    {
      id: "e",
      source: "authority",
      target: "operate",
      data: { condition: "approved-action / autonomous / long-running" },
    },
  ],
  linearSteps: [
    {
      id: "outcome",
      title: "Name the outcome and process",
      detail: "Define the outcome and how stable the current process is.",
    },
    {
      id: "rules",
      title: "Check whether fixed rules are sufficient",
      detail: "If yes, deterministic automation is preferred.",
    },
    {
      id: "automation",
      title: "Prefer conventional automation",
      detail: "Build the smallest deterministic workflow and validate its outcome.",
    },
    {
      id: "risk",
      title: "Map consequence and reversibility",
      detail: "High impact or an unresolved reversibility answer is an evidence gap.",
    },
    {
      id: "authority",
      title: "Bound autonomy and review",
      detail: "Set what the system may do and confirm review capacity exists.",
    },
    {
      id: "operate",
      title: "Design for recovery and persistence",
      detail:
        "Action-taking or long-running work needs idempotency, audit evidence and a safe stop path.",
    },
  ],
};

const RESOLVED = new Set(["yes", "no", "partly", "read-only", "draft"]);

function known(value: string | undefined): boolean {
  return !!value && value !== "unknown";
}

/**
 * Overlay live discovery answers onto the base diagram: every node gets a
 * status derived only from the current answers (never mutating the shared
 * base definition), and the id of the furthest-resolved node is returned so
 * the caller can select/highlight it as the current recommended path.
 */
export function projectProblemDecision(answers: Record<string, string>): {
  definition: DiagramDefinition;
  currentNodeId: string;
} {
  const status: Record<string, NodeStatus> = {
    outcome: known(answers.outcome) ? "known" : "unknown",
    rules:
      answers.rules === "yes"
        ? "verified"
        : answers.rules === "no" || answers.rules === "partly"
          ? "ruled-out"
          : "unknown",
    automation:
      answers.rules === "yes"
        ? "verified"
        : known(answers.rules)
          ? "ruled-out"
          : "unknown",
    risk:
      answers.impact === "high" || answers.impact === "unknown" || answers.reversible === "no"
        ? "supported"
        : known(answers.impact) && known(answers.reversible)
          ? "known"
          : "unknown",
    authority: ["approved-action", "autonomous"].includes(answers.autonomy || "")
      ? "supported"
      : RESOLVED.has(answers.autonomy || "")
        ? "known"
        : "unknown",
    operate:
      ["approved-action", "autonomous"].includes(answers.autonomy || "") ||
      answers.timing === "long-running"
        ? "supported"
        : "unknown",
  };

  const currentNodeId =
    answers.rules === "yes"
      ? "automation"
      : ["approved-action", "autonomous"].includes(answers.autonomy || "") ||
          answers.timing === "long-running"
        ? "operate"
        : known(answers.impact) && known(answers.reversible)
          ? "authority"
          : known(answers.outcome)
            ? "rules"
            : "outcome";

  return {
    definition: {
      ...problemDecisionDiagram,
      nodes: problemDecisionDiagram.nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: status[node.id] },
      })),
    },
    currentNodeId,
  };
}
