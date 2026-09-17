import type { DiagramDefinition } from "../types";

/**
 * The durable-execution guide's state model and failure trace: the
 * "ambiguous timeout" hypothetical example from the guide content, showing
 * the safe reconciliation path alongside the dangerous blind-retry path
 * that duplicates a business action. Content is drawn from the guide's own
 * examples and failure mode so the diagram introduces no new claims.
 */
export const durableExecutionDiagram: DiagramDefinition = {
  id: "durable-execution-state-model",
  title: "Durable execution state model",
  description:
    "An ambiguous timeout after an external call has one safe path (reconcile before acting) and one dangerous path (restart from scratch).",
  nodes: [
    {
      id: "dispatch",
      type: "system",
      position: { x: 0, y: 80 },
      data: {
        label: "Persist intent, then call the provider",
        detail:
          "Generate a stable operation key (op-42), persist intent, then dispatch the call. This must happen before the external call, not after.",
      },
    },
    {
      id: "timeout",
      type: "risk",
      position: { x: 260, y: 80 },
      data: {
        label: "Connection drops before the response arrives",
        detail:
          "The outcome is unknown: the provider may have accepted op-42 or not. Do not assume either outcome.",
        status: "unknown",
      },
    },
    {
      id: "reconcile",
      type: "decision",
      position: { x: 520, y: 0 },
      data: {
        label: "Reload op-42 as outcome-unknown and query the provider",
        detail:
          "Correct recovery: reload the persisted operation, query the provider by operation ID, and record its message ID before deciding anything else.",
        status: "current",
      },
    },
    {
      id: "restart",
      type: "risk",
      position: { x: 520, y: 200 },
      data: {
        label: "Restart from scratch with a new operation ID (op-43)",
        detail:
          "Failed recovery: creating a new operation key and sending again without checking op-42 first. This is the action to avoid.",
        status: "ruled-out",
      },
    },
    {
      id: "resume",
      type: "principle",
      position: { x: 800, y: 0 },
      data: {
        label: "Resume with deduplication or manual handling",
        detail:
          "If confirmed sent, verify the recipient and stop. If confirmed not sent, retry only under the documented same-key semantics. If status lookup is unavailable, stop automatic retries and assign reconciliation.",
        status: "verified",
      },
    },
    {
      id: "duplicate",
      type: "outcome",
      position: { x: 800, y: 200 },
      data: {
        label: "Business action duplicated",
        detail:
          "The provider receives a second send under a different operation key. This is the exact failure the pattern exists to prevent.",
        status: "ruled-out",
      },
    },
  ],
  edges: [
    { id: "a", source: "dispatch", target: "timeout", data: { condition: "always" } },
    {
      id: "b",
      source: "timeout",
      target: "reconcile",
      data: { condition: "correct recovery" },
    },
    {
      id: "c",
      source: "timeout",
      target: "restart",
      data: { condition: "failed recovery" },
    },
    {
      id: "d",
      source: "reconcile",
      target: "resume",
      data: { condition: "outcome confirmed" },
    },
    {
      id: "e",
      source: "restart",
      target: "duplicate",
      data: { condition: "always" },
    },
  ],
  linearSteps: [
    {
      id: "dispatch",
      title: "Persist intent, then dispatch",
      detail:
        "10:00:00 persist intent op-42. 10:00:01 provider accepts op-42. 10:00:02 the connection drops before the response arrives.",
    },
    {
      id: "timeout",
      title: "Treat the outcome as unknown",
      detail:
        "10:00:03 the worker dies. The call may have succeeded or failed downstream; the correct state is outcome-unknown, not failed.",
    },
    {
      id: "reconcile",
      title: "Reconcile before acting (safe path)",
      detail:
        "Reload op-42 as outcome-unknown, query the provider, record its message ID and verify the recipient before doing anything else.",
    },
    {
      id: "resume",
      title: "Resume with deduplication",
      detail:
        "If confirmed sent, stop. If confirmed not sent, retry only under the documented same-key semantics. If status lookup is unavailable, stop automatic retries and assign manual reconciliation.",
    },
    {
      id: "restart",
      title: "Do not restart from scratch (dangerous path)",
      detail:
        "Failed recovery creates a new operation (op-43) and sends again without checking op-42's outcome first.",
    },
    {
      id: "duplicate",
      title: "Result: a duplicated business action",
      detail:
        "The recipient may receive the notification twice. This is the failure mode this guide's recovery pattern exists to prevent.",
    },
  ],
};
