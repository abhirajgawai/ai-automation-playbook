import type { Edge, Node } from "@xyflow/react";

/**
 * Semantic node kinds shared across every playbook diagram. Each kind maps to
 * a custom node component in `nodes.tsx` with a distinct shape, status label
 * and restrained color drawn from the design tokens.
 */
export type NodeKind =
  | "decision"
  | "principle"
  | "system"
  | "evidence"
  | "risk"
  | "outcome";

/**
 * Evidence-style status a node can carry. Communicated through text, not
 * color alone.
 */
export type NodeStatus =
  | "known"
  | "unknown"
  | "supported"
  | "ruled-out"
  | "verified"
  | "current"
  | "observed";

export interface PlaybookNodeData {
  /** Short label shown on the node and used as its accessible name. */
  label: string;
  /** Longer explanation shown in the synchronized inspector when selected. */
  detail: string;
  /** Optional semantic status, rendered as a visible text label. */
  status?: NodeStatus;
  /** Optional owner/responsibility line, used by system nodes. */
  owner?: string;
  [key: string]: unknown;
}

export type PlaybookNode = Node<PlaybookNodeData, NodeKind> & {
  type: NodeKind;
};

export interface PlaybookEdgeData {
  /** Condition/trigger label describing when this edge applies. */
  condition?: string;
  [key: string]: unknown;
}

export type PlaybookEdge = Edge<PlaybookEdgeData>;

export interface LinearStep {
  id: string;
  title: string;
  detail: string;
}

export interface DiagramDefinition {
  id: string;
  title: string;
  description: string;
  nodes: PlaybookNode[];
  edges: PlaybookEdge[];
  linearSteps: LinearStep[];
}
