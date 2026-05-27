import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getMockUserId } from "@/lib/auth/mock";
import type { AiModelId, PromptCategory } from "@prisma/client";

type RecentRun = {
  id: string;
  createdAt: string;
  category: PromptCategory;
  modelId: AiModelId;
  promptTitle: string;
  score: number | null;
};

export async function GET() {
  try {
    const userId = getMockUserId();

    const [promptsCount, runsCount, avgAgg, categoryCounts, recentRuns] =
      await Promise.all([
        prisma.prompt.count({ where: { userId } }),
        prisma.promptRun.count({ where: { userId } }),
        prisma.evaluation.aggregate({
          where: { userId },
          _avg: { totalScore: true },
        }),
        prisma.prompt.groupBy({
          by: ["category"],
          where: { userId },
          _count: { _all: true },
        }),
        prisma.promptRun.findMany({
          where: { userId },
          take: 8,
          orderBy: { createdAt: "desc" },
          include: {
            prompt: {
              select: {
                title: true,
              },
            },
          },
        }),
      ]);

    const recentIds = recentRuns.map((r) => r.id);
    const evaluations = await prisma.evaluation.findMany({
      where: { userId, promptRunId: { in: recentIds } },
      select: { promptRunId: true, totalScore: true },
    });

    const scoreMap = new Map<string, number>();
    for (const e of evaluations) {
      scoreMap.set(e.promptRunId, e.totalScore);
    }

    const recentRunsFormatted: RecentRun[] = recentRuns.map((r) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      category: r.category,
      modelId: r.modelId,
      promptTitle: r.prompt?.title ?? "Unknown prompt",
      score: scoreMap.get(r.id) ?? null,
    }));

    return NextResponse.json({
      status: "ok",
      data: {
        promptsCount,
        runsCount,
        avgScore: avgAgg._avg.totalScore == null ? null : Math.round(avgAgg._avg.totalScore),
        categories: categoryCounts.map((c) => ({
          category: c.category,
          count: c._count._all,
        })),
        recentRuns: recentRunsFormatted,
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load dashboard",
      },
      { status: 500 },
    );
  }
}

