import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { checklistItems, CONTENT_VERSION } from "../../content";
import type { Stage } from "../../content/types";
import { Empty, Page } from "../../components/UI";
import { usePersonalState } from "../../app/StateContext";
import type { ReviewRecord } from "../../lib/models";
import { ReviewItem, type ReviewFieldKey } from "./ReviewItem";
import "../projects/projects.css";

const STAGES: { id: Stage; label: string }[] = [
  { id: "discovery", label: "Discovery" },
  { id: "architecture", label: "Architecture" },
  { id: "implementation", label: "Implementation" },
  { id: "pre-release", label: "Pre-release" },
  { id: "operations", label: "Operations" },
];

const UNRESOLVED_STATUSES = new Set(["needs-evidence", "unresolved"]);

const EMPTY_RECORD: ReviewRecord = {
  status: "not-reviewed",
  evidence: "",
  owner: "",
  assumptions: "",
  rationale: "",
  revisit: "",
  reviewedContentVersion: CONTENT_VERSION,
};

/**
 * Review's own project switcher (Task 9). A self-contained copy of the
 * `ProjectSelect` shape `Troubleshoot()` still uses from
 * `src/features/pages.tsx` -- kept separate rather than exported/shared so
 * this file's scope stays limited to reviews/projects, per the plan's file
 * list. Both preserve the identical "Project" accessible name and
 * "New project" button the acceptance/redesign suites depend on.
 */
function ProjectSelect({
  projectId,
  onChange,
}: {
  projectId: string;
  onChange: (id: string) => void;
}) {
  const { state, newProject } = usePersonalState();
  return (
    <div className="project-select">
      <select
        aria-label="Project"
        value={projectId}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a project</option>
        {state.projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        className="quiet"
        onClick={() => {
          const p = newProject("New design review");
          onChange(p.id);
        }}
      >
        New project
      </button>
    </div>
  );
}

/**
 * Design review (Task 9). Replaces the legacy `Review()` page in
 * `src/features/pages.tsx` (now unused, left for Task 12's cleanup) with
 * stage navigation carrying a live, non-persisted unresolved count, a
 * focused `ReviewItem` disclosure per checklist point and an explicit
 * reassess affordance for records recorded against an older content
 * version. Storage keys, field labels and the `.review-item` DOM shape are
 * unchanged so evidence stays isolated per project exactly as before.
 */
export function ReviewPage() {
  const { state, setState } = usePersonalState();
  const [params, setParams] = useSearchParams();
  const [projectId, setProjectId] = useState(
    params.get("project") || state.projects[0]?.id || "",
  );
  const [stage, setStage] = useState<Stage>("discovery");
  const project = state.projects.find((x) => x.id === projectId);

  function unresolvedCount(stageId: Stage) {
    if (!project) return 0;
    return checklistItems.filter(
      (i) =>
        i.stage === stageId &&
        UNRESOLVED_STATUSES.has(project.reviews[i.id]?.status || ""),
    ).length;
  }

  function updateReview(itemId: string, key: ReviewFieldKey, value: string) {
    if (!project) return;
    setState((s) => ({
      ...s,
      projects: s.projects.map((x) => {
        if (x.id !== project.id) return x;
        const current = x.reviews[itemId] || EMPTY_RECORD;
        return {
          ...x,
          updatedAt: new Date().toISOString(),
          reviews: {
            ...x.reviews,
            [itemId]: {
              ...current,
              [key]: value,
              ...(key === "status" && value !== "not-reviewed"
                ? { reviewedContentVersion: CONTENT_VERSION }
                : {}),
            },
          },
        };
      }),
    }));
  }

  function reassess(itemId: string) {
    if (!project) return;
    setState((s) => ({
      ...s,
      projects: s.projects.map((x) =>
        x.id !== project.id
          ? x
          : {
              ...x,
              updatedAt: new Date().toISOString(),
              reviews: {
                ...x.reviews,
                [itemId]: {
                  ...(x.reviews[itemId] || EMPTY_RECORD),
                  reviewedContentVersion: CONTENT_VERSION,
                },
              },
            },
      ),
    }));
  }

  const items = checklistItems.filter((i) => i.stage === stage);
  const staleCount = project
    ? Object.values(project.reviews).filter(
        (r) => r.reviewedContentVersion !== CONTENT_VERSION,
      ).length
    : 0;

  return (
    <Page
      title="Review a design"
      intro="Record coverage and unresolved evidence. Completion is not production certification."
      actions={
        <ProjectSelect
          projectId={projectId}
          onChange={(id) => {
            setProjectId(id);
            setParams({ project: id });
          }}
        />
      }
    >
      {!project ? (
        <Empty
          title="Choose a project"
          body="Reviews are independent so evidence never leaks between projects."
        />
      ) : (
        <>
          <nav className="review-stage-nav" aria-label="Review stages">
            {STAGES.map((s) => {
              const count = unresolvedCount(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  className="review-stage-tab"
                  aria-current={stage === s.id ? "true" : undefined}
                  onClick={() => setStage(s.id)}
                >
                  <span>{s.label}</span>
                  {count > 0 && (
                    <span className="review-stage-count">
                      {count} unresolved
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          {staleCount > 0 && (
            <p className="review-stale-banner">
              {staleCount} review item{staleCount === 1 ? "" : "s"} recorded
              against an older content version. Reassess them below.
            </p>
          )}
          {items.map((i) => (
            <ReviewItem
              key={i.id}
              item={i}
              record={project.reviews[i.id]}
              contentVersion={CONTENT_VERSION}
              onChange={(key, value) => updateReview(i.id, key, value)}
              onReassess={() => reassess(i.id)}
            />
          ))}
        </>
      )}
    </Page>
  );
}
