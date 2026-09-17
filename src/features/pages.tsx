import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import MiniSearch from "minisearch";
import {
  categories,
  guides,
  sources,
  checklistItems,
  troubleshootingFlows,
  comparisonOptions,
  glossary,
  CONTENT_VERSION,
} from "../content";
import type { Guide, Stage } from "../content/types";
import { Badge, Empty, ExternalLink, Field, Page } from "../components/UI";
import { usePersonalState } from "../app/StateContext";
import { evaluateAnswers, problemQuestions } from "../lib/decisions";
import {
  calculateMonthlyCost,
  weightedScore,
  type ScoreValue,
} from "../lib/calculator";
import {
  emptyState,
  mergeStatesWithConflicts,
  parseImport,
} from "../lib/persistence";
import type { Project, ReviewStatus } from "../lib/models";
const DecisionGraph = lazy(() => import("./DecisionGraph"));

function SearchBox() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form
      className="hero-search"
      onSubmit={(e) => {
        e.preventDefault();
        nav(`/explore?q=${encodeURIComponent(q)}`);
      }}
    >
      <label htmlFor="home-search">
        What are you trying to decide or diagnose?
      </label>
      <div>
        <input
          id="home-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “duplicate action” or “memory versus RAG”"
        />
        <button>Search playbook</button>
      </div>
    </form>
  );
}
export function Home() {
  const { state } = usePersonalState();
  return (
    <Page
      title="Build systems you can explain."
      intro="Navigate uncertain AI and automation decisions with explicit evidence, controls and trade-offs."
    >
      <SearchBox />
      <section className="start-grid">
        <div className="decision-preview">
          <div>
            <h2>Start with the shape of the problem</h2>
            <p>
              Trace the outcome, rule stability, error economics and action
              boundary before choosing a model or framework.
            </p>
            <Link className="button" to="/start">
              Map a new problem
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="graph-loading">Loading decision map…</div>
            }
          >
            <DecisionGraph />
          </Suspense>
          <details className="linear">
            <summary>Read this path without the diagram</summary>
            <ol>
              <li>Define the business outcome and current baseline.</li>
              <li>Check whether stable rules are sufficient.</li>
              <li>
                If yes, use conventional automation and validate the business
                outcome.
              </li>
              <li>
                If no or partly, map the consequence and reversibility of
                errors.
              </li>
              <li>
                If impact is high or unknown, bound actions, require appropriate
                approval and gather evidence.
              </li>
              <li>
                For lower reversible impact, run a bounded experiment with
                verification and stop conditions.
              </li>
            </ol>
          </details>
        </div>
      </section>
      <section>
        <h2>Choose your next move</h2>
        <div className="action-list">
          {[
            [
              "Explore guidance",
              "Browse practical guides by engineering concern.",
              "/explore",
            ],
            [
              "Review a design",
              "Record evidence, assumptions, owners and gaps.",
              "/review",
            ],
            [
              "Troubleshoot",
              "Start from a symptom, then test plausible causes.",
              "/troubleshoot",
            ],
            [
              "Compare approaches",
              "Separate mandatory requirements from preferences.",
              "/compare",
            ],
          ].map((x) => (
            <Link key={x[0]} to={x[2]}>
              <strong>{x[0]}</strong>
              <span>{x[1]}</span>
            </Link>
          ))}
        </div>
      </section>
      {state.projects.length > 0 && (
        <section>
          <h2>Continue your work</h2>
          <div className="ruled-list">
            {state.projects.slice(0, 3).map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`}>
                <strong>{p.name}</strong>
                <span>
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {(state.recentGuideIds.length > 0 || state.bookmarks.length > 0) && (
        <section>
          <h2>Saved and recently read</h2>
          <div className="ruled-list">
            {[...new Set([...state.bookmarks, ...state.recentGuideIds])]
              .slice(0, 5)
              .map((id) => {
                const guide = guides.find((g) => g.id === id);
                return guide ? (
                  <Link key={id} to={`/guides/${id}`}>
                    <strong>{guide.title}</strong>
                    <span>
                      {state.bookmarks.includes(id)
                        ? "Bookmarked"
                        : "Recently read"}
                    </span>
                  </Link>
                ) : null;
              })}
          </div>
        </section>
      )}
      <section>
        <h2>Browse by engineering concern</h2>
        <div className="guide-index compact">
          {categories.map((c) => (
            <Link key={c.id} to={`/explore?category=${c.id}`}>
              <span>{c.id}</span>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
            </Link>
          ))}
        </div>
      </section>
      {state.projects.some((p) =>
        Object.values(p.reviews).some(
          (r) => r.status === "unresolved" || r.status === "needs-evidence",
        ),
      ) && (
        <section>
          <h2>Evidence still needed</h2>
          <div className="ruled-list">
            {state.projects.map((p) => {
              const count = Object.values(p.reviews).filter(
                (r) =>
                  r.status === "unresolved" || r.status === "needs-evidence",
              ).length;
              return count ? (
                <Link key={p.id} to={`/review?project=${p.id}`}>
                  <strong>{p.name}</strong>
                  <span>{count} unresolved or needing evidence</span>
                </Link>
              ) : null;
            })}
          </div>
        </section>
      )}
      <aside className="local-callout">
        <strong>Your work stays here.</strong> Projects, notes and bookmarks are
        stored only in this browser and origin. Export them from Settings before
        clearing site data or changing domains.
      </aside>
    </Page>
  );
}

export function StartProblem() {
  const { newProject, setState } = usePersonalState();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { state } = usePersonalState();
  const existing = state.projects.find((p) => p.id === params.get("project"));
  const [name, setName] = useState(existing?.name || "");
  const [answers, setAnswers] = useState<Record<string, string>>(
    existing?.answers || {},
  );
  const [saved, setSaved] = useState<string | undefined>(existing?.id);
  const results = evaluateAnswers(answers);
  function save() {
    if (saved) {
      setState((s) => ({
        ...s,
        projects: s.projects.map((p) =>
          p.id === saved
            ? {
                ...p,
                name: name || p.name,
                answers,
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      }));
      nav(`/projects/${saved}`);
    } else {
      const p = newProject(name);
      setState((s) => ({
        ...s,
        projects: s.projects.map((x) =>
          x.id === p.id ? { ...x, answers } : x,
        ),
      }));
      setSaved(p.id);
      nav(`/projects/${p.id}`);
    }
  }
  return (
    <Page
      title="Start a problem"
      intro="Use short, explainable rules to expose decisions and missing evidence. Answers never select a universally best architecture."
    >
      <div className="split">
        <form className="questions" onSubmit={(e) => e.preventDefault()}>
          <Field label="Project name" hint="Optional until you save">
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          {problemQuestions.map((q) => (
            <Field key={q.id} label={q.label}>
              {q.kind === "text" ? (
                <textarea
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                />
              ) : (
                <select
                  value={answers[q.id] || "unknown"}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                >
                  {(q.options || ["unknown"]).map((o) => (
                    <option key={o} value={o}>
                      {o.replace("-", " ")}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          ))}
          <button type="button" onClick={save}>
            {saved ? "Save changes" : "Save as project"}
          </button>
        </form>
        <aside className="results">
          <h2>Decision path</h2>
          {results.map((r, i) => (
            <article key={`${r.title}-${i}`} className={`result ${r.level}`}>
              <Badge tone={r.level}>
                {r.level === "warning"
                  ? "Evidence gap"
                  : r.level === "check"
                    ? "Control"
                    : "Direction"}
              </Badge>
              <h3>{r.title}</h3>
              <p>{r.reason}</p>
              {r.guideIds.map((id) => (
                <Link key={id} to={`/guides/${id}`}>
                  Open related guide
                </Link>
              ))}
            </article>
          ))}
        </aside>
      </div>
    </Page>
  );
}

function useGuideSearch(q: string) {
  return useMemo(() => {
    if (!q.trim()) return guides;
    const mini = new MiniSearch<Guide>({
      fields: ["title", "summary", "tags", "searchBody"],
      storeFields: ["id"],
    });
    mini.addAll(
      guides.map((g) => ({
        ...g,
        searchBody: [
          ...g.sections.flatMap((s) => [s.title, ...s.body]),
          ...g.verification,
          ...g.failureModes.flatMap((f) => [f.symptom, f.cause, f.diagnostic]),
        ].join(" "),
      })),
    );
    const ids = new Set(
      mini.search(q, { prefix: true, fuzzy: 0.2 }).map((x) => x.id),
    );
    return guides.filter((g) => ids.has(g.id));
  }, [q]);
}
export function Explore() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") || "";
  const cat = sp.get("category") || "";
  const found = useGuideSearch(q).filter((g) => !cat || g.categoryId === cat);
  return (
    <Page
      title="Explore the playbook"
      intro="Durable engineering principles, practical checks and clearly dated technology evidence."
    >
      <div className="filters">
        <input
          aria-label="Search guides"
          value={q}
          onChange={(e) =>
            setSp((p) => {
              e.target.value ? p.set("q", e.target.value) : p.delete("q");
              return p;
            })
          }
          placeholder="Search by question or symptom"
        />
        <select
          aria-label="Filter by category"
          value={cat}
          onChange={(e) =>
            setSp((p) => {
              e.target.value
                ? p.set("category", e.target.value)
                : p.delete("category");
              return p;
            })
          }
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>
      {found.length ? (
        <div className="guide-index">
          {found.map((g) => (
            <Link to={`/guides/${g.id}`} key={g.id}>
              <span>{g.categoryId}</span>
              <h2>{g.title}</h2>
              <p>{g.summary}</p>
              <div>
                {g.stages.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Empty
          title="No guidance found"
          body="Try a broader term such as tools, memory, reliability or evaluation."
          link="Browse every guide"
          to="/explore"
        />
      )}
    </Page>
  );
}
export function GuidePage() {
  const { id } = useParams();
  const { state, setState } = usePersonalState();
  const g = guides.find((x) => x.id === id);
  useEffect(() => {
    if (!g) return;
    setState((s) => ({
      ...s,
      recentGuideIds: [
        g.id,
        ...s.recentGuideIds.filter((x) => x !== g.id),
      ].slice(0, 10),
    }));
  }, [g?.id]);
  if (!g)
    return (
      <Page title="Guide not found">
        <Empty
          title="This guide is unavailable"
          body="The content may have moved. Any personal note is still preserved in Settings exports."
          link="Explore guides"
          to="/explore"
        />
      </Page>
    );
  const marked = state.bookmarks.includes(g.id);
  const note = state.notes[g.id] || "";
  return (
    <Page
      title={g.title}
      intro={g.summary}
      actions={
        <button
          className="quiet"
          onClick={() =>
            setState((s) => ({
              ...s,
              bookmarks: marked
                ? s.bookmarks.filter((x) => x !== g.id)
                : [...s.bookmarks, g.id],
            }))
          }
        >
          {marked ? "Remove bookmark" : "Bookmark guide"}
        </button>
      }
    >
      <div className="guide-layout">
        <article className="prose">
          <div className="guide-meta">
            <Badge>{g.categoryId}</Badge>
            {g.stages.map((x) => (
              <Badge key={x}>{x}</Badge>
            ))}
            <span>Reviewed {g.reviewedAt}</span>
          </div>
          <aside className="local-callout">
            This guide combines durable principles and editorial
            recommendations. Version-specific behavior is tied to the sources
            below; worked examples are hypothetical unless explicitly stated
            otherwise.
          </aside>
          <section className="applicability">
            <h2>When it fits</h2>
            <dl>
              <dt>Required</dt>
              <dd>{g.applicability.required}</dd>
              <dt>Optional</dt>
              <dd>{g.applicability.optional}</dd>
              <dt>Unnecessary</dt>
              <dd>{g.applicability.unnecessary}</dd>
            </dl>
          </section>
          {g.prerequisites.length > 0 && (
            <section className="requirements">
              <h2>Prerequisites</h2>
              <ul>
                {g.prerequisites.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
          )}
          {g.sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ))}
          {g.alternatives.length > 0 && (
            <section>
              <h2>Alternatives</h2>
              <div
                className="table-wrap"
                tabIndex={0}
                role="region"
                aria-label="Alternatives comparison table"
              >
                <table>
                  <thead>
                    <tr>
                      <th>Approach</th>
                      <th>Benefits</th>
                      <th>Costs</th>
                      <th>Limits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.alternatives.map((a) => (
                      <tr key={a.name}>
                        <th>{a.name}</th>
                        <td>{a.benefits}</td>
                        <td>{a.costs}</td>
                        <td>{a.limitations}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {g.tradeoffs.length > 0 && (
            <section>
              <h2>Trade-offs</h2>
              <ul>
                {g.tradeoffs.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
          )}
          {g.examples.length > 0 && (
            <section>
              <h2>Hypothetical worked examples</h2>
              {g.examples.map((x) => (
                <details key={x.title}>
                  <summary>{x.title}</summary>
                  <p>{x.body}</p>
                </details>
              ))}
            </section>
          )}
          <section>
            <h2>Decision criteria</h2>
            <ul>
              {g.decisionCriteria.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Verification</h2>
            <ul className="checks">
              {g.verification.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Ownership and revisit triggers</h2>
            <p>
              <strong>Typical owner:</strong> {g.owner}
            </p>
            <ul>
              {g.reconsiderWhen.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          {g.failureModes.length > 0 && (
            <section>
              <h2>Failure modes</h2>
              {g.failureModes.map((x) => (
                <details key={x.symptom}>
                  <summary>{x.symptom}</summary>
                  <p>
                    <strong>Likely cause:</strong> {x.cause}
                  </p>
                  <p>
                    <strong>Diagnostic:</strong> {x.diagnostic}
                  </p>
                  <p>
                    <strong>Mitigation:</strong> {x.mitigation}
                  </p>
                </details>
              ))}
            </section>
          )}
        </article>
        <aside className="detail-rail">
          <Field label="My note" hint="Stored only in this browser">
            <textarea
              rows={8}
              value={note}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  notes: { ...s.notes, [g.id]: e.target.value },
                }))
              }
            />
          </Field>
          <h2>Sources</h2>
          {g.sourceIds.map((sid) => {
            const s = sources.find((x) => x.id === sid);
            return s ? (
              <p key={sid}>
                <ExternalLink href={s.url}>{s.title}</ExternalLink>
                <small>
                  {s.reviewedAt
                    ? `Reviewed ${s.reviewedAt}`
                    : "Not yet verified"}{" "}
                  · {s.status}
                </small>
                {s.notes && <small>Evidence scope: {s.notes}</small>}
              </p>
            ) : null;
          })}
          <h2>Related</h2>
          {g.relatedGuideIds.map((rid) => {
            const x = guides.find((y) => y.id === rid);
            return x ? (
              <Link key={rid} to={`/guides/${rid}`}>
                {x.title}
              </Link>
            ) : null;
          })}
        </aside>
      </div>
    </Page>
  );
}

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
export function Review() {
  const { state, setState } = usePersonalState();
  const [params, setParams] = useSearchParams();
  const [projectId, setProjectId] = useState(
    params.get("project") || state.projects[0]?.id || "",
  );
  const [stage, setStage] = useState<Stage>("discovery");
  const p = state.projects.find((x) => x.id === projectId);
  const items = checklistItems.filter((x) => x.stage === stage);
  function change(id: string, key: string, value: string) {
    if (!p) return;
    setState((s) => ({
      ...s,
      projects: s.projects.map((x) => {
        if (x.id !== p.id) return x;
        const current = x.reviews[id] || {
          status: "not-reviewed",
          evidence: "",
          owner: "",
          assumptions: "",
          rationale: "",
          revisit: "",
          reviewedContentVersion: CONTENT_VERSION,
        };
        return {
          ...x,
          updatedAt: new Date().toISOString(),
          reviews: {
            ...x.reviews,
            [id]: {
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
      {!p ? (
        <Empty
          title="Choose a project"
          body="Reviews are independent so evidence never leaks between projects."
        />
      ) : (
        <>
          <div className="tabs" role="tablist">
            {(
              [
                "discovery",
                "architecture",
                "implementation",
                "pre-release",
                "operations",
              ] as Stage[]
            ).map((s) => (
              <button
                role="tab"
                aria-selected={s === stage}
                onClick={() => setStage(s)}
                key={s}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="review-summary">
            {
              items.filter((i) =>
                ["needs-evidence", "unresolved"].includes(
                  p.reviews[i.id]?.status,
                ),
              ).length
            }{" "}
            unresolved or needing evidence{" "}
            <span>
              {Object.values(p.reviews).some(
                (r) => r.reviewedContentVersion !== CONTENT_VERSION,
              ) && "Some reviews use an older content version."}
            </span>
          </div>
          {items.map((i) => {
            const r = p.reviews[i.id];
            const status = r?.status || "not-reviewed";
            const stale = !!r && r.reviewedContentVersion !== CONTENT_VERSION;
            return (
              <details
                className="review-item"
                key={i.id}
                open={status === "unresolved"}
              >
                <summary>
                  <span>{i.title}</span>
                  <Badge tone={status}>{status.replaceAll("-", " ")}</Badge>
                </summary>
                <p>{i.evidence}</p>
                {stale && (
                  <p className="form-error">
                    Guidance changed since this item was reviewed. Reassess it
                    against content {CONTENT_VERSION}.
                  </p>
                )}
                <p>
                  {i.guideIds.map((id) => (
                    <Link key={id} to={`/guides/${id}`}>
                      Related guide
                    </Link>
                  ))}
                </p>
                <div className="review-fields">
                  <Field label="Status">
                    <select
                      value={status}
                      onChange={(e) =>
                        change(i.id, "status", e.target.value as ReviewStatus)
                      }
                    >
                      {[
                        "not-reviewed",
                        "satisfied",
                        "needs-evidence",
                        "unresolved",
                        "not-applicable",
                      ].map((x) => (
                        <option
                          key={x}
                          value={x}
                          disabled={
                            x === "not-applicable" &&
                            !(r?.rationale || "").trim()
                          }
                        >
                          {x.replaceAll("-", " ")}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Evidence or URL">
                    <textarea
                      value={r?.evidence || ""}
                      onChange={(e) => change(i.id, "evidence", e.target.value)}
                    />
                  </Field>
                  <Field label="Owner">
                    <input
                      value={r?.owner || ""}
                      onChange={(e) => change(i.id, "owner", e.target.value)}
                    />
                  </Field>
                  <Field label="Assumptions">
                    <textarea
                      value={r?.assumptions || ""}
                      onChange={(e) =>
                        change(i.id, "assumptions", e.target.value)
                      }
                    />
                  </Field>
                  <Field
                    label="Why not applicable"
                    hint="Required before selecting not applicable"
                  >
                    <textarea
                      required={status === "not-applicable"}
                      value={r?.rationale || ""}
                      onChange={(e) =>
                        change(i.id, "rationale", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Revisit when">
                    <input
                      value={r?.revisit || ""}
                      onChange={(e) => change(i.id, "revisit", e.target.value)}
                    />
                  </Field>
                  {r && (
                    <button
                      className="quiet"
                      onClick={() =>
                        change(i.id, "reviewedContentVersion", CONTENT_VERSION)
                      }
                    >
                      Mark reassessed against {CONTENT_VERSION}
                    </button>
                  )}
                </div>
              </details>
            );
          })}
        </>
      )}
    </Page>
  );
}

export function Troubleshoot() {
  const { state, setState } = usePersonalState();
  const [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState(params.get("flow") || "");
  const [projectId, setProjectId] = useState(
    params.get("project") || state.projects[0]?.id || "",
  );
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
  return (
    <Page
      title="Troubleshoot from evidence"
      intro="A symptom is not a diagnosis. Narrow causes before retrying or changing production behavior."
    >
      <ProjectSelect
        projectId={projectId}
        onChange={(id) => {
          setProjectId(id);
          setParams((p) => {
            p.set("project", id);
            return p;
          });
        }}
      />
      <div className="flow-list">
        {troubleshootingFlows.map((f) => (
          <button
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
      {flow ? (
        <section className="diagnostic">
          <h2>{flow.title}</h2>
          <h3>Gather evidence</h3>
          <ol>
            {flow.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
          <h3>Plausible causes</h3>
          {flow.causes.map((c) => (
            <details key={c.title}>
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
      ) : (
        <Empty
          title="Choose the closest symptom"
          body="Start broad. The flow will ask for evidence that separates plausible causes."
        />
      )}
    </Page>
  );
}

export function Compare() {
  const initial = comparisonOptions.slice(0, 4);
  const [selected, setSelected] = useState(initial.map((x) => x.id));
  const [weights, setWeights] = useState([
    {
      name: "Operational fit",
      weight: 5,
      mandatory: true,
      scores: {} as Record<string, ScoreValue>,
    },
    {
      name: "Language fit",
      weight: 3,
      mandatory: false,
      scores: {} as Record<string, ScoreValue>,
    },
    {
      name: "Deployment control",
      weight: 4,
      mandatory: false,
      scores: {} as Record<string, ScoreValue>,
    },
  ]);
  const opts = comparisonOptions.filter((x) => selected.includes(x.id));
  return (
    <Page
      title="Compare approaches"
      intro="Treat mandatory requirements as gates. Weighted preferences organize investigation; unverified never means unsupported."
    >
      <Field label="Options to compare">
        <select
          multiple
          value={selected}
          onChange={(e) =>
            setSelected([...e.target.selectedOptions].map((x) => x.value))
          }
        >
          {comparisonOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </Field>
      {opts.length ? (
        <>
          <div
            className="table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Comparison scorecard table"
          >
            <table>
              <thead>
                <tr>
                  <th>Criterion</th>
                  {opts.map((o) => (
                    <th key={o.id}>
                      {o.name}
                      <small>
                        {o.evidenceStatus} ·{" "}
                        {o.verifiedAt
                          ? `verified ${o.verifiedAt}`
                          : "verification date unavailable"}
                      </small>
                      <small>
                        {o.sourceIds.map((id) => (
                          <Link key={id} to="/sources">
                            {sources.find((s) => s.id === id)?.title || id}
                          </Link>
                        ))}
                      </small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Layer</th>
                  {opts.map((o) => (
                    <td key={o.id}>{o.layer}</td>
                  ))}
                </tr>
                <tr>
                  <th>Languages</th>
                  {opts.map((o) => (
                    <td key={o.id}>{o.languages}</td>
                  ))}
                </tr>
                <tr>
                  <th>Deployment</th>
                  {opts.map((o) => (
                    <td key={o.id}>{o.deployment}</td>
                  ))}
                </tr>
                <tr>
                  <th>Limitations</th>
                  {opts.map((o) => (
                    <td key={o.id}>{o.limitations.join("; ")}</td>
                  ))}
                </tr>
                {weights.map((c, ci) => (
                  <tr key={c.name}>
                    <th>
                      <input
                        aria-label={`${c.name} weight`}
                        type="number"
                        min="0"
                        max="10"
                        value={c.weight}
                        onChange={(e) =>
                          setWeights((w) =>
                            w.map((x, i) =>
                              i === ci
                                ? {
                                    ...x,
                                    weight: Math.min(
                                      10,
                                      Math.max(0, Number(e.target.value) || 0),
                                    ),
                                  }
                                : x,
                            ),
                          )
                        }
                      />
                      {c.name}
                      {c.mandatory && <Badge tone="warning">mandatory</Badge>}
                    </th>
                    {opts.map((o) => (
                      <td key={o.id}>
                        <select
                          aria-label={`${c.name} for ${o.name}`}
                          value={c.scores[o.id] ?? "unverified"}
                          onChange={(e) =>
                            setWeights((w) =>
                              w.map((x, i) =>
                                i === ci
                                  ? {
                                      ...x,
                                      scores: {
                                        ...x.scores,
                                        [o.id]:
                                          e.target.value === "unverified"
                                            ? "unverified"
                                            : +e.target.value,
                                      },
                                    }
                                  : x,
                              ),
                            )
                          }
                        >
                          <option value="unverified">
                            {c.mandatory ? "Unknown" : "Unverified"}
                          </option>
                          {(c.mandatory ? [0, 1] : [0, 1, 2, 3, 4, 5]).map(
                            (n) => (
                              <option value={n} key={n}>
                                {c.mandatory ? (n === 0 ? "Fail" : "Pass") : n}
                              </option>
                            ),
                          )}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th>Transparent weighted result</th>
                  {opts.map((o) => {
                    const x = weightedScore(
                      weights.map((c) => ({
                        weight: c.weight,
                        mandatory: c.mandatory,
                        score: c.scores[o.id] ?? "unverified",
                      })),
                    );
                    return (
                      <td key={o.id}>
                        {x.score === null
                          ? "No verified inputs"
                          : x.score.toFixed(2)}
                        {x.mandatoryUnknown && (
                          <strong className="gap">
                            {" "}
                            Mandatory evidence missing
                          </strong>
                        )}
                        {x.mandatoryFailed && (
                          <strong className="gap">
                            Fails a mandatory requirement
                          </strong>
                        )}
                        {!x.mandatoryFailed && !x.mandatoryUnknown && (
                          <strong className="pass">
                            Mandatory requirements pass
                          </strong>
                        )}
                        <small>
                          Preference denominator: {x.verifiedWeight} verified
                          weight points; mandatory gates are excluded.
                        </small>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Empty
          title="Select options"
          body="Choose two or more approaches to compare."
        />
      )}
      <h2>Compare patterns, not only products</h2>
      <div className="guide-index compact">
        {guides
          .filter((g) => g.alternatives.length)
          .map((g) => (
            <Link key={g.id} to={`/guides/${g.id}`}>
              <h3>{g.title}</h3>
              <p>{g.alternatives.length} documented alternatives</p>
            </Link>
          ))}
      </div>
    </Page>
  );
}

export function CostCalculator() {
  const [i, setI] = useState({
    inputTokens: 1000,
    outputTokens: 500,
    attempts: 1000,
    callsPerAttempt: 2,
    inputPerMillion: 1,
    outputPerMillion: 4,
    otherMonthly: 0,
    successRate: 80,
    humanReviewMinutes: 2,
    humanHourlyRate: 60,
  });
  let result: ReturnType<typeof calculateMonthlyCost> | undefined;
  let calculationError = "";
  try {
    result = calculateMonthlyCost(i);
  } catch (error) {
    calculationError = (error as Error).message;
  }
  return (
    <section className="calculator">
      <h2>Explicit-input cost model</h2>
      <p>
        Tokens are per model call. Attempts are business tasks per month; calls
        per attempt includes initial calls and expected retries. Review minutes
        are per attempted task. Unit prices are your currency per million
        tokens. The defaults are hypothetical inputs, not live provider prices.
      </p>
      <div className="calc-grid">
        {Object.entries(i).map(([k, v]) => (
          <Field key={k} label={k.replace(/([A-Z])/g, " $1").toLowerCase()}>
            <input
              type="number"
              min="0"
              value={v}
              max={k === "successRate" ? 100 : undefined}
              onChange={(e) =>
                setI({ ...i, [k]: Math.max(0, Number(e.target.value) || 0) })
              }
            />
          </Field>
        ))}
      </div>
      {calculationError && (
        <p className="form-error" role="alert">
          {calculationError}
        </p>
      )}
      {result && (
        <output>
          Model usage: ${result.usage.toFixed(2)} · Human review: $
          {result.human.toFixed(2)} · Monthly total:{" "}
          <strong>${result.monthly.toFixed(2)}</strong> · Cost per successful
          outcome:{" "}
          <strong>
            {result.costPerSuccess === null
              ? "n/a"
              : `$${result.costPerSuccess.toFixed(2)}`}
          </strong>
          <small>
            {result.totalCalls.toLocaleString()} model calls ·{" "}
            {result.successfulOutcomes.toFixed(1)} estimated verified outcomes
          </small>
        </output>
      )}
    </section>
  );
}
export function Projects() {
  const { state } = usePersonalState();
  return (
    <Page
      title="My projects"
      intro="Each project keeps separate answers, reviews and notes in this browser."
    >
      {state.projects.length ? (
        <div className="project-grid">
          {state.projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`}>
              <h2>{p.name}</h2>
              <p>
                {Object.keys(p.answers).length} discovery answers ·{" "}
                {Object.keys(p.reviews).length} review items
              </p>
              <small>Updated {new Date(p.updatedAt).toLocaleString()}</small>
            </Link>
          ))}
        </div>
      ) : (
        <Empty
          title="No saved projects"
          body="Map a problem and save it when you want to return to the decision path."
          link="Start a problem"
          to="/start"
        />
      )}
      <CostCalculator />
    </Page>
  );
}
export function ProjectDetail() {
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
          <span>{Object.keys(p.reviews).length} items reviewed.</span>
        </Link>
      </div>
      <h2>Recorded answers</h2>
      <dl className="facts">
        {Object.entries(p.answers).map(([k, v]) => (
          <div key={k}>
            <dt>{problemQuestions.find((q) => q.id === k)?.label || k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </Page>
  );
}
export function Bookmarks() {
  const { state } = usePersonalState();
  const found = state.bookmarks
    .map((id) => guides.find((g) => g.id === id))
    .filter(Boolean) as Guide[];
  return (
    <Page title="Bookmarks" intro="Saved reading for this browser.">
      {found.length ? (
        <div className="guide-index">
          {found.map((g) => (
            <Link key={g.id} to={`/guides/${g.id}`}>
              <h2>{g.title}</h2>
              <p>{g.summary}</p>
            </Link>
          ))}
        </div>
      ) : (
        <Empty
          title="No bookmarks yet"
          body="Bookmark a guide to keep it close at hand."
          link="Explore guides"
          to="/explore"
        />
      )}
    </Page>
  );
}
export function Glossary() {
  const [q, setQ] = useState("");
  const found = glossary.filter((x) =>
    (x.term + " " + x.definition).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Page
      title="Glossary"
      intro="Plain-language definitions linked back to practical guidance."
    >
      <input
        className="wide-input"
        aria-label="Filter glossary"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter terms"
      />
      <dl className="glossary">
        {found.map((x) => (
          <div key={x.id}>
            <dt id={x.id}>{x.term}</dt>
            <dd>
              {x.definition}
              <span>
                {x.guideIds.map((id) => (
                  <Link key={id} to={`/guides/${id}`}>
                    Related guide
                  </Link>
                ))}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </Page>
  );
}
export function Sources() {
  return (
    <Page
      title="Sources & what changed"
      intro={`Content release ${CONTENT_VERSION}. Dates show manual review, not automatic freshness.`}
    >
      <div className="source-list">
        {sources.map((s) => (
          <article key={s.id}>
            <Badge tone={s.status === "unverified" ? "warning" : "check"}>
              {s.status}
            </Badge>
            <h2>
              <ExternalLink href={s.url}>{s.title}</ExternalLink>
            </h2>
            <p>
              {s.reviewedAt ? `Reviewed ${s.reviewedAt}` : "Not yet reviewed"}
              {s.version ? ` · Version ${s.version}` : ""}
            </p>
            {s.notes && <p>{s.notes}</p>}
          </article>
        ))}
      </div>
    </Page>
  );
}

export function Settings() {
  const { state, setState, corruptRaw, resolveCorruptStorage } =
    usePersonalState();
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ReturnType<typeof parseImport>>();
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState("");
  const merge = preview ? mergeStatesWithConflicts(state, preview) : undefined;
  function exportData() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            { ...state, exportedAt: new Date().toISOString() },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    a.download = `ai-playbook-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function inspect() {
    try {
      setPreview(parseImport(text));
      setError("");
    } catch (e) {
      setPreview(undefined);
      setError((e as Error).message);
    }
  }
  return (
    <Page
      title="Settings"
      intro="Theme, backup and browser-local data controls."
    >
      <section className="settings-section">
        <h2>Appearance</h2>
        <Field label="Theme">
          <select
            value={state.theme}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                theme: e.target.value as typeof s.theme,
              }))
            }
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </Field>
      </section>
      <section className="settings-section">
        <h2>Export</h2>
        <p>
          Download every project, review, note and bookmark as JSON. Keep
          exports private if notes contain sensitive information.
        </p>
        <button onClick={exportData}>Download export</button>
        {corruptRaw && (
          <button
            className="quiet"
            onClick={() => {
              const a = document.createElement("a");
              a.href = URL.createObjectURL(new Blob([corruptRaw]));
              a.download = "corrupt-playbook-recovery.txt";
              a.click();
            }}
          >
            Download unreadable saved data
          </button>
        )}
      </section>
      <section className="settings-section">
        <h2>Import</h2>
        <p>
          Maximum 2 MB. The file is validated before existing data changes.
          Unknown content IDs and their notes are preserved.
        </p>
        <textarea
          rows={8}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setPreview(undefined);
          }}
          placeholder="Paste exported JSON"
        />
        <button onClick={inspect}>Preview import</button>
        {error && (
          <p className="form-error" role="alert">
            {error} Existing data was not changed.
          </p>
        )}
        {preview && (
          <div className="import-preview">
            <h3>Import preview</h3>
            <p>
              {preview.projects.length} projects · {preview.bookmarks.length}{" "}
              bookmarks · {Object.keys(preview.notes).length} notes
            </p>
            {merge && merge.conflicts.length > 0 && (
              <p className="form-error">
                {merge.conflicts.length} project ID conflict(s). Merge keeps
                local values and adds non-conflicting imported fields. Replace
                discards all current local data.
              </p>
            )}
            <button
              onClick={() => {
                setState(merge!.state);
                resolveCorruptStorage();
                setPreview(undefined);
                setText("");
              }}
            >
              Merge with current data
            </button>
            <button
              className="danger"
              onClick={() => {
                setState(preview);
                resolveCorruptStorage();
                setPreview(undefined);
                setText("");
              }}
            >
              Replace current data
            </button>
          </div>
        )}
      </section>
      <section className="settings-section danger-zone">
        <h2>Reset local data</h2>
        <p>
          This removes projects, reviews, notes and bookmarks from this browser.
          Export first if you may need them.
        </p>
        <Field label={"Type “reset” to confirm"}>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        <button
          className="danger"
          disabled={confirm !== "reset"}
          onClick={() => {
            setState({ ...emptyState, theme: state.theme });
            resolveCorruptStorage();
            setConfirm("");
          }}
        >
          Reset local data
        </button>
      </section>
    </Page>
  );
}
export function NotFound() {
  return (
    <Page title="That page is not in the playbook">
      <Empty
        title="The link may be old"
        body="Your saved work has not been changed."
        link="Return home"
        to="/"
      />
    </Page>
  );
}
