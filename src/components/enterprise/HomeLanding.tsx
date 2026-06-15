"use client";

import Link from "next/link";
import React from "react";
import GlowCard from "./GlowCard";
import StatusBadge from "./StatusBadge";
import { useLang } from "@/lib/i18n/LangProvider";
import { cn } from "@/lib/utils";

const CAPABILITY_ICONS = ["▶", "◎", "◆", "✦", "⬡", "⚡"];

const BUILD_STATUS_KEYS = [
  { key: "homeStatusDashboard", status: "active" as const },
  { key: "homeStatusPlayground", status: "active" as const },
  { key: "homeStatusOptimizer", status: "active" as const },
  { key: "homeStatusAnyIdea", status: "active" as const },
  { key: "homeStatusLibrary", status: "preview" as const },
  { key: "homeStatusWorkflows", status: "preview" as const },
  { key: "homeStatusEvaluation", status: "planned" as const },
  { key: "homeStatusMultiModel", status: "planned" as const },
];

const ROADMAP_PHASES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function statusBadgeFor(status: "active" | "preview" | "planned") {
  if (status === "active") return { labelKey: "statusActive", badge: "ok" as const };
  if (status === "preview") return { labelKey: "statusPreview", badge: "warn" as const };
  return { labelKey: "statusPlanned", badge: "neutral" as const };
}

export default function HomeLanding() {
  const { t } = useLang();

  const capabilities = [
    t("homeCapExecution"),
    t("homeCapOptimization"),
    t("homeCapLibrary"),
    t("homeCapEvaluation"),
    t("homeCapWorkflow"),
    t("homeCapDiagnostics"),
  ];

  return (
    <div className="space-y-10 pws-animate-in">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-6 lg:p-10">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
          style={{ background: "var(--glow-violet)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-12 left-1/4 h-40 w-40 rounded-full blur-3xl"
          style={{ background: "var(--glow-cyan)" }}
        />
        <div className="relative">
          <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
            {t("homeHeroEyebrow")}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight lg:text-4xl">{t("appTitle")}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
            {t("homeHeroSubtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/15 transition hover:brightness-110"
            >
              {t("homeCtaDashboard")}
            </Link>
            <Link
              href="/playground"
              className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-cyan-400/40"
            >
              {t("homeCtaPlayground")}
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          {t("homeCapabilitiesTitle")}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, i) => (
            <GlowCard key={cap} className="p-4">
              <span className="text-lg text-cyan-400/80" aria-hidden>
                {CAPABILITY_ICONS[i]}
              </span>
              <p className="mt-2 font-medium text-[var(--foreground)]">{cap}</p>
            </GlowCard>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          {t("homeBuildStatusTitle")}
        </h2>
        <GlowCard glow={false} className="mt-4 divide-y divide-[var(--border)] p-0">
          {BUILD_STATUS_KEYS.map((item) => {
            const meta = statusBadgeFor(item.status);
            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {t(item.key)}
                </span>
                <StatusBadge label={t(meta.labelKey)} status={meta.badge} />
              </div>
            );
          })}
        </GlowCard>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          {t("homeRoadmapTitle")}
        </h2>
        <GlowCard className="mt-4 p-5">
          <p className="text-sm text-[var(--muted)]">{t("homeRoadmapDesc")}</p>
          <ul className="mt-4 space-y-2">
            {ROADMAP_PHASES.map((n) => {
              const done = n <= 3;
              const preview = n === 7 || n === 8;
              return (
                <li key={n} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded font-[family-name:var(--font-mono)] text-[10px] font-bold",
                      done && "bg-cyan-500/20 text-cyan-300",
                      preview && !done && "bg-indigo-500/20 text-indigo-300",
                      !done && !preview && "bg-[var(--surface-muted)] text-[var(--muted)]",
                    )}
                  >
                    {n}
                  </span>
                  <span className={done ? "text-[var(--foreground)]" : "text-[var(--muted)]"}>
                    {t(`phase${n}Label`)}
                  </span>
                  {done && (
                    <span className="ml-auto font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wide text-cyan-400/80">
                      {t("statusActive")}
                    </span>
                  )}
                  {preview && (
                    <span className="ml-auto font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wide text-indigo-400/80">
                      {t("statusPreview")}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/health"
              className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
            >
              {t("checkApiHealth")}
            </Link>
            <Link
              href="/journey"
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
            >
              {t("navJourney")} →
            </Link>
          </div>
        </GlowCard>
      </section>
    </div>
  );
}
