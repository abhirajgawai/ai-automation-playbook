import { Link } from "react-router-dom";
import type { Guide } from "../../content/types";
import { Badge } from "../../components/UI";

/**
 * One guide entry on the Learn/Explore landing page. Shows a substantive
 * preview drawn straight from the guide's own content (its summary and its
 * "required" applicability rule) rather than a bare title, so a reader can
 * tell whether the guide is relevant before opening it.
 */
export function GuideIndexItem({ guide }: { guide: Guide }) {
  return (
    <Link to={`/guides/${guide.id}`} className="guide-index-item">
      <span className="guide-index-category">{guide.categoryId}</span>
      <h2>{guide.title}</h2>
      <p className="guide-index-summary">{guide.summary}</p>
      <p className="guide-index-rule">
        <strong>Use it when:</strong> {guide.applicability.required}
      </p>
      <div className="guide-index-stages">
        {guide.stages.map((s) => (
          <Badge key={s}>{s}</Badge>
        ))}
      </div>
    </Link>
  );
}
