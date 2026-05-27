"use client";

import type { ReactNode } from "react";
import { LangProvider } from "@/lib/i18n/LangProvider";
import AppShell from "@/components/AppShell";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <AppShell>{children}</AppShell>
    </LangProvider>
  );
}

