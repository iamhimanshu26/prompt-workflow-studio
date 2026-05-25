import type { AiModelId } from "@prisma/client";
import type {
  AiProvider,
  CompletionRequest,
  CompletionResult,
  EvaluationInput,
  EvaluationResult,
  OptimizeRequest,
  OptimizeResult,
} from "./types";

const MODEL_LABELS: Record<AiModelId, string> = {
  GPT: "GPT-4o (mock)",
  GEMINI: "Gemini 2.0 (mock)",
  CLAUDE: "Claude 3.5 (mock)",
};

function hashSeed(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function mockLatency(text: string): number {
  return 400 + (hashSeed(text) % 900);
}

function mockTokens(text: string): { input: number; output: number } {
  const input = Math.max(12, Math.ceil(text.length / 4));
  const output = 80 + (hashSeed(text) % 120);
  return { input, output };
}

export class MockAiProvider implements AiProvider {
  readonly name = "mock" as const;

  async complete(
    request: CompletionRequest,
    modelId: AiModelId = "GPT",
  ): Promise<CompletionResult> {
    const latencyMs = mockLatency(request.prompt);
    const { input, output } = mockTokens(request.prompt);
    const category = request.category ?? "GENERAL";

    const text = [
      `[${MODEL_LABELS[modelId]} — mock response]`,
      "",
      `Category: ${category}`,
      "",
      "Sample output for your prompt:",
      request.prompt.slice(0, 280) + (request.prompt.length > 280 ? "…" : ""),
      "",
      "— Replace AI_PROVIDER=openai|gemini and add API keys in Phase 2+ for real completions.",
    ].join("\n");

    return {
      text,
      modelId,
      tokenInput: input,
      tokenOutput: output,
      latencyMs,
      provider: "mock",
    };
  }

  async optimize(request: OptimizeRequest): Promise<OptimizeResult> {
    const rough = request.roughPrompt.trim();
    const optimized = [
      "You are an expert assistant. Follow these rules:",
      "1. Be specific about audience, tone, and output format.",
      "2. Include constraints and examples when helpful.",
      "3. Ask for clarification only if critical context is missing.",
      "",
      "Task:",
      rough,
      "",
      `Context category: ${request.category ?? "GENERAL"}`,
    ].join("\n");

    return {
      original: rough,
      optimized,
      improvements: [
        "Added role and behavior framing",
        "Structured task vs. meta-instructions",
        "Included category context",
      ],
      provider: "mock",
    };
  }

  async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    const len = input.response.length;
    const clarity = Math.min(95, 60 + Math.floor(len / 40));
    const structure = Math.min(92, 55 + (input.response.includes("\n") ? 25 : 10));
    const accuracy = 70 + (hashSeed(input.prompt) % 20);
    const usefulness = Math.min(90, 50 + Math.floor(len / 50));
    const hallucinationRisk = Math.max(5, 35 - (hashSeed(input.response) % 25));
    const totalScore = Math.round(
      (clarity + structure + accuracy + usefulness + (100 - hallucinationRisk)) / 5,
    );

    return {
      clarity,
      structure,
      accuracy,
      usefulness,
      hallucinationRisk,
      totalScore,
      summary:
        "Mock evaluation — heuristic scores for demo. Phase 5 will add LLM-as-judge or configurable rubrics.",
    };
  }
}
