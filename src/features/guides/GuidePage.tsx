import { Suspense, lazy, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { categories, glossary, guides, sources } from "../../content";
import type { Guide } from "../../content/types";
import { Badge, Empty, ExternalLink, Field, Page } from "../../components/UI";
import { Callout, ReadingMeta } from "../../components/Primitives";
import { usePersonalState } from "../../app/StateContext";
import { GuideNavigation, type GuideNavItem } from "./GuideNavigation";
import { GuideSection } from "./GuideSection";
import type { DiagramDefinition } from "../diagrams/types";
import { durableExecutionDiagram } from "../diagrams/definitions/durableExecution";
import { contextAssemblyDiagram } from "../diagrams/definitions/contextAssembly";
import { agentHarnessDiagram } from "../diagrams/definitions/agentHarness";
import { retrievalPipelineDiagram } from "../diagrams/definitions/retrievalPipeline";
import "./guide.css";

const DiagramFrame = lazy(() =>
  import("../diagrams/DiagramFrame").then((m) => ({ default: m.DiagramFrame })),
);

/**
 * Optional guide-diagram lookup by guide ID: zero or one primary diagram per
 * guide. Task 6 seeded the durable-execution exemplar; Task 7 adds the three
 * remaining high-value system diagrams named in the plan (context assembly,
 * agent harness, retrieval pipeline) — deliberately not one per guide, since
 * most relationships are clearer as structured prose than as a diagram.
 */
const guideDiagrams: Record<string, DiagramDefinition> = {
  "durable-execution": durableExecutionDiagram,
  "context-engineering": contextAssemblyDiagram,
  "harness-engineering": agentHarnessDiagram,
  retrieval: retrievalPipelineDiagram,
};

function estimateReadingMinutes(g: Guide): number {
  const words = [
    g.summary,
    ...g.sections.flatMap((s) => [s.title, ...s.body]),
    ...g.tradeoffs,
    ...g.decisionCriteria,
    ...g.verification,
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}

const NAV_ITEMS: GuideNavItem[] = [
  { id: "orientation", label: "Orientation" },
  { id: "decision-rule", label: "Decision rule" },
  { id: "mechanism", label: "Mental model" },
  { id: "applicability", label: "When it fits" },
  { id: "alternatives", label: "Alternatives & trade-offs" },
  { id: "example", label: "Worked example" },
  { id: "implementation", label: "Implementation guidance" },
  { id: "verification", label: "Verification" },
  { id: "safe-actions", label: "Safe vs. dangerous actions" },
  { id: "sources", label: "Continue reading" },
];

export function GuidePage() {
  const { id } = useParams();
  const location = useLocation();
  const { state, setState } = usePersonalState();
  const g = guides.find((x) => x.id === id);

  useEffect(() => {
    if (!g) return;
    setState((s) => ({
      ...s,
      recentGuideIds: [g.id, ...s.recentGuideIds.filter((x) => x !== g.id)].slice(
        0,
        10,
      ),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g?.id]);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const target = document.getElementById(hash);
    if (!target) return;
    target.scrollIntoView({ block: "start" });
    target.focus();
    // Re-run whenever the guide or the hash changes so deep links keep
    // working across client-side navigation, not only a hard refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g?.id, location.hash]);

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

  const category = categories.find((c) => c.id === g.categoryId);
  const marked = state.bookmarks.includes(g.id);
  const note = state.notes[g.id] || "";
  const readingMinutes = estimateReadingMinutes(g);
  const diagram = guideDiagrams[g.id];
  const relatedGuides = g.relatedGuideIds
    .map((rid) => guides.find((y) => y.id === rid))
    .filter((x): x is Guide => Boolean(x));
  const relatedTerms = glossary.filter((t) => t.guideIds.includes(g.id));

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
      <div className="guide-shell">
        <GuideNavigation items={diagram ? NAV_ITEMS : NAV_ITEMS.filter((n) => n.id !== "mechanism")} />

        <article className="guide-body">
          <GuideSection
            id="orientation"
            title="Orientation"
            eyebrow="Start here"
          >
            <ReadingMeta
              items={[
                { label: "Category", value: category?.title || g.categoryId },
                { label: "Stage", value: g.stages.join(", ") },
                { label: "Reading time", value: `${readingMinutes} min read` },
                { label: "Reviewed", value: g.reviewedAt },
                {
                  label: "Source scope",
                  value: `${g.sourceIds.length} ${g.sourceIds.length === 1 ? "source" : "sources"}`,
                },
              ]}
            />
            <aside className="guide-local-callout">
              This guide combines durable principles and editorial
              recommendations. Version-specific behavior is tied to the
              sources below; worked examples are hypothetical unless
              explicitly stated otherwise.
            </aside>
          </GuideSection>

          <GuideSection id="decision-rule" title="Decision rule">
            <Callout tone="principle" title="When to use this">
              {g.applicability.required}
            </Callout>
          </GuideSection>

          {diagram && (
            <GuideSection
              id="mechanism"
              title="Mental model"
              description={diagram.description}
            >
              <Suspense
                fallback={<div className="graph-loading">Loading diagram…</div>}
              >
                <DiagramFrame
                  definition={diagram}
                  variant="light"
                  mobileMode="canvas"
                />
              </Suspense>
            </GuideSection>
          )}

          <GuideSection id="applicability" title="When it fits">
            <dl className="guide-applicability">
              <dt>Required</dt>
              <dd>{g.applicability.required}</dd>
              <dt>Optional</dt>
              <dd>{g.applicability.optional}</dd>
              <dt>Unnecessary</dt>
              <dd>{g.applicability.unnecessary}</dd>
            </dl>
            {g.prerequisites.length > 0 && (
              <>
                <h3>Prerequisites</h3>
                <ul>
                  {g.prerequisites.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </>
            )}
          </GuideSection>

          {(g.alternatives.length > 0 || g.tradeoffs.length > 0) && (
            <GuideSection id="alternatives" title="Alternatives & trade-offs">
              {g.alternatives.length > 0 && (
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
              )}
              {g.tradeoffs.length > 0 && (
                <ul>
                  {g.tradeoffs.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
            </GuideSection>
          )}

          {g.examples.length > 0 && (
            <GuideSection id="example" title="Hypothetical worked examples">
              {g.examples.map((x) => (
                <details key={x.title}>
                  <summary>{x.title}</summary>
                  <p>{x.body}</p>
                </details>
              ))}
            </GuideSection>
          )}

          <GuideSection id="implementation" title="Implementation guidance">
            {g.sections.map((s) => (
              <section key={s.title} className="guide-subsection">
                <h3>{s.title}</h3>
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            ))}
          </GuideSection>

          <GuideSection id="verification" title="Verification & evidence">
            <h3>Decision criteria</h3>
            <ul>
              {g.decisionCriteria.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h3>Verification checklist</h3>
            <ul className="guide-checks">
              {g.verification.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </GuideSection>

          <GuideSection
            id="safe-actions"
            title="Safe vs. dangerous actions"
            description="Failure modes below stay visible by default: the safe response and the dangerous action that causes them are never hidden behind a collapsed detail."
          >
            {g.failureModes.length > 0 ? (
              <div className="guide-action-pairs">
                {g.failureModes.map((x) => (
                  <div className="guide-action-pair" key={x.symptom}>
                    <Callout tone="warning" title={`Dangerous: ${x.symptom}`}>
                      <p>
                        <strong>Cause:</strong> {x.cause}
                      </p>
                      <p>
                        <strong>Diagnostic:</strong> {x.diagnostic}
                      </p>
                    </Callout>
                    <Callout tone="success" title="Safe response">
                      <p>{x.mitigation}</p>
                    </Callout>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                No documented failure mode for this guide yet. Follow the
                verification checklist above to reduce risk.
              </p>
            )}
            <h3>Ownership and revisit triggers</h3>
            <p>
              <strong>Typical owner:</strong> {g.owner}
            </p>
            <ul>
              {g.reconsiderWhen.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </GuideSection>

          <GuideSection
            id="sources"
            title="Continue reading"
            description="Where this guide's evidence came from, where to go next, the terms it introduced and whether you have already marked it for later."
          >
            <h3>Sources</h3>
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
            <p className="guide-freshness">
              <strong>Guide content version:</strong> {g.contentVersion} ·
              last reviewed {g.reviewedAt}.
            </p>

            {relatedGuides.length > 0 && (
              <>
                <h3>Related guides</h3>
                <ul className="guide-related-list">
                  {relatedGuides.map((x) => (
                    <li key={x.id}>
                      <Link to={`/guides/${x.id}`}>{x.title}</Link>
                      <p>{x.summary}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {relatedTerms.length > 0 && (
              <>
                <h3>Glossary</h3>
                <dl className="guide-glossary-list">
                  {relatedTerms.map((t) => (
                    <div key={t.id}>
                      <dt>{t.term}</dt>
                      <dd>{t.definition}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            <h3>Your bookmark</h3>
            <p className="guide-bookmark-status">
              {marked
                ? "This guide is bookmarked. Manage it, alongside every other saved guide, from "
                : "This guide is not bookmarked yet. Use the bookmark action above, or review every saved guide from "}
              <Link to="/bookmarks">Bookmarks</Link>.
            </p>
          </GuideSection>
        </article>

        <aside className="guide-note-rail">
          <div className="guide-meta">
            <Badge>{g.categoryId}</Badge>
            {g.stages.map((x) => (
              <Badge key={x}>{x}</Badge>
            ))}
          </div>
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
        </aside>
      </div>
    </Page>
  );
}
