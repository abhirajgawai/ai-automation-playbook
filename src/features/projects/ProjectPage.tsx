import { Link, useParams } from "react-router-dom";
import { checklistItems } from "../../content";
import type { Stage } from "../../content/types";
import { Empty, Page } from "../../components/UI";
import { usePersonalState } from "../../app/StateContext";
import { problemQuestions } from "../../lib/decisions";
import "./projects.css";

const STAGES: { id: Stage; label: string }[] = [
  { id: "discovery", label: "Discovery" },
  { id: "architecture", label: "Architecture" },
  { id: "implementation", label: "Implementation" },
  { id: "pre-release", label: "Pre-release" },
  { id: "operations", label: "Operations" },
];

const UNRESOLVED_STATUSES = new Set(["needs-evidence", "unresolved"]);

/**
 * Project detail / workspace (Task 9). Replaces the legacy `ProjectDetail()`
 * page in `src/features/pages.tsx` (now unused, left for Task 12's
 * cleanup). Organized around what to do next: continue the decisions and
 * evidence already recorded, and see exactly which review items still need
 * evidence, grouped by stage -- every count here is computed from the
 * project's own stored records each render, never persisted, and there is
 * no composite readiness percentage.
 */
export function ProjectPage() {
  const { id } = useParams();
  const { state } = usePersonalState();
  const p = state.projects.find((x) => x.id === id);
  if (!p)
    return (
      <Page title="Project not found">
        <Empty
          title="This project is unavailable"
          body="It may have been removed or imported under a different ID."
          link="View projects"
          to="/projects"
        />
      </Page>
    );

  const gaps = checklistItems.filter((i) =>
    UNRESOLVED_STATUSES.has(p.reviews[i.id]?.status || ""),
  );

  return (
    <Page
      title={p.name}
      intro={`Updated ${new Date(p.updatedAt).toLocaleString()}`}
    >
      <div className="action-list">
        <Link to={`/start?project=${p.id}`}>
          <strong>Revisit discovery</strong>
          <span>Changing an answer recomputes dependent guidance.</span>
        </Link>
        <Link to={`/review?project=${p.id}`}>
          <strong>Continue design review</strong>
          <span>
            {gaps.length
              ? `${gaps.length} of ${checklistItems.length} items still need evidence.`
              : `${Object.keys(p.reviews).length} of ${checklistItems.length} items reviewed.`}
          </span>
        </Link>
      </div>

      <h2>Stage coverage</h2>
      <dl className="project-stage-summary">
        {STAGES.map((s) => {
          const total = checklistItems.filter((i) => i.stage === s.id).length;
          const resolved = checklistItems.filter(
            (i) =>
              i.stage === s.id &&
              ["satisfied", "not-applicable"].includes(
                p.reviews[i.id]?.status || "",
              ),
          ).length;
          return (
            <div key={s.id}>
              <dt>{s.label}</dt>
              <dd>
                {resolved} of {total} resolved
              </dd>
            </div>
          );
        })}
      </dl>

      {gaps.length > 0 && (
        <>
          <h2>Evidence still needed</h2>
          <ul className="project-gap-list">
            {gaps.map((g) => (
              <li key={g.id}>
                <Link to={`/review?project=${p.id}`}>{g.title}</Link>
                <span>{g.stage}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Recorded answers</h2>
      {Object.keys(p.answers).length ? (
        <dl className="facts">
          {Object.entries(p.answers).map(([k, v]) => (
            <div key={k}>
              <dt>{problemQuestions.find((q) => q.id === k)?.label || k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <Empty
          title="No discovery answers yet"
          body="Start a problem to record the decisions behind this project."
          link="Start a problem"
          to={`/start?project=${p.id}`}
        />
      )}
    </Page>
  );
}
