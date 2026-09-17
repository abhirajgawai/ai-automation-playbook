import { useState } from "react";
import { Link } from "react-router-dom";
import { glossary, guides } from "../../content";
import { Empty, Page } from "../../components/UI";
import "./library.css";

/**
 * Glossary (Task 12). Replaces the legacy `Glossary()` page in the
 * now-deleted `src/features/pages.tsx` with the same live term+definition
 * substring filter, but each entry now links to the related guides by
 * title (not a generic "Related guide" label) so the reading path back
 * into a guide is explicit, matching the "clear continue reading
 * affordance" language Task 12 was asked to apply consistently.
 *
 * Deliberately does NOT reuse the `dl > div` wrapper plus a
 * `grid-template-columns` rule applied directly to the `dl` -- that is the
 * exact overflow bug class Task 11 found and fixed in `compare.css` (and
 * the same shape as the pre-existing `.glossary > div { grid-template-
 * columns: 220px 1fr }` rule in `src/styles.css`, which becomes dead once
 * this page ships). `library.css`'s `.glossary-list` instead stacks each
 * entry in a single-column gap grid, so there is no two-column sizing
 * mismatch between the grid container and its wrapped children to overflow
 * on a narrow viewport.
 */
export function GlossaryPage() {
  const [q, setQ] = useState("");
  const found = glossary.filter((x) =>
    (x.term + " " + x.definition).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Page
      title="Glossary"
      intro="Plain-language definitions linked back to practical guidance."
    >
      <label className="field glossary-search">
        <span>Filter terms</span>
        <input
          aria-label="Filter glossary"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a term or definition"
        />
      </label>
      {found.length ? (
        <dl className="glossary-list">
          {found.map((x) => (
            <div className="glossary-entry" key={x.id}>
              <dt id={x.id}>{x.term}</dt>
              <dd>
                <p>{x.definition}</p>
                {x.guideIds.length > 0 && (
                  <p className="glossary-related">
                    {x.guideIds.map((id) => (
                      <Link key={id} to={`/guides/${id}`}>
                        {guides.find((g) => g.id === id)?.title ||
                          "Related guide"}
                      </Link>
                    ))}
                  </p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <Empty
          title="No terms match"
          body="Try a shorter or more general word."
        />
      )}
    </Page>
  );
}
