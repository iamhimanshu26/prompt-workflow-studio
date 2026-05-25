import type { AiModelId, PromptCategory } from "@prisma/client";

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
}

export interface OptimizeResult {
  original: string;
  optimized: string;
  improvements: string[];
  provider: AiProviderName;
}

export interface EvaluationInput {
  prompt: string;
  response: string;
}

export interface EvaluationResult {
  clarity: number;
  structure: number;
  accuracy: number;
  usefulness: number;
  hallucinationRisk: number;
  totalScore: number;
  summary: string;
}

export interface AiProvider {
  readonly name: AiProviderName;
  complete(request: CompletionRequest, modelId?: AiModelId): Promise<CompletionResult>;
  optimize(request: OptimizeRequest): Promise<OptimizeResult>;
  evaluate(input: EvaluationInput): Promise<EvaluationResult>;
}
