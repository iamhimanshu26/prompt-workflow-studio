import { NextResponse } from "next/server";
import { z } from "zod";
import { EvaluationModeType, EvaluationSourceType } from "@prisma/client";
import { aiErrorResponse } from "@/lib/ai/apiErrorResponse";
import { getMockUserId } from "@/lib/auth/mock";
import { runEvaluation } from "@/lib/evaluation/evaluationService";

const bodySchema = z.object({
  mode: z.enum(["manual", "prompt_run", "saved_prompt", "prompt_version"]).default("manual"),
  prompt: z.string().min(1, "Prompt is required"),
  output: z.string().optional(),
  expectedOutput: z.string().optional(),
  successCriteria: z.string().optional(),
  evaluationType: z.nativeEnum(EvaluationModeType).default(EvaluationModeType.ALIGNMENT),
  sourceType: z.nativeEnum(EvaluationSourceType).optional(),
  promptId: z.string().optional(),
  promptRunId: z.string().optional(),
  promptVersionId: z.string().optional(),
  save: z.boolean().optional(),
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

    const userId = getMockUserId();
    const payload = await runEvaluation(userId, parsed.data);

    return NextResponse.json({
      status: "ok",
      data: payload,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to run evaluation";
    if (msg.includes("not found") || msg.includes("required")) {
      return NextResponse.json({ status: "error", message: msg }, { status: 400 });
    }
    return aiErrorResponse(e, "Failed to run evaluation");
  }
}
