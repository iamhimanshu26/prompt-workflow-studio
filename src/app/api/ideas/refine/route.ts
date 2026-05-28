import { NextResponse } from "next/server";
import { z } from "zod";
import { getMockUserId } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";
import { aiErrorResponse } from "@/lib/ai/apiErrorResponse";
import { refineIdea } from "@/lib/ideas/refineIdea";

const refineSchema = z.object({
  roughNotes: z.string().min(1, "Idea text is required"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = refineSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const rough = parsed.data.roughNotes.trim();
    const refinedNotes = await refineIdea(rough);
    const userId = getMockUserId();

    const idea = await prisma.idea.create({
      data: {
        userId,
        roughNotes: rough,
        refinedNotes,
        isRefined: true,
      },
    });

    return NextResponse.json({
      status: "ok",
      data: {
        id: idea.id,
        roughNotes: idea.roughNotes,
        refinedNotes: idea.refinedNotes,
        isRefined: idea.isRefined,
        createdAt: idea.createdAt,
      },
    });
  } catch (e) {
    return aiErrorResponse(e, "Failed to refine idea");
  }
}
