import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { NavLink } from "react-router-dom";
import { navigationGroups } from "../app/navigation";
import { usePersonalState } from "../app/StateContext";

export function MobileNav({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const { state } = usePersonalState();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        returnFocusRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, returnFocusRef]);

  return (
    <div
      id="mobile-nav"
      className="mobile-nav"
      hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
    >
      <button
        ref={closeButtonRef}
        type="button"
        className="mobile-nav-close"
        onClick={() => {
          onClose();
          returnFocusRef.current?.focus();
        }}
      >
        Close menu
      </button>
      {navigationGroups.map((group) => (
        <nav key={group.label} aria-label={group.label}>
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
            >
              {item.label}
              {item.label === "My projects" && state.projects.length > 0 ? (
                <span>{state.projects.length}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      ))}
      <p className="mobile-nav-note">
        A decision workspace, not an architecture oracle.
      </p>
    </div>
  );
}
