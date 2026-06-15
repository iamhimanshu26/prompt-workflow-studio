import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai";
import { getMockUserId } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const userId = getMockUserId();
    const provider = getAiProvider().name;

    const runs = await prisma.promptRun.findMany({
      where: { userId },
      take: 12,
      orderBy: { createdAt: "desc" },
      include: {
        prompt: { select: { title: true } },
        evaluations: {
          select: { totalScore: true },
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({
      status: "ok",
      data: runs.map((r) => ({
        id: r.id,
        createdAt: r.createdAt.toISOString(),
        category: r.category,
        modelId: r.modelId,
        provider,
        promptTitle: r.prompt?.title ?? null,
        promptText: r.promptText,
        promptPreview: r.promptText.length > 140 ? `${r.promptText.slice(0, 140)}…` : r.promptText,
        responseText: r.responseText,
        responsePreview:
          r.responseText.length > 140 ? `${r.responseText.slice(0, 140)}…` : r.responseText,
        latencyMs: r.latencyMs,
        tokenInput: r.tokenInput,
        tokenOutput: r.tokenOutput,
        score: r.evaluations[0]?.totalScore ?? null,
      })),
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load runs",
      },
      { status: 500 },
    );
  }
}
