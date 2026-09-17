import { CONTENT_VERSION, sources } from "../../content";
import { Badge, ExternalLink, Page } from "../../components/UI";
import "./library.css";

/**
 * Sources & what changed (Task 12). Replaces the legacy `Sources()` page in
 * the now-deleted `src/features/pages.tsx`. Same fields (verification-status
 * badge, review date, version, notes) framed by the same `CONTENT_VERSION`
 * banner, restyled as `.source-card` articles in `library.css` rather than
 * reusing `src/styles.css`'s legacy `.source-list` rule (which becomes dead
 * once this page ships).
 */
export function SourcesPage() {
  return (
    <Page
      title="Sources & what changed"
      intro={`Content release ${CONTENT_VERSION}. Dates show manual review, not automatic freshness.`}
    >
      <div className="source-cards">
        {sources.map((s) => (
          <article className="source-card" key={s.id}>
            <Badge tone={s.status === "unverified" ? "warning" : "check"}>
              {s.status}
            </Badge>
            <h2>
              <ExternalLink href={s.url}>{s.title}</ExternalLink>
            </h2>
            <p className="source-card-meta">
              {s.reviewedAt ? `Reviewed ${s.reviewedAt}` : "Not yet reviewed"}
              {s.version ? ` · Version ${s.version}` : ""}
            </p>
            {s.notes && <p className="source-card-notes">{s.notes}</p>}
          </article>
        ))}
      </div>
    </Page>
  );
}
