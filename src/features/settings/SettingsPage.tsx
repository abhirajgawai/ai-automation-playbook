import { useState } from "react";
import { Field, Page } from "../../components/UI";
import { usePersonalState } from "../../app/StateContext";
import {
  emptyState,
  mergeStatesWithConflicts,
  parseImport,
} from "../../lib/persistence";
import "./settings.css";

/**
 * Settings (Task 12). Replaces the legacy `Settings()` page in the
 * now-deleted `src/features/pages.tsx`. Every persistence behavior is
 * preserved byte-for-byte from the legacy page -- the export filename
 * format, the corrupt-data recovery download, the import preview/merge/
 * replace semantics (including the exact "Existing data was not changed."
 * copy the acceptance suite asserts on) and the reset word-confirmation
 * gate that keeps `state.theme` -- only the section layout changed, into
 * three clearly separated groups: Appearance, Backup and restore (export
 * and import as adjacent subsections of one section, since they are two
 * halves of the same round trip) and a destructive Reset section.
 */
export function SettingsPage() {
  const { state, setState, corruptRaw, resolveCorruptStorage } =
    usePersonalState();
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ReturnType<typeof parseImport>>();
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState("");
  const merge = preview ? mergeStatesWithConflicts(state, preview) : undefined;

  function exportData() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            { ...state, exportedAt: new Date().toISOString() },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    a.download = `ai-playbook-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function inspect() {
    try {
      setPreview(parseImport(text));
      setError("");
    } catch (e) {
      setPreview(undefined);
      setError((e as Error).message);
    }
  }

  return (
    <Page
      title="Settings"
      intro="Theme, backup and browser-local data controls."
    >
      <section className="settings-section" aria-labelledby="appearance-heading">
        <h2 id="appearance-heading">Appearance</h2>
        <Field label="Theme">
          <select
            value={state.theme}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                theme: e.target.value as typeof s.theme,
              }))
            }
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </Field>
      </section>

      <section className="settings-section" aria-labelledby="backup-heading">
        <h2 id="backup-heading">Backup and restore</h2>
        <p className="settings-lede">
          Everything is stored only in this browser. Export a copy before
          clearing site data, switching browsers or resetting below.
        </p>

        <div className="settings-subsection">
          <h3>Export</h3>
          <p>
            Download every project, review, note and bookmark as JSON. Keep
            exports private if notes contain sensitive information.
          </p>
          <div className="settings-actions">
            <button onClick={exportData}>Download export</button>
            {corruptRaw && (
              <button
                className="quiet"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(new Blob([corruptRaw]));
                  a.download = "corrupt-playbook-recovery.txt";
                  a.click();
                }}
              >
                Download unreadable saved data
              </button>
            )}
          </div>
        </div>

        <div className="settings-subsection">
          <h3>Import</h3>
          <p>
            Maximum 2 MB. The file is validated before existing data changes.
            Unknown content IDs and their notes are preserved.
          </p>
          <textarea
            rows={8}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setPreview(undefined);
            }}
            placeholder="Paste exported JSON"
          />
          <div className="settings-actions">
            <button onClick={inspect}>Preview import</button>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error} Existing data was not changed.
            </p>
          )}
          {preview && (
            <div className="import-preview">
              <h4>Import preview</h4>
              <p>
                {preview.projects.length} projects ·{" "}
                {preview.bookmarks.length} bookmarks ·{" "}
                {Object.keys(preview.notes).length} notes
              </p>
              {merge && merge.conflicts.length > 0 && (
                <p className="form-error">
                  {merge.conflicts.length} project ID conflict(s). Merge keeps
                  local values and adds non-conflicting imported fields.
                  Replace discards all current local data.
                </p>
              )}
              <div className="settings-actions">
                <button
                  onClick={() => {
                    setState(merge!.state);
                    resolveCorruptStorage();
                    setPreview(undefined);
                    setText("");
                  }}
                >
                  Merge with current data
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    setState(preview);
                    resolveCorruptStorage();
                    setPreview(undefined);
                    setText("");
                  }}
                >
                  Replace current data
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        className="settings-section settings-danger-zone"
        aria-labelledby="reset-heading"
      >
        <h2 id="reset-heading">Reset local data</h2>
        <p>
          This removes projects, reviews, notes and bookmarks from this
          browser. Export first if you may need them.
        </p>
        <Field label={'Type "reset" to confirm'}>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        <button
          className="danger"
          disabled={confirm !== "reset"}
          onClick={() => {
            setState({ ...emptyState, theme: state.theme });
            resolveCorruptStorage();
            setConfirm("");
          }}
        >
          Reset local data
        </button>
      </section>
    </Page>
  );
}
