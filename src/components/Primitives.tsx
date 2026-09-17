import type { ButtonHTMLAttributes, ReactNode } from "react";

export type CalloutTone =
  "principle" | "evidence" | "warning" | "example" | "success";

const calloutLabels: Record<CalloutTone, string> = {
  principle: "Principle",
  evidence: "Evidence",
  warning: "Warning",
  example: "Example",
  success: "Verified",
};

export function PageIntro({
  title,
  intro,
  actions,
  className = "",
}: {
  title: string;
  intro?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`page-intro ${className}`.trim()}>
      <div>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
      {actions}
    </header>
  );
}

export function SectionHeading({
  title,
  children,
  level = 2,
  id,
}: {
  title: string;
  children?: ReactNode;
  level?: 2 | 3 | 4;
  id?: string;
}) {
  const heading =
    level === 2 ? (
      <h2 id={id}>{title}</h2>
    ) : level === 3 ? (
      <h3 id={id}>{title}</h3>
    ) : (
      <h4 id={id}>{title}</h4>
    );

  return (
    <header className="section-heading">
      {heading}
      {children && <p>{children}</p>}
    </header>
  );
}

export function Callout({
  tone,
  title,
  children,
}: {
  tone: CalloutTone;
  title: string;
  children: ReactNode;
}) {
  const label = calloutLabels[tone];

  return (
    <aside
      className={`callout callout-${tone}`}
      aria-label={`${label}: ${title}`}
    >
      <span className="callout-label">{label}</span>
      <h2 className="callout-title">{title}</h2>
      <div className="callout-body">{children}</div>
    </aside>
  );
}

export function StatusPill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "success" | "warning";
  className?: string;
}) {
  return (
    <span className={`status-pill status-pill-${tone} ${className}`.trim()}>
      {children}
    </span>
  );
}

export function IconButton({
  label,
  children,
  className = "",
  type = "button",
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children"> & {
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      {...props}
      aria-label={label}
      className={`icon-button ${className}`.trim()}
      type={type}
    >
      {children}
    </button>
  );
}

export function ReadingMeta({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <dl className="reading-meta">
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EmptyState({
  title,
  children,
  action,
  level = 2,
  className = "",
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  level?: 2 | 3;
  className?: string;
}) {
  const heading = level === 2 ? <h2>{title}</h2> : <h3>{title}</h3>;

  return (
    <section className={`empty-state ${className}`.trim()}>
      {heading}
      <p>{children}</p>
      {action}
    </section>
  );
}
