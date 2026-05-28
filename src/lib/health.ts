import { getAiConfigDiagnostics, getAiProvider } from "@/lib/ai";
import { parseOpenAiError } from "@/lib/ai/openaiErrors";
import { isMockAuthEnabled } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";

export async function getHealthStatus() {
  let database: "ok" | "error" = "error";
  let dbMessage: string | undefined;

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "ok";
  } catch (e) {
    dbMessage = e instanceof Error ? e.message : "Database unreachable";
  }

  const config = getAiConfigDiagnostics();
  const ai = getAiProvider();

  let aiSample: { provider: string; sampleLatencyMs: number | null; status: string } = {
    provider: ai.name,
    sampleLatencyMs: null,
    status: "skipped",
  };
  let aiWarning: string | undefined;
  let aiErrorKind: string | undefined;

  try {
    const sample = await ai.complete({
      prompt: "health check",
      category: "GENERAL",
    });
    aiSample = {
      provider: sample.provider,
      sampleLatencyMs: sample.latencyMs,
      status: "ok",
    };
  } catch (e) {
    const raw = e instanceof Error ? e.message : "AI check failed";
    const parsed = parseOpenAiError(raw);
    aiWarning = parsed.userMessage;
    aiErrorKind = parsed.kind;
    aiSample = {
      provider: ai.name,
      sampleLatencyMs: null,
      status: parsed.kind,
    };
  }

  return {
    status: "ok" as const,
    phase: 3,
    app: process.env.NEXT_PUBLIC_APP_NAME ?? "Prompt Workflow Studio",
    auth: isMockAuthEnabled() ? "mock" : "configured",
    database,
    dbMessage,
    ai: aiSample,
    aiConfig: config,
    aiWarning,
    aiErrorKind,
    timestamp: new Date().toISOString(),
  };
}
