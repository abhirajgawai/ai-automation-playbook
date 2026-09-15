import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { usePersonalState } from "./StateContext";
const links = [
  ["/", "Home"],
  ["/start", "Start a problem"],
  ["/explore", "Explore"],
  ["/review", "Review a design"],
  ["/troubleshoot", "Troubleshoot"],
  ["/compare", "Compare"],
  ["/projects", "My projects"],
  ["/bookmarks", "Bookmarks"],
  ["/glossary", "Glossary"],
  ["/sources", "Sources & changes"],
  ["/settings", "Settings"],
];
export function Layout() {
  const [open, setOpen] = useState(false);
  const { state, storageError } = usePersonalState();
  return (
    <div className="shell">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <button
          className="menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        <NavLink to="/" className="brand">
          <span className="brand-mark">
            A<span>/</span>A
          </span>
          <span>
            Engineering playbook<small>Evidence before autonomy</small>
          </span>
        </NavLink>
        <span
          className="local-indicator"
          title="Personal data stays in this browser"
        >
          Local only
        </span>
      </header>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <nav aria-label="Main navigation">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              to={to}
            >
              {label}
              {label === "My projects" && state.projects.length > 0 ? (
                <span>{state.projects.length}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <p className="sidebar-note">
          A decision workspace, not an architecture oracle.
        </p>
      </aside>
      <div className="content">
        {storageError && (
          <div className="storage-error" role="alert">
            {storageError} Export or copy your work before continuing.
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}
