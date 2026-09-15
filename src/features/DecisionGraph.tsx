import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState } from "react";
const details: Record<string, string> = {
  discover:
    "Name the outcome, owner, current process and measurable baseline before selecting technology.",
  rules:
    "If stable rules are sufficient, prefer conventional automation. Otherwise continue to uncertainty and risk controls.",
  risk: "Assess error impact, reversibility and human review. High or unknown impact is an evidence gap.",
  evidence:
    "Build the smallest deterministic workflow and test its business outcome before adding probabilistic behavior.",
  controls:
    "Bound permissions, require exact-action approval where needed, and define verification, recovery and stop conditions.",
};
const nodes: Node[] = [
  {
    id: "discover",
    position: { x: 0, y: 100 },
    data: { label: "Define outcome & baseline" },
  },
  {
    id: "rules",
    position: { x: 260, y: 0 },
    data: { label: "Stable rules sufficient?" },
  },
  {
    id: "risk",
    position: { x: 260, y: 190 },
    data: { label: "Map error consequence" },
  },
  {
    id: "evidence",
    position: { x: 540, y: 0 },
    data: { label: "Use conventional automation" },
  },
  {
    id: "controls",
    position: { x: 540, y: 190 },
    data: { label: "Bound action + gather evidence" },
  },
];
const edges: Edge[] = [
  { id: "a", source: "discover", target: "rules", label: "process known" },
  { id: "b", source: "discover", target: "risk", label: "always" },
  { id: "c", source: "rules", target: "evidence", label: "yes" },
  { id: "d", source: "risk", target: "controls", label: "high / unknown" },
];
export default function DecisionGraph() {
  const [selected, setSelected] = useState("discover");
  const selectedNode = nodes.find((n) => n.id === selected);
  const activeEdges = edges.map((e) => ({
    ...e,
    animated: e.source === selected || e.target === selected,
    style: {
      stroke:
        e.source === selected || e.target === selected ? "#1559b7" : undefined,
      strokeWidth: e.source === selected || e.target === selected ? 2 : 1,
    },
  }));
  return (
    <div>
      <div className="graph" aria-label="Problem decision path diagram">
        <ReactFlow
          nodes={nodes}
          edges={activeEdges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          onNodeClick={(_, node) => setSelected(node.id)}
        >
          <Background gap={20} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <div className="graph-detail" aria-live="polite">
        <strong>{String(selectedNode?.data.label)}</strong>
        <p>{details[selected]}</p>
        <span>Select a step: </span>
        {nodes.map((node) => (
          <button
            className="quiet"
            key={node.id}
            onClick={() => setSelected(node.id)}
          >
            {String(node.data.label)}
          </button>
        ))}
      </div>
    </div>
  );
}
