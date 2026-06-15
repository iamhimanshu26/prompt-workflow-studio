import Link from "next/link";
import React from "react";
import GlowCard from "./GlowCard";

export default function ModulePreview({
  title,
  subtitle,
  features,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
  badge,
  footerNote,
}: {
  title: string;
  subtitle: string;
  features: string[];
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  badge: string;
  footerNote: string;
}) {
  return (
    <div className="space-y-6 pws-animate-in">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
          {badge}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--foreground)] lg:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">{subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <GlowCard key={f} className="p-4">
            <p className="text-sm text-[var(--foreground)]">{f}</p>
          </GlowCard>
        ))}
      </div>

      <GlowCard className="flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="text-sm text-[var(--muted)]">{footerNote}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            {primaryCta}
          </Link>
          <Link
            href={secondaryHref}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
          >
            {secondaryCta}
          </Link>
        </div>
      </GlowCard>
    </div>
  );
}
