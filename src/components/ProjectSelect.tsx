import { usePersonalState } from "../app/StateContext";

/**
 * Shared project switcher used by any route that scopes its content to one
 * saved project (reviews, troubleshooting). Previously duplicated three
 * times -- the now-deleted legacy `src/features/pages.tsx`, `ReviewPage.tsx`
 * and `TroubleshootPage.tsx` each kept their own copy while `pages.tsx` was
 * still mid-migration (Task 9/10 intentionally deferred consolidating this
 * to whichever task retired `pages.tsx`). Task 12 owns that retirement, so
 * this is now the single shared copy; callers only differ in what a freshly
 * created project should be named, via `newProjectName`.
 */
export function ProjectSelect({
  projectId,
  onChange,
  newProjectName,
}: {
  projectId: string;
  onChange: (id: string) => void;
  newProjectName: string;
}) {
  const { state, newProject } = usePersonalState();
  return (
    <div className="project-select">
      <select
        aria-label="Project"
        value={projectId}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a project</option>
        {state.projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        className="quiet"
        onClick={() => {
          const p = newProject(newProjectName);
          onChange(p.id);
        }}
      >
        New project
      </button>
    </div>
  );
}
