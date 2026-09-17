import type { ReactNode } from "react";

/**
 * One anchor-addressable stop in a guide's learning sequence. Renders as a
 * plain `<section>` with a stable `id` so `GuideNavigation`, deep links
 * (`/guides/:id#section`) and browser back/forward can all target it, and a
 * `tabIndex={-1}` so `GuidePage` can move focus to it after a hash
 * navigation without making it a permanent tab stop.
 */
export function GuideSection({
  id,
  title,
  eyebrow,
  description,
  children,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="guide-section"
      tabIndex={-1}
      aria-labelledby={`${id}-heading`}
    >
      {eyebrow && <p className="guide-section-eyebrow">{eyebrow}</p>}
      <h2 id={`${id}-heading`}>{title}</h2>
      {description && <p className="guide-section-description">{description}</p>}
      <div className="guide-section-body">{children}</div>
    </section>
  );
}
