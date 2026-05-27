import { NextResponse } from "next/server";
import { z } from "zod";
import { getMockUserId } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";
import { autoTitleFromPrompt } from "@/lib/prompts/autoTitle";
import { PromptCategory } from "@prisma/client";

const bodySchema = z.object({
  body: z.string().min(1, "Prompt body is required"),
  category: z.nativeEnum(PromptCategory).default(PromptCategory.GENERAL),
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

    const { body, category, title } = parsed.data;
    const userId = getMockUserId();
    const finalTitle = title?.trim() || autoTitleFromPrompt(body);

    const prompt = await prisma.prompt.create({
      data: {
        userId,
        title: finalTitle,
        body,
        category,
      },
    });

    await prisma.promptVersion.create({
      data: {
        promptId: prompt.id,
        version: 1,
        name: "v1 — initial",
        body,
        notes: "Created from playground",
      },
    });

    return NextResponse.json({
      status: "ok",
      data: { promptId: prompt.id, title: finalTitle },
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to save prompt",
      },
      { status: 500 },
    );
  }
}
