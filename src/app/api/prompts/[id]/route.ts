import { NextResponse } from "next/server";
import { getMockUserId } from "@/lib/auth/mock";
import { getPromptDetail } from "@/lib/prompts/versionActions";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const userId = getMockUserId();
    const detail = await getPromptDetail(userId, id);

    if (!detail) {
      return NextResponse.json({ status: "error", message: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", data: detail });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load prompt",
      },
      { status: 500 },
    );
  }
}
