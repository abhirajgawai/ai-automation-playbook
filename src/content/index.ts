import type {
  Category,
  Guide,
  Source,
  ChecklistItem,
  TroubleshootingFlow,
  ComparisonOption,
  GlossaryTerm,
  CoverageEntry,
} from "./types";
import categoryData from "./categories.json";
import guideData from "./guides.json";
import sourceData from "./sources.json";
import checklistData from "./checklists.json";
import troubleshootingData from "./troubleshooting.json";
import comparisonData from "./comparisons.json";
import glossaryData from "./glossary.json";
import coverageData from "./coverage.json";
export const categories = categoryData as Category[];
export const guides = guideData as Guide[];
export const sources = sourceData as Source[];
export const checklistItems = checklistData as ChecklistItem[];
export const troubleshootingFlows =
  troubleshootingData as TroubleshootingFlow[];
export const comparisonOptions = comparisonData as ComparisonOption[];
export const glossary = glossaryData as GlossaryTerm[];
export const coverage = coverageData as CoverageEntry[];
export const CONTENT_VERSION = "2026.09.15.1";
