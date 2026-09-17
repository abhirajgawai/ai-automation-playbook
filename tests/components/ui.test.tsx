import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import {
  Badge,
  Empty,
  ExternalLink,
  Field,
  Page,
} from "../../src/components/UI";

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
