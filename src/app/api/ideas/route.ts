import { NextResponse } from "next/server";
import { z } from "zod";
import { getMockUserId } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  roughNotes: z.string().min(1, "Idea text is required"),
});

export async function GET() {
  try {
    const userId = getMockUserId();
    const ideas = await prisma.idea.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        roughNotes: true,
        refinedNotes: true,
        isRefined: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ status: "ok", data: ideas });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load ideas",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const userId = getMockUserId();
    const idea = await prisma.idea.create({
      data: {
        userId,
        roughNotes: parsed.data.roughNotes.trim(),
        isRefined: false,
      },
    });

    return NextResponse.json({ status: "ok", data: idea });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to save idea",
      },
      { status: 500 },
    );
  }
}
