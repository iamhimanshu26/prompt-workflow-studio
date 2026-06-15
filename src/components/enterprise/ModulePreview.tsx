import Link from "next/link";
import React from "react";
import GlowCard from "./GlowCard";
import StatusBadge from "./StatusBadge";

export type PreviewFeature = {
  label: string;
  icon: string;
};

export default function ModulePreview({
  title,
  subtitle,
  features,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
  statusBadge,
  footerNote,
  pipeline,
}: {
  title: string;
  subtitle: string;
  features: PreviewFeature[];
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  statusBadge: string;
  footerNote?: string;
  pipeline?: string[];
}) {
  return (
    <div className="space-y-6 pws-animate-in">
      <div>
        <StatusBadge label={statusBadge} status="warn" />
        <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)] lg:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <GlowCard key={f.label} className="p-4">
            <span className="text-base text-cyan-400/80" aria-hidden>
              {f.icon}
            </span>
            <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{f.label}</p>
          </GlowCard>
        ))}
      </div>

      {pipeline && pipeline.length > 0 && (
        <GlowCard className="p-5">
          <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
            Workflow Pipeline Preview
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {pipeline.map((step, i) => (
              <React.Fragment key={step}>
                <span className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] text-cyan-200/90">
                  {step}
                </span>
                {i < pipeline.length - 1 && (
                  <span className="text-indigo-400/70" aria-hidden>
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </GlowCard>
      )}

      <GlowCard className="flex flex-wrap items-center justify-between gap-4 p-5">
        {footerNote && <p className="text-sm text-[var(--muted)]">{footerNote}</p>}
        <div className="flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            {primaryCta}
          </Link>
          <Link
            href={secondaryHref}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-cyan-400/35"
          >
            {secondaryCta}
          </Link>
        </div>
      </GlowCard>
    </div>
  );
}
