import type { Stage } from "../content/types";
export type ReviewStatus =
  | "not-reviewed"
  | "satisfied"
  | "needs-evidence"
  | "unresolved"
  | "not-applicable";
export interface ReviewRecord {
  status: ReviewStatus;
  evidence: string;
  owner: string;
  assumptions: string;
  rationale: string;
  revisit: string;
  reviewedContentVersion: string;
}
export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  answers: Record<string, string>;
  reviews: Record<string, ReviewRecord>;
  notes: Record<string, string>;
}
export interface PersonalState {
  schemaVersion: 2;
  exportedAt?: string;
  projects: Project[];
  bookmarks: string[];
  notes: Record<string, string>;
  recentGuideIds: string[];
  theme: "light" | "dark" | "system";
}
export interface DecisionResult {
  title: string;
  reason: string;
  guideIds: string[];
  level: "check" | "warning" | "info";
}
export interface CostInput {
  inputTokens: number;
  outputTokens: number;
  calls: number;
  inputPerMillion: number;
  outputPerMillion: number;
  otherMonthly: number;
}
export interface ReviewFilter {
  stage?: Stage;
}
