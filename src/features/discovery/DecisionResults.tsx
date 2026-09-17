import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/UI";
import { problemQuestions } from "../../lib/decisions";
import type { DecisionResult } from "../../lib/models";
import { projectProblemDecision } from "../diagrams/definitions/problemDecision";

const DiagramFrame = lazy(() =>
  import("../diagrams/DiagramFrame").then((m) => ({ default: m.DiagramFrame })),
);

/**
 * Which answer(s) triggered a given recommendation, for transparent trigger
 * explanations. This mirrors `evaluateAnswers`'s own conditions in
 * `src/lib/decisions.ts` without duplicating or changing that logic -- it
 * only maps a result's stable title back to the question id(s) whose value
 * decided it, purely for display.
 */
const TRIGGER_QUESTIONS: Record<string, string[]> = {
  "Prefer conventional automation first": ["rules"],
  "Define an exact approval boundary": ["impact"],
  "Design for uncertain outcomes and recovery": ["autonomy"],
  "Persist execution state": ["timing"],
  "Reduce autonomy or add review capacity": ["autonomy", "review"],
  "Map exceptions before automating": ["process", "exceptions"],
  "Resolve data access first": ["data"],
  "Keep irreversible actions behind approval": ["reversible", "autonomy"],
};

function triggerLabels(result: DecisionResult, answers: Record<string, string>) {
  if (result.title.startsWith("Resolve: ")) {
    const label = result.title.slice("Resolve: ".length);
    const q = problemQuestions.find((q) => q.label === label);
    return q ? [`${q.label}: not yet answered`] : [];
  }
  const ids = TRIGGER_QUESTIONS[result.title] || [];
  return ids
    .map((id) => {
      const q = problemQuestions.find((q) => q.id === id);
      if (!q) return null;
      const value = answers[id];
      return `${q.label}: ${value && value !== "unknown" ? value.replace("-", " ") : "unknown"}`;
    })
    .filter((x): x is string => !!x);
}

/**
 * Synchronizes the discovery answers with a read-only decision graph and an
 * evidence-gap list (Task 8). The diagram is recomputed from the live
 * answers on every render via `projectProblemDecision`, so the highlighted
 * path always matches the currently selected answers; nothing here mutates
 * the diagram or the answers, it only reads them.
 */
export function DecisionResults({
  answers,
  results,
}: {
  answers: Record<string, string>;
  results: DecisionResult[];
}) {
  const { definition, currentNodeId } = useMemo(
    () => projectProblemDecision(answers),
    [answers],
  );
  const gaps = results.filter((r) => r.title.startsWith("Resolve: "));
  const recommendations = results.filter((r) => !r.title.startsWith("Resolve: "));
  // DiagramFrame keeps its own React Flow selection/status state internally
  // and only reads its `definition`/`initialSelection` props on first mount,
  // like every other page using it (they render a single static diagram).
  // Here the diagram must track live answers instead, so it is remounted
  // (via `key`) whenever the recomputed status of any node or the current
  // node changes -- the only way to keep it a read-only, non-editable
  // presentational view while still following the answers.
  const diagramKey = `${currentNodeId}:${definition.nodes
    .map((n) => n.data.status)
    .join(",")}`;

  return (
    <div className="discovery-results">
      <section aria-label="Decision graph">
        <h2>Decision path</h2>
        <p className="quiet">
          The highlighted step below reflects the answers you have entered so far.
        </p>
        <Suspense fallback={<p>Loading diagram…</p>}>
          <DiagramFrame
            key={diagramKey}
            definition={definition}
            initialSelection={currentNodeId}
            variant="light"
            mobileMode="canvas"
          />
        </Suspense>
      </section>

      <section aria-label="Recommended directions">
        <h2>Recommended directions</h2>
        {recommendations.map((r, i) => (
          <article key={`${r.title}-${i}`} className={`result ${r.level}`}>
            <Badge tone={r.level}>
              {r.level === "warning" ? "Evidence gap" : r.level === "check" ? "Control" : "Direction"}
            </Badge>
            <h3>{r.title}</h3>
            <p>{r.reason}</p>
            {triggerLabels(r, answers).length > 0 && (
              <p className="discovery-trigger">
                Because: {triggerLabels(r, answers).join("; ")}
              </p>
            )}
            {r.guideIds.map((id) => (
              <Link key={id} to={`/guides/${id}`}>
                Open related guide
              </Link>
            ))}
          </article>
        ))}
      </section>

      <section aria-label="Evidence still needed">
        <h2>Evidence still needed</h2>
        {gaps.length === 0 ? (
          <p className="quiet">No open questions remain unresolved.</p>
        ) : (
          <ul className="discovery-gap-list">
            {gaps.map((g, i) => (
              <li key={`${g.title}-${i}`}>{g.title.slice("Resolve: ".length)}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
