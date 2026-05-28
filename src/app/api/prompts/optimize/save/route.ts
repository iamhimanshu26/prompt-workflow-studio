import { NextResponse } from "next/server";
import { z } from "zod";
import { getMockUserId } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";
import { autoTitleFromPrompt } from "@/lib/prompts/autoTitle";
import { PromptCategory } from "@prisma/client";

const bodySchema = z.object({
  optimized: z.string().min(1, "Optimized prompt is required"),
  original: z.string().optional(),
  category: z.nativeEnum(PromptCategory).default(PromptCategory.GENERAL),
  promptId: z.string().optional(),
  title: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "Invalid request" },
        { status: 400 },
      );
    }

    const { optimized, original, category, promptId, title } = parsed.data;
    const userId = getMockUserId();
    const notes = original?.trim()
      ? `Optimized from rough prompt:\n\n${original.trim()}`
      : "Optimized via Prompt Optimizer";

    if (promptId) {
      const existing = await prisma.prompt.findFirst({
        where: { id: promptId, userId },
      });
      if (!existing) {
        return NextResponse.json(
          { status: "error", message: "Prompt not found" },
          { status: 404 },
        );
      }

      const agg = await prisma.promptVersion.aggregate({
        where: { promptId },
        _max: { version: true },
      });
      const nextVersion = (agg._max.version ?? 0) + 1;

      await prisma.promptVersion.create({
        data: {
          promptId,
          version: nextVersion,
          name: `v${nextVersion} — optimized`,
          body: optimized.trim(),
          notes,
        },
      });

      const updated = await prisma.prompt.update({
        where: { id: promptId },
        data: { body: optimized.trim(), category },
      });

      return NextResponse.json({
        status: "ok",
        data: {
          promptId: updated.id,
          title: updated.title,
          version: nextVersion,
        },
      });
    }

    const finalTitle = title?.trim() || autoTitleFromPrompt(optimized);
    const prompt = await prisma.prompt.create({
      data: {
        userId,
        title: finalTitle,
        body: optimized.trim(),
        category,
      },
    });

    await prisma.promptVersion.create({
      data: {
        promptId: prompt.id,
        version: 1,
        name: "v1 — optimized",
        body: optimized.trim(),
        notes,
      },
    });

    return NextResponse.json({
      status: "ok",
      data: {
        promptId: prompt.id,
        title: finalTitle,
        version: 1,
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to save optimized prompt",
      },
      { status: 500 },
    );
  }
}
