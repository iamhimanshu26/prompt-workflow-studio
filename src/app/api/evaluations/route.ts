import { NextResponse } from "next/server";
import { getMockUserId } from "@/lib/auth/mock";
import { listEvaluations } from "@/lib/evaluation/evaluationService";

export async function GET() {
  try {
    const userId = getMockUserId();
    const data = await listEvaluations(userId, 30);
    return NextResponse.json({ status: "ok", data });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load evaluations",
      },
      { status: 500 },
    );
  }
}
