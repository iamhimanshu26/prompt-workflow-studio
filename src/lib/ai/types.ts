import type { AiModelId, PromptCategory } from "@prisma/client";
import type { EvaluationModeType } from "@prisma/client";

export type AiProviderName = "mock" | "openai" | "gemini";

export interface CompletionRequest {
  prompt: string;
  category?: PromptCategory;
  systemHint?: string;
}

export interface CompletionResult {
  text: string;
  modelId: AiModelId;
  tokenInput: number;
  tokenOutput: number;
  latencyMs: number;
  provider: AiProviderName;
}

export interface OptimizeRequest {
  roughPrompt: string;
  category?: PromptCategory;
  optimizationGoal?: string;
  targetAudience?: string;
  outputStyle?: string;
  instruction?: string;
}

export interface OptimizeResult {
  original: string;
  optimized: string;
  improvements: string[];
  provider: AiProviderName;
  latencyMs?: number;
}

export interface EvaluationInput {
  prompt: string;
  response?: string;
  expectedOutput?: string;
  successCriteria?: string;
  evaluationType?: EvaluationModeType;
}

export interface EvaluationResult {
  clarity: number;
  specificity: number;
  structure: number;
  outputControl: number;
  reusability: number;
  reliability: number;
  hallucinationRisk: number;
  productionReadiness: number;
  accuracy: number;
  usefulness: number;
  totalScore: number;
  rating: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  suggestedPrompt?: string;
  latencyMs?: number;
}

export interface AiProvider {
  readonly name: AiProviderName;
  complete(request: CompletionRequest, modelId?: AiModelId): Promise<CompletionResult>;
  optimize(request: OptimizeRequest): Promise<OptimizeResult>;
  evaluate(input: EvaluationInput): Promise<EvaluationResult>;
}
