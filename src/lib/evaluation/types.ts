import type { EvaluationModeType, EvaluationSourceType } from "@prisma/client";

export type EvaluationScores = {
  clarity: number;
  specificity: number;
  structure: number;
  outputControl: number;
  reusability: number;
  reliability: number;
  hallucinationRisk: number;
  productionReadiness: number;
};

export type EvaluationRecord = {
  id: string;
  overallScore: number;
  rating: string;
  summary: string;
  scores: EvaluationScores;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  suggestedPrompt: string | null;
  sourceType: EvaluationSourceType;
  evaluationType: EvaluationModeType;
  promptPreview: string;
  outputPreview: string | null;
  promptText: string | null;
  responseText: string | null;
  expectedOutput: string | null;
  successCriteria: string | null;
  promptId: string | null;
  promptRunId: string | null;
  promptVersionId: string | null;
  provider: string | null;
  latencyMs: number | null;
  createdAt: string;
};

export type RunEvaluationInput = {
  mode: "manual" | "prompt_run" | "saved_prompt" | "prompt_version";
  prompt: string;
  output?: string;
  expectedOutput?: string;
  successCriteria?: string;
  evaluationType: EvaluationModeType;
  sourceType?: EvaluationSourceType;
  promptId?: string;
  promptRunId?: string;
  promptVersionId?: string;
  save?: boolean;
};

export type EvaluationMode = "manual" | "prompt_run" | "saved_prompt" | "prompt_version";
