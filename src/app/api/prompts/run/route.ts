import { NextResponse } from "next/server";
import { z } from "zod";
import { getAiProvider } from "@/lib/ai";
import { getMockUserId } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";
import { PromptCategory, AiModelId } from "@prisma/client";

const bodySchema = z.object({
  promptText: z.string().min(1, "Prompt text is required"),
  category: z.nativeEnum(PromptCategory).default(PromptCategory.GENERAL),
  promptId: z.string().optional(),
  modelId: z.nativeEnum(AiModelId).default(AiModelId.GPT),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { promptText, category, promptId, modelId } = parsed.data;
    const userId = getMockUserId();
    const ai = getAiProvider();

    const result = await ai.complete({ prompt: promptText, category }, modelId);

    const run = await prisma.promptRun.create({
      data: {
        userId,
        promptId: promptId ?? null,
        promptText,
        category,
        modelId: result.modelId,
        responseText: result.text,
        tokenInput: result.tokenInput,
        tokenOutput: result.tokenOutput,
        latencyMs: result.latencyMs,
      },
    });

    return NextResponse.json({
      status: "ok",
      data: {
        runId: run.id,
        responseText: result.text,
        modelId: result.modelId,
        provider: result.provider,
        tokenInput: result.tokenInput,
        tokenOutput: result.tokenOutput,
        latencyMs: result.latencyMs,
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to run prompt",
      },
      { status: 500 },
    );
  }
}
