import type { AiModelId, PromptCategory } from "@prisma/client";
import { MockAiProvider } from "./mock";
import { parseEvaluationJson } from "./evaluationParse";
import type {
  AiProvider,
  CompletionRequest,
  CompletionResult,
  EvaluationInput,
  EvaluationResult,
  OptimizeRequest,
  OptimizeResult,
} from "./types";

const CATEGORY_HINT: Record<PromptCategory, string> = {
  RESUME: "resume and career",
  INTERVIEW: "interview preparation",
  EMAIL: "professional email",
  CODING: "software engineering",
  LEARNING: "education and learning",
  MARKETING: "marketing copy",
  GENERAL: "general assistance",
};

export class OpenAiProvider implements AiProvider {
  readonly name = "openai" as const;
  private readonly apiKey: string;
  private readonly fallback = new MockAiProvider();

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async chat(
    system: string,
    user: string,
    model = process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  ): Promise<{ text: string; input: number; output: number; latencyMs: number }> {
    const start = Date.now();
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };

    const text = json.choices?.[0]?.message?.content?.trim() ?? "";
    return {
      text,
      input: json.usage?.prompt_tokens ?? 0,
      output: json.usage?.completion_tokens ?? 0,
      latencyMs: Date.now() - start,
    };
  }

  async complete(
    request: CompletionRequest,
    modelId: AiModelId = "GPT",
  ): Promise<CompletionResult> {
    const category = request.category ?? "GENERAL";
    const system =
      request.systemHint ??
      `You are a helpful assistant focused on ${CATEGORY_HINT[category]}. Answer clearly and concisely.`;

    const { text, input, output, latencyMs } = await this.chat(system, request.prompt);

    return {
      text,
      modelId,
      tokenInput: input,
      tokenOutput: output,
      latencyMs,
      provider: "openai",
    };
  }

  async optimize(request: OptimizeRequest): Promise<OptimizeResult> {
    const start = Date.now();
    const category = request.category ?? "GENERAL";
    const focus = request.instruction?.trim()
      ? `\nOptimization focus: ${request.instruction}`
      : "";
    const system = [
      "Improve the user's prompt for clarity, constraints, and output format.",
      `Category: ${CATEGORY_HINT[category]}.`,
      request.outputStyle
        ? `Format style: ${request.outputStyle}.`
        : "Return a production-ready prompt.",
      focus,
      "Return only the improved prompt, no preamble.",
    ].join(" ");
    const user = `Rough prompt:\n${request.roughPrompt.trim()}`;
    const { text, latencyMs } = await this.chat(system, user);
    return {
      original: request.roughPrompt.trim(),
      optimized: text,
      improvements: ["Clarity", "Structure", "Constraints"],
      provider: "openai",
      latencyMs: Date.now() - start + latencyMs,
    };
  }

  async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    const start = Date.now();
    try {
      const system = [
        "You are a PromptOps quality analyst.",
        "Return ONLY valid JSON with these numeric fields (0-100):",
        "clarity, specificity, structure, outputControl, reusability, reliability, hallucinationRisk, productionReadiness, totalScore",
        "Also include: rating (Excellent|Strong|Good|Needs Improvement|Risky), summary (string),",
        "strengths (string[]), weaknesses (string[]), recommendations (string[]), suggestedPrompt (string, optional).",
        "Label scores as AI-assisted quality indicators, not mathematical truth.",
      ].join(" ");

      const user = JSON.stringify({
        evaluationType: input.evaluationType ?? "ALIGNMENT",
        prompt: input.prompt,
        response: input.response ?? "",
        expectedOutput: input.expectedOutput ?? "",
        successCriteria: input.successCriteria ?? "",
      });

      const { text, latencyMs } = await this.chat(system, user);
      const parsed = parseEvaluationJson(text);
      if (!parsed) return this.fallback.evaluate(input);
      return { ...parsed, latencyMs: Date.now() - start + latencyMs };
    } catch {
      return this.fallback.evaluate(input);
    }
  }
}
