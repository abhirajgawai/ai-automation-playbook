import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniSearch from "minisearch";
import { categories, guides, troubleshootingFlows } from "../content";

type SearchDoc = {
  id: string;
  kind: "Guide" | "Category" | "Troubleshooting";
  title: string;
  keywords: string;
  to: string;
};

function buildDocs(): SearchDoc[] {
  return [
    ...guides.map((g) => ({
      id: `guide:${g.id}`,
      kind: "Guide" as const,
      title: g.title,
      keywords: [g.summary, ...g.tags].join(" "),
      to: `/guides/${g.id}`,
    })),
    ...categories.map((c) => ({
      id: `category:${c.id}`,
      kind: "Category" as const,
      title: c.title,
      keywords: c.description ?? "",
      to: `/explore?category=${c.id}`,
    })),
    ...troubleshootingFlows.map((f) => ({
      id: `flow:${f.id}`,
      kind: "Troubleshooting" as const,
      title: f.title,
      keywords: f.symptom ?? "",
      to: `/troubleshoot?flow=${f.id}`,
    })),
  ];
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

export function SearchCommand() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const index = useMemo(() => {
    const mini = new MiniSearch<SearchDoc>({
      fields: ["title", "keywords"],
      storeFields: ["id"],
    });
    mini.addAll(buildDocs());
    return mini;
  }, []);

  const docsById = useMemo(() => {
    const map = new Map<string, SearchDoc>();
    for (const doc of buildDocs()) map.set(doc.id, doc);
    return map;
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return index
      .search(query, { prefix: true, fuzzy: 0.2 })
      .map((r) => docsById.get(r.id as string))
      .filter((doc): doc is SearchDoc => !!doc)
      .slice(0, 20);
  }, [index, docsById, query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const grouped = useMemo(() => {
    const groups = new Map<SearchDoc["kind"], SearchDoc[]>();
    for (const doc of results) {
      const list = groups.get(doc.kind) ?? [];
      list.push(doc);
      groups.set(doc.kind, list);
    }
    return [...groups.entries()];
  }, [results]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="search-trigger"
        onClick={() => setOpen(true)}
      >
        Search<span className="search-shortcut">/</span>
      </button>
      {open && (
        <div className="search-overlay" onClick={close}>
          <div
            className="search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            onClick={(event) => event.stopPropagation()}
          >
            <label htmlFor="search-command-input">Search the playbook</label>
            <input
              id="search-command-input"
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “duplicate action” or a category name"
              autoComplete="off"
            />
            <div aria-live="polite" className="search-feedback">
              {query.trim()
                ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query}”`
                : "Type to search guides, categories and troubleshooting flows."}
            </div>
            <div className="search-results">
              {grouped.map(([kind, docs]) => (
                <div key={kind} className="search-group">
                  <h2>{kind}</h2>
                  <ul>
                    {docs.map((doc) => (
                      <li key={doc.id}>
                        <a
                          href={doc.to}
                          onClick={(event) => {
                            event.preventDefault();
                            close();
                            navigate(doc.to);
                          }}
                        >
                          {doc.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
