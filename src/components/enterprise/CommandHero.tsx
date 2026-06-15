"use client";

import Link from "next/link";
import React from "react";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

const NODES = [
  { label: "Input", x: "8%", y: "55%", delay: "0s" },
  { label: "Prompt", x: "32%", y: "30%", delay: "0.4s" },
  { label: "Model", x: "58%", y: "52%", delay: "0.8s" },
  { label: "Output", x: "82%", y: "28%", delay: "1.2s" },
];

export default function CommandHero({
  title,
  subtitle,
  dbStatus,
  aiProvider,
  ctaPrimary,
  ctaSecondary,
  ctaPrimaryHref,
  ctaSecondaryHref,
}: {
  title: string;
  subtitle: string;
  dbStatus: string;
  aiProvider: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
}) {
  const dbBadge =
    dbStatus === "ok" ? "ok" : dbStatus === "unconfigured" ? "warn" : "error";
  const aiBadge = aiProvider === "openai" ? "ok" : "warn";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--border-strong)] p-6 lg:p-8",
        "bg-[var(--surface)] pws-animate-in",
      )}
      style={{ animationDelay: "0ms" }}
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "var(--glow-violet)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full blur-3xl"
        style={{ background: "var(--glow-cyan)" }}
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p
            className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]"
          >
            PromptOps Command Center
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)] lg:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            {subtitle}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <StatusBadge label={`DB ${dbStatus}`} status={dbBadge} pulse />
            <StatusBadge label={`AI ${aiProvider}`} status={aiBadge} pulse />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={ctaPrimaryHref}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              {ctaPrimary}
            </Link>
            <Link
              href={ctaSecondaryHref}
              className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-cyan-400/50 hover:bg-[var(--surface-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              {ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="relative hidden h-44 min-h-[11rem] sm:block">
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="pipe" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path
              d="M 20 80 Q 120 20, 220 60 T 400 40"
              fill="none"
              stroke="url(#pipe)"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="opacity-70"
            />
          </svg>
          {NODES.map((node) => (
            <div
              key={node.label}
              className="pws-float-node absolute flex flex-col items-center"
              style={{ left: node.x, top: node.y, animationDelay: node.delay }}
            >
              <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              <span className="mt-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--muted)]">
                {node.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
