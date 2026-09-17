import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import MiniSearch from "minisearch";
import { categories, guides } from "../../content";
import type { Guide, Stage } from "../../content/types";
import { Empty, Page } from "../../components/UI";
import { GuideIndexItem } from "./GuideIndexItem";
import "./explore.css";

const STAGES: Stage[] = [
  "discovery",
  "architecture",
  "implementation",
  "pre-release",
  "operations",
];

const stageLabels: Record<Stage, string> = {
  discovery: "Discovery",
  architecture: "Architecture",
  implementation: "Implementation",
  "pre-release": "Pre-release",
  operations: "Operations",
};

/** Builds the same MiniSearch document shape the Task 3 search command and
 * legacy explore page used, so `?q=` behavior is unchanged for existing
 * deep links and tests. */
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

/**
 * The Learn/Explore landing page: a single search box plus independent
 * topic (category) and stage filters, grouped by category so every one of
 * the 15 guides stays reachable and browsable, not only searchable. Each
 * entry shows a substantive preview (`GuideIndexItem`) rather than a bare
 * title list.
 */
export function ExplorePage() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") || "";
  const cat = sp.get("category") || "";
  const stage = sp.get("stage") || "";

  const searched = useGuideSearch(q);
  const found = searched.filter(
    (g) =>
      (!cat || g.categoryId === cat) &&
      (!stage || g.stages.includes(stage as Stage)),
  );

  const grouped = categories
    .map((c) => ({
      category: c,
      guides: found.filter((g) => g.categoryId === c.id),
    }))
    .filter((group) => group.guides.length > 0);

  return (
    <Page
      title="Learn the playbook"
      intro="Durable engineering principles, practical checks and clearly dated technology evidence. Filter by topic or delivery stage, or search by question or symptom."
    >
      <form
        className="explore-filters"
        role="search"
        aria-label="Filter guides"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="field">
          <span>Search</span>
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
        </label>
        <label className="field">
          <span>Topic</span>
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
            <option value="">All topics</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Stage</span>
          <select
            aria-label="Filter by stage"
            value={stage}
            onChange={(e) =>
              setSp((p) => {
                e.target.value
                  ? p.set("stage", e.target.value)
                  : p.delete("stage");
                return p;
              })
            }
          >
            <option value="">All stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {stageLabels[s]}
              </option>
            ))}
          </select>
        </label>
      </form>

      {found.length ? (
        <div className="explore-groups">
          {grouped.map(({ category, guides: groupGuides }) => (
            <section key={category.id} className="explore-group">
              <header className="explore-group-header">
                <h2>{category.title}</h2>
                <p>{category.description}</p>
              </header>
              <div className="guide-index">
                {groupGuides.map((g) => (
                  <GuideIndexItem key={g.id} guide={g} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <Empty
          title="No guidance found"
          body="Try a broader term such as tools, memory, reliability or evaluation, or clear a filter."
          link="Browse every guide"
          to="/explore"
        />
      )}
    </Page>
  );
}
