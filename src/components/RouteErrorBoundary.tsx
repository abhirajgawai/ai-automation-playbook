import { Component, type ReactNode } from "react";

interface RouteErrorBoundaryProps {
  children: ReactNode;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  isStaleChunk: boolean;
}

const STALE_CHUNK_PATTERN =
  /dynamically imported module|importing a module script failed|failed to fetch dynamically imported module|error loading dynamically imported module/i;

/**
 * Catches errors thrown while rendering a lazily-loaded route (most notably
 * a failed `import()` for a route chunk whose built asset hash no longer
 * exists on the server, e.g. because a deploy rotated it out from under an
 * already-open tab). Without this, that failure surfaces as an unhandled
 * error and a blank content area. Recovery is a plain reload: the browser
 * will fetch the current `index.html`, which references the current chunk
 * hashes.
 *
 * Scoped to wrap only the route `<Outlet />` in Layout, so a failure here
 * still leaves the header/nav chrome (and this boundary's own reload
 * prompt) visible rather than blanking the whole page.
 */
export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = { hasError: false, isStaleChunk: false };

  static getDerivedStateFromError(error: unknown): RouteErrorBoundaryState {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, isStaleChunk: STALE_CHUNK_PATTERN.test(message) };
  }

  componentDidCatch(error: unknown) {
    console.error("Route failed to load", error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main id="main" className="route-error" role="alert">
          <h1>
            {this.state.isStaleChunk
              ? "This page was updated"
              : "Something went wrong"}
          </h1>
          <p>
            {this.state.isStaleChunk
              ? "The playbook has been updated since this tab was opened, so this page could not be loaded. Reload to get the current version."
              : "This page could not be loaded. Reloading usually fixes this. Your saved work has not been changed."}
          </p>
          <button type="button" className="button" onClick={this.handleReload}>
            Reload page
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
