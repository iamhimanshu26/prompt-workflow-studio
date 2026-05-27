import { NextResponse } from "next/server";
import { getMockUserId } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const userId = getMockUserId();
    const runs = await prisma.promptRun.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { prompt: { select: { title: true } } },
    });

    return NextResponse.json({
      status: "ok",
      data: runs.map((r) => ({
        id: r.id,
        createdAt: r.createdAt.toISOString(),
        category: r.category,
        modelId: r.modelId,
        promptTitle: r.prompt?.title ?? null,
        promptText: r.promptText.slice(0, 120),
        responsePreview: r.responseText.slice(0, 120),
        latencyMs: r.latencyMs,
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
