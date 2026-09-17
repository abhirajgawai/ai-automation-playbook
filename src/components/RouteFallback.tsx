/**
 * Suspense fallback shown while a lazy-loaded route module is fetched.
 * Rendered inside Layout's `<div className="content">`, so it keeps the
 * header/nav mounted and only replaces the page content itself.
 *
 * Keeps the `#main` landmark present for the entire lazy-load window so the
 * header's `Skip to content` link always has a target, and the loading
 * text/spinner are announced through a polite live region rather than
 * appearing (or disappearing) silently.
 */
export function RouteFallback() {
  return (
    <main id="main" className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback__spinner" aria-hidden="true" />
      <p>Loading page…</p>
    </main>
  );
}
