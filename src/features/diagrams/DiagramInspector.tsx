import { nodeKindLabels, nodeStatusLabels } from "./nodes";
import type { DiagramDefinition, PlaybookNode } from "./types";

/**
 * Synchronized explanation for the selected node. This is the primary
 * accessible interaction surface for every diagram: node text on the
 * canvas stays short, and the full explanation plus a real button per
 * node lives here so pointer, keyboard and screen-reader users share one
 * predictable place to read and change the selection.
 */
export function DiagramInspector({
  definition,
  selectedId,
  onSelect,
}: {
  definition: DiagramDefinition;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const selected: PlaybookNode | undefined = definition.nodes.find(
    (node) => node.id === selectedId,
  );

  return (
    <div className="graph-detail" aria-live="polite">
      {selected && (
        <>
          <span className="diagram-node-kind">
            {nodeKindLabels[selected.type]}
          </span>
          <strong>{selected.data.label}</strong>
          <p>{selected.data.detail}</p>
          {selected.data.status && (
            <span className="diagram-node-status-text">
              Status: {nodeStatusLabels[selected.data.status]}
            </span>
          )}
        </>
      )}
      <div className="diagram-step-select">
        <span>Select a step: </span>
        {definition.nodes.map((node) => (
          <button
            type="button"
            className={`quiet${node.id === selectedId ? " is-selected" : ""}`}
            key={node.id}
            aria-pressed={node.id === selectedId}
            onClick={() => onSelect(node.id)}
          >
            {node.data.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const legendKinds = [
  "decision",
  "principle",
  "system",
  "evidence",
  "risk",
  "outcome",
] as const;

/** Static legend explaining each node shape/kind used on the canvas. */
export function DiagramLegend() {
  return (
    <ul className="diagram-legend" aria-label="Diagram legend">
      {legendKinds.map((kind) => (
        <li key={kind} className={`diagram-legend-item diagram-node-${kind}`}>
          {nodeKindLabels[kind]}
        </li>
      ))}
    </ul>
  );
}
