import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from "@xyflow/react";
import type { PlaybookEdge } from "./types";

/**
 * Shared edge renderer used across every playbook diagram. Active edges
 * (touching the selected node) are drawn with the electric-blue action
 * token and a heavier stroke; inactive edges recede using the border token.
 * The condition label is rendered as real text, never color alone.
 */
export function PlaybookEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}: EdgeProps<PlaybookEdge>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        className={`diagram-edge${selected ? " is-active" : ""}`}
      />
      {data?.condition && (
        <EdgeLabelRenderer>
          <div
            className={`diagram-edge-label${selected ? " is-active" : ""}`}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {data.condition}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const edgeTypes = {
  playbook: PlaybookEdge,
};
