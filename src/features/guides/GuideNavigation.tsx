export interface GuideNavItem {
  id: string;
  label: string;
}

/**
 * In-page section navigation for a guide. The same list of anchors renders
 * twice: a sticky desktop rail (`.guide-nav-desktop`) and a mobile
 * disclosure (`.guide-nav-mobile`, a `<details>` so it needs no JavaScript
 * state); `guide.css` shows exactly one of the two per viewport width so
 * there is always exactly one way to reach a section, never a duplicate
 * announced to assistive tech at the same time.
 */
export function GuideNavigation({ items }: { items: GuideNavItem[] }) {
  return (
    <>
      <nav
        aria-label="Guide sections"
        className="guide-nav guide-nav-desktop"
      >
        <p className="guide-nav-heading">On this page</p>
        <ol>
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ol>
      </nav>
      <details className="guide-nav guide-nav-mobile">
        <summary>Jump to section</summary>
        <ol>
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ol>
      </details>
    </>
  );
}
