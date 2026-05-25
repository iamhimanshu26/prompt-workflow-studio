import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai";
import { isMockAuthEnabled } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    let database: "ok" | "error" = "error";
    let dbMessage: string | undefined;

    try {
      await prisma.$queryRaw`SELECT 1`;
      database = "ok";
    } catch (e) {
      dbMessage = e instanceof Error ? e.message : "Database unreachable";
    }

    const ai = getAiProvider();
    const sample = await ai.complete({
      prompt: "health check",
      category: "GENERAL",
    });

    return NextResponse.json({
      status: "ok",
      phase: 0,
      app: process.env.NEXT_PUBLIC_APP_NAME ?? "Prompt Workflow Studio",
      auth: isMockAuthEnabled() ? "mock" : "configured",
      database,
      dbMessage,
      ai: {
        provider: ai.name,
        sampleLatencyMs: sample.latencyMs,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
