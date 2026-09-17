import { Suspense, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { MobileNav } from "../components/MobileNav";
import { RouteErrorBoundary } from "../components/RouteErrorBoundary";
import { RouteFallback } from "../components/RouteFallback";
import { usePersonalState } from "./StateContext";

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { storageError } = usePersonalState();
  return (
    <div className="shell">
      <AppHeader
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        menuButtonRef={menuButtonRef}
      />
      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        returnFocusRef={menuButtonRef}
      />
      <div className="content">
        {storageError && (
          <div className="storage-error" role="alert">
            {storageError} Export or copy your work before continuing.
          </div>
        )}
        <RouteErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </RouteErrorBoundary>
      </div>
    </div>
  );
}
