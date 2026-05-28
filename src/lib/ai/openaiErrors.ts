export type OpenAiErrorKind = "quota" | "auth" | "rate_limit" | "unknown";

export function parseOpenAiError(message: string): {
  kind: OpenAiErrorKind;
  userMessage: string;
} {
  const lower = message.toLowerCase();

  if (lower.includes("429") || lower.includes("quota") || lower.includes("billing")) {
    return {
      kind: "quota",
      userMessage:
        "OpenAI is connected, but your account has no quota or billing. Add payment at platform.openai.com → Settings → Billing, then try again.",
    };
  }

  if (lower.includes("401") || lower.includes("invalid_api_key") || lower.includes("incorrect api key")) {
    return {
      kind: "auth",
      userMessage:
        "Invalid OpenAI API key. Check OPENAI_API_KEY in Vercel (Production) and redeploy.",
    };
  }

  if (lower.includes("rate limit")) {
    return {
      kind: "rate_limit",
      userMessage: "OpenAI rate limit hit. Wait a minute and try again.",
    };
  }

  return {
    kind: "unknown",
    userMessage: message.length > 280 ? `${message.slice(0, 280)}…` : message,
  };
}
