import type { ReactNode } from "react";
import { Link } from "react-router-dom";
export const Page = ({
  title,
  intro,
  actions,
  children,
}: {
  title: string;
  intro?: string;
  actions?: ReactNode;
  children: ReactNode;
}) => (
  <main id="main" className="page">
    <header className="page-head">
      <div>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
      {actions}
    </header>
    {children}
  </main>
);
export const Empty = ({
  title,
  body,
  link,
  to,
}: {
  title: string;
  body: string;
  link?: string;
  to?: string;
}) => (
  <div className="empty">
    <h2>{title}</h2>
    <p>{body}</p>
    {link && to && (
      <Link className="button" to={to}>
        {link}
      </Link>
    )}
  </div>
);
export const Badge = ({
  children,
  tone = "plain",
}: {
  children: ReactNode;
  tone?: string;
}) => <span className={`badge ${tone}`}>{children}</span>;
export const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) => (
  <label className="field">
    <span>{label}</span>
    {children}
    {hint && <small>{hint}</small>}
  </label>
);
export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
