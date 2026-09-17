import type { DiagramDefinition } from "../types";

/**
 * The "retrieve evidence that is relevant, current and allowed" guide's
 * pipeline: ingestion through access-filtered retrieval to a claim that must
 * be traced back to a citation. Shows the safe path (repair the earliest
 * failing stage) against the guide's own failure mode: a plausible but
 * incomplete answer caused by extraction or retrieval omitting evidence.
 */
export const retrievalPipelineDiagram: DiagramDefinition = {
  id: "retrieval-pipeline",
  title: "Retrieval pipeline and evidence trace",
  description:
    "Evidence moves from ingestion through access-filtered retrieval to a cited answer; a plausible but incomplete answer means the earliest failing stage, not the model, needs repair.",
  nodes: [
    {
      id: "ingest",
      type: "system",
      position: { x: 0, y: 100 },
      data: {
        label: "Ingest, parse and chunk the source",
        detail:
          "Preserve table headers, page locations, units and document structure through parsing and OCR. Chunk at meaningful boundaries and store source version, access scope and lineage as metadata.",
      },
    },
    {
      id: "retrieve",
      type: "system",
      position: { x: 240, y: 100 },
      data: {
        label: "Retrieve by keyword, vector or hybrid search",
        detail:
          "Keyword search preserves exact identifiers, vector search finds semantic similarity, hybrid search combines both signals; an optional reranking pass adds a second relevance check.",
      },
    },
    {
      id: "authorize",
      type: "decision",
      position: { x: 480, y: 100 },
      data: {
        label: "Apply access filtering before content reaches the model",
        detail:
          "Filter unauthorized content out before it reaches the model, not after. Test both relevant-item recall and cross-tenant exclusion.",
        status: "current",
      },
    },
    {
      id: "answer",
      type: "evidence",
      position: { x: 720, y: 20 },
      data: {
        label: "Every material claim cites its supporting evidence",
        detail:
          "Evaluate retrieval and generation separately: did the necessary passages arrive, and did the answer accurately use them? Check that each claim's citation supports it.",
        status: "supported",
      },
    },
    {
      id: "incomplete",
      type: "risk",
      position: { x: 720, y: 220 },
      data: {
        label: "The answer is plausible but incomplete",
        detail:
          "Extraction or retrieval omitted necessary evidence: the passage never reached the model even though the answer still sounds fluent.",
        status: "unknown",
      },
    },
    {
      id: "repair",
      type: "principle",
      position: { x: 960, y: 220 },
      data: {
        label: "Repair the earliest failing stage, then re-evaluate",
        detail:
          "Inspect the parsed source, the selected chunks and the claim-to-citation support in order, fix the earliest failing stage, and re-evaluate the final answers rather than only tuning the model prompt.",
        status: "verified",
      },
    },
  ],
  edges: [
    { id: "a", source: "ingest", target: "retrieve", data: { condition: "always" } },
    {
      id: "b",
      source: "retrieve",
      target: "authorize",
      data: { condition: "always" },
    },
    {
      id: "c",
      source: "authorize",
      target: "answer",
      data: { condition: "evidence complete" },
    },
    {
      id: "d",
      source: "authorize",
      target: "incomplete",
      data: { condition: "evidence omitted" },
    },
    {
      id: "e",
      source: "incomplete",
      target: "repair",
      data: { condition: "diagnose earliest stage" },
    },
  ],
  linearSteps: [
    {
      id: "ingest",
      title: "Ingest, parse and chunk",
      detail:
        "Preserve table headers, page locations, units and structure through parsing and OCR; chunk at meaningful boundaries and record source version, access scope and lineage.",
    },
    {
      id: "retrieve",
      title: "Retrieve with keyword, vector or hybrid search",
      detail:
        "Keyword search preserves exact identifiers, vector search finds semantic similarity, hybrid search combines both; reranking adds a second relevance pass at extra latency and cost.",
    },
    {
      id: "authorize",
      title: "Filter for access before the model sees it",
      detail:
        "Apply access filtering before unauthorized content reaches the model. Test relevant-item recall and cross-tenant exclusion separately.",
    },
    {
      id: "answer",
      title: "Cite supporting evidence for every claim",
      detail:
        "Evaluate retrieval and generation separately, and check that each material claim's citation actually supports it.",
    },
    {
      id: "incomplete",
      title: "Failure: a plausible but incomplete answer",
      detail:
        "Extraction or retrieval omitted necessary evidence, so a fluent answer is still wrong or partial.",
    },
    {
      id: "repair",
      title: "Repair the earliest failing stage (safe path)",
      detail:
        "Inspect the parsed source, selected chunks and claim-to-citation support in order, repair the earliest failing stage, then re-evaluate final answers.",
    },
  ],
};
