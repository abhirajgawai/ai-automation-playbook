import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import {
  Callout,
  IconButton,
  SectionHeading,
  type CalloutTone,
} from "../../src/components/Primitives";
import {
  Badge,
  Empty,
  ExternalLink,
  Field,
  Page,
} from "../../src/components/UI";

describe("modern field manual primitives", () => {
  it("gives every callout tone a visible text label", () => {
    render(
      <>
        {[
          ["principle", "Principle"],
          ["evidence", "Evidence"],
          ["warning", "Warning"],
          ["example", "Example"],
          ["success", "Verified"],
        ].map(([tone, label]) => (
          <Callout key={tone} tone={tone as CalloutTone} title="Context">
            <p>{label} details</p>
          </Callout>
        ))}
      </>,
    );

    for (const label of [
      "Principle",
      "Evidence",
      "Warning",
      "Example",
      "Verified",
    ]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it("keeps section heading levels semantic", () => {
    render(
      <>
        <SectionHeading level={2} title="Decision rule" />
        <SectionHeading level={3} title="Evidence to collect" />
      </>,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Decision rule" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 3, name: "Evidence to collect" }),
    ).toBeTruthy();
  });

  it("gives icon buttons their required accessible name", () => {
    render(<IconButton label="Open guide navigation">☰</IconButton>);

    expect(
      screen.getByRole("button", { name: "Open guide navigation" }),
    ).toBeTruthy();
  });
});

describe("UI primitives", () => {
  it("renders a page with its main landmark and heading", () => {
    render(
      <Page title="Field manual" intro="A short guide">
        <p>Content</p>
      </Page>,
    );
    expect(screen.getByRole("main").getAttribute("id")).toBe("main");
    expect(screen.getByRole("heading", { name: "Field manual" })).toBeTruthy();
  });

  it("keeps the page intro out of the legacy compatibility class", () => {
    const { container } = render(
      <Page title="Field manual" intro="A short guide">
        <p>Content</p>
      </Page>,
    );

    const intro = container.querySelector("header");
    expect(intro?.className).toContain("page-intro");
    expect(intro?.className).not.toContain("page-head");
  });

  it("associates fields with their controls and exposes badges", () => {
    render(
      <Field label="Project name">
        <input />
      </Field>,
    );
    expect(screen.getByLabelText("Project name")).toBeTruthy();
    expect(screen.queryByText("plain")).toBeNull();
    render(<Badge tone="warning">Evidence gap</Badge>);
    expect(screen.getByText("Evidence gap").className).toContain(
      "badge warning",
    );
  });

  it("keeps external links safe and empty states actionable", () => {
    render(
      <MemoryRouter>
        <>
          <ExternalLink href="https://example.com">Source</ExternalLink>
          <Empty
            title="Nothing saved"
            body="Save a guide first"
            link="Explore"
            to="/explore"
          />
        </>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: /Source/ }).getAttribute("rel"),
    ).toBe("noopener noreferrer");
    expect(
      screen.getByRole("link", { name: "Explore" }).getAttribute("href"),
    ).toBe("/explore");
  });
});
