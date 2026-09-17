import type { DiagramDefinition } from "./types";

/**
 * The semantically equivalent ordered text representation every essential
 * diagram must be paired with. Rendered inside a labelled region so it can
 * be located independently of the canvas, and as a collapsible `<details>`
 * so it does not compete with the canvas for attention when both are
 * visible at once.
 */
export function LinearDiagram({
  definition,
  open = false,
}: {
  definition: DiagramDefinition;
  open?: boolean;
}) {
  return (
    <section
      className="diagram-linear"
      aria-label={`${definition.title} linear text equivalent`}
    >
      <details className="linear" open={open}>
        <summary>Read this path without the diagram</summary>
        <ol>
          {definition.linearSteps.map((step) => (
            <li key={step.id}>
              <strong>{step.title}.</strong> {step.detail}
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
