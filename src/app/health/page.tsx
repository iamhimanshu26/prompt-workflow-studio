import Link from "next/link";
import { getHealthStatus } from "@/lib/health";

export default async function HealthPage() {
  let ok = true;
  let data: Record<string, unknown>;

  try {
    data = await getHealthStatus();
  } catch (e) {
    ok = false;
    data = {
      status: "error",
      message: e instanceof Error ? e.message : "Health check failed",
    };
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="text-sm text-[var(--accent)] hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-2xl font-bold">API Health</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Raw JSON:{" "}
        <a href="/api/health" className="text-[var(--accent)] underline">
          /api/health
        </a>
      </p>

      <pre
        className={`mt-6 overflow-x-auto rounded-xl border p-4 text-sm ${
          ok ? "border-[var(--success)]/40 bg-[var(--card)]" : "border-red-500/40 bg-[var(--card)]"
        }`}
      >
        {JSON.stringify(data, null, 2)}
      </pre>

      {data.database === "error" && (
        <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
          <p className="font-medium text-[var(--foreground)]">Database connection failed</p>
          <p className="mt-2">
            On Vercel, set <code className="text-[var(--foreground)]">DATABASE_URL</code> to your
            Neon connection string, then redeploy.
          </p>
          {typeof data.dbMessage === "string" && (
            <p className="mt-2 text-xs text-red-300">{data.dbMessage}</p>
          )}
        </div>
      )}
    </main>
  );
}
