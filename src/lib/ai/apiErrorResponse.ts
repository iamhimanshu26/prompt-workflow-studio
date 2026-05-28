import { NextResponse } from "next/server";
import { parseOpenAiError } from "./openaiErrors";

export function aiErrorResponse(e: unknown, fallback: string) {
  const raw = e instanceof Error ? e.message : fallback;
  const parsed = parseOpenAiError(raw);
  const status =
    parsed.kind === "quota" ? 402 : parsed.kind === "auth" ? 401 : parsed.kind === "rate_limit" ? 429 : 500;

  return NextResponse.json(
    {
      status: "error",
      message: parsed.userMessage,
      errorKind: parsed.kind,
    },
    { status },
  );
}
