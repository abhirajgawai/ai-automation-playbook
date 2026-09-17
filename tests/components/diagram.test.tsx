import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DiagramFrame } from "../../src/features/diagrams/DiagramFrame";
import { LinearDiagram } from "../../src/features/diagrams/LinearDiagram";
import type { DiagramDefinition } from "../../src/features/diagrams/types";

// @xyflow/react measures the canvas with a ResizeObserver, which jsdom does
// not implement.
beforeEach(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
});

afterEach(() => {
  cleanup();
});

const definition: DiagramDefinition = {
  id: "sample",
  title: "Sample decision",
  description: "A tiny diagram for tests.",
  nodes: [
    {
      id: "start",
      type: "decision",
      position: { x: 0, y: 0 },
      data: { label: "Start step", detail: "Explains the start step." },
    },
    {
      id: "risky",
      type: "risk",
      position: { x: 200, y: 0 },
      data: {
        label: "Map error consequence",
        detail: "Explains the risk step.",
        status: "unknown",
      },
    },
    {
      id: "end",
      type: "outcome",
      position: { x: 400, y: 0 },
      data: {
        label: "Verified result",
        detail: "Explains the outcome step.",
        status: "verified",
      },
    },
  ],
  edges: [
    { id: "e1", source: "start", target: "risky", data: { condition: "always" } },
    { id: "e2", source: "risky", target: "end", data: { condition: "resolved" } },
  ],
  linearSteps: [
    { id: "start", title: "Start step", detail: "Explains the start step." },
    { id: "risky", title: "Map error consequence", detail: "Explains the risk step." },
    { id: "end", title: "Verified result", detail: "Explains the outcome step." },
  ],
};

describe("DiagramFrame", () => {
  it("gives every node an accessible name derived from its label", () => {
    render(<DiagramFrame definition={definition} variant="light" mobileMode="canvas" />);
    for (const label of ["Start step", "Map error consequence", "Verified result"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("selects a node by keyboard and syncs the inspector text", () => {
    render(
      <DiagramFrame
        definition={definition}
        initialSelection="start"
        variant="light"
        mobileMode="canvas"
      />,
    );

    const inspector = document.querySelector(".graph-detail") as HTMLElement;
    expect(inspector.querySelector("strong")?.textContent).toBe("Start step");

    const riskyButton = within(inspector).getByRole("button", {
      name: "Map error consequence",
    });
    fireEvent.click(riskyButton);

    expect(inspector.querySelector("strong")?.textContent).toBe(
      "Map error consequence",
    );
    expect(within(inspector).getByText("Explains the risk step.")).toBeTruthy();
  });

  it("synchronizes selection when a canvas node is selected by keyboard", () => {
    render(
      <DiagramFrame
        definition={definition}
        initialSelection="start"
        variant="light"
        mobileMode="canvas"
      />,
    );

    const canvasNode = screen
      .getAllByText("Verified result")[0]
      .closest(".react-flow__node") as HTMLElement;
    canvasNode.focus();
    fireEvent.keyDown(canvasNode, { key: "Enter" });

    const inspector = document.querySelector(".graph-detail") as HTMLElement;
    expect(inspector.querySelector("strong")?.textContent).toBe(
      "Verified result",
    );
    expect(within(inspector).getByText("Explains the outcome step.")).toBeTruthy();
  });

  it("highlights only the branch connected to the selected node", () => {
    render(
      <DiagramFrame
        definition={definition}
        initialSelection="start"
        variant="light"
        mobileMode="canvas"
      />,
    );

    const endNode = screen
      .getAllByText("Verified result")[0]
      .closest(".react-flow__node") as HTMLElement;
    // "end" is not adjacent to the initially selected "start" node, so it
    // should be dimmed until it is part of the active branch.
    expect(endNode.className).toContain("is-dimmed");
  });

  it("renders a complete, ordered linear step list", () => {
    render(<LinearDiagram definition={definition} open />);

    const region = screen.getByRole("region", {
      name: /linear text equivalent/i,
    });
    const items = within(region).getAllByRole("listitem");
    expect(items).toHaveLength(definition.linearSteps.length);
    items.forEach((item, index) => {
      expect(item.textContent).toContain(definition.linearSteps[index].title);
      expect(item.textContent).toContain(definition.linearSteps[index].detail);
    });
  });

  it("renders the mobile step view instead of the canvas when mobileMode is steps", () => {
    render(
      <DiagramFrame definition={definition} variant="light" mobileMode="steps" />,
    );
    const frame = document.querySelector(".diagram-frame") as HTMLElement;
    expect(frame.dataset.mobileMode).toBe("steps");
    const details = frame.querySelector("details.linear") as HTMLDetailsElement;
    expect(details.open).toBe(true);
  });
});
