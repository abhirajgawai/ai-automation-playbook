import type { TroubleshootingFlow } from "../../content/types";

type CauseEvidence = "unknown" | "supports" | "rules-out";

/**
 * The readable, single-cause focus panel for evidence-driven
 * troubleshooting (Task 10). Shows exactly one cause's evidence, safe
 * mitigation and durable fix at a narrow, readable width -- deliberately
 * not a dense multi-column comparison layout -- and keeps an unconditional,
 * prominent warning visible whenever that cause's evidence status is still
 * "unknown", so the UI never implies it is safe to retry or apply a fix
 * before evidence has confirmed the cause. This is a pure display driven by
 * the same `evidenceAnswer` state `TroubleshootPage` already persists to
 * `project.notes` -- it never reads or writes storage itself.
 */
export function DiagnosticInspector({
  flow,
  cause,
  status,
}: {
  flow: TroubleshootingFlow;
  cause: TroubleshootingFlow["causes"][number];
  status: CauseEvidence;
}) {
  return (
    <section
      className="diagnostic-inspector"
      aria-label={`${cause.title} diagnosis`}
    >
      <span className="diagram-node-kind">{flow.title}</span>
      <h3>{cause.title}</h3>
      <dl>
        <dt>Evidence</dt>
        <dd>{cause.evidence}</dd>
        <dt>Safe mitigation</dt>
        <dd>{cause.mitigation}</dd>
        <dt>Durable fix</dt>
        <dd>{cause.durableFix}</dd>
      </dl>
      {status === "unknown" && (
        <p className="diagnostic-warning" role="alert">
          Evidence has not confirmed this cause yet. Do not retry or apply
          the durable fix as though this is resolved -- gather the evidence
          above first.
        </p>
      )}
      {status === "rules-out" && (
        <p className="diagnostic-note">
          Ruled out by evidence. Do not spend further mitigation effort on
          this cause; look elsewhere.
        </p>
      )}
      {status === "supports" && (
        <p className="diagnostic-confirm">
          Evidence supports this cause. The safe mitigation above may be
          applied; confirm before treating the durable fix as complete.
        </p>
      )}
    </section>
  );
}
