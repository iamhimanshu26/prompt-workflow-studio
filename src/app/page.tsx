import Link from "next/link";

const PHASES = [
  { n: 0, label: "Scaffold + DB + mock AI", status: "current" },
  { n: 1, label: "Dashboard + auth + navigation", status: "next" },
  { n: 2, label: "Prompt Playground", status: "planned" },
  { n: 3, label: "Prompt Optimizer", status: "planned" },
  { n: 4, label: "Versioning + compare", status: "planned" },
  { n: 5, label: "Evaluation", status: "planned" },
  { n: 6, label: "Multi-model comparison", status: "planned" },
  { n: 7, label: "Prompt library", status: "planned" },
  { n: 8, label: "Workflow builder", status: "planned" },
  { n: 9, label: "GitHub + Vercel deploy", status: "planned" },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
        Phase 0 — Foundation
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Prompt Workflow Studio</h1>
      <p className="mt-4 text-lg text-[var(--muted)]">
        AI prompt engineering platform: create, test, improve, compare, save, and evaluate
        prompts. UI and features arrive in Phases 1–8.
      </p>

      <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-sm font-semibold uppercase text-[var(--muted)]">Build roadmap</h2>
        <ul className="mt-4 space-y-2">
          {PHASES.map((p) => (
            <li key={p.n} className="flex items-center gap-3 text-sm">
              <span
                className={
                  p.status === "current"
                    ? "rounded bg-[var(--accent)] px-2 py-0.5 text-xs font-bold text-white"
                    : "rounded bg-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]"
                }
              >
                {p.n}
              </span>
              <span className={p.status === "current" ? "text-[var(--foreground)]" : "text-[var(--muted)]"}>
                {p.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/health"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Check API health →
        </Link>
        <a
          href="https://github.com"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]"
          rel="noreferrer"
        >
          README setup (local)
        </a>
      </div>

      <p className="mt-12 text-xs text-[var(--muted)]">
        Run: docker compose up -d → cp .env.example .env → npm install → npm run db:push → npm run
        db:seed → npm run dev
      </p>
    </main>
  );
}
