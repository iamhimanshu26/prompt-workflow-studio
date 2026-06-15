import type { DashboardPayload } from "@/types/dashboard";
import { getAiConfigDiagnostics } from "@/lib/ai";
import { getMockUserId } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";

export async function getDashboardData(): Promise<DashboardPayload> {
  const userId = getMockUserId();
  const fetchedAt = new Date().toISOString();
  const aiConfig = getAiConfigDiagnostics();

  let databaseStatus: DashboardPayload["system"]["databaseStatus"] = "ok";
  let databaseMessage: string | undefined;

  if (!process.env.DATABASE_URL?.trim()) {
    databaseStatus = "unconfigured";
    databaseMessage = "DATABASE_URL is not set";
  } else {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      databaseStatus = "error";
      databaseMessage = e instanceof Error ? e.message : "Database unreachable";
    }
  }

  const environmentStatus: DashboardPayload["system"]["environmentStatus"] =
    databaseStatus === "ok" && !aiConfig.usingMockFallback
      ? "ready"
      : databaseStatus === "ok"
        ? "degraded"
        : "unconfigured";

  if (databaseStatus !== "ok") {
    return {
      stats: {
        totalPrompts: 0,
        totalRuns: 0,
        averageScore: null,
        totalIdeas: 0,
        totalWorkflows: 0,
      },
      categoryCounts: [],
      recentRuns: [],
      recentPrompts: [],
      recentVersions: [],
      recentIdeas: [],
      recentWorkflows: [],
      system: {
        databaseStatus,
        databaseMessage,
        aiProvider: aiConfig.activeProvider,
        environmentStatus,
        fetchedAt,
      },
    };
  }

  const [
    totalPrompts,
    totalRuns,
    totalIdeas,
    totalWorkflows,
    avgAgg,
    categoryCounts,
    recentRuns,
    recentPrompts,
    recentVersions,
    recentIdeas,
    recentWorkflows,
  ] = await Promise.all([
    prisma.prompt.count({ where: { userId } }),
    prisma.promptRun.count({ where: { userId } }),
    prisma.idea.count({ where: { userId } }),
    prisma.workflow.count({ where: { userId } }),
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
      include: { prompt: { select: { title: true } } },
    }),
    prisma.prompt.findMany({
      where: { userId },
      take: 6,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, category: true, updatedAt: true },
    }),
    prisma.promptVersion.findMany({
      where: { prompt: { userId } },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { prompt: { select: { title: true } } },
    }),
    prisma.idea.findMany({
      where: { userId },
      take: 6,
      orderBy: { createdAt: "desc" },
      select: { id: true, roughNotes: true, isRefined: true, createdAt: true },
    }),
    prisma.workflow.findMany({
      where: { userId },
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { steps: true } } },
    }),
  ]);

  const recentIds = recentRuns.map((r) => r.id);
  const evaluations =
    recentIds.length > 0
      ? await prisma.evaluation.findMany({
          where: { userId, promptRunId: { in: recentIds } },
          select: { promptRunId: true, totalScore: true },
        })
      : [];

  const scoreMap = new Map(evaluations.map((e) => [e.promptRunId, e.totalScore]));

  return {
    stats: {
      totalPrompts,
      totalRuns,
      averageScore:
        avgAgg._avg.totalScore == null ? null : Math.round(avgAgg._avg.totalScore),
      totalIdeas,
      totalWorkflows,
    },
    categoryCounts: categoryCounts.map((c) => ({
      category: c.category,
      count: c._count._all,
    })),
    recentRuns: recentRuns.map((r) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      category: r.category,
      modelId: r.modelId,
      promptTitle: r.prompt?.title ?? "Untitled prompt",
      score: scoreMap.get(r.id) ?? null,
    })),
    recentPrompts: recentPrompts.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      updatedAt: p.updatedAt.toISOString(),
    })),
    recentVersions: recentVersions.map((v) => ({
      id: v.id,
      promptId: v.promptId,
      promptTitle: v.prompt.title,
      version: v.version,
      name: v.name,
      createdAt: v.createdAt.toISOString(),
    })),
    recentIdeas: recentIdeas.map((i) => ({
      id: i.id,
      roughNotes: i.roughNotes,
      isRefined: i.isRefined,
      createdAt: i.createdAt.toISOString(),
    })),
    recentWorkflows: recentWorkflows.map((w) => ({
      id: w.id,
      name: w.name,
      stepCount: w._count.steps,
      updatedAt: w.updatedAt.toISOString(),
    })),
    system: {
      databaseStatus,
      databaseMessage,
      aiProvider: aiConfig.activeProvider,
      environmentStatus,
      fetchedAt,
    },
  };
}
