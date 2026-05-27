"use client";

import type { ReactNode } from "react";
import { LangProvider } from "@/lib/i18n/LangProvider";
import AppShell from "@/components/AppShell";
import { ToastProvider } from "@/components/Toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <ToastProvider>
        <AppShell>{children}</AppShell>
      </ToastProvider>
    </LangProvider>
  );
}

