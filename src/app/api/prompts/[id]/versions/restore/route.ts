import { NextResponse } from "next/server";
import { z } from "zod";
import { getMockUserId } from "@/lib/auth/mock";
import { restorePromptVersion, getPromptDetail } from "@/lib/prompts/versionActions";

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
    const result = await restorePromptVersion(userId, promptId, parsed.data.versionId);
    const detail = await getPromptDetail(userId, promptId);

    return NextResponse.json({
      status: "ok",
      data: {
        ...result,
        prompt: detail,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to restore version";
    const status = msg.includes("not found") ? 404 : 500;
    return NextResponse.json({ status: "error", message: msg }, { status });
  }
}
