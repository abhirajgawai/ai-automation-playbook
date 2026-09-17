import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { guides, troubleshootingFlows } from "../../content";
import { Empty, Field, Page } from "../../components/UI";
import { ProjectSelect } from "../../components/ProjectSelect";
import { usePersonalState } from "../../app/StateContext";
import { troubleshootingDiagram } from "../diagrams/definitions/troubleshootingDefinition";
import { DiagnosticInspector } from "./DiagnosticInspector";
import "./troubleshooting.css";

const DiagramFrame = lazy(() =>
  import("../diagrams/DiagramFrame").then((m) => ({ default: m.DiagramFrame })),
);

/**
 * Evidence-driven troubleshooting (Task 10). Replaces the legacy
 * `Troubleshoot()` page with the same evidence model -- a symptom-first
 * flow list, per-cause evidence answers persisted to
 * `project.notes["troubleshooting:<flow>:cause:<title>"]` and a free-text
 * note persisted to `project.notes["troubleshooting:<flow>"]`, both keys
 * byte-for-byte unchanged from the legacy page -- re-expressed as a
 * read-only diagnostic tree (Task 4's `DiagramFrame`) that visualizes each
 * cause's evidence status as a node status (observed/supported/unknown/
 * ruled-out) instead of a plain list. The accessible `<select>` per cause
 * remains the actual input; the diagram and `DiagnosticInspector` are
 * synchronized, read-only views of that same state, following the same
 * pattern `projectProblemDecision`/`DecisionResults` established for
 * discovery (Task 8).
 */
export function TroubleshootPage() {
  const { state, setState } = usePersonalState();
  const [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState(params.get("flow") || "");
  const [projectId, setProjectId] = useState(
    params.get("project") || state.projects[0]?.id || "",
  );
  const [causeIndex, setCauseIndex] = useState(0);

  const flow = troubleshootingFlows.find((x) => x.id === selected);
  const project = state.projects.find((x) => x.id === projectId);
  const noteKey = `troubleshooting:${selected}`;
  const evidencePrefix = `${noteKey}:cause:`;
  const evidenceAnswer = (cause: string) =>
    project?.notes[`${evidencePrefix}${cause}`] || "unknown";
  const setEvidenceAnswer = (cause: string, answer: string) => {
    if (!project) return;
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) =>
        p.id === project.id
          ? {
              ...p,
              updatedAt: new Date().toISOString(),
              notes: { ...p.notes, [`${evidencePrefix}${cause}`]: answer },
            }
          : p,
      ),
    }));
  };

  useEffect(() => {
    setCauseIndex(0);
  }, [selected]);

  const definition = useMemo(
    () => (flow ? troubleshootingDiagram(flow, evidenceAnswer) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flow, project?.notes],
  );

  const activeCause = flow?.causes[causeIndex] ?? flow?.causes[0];
  const activeCauseStatus = activeCause
    ? (evidenceAnswer(activeCause.title) as "unknown" | "supports" | "rules-out")
    : "unknown";

  const diagramKey = definition
    ? `${causeIndex}:${definition.nodes.map((n) => n.data.status).join(",")}`
    : "";

  return (
    <Page
      title="Troubleshoot from evidence"
      intro="A symptom is not a diagnosis. Narrow causes before retrying or changing production behavior."
    >
      <ProjectSelect
        projectId={projectId}
        newProjectName="New troubleshooting session"
        onChange={(id) => {
          setProjectId(id);
          setParams((p) => {
            p.set("project", id);
            return p;
          });
        }}
      />
      <nav
        aria-label="Troubleshooting flows by symptom"
        className="troubleshoot-flow-nav"
      >
        <div className="flow-list">
          {troubleshootingFlows.map((f) => (
            <button
              type="button"
              className={selected === f.id ? "active" : ""}
              key={f.id}
              onClick={() => {
                setSelected(f.id);
                setParams((p) => {
                  p.set("flow", f.id);
                  return p;
                });
              }}
            >
              <strong>{f.title}</strong>
              <span>{f.symptom}</span>
            </button>
          ))}
        </div>
      </nav>
      {flow && definition && activeCause ? (
        <>
          <section className="diagnostic-tree" aria-label="Diagnostic tree">
            <h2>{flow.title}</h2>
            <h3>Diagnostic tree</h3>
            <p className="quiet">
              The symptom you observed sits at the root; each branch is a
              plausible cause whose status reflects the evidence you record
              below.
            </p>
            <Suspense fallback={<p>Loading diagram…</p>}>
              <DiagramFrame
                key={diagramKey}
                definition={definition}
                initialSelection={`cause-${causeIndex}`}
                variant="light"
                mobileMode="canvas"
              />
            </Suspense>

            <DiagnosticInspector
              flow={flow}
              cause={activeCause}
              status={activeCauseStatus}
            />
          </section>

        <section className="diagnostic">
          <h3>Gather evidence</h3>
          <ol>
            {flow.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>

          <h3>Plausible causes</h3>
          {flow.causes.map((c, i) => (
            <details
              key={c.title}
              onToggle={(e) => {
                if (e.currentTarget.open) setCauseIndex(i);
              }}
            >
              <summary>{c.title}</summary>
              <dl>
                <dt>Evidence</dt>
                <dd>{c.evidence}</dd>
                <dt>Safe mitigation</dt>
                <dd>{c.mitigation}</dd>
                <dt>Durable fix</dt>
                <dd>{c.durableFix}</dd>
              </dl>
              <Field label="What does your evidence indicate?">
                <select
                  disabled={!project}
                  value={evidenceAnswer(c.title)}
                  onChange={(e) => setEvidenceAnswer(c.title, e.target.value)}
                >
                  <option value="unknown">Unknown — investigate next</option>
                  <option value="supports">Supports this cause</option>
                  <option value="rules-out">Rules this cause out</option>
                </select>
              </Field>
            </details>
          ))}

          <h3>Current diagnosis</h3>
          <p>
            <strong>Remaining plausible:</strong>{" "}
            {flow.causes
              .filter((c) => evidenceAnswer(c.title) !== "rules-out")
              .map((c) => c.title)
              .join("; ") ||
              "None — revisit the symptom and gather broader evidence."}
          </p>
          <p>
            <strong>Next checks:</strong>{" "}
            {flow.causes
              .filter((c) => evidenceAnswer(c.title) === "unknown")
              .map((c) => c.evidence)
              .join("; ") ||
              "No unknown causes remain. Verify supported causes before mitigation."}
          </p>

          <h3>Evidence note</h3>
          {project ? (
            <Field
              label={`Saved to ${project.name}`}
              hint="Record observations, IDs and what ruled causes in or out."
            >
              <textarea
                rows={6}
                value={project.notes[noteKey] || ""}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    projects: s.projects.map((p) =>
                      p.id === project.id
                        ? {
                            ...p,
                            updatedAt: new Date().toISOString(),
                            notes: { ...p.notes, [noteKey]: e.target.value },
                          }
                        : p,
                    ),
                  }))
                }
              />
            </Field>
          ) : (
            <p>Select a project to preserve diagnostic evidence.</p>
          )}

          <h3>Related guidance</h3>
          <p>
            {flow.guideIds.map((id) => (
              <Link key={id} to={`/guides/${id}`}>
                {guides.find((g) => g.id === id)?.title || id}
              </Link>
            ))}
          </p>
        </section>
        </>
      ) : (
        <Empty
          title="Choose the closest symptom"
          body="Start broad. The flow will ask for evidence that separates plausible causes."
        />
      )}
    </Page>
  );
}
