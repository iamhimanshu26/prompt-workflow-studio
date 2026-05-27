import { MockAiProvider } from "./mock";
import { OpenAiProvider } from "./openai";
import type { AiProvider, AiProviderName } from "./types";

export * from "./types";

let cached: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (cached) return cached;

  const name = (process.env.AI_PROVIDER ?? "mock") as AiProviderName;

  switch (name) {
    case "openai": {
      const key = process.env.OPENAI_API_KEY;
      if (key) {
        cached = new OpenAiProvider(key);
      } else {
        console.warn("[ai] OPENAI_API_KEY missing — using mock.");
        cached = new MockAiProvider();
      }
      break;
    }
    case "gemini":
      console.warn(`[ai] Provider "gemini" not implemented yet — using mock.`);
      cached = new MockAiProvider();
      break;
    case "mock":
    default:
      cached = new MockAiProvider();
  }

  return cached;
}
