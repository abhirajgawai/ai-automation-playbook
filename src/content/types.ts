export type Stage =
  | "discovery"
  | "architecture"
  | "implementation"
  | "pre-release"
  | "operations";
export interface Category {
  id: string;
  title: string;
  description: string;
}
export interface Source {
  id: string;
  title: string;
  url: string;
  reviewedAt: string | null;
  version?: string;
  status: "reviewed" | "unverified";
  notes?: string;
}
export interface Guide {
  id: string;
  categoryId: string;
  title: string;
  summary: string;
  tags: string[];
  stages: Stage[];
  applicability: { required: string; optional: string; unnecessary: string };
  prerequisites: string[];
  sections: { title: string; body: string[] }[];
  alternatives: {
    name: string;
    benefits: string;
    costs: string;
    limitations: string;
  }[];
  tradeoffs: string[];
  decisionCriteria: string[];
  examples: { title: string; body: string }[];
  failureModes: {
    symptom: string;
    cause: string;
    diagnostic: string;
    mitigation: string;
  }[];
  verification: string[];
  owner: string;
  reconsiderWhen: string[];
  relatedGuideIds: string[];
  sourceIds: string[];
  reviewedAt: string;
  contentVersion: string;
}
export interface ChecklistItem {
  id: string;
  stage: Stage;
  title: string;
  evidence: string;
  guideIds: string[];
}
export interface TroubleshootingFlow {
  id: string;
  title: string;
  symptom: string;
  questions: string[];
  causes: {
    title: string;
    evidence: string;
    mitigation: string;
    durableFix: string;
  }[];
  guideIds: string[];
}
export interface ComparisonOption {
  id: string;
  name: string;
  layer: string;
  summary: string;
  languages: string;
  deployment: string;
  strengths: string[];
  limitations: string[];
  sourceIds: string[];
  verifiedAt: string | null;
  evidenceStatus: "reviewed" | "unverified";
  license: string;
  maturity: string;
}
export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  guideIds: string[];
}
export interface CoverageEntry {
  id: string;
  requirement: string;
  categoryId?: string;
  guideIds: string[];
  verification: string;
  status: "pending" | "implemented" | "verified" | "blocked";
  notes?: string;
}
