import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeKind, NodeStatus, PlaybookNode } from "./types";

const kindLabels: Record<NodeKind, string> = {
  decision: "Decision",
  principle: "Principle",
  system: "System",
  evidence: "Evidence",
  risk: "Risk",
  outcome: "Outcome",
};

const statusLabels: Record<NodeStatus, string> = {
  known: "Known",
  unknown: "Unknown",
  supported: "Supported",
  "ruled-out": "Ruled out",
  verified: "Verified",
  current: "Current step",
};

function PlaybookNodeShell({
  kind,
  data,
  selected,
}: NodeProps<PlaybookNode> & { kind: NodeKind }) {
  return (
    <div
      className={`diagram-node diagram-node-${kind}${selected ? " is-selected" : ""}`}
    >
      <Handle type="target" position={Position.Top} />
      <span className="diagram-node-kind">{kindLabels[kind]}</span>
      <strong className="diagram-node-label">{data.label}</strong>
      {data.status && (
        <span className={`diagram-node-status status-${data.status}`}>
          {statusLabels[data.status]}
        </span>
      )}
      {data.owner && <span className="diagram-node-owner">{data.owner}</span>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function DecisionNode(props: NodeProps<PlaybookNode>) {
  return <PlaybookNodeShell {...props} kind="decision" />;
}

export function PrincipleNode(props: NodeProps<PlaybookNode>) {
  return <PlaybookNodeShell {...props} kind="principle" />;
}

export function SystemNode(props: NodeProps<PlaybookNode>) {
  return <PlaybookNodeShell {...props} kind="system" />;
}

export function EvidenceNode(props: NodeProps<PlaybookNode>) {
  return <PlaybookNodeShell {...props} kind="evidence" />;
}

export function RiskNode(props: NodeProps<PlaybookNode>) {
  return <PlaybookNodeShell {...props} kind="risk" />;
}

export function OutcomeNode(props: NodeProps<PlaybookNode>) {
  return <PlaybookNodeShell {...props} kind="outcome" />;
}

export const nodeKindLabels = kindLabels;
export const nodeStatusLabels = statusLabels;

export const nodeTypes = {
  decision: DecisionNode,
  principle: PrincipleNode,
  system: SystemNode,
  evidence: EvidenceNode,
  risk: RiskNode,
  outcome: OutcomeNode,
};
