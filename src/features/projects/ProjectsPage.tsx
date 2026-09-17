import { Link } from "react-router-dom";
import { checklistItems } from "../../content";
import { Empty, Page } from "../../components/UI";
import { usePersonalState } from "../../app/StateContext";
import "./projects.css";

const UNRESOLVED_STATUSES = new Set(["needs-evidence", "unresolved"]);

/**
 * Project workspace list (Task 9). Replaces the legacy `Projects()` page in
 * `src/features/pages.tsx` (now unused, left for Task 12's cleanup). Every
 * summary below is computed on the fly from the project's own stored
 * `answers`/`reviews` -- nothing is written back as a new persisted field,
 * and there is deliberately no invented readiness/engagement score.
 *
 * `CostCalculator` (also exported from `pages.tsx`) previously rendered on
 * this page; it is out of scope for reviews/project workspaces and the plan
 * assigns its redesigned home to Task 11's `CostModel.tsx` on `/compare`, so
 * it is intentionally left off this page rather than kept here as unrelated
 * clutter.
 */
export function ProjectsPage() {
  const { state } = usePersonalState();
  return (
    <Page
      title="My projects"
      intro="Each project keeps separate answers, reviews and notes in this browser."
    >
      {state.projects.length ? (
        <div className="project-grid">
          {state.projects.map((p) => {
            const reviewed = Object.values(p.reviews).filter(
              (r) => r.status !== "not-reviewed",
            ).length;
            const unresolved = Object.values(p.reviews).filter((r) =>
              UNRESOLVED_STATUSES.has(r.status),
            ).length;
            return (
              <Link key={p.id} to={`/projects/${p.id}`}>
                <h2>{p.name}</h2>
                <p>
                  {Object.keys(p.answers).length} discovery answers ·{" "}
                  {reviewed} of {checklistItems.length} review items addressed
                </p>
                {unresolved > 0 && (
                  <p className="project-card-flag">
                    {unresolved} unresolved or needing evidence
                  </p>
                )}
                <small>Updated {new Date(p.updatedAt).toLocaleString()}</small>
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty
          title="No saved projects"
          body="Map a problem and save it when you want to return to the decision path."
          link="Start a problem"
          to="/start"
        />
      )}
    </Page>
  );
}
