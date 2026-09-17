import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Field, Page } from "../../components/UI";
import { usePersonalState } from "../../app/StateContext";
import { discoverySteps, evaluateAnswers } from "../../lib/decisions";
import { QuestionStep } from "./QuestionStep";
import { DecisionResults } from "./DecisionResults";
import "./discovery.css";

/**
 * Guided problem discovery (Task 8). Replaces the old single-form
 * `StartProblem` page (`src/features/pages.tsx`, now unused/dead pending
 * Task 12's cleanup) with a progressive stepper, an always-visible summary,
 * a synchronized read-only decision graph and an evidence-gap list.
 *
 * Routes are unchanged: `/start` creates a new project or explores without
 * saving, `/start?project=<id>` edits an existing project's answers. The
 * stored answer keys are exactly `problemQuestions`' ids -- the five named
 * steps are a UI grouping only.
 */
export function StartProblemPage() {
  const { newProject, setState, state } = usePersonalState();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const existing = state.projects.find((p) => p.id === params.get("project"));
  const [name, setName] = useState(existing?.name || "");
  const [answers, setAnswers] = useState<Record<string, string>>(
    existing?.answers || {},
  );
  const [saved, setSaved] = useState<string | undefined>(existing?.id);
  const [activeStepId, setActiveStepId] = useState<string>(discoverySteps[0].id);

  const results = evaluateAnswers(answers);

  function updateAnswer(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  function save() {
    if (saved) {
      setState((s) => ({
        ...s,
        projects: s.projects.map((p) =>
          p.id === saved
            ? { ...p, name: name || p.name, answers, updatedAt: new Date().toISOString() }
            : p,
        ),
      }));
      nav(`/projects/${saved}`);
    } else {
      const p = newProject(name);
      setState((s) => ({
        ...s,
        projects: s.projects.map((x) => (x.id === p.id ? { ...x, answers } : x)),
      }));
      setSaved(p.id);
      nav(`/projects/${p.id}`);
    }
  }

  return (
    <Page
      title="Start a problem"
      intro="Use short, explainable rules to expose decisions and missing evidence. Answers never select a universally best architecture."
    >
      <div className="discovery-save">
        <Field label="Project name" hint="Optional until you save">
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <button type="button" onClick={save}>
          {saved ? "Save changes" : "Save as project"}
        </button>
      </div>
      <div className="discovery-layout">
        <QuestionStep
          activeStepId={activeStepId}
          onSelectStep={setActiveStepId}
          answers={answers}
          onAnswerChange={updateAnswer}
        />
        <DecisionResults answers={answers} results={results} />
      </div>
    </Page>
  );
}
