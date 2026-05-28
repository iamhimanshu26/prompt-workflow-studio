import { getAiConfigDiagnostics, getAiProvider } from "@/lib/ai";
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
  const sample = await ai.complete({
    prompt: "health check",
    category: "GENERAL",
  });

  return {
    status: "ok" as const,
    phase: 3,
    app: process.env.NEXT_PUBLIC_APP_NAME ?? "Prompt Workflow Studio",
    auth: isMockAuthEnabled() ? "mock" : "configured",
    database,
    dbMessage,
    ai: {
      provider: ai.name,
      sampleLatencyMs: sample.latencyMs,
    },
    aiConfig: config,
    timestamp: new Date().toISOString(),
  };
}
