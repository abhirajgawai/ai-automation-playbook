import { NavLink } from "react-router-dom";
import type { RefObject } from "react";
import { navigationGroups } from "../app/navigation";
import { usePersonalState } from "../app/StateContext";
import { SearchCommand } from "./SearchCommand";

const themeOrder = ["system", "light", "dark"] as const;
const themeLabel: Record<(typeof themeOrder)[number], string> = {
  system: "Auto",
  light: "Light",
  dark: "Dark",
};

export function AppHeader({
  menuOpen,
  onToggleMenu,
  menuButtonRef,
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const { state, setState } = usePersonalState();

  const cycleTheme = () => {
    setState((s) => ({
      ...s,
      theme: themeOrder[(themeOrder.indexOf(s.theme) + 1) % themeOrder.length],
    }));
  };

  return (
    <header className="app-header">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <button
        ref={menuButtonRef}
        type="button"
        className="mobile-menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        onClick={onToggleMenu}
      >
        Menu
      </button>
      <NavLink to="/" end className="brand">
        <span className="brand-mark">
          A<span>/</span>A
        </span>
        <span>
          Engineering playbook<small>Evidence before autonomy</small>
        </span>
      </NavLink>
      <div className="desktop-nav-groups">
        {navigationGroups.map((group) => (
          <nav key={group.label} aria-label={group.label}>
            {group.items.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
                {item.label === "My projects" && state.projects.length > 0 ? (
                  <span>{state.projects.length}</span>
                ) : null}
              </NavLink>
            ))}
          </nav>
        ))}
      </div>
      <div className="header-actions">
        <SearchCommand />
        <button
          type="button"
          className="theme-toggle"
          title={`Theme: ${state.theme}. Activate to change.`}
          onClick={cycleTheme}
        >
          {themeLabel[state.theme]}
        </button>
        <span
          className="local-indicator"
          title="Personal data stays in this browser"
        >
          Local only
        </span>
      </div>
    </header>
  );
}
