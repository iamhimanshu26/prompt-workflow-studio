import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

export type PipelineStep = {
  key: string;
  title: string;
  description: string;
  href: string;
  status: "active" | "partial" | "planned";
  statusLabel: string;
};

export default function LifecyclePipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute left-4 right-4 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent lg:block"
        aria-hidden
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, i) => (
          <Link
            key={step.key}
            href={step.href}
            className={cn(
              "group relative rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 pws-hover-glow pws-animate-in",
            )}
            style={{ animationDelay: `${80 * i}ms` }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-cyan-400/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                  step.status === "active" && "bg-cyan-500/15 text-cyan-300",
                  step.status === "partial" && "bg-indigo-500/15 text-indigo-300",
                  step.status === "planned" && "bg-slate-500/20 text-slate-400",
                )}
              >
                {step.statusLabel}
              </span>
            </div>
            <p className="mt-2 font-semibold text-[var(--foreground)] group-hover:text-cyan-300">
              {step.title}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">{step.description}</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  step.status === "active" && "w-full bg-gradient-to-r from-cyan-400 to-indigo-400",
                  step.status === "partial" && "w-1/2 bg-indigo-400/70",
                  step.status === "planned" && "w-1/4 bg-slate-600",
                )}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
