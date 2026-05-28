import { NextResponse } from "next/server";
import { z } from "zod";
import { aiErrorResponse } from "@/lib/ai/apiErrorResponse";
import { getAiProvider } from "@/lib/ai";
import { PromptCategory } from "@prisma/client";

const bodySchema = z.object({
  roughPrompt: z.string().min(1, "Rough prompt is required"),
  category: z.nativeEnum(PromptCategory).default(PromptCategory.GENERAL),
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

    const ai = getAiProvider();
    const result = await ai.optimize({
      roughPrompt: parsed.data.roughPrompt.trim(),
      category: parsed.data.category,
    });

    return NextResponse.json({
      status: "ok",
      data: {
        original: result.original,
        optimized: result.optimized,
        improvements: result.improvements,
        provider: result.provider,
      },
    });
  } catch (e) {
    return aiErrorResponse(e, "Failed to optimize prompt");
  }
}
