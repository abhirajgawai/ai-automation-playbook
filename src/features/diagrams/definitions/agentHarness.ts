import type { DiagramDefinition } from "../types";

/**
 * The "how an agent harness fits together" guide's execution loop: model
 * output moves through validation, policy and dispatch to either a
 * verified completion or a continued step. Shows the guide's own failure
 * mode (announcing completion from model text alone) against the safe
 * verification-hook path.
 */
export const agentHarnessDiagram: DiagramDefinition = {
  id: "agent-harness-loop",
  title: "Agent harness execution loop",
  description:
    "The runtime around a model assembles context, validates proposed tool calls, checks policy, dispatches tools and records results, then either continues or verifies completion against real state.",
  nodes: [
    {
      id: "model",
      type: "system",
      position: { x: 0, y: 100 },
      data: {
        label: "Model proposes tool calls from assembled context",
        detail:
          "Adapters translate the provider's request and response formats into an application contract and validate structured output before handing it to domain logic.",
      },
    },
    {
      id: "validate",
      type: "decision",
      position: { x: 240, y: 100 },
      data: {
        label: "Validate the call and check policy",
        detail:
          "The tool registry describes capabilities, but a separate policy check decides whether this particular call is allowed now. Tool availability must not be confused with authority to use it.",
        status: "current",
      },
    },
    {
      id: "dispatch",
      type: "system",
      position: { x: 480, y: 100 },
      data: {
        label: "Dispatch the tool and normalize the result",
        detail:
          "Dispatchers normalize success, rejection, transient error and unknown outcome, keeping business identifiers and operation keys intact.",
      },
    },
    {
      id: "verify",
      type: "decision",
      position: { x: 720, y: 100 },
      data: {
        label: "Check a deterministic postcondition against real state",
        detail:
          "A verified completion hook distinguishes accepted, pending, outcome-unknown and completed; it must not collapse these into a generic success.",
        status: "current",
      },
    },
    {
      id: "verified-complete",
      type: "outcome",
      position: { x: 960, y: 20 },
      data: {
        label: "Verified completion",
        detail:
          "The postcondition check confirms the external state matches the intended outcome before the harness reports completion.",
        status: "verified",
      },
    },
    {
      id: "false-complete",
      type: "risk",
      position: { x: 960, y: 220 },
      data: {
        label: "Harness announces completion prematurely",
        detail:
          "Completion relied on the model's text rather than verified state. Diagnose by comparing the terminal response with operation records and postconditions.",
        status: "ruled-out",
      },
    },
  ],
  edges: [
    { id: "a", source: "model", target: "validate", data: { condition: "always" } },
    {
      id: "b",
      source: "validate",
      target: "dispatch",
      data: { condition: "allowed by policy" },
    },
    {
      id: "c",
      source: "dispatch",
      target: "verify",
      data: { condition: "result recorded" },
    },
    {
      id: "d",
      source: "verify",
      target: "verified-complete",
      data: { condition: "postcondition confirmed" },
    },
    {
      id: "e",
      source: "verify",
      target: "false-complete",
      data: { condition: "verification skipped" },
    },
  ],
  linearSteps: [
    {
      id: "model",
      title: "Model proposes tool calls",
      detail:
        "The model produces a structured proposal from the assembled context; the harness validates the structured output before handing it to domain logic.",
    },
    {
      id: "validate",
      title: "Validate and check policy",
      detail:
        "A separate policy check decides whether this specific call is allowed now, independent of whether the tool exists in the registry.",
    },
    {
      id: "dispatch",
      title: "Dispatch and normalize the result",
      detail:
        "The dispatcher records success, rejection, transient error or unknown outcome while preserving business identifiers and operation keys.",
    },
    {
      id: "verify",
      title: "Verify the postcondition (safe path)",
      detail:
        "A deterministic verification hook checks the real external state and distinguishes accepted, pending, outcome-unknown and completed.",
    },
    {
      id: "verified-complete",
      title: "Result: verified completion",
      detail:
        "The harness only reports completion once the postcondition confirms the external state matches the intended outcome.",
    },
    {
      id: "false-complete",
      title: "Do not trust model text alone (dangerous path)",
      detail:
        "The harness announces completion prematurely because it relied on the model's text instead of a verification hook, diagnosed by comparing the terminal response against operation records.",
    },
  ],
};
