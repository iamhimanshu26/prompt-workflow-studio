import type { AiModelId, PromptCategory } from "@prisma/client";

export type DashboardStats = {
  totalPrompts: number;
  totalRuns: number;
  averageScore: number | null;
  totalIdeas: number;
  totalWorkflows: number;
};

export type DashboardCategoryCount = {
  category: PromptCategory;
  count: number;
};

export type DashboardRecentRun = {
  id: string;
  createdAt: string;
  category: PromptCategory;
  modelId: AiModelId;
  promptTitle: string;
  score: number | null;
};

export type DashboardRecentPrompt = {
  id: string;
  title: string;
  category: PromptCategory;
  updatedAt: string;
};

export type DashboardRecentVersion = {
  id: string;
  promptId: string;
  promptTitle: string;
  version: number;
  name: string;
  createdAt: string;
};

export type DashboardRecentIdea = {
  id: string;
  roughNotes: string;
  isRefined: boolean;
  createdAt: string;
};

export type DashboardRecentWorkflow = {
  id: string;
  name: string;
  stepCount: number;
  updatedAt: string;
};

export type DashboardSystem = {
  databaseStatus: "ok" | "error" | "unconfigured";
  databaseMessage?: string;
  aiProvider: string;
  environmentStatus: "ready" | "degraded" | "unconfigured";
  fetchedAt: string;
};

export type DashboardPayload = {
  stats: DashboardStats;
  categoryCounts: DashboardCategoryCount[];
  recentRuns: DashboardRecentRun[];
  recentPrompts: DashboardRecentPrompt[];
  recentVersions: DashboardRecentVersion[];
  recentIdeas: DashboardRecentIdea[];
  recentWorkflows: DashboardRecentWorkflow[];
  system: DashboardSystem;
};

export type DashboardApiResponse =
  | { status: "ok"; data: DashboardPayload }
  | { status: "error"; message: string };
