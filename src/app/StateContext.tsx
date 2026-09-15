import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { emptyState, loadState, saveState } from "../lib/persistence";
import type { PersonalState, Project } from "../lib/models";
type C = {
  state: PersonalState;
  setState: React.Dispatch<React.SetStateAction<PersonalState>>;
  storageError?: string;
  corruptRaw?: string;
  resolveCorruptStorage: () => void;
  newProject: (name: string) => Project;
};
const Context = createContext<C | null>(null);
export function StateProvider({ children }: { children: ReactNode }) {
  const loaded = useMemo(() => {
    try {
      return loadState(localStorage);
    } catch (e) {
      return {
        state: emptyState,
        error: `Browser storage is unavailable: ${(e as Error).message}`,
      };
    }
  }, []);
  const [state, setState] = useState(loaded.state);
  const [writeError, setWriteError] = useState<string>();
  const [blocked, setBlocked] = useState(!!loaded.raw);
  useEffect(() => {
    if (blocked) return;
    try {
      saveState(localStorage, state);
      setWriteError(undefined);
    } catch (e) {
      setWriteError(`Changes could not be saved: ${(e as Error).message}`);
    }
  }, [state, blocked]);
  useEffect(() => {
    const chosen =
      state.theme === "system"
        ? matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : state.theme;
    document.documentElement.dataset.theme = chosen;
  }, [state.theme]);
  const newProject = (name: string) => {
    const now = new Date().toISOString();
    const p: Project = {
      id: crypto.randomUUID(),
      name: name.trim() || "Untitled project",
      createdAt: now,
      updatedAt: now,
      answers: {},
      reviews: {},
      notes: {},
    };
    setState((s) => ({ ...s, projects: [p, ...s.projects] }));
    return p;
  };
  return (
    <Context.Provider
      value={{
        state,
        setState,
        storageError: writeError || (blocked ? loaded.error : undefined),
        corruptRaw: loaded.raw,
        resolveCorruptStorage: () => setBlocked(false),
        newProject,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const usePersonalState = () => {
  const x = useContext(Context);
  if (!x) throw new Error("Missing StateProvider");
  return x;
};
