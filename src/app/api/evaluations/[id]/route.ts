import { NextResponse } from "next/server";
import { getMockUserId } from "@/lib/auth/mock";
import { getEvaluationById } from "@/lib/evaluation/evaluationService";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const userId = getMockUserId();
    const row = await getEvaluationById(userId, id);

    if (!row) {
      return NextResponse.json({ status: "error", message: "Evaluation not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", data: row });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load evaluation",
      },
      { status: 500 },
    );
  }
}
