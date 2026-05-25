import { MockAiProvider } from "./mock";
import type { AiProvider, AiProviderName } from "./types";

export * from "./types";

let cached: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (cached) return cached;

  const name = (process.env.AI_PROVIDER ?? "mock") as AiProviderName;

  switch (name) {
    case "mock":
      cached = new MockAiProvider();
      break;
    case "openai":
    case "gemini":
      // Phase 2+: wire OpenAI/Gemini adapters here; fall back to mock if keys missing
      console.warn(`[ai] Provider "${name}" not implemented yet — using mock.`);
      cached = new MockAiProvider();
      break;
    default:
      cached = new MockAiProvider();
  }

  return cached;
}
