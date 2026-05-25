import Link from "next/link";

async function getHealth() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/health`, { cache: "no-store" });
    return { ok: res.ok, data: await res.json() };
  } catch (e) {
    return {
      ok: false,
      data: { status: "error", message: e instanceof Error ? e.message : "Fetch failed" },
    };
  }
}

export default async function HealthPage() {
  const { ok, data } = await getHealth();

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

      {data && typeof data === "object" && "database" in data && data.database === "error" && (
        <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
          <p className="font-medium text-[var(--foreground)]">Database not running (normal for Phase 0)</p>
          <p className="mt-2">Install Docker, then in Terminal:</p>
          <pre className="mt-2 text-xs text-[var(--foreground)]">
            {`cd ~/Projects/prompt-workflow-studio\ndocker compose up -d\nnpm run db:push\nnpm run db:seed`}
          </pre>
        </div>
      )}
    </main>
  );
}
