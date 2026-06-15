import React from "react";
import { cn } from "@/lib/utils";

export default function GlowCard({
  children,
  className,
  glow = true,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md",
        glow && "pws-hover-glow",
        className,
      )}
    >
      {children}
    </div>
  );
}
