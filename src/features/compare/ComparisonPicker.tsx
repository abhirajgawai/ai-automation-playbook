import type { ComparisonOption } from "../../content/types";

/**
 * A shortlist picker: at most `max` options selected at once, held entirely
 * in the parent's component state. It never pre-scores or ranks anything —
 * checking an option only adds it to the scorecard below.
 */
export function ComparisonPicker({
  options,
  selected,
  onToggle,
  max,
}: {
  options: ComparisonOption[];
  selected: string[];
  onToggle: (id: string) => void;
  max: number;
}) {
  return (
    <fieldset className="comparison-picker" role="group" aria-label="Options to compare">
      <legend>
        Options to compare
        <span className="picker-count">
          {" "}
          ({selected.length} of {max} selected)
        </span>
      </legend>
      <div className="picker-grid">
        {options.map((o) => {
          const checked = selected.includes(o.id);
          const disabled = !checked && selected.length >= max;
          return (
            <label key={o.id} className="picker-option">
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(o.id)}
              />
              <span>
                <strong>{o.name}</strong>
                <span className="picker-layer">{o.layer}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
