import type { TroubleshootingFlow } from "../../../content/types";
import type { DiagramDefinition, NodeStatus } from "../types";

/**
 * Evidence-driven troubleshooting (Task 10). Unlike the static homepage or
 * durable-execution diagrams, this diagram is rebuilt from a single
 * `TroubleshootingFlow` and the project's own saved evidence answers on
 * every render: the symptom is always shown as "observed" (the reporter
 * already saw it happen) and each cause's status is derived only from the
 * existing `troubleshooting:<flow>:cause:<title>` note value -- never a new
 * storage shape, never mutated content. This function is pure and never
 * writes back to the flow content or the project; it only reads
 * `evidenceAnswer` to compute a read-only visualization, exactly like
 * `projectProblemDecision` does for discovery (Task 8).
 */
const CAUSE_STATUS: Record<string, NodeStatus> = {
  unknown: "unknown",
  supports: "supported",
  "rules-out": "ruled-out",
};

export function troubleshootingDiagram(
  flow: TroubleshootingFlow,
  evidenceAnswer: (causeTitle: string) => string,
): DiagramDefinition {
  const symptomId = "symptom";
  const causeStep = 140;

  return {
    id: `troubleshooting-${flow.id}`,
    title: `${flow.title} diagnostic tree`,
    description: flow.symptom,
    nodes: [
      {
        id: symptomId,
        type: "risk",
        position: { x: 0, y: (flow.causes.length * causeStep) / 2 - causeStep / 2 },
        data: {
          label: flow.title,
          detail: flow.symptom,
          status: "observed",
        },
      },
      ...flow.causes.map((cause, index) => ({
        id: `cause-${index}`,
        type: "evidence" as const,
        position: { x: 320, y: index * causeStep },
        data: {
          label: cause.title,
          detail: cause.evidence,
          status: CAUSE_STATUS[evidenceAnswer(cause.title)] ?? "unknown",
        },
      })),
    ],
    edges: flow.causes.map((_cause, index) => ({
      id: `edge-${index}`,
      source: symptomId,
      target: `cause-${index}`,
      data: { condition: "possible cause" },
    })),
    linearSteps: [
      { id: symptomId, title: flow.title, detail: flow.symptom },
      ...flow.causes.map((cause, index) => ({
        id: `cause-${index}`,
        title: cause.title,
        detail: `Evidence: ${cause.evidence} Safe mitigation: ${cause.mitigation} Durable fix: ${cause.durableFix}`,
      })),
    ],
  };
}
