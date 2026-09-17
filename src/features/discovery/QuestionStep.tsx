import { Field } from "../../components/UI";
import { discoverySteps, problemQuestions } from "../../lib/decisions";

const questionsById = new Map(problemQuestions.map((q) => [q.id, q]));

function answeredCount(stepQuestionIds: string[], answers: Record<string, string>) {
  return stepQuestionIds.filter((id) => {
    const q = questionsById.get(id);
    if (!q) return false;
    if (q.kind === "text") return !!answers[id]?.trim();
    return !!answers[id] && answers[id] !== "unknown";
  }).length;
}

/**
 * The progressive question stepper (Task 8). Five named steps
 * (outcome/process/consequence/authority/operations) group the existing
 * flat `problemQuestions` list purely for presentation -- every field keeps
 * its original id and accessible label so answers, storage and existing
 * browser tests (which interact with fields like "Can fixed rules solve
 * it?" and "What may the system do?" directly, without any extra
 * navigation) keep working unchanged. Every step's questions stay reachable
 * on the same page at once: the step nav is a visible jump/progress list,
 * not a mechanism that hides other steps' fields, and a persistent summary
 * of every answer stays visible regardless of which step is current.
 */
export function QuestionStep({
  activeStepId,
  onSelectStep,
  answers,
  onAnswerChange,
}: {
  activeStepId: string;
  onSelectStep: (id: string) => void;
  answers: Record<string, string>;
  onAnswerChange: (id: string, value: string) => void;
}) {
  return (
    <div className="discovery-questions">
      <nav aria-label="Discovery steps" className="discovery-steps">
        {discoverySteps.map((step, index) => {
          const total = step.questionIds.length;
          const answered = answeredCount(step.questionIds, answers);
          const current = step.id === activeStepId;
          return (
            <a
              key={step.id}
              href={`#discovery-step-${step.id}`}
              aria-current={current ? "step" : undefined}
              className={`discovery-step${current ? " is-active" : ""}${answered === total ? " is-complete" : ""}`}
              onClick={() => onSelectStep(step.id)}
            >
              <span className="discovery-step-index">{index + 1}</span>
              <span className="discovery-step-label">
                {step.title}
                <small>
                  {answered}/{total} answered
                </small>
              </span>
            </a>
          );
        })}
      </nav>

      {discoverySteps.map((step) => (
        <section
          key={step.id}
          id={`discovery-step-${step.id}`}
          className="discovery-panel"
          aria-labelledby={`discovery-heading-${step.id}`}
        >
          <h2 id={`discovery-heading-${step.id}`}>{step.title}</h2>
          <p className="quiet">{step.description}</p>
          {step.questionIds.map((id) => {
            const q = questionsById.get(id);
            if (!q) return null;
            return (
              <Field key={q.id} label={q.label}>
                {q.kind === "text" ? (
                  <textarea
                    value={answers[q.id] || ""}
                    onChange={(e) => onAnswerChange(q.id, e.target.value)}
                  />
                ) : (
                  <select
                    value={answers[q.id] || "unknown"}
                    onChange={(e) => onAnswerChange(q.id, e.target.value)}
                  >
                    {(q.options || ["unknown"]).map((o) => (
                      <option key={o} value={o}>
                        {o.replace("-", " ")}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            );
          })}
        </section>
      ))}

      <aside className="discovery-summary" aria-label="Answered so far">
        <h2>Answered so far</h2>
        {discoverySteps.map((step) => (
          <div key={step.id} className="discovery-summary-step">
            <h3>{step.title}</h3>
            <dl>
              {step.questionIds.map((id) => {
                const q = questionsById.get(id);
                if (!q) return null;
                const value = answers[id];
                const isKnown =
                  q.kind === "text" ? !!value?.trim() : !!value && value !== "unknown";
                return (
                  <div key={id} className="discovery-summary-item">
                    <dt>{q.label}</dt>
                    <dd>{isKnown ? value : "Not yet answered"}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </aside>
    </div>
  );
}
