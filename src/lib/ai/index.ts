import { MockAiProvider } from "./mock";
import { OpenAiProvider } from "./openai";
import type { AiProvider, AiProviderName } from "./types";

export * from "./types";

let cached: AiProvider | null = null;
let cachedSignature = "";

export type AiConfigDiagnostics = {
  aiProviderEnv: string | null;
  openaiKeyConfigured: boolean;
  openaiKeyLength: number;
  activeProvider: AiProviderName;
  usingMockFallback: boolean;
  hint: string | null;
};

function envSignature(): string {
  const name = (process.env.AI_PROVIDER ?? "").trim().toLowerCase();
  const key = (process.env.OPENAI_API_KEY ?? "").trim();
  return `${name}:${key.length}`;
}

function resolveProviderName(): AiProviderName {
  const raw = (process.env.AI_PROVIDER ?? "mock").trim().toLowerCase();
  if (raw === "openai" || raw === "gemini" || raw === "mock") return raw;
  return "mock";
}

export function getAiConfigDiagnostics(): AiConfigDiagnostics {
  const aiProviderEnv = process.env.AI_PROVIDER?.trim() ?? null;
  const key = process.env.OPENAI_API_KEY?.trim() ?? "";
  const openaiKeyConfigured = key.length > 0;
  const name = resolveProviderName();

  let activeProvider: AiProviderName = "mock";
  let usingMockFallback = true;
  let hint: string | null = null;

  if (name === "openai") {
    if (openaiKeyConfigured) {
      activeProvider = "openai";
      usingMockFallback = false;
    } else {
      hint =
        "AI_PROVIDER is openai but OPENAI_API_KEY is empty on the server. Add OPENAI_API_KEY for Production in Vercel, then redeploy.";
    }
  } else if (name === "gemini") {
    hint = 'Gemini adapter is not implemented yet. Set AI_PROVIDER=openai and OPENAI_API_KEY.';
  } else if (!aiProviderEnv || name === "mock") {
    hint =
      'Set AI_PROVIDER=openai and OPENAI_API_KEY in Vercel (Production environment), then redeploy.';
  } else if (aiProviderEnv && name === "mock") {
    hint = `Unrecognized AI_PROVIDER="${aiProviderEnv}". Use exactly: openai`;
  }

  return {
    aiProviderEnv,
    openaiKeyConfigured,
    openaiKeyLength: key.length,
    activeProvider,
    usingMockFallback,
    hint,
  };
}

export function getAiProvider(): AiProvider {
  const sig = envSignature();
  if (cached && cachedSignature === sig) return cached;

  cachedSignature = sig;
  const name = resolveProviderName();

  switch (name) {
    case "openai": {
      const key = process.env.OPENAI_API_KEY?.trim();
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
