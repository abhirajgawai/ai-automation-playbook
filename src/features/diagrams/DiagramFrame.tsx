import { useCallback, useEffect } from "react";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import "./diagrams.css";
import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";
import { DiagramInspector, DiagramLegend } from "./DiagramInspector";
import { LinearDiagram } from "./LinearDiagram";
import type { DiagramDefinition } from "./types";

function useDiagramSelection(
  definition: DiagramDefinition,
  initialSelection?: string,
) {
  const initial = initialSelection ?? definition.nodes[0]?.id ?? "";
  const [nodes, setNodes, onNodesChange] = useNodesState(
    definition.nodes.map((node) => ({ ...node, selected: node.id === initial })),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    definition.edges.map((edge) => ({ ...edge, type: "playbook" })),
  );
  const selectedId = nodes.find((node) => node.selected)?.id ?? initial;

  const select = useCallback(
    (id: string) => {
      setNodes((current) =>
        current.map((node) => ({ ...node, selected: node.id === id })),
      );
    },
    [setNodes],
  );

  // Recompute branch highlighting whenever the selection changes: the
  // selected node and its direct neighbors stay at full emphasis, the rest
  // of the diagram recedes. This only touches cosmetic className/selected
  // flags, never the selection itself, so it cannot loop back into a
  // further selection change.
  useEffect(() => {
    const neighborIds = new Set<string>([selectedId]);
    for (const edge of definition.edges) {
      if (edge.source === selectedId) neighborIds.add(edge.target);
      if (edge.target === selectedId) neighborIds.add(edge.source);
    }
    setNodes((current) =>
      current.map((node) => ({
        ...node,
        className: neighborIds.has(node.id) ? undefined : "is-dimmed",
      })),
    );
    setEdges((current) =>
      current.map((edge) => ({
        ...edge,
        selected: edge.source === selectedId || edge.target === selectedId,
      })),
    );
  }, [selectedId, definition.edges, setNodes, setEdges]);

  return { nodes, edges, onNodesChange, onEdgesChange, selectedId, select };
}

function DiagramCanvas({
  definition,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
}: {
  definition: DiagramDefinition;
  nodes: ReturnType<typeof useDiagramSelection>["nodes"];
  edges: ReturnType<typeof useDiagramSelection>["edges"];
  onNodesChange: ReturnType<typeof useDiagramSelection>["onNodesChange"];
  onEdgesChange: ReturnType<typeof useDiagramSelection>["onEdgesChange"];
}) {
  const { fitView } = useReactFlow();

  return (
    <div
      className="diagram-canvas"
      role="group"
      aria-label={`${definition.title} diagram`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
      >
        <Background gap={20} />
      </ReactFlow>
      <div className="diagram-canvas-controls">
        <button type="button" onClick={() => fitView({ padding: 0.3 })}>
          Fit diagram
        </button>
      </div>
      <DiagramLegend />
    </div>
  );
}

/**
 * The reusable diagram shell: a technical canvas paired with a synchronized
 * inspector and a complete linear text equivalent. `mobileMode` decides
 * whether narrow viewports keep the canvas visible (`"canvas"`) or lead
 * with the step view instead of an unreadably scaled graph (`"steps"`);
 * the inspector and linear alternative are always present regardless of
 * viewport so no essential interaction depends on the canvas or on drag.
 */
export function DiagramFrame({
  definition,
  initialSelection,
  variant = "light",
  mobileMode = "canvas",
}: {
  definition: DiagramDefinition;
  initialSelection?: string;
  variant?: "light" | "dark";
  mobileMode?: "canvas" | "steps";
}) {
  const { nodes, edges, onNodesChange, onEdgesChange, selectedId, select } =
    useDiagramSelection(definition, initialSelection);

  return (
    <div
      className="diagram-frame"
      data-variant={variant}
      data-mobile-mode={mobileMode}
    >
      <ReactFlowProvider>
        <DiagramCanvas
          definition={definition}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      </ReactFlowProvider>
      <DiagramInspector
        definition={definition}
        selectedId={selectedId}
        onSelect={select}
      />
      <LinearDiagram definition={definition} open={mobileMode === "steps"} />
    </div>
  );
}
