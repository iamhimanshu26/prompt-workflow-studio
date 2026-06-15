import { NextResponse } from "next/server";
import { z } from "zod";
import { aiErrorResponse } from "@/lib/ai/apiErrorResponse";
import { getAiProvider } from "@/lib/ai";
import { getMockUserId } from "@/lib/auth/mock";
import { prisma } from "@/lib/db";
import { composeExecutionPrompt } from "@/lib/playground/composePrompt";
import { PromptCategory, AiModelId } from "@prisma/client";

const executionOptionsSchema = z
  .object({
    temperature: z.number().min(0).max(1).optional(),
    responseLength: z.enum(["short", "medium", "long"]).optional(),
    creativity: z.enum(["low", "balanced", "high"]).optional(),
  })
  .optional();

const bodySchema = z.object({
  promptText: z.string().min(1, "Prompt text is required"),
  resolvedPrompt: z.string().optional(),
  category: z.nativeEnum(PromptCategory).default(PromptCategory.GENERAL),
  promptId: z.string().optional(),
  title: z.string().optional(),
  modelId: z.nativeEnum(AiModelId).default(AiModelId.GPT),
  systemInstruction: z.string().optional(),
  outputFormat: z
    .enum(["plain", "bullets", "json", "markdown", "email", "technical"])
    .optional(),
  tone: z
    .enum(["professional", "concise", "detailed", "friendly", "technical", "executive"])
    .optional(),
  executionOptions: executionOptionsSchema,
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

    const {
      promptText,
      resolvedPrompt,
      category,
      promptId,
      modelId,
      systemInstruction,
      outputFormat,
      tone,
      executionOptions,
    } = parsed.data;

    if (modelId !== AiModelId.GPT) {
      return NextResponse.json(
        {
          status: "error",
          message: "Only GPT/OpenAI execution is supported in this phase.",
        },
        { status: 400 },
      );
    }

    const userId = getMockUserId();
    const ai = getAiProvider();

    const basePrompt = (resolvedPrompt ?? promptText).trim();
    const composedPrompt = composeExecutionPrompt(basePrompt, {
      outputFormat,
      tone,
      executionOptions,
    });

    const result = await ai.complete(
      {
        prompt: composedPrompt,
        category,
        systemHint: systemInstruction?.trim() || undefined,
      },
      modelId,
    );

    const run = await prisma.promptRun.create({
      data: {
        userId,
        promptId: promptId ?? null,
        promptText: composedPrompt,
        category,
        modelId: result.modelId,
        responseText: result.text,
        tokenInput: result.tokenInput,
        tokenOutput: result.tokenOutput,
        latencyMs: result.latencyMs,
      },
    });

    const createdAt = run.createdAt.toISOString();

    return NextResponse.json({
      status: "ok",
      data: {
        output: result.text,
        run: {
          id: run.id,
          promptText: composedPrompt,
          responseText: result.text,
          category,
          modelId: result.modelId,
          createdAt,
        },
        metadata: {
          provider: result.provider,
          model: result.modelId,
          latencyMs: result.latencyMs,
          category,
          outputFormat: outputFormat ?? null,
          tone: tone ?? null,
          createdAt,
          promptLength: composedPrompt.length,
          tokenInput: result.tokenInput,
          tokenOutput: result.tokenOutput,
        },
        // Backward-compatible fields for existing clients
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
    return aiErrorResponse(e, "Failed to run prompt");
  }
}
