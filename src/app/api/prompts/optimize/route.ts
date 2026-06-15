import { NextResponse } from "next/server";
import { z } from "zod";
import { aiErrorResponse } from "@/lib/ai/apiErrorResponse";
import { getAiProvider } from "@/lib/ai";
import {
  buildOptimizeInstruction,
  computeIndicators,
  deriveImprovements,
} from "@/lib/optimizer/composeOptimize";
import type {
  OptimizationGoal,
  OutputStyle,
  TargetAudience,
} from "@/lib/optimizer/types";
import { PromptCategory } from "@prisma/client";

const bodySchema = z.object({
  roughPrompt: z.string().min(1, "Rough prompt is required"),
  title: z.string().optional(),
  category: z.nativeEnum(PromptCategory).default(PromptCategory.GENERAL),
  optimizationGoal: z
    .enum([
      "clarity",
      "structure",
      "conciseness",
      "detailed",
      "professional",
      "technical",
      "json",
      "interview",
      "marketing",
      "coding",
    ])
    .default("clarity"),
  targetAudience: z
    .enum(["general", "developer", "recruiter", "sales", "product", "stakeholder", "reviewer"])
    .default("general"),
  outputStyle: z
    .enum(["clean", "stepByStep", "roleBased", "jsonReady", "systemUser", "fewShot"])
    .default("clean"),
  attachedPromptId: z.string().optional(),
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
      roughPrompt,
      category,
      optimizationGoal,
      targetAudience,
      outputStyle,
    } = parsed.data;

    const instruction = buildOptimizeInstruction({
      optimizationGoal: optimizationGoal as OptimizationGoal,
      targetAudience: targetAudience as TargetAudience,
      outputStyle: outputStyle as OutputStyle,
      category,
    });

    const ai = getAiProvider();
    const start = Date.now();
    const result = await ai.optimize({
      roughPrompt: roughPrompt.trim(),
      category,
      optimizationGoal,
      targetAudience,
      outputStyle,
      instruction,
    });

    const latencyMs = result.latencyMs ?? Date.now() - start;
    const optimizedPrompt = result.optimized;
    const original = result.original;

    const indicators = computeIndicators(original, optimizedPrompt, {
      optimizationGoal: optimizationGoal as OptimizationGoal,
      outputStyle: outputStyle as OutputStyle,
    });

    const improvements = deriveImprovements(
      original,
      optimizedPrompt,
      {
        optimizationGoal: optimizationGoal as OptimizationGoal,
        targetAudience: targetAudience as TargetAudience,
        outputStyle: outputStyle as OutputStyle,
      },
      result.improvements,
    );

    const createdAt = new Date().toISOString();

    return NextResponse.json({
      status: "ok",
      data: {
        optimizedPrompt,
        original,
        optimized: optimizedPrompt,
        metadata: {
          provider: result.provider,
          model: result.provider === "openai" ? "gpt-4o-mini" : "mock",
          optimizationGoal,
          targetAudience,
          outputStyle,
          category,
          latencyMs,
          createdAt,
          originalLength: original.length,
          optimizedLength: optimizedPrompt.length,
        },
        improvements,
        indicators,
        provider: result.provider,
      },
    });
  } catch (e) {
    return aiErrorResponse(e, "Failed to optimize prompt");
  }
}
