import type {
  PersonalState,
  Project,
  ReviewRecord,
  ReviewStatus,
} from "./models";

export const STORAGE_KEY = "ai-playbook-state";
export const MAX_IMPORT_BYTES = 2_000_000;
export const emptyState: PersonalState = {
  schemaVersion: 2,
  projects: [],
  bookmarks: [],
  notes: {},
  recentGuideIds: [],
  theme: "system",
};
const statuses: ReviewStatus[] = [
  "not-reviewed",
  "satisfied",
  "needs-evidence",
  "unresolved",
  "not-applicable",
];
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const reservedKeys = new Set(["__proto__", "constructor", "prototype"]);
const id = (v: unknown) =>
  typeof v === "string" &&
  v.length > 0 &&
  v.length <= 256 &&
  !reservedKeys.has(v);
function stringMap(v: unknown, label: string): Record<string, string> {
  if (!record(v)) throw new Error(`${label} must be an object.`);
  for (const [k, x] of Object.entries(v))
    if (!id(k) || typeof x !== "string")
      throw new Error(`${label} must contain only text values.`);
  return v as Record<string, string>;
}
function stringArray(v: unknown, label: string): string[] {
  if (!Array.isArray(v) || !v.every(id))
    throw new Error(`${label} must be a list of strings.`);
  return v as string[];
}
function date(v: unknown, label: string) {
  if (typeof v !== "string" || !v || Number.isNaN(Date.parse(v)))
    throw new Error(`${label} must be a valid date.`);
  return v;
}
function review(v: unknown, label: string): ReviewRecord {
  if (!record(v) || !statuses.includes(v.status as ReviewStatus))
    throw new Error(`${label} has an invalid status.`);
  for (const k of [
    "evidence",
    "owner",
    "assumptions",
    "rationale",
    "revisit",
    "reviewedContentVersion",
  ])
    if (typeof v[k] !== "string")
      throw new Error(`${label}.${k} must be text.`);
  return v as unknown as ReviewRecord;
}
function project(v: unknown, i: number): Project {
  const label = `projects[${i}]`;
  if (!record(v) || !id(v.id) || typeof v.name !== "string" || !v.name.trim())
    throw new Error(`${label} has an invalid ID or name.`);
  date(v.createdAt, `${label}.createdAt`);
  date(v.updatedAt, `${label}.updatedAt`);
  const answers = stringMap(v.answers, `${label}.answers`);
  const notes = stringMap(v.notes, `${label}.notes`);
  if (!record(v.reviews))
    throw new Error(`${label}.reviews must be an object.`);
  const reviews: Record<string, ReviewRecord> = Object.create(null);
  for (const [key, value] of Object.entries(v.reviews)) {
    if (!id(key)) throw new Error(`${label}.reviews has an invalid ID.`);
    reviews[key] = review(value, `${label}.reviews.${key}`);
  }
  return {
    id: v.id as string,
    name: v.name,
    createdAt: v.createdAt as string,
    updatedAt: v.updatedAt as string,
    answers,
    reviews,
    notes,
  };
}
export function validateState(v: unknown): PersonalState {
  if (!record(v) || v.schemaVersion !== 2)
    throw new Error("Unsupported schema version.");
  if (!Array.isArray(v.projects)) throw new Error("projects must be a list.");
  const projects = v.projects.map(project);
  if (new Set(projects.map((p) => p.id)).size !== projects.length)
    throw new Error("Project IDs must be unique.");
  const bookmarks = stringArray(v.bookmarks, "bookmarks"),
    recentGuideIds = stringArray(v.recentGuideIds, "recentGuideIds"),
    notes = stringMap(v.notes, "notes");
  if (!["light", "dark", "system"].includes(String(v.theme)))
    throw new Error("theme is invalid.");
  if (v.exportedAt !== undefined) date(v.exportedAt, "exportedAt");
  return {
    schemaVersion: 2,
    projects,
    bookmarks,
    notes,
    recentGuideIds,
    theme: v.theme as PersonalState["theme"],
    ...(v.exportedAt ? { exportedAt: v.exportedAt as string } : {}),
  };
}
export function migrate(input: unknown): PersonalState {
  if (!record(input)) throw new Error("State is not an object.");
  return validateState(
    input.schemaVersion === 1
      ? {
          ...input,
          schemaVersion: 2,
          recentGuideIds: input.recentGuideIds ?? [],
        }
      : input,
  );
}
export function parseImport(text: string) {
  if (new Blob([text]).size > MAX_IMPORT_BYTES)
    throw new Error("Import exceeds the 2 MB limit.");
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("Import is not valid JSON.");
  }
  return migrate(raw);
}
export interface MergePreview {
  conflicts: string[];
  state: PersonalState;
}
export function mergeStates(current: PersonalState, incoming: PersonalState) {
  return mergeStatesWithConflicts(current, incoming).state;
}
export function mergeStatesWithConflicts(
  current: PersonalState,
  incoming: PersonalState,
): MergePreview {
  const projects = new Map(current.projects.map((p) => [p.id, p]));
  const conflicts: string[] = [];
  for (const remote of incoming.projects) {
    const local = projects.get(remote.id);
    if (!local) {
      projects.set(remote.id, remote);
      continue;
    }
    conflicts.push(remote.id);
    projects.set(remote.id, {
      ...remote,
      ...local,
      answers: { ...remote.answers, ...local.answers },
      reviews: { ...remote.reviews, ...local.reviews },
      notes: { ...remote.notes, ...local.notes },
      createdAt:
        new Date(remote.createdAt) < new Date(local.createdAt)
          ? remote.createdAt
          : local.createdAt,
      updatedAt:
        new Date(remote.updatedAt) > new Date(local.updatedAt)
          ? remote.updatedAt
          : local.updatedAt,
    });
  }
  return {
    conflicts,
    state: {
      ...current,
      projects: [...projects.values()],
      bookmarks: [...new Set([...current.bookmarks, ...incoming.bookmarks])],
      notes: { ...incoming.notes, ...current.notes },
      recentGuideIds: [
        ...new Set([...current.recentGuideIds, ...incoming.recentGuideIds]),
      ].slice(0, 10),
    },
  };
}
export function loadState(storage: Storage): {
  state: PersonalState;
  error?: string;
  raw?: string;
} {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return { state: emptyState };
  try {
    return { state: migrate(JSON.parse(raw)) };
  } catch (e) {
    return {
      state: emptyState,
      error: `Saved data could not be read: ${(e as Error).message}`,
      raw,
    };
  }
}
export function saveState(storage: Storage, state: PersonalState) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}
