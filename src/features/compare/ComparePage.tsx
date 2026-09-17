import { useState } from "react";
import { Link } from "react-router-dom";
import { comparisonOptions, guides } from "../../content";
import { Empty, Page } from "../../components/UI";
import { ComparisonPicker } from "./ComparisonPicker";
import { ComparisonMatrix } from "./ComparisonMatrix";
import { CostModel } from "./CostModel";
import "./compare.css";

const MAX_SHORTLIST = 3;

/**
 * Two separate editorial sections, per the plan: a comparison scorecard
 * (shortlist + card-based matrix) and, below it, a fully independent cost
 * model. Neither section fabricates a ranking or a hidden default price;
 * both stay transparent about mandatory gates and unit semantics.
 */
export function ComparePage() {
  const [selected, setSelected] = useState<string[]>(
    comparisonOptions.slice(0, 2).map((o) => o.id),
  );

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX_SHORTLIST
          ? prev
          : [...prev, id],
    );

  const shortlisted = comparisonOptions.filter((o) => selected.includes(o.id));

  return (
    <Page
      title="Compare approaches"
      intro="Treat mandatory requirements as gates. Weighted preferences organize investigation; unverified never means unsupported."
    >
      <section
        className="compare-picker-section"
        aria-labelledby="compare-picker-heading"
      >
        <h2 id="compare-picker-heading">Shortlist up to three options</h2>
        <ComparisonPicker
          options={comparisonOptions}
          selected={selected}
          onToggle={toggle}
          max={MAX_SHORTLIST}
        />
      </section>

      <section
        className="compare-matrix-section"
        aria-labelledby="compare-matrix-heading"
      >
        <h2 id="compare-matrix-heading">Scorecard</h2>
        {shortlisted.length ? (
          <ComparisonMatrix options={shortlisted} />
        ) : (
          <Empty
            title="Select options"
            body="Choose at least one approach from the shortlist above."
          />
        )}
      </section>

      <section
        className="compare-patterns-section"
        aria-labelledby="compare-patterns-heading"
      >
        <h2 id="compare-patterns-heading">Compare patterns, not only products</h2>
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
      </section>

      <CostModel />
    </Page>
  );
}
