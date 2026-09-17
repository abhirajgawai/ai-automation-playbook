import { useState } from "react";
import { Link } from "react-router-dom";
import { sources } from "../../content";
import { weightedScore, type ScoreValue } from "../../lib/calculator";
import type { ComparisonOption } from "../../content/types";

interface Criterion {
  name: string;
  weight: number;
  mandatory: boolean;
  scores: Record<string, ScoreValue>;
}

const initialCriteria: Criterion[] = [
  { name: "Operational fit", weight: 5, mandatory: true, scores: {} },
  { name: "Language fit", weight: 3, mandatory: false, scores: {} },
  { name: "Deployment control", weight: 4, mandatory: false, scores: {} },
];

/**
 * The redesigned scorecard: one readable `<article>` card per shortlisted
 * option (readable and stacked on narrow viewports, a focused grid on wide
 * ones) instead of a horizontally-scrolled mega-table. Criteria weights are
 * shared across cards (they describe the criterion, not the option); each
 * card holds its own per-criterion score so mandatory gates and preference
 * scoring stay attached next to the option they describe.
 */
export function ComparisonMatrix({ options }: { options: ComparisonOption[] }) {
  const [criteria, setCriteria] = useState(initialCriteria);

  const setWeight = (index: number, weight: number) =>
    setCriteria((c) => c.map((x, i) => (i === index ? { ...x, weight } : x)));
  const setScore = (index: number, optionId: string, score: ScoreValue) =>
    setCriteria((c) =>
      c.map((x, i) =>
        i === index ? { ...x, scores: { ...x.scores, [optionId]: score } } : x,
      ),
    );

  return (
    <div className="comparison-matrix">
      <fieldset className="criteria-weights">
        <legend>Weight the criteria (0-10)</legend>
        {criteria.map((c, i) => (
          <label key={c.name} className="criterion-weight">
            <span>
              {c.name}
              {c.mandatory && (
                <span className="criterion-mandatory-tag">Mandatory gate</span>
              )}
            </span>
            <input
              aria-label={`${c.name} weight`}
              type="number"
              min="0"
              max="10"
              value={c.weight}
              onChange={(e) =>
                setWeight(
                  i,
                  Math.min(10, Math.max(0, Number(e.target.value) || 0)),
                )
              }
            />
          </label>
        ))}
      </fieldset>
      <div className="comparison-cards">
        {options.map((o) => {
          const result = weightedScore(
            criteria.map((c) => ({
              weight: c.weight,
              mandatory: c.mandatory,
              score: c.scores[o.id] ?? "unverified",
            })),
          );
          return (
            <article key={o.id} className="comparison-card" aria-label={o.name}>
              <header className="comparison-card-header">
                <h3>{o.name}</h3>
                <p className="comparison-card-layer">{o.layer}</p>
              </header>
              <p className="comparison-card-evidence">
                <span
                  className={`evidence-tag evidence-${o.evidenceStatus}`}
                >
                  {o.evidenceStatus === "reviewed" ? "Reviewed" : "Unverified"}
                </span>{" "}
                {o.verifiedAt
                  ? `Verified ${o.verifiedAt}`
                  : "Verification date unavailable"}
              </p>
              <p className="comparison-card-sources">
                Sources:{" "}
                {o.sourceIds.map((id, i) => (
                  <span key={id}>
                    {i > 0 && ", "}
                    <Link to="/sources">
                      {sources.find((s) => s.id === id)?.title || id}
                    </Link>
                  </span>
                ))}
              </p>
              <dl className="comparison-card-facts">
                <dt>Languages</dt>
                <dd>{o.languages}</dd>
                <dt>Deployment</dt>
                <dd>{o.deployment}</dd>
              </dl>
              <div className="comparison-card-section">
                <h4>Strengths</h4>
                <ul>
                  {o.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="comparison-card-section">
                <h4>Limitations</h4>
                <ul>
                  {o.limitations.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
              <div className="comparison-card-section criteria-scores">
                <h4>Score this option</h4>
                {criteria.map((c, i) => (
                  <label key={c.name} className="criterion-score">
                    <span>{c.name}</span>
                    <select
                      aria-label={`${c.name} for ${o.name}`}
                      value={c.scores[o.id] ?? "unverified"}
                      onChange={(e) =>
                        setScore(
                          i,
                          o.id,
                          e.target.value === "unverified"
                            ? "unverified"
                            : Number(e.target.value),
                        )
                      }
                    >
                      <option value="unverified">
                        {c.mandatory ? "Unknown" : "Unverified"}
                      </option>
                      {(c.mandatory ? [0, 1] : [0, 1, 2, 3, 4, 5]).map((n) => (
                        <option value={n} key={n}>
                          {c.mandatory ? (n === 0 ? "Fail" : "Pass") : n}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <div className="comparison-card-result">
                <h4>Transparent weighted result</h4>
                <p className="weighted-score-value">
                  {result.score === null
                    ? "No verified inputs"
                    : result.score.toFixed(2)}
                </p>
                {result.mandatoryFailed ? (
                  <p className="gate-flag gate-flag-fail">
                    Fails a mandatory requirement
                  </p>
                ) : result.mandatoryUnknown ? (
                  <p className="gate-flag gate-flag-unknown">
                    Mandatory evidence missing — unverified, not disqualifying
                  </p>
                ) : (
                  <p className="gate-flag gate-flag-pass">
                    Mandatory requirements pass
                  </p>
                )}
                <p className="comparison-card-denominator">
                  Preference denominator: {result.verifiedWeight} verified
                  weight points; mandatory gates are excluded.
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
