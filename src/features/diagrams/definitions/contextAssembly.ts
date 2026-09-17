import type { DiagramDefinition } from "../types";

/**
 * The "keep the right context through long tasks" guide's context-assembly
 * and compaction model: what a deliberate call assembles, the choice
 * compaction makes under pressure, and the difference between the safe
 * "preserve exact state" path and the dangerous "lossy summarize" path that
 * drops a pending action. Content is drawn directly from the guide's own
 * sections and failure mode so the diagram introduces no new claims.
 */
export const contextAssemblyDiagram: DiagramDefinition = {
  id: "context-assembly-model",
  title: "Context assembly and compaction model",
  description:
    "Each call assembles goal, constraints, tools, history, state and evidence deliberately; when the input budget is exceeded, compaction has one safe path (preserve exact state) and one dangerous path (lossy summary) that can drop a pending action.",
  nodes: [
    {
      id: "assemble",
      type: "system",
      position: { x: 0, y: 80 },
      data: {
        label: "Assemble goal, constraints, tools, history, state, evidence",
        detail:
          "Deliberately assemble the active goal, constraints, permitted tools, relevant history, current execution state and supporting evidence for each call. Keep authoritative values outside free-form conversation and log which evidence identifiers were included.",
      },
    },
    {
      id: "budget",
      type: "risk",
      position: { x: 260, y: 80 },
      data: {
        label: "Input budget is exceeded",
        detail:
          "Instructions, tool schemas, task data, history and retrieved excerpts have filled the available input budget, leaving no headroom for tool results and the final output.",
        status: "unknown",
      },
    },
    {
      id: "compact-safe",
      type: "decision",
      position: { x: 520, y: 0 },
      data: {
        label: "Preserve exact IDs and pending actions in structured state",
        detail:
          "Correct recovery: keep exact identifiers, unresolved evidence and pending actions in a structured state contract, and clear or reference bulky tool results rather than the facts that drive the next action.",
        status: "current",
      },
    },
    {
      id: "compact-lossy",
      type: "risk",
      position: { x: 520, y: 200 },
      data: {
        label: "Summarize the whole history without a preservation test",
        detail:
          "Failed recovery: compress the conversation into a free-form summary without verifying that the critical constraint and the pending action both survive.",
        status: "ruled-out",
      },
    },
    {
      id: "resumed",
      type: "principle",
      position: { x: 800, y: 0 },
      data: {
        label: "Resumed worker completes the pending action once",
        detail:
          "The next call recovers the current goal, authorization, unresolved evidence and next action exactly as before compaction, and does not repeat completed work.",
        status: "verified",
      },
    },
    {
      id: "forgotten",
      type: "outcome",
      position: { x: 800, y: 200 },
      data: {
        label: "Agent forgets a constraint and repeats work",
        detail:
          "The summary omitted exact state or an early requirement, so the resumed worker violates a constraint or spends its remaining budget repeating an already-completed action.",
        status: "ruled-out",
      },
    },
  ],
  edges: [
    { id: "a", source: "assemble", target: "budget", data: { condition: "always" } },
    {
      id: "b",
      source: "budget",
      target: "compact-safe",
      data: { condition: "tested preservation" },
    },
    {
      id: "c",
      source: "budget",
      target: "compact-lossy",
      data: { condition: "untested summary" },
    },
    {
      id: "d",
      source: "compact-safe",
      target: "resumed",
      data: { condition: "state contract intact" },
    },
    {
      id: "e",
      source: "compact-lossy",
      target: "forgotten",
      data: { condition: "always" },
    },
  ],
  linearSteps: [
    {
      id: "assemble",
      title: "Assemble context deliberately",
      detail:
        "Each call assembles the active goal, constraints, permitted tools, relevant history, current execution state and supporting evidence, logging which evidence identifiers were included.",
    },
    {
      id: "budget",
      title: "The input budget is exceeded",
      detail:
        "Instructions, schemas, task data, history and retrieved excerpts fill the available budget, leaving no headroom for tool results and the final output.",
    },
    {
      id: "compact-safe",
      title: "Preserve exact state (safe path)",
      detail:
        "Keep exact IDs, unresolved evidence and pending actions in structured state, and clear or reference bulky tool results instead of the facts that drive the next action.",
    },
    {
      id: "resumed",
      title: "Resume without repeating work",
      detail:
        "The resumed worker recovers the current goal, authorization, unresolved evidence and next action exactly as before compaction.",
    },
    {
      id: "compact-lossy",
      title: "Do not summarize without a preservation test (dangerous path)",
      detail:
        "Compressing history into a free-form summary without testing whether the critical constraint and pending action survive.",
    },
    {
      id: "forgotten",
      title: "Result: a forgotten constraint or repeated work",
      detail:
        "The agent forgets constraints after compaction, or spends its remaining budget repeating an already-completed action.",
    },
  ],
};
