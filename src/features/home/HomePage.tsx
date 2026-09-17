import { Suspense, lazy, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categories, guides } from "../../content";
import { usePersonalState } from "../../app/StateContext";
import { homeDecisionDiagram } from "./homeDecision";
import "./home.css";

const DiagramFrame = lazy(() =>
  import("../diagrams/DiagramFrame").then((m) => ({ default: m.DiagramFrame })),
);

function HeroSearch() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form
      className="home-search"
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
        <button type="submit">Search playbook</button>
      </div>
    </form>
  );
}

/** A small, real hero graphic carrying the accessible decision-map name. */
function HeroDecisionGlyph() {
  return (
    <svg
      className="home-hero-glyph"
      viewBox="0 0 200 120"
      role="img"
      aria-label="Illustrated decision map moving from outcome to rules, risk and evidence"
      focusable="false"
    >
      <line x1="20" y1="60" x2="80" y2="24" className="home-hero-glyph-edge" />
      <line x1="20" y1="60" x2="80" y2="96" className="home-hero-glyph-edge" />
      <line x1="80" y1="24" x2="150" y2="24" className="home-hero-glyph-edge" />
      <line x1="80" y1="96" x2="150" y2="96" className="home-hero-glyph-edge" />
      <rect x="4" y="46" width="32" height="28" rx="6" className="home-hero-glyph-node home-hero-glyph-node-outcome" />
      <rect x="64" y="10" width="32" height="28" rx="6" className="home-hero-glyph-node" />
      <rect x="64" y="82" width="32" height="28" rx="6" className="home-hero-glyph-node home-hero-glyph-node-risk" />
      <rect x="150" y="10" width="32" height="28" rx="6" className="home-hero-glyph-node home-hero-glyph-node-verified" />
      <rect x="150" y="82" width="32" height="28" rx="6" className="home-hero-glyph-node" />
    </svg>
  );
}

export function HomePage() {
  const { state } = usePersonalState();

  const recentGuides = useMemo(
    () =>
      [...new Set([...state.bookmarks, ...state.recentGuideIds])]
        .map((id) => guides.find((g) => g.id === id))
        .filter((g): g is (typeof guides)[number] => !!g)
        .slice(0, 4),
    [state.bookmarks, state.recentGuideIds],
  );

  const recentProjects = state.projects.slice(0, 3);

  const projectsNeedingEvidence = state.projects
    .map((p) => ({
      project: p,
      count: Object.values(p.reviews).filter(
        (r) => r.status === "unresolved" || r.status === "needs-evidence",
      ).length,
    }))
    .filter((entry) => entry.count > 0);

  const hasContinuation =
    recentProjects.length > 0 || recentGuides.length > 0;
  const hasEvidenceGaps = projectsNeedingEvidence.length > 0;

  return (
    <main id="main" className="page home">
      <header className="home-hero">
        <div className="home-hero-copy">
          <h1>Build systems you can explain.</h1>
          <p className="home-promise">
            Navigate uncertain AI and automation decisions with explicit
            evidence, bounded actions and a paper trail your team can audit.
          </p>
          <div className="home-primary-actions">
            <Link className="button" to="/start">
              Map a new problem
            </Link>
            <Link className="home-secondary-action" to="/explore">
              Explore guidance
            </Link>
            <Link className="home-secondary-action" to="/compare">
              Compare approaches
            </Link>
            <Link className="home-secondary-action" to="/troubleshoot">
              Troubleshoot a symptom
            </Link>
          </div>
          <HeroSearch />
        </div>
        <HeroDecisionGlyph />
      </header>

      <section className="home-decision" aria-labelledby="home-decision-heading">
        <div className="home-decision-copy">
          <h2 id="home-decision-heading">See the decision before you commit</h2>
          <p>
            Every guide, review and troubleshooting flow in this playbook
            reasons from the same path: name the outcome, test whether stable
            rules are enough, map what an error costs, then bound the action
            and gather evidence.
          </p>
        </div>
        <Suspense
          fallback={<div className="graph-loading">Loading decision map…</div>}
        >
          <DiagramFrame
            definition={homeDecisionDiagram}
            initialSelection="discover"
            variant="light"
            mobileMode="canvas"
          />
        </Suspense>
      </section>

      <section className="home-stages" aria-labelledby="home-stages-heading">
        <h2 id="home-stages-heading">From first question to running system</h2>
        <ol className="home-stage-path">
          <li className="home-stage home-stage-discover">
            <h3>Discover</h3>
            <p>
              Start from an engineering concern, not a tool. Thirteen
              categories cover suitability, architecture, workflow, security
              and cost — browse the ones that match your problem.
            </p>
            <ul className="home-stage-chips">
              {categories.slice(0, 4).map((c) => (
                <li key={c.id}>{c.title.split(",")[0]}</li>
              ))}
            </ul>
            <Link to="/explore">Browse guidance by concern</Link>
          </li>
          <li className="home-stage home-stage-design">
            <h3>Design</h3>
            <p>
              Turn a fuzzy idea into an explicit trade-off. Answer a short set
              of questions to get a recommendation with reasoning, then check
              it against alternatives.
            </p>
            <Link to="/start">Start a design decision</Link>
            <Link to="/compare">See comparison criteria</Link>
          </li>
          <li className="home-stage home-stage-verify">
            <h3>Verify</h3>
            <p>
              Before shipping, record the evidence, owner, assumptions and
              revisit trigger for every requirement — so “it works on my
              machine” never has to be the answer.
            </p>
            <Link to="/review">Open a design review</Link>
          </li>
          <li className="home-stage home-stage-operate">
            <h3>Operate</h3>
            <p>
              In production, start from the symptom. Work through plausible
              causes with diagnostics before reaching for a rewrite, and keep
              your projects and notes in one place.
            </p>
            <Link to="/troubleshoot">Diagnose a symptom</Link>
            <Link to="/projects">View my projects</Link>
          </li>
        </ol>
      </section>

      {hasContinuation && (
        <section className="home-continue" aria-labelledby="home-continue-heading">
          <h2 id="home-continue-heading">Continue where you left off</h2>
          <div className="home-ruled-list">
            {recentProjects.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`}>
                <strong>{p.name}</strong>
                <span>
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
            {recentGuides.map((guide) => (
              <Link key={guide.id} to={`/guides/${guide.id}`}>
                <strong>{guide.title}</strong>
                <span>
                  {state.bookmarks.includes(guide.id)
                    ? "Bookmarked"
                    : "Recently read"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {hasEvidenceGaps && (
        <section className="home-evidence" aria-labelledby="home-evidence-heading">
          <h2 id="home-evidence-heading">Evidence still needed</h2>
          <div className="home-ruled-list">
            {projectsNeedingEvidence.map(({ project, count }) => (
              <Link key={project.id} to={`/review?project=${project.id}`}>
                <strong>{project.name}</strong>
                <span>{count} unresolved or needing evidence</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <aside className="home-local-callout">
        <span className="local-indicator">Local only</span>
        <p>
          <strong>Your work stays in this browser.</strong> Projects, reviews,
          notes and bookmarks are stored only in this browser and origin —
          nothing is sent to a server. Export them from Settings before
          clearing site data or changing domains.
        </p>
      </aside>
    </main>
  );
}
