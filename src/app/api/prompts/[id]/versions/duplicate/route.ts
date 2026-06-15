import { NextResponse } from "next/server";
import { z } from "zod";
import { getMockUserId } from "@/lib/auth/mock";
import { duplicatePromptVersion } from "@/lib/prompts/versionActions";

type Params = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  versionId: z.string().min(1),
});

export async function POST(req: Request, { params }: Params) {
  try {
    const { id: promptId } = await params;
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ status: "error", message: "Invalid request" }, { status: 400 });
    }

    const userId = getMockUserId();
    const result = await duplicatePromptVersion(userId, promptId, parsed.data.versionId);

    return NextResponse.json({
      status: "ok",
      data: result,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to duplicate version";
    const status = msg.includes("not found") ? 404 : 500;
    return NextResponse.json({ status: "error", message: msg }, { status });
  }
}
