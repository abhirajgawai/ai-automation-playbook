import { Link } from "react-router-dom";
import { Badge, Field } from "../../components/UI";
import type { ChecklistItem } from "../../content/types";
import type { ReviewRecord, ReviewStatus } from "../../lib/models";

const STATUSES: ReviewStatus[] = [
  "not-reviewed",
  "satisfied",
  "needs-evidence",
  "unresolved",
  "not-applicable",
];

const NEEDS_ATTENTION: ReviewStatus[] = [
  "not-reviewed",
  "needs-evidence",
  "unresolved",
];

export type ReviewFieldKey =
  | "status"
  | "evidence"
  | "owner"
  | "assumptions"
  | "rationale"
  | "revisit";

/**
 * One focused review point (Task 9). A single accessible disclosure per
 * checklist item, matching the exact `.review-item`/`summary` DOM shape and
 * field labels the acceptance/redesign suites depend on -- restructured out
 * of the legacy `Review()` page in `src/features/pages.tsx` (now unused,
 * left for Task 12's cleanup) without changing any stored field name.
 */
export function ReviewItem({
  item,
  record,
  contentVersion,
  onChange,
  onReassess,
}: {
  item: ChecklistItem;
  record?: ReviewRecord;
  contentVersion: string;
  onChange: (key: ReviewFieldKey, value: string) => void;
  onReassess: () => void;
}) {
  const status = record?.status || "not-reviewed";
  const stale = !!record && record.reviewedContentVersion !== contentVersion;
  const needsAttention = NEEDS_ATTENTION.includes(status);
  return (
    <details className="review-item" open={status === "unresolved"}>
      <summary>
        <span>{item.title}</span>
        <span className="review-item-tags">
          <Badge tone={status}>{status.replaceAll("-", " ")}</Badge>
          {needsAttention && <Badge tone="warning">needs evidence</Badge>}
          {stale && <Badge tone="warning">reassess</Badge>}
        </span>
      </summary>
      <p>{item.evidence}</p>
      {stale && (
        <div className="review-stale" role="status">
          <p>
            Guidance changed since this item was reviewed. Reassess it
            against content {contentVersion}.
          </p>
          <button type="button" className="quiet" onClick={onReassess}>
            Mark reassessed against {contentVersion}
          </button>
        </div>
      )}
      <p>
        {item.guideIds.map((id) => (
          <Link key={id} to={`/guides/${id}`}>
            Related guide
          </Link>
        ))}
      </p>
      <div className="review-fields">
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => onChange("status", e.target.value)}
          >
            {STATUSES.map((x) => (
              <option
                key={x}
                value={x}
                disabled={
                  x === "not-applicable" && !(record?.rationale || "").trim()
                }
              >
                {x.replaceAll("-", " ")}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Evidence or URL">
          <textarea
            value={record?.evidence || ""}
            onChange={(e) => onChange("evidence", e.target.value)}
          />
        </Field>
        <Field label="Owner">
          <input
            value={record?.owner || ""}
            onChange={(e) => onChange("owner", e.target.value)}
          />
        </Field>
        <Field label="Assumptions">
          <textarea
            value={record?.assumptions || ""}
            onChange={(e) => onChange("assumptions", e.target.value)}
          />
        </Field>
        <Field
          label="Why not applicable"
          hint="Required before selecting not applicable"
        >
          <textarea
            required={status === "not-applicable"}
            value={record?.rationale || ""}
            onChange={(e) => onChange("rationale", e.target.value)}
          />
        </Field>
        <Field label="Revisit when">
          <input
            value={record?.revisit || ""}
            onChange={(e) => onChange("revisit", e.target.value)}
          />
        </Field>
      </div>
    </details>
  );
}
