import { describe, expect, it } from "vitest";
import {
  emptyState,
  loadState,
  mergeStatesWithConflicts,
  migrate,
  parseImport,
  STORAGE_KEY,
} from "../src/lib/persistence";
const project = (overrides = {}) => ({
  id: "x",
  name: "Project",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
  answers: {},
  reviews: {},
  notes: {},
  ...overrides,
});
describe("persistence", () => {
  it("migrates schema 1 without losing notes", () =>
    expect(
      migrate({ ...emptyState, schemaVersion: 1, notes: { old: "keep" } }).notes
        .old,
    ).toBe("keep"));
  it("rejects invalid JSON and schema", () => {
    expect(() => parseImport("<script>alert(1)</script>")).toThrow(
      "valid JSON",
    );
    expect(() => parseImport(JSON.stringify({ schemaVersion: 99 }))).toThrow(
      "Unsupported",
    );
  });
  it("rejects malformed nested notes, review statuses and duplicate ids", () => {
    expect(() =>
      parseImport(
        JSON.stringify({ ...emptyState, notes: { guide: { html: "bad" } } }),
      ),
    ).toThrow("text values");
    expect(() =>
      parseImport(
        JSON.stringify({
          ...emptyState,
          projects: [project({ reviews: { c: { status: "invented" } } })],
        }),
      ),
    ).toThrow("invalid status");
    expect(() =>
      parseImport(
        JSON.stringify({ ...emptyState, projects: [project(), project()] }),
      ),
    ).toThrow("unique");
  });
  it("returns corrupt raw storage without overwriting it", () => {
    const storage = {
      getItem: () => "{bad",
      setItem: () => {
        throw new Error("must not write");
      },
    } as unknown as Storage;
    const loaded = loadState(storage);
    expect(loaded.raw).toBe("{bad");
    expect(loaded.error).toContain("could not be read");
  });
  it("preserves unknown content notes and local same-id work during merge", () => {
    const local = project({
      name: "Local",
      answers: { local: "keep" },
      notes: { diagnostic: "keep" },
    });
    const remote = project({ name: "Old export", answers: { remote: "add" } });
    const merged = mergeStatesWithConflicts(
      { ...emptyState, projects: [local], notes: { "removed-guide": "keep" } },
      { ...emptyState, projects: [remote] },
    );
    expect(merged.conflicts).toEqual(["x"]);
    expect(merged.state.projects[0]).toMatchObject({
      name: "Local",
      answers: { local: "keep", remote: "add" },
      notes: { diagnostic: "keep" },
    });
    expect(merged.state.notes["removed-guide"]).toBe("keep");
  });
});
