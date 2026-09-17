import { DiagramFrame } from "./diagrams/DiagramFrame";
import type { DiagramDefinition } from "./diagrams/types";

export const problemDecisionDiagram: DiagramDefinition = {
  id: "problem-decision",
  title: "Problem decision path",
  description:
    "Trace the outcome, rule stability, error economics and action boundary before choosing a model or framework.",
  nodes: [
    {
      id: "discover",
      type: "decision",
      position: { x: 0, y: 100 },
      data: {
        label: "Define outcome & baseline",
        detail:
          "Name the outcome, owner, current process and measurable baseline before selecting technology.",
        status: "current",
      },
    },
    {
      id: "rules",
      type: "decision",
      position: { x: 260, y: 0 },
      data: {
        label: "Stable rules sufficient?",
        detail:
          "If stable rules are sufficient, prefer conventional automation. Otherwise continue to uncertainty and risk controls.",
      },
    },
    {
      id: "risk",
      type: "risk",
      position: { x: 260, y: 190 },
      data: {
        label: "Map error consequence",
        detail:
          "Assess error impact, reversibility and human review. High or unknown impact is an evidence gap.",
        status: "unknown",
      },
    },
    {
      id: "evidence",
      type: "outcome",
      position: { x: 540, y: 0 },
      data: {
        label: "Use conventional automation",
        detail:
          "Build the smallest deterministic workflow and test its business outcome before adding probabilistic behavior.",
        status: "verified",
      },
    },
    {
      id: "controls",
      type: "principle",
      position: { x: 540, y: 190 },
      data: {
        label: "Bound action + gather evidence",
        detail:
          "Bound permissions, require exact-action approval where needed, and define verification, recovery and stop conditions.",
      },
    },
  ],
  edges: [
    {
      id: "a",
      source: "discover",
      target: "rules",
      data: { condition: "process known" },
    },
    { id: "b", source: "discover", target: "risk", data: { condition: "always" } },
    { id: "c", source: "rules", target: "evidence", data: { condition: "yes" } },
    {
      id: "d",
      source: "risk",
      target: "controls",
      data: { condition: "high / unknown" },
    },
  ],
  linearSteps: [
    {
      id: "discover",
      title: "Define the business outcome",
      detail: "Name the outcome, owner, current process and measurable baseline.",
    },
    {
      id: "rules",
      title: "Check whether stable rules are sufficient",
      detail:
        "If yes, use conventional automation and validate the business outcome.",
    },
    {
      id: "risk",
      title: "Map the consequence",
      detail:
        "If no or partly, map the consequence and reversibility of errors.",
    },
    {
      id: "controls",
      title: "Gather evidence",
      detail:
        "If impact is high or unknown, bound actions, require appropriate approval and gather evidence.",
    },
  ],
};

export default function DecisionGraph() {
  return (
    <DiagramFrame
      definition={problemDecisionDiagram}
      initialSelection="discover"
      variant="light"
      mobileMode="canvas"
    />
  );
}
