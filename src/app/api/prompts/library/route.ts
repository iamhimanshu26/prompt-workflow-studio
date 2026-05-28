import { NextResponse } from "next/server";
import { getMockUserId } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";

/** Prompts with version history — for Optimizer "saved in database" panel. */
export async function GET() {
  try {
    const userId = getMockUserId();
    const prompts = await prisma.prompt.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 20,
      include: {
        versions: {
          orderBy: { version: "desc" },
          select: {
            id: true,
            version: true,
            name: true,
            body: true,
            notes: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: "ok",
      data: prompts.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        body: p.body,
        updatedAt: p.updatedAt,
        versions: p.versions,
      })),
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load library",
      },
      { status: 500 },
    );
  }
}
