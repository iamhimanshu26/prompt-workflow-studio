export function apiErrorMessage(json: unknown, fallback: string): string {
  if (!json || typeof json !== "object") return fallback;
  const msg = (json as { message?: unknown }).message;
  if (typeof msg === "string") {
    if (msg.includes("does not exist")) {
      return "Database table missing — redeploy after build runs prisma db push, or run: npm run db:push";
    }
    return msg.length > 220 ? `${msg.slice(0, 220)}…` : msg;
  }
  return fallback;
}
