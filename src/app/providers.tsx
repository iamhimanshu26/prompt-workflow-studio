"use client";

import type { ReactNode } from "react";
import { LangProvider } from "@/lib/i18n/LangProvider";
import LangToggle from "@/components/LangToggle";
import AppShell from "@/components/AppShell";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <LangToggle />
      <AppShell>{children}</AppShell>
    </LangProvider>
  );
}

